import { useChainId } from "wagmi";
import { useContractStats } from "../hooks/useContractStats";
import { explorerAddressUrl } from "../lib/contract";
import { formatEth, formatTokens } from "../lib/formatters";

export function ContractStats() {
  const chainId = useChainId();
  const { buyPrice, sellPrice, totalSupply, contractBalance, contractAddress } =
    useContractStats();

  const live =
    buyPrice !== undefined &&
    sellPrice !== undefined &&
    totalSupply !== undefined &&
    contractBalance !== undefined;

  return (
    <section className="card p-6">
      <div className="flex items-start justify-between mb-5 gap-3">
        <div>
          <p className="eyebrow mb-1">Contract State</p>
          <h2 className="font-display text-xl text-ink tracking-tighter">
            Live on-chain figures
          </h2>
        </div>
        <span
          className={`pill ${live ? "pill-emerald" : ""}`}
          title="Refreshes every new block + every 6s"
        >
          <span
            className={`inline-block w-1 h-1 rounded-full ${live ? "bg-emerald-accent animate-pulse" : "bg-ink-muted"}`}
          />
          {live ? "Live · every block" : contractAddress ? "Loading…" : "No contract on this chain"}
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-obsidian-line">
        <Stat
          label="Buy Price"
          value={buyPrice !== undefined ? `${formatEth(buyPrice, 10)} ETH` : "—"}
          accent="emerald"
        />
        <Stat
          label="Sell Price"
          value={sellPrice !== undefined ? `${formatEth(sellPrice, 10)} ETH` : "—"}
          accent="terra"
        />
        <Stat
          label="Total Supply"
          value={
            totalSupply !== undefined ? `${formatTokens(totalSupply, 2)} IMT` : "—"
          }
        />
        <Stat
          label="Contract TVL"
          value={
            contractBalance !== undefined
              ? `${formatEth(contractBalance, 5)} ETH`
              : "—"
          }
        />
      </div>

      {contractAddress && (
        <a
          href={explorerAddressUrl(chainId, contractAddress)}
          target="_blank"
          rel="noopener noreferrer"
          className="block mt-4 pt-3 border-t border-obsidian-line text-[10px] font-mono text-ink-dim hover:text-emerald-accent break-all transition-colors"
        >
          {contractAddress} ↗
        </a>
      )}
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
