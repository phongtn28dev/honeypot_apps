import { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { address } = req.query;

  const buildId = 'cu607JcCa4UWAe3Bx2--f'; // You'll need to keep this updated
  const fjordUrl = `https://app.fjordfoundry.com/_next/data/${buildId}/token-sales/${address}.json`;

  try {
    const response = await fetch(fjordUrl);
    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch Fjord data' });
  }
}
