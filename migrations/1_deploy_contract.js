const My_Contract = artifacts.require("KNBContract");

module.exports = function(deployer) {
  deployer.deploy(My_Contract);
};