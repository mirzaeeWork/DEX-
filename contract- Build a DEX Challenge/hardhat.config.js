require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  networks: {
    mumbai:{
      url: process.env.Mumbai_Rpc,
      accounts:[process.env.private_key_Acount]
    }
  },
  etherscan:{
    apiKey:process.env.Api_Key_Mumbai
  }
};

