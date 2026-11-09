/**
 * Hermes Speech Synthesis & Voice Processing Engine
 * Formats and humanizes responses for clear, high-quality audio narration.
 * Strips robotic tags, bracket prefixes, and raw telemetry keys.
 * Selects the best natural human voice in Chrome, Edge, Safari, or Windows.
 */

export function sanitizeTextForSpeech(raw: string): string {
  if (!raw) return "";

  let clean = raw;

  // 1. Remove bracketed headers like [HERMES ...] or [NASA-STD-3001]
  clean = clean.replace(/\[[^\]]+\]:?/g, "");

  // 2. Remove markdown asterisks, hashes, and backticks
  clean = clean.replace(/[*_`#]/g, "");

  // 3. Convert numbered lists and bullets into clean speech pauses
  clean = clean.replace(/^[0-9]+\.\s+/gm, "");
  clean = clean.replace(/^[•\-\+]\s+/gm, "");
  clean = clean.replace(/[•\-\+]\s+/g, ", ");

  // 4. Strip boilerplate status lines if present
  clean = clean.replace(/Spacecraft Mode:[^\n.]+[.]?/gi, "");
  clean = clean.replace(/Xiaomi Watch H1 Telemetry:[^\n.]+[.]?/gi, "");
  clean = clean.replace(/Subagents Standing By:[^\n.]+[.]?/gi, "");
  clean = clean.replace(/State your emergency protocol[^\n.]+[.]?/gi, "");

  // 5. Expand abbreviations for clear speech pronunciation
  clean = clean.replace(/\b0G\b/g, "zero G");
  clean = clean.replace(/\b1G\b/g, "one G");
  clean = clean.replace(/\bSpO2\b/gi, "oxygen saturation");
  clean = clean.replace(/\bHR\b/gi, "heart rate");
  clean = clean.replace(/\bBPM\b/gi, "beats per minute");
  clean = clean.replace(/\bSANS\b/g, "S A N S");
  clean = clean.replace(/\bCPR\b/g, "C P R");
  clean = clean.replace(/\bECLSS\b/g, "environmental life support");
  clean = clean.replace(/\bkPa\b/g, "kilopascals");
  clean = clean.replace(/\bmmHg\b/g, "millimeters of mercury");
  clean = clean.replace(/\bm\/s\b/g, "meters per second");
  clean = clean.replace(/\buSv\/hr\b/g, "microsieverts per hour");
  clean = clean.replace(/\bμSv\/hr\b/g, "microsieverts per hour");

  // 6. Clean whitespace and multiple punctuation marks
  clean = clean.replace(/\s+/g, " ");
  clean = clean.replace(/([.!?])\s*\1+/g, "$1");

  return clean.trim();
}

/**
 * Finds the highest quality, most natural sounding English or user-preferred voice.
 */
export function getBestVoice(): SpeechSynthesisVoice | null {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return null;
  }

  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return null;

  // Priority list for natural neural/cloud voices available across browsers
  const naturalKeywords = [
    "natural",
    "google us english",
    "jenny",
    "aria",
    "guy",
    "christopher",
    "samantha",
    "daniel",
    "karen",
    "moira",
    "oliver",
    "serena",
    "enhanced",
    "neural",
  ];

  // Try to find a high-quality natural English voice
  for (const kw of naturalKeywords) {
    const match = voices.find(
      (v) =>
        v.name.toLowerCase().includes(kw) &&
        v.lang.toLowerCase().startsWith("en")
    );
    if (match) return match;
  }

  // Fallback to any English voice
  const anyEnglish = voices.find((v) => v.lang.toLowerCase().startsWith("en"));
  if (anyEnglish) return anyEnglish;

  return voices[0] || null;
}

/**
 * Speaks the sanitized text with natural pacing and tone.
 */
export function speakNaturalVoice(
  text: string,
  options?: {
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

    const voice = getBestVoice();
    if (voice) {
      utterance.voice = voice;
    }

    // Natural conversational pace
    utterance.rate = options?.rate ?? 0.98;
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
