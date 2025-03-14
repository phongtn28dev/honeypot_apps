import {
  Pool,
  PoolHourData,
  PoolDayData,
} from '@/lib/algebra/graphql/generated/graphql';
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
  XAxis,
  YAxis,
} from 'recharts';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { useEffect } from 'react';
import { cn } from '@/lib/utils';
import { DynamicFormatAmount } from '@/lib/algebra/utils/common/formatAmount';

interface PoolChartProps {
  pool: Pool;
}

type chartType = 'tvl' | 'volume' | 'fees';
type timeRange = '1D' | '1W' | '1M' | '6M' | 'ALL';

const PoolChart = observer(({ pool }: PoolChartProps) => {
  const [currentChartData, setCurrentChartData] = useState<
    {
      date: number;
      value: number;
    }[]
  >([]);
  const [selectedChartType, setSelectedChartType] = useState<chartType>('tvl');
  const [selectedTimeRange, setSelectedTimeRange] = useState<timeRange>('ALL');

  useEffect(() => {
    if (!pool.poolDayData) return;

    let filteredData: PoolDayData[] | PoolHourData[] = [];
    const now = Math.floor(Date.now() / 1000);

    // Filter data based on time range
    switch (selectedTimeRange) {
      case '1D':
        filteredData = [...pool.poolHourData].filter(
          (day) => now - day.periodStartUnix <= 86400
        );
        break;
      case '1W':
        filteredData = [...pool.poolDayData].filter(
          (day) => now - day.date <= 604800
        );
        break;
      case '1M':
        filteredData = [...pool.poolDayData].filter(
          (day) => now - day.date <= 2592000
        );
        break;
      case '6M':
        filteredData = [...pool.poolDayData].filter(
          (day) => now - day.date <= 15552000
        );
        break;
      case 'ALL':
        filteredData = [...pool.poolDayData];
        break;
    }

    // Map data based on selected chart type
    const mappedData = filteredData.map((timeData) => ({
      date:
        timeData.__typename === 'PoolDayData'
          ? timeData.date
          : timeData.__typename === 'PoolHourData'
          ? timeData.periodStartUnix
          : 0,
      value: parseFloat(
        selectedChartType === 'tvl'
          ? timeData.tvlUSD
          : selectedChartType === 'volume'
          ? timeData.volumeUSD
          : timeData.feesUSD
      ),
    }));

    setCurrentChartData(mappedData);
  }, [pool, selectedChartType, selectedTimeRange]);

  return (
    <div className="w-full h-[300px] bg-white rounded-[24px] p-4 border border-black shadow-[4px_4px_0px_0px_#D29A0D]">
      <div className="flex justify-between mb-4">
        <div className="flex gap-4">
          <button
            className={cn(
              'px-4 py-2 rounded-lg bg-[#F5F5F5] text-sm',
              selectedChartType === 'tvl' && 'bg-black text-white'
            )}
            onClick={() => setSelectedChartType('tvl')}
          >
            TVL
          </button>
          <button
            className={cn(
              'px-4 py-2 rounded-lg bg-[#F5F5F5] text-sm',
              selectedChartType === 'volume' && 'bg-black text-white'
            )}
            onClick={() => setSelectedChartType('volume')}
          >
            Volume
          </button>
          <button
            className={cn(
              'px-4 py-2 rounded-lg bg-[#F5F5F5] text-sm',
              selectedChartType === 'fees' && 'bg-black text-white'
            )}
            onClick={() => setSelectedChartType('fees')}
          >
            Fees
          </button>
        </div>

        <div className="flex gap-2">
          {(['1D', '1W', '1M', '6M', 'ALL'] as timeRange[]).map((range) => (
            <button
              key={range}
              className={cn(
                'px-3 py-1 rounded-lg bg-[#F5F5F5] text-xs',
                selectedTimeRange === range && 'bg-black text-white'
              )}
              onClick={() => setSelectedTimeRange(range)}
            >
              {range}
            </button>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={currentChartData}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#FFCD4D" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#FFCD4D" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12 }}
          />
          <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#FFCD4D"
            fillOpacity={1}
            fill="url(#colorValue)"
          />
          <Tooltip
            content={<CustomTooltip />}
            labelFormatter={(value) => {
              return new Date(value).toLocaleDateString();
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
});

const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip bg-white p-2 rounded-md shadow-md border border-gray-300">
        <p className="label text-sm font-medium">{label}</p>
        <p className="value text-sm">
          {DynamicFormatAmount({
            amount: payload[0].value?.toString() ?? '0',
            decimals: 2,
            endWith: '$',
          })}
        </p>
      </div>
    );
  }
};

export default PoolChart;
