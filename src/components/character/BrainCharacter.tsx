"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { BrainSvg } from "@/components/character/BrainSvg";
import type { CharacterState, Expression } from "@/components/character/types";
import { reactions } from "@/data/reactions";
import { prefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { playSound, triggerGlitch } from "@/lib/sound";

const pokeExpressions: Expression[] = [
  "confused",
  "annoyed",
  "surprised",
  "error",
  "smug",
  "deadpan",
  "glitch",
  "asleep",
];

export function BrainCharacter({
  interactive = false,
  expression = "idle",
  className = "",
  onReaction,
}: {
  interactive?: boolean;
  expression?: Expression;
  className?: string;
  onReaction?: (line: string) => void;
}) {
  const [live, setLive] = useState<Expression>(expression);
  const [blink, setBlink] = useState(0);
  const [glitch, setGlitch] = useState(false);
  const [pupil, setPupil] = useState({ x: 0, y: 0 });
  const [phase, setPhase] = useState(0.2);
  const rootRef = useRef<HTMLDivElement>(null);
  const holdRef = useRef(0);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    let cancel = false;
    let outer = 0;
    let inner = 0;
    const loop = () => {
      outer = window.setTimeout(() => {
        if (cancel) return;
        setBlink(1);
        inner = window.setTimeout(() => {
          if (cancel) return;
          setBlink(0);
          loop();
        }, 120);
      }, 2600 + Math.random() * 3400);
    };
    loop();
    return () => {
      cancel = true;
      window.clearTimeout(outer);
      window.clearTimeout(inner);
    };
  }, []);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const timer = window.setInterval(() => {
      setPhase((value) => value + 0.18);
    }, 220);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!interactive || prefersReducedMotion()) return;
    let timer = 0;
    const loop = () => {
      timer = window.setTimeout(() => {
        if (Date.now() > holdRef.current) {
          const next = pokeExpressions[Math.floor(Math.random() * 4)];
          setLive(next);
          window.setTimeout(() => {
            if (Date.now() > holdRef.current) setLive("idle");
          }, 900);
        }
        loop();
      }, 9000 + Math.random() * 6000);
    };
    loop();
    return () => window.clearTimeout(timer);
  }, [interactive]);

  useEffect(() => {
    if (!interactive) return;
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (!fine) return;
    const onMove = (event: PointerEvent) => {
      const node = rootRef.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      const x = Math.max(-1, Math.min(1, ((event.clientX - rect.left) / rect.width - 0.5) * 2));
      const y = Math.max(-1, Math.min(1, ((event.clientY - rect.top) / rect.height - 0.5) * 2));
      const qx = Math.round(x * 6) / 6;
      const qy = Math.round(y * 6) / 6;
      setPupil((current) => (current.x === qx && current.y === qy ? current : { x: qx, y: qy }));
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [interactive]);

  const state: CharacterState = {
    expression: interactive ? live : expression,
    pupil,
    blink,
    glitch,
    phase,
  };

  const poke = () => {
    const next =
      pokeExpressions[Math.floor(Math.random() * pokeExpressions.length)];
    const line = reactions[Math.floor(Math.random() * reactions.length)];
    holdRef.current = Date.now() + 4200;
    setLive(next);
    setGlitch(true);
    window.setTimeout(() => setGlitch(false), 260);
    if (!prefersReducedMotion()) triggerGlitch();
    playSound("react");
    playSound("glitch");
    onReaction?.(line);
  };

  const graphic = (
    <div className={glitch ? "glitch-target" : undefined}>
      <BrainSvg
        state={state}
        className="h-[min(32svh,280px)] w-auto sm:h-[min(48svh,500px)]"
      />
    </div>
  );

  return (
    <motion.div
      ref={rootRef}
      className={`relative ${className}`}
      animate={{ y: [0, -10, 0], rotate: [0, 0.6, 0, -0.5, 0] }}
      transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
    >
      {interactive ? (
        <button
          type="button"
          onClick={poke}
          data-cursor="character"
          aria-label="Poke NOBRAIN"
          className="block cursor-pointer border-0 bg-transparent p-0"
        >
          {graphic}
        </button>
      ) : (
        graphic
      )}
    </motion.div>
  );
}
