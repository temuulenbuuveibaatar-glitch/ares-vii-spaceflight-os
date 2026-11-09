import { generateHermesAIResponse } from "@shared/hermesAI";
import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import {
  speakNaturalVoice,
  getBestVoice,
  stopSpeaking,
  getAvailableEnglishVoices,
  playQuindarTone,
  normalizeSpaceSpeech,
  checkWakeWord,
  VOICE_PERSONAS,
  VoicePersona,
} from "@/lib/speech";
import { Link } from "wouter";
import {
  Send,
  X,
  Maximize2,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  CheckCircle2,
  Play,
  RotateCcw,
  Sparkles,
  Key,
  Square,
  Radio,
  Sliders,
  Activity,
} from "lucide-react";

const QUICK_STEPS = [
  "1. Check Watch H1 heart rate, blood pressure & oxygen",
  "2. Verify cabin pressure & radiation shielding",
  "3. Apply neck/thigh cuff or emergency medication",
  "4. Lock G-force cap (≤ 2.6G) for safe return",
];

export default function HermesFloatingAgent() {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("hermes_voice_enabled") === "true";
    }
    return false;
  });
  const [handsFreeMode, setHandsFreeMode] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [activeStepIdx, setActiveStepIdx] = useState<number>(0);
  const [loopRunning, setLoopRunning] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState(false);
  const [persona, setPersona] = useState<VoicePersona>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("hermes_voice_persona") as VoicePersona) || "flight_surgeon";
    }
    return "flight_surgeon";
  });
  const [quindarSoundEnabled, setQuindarSoundEnabled] = useState<boolean>(true);
  const [geminiKey, setGeminiKey] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("hermes_gemini_key") || "";
    }
    return "";
  });
  const [keySavedMessage, setKeySavedMessage] = useState(false);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceName, setSelectedVoiceName] = useState<string>("");
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const [chatHistory, setChatHistory] = useState<
    Array<{
      role: "user" | "hermes";
      text: string;
      timestamp: string;
    }>
  >([
    {
      role: "hermes",
      text: "Hello Commander. Hermes aerospace flight and medical intelligence online. Monitored via Xiaomi Watch H1 continuous telemetry.\n\nYou can ask me any spaceflight physiology question, use hands-free voice mode with 'Hey Hermes', or click 'Listen Aloud' to hear any response spoken naturally.",
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);

  useEffect(() => {
    const updateVoiceList = () => {
      const list = getAvailableEnglishVoices();
      setAvailableVoices(list);
      const savedVoice = typeof window !== "undefined" ? localStorage.getItem("hermes_selected_voice") : "";
      const best = getBestVoice();
      if (savedVoice && list.some(v => v.name === savedVoice)) {
        setSelectedVoiceName(savedVoice);
      } else if (best) {
        setSelectedVoiceName(best.name);
      } else if (list.length > 0) {
        setSelectedVoiceName(list[0].name);
      }
    };

    updateVoiceList();
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.onvoiceschanged = updateVoiceList;
    }
  }, [isOpen]);

  const speak = (text: string) => {
    if (!voiceEnabled) return;
    const voiceObj = availableVoices.find((v) => v.name === selectedVoiceName) || null;
    speakNaturalVoice(text, {
      voice: voiceObj,
      persona,
      onStart: () => setIsSpeaking(true),
      onEnd: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
  };

  const speakExplicit = (text: string) => {
    const voiceObj = availableVoices.find((v) => v.name === selectedVoiceName) || null;
    speakNaturalVoice(text, {
      voice: voiceObj,
      persona,
      onStart: () => setIsSpeaking(true),
      onEnd: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
  };

  const handleToggleVoice = () => {
    const next = !voiceEnabled;
    setVoiceEnabled(next);
    if (typeof window !== "undefined") {
      localStorage.setItem("hermes_voice_enabled", String(next));
    }
    if (!next) {
      stopSpeaking();
      setIsSpeaking(false);
    }
  };

  useEffect(() => {
    if (!loopRunning) return;
    if (activeStepIdx < QUICK_STEPS.length) {
      speak(`${QUICK_STEPS[activeStepIdx]}. Click Confirm and Next when completed.`);
    } else {
      speak("All 4 mission safety steps are complete. Crew vitals and spacecraft trajectory are nominal.");
      setLoopRunning(false);
    }
  }, [activeStepIdx, loopRunning]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  const { data: overview } = useQuery<any>({
    queryKey: ["/api/mission/overview"],
    refetchInterval: 3000,
  });

  const latestTelemetry = overview?.recentTelemetry?.[0];

  const commandMutation = useMutation({
    mutationFn: async (userPrompt: string) => {
      try {
        const payload: any = { prompt: userPrompt };
        if (geminiKey.trim()) {
          payload.apiKey = geminiKey.trim();
        }
        const res = await apiRequest("POST", "/api/hermes/command", payload);
        return await res.json();
      } catch (err) {
        return {
          reply: generateHermesAIResponse(userPrompt, {
            heartRate: latestTelemetry?.heartRate,
            spo2: latestTelemetry?.spo2,
            mode: overview?.autopilotState?.mode,
          }),
        };
      }
    },
    onSuccess: (data, userPrompt) => {
      const reply =
        data?.reply ||
        generateHermesAIResponse(userPrompt, {
          heartRate: latestTelemetry?.heartRate,
          spo2: latestTelemetry?.spo2,
        });
      setChatHistory((prev) => [
        ...prev,
        {
          role: "hermes",
          text: reply,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
      if (voiceEnabled) {
        speak(reply);
      }
      queryClient.invalidateQueries({ queryKey: ["/api/mission/overview"] });
    },
    onError: (_, userPrompt) => {
      const fallback = generateHermesAIResponse(userPrompt, {
        heartRate: latestTelemetry?.heartRate,
        spo2: latestTelemetry?.spo2,
      });
      setChatHistory((prev) => [
        ...prev,
        {
          role: "hermes",
          text: fallback,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
      if (voiceEnabled) {
        speak(fallback);
      }
    },
  });

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    const text = prompt.trim();
    if (/^(done|next|confirm|yes)$/i.test(text) && activeStepIdx < QUICK_STEPS.length) {
      setLoopRunning(true);
      setActiveStepIdx((i) => i + 1);
      setPrompt("");
      return;
    }
    setChatHistory((prev) => [
      ...prev,
      { role: "user", text, timestamp: new Date().toLocaleTimeString() },
    ]);
    setPrompt("");
    commandMutation.mutate(text);
  };

  const handleSaveSettings = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("hermes_gemini_key", geminiKey.trim());
      localStorage.setItem("hermes_voice_persona", persona);
    }
    setKeySavedMessage(true);
    setTimeout(() => {
      setKeySavedMessage(false);
      setShowSettings(false);
    }, 1500);
  };

  // Full-Duplex Voice Input & Wake-Word Processing
  const startVoiceRecognition = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      speakExplicit("Voice recognition is not supported in this browser, but text is fully active.");
      return;
    }

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    // Barge-in: stop any active voice when astronaut speaks
    stopSpeaking();
    setIsSpeaking(false);

    try {
      const rec = new SpeechRecognition();
      recognitionRef.current = rec;
      rec.lang = "en-US";
      rec.continuous = handsFreeMode;
      rec.interimResults = false;

      rec.onstart = () => {
        setIsListening(true);
        if (quindarSoundEnabled) {
          playQuindarTone("mic_open");
        }
      };

      rec.onend = () => {
        setIsListening(false);
        if (quindarSoundEnabled) {
          playQuindarTone("mic_close");
        }
        // If in hands-free mode, re-arm recognition after speech ends
        if (handsFreeMode && isOpen) {
          setTimeout(() => {
            try {
              rec.start();
            } catch {}
          }, 300);
        }
      };

      rec.onerror = () => {
        setIsListening(false);
      };

      rec.onresult = (ev: any) => {
        const rawTranscript = ev.results[ev.results.length - 1][0].transcript;
        const normalized = normalizeSpaceSpeech(rawTranscript);

        // Check wake-word if in hands-free mode
        if (handsFreeMode) {
          const { hasWakeWord, command } = checkWakeWord(normalized);
          if (!hasWakeWord && !command.toLowerCase().includes("hermes")) {
            return; // Ignore casual ambient conversation in hands-free mode
          }
          if (quindarSoundEnabled) {
            playQuindarTone("ack");
          }
          setChatHistory((prev) => [
            ...prev,
            { role: "user", text: command, timestamp: new Date().toLocaleTimeString() },
          ]);
          commandMutation.mutate(command);
        } else {
          if (quindarSoundEnabled) {
            playQuindarTone("ack");
          }
          setChatHistory((prev) => [
            ...prev,
            { role: "user", text: normalized, timestamp: new Date().toLocaleTimeString() },
          ]);
          commandMutation.mutate(normalized);
        }
      };

      rec.start();
    } catch {
      setIsListening(false);
    }
  };

  const toggleHandsFree = () => {
    const next = !handsFreeMode;
    setHandsFreeMode(next);
    if (next && !isListening) {
      startVoiceRecognition();
    } else if (!next && isListening && recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-2 font-sans">
      {isOpen ? (
        <div className="surface-enter w-[380px] sm:w-[450px] rounded-2xl border border-[#354528] bg-[#0e120b] shadow-2xl shadow-black/80 overflow-hidden">
          {/* TOP BAR */}
          <div className="bg-[#13190e] px-4 py-3 border-b border-[#232d1a] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className={`w-2 h-2 rounded-full ${isSpeaking ? "bg-[#fbbf24] animate-ping" : isListening ? "bg-red-400 animate-pulse" : "bg-[#84a96c]"}`} />
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-1.5 font-mono">
                  <span>HERMES MEDICAL & FLIGHT AI</span>
                  {isSpeaking && (
                    <div className="flex items-center gap-1 text-[10px] text-[#fbbf24] font-mono px-1.5 py-0.5 rounded bg-[#28381c]">
                      <span className="w-1 h-2 bg-[#fbbf24] animate-pulse"></span>
                      <span className="w-1 h-3 bg-[#fbbf24] animate-pulse delay-75"></span>
                      <span className="w-1 h-2 bg-[#fbbf24] animate-pulse delay-150"></span>
                      <span>SPEAKING</span>
                    </div>
                  )}
                  {isListening && (
                    <div className="flex items-center gap-1 text-[10px] text-red-400 font-mono px-1.5 py-0.5 rounded bg-red-950/40 border border-red-500/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span>
                      <span>{handsFreeMode ? "HEY HERMES" : "LISTENING"}</span>
                    </div>
                  )}
                </div>
                <div className="text-[11px] text-[#8ea873]">
                  NASA-STD-3001 Clinical Science · Watch H1 Telemetry
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {isSpeaking && (
                <button
                  onClick={() => {
                    stopSpeaking();
                    setIsSpeaking(false);
                  }}
                  className="p-1.5 text-red-400 hover:text-white rounded-lg hover:bg-red-950/40 cursor-pointer transition-colors"
                  title="Stop speaking (Barge-in)"
                >
                  <Square className="w-3.5 h-3.5 fill-current" />
                </button>
              )}
              <button
                onClick={toggleHandsFree}
                className={`p-1.5 rounded-lg cursor-pointer transition-colors ${
                  handsFreeMode
                    ? "bg-[#28381c] text-[#fbbf24] border border-[#fbbf24]/40"
                    : "text-[#8ea873] hover:text-white hover:bg-[#1a2313]"
                }`}
                title={handsFreeMode ? "Hands-Free Voice Mode ACTIVE (Listening for 'Hey Hermes')" : "Enable Hands-Free Voice ('Hey Hermes')"}
              >
                <Radio className="w-4 h-4" />
              </button>
              <button
                onClick={() => setShowSettings(!showSettings)}
                className={`p-1.5 rounded-lg cursor-pointer transition-colors ${showSettings || geminiKey ? "text-[#fbbf24] hover:bg-[#28381c]" : "text-[#8ea873] hover:text-white hover:bg-[#1a2313]"}`}
                title="AI & Voice Persona Settings"
              >
                <Sliders className="w-4 h-4" />
              </button>
              <button
                onClick={handleToggleVoice}
                className="p-1.5 text-[#8ea873] hover:text-white rounded-lg hover:bg-[#1a2313] cursor-pointer transition-colors"
                title={voiceEnabled ? "Voice narration ON (click to mute)" : "Voice narration MUTED (click to enable)"}
              >
                {voiceEnabled ? (
                  <Volume2 className="w-4 h-4 text-[#fbbf24]" />
                ) : (
                  <VolumeX className="w-4 h-4 text-[#556947]" />
                )}
              </button>
              <Link href="/hermes">
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 text-[#8ea873] hover:text-white rounded-lg hover:bg-[#1a2313] cursor-pointer transition-colors"
                  title="Expand to Full Hermes Command Deck"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              </Link>
              <button
                onClick={() => {
                  setIsOpen(false);
                  stopSpeaking();
                  setIsSpeaking(false);
                  if (recognitionRef.current) recognitionRef.current.stop();
                }}
                className="p-1.5 text-[#8ea873] hover:text-white rounded-lg hover:bg-[#1a2313] cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* QUICK VOICE TOOLBAR */}
          <div className="bg-[#10160c] px-3.5 py-1.5 border-b border-[#232d1a] flex items-center justify-between text-[11px] font-mono">
            <div className="flex items-center gap-1.5 flex-1 min-w-0 mr-2">
              <span className="text-[#8ea873] shrink-0">Voice:</span>
              <select
                value={selectedVoiceName}
                onChange={(e) => {
                  setSelectedVoiceName(e.target.value);
                  if (typeof window !== "undefined") {
                    localStorage.setItem("hermes_selected_voice", e.target.value);
                  }
                }}
                className="bg-[#182213] border border-[#2e3b23] text-[#e3ecd8] rounded px-1.5 py-0.5 text-[11px] truncate focus:outline-none focus:border-[#fbbf24] max-w-[210px]"
              >
                {availableVoices.map((v) => (
                  <option key={v.name} value={v.name}>
                    {v.name.replace(/Microsoft |Desktop |Online \(Natural\)|\(United States\)/gi, "").trim()}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="button"
              onClick={() => {
                const voiceObj = availableVoices.find((v) => v.name === selectedVoiceName) || null;
                speakExplicit("Hermes flight and medical voice engine operational. This voice is active.", { voice: voiceObj });
              }}
              className="px-2 py-0.5 rounded bg-[#28381c] hover:bg-[#344824] text-[#fbbf24] border border-[#3f572c] text-[10px] font-bold flex items-center gap-1 shrink-0 cursor-pointer"
              title="Test current voice"
            >
              <Play className="w-2.5 h-2.5" />
              <span>Test Voice</span>
            </button>
          </div>

          {/* AI & VOICE SETTINGS DRAWER */}
          {showSettings && (
            <div className="p-3.5 bg-[#182213] border-b border-[#2e3b23] space-y-3 text-xs">
              <div className="flex items-center justify-between text-[#fbbf24] font-bold">
                <span>Aerospace Voice & Model Settings</span>
                {keySavedMessage && <span className="text-[#84a96c]">Preferences Saved!</span>}
              </div>

              {/* Persona Selector */}
              <div className="space-y-1">
                <label className="text-[11px] text-[#a8baa0] font-mono">Speech Persona:</label>
                <select
                  value={persona}
                  onChange={(e) => setPersona(e.target.value as VoicePersona)}
                  className="w-full bg-[#0b0e0a] border border-[#2e3b23] text-white px-2 py-1.5 rounded-lg text-xs font-mono focus:outline-none focus:border-[#fbbf24]"
                >
                  {Object.entries(VOICE_PERSONAS).map(([key, item]) => (
                    <option key={key} value={key}>
                      {item.name}
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-[#788e6a]">{VOICE_PERSONAS[persona].description}</p>
              </div>

              {/* Voice Selection */}
              {availableVoices.length > 0 && (
                <div className="space-y-1">
                  <label className="text-[11px] text-[#a8baa0] font-mono">Synthesizer Voice Engine:</label>
                  <select
                    value={selectedVoiceName}
                    onChange={(e) => { setSelectedVoiceName(e.target.value); if (typeof window !== "undefined") localStorage.setItem("hermes_selected_voice", e.target.value); }}
                    className="w-full bg-[#0b0e0a] border border-[#2e3b23] text-white px-2 py-1.5 rounded-lg text-xs font-mono focus:outline-none focus:border-[#fbbf24]"
                  >
                    {availableVoices.map((v) => (
                      <option key={v.name} value={v.name}>
                        {v.name} ({v.lang})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Quindar Sound Chimes */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-[#a8baa0] font-mono">NASA Apollo/Artemis Quindar Tones:</span>
                <button
                  type="button"
                  onClick={() => {
                    const next = !quindarSoundEnabled;
                    setQuindarSoundEnabled(next);
                    if (next) playQuindarTone("intro");
                  }}
                  className={`px-2 py-0.5 rounded text-[11px] font-mono border cursor-pointer ${
                    quindarSoundEnabled
                      ? "bg-[#28381c] border-[#fbbf24] text-[#fbbf24]"
                      : "bg-[#0b0e0a] border-[#2e3b23] text-[#556947]"
                  }`}
                >
                  {quindarSoundEnabled ? "ACTIVE (2524 Hz)" : "MUTED"}
                </button>
              </div>

              {/* Gemini Key */}
              <div className="space-y-1 pt-1 border-t border-[#232d1a]">
                <label className="text-[11px] text-[#a8baa0] font-mono">Google Gemini API Key (Optional):</label>
                <p className="text-[10px] text-[#788e6a] leading-tight">
                  Enter an API key for dynamic Google Gemini cloud inference. If left empty, Hermes uses the built-in NASA-STD-3001 spaceflight clinical intelligence.
                </p>
                <div className="flex gap-2 pt-0.5">
                  <input
                    type="password"
                    placeholder="AIzaSy..."
                    value={geminiKey}
                    onChange={(e) => setGeminiKey(e.target.value)}
                    className="flex-1 bg-[#0b0e0a] border border-[#2e3b23] text-white px-2.5 py-1.5 rounded-lg text-xs font-mono focus:outline-none focus:border-[#fbbf24]"
                  />
                  <button
                    onClick={handleSaveSettings}
                    className="px-3 py-1.5 bg-[#fbbf24] text-black font-bold rounded-lg cursor-pointer hover:bg-[#f59e0b] text-xs"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* CONTINUOUS HUMAN-IN-THE-LOOP PROGRESSION */}
          <div className="p-3 bg-[#13190e]/70 border-b border-[#232d1a] space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-[#fbbf24]">
                HUMAN-IN-THE-LOOP ({Math.min(activeStepIdx, QUICK_STEPS.length)}/{QUICK_STEPS.length})
              </span>
              {activeStepIdx < QUICK_STEPS.length ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      speakExplicit(QUICK_STEPS[activeStepIdx]);
                    }}
                    className="flex items-center gap-1 text-[11px] text-[#8ea873] hover:text-[#fbbf24] px-2 py-0.5 rounded border border-[#232d1a] cursor-pointer"
                  >
                    <Play className="w-3 h-3" />
                    <span>Speak</span>
                  </button>
                  <button
                    onClick={() => {
                      setLoopRunning(true);
                      setActiveStepIdx((i) => i + 1);
                    }}
                    className="px-2.5 py-1 bg-[#fbbf24] hover:bg-[#f59e0b] text-black font-bold rounded text-xs cursor-pointer transition-colors"
                  >
                    Confirm & Next
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setActiveStepIdx(0);
                    setLoopRunning(false);
                  }}
                  className="flex items-center gap-1 text-[11px] text-[#8ea873] hover:text-white px-2 py-0.5 rounded border border-[#232d1a] cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Restart Loop</span>
                </button>
              )}
            </div>

            <div className="text-xs text-[#c7dfb8] bg-[#1a2313] p-2 rounded-lg border border-[#232d1a]">
              {activeStepIdx < QUICK_STEPS.length ? (
                <span>{QUICK_STEPS[activeStepIdx]}</span>
              ) : (
                <span className="text-[#84a96c] flex items-center gap-1.5 font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  Checklist 100% Complete · Ship & Crew Locked Safe
                </span>
              )}
            </div>
          </div>

          {/* CHAT MESSAGES */}
          <div className="h-72 overflow-y-auto p-4 space-y-3 bg-[#0a0d07] scrollbar-thin">
            {chatHistory.map((m, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"}`}
              >
                <div className="text-[10px] text-[#556947] font-mono mb-1">
                  {m.role === "user" ? "ASTRONAUT" : "HERMES AI"} · {m.timestamp}
                </div>
                <div
                  className={`p-3.5 rounded-xl text-xs max-w-[92%] leading-relaxed whitespace-pre-line ${
                    m.role === "user"
                      ? "bg-[#28381c] text-[#e3ecd8] rounded-br-none border border-[#3f572c]"
                      : "bg-[#13190e] text-[#d7e6ce] rounded-bl-none border border-[#232d1a]"
                  }`}
                >
                  {m.text}

                  {m.role === "hermes" && (
                    <div className="mt-2.5 pt-2 border-t border-[#232d1a]/80 flex items-center justify-between text-[11px] text-[#8ea873]">
                      <button
                        type="button"
                        onClick={() => speakExplicit(m.text)}
                        className="flex items-center gap-1 hover:text-[#fbbf24] cursor-pointer transition-colors"
                        title="Listen to this response aloud"
                      >
                        <Volume2 className="w-3.5 h-3.5 text-[#fbbf24]" />
                        <span>Listen Aloud</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {commandMutation.isPending && (
              <div className="flex items-center gap-2 text-xs text-[#fbbf24] font-mono">
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
                <span>Hermes evaluating aerospace medicine protocols...</span>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* INPUT FORM */}
          <form
            onSubmit={handleSend}
            className="p-3 bg-[#13190e] border-t border-[#232d1a] flex items-center gap-2"
          >
            <button
              type="button"
              onClick={startVoiceRecognition}
              className={`p-2 rounded-xl transition-colors cursor-pointer ${
                isListening
                  ? "bg-red-500/20 text-red-400 border border-red-500 animate-pulse"
                  : "bg-[#182213] text-[#8ea873] hover:text-white border border-[#2e3b23]"
              }`}
              title={isListening ? "Listening... (Click to stop)" : "Click to speak voice command"}
            >
              {isListening ? (
                <MicOff className="w-4 h-4" />
              ) : (
                <Mic className="w-4 h-4" />
              )}
            </button>
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={handsFreeMode ? "Say 'Hey Hermes' or type query..." : "Ask Hermes, or say 'done'..."}
              className="flex-1 bg-[#0b0e0a] border border-[#232d1a] text-white text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#fbbf24]"
            />
            <button
              type="submit"
              disabled={!prompt.trim() || commandMutation.isPending}
              className="p-2 rounded-xl bg-[#fbbf24] hover:bg-[#f59e0b] text-black font-bold disabled:opacity-40 cursor-pointer transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#182213] to-[#24331a] hover:from-[#24331a] hover:to-[#2e4021] text-white border border-[#3f572c] shadow-2xl shadow-black/60 cursor-pointer transition-all hover:scale-105 active:scale-95"
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#fbbf24] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#84a96c]"></span>
          </span>
          <div className="text-left font-mono">
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>Hermes Voice AI</span>
              <Sparkles className="w-3 h-3 text-[#fbbf24]" />
            </div>
            <div className="text-[10px] text-[#8ea873]">
              Full-Duplex Aerospace Audio & Telemetry
            </div>
          </div>
          <div className="px-2 py-1 rounded-lg bg-[#28381c] text-[#fbbf24] text-[11px] font-bold flex items-center gap-1">
            <Mic className="w-3 h-3" />
            <span>Open</span>
          </div>
        </button>
      )}
    </div>
  );
}
