import { ApolloClient, gql } from '@apollo/client';
import { TOKEN_SUPPORT_QUERY } from '../queries/token-support';

type ItemTokenSupportResponse = {
  id: string;
  weight: string;
}

type ListTokenSupportResponse = {
  supportReceipts: {
    items: ItemTokenSupportResponse[];
  };
};

export async function getListTokenSupport(client: ApolloClient<any>) {
  const { data } = await client.query<ListTokenSupportResponse>({
    query: TOKEN_SUPPORT_QUERY,
    fetchPolicy: 'network-only',
  });
  return data.supportReceipts.items;
}
