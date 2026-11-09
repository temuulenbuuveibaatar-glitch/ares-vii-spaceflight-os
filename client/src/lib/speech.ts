/**
 * Hermes Advanced Multilingual Speech & Acoustic Engine
 * Built for Sonnenblume Space OS (NASA Space Apps Challenge).
 *
 * Highlights:
 * 1. Cloud Neural MP3 Audio Stream (/api/hermes/speech) - Eliminates robotic OS voices (Microsoft David)
 * 2. Multi-language Support: English, French, Spanish, Chinese, Russian, Italian, German, Mongolian
 * 3. Apollo/Artemis CapCom Quindar Tones (2524 Hz intro / 2475 Hz outro) via Web Audio API
 * 4. Automatic Language Detection & Aerospace Speech Normalization
 * 5. Instant Barge-In Stop & Full Duplex Hands-Free Mode
 */

import { detectLanguage, SupportedLanguage } from "@shared/hermesAI";

let cachedVoices: SpeechSynthesisVoice[] = [];
let audioCtx: AudioContext | null = null;
let currentStreamQueue: string[] = [];
let isStreamingActive = false;
let activeUtterance: SpeechSynthesisUtterance | null = null;
let currentAudioElement: HTMLAudioElement | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

/**
 * Authentic NASA Apollo/Artemis CapCom Quindar Tones
 * 2524 Hz intro / 2475 Hz outro
 */
export function playQuindarTone(type: "intro" | "outro" | "ack" | "mic_open" | "mic_close"): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const now = ctx.currentTime;

    osc.type = "sine";

    if (type === "intro") {
      osc.frequency.setValueAtTime(2524, now);
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.04, now + 0.015);
      gain.gain.linearRampToValueAtTime(0.04, now + 0.18);
      gain.gain.linearRampToValueAtTime(0.0001, now + 0.22);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.23);
    } else if (type === "outro") {
      osc.frequency.setValueAtTime(2475, now);
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.035, now + 0.015);
      gain.gain.linearRampToValueAtTime(0.035, now + 0.18);
      gain.gain.linearRampToValueAtTime(0.0001, now + 0.22);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.23);
    } else if (type === "mic_open") {
      osc.frequency.setValueAtTime(587.33, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.05, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.13);
    } else if (type === "mic_close") {
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(587.33, now + 0.08);
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.04, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.13);
    } else if (type === "ack") {
      osc.frequency.setValueAtTime(523.25, now);
      osc.frequency.setValueAtTime(659.25, now + 0.06);
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.04, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.14);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.15);
    }
  } catch {}
}

function loadVoices(): SpeechSynthesisVoice[] {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return [];
  }
  const voices = window.speechSynthesis.getVoices();
  if (voices && voices.length > 0) {
    cachedVoices = voices;
  }
  return cachedVoices;
}

if (typeof window !== "undefined" && "speechSynthesis" in window) {
  loadVoices();
  window.speechSynthesis.onvoiceschanged = () => {
    loadVoices();
  };
}

export function normalizeSpaceSpeech(rawTranscript: string): string {
  if (!rawTranscript) return "";
  let text = rawTranscript.trim();

  const corrections: [RegExp, string][] = [
    [/\b(sand|sam|sands)\s+(syndrome|vision|eye)\b/gi, "SANS syndrome"],
    [/\b(eclis|e-class|eclipse|ecliss|atlas)\b/gi, "ECLSS"],
    [/\b(s p o 2|spo two|spo2|sbo2)\b/gi, "SpO₂"],
    [/\b(evans russomano|evits|evets)\b/gi, "Evetts-Russomano 0G CPR"],
    [/\b(show me|xiao mi|show me watch|xiaomi watch)\b/gi, "Xiaomi Watch H1"],
    [/\b(g cap|g-cap|g capping|gravity cap)\b/gi, "G-load capping"],
    [/\b(arm strong|arms strong)\s+limit\b/gi, "Armstrong limit"],
    [/\b(solar flare|s p e|spe storm)\b/gi, "Solar Particle Event (SPE)"],
    [/\b(whipple shield|wiffle shield)\b/gi, "Whipple shielding"],
    [/\b(c p r|see peer|cpr)\b/gi, "CPR"],
    [/\b(berlin hub|berlin station)\b/gi, "Berlin Mission Hub"],
    [/\b(vis viva|vis-viva|this viva)\b/gi, "Vis-Viva orbital equation"],
    [/\b(tsiolkovsky|siolkovsky|rocket equation)\b/gi, "Tsiolkovsky rocket equation"],
  ];

  for (const [pattern, replacement] of corrections) {
    text = text.replace(pattern, replacement);
  }

  return text;
}

export function checkWakeWord(transcript: string): { hasWakeWord: boolean; command: string } {
  if (!transcript) return { hasWakeWord: false, command: "" };

  const wakeWordPattern = /^(?:hey\s+hermes|hermes|computer|flight|capcom)\b[,:\s]*/i;
  if (wakeWordPattern.test(transcript)) {
    const command = transcript.replace(wakeWordPattern, "").trim();
    return { hasWakeWord: true, command: command || transcript };
  }

  return { hasWakeWord: false, command: transcript };
}

export function sanitizeTextForSpeech(raw: string): string {
  if (!raw) return "";

  let clean = raw;

  // 1. Remove bracketed headers
  clean = clean.replace(/\[[^\]]+\]:?/g, "");

  // 2. Remove markdown formatting
  clean = clean.replace(/[*_`#]/g, "");

  // 3. Smooth lists into flowing speech
  clean = clean.replace(/^[0-9]+\.\s+/gm, "");
  clean = clean.replace(/^[•\-\+]\s+/gm, "");
  clean = clean.replace(/[•\-\+]\s+/g, ". ");

  // 4. Strip boilerplate headers
  clean = clean.replace(/Spacecraft Mode:[^\n.]+[.]?/gi, "");
  clean = clean.replace(/Xiaomi Watch H1 Telemetry:[^\n.]+[.]?/gi, "");
  clean = clean.replace(/Subagents Standing By:[^\n.]+[.]?/gi, "");
  clean = clean.replace(/State your emergency protocol[^\n.]+[.]?/gi, "");

  // 5. Expand acronyms
  clean = clean.replace(/\b0G\b/g, "zero gravity");
  clean = clean.replace(/\b1G\b/g, "one G");
  clean = clean.replace(/\bSpO2\b/gi, "blood oxygen");
  clean = clean.replace(/\bHR\b/gi, "heart rate");
  clean = clean.replace(/\bBPM\b/gi, "beats per minute");
  clean = clean.replace(/\bSANS\b/g, "S-A-N-S syndrome");
  clean = clean.replace(/\bCPR\b/g, "C-P-R");
  clean = clean.replace(/\bECLSS\b/g, "environmental life support");
  clean = clean.replace(/\bkPa\b/g, "kilopascals");
  clean = clean.replace(/\bmmHg\b/g, "millimeters of mercury");
  clean = clean.replace(/\bm\/s\b/g, "meters per second");
  clean = clean.replace(/\buSv\/hr\b/g, "microsieverts per hour");
  clean = clean.replace(/\bμSv\/hr\b/g, "microsieverts per hour");
  clean = clean.replace(/\bARED\b/g, "A-red resistance gym");

  clean = clean.replace(/\s+/g, " ");
  clean = clean.replace(/([.!?])\s*\1+/g, "$1");

  return clean.trim();
}

export type VoicePersona = "flight_surgeon" | "orbital_navigator" | "apollo_intercom" | "neuro_coach";

export interface VoicePersonaSettings {
  rate: number;
  pitch: number;
  useQuindar: boolean;
  name: string;
  description: string;
}

export const VOICE_PERSONAS: Record<VoicePersona, VoicePersonaSettings> = {
  flight_surgeon: {
    rate: 0.98,
    pitch: 1.0,
    useQuindar: false,
    name: "Flight Surgeon (Calm & Clear)",
    description: "Studio-quality aerospace medical researcher tone.",
  },
  apollo_intercom: {
    rate: 1.0,
    pitch: 1.02,
    useQuindar: true,
    name: "Apollo/Artemis CapCom",
    description: "Classic NASA deep-space radio comms with authentic Quindar chimes.",
  },
  orbital_navigator: {
    rate: 1.06,
    pitch: 0.98,
    useQuindar: false,
    name: "Orbital Navigator (Tactical)",
    description: "Brisk, precise astrodynamics & maneuver calculations.",
  },
  neuro_coach: {
    rate: 0.92,
    pitch: 0.96,
    useQuindar: false,
    name: "Neuro-Wellness Coach",
    description: "Soothing, relaxed cadence for stress management & sleep hygiene.",
  },
};

export function getBestVoice(): SpeechSynthesisVoice | null {
  const voices = loadVoices();
  if (!voices || voices.length === 0) return null;

  const preferredKeywords = [
    "natural",
    "google us english",
    "jenny",
    "aria",
    "guy",
    "christopher",
    "samantha",
    "ava",
    "daniel",
    "karen",
    "serena",
    "oliver",
    "zira",
    "hazel",
    "catherine",
    "eva",
    "enhanced",
    "neural",
    "online",
  ];

  for (const kw of preferredKeywords) {
    const found = voices.find(
      (v) =>
        v.name.toLowerCase().includes(kw) &&
        v.lang.toLowerCase().startsWith("en")
    );
    if (found) return found;
  }

  // Strictly avoid robotic Microsoft David
  const nonDavidEnglish = voices.find(
    (v) =>
      v.lang.toLowerCase().startsWith("en") &&
      !v.name.toLowerCase().includes("david")
  );
  if (nonDavidEnglish) return nonDavidEnglish;

  return voices.find((v) => v.lang.toLowerCase().startsWith("en")) || voices[0] || null;
}

export function getAvailableEnglishVoices(): SpeechSynthesisVoice[] {
  const voices = loadVoices();
  return voices.filter((v) => v.lang.toLowerCase().startsWith("en"));
}

/**
 * Primary Voice Synthesis Engine
 * Attempts high-definition Cloud Neural MP3 stream first (bypasses Windows David),
 * falling back gracefully to client SpeechSynthesis if offline.
 */
export function speakNaturalVoice(
  text: string,
  options?: {
    voice?: SpeechSynthesisVoice | null;
    persona?: VoicePersona;
    rate?: number;
    pitch?: number;
    lang?: string;
    onStart?: () => void;
    onEnd?: () => void;
    onError?: () => void;
  }
): boolean {
  if (!text) return false;

  stopSpeaking();

  const clean = sanitizeTextForSpeech(text);
  if (!clean) return false;

  const detected = (options?.lang as SupportedLanguage) || detectLanguage(clean);
  const personaKey = options?.persona || "flight_surgeon";
  const persona = VOICE_PERSONAS[personaKey];

  if (persona.useQuindar) {
    playQuindarTone("intro");
  }

  // Attempt High-Definition Neural Cloud MP3 stream first
  if (typeof window !== "undefined" && typeof Audio !== "undefined") {
    try {
      const speechUrl = `/api/hermes/speech?text=${encodeURIComponent(clean.slice(0, 800))}&lang=${detected}`;
      const audio = new Audio(speechUrl);
      currentAudioElement = audio;

      audio.onplay = () => {
        if (options?.onStart) options.onStart();
      };

      audio.onended = () => {
        currentAudioElement = null;
        if (persona.useQuindar) {
          playQuindarTone("outro");
        }
        if (options?.onEnd) options.onEnd();
      };

      audio.onerror = () => {
        currentAudioElement = null;
        // Fallback to local browser SpeechSynthesis
        speakBrowserFallback(clean, detected, options);
      };

      const promise = audio.play();
      if (promise !== undefined) {
        promise.catch(() => {
          speakBrowserFallback(clean, detected, options);
        });
      }
      return true;
    } catch {
      speakBrowserFallback(clean, detected, options);
      return true;
    }
  }

  return speakBrowserFallback(clean, detected, options);
}

function speakBrowserFallback(
  text: string,
  lang: SupportedLanguage,
  options?: {
    voice?: SpeechSynthesisVoice | null;
    persona?: VoicePersona;
    rate?: number;
    pitch?: number;
    onStart?: () => void;
    onEnd?: () => void;
    onError?: () => void;
  }
): boolean {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return false;
  }

  try {
    const utterance = new SpeechSynthesisUtterance(text);
    const personaKey = options?.persona || "flight_surgeon";
    const persona = VOICE_PERSONAS[personaKey];

    // Language mapping for browser speech synthesis
    const langMap: Record<SupportedLanguage, string> = {
      en: "en-US",
      fr: "fr-FR",
      es: "es-ES",
      zh: "zh-CN",
      ru: "ru-RU",
      it: "it-IT",
      de: "de-DE",
      mn: "ru-RU",
    };
    utterance.lang = langMap[lang] || "en-US";

    const voice = options?.voice || getBestVoice();
    if (voice) {
      utterance.voice = voice;
    }
    utterance.rate = options?.rate ?? persona.rate;
    utterance.pitch = options?.pitch ?? persona.pitch;

    if (options?.onStart) utterance.onstart = options.onStart;
    utterance.onend = () => {
      activeUtterance = null;
      if (persona.useQuindar) playQuindarTone("outro");
      if (options?.onEnd) options.onEnd();
    };
    utterance.onerror = () => {
      activeUtterance = null;
      if (options?.onError) options.onError();
    };

    activeUtterance = utterance;
    window.speechSynthesis.speak(utterance);
    return true;
  } catch {
    return false;
  }
}

export function stopSpeaking(): void {
  isStreamingActive = false;
  currentStreamQueue = [];
  activeUtterance = null;
  if (currentAudioElement) {
    currentAudioElement.pause();
    currentAudioElement.src = "";
    currentAudioElement = null;
  }
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}

export function isSpeaking(): boolean {
  if (currentAudioElement && !currentAudioElement.paused) {
    return true;
  }
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    return window.speechSynthesis.speaking;
  }
  return false;
}
