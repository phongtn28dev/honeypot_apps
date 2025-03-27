import { useUserBgtVaults } from '@/lib/hooks/useUserBgtVaults';
import { BGTVault } from '@/services/contract/bgt-market/bgt-vault';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { useState } from 'react';
import { Address, formatEther } from 'viem';
import { LoadingDisplay } from '../LoadingDisplay/LoadingDisplay';
import Button from '../button/v3';
import { wallet } from '@/services/wallet';
import { ADDRESS_ZERO } from '@cryptoalgebra/sdk';

export const UserBgtVaults = observer(() => {
  const { bgtVaults, loading } = useUserBgtVaults();
  console.log(bgtVaults);

  return (
    <div className="w-full h-full rounded-[24px]  bg-white p-5">
      <div className="flex items-center gap-2">
        <span className="w-full text-black text-base md:text-xl font-bold text-center">
          My Vaults
        </span>
      </div>
      {loading ? (
        <div className="w-full h-full p-10">
          <LoadingDisplay />
        </div>
      ) : (
        <div>
          {bgtVaults
            .filter((vault) => Number(vault.userBgtInVault) > 0)
            .map((vault) => (
              <div
                className="flex justify-between items-center m-1 p-2 rounded-md bg-black/10 text-black text-center"
                key={vault.address}
              >
                <span>{vault.name.replace('|', '')}</span>{' '}
                <span className="flex justify-center">
                  {Number(formatEther(BigInt(vault.userBgtInVault))).toFixed(5)}{' '}
                  BGT
                </span>
                <span>
                  {vault.bgtVaultApproved ? (
                    <Button
                      className="bg-[red]"
                      onPress={() => vault.setOperator(ADDRESS_ZERO)}
                    >
                      Unapprove
                    </Button>
                  ) : (
                    <Button
                      className="bg-[green]"
                      onPress={() =>
                        vault.setOperator(
                          wallet.currentChain.contracts.bgtMarket as Address
                        )
                      }
                    >
                      Approve
                    </Button>
                  )}
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
