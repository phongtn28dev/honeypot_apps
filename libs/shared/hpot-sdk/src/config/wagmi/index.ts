import { connectorsForWallets, getDefaultConfig } from '@rainbow-me/rainbowkit';
import {
  rainbowWallet,
  bitgetWallet,
  okxWallet,
  walletConnectWallet,
  metaMaskWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { injected, safe } from 'wagmi/connectors';
import { cookieStorage, createStorage, Config } from 'wagmi';
import { networks } from '../chains';

const pId = '23b1ff4e22147bdf7cab13c0ee4bed90';

let customWallets = () => [
  metaMaskWallet,
  rainbowWallet,
  walletConnectWallet,
  bitgetWallet,
  okxWallet,
  // holdstationWallet,
  // berasigWallet,
];

// if(!window.bitkeep){
//   customWallets.unshift(bitgetWallet);
// }

// Create Capsule wallet connector

const connectors = () => [
  safe(),
  injected(),
  ...connectorsForWallets(
    [
      {
        groupName: 'Recommended',
        wallets: customWallets(),
      },
    ],
    {
      appName: 'honeypot-finance',
      projectId: pId,
    }
  ),
];

// if (process.env.NODE_ENV === "development") {
//   connectors.push(
//     mock({
//       accounts: ["0xb67daf60d82de28e54d479509b49b82d7157af6b"],
//     })
//   );
// }

export const createWagmiConfig = (overrideConfig?: Partial<Config>) =>
  getDefaultConfig({
    connectors: connectors(),
    appName: 'honeypot-finance',
    projectId: pId,
    // @ts-ignore
    chains: networks.map((network) => network.chain),
    ssr: true, // If your dApp uses server side rendering (SSR
    storage: createStorage({
      storage: cookieStorage,
    }),
    ...overrideConfig,
  });
