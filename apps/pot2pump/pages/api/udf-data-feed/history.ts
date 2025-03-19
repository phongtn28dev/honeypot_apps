// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { trpc, trpcClient, trpcQueryClient } from '@/lib/trpc';
import { resolutionType } from '@/services/priceFeed/priceFeedTypes';
import { priceFeedRouter } from '@/server/router/priceFeed';
import Trpc from '../trpc/[trpc]';
import { appRouter, caller } from '@/server/_app';
import BigNumber from 'bignumber.js';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  //   Object.entries(req.query).forEach(([key, value]) => {
  //     console.log(key, value);
  //   });

  const ticker = req.query.symbol as string;
  const resolution = req.query.resolution as resolutionType;
  const from = req.query.from as string;
  const to = req.query.to as string;

  const [
    symbol,
    chain,
    address,
    tokenNumber,
    currencyCode,
    totalSupply = '0',
    quoteMetric = 'PRICE',
  ] = ticker.split(':');

  const data = await caller.priceFeed.getChartData({
    chainId: chain,
    tokenAddress: address,
    from: parseInt(from),
    to: parseInt(to),
    resolution: resolution,
    tokenNumber: Number(tokenNumber),
    currencyCode: currencyCode as 'USD' | 'TOKEN' | undefined,
  });

  if (data.status === 'success') {
    // 当需要显示市值时，将价格乘以总供应量
    if (quoteMetric === 'MCAP' && totalSupply && totalSupply !== '0') {
      const supplyBN = new BigNumber(totalSupply);
      const calculateMcap = (price: number) =>
        new BigNumber(price).multipliedBy(supplyBN).toString();

      res.status(200).json({
        s: 'ok',
        t: data.data.getBars.t,
        o: data.data.getBars.o.map(calculateMcap),
        h: data.data.getBars.h.map(calculateMcap),
        l: data.data.getBars.l.map(calculateMcap),
        c: data.data.getBars.c.map(calculateMcap),
        v: data.data.getBars.v,
      });
    } else {
      res.status(200).json({ s: 'ok', ...data.data.getBars });
    }
  } else if (data.status === 'error') {
    return res.status(500).json({ s: 'error', errmsg: data.message });
  }
}
