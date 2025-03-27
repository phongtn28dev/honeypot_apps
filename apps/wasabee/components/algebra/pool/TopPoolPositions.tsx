import {
  useTopPoolPositionsQuery,
  Position_OrderBy,
  OrderDirection,
  Position,
} from '@/lib/algebra/graphql/generated/graphql';
import { useMemo, useState } from 'react';
import { Button, Link } from '@nextui-org/react';
import { LoadingContainer } from '@/components/LoadingDisplay/LoadingDisplay';
import { DynamicFormatAmount } from '@/lib/algebra/utils/common/formatAmount';
import { Copy } from '@/components/Copy';
import { truncate } from '@/lib/format';
import { ChevronUp, ChevronDown } from 'lucide-react';
import BigNumber from 'bignumber.js';
import { usePosition } from '@/lib/algebra/hooks/positions/usePositions';
import { Position as PositionEntity } from '@cryptoalgebra/sdk';
import { Pool } from '@cryptoalgebra/sdk';

export default function TopPoolPositions({
  poolId,
  poolEntity,
}: {
  poolId: string;
  poolEntity: Pool;
}) {
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
      <div className="w-full custom-dashed-3xl p-4 md:p-6 bg-white rounded-[24px]">
        {/* Desktop View */}
        <div className="hidden md:block w-full overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="py-4 px-6 cursor-pointer text-[#4D4D4D]">
                  <div
                    className="flex items-center gap-2"
                    onClick={() => handleSort(Position_OrderBy.TickUpperPrice0)}
                  >
                    <span>RANGE</span>
                    <div className="flex flex-col">
                      <ChevronUp
                        className={`h-3 w-3 ${
                          sortField === Position_OrderBy.TickUpperPrice0 &&
                          sortDirection === 'asc'
                            ? 'text-black'
                            : 'text-[#4D4D4D]'
                        }`}
                      />
                      <ChevronDown
                        className={`h-3 w-3 ${
                          sortField === Position_OrderBy.TickUpperPrice0 &&
                          sortDirection === 'desc'
                            ? 'text-black'
                            : 'text-[#4D4D4D]'
                        }`}
                      />
                    </div>
                  </div>
                </th>
                <th className="py-4 px-6 cursor-pointer text-[#4D4D4D]">
                  <div
                    className="flex items-center gap-2"
                    onClick={() => handleSort(Position_OrderBy.Liquidity)}
                  >
                    <span>LIQUIDITY</span>
                    <div className="flex flex-col">
                      <ChevronUp
                        className={`h-3 w-3 ${
                          sortField === Position_OrderBy.Liquidity &&
                          sortDirection === 'asc'
                            ? 'text-black'
                            : 'text-[#4D4D4D]'
                        }`}
                      />
                      <ChevronDown
                        className={`h-3 w-3 ${
                          sortField === Position_OrderBy.Liquidity &&
                          sortDirection === 'desc'
                            ? 'text-black'
                            : 'text-[#4D4D4D]'
                        }`}
                      />
                    </div>
                  </div>
                </th>
                <th className="py-4 px-6 text-center text-[#4D4D4D]">
                  <div className="flex items-center gap-2 justify-center">
                    <span>COPY POSITION</span>
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
                  <PositionRow
                    key={position.id}
                    position={position as Position}
                    poolEntity={poolEntity}
                    isMobile={false}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="md:hidden w-full">
          <div className="flex justify-between mb-4">
            <div 
              className="flex items-center gap-2 text-sm font-medium cursor-pointer text-[#4D4D4D]"
              onClick={() => handleSort(Position_OrderBy.TickUpperPrice0)}
            >
              <span>RANGE</span>
              <div className="flex flex-col">
                <ChevronUp
                  className={`h-3 w-3 ${
                    sortField === Position_OrderBy.TickUpperPrice0 &&
                    sortDirection === 'asc'
                      ? 'text-black'
                      : 'text-[#4D4D4D]'
                  }`}
                />
                <ChevronDown
                  className={`h-3 w-3 ${
                    sortField === Position_OrderBy.TickUpperPrice0 &&
                    sortDirection === 'desc'
                      ? 'text-black'
                      : 'text-[#4D4D4D]'
                  }`}
                />
              </div>
            </div>
            <div 
              className="flex items-center gap-2 text-sm font-medium cursor-pointer text-[#4D4D4D]"
              onClick={() => handleSort(Position_OrderBy.Liquidity)}
            >
              <span>LIQUIDITY</span>
              <div className="flex flex-col">
                <ChevronUp
                  className={`h-3 w-3 ${
                    sortField === Position_OrderBy.Liquidity &&
                    sortDirection === 'asc'
                      ? 'text-black'
                      : 'text-[#4D4D4D]'
                  }`}
                />
                <ChevronDown
                  className={`h-3 w-3 ${
                    sortField === Position_OrderBy.Liquidity &&
                    sortDirection === 'desc'
                      ? 'text-black'
                      : 'text-[#4D4D4D]'
                  }`}
                />
              </div>
            </div>
          </div>

          {!positions.length ? (
            <div className="text-center py-6 text-black border-t border-[#4D4D4D]">
              No results.
            </div>
          ) : (
            <div className="space-y-4">
              {positions.map((position) => (
                <div key={position.id} className="border border-[#ECECEC] rounded-xl p-4 shadow-sm">
                  <PositionRow
                    key={position.id}
                    position={position as Position}
                    poolEntity={poolEntity}
                    isMobile={true}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="py-4 mt-4">
            <div className="flex flex-row justify-between items-center gap-4">
              <span className="text-black text-xs sm:text-sm">
                Page {page} of {totalPages}
              </span>
              <div className="flex gap-x-2">
                <Button
                  className="border border-[#2D2D2D] bg-white hover:bg-gray-50 text-black rounded-2xl shadow-[2px_2px_0px_0px_#000] px-2 sm:px-4 py-1 sm:py-2 text-xs"
                  disabled={page === 1}
                  onPress={() => {
                    setPage(page - 1);
                  }}
                >
                  Previous
                </Button>
                <Button
                  className="border border-[#2D2D2D] bg-white hover:bg-gray-50 text-black rounded-2xl shadow-[2px_2px_0px_0px_#000] px-2 sm:px-4 py-1 sm:py-2 text-xs"
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

export const PositionRow = ({
  position,
  poolEntity,
  isMobile = false
}: {
  position: Position;
  poolEntity: Pool;
  isMobile?: boolean;
}) => {
  const { position: positionData, loading } = usePosition(position.id);
  const positionEntity = useMemo(() => {
    if (!positionData) return null;

    return new PositionEntity({
      pool: poolEntity,
      tickLower: Number(positionData?.tickLower),
      tickUpper: Number(positionData?.tickUpper),
      liquidity: positionData?.liquidity.toString(),
    });
  }, [positionData, poolEntity]);

  if (isMobile) {
    return (
      <div className="flex flex-col gap-3">
        <div>
          <p className="text-sm font-medium text-[#4D4D4D] mb-1 uppercase">Range</p>
          <p className="text-black font-medium">
            {Number(position.tickUpper.price0) > Number.MAX_SAFE_INTEGER ? (
              'FULL RANGE'
            ) : (
              <>
                {DynamicFormatAmount({
                  amount: positionEntity?.token0PriceLower.toFixed(18) ?? '0',
                  decimals: 5,
                })}{' '}
                -{' '}
                {DynamicFormatAmount({
                  amount: positionEntity?.token0PriceUpper.toFixed(18) ?? '0',
                  decimals: 5,
                })}
              </>
            )}
            <br />
            <span className="text-[#6F6F6F] text-sm">{position.token0.symbol}/{position.token1.symbol}</span>
          </p>
        </div>
        
        <div>
          <p className="text-sm font-medium text-[#4D4D4D] mb-1 uppercase">Liquidity</p>
          <p className="text-black font-medium">
            {DynamicFormatAmount({
              amount: position.depositedToken0,
              decimals: 3,
              endWith: '',
            })}
            <span className="text-[#6F6F6F]"> {position.token0.symbol}</span>
            <br />
            {DynamicFormatAmount({
              amount: position.depositedToken1,
              decimals: 3,
              endWith: '',
            })}
            <span className="text-[#6F6F6F]"> {position.token1.symbol}</span>
          </p>
        </div>
        
        <div className="mt-4 flex justify-center">
          <Link
            href={`/new-position/${position.pool.id}?leftrange=${
              positionEntity?.token0PriceLower.toFixed(18) ?? '0'
            }&rightrange=${positionEntity?.token0PriceUpper.toFixed(18) ?? '0'}`}
            className="w-full"
          >
            <Button className="w-full border border-[#2D2D2D] bg-[#FFCD4D] hover:bg-[#FFD56A] text-black rounded-2xl shadow-[2px_2px_0px_0px_#000] px-3 py-2 text-sm font-medium">
              Copy Position
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <tr className="hover:bg-gray-50">
      <td className="py-4 px-6 text-black">
        {Number(position.tickUpper.price0) > Number.MAX_SAFE_INTEGER ? (
          'FULL RANGE'
        ) : (
          <>
            {DynamicFormatAmount({
              amount: positionEntity?.token0PriceLower.toFixed(18) ?? '0',
              decimals: 5,
            })}{' '}
            -{' '}
            {DynamicFormatAmount({
              amount: positionEntity?.token0PriceUpper.toFixed(18) ?? '0',
              decimals: 5,
            })}{' '}
          </>
        )}
        <br />
        {position.token0.symbol}/{position.token1.symbol}
      </td>
      <td className="py-4 px-6 text-black">
        {DynamicFormatAmount({
          amount: position.depositedToken0,
          decimals: 3,
          endWith: position.token0.symbol,
        })}
        <br />
        {DynamicFormatAmount({
          amount: position.depositedToken1,
          decimals: 3,
          endWith: position.token1.symbol,
        })}
      </td>
      <td className="py-4 px-6 text-black text-center">
        <Link
          href={`/new-position/${position.pool.id}?leftrange=${
            positionEntity?.token0PriceLower.toFixed(18) ?? '0'
          }&rightrange=${positionEntity?.token0PriceUpper.toFixed(18) ?? '0'}`}
        >
          <Button className="border border-[#2D2D2D] bg-[#FFCD4D] hover:bg-[#FFD56A] text-black rounded-2xl shadow-[2px_2px_0px_0px_#000] px-3 py-1.5 text-xs">
            Copy Position
          </Button>
        </Link>
      </td>
    </tr>
  );
};
