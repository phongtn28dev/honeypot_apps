export interface SubgraphAddresses {
  algebra_info: string;
  algebra_farming: string;
  bgt_market: string;
}

export const subgraphAddresses: Record<string, SubgraphAddresses> = {
  default: {
    algebra_info: '',
    algebra_farming: '',
    bgt_market: '',
  },
  // berachain mainnet
  '80094': {
    algebra_info:
      'https://api.goldsky.com/api/public/project_cm78242tjtmme01uvcbkaay27/subgraphs/hpot-algebra-core/2.4.0/gn',
    algebra_farming:
      'https://api.goldsky.com/api/public/project_cm78242tjtmme01uvcbkaay27/subgraphs/hpot-algebra-farming/2.0.0/gn',
    bgt_market:
      'https://api.goldsky.com/api/public/project_cm78242tjtmme01uvcbkaay27/subgraphs/hpot-bgt-market/0.0.7/gn',
  },
  // bepolia
  '80069': {
    algebra_info:
      'https://api.goldsky.com/api/public/project_cm78242tjtmme01uvcbkaay27/subgraphs/hpot-algebra-core-bepolia/1.0.0/gn',
    algebra_farming:
      'https://api.goldsky.com/api/public/project_cm78242tjtmme01uvcbkaay27/subgraphs/hpot-algebra-farming-bepolia/1.0.0/gn',
    bgt_market: '',
  },
};
