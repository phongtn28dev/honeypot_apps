import {
  GetBitgetEventsDocument,
  GetBitgetEventsQuery,
  GetBitgetEventsQueryVariables,
  useGetBitgetEventsQuery,
} from '../generated/graphql';
import { isAddress } from 'viem';
import { zeroAddress } from 'viem';
import {
  getInfoClientByChainId,
  useInfoClient,
} from '@/lib/hooks/useSubgraphClients';
import { DEFAULT_CHAIN_ID } from '@/config/algebra/default-chain-id';

export function useBitgetEvents(user: string) {
  const infoClient = useInfoClient();

  const tokenQuery = useGetBitgetEventsQuery({
    variables: { user },
    client: infoClient,
  });

  console.log('tokenQuery', tokenQuery.data);

  return tokenQuery.data?.bitgetCampaigns[0];
}
