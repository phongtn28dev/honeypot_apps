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
import { zeroAddress } from 'viem';

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
    algebraFactory: string;
    algebraPoolDeployer: string;
    algebraPositionManager: string;
    algebraNonfungiblePositionDescriptor: string;
    algebraEntryPoint: string;
    algebraTickLens: string;
    algebraQuoter: string;
    algebraQuoterV2: string;
    algebraSwapRouter: string;
    algebraEternalFarming: string;
    algebraCommunityVault: string;
    algebraVaultFactoryStub: string;
    algebraPluginFactory: string;
    algebraProxy: string;
    algebraInterfaceMulticall: string;
    //launchpad
    ftoFactory: string;
    ftoFacade: string;
    memeFactory: string;
    memeFacade: string;
    ftoTokens: Partial<Token>[];
    //aquabera vault
    vaultFactory: string;
    vaultVolatilityCheck: string;
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

export const BerachainBepoliaNetwork = new Network({
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
  nativeFaucet: {
    address: '0x1bd43f7f55b700236c92256a0fd90266363119f7',
    name: 'Daily Faucet',
    requirements: 'You can claim 100 BERA tokens every 24 hours.',
  },
  platformTokenAddress: {
    HPOT: '0x9b37d542114070518a44e200fdcd8e4be737297f'.toLowerCase(),
  },
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
    algebraCommunityVault: zeroAddress,
    algebraVaultFactoryStub: zeroAddress,
    algebraPluginFactory: zeroAddress,
    algebraProxy: zeroAddress,
    algebraInterfaceMulticall: zeroAddress,

    ftoFactory: '0x7E0CCe2C9Ff537f8301dd40c652A03479B18dAef',
    ftoFacade: '0x0264D933F13eE993270591668CfF87b8D35Dd3b4',
    memeFactory: '0xC38eF79A6cA9b3EfBe20F3dD3b99B3e25d09F52B',
    memeFacade: '0x80051Ca8C6E2e04E12de5d5Cb1313C086C867737',
    vaultFactory: '0x1bf5e51eCacdfEA65ae9276fd228bB8719ffcA7E',
    vaultVolatilityCheck: '0x97BF8CB6Be6757ab46D44853eAbEFD0D4C153037',
    ftoTokens: [],
  },
  faucetTokens: [
    {
      address: '0xfc5e3743E9FAC8BB60408797607352E24Db7d65E'.toLowerCase(),
      name: 'T-HPOT',
      symbol: 'tHPOT',
      decimals: 18,
    },
    {
      address: '0x2C2fc71339aCdD913734a4CAe9dD95D9d2b1438d'.toLowerCase(),
      name: 'Bera the Pooh',
      symbol: 'BTP',
      decimals: 18,
    },
  ],
  blacklist: {
    poolBlacklist: [],
    memeBlacklist: [],
  },
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
