import { useAccount, useChainId } from "wagmi";

/**
 * Chain-aware notice pinned below the header. Tells the user exactly
 * which Immute deployment they're currently facing:
 *
 *   • Sepolia (11155111): V8 testnet — tokens worthless, practice only
 *   • Mainnet (1):        V4 deprecated (drained 2026-04), mainnet relaunch follows Sepolia validation
 *   • Other chain:        unsupported
 *   • Not connected:      subtle "V8 live on Sepolia" hint
 *
 * Mirrors the main site's NetworkStatusBanner so users on the backup
 * fallback get the same guidance.
 */
export function NetworkNotice() {
  const { isConnected } = useAccount();
  const chainId = useChainId();

  // Not connected
  if (!isConnected) {
    return (
      <div className="border-b border-gilt/30 bg-gilt/10 text-ink-mid text-xs text-center py-2 px-6">
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-gilt animate-pulse mr-2 align-middle" />
        <span className="font-mono tracking-wider text-gilt">V8 TESTNET LIVE ON SEPOLIA</span>
        {" · "}community testing phase · mainnet launch after validation
      </div>
    );
  }

  // Sepolia — current testing deployment
  if (chainId === 11155111) {
    return (
      <div className="border-b border-gilt/40 bg-gilt/15 text-ink text-sm text-center py-2.5 px-6">
        <span className="font-mono text-[11px] tracking-wider px-2 py-0.5 rounded bg-gilt text-obsidian font-semibold mr-2">
          SEPOLIA TESTNET
        </span>
        V8 live for community testing · <strong>IMT has no real value here</strong>
      </div>
    );
  }

  // Mainnet — V4 deprecated
  if (chainId === 1) {
    return (
      <div className="border-b border-terra/40 bg-terra/15 text-ink text-sm text-center py-2.5 px-6">
        <span className="font-mono text-[11px] tracking-wider px-2 py-0.5 rounded bg-terra text-obsidian font-semibold mr-2">
          MAINNET V4 · DEPRECATED
        </span>
        V4 was drained in April 2026 · <strong className="text-terra">do not trade</strong> · mainnet relaunch follows Sepolia V8 validation
      </div>
    );
  }

  // Other chain
  return (
    <div className="border-b border-gilt/30 bg-gilt/10 text-ink text-sm text-center py-2.5 px-6">
      Immute isn&apos;t deployed on chain {chainId}. Switch to <strong className="text-gilt">Sepolia</strong> to test V8.
    </div>
  );
}
