import { Address } from 'viem';
import {
  WasabeeIdoDocument,
  WasabeeIdoQuery,
  WasabeeIdoQueryVariables,
  Purchase,
  useWasabeeIdoQuery,
} from '../generated/graphql';
import { WasabeeIDO } from '../../contract/launches/wasabeeIDO';
import { useEffect, useState } from 'react';
import BigNumber from 'bignumber.js';
import { useSubgraphClient } from './../../../hooks/useSubgraphClients';
import { ApolloClient } from '@apollo/client';

export const useWasabeeIDO = (idoAddress: Address) => {
  const { data, loading, error, refetch } = useWasabeeIdoQuery({
    variables: {
      id: idoAddress,
    },
    client: useSubgraphClient('wasabee_ido') as unknown as ApolloClient<any>,
  });

  return { data, loading, error, refetch };
};
