import { NextApiRequest, NextApiResponse } from 'next';
import { cacheProvider, getCacheKey } from '@/lib/server/cache';

const CACHE_TTL = 10; // 缓存时间，单位秒

const GRAPHQL_ENDPOINTS = {
  info: process.env.NEXT_PUBLIC_INFO_GRAPH,
  blocks: process.env.NEXT_PUBLIC_BLOCKS_GRAPH,
  farming: process.env.NEXT_PUBLIC_FARMING_GRAPH,
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { endpoint } = req.query;
  const graphqlEndpoint =
    GRAPHQL_ENDPOINTS[endpoint as keyof typeof GRAPHQL_ENDPOINTS];

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
