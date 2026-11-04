import { useEffect } from "react";
import {
  useAccount,
  useReadContract,
  useBalance,
  useBlockNumber,
  useReadContracts,
} from "wagmi";
import { IMMUTE_ABI, getContractAddress } from "../lib/contract";

export function useWalletStats() {
  const { address: walletAddress, isConnected } = useAccount();
  const chainId = 1 as const;
  const contractAddress = getContractAddress(chainId);

  const enabled = isConnected && !!walletAddress && !!contractAddress;

  const { data, isLoading, refetch } = useReadContracts({
    contracts: [
      {
        chainId: 1,
        address: contractAddress,
        abi: IMMUTE_ABI,
        functionName: "balanceOf",
        args: [walletAddress ?? "0x0000000000000000000000000000000000000000"],
      },
      {
        chainId: 1,
        address: contractAddress,
        abi: IMMUTE_ABI,
        functionName: "dividendsOf",
        args: [walletAddress ?? "0x0000000000000000000000000000000000000000"],
      },
    ],
    query: { enabled, refetchInterval: 60000 },
  });

  const { data: ethBalance, refetch: refetchEth } = useBalance({
    chainId: 1,
    address: walletAddress,
    query: { enabled, refetchInterval: 60000 },
  });

  // Caller-dependent rewards must be read directly with from=the wallet;
  // a Multicall3 read would use the aggregator as msg.sender.
  const {data:claimable}=useReadContract({chainId:1,address:contractAddress,abi:IMMUTE_ABI,
    functionName:"myDividends",args:[true],account:walletAddress,
    query:{enabled,refetchInterval:60000}});

  const { data: blockNumber } = useBlockNumber({ watch: false });
  useEffect(() => {
    if (enabled && blockNumber !== undefined) {
      refetch();
      refetchEth();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blockNumber]);

  return {
    tokenBalance: data?.[0]?.result as bigint | undefined,
    rewards: claimable as bigint | undefined,
    ethBalance: ethBalance?.value,
    isLoading,
    isConnected,
    walletAddress,
  };
}
