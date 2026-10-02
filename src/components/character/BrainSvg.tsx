import { buildCharacterSvg, VIEW_H, VIEW_W } from "@/components/character/markup";
import type { CharacterState } from "@/components/character/types";

export function BrainSvg({
  state,
  className = "",
}: {
  state: CharacterState;
  className?: string;
}) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${VIEW_W} ${VIEW_H}" class="${className}" aria-hidden="true">${buildCharacterSvg(state)}</svg>`;
  return <div className="contents" dangerouslySetInnerHTML={{ __html: svg }} />;
}
