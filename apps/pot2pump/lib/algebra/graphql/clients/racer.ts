import { AllRacersDocument, AllRacersQuery } from '../generated/graphql';
import { getSubgraphClientByChainId } from '@honeypot/shared';
import { wallet } from '@honeypot/shared/lib/wallet';

export interface Racer {
  tokenAddress: string;
  currentScore: string;
  tokenHourScore: {
    starttimestamp: string;
    score: string;
    usdAtThisHour: string;
  }[];
  token: {
    initialUSD: string;
    derivedUSD: string;
    totalSupply: string;
  };
}

export async function getAllRacers() {
  const infoClient = getSubgraphClientByChainId(
    wallet.currentChainId.toString(),
    'algebra_info'
  );
  const allRacers = await infoClient.query<AllRacersQuery>({
    query: AllRacersDocument,
  });

  //console.log(allRacers);

  const racers: Racer[] = [];

  allRacers.data.memeRacers.map((racer) => {
    const tokenAddress = racer.id;
    const tokenHourScore = racer.hourData.map((hourData) => {
      return {
        starttimestamp: hourData.timestamp,
        score: hourData.score,
        usdAtThisHour: hourData.usdAtThisHour,
      };
    });

    racers.push({
      tokenAddress: tokenAddress,
      tokenHourScore: tokenHourScore,
      currentScore: racer.currentScore,
      token: {
        initialUSD: racer.token.initialUSD,
        derivedUSD: racer.token.derivedUSD,
        totalSupply: racer.token.totalSupply,
      },
    });
  });

  // console.log(racers);

  return racers;
}
