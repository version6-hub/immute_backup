// ImmuteFeederV9 wiring for the backup site. Mirror of
// immute-web/lib/feeder.ts trimmed to the read-only views the static
// fallback actually displays. Keep these in sync after each Feeder
// redeploy — they're the single source of truth for the backup site.
//
// V9 (shipped 2026-04-23, ABI-additive over V5) adds:
//   • slippage on auto-flush buys via calculateTokensReceived × 99%
//   • bricked-beneficiary resilience via unclaimedTreasury +
//     permissionless withdrawRejectedTreasury()
//   • sweepDonations() — recycles stranded selfdestruct donations
//   • poke()/_maybeReinvest read myDividends(true) so Feeder's own
//     referralBalance_ contributes to reinvest triggers
//
// Source of truth: immute-contract/contracts/ImmuteFeederV9.sol.

export const FEEDER_ABI = [
  // ── VIEWS ───────────────────────────────────────────────────────────
  { name: "immute",            type: "function", stateMutability: "view", inputs: [], outputs: [{ name: "", type: "address" }] },
  { name: "beneficiary",       type: "function", stateMutability: "view", inputs: [], outputs: [{ name: "", type: "address" }] },
  { name: "admin",             type: "function", stateMutability: "view", inputs: [], outputs: [{ name: "", type: "address" }] },
  { name: "buyBps",            type: "function", stateMutability: "view", inputs: [], outputs: [{ name: "", type: "uint16"  }] },
  { name: "reinvestThreshold", type: "function", stateMutability: "view", inputs: [], outputs: [{ name: "", type: "uint256" }] },
  { name: "buyThreshold",      type: "function", stateMutability: "view", inputs: [], outputs: [{ name: "", type: "uint256" }] },
  { name: "accumulatedForBuy", type: "function", stateMutability: "view", inputs: [], outputs: [{ name: "", type: "uint256" }] },
  { name: "tokenBalance",      type: "function", stateMutability: "view", inputs: [], outputs: [{ name: "", type: "uint256" }] },
  { name: "pendingDividends",  type: "function", stateMutability: "view", inputs: [], outputs: [{ name: "", type: "uint256" }] },
  // V9 additions
  { name: "unclaimedTreasury", type: "function", stateMutability: "view", inputs: [], outputs: [{ name: "", type: "uint256" }] },
] as const;

// Per-chain Feeder addresses. A zero / unlisted address means "no feeder on
// this chain" — the UI hides the Feeder panel in that case.
export const FEEDER_ADDRESSES: Record<number, `0x${string}`> = {
  11155111: "0xa87e7c25c2f754C7D6bFc9b4472E0c36096E4bF6", // Sepolia FeederV9 — points at ImmuteV8, deployed 2026-04-23
};

export function getFeederAddress(chainId: number): `0x${string}` | undefined {
  const addr = FEEDER_ADDRESSES[chainId];
  if (!addr || addr === "0x0000000000000000000000000000000000000000") return undefined;
  return addr;
}
