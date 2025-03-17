import {
  Pool,
  useActiveFarmingsQuery,
} from '@/lib/algebra/graphql/generated/graphql';
import { DynamicFormatAmount } from '@/lib/algebra/utils/common/formatAmount';
import { cn } from '@/lib/tailwindcss';
import { Card } from '@/components/algebra/ui/card';
import { useMemo } from 'react';
import { calculatePercentageChange } from '@/lib/utils';
import { farmingClient } from '@/lib/algebra/graphql/clients';
import { Address } from 'viem';
import { Token } from '@/services/contract/token';
import TokenLogo from '@/components/TokenLogo/TokenLogo';

interface PoolStatsCardProps {
  pool: Pool | null | undefined;
}

export default function PoolStatsCard({ pool }: PoolStatsCardProps) {
  if (!pool) return null;
  const { data: activeFarmings, loading: isFarmingsLoading } =
    useActiveFarmingsQuery({
      client: farmingClient,
    });

  const derivedPoolInfo = useMemo(() => {
    const {
      id,
      token0,
      token1,
      fee,
      totalValueLockedUSD,
      poolHourData,
      poolDayData,
      poolWeekData,
      feesUSD,
      poolMonthData,
      txCount,
      volumeUSD,
      token0Price,
      createdAtTimestamp,
      liquidity,
      aprPercentage,
    } = pool;
    const currentPool = poolDayData[0];
    const lastDate = currentPool ? currentPool.date * 1000 : 0;
    const currentDate = new Date().getTime();

    function handleGap(
      data: any[],
      gap: number,
      field: string,
      endTime: number
    ) {
      data?.sort((a, b) => a[field] - b[field]);

      let startTime = data[0]?.[field];

      let currentTimestamp = startTime;
      const filledData = [];

      while (currentTimestamp <= endTime) {
        const existingData = data.find(
          (d) =>
            d[field] >= currentTimestamp && d[field] < currentTimestamp + gap
        );

        filledData.push(
          existingData || {
            [field]: currentTimestamp,
            volumeUSD: 0,
          }
        );

        currentTimestamp += gap;
      }

      return filledData?.sort((a, b) => b[field] - a[field]);
    }

    //periodStartUnix
    const handleGapHour = (data: any[], end: number) => {
      return handleGap(data, 3600, 'periodStartUnix', end);
    };

    const handleDayGap = (data: any[], end: number) => {
      return handleGap(data, 3600 * 24, 'date', end);
    };

    const handleGapWeek = (data: any[], end: number) => {
      return handleGap(data, 3600 * 24 * 7, 'week', end);
    };

    const filledGapHours = handleGapHour(
      poolHourData?.slice(0, 24) || [],
      Math.floor(Date.now() / 1000)
    );

    const filledGapDays = handleDayGap(
      poolDayData?.slice(0, 14) || [],
      Math.floor(Date.now() / 1000)
    );

    const filledGapWeeks = handleGapWeek(
      poolWeekData?.slice(0, 8),
      Math.floor(Date.now() / 1000)
    );
    const changeHour = calculatePercentageChange(
      Number(filledGapHours[0]?.volumeUSD || 0),
      Number(filledGapHours[1]?.volumeUSD || 0)
    );

    const change24h = calculatePercentageChange(
      filledGapHours
        .slice(0, 24)
        .reduce((sum, hour) => sum + Number(hour?.volumeUSD || 0), 0),
      filledGapHours
        .slice(24, 48)
        .reduce((sum, hour) => sum + Number(hour?.volumeUSD || 0), 0)
    );

    const changeWeek = calculatePercentageChange(
      filledGapDays
        .slice(0, 7)
        .reduce((sum, day) => sum + Number(day?.volumeUSD || 0), 0),
      filledGapDays
        .slice(7, 14)
        .reduce((sum, day) => sum + Number(day?.volumeUSD || 0), 0)
    );

    const changeMonth = calculatePercentageChange(
      filledGapWeeks
        .slice(0, 4)
        .reduce((sum, week) => sum + Number(week?.volumeUSD || 0), 0),
      filledGapWeeks
        .slice(4, 8)
        .reduce((sum, week) => sum + Number(week?.volumeUSD || 0), 0)
    );

    /* time difference calculations here to ensure that the graph provides information for the last 24 hours */
    const timeDifference = currentDate - lastDate;
    const msIn24Hours = 24 * 60 * 60 * 1000;
    const msIn48Hours = 48 * 60 * 60 * 1000;
    const activeFarming = activeFarmings?.eternalFarmings.find(
      (farming) => farming.pool === id
    );

    let total24hFees = 0;
    let total24hDataCount = 0;
    let total24hVolume = 0;
    let total24to48hVolume = 0;
    let total24to48hDataCount = 0;

    poolHourData
      .filter((hour) => {
        return hour.periodStartUnix > currentDate / 1000 - msIn24Hours / 1000;
      })
      .map((hour) => {
        total24hFees += Number(hour.feesUSD);
        total24hDataCount++;
        total24hVolume += Number(hour.volumeUSD);
      });

    poolHourData
      .filter((hour) => {
        return (
          hour.periodStartUnix > currentDate / 1000 - msIn48Hours / 1000 &&
          hour.periodStartUnix < currentDate / 1000 - msIn24Hours / 1000
        );
      })
      .map((hour) => {
        total24to48hVolume += Number(hour.volumeUSD);
        total24to48hDataCount++;
      });

    const avgFees24h =
      total24hDataCount > 0 ? total24hFees / total24hDataCount : 0;
    const avgVolume24h =
      total24hDataCount > 0 ? total24hVolume / total24hDataCount : 0;
    const avgVolume24to48h =
      total24to48hDataCount > 0
        ? total24to48hVolume / total24to48hDataCount
        : 0;

    const avgAPR24h = (avgFees24h / Number(totalValueLockedUSD)) * 365 * 100;

    const poolMaxApr = avgAPR24h;
    const poolAvgApr = avgAPR24h;
    const farmApr = 0;
    const avgApr = avgAPR24h;

    const volumeChange24to48h = calculatePercentageChange(
      avgVolume24h,
      avgVolume24to48h
    );

    return {
      id: id as Address,
      pair: {
        token0: Token.getToken({
          address: token0.id,
        }),
        token1: Token.getToken({
          address: token1.id,
        }),
      },
      fee: Number(fee) / 10_000,
      tvlUSD: Number(totalValueLockedUSD),
      volume24USD: avgVolume24h * 24,
      fees24USD: avgFees24h * 24,
      poolMaxApr,
      poolAvgApr,
      farmApr,
      avgApr,
      feesUSD,
      hasActiveFarming: Boolean(activeFarming),
      createdAtTimestamp,
      liquidity,
      token0Price,
      changeHour,
      change24h: volumeChange24to48h,
      changeWeek,
      changeMonth,
      txCount,
      volumeUSD,
      marketCap: token0.marketCap,
      apr24h: (avgApr * 24).toString(),
      tick: pool?.tick,
    };
  }, [pool, activeFarmings]);

  console.log(pool, derivedPoolInfo);
  return (
    <Card className="h-[400px] p-6 flex flex-col gap-4 bg-white text-black">
      <h2 className="text-xl font-bold">Stats</h2>

      <div className="space-y-4">
        <div>
          <h3 className="mb-2">Tokens Locked</h3>
          <div className="space-y-2 grid grid-cols-2 justify-between items-center">
            <div
              key={derivedPoolInfo.pair.token0.symbol}
              className="w-full h-full flex items-center justify-between mt-0"
            >
              <div className="flex w-full h-full items-center gap-2">
                <TokenLogo token={derivedPoolInfo.pair.token0} />
                <span>{derivedPoolInfo.pair.token0.symbol}</span>
              </div>
            </div>
            <div
              key={derivedPoolInfo.pair.token1.symbol}
              className="flex items-center w-full h-full  justify-between !mt-0"
            >
              <div className="flex items-center gap-2 mt-0">
                <TokenLogo token={derivedPoolInfo.pair.token1} />
                <span>{derivedPoolInfo.pair.token1.symbol}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4 grid grid-cols-2 gap-4 justify-between items-end">
          <div>
            <h3 className="text-black mb-1">TVL</h3>
            <span className="text-lg font-semibold">
              $
              {DynamicFormatAmount({
                amount: derivedPoolInfo.tvlUSD,
                decimals: 2,
              })}
            </span>
          </div>

          <div>
            <h3 className="text-black mb-1">APR (24h)</h3>
            <div className="flex items-center">
              <span className="text-lg font-semibold">
                {DynamicFormatAmount({
                  amount: derivedPoolInfo.apr24h,
                  decimals: 2,
                })}
                %
              </span>
            </div>
          </div>

          <div>
            <h3 className="text-black mb-1">Volume (24h)</h3>
            <span className="text-lg font-semibold">
              $
              {DynamicFormatAmount({
                amount: derivedPoolInfo.volume24USD,
                decimals: 2,
              })}
            </span>
          </div>

          <div>
            <h3 className="text-black mb-1">Fees (24h)</h3>
            <span className="text-lg font-semibold">
              $
              {DynamicFormatAmount({
                amount: derivedPoolInfo.fees24USD,
                decimals: 2,
              })}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
