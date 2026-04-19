import { useChainId } from "wagmi";
import { useWalletStats } from "../hooks/useWalletStats";
import { explorerAddressUrl } from "../lib/contract";
import { formatEth, formatTokens, truncateAddress } from "../lib/formatters";

export function WalletOverview() {
  const chainId = useChainId();
  const { tokenBalance, rewards, ethBalance, isConnected, walletAddress } =
    useWalletStats();

  if (!isConnected || !walletAddress) {
    return (
      <section className="card p-6">
        <p className="eyebrow mb-1">Wallet</p>
        <h2 className="font-display text-xl text-ink tracking-tighter mb-3">
          Connect to begin
        </h2>
        <p className="text-sm text-ink-muted">
          Use the Connect button at the top right to load your IMT balance,
          rewards, and ETH wallet balance.
        </p>
      </section>
    );
  }

  return (
    <section className="card p-6">
      <div className="flex items-start justify-between mb-5 gap-3">
        <div>
          <p className="eyebrow mb-1">Your Wallet</p>
          <h2 className="font-display text-xl text-ink tracking-tighter">
            {truncateAddress(walletAddress)}
          </h2>
        </div>
        <a
          href={explorerAddressUrl(chainId, walletAddress)}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-ghost"
        >
          View on Etherscan ↗
        </a>
      </div>
      <div className="grid grid-cols-3 gap-px bg-obsidian-line">
        <Stat
          label="ETH Balance"
          value={ethBalance !== undefined ? `${formatEth(ethBalance, 5)} ETH` : "—"}
        />
        <Stat
          label="IMT Balance"
          value={
            tokenBalance !== undefined ? `${formatTokens(tokenBalance, 4)} IMT` : "—"
          }
        />
        <Stat
          label="Claimable Rewards"
          value={rewards !== undefined ? `${formatEth(rewards, 6)} ETH` : "—"}
          accent="emerald"
        />
      </div>
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
  accent?: "emerald";
}) {
  const color = accent === "emerald" ? "text-emerald-accent" : "text-ink";
  return (
    <div className="bg-obsidian-surface p-4">
      <p className="stat-label mb-2">{label}</p>
      <p className={`font-mono tabular text-base ${color} tracking-tight`}>
        {value}
      </p>
    </div>
  );
}
