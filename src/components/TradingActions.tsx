import { useState } from "react";
import { isAddress, parseEther, zeroAddress } from "viem";
import { useReadContract, useChainId } from "wagmi";
import { IMMUTE_ABI, getContractAddress } from "../lib/contract";
import {
  useBuy,
  useReinvest,
  useSell,
  useTransfer,
  useWithdraw,
} from "../hooks/useTransactions";
import { useWalletStats } from "../hooks/useWalletStats";
import { formatEth, formatTokens, parseEthInput } from "../lib/formatters";

type Tab = "buy" | "sell" | "withdraw" | "reinvest" | "transfer";

const TABS: { id: Tab; label: string }[] = [
  { id: "buy", label: "Buy" },
  { id: "sell", label: "Sell" },
  { id: "withdraw", label: "Withdraw" },
  { id: "reinvest", label: "Reinvest" },
  { id: "transfer", label: "Transfer" },
];

/**
 * Single-page trading panel. Five tabs, one per write function the contract
 * exposes for end users. Slippage is fixed at 0.5% — keeping the surface
 * minimal because this is a fallback, not the full-featured UI.
 */
export function TradingActions() {
  const [tab, setTab] = useState<Tab>("buy");
  const { isConnected } = useWalletStats();

  return (
    <section className="card p-6">
      <div className="flex items-end justify-between mb-5 gap-3 flex-wrap">
        <div>
          <p className="eyebrow mb-1">Trade</p>
          <h2 className="font-display text-xl text-ink tracking-tighter">
            Operate the contract
          </h2>
        </div>
        <p className="text-[11px] text-ink-dim font-mono">
          Slippage tolerance · 0.5%
        </p>
      </div>

      <div className="flex gap-1 mb-6 border-b border-obsidian-line overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-3 py-2 text-xs font-mono uppercase tracking-[0.14em] border-b-2 transition-colors whitespace-nowrap ${
              tab === t.id
                ? "border-emerald-accent text-emerald-accent"
                : "border-transparent text-ink-muted hover:text-ink"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {!isConnected ? (
        <p className="text-sm text-ink-muted">
          Connect your wallet to trade. All actions go directly to the
          contract via your wallet — there is no custody.
        </p>
      ) : tab === "buy" ? (
        <BuyForm />
      ) : tab === "sell" ? (
        <SellForm />
      ) : tab === "withdraw" ? (
        <WithdrawForm />
      ) : tab === "reinvest" ? (
        <ReinvestForm />
      ) : (
        <TransferForm />
      )}
    </section>
  );
}

/* ─── Buy ─────────────────────────────────────────────────────────── */

function useReferrerFromUrl(): `0x${string}` {
  if (typeof window === "undefined") return zeroAddress;
  const ref = new URLSearchParams(window.location.search).get("ref");
  return ref && isAddress(ref) ? (ref as `0x${string}`) : zeroAddress;
}

function BuyForm() {
  const chainId = useChainId();
  const address = getContractAddress(chainId);
  const [ethStr, setEthStr] = useState("0.01");
  const referrer = useReferrerFromUrl();
  const { call, isPending, hasContract } = useBuy();

  const ethWei = parseEthInput(ethStr);
  const { data: estimatedTokens } = useReadContract({
    address,
    abi: IMMUTE_ABI,
    functionName: "calculateTokensReceived",
    args: [ethWei],
    query: { enabled: !!address && ethWei > 0n },
  });
  const minTokensOut =
    estimatedTokens !== undefined
      ? (estimatedTokens as bigint) - ((estimatedTokens as bigint) * 50n) / 10000n
      : 0n;

  return (
    <div>
      <Label>ETH amount</Label>
      <input
        type="number"
        min="0"
        step="0.001"
        value={ethStr}
        onChange={(e) => setEthStr(e.target.value)}
        className="input mb-4 text-lg"
        placeholder="0.0"
      />
      {ethWei > 0n && estimatedTokens !== undefined && (
        <Estimate
          rows={[
            ["You receive (est.)", `${formatTokens(estimatedTokens as bigint, 4)} IMT`, "emerald"],
            ["Min received (0.5% slip)", `${formatTokens(minTokensOut, 4)} IMT`],
            ["Buy fee (10%)", `${formatEth(ethWei / 10n, 6)} ETH`],
          ]}
        />
      )}
      {referrer !== zeroAddress && (
        <p className="text-[11px] font-mono text-emerald-accent mb-3">
          Referral active: {referrer.slice(0, 6)}…{referrer.slice(-4)}
        </p>
      )}
      <button
        onClick={() => call(referrer, minTokensOut, ethWei).catch(() => {})}
        disabled={!hasContract || isPending || ethWei === 0n}
        className="btn-primary w-full py-3"
      >
        {isPending ? "Waiting for confirmation…" : `Buy ${ethStr || "0"} ETH`}
      </button>
    </div>
  );
}

/* ─── Sell ────────────────────────────────────────────────────────── */

function SellForm() {
  const chainId = useChainId();
  const address = getContractAddress(chainId);
  const { tokenBalance } = useWalletStats();
  const [tokenStr, setTokenStr] = useState("");
  const { call, isPending, hasContract } = useSell();

  const tokensWei = parseEthInput(tokenStr);
  const { data: estimatedEth } = useReadContract({
    address,
    abi: IMMUTE_ABI,
    functionName: "calculateEthReceived",
    args: [tokensWei],
    query: { enabled: !!address && tokensWei > 0n },
  });
  const minEthOut =
    estimatedEth !== undefined
      ? (estimatedEth as bigint) - ((estimatedEth as bigint) * 50n) / 10000n
      : 0n;

  const setMax = () => {
    if (tokenBalance) setTokenStr((Number(tokenBalance) / 1e18).toFixed(6));
  };

  const overBalance = tokenBalance !== undefined && tokensWei > tokenBalance;

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <Label className="m-0">IMT amount</Label>
        <button onClick={setMax} className="btn-ghost text-[10px]">
          Max ({tokenBalance !== undefined ? formatTokens(tokenBalance, 2) : "0"})
        </button>
      </div>
      <input
        type="number"
        min="0"
        step="0.001"
        value={tokenStr}
        onChange={(e) => setTokenStr(e.target.value)}
        placeholder="0.0"
        className="input mb-4 text-lg"
      />
      {tokensWei > 0n && estimatedEth !== undefined && (
        <Estimate
          rows={[
            ["You receive (est.)", `${formatEth(estimatedEth as bigint, 6)} ETH`, "emerald"],
            ["Min received (0.5% slip)", `${formatEth(minEthOut, 6)} ETH`],
            ["Sell fee (10%)", `${formatEth((estimatedEth as bigint) / 9n, 6)} ETH`],
          ]}
        />
      )}
      {overBalance && (
        <p className="text-[11px] font-mono text-terra mb-3">
          Amount exceeds your balance.
        </p>
      )}
      <button
        onClick={() => call(tokensWei, minEthOut).catch(() => {})}
        disabled={!hasContract || isPending || tokensWei === 0n || overBalance}
        className="btn-primary w-full py-3"
      >
        {isPending ? "Waiting for confirmation…" : "Sell IMT"}
      </button>
    </div>
  );
}

/* ─── Withdraw ───────────────────────────────────────────────────── */

function WithdrawForm() {
  const { rewards } = useWalletStats();
  const { call, isPending, hasContract } = useWithdraw();
  const claimable = rewards ?? 0n;
  return (
    <div>
      <p className="text-sm text-ink-muted mb-4 leading-relaxed">
        Withdraws your full claimable balance — accrued rewards plus any
        referral bonuses — to your wallet. No protocol fee.
      </p>
      <Estimate
        rows={[["Claimable now", `${formatEth(claimable, 6)} ETH`, "emerald"]]}
      />
      <button
        onClick={() => call().catch(() => {})}
        disabled={!hasContract || isPending || claimable === 0n}
        className="btn-primary w-full py-3 mt-1"
      >
        {isPending
          ? "Waiting for confirmation…"
          : `Withdraw ${formatEth(claimable, 5)} ETH`}
      </button>
    </div>
  );
}

/* ─── Reinvest ───────────────────────────────────────────────────── */

function ReinvestForm() {
  const chainId = useChainId();
  const address = getContractAddress(chainId);
  const { rewards } = useWalletStats();
  const { call, isPending, hasContract } = useReinvest();
  const claimable = rewards ?? 0n;

  // Reinvest applies the buy fee (10%), so simulate using the post-fee amount.
  const taxedEth = claimable - claimable / 10n;
  const { data: estimatedTokens } = useReadContract({
    address,
    abi: IMMUTE_ABI,
    functionName: "calculateTokensReceived",
    args: [taxedEth],
    query: { enabled: !!address && taxedEth > 0n },
  });
  const minTokensOut =
    estimatedTokens !== undefined
      ? (estimatedTokens as bigint) - ((estimatedTokens as bigint) * 50n) / 10000n
      : 0n;

  return (
    <div>
      <p className="text-sm text-ink-muted mb-4 leading-relaxed">
        Reinvest your claimable balance into more IMT at the current buy
        price. Same 10% fee as a regular buy — fully distributed to other
        holders.
      </p>
      {claimable > 0n && estimatedTokens !== undefined && (
        <Estimate
          rows={[
            ["Reinvesting", `${formatEth(claimable, 6)} ETH`],
            [
              "You receive (est.)",
              `${formatTokens(estimatedTokens as bigint, 4)} IMT`,
              "emerald",
            ],
            ["Min received (0.5% slip)", `${formatTokens(minTokensOut, 4)} IMT`],
          ]}
        />
      )}
      <button
        onClick={() => call(minTokensOut).catch(() => {})}
        disabled={!hasContract || isPending || claimable === 0n}
        className="btn-primary w-full py-3"
      >
        {isPending ? "Waiting for confirmation…" : "Reinvest rewards"}
      </button>
    </div>
  );
}

/* ─── Transfer ──────────────────────────────────────────────────── */

function TransferForm() {
  const { tokenBalance } = useWalletStats();
  const [recipient, setRecipient] = useState("");
  const [tokenStr, setTokenStr] = useState("");
  const { call, isPending, hasContract } = useTransfer();

  const tokensWei = parseEthInput(tokenStr);
  const recipientValid = isAddress(recipient);
  const overBalance = tokenBalance !== undefined && tokensWei > tokenBalance;

  const handleSend = () => {
    if (!recipientValid) return;
    if (tokensWei === 0n) return;
    if (overBalance) return;
    try {
      const value = parseEther(tokenStr);
      call(recipient as `0x${string}`, value).catch(() => {});
    } catch {
      /* invalid input — disabled state covers this */
    }
  };

  return (
    <div>
      <Label>Recipient address</Label>
      <input
        value={recipient}
        onChange={(e) => setRecipient(e.target.value.trim())}
        placeholder="0x…"
        className="input mb-4"
      />
      <div className="flex items-center justify-between mb-2">
        <Label className="m-0">IMT amount</Label>
        <button
          onClick={() => {
            if (tokenBalance) setTokenStr((Number(tokenBalance) / 1e18).toFixed(6));
          }}
          className="btn-ghost text-[10px]"
        >
          Max ({tokenBalance !== undefined ? formatTokens(tokenBalance, 2) : "0"})
        </button>
      </div>
      <input
        type="number"
        min="0"
        step="0.001"
        value={tokenStr}
        onChange={(e) => setTokenStr(e.target.value)}
        placeholder="0.0"
        className="input mb-4 text-lg"
      />
      {recipient && !recipientValid && (
        <p className="text-[11px] font-mono text-terra mb-3">
          Not a valid Ethereum address.
        </p>
      )}
      {overBalance && (
        <p className="text-[11px] font-mono text-terra mb-3">
          Amount exceeds your balance.
        </p>
      )}
      <p className="text-[11px] text-ink-dim mb-4 leading-relaxed">
        Transfers carry no protocol fee. The contract rebases reward
        accounting on every transfer so both sides preserve their pending
        claims.
      </p>
      <button
        onClick={handleSend}
        disabled={
          !hasContract ||
          isPending ||
          tokensWei === 0n ||
          !recipientValid ||
          overBalance
        }
        className="btn-primary w-full py-3"
      >
        {isPending ? "Waiting for confirmation…" : "Transfer IMT"}
      </button>
    </div>
  );
}

/* ─── shared bits ───────────────────────────────────────────────── */

function Label({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`stat-label block mb-2 ${className ?? ""}`}>
      {children}
    </label>
  );
}

function Estimate({
  rows,
}: {
  rows: Array<[string, string] | [string, string, "emerald"]>;
}) {
  return (
    <div className="card bg-obsidian p-4 mb-4 space-y-1.5">
      {rows.map(([label, value, accent]) => (
        <div
          key={label}
          className="flex justify-between items-baseline border-b border-obsidian-line last:border-0 pb-1.5 last:pb-0"
        >
          <span className="stat-label">{label}</span>
          <span
            className={`font-mono tabular text-xs ${
              accent === "emerald" ? "text-emerald-accent" : "text-ink"
            }`}
          >
            {value}
          </span>
        </div>
      ))}
    </div>
  );
}
