import { useMemo } from 'react';
import {
  InMemoryCache,
  ApolloClient,
  NormalizedCacheObject,
} from '@apollo/client';
import { useObserver } from 'mobx-react-lite';
import { wallet } from '../lib/wallet/wallet';
import { networksMap } from '../lib/chains/chain';

export function useInfoClient(): ApolloClient<any> {
  const chainId = useObserver(() => wallet.currentChainId);
  const client = useMemo(
    () => getInfoClientByChainId(chainId.toString()),
    [chainId]
  );

  return client;
}

export function useFarmingClient(): ApolloClient<any> {
  const chainId = useObserver(() => wallet.currentChainId);
  const client = useMemo(
    () => getFarmingClientByChainId(chainId.toString()),
    [chainId]
  );

  return client;
}

export function useLbpClient(): ApolloClient<any> {
  const chainId = useObserver(() => wallet.currentChainId);
  const client = useMemo(
    () => getLbpClientByChainId(chainId.toString()),
    [chainId]
  );

  return client;
}

export function getFarmingClientByChainId(chainId: string) {
  const FARMING_GRAPH = networksMap[chainId].subgraphAddresses.algebra_farming;
  return new ApolloClient({
    uri: FARMING_GRAPH,
    ssrMode: true,
    queryDeduplication: false,
    cache: new InMemoryCache(),
    defaultOptions: {
      query: {
        errorPolicy: 'all',
      },
    },
  });
}

export function getLbpClientByChainId(chainId: string) {
  const LBP_GRAPH = networksMap[chainId].subgraphAddresses.lbp;
  return new ApolloClient({
    uri: LBP_GRAPH,
    ssrMode: true,
    queryDeduplication: false,
    cache: new InMemoryCache(),
    defaultOptions: {
      query: {
        errorPolicy: 'all',
      },
    },
  });
}

export function getInfoClientByChainId(chainId: string) {
  const INFO_GRAPH = networksMap[chainId].subgraphAddresses.algebra_info;

  return new ApolloClient({
    uri: INFO_GRAPH,
    ssrMode: true,
    queryDeduplication: false,
    cache: new InMemoryCache(),
    defaultOptions: {
      query: {
        errorPolicy: 'all',
      },
    },
  });
}
