/**
 * Hermes Speech Synthesis & Natural Voice Engine
 * Delivers human-sounding, calm aerospace scientist narration.
 * Pre-loads and caches natural neural voices (Google US English, Microsoft Natural, Apple Samantha).
 * Strips robotic tags, bracket prefixes, and format noise.
 */

let cachedVoices: SpeechSynthesisVoice[] = [];

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

// Pre-load immediately and listen for browser async voice population
if (typeof window !== "undefined" && "speechSynthesis" in window) {
  loadVoices();
  window.speechSynthesis.onvoiceschanged = () => {
    loadVoices();
  };
}

export function sanitizeTextForSpeech(raw: string): string {
  if (!raw) return "";

  let clean = raw;

  // 1. Remove bracketed headers like [HERMES ...] or [NASA-STD-3001]
  clean = clean.replace(/\[[^\]]+\]:?/g, "");

  // 2. Remove markdown formatting: bold, italic, code blocks, hashes
  clean = clean.replace(/[*_`#]/g, "");

  // 3. Convert bullet characters and numbered headers into smooth speech transitions
  clean = clean.replace(/^[0-9]+\.\s+/gm, "");
  clean = clean.replace(/^[•\-\+]\s+/gm, "");
  clean = clean.replace(/[•\-\+]\s+/g, ". ");

  // 4. Strip boilerplate status lines if present
  clean = clean.replace(/Spacecraft Mode:[^\n.]+[.]?/gi, "");
  clean = clean.replace(/Xiaomi Watch H1 Telemetry:[^\n.]+[.]?/gi, "");
  clean = clean.replace(/Subagents Standing By:[^\n.]+[.]?/gi, "");
  clean = clean.replace(/State your emergency protocol[^\n.]+[.]?/gi, "");

  // 5. Expand acronyms to natural conversational pronunciation
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
  clean = clean.replace(/\bARED\b/g, "A-red resistance machine");

  // 6. Clean excess spaces, linebreaks, and trailing punctuation
  clean = clean.replace(/\s+/g, " ");
  clean = clean.replace(/([.!?])\s*\1+/g, "$1");

  return clean.trim();
}

/**
 * Finds the highest quality, most natural sounding human voice available.
 * Prioritizes Microsoft Natural / Google Neural / Apple Enhanced voices.
 */
export function getBestVoice(): SpeechSynthesisVoice | null {
  const voices = loadVoices();
  if (!voices || voices.length === 0) return null;

  // High-priority natural voice name keywords
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

  // Fallback to any English voice that is not the robotic old desktop voice
  const modernEnglish = voices.find(
    (v) =>
      v.lang.toLowerCase().startsWith("en") &&
      !v.name.toLowerCase().includes("desktop")
  );
  if (modernEnglish) return modernEnglish;

  // Generic English fallback
  const anyEnglish = voices.find((v) => v.lang.toLowerCase().startsWith("en"));
  return anyEnglish || voices[0] || null;
}

/**
 * Returns all available English voices for user selection in the UI.
 */
export function getAvailableEnglishVoices(): SpeechSynthesisVoice[] {
  const voices = loadVoices();
  return voices.filter((v) => v.lang.toLowerCase().startsWith("en"));
}

/**
 * Speaks the sanitized text with calm, natural pacing.
 */
export function speakNaturalVoice(
  text: string,
  options?: {
    voice?: SpeechSynthesisVoice | null;
    rate?: number;
    pitch?: number;
    onStart?: () => void;
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

  const clean = sanitizeTextForSpeech(text);
  if (!clean) return false;

  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(clean);

    const voice = options?.voice || getBestVoice();
    if (voice) {
      utterance.voice = voice;
    }

    // Calm, steady conversational pace
    utterance.rate = options?.rate ?? 0.96;
    utterance.pitch = options?.pitch ?? 1.0;

    if (options?.onStart) utterance.onstart = options.onStart;
    if (options?.onEnd) utterance.onend = options.onEnd;
    if (options?.onError) utterance.onerror = options.onError;

    window.speechSynthesis.speak(utterance);
    return true;
  } catch (err) {
    console.error("SpeechSynthesis error:", err);
    return false;
  }
}

export function stopSpeaking(): void {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}
