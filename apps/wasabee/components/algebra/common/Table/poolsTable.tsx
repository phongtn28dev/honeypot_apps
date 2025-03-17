import { Pool } from './poolsColumns';
import { cn } from '@/lib/tailwindcss';
import { Search, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Tab, Tabs } from '@nextui-org/react';
import { popmodal } from '@/services/popmodal';
import { Token } from '@/services/contract/token';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/algebra/ui/button';
import TokenLogo from '@/components/TokenLogo/TokenLogo';
import CreatePoolForm from '../../create-pool/CreatePoolForm';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { LoadingDisplay } from '@/components/LoadingDisplay/LoadingDisplay';
import { formatExtremelyLargeNumber } from '@/lib/format';
import { observer, useObserver } from 'mobx-react-lite';
import { wallet } from '@/services/wallet';
import { formatUSD } from '@/lib/algebra/utils/common/formatUSD';
import { optionsPresets } from '@/components/OptionsDropdown/OptionsDropdown';
import { OptionsDropdown } from '@/components/OptionsDropdown/OptionsDropdown';
import { TbSwitch, TbSwitchHorizontal } from 'react-icons/tb';

interface PoolsTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  columnsMy: ColumnDef<TData, TValue>[];
  data: TData[];
  userPools: TData[];
  action?: (args?: any) => void;
  defaultSortingID?: string;
  link?: string;
  showPagination?: boolean;
  searchID?: string;
  loading?: boolean;
  sorting: any;
  setSorting: any;
  defaultFilter?: string;
  showOptions?: boolean;
  handleSearch: (data: string) => void;
}

type SortField =
  | 'pool'
  | 'tvl'
  | 'volume'
  | 'apr'
  | 'unclaimedFees'
  | 'feesUSD'
  | 'user_tvl';
type SortDirection = 'asc' | 'desc';

const PoolsTable = observer(
  <TData, TValue>({
    columns,
    columnsMy,
    data,
    userPools,
    action,
    link,
    showPagination = true,
    loading,
    defaultFilter = 'trending',
    showOptions = true,
    handleSearch,
  }: PoolsTableProps<TData, TValue>) => {
    const walletClient = useObserver(() => {
      return wallet.walletClient;
    });
    const [selectedFilter, setSelectedFilter] = useState<string>(defaultFilter);
    const [search, setSearch] = useState('');
    const [sortField, setSortField] = useState<SortField>('tvl');
    const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
    const [page, setPage] = useState(1);

    const filters = [
      { key: 'trending', label: 'All Pools' },
      { key: 'myPools', label: 'My Pools' },
    ];

    const [tableData, setTableData] = useState<
      (Pool & { userTVLUSD: number })[]
    >([]);

    useEffect(() => {
      if (!wallet.isInit) return;
      if (selectedFilter === 'myPools') {
        setTableData(userPools as (Pool & { userTVLUSD: number })[]);
      } else {
        setTableData(data as (Pool & { userTVLUSD: number })[]);
      }
    }, [data, selectedFilter, userPools, wallet.isInit]);

    useEffect(() => {
      const timer = setTimeout(() => {
        handleSearch(search.toLowerCase());
      }, 500);

      return () => clearTimeout(timer);
    }, [search]);

    const handleSort = (field: SortField) => {
      setPage(1);
      if (sortField === field) {
        setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
      } else {
        setSortField(field);
        setSortDirection('desc');
      }
    };

    const getSortedPools = () => {
      const sortedPools = [...tableData].sort((a, b) => {
        const multiplier = sortDirection === 'asc' ? 1 : -1;

        switch (sortField) {
          case 'pool':
            return (
              multiplier *
              (a.pair.token0.symbol + a.pair.token1.symbol).localeCompare(
                b.pair.token0.symbol + b.pair.token1.symbol
              )
            );
          case 'tvl':
            return multiplier * (Number(a.tvlUSD) - Number(b.tvlUSD));
          case 'user_tvl':
            return multiplier * (Number(a.userTVLUSD) - Number(b.userTVLUSD));
          case 'volume':
            return multiplier * (Number(a.volume24USD) - Number(b.volume24USD));
          case 'apr':
            return multiplier * (Number(a.apr24h) - Number(b.apr24h));
          case 'unclaimedFees':
            return (
              multiplier * (Number(a.unclaimedFees) - Number(b.unclaimedFees))
            );
          case 'feesUSD':
            return multiplier * (Number(a.fees24USD) - Number(b.fees24USD));
          default:
            return 0;
        }
      });

      return sortedPools.slice((page - 1) * 10, page * 10);
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
          <span>{label}</span>
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
      <div className="flex flex-col gap-4 w-full">
        {showOptions && (
          <div className="flex flex-col xl:flex-row gap-4 w-full xl:justify-between xl:items-center">
            <div className="flex items-center xl:gap-x-6 w-full xl:w-fit justify-between">
              <Tabs
                classNames={{
                  base: 'relative w-full',
                  tabList:
                    'flex rounded-2xl border border-[#202020] bg-white p-4 shadow-[2px_2px_0px_0px_#000] py-2 px-3.5 ml-auto z-10',
                  cursor:
                    'bg-[#FFCD4D] border border-black shadow-[2px_2px_0px_0px_#000000] text-sm',
                  panel: 'w-full',
                  tabContent: '!text-[#202020]',
                }}
                onSelectionChange={(key) =>
                  setSelectedFilter(key === 'all' ? 'trending' : 'myPools')
                }
                defaultSelectedKey={
                  selectedFilter === 'trending' ? 'all' : 'myPools'
                }
              >
                <Tab key="all" title="All Pools" />
                <Tab
                  href="/profile?tab=my-pools"
                  key="myPools"
                  title="My Pools"
                />
              </Tabs>
              <div className="relative">
                <input
                  placeholder="Search"
                  value={search}
                  type="text"
                  onChange={(event) => setSearch(event.target.value)}
                  className="border border-[#2D2D2D] bg-white text-black pl-10 pr-4 py-2 h-12 w-[319px] rounded-2xl shadow-[2px_2px_0px_0px_#000] placeholder:text-[#4D4D4D]/70 focus:outline-none"
                />
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4D4D4D]"
                  size={20}
                />
              </div>
            </div>
            <div className="flex items-center gap-x-5">
              <Button
                className={cn(
                  'flex items-center gap-x-1 p-2.5 cursor-pointer border border-[#2D2D2D] bg-[#FFCD4D] rounded-2xl shadow-[2px_2px_0px_0px_#000] hover:bg-[#FFD666]'
                )}
                onClick={() =>
                  popmodal.openModal({
                    content: <CreatePoolForm />,
                    boarderLess: true,
                    shouldCloseOnInteractOutside: false,
                  })
                }
                disabled={!walletClient}
              >
                <Plus className="text-black" />
                <span className="text-black">Create Pool</span>
              </Button>
            </div>
          </div>
        )}

        <div className="custom-dashed-3xl w-full p-6 bg-white overflow-x-auto">
          {!loading ? (
            <table className="w-full">
              <thead>
                <tr>
                  <SortHeader field="pool" label="Pool" align="left" />
                  {defaultFilter === 'trending' && (
                    <>
                      <SortHeader field="tvl" label="TVL" />
                      <SortHeader field="volume" label="Volume 24H" />
                      <SortHeader field="feesUSD" label="Fee 24H" />
                    </>
                  )}
                  <SortHeader field="apr" label="APR" />
                  {defaultFilter === 'myPools' && (
                    <>
                      <SortHeader field="user_tvl" label="My TVL" />
                      <SortHeader
                        field="unclaimedFees"
                        label="Unclaimed Fees"
                        align="center"
                      />
                    </>
                  )}
                  <th className="py-4 px-6 text-center text-[#4D4D4D]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#4D4D4D]">
                {!getSortedPools().length ? (
                  <tr className="hover:bg-white border-white h-full w-full">
                    <td
                      colSpan={columns.length}
                      className="h-24 text-center text-black"
                    >
                      No results.
                    </td>
                  </tr>
                ) : (
                  getSortedPools().map(
                    (pool: Pool & { userTVLUSD: number }) => (
                      <tr
                        key={pool.id}
                        className="transition-colors bg-white text-black  hover:bg-gray-50 cursor-pointer"
                        onClick={() => {
                          if (action) {
                            action(pool.id);
                          } else if (link) {
                            window.location.href = `/${link}/${pool.id}`;
                          }
                        }}
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1">
                              <TokenLogo
                                token={Token.getToken({
                                  address: pool.pair.token0.id,
                                  chainId: wallet.currentChainId.toString(),
                                })}
                                addtionalClasses="translate-x-[25%]"
                                size={24}
                              />
                              <TokenLogo
                                token={Token.getToken({
                                  address: pool.pair.token1.id,
                                  chainId: wallet.currentChainId.toString(),
                                })}
                                addtionalClasses="translate-x-[-25%]"
                                size={24}
                              />
                            </div>
                            <div className="flex flex-col">
                              <p className="text-black font-medium">
                                {pool.pair.token0.symbol}/
                                {pool.pair.token1.symbol}
                              </p>
                              <p className="text-black/60 text-sm">
                                base fee {pool.fee}%
                              </p>
                            </div>
                          </div>
                        </td>
                        {defaultFilter === 'trending' && (
                          <>
                            <td className="py-4 px-6 text-right">
                              <div className="flex flex-col">
                                <span className="text-black font-mono">
                                  {formatExtremelyLargeNumber(pool.tvlUSD)}
                                </span>
                              </div>
                            </td>
                            <td className="py-4 px-6 text-right">
                              <div className="flex flex-col">
                                <span className="text-black font-mono">
                                  {formatExtremelyLargeNumber(pool.volume24USD)}
                                </span>
                                <span
                                  className={`text-xs ${
                                    Number(pool.change24h) > 0 &&
                                    'text-[#4ADE80]'
                                  } ${
                                    Number(pool.change24h) < 0 &&
                                    'text-[#FF5555]'
                                  }`}
                                >
                                  {Number(pool.change24h) > 0 ? '+' : ''}
                                  {Number(pool.change24h).toFixed(2)}%
                                </span>
                              </div>
                            </td>
                            <td className="py-4 px-6 text-right">
                              <div className="flex flex-col">
                                <span className="text-black">
                                  {formatUSD.format(pool.fees24USD)}
                                </span>
                              </div>
                            </td>
                          </>
                        )}
                        <td className="py-4 px-6 text-right">
                          <div className="flex flex-col">
                            <span className="text-black">
                              {Number(pool.apr24h).toFixed(2)}%
                            </span>
                          </div>
                        </td>
                        {defaultFilter === 'myPools' && (
                          <>
                            <td className="py-4 px-6 text-right">
                              <div className="flex flex-col">
                                <span className="text-black">
                                  {formatExtremelyLargeNumber(pool.userTVLUSD)}
                                </span>
                              </div>
                            </td>
                            <td className="py-4 px-6 text-center">
                              <span className="text-black">
                                ${Number(pool.unclaimedFees).toLocaleString()}
                              </span>
                            </td>
                          </>
                        )}
                        <td className="py-4 px-6 text-center">
                          <OptionsDropdown
                            className="min-h-0 h-[unset] bg-white text-black"
                            options={[
                              optionsPresets.copy({
                                copyText: pool.id,
                                displayText: 'Copy Pool address',
                                copysSuccessText: 'Pool address copied',
                              }),
                              optionsPresets.viewOnExplorer({
                                address: pool.id,
                              }),
                              {
                                icon: <TbSwitchHorizontal />,
                                display: 'Swap',
                                onClick: () => {
                                  window.location.href = `/swap?inputCurrency=${pool.pair.token0.id}&outputCurrency=${pool.pair.token1.id}`;
                                },
                              },
                            ]}
                          />
                        </td>
                      </tr>
                    )
                  )
                )}
              </tbody>
            </table>
          ) : (
            <LoadingDisplay />
          )}

          {showPagination && tableData.length > 10 && (
            <div className="p-4 border-t border-[#2D2D2D]">
              <div className="flex justify-between items-center">
                <span className="text-black">
                  Page {page} of {Math.ceil(tableData.length / 10)}
                </span>
                <div className="flex gap-x-2">
                  <Button
                    className="border border-[#2D2D2D] bg-white hover:bg-gray-50 text-black rounded-2xl shadow-[2px_2px_0px_0px_#000] px-4 py-2"
                    disabled={page === 1}
                    onClick={() => {
                      setPage(page - 1);
                    }}
                  >
                    Previous
                  </Button>
                  <Button
                    className="border border-[#2D2D2D] bg-white hover:bg-gray-50 text-black rounded-2xl shadow-[2px_2px_0px_0px_#000] px-4 py-2"
                    disabled={page === Math.ceil(tableData.length / 10)}
                    onClick={() => {
                      setPage(page + 1);
                    }}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
);

export default PoolsTable;
