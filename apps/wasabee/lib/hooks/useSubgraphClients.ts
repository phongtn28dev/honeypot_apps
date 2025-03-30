import { useMemo } from 'react';
import { InMemoryCache } from '@apollo/client';
import { ApolloClient } from '@apollo/client';
import { useObserver } from 'mobx-react-lite';
import { wallet } from '@/services/wallet';
import { networksMap } from '@/services/chain';

export function useInfoClient() {
  const chainId = useObserver(() => wallet.currentChainId);
  const client = useMemo(
    () => getInfoClientByChainId(chainId.toString()),
    [chainId]
  );

  return client;
}

export function useFarmingClient() {
  const chainId = useObserver(() => wallet.currentChainId);
  const client = useMemo(
    () => getFarmingClientByChainId(chainId.toString()),
    [chainId]
  );

  return client;
}

export function getFarmingClientByChainId(chainId: string) {
  const FARMING_GRAPH = networksMap[chainId].subgraphAddresses.algebra_farming;
  return new ApolloClient({
    uri: FARMING_GRAPH,
    ssrMode: true,
    cache: new InMemoryCache(),
  });
}

export function getInfoClientByChainId(chainId: string) {
  const INFO_GRAPH = networksMap[chainId].subgraphAddresses.algebra_info;

  return new ApolloClient({
    uri: INFO_GRAPH,
    ssrMode: true,
    cache: new InMemoryCache(),
  });
}
