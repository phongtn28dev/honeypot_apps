import { ValidatedVaultAddresses } from '@/config/validatedVaultAddresses';
import { BGTVault } from '@/services/contract/bgt-market/bgt-vault';
import { useEffect, useState } from 'react';
import { Address } from 'viem';
import { usePollingBlockNumber } from './useBlockNumber';
import { wallet } from '@/services/wallet';
import { useObserver } from 'mobx-react-lite';

export function useUserBgtVaults() {
  const [bgtVaults, setBgtVaults] = useState<BGTVault[]>([]);
  const { block } = usePollingBlockNumber();
  const [loading, setLoading] = useState<boolean>(true);
  const account = useObserver(() => {
    return wallet.account;
  });

  useEffect(() => {
    if (bgtVaults.length > 0) return;
    const vaultList = Object.entries(ValidatedVaultAddresses).map(
      ([key, value]) => {
        return BGTVault.getBgtVault({ address: key as Address, name: value });
      }
    );

    setBgtVaults(vaultList);
  }, [ValidatedVaultAddresses]);

  useEffect(() => {
    if (bgtVaults.length == 0 || !account) {
      return;
    }

    Promise.all([
      ...bgtVaults.map(async (vault) => {
        await vault.updateCurrentUserBgtInVault();
        await vault.updateCurrentUserBgtVaultAppoveState();
      }),
    ]).then((res) => {
      setLoading(false);
    });
  }, [block, bgtVaults, account]);

  return { bgtVaults, loading };
}
