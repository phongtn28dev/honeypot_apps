import { orbiterBridgeService } from '@/services/orbiterBridge';
import { wallet } from '@/services/wallet';
import { useEffect, useState } from 'react';
import { TokenSelector } from '@/components/TokenSelector/v3';
import { Token } from '@/services/contract/token';
import { Currency } from '@cryptoalgebra/sdk';

export default function OrbiterBridgeSelectToken() {
  const [tokens, setTokens] = useState<Token[]>([]);

  useEffect(() => {
    if (wallet.currentChainId) {
      const tokens = orbiterBridgeService.getAvailableTokens(
        wallet.currentChainId.toString()
      );
      setTokens(tokens);
      orbiterBridgeService.setSelectedToken(tokens[0]);
    }
  }, [wallet.currentChainId]);

  const handleTokenSelect = (token: Token) => {
    orbiterBridgeService.setSelectedToken(token);
  };

  return (
    <TokenSelector
      staticTokenList={tokens}
      disableSearch={true}
      value={orbiterBridgeService.selectedToken}
      onSelect={async (token) => {
        await token.init();
        handleTokenSelect(token);
      }}
    />
  );
}
