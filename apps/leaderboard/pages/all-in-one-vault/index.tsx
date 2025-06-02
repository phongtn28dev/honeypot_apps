import CardContainer from '@/components/CardContianer/v3';
import InputSection from '@/components/select/select';
import SummaryCard from '@/components/summary/summary';
import GenericTanstackTable from '@/components/Table/generic-table';
import { tableData } from '@/components/Table/mock-data';
import { columns, ReceiptTableData } from '@/components/Table/table.config';
import { Card } from '@nextui-org/react';
import { useEffect, useState } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { AllInOneVaultABI } from '@/lib/abis/all-in-one-vault';
import { ERC20ABI } from '@/lib/abis/erc20';
import { useClaimReceipt } from '@/hooks/useClaimReceipt';
import { useGetReceipt } from '@/hooks/useGetReceipt';
import { useReceipt } from '@/hooks/useReceipt';
import { calculateSummaryData, tokenAddressMap } from './helper-function';
import { toast } from 'react-toastify';
import { ALGEBRA_POSITION_MANAGER, ALL_IN_ONE_VAULT_PROXY } from '@/config/algebra/addresses';

export default function AllInOneVault() {
  const { address } = useAccount();
  console.log('🔗 %cUser Address:', 'color: #3b82f6; font-weight: bold;', address);
  
  const { data: balanceOf } = useReadContract({
    address: ALGEBRA_POSITION_MANAGER,
    abi: ERC20ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  })
  console.log('Balance:', balanceOf);
  
  useEffect(() => {
    if (balanceOf) {
      console.log('🏦 Vault Balance Updated:', {
        value: balanceOf.toString(),
        formatted: (Number(balanceOf) / 1e18).toFixed(4) + ' tokens'
      });
    }
  }, [balanceOf]);

  const { data: totalWeight } = useReadContract({
    address: ALL_IN_ONE_VAULT_PROXY,
    abi: AllInOneVaultABI,
    functionName: 'totalWeight',
  });
  
  const { data: nextReceiptID } = useReadContract({
    address: ALL_IN_ONE_VAULT_PROXY,
    abi: AllInOneVaultABI,
    functionName: 'nextReceiptID',
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
  
  // Get the token balance using ERC20 balanceOf
  const { data: tokenBalance } = useReadContract({
    address: selectedToken ? tokenAddressMap[selectedToken] as `0x${string}` : undefined,
    abi: ERC20ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!selectedToken && !!address && !!tokenAddressMap[selectedToken],
    },
  });
  
  useEffect(() => {
    const handleCooldownComplete = (event: CustomEvent) => {
      const receiptId = event.detail;
      setCurrentTableData(prevData => 
        prevData.map(item => {
          if (item.id === receiptId) {
            return {
              ...item,
              isCooldownActive: false,
              cooldown: "00:00:00",
              action: {
                ...item.action,
                label: "Claim",
                isDisabled: false,
                className: "bg-orange-400 hover:bg-orange-500 text-white px-2 py-1 rounded-md",
              }
            };
          }
          return item;
        })
      );
    };

    window.addEventListener('cooldown-complete', handleCooldownComplete as EventListener);
    
    return () => {
      window.removeEventListener('cooldown-complete', handleCooldownComplete as EventListener);
    };
  }, []);

  const handleTokenChange = (token: string) => {
    setSelectedToken(token);
    setInsufficientBalance(false); // Reset error state when token changes
    if (token && amount) {
      const newSummaryData = calculateSummaryData(token, amount, totalWeight, tokenBalance);
      if (newSummaryData) {
        setSummaryData(newSummaryData);
        
        // Check balance with new token
        const amountValue = parseFloat(amount);
        const balanceValue = parseFloat(newSummaryData.balance);
        
        if (amountValue > balanceValue) {
          setInsufficientBalance(true);
        }
      }
    }
  };

  const handleAmountChange = (newAmount: string) => {
    setAmount(newAmount);
    if (selectedToken && newAmount) {
      const newSummaryData = calculateSummaryData(selectedToken, newAmount, totalWeight, tokenBalance);
      if (newSummaryData) {
        setSummaryData(newSummaryData);
        
        // Check if amount exceeds balance
        const amountValue = parseFloat(newAmount);
        const balanceValue = parseFloat(newSummaryData.balance);
        
        if (amountValue > balanceValue) {
          setInsufficientBalance(true);
          toast.error(`Insufficient balance! You only have ${balanceValue} ${selectedToken} tokens available.`, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        } else {
          setInsufficientBalance(false);
        }
      }
    } else {
      setInsufficientBalance(false);
    }
  };
  
  const { claimReceipt, claimingReceiptId, isPending, isConfirming, isConfirmed } = useClaimReceipt();
  
  const handleClaim = (receiptId: string) => {
    claimReceipt(receiptId);
    console.log(`Claim clicked for receipt ID: ${receiptId}`);
  };

  const { getReceipt, processing, isPending: isGetReceiptPending, isConfirming: isGetReceiptConfirming, isConfirmed: isGetReceiptConfirmed } = useGetReceipt();

  const handleBurn2Vault = () => {
    console.log('Burn2vault clicked', { selectedToken, amount });
    
    if (selectedToken && amount) {
      // Check if amount exceeds balance before proceeding
      const summaryData = calculateSummaryData(selectedToken, amount, totalWeight, tokenBalance);
      if (summaryData) {
        const amountValue = parseFloat(amount);
        const balanceValue = parseFloat(summaryData.balance);
        
        if (amountValue > balanceValue) {
          toast.error(`Insufficient balance! You only have ${balanceValue} ${selectedToken} tokens available.`, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
          return;
        }
      }
      
      getReceipt(selectedToken, amount);
      
      // Use the helper function to calculate the weight
      const receiptWeight = summaryData ? parseFloat(summaryData.receiptWeight) : Number(amount) * 2.5;
      
      const newReceipt = {
        id: "pending",
        cooldown: "Pending...",
        weight: receiptWeight, 
        rewards: `${(Number(amount) * 0.5).toFixed(1)} LBGT`,
        isCooldownActive: true,
        action: {
          label: "Processing",
          variant: "secondary" as const,
          isDisabled: true,
          className: "bg-gray-300 text-white px-2 py-1 rounded-md",
          onClick: () => console.log(`Transaction in progress`),
        },
      };
      
      // setCurrentTableData([...currentTableData, newReceipt]);
      refetch();
      setCurrentTableData(prevData => [...prevData, newReceipt]);
      
      setSelectedToken('');
      setAmount('');
      setInsufficientBalance(false);
      setSummaryData({
        weightPerToken: '-',
        balance: '-',
        receiptWeight: '-',
      });
    };
  };

  useEffect(() => {
    if (isConfirmed && claimingReceiptId) {
      setCurrentTableData(prevData => 
        prevData.map(item => {
          if (item.id === claimingReceiptId) {
            return {
              ...item,
              action: {
                label: "Claimed",
                variant: "outline" as const,
                isDisabled: true,
                className: "bg-gray-300 text-white px-2 py-1 rounded-md",
                onClick: () => console.log(`Already claimed receipt ${claimingReceiptId}`),
              }
            };
          }
          return item;
        })
      );
    }
  }, [isConfirmed, claimingReceiptId]);

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
          onTokenChange={handleTokenChange}
          onAmountChange={handleAmountChange}
          className={`w-full`}
        />
        
        {/* Insufficient Balance Warning */}
        {insufficientBalance && (
          <div className="w-full mb-4 p-3 bg-red-50 border-l-4 border-red-400 rounded-r-md">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  <span className="font-medium">Insufficient balance!</span> You only have {summaryData.balance} {selectedToken} tokens available.
                </p>
              </div>
            </div>
          </div>
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
