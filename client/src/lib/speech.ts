/**
 * Hermes Advanced Speech & Acoustic Engine
 * Cleanroom aerospace audio architecture inspired by open-source voice agents (OpenJarvis)
 * Rebuilt from first principles with NASA-STD-3001 spaceflight clinical protocols:
 * 
 * 1. Web Audio API Apollo/Artemis Quindar Tones (2524 Hz intro / 2475 Hz outro)
 * 2. Natural Sentence-by-Sentence Streamed TTS with breathing pauses
 * 3. NASA Aero-Medical Speech Recognition Normalizer (fixes speech-to-text acronyms)
 * 4. Continuous Wake-Word Detection ("Hey Hermes", "Hermes", "Flight")
 * 5. Multi-Profile Acoustic Personas (Flight Surgeon, Orbital Navigator, Apollo Intercom, Neuro Coach)
 * 6. High-Fidelity Neural Voice Selection & Instant Barge-In Interruptibility
 */

let cachedVoices: SpeechSynthesisVoice[] = [];
let audioCtx: AudioContext | null = null;
let currentStreamQueue: string[] = [];
let isStreamingActive = false;
let activeUtterance: SpeechSynthesisUtterance | null = null;

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
 * Intro tone: 2524 Hz (250 ms)
 * Outro tone: 2475 Hz (250 ms)
 * Synthesized mathematically via Web Audio API sine oscillators.
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
      // 2524 Hz Apollo/Skylab Ground-to-Space PTT start tone
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
      // 2475 Hz Apollo/Skylab Ground-to-Space PTT release tone
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
      // Modern subtle HUD uplink chirp: 587 Hz (D5) -> 880 Hz (A5)
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
      // Soft downlink close chirp: 880 Hz -> 587 Hz
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
      // Gentle dual-frequency confirmation
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.06); // E5
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.04, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.14);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.15);
    }
  } catch {
    // Non-blocking fallback if browser audio context is restricted
  }
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

/**
 * Normalizes speech recognition transcripts to correct common speech-to-text mistakes
 * for aerospace, clinical, and telemetry terms.
 */
export function normalizeSpaceSpeech(rawTranscript: string): string {
  if (!rawTranscript) return "";
  let text = rawTranscript.trim();

  // Correct speech recognition mishearings of spaceflight terms
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

/**
 * Detects wake words like "Hermes", "Hey Hermes", "Computer"
 * Returns true and the stripped user command if present.
 */
export function checkWakeWord(transcript: string): { hasWakeWord: boolean; command: string } {
  if (!transcript) return { hasWakeWord: false, command: "" };

  const wakeWordPattern = /^(?:hey\s+hermes|hermes|computer|flight|capcom)\b[,:\s]*/i;
  if (wakeWordPattern.test(transcript)) {
    const command = transcript.replace(wakeWordPattern, "").trim();
    return { hasWakeWord: true, command: command || transcript };
  }

  return { hasWakeWord: false, command: transcript };
}

/**
 * Sanitizes markdown, robotic tags, and expands acronyms into natural pronunciation.
 */
export function sanitizeTextForSpeech(raw: string): string {
  if (!raw) return "";

  let clean = raw;

  // 1. Remove bracketed headers like [HERMES ...] or [NASA-STD-3001]
  clean = clean.replace(/\[[^\]]+\]:?/g, "");

  // 2. Remove markdown formatting: bold, italic, code blocks, hashes
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

  // 5. Expand acronyms for natural conversational pronunciation
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

  // 6. Clean whitespace and repeated punctuation
  clean = clean.replace(/\s+/g, " ");
  clean = clean.replace(/([.!?])\s*\1+/g, "$1");

  return clean.trim();
}

/**
 * Splits text into natural sentence chunks for conversational streaming TTS.
 */
export function splitIntoSentences(text: string): string[] {
  const clean = sanitizeTextForSpeech(text);
  if (!clean) return [];

  // Match sentences ending in ., ?, !, or newlines
  const sentences = clean
    .split(/(?<=[.?!])\s+|\n+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 2);

  return sentences.length > 0 ? sentences : [clean];
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
    description: "Steady, authoritative aerospace medical researcher tone.",
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

/**
 * Finds the highest quality, most natural sounding human voice available.
 */
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

  // Avoid harsh legacy desktop robotic voice (Microsoft David)
  const nonDavidEnglish = voices.find(
    (v) =>
      v.lang.toLowerCase().startsWith("en") &&
      !v.name.toLowerCase().includes("david")
  );
  if (nonDavidEnglish) return nonDavidEnglish;

  const anyEnglish = voices.find((v) => v.lang.toLowerCase().startsWith("en"));
  return anyEnglish || voices[0] || null;
}

export function getAvailableEnglishVoices(): SpeechSynthesisVoice[] {
  const voices = loadVoices();
  return voices.filter((v) => v.lang.toLowerCase().startsWith("en"));
}

/**
 * Natural Sentence-Streamed Voice Engine with Micro-Pauses and Interruptibility
 * Prevents Chrome buffer lockups and delivers lifelike phrasing.
 */
export function speakNaturalVoice(
  text: string,
  options?: {
    voice?: SpeechSynthesisVoice | null;
    persona?: VoicePersona;
    rate?: number;
    pitch?: number;
    onStart?: () => void;
    onSentence?: (sentenceIndex: number, sentenceText: string) => void;
    onEnd?: () => void;
    onError?: () => void;
  }
): boolean {
  if (
    typeof window === "undefined" ||
    !("speechSynthesis" in window) ||
    !text
  ) {
    return false;
  }

  stopSpeaking();

  const sentences = splitIntoSentences(text);
  if (sentences.length === 0) return false;

  const personaKey = options?.persona || "flight_surgeon";
  const persona = VOICE_PERSONAS[personaKey];
  const voice = options?.voice || getBestVoice();
  const rate = options?.rate ?? persona.rate;
  const pitch = options?.pitch ?? persona.pitch;

  currentStreamQueue = [...sentences];
  isStreamingActive = true;

  if (persona.useQuindar) {
    playQuindarTone("intro");
  }

  if (options?.onStart) {
    options.onStart();
  }

  let currentIndex = 0;

  function speakNext(): void {
    if (!isStreamingActive || currentStreamQueue.length === 0) {
      isStreamingActive = false;
      if (persona.useQuindar) {
        playQuindarTone("outro");
      }
      if (options?.onEnd) options.onEnd();
      return;
    }

    const currentSentence = currentStreamQueue.shift()!;
    if (options?.onSentence) {
      options.onSentence(currentIndex++, currentSentence);
    }

    try {
      const utterance = new SpeechSynthesisUtterance(currentSentence);
      activeUtterance = utterance;

      if (voice) {
        utterance.voice = voice;
      }
      utterance.rate = rate;
      utterance.pitch = pitch;

      utterance.onend = () => {
        if (!isStreamingActive) return;
        // 75ms natural respiratory pause between distinct thoughts
        setTimeout(() => {
          speakNext();
        }, 75);
      };

      utterance.onerror = (e) => {
        // If canceled explicitly, don't trigger error
        if (e.error === "canceled" || e.error === "interrupted") {
          return;
        }
        console.warn("Speech synthesis sentence note:", e.error);
        if (isStreamingActive && currentStreamQueue.length > 0) {
          speakNext();
        } else {
          isStreamingActive = false;
          if (options?.onError) options.onError();
        }
      };

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.error("SpeechSynthesis error:", err);
      isStreamingActive = false;
      if (options?.onError) options.onError();
    }
  }

  speakNext();
  return true;
}

/**
 * Stops any active speech and clears queued sentences instantly (Barge-In).
 */
export function stopSpeaking(): void {
  isStreamingActive = false;
  currentStreamQueue = [];
  activeUtterance = null;
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}

export function isSpeaking(): boolean {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return false;
  }
  return isStreamingActive || window.speechSynthesis.speaking;
}
