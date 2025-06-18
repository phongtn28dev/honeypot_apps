import { ContractConfig, defineConfig } from '@wagmi/cli';
import { actions, react } from '@wagmi/cli/plugins';
import { AllInOneVaultABI } from './lib/abis/all-in-one-vault';
import {
  ALGEBRA_FACTORY,
  ALGEBRA_POSITION_MANAGER,
  ALGEBRA_ROUTER,
  ALL_IN_ONE_VAULT,
  ALL_IN_ONE_VAULT_PROXY,
} from './config/algebra/addresses';

const contracts: ContractConfig[] = [
  {
    address: ALL_IN_ONE_VAULT,
    abi: AllInOneVaultABI,
    name: 'AllInOneVault',
  },
];

export default defineConfig({
  out: './wagmi-generated.ts',
  contracts,
  plugins: [
    actions({
      //watchContractEvent: false,
    }),
    react({
      // useContractEvent: false,
      //useContractItemEvent: false,
    }),
  ],
});
