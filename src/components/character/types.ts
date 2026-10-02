export const expressions = [
  "idle",
  "confused",
  "annoyed",
  "surprised",
  "error",
  "smug",
  "asleep",
  "deadpan",
  "glitch",
] as const;

export type Expression = (typeof expressions)[number];

export type Pupil = { x: number; y: number };

export type CharacterState = {
  expression: Expression;
  pupil: Pupil;
  blink: number;
  glitch: boolean;
  phase: number;
};
