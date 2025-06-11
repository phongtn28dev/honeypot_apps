import { POOL_REWARD } from '@/lib/algebra/graphql/queries/pool-reward';
import {
  useQuery as useApolloQuery,
  ApolloClient,
  InMemoryCache,
} from '@apollo/client';
import { Card } from '@nextui-org/react';
import { memo, useMemo } from 'react';

interface SummaryData {
  weightPerToken: string | number;
  balance: string | number;
  receiptWeight: string | number;
  estimatedRewards: string | number;
}

interface SummaryCardProps {
  data?: SummaryData;
  className?: string;
  currentToken?: string;
  weightPerCurrentToken?: string;
  isLoading?: boolean;
}

const DEFAULT_DATA: SummaryData = {
  weightPerToken: '-',
  balance: '-',
  receiptWeight: '-',
  estimatedRewards: '-',
};

const SummaryCard = memo(function SummaryCard({
  data = DEFAULT_DATA,
  className = '',
  isLoading = false,
}: SummaryCardProps) {
  const formatValue = useMemo(
    () => (value: string | number) => {
      if (isLoading) return '...';
      if (typeof value === 'number') {
        return value.toLocaleString('en-US', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 6,
        });
      }
      return value || '-';
    },
    [isLoading]
  );

  const tokenSupportClient = useMemo(
    () =>
      new ApolloClient({
        uri: 'https://api.ghostlogs.xyz/gg/pub/96ff5ab9-9c87-47cb-ab46-73a276d93c8b',
        cache: new InMemoryCache(),
        defaultOptions: {
          query: {
            errorPolicy: 'all',
          },
        },
      }),
    []
  );
  const {
    data: poolRewards,
    loading: poolRewardsLoading,
    error: poolRewardsError,
  } = useApolloQuery(POOL_REWARD, {
    client: tokenSupportClient,
    errorPolicy: 'all',
    notifyOnNetworkStatusChange: true,
  });
  console.log('🏆 Pool Rewards Data:', poolRewards, poolRewardsError);

  const summaryItems = useMemo(
    () => [
      {
        label: 'Weight/Token',
        value: data.weightPerToken,
        key: 'weightPerToken',
      },
      {
        label: 'Balance',
        value: data.balance,
        key: 'balance',
      },
      {
        label: 'Receipt-weight',
        value: data.receiptWeight,
        key: 'receiptWeight',
      },
      {
        label: 'Estimated Rewards',
        value: data.estimatedRewards || '-',
        key: 'estimatedRewards',
      },
    ],
    [data]
  );

  return (
    <Card
      className={`border-2 border-dashed border-black bg-white/90 mb-6 shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] transition-all duration-200 ${className}`}
    >
      <div className="p-4 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
          {summaryItems.map((item) => (
            <div key={item.key} className="space-y-2">
              <div className="text-sm font-medium text-neutral-950 mb-1 font-theader">
                {item.label}
              </div>
              <div
                className={`text-lg font-semibold text-gray-900 ${
                  isLoading ? 'animate-pulse bg-gray-200 rounded h-6' : ''
                }`}
                aria-label={`${item.label}: ${formatValue(item.value)}`}
              >
                {!isLoading && formatValue(item.value)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
});

export default SummaryCard;
