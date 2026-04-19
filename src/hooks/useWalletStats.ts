import { useEffect } from "react";
import {
  useAccount,
  useBalance,
  useBlockNumber,
  useChainId,
  useReadContracts,
} from "wagmi";
import { IMMUTE_ABI, getContractAddress } from "../lib/contract";

export function useWalletStats() {
  const { address: walletAddress, isConnected } = useAccount();
  const chainId = useChainId();
  const contractAddress = getContractAddress(chainId);

  const enabled = isConnected && !!walletAddress && !!contractAddress;

  const { data, isLoading, refetch } = useReadContracts({
    contracts: [
      {
        address: contractAddress,
        abi: IMMUTE_ABI,
        functionName: "balanceOf",
        args: [walletAddress ?? "0x0000000000000000000000000000000000000000"],
      },
      {
        address: contractAddress,
        abi: IMMUTE_ABI,
        functionName: "dividendsOf",
        args: [walletAddress ?? "0x0000000000000000000000000000000000000000"],
      },
    ],
    query: { enabled, refetchInterval: 6000 },
  });

  const { data: ethBalance, refetch: refetchEth } = useBalance({
    address: walletAddress,
    query: { enabled, refetchInterval: 6000 },
  });

  const { data: blockNumber } = useBlockNumber({ watch: enabled });
  useEffect(() => {
    if (enabled && blockNumber !== undefined) {
      refetch();
      refetchEth();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blockNumber]);

  return {
    tokenBalance: data?.[0]?.result as bigint | undefined,
    rewards: data?.[1]?.result as bigint | undefined,
    ethBalance: ethBalance?.value,
    isLoading,
    isConnected,
    walletAddress,
  };
}
