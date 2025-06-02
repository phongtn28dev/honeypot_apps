import { ContractConfig, defineConfig } from '@wagmi/cli';
import { actions, react } from '@wagmi/cli/plugins';
import { ALL_IN_ONE_VAULT } from './config/algebra/addresses';
import { AllInOneVaultABI } from './lib/abis/all-in-one-vault';

const contracts: ContractConfig[] = [
  {
    address: ALL_IN_ONE_VAULT,
    abi: AllInOneVaultABI,
    name: 'AllInOneVault',
  },
];

export default defineConfig({
  out: "./wagmi-generated.ts",
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