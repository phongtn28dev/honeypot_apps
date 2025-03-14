import {
  useTopPoolPositionsQuery,
  Position_OrderBy,
  OrderDirection,
} from '@/lib/algebra/graphql/generated/graphql';
import { useState } from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Pagination,
  Button,
  SortDescriptor,
} from '@nextui-org/react';
import { LoadingContainer } from '@/components/LoadingDisplay/LoadingDisplay';
import { DynamicFormatAmount } from '@/lib/algebra/utils/common/formatAmount';
import { truncateAddress } from '@usecapsule/rainbowkit-wallet';
import { Copy } from '@/components/Copy';
import { truncate } from '@/lib/format';

export default function TopPoolPositions({ poolId }: { poolId: string }) {
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: Position_OrderBy.Liquidity,
    direction: 'descending',
  });

  // Convert NextUI sort to GraphQL variables
  const orderBy =
    (sortDescriptor.column as Position_OrderBy) || Position_OrderBy.Liquidity;
  const orderDirection =
    sortDescriptor.direction === 'ascending'
      ? OrderDirection.Asc
      : OrderDirection.Desc;

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

  console.log(positions);

  return (
    <LoadingContainer isLoading={loading}>
      <div className="w-full bg-white rounded-[24px] border border-black shadow-[4px_4px_0px_0px_#D29A0D]">
        <Table
          aria-label="Top positions"
          className="w-full"
          sortDescriptor={sortDescriptor}
          onSortChange={setSortDescriptor}
          classNames={{
            wrapper: 'rounded-[24px] w-full',
            th: 'bg-[#F5F5F5] text-black cursor-pointer',
            td: 'text-white',
            tr: 'text-white',
            table: 'w-full',
          }}
        >
          <TableHeader>
            <TableColumn
              className="text-black w-1/4"
              allowsSorting
              key={Position_OrderBy.Owner}
            >
              OWNER
            </TableColumn>
            <TableColumn
              className="text-black w-1/4"
              allowsSorting
              key={Position_OrderBy.TickUpperPrice0}
            >
              RANGE
            </TableColumn>
            <TableColumn
              className="text-black w-1/4"
              allowsSorting
              key={Position_OrderBy.Liquidity}
            >
              LIQUIDITY
            </TableColumn>
            {/* <TableColumn className="text-black w-1/4 text-center">
              COPY
            </TableColumn> */}
          </TableHeader>
          <TableBody>
            {positions.map((position) => (
              <TableRow key={position.id} className="text-white">
                <TableCell className="truncate text-white w-1/4">
                  {truncate(position.owner, 12)}
                  <Copy value={position.owner} />
                </TableCell>
                <TableCell className="text-white w-1/4">
                  {Number(position.tickUpper.price0) >
                  Number.MAX_SAFE_INTEGER ? (
                    'FULL RANGE'
                  ) : (
                    <>
                      {DynamicFormatAmount({
                        amount: position.tickUpper.price0,
                        decimals: 2,
                      })}{' '}
                      -{' '}
                      {DynamicFormatAmount({
                        amount: position.tickUpper.price1,
                        decimals: 2,
                      })}{' '}
                    </>
                  )}
                  <br />
                  {position.token0.symbol}/{position.token1.symbol}
                </TableCell>
                <TableCell className="text-white w-1/4">
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
                </TableCell>
                {/* <TableCell className="text-white w-1/4 text-center">
                  <Button
                    variant="light"
                    className="bg-white text-black"
                    onPress={() => navigator.clipboard.writeText(position.id)}
                  >
                    Copy Position
                  </Button>
                </TableCell> */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="flex justify-center p-4">
          <Pagination
            total={totalPages}
            page={page}
            onChange={setPage}
            showControls
            classNames={{
              wrapper: 'gap-2',
              item: 'bg-[#F5F5F5] text-black',
              cursor: 'bg-black text-white',
            }}
          />
        </div>
      </div>
    </LoadingContainer>
  );
}
