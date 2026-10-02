"use client";

import { Menu, X } from "lucide-react";
import { useEffect, useId, useState } from "react";
import { Action } from "@/components/ui/action";
import { project } from "@/config/project";
import { navLinks } from "@/lib/nav";
import { httpUrl } from "@/lib/links";
import { hydrateSound, isSoundEnabled, playSound, setSoundEnabled, subscribeSound } from "@/lib/sound";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [sound, setSound] = useState(false);
  const menuId = useId();
  const trade = httpUrl(project.tradeUrl);
  const x = httpUrl(project.xUrl);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    const frame = window.requestAnimationFrame(onScroll);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    hydrateSound();
    const unsubscribe = subscribeSound(setSound);
    const frame = window.requestAnimationFrame(() => setSound(isSoundEnabled()));
    return () => {
      window.cancelAnimationFrame(frame);
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const toggleSound = () => {
    const next = !sound;
    setSoundEnabled(next);
    if (next) playSound("click");
  };

  const close = () => setOpen(false);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-colors ${
        scrolled || open
          ? "border-paper/15 bg-ink/95"
          : "border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <a
          href="#content"
          data-cursor="button"
          className="flex items-center gap-2 font-display text-sm font-bold tracking-[0.18em]"
          onClick={close}
        >
          <Mark />
          NOBRAIN
        </a>

        <nav className="hidden items-center gap-6 lg:flex" aria-label="Primary">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              data-cursor="button"
              className="font-mono text-[0.68rem] tracking-[0.18em] text-paper/75 hover:text-paper"
            >
              {link.label}
            </a>
          ))}
          <a
            href={trade ?? "#token"}
            {...(trade
              ? { target: "_blank", rel: "noopener noreferrer" }
              : { "aria-label": "Trade link is not configured. View the token section." })}
            data-cursor="button"
            className="font-mono text-[0.68rem] tracking-[0.18em] text-paper hover:text-signal"
          >
            TRADE
          </a>
          <a
            href={x ?? "#community"}
            {...(x
              ? { target: "_blank", rel: "noopener noreferrer" }
              : { "aria-label": "X link is not configured. View the community section." })}
            data-cursor="button"
            className="font-mono text-[0.68rem] tracking-[0.18em] text-paper/75 hover:text-paper"
          >
            X
          </a>
        </nav>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={toggleSound}
            data-cursor="button"
            aria-pressed={sound}
            className="h-11 px-2 font-mono text-[0.62rem] tracking-[0.16em] text-paper/80 hover:text-paper sm:px-3"
          >
            SOUND: {sound ? "ON" : "OFF"}
          </button>
          <button
            type="button"
            className="grid h-11 w-11 place-items-center lg:hidden"
            aria-expanded={open}
            aria-controls={menuId}
            data-cursor="button"
            onClick={() => {
              setOpen((value) => !value);
              playSound("click");
            }}
          >
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open ? (
        <div
          id={menuId}
          className="fixed inset-0 top-16 z-50 flex flex-col bg-ink px-6 py-8 lg:hidden"
        >
          <nav className="flex flex-col gap-2" aria-label="Mobile">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={close}
                className="border-b border-paper/10 py-4 font-display text-4xl tracking-[-0.04em]"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="mt-8 flex flex-col gap-3">
            <Action href={trade ?? "#token"} external={Boolean(trade)} onClick={close}>
              TRADE
            </Action>
            <Action
              tone="line"
              href={x ?? "#community"}
              external={Boolean(x)}
              onClick={close}
            >
              X
            </Action>
          </div>
        </div>
      ) : null}
    </header>
  );
}

function Mark() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <rect x="1" y="1" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <rect x="5" y="4" width="8" height="4" fill="#141416" />
      <rect x="8" y="5.2" width="1.6" height="1.6" fill="#e4ff3a" />
      <rect x="4" y="10" width="3.2" height="3.2" fill="#141416" />
      <rect x="10.2" y="9.4" width="2.6" height="3.4" fill="#141416" />
    </svg>
  );
}
