import { SectionHeading } from "@/components/SectionHeading";

const phases = [
  {
    id: "01",
    title: "Find the brain",
    items: ["Launch", "Website", "Community", "X presence", "Meme creation"],
  },
  {
    id: "02",
    title: "Lose the brain",
    items: [
      "Community meme machine",
      "Daily NOBRAIN decisions",
      "Interactive experiments",
      "Community events",
    ],
  },
  {
    id: "03",
    title: "???",
    items: [
      "Community-driven ideas",
      "New experiments",
      "New characters",
      "New interactive features",
    ],
  },
];

export function Roadmap() {
  return (
    <section id="roadmap" className="scroll-mt-20 border-t border-paper/10 px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading index="09  /  ROAD" title="Roadmap">
          Later phases depend on development time and what the community actually wants to make.
        </SectionHeading>
        <ol className="border-t border-paper/15">
          {phases.map((phase) => (
            <li key={phase.id} className="grid gap-4 border-b border-paper/15 py-8 sm:grid-cols-[140px_1fr] sm:gap-8 sm:py-10">
              <p className="font-display text-5xl font-bold tracking-[-0.06em] text-paper/30">
                {phase.id}
              </p>
              <div>
                <h3 className="font-display text-3xl font-bold tracking-[-0.04em] uppercase sm:text-4xl">
                  {phase.title}
                </h3>
                <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                  {phase.items.map((item) => (
                    <li key={item} className="font-mono text-sm text-paper/75">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>
        <p className="mt-6 max-w-2xl font-mono text-xs leading-relaxed text-mute">
          This is not a promise of exchange listings, growth, profits, or price targets. Features happen if they get built.
        </p>
      </div>
    </section>
  );
}
