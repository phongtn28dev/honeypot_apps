import { useMemo } from 'react';
import { InMemoryCache } from '@apollo/client';
import { ApolloClient } from '@apollo/client';
import { useObserver } from 'mobx-react-lite';
import { wallet } from '@/services/wallet';

export function useInfoClient() {
  const INFO_GRAPH = useObserver(
    () => wallet?.currentChain?.subgraphAddresses?.algebra_info
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
    () => wallet?.currentChain?.subgraphAddresses?.algebra_farming
  );
  console.log('FARMING_GRAPH', FARMING_GRAPH);
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
