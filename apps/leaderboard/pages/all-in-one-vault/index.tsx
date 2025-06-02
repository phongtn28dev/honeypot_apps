import CardContainer from '@/components/card-contianer/v3';
import InputSection from '@/components/select/select';
import SummaryCard from '@/components/summary/summary';
import GenericTanstackTable from '@/components/Table/generic-table';
import { tableData } from '@/components/Table/mock-data';
import { columns, ReceiptTableData } from '@/components/Table/table.config';
import { Card } from '@nextui-org/react';
import { useEffect, useMemo, useState } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { AllInOneVaultABI } from '@/lib/abis/all-in-one-vault';
import { ERC20ABI } from '@/lib/abis/erc20';
import { useClaimReceipt } from '@/hooks/useClaimReceipt';
import { useGetReceipt } from '@/hooks/useGetReceipt';
import { useReceipt } from '@/hooks/useReceipt';
import { 
  calculateSummaryData, 
  tokenAddressMap, 
  handleTokenChange,
  handleAmountChange,
  handleCooldownComplete,
  updateClaimedReceipt,
  resetFormState
} from './helper-function';
import { toast } from 'react-toastify';
import { ALGEBRA_POSITION_MANAGER, ALL_IN_ONE_VAULT_PROXY } from '@/config/algebra/addresses';
import { useApprove } from '@/lib/algebra/hooks/common/useApprove';
import { CurrencyAmount, Token } from '@cryptoalgebra/sdk';
import Insufficient from '@/components/insufficient/insufficient';

export default function AllInOneVault() {
  const { address } = useAccount();

  const { data: balanceOf } = useReadContract({
    address: ALGEBRA_POSITION_MANAGER,
    abi: ERC20ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  });

  const { data: totalWeight } = useReadContract({
    address: ALL_IN_ONE_VAULT_PROXY,
    abi: AllInOneVaultABI,
    functionName: 'totalWeight',
  });

  const { receipt, refetch } = useReceipt();

  const statsData = [
    { label: 'Total Weight', value: totalWeight ? totalWeight.toString() : '30' },
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
  const [currentTableData, setCurrentTableData] = useState<ReceiptTableData[]>(tableData);
  const [insufficientBalance, setInsufficientBalance] = useState<boolean>(false);

  const { data: tokenBalance } = useReadContract({
    address: selectedToken ? (tokenAddressMap[selectedToken] as `0x${string}`) : undefined,
    abi: ERC20ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!selectedToken && !!address && !!tokenAddressMap[selectedToken],
    },
  });

  const amountToApprove = useMemo(() => {
    if (!selectedToken || !amount) return undefined;
    const tokenAddress = tokenAddressMap[selectedToken];
    if (!tokenAddress) return undefined;

    try {
      const token = new Token(1, tokenAddress, 18, selectedToken, selectedToken);
      const amountValue = BigInt(parseFloat(amount) * 1e18);
      return CurrencyAmount.fromRawAmount(token, amountValue.toString());
    } catch (error) {
      console.error('Error creating currency amount:', error);
      return undefined;
    }
  }, [selectedToken, amount]);
  
  const { approvalState, approvalCallback } = useApprove(amountToApprove, ALGEBRA_POSITION_MANAGER);

  const { claimReceipt, claimingReceiptId, isPending, isConfirming, isConfirmed } = useClaimReceipt();
  const { getReceipt, processing, isPending: isGetReceiptPending, isConfirming: isGetReceiptConfirming, isConfirmed: isGetReceiptConfirmed } = useGetReceipt();

  // Event listeners
  useEffect(() => {
    const cooldownHandler = (event: CustomEvent) => handleCooldownComplete(event, setCurrentTableData);
    window.addEventListener('cooldown-complete', cooldownHandler as EventListener);
    return () => window.removeEventListener('cooldown-complete', cooldownHandler as EventListener);
  }, []);

  useEffect(() => {
    if (isConfirmed && claimingReceiptId) {
      updateClaimedReceipt(claimingReceiptId, setCurrentTableData);
    }
  }, [isConfirmed, claimingReceiptId]);

  // Handler functions
  const onTokenChange = (token: string) => {
    handleTokenChange(token, amount, totalWeight, tokenBalance, setSelectedToken, setInsufficientBalance, setSummaryData);
  };

  const onAmountChange = (newAmount: string) => {
    handleAmountChange(newAmount, selectedToken, totalWeight, tokenBalance, setAmount, setInsufficientBalance, setSummaryData);
  };

  const handleClaim = (receiptId: string) => {
    claimReceipt(receiptId);
    console.log(`Claim clicked for receipt ID: ${receiptId}`);
  };

  const handleBurn2Vault = async () => {
    if (!selectedToken || !amount) return;

    const summaryData = calculateSummaryData(selectedToken, amount, totalWeight, tokenBalance);
    if (summaryData) {
      const amountValue = parseFloat(amount);
      const balanceValue = parseFloat(summaryData.balance);

      if (amountValue > balanceValue) {
        toast.error(`Insufficient balance! You only have ${balanceValue} ${selectedToken} tokens available.`, {
          position: 'top-right',
          autoClose: 3000,
        });
        return;
      }
    }

    try {
      await approvalCallback();
      toast.info('Token approval submitted. Please wait for confirmation...', {
        position: 'top-right',
        autoClose: 3000,
      });
    } catch (error) {
      console.error('Token approval failed:', error);
      toast.error('Token approval failed. Please try again.', {
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }

    getReceipt(selectedToken, amount);
    refetch();
    resetFormState(setSelectedToken, setAmount, setInsufficientBalance, setSummaryData);
  };

  return (
    <div className="w-full flex flex-col justify-center items-center px-4 font-gliker">
      <CardContainer className="xl:max-w-[1200px]">
        <div className="flex flex-col justify-center w-full rounded-2xl gap-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {statsData.map((stat, index) => (
              <Card key={index} className="border-2 border-dashed border-black bg-white/90 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.8)]">
                <div className="p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">{stat.label}</div>
                  <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <GenericTanstackTable
          data={currentTableData}
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
          onTokenChange={onTokenChange}
          onAmountChange={onAmountChange}
          className="w-full"
        />

        {insufficientBalance && (
          <Insufficient balance={summaryData.balance} selectedToken={selectedToken} />
        )}

        <SummaryCard className="w-full mb-6" data={summaryData} />

        <button
          onClick={handleBurn2Vault}
          disabled={!selectedToken || !amount || insufficientBalance}
          className="w-full bg-orange-400 hover:bg-black text-black hover:text-orange-400 py-3 text-lg font-medium rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] hover:shadow-[4px_4px_0px_0px_rgba(255,169,49,1)] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          {insufficientBalance ? 'Insufficient Balance' : 'Burn2vault'}
        </button>
      </CardContainer>
    </div>
  );
}