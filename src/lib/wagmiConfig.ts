import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { mainnet } from "wagmi/chains";
import { fallback, http } from "wagmi";
// Independent emergency reads use public nodes. Private Alchemy URLs never enter this bundle.
export const wagmiConfig = getDefaultConfig({
  appName:"Immute Mainnet Backup", projectId:import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || "placeholder",
  chains:[mainnet],
  transports:{[mainnet.id]:fallback([
    http("https://eth.drpc.org",{batch:{batchSize:20},timeout:20000,retryCount:0}),
    http("https://ethereum.publicnode.com",{batch:{batchSize:20},timeout:20000,retryCount:0}),
  ],{rank:false,retryCount:0})},ssr:false,
});
