// const http = require("http");
// const MillionairesProblemFactory = artifacts.require(
//    "MillionairesProblemFactory.sol"
// );

// module.exports = function(deployer) {
// 	return (
// 		deployer
// 			.then(() => {
// 				return new Promise((resolve, reject) => {
// 					/*
// 					Obtain the Enigma contract address hosted at this port
// 					upon enigma-docker-network launch
// 					*/
// 					const request = http.get(
// 						"http://localhost:8081",
// 						response => {
// 							if (
// 								response.statusCode < 200 ||
// 								response.statusCode > 299
// 							) {
// 								reject(
// 									new Error(
// 										"Failed to load page, status code: " +
// 												response.statusCode
// 									)
// 								);
// 							}
// 							const body = [];
// 							response.on("data", chunk => body.push(chunk));
// 							response.on("end", () => resolve(body.join("")));
// 						}
// 					);
// 					request.on("error", err => reject(err));
// 				});
// 			})
// 			// Deploy MillionairesProblemFactory with the Enigma contract address
// 			.then(enigmaAddress => {
// 				console.log("Got Enigma Contract address: " + enigmaAddress);
// 				return deployer.deploy(
// 					MillionairesProblemFactory,
// 					enigmaAddress
// 				);
// 			})
// 			.catch(err => console.error(err))
// 	);
// };

// Enigma contract:0x780dA267326c411D0507aD02F35AEda3CC3738F2
// Enigma collectible: 0x730C37c5eF2FAc4137D5235ad6C2dF1C473a9629
// AuctionFactory: 0x72a10BAa638C9aC5Ef32222756aFaC0F5ff8F026
// Auction : 0x0564c7c26d47067f3f8d8a0bd0d1a33442528ccc
// ENSRegistry: 0x3F8d6269054aDa935325EC16C0182A9AC3aeF982
var EnigmaCollectible = artifacts.require("./EnigmaCollectible.sol");
var AuctionFactory = artifacts.require("./AuctionFactory.sol");


module.exports = function(deployer) {
   deployer.deploy(EnigmaCollectible, "ENG721", "E721").then(function() {
    return deployer.deploy(AuctionFactory, "0x780dA267326c411D0507aD02F35AEda3CC3738F2", EnigmaCollectible.address);;
  });
};
