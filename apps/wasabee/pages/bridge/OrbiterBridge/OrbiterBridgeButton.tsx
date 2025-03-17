import { Button } from '@nextui-org/react';
import { observer } from 'mobx-react-lite';
import { orbiterBridgeService } from '@/services/orbiterBridge';
import { wallet } from '@/services/wallet';

export const OrbiterBridgeButton = observer(() => {
  if (!wallet.isInit) {
    return <Button isDisabled>Connect Walle to Bridge</Button>;
  }

  if (!orbiterBridgeService.fromChainId) {
    return <Button isDisabled>Select Chain</Button>;
  }

  if (orbiterBridgeService.fromChainId !== wallet.currentChainId.toString()) {
    return (
      <Button
        onPress={() =>
          wallet.changeChain(Number(orbiterBridgeService.fromChainId))
        }
      >
        Change Network
      </Button>
    );
  }

  return (
    <Button
      onPress={() => orbiterBridgeService.bridge()}
      isDisabled={
        !orbiterBridgeService.router ||
        !orbiterBridgeService.fromAmount ||
        !orbiterBridgeService.selectedToken ||
        !orbiterBridgeService.toChainId ||
        !orbiterBridgeService.fromChainId ||
        orbiterBridgeService.toAmount === '0'
      }
    >
      Bridge
    </Button>
  );
});

export default OrbiterBridgeButton;
