import { useAccount, useSwitchChain } from "wagmi";
export function NetworkNotice() {
  const {isConnected,chainId}=useAccount();const {switchChain,isPending}=useSwitchChain();
  const correct=!isConnected||chainId===1;
  return <div className="border-b border-gilt/30 bg-gilt/10 text-ink text-sm text-center py-2.5 px-6">
    <strong className="text-gilt mr-2">ETHEREUM MAINNET</strong>
    {correct?"Transactions use real ETH. Review the amount and minimum output before signing.":"Switch your wallet to Ethereum mainnet to use Immute."}
    {!correct&&<button className="btn-primary ml-3" disabled={isPending} onClick={()=>switchChain({chainId:1})}>{isPending?"Switching…":"Switch to Ethereum mainnet"}</button>}
  </div>;
}
