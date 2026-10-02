import { commandHelp } from "@/data/terminal";

export function runCommand(raw: string): { lines: string[]; action?: "clear" | "meme" } {
  const command = raw.trim().toLowerCase();
  if (!command) return { lines: [] };
  const name = command.split(/\s+/)[0];

  switch (name) {
    case "help":
      return { lines: ["NOBRAIN_OS commands", ...commandHelp] };
    case "brain":
      return { lines: ["ERROR 404: BRAIN NOT FOUND."] };
    case "status":
      return {
        lines: [
          "BRAIN: 0%",
          "INTELLIGENCE: ERROR",
          "COMMON SENSE: NOT FOUND",
          "THIS READOUT IS FICTIONAL.",
        ],
      };
    case "think":
      return { lines: ["THINKING...", "THOUGHT ABORTED."] };
    case "panic":
      return {
        lines: [
          "PANIC MODE ENABLED.",
          "THERE IS NOTHING TO PANIC ABOUT.",
          "PANIC CONTINUES.",
        ],
      };
    case "buy":
      return {
        lines: [
          "I can't tell you to buy.",
          "I can't tell you not to.",
          "I can't find the part that would know.",
          "This is not financial advice. This is barely a sentence.",
        ],
      };
    case "whoami":
      return { lines: ["NOBRAIN", "occupation: vacant", "clearance: none"] };
    case "meme":
      return { lines: ["opening the lab.", "make it worse."], action: "meme" };
    case "ask":
      return { lines: ["the asking machine is below the fold.", "scroll to ASK."] };
    case "clear":
      return { lines: [], action: "clear" };
    case "exit":
      return { lines: ["There is no exit. I checked."] };
    default:
      return { lines: [`command not found: ${name}`, "type help. or don't."] };
  }
}
