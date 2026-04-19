// Mirror of immute-web/lib/contract.ts. Keep these in sync after each
// contract redeploy — they're the single source of truth for the backup
// site. The bundle is static, so updating here means rebuilding + pushing.

export const IMMUTE_ABI = [
  { name: "buyPrice", type: "function", stateMutability: "view", inputs: [], outputs: [{ name: "", type: "uint256" }] },
  { name: "sellPrice", type: "function", stateMutability: "view", inputs: [], outputs: [{ name: "", type: "uint256" }] },
  { name: "totalSupply", type: "function", stateMutability: "view", inputs: [], outputs: [{ name: "", type: "uint256" }] },
  { name: "totalEthBalance", type: "function", stateMutability: "view", inputs: [], outputs: [{ name: "", type: "uint256" }] },
  { name: "balanceOf", type: "function", stateMutability: "view", inputs: [{ name: "account", type: "address" }], outputs: [{ name: "", type: "uint256" }] },
  { name: "myDividends", type: "function", stateMutability: "view", inputs: [{ name: "includeReferralBonus", type: "bool" }], outputs: [{ name: "", type: "uint256" }] },
  { name: "dividendsOf", type: "function", stateMutability: "view", inputs: [{ name: "_customer", type: "address" }], outputs: [{ name: "", type: "uint256" }] },
  { name: "calculateTokensReceived", type: "function", stateMutability: "view", inputs: [{ name: "_ethToSpend", type: "uint256" }], outputs: [{ name: "", type: "uint256" }] },
  { name: "calculateEthReceived", type: "function", stateMutability: "view", inputs: [{ name: "_tokensToSell", type: "uint256" }], outputs: [{ name: "", type: "uint256" }] },
  { name: "stakingRequirement", type: "function", stateMutability: "view", inputs: [], outputs: [{ name: "", type: "uint256" }] },
  { name: "buy", type: "function", stateMutability: "payable", inputs: [{ name: "referredBy", type: "address" }, { name: "minTokensOut", type: "uint256" }], outputs: [{ name: "", type: "uint256" }] },
  { name: "sell", type: "function", stateMutability: "nonpayable", inputs: [{ name: "_amountOfTokens", type: "uint256" }, { name: "_minEthOut", type: "uint256" }], outputs: [] },
  { name: "withdraw", type: "function", stateMutability: "nonpayable", inputs: [], outputs: [] },
  { name: "reinvest", type: "function", stateMutability: "nonpayable", inputs: [{ name: "_minTokensOut", type: "uint256" }], outputs: [] },
  { name: "exit", type: "function", stateMutability: "nonpayable", inputs: [], outputs: [] },
  { name: "transfer", type: "function", stateMutability: "nonpayable", inputs: [{ name: "to", type: "address" }, { name: "amount", type: "uint256" }], outputs: [{ name: "", type: "bool" }] },
  { name: "name", type: "function", stateMutability: "view", inputs: [], outputs: [{ name: "", type: "string" }] },
  { name: "symbol", type: "function", stateMutability: "view", inputs: [], outputs: [{ name: "", type: "string" }] },
  { name: "decimals", type: "function", stateMutability: "view", inputs: [], outputs: [{ name: "", type: "uint8" }] },
] as const;

export const CONTRACT_ADDRESSES: Record<number, `0x${string}`> = {
  1: "0xAcf3E835bB45B51e4290E58A4cA6669aE51Ff2f2",       // Mainnet v4.0 — deployed 2026-04-19
  11155111: "0x699Fb4D9E3804cAeDde0a76fb9cd3c53B26266C7", // Sepolia v4.0
};

export function getContractAddress(chainId: number): `0x${string}` | undefined {
  const addr = CONTRACT_ADDRESSES[chainId];
  if (!addr || addr === "0x0000000000000000000000000000000000000000") return undefined;
  return addr;
}

export function explorerAddressUrl(chainId: number, address: string): string {
  if (chainId === 1) return `https://etherscan.io/address/${address}`;
  if (chainId === 11155111) return `https://sepolia.etherscan.io/address/${address}`;
  return `https://etherscan.io/address/${address}`;
}

export function explorerTxUrl(chainId: number, hash: string): string {
  if (chainId === 1) return `https://etherscan.io/tx/${hash}`;
  if (chainId === 11155111) return `https://sepolia.etherscan.io/tx/${hash}`;
  return `https://etherscan.io/tx/${hash}`;
}
