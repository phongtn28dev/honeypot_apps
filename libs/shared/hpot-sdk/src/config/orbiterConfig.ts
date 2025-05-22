import { networks } from './chains/chain';

export const orbiterNetworks = networks.map((network) => ({
  id: network.chainId,
  name: network.chain.name,
}));
