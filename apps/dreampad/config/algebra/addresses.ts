import { zeroAddress } from "viem";
import { Address } from "viem";

/** 
  Algebra Integral 1.2 - https://github.com/cryptoalgebra/Algebra/tree/integral-v1.2
  Bartio testnet scan - https://bartio.beratrail.io

  Wbera: 0x7507c1dc16935B82698e4C63f2746A2fCf994dF8
  Contracts: 
  POOL_INIT_CODE_HASH: 0xb3fc09be5eb433d99b1ec89fd8435aaf5ffea75c1879e19028aa2414a14b3c85
  AlgebraPoolDeployer to: 0x5Dc98916bC57A5391F9Df74002f266B6b187C339
  AlgebraFactory deployed to: 0xB21b59d368e04b6a55ca7Fb78DEaF0c82fD289cC
  AlgebraCommunityVault deployed to: 0xA33285c2C94e7BfEcB3d6a5E7857e743ae89527d
  AlgebraVaultFactoryStub deployed to: 0x160899222b30CE30548fD78590C9679797Ba55A8
  PluginFactory to: 0x9a0C5bEdD6aC012E7Ea5e8A114Ec5c312E6625f5
  Updated plugin factory address in factory
  EntryPoint deployed to: 0x828A5441131409950aECe103b1C50255f9933dA0
  TickLens deployed to: 0xD2048727c176EBecF820dA49d1752b713d74e66b
  Quoter deployed to: 0xF9C80f3675D7fd8E97cb5DA17970D291ff6c63D0
  QuoterV2 deployed to: 0x57f60FaFce4C6E4326814137fB3dE52567C2527C
  SwapRouter deployed to: 0xb920d17DF1D14Fde86052CC571729a18Da7D72ED
  NonfungibleTokenPositionDescriptor deployed to: 0x6819adD3bca043D07a88870E0FcC8584C55F2245
  Proxy deployed to: 0xa0D4d8c9bbE06c0F7c9EfF18b9c3fA5E6d0A5F20
  NonfungiblePositionManager deployed to: 0x29a738deAFdd2c6806e2f66891D812A311799828
  AlgebraInterfaceMulticall deployed to: 0x8dF3ff964Fe05575aa204c4AEf9525C90d324FA3
  AlgebraEternalFarming deployed to: 0xceBcf56cCdFB7cC05fE9368953784065fc3fe73e
  FarmingCenter deployed to: 0x4798623CcE373b33E7263f88fE133ad34bcD864F
*/

export const NATIVE_TOKEN_WRAPPED: Address =
  "0x7507c1dc16935b82698e4c63f2746a2fcf994df8";

export const POOL_INIT_CODE_HASH: Address =
  "0xb3fc09be5eb433d99b1ec89fd8435aaf5ffea75c1879e19028aa2414a14b3c85";

export const ALGEBRA_FACTORY: Address =
  "0xB21b59d368e04b6a55ca7Fb78DEaF0c82fD289cC";

export const ALGEBRA_POOL_DEPLOYER: Address =
  "0x5Dc98916bC57A5391F9Df74002f266B6b187C339";

export const ALGEBRA_POSITION_MANAGER: Address =
  "0x29a738deAFdd2c6806e2f66891D812A311799828";

export const ALGEBRA_NONFUNGIBLE_POSITION_DESCRIPTOR: Address =
  "0x6819adD3bca043D07a88870E0FcC8584C55F2245";

export const ALGEBRA_ENTRY_POINT: Address =
  "0x828A5441131409950aECe103b1C50255f9933dA0";

export const ALGEBRA_TICK_LENS: Address =
  "0xD2048727c176EBecF820dA49d1752b713d74e66b";

export const ALGEBRA_QUOTER: Address =
  "0xF9C80f3675D7fd8E97cb5DA17970D291ff6c63D0";

export const ALGEBRA_QUOTER_V2: Address =
  "0x57f60FaFce4C6E4326814137fB3dE52567C2527C";

export const ALGEBRA_ROUTER: Address =
  "0xb920d17DF1D14Fde86052CC571729a18Da7D72ED";

export const ALGEBRA_ETERNAL_FARMING: Address =
  "0xceBcf56cCdFB7cC05fE9368953784065fc3fe73e";

export const FARMING_CENTER: Address =
  "0x4798623CcE373b33E7263f88fE133ad34bcD864F";

export const ALGEBRA_COMMUNITY_VAULT_FACTORY: Address =
  "0xA33285c2C94e7BfEcB3d6a5E7857e743ae89527d";

export const ALGEBRA_VAULT_FACTORY_STUB: Address =
  "0x160899222b30CE30548fD78590C9679797Ba55A8";

export const ALGEBRA_PLUGIN_FACTORY: Address =
  "0x9a0C5bEdD6aC012E7Ea5e8A114Ec5c312E6625f5";

export const ALGEBRA_PROXY: Address =
  "0xa0D4d8c9bbE06c0F7c9EfF18b9c3fA5E6d0A5F20";
export const ALGEBRA_INTERFACE_MULTICALL: Address =
  "0x8dF3ff964Fe05575aa204c4AEf9525C90d324FA3";

// Custom pools
export const CUSTOM_POOL_DEPLOYER: Address =
  "0xc9cf812513d9983585eb40fcfe6fd49fbb6a45815663ec33b30a6c6c7de3683b";

export const CUSTOM_POOL_DEPLOYER_FEE_CHANGER: Address =
  "0x7e3387e0595552e992ede4476417704703866e5a"; // placeholder

export const CUSTOM_POOL_DEPLOYER_BLANK: Address =
  "0xbb75acad36f08201a49a6dd077229d95f4e7bd50"; // placeholder

export const CUSTOM_POOL_BASE: Address = zeroAddress;
