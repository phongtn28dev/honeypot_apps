import { connectorsForWallets, getDefaultConfig } from '@rainbow-me/rainbowkit';
import {
  rainbowWallet,
  bitgetWallet,
  okxWallet,
  walletConnectWallet,
  metaMaskWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { injected, safe } from 'wagmi/connectors';
import { cookieStorage, createStorage, Config, http } from 'wagmi';
import { berachainMainnet, networks } from '../chains';

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
    transports: {
      ...Object.fromEntries(
        networks.map((network) => [
          network.chainId,
          http(network.chain.rpcUrls.default.http[0]),
        ])
      ),
      [berachainMainnet.id]: http(
        'https://api.henlo-winnie.dev/v1/mainnet/08c3ed43-6326-4be6-9dc2-78a5f77b7382'
      ),
    },
    // @ts-ignore
    chains: networks.map((network) => network.chain),
    ssr: true, // If your dApp uses server side rendering (SSR
    storage: createStorage({
      storage: cookieStorage,
    }),
    ...overrideConfig,
  });
