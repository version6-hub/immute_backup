import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { mainnet, sepolia } from "wagmi/chains";
import { fallback, http } from "wagmi";

const mainnetRpc = import.meta.env.VITE_MAINNET_RPC_URL as string | undefined;
const sepoliaRpc = import.meta.env.VITE_SEPOLIA_RPC_URL as string | undefined;

// Public-RPC fallbacks. The backup site is static and has no server-side
// proxy, so reads go directly browser → RPC. Default viem endpoints often
// CORS-block or rate-limit from a static origin; these CORS-friendly public
// endpoints keep stats loading even when no VITE_*_RPC_URL secret is set.
const MAINNET_PUBLIC_RPCS = [
  "https://ethereum-rpc.publicnode.com",
  "https://cloudflare-eth.com",
  "https://rpc.ankr.com/eth",
];
const SEPOLIA_PUBLIC_RPCS = [
  "https://ethereum-sepolia-rpc.publicnode.com",
  "https://rpc.sepolia.org",
];

// Public WalletConnect projectId — wallets need this to negotiate sessions.
// Falls back to a placeholder so the app at least renders without one.
const projectId =
  (import.meta.env.VITE_WALLETCONNECT_PROJECT_ID as string | undefined) ||
  "placeholder";

export const wagmiConfig = getDefaultConfig({
  appName: "Immute · Backup",
  projectId,
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: fallback(
      [
        ...(mainnetRpc ? [http(mainnetRpc)] : []),
        ...MAINNET_PUBLIC_RPCS.map((u) => http(u)),
      ],
      { rank: false }
    ),
    [sepolia.id]: fallback(
      [
        ...(sepoliaRpc ? [http(sepoliaRpc)] : []),
        ...SEPOLIA_PUBLIC_RPCS.map((u) => http(u)),
      ],
      { rank: false }
    ),
  },
  ssr: false,
});
