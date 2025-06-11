import { useState, useMemo } from 'react';
import { Address, formatUnits, parseUnits } from 'viem';
import {
  useAccount,
  useReadContract,
  useWriteContract,
} from 'wagmi';
import { useApprove } from '@/lib/algebra/hooks/common/useApprove';
import { ALL_IN_ONE_VAULT } from '@/config/algebra/addresses';
import { CurrencyAmount, Token } from '@cryptoalgebra/sdk';
import { ApprovalState } from '@/types/algebra/types/approve-state';
import { AllInOneVaultABI } from '@/lib/abis';

interface ApproveAndBurnButtonProps {
  tokenAddress: Address;
  tokenDecimals: number;
  tokenSymbol: string;
  userAmount: bigint | undefined;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function ApproveAndBurnButton({
  tokenAddress,
  tokenDecimals,
  tokenSymbol,
  userAmount,
  onSuccess,
  onError,
}: ApproveAndBurnButtonProps) {
  const { address: userAddress } = useAccount();
  const [isProcessing, setIsProcessing] = useState(false);

  const parsedAmount = useMemo(() => {
    if (!userAmount || userAmount === BigInt(0)) return undefined;
    try {
      return parseUnits(userAmount.toString(), tokenDecimals);
    } catch {
      return undefined;
    }
  }, [userAmount, tokenDecimals]);

  const currencyAmount = useMemo(() => {
    if (!parsedAmount || !tokenAddress) return undefined;
    console.log('User Amount:', userAmount);
    const token = new Token(80094, tokenAddress, tokenDecimals, tokenSymbol);
    return CurrencyAmount.fromRawAmount(token, parsedAmount.toString());
  }, [parsedAmount, tokenAddress, tokenDecimals, tokenSymbol]);
  console.log('Currency Amount:', currencyAmount);

  const { approvalState, approvalCallback } = useApprove(
    currencyAmount,
    ALL_IN_ONE_VAULT
  );

  console.log('%c📊 Approval State:', 'color: #3B82F6; background-color: #EFF6FF; padding: 2px 6px; border-radius: 4px;', approvalState);
  console.log('%c🏦 ALL_IN_ONE_VAULT:', 'color: #059669; background-color: #ECFDF5; padding: 2px 6px; border-radius: 4px;', ALL_IN_ONE_VAULT);
  console.log('%c🪙 Token Address:', 'color: #D97706; background-color: #FFFBEB; padding: 2px 6px; border-radius: 4px;', tokenAddress);
  console.log('%c💰 Parsed Amount:', 'color: #7C3AED; background-color: #F3E8FF; padding: 2px 6px; border-radius: 4px;', parsedAmount);

  const { writeContractAsync: executeGetReceipt } = useWriteContract();

  const handleApprove = async () => {
    try {
      setIsProcessing(true);
      await approvalCallback?.();
    } catch (error) {
      console.error('Approval failed:', error);
      onError?.('Approval failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBurnToVault = async () => {
    if (!parsedAmount) {
      onError?.('Invalid amount');
      return;
    }

    try {
      setIsProcessing(true);
      console.log('Executing burn to vault directly');
      await executeGetReceipt({
        address: ALL_IN_ONE_VAULT,
        abi: AllInOneVaultABI,
        functionName: 'getReceipt',
        args: [tokenAddress, parsedAmount],
      });
      onSuccess?.();
    } catch (error) {
      console.error('Burn to vault failed:', error);
      onError?.('Burn to vault failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const getButtonConfig = () => {
    if (!userAddress) {
      return { text: 'Connect Wallet', disabled: true, onClick: () => {} };
    }

    if (!parsedAmount || parsedAmount === BigInt(0)) {
      return { text: 'Enter Amount', disabled: true, onClick: () => {} };
    }

    // if (!hasSufficientBalance) {
    //   return {
    //     text: `Insufficient ${tokenSymbol}`,
    //     disabled: true,
    //     onClick: () => {},
    //   };
    // }

    if (approvalState === ApprovalState.NOT_APPROVED) {
      return {
        text: isProcessing ? 'Approving...' : 'Approve',
        disabled: isProcessing,
        onClick: handleApprove,
      };
    }

    if (approvalState === ApprovalState.PENDING) {
      return {
        text: 'Approval Pending...',
        disabled: true,
        onClick: () => {},
      };
    }

    if (approvalState === ApprovalState.APPROVED) {
      return {
        text: isProcessing ? 'Processing...' : 'Burn2Vault',
        disabled: isProcessing,
        onClick: handleBurnToVault,
      };
    }

    return { text: 'Unknown', disabled: true, onClick: () => {} };
  };

  const buttonConfig = getButtonConfig();

  return (
    <button
      onClick={buttonConfig.onClick}
      disabled={buttonConfig.disabled}
      className={`
      px-6 py-3 rounded-lg font-medium transition-all w-full shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] duration-300
      ${
        buttonConfig.disabled
          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
          : 'bg-amber-500 text-white hover:bg-amber-600 active:bg-amber-600'
      }
      `}
    >
      {buttonConfig.text}
    </button>
  );
}