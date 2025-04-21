// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { resolutionType } from '@/services/priceFeed/priceFeedTypes';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { priceFeedCaller } = await import('@/server/routers/priceFeedCaller');

  const ticker = req.query.symbol as string;
  const resolution = req.query.resolution as resolutionType;
  const from = req.query.from as string;
  const to = req.query.to as string;

  if (!ticker || !from || !to || !resolution) {
    return res
      .status(400)
      .json({ s: 'error', errmsg: 'Missing required query parameters' });
  }
  const [symbol, chain, address, tokenNumber, currencyCode] = (
    ticker || ''
  ).split(':');

  const data = await priceFeedCaller.priceFeed.getChartData({
    chainId: chain,
    tokenAddress: address,
    from: parseInt(from),
    to: parseInt(to),
    resolution: resolution,
    tokenNumber: Number(tokenNumber),
    currencyCode: currencyCode as 'USD' | 'TOKEN' | undefined,
  });

  if (data.status === 'success') {
    res.status(200).json({
      s: 'ok',
      ...data.data.getBars,
    });
  } else if (data.status === 'error') {
    return res.status(500).json({
      s: 'error',
      errmsg: data.message,
    });
  }
}
