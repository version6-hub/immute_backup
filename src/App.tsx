import { BookmarkBanner } from "./components/BookmarkBanner";
import { Header } from "./components/Header";
import { NetworkNotice } from "./components/NetworkNotice";
import { ContractStats } from "./components/ContractStats";
import { FeederStats } from "./components/FeederStats";
import { WalletOverview } from "./components/WalletOverview";
import { TradingActions } from "./components/TradingActions";
import { ReferralPanel } from "./components/ReferralPanel";
import { Footer } from "./components/Footer";

export function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <BookmarkBanner />
      <Header />
      <NetworkNotice />
      <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-8 space-y-6">
        <ContractStats />
        <FeederStats />
        <WalletOverview />
        <TradingActions />
        <ReferralPanel />
      </main>
      <Footer />
    </div>
  );
}
