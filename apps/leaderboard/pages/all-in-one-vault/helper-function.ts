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
  totalWeight?: bigint | null,
  tokenBalance?: bigint | null
) => {
  if (!token || !amountStr) return;

  const weightPerToken = 2.5;
  const amountValue = parseFloat(amountStr);
  
  // Apply the refactored formula: receiptWeight = weightPerToken * amountValue
  const receiptWeight = (weightPerToken * amountValue).toFixed(1);
  
  // Use real token balance from ERC20 balanceOf, fallback to 15.0 if not available
  const balance = tokenBalance ? Number(tokenBalance) / 1e18 : 15.0; // Assuming 18 decimals
  
  return {
    weightPerToken: weightPerToken.toString(),
    balance: balance.toFixed(1),
    receiptWeight: receiptWeight,
  };
};