const MULTICALL_ADDRESS = '0xcA11bde05977b3631167028862bE2a173976CA11';
import {
  Multicall,
  ContractCallContext,
  ContractCallResults,
} from 'ethereum-multicall';
import { type Config, getClient } from '@wagmi/core';
import { ethers } from 'ethers';
import { type Client, type Chain, type Transport, erc20Abi } from 'viem';
import { config } from '@/config/wagmi';
import { useQuery } from '@tanstack/react-query';

const contractCallContext = [
  {
    reference: 'erc20Abi',
    contractAddress: '0x36d31f9aec845f2c1789aed3364418c92e17b768',
    abi: erc20Abi,
    calls: [
      {
        reference: 'decimals',
        methodName: 'decimals',
        methodParameters: [],
      },
      {
        reference: 'name',
        methodName: 'name',
        methodParameters: [],
      },
      {
        reference: 'symbol',
        methodName: 'symbol',
        methodParameters: [],
      },
      {
        reference: 'totalSupply',
        methodName: 'totalSupply',
        methodParameters: [],
      },
    ],
  },
];

function clientToProvider(client: Client<Transport, Chain>) {
  const { chain, transport } = client;
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  };
  if (transport.type === 'fallback')
    return new ethers.FallbackProvider(
      (transport.transports as ReturnType<Transport>[]).map(
        ({ value }) => new ethers.JsonRpcProvider(value?.url, network)
      )
    );
  console.log('🔍 Transport URL:', transport.url);
  console.log('🔍 Network:', network);
  return new ethers.JsonRpcProvider(transport.url, network);
}

type Payload = {
  tokens: string[];
};

const useGetSupportTokenInfo = ({ tokens }: Payload) => {
  // @ts-ignore
  const client = getClient(config, { chainId: config.chains[0].id });
  console.log('🔍 Client:', client);
  const data = useQuery({
    queryKey: ['get-support-token-info', ...tokens],
    queryFn: async () => {
      const multicall = new Multicall({
        // @ts-ignore
        ethersProvider: clientToProvider(client!),
        multicallCustomContractAddress: MULTICALL_ADDRESS,
      });

      const result: ContractCallResults = await multicall.call(
        contractCallContext
      );
      return result;
    },
    enabled: Boolean(client),
  });
  console.log('🔍 Token Info Data:', data);
  return data;
};

export default useGetSupportTokenInfo;
