export const tokenAddressMap: Record<string, string> = {
  'LBGT': '0xLBGT_ADDRESS', 
  'BERA': '0xBERA_ADDRESS',
  'HONEY': '0xHONEY_ADDRESS',
  'BGT': '0xBGT_ADDRESS',
  'USDC': '0xUSDC_ADDRESS',
  'WETH': '0xWETH_ADDRESS',
};

export const calculateSummaryData = (
  token: string, 
  amountStr: string, 
  totalWeight?: bigint | null
) => {
  if (!token || !amountStr) return;

  const weightPerToken = 2.5;
  const amountValue = parseFloat(amountStr);
  const receiptWeight = (amountValue * weightPerToken).toFixed(1);
  const currentTotalWeight = totalWeight ? parseFloat(totalWeight.toString()) : 30;
  const estimatedWeight = (currentTotalWeight + amountValue * weightPerToken).toFixed(1);
  
  const tokenBalance = 15.0;
  
  return {
    weightPerToken: weightPerToken.toString(),
    balance: tokenBalance.toFixed(1),
    receiptWeight: receiptWeight,
    estimatedWeight: estimatedWeight,
  };
};