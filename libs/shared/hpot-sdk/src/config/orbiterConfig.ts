import { networks } from '@honeypot/shared';

export const orbiterNetworks = networks.map((network) => ({
  id: network.chainId,
  name: network.chain.name,
}));
