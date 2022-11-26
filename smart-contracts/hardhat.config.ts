import * as dotenv from "dotenv";

import { HardhatUserConfig, task } from "hardhat/config";
import "hardhat-contract-sizer";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "@openzeppelin/hardhat-upgrades";
import "hardhat-gas-reporter";
import "solidity-coverage";

dotenv.config();

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: HardhatUserConfig = {
  mocha: {
    timeout: 500000,
  },
  solidity: {
    compilers: [
      {
        version: "0.8.0",
        settings: {
          evmVersion: "istanbul",
          optimizer: { enabled: true, runs: 200 },
          outputSelection: {
            "*": {
              "*": ["storageLayout"],
            },
          },
        },
      },
      {
        version: "0.8.2",
        settings: {
          evmVersion: "istanbul",
          optimizer: { enabled: true, runs: 200 },
          outputSelection: {
            "*": {
              "*": ["storageLayout"],
            },
          },
        },
      },
    ],
  },
  networks: {
    hardhat: {
      allowUnlimitedContractSize: false,
      gas: 6000000,
      // forking: {
      //   url: `https://mainnet.infura.io/v3/${process.env.INFURA_KEY}`,
      // },
    },
    polygonMumbai: {
      url: process.env.MUMBAI_URL || "",
      accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : undefined,
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  etherscan: {
    apiKey: {
      goerli: process.env.ETHERSCAN_API_KEY || "",
      polygonMumbai: process.env.POLYGONSCAN_API_KEY || "",
      avalancheFujiTestnet: process.env.SNOWTRACE_API_KEY || "",
      mainnet: process.env.ETHERSCAN_API_KEY || "",
      polygon: process.env.POLYGONSCAN_API_KEY || "",
      avalanche: process.env.SNOWTRACE_API_KEY || "",
      bsc: process.env.BSCSCAN_API_KEY || "",
      bscTestnet: process.env.BSCSCAN_API_KEY || "",
      optimisticEthereum: process.env.OPTIMISM_ETHERSCAN_API_KEY || "",
      optimisticKovan: process.env.OPTIMISM_KOVAN_ETHERSCAN_API_KEY || "",
      arbitrumOne: process.env.ARBITRUM_ETHERSCAN_API_KEY || "",
      arbitrumTestnet: process.env.ARBITRUM_RINKEBY_ETHERSCAN_API_KEY || "",
      opera: process.env.FTMSCAN_API_KEY || "",
      ftmTestnet: process.env.FTMSCAN_API_KEY || "",
    },
  },
  contractSizer: {
    alphaSort: true,
    disambiguatePaths: false,
    runOnCompile: !!process.env.REPORT_SIZE,
  },
};

export default config;