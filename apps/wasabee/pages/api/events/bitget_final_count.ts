import { put } from '@vercel/blob';
import type { NextApiResponse, NextApiRequest, PageConfig } from 'next';
import { getAccountSwapsWithPools } from '@/lib/algebra/graphql/clients/account';
import { getFullBitgetEventsParticipantList } from '@/lib/algebra/graphql/clients/bitget_event';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const participants = await getFullBitgetEventsParticipantList();

  const checkTotalBeraReward = Object.values(participants).reduce(
    (acc, participant) => acc + participant.rewardAmountBERA,
    0
  );

  return response.status(200).json(participants);
}
