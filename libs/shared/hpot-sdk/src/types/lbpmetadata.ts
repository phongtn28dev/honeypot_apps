export interface Social {
  id: string;
  url: string;
  name: string;
  joinedAt: string;
  provider: string;
  username: string;
  followers: number;
  image_url: string;
}

export interface CuratorSocial {
  url: string;
  name: string;
  provider: string;
  username: string;
  profileImageUrl: string;
}

export interface Curator {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  bio: string;
  logo: string;
  requestLink: string | null;
  lastLogin: string;
  nonce: string | null;
  roles: string[];
  address: string;
  socials: CuratorSocial[];
}

export interface PreviousInvestmentRound {
  tge: number;
  vestCliff: number;
  supplySold: number;
  raiseAmount: number;
  vestingLength: number;
  roundValuation: number;
}

export interface CuratorComment {
  kyc: boolean;
  comment: string;
}

export interface LbpPoolMetadata {
  id: string;
  createdAt: string;
  updatedAt: string;
  chainId: number;
  name: string;
  address: string;
  owner: string;
  description: string;
  whitelistUrl: string | null;
  disclaimerUrl: string | null;
  endsAt: string;
  startsAt: string;
  swapCount: number;
  swapFee: string;
  swapEnabled: boolean;
  learnMoreUrl: string;
  imageUrl: string;
  blockNumber: number;
  lastBlockScannedPoolClosed: number;
  lastBlockScannedPoolCreated: number;
  lastBlockScannedSwap: number;
  sellingAllowed: boolean;
  socials: Social[];
  swapFeesAsset: string;
  swapFeesShare: string;
  version: number;
  assetTokenAddress: string;
  assetTokenName: string;
  assetTokenSymbol: string;
  shareTokenAddress: string;
  shareTokenName: string;
  shareTokenSymbol: string;
  blockedCountries: string[];
  txHash: string;
  assetTokenDecimals: number;
  assetsInitial: string;
  bannerUrl: string | null;
  fundsRaised: number;
  lbpBanner: string;
  lbpMarketcap: string;
  liquidity: string;
  platformFee: string;
  shareTokenDecimals: number;
  sharesInitial: string;
  sharesReleased: string;
  timestamp: string;
  vestCliffStart: string | null;
  vestEnd: string | null;
  volume: string;
  weightEnd: string;
  weightStart: string;
  assetsCurrent: string;
  endBlockNumber: number;
  numberParticipants: number;
  sharesCurrent: string;
  startBlockNumber: number;
  swapFeesPlatform: string;
  listed: boolean;
  curatorComments: Record<string, CuratorComment>;
  customTotalSupply: string;
  liquidiyTransparency: string | null;
  previousInvestmentRounds: PreviousInvestmentRound[];
  redemptionDelay: number;
  virtualAssets: string;
  ecosystem: string;
  assetsPerShare: string | null;
  closedBlockNumber: number;
  completedBlockNumber: number | null;
  lastBlockScannedPoolCompleted: number | null;
  lbpType: string;
  tiers: any | null;
  whitelist: any | null;
  tag: string | null;
  semver: string;
  resume: string;
  roundType: string;
  curators: Curator[];
  lastPrice: number;
  canceled: boolean;
  closed: boolean;
  canClose: boolean;
}

export interface MetaValues {
  createdAt: string[];
  updatedAt: string[];
  endsAt: string[];
  startsAt: string[];
  timestamp: string[];
  'curators.0.createdAt': string[];
  'curators.0.updatedAt': string[];
  'curators.0.lastLogin': string[];
}

export interface PoolMeta {
  values: MetaValues;
}

export interface ScopedMeta {
  values: string[];
}

export interface Scoped {
  json: any | null;
  meta: ScopedMeta;
}

export interface FjordLbpMetadataPageProps {
  pool: {
    json: LbpPoolMetadata;
    meta: PoolMeta;
  };
  scoped: Scoped;
  onChainDataFailed: boolean;
  _lastUpdated: string;
}

export interface FjordLbpMetadataResponse {
  pageProps: FjordLbpMetadataPageProps;
  __N_SSG: boolean;
}
