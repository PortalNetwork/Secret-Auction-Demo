var EnigmaCollectible = artifacts.require("./EnigmaCollectible.sol");
var AuctionFactory = artifacts.require("./AuctionFactory.sol");

module.exports = function(deployer) {
  const enigmaAddr = "0x780dA267326c411D0507aD02F35AEda3CC3738F2";
  deployer.deploy(EnigmaCollectible, "ENG721", "E721").then(function() {
    return deployer.deploy(AuctionFactory, enigmaAddr, EnigmaCollectible.address);
  });
};
