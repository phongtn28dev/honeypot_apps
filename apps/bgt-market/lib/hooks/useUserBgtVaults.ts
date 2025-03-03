import { ValidatedVaultAddresses } from '@/config/validatedVaultAddresses';
import { BGTVault } from '@/services/contract/bgt-market/bgt-vault';
import { useEffect, useState } from 'react';
import { Address } from 'viem';
import { usePollingBlockNumber } from './useBlockNumber';

export function useUserBgtVaults() {
  const [bgtVaults, setBgtVaults] = useState<BGTVault[]>([]);
  const { block } = usePollingBlockNumber();

  useEffect(() => {
    const vaultList = Object.entries(ValidatedVaultAddresses).map(
      ([key, value]) => {
        return new BGTVault({ address: key as Address, name: value });
      }
    );

    setBgtVaults(vaultList);
  }, [ValidatedVaultAddresses]);

  useEffect(() => {
    bgtVaults.forEach((vault) => {
      vault.updateCurrentUserBgtInVault();
    });
  }, [block]);

  return { bgtVaults };
}
