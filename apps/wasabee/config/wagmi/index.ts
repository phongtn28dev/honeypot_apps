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
import { networks } from '@honeypot/shared/config/chains';

const pId = '23b1ff4e22147bdf7cab13c0ee4bed90';

let customWallets = [
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

// REMOVE the 'connectors' variable definition as it's not used by getDefaultConfig directly
// const connectors = [
//   safe(),
//   injected(),
//   ...connectorsForWallets(
//     [
//       {
//         groupName: 'Recommended',
//         wallets: customWallets,
//       },
//     ],
//     {
//       appName: 'honeypot-finance',
//       projectId: pId,
//     }
//   ),
// ];

// if (process.env.NODE_ENV === "development") {
//   connectors.push(
//     mock({
//       accounts: ["0xb67daf60d82de28e54d479509b49b82d7157af6b"],
//     })
//   );
// }

export const createWagmiConfig = getDefaultConfig({
  appName: 'honeypot-finance',
  projectId: pId,
  // @ts-ignore
  chains: networks.map((network) => network.chain),
  ssr: true, // If your dApp uses server side rendering (SSR
  storage: createStorage({
    storage: cookieStorage,
  }),
});
