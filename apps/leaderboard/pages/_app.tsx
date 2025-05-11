import './../styles/globals.css';
import './../styles/overrides/reactjs-popup.css';
import './../styles/overrides/toastify.css';
//@ts-ignore
import type { AppProps } from 'next/app';
import { Layout } from '../components/layout';
import { WagmiProvider, useWalletClient } from 'wagmi';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { AvatarComponent, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import { NextUIProvider } from '@nextui-org/react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createWagmiConfig } from '@honeypot/shared';
import { trpc, trpcQueryClient } from '@honeypot/shared/lib/trpc/trpc';
import { useEffect, useState } from 'react';
import { wallet } from '@honeypot/shared/lib/wallet/wallet';
import { DM_Sans, Inter } from 'next/font/google';
import { Inspector, InspectParams } from 'react-dev-inspector';
import { ApolloProvider } from '@apollo/client';
import Image from 'next/image';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { deserialize, serialize } from 'wagmi';
import { useSubgraphClient } from '@honeypot/shared';

const config = createWagmiConfig();

// enableStaticRendering(true)
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retryDelay: 1000,
      retry: 12,
      gcTime: 1000 * 60,
      staleTime: 1000 * 5,
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
    wallet.initWallet(walletClient);
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

export default function App({ Component, pageProps }: AppProps) {
  const infoClient = useSubgraphClient('algebra_info');
  const ComponentLayout = Layout;

  const persister = createSyncStoragePersister({
    serialize,
    storage: undefined,
    deserialize,
  });

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <PersistQueryClientProvider
          client={queryClient}
          persistOptions={{ persister }}
        >
          <ApolloProvider client={infoClient}>
            <trpc.Provider client={trpcQueryClient} queryClient={queryClient}>
              <RainbowKitProvider avatar={CustomAvatar}>
                <NextUIProvider>
                  <ToastContainer />
                  <Provider>
                    {' '}
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
                </NextUIProvider>
              </RainbowKitProvider>
            </trpc.Provider>
          </ApolloProvider>
        </PersistQueryClientProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
