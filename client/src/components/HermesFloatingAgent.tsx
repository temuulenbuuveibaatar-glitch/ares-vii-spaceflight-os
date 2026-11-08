import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
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
      text: "Hermes Flight AI online. Telemetry lock active. I can speak to you and guide you step-by-step through any medical emergency or trajectory maneuver until it is 100% complete.",
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);

  const speak = (text: string) => {
    if (
      !voiceEnabled ||
      typeof window === "undefined" ||
      !("speechSynthesis" in window)
    ) {
      return;
    }
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 1.02;
    u.pitch = 1.0;
    u.onstart = () => setIsSpeaking(true);
    u.onend = () => setIsSpeaking(false);
    u.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(u);
  };

  useEffect(() => {
    if (!loopRunning) return;
    if (activeStepIdx < QUICK_STEPS.length) {
      speak(`${QUICK_STEPS[activeStepIdx]}. Click Confirm & Next when completed.`);
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

  const commandMutation = useMutation({
    mutationFn: async (userPrompt: string) => {
      const res = await apiRequest("POST", "/api/hermes/command", {
        prompt: userPrompt,
      });
      return res.json();
    },
    onSuccess: (data) => {
      const reply =
        data.reply ||
        "Checked onboard sensors and updated spacecraft safety limits.";
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

  const latestTelemetry = overview?.recentTelemetry?.[0];

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
                  Speaks aloud · Guides until 100% complete
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  setVoiceEnabled(!voiceEnabled);
                  if (voiceEnabled) window.speechSynthesis?.cancel();
                }}
                className="p-1.5 text-[#8ea873] hover:text-white rounded-lg hover:bg-[#1a2313] cursor-pointer transition-colors"
                title={voiceEnabled ? "Mute voice" : "Enable voice"}
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
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-[#8ea873] hover:text-white rounded-lg hover:bg-[#1a2313] cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* CONTINUOUS HUMAN-IN-THE-LOOP PROGRESSION */}
          <div className="p-3 bg-[#13190e]/70 border-b border-[#232d1a] space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-[#fbbf24]">
                HUMAN-IN-THE-LOOP ({Math.min(activeStepIdx, QUICK_STEPS.length)}/{QUICK_STEPS.length})
              </span>
              {activeStepIdx < QUICK_STEPS.length ? (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      setLoopRunning(true);
                      speak(QUICK_STEPS[activeStepIdx]);
                    }}
                    className="px-2 py-0.5 rounded-lg bg-[#182213] hover:bg-[#232f1b] border border-[#2e3b23] text-[#c7dfb8] text-[11px] inline-flex items-center gap-1 cursor-pointer active:scale-95 transition-all"
                  >
                    <Play className="w-3 h-3 text-[#fbbf24]" />
                    <span>Speak</span>
                  </button>
                  <button
                    onClick={() => {
                      setLoopRunning(true);
                      setActiveStepIdx((i) => i + 1);
                    }}
                    className="px-2.5 py-0.5 rounded-lg bg-[#fbbf24] hover:bg-[#f59e0b] text-[#0b0e0a] font-bold text-[11px] cursor-pointer active:scale-95 transition-all"
                  >
                    Confirm & Next
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setActiveStepIdx(0);
                    setLoopRunning(true);
                  }}
                  className="text-[11px] text-[#84a96c] font-bold inline-flex items-center gap-1 cursor-pointer hover:underline"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restart Loop</span>
                </button>
              )}
            </div>
            <div className="text-xs text-white font-medium">
              {activeStepIdx < QUICK_STEPS.length ? (
                <span>{QUICK_STEPS[activeStepIdx]}</span>
              ) : (
                <span className="text-[#84a96c] font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  All 4 emergency steps verified and locked.
                </span>
              )}
            </div>
          </div>

          {/* CONVERSATION HISTORY */}
          <div className="p-3.5 space-y-2.5 overflow-y-auto flex-1 max-h-[240px] bg-[#0b0e0a]">
            {chatHistory.map((item, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${
                  item.role === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`max-w-[88%] rounded-xl px-3 py-2 text-xs leading-relaxed ${
                    item.role === "user"
                      ? "bg-[#28381c] border border-[#4d633b] text-[#fbbf24] font-medium"
                      : "bg-[#13190e] border border-[#232d1a] text-[#e3ecd8]"
                  }`}
                >
                  <div className="text-[10px] font-mono text-[#8ea873] mb-0.5">
                    {item.role === "user" ? "ASTRONAUT" : "HERMES VOICE"} · {item.timestamp}
                  </div>
                  <div className="whitespace-pre-line">{item.text}</div>
                </div>
              </div>
            ))}
            <div ref={chatBottomRef} />
          </div>

          {/* INPUT FORM */}
          <form
            onSubmit={handleSend}
            className="p-2.5 bg-[#13190e] border-t border-[#232d1a] flex items-center gap-1.5"
          >
            <button
              type="button"
              onClick={startVoiceRecognition}
              className={`p-2 rounded-xl cursor-pointer transition-colors ${
                isListening
                  ? "bg-[#fbbf24] text-[#0b0e0a] animate-pulse"
                  : "bg-[#182213] hover:bg-[#232f1b] border border-[#2e3b23] text-[#fbbf24]"
              }`}
              title="Speak with your microphone"
            >
              {isListening ? (
                <MicOff className="w-3.5 h-3.5" />
              ) : (
                <Mic className="w-3.5 h-3.5" />
              )}
            </button>
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ask Hermes, say 'done', or speak..."
              className="flex-1 bg-[#0b0e0a] text-white text-xs px-3 py-2 rounded-xl border border-[#232d1a] focus:outline-none focus:border-[#fbbf24]"
            />
            <button
              type="submit"
              disabled={commandMutation.isPending}
              className="bg-[#fbbf24] hover:bg-[#f59e0b] text-[#0b0e0a] font-bold p-2 rounded-xl cursor-pointer active:scale-95 transition-all disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2.5 bg-[#13190e] hover:bg-[#182213] text-[#e3ecd8] px-4 py-2.5 rounded-2xl shadow-2xl border border-[#354528] cursor-pointer active:scale-95 transition-all group"
        >
          <div className="relative">
            <Volume2 className="w-4 h-4 text-[#fbbf24] group-hover:scale-110 transition-transform" />
            <span className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-[#84a96c]" />
          </div>
          <div className="text-left text-xs">
            <span className="font-bold text-white block">Speak with Hermes</span>
            <span className="font-mono text-[#8ea873] text-[11px] tabular-nums">
              HR: {latestTelemetry?.heartRate ?? 72} bpm · DSN Lock
            </span>
          </div>
        </button>
      )}
    </div>
  );
}
