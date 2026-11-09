import { generateHermesAIResponse } from "@shared/hermesAI";
import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { speakNaturalVoice } from "@/lib/speech";
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
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [activeStepIdx, setActiveStepIdx] = useState<number>(0);
  const [loopRunning, setLoopRunning] = useState<boolean>(false);
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [geminiKey, setGeminiKey] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("hermes_gemini_key") || "";
    }
    return "";
  });
  const [keySavedMessage, setKeySavedMessage] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const [chatHistory, setChatHistory] = useState<
    Array<{
      role: "user" | "hermes";
      text: string;
      timestamp: string;
    }>
  >([
    {
      role: "hermes",
      text: "Hermes Flight AI online. Telemetry lock active. I can speak with you and guide you step-by-step through any medical emergency, trajectory maneuver, or spaceflight physiology question.",
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);

  const speak = (text: string) => {
    if (!voiceEnabled) return;
    speakNaturalVoice(text, {
      onStart: () => setIsSpeaking(true),
      onEnd: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
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
        // Instant resilient fallback for offline, static preview, or network drops
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
      speak(reply);
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
      speak(fallback);
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

  const handleSaveKey = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("hermes_gemini_key", geminiKey.trim());
    }
    if (geminiKey.trim()) {
      apiRequest("POST", "/api/gemini/config", { apiKey: geminiKey.trim() }).catch(() => {});
    }
    setKeySavedMessage(true);
    setTimeout(() => {
      setKeySavedMessage(false);
      setShowKeyInput(false);
    }, 1500);
  };

  const startVoiceRecognition = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      speak(QUICK_STEPS[activeStepIdx] || "Hermes voice input is not supported in this browser, but voice playback is active.");
      return;
    }
    try {
      const rec = new SpeechRecognition();
      rec.lang = "en-US";
      rec.onstart = () => setIsListening(true);
      rec.onend = () => setIsListening(false);
      rec.onerror = () => setIsListening(false);
      rec.onresult = (ev: any) => {
        const transcript = ev.results[0][0].transcript;
        setChatHistory((prev) => [
          ...prev,
          { role: "user", text: transcript, timestamp: new Date().toLocaleTimeString() },
        ]);
        commandMutation.mutate(transcript);
      };
      rec.start();
    } catch {
      setIsListening(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-2 font-sans">
      {isOpen ? (
        <div className="surface-enter w-[380px] sm:w-[420px] rounded-2xl border border-[#354528] bg-[#0e120b] shadow-2xl shadow-black/80 overflow-hidden">
          {/* TOP BAR */}
          <div className="bg-[#13190e] px-4 py-3 border-b border-[#232d1a] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className={`w-2 h-2 rounded-full ${isSpeaking ? "bg-[#fbbf24] animate-ping" : "bg-[#84a96c]"}`} />
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-1.5 font-mono">
                  <span>HERMES VOICE AI</span>
                  {isSpeaking && (
                    <span className="text-[10px] text-[#fbbf24] font-mono px-1 py-0.2 rounded bg-[#28381c]">
                      SPEAKING
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-[#8ea873]">
                  Google Gemini · NASA-STD-3001 Space Medicine
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setShowKeyInput(!showKeyInput)}
                className={`p-1.5 rounded-lg cursor-pointer transition-colors ${geminiKey ? "text-[#fbbf24] hover:bg-[#28381c]" : "text-[#8ea873] hover:text-white hover:bg-[#1a2313]"}`}
                title={geminiKey ? "Gemini Key Configured" : "Add Google Gemini API Key"}
              >
                <Key className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  const nextState = !voiceEnabled;
                  setVoiceEnabled(nextState);
                  if (!nextState && typeof window !== "undefined" && "speechSynthesis" in window) {
                    window.speechSynthesis.cancel();
                    setIsSpeaking(false);
                  }
                }}
                className="p-1.5 text-[#8ea873] hover:text-white rounded-lg hover:bg-[#1a2313] cursor-pointer transition-colors"
                title={voiceEnabled ? "Mute voice narration" : "Enable voice narration"}
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
                  if (typeof window !== "undefined" && "speechSynthesis" in window) {
                    window.speechSynthesis.cancel();
                    setIsSpeaking(false);
                  }
                }}
                className="p-1.5 text-[#8ea873] hover:text-white rounded-lg hover:bg-[#1a2313] cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* OPTIONAL GEMINI API KEY INPUT DRAWER */}
          {showKeyInput && (
            <div className="p-3 bg-[#182213] border-b border-[#2e3b23] space-y-2 text-xs">
              <div className="flex items-center justify-between text-[#fbbf24] font-bold">
                <span>Google Gemini API Key (Optional)</span>
                {keySavedMessage && <span className="text-[#84a96c]">Saved!</span>}
              </div>
              <p className="text-[11px] text-[#a8baa0]">
                Enter a Gemini API key for live LLM responses. If omitted, Hermes uses onboard NASA-STD-3001 clinical intelligence.
              </p>
              <div className="flex gap-2">
                <input
                  type="password"
                  placeholder="AIzaSy..."
                  value={geminiKey}
                  onChange={(e) => setGeminiKey(e.target.value)}
                  className="flex-1 bg-[#0b0e0a] border border-[#2e3b23] text-white px-2.5 py-1.5 rounded-lg text-xs font-mono focus:outline-none focus:border-[#fbbf24]"
                />
                <button
                  onClick={handleSaveKey}
                  className="px-3 py-1.5 bg-[#fbbf24] text-black font-bold rounded-lg cursor-pointer hover:bg-[#f59e0b] text-xs"
                >
                  Save
                </button>
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
                      speak(QUICK_STEPS[activeStepIdx]);
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
          <div className="h-64 overflow-y-auto p-4 space-y-3 bg-[#0a0d07] scrollbar-thin">
            {chatHistory.map((m, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"}`}
              >
                <div className="text-[10px] text-[#556947] font-mono mb-1">
                  {m.role === "user" ? "ASTRONAUT" : "HERMES VOICE"} · {m.timestamp}
                </div>
                <div
                  className={`p-3 rounded-xl text-xs max-w-[90%] leading-relaxed whitespace-pre-line ${
                    m.role === "user"
                      ? "bg-[#28381c] text-[#e3ecd8] rounded-br-none border border-[#3f572c]"
                      : "bg-[#13190e] text-[#c7dfb8] rounded-bl-none border border-[#232d1a]"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {commandMutation.isPending && (
              <div className="flex items-center gap-2 text-xs text-[#fbbf24] font-mono">
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
                <span>Hermes evaluating space medicine protocols...</span>
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
              title={isListening ? "Listening..." : "Click to speak voice input"}
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
              placeholder="Ask Hermes, say 'done', or speak..."
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
              <span>Speak With Hermes AI</span>
              <Sparkles className="w-3 h-3 text-[#fbbf24]" />
            </div>
            <div className="text-[10px] text-[#8ea873]">
              Say "Done" to advance checklist, or ask medical help
            </div>
          </div>
          <div className="px-2 py-1 rounded-lg bg-[#28381c] text-[#fbbf24] text-[11px] font-bold flex items-center gap-1">
            <Mic className="w-3 h-3" />
            <span>Speak</span>
          </div>
        </button>
      )}
    </div>
  );
}
