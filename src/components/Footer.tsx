import { useChainId } from "wagmi";
import { explorerAddressUrl, getContractAddress } from "../lib/contract";

export function Footer() {
  const chainId = useChainId();
  const address = getContractAddress(chainId);
  return (
    <footer className="mt-16 border-t border-obsidian-line">
      <div className="max-w-5xl mx-auto px-6 py-8 grid md:grid-cols-3 gap-6 text-xs text-ink-muted">
        <div>
          <p className="stat-label mb-2">About this page</p>
          <p className="leading-relaxed">
            Static fallback for{" "}
            <a
              href="https://immute.finance"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-accent hover:underline"
            >
              immute.finance
            </a>
            . Hosted on GitHub Pages — no server, no API. All reads and
            writes go directly between your wallet and the on-chain contract.
          </p>
        </div>
        <div>
          <p className="stat-label mb-2">Verified contract</p>
          {address ? (
            <a
              href={explorerAddressUrl(chainId, address)}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[11px] hover:text-emerald-accent break-all transition-colors"
            >
              {address} ↗
            </a>
          ) : (
            <p>No deployment on chain {chainId}.</p>
          )}
        </div>
        <div>
          <p className="stat-label mb-2">Resources</p>
          <ul className="space-y-1">
            <li>
              <a
                href="https://immute.finance/whitepaper"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-emerald-accent transition-colors"
              >
                Whitepaper ↗
              </a>
            </li>
            <li>
              <a
                href="https://immute.finance/audit"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-emerald-accent transition-colors"
              >
                Security audit ↗
              </a>
            </li>
            <li>
              <a
                href="https://immute.finance/metamask-guide"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-emerald-accent transition-colors"
              >
                MetaMask setup ↗
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-obsidian-line">
        <div className="max-w-5xl mx-auto px-6 py-4 text-[10px] font-mono text-ink-dim flex flex-wrap justify-between gap-3">
          <span>© {new Date().getFullYear()} Version 6 LLC</span>
          <span>Backup interface · Static · No server</span>
        </div>
      </div>
    </footer>
  );
}
