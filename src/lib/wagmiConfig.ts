import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { mainnet, sepolia } from "wagmi/chains";
import { http } from "wagmi";

const mainnetRpc = import.meta.env.VITE_MAINNET_RPC_URL as string | undefined;
const sepoliaRpc = import.meta.env.VITE_SEPOLIA_RPC_URL as string | undefined;

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
    [mainnet.id]: mainnetRpc ? http(mainnetRpc) : http(),
    [sepolia.id]: sepoliaRpc ? http(sepoliaRpc) : http(),
  },
  ssr: false,
});
