import { useSubgraphClient } from '@honeypot/shared';

export function useClients() {
  const infoClient = useSubgraphClient('algebra_info');
  const farmingClient = useSubgraphClient('algebra_farming');

  return {
    infoClient,
    farmingClient,
  };
}
