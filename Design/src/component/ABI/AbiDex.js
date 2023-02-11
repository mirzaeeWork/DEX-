export const AbiDEX = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "token_addr",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "swapper",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "txDetails",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "ethInput",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "tokenOutput",
        "type": "uint256"
      }
    ],
    "name": "EthToTokenSwap",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "liquidityProvider",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "tokensInput",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "ethInput",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "liquidityMinted",
        "type": "uint256"
      }
    ],
    "name": "LiquidityProvided",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "liquidityRemover",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "tokensOutput",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "ethOutput",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "liquidityWithdrawn",
        "type": "uint256"
      }
    ],
    "name": "LiquidityRemoved",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "swapper",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "txDetails",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "tokensInput",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "ethOutput",
        "type": "uint256"
      }
    ],
    "name": "TokenToEthSwap",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "deposit",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "tokensDeposited",
        "type": "uint256"
      }
    ],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "ethToToken",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "tokenOutput",
        "type": "uint256"
      }
    ],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getBalanceSmartContract",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getContractaddress",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "lp",
        "type": "address"
      }
    ],
    "name": "getLiquidity",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokens",
        "type": "uint256"
      }
    ],
    "name": "init",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "liquidity",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "xInput",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "xReserves",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "yReserves",
        "type": "uint256"
      }
    ],
    "name": "price",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "yOutput",
        "type": "uint256"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "takeOnMsgValueForDeposit",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenInput",
        "type": "uint256"
      }
    ],
    "name": "tokenToEth",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "ethOutput",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalLiquidity",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "withdraw",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "eth_amount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "token_amount",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]