import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { mainnet, sepolia } from "wagmi/chains";
import { fallback, http } from "wagmi";

const mainnetRpc = import.meta.env.VITE_MAINNET_RPC_URL as string | undefined;
const sepoliaRpc = import.meta.env.VITE_SEPOLIA_RPC_URL as string | undefined;

// Public-RPC endpoints. The backup site is static and has no server-side
// proxy, so reads go directly browser → RPC. Default viem endpoints often
// CORS-block or rate-limit from a static origin; these CORS-friendly public
// endpoints keep stats loading even when no VITE_*_RPC_URL secret is set.
//
// Mainnet leads with the user-supplied RPC (low traffic, want fastest reads).
// Sepolia inverts the order: public nodes are primary so the Alchemy
// free-tier budget is reserved as a fallback for when public Sepolia RPCs
// (which are flakier than mainnet's) hiccup.
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
        ...SEPOLIA_PUBLIC_RPCS.map((u) => http(u)),
        ...(sepoliaRpc ? [http(sepoliaRpc)] : []),
      ],
      { rank: false }
    ),
  },
  ssr: false,
});
