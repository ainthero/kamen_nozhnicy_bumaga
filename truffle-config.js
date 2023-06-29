require("dotenv").config();
const HDWalletProvider = require("@truffle/hdwallet-provider");
const infuraKey = process.env.INFURA_API_KEY;
const mnemonic = process.env.MNEMONIC;

module.exports = {
  networks: {
    sepolia: {
      provider: () => new HDWalletProvider({
        mnemonic: {
          phrase: mnemonic
        },
        providerOrUrl: infuraKey,
        numberOfAddresses: 1,
        shareNonce: true,
      }),
      network_id: 11155111,
      gas: 4465030,
    },
  },

  compilers: {
    solc: {
      version: "0.8.6",
    },
  },
};
