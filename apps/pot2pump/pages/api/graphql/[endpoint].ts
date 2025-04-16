import { NextApiRequest, NextApiResponse } from 'next';
import { cacheProvider, getCacheKey } from '@/lib/server/cache';
import { DEFAULT_CHAIN_ID, subgraphAddresses } from '@honeypot/shared';

type ENDPOINTS = 'info' | 'farming';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  const chainId = DEFAULT_CHAIN_ID;
  const { endpoint } = req.query as {
    endpoint: ENDPOINTS;
  };
  console.log('endpoint', { endpoint, chainId });
  let graphqlEndpoint: string | undefined;
  if (endpoint === 'info') {
    graphqlEndpoint = subgraphAddresses[chainId].algebra_info;
  } else if (endpoint === 'farming') {
    graphqlEndpoint = subgraphAddresses[chainId].algebra_farming;
  }

  if (!graphqlEndpoint) {
    return res.status(400).json({ message: 'Invalid endpoint' });
  }

  try {
    const cacheKey = getCacheKey(`graphql:${endpoint}`, req.body);

    const data = await cacheProvider.getOrSet(cacheKey, async () => {
      const response = await fetch(graphqlEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(req.body),
      });
      return response.json();
    });

    return res.status(200).json(data);
  } catch (error) {
    console.error('GraphQL proxy error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
