import { useEffect, useState } from 'react';
import { fetchSwapTransactions } from '@/lib/algebra/graphql/clients/swapTransactions';
import { truncate } from '@/lib/format';
import { Copy } from '@/components/Copy';
import { VscCopy } from 'react-icons/vsc';
import { ExternalLink } from 'lucide-react';
import dayjs from 'dayjs';
import BigNumber from 'bignumber.js';
import { SwapField } from '@/types/algebra/types/swap-field';
import { useDerivedSwapInfo } from '@/lib/algebra/state/swapStore';
import { Address, formatEther, parseEther, zeroAddress } from 'viem';
import { HoneyContainer } from '@/components/CardContianer';
import {
  Order,
  OrderContract,
  OrderStatus,
  useRecentBuyOrdersQuery,
  useRecentSellOrdersQuery,
} from '@/lib/algebra/graphql/generated/graphql';
import { wallet } from '@honeypot/shared';
import { watchBlockNumber } from 'viem/actions';
import { Button } from '../../button/v3';
import { Switch } from '@nextui-org/react';
import { observer } from 'mobx-react-lite';
import { cn } from '@/lib/tailwindcss';
import { BuyOrderListRow, SellOrderListRow } from '../OrderListRow';
import { usePollingBlockNumber } from '@/lib/hooks/useBlockNumber';
import { BgtMarketOrder } from '@/services/bgt-market/bgtMarketOrder';
import { HeyBgtOrder } from '@/services/bgt-market/heyBgtOrder';
import { HeyBgtBuyOrderListRow } from '../HeyBgtOrderListRow';

export const BuyOrderListHeyBgt = observer(() => {
  const [onlyShowPendingBuyOrders, setShowOnlyPendingBuyOrders] =
    useState<boolean>(true);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const pageSize = 10;
  const {
    data: recentBuyOrders,
    refetch: refetchBuyOrders,
    loading,
  } = useRecentBuyOrdersQuery({
    variables: {
      status_in: onlyShowPendingBuyOrders
        ? [OrderStatus.Pending]
        : [OrderStatus.Pending, OrderStatus.Closed, OrderStatus.Filled],
      contract: OrderContract.HeyBgt,
      //   skip: pageSize * (page - 1),
      //   first: pageSize,
    },
  });

  const { block } = usePollingBlockNumber();
  useEffect(() => {
    refetchBuyOrders();
  }, [block]);

  return (
    <div className="p-2 sm:p-6 w-full h-full">
      <div className="bg-[#202020] rounded-2xl overflow-hidden w-full h-full">
        <div className="p-2 sm:p-6 w-full">
          <div className="border border-[#5C5C5C] rounded-2xl overflow-scroll overflow-x-auto w-full [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-[#323232] [&::-webkit-scrollbar-thumb]:bg-[#FFCD4D] [&::-webkit-scrollbar-thumb]:rounded-full [scrollbar-color:#FFCD4D_#323232] [scrollbar-width:thin]">
            <table className="w-full">
              <thead className="bg-[#323232] text-white">
                <tr>
                  <th className="py-2 px-2 sm:px-4 text-left text-sm sm:text-base font-medium w-[160px] sm:w-[200px]">
                    Order
                  </th>
                  <th className="py-2 px-2 sm:px-4 text-left text-sm sm:text-base font-medium w-[160px] hidden md:table-cell">
                    Total Balance
                  </th>
                  <th className="py-2 px-2 sm:px-4 text-right text-sm sm:text-base font-medium">
                    Price per BGT
                  </th>
                  <th className="py-2 px-2 sm:px-4 text-right text-sm sm:text-base font-medium">
                    Filled
                  </th>{' '}
                  <th className="py-2 px-2 sm:px-4 text-right text-sm sm:text-base font-medium">
                    {/* <Switch
                      defaultSelected
                      onValueChange={setShowOnlyPendingBuyOrders}
                    >
                      <span className="">only show pending</span>
                    </Switch> */}
                  </th>
                </tr>
              </thead>
              <tbody className="text-white divide-y divide-[#5C5C5C]">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="py-2 px-4 text-center">
                      Loading...
                    </td>
                  </tr>
                ) : recentBuyOrders?.orders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-2 px-4 text-center">
                      No transactions found
                    </td>
                  </tr>
                ) : (
                  Object.values(recentBuyOrders?.orders ?? [])
                    ?.sort((a, b) => Number(b.price) - Number(a.price))
                    ?.map((order) => (
                      <HeyBgtBuyOrderListRow
                        key={order.id}
                        order={HeyBgtOrder.getBgtOrder(
                          HeyBgtOrder.gqlOrderToBgtOrder(order as Order)
                        )}
                        actionCallBack={refetchBuyOrders}
                      />
                    ))
                )}
              </tbody>
            </table>
          </div>

          {/* <div className="mt-4 sm:mt-6 flex justify-end w-full">
            <div className="flex items-center gap-1 sm:gap-6">
              <div className="flex items-center gap-1 sm:gap-4">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1 || loading}
                  className="flex items-center gap-1 px-2 py-1.5 sm:py-2 bg-[#2a2a2a] rounded text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#3a3a3a] transition-colors text-xs sm:text-base"
                >
                  <svg
                    className="w-3 h-3 sm:w-4 sm:h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>

                <div className="flex items-center gap-1 sm:gap-2">
                  <span className="text-gray-400 text-xs sm:text-base">
                    Page
                  </span>
                  <span className="px-2 py-1 bg-[#1a1a1a] rounded text-white min-w-[24px] sm:min-w-[40px] text-center text-xs sm:text-base">
                    {page}
                  </span>
                </div>

                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={!hasNextPage || loading}
                  className="flex items-center gap-1 px-2 py-1.5 sm:py-2 bg-[#2a2a2a] rounded text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#3a3a3a] transition-colors text-xs sm:text-base"
                >
                  <svg
                    className="w-3 h-3 sm:w-4 sm:h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
});
