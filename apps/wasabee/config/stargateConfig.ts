const stargateSupportedChain = [
  {
    chainKey: 'bera',
    chainType: 'evm',
    chainId: 80094,
    shortName: 'Bera',
    name: 'Bera',
    nativeCurrency: {
      chainKey: 'bera',
      name: 'BERA',
      symbol: 'BERA',
      decimals: 18,
      address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    },
    tokens: [
      {
        address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
        symbol: 'BERA',
        decimals: 18,
      },
      {
        address: '0x549943e04f40284185054145c6E4e9568C1D3241',
        symbol: 'USDC',
        decimals: 6,
      },
      {
        address: '0x2F6F07CDcf3588944Bf4C42aC74ff24bF56e7590',
        symbol: 'WETH',
        decimals: 18,
      },
    ],
  },
  {
    chainKey: 'ethereum',
    chainType: 'evm',
    chainId: 1,
    shortName: 'Ethereum',
    name: 'Ethereum',
    nativeCurrency: {
      chainKey: 'ethereum',
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18,
      address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    },
    tokens: [
      {
        address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
        symbol: 'ETH',
        decimals: 18,
      },
      {
        address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
        symbol: 'USDC',
        decimals: 6,
      },
    ],
  },
  {
    chainKey: 'arbitrum',
    chainType: 'evm',
    chainId: 42161,
    shortName: 'Arbitrum',
    name: 'Arbitrum',
    nativeCurrency: {
      chainKey: 'arbitrum',
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18,
      address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    },
    tokens: [
      {
        address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
        symbol: 'ETH',
        decimals: 18,
      },
      {
        address: '0xaf88d065e77c8cc2239327c5edb3a432268e5831',
        symbol: 'USDC',
        decimals: 6,
      },
    ],
  },
  {
    chainKey: 'base',
    chainType: 'evm',
    chainId: 8453,
    shortName: 'Base',
    name: 'Base',
    nativeCurrency: {
      chainKey: 'base',
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
      address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    },
    tokens: [
      {
        address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
        symbol: 'ETH',
        decimals: 18,
      },
      {
        address: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
        symbol: 'USDC',
        decimals: 6,
      },
    ],
  },
];

const stargateSupportedToken = ['USDC', 'WETH'];

export { stargateSupportedChain, stargateSupportedToken };
