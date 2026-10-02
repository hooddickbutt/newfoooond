import { AskNobrain } from "@/components/AskNobrain";
import { BrainStatus } from "@/components/BrainStatus";
import { Community } from "@/components/Community";
import { DailyDecision } from "@/components/DailyDecision";
import { Hero } from "@/components/Hero";
import { Lore } from "@/components/Lore";
import { MemeGenerator } from "@/components/MemeGenerator";
import { Roadmap } from "@/components/Roadmap";
import { Terminal } from "@/components/Terminal";
import { TokenSection } from "@/components/TokenSection";
import { TransactionFeed } from "@/components/TransactionFeed";

export default function Page() {
  return (
    <main id="content">
      <Hero />
      <AskNobrain />
      <DailyDecision />
      <MemeGenerator />
      <BrainStatus />
      <TokenSection />
      <TransactionFeed />
      <Terminal />
      <Lore />
      <Roadmap />
      <Community />
    </main>
  );
}
