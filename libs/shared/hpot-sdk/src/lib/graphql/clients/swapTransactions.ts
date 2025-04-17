import { ApolloClient, gql } from '@apollo/client';
import { useSubgraphClient } from '@honeypot/shared';

type SwapTransaction = {
  id: string;
  timestamp: string;
  transaction: {
    id: string;
  };
  sender: string;
  recipient: string;
  token0: {
    symbol: string;
  };
  token1: {
    symbol: string;
  };
  amount0: string;
  amount1: string;
  amountUSD: string;
};

type SwapsResponse = {
  swaps: SwapTransaction[];
};

type SwapTransactionsResponse = {
  status: string;
  message: string;
  data: SwapTransaction[];
  pageInfo: {
    hasNextPage: boolean;
  };
};

export async function fetchSwapTransactions(
  client: ApolloClient<any>,
  page: number = 1,
  pageSize: number = 10,
  token1Address: string,
  token2Address: string
): Promise<SwapTransactionsResponse> {
  const skip = (page - 1) * pageSize;

  const query = `
    query GetUSDTWBERASwaps {
      swaps(
        first: ${pageSize}
        skip: ${skip}
        orderBy: timestamp
        orderDirection: desc
        where: {
        or: [
            {
              token0_: {id: "${token1Address.toLowerCase()}"},
              token1_: {id: "${token2Address.toLowerCase()}"}
            }, 
            {
              token0_: {id: "${token2Address.toLowerCase()}"},
              token1_: {id: "${token1Address.toLowerCase()}"}
            }
          ]
        })
        {
        id
        timestamp
        transaction {
          id
        }
        sender
        recipient
        origin
        token0 {
          symbol
        }
        token1 {
          symbol
        }
        amount0
        amount1
        amountUSD
      }
    }
  `;

  const { data } = await client.query<SwapsResponse>({
    query: gql(query),
  });

  return {
    status: 'success',
    message: 'Success',
    data: data.swaps,
    pageInfo: {
      hasNextPage: data.swaps.length === pageSize,
    },
  };
}

export function useSwapTransactions() {
  const infoClient = useSubgraphClient('algebra_info');

  return {
    fetchTransactions: async (
      page: number = 1,
      pageSize: number = 10,
      token1Address: string,
      token2Address: string
    ) => {
      return fetchSwapTransactions(
        infoClient,
        page,
        pageSize,
        token1Address,
        token2Address
      );
    },
  };
}
