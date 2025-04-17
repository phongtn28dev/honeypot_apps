import { getSubgraphClientByChainId } from '@honeypot/shared';
import { wallet } from '@honeypot/shared';
import {
  AllAccountsQuery,
  SingleAccountDetailsDocument,
  SingleAccountDetailsQuery,
  SingleAccountDetailsQueryVariables,
} from '../generated/graphql';
import { All_Accounts, SINGLE_ACCOUNT_DETAILS } from '../queries/account';

export async function getAccountsPageData() {
  const infoClient = getSubgraphClientByChainId(
    wallet.currentChainId.toString(),
    'algebra_info'
  );
  const accountsQuery = await infoClient.query<AllAccountsQuery>({
    query: All_Accounts,
    fetchPolicy: 'network-only',
    variables: {
      orderBy: 'platformTxCount',
      orderDirection: 'desc',
    },
  });

  return accountsQuery.data;
}

export async function getSingleAccountDetails(accountId: string) {
  const infoClient = getSubgraphClientByChainId(
    wallet.currentChainId.toString(),
    'algebra_info'
  );
  try {
    const accountQuery = await infoClient.query<
      SingleAccountDetailsQuery,
      SingleAccountDetailsQueryVariables
    >({
      query: SingleAccountDetailsDocument,
      variables: {
        accountId: accountId.toLowerCase(),
      },
      fetchPolicy: 'network-only',
    });

    if (!accountQuery.data) {
      throw new Error('No data returned from single account query');
    }

    return accountQuery.data;
  } catch (error) {
    console.error('Error fetching single account details:', error);
    throw error;
  }
}
