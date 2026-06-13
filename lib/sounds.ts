// Web Audio API sound design system — all tones programmatically synthesized.
// No audio files, no CDN dependency, no GDPR concern.

export type SoundEvent = "submit" | "validate" | "milestone" | "complete" | "error";

const PREF_KEY = "hm_sounds";

export function isSoundEnabled(): boolean {
  if (typeof window === "undefined") return false;
  const stored = localStorage.getItem(PREF_KEY);
  if (stored === "off") return false;
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return false;
  return true;
}

export function setSoundEnabled(enabled: boolean): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(PREF_KEY, enabled ? "on" : "off");
}

export function getSoundEnabled(): boolean {
  if (typeof window === "undefined") return true;
  return localStorage.getItem(PREF_KEY) !== "off";
}

let _ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  try {
    if (!_ctx || _ctx.state === "closed") {
      _ctx = new (window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    return _ctx;
  } catch {
    return null;
  }
}

function tone(
  freq: number,
  dur: number,
  vol = 0.22,
  type: OscillatorType = "sine",
  offset = 0,
): void {
  const ac = getCtx();
  if (!ac) return;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.connect(gain);
  gain.connect(ac.destination);
  osc.type = type;
  osc.frequency.setValueAtTime(freq, ac.currentTime + offset);
  gain.gain.setValueAtTime(0, ac.currentTime + offset);
  gain.gain.linearRampToValueAtTime(vol, ac.currentTime + offset + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + offset + dur);
  osc.start(ac.currentTime + offset);
  osc.stop(ac.currentTime + offset + dur + 0.02);
}

export function playSound(event: SoundEvent): void {
  if (!isSoundEnabled()) return;
  const ac = getCtx();
  if (!ac) return;
  if (ac.state === "suspended") void ac.resume();

  switch (event) {
    case "validate":
      // Subtle high tick — field passed validation
      tone(1046, 0.06, 0.10);
      break;

    case "submit":
      // Upward two-note chime — activity submitted
      tone(440, 0.12, 0.22);
      tone(659, 0.18, 0.22, "sine", 0.1);
      break;

    case "milestone":
      // Warm C-major arpeggio — 25/50/75% reached
      tone(523, 0.28, 0.18);
      tone(659, 0.28, 0.18, "sine", 0.08);
      tone(784, 0.32, 0.18, "sine", 0.16);
      break;

    case "complete":
      // Ascending phrase — full compliance achieved
      tone(523, 0.11, 0.22);
      tone(587, 0.11, 0.22, "sine", 0.11);
      tone(659, 0.11, 0.22, "sine", 0.22);
      tone(784, 0.11, 0.22, "sine", 0.33);
      tone(1047, 0.38, 0.28, "sine", 0.44);
      break;

    case "error":
      // Gentle low bump — never harsh
      tone(220, 0.14, 0.16, "sine");
      tone(165, 0.18, 0.12, "sine", 0.12);
      break;
  }
}
