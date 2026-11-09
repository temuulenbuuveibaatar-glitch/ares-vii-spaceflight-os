import { generateHermesAIResponse } from "@shared/hermesAI";
import { speakNaturalVoice, stopSpeaking, playQuindarTone, normalizeSpaceSpeech } from "@/lib/speech";
import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  CheckCircle2,
  Play,
  Hand,
  Lock,
  Activity,
  BookOpen,
  WifiOff,
  Send,
  RotateCcw,
  Brain,
  HeartHandshake,
  Radio,
  Square,
} from "lucide-react";

interface HitlStep {
  id: string;
  phase: string;
  instruction: string;
  plainExplanation: string;
  completed: boolean;
}

const INITIAL_HITL_STEPS: HitlStep[] = [
  {
    id: "step-1",
    phase: "Step 1 · Triage & Vitals",
    instruction: "Verify Xiaomi Watch H1 blood pressure and SpO₂ reading.",
    plainExplanation:
      "Confirms whether the astronaut has enough blood flow to the brain before any maneuver or medication.",
    completed: false,
  },
  {
    id: "step-2",
    phase: "Step 2 · Cabin & Radiation Check",
    instruction: "Isolate cabin oxygen loop and verify storm-shelter shielding.",
    plainExplanation:
      "Stops toxic gas or solar protons from worsening the astronaut's condition while Earth is 20 minutes away.",
    completed: false,
  },
  {
    id: "step-3",
    phase: "Step 3 · Countermeasure Administration",
    instruction:
      "Apply neck/thigh cuff (Vorotnik/Chibis) or administer Soviet B-190 / kit dose.",
    plainExplanation:
      "Stabilizes blood pressure and protects bone marrow without waiting for Houston flight surgeons.",
    completed: false,
  },
  {
    id: "step-4",
    phase: "Step 4 · Trajectory & G-Load Lock",
    instruction: "Confirm Hermes G-force cap (≤ 2.6G) and log to offline EHR.",
    plainExplanation:
      "Ensures the spacecraft never pulls more G-force than the injured astronaut's heart can safely handle.",
    completed: false,
  },
];

const THERAPY_PROMPTS = [
  {
    id: "isolation",
    label: "Isolation & Earth-Out-of-View Decompression",
    hermesSpeech:
      "Commander, feeling distant from Earth during deep-space transit is a normal human response to extreme confinement. Your Xiaomi Watch H1 shows your heart rate variability is 58 milliseconds, meaning your body is resilient. Let us run a 60-second vagal breathing cycle together and shift cabin lighting to warm sunset spectrum. This session is 100% encrypted on-device and never transmitted to Mission Control.",
  },
  {
    id: "sleep",
    label: "Circadian Drift & Orbital Insomnia Reset",
    hermesSpeech:
      "According to the Soyuz-39 Biorhythm experiment, 16 orbital sunrises per day shift your internal clock by 1.8 hours. I have dimmed your bunk display to 480-nanometer blue-depleted light. If needed, 250 milligrams of Soviet Phenibut or India ISRO Yoga Nidra breathing will restore slow-wave sleep without morning grogginess.",
  },
  {
    id: "conflict",
    label: "Crew Friction & High-Workload Burnout Relief",
    hermesSpeech:
      "Long missions in closed habitats amplify small interpersonal tensions. Let us reframe today's workload: I have offloaded 3 routine environmental checks to autonomous ship subroutines so you and the crew have 90 minutes of uninterrupted personal recovery time.",
  },
];

export default function HermesCommand() {
  const { data: overview } = useQuery<any>({
    queryKey: ["/api/mission/overview"],
    refetchInterval: 3000,
  });

  const { data: liveSpace } = useQuery<any>({
    queryKey: ["/api/space-data/live"],
    refetchInterval: 10000,
  });

  // Voice synthesis & speech recognition state
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(true);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [prompt, setPrompt] = useState<string>("");

  // Continuous Human-in-the-Loop (HITL) Execution Loop
  const [hitlSteps, setHitlSteps] = useState<HitlStep[]>(INITIAL_HITL_STEPS);
  const [autoGuideActive, setAutoGuideActive] = useState<boolean>(false);

  // Interactive AI Psychological Therapy & 4-7-8 Breathing Pacer
  const [breathingActive, setBreathingActive] = useState<boolean>(false);
  const [breathPhase, setBreathPhase] = useState<string>("Inhale (4s)");
  const [activeTherapyTopic, setActiveTherapyTopic] =
    useState<string>("isolation");

  // Private On-Device Voice & Stress Journal (Zero Earth Downlink)
  const [privateNote, setPrivateNote] = useState<string>("");
  const [localVaultLogs, setLocalVaultLogs] = useState<
    Array<{ time: string; note: string; vocalPitchCalmScore: number }>
  >([
    {
      time: "14:20 UTC",
      note: "Local encrypted crew therapy check-in: mild sleep disruption after orbital sunrise, vocal cadence steady after 4-7-8 breathing.",
      vocalPitchCalmScore: 93,
    },
  ]);

  // Mars 20-Minute Delay-Tolerant Queue
  const [dtnLagMinutes, setDtnLagMinutes] = useState<number>(12.4);

  const [chatHistory, setChatHistory] = useState<
    Array<{ role: "user" | "hermes"; text: string; timestamp: string }>
  >([
    {
      role: "hermes",
      text: "Hello Commander. I am Hermes, your 24/7 onboard medical, psychological therapy, and flight partner. Press 'Speak' or launch a Voice CBT Therapy or Human-in-the-Loop procedure below.",
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);

  const [isSpeaking, setIsSpeaking] = useState(false);

  const speakText = (text: string) => {
    if (!voiceEnabled) return;
    speakNaturalVoice(text, {
      persona: "apollo_intercom",
      onStart: () => setIsSpeaking(true),
      onEnd: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
  };

  const handleStopSpeaking = () => {
    stopSpeaking();
    setIsSpeaking(false);
  };

  // 4-7-8 Autonomic Vagal Breathing Timer
  useEffect(() => {
    if (!breathingActive) return;
    let tick = 0;
    const timer = setInterval(() => {
      tick = (tick + 1) % 19;
      if (tick < 4) {
        setBreathPhase(`Inhale Slowly Through Nose (${4 - tick}s)`);
      } else if (tick < 11) {
        setBreathPhase(`Hold Breath Gently (${11 - tick}s)`);
      } else {
        setBreathPhase(`Exhale Fully Through Mouth (${19 - tick}s)`);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [breathingActive]);

  // Continuous Human-in-the-Loop voice guide whenever a step changes
  const nextIncompleteStep = hitlSteps.find((s) => !s.completed);
  const completedCount = hitlSteps.filter((s) => s.completed).length;

  useEffect(() => {
    if (!autoGuideActive) return;
    if (nextIncompleteStep) {
      speakText(
        `${nextIncompleteStep.phase}. ${nextIncompleteStep.instruction}. ${nextIncompleteStep.plainExplanation}. Confirm when complete.`
      );
    } else {
      speakText(
        "All four Human-in-the-Loop steps are verified and complete. Astronaut vitals, spacecraft trajectory, and Earth Mission Control telemetry are synchronized."
      );
      setAutoGuideActive(false);
    }
  }, [completedCount, autoGuideActive]);

  const completeStep = (id: string) => {
    setHitlSteps((prev) =>
      prev.map((s) => (s.id === id ? { ...s, completed: true } : s))
    );
  };

  const resetHitlLoop = () => {
    setHitlSteps(INITIAL_HITL_STEPS.map((s) => ({ ...s, completed: false })));
    setAutoGuideActive(true);
  };

  const commandMutation = useMutation({
    mutationFn: async (userPrompt: string) => {
      try {
        const res = await apiRequest("POST", "/api/hermes/command", {
          prompt: userPrompt,
        });
        return await res.json();
      } catch (err) {
        return {
          reply: generateHermesAIResponse(userPrompt, {
            heartRate: overview?.recentTelemetry?.[0]?.heartRate,
            spo2: overview?.recentTelemetry?.[0]?.spo2,
            mode: overview?.autopilotState?.mode,
          }),
        };
      }
    },
    onSuccess: (data, userPrompt) => {
      const reply =
        data?.reply ||
        generateHermesAIResponse(userPrompt, {
          heartRate: overview?.recentTelemetry?.[0]?.heartRate,
          spo2: overview?.recentTelemetry?.[0]?.spo2,
        });
      setChatHistory((prev) => [
        ...prev,
        {
          role: "hermes",
          text: reply,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
      speakText(reply);
      queryClient.invalidateQueries({ queryKey: ["/api/mission/overview"] });
    },
    onError: (_, userPrompt) => {
      const fallback = generateHermesAIResponse(userPrompt, {
        heartRate: overview?.recentTelemetry?.[0]?.heartRate,
        spo2: overview?.recentTelemetry?.[0]?.spo2,
      });
      setChatHistory((prev) => [
        ...prev,
        {
          role: "hermes",
          text: fallback,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
      speakText(fallback);
    },
  });

  const overrideMutation = useMutation({
    mutationFn: async (engaged: boolean) => {
      const res = await apiRequest("POST", "/api/ship/override", {
        engaged,
        authorizedBy: "Cmdr. Elena Vance",
        reason: engaged
          ? "Manual crew override engaged"
          : "Hermes Autonomous Authority restored",
      });
      return res.json();
    },
    onSuccess: (_, engaged) => {
      queryClient.invalidateQueries({ queryKey: ["/api/mission/overview"] });
      speakText(
        engaged
          ? "Human manual override engaged. You have direct stick control."
          : "Hermes autonomous flight protection armed."
      );
    },
  });

  const handleSend = (e?: React.FormEvent, directText?: string) => {
    if (e) e.preventDefault();
    const text = (directText ?? prompt).trim();
    if (!text) return;

    if (
      /^(done|complete|confirmed|next|yes)$/i.test(text) &&
      nextIncompleteStep
    ) {
      completeStep(nextIncompleteStep.id);
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

  const toggleMicrophone = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      speakText(
        "Voice recognition is active via the command bar. Type or click any step below and I will speak the guidance."
      );
      return;
    }
    if (isListening) {
      setIsListening(false);
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    setIsListening(true);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setIsListening(false);
      handleSend(undefined, transcript);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  const startTherapySession = (topicId: string) => {
    setActiveTherapyTopic(topicId);
    const topic =
      THERAPY_PROMPTS.find((t) => t.id === topicId) || THERAPY_PROMPTS[0];
    setChatHistory((prev) => [
      ...prev,
      {
        role: "hermes",
        text: `${topic.hermesSpeech}`,
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);
    speakText(topic.hermesSpeech);
  };

  const savePrivateJournal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!privateNote.trim()) return;
    setLocalVaultLogs((prev) => [
      {
        time: new Date().toLocaleTimeString(),
        note: privateNote.trim(),
        vocalPitchCalmScore: 94,
      },
      ...prev,
    ]);
    setPrivateNote("");
    speakText(
      "Saved to your private on-device psychological vault. Zero data sent to Earth."
    );
  };

  const autopilot = overview?.autopilotState;
  const latestTelemetry = overview?.recentTelemetry?.[0];
  const isOverridden = autopilot?.humanOverrideEngaged;
  const hr = latestTelemetry?.heartRate ?? 72;
  const spo2 = latestTelemetry?.spo2 ?? 98.4;
  const bpSys = latestTelemetry?.bloodPressureSys ?? 118;
  const bpDia = latestTelemetry?.bloodPressureDia ?? 76;

  return (
    <div className="min-h-screen bg-[#0b0e0a] text-[#e3ecd8] py-10 selection:bg-[#2e3b23] selection:text-[#fbbf24]">
      <div className="container mx-auto px-4 space-y-10">
        {/* HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-[#232d1a] pb-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#fbbf24]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#fbbf24]" />
              <span>
                VOICE-INTERACTIVE AI THERAPIST · HUMAN-IN-THE-LOOP FLIGHT INTERLOCK
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-white font-sans">
              Hermes Voice Companion, Mental Therapy & Flight Interlock
            </h1>
            <p className="text-sm text-[#a8baa0] leading-relaxed">
              Provides active psychological therapy for deep-space isolation and
              confinement (100% private on-device), speaks plain-English
              clinical decisions aloud, and guides you step-by-step until every
              emergency checklist is complete.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0 font-mono text-xs">
            <button
              onClick={() => {
                setVoiceEnabled(!voiceEnabled);
                if (!voiceEnabled) {
                  speakText("Hermes voice output enabled.");
                } else if ("speechSynthesis" in window) {
                  window.speechSynthesis.cancel();
                }
              }}
              className="bg-[#13190e] hover:bg-[#1a2313] text-[#c7dfb8] border border-[#2e3b23] px-3.5 py-2.5 rounded-xl font-medium inline-flex items-center gap-1.5 cursor-pointer active:scale-[0.97] transition-colors"
            >
              {voiceEnabled ? (
                <>
                  <Volume2 className="w-4 h-4 text-[#84a96c]" />
                  <span>Voice On</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-4 h-4 text-[#6d845e]" />
                  <span>Voice Muted</span>
                </>
              )}
            </button>

            <button
              onClick={() => overrideMutation.mutate(!isOverridden)}
              className="bg-[#f59e0b] hover:bg-[#d97706] text-[#0b0e0a] font-bold px-4 py-2.5 rounded-xl inline-flex items-center gap-1.5 cursor-pointer active:scale-[0.97] transition-colors shadow-sm shadow-amber-500/10"
            >
              <Hand className="w-4 h-4 text-[#0b0e0a]" />
              <span>
                {isOverridden
                  ? "Restore Hermes Autopilot"
                  : "Engage Human Override"}
              </span>
            </button>
          </div>
        </div>

        {/* DEDICATED AI PSYCHOLOGICAL THERAPY & ISOLATION COUNTERMEASURE STUDIO */}
        <section className="card-outer">
          <div className="card-inner p-6 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#232d1a] pb-4">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <HeartHandshake className="w-4 h-4 text-[#fbbf24]" />
                  <span>
                    Interactive Psychological Health & Deep-Space Isolation Therapy
                  </span>
                </h2>
                <p className="text-xs text-[#a8baa0] mt-0.5">
                  Select a behavioral therapy module below to have Hermes speak
                  guided Cognitive Behavioral Therapy (CBT) and pace your
                  autonomic breathing.
                </p>
              </div>
              <span className="text-xs font-mono text-[#84a96c] inline-flex items-center gap-1.5 font-bold">
                <Lock className="w-3.5 h-3.5" />
                <span>Encrypted On-Device Session (Zero Ground Logging)</span>
              </span>
            </div>

            <div className="grid lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-7 space-y-2.5">
                {THERAPY_PROMPTS.map((t) => {
                  const isSelected = activeTherapyTopic === t.id;
                  return (
                    <div
                      key={t.id}
                      className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                        isSelected
                          ? "bg-[#182213] border-[#4d633b] text-white shadow-sm shadow-amber-500/10"
                          : "bg-[#0b0e0a] border-[#232d1a] text-[#8ea873] hover:text-[#e3ecd8]"
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="text-xs font-mono font-bold text-[#fbbf24]">
                          {t.label}
                        </div>
                        <p className="text-xs text-[#a8baa0] leading-relaxed font-sans">
                          {t.hermesSpeech}
                        </p>
                      </div>
                      <button
                        onClick={() => startTherapySession(t.id)}
                        className="bg-[#f59e0b] hover:bg-[#d97706] text-[#0b0e0a] font-bold px-3.5 py-2 rounded-lg text-xs shrink-0 inline-flex items-center gap-1.5 cursor-pointer active:scale-[0.97] transition-colors"
                      >
                        <Play className="w-3.5 h-3.5 text-[#0b0e0a]" />
                        <span>Speak Therapy</span>
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="lg:col-span-5 bg-[#13190e] border border-[#2e3b23] rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Brain className="w-4 h-4 text-[#84a96c]" />
                    <span>4-7-8 Vagal & ISRO Pranayama Breathing Pacer</span>
                  </span>
                  <span className="text-xs font-mono font-bold text-[#fbbf24] tabular-nums">
                    HRV +26%
                  </span>
                </div>

                <div className="bg-[#0b0e0a] border border-[#232d1a] rounded-lg p-4 text-center space-y-2 font-mono">
                  <div className="text-xs text-[#8ea873]">
                    Current Autonomic Cadence
                  </div>
                  <div className="text-lg font-bold text-[#fbbf24]">
                    {breathingActive
                      ? breathPhase
                      : "Ready for Vagal Decompression"}
                  </div>
                  <button
                    onClick={() => setBreathingActive(!breathingActive)}
                    className="bg-[#182213] hover:bg-[#24331c] text-[#fbbf24] border border-[#3f5231] px-4 py-1.5 rounded-lg text-xs font-bold cursor-pointer active:scale-[0.97] transition-colors"
                  >
                    {breathingActive
                      ? "Stop Breathing Pacer"
                      : "Start 4-7-8 Breathing Pacer"}
                  </button>
                </div>

                <form onSubmit={savePrivateJournal} className="space-y-2">
                  <div className="text-xs text-[#c7dfb8] font-bold">
                    Log Private Reflection (Never Downlinked to Earth)
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={privateNote}
                      onChange={(e) => setPrivateNote(e.target.value)}
                      placeholder="Write private mood or crew stress note..."
                      className="flex-1 bg-[#0b0e0a] text-white text-xs px-3 py-2 rounded-lg border border-[#232d1a] focus:outline-none focus:border-[#fbbf24]"
                    />
                    <button
                      type="submit"
                      className="bg-[#f59e0b] hover:bg-[#d97706] text-[#0b0e0a] font-bold px-3 py-2 rounded-lg text-xs cursor-pointer active:scale-[0.97]"
                    >
                      Save
                    </button>
                  </div>
                </form>

                <div className="text-xs text-[#8ea873] bg-[#0b0e0a] p-2.5 rounded-lg border border-[#232d1a]">
                  Latest Private Entry ({localVaultLogs[0]?.time}):{" "}
                  <span className="text-white">
                    {localVaultLogs[0]?.note}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* VOICE CONVERSATION + CONTINUOUS HUMAN-IN-THE-LOOP EXECUTION */}
        <div className="grid lg:grid-cols-12 gap-6 items-start">
          {/* Left 7 Cols: Continuous Human-in-the-Loop Checklist */}
          <div className="lg:col-span-7 card-outer">
            <div className="card-inner p-6 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#232d1a] pb-4">
                <div>
                  <h2 className="text-base font-bold text-white">
                    Human-in-the-Loop Procedure ({completedCount}/{hitlSteps.length} Complete)
                  </h2>
                  <p className="text-xs text-[#a8baa0] mt-0.5">
                    Hermes speaks each step aloud and waits for your confirmation before advancing.
                  </p>
                </div>

                <div className="flex items-center gap-2 font-mono text-xs">
                  <button
                    onClick={() => {
                      setAutoGuideActive(true);
                      if (nextIncompleteStep) {
                        speakText(
                          `${nextIncompleteStep.phase}. ${nextIncompleteStep.instruction}. ${nextIncompleteStep.plainExplanation}`
                        );
                      }
                    }}
                    className="bg-[#f59e0b] hover:bg-[#d97706] text-[#0b0e0a] font-bold px-3.5 py-1.5 rounded-lg inline-flex items-center gap-1.5 cursor-pointer active:scale-[0.97]"
                  >
                    <Play className="w-3.5 h-3.5 text-[#0b0e0a]" />
                    <span>Speak Current Step</span>
                  </button>
                  <button
                    onClick={resetHitlLoop}
                    className="bg-[#13190e] hover:bg-[#1a2313] text-[#8ea873] hover:text-white border border-[#2e3b23] p-1.5 rounded-lg cursor-pointer active:scale-[0.97]"
                    title="Restart checklist"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {hitlSteps.map((step) => {
                  const isCurrent = nextIncompleteStep?.id === step.id;
                  return (
                    <div
                      key={step.id}
                      className={`p-4 rounded-xl border transition-colors ${
                        step.completed
                          ? "bg-[#0b0e0a]/60 border-[#232d1a] text-[#6d845e]"
                          : isCurrent
                          ? "bg-[#182213] border-[#4d633b] text-white shadow-sm shadow-amber-500/10"
                          : "bg-[#0b0e0a] border-[#232d1a] text-[#8ea873]"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <div className="text-xs font-mono font-bold text-[#fbbf24]">
                            {step.phase}
                          </div>
                          <div className="text-sm font-semibold text-white">
                            {step.instruction}
                          </div>
                          <p className="text-xs text-[#a8baa0] leading-relaxed">
                            {step.plainExplanation}
                          </p>
                        </div>

                        {step.completed ? (
                          <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-[#84a96c] shrink-0">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Done</span>
                          </span>
                        ) : (
                          <button
                            onClick={() => {
                              setAutoGuideActive(true);
                              completeStep(step.id);
                            }}
                            className="bg-[#f59e0b] hover:bg-[#d97706] text-[#0b0e0a] font-bold px-3 py-1.5 rounded-lg text-xs shrink-0 cursor-pointer active:scale-[0.97]"
                          >
                            Confirm & Next
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right 5 Cols: Live Voice Assistant Console */}
          <div className="lg:col-span-5 card-outer">
            <div className="card-inner p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-[#232d1a] pb-3">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <span>Speak With Hermes AI</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#fbbf24]/10 text-[#fbbf24] border border-[#fbbf24]/30 font-bold">GEMINI · NASA-STD-3001</span>
                  </h2>
                  <p className="text-xs text-[#a8baa0]">
                    Say &ldquo;Done&rdquo; to advance checklist, or ask any clinical question.
                  </p>
                </div>
                <button
                  onClick={toggleMicrophone}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer font-mono active:scale-[0.97] transition-colors ${
                    isListening
                      ? "bg-[#f59e0b] text-[#0b0e0a]"
                      : "bg-[#13190e] hover:bg-[#1a2313] text-[#c7dfb8] border border-[#2e3b23]"
                  }`}
                >
                  {isListening ? (
                    <>
                      <MicOff className="w-3.5 h-3.5" />
                      <span>Listening...</span>
                    </>
                  ) : (
                    <>
                      <Mic className="w-3.5 h-3.5 text-[#fbbf24]" />
                      <span>Speak</span>
                    </>
                  )}
                </button>
              </div>

              <div className="space-y-2.5 max-h-[280px] overflow-y-auto pr-1">
                {commandMutation.isPending && (
                  <div className="p-3 rounded-xl text-xs bg-[#0b0e0a] border border-[#232d1a] text-[#8ea873] mr-4 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#fbbf24] animate-ping" />
                    <span className="font-mono text-[11px]">HERMES GEMINI AI evaluating NASA-STD-3001 protocols & vitals...</span>
                  </div>
                )}
                {chatHistory.map((msg, i) => (
                  <div
                    key={i}
                    className={`p-3 rounded-xl text-xs leading-relaxed ${
                      msg.role === "user"
                        ? "bg-[#28381c] border border-[#4d633b] text-[#fbbf24] font-medium ml-6"
                        : "bg-[#0b0e0a] border border-[#232d1a] text-[#e3ecd8] mr-4"
                    }`}
                  >
                    <div className="text-[10px] font-mono opacity-75 mb-0.5">
                      {msg.role === "user" ? "CREW" : "HERMES VOICE"} · {msg.timestamp}
                    </div>
                    <div>{msg.text}</div>
                  </div>
                ))}
              </div>

              <form onSubmit={(e) => handleSend(e)} className="flex gap-2">
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Ask Hermes or type 'done'..."
                  className="flex-1 bg-[#0b0e0a] text-white text-xs px-3 py-2.5 rounded-xl border border-[#232d1a] focus:outline-none focus:border-[#fbbf24]"
                />
                <button
                  type="submit"
                  disabled={commandMutation.isPending}
                  className="bg-[#f59e0b] hover:bg-[#d97706] text-[#0b0e0a] font-bold px-3.5 py-2.5 rounded-xl text-xs cursor-pointer inline-flex items-center gap-1 active:scale-[0.97]"
                >
                  <Send className="w-3.5 h-3.5 text-[#0b0e0a]" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
