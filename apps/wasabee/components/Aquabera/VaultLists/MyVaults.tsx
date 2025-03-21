import { useRouter } from 'next/router';
import TokenLogo from '@/components/TokenLogo/TokenLogo';
import { getAccountVaultsList } from '@/lib/algebra/graphql/clients/vaults';
import { AccountVaultSharesQuery } from '@/lib/algebra/graphql/generated/graphql';
import { ICHIVaultContract } from '@/services/contract/aquabera/ICHIVault-contract';
import { Token } from '@/services/contract/token';
import { wallet } from '@/services/wallet';
import { useEffect, useState } from 'react';
import { DepositToVaultModal } from '../modals/DepositToVaultModal';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { observer } from 'mobx-react-lite';
import MyVaultRow from './MyVaultRow';
type SortField =
  | 'pair'
  | 'allow_token'
  | 'tvl'
  | 'volume'
  | 'fees'
  | 'shares'
  | 'user_tvl'
  | 'apr';
type SortDirection = 'asc' | 'desc';

interface MyAquaberaVaultsProps {
  searchString?: string;
}

export const MyAquaberaVaults = observer(
  ({ searchString = '' }: MyAquaberaVaultsProps) => {
    const [vaultsContracts, setVaultsContracts] = useState<ICHIVaultContract[]>(
      []
    );
    const [myVaults, setMyVaults] = useState<AccountVaultSharesQuery>();
    const [sortField, setSortField] = useState<SortField>('apr');
    const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

    const getAllowToken = (vault: any) => {
      return vault.allowToken;
    };

    useEffect(() => {
      if (!wallet.isInit || !myVaults) {
        return;
      }

      myVaults.vaultShares.forEach((vault) => {
        const vaultContract = ICHIVaultContract.getVault({
          token0: vault.vault.tokenA,
          token1: vault.vault.tokenB,
          address: vault.vault.id as `0x${string}`,
          apr: Number(vault.vault.feeApr_1d),
          detailedApr: {
            feeApr_1d: Number(vault.vault.feeApr_1d),
            feeApr_3d: Number(vault.vault.feeApr_3d),
            feeApr_7d: Number(vault.vault.feeApr_7d),
            feeApr_30d: Number(vault.vault.feeApr_30d),
          },
        });
        if (vaultContract) {
          setVaultsContracts((prev) => [...prev, vaultContract]);
        }
      });
    }, [wallet.isInit, myVaults]);

    useEffect(() => {
      if (!wallet.isInit) return;
      loadMyVaults(wallet.account);
    }, [wallet.isInit]);

    const loadMyVaults = async (accountAddress: string) => {
      const myVaultsQuery = await getAccountVaultsList(accountAddress);
      setMyVaults(myVaultsQuery);
    };

    const handleSort = (field: SortField) => {
      if (sortField === field) {
        setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
      } else {
        setSortField(field);
        setSortDirection('desc');
      }
    };

    const getSortedVaults = () => {
      if (!vaultsContracts.length) return [];

      const filteredVaults = vaultsContracts.filter((vault) => {
        if (!searchString) return true;

        const tokenA = Token.getToken({ address: vault.token0?.address ?? '' });
        const tokenB = Token.getToken({ address: vault.token1?.address ?? '' });

        const searchLower = searchString.toLowerCase();
        return (
          vault.address.toLowerCase().includes(searchLower) ||
          tokenA.symbol.toLowerCase().includes(searchLower) ||
          tokenB.symbol.toLowerCase().includes(searchLower)
        );
      });

      return [...filteredVaults].sort((a, b) => {
        const multiplier = sortDirection === 'asc' ? 1 : -1;

        switch (sortField) {
          case 'pair':
            return (
              multiplier *
              (a.token0?.symbol?.localeCompare(b.token0?.symbol ?? '') ?? 0)
            );
          case 'allow_token':
            return (
              multiplier *
              getAllowToken(a)?.symbol.localeCompare(getAllowToken(b)?.symbol)
            );
          case 'tvl':
            return multiplier * (Number(a.tvlUSD || 0) - Number(b.tvlUSD || 0));
          case 'volume':
            return (
              multiplier *
              (Number(a.pool?.volume_24h_USD || 0) -
                Number(b.pool?.volume_24h_USD || 0))
            );
          case 'fees':
            return (
              multiplier *
              (Number(a.pool?.fees_24h_USD || 0) -
                Number(b.pool?.fees_24h_USD || 0))
            );
          case 'shares':
            return multiplier * (Number(a.userShares) - Number(b.userShares));
          case 'user_tvl':
            return multiplier * (Number(a.userTVLUSD) - Number(b.userTVLUSD));
          case 'apr':
            return multiplier * (Number(a.apr) - Number(b.apr));
          default:
            return 0;
        }
      });
    };

    const SortHeader = ({
      field,
      label,
      align = 'right',
    }: {
      field: SortField;
      label: string;
      align?: 'left' | 'right' | 'center';
    }) => (
      <th
        className={`py-4 px-6 cursor-pointer transition-colors text-[#4D4D4D]`}
        onClick={() => handleSort(field)}
      >
        <div
          className={`flex items-center gap-2 ${
            align === 'right'
              ? 'justify-end'
              : align === 'center'
              ? 'justify-center'
              : ''
          }`}
        >
          <span className={label.length > 4 ? 'text-[13px]' : 'text-base'}>
            {label}
          </span>
          <div className="flex flex-col">
            <ChevronUpIcon
              className={`h-3 w-3 ${
                sortField === field && sortDirection === 'asc'
                  ? 'text-black'
                  : 'text-[#4D4D4D]'
              }`}
            />
            <ChevronDownIcon
              className={`h-3 w-3 ${
                sortField === field && sortDirection === 'desc'
                  ? 'text-black'
                  : 'text-[#4D4D4D]'
              }`}
            />
          </div>
        </div>
      </th>
    );

    return (
      <div className="w-full overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <SortHeader field="pair" label="Token Pair" align="left" />
              <SortHeader
                field="allow_token"
                label="Allow Token"
                align="left"
              />
              <SortHeader field="user_tvl" label="Your TVL" />
              <SortHeader field="apr" label="APR" />
            </tr>
          </thead>
          <tbody className="divide-y divide-[#4D4D4D]">
            {!getSortedVaults().length ? (
              <tr className="hover:bg-white border-white h-full">
                <td colSpan={6} className="h-24 text-center text-black">
                  No results.
                </td>
              </tr>
            ) : (
              getSortedVaults().map((vault) => {
                return <MyVaultRow key={vault.address} vault={vault} />;
              })
            )}
          </tbody>
        </table>
      </div>
    );
  }
);

export default MyAquaberaVaults;
