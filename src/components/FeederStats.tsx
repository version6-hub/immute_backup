import { useChainId } from "wagmi";
import { useFeederStats } from "../hooks/useFeederStats";
import { explorerAddressUrl } from "../lib/contract";
import { formatEth, formatTokens, truncateAddress } from "../lib/formatters";

export function FeederStats() {
  const chainId = useChainId();
  const {
    beneficiary,
    buyBps,
    buyThreshold,
    reinvestThreshold,
    accumulatedForBuy,
    tokenBalance,
    pendingDividends,
    unclaimedTreasury,
    feederAddress,
  } = useFeederStats();

  if (!feederAddress) return null;

  const live =
    buyBps !== undefined &&
    buyThreshold !== undefined &&
    reinvestThreshold !== undefined &&
    accumulatedForBuy !== undefined;

  const buyPct = buyBps !== undefined ? (buyBps / 100).toFixed(2) : "—";

  return (
    <section className="card p-6">
      <div className="flex items-start justify-between mb-5 gap-3">
        <div>
          <p className="eyebrow mb-1">Feeder · V9</p>
          <h2 className="font-display text-xl text-ink tracking-tighter">
            ImmuteFeederV9 live state
          </h2>
        </div>
        <span
          className={`pill ${live ? "pill-emerald" : ""}`}
          title="Refreshes every new block + every 12s"
        >
          <span
            className={`inline-block w-1 h-1 rounded-full ${live ? "bg-emerald-accent animate-pulse" : "bg-ink-muted"}`}
          />
          {live ? "Live · every block" : "Loading…"}
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-obsidian-line">
        <Stat label="Buy bps" value={buyBps !== undefined ? `${buyPct}%` : "—"} accent="emerald" />
        <Stat
          label="Buy Threshold"
          value={
            buyThreshold !== undefined ? `${formatEth(buyThreshold, 5)} ETH` : "—"
          }
        />
        <Stat
          label="Reinvest Threshold"
          value={
            reinvestThreshold !== undefined
              ? `${formatEth(reinvestThreshold, 5)} ETH`
              : "—"
          }
        />
        <Stat
          label="Accumulated"
          value={
            accumulatedForBuy !== undefined
              ? `${formatEth(accumulatedForBuy, 5)} ETH`
              : "—"
          }
        />
        <Stat
          label="Feeder IMT"
          value={tokenBalance !== undefined ? `${formatTokens(tokenBalance, 2)} IMT` : "—"}
        />
        <Stat
          label="Pending Divs"
          value={
            pendingDividends !== undefined
              ? `${formatEth(pendingDividends, 6)} ETH`
              : "—"
          }
        />
        <Stat
          label="Unclaimed Treasury"
          value={
            unclaimedTreasury !== undefined
              ? `${formatEth(unclaimedTreasury, 6)} ETH`
              : "—"
          }
          accent={unclaimedTreasury && unclaimedTreasury > 0n ? "terra" : undefined}
        />
        <Stat
          label="Beneficiary"
          value={beneficiary ? truncateAddress(beneficiary) : "—"}
        />
      </div>

      <a
        href={explorerAddressUrl(chainId, feederAddress)}
        target="_blank"
        rel="noopener noreferrer"
        className="block mt-4 pt-3 border-t border-obsidian-line text-[10px] font-mono text-ink-dim hover:text-emerald-accent break-all transition-colors"
      >
        {feederAddress} ↗
      </a>
    </section>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: "emerald" | "terra";
}) {
  const color =
    accent === "emerald"
      ? "text-emerald-accent"
      : accent === "terra"
        ? "text-terra"
        : "text-ink";
  return (
    <div className="bg-obsidian-surface p-4">
      <p className="stat-label mb-2">{label}</p>
      <p className={`font-mono tabular text-base ${color} tracking-tight`}>
        {value}
      </p>
    </div>
  );
}
