import React, { useState, useMemo, useEffect } from 'react';
import InputSection from '@/components/select/select';
import SummaryCard from '@/components/summary/summary';
import { ApproveAndBurnButton } from '@/components/button/button-approve-and-burn';
import {
  ALL_IN_ONE_VAULT_PROXY,
  NATIVE_TOKEN_WRAPPED,
} from '@/config/algebra/addresses';
import { useQuery as useTanstackQuery } from '@tanstack/react-query';
import { useQuery as useApolloQuery, ApolloClient, InMemoryCache } from '@apollo/client';
import { handleTokenChange, handleAmountChange } from '../helper-function';
import { CurrencyAmount, Token } from '@cryptoalgebra/sdk';
import { useAccount, useReadContract } from 'wagmi';
import { AllInOneVaultABI } from '@/lib/abis';
import { ERC20ABI } from '@/lib/abis/erc20';
import Insufficient from '@/components/insufficient/insufficient';
import { TOKEN_SUPPORT_QUERY } from '@/lib/algebra/graphql/queries/token-support';
import { gql } from '@apollo/client';
import { useSubgraphClient } from '@honeypot/shared';

const tokenAddressMap: Record<string, string> = {
  '0x0555e30da8f98308edb960aa94c0db47230d2b9c': '2000',
  '0x36d31f9aec845f2c1789aed3364418c92e17b768': '3000',
  '0x6969696969696969696969696969696969696969': '1000',
};

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
        tokenSupportClient={tokenSupportClient}
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
