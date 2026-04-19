import { useEffect } from "react";
import {
  useReadContracts,
  useChainId,
  useBlockNumber,
  useAccount,
} from "wagmi";
import { IMMUTE_ABI, getContractAddress } from "../lib/contract";

export function useContractStats() {
  const chainId = useChainId();
  const { isConnected } = useAccount();
  const address = getContractAddress(chainId);

  const { data, isLoading, refetch } = useReadContracts({
    contracts: [
      { address, abi: IMMUTE_ABI, functionName: "buyPrice" },
      { address, abi: IMMUTE_ABI, functionName: "sellPrice" },
      { address, abi: IMMUTE_ABI, functionName: "totalSupply" },
      { address, abi: IMMUTE_ABI, functionName: "totalEthBalance" },
    ],
    query: { enabled: !!address, refetchInterval: 6000 },
  });

  // Re-fetch on every new block so stats track the chain in real time.
  // Block-watch is only meaningful once the user is connected; pre-connect
  // we still get the 6-second poll above.
  const { data: blockNumber } = useBlockNumber({ watch: !!address && isConnected });
  useEffect(() => {
    if (blockNumber !== undefined) refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blockNumber]);

  return {
    buyPrice: data?.[0]?.result as bigint | undefined,
    sellPrice: data?.[1]?.result as bigint | undefined,
    totalSupply: data?.[2]?.result as bigint | undefined,
    contractBalance: data?.[3]?.result as bigint | undefined,
    isLoading,
    contractAddress: address,
  };
}
