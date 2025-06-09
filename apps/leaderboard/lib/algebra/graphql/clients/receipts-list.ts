import { ApolloClient } from '@apollo/client';
import { Receipt, ReceiptsListDocument } from '../__generated__/graphql';
import { createClientHook } from '../clientUtils';
import { useSubgraphClient } from '@honeypot/shared';

export async function fetchListReceiptsPerUser(
  client: ApolloClient<any>,
  accountId: string
) {
  const { data } = await client.query<{ receipts: Receipt[] }>({
    query: ReceiptsListDocument,
    fetchPolicy: 'network-only',
    variables: { user: accountId.toLowerCase() },
  });
  return data;
}
