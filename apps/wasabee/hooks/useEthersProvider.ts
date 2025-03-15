import { providers } from 'ethers';
import { useMemo } from 'react';
import type { Chain, Client, Transport, WalletClient } from 'viem';
import { Config, useClient } from 'wagmi';

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
    return new providers.FallbackProvider(
      (transport.transports as ReturnType<Transport>[]).map(
        ({ value }) => new providers.JsonRpcProvider(value?.url, network)
      )
    );
  return new providers.JsonRpcProvider(transport.url, network);
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
