import { Token } from './contract/token';
import { Chain } from 'viem/chains';
import {
  berachain,
  berachainBartioTestnet,
  berachainTestnet,
  movementTestnet,
  polygonMumbaiChain,
  sprotoTestnet,
  //sepolia,
} from '@/lib/chain';
import { ALGEBRA_POSITION_MANAGER } from '@/config/algebra/addresses';
import { zeroAddress } from 'viem';
import { ICHIVaultContract } from './contract/aquabera/ICHIVault-contract';
import Link from 'next/link';

export class Network {
  isActive: boolean = true;
  get chainId() {
    return this.chain.id;
  }
  platformTokenAddress!: {
    HPOT: string;
  };
  contracts!: {
    routerV3: string;
    routerV2: string;
    factory: string;
    ftoFactory: string;
    ftoFacade: string;
    memeFactory: string;
    memeFacade: string;
    vaultFactory: string;
    vaultVolatilityCheck: string;
    ftoTokens: Partial<Token>[];
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
  validatedVault: ({ address: `0x${string}` } & Partial<ICHIVaultContract>)[] =
    [];
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
    this.nativeToken = Token.getToken(this.nativeToken);
    this.nativeToken.init().then(() => {
      console.log('this.nativeToken', this.nativeToken.name);
    });
    this.faucetTokens = this.faucetTokens.map((t) => {
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
    this.validatedVault.forEach((vault) => {
      const vaultContract = ICHIVaultContract.getVault(vault);
    });
  }
}

export const berachainBartioTestnetNetwork = new Network({
  chain: berachainBartioTestnet,
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
  },
  raisedTokenData: [
    {
      symbol: 'tHpot',
      address: '0xfc5e3743e9fac8bb60408797607352e24db7d65e',
      amount: BigInt('2000000000000000000000000'),
    },
    {
      symbol: 'WBERA',
      address: '0x7507c1dc16935b82698e4c63f2746a2fcf994df8',
      amount: BigInt('4000000000000000000'),
    },
    {
      symbol: 'pHpot',
      address: '0xb6a43168ffb37e03e48a723fcb3895ae7d596078',
      amount: BigInt('200000000000000000000000'),
    },
    {
      symbol: 'Honey',
      address: '0x0e4aaf1351de4c0264c5c7056ef3777b41bd8e03',
      amount: BigInt('30000000000000000000'),
    },
    {
      symbol: 'WGBERA',
      address: '0xd77552d3849ab4d8c3b189a9582d0ba4c1f4f912'.toLowerCase(),
      amount: BigInt('2000000000000000000000'),
    },
  ],
  nativeFaucet: {
    address: '0x1bd43f7f55b700236c92256a0fd90266363119f7',
    name: 'Daily Faucet',
    requirements: 'You can claim 100 BERA tokens every 24 hours.',
  },
  platformTokenAddress: {
    HPOT: '0xfc5e3743e9fac8bb60408797607352e24db7d65e'.toLowerCase(),
  },
  contracts: {
    vaultVolatilityCheck: '0x0000000000000000000000000000000000000000',
    routerV3: ALGEBRA_POSITION_MANAGER,
    routerV2: '0x8aBc3a7bAC442Ae449B07fd0C2152364C230DA9A',
    factory: '0x7A962f6E45100b8cC560C7d2c248ec704623fb53',
    ftoFactory: '0x7E0CCe2C9Ff537f8301dd40c652A03479B18dAef',
    ftoFacade: '0x0264D933F13eE993270591668CfF87b8D35Dd3b4',
    memeFactory: '0x7e92408E41765080434b6d3297a46fC67344f819',
    memeFacade: '0xAAD87033d81bB4c6a3A08aD77323530FF9dB8f5C',
    vaultFactory: '0x14a59DeB312696EFA637466C4Fc22E6ECb847327',
    ftoTokens: [
      {
        address: '0xfc5e3743E9FAC8BB60408797607352E24Db7d65E'.toLowerCase(),
        name: 'T-HPOT',
        symbol: 'T-HPOT',
        decimals: 18,
      },
      {
        address: '0x05D0dD5135E3eF3aDE32a9eF9Cb06e8D37A6795D'.toLowerCase(),
        name: 'USDT',
        symbol: 'USDT',
        decimals: 18,
      },
      {
        address: '0x6969696969696969696969696969696969696969'.toLowerCase(),
        name: 'Wrapped Bera',
        symbol: 'WBERA',
        decimals: 18,
        logoURI: '/images/icons/wbera-token-icon.png',
      },
      {
        address: '0x0E4aaF1351de4c0264C5c7056Ef3777b41BD8e03'.toLowerCase(),
        name: 'Honey',
        symbol: 'HONEY',
        decimals: 18,
      },
      {
        address: '0x2C2fc71339aCdD913734a4CAe9dD95D9d2b1438d'.toLowerCase(),
        name: 'Bera the Pooh',
        symbol: 'BERA THE POOH',
        decimals: 18,
      },
    ],
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
    '0x7507c1dc16935b82698e4c63f2746a2fcf994df8': {
      name: 'Wrapped Bera',
      symbol: 'WBERA',
      decimals: 18,
      logoURI: '/images/icons/tokens/wbera-token-icon.png',
      isRouterToken: true,
      isPopular: true,
    },
    '0x2c2fc71339acdd913734a4cae9dd95d9d2b1438d': {
      name: 'Bera the Pooh',
      symbol: 'BTP',
      decimals: 18,
      logoURI: '/images/icons/tokens/bera-the-pooh-token-icon.png',
    },
    '0x0e4aaf1351de4c0264c5c7056ef3777b41bd8e03': {
      name: 'Honey',
      symbol: 'HONEY',
      decimals: 18,
      logoURI: '/images/icons/tokens/honey-token-icon.png',
      isRouterToken: true,
      isPopular: true,
    },
    '0xfc5e3743e9fac8bb60408797607352e24db7d65e': {
      name: 'T-HPOT',
      symbol: 'tHPOT',
      decimals: 18,
      logoURI: '/images/icons/tokens/thpot-token-icon.jpg',
      isRouterToken: true,
      isPopular: true,
    },
    '0xb6a43168FFB37e03E48A723fCB3895aE7d596078': {
      name: 'Pottard Honeypot',
      symbol: 'pHPOT',
      decimals: 18,
      logoURI: '/images/icons/tokens/phpot-token-icon.jpg',
      isRouterToken: true,
      isPopular: true,
    },
    '0x05d0dd5135e3ef3ade32a9ef9cb06e8d37a6795d': {
      name: 'USDT',
      symbol: 'USDT',
      decimals: 6,
      logoURI: '/images/icons/tokens/usdt-token-icon.png',
      isRouterToken: true,
    },
    '0xd6d83af58a19cd14ef3cf6fe848c9a4d21e5727c': {
      name: 'USDC',
      symbol: 'USDC',
      decimals: 6,
      logoURI: '/images/icons/tokens/usdc-token-icon.png',
      isRouterToken: true,
    },
    '0x2577d24a26f8fa19c1058a8b0106e2c7303454a4': {
      name: 'WBTC',
      symbol: 'WBTC',
      decimals: 18,
      logoURI: '/images/icons/tokens/wbtc-token-icon.png',
      isRouterToken: true,
    },
    '0xe28afd8c634946833e89ee3f122c06d7c537e8a8': {
      name: 'WETH',
      symbol: 'WETH',
      decimals: 18,
      logoURI: '/images/icons/tokens/weth-token-icon.png',
      isRouterToken: true,
    },
    '0x806ef538b228844c73e8e692adcfa8eb2fcf729c': {
      name: 'DAI',
      symbol: 'DAI',
      decimals: 18,
      logoURI: '/images/icons/tokens/dai-token-icon.png',
    },
    '0x343499e6315f7d3473a12aaf660ac02b5739c382': {
      name: 'Grand Conquest Gold',
      symbol: 'GCG',
      decimals: 18,
      logoURI: '/images/icons/tokens/grandconquest-token-icon.png',
    },
    '0x8887be5219f485d6948499b060aef973c51f66dd': {
      name: 'test Arebmeme',
      symbol: 'AREB',
      decimals: 18,
      logoURI: '/images/icons/tokens/areb-token-icon.png',
      supportingFeeOnTransferTokens: false,
    },
    '0xa0525273423537bc76825b4389f3baec1968f83f': {
      name: 'JNKY',
      symbol: 'JNKY',
      decimals: 18,
      logoURI: '/images/icons/tokens/jnky-token-icon.jpg',
    },
    '0x1740f679325ef3686b2f574e392007a92e4bed41': {
      name: 'YEET',
      symbol: 'YEET',
      decimals: 18,
      logoURI: '/images/icons/tokens/yeet-token-icon.jpg',
    },
    '0x277aadbd9ea3db8fe9ea40ea6e09f6203724bdae': {
      name: 'DIRAC',
      symbol: 'DIRAC',
      decimals: 18,
      logoURI: '/images/icons/tokens/dirac-token-icon.svg',
    },
    '0xf5afcf50006944d17226978e594d4d25f4f92b40': {
      name: 'NECT',
      symbol: 'NECT',
      decimals: 18,
      logoURI: '/images/icons/tokens/nect-token-icon.png',
    },
    '0x7629668774f918c00eb4b03adf5c4e2e53d45f0b': {
      name: 'oBERO',
      symbol: 'oBERO',
      decimals: 18,
      logoURI: '/images/icons/tokens/obero-token-icon.jpg',
    },
    '0x46efc86f0d7455f135cc9df501673739d513e982': {
      name: 'iBGT',
      symbol: 'iBGT',
      decimals: 18,
      logoURI: '/images/icons/tokens/ibgt-token-icon.png',
    },
    '0x86056cdb2bf09c540b63f5a0bc054c840cb0de6c': {
      name: 'LORE',
      symbol: 'LORE',
      decimals: 18,
      logoURI: '/images/icons/tokens/lore-token-icon.jpg',
    },
    // "0xfad73c80d67d3cb4a929d1c0faf33a820620ae41": {
    //   name: "POT The Bera",
    //   symbol: "POT",
    //   decimals: 18,
    //   logoURI: "/images/icons/tokens/pot-the-bera-token-icon.webp",
    // },
    // "0x180f30908b7c92ff2d65609088ad17bf923b42dc": {
    //   name: "Janitooor",
    //   symbol: "JANI",
    //   decimals: 18,
    //   logoURI: "/images/icons/tokens/janitooor-token-icon.webp",
    // },
    // "0x5da73142f3c8d8d749db4459b2fcc9024fad024e": {
    //   name: "Whippor",
    //   symbol: "$BULL",
    //   decimals: 18,
    //   logoURI: "/images/icons/tokens/whippor-token-icon.webp",
    // },
    // "0x2da7ec28dae827ea513da752bc161e55147b4d66": {
    //   name: "B-Vol",
    //   symbol: "IVX",
    //   decimals: 18,
    //   logoURI: "/images/icons/tokens/ivx-token-icon.webp",
    // },
    '0xb5a27c33ba2adecee8cdbe94cef5576e2f364a8f': {
      name: 'BERO',
      symbol: 'BERO',
      decimals: 18,
      logoURI: '/images/icons/tokens/bero-token-icon.webp',
    },
    '0x16221CaD160b441db008eF6DA2d3d89a32A05859': {
      name: 'uniBTC',
      symbol: 'uniBTC',
      decimals: 8,
      logoURI: '/images/icons/tokens/unibtc-token-icon.png',
    },
    //memewar 2
    // "0x8b045d02c581284295be33d4f261f8e1e6f78f18": {
    //   name: "Bera Neiro",
    //   symbol: "BERA NEIRO",
    //   decimals: 18,
    //   logoURI: "/images/memewar2/Bera_Neiro.png",
    // },
    // "0xff4abcd6d4cea557e4267bc81f1d2064615cb49e": {
    //   name: "Bera Pepe",
    //   symbol: "BERA PEPE",
    //   decimals: 18,
    //   logoURI: "/images/memewar2/Bera_Pepe.png",
    // },
    // "0x3F7AAE503000A08A8d4A9AFefa738b565f3A6CD6": {
    //   name: "Bera Mog",
    //   symbol: "BERA MOG",
    //   decimals: 18,
    //   logoURI: "/images/memewar2/Bera_Mog.png",
    // },
    // "0xEF348b9FD378c91b00874d611b22062d7ee60284": {
    //   name: "Bera Dog Wif Hat",
    //   symbol: "BERA DOG WIF HAT",
    //   decimals: 18,
    //   logoURI: "/images/memewar2/Bera_Dog_Wif_Hat.png",
    // },
    // "0x51A42ceAFDA32F68390840A187b65a99584332df": {
    //   name: "Bera Popcat",
    //   symbol: "BERA POPCAT",
    //   decimals: 18,
    //   logoURI: "/images/memewar2/Bera_Popcat.png",
    // },
    // "0x96dc300D5406E42051575B8b49d3057F1Ef678FC": {
    //   name: "Bera Giga Chad",
    //   symbol: "BERA GIGA CHAD",
    //   decimals: 18,
    //   logoURI: "/images/memewar2/Bera_Giga_Chad.png",
    // },
    // "0x0874955158639A594fd65641E16C7de91F3dF465": {
    //   name: "Bera Goat",
    //   symbol: "BERA GOAT",
    //   decimals: 18,
    //   logoURI: "/images/memewar2/Bera_Goat.png",
    // },
    // "0x96d62fbd15608ef087219f20986735a1d65a22a4": {
    //   name: "Bera Moo Deng",
    //   symbol: "BERA Moo Deng",
    //   decimals: 18,
    //   logoURI: "/images/memewar2/BERA_MOODENG.png",
    // },
    // "0xFa9FB9d84525e4fE6c7DEaE137e3f1C81F86FdF8": {
    //   name: "Bera Retadrio",
    //   symbol: "BERA RETADRIO",
    //   decimals: 18,
    //   logoURI: "/images/memewar2/Bera_Retadrio.png",
    // },
    // "0x5a42fefa75b0adebd63d3078c2f1e3e9a6c39177": {
    //   name: "Bera Apu",
    //   symbol: "BERA APU",
    //   decimals: 18,
    //   logoURI: "/images/memewar2/BERA_APU.png",
    // },
    // "0xc06b8ee779d065061c2087c5c78c1ef774850041": {
    //   name: "Trumpot",
    //   symbol: "TRUMPOT",
    //   decimals: 18,
    //   logoURI: "/images/memewar2/trumpot.jpg",
    // },
    // "0xc87e5a73781e09d831d41e32991d9fc943517feb": {
    //   name: "Bera Coral",
    //   symbol: "BERA CORAL",
    //   decimals: 18,
    // },
    '0x32cf940db5d7ea3e95e799a805b1471341241264': {
      name: 'Liquid BGT',
      symbol: 'LBGT',
      decimals: 18,
      logoURI: '/images/icons/tokens/lbgt-token-icon.svg',
    },
    // "0x6f82653a5f95f8d4215cfa6cbc07de2429989b1d": {
    //   name: "$BullWifHorn",
    //   symbol: "$BullWifHorn",
    //   decimals: 18,
    // },
    // "0x3d7c362411b39ae2d1aae1088759711cb1c5f0f3": {
    //   name: "$Henlorse",
    //   symbol: "$Henlorse",
    //   decimals: 18,
    // },
    // "0xd92e5d89cfe82bb0c0f95a3f4b0ee5ddb22e5e87": {
    //   name: "$ToPotToTrot",
    //   symbol: "$ToPotToTrot",
    //   decimals: 18,
    // },
    // "0x2004116f5bbc9f8df3cf46be48d0788fd284f979": {
    //   name: "$TickerBitcoin",
    //   symbol: "$TickerBitcoin",
    //   decimals: 18,
    // },
    // "0x04457d8063168e7008df0f6d10961622a316dd1c": {
    //   name: "$CrackPipeYeet",
    //   symbol: "$CrackPipeYeet",
    //   decimals: 18,
    // },
    // "0x24dc27d117aca1d8c0aace33bd840026c9a52e28": {
    //   name: "$LuckyNeigh",
    //   symbol: "$LuckyNeigh",
    //   decimals: 18,
    // },
    // "0x223c1ee6fae816e430ada62a1e5a20c3060f0b4f": {
    //   name: "$BozoClub",
    //   symbol: "$BozoClub",
    //   decimals: 18,
    // },
    // "0x6e504fcb8519820499ec2518bd912016b373c5dc": {
    //   name: "$ChibiRider",
    //   symbol: "$ChibiRider",
    //   decimals: 18,
    // },
  },
  validatedFtoAddresses: [
    '0x2c504e661750e03aa9252c67e771dc059a521863'.toLowerCase(),
    '0x93f8beabd145a61067ef2fca38c4c9c31d47ab7e'.toLowerCase(),
  ],
  validatedMemeAddresses: [],
});

export const berachainNetwork = new Network({
  chain: berachain,
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
    routerV3: ALGEBRA_POSITION_MANAGER,
    routerV2: '0x8aBc3a7bAC442Ae449B07fd0C2152364C230DA9A',
    factory: '0x7d53327D78EFD0b463bd8d7dc938C52402323b95',
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
      isBitgetCampaignToken: true,
    },
    '0xbaadcc2962417c01af99fb2b7c75706b9bd6babe': {
      name: 'Liquid BGT',
      symbol: 'LBGT',
      decimals: 18,
      logoURI: 'https://www.berapaw.com/static/images/tokens/lbgt.svg',
    },
    //bitget campaign
    '0xa40e6433782ffb18c8eeb16d201e331e37abfb74': {
      name: 'Xi BERA',
      symbol: 'XI',
      decimals: 18,
      logoURI: '/images/icons/tokens/xi.webp',
      isBitgetCampaignToken: true,
      isPopular: true,
    },
    '0x10acd894a40d8584ad74628812525ef291e16c47': {
      name: 'Q5',
      symbol: 'Q5',
      decimals: 18,
      logoURI: '/images/icons/tokens/q5.webp',
      isBitgetCampaignToken: true,
      isPopular: true,
    },
    '0x539aced84ebb5cbd609cfaf4047fb78b29553da9': {
      name: 'the chain has a bear on it',
      symbol: 'BERACHAIN',
      decimals: 18,
      logoURI: '/images/icons/tokens/berachain.webp',
      isBitgetCampaignToken: true,
      isPopular: true,
    },
    '0xab7e0f3d69de8061aa46d7c9964dbc11878468eb': {
      name: 'Berally Token',
      symbol: 'BRLY',
      decimals: 18,
      logoURI: '/images/icons/tokens/berally.png',
    },
    '0x18878df23e2a36f81e820e4b47b4a40576d3159c': {
      name: 'Olympus',
      symbol: 'OHM',
      decimals: 18,
      logoURI: 'https://berascan.com/token/images/olympusdao2_32.png',
    },
  },
  validatedFtoAddresses: [],
  validatedMemeAddresses: [],
  validatedVault: [
    {
      //WBERA/HONEY
      address: '0xb00ae8a7be63036dbcd143a842bfc14708c440bb',
      vaultTag: {
        tag: 'HOT 🔥',
        bgColor: '#FFCD4D',
        textColor: 'black',
        tooltip: 'High APR, High Volume, High Liquidity',
      },
    },
    {
      //WETH/WBERA
      address: '0xec06041013b3a97c58b9ab61eae9079bc594eda3',
      vaultTag: {
        tag: 'ETH Jeets',
        bgColor: '#FFCD4D',
        textColor: 'black',
        tooltip: 'An ETH single-side deposit vault, actively paired with BERA.',
      },
      vaultDescription: (
        <>
          An ETH single-side deposit vault, actively paired with BERA, with high
          exposure farming on the wETH-BERA pair at Wasabee DEX and a goal of
          buying more BERA over time. The benchmark is compared to only holding
          ETH.
          <br />
          <br />
          This strategy is implemented based on{' '}
          <a
            href="https://docs.ichi.org/home/yieldiq-strategy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500"
          >
            YieldIQ
          </a>
          , with the ETH inventory ratio being reduced as the running time
          increases. HPOT&Aquabera will review the strategy parameters
          regularly.
        </>
      ),
    },
    {
      //WBERA/HONEY
      address: '0xba29bbb78825a72c5dcc3d217ca2011bd95b97c7',
      vaultTag: {
        tag: 'LONG $BERA',
        bgColor: '#FFCD4D',
        textColor: 'black',
      },
    },
  ],
});

export const movementNetWork = new Network({
  isActive: false,
  chain: movementTestnet,
  officialFaucets: [],
  nativeToken: {},
  contracts: {
    routerV3: ALGEBRA_POSITION_MANAGER,
    routerV2: zeroAddress,
    factory: zeroAddress,
    ftoFactory: zeroAddress,
    ftoFacade: zeroAddress,
    memeFactory: zeroAddress,
    memeFacade: zeroAddress,
    vaultFactory: zeroAddress,
    vaultVolatilityCheck: zeroAddress,
    ftoTokens: [],
  },
  faucetTokens: [],
  blacklist: {},
  validatedTokensInfo: {},
  validatedFtoAddresses: [],
  validatedMemeAddresses: [],
});

export const sprotoNetWork = new Network({
  isActive: false,
  chain: sprotoTestnet,
  officialFaucets: [],
  nativeToken: {},
  contracts: {
    routerV3: ALGEBRA_POSITION_MANAGER,
    routerV2: zeroAddress,
    factory: zeroAddress,
    ftoFactory: zeroAddress,
    ftoFacade: zeroAddress,
    memeFactory: zeroAddress,
    memeFacade: zeroAddress,
    vaultFactory: zeroAddress,
    vaultVolatilityCheck: zeroAddress,
    ftoTokens: [],
  },
  faucetTokens: [],
  blacklist: {},
  validatedTokensInfo: {},
  validatedFtoAddresses: [],
  validatedMemeAddresses: [],
});

export const networks = [
  berachainNetwork,
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
