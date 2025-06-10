const MULTICALL_ADDRESS = '0xcA11bde05977b3631167028862bE2a173976CA11';
import {
  Multicall,
  ContractCallContext,
  ContractCallResults,
} from 'ethereum-multicall';
import { type Config, getClient } from '@wagmi/core';
import { ethers, Provider } from 'ethers';
import { type Client, type Chain, type Transport, erc20Abi, createPublicClient, http } from 'viem';
import { config } from '@/config/wagmi';
import { useQuery } from '@tanstack/react-query';
import { berachain } from 'viem/chains';
import { } from 'ethcall';
import { symbol } from 'zod';

const contractCallContext = [
  {
    reference: '0x36d31f9aec845f2c1789aed3364418c92e17b768',
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



type Payload = {
  tokens: string[];
};

const useGetSupportTokenInfo = ({ tokens }: Payload) => {

  const data = useQuery({
    queryKey: ['get-support-token-info', ...tokens],
    queryFn: async () => {


      const multicall = new Multicall({
        nodeUrl: 'https://rpc.berachain.com',
        multicallCustomContractAddress: MULTICALL_ADDRESS,
      });

      const result: ContractCallResults = await multicall.call(
        contractCallContext as unknown as ContractCallContext,

      );
      return result;
    },
  });
  console.log('🔍 Token Info Data:', data);
  return data;
};

export default useGetSupportTokenInfo;


// {
//   0x36d31f9aec845f2c1789aed3364418c92e17b768 : {
//     decimals: 18,
//       name: 'Bera',
//         symbol: 'BERA',
//           address: 0x36d31f9aec845f2c1789aed3364418c92e17b768
//   }
// }