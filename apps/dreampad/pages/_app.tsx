import '@/styles/globals.css';
import '@/styles/overrides/reactjs-popup.css';
import '@/styles/overrides/toastify.css';
//@ts-ignore
import type { AppProps } from 'next/app';
import { Layout } from '@/components/layout';
import { NextLayoutPage } from '@/types/nextjs';
import { WagmiProvider, useWalletClient } from 'wagmi';
import { AvatarComponent, RainbowKitProvider } from '@usecapsule/rainbowkit';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
// import "@rainbow-me/rainbowkit/styles.css";
import '@usecapsule/rainbowkit/styles.css';
import { NextUIProvider } from '@nextui-org/react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { config } from '@/config/wagmi';
import { trpc, trpcQueryClient } from '../lib/trpc';
import { useEffect, useState } from 'react';
import { useInfoClient, wallet } from '@honeypot/shared';
import { DM_Sans, Inter } from 'next/font/google';
import { Inspector, InspectParams } from 'react-dev-inspector';
import { Analytics } from '@vercel/analytics/react';
// import { capsuleClient, capsuleModalProps } from "@/config/wagmi/capsualWallet";
import { ApolloProvider } from '@apollo/client';
import Image from 'next/image';
import { WalletClient } from 'viem';

// enableStaticRendering(true)
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retryDelay: 1000,
      retry: 12,
      gcTime: 1000 * 60,
      staleTime: 1000 * 60,
    },
  },
});

const dmSans = DM_Sans({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin', 'latin-ext'],
  variable: '--dm_sans',
});

const Provider = ({ children }: { children: React.ReactNode }) => {
  const { data: walletClient } = useWalletClient({
    config,
  });

  useEffect(() => {
    if (walletClient) {
      wallet.initWallet(walletClient);
    }
  }, [walletClient]);

  useEffect(() => {
    wallet.initWallet();
  }, []);

  return children;
};

const CustomAvatar: AvatarComponent = ({ address, ensImage, size }) => {
  return (
    <Image
      src={'/images/empty-logo.png'}
      alt="User avatar"
      width={size}
      height={size}
      style={{ borderRadius: 999 }}
    />
  );
};

export default function App({
  Component,
  pageProps,
}: AppProps & {
  Component: NextLayoutPage;
}) {
  const reactInApp = require('react');

  if (typeof window !== 'undefined') {
    // Save to global for comparison
    (window as any).__REACT_FROM_APP__ = reactInApp;
  }

  const ComponentLayout = Component.Layout || Layout;
  const infoClient = useInfoClient();

  return (
    <trpc.Provider client={trpcQueryClient} queryClient={queryClient}>
      <Analytics />
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <ApolloProvider client={infoClient}>
            <RainbowKitProvider
              avatar={CustomAvatar}
              // capsule={capsuleClient}
              // capsuleIntegratedProps={capsuleModalProps}
            >
              <NextUIProvider>
                <Provider>
                  <Inspector
                    keys={['Ctrl', 'Shift', 'Z']}
                    onClickElement={({ codeInfo }: InspectParams) => {
                      if (!codeInfo) {
                        return;
                      }

                      window.open(
                        `cursor://file/${codeInfo.absolutePath}:${codeInfo.lineNumber}:${codeInfo.columnNumber}`,
                        '_blank'
                      );
                    }}
                  ></Inspector>
                  <ComponentLayout className={`${dmSans.className}`}>
                    <Component {...pageProps} />
                  </ComponentLayout>
                </Provider>
                <ToastContainer></ToastContainer>
              </NextUIProvider>
            </RainbowKitProvider>
          </ApolloProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </trpc.Provider>
  );
}
