"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

type Dot = { x: number; y: number; r: number; v: number; a: number; signal: boolean };

export function Particles() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || prefersReducedMotion()) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    const mobile = window.matchMedia("(max-width: 760px)").matches;
    const count = mobile ? 18 : 36;
    let dots: Dot[] = [];
    let frame = 0;
    let visible = true;

    const resize = () => {
      const rect = parent.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.max(1, rect.width) * dpr;
      canvas.height = Math.max(1, rect.height) * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      dots = Array.from({ length: count }, (_, index) => ({
        x: Math.random() * rect.width,
        y: Math.random() * rect.height,
        r: Math.random() * 1.4 + 0.4,
        v: 0.15 + Math.random() * 0.35,
        a: 0.15 + Math.random() * 0.35,
        signal: index === 0,
      }));
    };

    const draw = () => {
      if (!visible || document.hidden) {
        frame = window.requestAnimationFrame(draw);
        return;
      }
      const width = parent.clientWidth;
      const height = parent.clientHeight;
      ctx.clearRect(0, 0, width, height);
      for (const dot of dots) {
        dot.y -= dot.v;
        if (dot.y < -4) {
          dot.y = height + 4;
          dot.x = Math.random() * width;
        }
        ctx.fillStyle = dot.signal
          ? `rgba(228,255,58,${dot.a})`
          : `rgba(244,241,234,${dot.a})`;
        ctx.fillRect(dot.x, dot.y, dot.r, dot.r);
      }
      frame = window.requestAnimationFrame(draw);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry?.isIntersecting ?? true;
      },
      { threshold: 0.05 },
    );
    observer.observe(parent);
    resize();
    frame = window.requestAnimationFrame(draw);
    window.addEventListener("resize", resize);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      observer.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={ref}
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden="true"
    />
  );
}
