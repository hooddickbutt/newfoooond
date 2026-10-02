"use client";

import { useEffect, useRef, useState } from "react";
import { SectionHeading } from "@/components/SectionHeading";
import { Action } from "@/components/ui/action";
import { Input } from "@/components/ui/input";
import { expressions } from "@/components/character/types";
import {
  captionPairs,
  defaultMeme,
  memeBackgrounds,
  memeExpressions,
  memeTemplates,
  type MemeState,
} from "@/data/memes";
import { MEME_EVENT, type MemePrefill } from "@/lib/meme/prefill";
import { downloadCanvas, paintMeme } from "@/lib/meme/render";
import { openXShare } from "@/lib/share";
import { playSound } from "@/lib/sound";

export function MemeGenerator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [meme, setMeme] = useState<MemeState>(defaultMeme);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const onPrefill = (event: Event) => {
      const detail = (event as CustomEvent<MemePrefill>).detail;
      setReady(false);
      setMeme((current) => ({
        ...current,
        top: detail.top ?? current.top,
        bottom: detail.bottom ?? current.bottom,
        template: detail.template ?? current.template,
      }));
    };
    window.addEventListener(MEME_EVENT, onPrefill);
    return () => window.removeEventListener(MEME_EVENT, onPrefill);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let cancel = false;
    paintMeme(canvas, meme)
      .then(() => {
        if (!cancel) {
          setReady(true);
          setError(null);
        }
      })
      .catch((error: unknown) => {
        if (!cancel) {
          setError(error instanceof Error ? error.message : "The preview slipped.");
        }
      });
    return () => {
      cancel = true;
    };
  }, [meme]);

  const update = (patch: Partial<MemeState>) => {
    setReady(false);
    setMeme((current) => ({ ...current, ...patch }));
  };

  const randomize = () => {
    const caption = captionPairs[Math.floor(Math.random() * captionPairs.length)];
    playSound("glitch");
    setReady(false);
    setMeme({
      template: memeTemplates[Math.floor(Math.random() * memeTemplates.length)].id,
      background: memeBackgrounds[Math.floor(Math.random() * memeBackgrounds.length)].id,
      expression: expressions[Math.floor(Math.random() * expressions.length)],
      top: caption.top,
      bottom: caption.bottom,
    });
  };

  return (
    <section id="lab" className="scroll-mt-20 border-t border-paper/10 px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading index="03  /  LAB" title="The NOBRAIN lab">
          Make NOBRAIN worse.
        </SectionHeading>

        <div className="grid items-start gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="order-2 flex flex-col gap-6 lg:order-1">
            <Chooser
              label="Template"
              options={memeTemplates}
              value={meme.template}
              onChange={(template) => update({ template })}
            />
            <Chooser
              label="Background"
              options={memeBackgrounds}
              value={meme.background}
              onChange={(background) => update({ background })}
            />
            <Chooser
              label="Character"
              options={memeExpressions}
              value={meme.expression}
              onChange={(expression) => update({ expression })}
            />
            <Field
              id="meme-top"
              label="Top text"
              value={meme.top}
              onChange={(top) => update({ top })}
            />
            <Field
              id="meme-bottom"
              label="Bottom text"
              value={meme.bottom}
              onChange={(bottom) => update({ bottom })}
            />
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Action tone="line" onClick={randomize}>
                RANDOMIZE
              </Action>
              <Action
                disabled={!ready}
                onClick={() => {
                  const canvas = canvasRef.current;
                  if (!canvas) return;
                  playSound("click");
                  downloadCanvas(canvas);
                }}
              >
                DOWNLOAD
              </Action>
              <Action
                tone="quiet"
                className="w-auto"
                onClick={() => {
                  playSound("click");
                  openXShare(`I made NOBRAIN worse.\n\n"${meme.top}"\n"${meme.bottom}"`);
                }}
              >
                SHARE TO X
              </Action>
            </div>
          </div>

          <div className="order-1 lg:order-2" data-cursor="card">
            <canvas
              ref={canvasRef}
              role="img"
              aria-label={`Meme preview. ${meme.top}. ${meme.bottom}.`}
              className="aspect-square w-full border border-paper/15 bg-ink"
            />
            {error ? (
              <p className="mt-3 font-mono text-sm text-signal" role="alert">
                {error}
              </p>
            ) : (
              <p className="mt-3 font-mono text-[0.68rem] tracking-[0.16em] text-mute">
                {ready ? "PREVIEW READY" : "DRAWING..."}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Chooser<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: readonly { id: T; label: string }[];
  value: T;
  onChange: (id: T) => void;
}) {
  return (
    <fieldset>
      <legend className="mb-2 font-mono text-[0.68rem] tracking-[0.2em] text-mute uppercase">
        {label}
      </legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const selected = option.id === value;
          return (
            <button
              key={option.id}
              type="button"
              data-cursor="button"
              aria-pressed={selected}
              onClick={() => onChange(option.id)}
              className={`h-10 px-3 font-mono text-[0.66rem] tracking-[0.14em] ${
                selected
                  ? "bg-paper text-ink"
                  : "border border-paper/20 text-paper/80 hover:border-paper"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block font-mono text-[0.68rem] tracking-[0.2em] text-mute uppercase">
        {label}
      </label>
      <Input
        id={id}
        value={value}
        maxLength={72}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 rounded-none border-paper/20 bg-transparent px-3 font-mono text-base text-paper focus-visible:border-signal focus-visible:ring-0"
      />
    </div>
  );
}
