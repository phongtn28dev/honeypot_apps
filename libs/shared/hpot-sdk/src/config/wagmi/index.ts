import { networks } from '@honeypot/shared';
import { connectorsForWallets, getDefaultConfig } from '@rainbow-me/rainbowkit';
import {
  rainbowWallet,
  bitgetWallet,
  okxWallet,
  walletConnectWallet,
  metaMaskWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { injected, safe } from 'wagmi/connectors';
import { createConfig, http, cookieStorage, createStorage, mock } from 'wagmi';
// import { holdstationWallet } from "./holdstationWallet";
// import { capsuleWallet } from "./capsualWallet";
// import { berasigWallet } from "./berasigWallet";

const pId = '1d1c8b5204bfbd57502685fc0934a57d';

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

const connectors = [
  safe(),
  injected(),
  ...connectorsForWallets(
    [
      {
        groupName: 'Recommended',
        wallets: customWallets,
      },
    ],
    {
      appName: 'Honypot Finance',
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

export const createWagmiConfig = () =>
  getDefaultConfig({
    connectors,
    appName: 'Honypot Finance',
    projectId: '1d1c8b5204bfbd57502685fc0934a57d',
    // @ts-ignore
    chains: networks.map((network) => network.chain),
    ssr: true, // If your dApp uses server side rendering (SSR
    storage: createStorage({
      storage: cookieStorage,
    }),
  });
