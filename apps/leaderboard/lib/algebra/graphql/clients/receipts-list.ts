import { ApolloClient, gql } from '@apollo/client';
import { RECEIPTS_LIST } from '../queries/receipts-list';

export async function fetchListReceiptsPerUser(
  client: ApolloClient<any>,
  accountId: string
) {
  const { data } = await client.query({
    query: RECEIPTS_LIST,
    fetchPolicy: 'network-only',
    variables: { user: accountId },
  });
  return data;
}
