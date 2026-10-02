import { buildCharacterSvg, VIEW_H, VIEW_W } from "@/components/character/markup";
import type { CharacterState } from "@/components/character/types";
import type { MemeBackground, MemeState, MemeTemplate } from "@/data/memes";

const SIZE = 1080;
const INK = "#070708";
const PAPER = "#f4f1ea";
const SIGNAL = "#e4ff3a";
const MUTE = "#a3a095";

function cleanFamily(variable: string, fallback: string) {
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(variable)
    .replaceAll('"', "")
    .trim();
  return value || fallback;
}

function fontStack() {
  return {
    display: cleanFamily("--font-unbounded", "Unbounded, sans-serif"),
    mono: cleanFamily("--font-geist-mono", "ui-monospace, monospace"),
  };
}

function loadSvg(markup: string) {
  const parsed = new DOMParser().parseFromString(markup, "image/svg+xml");
  const problem = parsed.querySelector("parsererror");
  if (problem) {
    return Promise.reject(new Error(problem.textContent?.slice(0, 180) || "Invalid meme SVG"));
  }
  const blob = new Blob([markup], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    const timer = window.setTimeout(() => {
      URL.revokeObjectURL(url);
      reject(new Error("Meme image timed out"));
    }, 2500);
    image.onload = () => {
      window.clearTimeout(timer);
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      window.clearTimeout(timer);
      URL.revokeObjectURL(url);
      reject(new Error("Could not draw NOBRAIN"));
    };
    image.src = url;
  });
}

async function characterImage(state: MemeState) {
  const pose: CharacterState = {
    expression: state.expression,
    pupil: { x: -0.15, y: 0.08 },
    blink: 0,
    glitch: state.expression === "glitch",
    phase: 0.35,
  };
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
    <svg xmlns="http://www.w3.org/2000/svg" width="${VIEW_W}" height="${VIEW_H}" viewBox="0 0 ${VIEW_W} ${VIEW_H}">
      ${buildCharacterSvg(pose)}
    </svg>`;
  return loadSvg(svg);
}

function paintBackground(
  ctx: CanvasRenderingContext2D,
  background: MemeBackground,
) {
  ctx.fillStyle = INK;
  ctx.fillRect(0, 0, SIZE, SIZE);

  if (background === "grid") {
    ctx.strokeStyle = "rgba(244,241,234,0.08)";
    ctx.lineWidth = 1;
    for (let i = 48; i < SIZE; i += 48) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, SIZE);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(SIZE, i);
      ctx.stroke();
    }
  }

  if (background === "static") {
    for (let i = 0; i < 1400; i += 1) {
      const x = Math.random() * SIZE;
      const y = Math.random() * SIZE;
      ctx.fillStyle = `rgba(244,241,234,${0.04 + Math.random() * 0.12})`;
      ctx.fillRect(x, y, 2, 2);
    }
  }

  if (background === "horizon") {
    ctx.strokeStyle = "rgba(244,241,234,0.7)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(80, 760);
    ctx.lineTo(1000, 760);
    ctx.stroke();
  }

  if (background === "frame") {
    ctx.strokeStyle = SIGNAL;
    ctx.lineWidth = 2;
    ctx.strokeRect(36, 36, SIZE - 72, SIZE - 72);
  }
}

function wrap(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
) {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (ctx.measureText(next).width > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }
  if (current) lines.push(current);
  return lines.length ? lines : [""];
}

function drawLines(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  size: number,
  font: string,
  align: CanvasTextAlign,
  color = PAPER,
) {
  ctx.font = `700 ${size}px ${font}`;
  ctx.textAlign = align;
  ctx.textBaseline = "middle";
  ctx.fillStyle = color;
  const lines = wrap(ctx, text.toUpperCase(), maxWidth).slice(0, 4);
  const leading = size * 1.08;
  const start = y - ((lines.length - 1) * leading) / 2;
  lines.forEach((line, index) => {
    ctx.fillText(line, x, start + index * leading);
  });
}

function brand(ctx: CanvasRenderingContext2D, mono: string) {
  ctx.font = `500 18px ${mono}`;
  ctx.fillStyle = MUTE;
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillText("NOBRAIN", 56, 64);
  ctx.textAlign = "right";
  ctx.fillText("EMPTY", SIZE - 56, 64);
}

function layoutCharacter(
  template: MemeTemplate,
): { x: number; y: number; h: number } {
  if (template === "classic") return { x: 540, y: 560, h: 620 };
  if (template === "error") return { x: 540, y: 390, h: 460 };
  if (template === "wanted") return { x: 540, y: 560, h: 560 };
  if (template === "status") return { x: 300, y: 560, h: 640 };
  return { x: 820, y: 860, h: 280 };
}

export async function paintMeme(canvas: HTMLCanvasElement, state: MemeState) {
  await document.fonts.ready;
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  canvas.width = SIZE * dpr;
  canvas.height = SIZE * dpr;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const { display, mono } = fontStack();
  const image = await characterImage(state);

  paintBackground(ctx, state.background);
  brand(ctx, mono);

  const spot = layoutCharacter(state.template);
  const ratio = VIEW_W / VIEW_H;
  const width = spot.h * ratio;
  ctx.drawImage(image, spot.x - width / 2, spot.y - spot.h / 2, width, spot.h);

  const top = state.top.trim() || " ";
  const bottom = state.bottom.trim() || " ";

  if (state.template === "classic") {
    drawLines(ctx, top, 540, 150, 900, 64, display, "center");
    drawLines(ctx, bottom, 540, 980, 900, 48, display, "center");
  }

  if (state.template === "error") {
    ctx.fillStyle = "#101012";
    ctx.strokeStyle = "rgba(244,241,234,0.35)";
    ctx.lineWidth = 2;
    ctx.fillRect(120, 640, 840, 320);
    ctx.strokeRect(120, 640, 840, 320);
    ctx.font = `500 16px ${mono}`;
    ctx.fillStyle = SIGNAL;
    ctx.textAlign = "left";
    ctx.fillText("BRAIN.EXE", 156, 688);
    drawLines(ctx, top, 540, 780, 760, 42, display, "center");
    drawLines(ctx, bottom, 540, 880, 760, 28, display, "center", MUTE);
  }

  if (state.template === "wanted") {
    ctx.font = `500 22px ${mono}`;
    ctx.fillStyle = SIGNAL;
    ctx.textAlign = "center";
    ctx.fillText("WANTED", 540, 130);
    drawLines(ctx, top, 540, 190, 860, 42, display, "center");
    drawLines(ctx, bottom, 540, 980, 860, 36, display, "center");
  }

  if (state.template === "status") {
    ctx.font = `500 18px ${mono}`;
    ctx.fillStyle = MUTE;
    ctx.textAlign = "left";
    ctx.fillText("READOUT", 560, 360);
    drawLines(ctx, top, 760, 470, 460, 48, display, "left");
    drawLines(ctx, bottom, 760, 640, 460, 64, display, "left", SIGNAL);
  }

  if (state.template === "decision") {
    ctx.font = `500 18px ${mono}`;
    ctx.fillStyle = MUTE;
    ctx.textAlign = "left";
    ctx.fillText("TODAY'S DECISION", 72, 180);
    drawLines(ctx, top, 500, 420, 820, 58, display, "left");
    drawLines(ctx, bottom, 500, 680, 760, 28, display, "left", MUTE);
  }
}

export function downloadCanvas(canvas: HTMLCanvasElement) {
  const link = document.createElement("a");
  link.download = "nobrain-meme.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
}
