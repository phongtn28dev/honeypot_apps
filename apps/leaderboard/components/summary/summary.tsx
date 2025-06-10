import { Card } from '@nextui-org/react';
import { memo, useMemo } from 'react';

interface SummaryData {
  weightPerToken: string | number;
  balance: string | number;
  receiptWeight: string | number;
}

interface SummaryCardProps {
  data?: SummaryData;
  className?: string;
  weightPerCurrentToken?: string;
  isLoading?: boolean;
}

const DEFAULT_DATA: SummaryData = {
  weightPerToken: '-',
  balance: '-',
  receiptWeight: '-',
};

const SummaryCard = memo(function SummaryCard({
  data = DEFAULT_DATA,
  className = '',
  isLoading = false,
}: SummaryCardProps) {
  const formatValue = useMemo(() => (value: string | number) => {
    if (isLoading) return '...';
    if (typeof value === 'number') {
      return value.toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 6,
      });
    }
    return value || '-';
  }, [isLoading]);

  const summaryItems = useMemo(() => [
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
  ], [data]);

  return (
    <Card
      className={`border-2 border-dashed border-gray-400 bg-white/90 mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] transition-all duration-200 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.8)] ${className}`}
    >
      <div className="p-4 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          {summaryItems.map((item) => (
            <div key={item.key} className="space-y-2">
              <div className="text-sm font-medium text-gray-600 mb-1 font-theader">
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
