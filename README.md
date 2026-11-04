# Immute mainnet backup interface

This independent static fallback is hosted at https://version6-hub.github.io/immute_backup/ and targets Ethereum mainnet only.

Token: `0xDCfDC48c941561d7ec5E819834e6D99A0c838Dd3`. Feeder: `0xAde886EB4673C88976805b0900D7a932E644B117`. ABIs match the frozen November 2026 mainnet release. The BNB legacy site remains separate at https://immute.io/legacy/.

The backup supports token buys, sells, reward withdrawal/reinvestment and transfers. Writes require the wallet to be on chain 1. Buy/sell/reinvestment requests require a positive minimum-output quote with the displayed 0.5% tolerance. Every transaction still requires the wallet holder's own confirmation. Feeder information is read-only here; Safe governance and automatic operation run independently.

Public Ethereum nodes provide emergency reads without depending on Immute or NepTime servers. Private Alchemy URLs are never embedded. Standard snapshots refresh once per minute; public-node availability can vary. Transaction quotes and wallet confirmations remain separate from those snapshots.

The client checks its static release metadata and automatically loads newer releases when idle, preserving the URL and deferring while a wallet request, receipt, modal or focused form is active. Tabs from before this updater existed acquire it on their next page load. No web server can inject it into an already running old tab.

Build with `npm ci --ignore-scripts` and `npm run build`. The existing Pages workflow deploys the built artifact. Keep package-lock.json committed. VITE_WALLETCONNECT_PROJECT_ID is a public client identifier; do not add RPC secrets to VITE variables.

Review https://immute.io/audit and https://immute.io/risk for the current review and limitations. Reserve-funded redemption does not guarantee recovery of the original investment value. No mainnet money transaction is implied by compiling or publishing this interface.
