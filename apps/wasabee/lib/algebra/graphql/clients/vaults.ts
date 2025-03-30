import { ICHIVaultContract } from '@/services/contract/aquabera/ICHIVault-contract';

import {
  AccountVaultSharesDocument,
  AccountVaultSharesQuery,
  AccountVaultSharesQueryResult,
  VaultShare,
  VaultsSortedByHoldersDocument,
  VaultsSortedByHoldersQuery,
  SingleVaultDetailsDocument,
  SingleVaultDetailsQuery,
  IchiVault,
} from '../generated/graphql';
import {
  ACCOUNT_VAULT_SHARES,
  VAULTS_SORTED_BY_HOLDERS,
  SINGLE_VAULT_DETAILS,
} from '../queries/vaults';
import { Address } from 'viem';
import { Token } from '@/services/contract/token';
import { poolQueryToContract } from './pool';
import BigNumber from 'bignumber.js';
import { useInfoClient } from '@/lib/hooks/useSubgraphClients';
import { ApolloClient } from '@apollo/client';
import { createClientHook } from '../clientUtils';

export const vaultQueryResToVaultContract = (
  vault: IchiVault
): ICHIVaultContract => {
  const vaultContract = ICHIVaultContract.getVault({
    address: vault.id as Address,
    allowToken0: vault.allowTokenA,
    allowToken1: vault.allowTokenB,
    holderCount: BigInt(vault.holdersCount),
    isInitialized: true,
    apr: vault.feeApr_30d,
  });

  if (!vaultContract) {
    throw new Error('Vault contract not found');
  }

  vaultContract.token0 = new Token({
    address: vault.tokenA as Address,
  });

  vaultContract.token1 = new Token({
    address: vault.tokenB as Address,
  });

  vaultContract.recentTransactions = [
    ...vault.vaultDeposits,
    ...vault.vaultWithdraws,
  ].sort((a, b) => Number(b.createdAtTimestamp) - Number(a.createdAtTimestamp));

  vaultContract.pool = poolQueryToContract(vault.pool);

  vaultContract.token0.init();
  vaultContract.token1.init();

  return vaultContract;
};

export async function getAccountVaultsList(
  client: ApolloClient<any>,
  accountAddress: string
): Promise<AccountVaultSharesQuery> {
  console.log(AccountVaultSharesDocument);

  const vaults = await client.query<AccountVaultSharesQuery>({
    query: AccountVaultSharesDocument,
    variables: {
      AccountId: accountAddress.toLowerCase(),
    },
  });

  console.log(vaults);

  return vaults.data;
}

export async function getVaultPageData(
  client: ApolloClient<any>,
  search?: string
): Promise<VaultsSortedByHoldersQuery> {
  const vaults = await client.query<VaultsSortedByHoldersQuery>({
    query: VaultsSortedByHoldersDocument,
    variables: {
      search: search ?? '',
    },
  });

  return vaults.data;
}

export async function getSingleVaultDetails(
  client: ApolloClient<any>,
  vaultId: string
): Promise<ICHIVaultContract | null> {
  try {
    const result = await client.query<SingleVaultDetailsQuery>({
      query: SingleVaultDetailsDocument,
      variables: {
        vaultId: vaultId.toLowerCase(),
      },
    });

    if (!result.data) {
      throw new Error('No data returned from query');
    }

    // Add data validation and transformation here if needed
    return vaultQueryResToVaultContract(result.data.ichiVault as IchiVault);
  } catch (error) {
    console.error('Error fetching vault details:', error);
    // Return an empty or default response structure
    return null;
  }
}

// 创建一个自定义Hook来包装这些函数
export const useVaultsClient = createClientHook(useInfoClient, {
  getAccountVaultsList,
  getVaultPageData,
  getSingleVaultDetails,
});
