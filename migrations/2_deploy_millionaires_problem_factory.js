var EnigmaCollectible = artifacts.require("./EnigmaCollectible.sol");
var AuctionFactory = artifacts.require("./AuctionFactory.sol");

module.exports = function(deployer) {
  const enigmaAddr = "0x03F8163354A9DE09eA118372A8cFD20250ed7983";
  deployer.deploy(EnigmaCollectible, "ENG721", "E721").then(function() {
    return deployer.deploy(AuctionFactory, enigmaAddr, EnigmaCollectible.address);
  });
};
