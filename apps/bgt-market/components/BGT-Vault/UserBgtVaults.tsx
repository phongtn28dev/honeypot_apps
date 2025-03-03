import { useUserBgtVaults } from '@/lib/hooks/useUserBgtVaults';
import { observer } from 'mobx-react-lite';
import { formatEther } from 'viem';

export const UserBgtVaults = observer(() => {
  const { bgtVaults } = useUserBgtVaults();

  return (
    <div className="w-full h-full rounded-[24px]  bg-white p-5">
      <div className="flex items-center gap-2">
        <span className="w-full text-black text-base md:text-xl font-bold text-center">
          My Vaults
        </span>
      </div>
      <div>
        {bgtVaults
          .filter((vault) => Number(vault.userBgtInVault) > 0)
          .map((vault) => (
            <div className="flex justify-between">
              {' '}
              <span>{vault.name}</span>{' '}
              <span>
                {Number(formatEther(BigInt(vault.userBgtInVault))).toFixed(5)}{' '}
                BGT
              </span>
            </div>
          ))}
      </div>
    </div>
  );
});
