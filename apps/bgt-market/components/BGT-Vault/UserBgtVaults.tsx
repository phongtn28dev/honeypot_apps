import { useUserBgtVaults } from '@/lib/hooks/useUserBgtVaults';
import { BGTVault } from '@/services/contract/bgt-market/bgt-vault';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { useState } from 'react';
import { formatEther } from 'viem';
import { LoadingDisplay } from '../LoadingDisplay/LoadingDisplay';

export const UserBgtVaults = observer(() => {
  const { bgtVaults, loading } = useUserBgtVaults();

  return (
    <div className="w-full h-full rounded-[24px]  bg-white p-5">
      <div className="flex items-center gap-2">
        <span className="w-full text-black text-base md:text-xl font-bold text-center">
          My Vaults
        </span>
      </div>
      {loading ? (
        <LoadingDisplay />
      ) : (
        <div>
          {bgtVaults
            .filter((vault) => Number(vault.userBgtInVault) > 0)
            .map((vault) => (
              <div className="flex justify-between" key={vault.address}>
                <span>{vault.name}</span>{' '}
                <span>
                  {Number(formatEther(BigInt(vault.userBgtInVault))).toFixed(5)}{' '}
                  BGT
                </span>
              </div>
            ))}

          {bgtVaults.filter((vault) => Number(vault.userBgtInVault) > 0)
            .length === 0 && (
            <div className="flex justify-center text-black/50 h-[200px] items-center">
              No Vaults
            </div>
          )}
        </div>
      )}
    </div>
  );
});
