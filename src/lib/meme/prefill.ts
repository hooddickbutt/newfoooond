import type { MemeTemplate } from "@/data/memes";
import { prefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

export const MEME_EVENT = "nobrain:meme";

export type MemePrefill = {
  top?: string;
  bottom?: string;
  template?: MemeTemplate;
};

export function requestMeme(detail: MemePrefill) {
  window.dispatchEvent(new CustomEvent<MemePrefill>(MEME_EVENT, { detail }));
  document.getElementById("lab")?.scrollIntoView({
    behavior: prefersReducedMotion() ? "auto" : "smooth",
  });
}
