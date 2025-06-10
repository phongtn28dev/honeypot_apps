import React, { useState, useMemo, useEffect } from 'react';
import InputSection from '@/components/select/select';
import SummaryCard from '@/components/summary/summary';
import { ApproveAndBurnButton } from '@/components/button/button-approve-and-burn';
import {
  ALL_IN_ONE_VAULT_PROXY,
  NATIVE_TOKEN_WRAPPED,
} from '@/config/algebra/addresses';
import { useQuery as useApolloQuery, ApolloClient, InMemoryCache } from '@apollo/client';
import { useAccount, useReadContract } from 'wagmi';
import { AllInOneVaultABI } from '@/lib/abis';
import Insufficient from '@/components/insufficient/insufficient';

const tokenAddressMap: Record<string, string> = {
  '0x0555e30da8f98308edb960aa94c0db47230d2b9c': '2000',
  '0x36d31f9aec845f2c1789aed3364418c92e17b768': '3000',
  '0x6969696969696969696969696969696969696969': '1000',
};

export default function SelectionSection() {
  const [selectedToken, setSelectedToken] = useState<string>('');
  const [weightPerCurrentToken, setWeightPerCurrentToken] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [insufficientBalance, setInsufficientBalance] =
    useState<boolean>(false);
  const [summaryData, setSummaryData] = useState({
    weightPerToken: '-',
    balance: '-',
    receiptWeight: '-',
    estimatedRewards: '-',
  });
  const tokenSupportClient = useMemo(() => new ApolloClient({
    uri: 'https://api.ghostlogs.xyz/gg/pub/96ff5ab9-9c87-47cb-ab46-73a276d93c8b',
    cache: new InMemoryCache(),
    defaultOptions: {
      query: {
        errorPolicy: 'all'
      }
    }
  }), []);

  const { data: totalWeight } = useReadContract({
    address: ALL_IN_ONE_VAULT_PROXY,
    abi: AllInOneVaultABI,
    functionName: 'totalWeight',
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
        amount={amount}
        onTokenChange={onTokenChange}
        onAmountChange={onAmountChange}
        tokenSupportClient={tokenSupportClient}
        totalWeight={totalWeight}
        className="w-full"
      />

      {insufficientBalance && (
        <Insufficient
          balance={summaryData.balance}
          selectedToken={selectedToken}
        />
      )}

      <SummaryCard
        className="w-full mb-6"
        data={summaryData}
        currentToken={selectedToken}
        weightPerCurrentToken={weightPerCurrentToken}
      />
      
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
