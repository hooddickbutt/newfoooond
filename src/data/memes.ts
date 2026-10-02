import type { Expression } from "@/components/character/types";

export const memeTemplates = [
  { id: "classic", label: "CLASSIC" },
  { id: "error", label: "ERROR" },
  { id: "wanted", label: "WANTED" },
  { id: "status", label: "STATUS" },
  { id: "decision", label: "DECISION" },
] as const;

export const memeBackgrounds = [
  { id: "void", label: "VOID" },
  { id: "grid", label: "GRID" },
  { id: "static", label: "STATIC" },
  { id: "horizon", label: "HORIZON" },
  { id: "frame", label: "FRAME" },
] as const;

export type MemeTemplate = (typeof memeTemplates)[number]["id"];
export type MemeBackground = (typeof memeBackgrounds)[number]["id"];

export type MemeState = {
  template: MemeTemplate;
  background: MemeBackground;
  expression: Expression;
  top: string;
  bottom: string;
};

export const memeExpressions: { id: Expression; label: string }[] = [
  { id: "idle", label: "IDLE" },
  { id: "confused", label: "HUH" },
  { id: "annoyed", label: "STOP" },
  { id: "surprised", label: "OH" },
  { id: "error", label: "404" },
  { id: "smug", label: "SURE" },
  { id: "asleep", label: "ZZZ" },
  { id: "deadpan", label: "FLAT" },
];

export const captionPairs: { top: string; bottom: string }[] = [
  { top: "BRAIN NOT FOUND", bottom: "HAVE YOU TRIED NOTHING" },
  { top: "I THOUGHT ABOUT IT", bottom: "THE THOUGHT LEFT" },
  { top: "SYSTEM STATUS", bottom: "CONFUSED" },
  { top: "ASKED FOR ADVICE", bottom: "RECEIVED A SHRUG" },
  { top: "INTELLIGENCE", bottom: "ERROR" },
  { top: "MY STRATEGY", bottom: "STEP ONE: PANIC" },
  { top: "ROADMAP", bottom: "I FORGOT THE ROAD" },
  { top: "COMMON SENSE", bottom: "NOT FOUND" },
  { top: "TOUCHED THE MACHINE", bottom: "THE MACHINE APOLOGIZED" },
  { top: "PROCESSING", bottom: "NOTHING" },
];

export const defaultMeme: MemeState = {
  template: "classic",
  background: "grid",
  expression: "confused",
  top: "BRAIN NOT FOUND",
  bottom: "HAVE YOU TRIED NOTHING",
};
