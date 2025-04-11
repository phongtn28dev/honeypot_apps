import { BGTVault } from '@/services/contract/bgt-market/bgt-vault';
import { useEffect, useState } from 'react';
import { Address } from 'viem';
import { usePollingBlockNumber } from './useBlockNumber';
import { wallet } from '@/services/wallet';
import { useObserver } from 'mobx-react-lite';
import { useBGTVaults } from '../algebra/graphql/clients/bgt-market';

export function useUserBgtVaults() {
  const [bgtVaults, setBgtVaults] = useState<BGTVault[]>([]);
  const { block } = usePollingBlockNumber();
  const [loading, setLoading] = useState<boolean>(true);
  const account = useObserver(() => {
    return wallet.account;
  });

  const { data: ValidatedVaultAddresses, loading: bgtVaultsLoading } =
    useBGTVaults();

  useEffect(() => {
    if (bgtVaults.length > 0) return;
    const vaultList = ValidatedVaultAddresses.map((vault) => {
      return BGTVault.getBgtVault({
        address: vault.address as Address,
        name: vault.metadata?.name,
        logoURI: vault.metadata?.logoURI,
      });
    });

    console.log('vaultList', vaultList);

    setBgtVaults(vaultList);
  }, [ValidatedVaultAddresses]);

  useEffect(() => {
    if (bgtVaults.length == 0 || !account) {
      return;
    }

    console.log('bgtVaults', bgtVaults);

    Promise.all([
      bgtVaults.map(async (vault) => {
        await vault.updateCurrentUserBgtInVault();
        await vault.updateCurrentUserBgtVaultAppoveState();
      }),
    ]).then((res) => {
      setLoading(false);
    });
  }, [block, bgtVaults, account]);

  return { bgtVaults, loading };
}
