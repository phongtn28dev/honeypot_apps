import { infoClient } from '.';
import {
  BitgetCampaignParticipant,
  GetBitgetEventsParticipantListDocument,
  GetBitgetEventsParticipantListQuery,
  GetBitgetEventsParticipantListQueryVariables,
  GetSingleBitgetParticipantInfoDocument,
  GetSingleBitgetParticipantInfoQuery,
  GetSingleBitgetParticipantInfoQueryVariables,
  useGetBitgetEventsQuery,
} from '../generated/graphql';
import { isAddress } from 'viem';
import { zeroAddress } from 'viem';

const EVENT_REWARD_EACH_POOL = 400; //BERA

export function useBitgetEvents(user: string) {
  const tokenQuery = useGetBitgetEventsQuery({
    variables: { user },
  });

  return tokenQuery.data?.bitgetCampaigns[0];
}

export async function getFullBitgetEventsParticipantList() {
  let hasMore = true;
  let skip = 0;
  const participants: BitgetCampaignParticipant[] = [];
  const output: Record<
    string,
    {
      participatedAmountUsd: number;
      eachPoolParticipatedAmountUsd: Record<string, number>;
      rewardAmountBERA: number;
    }
  > = {};

  while (hasMore) {
    const tokenQuery = await infoClient.query<
      GetBitgetEventsParticipantListQuery,
      GetBitgetEventsParticipantListQueryVariables
    >({
      query: GetBitgetEventsParticipantListDocument,
      variables: { skip, first: 1000 },
    });

    participants.push(
      ...(tokenQuery.data
        ?.bitgetCampaignParticipants as BitgetCampaignParticipant[])
    );

    if (tokenQuery.data?.bitgetCampaignParticipants.length < 1000) {
      hasMore = false;
    } else {
      skip += 1000;
    }
  }

  // refactor the participants array to be a map of each participant by their id
  participants.forEach((participant) => {
    if (!output[participant.user.id]) {
      output[participant.user.id] = {
        participatedAmountUsd: Number(participant.amountUSD),
        eachPoolParticipatedAmountUsd: {
          [participant.pool.id]: Number(participant.amountUSD),
        },
        rewardAmountBERA:
          (Number(participant.amountUSD) /
            Number(participant.pool.totalVolumeUSD)) *
          EVENT_REWARD_EACH_POOL,
      };
    } else {
      output[participant.user.id].participatedAmountUsd += Number(
        participant.amountUSD
      );
      output[participant.user.id].eachPoolParticipatedAmountUsd[
        participant.pool.id
      ] = Number(participant.amountUSD);
      output[participant.user.id].rewardAmountBERA +=
        (Number(participant.amountUSD) /
          Number(participant.pool.totalVolumeUSD)) *
        EVENT_REWARD_EACH_POOL;
    }
  });

  return output;
}

export async function getSingleBitgetParticipantInfo(user: string) {
  const tokenQuery = await infoClient.query<
    GetSingleBitgetParticipantInfoQuery,
    GetSingleBitgetParticipantInfoQueryVariables
  >({
    query: GetSingleBitgetParticipantInfoDocument,
    variables: { user },
  });

  return tokenQuery.data?.bitgetCampaignParticipants;
}
