import type { Expression } from "@/components/character/types";
import type { MemeTemplate } from "@/data/memes";

export type DemoMeme = {
  id: string;
  top: string;
  bottom: string;
  expression: Expression;
  template: MemeTemplate;
  demo: boolean;
};

export const demoMemes: DemoMeme[] = [
  {
    id: "sample-wanted",
    top: "WANTED FOR THINKING",
    bottom: "LAST SEEN NEVER",
    expression: "deadpan",
    template: "wanted",
    demo: true,
  },
  {
    id: "sample-error",
    top: "BRAIN.EXE",
    bottom: "HAS STOPPED WORKING",
    expression: "error",
    template: "error",
    demo: true,
  },
  {
    id: "sample-status",
    top: "INTELLIGENCE",
    bottom: "ERROR",
    expression: "confused",
    template: "status",
    demo: true,
  },
  {
    id: "sample-classic",
    top: "I HAD A PLAN",
    bottom: "THE PLAN LEFT",
    expression: "annoyed",
    template: "classic",
    demo: true,
  },
  {
    id: "sample-asleep",
    top: "LOADING A THOUGHT",
    bottom: "PLEASE WAIT FOREVER",
    expression: "asleep",
    template: "classic",
    demo: true,
  },
  {
    id: "sample-smug",
    top: "TRUST ME",
    bottom: "I CANNOT BE TRUSTED",
    expression: "smug",
    template: "decision",
    demo: true,
  },
];
