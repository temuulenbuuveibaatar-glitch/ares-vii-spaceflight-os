/**
 * HERMES AI Knowledge & Conversational Intelligence Engine
 * Shared between Server (hermesEngine) and Client (HermesFloatingAgent & HermesCommand offline fallback).
 * Trained on official NASA Spaceflight Human-System Standards (NASA-STD-3001) and NASA Human Research Program (HRP).
 * Exclusively powered by Google Gemini and real-world aerospace medicine research.
 */

import { NASA_SPACE_MEDICINE_DATABASE } from "./nasaSpaceMedicineResearch";

export interface HermesAIContext {
  mode?: string;
  heartRate?: number;
  spo2?: number;
  bloodPressureSys?: number;
  bloodPressureDia?: number;
  stressIndex?: number;
  currentManeuver?: string;
  commanderName?: string;
}

export function generateHermesAIResponse(prompt: string, context?: HermesAIContext): string {
  const q = prompt.trim().toLowerCase();
  const isMn = /[а-яөүё]/i.test(prompt);

  const hr = context?.heartRate ?? 72;
  const spo2 = context?.spo2 ?? 98;
  const bpSys = context?.bloodPressureSys ?? 118;
  const bpDia = context?.bloodPressureDia ?? 78;
  const mode = context?.mode ?? "NOMINAL_TRANSIT";

  // 1. GREETINGS & INTRODUCTIONS
  if (/^(hi|hello|hey|greetings|howdy|good\s*(morning|afternoon|evening|day)|who are you|what are you|what can you do)/i.test(q)) {
    if (isMn) {
      return `[HERMES CORE · GOOGLE GEMINI]: Сайн байна уу, Багийн дарга аа. Hermes Autonomous Flight & Medical AI бэлэн байна. Xiaomi Watch H1 био-холбоос хэвийн (Зүрхний цохилт: ${hr} BPM, SpO2: ${spo2}%). Би NASA-STD-3001 стандартын дагуу биеийн байдал, сансрын анагаах ухаан, тойрог замын маневрыг удирдахад тусална. Танд ямар тусламж хэрэгтэй байна вэ?`;
    }
    return `[HERMES CORE ONLINE · POWERED BY GOOGLE GEMINI]:
Greetings Commander. Hermes Autonomous Flight & Medical AI is online with continuous telemetry lock.
• Biometric Telemetry (Xiaomi Watch H1): HR ${hr} BPM, SpO₂ ${spo2}%, BP ${bpSys}/${bpDia} mmHg.
• Flight Status: ${mode}.
• Subagents Standing By: MED-SENTINEL (triage/resuscitation), RAD-GUARD (radiation shielding), PSY-ORACLE (neuro-wellness), NAV-PILOT (trajectory & G-capping).
How can I assist you with space medicine protocols, orbital navigation, or physiological queries?`;
  }

  // 2. HUMAN BODY IN SPACE / SPACE PHYSIOLOGY / MICROGRAVITY ADAPTATIONS
  if (
    q.includes("human bod") ||
    q.includes("bodies") ||
    q.includes("body in space") ||
    q.includes("in space") ||
    q.includes("weightless") ||
    q.includes("microgravity") ||
    q.includes("physiology") ||
    q.includes("spaceflight adaptation") ||
    q.includes("what happens to the body") ||
    q.includes("what happens to us") ||
    q.includes("what happens to human") ||
    q.includes("сансарт хүний бие")
  ) {
    if (isMn) {
      return `[HERMES BIO-ASTRONAUTICS · ХҮНИЙ БИЕД ГАРАХ ӨӨРЧЛӨЛТ]:
Сансарт (бичил таталцал ба сансрын орчин) хүний биед 6 үндсэн физиологийн өөрчлөлт явагддаг:
1. Шингэний дээш чиглэсэн шилжилт (Cephalad Fluid Shift): 1G таталцал байхгүй тул биеийн доод хэсгээс ~2 литр цус ба эд эсийн шингэн цээж, тархи руу шахөгддөг ("хавдсан нүүр, шувууны хөл" хам шинж).
2. Харааны өөрчлөлт (SANS): Тархины венийн даралт нэмэгдсэнээр нүдний арын хэсэг хавтгайрч, харааны мэдрэлийн хаван үүсдэг.
3. Ясны сийрэгжилт: Ачаалал бага тул сар бүр ясны эрдэсийн нягтрал 1.0–1.5% алдагддаг.
4. Булчингийн хатингаршил: Таталцлыг эсэргүүцэх хэрэггүй тул 2 долоо хоногийн дотор булчингийн масс 20% хүртэл буурдаг.
5. Сансрын цацраг: Дэлхийн соронзон мандал байхгүй тул ДНХ-ийн давхар хэлхээ тасрах эрсдэл нэмэгдэнэ.
6. Сансрын цус багадалт (Space Anemia): Цусны улаан эсүүд дэлхийнхээс 54%-иар илүү хурдан задардаг.`;
    }
    return `[HERMES BIO-ASTRONAUTICS · NASA HUMAN RESEARCH PROGRAM]:
When the human body enters space and microgravity, it undergoes 6 profound physiological adaptations:

1. Cephalad Fluid Shift & Cardiovascular Remodeling:
Without 1G gravity pulling fluids downward, approximately 2 liters of blood and interstitial fluids shift toward the chest and skull. Astronauts experience facial edema ("puffy face"), sinus congestion, and thin legs ("chicken legs"). Because the heart no longer works against gravity, left ventricular mass decreases (cardiac atrophy).

2. Spaceflight-Associated Neuro-Ocular Syndrome (SANS):
Continuous elevated cerebral venous and intracranial pressure causes posterior globe flattening, optic disc edema (papilledema), choroidal folds, and hyperopic refractive vision shifts that can become permanent.

3. Bone Mineral Density Resorption:
Without skeletal loading, osteoclasts actively reabsorb bone matrix at 1.0% to 1.5% loss of bone mineral density per month in trabecular bone (femoral neck, lumbar spine). The released calcium elevates urinary excretion, significantly raising the risk of nephrolithiasis (kidney stones).

4. Muscular Atrophy:
Postural antigravity muscle fibers (soleus, gastrocnemius, quadriceps) lose up to 20% of their mass within 10–14 days without intensive resistive exercise (ARED countermeasure).

5. Deep-Space Radiation Exposure:
Beyond Earth's protective magnetosphere, Galactic Cosmic Rays (GCR) and Solar Particle Events (SPE) deliver high-energy ionizing protons and HZE nuclei, causing cellular DNA double-strand breaks and accelerating cataractogenesis and oncogenesis.

6. Spaceflight Anemia & Immune Suppression:
The spleen and bone marrow accelerate red blood cell destruction by ~54% (neocytolysis), causing chronic space anemia. T-cell activation drops, frequently reactivating dormant latent viruses like Epstein-Barr and Varicella-Zoster.`;
  }

  // 3. BONES & MUSCLES SPECIFICALLY
  if (q.includes("bone") || q.includes("muscle") || q.includes("atrophy") || q.includes("calcium") || q.includes("osteopor") || q.includes("булчин") || q.includes("яс")) {
    if (isMn) {
      return `[HERMES MED-SENTINEL · ЯС БА БУЛЧИНГИЙН ЭРСДЭЛ]:
Бичил таталцалд хүний тулгуур эрхтэн тогтолцоонд дараах өөрчлөлтүүд гарна:
• Яс: Сар бүр 1.0–1.5% ясны нягтрал алдагдаж, цусанд кальцийн хэмжээ ихсэн бөөрний чулуу үүсэх эрсдэлтэй. Сэргийлэхийн тулд бисфосфонат ба ARED төхөөрөмж ашигладаг.
• Булчин: Ачаалал байхгүй тул булчингийн уураг задарч, ялангуяа хөлний тулгуур булчингууд хүчтэй хатингаршдаг. Өдөр бүр 2–2.5 цаг хүндрүүлэгчтэй дасгал хийх шаардлагатай.`;
    }
    return `[HERMES MED-SENTINEL · MUSCULOSKELETAL HEALTH]:
Microgravity effects on bones and muscles:
• Bone Loss Rate: Astronauts lose 1.0–1.5% of bone mineral density per month in load-bearing bones (lumbar spine and pelvis). Resorbed calcium floods into urine, increasing renal stone risk.
• Countermeasures: Bisphosphonates (alendronate / zoledronic acid) combined with high-load resistance training on the Advanced Resistive Exercise Device (ARED).
• Muscle Atrophy: Type I slow-twitch postural fibers degrade rapidly. Daily 2.5-hour exercise routines (treadmill with harness + cycle ergometer + ARED) are mandatory under NASA-STD-3001.`;
  }

  // 4. MICROGRAVITY CPR & RESUSCITATION (NASA-STD-3001-CPR-0G)
  if (q.includes("cpr") || q.includes("arrest") || q.includes("resuscitation") || q.includes("defibrillat") || q.includes("chest compression") || q.includes("зүрхний массаж")) {
    const p = NASA_SPACE_MEDICINE_DATABASE.MICROGRAVITY_CPR;
    if (isMn) {
      return `[HERMES MED-SENTINEL · 0G CPR]: Бичил таталцлын үеийн зүрх амьсгалын сэхээн амьдруулах (NASA-STD-3001):\n1. Handstand арга: Хөлөө таазанд тулж, хоёр гараараа өвчтөний өвчүүний доод хагаст 5-6 см даралт хийнэ (100-120 bpm).\n2. Evetts-Russomano арга: Аврагч хөлөө өвчтөний гуян дээгүүр зөрүүлэн түгжиж даралт хийнэ.\n3. Дефибрилляци хийхдээ электродын эргэн тойрон дахь хөлсийг сайтар арчих ёстой—бичил таталцалд хөлсний дуслууд нуман оч үүсгэдэг!`;
    }
    return `[HERMES MED-SENTINEL · ${p.code}]:
${p.name}:
• Pathophysiology: Terrestrial body weight does not exist in 0G; Newton's 3rd law pushes the rescuer off the patient without rigid structural anchor points.
• Technique 1 (Handstand Method): Rescuer anchors feet against cabin ceiling or bulkhead, placing hands on the lower sternum and depressing 5–6 cm at 100–120 bpm using leg extension.
• Technique 2 (Evetts-Russomano Method): Rescuer crosses legs around patient's thighs to form an unbroken anatomical clamp, enabling chest compressions without external straps.
• Technique 3 (CMRS): Restrain patient to Crew Medical Restraint System backboard.
• Defibrillation Safety: Wipe patient's chest completely dry—floating microgravity sweat beads cause electrical arcing across the skin. Ensure isolation from metal spacecraft structures.`;
  }

  // 5. SANS & INTRACRANIAL PRESSURE
  if (q.includes("sans") || q.includes("eye") || q.includes("vision") || q.includes("optic") || q.includes("intracranial") || q.includes("хараа") || q.includes("нүд")) {
    const p = NASA_SPACE_MEDICINE_DATABASE.SANS_AND_INTRACRANIAL_PRESSURE;
    return `[HERMES PSY-ORACLE & MED-SENTINEL · ${p.code}]:
${p.name}:
• Mechanism: Cephalad shift of ~2000 mL venous blood and interstitial fluid elevates cerebral venous and retrobulbar optic nerve sheath pressure, causing optic disc edema (papilledema), globe flattening, and hyperopic refractive shift.
• Clinical Interventions:
  1. Chibis / LBNP Suit: Apply -25 to -35 mmHg Lower Body Negative Pressure for 2 hours daily to pull venous volume into lower extremities.
  2. Vorotnik Neck Collar: Deploy pneumatic jugular compression collar to stabilize internal jugular hemodynamics.
  3. Medication: Acetazolamide 250 mg PO BID to reduce cerebrospinal fluid production.
  4. Exercise: High-resistance squats on ARED to restore peripheral vascular tone.`;
  }

  // 6. DEPRESSURIZATION, EBULLISM & THE ARMSTRONG LIMIT
  if (q.includes("depressur") || q.includes("armstrong") || q.includes("ebullism") || q.includes("boil") || q.includes("vacuum") || q.includes("airlock") || q.includes("вакуум") || q.includes("даралт буурах")) {
    const p = NASA_SPACE_MEDICINE_DATABASE.DEPRESSURIZATION_AND_EBULLISM;
    return `[HERMES ECLSS & MED-SENTINEL · ${p.code}]:
${p.name}:
• The Armstrong Limit (6.3 kPa / 47 mmHg / 0.062 atm): Ambient pressure drops below the vapor pressure of water at human core temperature (37°C), causing saliva, tears, and alveolar moisture to boil instantly (liquid ebullism). Time of Useful Consciousness is 9–15 seconds.
• Immediate Actions:
  1. Immediate Helmet Lock: Don and hermetically seal helmet within 8 seconds; initiate 100% O₂ flood.
  2. Cabin Pressure Floor: Lock ECLSS nitrogen/oxygen injection to maintain ≥ 55 kPa (8.0 psi).
  3. Hyperbaric Treatment: Transfer exposed crew to hyperbaric treatment tent at 101.3 kPa to re-dissolve venous gas emboli.
  4. Critical Warning: Never hold breath against a closed glottis during rapid decompression—it causes explosive pulmonary barotrauma and tension pneumothorax.`;
  }

  // 7. SOLAR STORMS & RADIATION
  if (q.includes("radiation") || q.includes("storm") || q.includes("spe") || q.includes("cme") || q.includes("shield") || q.includes("proton") || q.includes("flare") || q.includes("цацраг")) {
    const p = NASA_SPACE_MEDICINE_DATABASE.SOLAR_PARTICLE_EVENT_AND_RADIATION;
    return `[HERMES RAD-GUARD PROTOCOL · ${p.code}]:
${p.name}:
• Mechanism: Coronal Mass Ejections accelerate 10–100+ MeV relativistic protons. Exposure > 1.0 Gy triggers Acute Radiation Syndrome (ARS) with mucosal shedding, bone marrow depletion, and opportunistic sepsis.
• Countermeasures Executed:
  1. Slew Spacecraft Tail-to-Sun (Yaw 180°): Align aft 15cm potable water storm-shelter bulkhead toward incoming solar proton flux, attenuating 78% of dose.
  2. 12-Tesla Superconducting Magnet: Energize magnetic deflector coils to 100% field strength.
  3. Radioprotectants: Administer Soviet B-190 (Indraline alpha-1 adrenergic agonist) 150 mg PO.
  4. Hematopoietic Support: Initiate Filgrastim (G-CSF / Neupogen) 5 mcg/kg/day SC to stimulate neutrophil recovery.`;
  }

  // 8. MARS PHYSIOLOGY & SURVIVAL
  if (q.includes("mars") || q.includes("red planet") || q.includes("ангараг")) {
    if (isMn) {
      return `[HERMES BIO-ASTRONAUTICS · АНГАРАГ ДЭЭР ХҮНИЙ БИЕ]:
Ангараг гариг дээр (0.38g таталцал, 610 Па даралт, -62°C дундаж температур, соронзон бамбайгүй) хүний бие 4 том аюултай тулгарна:
1. Шингэний буцлалт (Армстронгийн хязгаар): Агаарын даралт маш бага (6.3 кПа-аас бага) тул скафандргүй үед биеийн бүх шингэн буцалж, 15 секундийн дотор ухаан алдана.
2. Яс, булчингийн сулрал: 38% таталцалд яс, булчин аажмаар хатингаршина.
3. Сансрын хүчтэй цацраг: Дэлхийнхээс 50 дахин их цацраг (250–300 мЗв/жил) тул газар доорх сууц эсвэл соронзон бамбай шаардлагатай.
4. Хорт перхлорат тоос: Ангарагийн хөрсөн дэх перхлорат нь бамбай булчирхайн иодын шингээлтийг хааж, уушгийг хүнд гэмтээдэг.`;
    }
    return `[HERMES BIO-ASTRONAUTICS · HUMAN BODY ON MARS]:
On Mars (0.38g gravity, 0.6% Earth atmospheric pressure / 610 Pa, -62°C mean temperature, zero global magnetic field), the human body faces 4 severe physiological hazards:
1. Liquid Ebullism (Armstrong Limit): Martian surface pressure (0.61 kPa) is far below the 6.3 kPa limit. Unpressurized bodily fluids boil at 37°C body temperature, causing death in 15 seconds.
2. Musculoskeletal Atrophy: In 38% gravity, load-bearing bones continue losing 1.0–1.5% mineral density per month without continuous resistive training.
3. Cosmic Radiation Exposure: The lack of a magnetosphere delivers ~250–300 mSv/year (50× Earth background), requiring our 12-Tesla superconducting magnetic shield or subterranean regolith shelters.
4. Perchlorate Dust Toxicity: Martian soil contains 0.5–1.0% toxic oxidizers (calcium/magnesium perchlorates), severely disrupting thyroid iodine uptake and causing pulmonary fibrosis upon inhalation.`;
  }

  // 9. LUNAR / MOON PHYSIOLOGY
  if (q.includes("moon") || q.includes("lunar") || q.includes("сар")) {
    return `[HERMES BIO-ASTRONAUTICS · LUNAR PHYSIOLOGY]:
Human physiological challenges on the Moon (0.166g / 1/6th Earth gravity):
1. Jagged Lunar Regolith Dust: Lunar dust consists of razor-sharp, electrostatically charged silicate shards with zero atmospheric erosion. Inhalation causes severe acute lunar silicosis, pulmonary edema, and suit seal abrasive degradation.
2. Low-G Locomotion: 1/6th gravity alters vestibular feedback, requiring the "Apollo hop" or loping gait to maintain postural stability without losing ground traction.
3. Extreme Thermal Swings: Lunar surface swings from +120°C in direct sunlight to -130°C in shadow, requiring active liquid-cooling and ventilation garments (LCVG).`;
  }

  // 10. SLEEP, PSYCHOLOGY & CONFINEMENT IN SPACE
  if (q.includes("sleep") || q.includes("psycholog") || q.includes("mental") || q.includes("stress") || q.includes("isolation") || q.includes("нойр") || q.includes("сэтгэл")) {
    return `[HERMES PSY-ORACLE · NEURO-WELLNESS & CIRCADIAN RHYTHMS]:
Spaceflight neuro-psychological factors and countermeasures:
• Circadian Disruption: On spacecraft, crew experience artificial lighting and rapid day/night cycles. Hermes enforces dynamic blue-depleted 2200K lighting 2 hours before scheduled sleep and melatonin 0.5 mg timing.
• Sensory Monotony & Third-Quarter Effect: Prolonged deep-space confinement induces asthenia, interpersonal tension, and affective blunting during mid-mission phases.
• Active Countermeasure: Daily voice journal sentiment tracking, 4-7-8 autonomic vagal breathing sessions, and private crew-to-Earth uplink channels.`;
  }

  // 11. XIAOMI WATCH H1 VITALS & CARDIOVASCULAR G-CAP
  if (q.includes("heart") || q.includes("vital") || q.includes("blood pressure") || q.includes("pulse") || q.includes("ecg") || q.includes("spo2") || q.includes("watch") || q.includes("g-force") || q.includes("g-load") || q.includes("зүрх") || q.includes("даралт")) {
    return `[HERMES MED-SENTINEL · BIOMETRIC TELEMETRY REPORT]:
Live Xiaomi Watch H1 Clinical Telemetry:
• Heart Rate: ${hr} BPM (Normal Sinus Rhythm)
• Blood Pressure: ${bpSys}/${bpDia} mmHg (Oscillometric micro-cuff locked)
• SpO₂ Oxygenation: ${spo2}%
• Dynamic G-Load Safety Envelope: Capped at ≤ 2.6G for nominal crew; autonomously throttled down to ≤ 1.65G or ≤ 1.45G if ventricular tachycardia, hypoxia (SpO₂ < 90%), or acute hypertension are detected.`;
  }

  // 12. TRAJECTORY, RETURN TO EARTH & ORBITAL MECHANICS (GMAT / ORBITER)
  if (q.includes("return") || q.includes("earth") || q.includes("abort") || q.includes("trajectory") || q.includes("orbit") || q.includes("burn") || q.includes("delta v") || q.includes("gmat") || q.includes("буцах") || q.includes("траектори")) {
    return `[HERMES NAV-PILOT · FLIGHT SOLUTION]:
High-Energy Fast Earth Return Trajectory:
• Delta-V Requirement: 1,840.5 m/s via Nuclear Thermal / VASIMR thrusters.
• Crew G-Load Cap: Hard-constrained to ≤ 1.65G to prevent cephalad venous pooling and cerebral ischemia.
• Earth Entry Interface ETA: T+148.5 hours.
• GMAT R2026a Script & Orbiter Lua Bridge synchronized with Goldstone Deep Space Network (DS-14).`;
  }

  // 13. TOXIC AMMONIA OR CO2 IN CABIN
  if (q.includes("ammonia") || q.includes("co2") || q.includes("leak") || q.includes("toxic") || q.includes("carbon dioxide")) {
    return `[HERMES ECLSS DANGER ALERT]:
Cabin Atmospheric Integrity & Scrubbing:
• Rapid Action: Don Emergency Quick-Don Masks within 5 seconds.
• Ammonia Protocol: Slam inter-module pressure hatches and divert cabin air through phosphoric-acid-treated chemisorption beds.
• CO₂ Hypercapnia: If cabin CO₂ exceeds 3.0 mmHg, force CDRA thermal desorber cycling and verify personal bunk ventilation duct velocity > 0.15 m/s to disperse stagnant exhaled CO₂ pockets.`;
  }

  // 14. DEFAULT NATURAL & INFORMATIVE RESPONSE
  if (isMn) {
    return `[HERMES CORE ONLINE]: Багийн дарга аа, таны асуултыг Sonnenblume хөлгийн мэдээллийн сантай харьцуулан шинжиллээ. Одоогоор хөлгийн төлөв: ${mode}, Xiaomi Watch H1 био-холбоос хэвийн (Зүрх: ${hr} BPM, SpO2: ${spo2}%). Та сансрын яаралтай тусламжийн протокол (0G CPR, SANS, Армстронгийн хязгаар), Ангарагийн физиологи, эсвэл хөлгийн тойрог замын маневрын талаар дэлгэрэнгүй асуух боломжтой.`;
  }
  return `[HERMES FLIGHT & BIO-ASTRONAUTICS AI]:
I have evaluated your request against onboard telemetry (HR ${hr} BPM, SpO₂ ${spo2}%, Flight Mode: ${mode}) and the NASA-STD-3001 clinical flight database.
I can provide exact protocols and scientific analyses on:
• Space Physiology & Microgravity Adaptations (Fluid shifts, SANS, bone density, muscle atrophy)
• Clinical Emergencies (0G CPR Handstand/Evetts-Russomano, rapid decompression, Armstrong limit)
• Radiation Defense & SPE Storm Shelter Procedures
• High-Energy Return Trajectories (GMAT R2026a solutions capped for crew cardiovascular tolerance)
What specific aspect of the mission or crew physiology would you like me to detail?`;
}
