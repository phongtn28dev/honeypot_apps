import { useEffect, useState } from 'react';
import { watchBlockNumber } from 'viem/actions';
import { usePublicClient } from 'wagmi';

export function usePollingBlockNumber() {
  const [block, setBlock] = useState<string>('');
  const publicclient = usePublicClient();

  useEffect(() => {
    const watch =
      publicclient &&
      watchBlockNumber(publicclient, {
        onBlockNumber: (blockNumber) => {
          setBlock(blockNumber.toString());
        },
      });
  }, [publicclient]);

  return { block };
}
