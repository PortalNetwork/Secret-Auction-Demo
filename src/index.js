
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
	let res;
	let enigmaSetup = new EnigmaSetup();
	await enigmaSetup.init();

	const {web3, accounts} = enigmaSetup;
	// Replace with your auctionFatcory address here
	const auctionFactortContractAddress = "0x9BA12813B7Cc2E645193e9BD19Cfeb7d7277b8F0";
	const auctionFactory = await getContractInstance(
		web3,
		auctionFactoryContractDefinition,
		auctionFactortContractAddress
	);

	// Create new auction with expired time(in seconds) and starting price(in wei)
	await auctionFactory.createAuction(864000, 500000,{
		from: accounts[0],
		gas: GAS
	});
	const addr = await auctionFactory.getAuctionAddresses({
			from: accounts[0],
			gas: GAS
	});
	// Always use the latest auction address
	const auctionAddress = addr[addr.length -1];
	const auction = await getContractInstance(
			web3,
			auctionContractDefinition,
			auctionAddress
	);

	// Bidders must stake tokens first which is greater than or equal to starting price  
	res = await auction.stake({
			from: accounts[0],
			gas: GAS,
			value: web3.utils.toWei("8000000","wei")
	});
	res = await auction.stake({
			from: accounts[1],
			gas: GAS,
			value: web3.utils.toWei("9000000","wei")
	});

	// Bid value must be less than stake value
	let bidVal = await getEncryptedValue("1000000");
	await auction.bid(bidVal, {
			from: accounts[0],
			gas: GAS
	});
	bidVal = await getEncryptedValue("2000000");
	await auction.bid(bidVal,{
			from: accounts[1],
			gas: GAS
	});

	// For preparing arguments of the highest bidder computing task
	const bidders = await auction.getBidders();
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

	let blockNumber = await enigmaSetup.web3.eth.getBlockNumber();
	/*
	Take special note of the arguments passed in here (blockNumber, dappContractAddress,
	callable, callableArgs, callback, fee, preprocessors). This is the critical step for how
	you run the secure computation from your front-end!!!
	*/
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
		from: enigmaSetup.accounts[0],
		gas: GAS
	});
	let result = await task.compute({
		from: enigmaSetup.accounts[0],
		gas: GAS
	});

	const callbackFinishedEvent = auction.Winner();
	callbackFinishedEvent.watch(async (err, res)=>{
		if(!err){
			console.log(res);
			console.log(await auction.getWinner());
			callbackFinishedEvent.stopWatching((err, res)=> {
				if(err){
					console.log(err);
				}
			});
		}else{
			console.log(err);
		}
	});
    
}

secretAuctionDemo();
