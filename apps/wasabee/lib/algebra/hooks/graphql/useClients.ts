import {
  useFarmingClient,
  useInfoClient,
} from '@/lib/hooks/useSubgraphClients';

export function useClients() {
  const infoClient = useInfoClient();
  const farmingClient = useFarmingClient();

  return {
    infoClient,
    farmingClient,
  };
}
