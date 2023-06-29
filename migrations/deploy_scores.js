const My_Contract = artifacts.require("ScoresContract");

module.exports = function(deployer) {
  deployer.deploy(My_Contract);
};