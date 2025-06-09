import CardContainer from '@/components/card-contianer/v3';

import GenericTanstackTable from '@/components/Table/generic-table';
import { tableData } from '@/components/Table/mock-data';
import { columns, ReceiptTableData } from '@/components/Table/table.config';
import { Card } from '@nextui-org/react';
import { useEffect, useMemo, useState } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { useClaimReceipt } from '@/hooks/useClaimReceipt';
import { AllInOneVaultABI } from '@/lib/abis/all-in-one-vault';
import { ERC20ABI } from '@/lib/abis/erc20';
import {
  ALGEBRA_POSITION_MANAGER,
  ALL_IN_ONE_VAULT,
  ALL_IN_ONE_VAULT_PROXY,
  NATIVE_TOKEN_WRAPPED,
} from '@/config/algebra/addresses';
import {
  calculateSummaryData,
  tokenAddressMap,
  handleTokenChange,
  handleAmountChange,
  handleCooldownComplete,
  updateClaimedReceipt,
  resetFormState,
} from './helper-function';
import { toast } from 'react-toastify';
import { useApprove } from '@/lib/algebra/hooks/common/useApprove';
import { CurrencyAmount, Token } from '@cryptoalgebra/sdk';
import Insufficient from '@/components/insufficient/insufficient';
import { ApproveAndBurnButton } from '@/components/button/button-approve-and-burn';
import StatCard from './components/stat-card';
import SelectionSection from './components/selection-section';

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

  const [selectedToken, setSelectedToken] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [summaryData, setSummaryData] = useState({
    weightPerToken: '-',
    balance: '-',
    receiptWeight: '-',
  });
  const [currentTableData, setCurrentTableData] =
    useState<ReceiptTableData[]>(tableData);
  const [insufficientBalance, setInsufficientBalance] =
    useState<boolean>(false);

  const { data: tokenBalance } = useReadContract({
    address: selectedToken
      ? (tokenAddressMap[selectedToken] as `0x${string}`)
      : undefined,
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
      const token = new Token(
        1,
        tokenAddress,
        18,
        selectedToken,
        selectedToken
      );
      const amountValue = BigInt(parseFloat(amount) * 1e18);
      return CurrencyAmount.fromRawAmount(token, amountValue.toString());
    } catch (error) {
      console.error('Error creating currency amount:', error);
      return undefined;
    }
  }, [selectedToken, amount]);

  console.log(
    '%c💰 Amount to approve:',
    'background: #4CAF50; color: white; font-weight: bold; padding: 4px 8px; border-radius: 4px;',
    amountToApprove
  );
  console.log(
    '%c🏛️ Contract all-in-one-vault:',
    'background: #2196F3; color: white; font-weight: bold; padding: 4px 8px; border-radius: 4px;',
    ALL_IN_ONE_VAULT
  );
  const { approvalState, approvalCallback } = useApprove(
    amountToApprove,
    ALL_IN_ONE_VAULT
  );
  console.log('Approval state:', approvalState);

  const { claimingReceiptId, isConfirmed } = useClaimReceipt();

  // Event listeners
  useEffect(() => {
    const cooldownHandler = (event: CustomEvent) =>
      handleCooldownComplete(event, setCurrentTableData);
    window.addEventListener(
      'cooldown-complete',
      cooldownHandler as EventListener
    );
    return () =>
      window.removeEventListener(
        'cooldown-complete',
        cooldownHandler as EventListener
      );
  }, []);

  useEffect(() => {
    if (isConfirmed && claimingReceiptId) {
      updateClaimedReceipt(claimingReceiptId, setCurrentTableData);
    }
  }, [isConfirmed, claimingReceiptId]);

  // Handler functions
  const onTokenChange = (token: string) => {
    handleTokenChange(
      token,
      amount,
      totalWeight,
      tokenBalance,
      setSelectedToken,
      setInsufficientBalance,
      setSummaryData
    );
  };

  const onAmountChange = (newAmount: string) => {
    handleAmountChange(
      newAmount,
      selectedToken,
      totalWeight,
      tokenBalance,
      setAmount,
      setInsufficientBalance,
      setSummaryData
    );
  };

  // const handleBurn2Vault = async () => {
  //   if (!selectedToken || !amount) return;

  //   const summaryData = calculateSummaryData(
  //     selectedToken,
  //     amount,
  //     totalWeight,
  //     tokenBalance
  //   );
  //   if (summaryData) {
  //     const amountValue = parseFloat(amount);
  //     const balanceValue = parseFloat(summaryData.balance);

  //     if (amountValue > balanceValue) {
  //       toast.error(
  //         `Insufficient balance! You only have ${balanceValue} ${selectedToken} tokens available.`,
  //         {
  //           position: 'top-right',
  //           autoClose: 3000,
  //         }
  //       );
  //       return;
  //     }
  //   }

  //   try {
  //     await approvalCallback();
  //     toast.info('Token approval submitted. Please wait for confirmation...', {
  //       position: 'top-right',
  //       autoClose: 3000,
  //     });
  //   } catch (error) {
  //     console.error('Token approval failed:', error);
  //     toast.error('Token approval failed. Please try again.', {
  //       position: 'top-right',
  //       autoClose: 3000,
  //     });
  //     return;
  //   }

  //   getReceipt(selectedToken, amount);
  //   refetch();
  //   resetFormState(
  //     setSelectedToken,
  //     setAmount,
  //     setInsufficientBalance,
  //     setSummaryData
  //   );
  // };

  return (
    <div className="w-full flex flex-col justify-center items-center px-4 font-gliker">
      <CardContainer className="xl:max-w-[1200px]">
        <StatCard />

        <GenericTanstackTable
          data={currentTableData}
          columns={columns}
          className="mb-6 w-full shadow-[4px_4px_0px_0px_rgba(255,255,255,0.8)]"
          enableSorting={true}
          enableFiltering={true}
          enablePagination={true}
          searchPlaceholder="Search receipts..."
        />

        <SelectionSection />
      </CardContainer>
    </div>
  );
}
