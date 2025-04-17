import { useRouter } from 'next/router';
import { observer } from 'mobx-react-lite';
import { NextLayoutPage } from '@/types/nextjs';
import { MemeView } from './MemeView';
import { DedicatedTokenView } from './DedicatedTokenView';
import { dedicatedPot2pumps } from '@/config/dedicatedPot2pump';

const LaunchPage: NextLayoutPage = observer(() => {
  const router = useRouter();
  const { pair: launchTokenAddress } = router.query;
  console.log(launchTokenAddress);

  if (
    dedicatedPot2pumps.some(
      (token) =>
        token.tokenAddress.toLowerCase() ===
        launchTokenAddress?.toString().toLowerCase()
    )
  ) {
    return <DedicatedTokenView />;
  }

  return <MemeView />;
});

export default LaunchPage;
