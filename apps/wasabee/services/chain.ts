import { Token } from './contract/token';
import { Chain } from 'viem/chains';
import {
  berachainMainnet,
  berachainBartioTestnet,
  movementTestnet,
  polygonMumbaiChain,
  sprotoTestnet,
  arbitrumMainnet,
  baseMainnet,
  ethMainnet,
  berachainBepoliaTestnet,
  //sepolia,
} from '@/lib/chain';
import { Address, zeroAddress } from 'viem';

export class Network {
  supportDEX: boolean = false;
  supportVault: boolean = false;
  supportBridge: boolean = false;
  get chainId() {
    return this.chain.id;
  }
  platformTokenAddress!: {
    HPOT: string;
  };
  contracts!: {
    //algebra
    algebraPoolInitCodeHash: string;
    algebraFactory: Address;
    algebraPoolDeployer: Address;
    algebraPositionManager: Address;
    algebraNonfungiblePositionDescriptor: Address;
    algebraEntryPoint: Address;
    algebraTickLens: Address;
    algebraQuoter: Address;
    algebraQuoterV2: Address;
    algebraSwapRouter: Address;
    algebraEternalFarming: Address;
    algebraCommunityVault: Address;
    algebraFarmingCenter: Address;
    algebraVaultFactoryStub: Address;
    algebraPluginFactory: Address;
    algebraProxy: Address;
    algebraInterfaceMulticall: Address;
    //launchpad
    ftoFactory: Address;
    ftoFacade: Address;
    memeFactory: Address;
    memeFacade: Address;
    ftoTokens: Partial<Token>[];
    //aquabera vault
    vaultFactory: Address;
    vaultVolatilityCheck: Address;
  };
  nativeToken!: Token;
  raisedTokenData!: {
    symbol: string;
    address: string;
    amount: bigint;
  }[];
  faucetTokens: Token[] = [];
  nativeFaucet?: {
    address: string;
    name: string;
    requirements: string;
  };
  chain!: Chain;
  officialFaucets?: {
    url: string;
    name: string;
    logoURI?: string;
  }[];
  blacklist?: {
    poolBlacklist?: string[];
    memeBlacklist?: string[];
  };
  validatedTokens: Token[] = [];
  validatedTokensInfo: Record<string, Token> = {};
  validatedFtoAddresses: string[] = [];
  validatedMemeAddresses: string[] = [];

  constructor(
    args: Omit<
      Partial<Network>,
      'faucetTokens' | 'nativeToken' | 'validatedTokensInfo'
    > & {
      faucetTokens: Partial<Token>[];
      nativeToken: Partial<Token>;
      validatedTokensInfo: Record<string, Partial<Token>>;
    }
  ) {
    Object.assign(this, args);
    if (args) {
    }
  }

  init() {
    this.nativeToken = Token.getToken(this.nativeToken ?? zeroAddress);
    this.nativeToken.init().then(() => {
      console.log('this.nativeToken', this.nativeToken.name);
    });
    this.faucetTokens = this.faucetTokens?.map((t) => {
      const token = Token.getToken(t);
      token.init();
      return token;
    });
    Object.entries(this.validatedTokensInfo).forEach(([address, t]) => {
      const token = Token.getToken({
        ...t,
        address,
      });
      token.init();
      this.validatedTokensInfo[address] = token;
      this.validatedTokens.push(token);
    });
  }
}

export const berachainBepoliaNetwork = new Network({
  chain: berachainBepoliaTestnet,
  nativeToken: {
    address: '0x6969696969696969696969696969696969696969',
    name: 'Bera',
    symbol: 'BERA',
    decimals: 18,
    isNative: true,
    logoURI: '/images/icons/tokens/wbera-token-icon.png',
  },
  raisedTokenData: [
    {
      symbol: 'WBERA',
      address: '0x6969696969696969696969696969696969696969',
      amount: BigInt('4000000000000000000'),
    },
    {
      symbol: 'Honey',
      address: '0xFCBD14DC51f0A4d49d5E53C2E0950e0bC26d0Dce',
      amount: BigInt('30000000000000000000'),
    },
  ],
  platformTokenAddress: {
    HPOT: zeroAddress.toLowerCase(),
  },
  faucetTokens: [],
  contracts: {
    //algebra
    algebraPoolInitCodeHash: zeroAddress,
    algebraFactory: zeroAddress,
    algebraPoolDeployer: zeroAddress,
    algebraPositionManager: zeroAddress,
    algebraNonfungiblePositionDescriptor: zeroAddress,
    algebraEntryPoint: zeroAddress,
    algebraTickLens: zeroAddress,
    algebraQuoter: zeroAddress,
    algebraQuoterV2: zeroAddress,
    algebraSwapRouter: zeroAddress,
    algebraEternalFarming: zeroAddress,
    algebraFarmingCenter: zeroAddress,
    algebraCommunityVault: zeroAddress,
    algebraVaultFactoryStub: zeroAddress,
    algebraPluginFactory: zeroAddress,
    algebraProxy: zeroAddress,
    algebraInterfaceMulticall: zeroAddress,
    //launchpad
    ftoFactory: zeroAddress,
    ftoFacade: zeroAddress,
    memeFactory: zeroAddress,
    memeFacade: zeroAddress,
    ftoTokens: [],
    //aquabera vault
    vaultFactory: zeroAddress,
    vaultVolatilityCheck: zeroAddress,
  },
  blacklist: {
    poolBlacklist: ['0xfF95cdfC724Ca85b8d96D5a6Ea86333AC6a4799D'.toLowerCase()],
    memeBlacklist: [],
  },
  validatedTokensInfo: {
    //when adding a new token, make sure to add the address as lowercase
    '0x0000000000000000000000000000000000000000': {
      name: 'Bera',
      symbol: 'BERA',
      decimals: 18,
      logoURI: '/images/icons/tokens/wbera-token-icon.png',
      isRouterToken: true,
      isPopular: true,
    },
  },
});

export const berachainNetwork = new Network({
  supportDEX: true,
  supportVault: true,
  supportBridge: true,
  chain: berachainMainnet,
  officialFaucets: [
    {
      url: 'https://bartio.faucet.berachain.com',
      name: 'Official Faucet',
      logoURI:
        'https://res.cloudinary.com/duv0g402y/raw/upload/src/assets/bera.png',
    },
  ],
  nativeToken: {
    address: '0x6969696969696969696969696969696969696969',
    name: 'Bera',
    symbol: 'BERA',
    decimals: 18,
    isNative: true,
    logoURI: '/images/icons/tokens/wbera-token-icon.png',
    isPopular: true,
  },
  raisedTokenData: [
    {
      symbol: 'HPOT',
      address: '0x9b37d542114070518a44e200fdcd8e4be737297f'.toLowerCase(),
      amount: BigInt('2000000000000000000000000'),
    },
    {
      symbol: 'WBERA',
      address: '0x6969696969696969696969696969696969696969'.toLowerCase(),
      amount: BigInt('4000000000000000000'),
    },
    {
      symbol: 'HONEY',
      address: '0xFCBD14DC51f0A4d49d5E53C2E0950e0bC26d0Dce'.toLowerCase(),
      amount: BigInt('30000000000000000000'),
    },
  ],
  platformTokenAddress: {
    HPOT: '0x9b37d542114070518a44e200fdcd8e4be737297f'.toLowerCase(),
  },
  contracts: {
    //algebra
    algebraPoolInitCodeHash:
      '0xb3fc09be5eb433d99b1ec89fd8435aaf5ffea75c1879e19028aa2414a14b3c85',
    algebraFactory: '0x7d53327D78EFD0b463bd8d7dc938C52402323b95',
    algebraPoolDeployer: '0x598f320907c2FFDBC715D591ffEcC3082bA14660',
    algebraPositionManager: '0xBB203aADbE36C125028a54584f5d48C1764317D0',
    algebraNonfungiblePositionDescriptor:
      '0x49719f4e6305a38685ab97bf79D4243467ea1A5d',
    algebraEntryPoint: '0xA1a607797893e290281e997484E8A93F3Ea8CE0B',
    algebraTickLens: '0x6fB8eCB54B9b3e3e1668d12d3287439E37BBfD38',
    algebraQuoter: '0x5Cb13b83814f2c7896fb65D61019Ca01eD852A73',
    algebraQuoterV2: '0xd83aeD10ef6c7C0bcf6693E4Ce7cAA134B52bCd2',
    algebraSwapRouter: '0xFff605964840a5511f595EB970011EcBffa46b39',
    algebraEternalFarming: '0x8554797BaE76Afe81dD5375111A2f3b0414D3B02',
    algebraFarmingCenter: '0xD8399d82eb577F223f55e81EfB96942Ce560f51f',
    algebraCommunityVault: '0x59F26B7332f8b45bDf2D17544fEE03b32c6806fD',
    algebraVaultFactoryStub: '0xde615767c422428ABB2BfFb737E3591f1C24Ce01',
    algebraPluginFactory: '0x2158B835620683e2c02a0cb915d0B818b8FBE34b',
    algebraProxy: '0xa93C35A721Ec12d7a4e5701D630340c947c9104F',
    algebraInterfaceMulticall: '0xbBCcF56F3D3F5B81E37861e25F73205c2598fcB5',

    //launchpad
    ftoFactory: '0x7E0CCe2C9Ff537f8301dd40c652A03479B18dAef',
    ftoFacade: '0x0264D933F13eE993270591668CfF87b8D35Dd3b4',
    memeFactory: '0xC38eF79A6cA9b3EfBe20F3dD3b99B3e25d09F52B',
    memeFacade: '0x80051Ca8C6E2e04E12de5d5Cb1313C086C867737',
    ftoTokens: [],

    //aquabera vault
    vaultFactory: '0x1bf5e51eCacdfEA65ae9276fd228bB8719ffcA7E',
    vaultVolatilityCheck: '0x97BF8CB6Be6757ab46D44853eAbEFD0D4C153037',
  },
  faucetTokens: [],
  validatedTokensInfo: {
    //when adding a new token, make sure to add the address as lowercase
    // "0x0000000000000000000000000000000000000000": {
    //   name: "Bera",
    //   symbol: "BERA",
    //   decimals: 18,
    //   logoURI: "/images/icons/tokens/wbera-token-icon.png",
    //   isRouterToken: true,
    //   isPopular: true,
    // },
    '0x6969696969696969696969696969696969696969': {
      name: 'Wrapped Bera',
      symbol: 'WBERA',
      decimals: 18,
      logoURI: '/images/icons/tokens/wbera-token-icon.png',
      isRouterToken: true,
    },
    '0xfcbd14dc51f0a4d49d5e53c2e0950e0bc26d0dce': {
      name: 'Honey',
      symbol: 'HONEY',
      decimals: 18,
      logoURI: '/images/icons/tokens/honey-token-icon.png',
      isRouterToken: true,
      isPopular: true,
    },
    '0x9b37d542114070518a44e200fdcd8e4be737297f': {
      name: 'Honeypot Finance',
      symbol: 'HPOT',
      decimals: 18,
      logoURI: '/images/icons/tokens/thpot-token-icon.jpg',
      isRouterToken: true,
    },
    '0x549943e04f40284185054145c6e4e9568c1d3241': {
      name: 'USDC',
      symbol: 'USDC',
      decimals: 6,
      logoURI: '/images/icons/tokens/usdc-token-icon.png',
      isRouterToken: true,
    },
    '0x0555e30da8f98308edb960aa94c0db47230d2b9c': {
      name: 'WBTC',
      symbol: 'WBTC',
      decimals: 18,
      logoURI: '/images/icons/tokens/wbtc-token-icon.png',
      isRouterToken: true,
    },
    '0x2f6f07cdcf3588944bf4c42ac74ff24bf56e7590': {
      name: 'WETH',
      symbol: 'WETH',
      decimals: 18,
      logoURI: '/images/icons/tokens/weth-token-icon.png',
      isRouterToken: true,
    },
    '0x5c43a5fef2b056934478373a53d1cb08030fd382': {
      name: 'Berally Token',
      symbol: 'BRLY',
      decimals: 18,
      logoURI: '/images/icons/tokens/berally.png',
    },
    '0x1ce0a25d13ce4d52071ae7e02cf1f6606f4c79d3': {
      name: 'NECT',
      symbol: 'NECT',
      decimals: 18,
      logoURI: '/images/icons/tokens/nect-token.jpg',
      isPopular: true,
    },
    '0x467aa1bfa3dcc714f7c16b3d779200431f6a833b': {
      name: '3BC',
      symbol: '3BC',
      decimals: 18,
      logoURI: '/images/icons/tokens/3bc.png',
    },
    '0xd77552d3849ab4d8c3b189a9582d0ba4c1f4f912': {
      name: 'wgBERA',
      symbol: 'wgBERA',
      decimals: 18,
      logoURI: '/images/icons/tokens/wgbera.png',
      isPopular: true,
    },
    '0x779ded0c9e1022225f8e0630b35a9b54be713736': {
      name: 'USD₮0',
      symbol: 'USD₮0',
      decimals: 6,
      logoURI: '/images/icons/tokens/usdt-token-icon.png',
    },
    '0xbc665a196220043b738de189aef05250e2acc700': {
      name: 'Boyz',
      symbol: 'Boyz',
      decimals: 18,
      logoURI: '/images/icons/tokens/boyz-token-icon.png',
    },
    '0x9b6761bf2397bb5a6624a856cc84a3a14dcd3fe5': {
      name: 'iBERA',
      symbol: 'iBERA',
      decimals: 18,
      logoURI: 'https://infrared.finance/_next/static/media/ibera.a6d10126.svg',
    },
    '0x08a38caa631de329ff2dad1656ce789f31af3142': {
      name: 'YEET',
      symbol: 'YEET',
      decimals: 18,
      logoURI: '/images/icons/tokens/yeet-token-icon.jpg',
    },
    '0x1f7210257fa157227d09449229a9266b0d581337': {
      name: 'Beramonium Coin',
      symbol: 'BERAMO',
      decimals: 18,
      logoURI: '/images/icons/tokens/beramonium.png',
    },
    '0x331865bf2ea19e94bbf438cf4ee590cb6392e5a9': {
      name: 'Moola',
      symbol: 'MOOLA',
      decimals: 18,
      logoURI: '/images/icons/tokens/moola.jpeg',
    },
    '0xa452810a4215fccc834ed241e6667f519b9856ec': {
      name: 'Berabot',
      symbol: 'BBOT',
      decimals: 18,
      logoURI: '/images/icons/tokens/berabot.png',
    },
    '0xac03caba51e17c86c921e1f6cbfbdc91f8bb2e6b': {
      name: 'Infrared BGT',
      symbol: 'iBGT',
      decimals: 18,
      logoURI: '/images/icons/tokens/ibgt-token-icon.png',
    },
    '0xb2f776e9c1c926c4b2e54182fac058da9af0b6a5': {
      name: 'henlo',
      symbol: 'HENLO',
      decimals: 18,
      logoURI: '/images/icons/tokens/henlo.png',
      isPopular: true,
    },
    '0xbaadcc2962417c01af99fb2b7c75706b9bd6babe': {
      name: 'Liquid BGT',
      symbol: 'LBGT',
      decimals: 18,
      logoURI: 'https://www.berapaw.com/static/images/tokens/lbgt.svg',
    },
  },
  validatedFtoAddresses: [],
  validatedMemeAddresses: [],
});

export const movementNetWork = new Network({
  supportDEX: false,
  supportVault: false,
  supportBridge: false,
  chain: movementTestnet,
  officialFaucets: [],
  nativeToken: {},
  contracts: {
    //algebra
    algebraPoolInitCodeHash: zeroAddress,
    algebraFactory: zeroAddress,
    algebraPoolDeployer: zeroAddress,
    algebraPositionManager: zeroAddress,
    algebraNonfungiblePositionDescriptor: zeroAddress,
    algebraEntryPoint: zeroAddress,
    algebraTickLens: zeroAddress,
    algebraQuoter: zeroAddress,
    algebraQuoterV2: zeroAddress,
    algebraSwapRouter: zeroAddress,
    algebraEternalFarming: zeroAddress,
    algebraFarmingCenter: zeroAddress,
    algebraCommunityVault: zeroAddress,
    algebraVaultFactoryStub: zeroAddress,
    algebraPluginFactory: zeroAddress,
    algebraProxy: zeroAddress,
    algebraInterfaceMulticall: zeroAddress,
    //launchpad
    ftoFactory: zeroAddress,
    ftoFacade: zeroAddress,
    memeFactory: zeroAddress,
    memeFacade: zeroAddress,
    ftoTokens: [],
    //aquabera vault
    vaultFactory: zeroAddress,
    vaultVolatilityCheck: zeroAddress,
  },
  faucetTokens: [],
  blacklist: {},
  validatedTokensInfo: {},
  validatedFtoAddresses: [],
  validatedMemeAddresses: [],
});

export const arbitrumOneNetwork = new Network({
  supportDEX: false,
  supportVault: false,
  supportBridge: true,
  chain: arbitrumMainnet,
  officialFaucets: [],
  nativeToken: { address: zeroAddress },
  contracts: {
    //algebra
    algebraPoolInitCodeHash: zeroAddress,
    algebraFactory: zeroAddress,
    algebraPoolDeployer: zeroAddress,
    algebraPositionManager: zeroAddress,
    algebraNonfungiblePositionDescriptor: zeroAddress,
    algebraEntryPoint: zeroAddress,
    algebraTickLens: zeroAddress,
    algebraQuoter: zeroAddress,
    algebraQuoterV2: zeroAddress,
    algebraSwapRouter: zeroAddress,
    algebraEternalFarming: zeroAddress,
    algebraFarmingCenter: zeroAddress,
    algebraCommunityVault: zeroAddress,
    algebraVaultFactoryStub: zeroAddress,
    algebraPluginFactory: zeroAddress,
    algebraProxy: zeroAddress,
    algebraInterfaceMulticall: zeroAddress,
    //launchpad
    ftoFactory: zeroAddress,
    ftoFacade: zeroAddress,
    memeFactory: zeroAddress,
    memeFacade: zeroAddress,
    ftoTokens: [],
    //aquabera vault
    vaultFactory: zeroAddress,
    vaultVolatilityCheck: zeroAddress,
  },
  faucetTokens: [],
  blacklist: {},
  validatedTokensInfo: {},
  validatedFtoAddresses: [],
  validatedMemeAddresses: [],
});

export const baseNetwork = new Network({
  supportDEX: false,
  supportVault: false,
  supportBridge: true,
  chain: baseMainnet,
  officialFaucets: [],
  nativeToken: { address: zeroAddress },
  contracts: {
    //algebra
    algebraPoolInitCodeHash: zeroAddress,
    algebraFactory: zeroAddress,
    algebraPoolDeployer: zeroAddress,
    algebraPositionManager: zeroAddress,
    algebraNonfungiblePositionDescriptor: zeroAddress,
    algebraEntryPoint: zeroAddress,
    algebraTickLens: zeroAddress,
    algebraQuoter: zeroAddress,
    algebraQuoterV2: zeroAddress,
    algebraSwapRouter: zeroAddress,
    algebraEternalFarming: zeroAddress,
    algebraFarmingCenter: zeroAddress,
    algebraCommunityVault: zeroAddress,
    algebraVaultFactoryStub: zeroAddress,
    algebraPluginFactory: zeroAddress,
    algebraProxy: zeroAddress,
    algebraInterfaceMulticall: zeroAddress,
    //launchpad
    ftoFactory: zeroAddress,
    ftoFacade: zeroAddress,
    memeFactory: zeroAddress,
    memeFacade: zeroAddress,
    ftoTokens: [],
    //aquabera vault
    vaultFactory: zeroAddress,
    vaultVolatilityCheck: zeroAddress,
  },
  faucetTokens: [],
  blacklist: {},
  validatedTokensInfo: {},
  validatedFtoAddresses: [],
  validatedMemeAddresses: [],
});
export const ethNetwork = new Network({
  supportDEX: false,
  supportVault: false,
  supportBridge: true,
  chain: ethMainnet,
  officialFaucets: [],
  nativeToken: { address: zeroAddress },
  contracts: {
    //algebra
    algebraPoolInitCodeHash: zeroAddress,
    algebraFactory: zeroAddress,
    algebraPoolDeployer: zeroAddress,
    algebraPositionManager: zeroAddress,
    algebraNonfungiblePositionDescriptor: zeroAddress,
    algebraEntryPoint: zeroAddress,
    algebraTickLens: zeroAddress,
    algebraQuoter: zeroAddress,
    algebraQuoterV2: zeroAddress,
    algebraSwapRouter: zeroAddress,
    algebraEternalFarming: zeroAddress,
    algebraFarmingCenter: zeroAddress,
    algebraCommunityVault: zeroAddress,
    algebraVaultFactoryStub: zeroAddress,
    algebraPluginFactory: zeroAddress,
    algebraProxy: zeroAddress,
    algebraInterfaceMulticall: zeroAddress,
    //launchpad
    ftoFactory: zeroAddress,
    ftoFacade: zeroAddress,
    memeFactory: zeroAddress,
    memeFacade: zeroAddress,
    ftoTokens: [],
    //aquabera vault
    vaultFactory: zeroAddress,
    vaultVolatilityCheck: zeroAddress,
  },
  faucetTokens: [],
  blacklist: {},
  validatedTokensInfo: {},
  validatedFtoAddresses: [],
  validatedMemeAddresses: [],
});

export const sprotoNetWork = new Network({
  supportDEX: false,
  supportVault: false,
  supportBridge: false,
  chain: sprotoTestnet,
  officialFaucets: [],
  nativeToken: {},
  contracts: {
    //algebra
    algebraPoolInitCodeHash: zeroAddress,
    algebraFactory: zeroAddress,
    algebraPoolDeployer: zeroAddress,
    algebraPositionManager: zeroAddress,
    algebraNonfungiblePositionDescriptor: zeroAddress,
    algebraEntryPoint: zeroAddress,
    algebraTickLens: zeroAddress,
    algebraQuoter: zeroAddress,
    algebraQuoterV2: zeroAddress,
    algebraSwapRouter: zeroAddress,
    algebraEternalFarming: zeroAddress,
    algebraFarmingCenter: zeroAddress,
    algebraCommunityVault: zeroAddress,
    algebraVaultFactoryStub: zeroAddress,
    algebraPluginFactory: zeroAddress,
    algebraProxy: zeroAddress,
    algebraInterfaceMulticall: zeroAddress,
    //launchpad
    ftoFactory: zeroAddress,
    ftoFacade: zeroAddress,
    memeFactory: zeroAddress,
    memeFacade: zeroAddress,
    ftoTokens: [],
    //aquabera vault
    vaultFactory: zeroAddress,
    vaultVolatilityCheck: zeroAddress,
  },
  faucetTokens: [],
  blacklist: {},
  validatedTokensInfo: {},
  validatedFtoAddresses: [],
  validatedMemeAddresses: [],
});

export const networks = [
  berachainNetwork,
  arbitrumOneNetwork,
  baseNetwork,
  ethNetwork,
  berachainBepoliaNetwork,
  // berachainBartioTestnetNetwork,
  // movementNetWork,
  // sprotoNetWork,
];
export const networksMap = networks.reduce((acc, network) => {
  acc[network.chainId] = network;
  return acc;
}, {} as Record<number | string, Network>);

export const LiquidityBootstrapPoolFactoryAddress =
  '0xe2957CeAe8d267C493ad41e5CF7BBc274B969711';
