import { toast } from 'react-toastify';
import { ReceiptTableData } from '@/components/Table/table.config';

export const tokenAddressMap: Record<string, string> = {
  LBGT: '0xLBGT_ADDRESS',
  BERA: '0xBERA_ADDRESS',
  HONEY: '0xHONEY_ADDRESS',
  BGT: '0xBGT_ADDRESS',
  USDC: '0xUSDC_ADDRESS',
  WETH: '0xWETH_ADDRESS',
};

export const calculateSummaryData = (
  token: string,
  amountStr: string,
  totalWeight?: bigint | null,
  tokenBalance?: bigint | null
) => {
  if (!token || !amountStr) return;

  const weightPerToken = 2.5;
  const amountValue = parseFloat(amountStr);
  const receiptWeight = (weightPerToken * amountValue).toFixed(1);
  const balance = tokenBalance ? Number(tokenBalance) / 1e18 : 15.0; 

  return {
    weightPerToken: weightPerToken.toString(),
    balance: balance.toFixed(1),
    receiptWeight: receiptWeight,
  };
};

export const handleTokenChange = (
  token: string,
  amount: string,
  totalWeight: bigint | null | undefined,
  tokenBalance: bigint | null | undefined,
  setSelectedToken: (token: string) => void,
  setInsufficientBalance: (insufficient: boolean) => void,
  setSummaryData: (data: any) => void
) => {
  setSelectedToken(token);
  setInsufficientBalance(false);

  if (token && amount) {
    const newSummaryData = calculateSummaryData(
      token,
      amount,
      totalWeight,
      tokenBalance
    );
    if (newSummaryData) {
      setSummaryData(newSummaryData);

      const amountValue = parseFloat(amount);
      const balanceValue = parseFloat(newSummaryData.balance);

      if (amountValue > balanceValue) {
        setInsufficientBalance(true);
      }
    }
  }
};

export const handleAmountChange = (
  newAmount: string,
  selectedToken: string,
  totalWeight: bigint | null | undefined,
  tokenBalance: bigint | null | undefined,
  setAmount: (amount: string) => void,
  setInsufficientBalance: (insufficient: boolean) => void,
  setSummaryData: (data: any) => void
) => {
  setAmount(newAmount);

  if (selectedToken && newAmount) {
    const newSummaryData = calculateSummaryData(
      selectedToken,
      newAmount,
      totalWeight,
      tokenBalance
    );
    if (newSummaryData) {
      setSummaryData(newSummaryData);

      const amountValue = parseFloat(newAmount);
      const balanceValue = parseFloat(newSummaryData.balance);

      if (amountValue > balanceValue) {
        setInsufficientBalance(true);
        toast.error(
          `Insufficient balance! You only have ${balanceValue} ${selectedToken} tokens available.`,
          {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          }
        );
      } else {
        setInsufficientBalance(false);
      }
    }
  } else {
    setInsufficientBalance(false);
  }
};

export const handleCooldownComplete = (
  event: CustomEvent,
  setCurrentTableData: React.Dispatch<React.SetStateAction<ReceiptTableData[]>>
) => {
  const receiptId = event.detail;
  setCurrentTableData((prevData) =>
    prevData.map((item) => {
      if (item.id === receiptId) {
        return {
          ...item,
          isCooldownActive: false,
          cooldown: '00:00:00',
          action: {
            ...item.action,
            label: 'Claim',
            isDisabled: false,
            className:
              'bg-orange-400 hover:bg-orange-500 text-white px-2 py-1 rounded-md',
          },
        };
      }
      return item;
    })
  );
};

export const updateClaimedReceipt = (
  claimingReceiptId: string,
  setCurrentTableData: React.Dispatch<React.SetStateAction<ReceiptTableData[]>>
) => {
  setCurrentTableData((prevData) =>
    prevData.map((item) => {
      if (item.id === claimingReceiptId) {
        return {
          ...item,
          action: {
            label: 'Claimed',
            variant: 'outline' as const,
            isDisabled: true,
            className: 'bg-gray-300 text-white px-2 py-1 rounded-md',
            onClick: () =>
              console.log(`Already claimed receipt ${claimingReceiptId}`),
          },
        };
      }
      return item;
    })
  );
};

export const resetFormState = (
  setSelectedToken: (token: string) => void,
  setAmount: (amount: string) => void,
  setInsufficientBalance: (insufficient: boolean) => void,
  setSummaryData: (data: any) => void
) => {
  setSelectedToken('');
  setAmount('');
  setInsufficientBalance(false);
  setSummaryData({
    weightPerToken: '-',
    balance: '-',
    receiptWeight: '-',
  });
};
