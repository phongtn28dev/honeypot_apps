import { infoClient } from '.';
import {
  GetBitgetEventsDocument,
  GetBitgetEventsQuery,
  GetBitgetEventsQueryVariables,
  useGetBitgetEventsQuery,
} from '../generated/graphql';
import { isAddress } from 'viem';
import { zeroAddress } from 'viem';

export function useBitgetEvents(user: string) {
  const tokenQuery = useGetBitgetEventsQuery({
    variables: { user },
  });

  return tokenQuery.data?.bitgetCampaigns[0];
}
