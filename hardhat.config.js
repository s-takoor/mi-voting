require("@nomicfoundation/hardhat-toolbox");
const dotenv = require('dotenv');
dotenv.config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",
  networks: {
    hardhat: {
      chainId: 1337,
    },
    localhost: {
      url: process.env.LOCALHOST_URL,
    },
  },
  ipfs: {
    url: process.env.IPFS_NODE_URL,
  },
};
