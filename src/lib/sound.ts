"use client";

export type SoundKind = "click" | "glitch" | "terminal" | "react";

let context: AudioContext | null = null;
let enabled = false;
const listeners = new Set<(on: boolean) => void>();

export function subscribeSound(listener: (on: boolean) => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function isSoundEnabled() {
  return enabled;
}

function emit() {
  listeners.forEach((listener) => listener(enabled));
}

export function hydrateSound() {
  enabled = window.localStorage.getItem("nobrain-sound") === "on";
  emit();
}

export function setSoundEnabled(on: boolean) {
  enabled = on;
  window.localStorage.setItem("nobrain-sound", on ? "on" : "off");
  if (on) {
    const audio = context ?? new AudioContext();
    context = audio;
    if (audio.state === "suspended") void audio.resume();
  }
  emit();
}

function tone(
  audio: AudioContext,
  type: OscillatorType,
  from: number,
  to: number,
  duration: number,
  volume: number,
) {
  const now = audio.currentTime;
  const osc = audio.createOscillator();
  const gain = audio.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(from, now);
  osc.frequency.exponentialRampToValueAtTime(Math.max(40, to), now + duration);
  gain.gain.setValueAtTime(volume, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
  osc.connect(gain).connect(audio.destination);
  osc.start(now);
  osc.stop(now + duration + 0.02);
}

export function playSound(kind: SoundKind) {
  if (!enabled) return;
  const audio = context ?? new AudioContext();
  context = audio;
  if (audio.state === "suspended") void audio.resume();

  if (kind === "click") {
    tone(audio, "square", 620, 180, 0.06, 0.035);
    return;
  }
  if (kind === "terminal") {
    tone(audio, "sine", 880, 880, 0.045, 0.03);
    return;
  }
  if (kind === "react") {
    tone(audio, "triangle", 340, 90, 0.18, 0.05);
    return;
  }

  const now = audio.currentTime;
  const length = Math.floor(audio.sampleRate * 0.1);
  const buffer = audio.createBuffer(1, length, audio.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i += 1) data[i] = Math.random() * 2 - 1;
  const source = audio.createBufferSource();
  source.buffer = buffer;
  const filter = audio.createBiquadFilter();
  filter.type = "highpass";
  filter.frequency.value = 1400;
  const gain = audio.createGain();
  gain.gain.setValueAtTime(0.045, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
  source.connect(filter).connect(gain).connect(audio.destination);
  source.start(now);
  source.stop(now + 0.11);
}

export function triggerGlitch() {
  document.documentElement.classList.add("is-glitching");
  window.setTimeout(() => {
    document.documentElement.classList.remove("is-glitching");
  }, 240);
}
