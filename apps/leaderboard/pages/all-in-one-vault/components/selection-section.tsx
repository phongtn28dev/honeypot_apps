import React, { useState } from 'react';
import InputSection from '@/components/select/select';
import SummaryCard from '@/components/summary/summary';
import { ApproveAndBurnButton } from '@/components/button/button-approve-and-burn';
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
} from '../helper-function';
import { useAccount, useReadContract } from 'wagmi';
import { AllInOneVaultABI } from '@/lib/abis';
import { ERC20ABI } from '@/lib/abis/erc20';
import Insufficient from '@/components/insufficient/insufficient';

export default function SelectionSection() {
  const { address } = useAccount();
  const [selectedToken, setSelectedToken] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [insufficientBalance, setInsufficientBalance] =
    useState<boolean>(false);
  const { data: totalWeight } = useReadContract({
    address: ALL_IN_ONE_VAULT_PROXY,
    abi: AllInOneVaultABI,
    functionName: 'totalWeight',
  });
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
  const [summaryData, setSummaryData] = useState({
    weightPerToken: '-',
    balance: '-',
    receiptWeight: '-',
  });

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

  return (
    <>
      <InputSection
        selectedToken={selectedToken}
        amount={amount}
        onTokenChange={onTokenChange}
        onAmountChange={onAmountChange}
        className="w-full"
      />

      {insufficientBalance && (
        <Insufficient
          balance={summaryData.balance}
          selectedToken={selectedToken}
        />
      )}

      <SummaryCard className="w-full mb-6" data={summaryData} />

      <ApproveAndBurnButton
        tokenAddress={NATIVE_TOKEN_WRAPPED}
        tokenDecimals={18}
        tokenSymbol="TOKEN"
        userAmount="100"
        onSuccess={() => console.log('Burn successful!')}
        onError={(error) => console.error(error)}
      />
    </>
  );
}
