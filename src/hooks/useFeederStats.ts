import {
  useReadContracts,
} from "wagmi";
import { FEEDER_ABI, getFeederAddress } from "../lib/feeder";

// Read-only window into the live ImmuteFeederV9 deployment. The static
// backup only surfaces the figures you cannot read from the IMT contract
// alone — buyBps, the two thresholds, the accumulator, and V9's
// unclaimedTreasury. Trading actions remain off-scope here.
export function useFeederStats() {
  const chainId = 1 as const;
  const address = getFeederAddress(chainId);

  const { data, isLoading } = useReadContracts({
    contracts: [
      { chainId: 1, address, abi: FEEDER_ABI, functionName: "beneficiary" },
      { chainId: 1, address, abi: FEEDER_ABI, functionName: "buyBps" },
      { chainId: 1, address, abi: FEEDER_ABI, functionName: "buyThreshold" },
      { chainId: 1, address, abi: FEEDER_ABI, functionName: "reinvestThreshold" },
      { chainId: 1, address, abi: FEEDER_ABI, functionName: "accumulatedForBuy" },
      { chainId: 1, address, abi: FEEDER_ABI, functionName: "tokenBalance" },
      { chainId: 1, address, abi: FEEDER_ABI, functionName: "pendingDividends" },
      { chainId: 1, address, abi: FEEDER_ABI, functionName: "unclaimedTreasury" },
    ],
    query: { enabled: !!address, refetchInterval: 60000, retry: 0 },
  });

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
