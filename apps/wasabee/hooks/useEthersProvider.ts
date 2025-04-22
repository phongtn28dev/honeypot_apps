import { useMemo } from 'react';
import type { Chain, Client, Transport, WalletClient } from 'viem';
import { Config, useClient } from 'wagmi';
import { ethers } from 'ethers';

export function clientToProvider(client: WalletClient) {
  const { chain, transport } = client;
  if (!chain) {
    throw new Error('Chain is not defined');
  }
  if (!chain.contracts) {
    throw new Error('Chain contracts are not defined');
  }
  const network = {
    chainId: chain.id,
    name: chain.name,
  };

  if (transport.type === 'fallback')
    return new ethers.FallbackProvider(
      (transport.transports as ReturnType<Transport>[]).map(
        ({ value }) => new ethers.JsonRpcProvider(value?.url, network)
      )
    );
  return new ethers.JsonRpcProvider(transport.url, network);
}

/** Hook to convert a viem Client to an ethers.js Provider. */
export function useEthersProvider({
  chainId,
}: { chainId?: number | undefined } = {}) {
  const client = useClient<Config>({ chainId });
  return useMemo(
    () => (client ? clientToProvider(client as WalletClient) : undefined),
    [client]
  );
}
