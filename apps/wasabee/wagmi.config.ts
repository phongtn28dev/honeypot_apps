import { ContractConfig, defineConfig } from '@wagmi/cli';
import { actions, react } from '@wagmi/cli/plugins';
import {
  algebraFactoryABI,
  algebraPoolABI,
  algebraPositionManagerABI,
  algebraQuoterABI,
  algebraBasePluginABI,
  algebraRouterABI,
  algebraQuoterV2ABI,
  algebraEternalFarmingABI,
  farmingCenterABI,
  wNativeABI,
  algebraVirtualPoolABI,
} from './lib/abis/algebra-contracts/ABIs';
import { ICHIVaultABI } from './lib/abis/aquabera/ICHIVault';
import { ICHIVaultFactoryABI } from './lib/abis/aquabera/ICHIVaultFactory';
import { ERC20ABI } from './lib/abis/erc20';
import { networks } from './services/chain';
import { Address } from 'viem';

const contracts: ContractConfig[] = [
  {
    address: networks.reduce((acc, network) => {
      acc[network.chain.id] = network.contracts.algebraFactory;
      return acc;
    }, {} as Record<number, Address>),
    abi: algebraFactoryABI,
    name: 'AlgebraFactory',
  },
  {
    abi: algebraPoolABI,
    name: 'AlgebraPool',
  },
  {
    abi: algebraBasePluginABI,
    name: 'AlgebraBasePlugin',
  },
  {
    address: networks.reduce((acc, network) => {
      acc[network.chain.id] = network.contracts.algebraPositionManager;
      return acc;
    }, {} as Record<number, Address>),
    abi: algebraPositionManagerABI,
    name: 'AlgebraPositionManager',
  },
  {
    address: networks.reduce((acc, network) => {
      acc[network.chain.id] = network.contracts.algebraQuoter;
      return acc;
    }, {} as Record<number, Address>),
    abi: algebraQuoterABI,
    name: 'AlgebraQuoter',
  },
  {
    address: networks.reduce((acc, network) => {
      acc[network.chain.id] = network.contracts.algebraQuoterV2;
      return acc;
    }, {} as Record<number, Address>),
    abi: algebraQuoterV2ABI,
    name: 'AlgerbaQuoterV2',
  },
  {
    address: networks.reduce((acc, network) => {
      acc[network.chain.id] = network.contracts.algebraSwapRouter;
      return acc;
    }, {} as Record<number, Address>),
    abi: algebraRouterABI,
    name: 'AlgebraRouter',
  },
  {
    address: networks.reduce((acc, network) => {
      acc[network.chain.id] = network.contracts.algebraEternalFarming;
      return acc;
    }, {} as Record<number, Address>),
    abi: algebraEternalFarmingABI,
    name: 'AlgebraEternalFarming',
  },
  {
    address: networks.reduce((acc, network) => {
      acc[network.chain.id] = network.contracts.algebraFarmingCenter;
      return acc;
    }, {} as Record<number, Address>),
    abi: farmingCenterABI,
    name: 'FarmingCenter',
  },
  {
    abi: algebraVirtualPoolABI,
    name: 'AlgebraVirtualPool',
  },
  {
    abi: wNativeABI,
    name: 'WrappedNative',
  },
  {
    abi: ERC20ABI,
    name: 'ERC20',
  },
  {
    abi: ICHIVaultABI,
    name: 'ICHIVault',
  },
  {
    abi: ICHIVaultFactoryABI,
    name: 'ICHIVaultFactory',
  },
];

export default defineConfig({
  out: 'lib/generated/wagmi.ts',
  contracts,
  plugins: [react()],
});
