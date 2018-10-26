var EnigmaCollectible = artifacts.require("./EnigmaCollectible.sol");
var AuctionFactory = artifacts.require("./AuctionFactory.sol");

module.exports = function(deployer) {
  // TODO: Update the enigma address
  const enigmaAddr = "0x767d422364eC67f71C148C47DE96F09ffDd6f367";
  deployer.deploy(EnigmaCollectible, "ENG721", "E721").then(function() {
    return deployer.deploy(AuctionFactory, enigmaAddr, EnigmaCollectible.address);
  });
};
