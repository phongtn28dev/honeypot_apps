import { isAddress } from 'viem';
import {
  TokenTop10HoldersDocument,
  TokenTop10HoldersQuery,
  TokenTop10HoldersQueryVariables,
  SingleTokenDocument,
  SingleTokenQuery,
  SingleTokenQueryVariables,
  MultipleTokensQuery,
  MultipleTokensQueryVariables,
  MultipleTokensDocument,
} from '../generated/graphql';
import { getSubgraphClientByChainId } from '@honeypot/shared';
import { wallet } from '@honeypot/shared';

export async function getTokenTop10Holders(tokenId: string) {
  const infoClient = getSubgraphClientByChainId(
    wallet.currentChainId.toString(),
    'algebra_info'
  );
  const tokenQuery = await infoClient.query<
    TokenTop10HoldersQuery,
    TokenTop10HoldersQueryVariables
  >({
    query: TokenTop10HoldersDocument,
    variables: { tokenId },
  });

  return tokenQuery.data;
}

export async function getSingleTokenData(tokenId: string) {
  if (!tokenId || !isAddress(tokenId)) return;
  const infoClient = getSubgraphClientByChainId(
    wallet.currentChainId.toString(),
    'algebra_info'
  );
  const tokenQuery = await infoClient.query<
    SingleTokenQuery,
    SingleTokenQueryVariables
  >({
    query: SingleTokenDocument,
    variables: { tokenId },
  });

  return tokenQuery.data;
}

export async function getMultipleTokensData(tokenIds: string[]) {
  if (!tokenIds || tokenIds.length === 0) return;
  const infoClient = getSubgraphClientByChainId(
    wallet.currentChainId.toString(),
    'algebra_info'
  );
  const tokenQuery = await infoClient.query<
    MultipleTokensQuery,
    MultipleTokensQueryVariables
  >({
    query: MultipleTokensDocument,
    variables: { tokenIds },
  });
  tokenQuery.data.tokens;
  return tokenQuery.data;
}
