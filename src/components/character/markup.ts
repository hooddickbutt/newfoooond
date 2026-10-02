import type { CharacterState, Expression } from "@/components/character/types";

export const VIEW_W = 440;
export const VIEW_H = 560;

type Pose = {
  mouth: string;
  screen: string;
  left: number;
  right: number;
  pl: [number, number];
  pr: [number, number];
  brows: "neutral" | "down" | "up" | "split";
  shut: boolean;
  error: boolean;
};

const poses: Record<Expression, Pose> = {
  idle: {
    mouth: "",
    screen: "VACANT",
    left: 1,
    right: 1,
    pl: [0, 0],
    pr: [0.15, 0],
    brows: "neutral",
    shut: false,
    error: false,
  },
  confused: {
    mouth: "HUH",
    screen: "??",
    left: 1.06,
    right: 0.82,
    pl: [-0.85, 0.45],
    pr: [0.9, -0.55],
    brows: "split",
    shut: false,
    error: false,
  },
  annoyed: {
    mouth: "STOP",
    screen: "NO",
    left: 0.78,
    right: 0.7,
    pl: [0.1, 0.35],
    pr: [-0.1, 0.4],
    brows: "down",
    shut: false,
    error: false,
  },
  surprised: {
    mouth: "OH",
    screen: "!",
    left: 1.12,
    right: 1.16,
    pl: [0, -0.15],
    pr: [0, -0.2],
    brows: "up",
    shut: false,
    error: false,
  },
  error: {
    mouth: "404",
    screen: "ERR",
    left: 1,
    right: 1,
    pl: [0, 0],
    pr: [0, 0],
    brows: "down",
    shut: false,
    error: true,
  },
  smug: {
    mouth: "SURE",
    screen: "OK",
    left: 0.72,
    right: 1,
    pl: [0.55, 0.1],
    pr: [-0.2, -0.1],
    brows: "split",
    shut: false,
    error: false,
  },
  asleep: {
    mouth: "ZZZ",
    screen: "OFF",
    left: 1,
    right: 1,
    pl: [0, 0],
    pr: [0, 0],
    brows: "neutral",
    shut: true,
    error: false,
  },
  deadpan: {
    mouth: "—",
    screen: "…",
    left: 0.42,
    right: 0.36,
    pl: [0, 0],
    pr: [0, 0],
    brows: "neutral",
    shut: false,
    error: false,
  },
  glitch: {
    mouth: "???",
    screen: "GLITCH",
    left: 1.08,
    right: 0.6,
    pl: [-1, 0.2],
    pr: [1, -0.4],
    brows: "split",
    shut: false,
    error: false,
  },
};

function esc(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

const HEAD =
  "M214 70C304 52 366 108 378 184C390 258 372 322 350 376C328 432 286 486 226 506C186 520 136 506 108 472C66 422 46 356 42 286C38 210 58 142 104 104C138 76 170 78 214 70Z";

export function buildCharacterSvg(state: CharacterState) {
  const pose = poses[state.expression];
  const blink = pose.shut ? 1 : Math.max(0, Math.min(1, state.blink));
  const leftRy = 50 * pose.left * (1 - blink * 0.9);
  const rightH = 72 * pose.right * (1 - blink * 0.9);
  const showPupils = blink < 0.55 && !pose.shut;
  const px = (origin: number, amount: number, travel: number) =>
    origin + (amount + state.pupil.x * 0.85) * travel;
  const py = (origin: number, amount: number, travel: number) =>
    origin + (amount + state.pupil.y * 0.85) * travel;

  const pixelX = 178 + (0.5 + 0.5 * Math.sin(state.phase * 6.2)) * 72;
  const pixelY = 146 + (0.5 + 0.5 * Math.cos(state.phase * 4.1)) * 22;
  const antenna = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(state.phase * 5));

  const brows = {
    neutral: `<path d="M108 214 H188" stroke="#1a1a1c" stroke-width="3" fill="none" stroke-linecap="square"/><path d="M248 196 H312" stroke="#1a1a1c" stroke-width="3" fill="none" stroke-linecap="square"/>`,
    down: `<path d="M112 206 L186 224" stroke="#1a1a1c" stroke-width="3.5" fill="none" stroke-linecap="square"/><path d="M250 188 L314 206" stroke="#1a1a1c" stroke-width="3.5" fill="none" stroke-linecap="square"/>`,
    up: `<path d="M108 226 L188 206" stroke="#1a1a1c" stroke-width="3.5" fill="none" stroke-linecap="square"/><path d="M246 210 L314 190" stroke="#1a1a1c" stroke-width="3.5" fill="none" stroke-linecap="square"/>`,
    split: `<path d="M108 226 L188 208" stroke="#1a1a1c" stroke-width="3.5" fill="none" stroke-linecap="square"/><path d="M250 186 L314 208" stroke="#1a1a1c" stroke-width="3.5" fill="none" stroke-linecap="square"/>`,
  }[pose.brows];

  const leftPupil = pose.error
    ? `<path d="M132 254 L168 292 M168 254 L132 292" stroke="#f4f1ea" stroke-width="4"/>`
    : `<rect x="${px(142, pose.pl[0], 10)}" y="${py(258, pose.pl[1], 8)}" width="16" height="24" fill="#f4f1ea"/>`;

  const rightPupil = pose.error
    ? `<path d="M258 236 L294 274 M294 236 L258 274" stroke="#f4f1ea" stroke-width="4"/>`
    : `<rect x="${px(268, pose.pr[0], 8)}" y="${py(246, pose.pr[1], 7)}" width="13" height="20" fill="#f4f1ea"/>`;

  const mouth = pose.mouth
    ? `<text x="220" y="406" text-anchor="middle" fill="#f4f1ea" font-family="ui-monospace, monospace" font-size="22" letter-spacing="3">${esc(pose.mouth)}</text>`
    : `<g stroke="#f4f1ea" stroke-width="2" opacity="0.85">
        <path d="M156 386 H284"/><path d="M156 396 H284"/><path d="M156 406 H284"/><path d="M164 416 H276"/>
      </g>`;

  const glitch = state.glitch
    ? `<g opacity="0.55">
        <path d="${HEAD}" fill="#e4ff3a" transform="translate(8 -4)"/>
        <path d="${HEAD}" fill="#f4f1ea" transform="translate(-7 3)" opacity="0.45"/>
      </g>`
    : "";

  return `
    <g opacity="0.9">
      <path d="M92 268 C28 286 18 352 46 404 C62 436 30 462 52 498" fill="none" stroke="#f3f0e7" stroke-width="5" stroke-linecap="round"/>
      <rect x="40" y="492" width="22" height="14" rx="1" fill="none" stroke="#f3f0e7" stroke-width="3"/>
      <path d="M44 506 V518 M58 506 V518" stroke="#e4ff3a" stroke-width="2"/>
    </g>
    ${glitch}
    <path d="${HEAD}" fill="#f3f0e7"/>
    <path d="M236 78 L220 136 L242 162 L208 214" fill="none" stroke="#1c1c1e" stroke-width="2" opacity="0.55"/>
    <rect x="160" y="118" width="124" height="70" rx="4" fill="#141416"/>
    <text x="222" y="140" text-anchor="middle" fill="#8d8a80" font-family="ui-monospace, monospace" font-size="11" letter-spacing="2">${esc(pose.screen)}</text>
    <rect x="${pixelX.toFixed(1)}" y="${pixelY.toFixed(1)}" width="7" height="7" fill="#e4ff3a"/>
    <path d="M312 108 L356 48" fill="none" stroke="#1c1c1e" stroke-width="4"/>
    <circle cx="360" cy="42" r="10" fill="#141416" stroke="#f3f0e7" stroke-width="3"/>
    <circle cx="360" cy="42" r="3.5" fill="#e4ff3a" opacity="${antenna.toFixed(2)}"/>
    ${brows}
    <ellipse cx="150" cy="276" rx="${46 * Math.min(pose.left, 1.12)}" ry="${leftRy}" fill="#141416"/>
    <rect x="248" y="${276 - rightH / 2 - 18}" width="62" height="${Math.max(4, rightH)}" rx="6" fill="#141416"/>
    ${showPupils ? leftPupil + rightPupil : ""}
    <g stroke="#1c1c1e" stroke-width="2" opacity="0.45">
      <path d="M78 300 H108"/><path d="M82 312 H112"/><path d="M86 324 H114"/>
    </g>
    <circle cx="108" cy="360" r="8" fill="#141416"/>
    <circle cx="330" cy="318" r="3" fill="#141416"/>
    <circle cx="342" cy="332" r="3" fill="#141416"/>
    <circle cx="330" cy="346" r="3" fill="#141416"/>
    <rect x="132" y="366" width="176" height="52" rx="4" fill="#141416"/>
    ${mouth}
    <path d="M130 534 H310" stroke="#f4f1ea" stroke-width="1.5" opacity="0.4"/>
    <path d="M214 528 V540" stroke="#e4ff3a" stroke-width="2"/>
  `;
}
