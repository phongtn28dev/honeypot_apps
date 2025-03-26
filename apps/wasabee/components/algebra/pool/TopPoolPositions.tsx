import {
  useTopPoolPositionsQuery,
  Position_OrderBy,
  OrderDirection,
} from '@/lib/algebra/graphql/generated/graphql';
import { useState } from 'react';
import { Button, Link } from '@nextui-org/react';
import { LoadingContainer } from '@/components/LoadingDisplay/LoadingDisplay';
import { DynamicFormatAmount } from '@/lib/algebra/utils/common/formatAmount';
import { ChevronUp, ChevronDown } from 'lucide-react';

export default function TopPoolPositions({ poolId }: { poolId: string }) {
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [sortField, setSortField] = useState<Position_OrderBy>(
    Position_OrderBy.Liquidity
  );
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Convert sort state to GraphQL variables
  const orderBy = sortField;
  const orderDirection =
    sortDirection === 'asc' ? OrderDirection.Asc : OrderDirection.Desc;

  const { data: countData } = useTopPoolPositionsQuery({
    variables: {
      poolId,
      first: 1,
      skip: 0,
    },
  });

  const { data, loading } = useTopPoolPositionsQuery({
    variables: {
      poolId,
      orderBy,
      orderDirection,
      first: pageSize,
      skip: (page - 1) * pageSize,
    },
  });

  const positions = data?.positions || [];
  const totalPositions = countData?.positions?.length || 0;
  const totalPages = Math.max(1, Math.ceil(totalPositions / pageSize));

  const handleSort = (field: Position_OrderBy) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  return (
    <LoadingContainer isLoading={loading}>
      <div className="w-full custom-dashed-3xl px-4 py-8 sm:px-6 sm:py-12 bg-white rounded-[24px]">
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[300px]">
            <thead>
              <tr>
                {/* <th className="py-4 px-6 cursor-pointer text-[#4D4D4D]">
                  <div
                    className="flex items-center gap-2"
                    onClick={() => handleSort(Position_OrderBy.Owner)}
                  >
                    <span>OWNER</span>
                    <div className="flex flex-col">
                      <ChevronUp
                        className={`h-3 w-3 ${
                          sortField === Position_OrderBy.Owner &&
                          sortDirection === 'asc'
                            ? 'text-black'
                            : 'text-[#4D4D4D]'
                        }`}
                      />
                      <ChevronDown
                        className={`h-3 w-3 ${
                          sortField === Position_OrderBy.Owner &&
                          sortDirection === 'desc'
                            ? 'text-black'
                            : 'text-[#4D4D4D]'
                        }`}
                      />
                    </div>
                  </div>
                </th> */}
                <th className="py-3 sm:py-4 px-3 sm:px-6 cursor-pointer text-[#4D4D4D] text-xs sm:text-sm">
                  <div
                    className="flex items-center gap-1 sm:gap-2"
                    onClick={() => handleSort(Position_OrderBy.TickUpperPrice0)}
                  >
                    <span>RANGE</span>
                    <div className="flex flex-col">
                      <ChevronUp
                        className={`h-2 w-2 sm:h-3 sm:w-3 ${
                          sortField === Position_OrderBy.TickUpperPrice0 &&
                          sortDirection === 'asc'
                            ? 'text-black'
                            : 'text-[#4D4D4D]'
                        }`}
                      />
                      <ChevronDown
                        className={`h-2 w-2 sm:h-3 sm:w-3 ${
                          sortField === Position_OrderBy.TickUpperPrice0 &&
                          sortDirection === 'desc'
                            ? 'text-black'
                            : 'text-[#4D4D4D]'
                        }`}
                      />
                    </div>
                  </div>
                </th>
                <th className="py-3 sm:py-4 px-3 sm:px-6 cursor-pointer text-[#4D4D4D] text-xs sm:text-sm">
                  <div
                    className="flex items-center gap-1 sm:gap-2"
                    onClick={() => handleSort(Position_OrderBy.Liquidity)}
                  >
                    <span>LIQUIDITY</span>
                    <div className="flex flex-col">
                      <ChevronUp
                        className={`h-2 w-2 sm:h-3 sm:w-3 ${
                          sortField === Position_OrderBy.Liquidity &&
                          sortDirection === 'asc'
                            ? 'text-black'
                            : 'text-[#4D4D4D]'
                        }`}
                      />
                      <ChevronDown
                        className={`h-2 w-2 sm:h-3 sm:w-3 ${
                          sortField === Position_OrderBy.Liquidity &&
                          sortDirection === 'desc'
                            ? 'text-black'
                            : 'text-[#4D4D4D]'
                        }`}
                      />
                    </div>
                  </div>
                </th>
                <th className="py-3 sm:py-4 px-3 sm:px-6 text-center text-[#4D4D4D] text-xs sm:text-sm">
                  <div className="flex items-center gap-1 sm:gap-2 justify-center">
                    <span>Action</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#4D4D4D]">
              {!positions.length ? (
                <tr className="hover:bg-white border-white h-full">
                  <td colSpan={4} className="h-24 text-center text-black">
                    No results.
                  </td>
                </tr>
              ) : (
                positions.map((position) => (
                  <tr key={position.id} className="hover:bg-gray-50">
                    {/* <td className="py-4 px-6 truncate text-black">
                      {truncate(position.owner, 12)}
                      <Copy value={position.owner} />
                    </td> */}
                    <td className="py-2 sm:py-4 px-3 sm:px-6 text-black text-xs sm:text-sm">
                      {Number(position.tickUpper.price0) >
                      Number.MAX_SAFE_INTEGER ? (
                        'FULL RANGE'
                      ) : (
                        <>
                          {DynamicFormatAmount({
                            amount: position.tickLower.price0,
                            decimals: 2,
                          })}{' '}
                          -{' '}
                          {DynamicFormatAmount({
                            amount: position.tickUpper.price0,
                            decimals: 2,
                          })}{' '}
                        </>
                      )}
                      <br />
                      <span className="text-xs sm:text-sm">
                        {position.token0.symbol}/{position.token1.symbol}
                      </span>
                    </td>
                    <td className="py-2 sm:py-4 px-3 sm:px-6 text-black text-xs sm:text-sm">
                      {DynamicFormatAmount({
                        amount: position.depositedToken0,
                        decimals: 2,
                        endWith: position.token0.symbol,
                      })}
                      <br />
                      {DynamicFormatAmount({
                        amount: position.depositedToken1,
                        decimals: 2,
                        endWith: position.token1.symbol,
                      })}
                    </td>
                    <td className="py-2 sm:py-4 px-3 sm:px-6 text-black text-center">
                      <Link
                        href={`/new-position/${poolId}?leftrange=${position.tickLower.price0}&rightrange=${position.tickUpper.price0}`}
                      >
                        <Button className="border border-[#2D2D2D] bg-[#FFCD4D] hover:bg-[#FFD56A] text-black rounded-xl sm:rounded-2xl shadow-[1px_1px_0px_0px_#000] sm:shadow-[2px_2px_0px_0px_#000] px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs min-w-0 sm:min-w-max">
                          <span className="hidden sm:inline">
                            Copy Position
                          </span>
                          <span className="sm:hidden">Copy</span>
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="py-2 sm:py-4">
            <div className="flex flex-row justify-between items-center gap-2 sm:gap-4">
              <span className="text-black text-xs sm:text-sm">
                Page {page} of {totalPages}
              </span>
              <div className="flex gap-x-2">
                <Button
                  className="border border-[#2D2D2D] bg-white hover:bg-gray-50 text-black rounded-xl sm:rounded-2xl shadow-[1px_1px_0px_0px_#000] sm:shadow-[2px_2px_0px_0px_#000] px-2 sm:px-4 py-1 sm:py-2 text-[10px] sm:text-sm min-w-0 sm:min-w-max"
                  disabled={page === 1}
                  onPress={() => {
                    setPage(page - 1);
                  }}
                >
                  <span className="hidden sm:inline">Previous</span>
                  <span className="sm:hidden">Prev</span>
                </Button>
                <Button
                  className="border border-[#2D2D2D] bg-white hover:bg-gray-50 text-black rounded-xl sm:rounded-2xl shadow-[1px_1px_0px_0px_#000] sm:shadow-[2px_2px_0px_0px_#000] px-2 sm:px-4 py-1 sm:py-2 text-[10px] sm:text-sm min-w-0 sm:min-w-max"
                  disabled={page === totalPages}
                  onPress={() => {
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
    </LoadingContainer>
  );
}
