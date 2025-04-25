import { observer } from 'mobx-react-lite';
import { useSwitchChain, useChainId } from 'wagmi';
import { networks } from '@honeypot/shared/lib/chains';
import { useEffect } from 'react';
import { wallet } from '@honeypot/shared';
import { CardContainer } from '@honeypot/shared/components/CardContianer';

const ClaimTokenPage = observer(() => {
  const { chains, switchChain } = useSwitchChain();
  const chain = useChainId();

  useEffect(() => {
    if (chain !== 80094) {
      // @ts-ignore
      switchChain(networks.find((network) => network.chainId === 80094)?.chain);
    }
  }, [chain]);
  if (chain !== 80094) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div>Switching to Berachain to continue</div>
        <div>Please wait...</div>
      </div>
    );
  }
  return (
    <div className="w-full flex flex-col items-center justify-center ">
      <CardContainer className="mx-auto max-w-[800px]">
        <div>ClaimTokenPage</div>
      </CardContainer>
    </div>
  );
});

export default ClaimTokenPage;
