import { wallet } from '@/services/wallet';
import { Token } from '@/services/contract/token';
import { useEffect, useState, useMemo } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '@/components/algebra/ui/button';
import { DepositToVaultModal } from '../modals/DepositToVaultModal';
import {
  getSingleVaultDetails,
  getVaultPageData,
} from '@/lib/algebra/graphql/clients/vaults';
import { VaultsSortedByHoldersQuery } from '@/lib/algebra/graphql/generated/graphql';
import { ICHIVaultContract } from '@/services/contract/aquabera/ICHIVault-contract';
import VaultRow from './VaulltRow';

type SortField =
  | 'pair'
  | 'allow_token'
  | 'address'
  | 'tvl'
  | 'volume'
  | 'fees'
  | 'apr';
type SortDirection = 'asc' | 'desc';

interface AllAquaberaVaultsProps {
  searchString?: string;
}

export function AllAquaberaVaults({
  searchString = '',
}: AllAquaberaVaultsProps) {
  const [vaultsContracts, setVaultsContracts] = useState<ICHIVaultContract[]>(
    []
  );
  const [vaults, setVaults] = useState<VaultsSortedByHoldersQuery>();
  const [sortField, setSortField] = useState<SortField>('apr');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    if (!wallet.isInit || !vaults) {
      return;
    }

    vaults.ichiVaults.forEach((vault) => {
      const vaultContract = ICHIVaultContract.getVault({
        token0: vault.tokenA,
        token1: vault.tokenB,
        address: vault.id as `0x${string}`,
        apr: Number(vault.feeApr_1d),
        detailedApr: {
          feeApr_1d: Number(vault.feeApr_1d),
          feeApr_3d: Number(vault.feeApr_3d),
          feeApr_7d: Number(vault.feeApr_7d),
          feeApr_30d: Number(vault.feeApr_30d),
        },
      });
      if (vaultContract) {
        setVaultsContracts((prev) => [...prev, vaultContract]);
      }
    });
  }, [wallet.isInit, vaults]);

  useEffect(() => {
    if (!wallet.isInit) {
      return;
    }
    loadMyVaults(searchString);
  }, [searchString]);

  const loadMyVaults = async (search?: string) => {
    const vaultsQuery = getVaultPageData(search).then((res) => {
      setVaults(res);
    });
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const pages = useMemo(() => {
    if (!vaults?.ichiVaults) return 0;
    return Math.ceil(vaults.ichiVaults.length / rowsPerPage);
  }, [vaults?.ichiVaults]);

  const [sortedVaults, setSortedVaults] = useState<ICHIVaultContract[]>([]);

  const getAllowToken = (vault: any) => {
    return vault.allowToken;
  };

  useEffect(() => {
    const getSortedVaults = () => {
      if (!vaultsContracts.length) return [];

      const sortedVaults = [...vaultsContracts].sort((a, b) => {
        const multiplier = sortDirection === 'asc' ? 1 : -1;

        switch (sortField) {
          case 'pair':
            const aSymbol = Token.getToken({
              address: a.token0?.address ?? '',
            }).symbol;
            const bSymbol = Token.getToken({
              address: b.token0?.address ?? '',
            }).symbol;
            return multiplier * aSymbol.localeCompare(bSymbol);
          case 'allow_token':
            return (
              multiplier *
              getAllowToken(a)?.symbol.localeCompare(getAllowToken(b)?.symbol)
            );
          case 'address':
            return multiplier * a.address.localeCompare(b.address);
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
          case 'apr':
            return multiplier * (Number(a.apr || 0) - Number(b.apr || 0));
          default:
            return 0;
        }
      });

      const start = (page - 1) * rowsPerPage;
      const end = start + rowsPerPage;
      const list = sortedVaults.slice(start, end);

      return list;
    };

    const sortedVaults = getSortedVaults();
    setSortedVaults(sortedVaults);
  }, [vaultsContracts, sortField, sortDirection, page]);

  return (
    <div className="w-full">
      <div className="w-full overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th className="py-4 px-6 cursor-pointer text-[#4D4D4D]">
                <div
                  className="flex items-center gap-2"
                  onClick={() => handleSort('pair')}
                >
                  <span>Token Pair</span>
                  <div className="flex flex-col">
                    <ChevronUp
                      className={`h-3 w-3 ${
                        sortField === 'pair' && sortDirection === 'asc'
                          ? 'text-black'
                          : 'text-[#4D4D4D]'
                      }`}
                    />
                    <ChevronDown
                      className={`h-3 w-3 ${
                        sortField === 'pair' && sortDirection === 'desc'
                          ? 'text-black'
                          : 'text-[#4D4D4D]'
                      }`}
                    />
                  </div>
                </div>
              </th>
              <th className="py-4 px-6 cursor-pointer text-[#4D4D4D] min-w-[180px]">
                <div
                  className="flex items-center gap-2"
                  onClick={() => handleSort('pair')}
                >
                  <span>Allow Token</span>
                  <div className="flex flex-col">
                    <ChevronUp
                      className={`h-3 w-3 ${
                        sortField === 'pair' && sortDirection === 'asc'
                          ? 'text-black'
                          : 'text-[#4D4D4D]'
                      }`}
                    />
                    <ChevronDown
                      className={`h-3 w-3 ${
                        sortField === 'pair' && sortDirection === 'desc'
                          ? 'text-black'
                          : 'text-[#4D4D4D]'
                      }`}
                    />
                  </div>
                </div>
              </th>
              <th className="py-4 px-6 cursor-pointer text-right text-[#4D4D4D]">
                <div
                  className="flex items-center gap-2 justify-end"
                  onClick={() => handleSort('tvl')}
                >
                  <span>Vault TVL</span>
                  <div className="flex flex-col">
                    <ChevronUp
                      className={`h-3 w-3 ${
                        sortField === 'tvl' && sortDirection === 'asc'
                          ? 'text-black'
                          : 'text-[#4D4D4D]'
                      }`}
                    />
                    <ChevronDown
                      className={`h-3 w-3 ${
                        sortField === 'tvl' && sortDirection === 'desc'
                          ? 'text-black'
                          : 'text-[#4D4D4D]'
                      }`}
                    />
                  </div>
                </div>
              </th>
              <th className="py-4 px-6 cursor-pointer text-right text-[#4D4D4D]">
                <div
                  className="flex items-center gap-2 justify-end"
                  onClick={() => handleSort('volume')}
                >
                  <span>Pool 24h Volume</span>
                  <div className="flex flex-col">
                    <ChevronUp
                      className={`h-3 w-3 ${
                        sortField === 'volume' && sortDirection === 'asc'
                          ? 'text-black'
                          : 'text-[#4D4D4D]'
                      }`}
                    />
                    <ChevronDown
                      className={`h-3 w-3 ${
                        sortField === 'volume' && sortDirection === 'desc'
                          ? 'text-black'
                          : 'text-[#4D4D4D]'
                      }`}
                    />
                  </div>
                </div>
              </th>
              <th className="py-4 px-6 cursor-pointer text-right text-[#4D4D4D]">
                <div
                  className="flex items-center gap-2 justify-end"
                  onClick={() => handleSort('fees')}
                >
                  <span>Pool 24h Fees</span>
                  <div className="flex flex-col">
                    <ChevronUp
                      className={`h-3 w-3 ${
                        sortField === 'fees' && sortDirection === 'asc'
                          ? 'text-black'
                          : 'text-[#4D4D4D]'
                      }`}
                    />
                    <ChevronDown
                      className={`h-3 w-3 ${
                        sortField === 'fees' && sortDirection === 'desc'
                          ? 'text-black'
                          : 'text-[#4D4D4D]'
                      }`}
                    />
                  </div>
                </div>
              </th>
              <th className="py-4 px-6 cursor-pointer text-right text-[#4D4D4D]">
                <div
                  className="flex items-center gap-2 justify-end"
                  onClick={() => handleSort('apr')}
                >
                  <span>APR</span>
                  <div className="flex flex-col">
                    <ChevronUp
                      className={`h-3 w-3 ${
                        sortField === 'apr' && sortDirection === 'asc'
                          ? 'text-black'
                          : 'text-[#4D4D4D]'
                      }`}
                    />
                    <ChevronDown
                      className={`h-3 w-3 ${
                        sortField === 'apr' && sortDirection === 'desc'
                          ? 'text-black'
                          : 'text-[#4D4D4D]'
                      }`}
                    />
                  </div>
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#4D4D4D]">
            {!sortedVaults.length ? (
              <tr className="hover:bg-white border-white h-full">
                <td colSpan={5} className="h-24 text-center text-black">
                  No results.
                </td>
              </tr>
            ) : (
              sortedVaults.map((vault) => {
                return <VaultRow key={vault.address} vault={vault} />;
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t border-[#2D2D2D]">
        <div className="flex justify-between items-center">
          <span className="text-black">
            Page {page} of {pages}
          </span>
          <div className="flex gap-x-2">
            <Button
              className="border border-[#2D2D2D] bg-white hover:bg-gray-50 text-black rounded-2xl shadow-[2px_2px_0px_0px_#000] px-4 py-2"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Previous
            </Button>
            <Button
              className="border border-[#2D2D2D] bg-white hover:bg-gray-50 text-black rounded-2xl shadow-[2px_2px_0px_0px_#000] px-4 py-2"
              disabled={page === pages}
              onClick={() => setPage(page + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AllAquaberaVaults;
