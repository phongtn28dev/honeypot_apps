import { Address } from 'viem';
import {
  useLbpPairQuery,
  LbpPairQuery,
  LbpPairQueryVariables,
  LbpPairDocument,
  LbpPool,
  useLbpPairsQuery,
} from '../generated/graphql';
import { LbpLaunch, lbpMetadatas, wallet } from '@honeypot/shared';
import { useEffect, useState } from 'react';
import BigNumber from 'bignumber.js';
import { useLbpClient } from '@honeypot/shared';
import { ApolloClient } from '@apollo/client';

export const useLbpLaunchList = () => {
  const [lbpLaunchList, setLbpLaunchList] = useState<LbpLaunch[]>([]);
  const lbpClient = useLbpClient();
  const { data, loading, error } = useLbpPairsQuery({
    client: lbpClient as unknown as ApolloClient<any>,
  });

  console.log(data);

  useEffect(() => {
    if (!data?.lbppools) return;

    const lbpLaunchEntities = data.lbppools.map((lbp) =>
      subgraphLbpToLbpEntity(lbp as LbpPool)
    );

    Promise.all(
      lbpLaunchEntities.map((entity) =>
        Promise.all([entity.loadMetadata(), entity.loadOnchainData()])
      )
    ).then(() => {
      setLbpLaunchList(lbpLaunchEntities);
    });
  }, [data]);

  return {
    data: lbpLaunchList,
    loading,
    error,
  };
};

export const useLbpLaunch = (lbpAddress: Address) => {
  const [lbpLaunch, setLbpLaunch] = useState<LbpLaunch | undefined>(undefined);
  const lbpClient = useLbpClient();
  const { data, loading, error } = useLbpPairQuery({
    client: lbpClient as unknown as ApolloClient<any>,
    variables: {
      id: lbpAddress,
    },
  });

  useEffect(() => {
    if (lbpLaunch?.address || !data?.lbppool) return;

    const lbpLaunchEntity = subgraphLbpToLbpEntity(data?.lbppool as LbpPool);

    Promise.all([
      lbpLaunchEntity.loadMetadata(),
      lbpLaunchEntity.loadOnchainData(),
    ]).then(() => {
      setLbpLaunch(lbpLaunchEntity);
    });
  }, [data]);

  return {
    data: lbpLaunch,
    loading,
    error,
  };
};

export const subgraphLbpToLbpEntity = (lbp: LbpPool): LbpLaunch => {
  const lbpLaunch = new LbpLaunch({
    address: lbp.id as Address,
    buys: lbp.buys.map((buy) => ({
      ...buy,
      assets: new BigNumber(buy.assets) as any,
      shares: new BigNumber(buy.shares) as any,
    })),
    sells: lbp.sells.map((sell) => ({
      ...sell,
      assets: new BigNumber(sell.assets) as any,
      shares: new BigNumber(sell.shares) as any,
    })),
    closed: lbp.closed,
  });

  return lbpLaunch;
};
