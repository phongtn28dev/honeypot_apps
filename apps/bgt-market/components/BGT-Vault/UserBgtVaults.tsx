import { useUserBgtVaults } from '@/lib/hooks/useUserBgtVaults';
import { BGTVault } from '@/services/contract/bgt-market/bgt-vault';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { useState } from 'react';
import { formatEther } from 'viem';

export const UserBgtVaults = observer(() => {
  const { bgtVaults } = useUserBgtVaults();

  const [list, setList] = useState<BGTVault[]>([]);

  useEffect(() => {
    setList(bgtVaults.filter((vault) => Number(vault.userBgtInVault) > 0));
  }, [bgtVaults]);

  return (
    <div className="w-full h-full rounded-[24px]  bg-white p-5">
      <div className="flex items-center gap-2">
        <span className="w-full text-black text-base md:text-xl font-bold text-center">
          My Vaults
        </span>
      </div>
      <div>
        {list.map((vault) => (
          <div className="flex justify-between">
            {' '}
            <span>{vault.name}</span>{' '}
            <span>
              {Number(formatEther(BigInt(vault.userBgtInVault))).toFixed(5)} BGT
            </span>
          </div>
        ))}

        {list.length === 0 && (
          <div className="flex justify-center text-black/50 h-[200px] items-center">
            No Vaults
          </div>
        )}
      </div>
    </div>
  );
});
