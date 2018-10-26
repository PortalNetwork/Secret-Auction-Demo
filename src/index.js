
import EnigmaSetup from "./utils/getEnigmaSetup";
import auctionFactoryContractDefinition from "./contracts/AuctionFactory.json";
import auctionContractDefinition from "./contracts/Auction.json";
import getContractInstance from "./utils/getContractInstance";
import engUtils from "./lib/enigma-utils";

const GAS = "2000000";
const CALLABLE = "getHighestBidder(address[],uint[],uint[])";
const CALLBACK = "updateWinner(address,uint)";
const ENG_FEE = 1;

const getEncryptedValue = async(value) =>{
	let clientPrivKey =
					"853ee410aa4e7840ca8948b8a2f67e9a1c2f4988ff5f4ec7794edf57be421ae5";
	let enclavePubKey =
					"0061d93b5412c0c99c3c7867db13c4e13e51292bd52565d002ecf845bb0cfd8adfa5459173364ea8aff3fe24054cca88581f6c3c5e928097b9d4d47fce12ae47";
	let derivedKey = engUtils.getDerivedKey(enclavePubKey, clientPrivKey);
	let encrypted = engUtils.encryptMessage(derivedKey, value);
	return encrypted;
};

const secretAuctionDemo = async() => {
	try {
		// Initialize enigma configuration
		let enigmaSetup = new EnigmaSetup();
		await enigmaSetup.init();
		console.log("");
		console.log("======================================================");
		console.log("");
		console.log("Enigma Secret Auction");
		console.log("");
		console.log("This demo shows three user using Enigma Secret Auction");
		console.log("to start an auction and encrypt the bid value.");
		console.log("After the bid process finished, get the winner from ");
		console.log("the auction contract.");
		console.log("");
		console.log("======================================================");
		console.log("");

		console.log("==== 1. Setup enigma ====");
		const {web3, accounts} = enigmaSetup;
		// TODO: Replace with your auctionFatcory address here
		const auctionFactoryContractAddress = "0xe5AE972aE181ba926E6B8760ea9992F383654f34";
		const auctionFactory = await getContractInstance(
			web3,
			auctionFactoryContractDefinition,
			auctionFactoryContractAddress
		);
		console.log("==== 2. Create auction with expired time (86400) and starting price (500000) ====");
		// Create new auction with expired time(in seconds) and starting price(in wei)
		await auctionFactory.createAuction(864000, 500000, {
			from: accounts[0],
			gas: GAS
		});

		console.log("==== 3. Get auction factory address list ====");
		const addr = await auctionFactory.getAuctionAddresses({
				from: accounts[0],
				gas: GAS
		});

		console.log("==== 4. Get latest auction address ====");
		// Always use the latest auction address
		const auctionAddress = addr[addr.length -1];
		// Initialize contract instance to call contract later
		const auction = await getContractInstance(
				web3,
				auctionContractDefinition,
				auctionAddress
		);

		console.log("==== 5. Send " + web3.utils.toWei("8000000", "wei") + " from " + accounts[0] + " to stake pool ====");
		// Bidders must stake tokens first which is greater than or equal to starting price  
		await auction.stake({
				from: accounts[0],
				gas: GAS,
				value: web3.utils.toWei("8000000","wei")
		});

		console.log("==== 6. Send " + web3.utils.toWei("9000000", "wei") + " from " + accounts[1] + " to stake pool ====");
		await auction.stake({
				from: accounts[1],
				gas: GAS,
				value: web3.utils.toWei("9000000","wei")
		});

		console.log("==== 7. Send " + web3.utils.toWei("10000000", "wei") + " from " + accounts[2] + " to stake pool ====");
		await auction.stake({
				from: accounts[2],
				gas: GAS,
				value: web3.utils.toWei("10000000","wei")
		});

		// Bid value must be less than stake value
		let bidVal = await getEncryptedValue("1000000");
		await auction.bid(bidVal, {
				from: accounts[0],
				gas: GAS
		});
		console.log("==== 8. Ecrypt bidding value of 1000000 to " + bidVal + " from " + accounts[0] + " ====");

		bidVal = await getEncryptedValue("5000000");
		await auction.bid(bidVal,{
				from: accounts[1],
				gas: GAS
		});
		console.log("==== 9. Ecrypt bidding value of 5000000 to " + bidVal + " from " + accounts[1] + " ====");

		bidVal = await getEncryptedValue("9000000");
		await auction.bid(bidVal,{
				from: accounts[2],
				gas: GAS
		});
		console.log("==== 10. Ecrypt bidding value of 9000000 to " + bidVal + " from " + accounts[2] + " ====");

		// For preparing arguments of the highest bidder computing task
		const bidders = await auction.getBidders();
		console.log("==== 11. List bidders ====");
		console.log(bidders);
		let stakeAmounts = [];
		let bidValue = [];

		for(let i = 0; i < bidders.length; i++){
			let bidVal = await auction.getBidValueForBidder(bidders[i], {
				from: accounts[0],
				gas: GAS
			});
			let stakeAmount = await auction.getStakeOfBidder(bidders[i], {
				from: accounts[0],
				gas: GAS
			});
			bidValue.push(bidVal);
			stakeAmounts.push(await getEncryptedValue(stakeAmount.toNumber().toString()));
		}

		let blockNumber = await web3.eth.getBlockNumber();
		/*
		Take special note of the arguments passed in here (blockNumber, dappContractAddress,
		callable, callableArgs, callback, fee, preprocessors). This is the critical step for how
		you run the secure computation from your front-end!!!
		*/
	
		console.log("==== 11. Create task with parameter");
		/*console.log(blockNumber,
		auctionAddress,
		CALLABLE,
		[bidders, bidValue, stakeAmounts],
		CALLBACK,
		ENG_FEE, " ====");*/
		let task = await enigmaSetup.enigma.createTask(
			blockNumber,
			auctionAddress,
			CALLABLE,
			[bidders, bidValue, stakeAmounts],
			CALLBACK,
			ENG_FEE,
			[]
		);

		let resultFee = await task.approveFee({
			from: accounts[0],
			gas: GAS
		});

		console.log("==== 12. Compute by enigma ====");
		let result = await task.compute({
			from: accounts[0],
			gas: GAS
		});

		console.log("==== 13. After auction listen the winner ====");
		const callbackFinishedEvent = auction.Winner();
		callbackFinishedEvent.watch(async (err, res)=>{
			if(!err){
				console.log('result: ', res);
				//console.log('bidValue: ', web3.utils.fromWei(res.args.bidValue.toNumber().toString(), "ether"));
				console.log('==== 14. winner: ' + await auction.getWinner() + " ====");
				callbackFinishedEvent.stopWatching((err, res)=> {
					if(err){
						console.log(err);
					}
				});
			}else{
				console.log(err);
			}
		});
	} catch (err) {
		console.log(err);
	}
    
}

secretAuctionDemo();
