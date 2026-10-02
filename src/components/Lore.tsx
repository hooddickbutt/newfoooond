"use client";

import { motion } from "framer-motion";
import { BrainCharacter } from "@/components/character/BrainCharacter";
import { loreLines } from "@/data/lore";

export function Lore() {
  return (
    <section id="lore" className="scroll-mt-20 border-t border-paper/10 px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-4xl">
        <p className="font-mono text-[0.68rem] tracking-[0.28em] text-mute">08  /  ORIGIN</p>
        <h2 className="mt-3 font-display text-[clamp(2.4rem,6vw,4.6rem)] leading-[0.88] font-bold tracking-[-0.04em] uppercase">
          How NOBRAIN was created
        </h2>
        <div className="mt-16 space-y-16 sm:mt-24 sm:space-y-24">
          {loreLines.map((line, index) => {
            const lastBeat = index >= loreLines.length - 2;
            return (
              <motion.p
                key={line}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.7 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className={`max-w-3xl font-display leading-[1.05] tracking-[-0.04em] ${
                  lastBeat
                    ? "text-[clamp(2.2rem,6vw,4.5rem)] text-paper"
                    : "text-[clamp(1.6rem,4vw,2.8rem)] text-paper/85"
                } ${line === "A brain." ? "glitch-text" : ""}`}
              >
                {line}
              </motion.p>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8 }}
          className="mt-20 flex flex-col items-start gap-6 sm:mt-28"
        >
          <BrainCharacter expression="surprised" className="origin-left scale-75 sm:scale-90" />
          <p className="font-display text-[clamp(3rem,10vw,7rem)] leading-[0.84] font-black tracking-[-0.06em] uppercase">
            NOBRAIN
            <span className="block text-[0.42em] tracking-[0.08em] text-paper/70">was born.</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
