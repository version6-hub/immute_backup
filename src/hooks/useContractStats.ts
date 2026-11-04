import {useBalance,useReadContracts} from "wagmi";
import {IMMUTE_ABI,getContractAddress} from "../lib/contract";
export function useContractStats(){
 const address=getContractAddress(1);
 const {data,isLoading}=useReadContracts({contracts:[
  {chainId:1,address,abi:IMMUTE_ABI,functionName:"buyPrice"},
  {chainId:1,address,abi:IMMUTE_ABI,functionName:"sellPrice"},
  {chainId:1,address,abi:IMMUTE_ABI,functionName:"totalSupply"}],query:{enabled:!!address,refetchInterval:60000,retry:0}});
 const {data:balance}=useBalance({chainId:1,address,query:{enabled:!!address,refetchInterval:60000,retry:0}});
 return {buyPrice:data?.[0]?.result as bigint|undefined,sellPrice:data?.[1]?.result as bigint|undefined,totalSupply:data?.[2]?.result as bigint|undefined,contractBalance:balance?.value,isLoading,contractAddress:address};
}
