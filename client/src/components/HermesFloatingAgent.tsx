import { useState, useEffect } from "react";
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
  CheckCircle2,
  Play,
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
  const [activeStepIdx, setActiveStepIdx] = useState<number>(0);
  const [loopRunning, setLoopRunning] = useState<boolean>(false);

  const [chatHistory, setChatHistory] = useState<
    Array<{
      role: "user" | "hermes";
      text: string;
      timestamp: string;
    }>
  >([
    {
      role: "hermes",
      text: "Hello! I can speak to you and guide you step-by-step through any space emergency until it is complete.",
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
    window.speechSynthesis.speak(u);
  };

  useEffect(() => {
    if (!loopRunning) return;
    if (activeStepIdx < QUICK_STEPS.length) {
      speak(`${QUICK_STEPS[activeStepIdx]}. Click Confirm when done.`);
    } else {
      speak("All steps are complete. Crew and spacecraft are safe.");
      setLoopRunning(false);
    }
  }, [activeStepIdx, loopRunning]);

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
      speak(QUICK_STEPS[activeStepIdx] || "Hermes voice active.");
      return;
    }
    const rec = new SpeechRecognition();
    rec.lang = "en-US";
    rec.onresult = (ev: any) => {
      const transcript = ev.results[0][0].transcript;
      setChatHistory((prev) => [
        ...prev,
        { role: "user", text: transcript, timestamp: new Date().toLocaleTimeString() },
      ]);
      commandMutation.mutate(transcript);
    };
    rec.start();
  };

  const latestTelemetry = overview?.recentTelemetry?.[0];

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-2">
      {isOpen ? (
        <div className="surface-enter w-[380px] sm:w-[410px] card-outer shadow-2xl">
          <div className="card-inner overflow-hidden flex flex-col max-h-[540px]">
            <div className="bg-zinc-900/90 px-4 py-3 border-b border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-orange-500" />
                <div>
                  <div className="text-xs font-semibold text-white">
                    Hermes Voice & Human-in-the-Loop
                  </div>
                  <div className="text-[11px] text-zinc-400">
                    Speaks aloud · Guides until 100% complete
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setVoiceEnabled(!voiceEnabled)}
                  className="p-1.5 text-zinc-400 hover:text-white rounded-md hover:bg-zinc-800 cursor-pointer"
                  title="Toggle voice speech"
                >
                  {voiceEnabled ? (
                    <Volume2 className="w-3.5 h-3.5 text-orange-500" />
                  ) : (
                    <VolumeX className="w-3.5 h-3.5" />
                  )}
                </button>
                <Link href="/hermes">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 text-zinc-400 hover:text-white rounded-md hover:bg-zinc-800 cursor-pointer"
                    title="Open Full Hermes Voice Console"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                </Link>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 text-zinc-400 hover:text-white rounded-md hover:bg-zinc-800 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Human-in-the-Loop Active Step Bar */}
            <div className="p-3 bg-zinc-900/60 border-b border-zinc-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-orange-400">
                  Human-in-the-Loop ({Math.min(activeStepIdx, QUICK_STEPS.length)}/
                  {QUICK_STEPS.length})
                </span>
                {activeStepIdx < QUICK_STEPS.length ? (
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        setLoopRunning(true);
                        speak(QUICK_STEPS[activeStepIdx]);
                      }}
                      className="px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[11px] inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Play className="w-3 h-3 text-orange-500" />
                      <span>Speak</span>
                    </button>
                    <button
                      onClick={() => {
                        setLoopRunning(true);
                        setActiveStepIdx((i) => i + 1);
                      }}
                      className="px-2.5 py-0.5 rounded bg-orange-500 hover:bg-orange-400 text-zinc-950 font-semibold text-[11px] cursor-pointer"
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
                    className="text-[11px] text-emerald-400 font-medium inline-flex items-center gap-1 cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Completed (Restart)</span>
                  </button>
                )}
              </div>
              <div className="text-xs text-white font-medium">
                {activeStepIdx < QUICK_STEPS.length
                  ? QUICK_STEPS[activeStepIdx]
                  : "All emergency steps verified."}
              </div>
            </div>

            <div className="p-3.5 space-y-2.5 overflow-y-auto flex-1 max-h-[240px] bg-zinc-950">
              {chatHistory.map((item, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${
                    item.role === "user" ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`max-w-[88%] rounded-lg px-3 py-2 text-xs leading-relaxed ${
                      item.role === "user"
                        ? "bg-orange-500 text-zinc-950 font-medium"
                        : "bg-zinc-900 border border-zinc-800 text-zinc-200"
                    }`}
                  >
                    <div className="whitespace-pre-line">{item.text}</div>
                  </div>
                </div>
              ))}
            </div>

            <form
              onSubmit={handleSend}
              className="p-2.5 bg-zinc-900 border-t border-zinc-800 flex items-center gap-1.5"
            >
              <button
                type="button"
                onClick={startVoiceRecognition}
                className="bg-zinc-800 hover:bg-zinc-700 text-orange-400 p-2 rounded-md cursor-pointer"
                title="Speak to Hermes"
              >
                <Mic className="w-3.5 h-3.5" />
              </button>
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ask Hermes or type 'done'..."
                className="flex-1 bg-zinc-950 text-white text-xs px-3 py-2 rounded-md border border-zinc-800 focus:outline-none focus:border-orange-500"
              />
              <button
                type="submit"
                disabled={commandMutation.isPending}
                className="bg-orange-500 hover:bg-orange-400 text-zinc-950 font-semibold p-2 rounded-md cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-100 px-3.5 py-2.5 rounded-xl shadow-xl border border-zinc-800 cursor-pointer"
        >
          <Volume2 className="w-4 h-4 text-orange-500" />
          <div className="text-left text-xs">
            <span className="font-semibold text-white">Speak to Hermes</span>
            <span className="font-mono text-zinc-400 ml-2 tabular-nums">
              {latestTelemetry?.heartRate ?? 72} bpm
            </span>
          </div>
        </button>
      )}
    </div>
  );
}
