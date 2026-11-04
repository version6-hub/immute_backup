export function assertMainnetRequest(walletChainId:number|undefined,functionName:string,args:readonly unknown[]) {
  if (walletChainId!==1) throw new Error("Switch your wallet to Ethereum mainnet first.");
  if (!["buy","sell","reinvest","withdraw","transfer"].includes(functionName)) throw new Error("Unsupported token action.");
  const minimum=functionName==="buy"||functionName==="sell"?args[1]:functionName==="reinvest"?args[0]:undefined;
  if (["buy","sell","reinvest"].includes(functionName) && (typeof minimum!=="bigint" || minimum<=0n)) throw new Error("A current nonzero minimum-output quote is required. Wait for a quote before signing.");
}
