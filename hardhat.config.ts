import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
const INFURA_API_KEY = "c4c5cc0e44b745e08e2056827b31ec05" ;
const PRIVATE_KEY = "c04a2b08b8bafb4a72f1e006d3ddb38593de0c6a035129fc5c305fe64da754fe";
const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 100,
      },
      viaIR: true,
    },
  },
  networks:{
    sepolia:{
      url: `https://sepolia.infura.io/v3/${INFURA_API_KEY}`,
      accounts:[PRIVATE_KEY],
    },
    bitrock_testnet: {
      url: "https://testnet.bit-rock.io/",
      chainId: 7771,
      accounts: [PRIVATE_KEY]
    },
    bitrock_mainnet: {
      url: "https://connect.bit-rock.io/",
      chainId: 7171,
      accounts: [PRIVATE_KEY!]
    }
    
  },
  etherscan: {
    apiKey: {
      sepolia: 'ED2NED96C214Y891MR98PZZ1Q45VTFYZRV',
      bitrock_testnet: 'ED2NED96C214Y891MR98PZZ1Q45VTFYZRV'
    },
  },
  gasReporter: {enabled: true},
  sourcify: {
    enabled: true
  }
};

export default config;

0xcB1F0d399A62754F927C077fBC8B6E05Ae7bbf48