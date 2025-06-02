import { Card } from '@nextui-org/react';

interface SummaryData {
  weightPerToken: string | number;
  balance: string | number;
  receiptWeight: string | number;
}

interface SummaryCardProps {
  data?: SummaryData;
  className?: string;
  isLoading?: boolean;
}

export default function SummaryCard({
  data = {
    weightPerToken: '-',
    balance: '-',
    receiptWeight: '-',
  },
  className = '',
  isLoading = false,
}: SummaryCardProps) {
  const formatValue = (value: string | number) => {
    if (isLoading) return '...';
    if (typeof value === 'number') {
      return value.toLocaleString();
    }
    return value;
  };

  return (
    <Card
      className={`border-2 border-dashed border-gray-400 bg-white/90 mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] ${className}`}
    >
      <div className="p-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-sm text-gray-600 mb-1">Weight/Token</div>
            <div
              className={`text-lg font-medium ${
                isLoading ? 'animate-pulse' : ''
              }`}
            >
              {formatValue(data.weightPerToken)}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600 mb-1">Balance</div>
            <div
              className={`text-lg font-medium ${
                isLoading ? 'animate-pulse' : ''
              }`}
            >
              {formatValue(data.balance)}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600 mb-1">Receipt-weight</div>
            <div
              className={`text-lg font-medium ${
                isLoading ? 'animate-pulse' : ''
              }`}
            >
              {formatValue(data.receiptWeight)}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
