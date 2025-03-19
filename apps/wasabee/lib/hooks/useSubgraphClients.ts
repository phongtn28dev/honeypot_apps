import { useMemo } from 'react';
import { InMemoryCache } from '@apollo/client';
import { ApolloClient } from '@apollo/client';
import { useObserver } from 'mobx-react-lite';
import { wallet } from '@/services/wallet';
import { networksMap } from '@/services/chain';
import { DEFAULT_CHAIN_ID } from '@/config/algebra/default-chain-id';

export function useInfoClient() {
  const INFO_GRAPH = useObserver(
    () =>
      wallet?.currentChain?.subgraphAddresses?.algebra_info ||
      networksMap[DEFAULT_CHAIN_ID].subgraphAddresses.algebra_info
  );

  const client = useMemo(() => {
    const infoClient = new ApolloClient({
      uri: INFO_GRAPH,
      ssrMode: true,
      cache: new InMemoryCache(),
    });
    return infoClient;
  }, [INFO_GRAPH]);

  return client;
}

export function useFarmingClient() {
  const FARMING_GRAPH = useObserver(
    () =>
      wallet?.currentChain?.subgraphAddresses?.algebra_farming ||
      networksMap[DEFAULT_CHAIN_ID].subgraphAddresses.algebra_farming
  );
  const client = useMemo(() => {
    const farmingClient = new ApolloClient({
      uri: FARMING_GRAPH,
      ssrMode: true,
      cache: new InMemoryCache(),
    });
    return farmingClient;
  }, [FARMING_GRAPH]);

  return client;
}
