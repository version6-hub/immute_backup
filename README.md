# Immute · Backup Interface

Static fallback for [immute.finance](https://immute.finance). Single page,
zero server, hosted on GitHub Pages. If the main site is down (DDoS, host
outage, DNS), holders can come here and still operate the contract directly
through their wallet.

**Scope (intentionally minimal):**

- Live contract stats (buy/sell price, total supply, TVL) — auto-refreshed
  every block
- Wallet overview (ETH, IMT, claimable rewards) — auto-refreshed every block
- Trading actions: **Buy · Sell · Withdraw · Reinvest · Transfer**
- Referral link with copy + eligibility indicator

That's it. No charts, no leaderboard, no calculator, no marketing pages.
All non-essentials live on the main site.

---

## Architecture

- **Vite + React + TypeScript + Tailwind** — small bundle, fast load.
- **wagmi v2 + viem + RainbowKit** — same stack as the main site, so the
  trading code paths behave identically.
- **No API routes.** All on-chain reads/writes go directly browser → RPC.
  This is what lets the site run as pure static files on GitHub Pages.
- **Block-watch refresh.** `useContractStats` and `useWalletStats` re-read
  on every new block; reads also poll every 6s as a safety net.

---

## Develop locally

```sh
npm install
cp .env.example .env  # add your WalletConnect projectId + RPC URLs
npm run dev           # http://localhost:5173
```

## Build a production bundle

```sh
npm run build         # writes ./dist
npm run preview       # serves ./dist on http://localhost:4173
```

The `BASE_PATH` env var controls the public path in the build:

```sh
BASE_PATH=/immute_backup/ npm run build   # GitHub Pages project site
BASE_PATH=/ npm run build                 # custom domain (CNAME)
```

---

## Deploy to GitHub Pages

The repo ships with `.github/workflows/deploy.yml` which auto-builds and
deploys on every push to `main`.

**One-time setup:**

1. In the repo: **Settings → Pages → Source: GitHub Actions**.
2. Add the following repo secrets at **Settings → Secrets and variables →
   Actions** (all optional, but the WalletConnect one is recommended so
   wallet connections work for all users):
   - `VITE_WALLETCONNECT_PROJECT_ID` — public projectId from
     https://cloud.walletconnect.com/
   - `VITE_MAINNET_RPC_URL` — Alchemy/Infura URL (optional)
   - `VITE_SEPOLIA_RPC_URL` — Alchemy/Infura URL (optional)
3. Push to `main`. The workflow builds and the site goes live at
   `https://version6-hub.github.io/immute_backup/`.

**With a custom domain (e.g. `backup.immute.io`):**

1. Add a `CNAME` file in `public/` containing the domain.
2. Edit the workflow's `BASE_PATH: /immute_backup/` → `BASE_PATH: /`.
3. Configure your DNS CNAME and confirm in GitHub Pages settings.

---

## Updating after a contract redeploy

The contract address and ABI are baked into `src/lib/contract.ts` so the
bundle stays self-contained (no runtime config server needed). After a new
contract deploy:

1. Update `CONTRACT_ADDRESSES[<chainId>]` in `src/lib/contract.ts`.
2. If the ABI changed, sync `IMMUTE_ABI` from the main site
   (`immute-web/lib/contract.ts`).
3. Push to `main`. The workflow rebuilds and redeploys automatically.

---

## What's deliberately *not* here

| Feature | Reason it's omitted |
|---|---|
| Historical events / leaderboard | Needs Etherscan API key (server-side proxy) |
| Charts | Same — depends on event scanning |
| Calculator | Non-critical for emergency operation |
| ETH→USD conversion | Depends on third-party price API |
| Whitepaper / Audit / Buy-Crypto pages | Static content lives on the main site; this is a fallback for *trading* only |

If immute.finance is up, use that. This page is the lifeboat.
