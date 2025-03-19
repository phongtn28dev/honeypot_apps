import { Address, zeroAddress } from 'viem';

export interface ContractAddresses {
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
  //aquabera vault
  vaultFactory: Address;
  vaultVolatilityCheck: Address;
}

export const contractAddresses: Record<string, ContractAddresses> = {
  default: {
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
    //aquabera vault
    vaultFactory: zeroAddress,
    vaultVolatilityCheck: zeroAddress,
  },
  '80069': {
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

    //aquabera vault
    vaultFactory: '0x1bf5e51eCacdfEA65ae9276fd228bB8719ffcA7E',
    vaultVolatilityCheck: '0x97BF8CB6Be6757ab46D44853eAbEFD0D4C153037',
  },
};
