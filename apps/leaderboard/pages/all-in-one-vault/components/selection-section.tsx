import React, { useState, useMemo, useEffect } from 'react';
import InputSection from '@/components/select/select';
import SummaryCard from '@/components/summary/summary';
import { ApproveAndBurnButton } from '@/components/button/button-approve-and-burn';
import {
  NATIVE_TOKEN_WRAPPED,
} from '@/config/algebra/addresses';
import {
  useQuery as useApolloQuery,
  ApolloClient,
  InMemoryCache,
} from '@apollo/client';
import { useAccount, useReadContract } from 'wagmi';
import { AllInOneVaultABI } from '@/lib/abis';
import Insufficient from '@/components/insufficient/insufficient';
import { erc20Abi } from 'viem';

export default function SelectionSection() {
  const { address } = useAccount();
  const [selectedToken, setSelectedToken] = useState<string>('');
  const [tokenName, setTokenName] = useState<string>('');
  const [weightPerCurrentToken, setWeightPerCurrentToken] =
    useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [insufficientBalance, setInsufficientBalance] =
    useState<boolean>(false);
  const [summaryData, setSummaryData] = useState({
    weightPerToken: '-',
    balance: '-',
    receiptWeight: '-',
    estimatedRewards: '-',
  });
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

  const { data: tokenBalance } = useReadContract({
    address: selectedToken as `0x${string}`,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!selectedToken && !!address,
    },
  });

  const onTokenChange = (token: string) => {
    setSelectedToken(token);
    setInsufficientBalance(false);
  };

  const onAmountChange = (newAmount: string) => {
    setAmount(newAmount);
    setInsufficientBalance(false);
  };

  return (
    <>
      <InputSection
        selectedToken={selectedToken}
        setSummaryData={setSummaryData}
        setWeightPerCurrentToken={setWeightPerCurrentToken}
        setInsufficientBalance={setInsufficientBalance}
        setTokenName={setTokenName}
        amount={amount}
        onTokenChange={onTokenChange}
        onAmountChange={onAmountChange}
        tokenSupportClient={tokenSupportClient}
        tokenBalance={tokenBalance}
        className="w-full"
      />

      {insufficientBalance && (
        <Insufficient
          balance={summaryData.balance}
          selectedToken={selectedToken}
          tokenName={tokenName}
        />
      )}

      <SummaryCard
        className="w-full mb-6"
        data={summaryData}
        currentToken={selectedToken}
        weightPerCurrentToken={weightPerCurrentToken}
      />

      <ApproveAndBurnButton
        tokenAddress={selectedToken as `0x${string}`}
        tokenDecimals={18}
        tokenSymbol={tokenName}
        userAmount={tokenBalance}
        onSuccess={() => console.log('Burn successful!')}
        onError={(error) => console.error(error)}
      />
    </>
  );
}
