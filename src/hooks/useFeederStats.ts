import { useEffect } from "react";
import {
  useReadContracts,
  useChainId,
  useBlockNumber,
  useAccount,
} from "wagmi";
import { FEEDER_ABI, getFeederAddress } from "../lib/feeder";

// Read-only window into the live ImmuteFeederV9 deployment. The static
// backup only surfaces the figures you cannot read from the IMT contract
// alone — buyBps, the two thresholds, the accumulator, and V9's
// unclaimedTreasury. Trading actions remain off-scope here.
export function useFeederStats() {
  const chainId = useChainId();
  const { isConnected } = useAccount();
  const address = getFeederAddress(chainId);

  const { data, isLoading, refetch } = useReadContracts({
    contracts: [
      { address, abi: FEEDER_ABI, functionName: "beneficiary" },
      { address, abi: FEEDER_ABI, functionName: "buyBps" },
      { address, abi: FEEDER_ABI, functionName: "buyThreshold" },
      { address, abi: FEEDER_ABI, functionName: "reinvestThreshold" },
      { address, abi: FEEDER_ABI, functionName: "accumulatedForBuy" },
      { address, abi: FEEDER_ABI, functionName: "tokenBalance" },
      { address, abi: FEEDER_ABI, functionName: "pendingDividends" },
      { address, abi: FEEDER_ABI, functionName: "unclaimedTreasury" },
    ],
    query: { enabled: !!address, refetchInterval: 12000 },
  });

  const { data: blockNumber } = useBlockNumber({
    watch: !!address && isConnected,
  });
  useEffect(() => {
    if (blockNumber !== undefined) refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blockNumber]);

  return {
    beneficiary: data?.[0]?.result as `0x${string}` | undefined,
    buyBps: data?.[1]?.result as number | undefined,
    buyThreshold: data?.[2]?.result as bigint | undefined,
    reinvestThreshold: data?.[3]?.result as bigint | undefined,
    accumulatedForBuy: data?.[4]?.result as bigint | undefined,
    tokenBalance: data?.[5]?.result as bigint | undefined,
    pendingDividends: data?.[6]?.result as bigint | undefined,
    unclaimedTreasury: data?.[7]?.result as bigint | undefined,
    isLoading,
    feederAddress: address,
  };
}
