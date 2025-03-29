import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

const createProxiedClient = (endpoint: string) => {
  return new ApolloClient({
    link: createHttpLink({
      uri: `/api/graphql/${endpoint}`,
      credentials: 'same-origin',
    }),
    ssrMode: true,
    cache: new InMemoryCache(),
  });
};

export const infoClient = createProxiedClient('info');
export const blocksClient = createProxiedClient('blocks');
export const farmingClient = createProxiedClient('farming');
export const bgtClient = createProxiedClient('bgt');
