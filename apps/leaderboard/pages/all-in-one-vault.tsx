import CardContainer from '@/components/CardContianer/v3';
import InputSection from '@/components/select/select';
import GenericTanstackTable from '@/components/Table/GenericTable';
import { tableData } from '@/components/Table/mockdata';
import { columns } from '@/components/Table/table.config';
import { Card } from '@nextui-org/react';
import { useState } from 'react';

export default function AllInOneVault() {
  const statsData = [
    { label: 'Total Weight', value: '30' },
    { label: 'LBGT Balance', value: '7.0' },
    { label: 'LBGT Lifetime', value: '10.5' },
  ];
  const [selectedToken, setSelectedToken] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [summaryData, setSummaryData] = useState({
    weightPerToken: '-',
    balance: '-',
    receiptWeight: '-',
  });

  const handleTokenChange = (token: string) => {
    setSelectedToken(token)
    if (token && amount) {
      setSummaryData({
        weightPerToken: "2.5",
        balance: "15.0",
        receiptWeight: "25.0",
      })
    }
  }

  const handleAmountChange = (newAmount: string) => {
    setAmount(newAmount)
    if (selectedToken && newAmount) {
      setSummaryData({
        weightPerToken: "2.5",
        balance: "15.0",
        receiptWeight: "25.0",
      })
    }
  }

  return (
    <div className="w-full flex flex-col justify-center items-center px-4 font-gliker">
      <CardContainer className="xl:max-w-[1200px]">
        <div className="flex flex-col justify-center w-full rounded-2xl gap-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {statsData.map((stat, index) => (
              <Card
                key={index}
                className="border-2 border-dashed border-black bg-white/90 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.8)]"
              >
                <div className="p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">{stat.label}</div>
                  <div className="text-2xl font-bold text-gray-800">
                    {stat.value}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <GenericTanstackTable
          data={tableData}
          columns={columns}
          className="mb-6 w-full shadow-[4px_4px_0px_0px_rgba(255,255,255,0.8)]"
          enableSorting={true}
          enableFiltering={true}
          enablePagination={true}
          searchPlaceholder="Search receipts..."
        />

        <InputSection
          selectedToken={selectedToken}
          amount={amount}
          onTokenChange={handleTokenChange}
          onAmountChange={handleAmountChange}
          className={`w-full`}
        />
      </CardContainer>
    </div>
  );
}
