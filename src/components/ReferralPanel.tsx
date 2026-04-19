import { useState } from "react";
import { useWalletStats } from "../hooks/useWalletStats";
import { truncateAddress } from "../lib/formatters";

export function ReferralPanel() {
  const { walletAddress, tokenBalance, isConnected } = useWalletStats();
  const [copied, setCopied] = useState(false);

  if (!isConnected || !walletAddress) {
    return (
      <section className="card p-6">
        <p className="eyebrow mb-1">Referral</p>
        <h2 className="font-display text-xl text-ink tracking-tighter mb-3">
          Connect to get your referral link
        </h2>
        <p className="text-sm text-ink-muted">
          Once connected, your wallet address becomes your referral handle.
          Share the link to credit you a third of every buy fee from anyone
          who clicks it.
        </p>
      </section>
    );
  }

  // Always link back to the production site for referrals — that's the
  // canonical origin holders should send people to. The backup is just here
  // for the moments when production isn't reachable.
  const referralUrl = `https://immute.finance/?ref=${walletAddress}`;
  const isEligible = tokenBalance !== undefined && tokenBalance > 0n;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(referralUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked — user can still select+copy manually */
    }
  };

  return (
    <section className="card p-6">
      <div className="flex items-start justify-between mb-4 gap-3">
        <div>
          <p className="eyebrow mb-1">Referral</p>
          <h2 className="font-display text-xl text-ink tracking-tighter">
            Earn 3.33% of every buy from your network
          </h2>
        </div>
        <span
          className={`pill ${isEligible ? "pill-emerald" : ""}`}
          title={
            isEligible
              ? "You hold IMT — referrals credit to this address"
              : "Buy any amount of IMT to activate referrals"
          }
        >
          <span
            className={`inline-block w-1 h-1 rounded-full ${isEligible ? "bg-emerald-accent animate-pulse" : "bg-ink-muted"}`}
          />
          {isEligible ? "Active" : "Inactive — hold IMT"}
        </span>
      </div>

      <p className="text-sm text-ink-muted mb-5 leading-relaxed">
        Share this link. When anyone buys IMT through it, one-third of their
        10% buy fee (≈3.33% of their ETH) is credited to{" "}
        <span className="font-mono text-ink">
          {truncateAddress(walletAddress)}
        </span>
        . As of v4.0 the staking minimum is{" "}
        <span className="font-mono text-ink">1 wei</span> — any non-zero IMT
        balance qualifies. Claim alongside rewards via the Withdraw action
        below.
      </p>

      <div className="flex items-center gap-2">
        <input
          readOnly
          value={referralUrl}
          onClick={(e) => (e.target as HTMLInputElement).select()}
          className="input flex-1 font-mono text-xs"
        />
        <button
          onClick={copy}
          className={copied ? "btn-primary" : "btn-outline"}
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
    </section>
  );
}
