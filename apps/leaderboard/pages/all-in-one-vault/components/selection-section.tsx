import React, { useState, useMemo } from 'react';
import InputSection from '@/components/select/select';
import SummaryCard from '@/components/summary/summary';
import { ApproveAndBurnButton } from '@/components/button/button-approve-and-burn';
import {
  ALL_IN_ONE_VAULT_PROXY,
  NATIVE_TOKEN_WRAPPED,
} from '@/config/algebra/addresses';
import {
  handleTokenChange,
  handleAmountChange,
} from '../helper-function';
import { CurrencyAmount, Token } from '@cryptoalgebra/sdk';
import { useAccount, useReadContract } from 'wagmi';
import { AllInOneVaultABI } from '@/lib/abis';
import { ERC20ABI } from '@/lib/abis/erc20';
import Insufficient from '@/components/insufficient/insufficient';

const tokenAddressMap: Record<string, string> = 
  {
    "0x0555e30da8f98308edb960aa94c0db47230d2b9c": "2000",
    "0x36d31f9aec845f2c1789aed3364418c92e17b768": "3000",
    "0x6969696969696969696969696969696969696969": "1000"
  }
    
export default function SelectionSection() {
  const { address } = useAccount();
  const [selectedToken, setSelectedToken] = useState<string>('');

  const [amount, setAmount] = useState<string>('');
  const [insufficientBalance, setInsufficientBalance] =
    useState<boolean>(false);
  const [summaryData, setSummaryData] = useState({
    weightPerToken: '-',
    balance: '-',
    receiptWeight: '-',
  });

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
      );
      const amountValue = BigInt(parseFloat(amount) * 1e18);
      return CurrencyAmount.fromRawAmount(token, amountValue.toString());
    } catch (error) {
      console.error('Error creating currency amount:', error);
      return undefined;
    }
  }, [selectedToken, amount]);
  
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
