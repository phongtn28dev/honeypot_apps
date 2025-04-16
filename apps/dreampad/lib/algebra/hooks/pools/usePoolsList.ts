import { ALGEBRA_FACTORY } from "@/config/algebra/addresses";
import { algebraFactoryABI } from "@/lib/abis/algebra-contracts/ABIs";
import { useEffect, useState } from "react";
import { Address, decodeEventLog, parseAbiItem } from "viem";
import { usePublicClient } from "wagmi";

interface IPools {
  readonly token0: Address;
  readonly token1: Address;
  readonly pool: Address;
}

// const ALGEBRA_FACTORY_CREATION_BLOCK = 18455522n
const ALGEBRA_FACTORY_CREATION_BLOCK = BigInt(32610688);

export function usePoolsList() {
  const publicClient = usePublicClient();

  const [pools, updatePools] = useState<IPools[]>();

  useEffect(() => {
    publicClient
      ?.getLogs({
        address: ALGEBRA_FACTORY,
        event: parseAbiItem("event Pool(address, address, address)"),
        fromBlock: ALGEBRA_FACTORY_CREATION_BLOCK,
        toBlock: "latest",
      })
      .then((logs) =>
        logs.map(
          ({ data, topics }) =>
            decodeEventLog({
              abi: algebraFactoryABI,
              eventName: "Pool",
              data,
              topics,
            }).args
        )
      )
      .then((v) => {
        updatePools(v);
      })
      .catch(console.error);
  }, []);

  return { pools };
}
