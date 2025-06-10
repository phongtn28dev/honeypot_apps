import { useState, useMemo } from 'react';
import { Address, formatUnits, parseUnits } from 'viem';
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useSimulateContract,
} from 'wagmi';
import { useApprove } from '@/lib/algebra/hooks/common/useApprove';
import { ALL_IN_ONE_VAULT } from '@/config/algebra/addresses';
import { ERC20ABI } from '@/lib/abis/erc20';
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

  const { data: userBalance } = useReadContract({
    address: tokenAddress,
    abi: ERC20ABI,
    functionName: 'balanceOf',
    args: [userAddress as Address],
    query: {
      enabled: !!userAddress,
    },
  });

  const currencyAmount = useMemo(() => {
    if (!parsedAmount || !tokenAddress) return undefined;

    const token = new Token(80094, tokenAddress, tokenDecimals, tokenSymbol);

    return CurrencyAmount.fromRawAmount(token, parsedAmount.toString());
  }, [parsedAmount, tokenAddress, tokenDecimals, tokenSymbol]);

  const { approvalState, approvalCallback } = useApprove(
    currencyAmount,
    ALL_IN_ONE_VAULT
  );

  const { data: receiptConfig } = useSimulateContract({
    address: ALL_IN_ONE_VAULT,
    abi: AllInOneVaultABI,
    functionName: 'getReceipt',
    args: [tokenAddress, parsedAmount || BigInt(0)],
    query: {
      enabled: approvalState === ApprovalState.APPROVED && !!parsedAmount,
    },
  });

  const { writeContractAsync: executeGetReceipt } = useWriteContract();

  const hasSufficientBalance = useMemo(() => {
    if (!userBalance || !parsedAmount) return false;
    return userBalance >= parsedAmount;
  }, [userBalance, parsedAmount]);

  const handleApprove = async () => {
    if (!hasSufficientBalance) {
      onError?.(`Insufficient ${tokenSymbol} balance`);
      return;
    }

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

  // Handle burn to vault action
  const handleBurnToVault = async () => {
    if (!receiptConfig) {
      onError?.('Unable to prepare transaction');
      return;
    }

    try {
      setIsProcessing(true);
      await executeGetReceipt(receiptConfig.request);
      onSuccess?.();
    } catch (error) {
      console.error('Burn to vault failed:', error);
      onError?.('Burn to vault failed');
    } finally {
      setIsProcessing(false);
    }
  };

  // Determine button state and text
  const getButtonConfig = () => {
    if (!userAddress) {
      return { text: 'Connect Wallet', disabled: true, onClick: () => {} };
    }

    if (!parsedAmount || parsedAmount === BigInt(0)) {
      return { text: 'Enter Amount', disabled: true, onClick: () => {} };
    }

    if (!hasSufficientBalance) {
      return {
        text: `Insufficient ${tokenSymbol}`,
        disabled: true,
        onClick: () => {},
      };
    }

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
        text: isProcessing ? 'Processing...' : 'burn2Vault',
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
        px-6 py-3 rounded-lg font-medium transition-colors w-full
        ${
          buttonConfig.disabled
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800'
        }
      `}
    >
      {buttonConfig.text}
    </button>
  );
}
