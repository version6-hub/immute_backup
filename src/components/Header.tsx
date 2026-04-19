import { ConnectButton } from "@rainbow-me/rainbowkit";

export function Header() {
  return (
    <header className="border-b border-obsidian-line">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
        <div>
          <p className="font-display text-2xl text-ink tracking-tighter leading-none">
            Immute<span className="text-emerald-accent">.</span>
          </p>
          <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-ink-dim mt-1">
            IMT · Backup interface
          </p>
        </div>
        <ConnectButton
          chainStatus="icon"
          accountStatus={{ smallScreen: "avatar", largeScreen: "full" }}
          showBalance={false}
        />
      </div>
    </header>
  );
}
