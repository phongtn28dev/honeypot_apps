import { Switch } from '@nextui-org/react';
import { globalService } from '@/services/global';
import { observer } from 'mobx-react-lite';
import { CardContainer, HoneyContainer } from '@/components/CardContianer';
import TokenLogo from '@/components/TokenLogo/TokenLogo';
import { wallet } from '@honeypot/shared';
import { Token } from '@/services/contract/token';

const MarketBaseTokenSwitcher = observer(() => {
  return (
    <CardContainer addtionalClassName="flex flex-col items-center m-2 w-auto">
      <div>switch base token</div>
      <div className="flex flex-row items-center gap-2">
        <span className="text-sm font-medium">
          {wallet.currentChain &&
            wallet.currentChain.validatedTokens.find(
              (token) => token.symbol === 'WBERA'
            ) && (
              <TokenLogo
                token={
                  wallet.currentChain.validatedTokens.find(
                    (token) => token.symbol === 'WBERA'
                  ) as Token
                }
                disableTooltip
                size={20}
              />
            )}
        </span>
        <Switch
          isSelected={globalService.BgtMarketBaseToken === 'HONEY'}
          onValueChange={() => globalService.switchMarketBaseToken()}
        />
        <span className="text-sm font-medium">
          {wallet.currentChain &&
            wallet.currentChain.validatedTokens.find(
              (token) => token.symbol === 'HONEY'
            ) && (
              <TokenLogo
                token={
                  wallet.currentChain.validatedTokens.find(
                    (token) => token.symbol === 'HONEY'
                  ) as Token
                }
                disableTooltip
                size={20}
              />
            )}
        </span>
      </div>
    </CardContainer>
  );
});

export default MarketBaseTokenSwitcher;
