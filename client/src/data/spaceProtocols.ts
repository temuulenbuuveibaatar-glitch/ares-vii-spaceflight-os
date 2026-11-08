export type SpaceProtocolCategory =
  | "radiation"
  | "life_support"
  | "cardiovascular"
  | "neuro_ocular"
  | "behavioral"
  | "trauma_eva";

export type SpaceProtocolSeverity = "critical" | "high" | "moderate";

export interface SpaceProtocolStep {
  stepNumber: number;
  phase: string;
  action: string;
  clinicalDetail: string;
  timeTarget?: string;
}

export interface WatchBiomarkerTrigger {
  metric: string;
  threshold: string;
  sensorSource: string;
  clinicalMeaning: string;
}

export interface HermesAutomatedAction {
  subsystem: "NAV-PILOT" | "ECLSS" | "MED-BAY" | "COMM-RELAY" | "CREW-ALERT" | "SHIELD-OPS";
  actionCode: string;
  description: string;
  executionLatencyMs: number;
}

export interface SpaceEmergencyProtocol {
  id: string;
  title: string;
  codeName: string;
  category: SpaceProtocolCategory;
  severity: SpaceProtocolSeverity;
  shortDescription: string;
  spaceMechanism: string;
  watchTriggers: WatchBiomarkerTrigger[];
  hermesAutomatedActions: HermesAutomatedAction[];
  stepByStepGuide: SpaceProtocolStep[];
  medicationsRequired: {
    name: string;
    dosage: string;
    route: string;
    kitLocation: string;
  }[];
  equipmentRequired: string[];
  doNotDo: string[];
  nasaReferenceStandard: string;
}

export const spaceProtocolCategories: {
  id: SpaceProtocolCategory | "all";
  label: string;
  description: string;
}[] = [
  {
    id: "all",
    label: "All Space Protocols",
    description: "Complete NASA Deep-Space & Orbital Medical Contingency Matrix",
  },
  {
    id: "cardiovascular",
    label: "0G Cardiovascular & Resuscitation",
    description: "Microgravity CPR, malignant arrhythmias, and cephalad venous thrombosis",
  },
  {
    id: "life_support",
    label: "ECLSS, Depressurization & Fire",
    description: "Cabin pressure loss, toxic atmosphere (NH3/N2H4/CO2), zero-G fire, and thermal loop failure",
  },
  {
    id: "radiation",
    label: "Solar Particle Event & ARS",
    description: "Acute Radiation Syndrome, SPE storm shelter operations, and hematopoietic rescue",
  },
  {
    id: "trauma_eva",
    label: "EVA Suit, DCS & 0G Trauma",
    description: "Decompression sickness, suit water intrusion, hemorrhage, and 0G fracture immobilization",
  },
  {
    id: "neuro_ocular",
    label: "SANS, ICP & Renal Calculus",
    description: "Spaceflight-Associated Neuro-ocular Syndrome, elevated ICP, and hypercalciuric nephrolithiasis",
  },
  {
    id: "behavioral",
    label: "Deep-Space Behavioral & Circadian",
    description: "Acute isolation psychosis, panic crisis, circadian desynchrony, and HRV neuro-regulation",
  },
];

export const spaceEmergencyProtocols: SpaceEmergencyProtocol[] = [
  {
    id: "microgravity-cpr",
    title: "Microgravity Cardiopulmonary Resuscitation (0G CPR)",
    codeName: "NASA-STD-3001-CPR-0G",
    category: "cardiovascular",
    severity: "critical",
    shortDescription:
      "Specialized zero-gravity cardiac arrest resuscitation utilizing the Handstand, Evetts-Russomano, and Crew Medical Restraint System (CMRS) waist-straddling techniques with 0G AED defibrillation.",
    spaceMechanism:
      "In microgravity (0G), standard terrestrial chest compressions fail because Newton's Third Law pushes the rescuer away from the patient's sternum without gravitational body weight. Furthermore, cephalad fluid redistribution reduces total circulating blood volume by 10–15% and induces baroreceptor deconditioning, while free-floating body fluids and lack of convective air currents complicate airway management and defibrillation safety.",
    watchTriggers: [
      {
        metric: "PPG Pulse Wave & ECG Lead I/II",
        threshold: "Asystole, Ventricular Fibrillation (VF), or Pulseless VTach > 6 sec",
        sensorSource: "Xiaomi Watch H1 BioTracker Optical + Dry-Electrode ECG",
        clinicalMeaning: "Loss of organized electromechanical cardiac output requiring immediate 0G ACLS",
      },
      {
        metric: "SpO2 Peripheral Oxygenation",
        threshold: "< 75% with loss of pulsatile plethysmograph waveform",
        sensorSource: "Xiaomi Watch H1 Dual-Wavelength Red/IR Oxymetry",
        clinicalMeaning: "Cessation of peripheral perfusion and rapid tissue hypoxia",
      },
      {
        metric: "Skin Temperature & Tri-Axial Accelerometry",
        threshold: "Zero voluntary micro-acceleration + peripheral skin temp drop > 0.8°C/min",
        sensorSource: "Xiaomi Watch H1 IMU + NTC Thermistor",
        clinicalMeaning: "Unresponsive free-floating crewmember in cardiac arrest",
      },
    ],
    hermesAutomatedActions: [
      {
        subsystem: "CREW-ALERT",
        actionCode: "CODE-BLUE-0G",
        description: "Broadcasts Class-1 Cardiac Arrest klaxon, illuminates strobe path to patient module, and wakes off-duty Crew Medical Officer (CMO).",
        executionLatencyMs: 120,
      },
      {
        subsystem: "MED-BAY",
        actionCode: "CMRS-DEPLOY-AED",
        description: "Unlocks Crew Medical Restraint System (CMRS) smart locker, pre-charges onboard AED, and activates 100 bpm visual/auditory compression metronome.",
        executionLatencyMs: 350,
      },
      {
        subsystem: "ECLSS",
        actionCode: "CABIN-O2-ENRICH",
        description: "Increases localized module ventilation flow to prevent CO2 pooling around the unventilated patient's face while maintaining safe cabin O2 partial pressure.",
        executionLatencyMs: 800,
      },
      {
        subsystem: "COMM-RELAY",
        actionCode: "FLIGHT-SURGEON-TLM",
        description: "Streams continuous Xiaomi Watch H1 telemetry and module video feed to Houston Flight Surgeon Console via high-priority S/Ka-band link.",
        executionLatencyMs: 450,
      },
    ],
    stepByStepGuide: [
      {
        stepNumber: 1,
        phase: "Immediate Unrestrained Phase (0–45 sec): Evetts-Russomano Method",
        action: "Perform immediate chest compressions while free-floating using the Evetts-Russomano (ER) embrace before CMRS strap-down is complete.",
        clinicalDetail:
          "Wrap your left leg over the patient's right shoulder and your right leg around the patient's torso/back, interlocking ankles behind the patient's interscapular spine. This creates a closed biomechanical loop so sternal compression forces (5–6 cm depth at 100–120 bpm) are countered by your lower extremities.",
        timeTarget: "0–45 seconds",
      },
      {
        stepNumber: 2,
        phase: "Primary Restraint & High-Force Phase: Handstand CPR Method",
        action: "Transition to the Handstand CPR technique if cabin diameter permits (distance between opposing bulkheads ~1.8–2.2 m).",
        clinicalDetail:
          "Place the patient's dorsal surface flat against the deck bulkhead. Place your hands on the lower half of the patient's sternum, brace your feet against the overhead ceiling bulkhead, and use lower-extremity knee/hip extension (quadriceps/gluteals) to drive 5–6 cm compressions. Handstand CPR delivers the highest coronary perfusion pressure in 0G with the lowest rescuer fatigue.",
        timeTarget: "45–90 seconds",
      },
      {
        stepNumber: 3,
        phase: "CMRS Restraint & Waist-Straddling Method",
        action: "Secure patient to the electrically isolated Crew Medical Restraint System (CMRS) board and switch to Waist-Straddling CPR if overhead clearance is too wide for Handstand.",
        clinicalDetail:
          "Fasten the patient's chest and pelvis straps on the CMRS. Kneel across the patient's waist and hook your insteps/ankles beneath the CMRS restraint straps to anchor your pelvis against recoil. Maintain compression fraction > 80%.",
        timeTarget: "90–120 seconds",
      },
      {
        stepNumber: 4,
        phase: "Zero-G Defibrillation (AED / Manual Monitor)",
        action: "Apply anterolateral or anteroposterior defibrillator pads and verify electrical isolation on the Kevlar/Nomex CMRS surface.",
        clinicalDetail:
          "Ensure no floating conductive fluid droplets, sweat bridges, or metallic tether clips contact the patient or metallic hull. Announce 'CLEAR MODULE BULKHEADS' and deliver 150–200 J biphasic shock for VF/pVT. Immediately resume 0G compressions for 2 minutes.",
        timeTarget: "Within 2 minutes",
      },
      {
        stepNumber: 5,
        phase: "0G Airway Management & Supraglottic Placement",
        action: "Insert a Supraglottic Airway (i-gel / Laryngeal Mask Airway) rather than attempting unrestrained endotracheal intubation.",
        clinicalDetail:
          "Direct laryngoscopy in microgravity has a high failure rate unless the CMO's head and torso are strapped down. Insert i-gel LMA, connect HEPA viral/fluid filter and quantitative waveform capnography (target EtCO2 > 15–20 mmHg), and ventilate at 10 breaths/min with 100% O2.",
        timeTarget: "2–4 minutes",
      },
      {
        stepNumber: 6,
        phase: "Intraosseous (IO) Access & ACLS Pharmacology",
        action: "Establish proximal humeral or tibial Intraosseous (IO) access using EZ-IO and administer bubble-free Epinephrine and Amiodarone.",
        clinicalDetail:
          "Gravity-drip IV bags do not flow in 0G! All IV/IO bags MUST be enclosed in a 300 mmHg pneumatic pressure infuser cuff and primed through a 0.22-micron air-eliminating filter to prevent paradoxical cerebral gas embolism. Administer Epinephrine 1 mg (10 mL of 1:10,000) IO/IV q3–5min; for refractory VF/pVT give Amiodarone 300 mg bolus.",
        timeTarget: "3–6 minutes",
      },
    ],
    medicationsRequired: [
      {
        name: "Epinephrine 1:10,000 Prefilled Syringe",
        dosage: "1 mg (10 mL) IO/IV every 3–5 minutes followed by 20 mL pressurized NS flush",
        route: "Intraosseous (IO) or Pressurized IV with Air-Eliminating Filter",
        kitLocation: "ISS Crew Medical Restraint Pack A (Red Resuscitation Sub-Pack)",
      },
      {
        name: "Amiodarone Hydrochloride",
        dosage: "300 mg IO/IV first dose for refractory VF/pVT; 150 mg second dose after 5 min",
        route: "IO / Pressurized IV",
        kitLocation: "ISS Crew Medical Restraint Pack A (Red Resuscitation Sub-Pack)",
      },
      {
        name: "Atropine Sulfate",
        dosage: "1 mg IO/IV every 3–5 minutes (max 3 mg) for symptomatic bradycardia / PEA arrest",
        route: "IO / Pressurized IV",
        kitLocation: "ISS Crew Medical Restraint Pack A (Red Resuscitation Sub-Pack)",
      },
    ],
    equipmentRequired: [
      "Crew Medical Restraint System (CMRS) electrically insulated board",
      "Spaceflight Biphasic Automated External Defibrillator (AED)",
      "i-gel Supraglottic Airway + Quantitative Waveform Capnograph",
      "EZ-IO Proximal Humeral/Tibial Intraosseous Drill",
      "300 mmHg Pneumatic IV Pressure Cuff + 0.22-micron Air-Eliminating Filter",
    ],
    doNotDo: [
      "DO NOT attempt standard unanchored terrestrial chest compressions—you will push yourself across the cabin and generate <15 mmHg coronary perfusion pressure.",
      "DO NOT hang an IV bag without a 300 mmHg pneumatic pressure sleeve and air-eliminating filter—liquids do not drip by gravity and dissolved microbubbles do not float to the top of syringes in 0G.",
      "DO NOT deliver a defibrillation shock if the patient's extremities or wet clothing touch bare metallic spacecraft bulkheads.",
    ],
    nasaReferenceStandard: "NASA-STD-3001 Vol. 1 & ISS Integrated Medical Group (IMG) ACLS Checklist",
  },
  {
    id: "cabin-depressurization",
    title: "Rapid Cabin Depressurization & Ebullism / Barotrauma",
    codeName: "ECLSS-DEPRESS-EBULLISM-01",
    category: "life_support",
    severity: "critical",
    shortDescription:
      "Emergency response to micrometeoroid/orbital debris (MMOD) hull breach, rapid loss of cabin atmospheric pressure, pulmonary barotrauma, arterial gas embolism (AGE), and tissue ebullism.",
    spaceMechanism:
      "When ambient cabin pressure drops below theArmstrong Line (6.3 kPa / 47 mmHg, where the boiling point of water equals human core body temperature of 37°C), saliva, tears, alveolar lining fluid, and subcutaneous interstitial water spontaneously vaporize (ebullism). Simultaneously, according to Boyle's Law ($P_1V_1 = P_2V_2$), trapped intrapulmonary gas expands 3–5x within seconds, rupturing alveoli and forcing nitrogen/oxygen bubbles directly into the pulmonary veins and cerebral arteries (Arterial Gas Embolism). Time of Useful Consciousness (TUC) in near-vacuum is strictly 9 to 15 seconds.",
    watchTriggers: [
      {
        metric: "Barometric Altimeter / Ambient Cabin Pressure Sensor",
        threshold: "dP/dt > -1.5 kPa/sec or total cabin pressure < 70 kPa (10.1 psi)",
        sensorSource: "Xiaomi Watch H1 MEMS Barometer + Spacecraft ECLSS Bus",
        clinicalMeaning: "Active hull breach or seal failure; imminent hypoxic loss of consciousness",
      },
      {
        metric: "SpO2 & Heart Rate",
        threshold: "SpO2 drop > 12% in < 20 sec with reflex tachycardia > 135 bpm",
        sensorSource: "Xiaomi Watch H1 Optical Oxymetry",
        clinicalMeaning: "Acute alveolar de-oxygenation (reverse diffusion of O2 from blood into vacuum)",
      },
    ],
    hermesAutomatedActions: [
      {
        subsystem: "ECLSS",
        actionCode: "N2-O2-BLOWDOWN-FEED",
        description: "Triggers high-pressure N2/O2 reserve tank emergency blowdown to maintain affected module above 48 kPa for minimum 120 seconds of crew egress time.",
        executionLatencyMs: 65,
      },
      {
        subsystem: "NAV-PILOT",
        actionCode: "HATCH-ULTRASONIC-TRIANGULATE",
        description: "Localizes hull leak acoustic signature (40 kHz ultrasonic array) and automatically seals inter-module bulkhead hatches once crew transits clear.",
        executionLatencyMs: 210,
      },
      {
        subsystem: "MED-BAY",
        actionCode: "HYPERBARIC-AIRLOCK-PREP",
        description: "Pre-pressurizes Crew Airlock / Treatment Suit Adapter to 2.8 ATA equivalent for immediate recompression therapy.",
        executionLatencyMs: 500,
      },
    ],
    stepByStepGuide: [
      {
        stepNumber: 1,
        phase: "Exhale Immediately & Don Positive-Pressure 100% O2 Mask (0–10 sec)",
        action: "EXHALE audibly while reaching for the nearest Portable Breathing Apparatus (PBA) or Launch/Entry Pressure Suit helmet.",
        clinicalDetail:
          "NEVER hold your breath during rapid decompression! Holding a full breath across a >20 kPa pressure drop causes catastrophic pulmonary over-inflation syndrome, tension pneumothorax, and lethal cerebral Arterial Gas Embolism (AGE). Don positive-pressure 100% O2 mask before Time of Useful Consciousness (9–15 sec) expires.",
        timeTarget: "0–10 seconds",
      },
      {
        stepNumber: 2,
        phase: "Emergency Egress & Bulkhead Isolation (10–60 sec)",
        action: "Retrieve any incapacitated crewmember, translate into the designated safe-haven module (or Orion/Soyuz/Dragon return vehicle), and seal the equalization hatch.",
        clinicalDetail:
          "Verify umbilical hose clearance on hatch seals before dogging the hatch closed. Confirm safe-haven pressure stabilization at 101.3 kPa (14.7 psi) on Hermes ECLSS display.",
        timeTarget: "10–60 seconds",
      },
      {
        stepNumber: 3,
        phase: "Primary Survey for Pulmonary Barotrauma & Tension Pneumothorax",
        action: "Perform rapid thoracic ultrasound (E-FAST) because auscultation with a stethoscope is degraded by high cabin fan noise.",
        clinicalDetail:
          "Use the Butterfly/Vivid-q ultrasound probe at the 2nd–4th intercostal spaces mid-clavicular line. Absence of pleural 'lung sliding' + 'barcode/stratosphere sign' on M-mode confirms pneumothorax. If tension physiology is present (tracheal deviation, distended neck veins, shock), perform immediate needle thoracostomy at the 2nd ICS MCL or 5th ICS anterior axillary line using a 14G 8-cm angiocath connected to a Heimlich one-way flutter valve.",
        timeTarget: "2–5 minutes",
      },
      {
        stepNumber: 4,
        phase: "Treatment of Ebullism & Subcutaneous Vapor Swelling",
        action: "Recompress the patient immediately to 101.3 kPa+ and administer 100% normobaric/hyperbaric oxygen.",
        clinicalDetail:
          "Subcutaneous water vapor pockets (ebullism) rapidly re-condense into liquid phase upon restoration of atmospheric pressure above 6.3 kPa, leaving severe tissue edema, petechial hemorrhage, and flash-freezing injuries on wet mucosal surfaces. Warm ocular and oral mucosa gently and administer IV crystalloids for third-space fluid loss.",
        timeTarget: "5–15 minutes",
      },
      {
        stepNumber: 5,
        phase: "Hyperbaric Recompression for Arterial Gas Embolism (AGE)",
        action: "Place any crewmember with focal neurologic deficits, confusion, or visual loss into the Airlock Hyperbaric Chamber or EVA Suit with Bends Treatment Adapter (BTA).",
        clinicalDetail:
          "Execute US Navy Treatment Table 6 (or NASA Spaceflight Hyperbaric Protocol at 2.8 ATA / 18 msw equivalent on 100% O2 cycles) to crush intravascular gas emboli and oxygenate ischemic penumbra.",
        timeTarget: "Within 15 minutes",
      },
    ],
    medicationsRequired: [
      {
        name: "100% Aviator Medical Oxygen",
        dosage: "15 L/min demand-valve or positive-pressure mask continuously; transition to 2.8 ATA hyperbaric O2",
        route: "Inhalation (Sealed Mask / Pressure Suit)",
        kitLocation: "Wall-Mounted Emergency PBA Station & Airlock Rack",
      },
      {
        name: "Ketorolac Tromethamine (Toradol)",
        dosage: "30 mg IV/IM every 6 hours for severe barotrauma/pleuritic pain",
        route: "IM or Pressurized IV",
        kitLocation: "ISS Crew Medical Restraint Pack A",
      },
      {
        name: "Lidocaine 1% + Epinephrine (for Chest Tube / Thoracostomy)",
        dosage: "5–10 mL local infiltration at 5th intercostal space",
        route: "Subcutaneous / Intercostal Infiltration",
        kitLocation: "Trauma & Minor Surgery Sub-Pack",
      },
    ],
    equipmentRequired: [
      "Portable Breathing Apparatus (PBA) / Quick-Don O2 Mask",
      "Point-of-Care Thoracic Ultrasound (M-mode pleural sliding check)",
      "14-Gauge 8 cm Needle Decompression Catheter + Heimlich Flutter Valve",
      "Airlock Hyperbaric System or EVA Suit with Bends Treatment Adapter (BTA)",
    ],
    doNotDo: [
      "DO NOT hold your breath during rapid cabin depressurization—always exhale continuously to prevent fatal alveolar rupture.",
      "DO NOT rely on a conventional acoustic stethoscope in a noisy depressurizing spacecraft—use thoracic ultrasound to detect pneumothorax.",
      "DO NOT delay hyperbaric recompression if focal neurological signs of Arterial Gas Embolism (AGE) are present.",
    ],
    nasaReferenceStandard: "NASA-STD-3001 Vol. 2 Rev C — Decompression & Barotrauma Contingency",
  },
  {
    id: "acute-radiation-spe",
    title: "Solar Particle Event (SPE) & Acute Radiation Syndrome (ARS)",
    codeName: "RAD-SPE-STORM-SHELTER",
    category: "radiation",
    severity: "critical",
    shortDescription:
      "Emergency radiation protection during an X-class Solar Flare / Coronal Mass Ejection (SPE), spacecraft attitude tail-to-Sun alignment, HDPE/water-wall Storm Shelter retreat, and prodromal/hematopoietic ARS medical countermeasures.",
    spaceMechanism:
      "Outside Earth's magnetosphere (Artemis lunar orbit, cislunar space, or Mars transit), a major Solar Particle Event (SPE) accelerates high-flux protons ($E > 100\\text{ MeV}$) capable of delivering 1,000 to 5,000 mSv to unshielded crew within hours. Moreover, microgravity synergistically worsens radiation injury by suppressing T-cell activation, impairing DNA double-strand break repair pathways, and accelerating bone marrow hematopoietic stem cell senescence.",
    watchTriggers: [
      {
        metric: "Personal Radiation Dosimeter (PRD) Link + Prodromal Autonomic Index",
        threshold: "Dose rate > 50 mSv/hr OR acute emesis + HRV RMSSD drop > 45% + core temp rise > 38.0°C",
        sensorSource: "Xiaomi Watch H1 Telemetry Bridge + Spacecraft HERA/TEPC Tissue-Equivalent Proportional Counter",
        clinicalMeaning: "Active SPE proton storm exposure or onset of Prodromal Acute Radiation Syndrome (> 0.7–1.0 Gy)",
      },
    ],
    hermesAutomatedActions: [
      {
        subsystem: "NAV-PILOT",
        actionCode: "ATTITUDE-TAIL-TO-SUN",
        description: "Executes autonomous RCS slew to orient the spacecraft's heaviest propulsion engines, propellant tanks, and heatshield directly toward the Solar Particle Event vector (Tail-to-Sun).",
        executionLatencyMs: 420,
      },
      {
        subsystem: "SHIELD-OPS",
        actionCode: "STORM-SHELTER-WATER-FILL",
        description: "Pumps potable and greywater reserves into the inflatable perimeter water-wall bladders around the central Storm Shelter bay, achieving >35 g/cm² hydrogen-rich areal density.",
        executionLatencyMs: 1100,
      },
      {
        subsystem: "MED-BAY",
        actionCode: "ARS-COUNTERMEASURE-DISPENSE",
        description: "Unlocks the Radiation Storm Shelter Med Locker and calculates individualized Filgrastim (G-CSF) and Ondansetron dosing based on real-time organ dose telemetry.",
        executionLatencyMs: 300,
      },
    ],
    stepByStepGuide: [
      {
        stepNumber: 1,
        phase: "Immediate EVA Abort & Retreat to Hydrogen-Rich Storm Shelter (0–5 min)",
        action: "Terminate any EVA immediately and assemble all crew inside the central Polyethylene (HDPE) & Water-Wall Storm Shelter.",
        clinicalDetail:
          "Do NOT shelter against bare aluminum hull walls! High-energy protons and HZE ions striking high-$Z$ metallic hulls generate lethal showers of secondary Bremsstrahlung X-rays and spallation neutrons. Pack stowage bags of water, food rations, and high-density polyethylene (HDPE, $\\text{CH}_2$) blocks tightly around the crew bay to maximize hydrogen proton-stopping power.",
        timeTarget: "Within 5 minutes of SPE alert",
      },
      {
        stepNumber: 2,
        phase: "Verify Spacecraft Tail-to-Sun Attitude & Personal Dosimetry",
        action: "Confirm Hermes NAV-PILOT has locked the service module propulsion mass between the crew shelter and the Sun, and don Astrorad Selective Organ Shielding vests.",
        clinicalDetail:
          "Ensure the Astrorad vest selectively shields bone marrow-rich iliac crests, sternum, vertebrae, thyroid, and gonads, reducing effective stem-cell dose by 35–50%.",
        timeTarget: "5–15 minutes",
      },
      {
        stepNumber: 3,
        phase: "Prophylactic Antiemetic & Cytoprotective Administration",
        action: "Administer Ondansetron 8 mg ODT/IV immediately prior to or at onset of prodromal nausea, plus Amifostine if acute high-dose exposure (>1.5 Gy) is imminent.",
        clinicalDetail:
          "Time-to-vomiting is a primary biological biodosimeter: vomiting within < 1 hour indicates > 4 Gy (severe/lethal ARS); 1–2 hours indicates 2–4 Gy; > 4 hours indicates < 2 Gy. Controlling emesis in 0G is critical to prevent aspiration of floating vomitus inside the cramped storm shelter.",
        timeTarget: "15–30 minutes",
      },
      {
        stepNumber: 4,
        phase: "Biodosimetry via Serial Absolute Lymphocyte Depletion Kinetics",
        action: "Draw capillary blood every 6 hours for 48 hours using the onboard Point-of-Care Hematology Analyzer (Andrews Lymphocyte Depletion Curve).",
        clinicalDetail:
          "Absolute Lymphocyte Count (ALC) drop at 24–48 hours is the gold-standard biological dosimeter in space: ALC > 1,500/µL = normal; 1,000–1,499/µL = mild ARS (1–2 Gy); 500–999/µL = moderate hematopoietic ARS (2–4 Gy); < 500/µL = severe ARS (> 4 Gy).",
        timeTarget: "Every 6 hours x 48 hours",
      },
      {
        stepNumber: 5,
        phase: "Hematopoietic Rescue with Colony-Stimulating Factors (G-CSF)",
        action: "Initiate Filgrastim (Neupogen) or Pegfilgrastim subcutaneously within 24 hours for any crewmember with estimated bone marrow dose >= 1.5–2.0 Gy or ALC < 1,000/µL.",
        clinicalDetail:
          "Administer Filgrastim 10 mcg/kg/day SC (or Pegfilgrastim 6 mg SC x1, repeated day 7) to stimulate surviving bone marrow myeloid progenitors and shorten the neutropenic nadir. Add prophylactic Levofloxacin 500 mg PO daily if Absolute Neutrophil Count (ANC) falls below 500/µL.",
        timeTarget: "Within 24 hours post-exposure",
      },
    ],
    medicationsRequired: [
      {
        name: "Ondansetron (Zofran) Orally Disintegrating Tablet",
        dosage: "8 mg ODT/IV every 8 hours (up to 16 mg single dose for acute radiation emesis)",
        route: "Sublingual ODT or Pressurized IV",
        kitLocation: "Radiation Storm Shelter Med Locker",
      },
      {
        name: "Filgrastim (Neupogen / G-CSF)",
        dosage: "10 mcg/kg Subcutaneous once daily until ANC > 1,000/µL for 3 consecutive days",
        route: "Subcutaneous Injection",
        kitLocation: "Radiation Storm Shelter Cold-Chain Bio-Locker",
      },
      {
        name: "Potassium Iodide (KI) / Prussian Blue (if RTG/Fission Reactor breach)",
        dosage: "KI 130 mg PO daily (I-131 blockade); Prussian Blue 3 g PO TID (Cs-137 decorporation)",
        route: "Oral",
        kitLocation: "Radiation Storm Shelter Med Locker",
      },
      {
        name: "Levofloxacin",
        dosage: "500 mg PO/IV once daily for febrile neutropenia prophylaxis (ANC < 500/µL)",
        route: "Oral or IV",
        kitLocation: "ISS Crew Medical Restraint Pack B",
      },
    ],
    equipmentRequired: [
      "Polyethylene (HDPE) & Water-Wall Storm Shelter (Areal density > 35 g/cm²)",
      "Astrorad Selective Bone-Marrow Shielding Vest",
      "Tissue-Equivalent Proportional Counter (TEPC) & Crew Personal Dosimeters",
      "Point-of-Care Hematology Analyzer (for serial Absolute Lymphocyte Count)",
    ],
    doNotDo: [
      "DO NOT shelter directly against bare aluminum or titanium pressure hulls during an SPE—secondary neutron spallation and Bremsstrahlung X-rays increase tissue dose.",
      "DO NOT delay G-CSF (Filgrastim) past 24–48 hours if bone marrow dose exceeds 2.0 Gy.",
      "DO NOT perform elective invasive procedures or intramuscular injections during the radiation thrombocytopenia window (Days 10–28 post-SPE).",
    ],
    nasaReferenceStandard: "NASA-STD-3001 Permissible Exposure Limit (600 mSv Career) & Artemis SPE Storm Shelter Protocol",
  },
  {
    id: "eva-decompression-sickness",
    title: "EVA Suit Leak, Helmet Water Intrusion & Decompression Sickness (DCS)",
    codeName: "EVA-DCS-SUIT-CONTINGENCY",
    category: "trauma_eva",
    severity: "critical",
    shortDescription:
      "Management of Type I/II Decompression Sickness ('The Bends') from hypobaric EVA suit transition (101.3 kPa cabin to 29.6 kPa suit), plus emergency response to EVA helmet sublimator water intrusion (Luca Parmitano EVA-23 scenario).",
    spaceMechanism:
      "NASA Extravehicular Mobility Units (EMUs) operate at 29.6 kPa (4.3 psi) pure O2 to maintain glove mobility, requiring a large decompression drop from the 101.3 kPa (14.7 psi) nitrogen-rich cabin. Supersaturated dissolved tissue nitrogen ($P_{N2}$) forms venous and arterial microbubbles in joints (Type I DCS) or spinal cord/lungs ('Chokes' / Type II DCS). Additionally, in microgravity, water leaking from the suit's Liquid Cooling and Ventilation Garment (LCVG) or sublimator does not drip downward—Instead, surface tension causes water to cling to the astronaut's scalp, creep across the eyes, and encapsulate the mouth and nostrils inside the helmet, threatening drowning in space.",
    watchTriggers: [
      {
        metric: "EVA Suit Differential Pressure & Precordial Ultrasonic Bubble Score",
        threshold: "Suit pressure < 27.5 kPa OR Spencer Grade III/IV venous gas emboli + SpO2 < 90%",
        sensorSource: "Xiaomi Watch H1 Biometric Link + Suit Telemetry",
        clinicalMeaning: "Active suit micro-leak or intravascular nitrogen bubble cavitation causing pulmonary/neurologic DCS",
      },
    ],
    hermesAutomatedActions: [
      {
        subsystem: "ECLSS",
        actionCode: "AIRLOCK-FAST-REPRESS",
        description: "Arms Crew Airlock for emergency high-rate repressurization (0.7 kPa/sec) and primes the Bends Treatment Adapter (BTA) loop.",
        executionLatencyMs: 180,
      },
      {
        subsystem: "COMM-RELAY",
        actionCode: "EVA-SAFER-AUTOHOME",
        description: "Uploads optical navigation vectors to the astronaut's Simplified Aid For EVA Rescue (SAFER) jetpack and illuminates airlock hatch strobe.",
        executionLatencyMs: 250,
      },
    ],
    stepByStepGuide: [
      {
        stepNumber: 1,
        phase: "Helmet Water Intrusion Check & Purge Valve Breathing",
        action: "If free water accumulates inside the helmet, immediately abort EVA, orient head gently to prevent surface-tension migration over nostrils, and breathe through the Suit Purge Valve.",
        clinicalDetail:
          "Never drink from the In-Suit Drink Bag if water is accumulating—distinguish sweet/warm drink-bag water from cold, metallic-tasting cooling loop condensate. Open the helmet emergency purge valve slightly to create a directional gas stream that pushes floating water globules away from the nose and mouth while translating to the airlock.",
        timeTarget: "0–2 minutes",
      },
      {
        stepNumber: 2,
        phase: "Immediate EVA Abort & Airlock Repressurization for DCS",
        action: "At first sign of joint pain ('niggles'), cutis marmorata, paresthesias, or substernal burning ('The Chokes'), cease all upper-body exertion and return to the airlock.",
        clinicalDetail:
          "Returning from 29.6 kPa (4.3 psi) suit pressure to 101.3 kPa (14.7 psi) cabin pressure immediately provides a +71.7 kPa (+10.4 psi) recompression gradient—often resolving mild Type I joint pain during airlock repressurization alone.",
        timeTarget: "Within 10–15 minutes",
      },
      {
        stepNumber: 3,
        phase: "Bends Treatment Adapter (BTA) Hyperbaric Suit Over-Pressurization",
        action: "For Type II DCS (neurological deficits, spinal paresthesia, vertigo, or cardiopulmonary 'Chokes'), keep the astronaut inside the pressurized EVA suit and attach the Bends Treatment Adapter (BTA).",
        clinicalDetail:
          "By pressurizing the Crew Airlock to 101.3 kPa while driving the sealed EVA suit to 55.2 kPa (8.0 psi) differential above cabin pressure, the astronaut experiences a total hyperbaric pressure of 156.5 kPa (22.7 psi / ~1.55 ATA) breathing 100% O2. Maintain for 2–6 hours per NASA Table BTA.",
        timeTarget: "15–30 minutes",
      },
      {
        stepNumber: 4,
        phase: "Pressurized IV Hydration & Anti-Platelet Aggregation Therapy",
        action: "Once doffed from suit (or via medical pass-through), infuse 1,000 mL Normal Saline via 300 mmHg pressure cuff and administer Aspirin / Ketorolac.",
        clinicalDetail:
          "Nitrogen microbubbles activate endothelial Hageman factor (Factor XII), platelet aggregation, and capillary leak, causing severe hemoconcentration. Isotonic crystalloid resuscitation restores microvascular perfusion and accelerates inert gas washout.",
        timeTarget: "30–60 minutes",
      },
    ],
    medicationsRequired: [
      {
        name: "100% Medical Oxygen (Hyperbaric BTA / Closed-Circuit Mask)",
        dosage: "100% FiO2 at 1.55–2.8 ATA for 120–360 minutes with 5-minute air breaks every 25 minutes",
        route: "Hyperbaric Suit / Sealed Demand Mask",
        kitLocation: "EVA Airlock Emergency Pouch",
      },
      {
        name: "0.9% Sodium Chloride (Isotonic Crystalloid)",
        dosage: "1,000 mL bolus via 300 mmHg pneumatic pressure bag + 0.22-micron air-eliminating filter",
        route: "Pressurized IV",
        kitLocation: "EVA Airlock Emergency Pouch",
      },
      {
        name: "Ketorolac Tromethamine",
        dosage: "30 mg IV/IM once for residual periarticular inflammatory pain",
        route: "IV/IM",
        kitLocation: "ISS Crew Medical Restraint Pack A",
      },
    ],
    equipmentRequired: [
      "EVA Suit Bends Treatment Adapter (BTA) (+8.0 psi differential regulator)",
      "Crew Airlock Hyperbaric Manifold",
      "Precordial Doppler Ultrasound (for Spencer Venous Gas Emboli grading)",
      "Helmet Emergency Purge Valve & Absorption Pad",
    ],
    doNotDo: [
      "DO NOT exercise or flex affected joints during DCS—muscular shear forces nucleate additional nitrogen microbubbles (tribonucleation).",
      "DO NOT administer Entonox (Nitrous Oxide) for pain—N2O rapidly diffuses into nitrogen bubbles and expands their volume catastrophically.",
      "DO NOT tilt your head rapidly if cooling-loop water enters the EVA helmet—surface tension will sweep the water globe across your eyes and airway.",
    ],
    nasaReferenceStandard: "NASA Johnson Space Center EVA DCS Treatment Protocol & Mishap Investigation Report EVA-23",
  },
  {
    id: "sans-intracranial-pressure",
    title: "Spaceflight-Associated Neuro-ocular Syndrome (SANS) & Elevated ICP",
    codeName: "NEURO-SANS-ICP-0G",
    category: "neuro_ocular",
    severity: "high",
    shortDescription:
      "Diagnosis and countermeasure protocol for Spaceflight-Associated Neuro-ocular Syndrome (SANS): optic disc edema, posterior globe flattening, choroidal folds, cotton-wool spots, hyperopic refractive shift, and elevated intracranial pressure (ICP).",
    spaceMechanism:
      "In microgravity, the loss of hydrostatic gravitational gradients shifts ~2 liters of blood and interstitial fluid from the lower extremities into the head and thorax. Cerebral venous outflow congestion (via the internal jugular veins) and impaired glymphatic/arachnoid granulations CSF drainage elevate Intracranial Pressure (ICP) relative to Intraocular Pressure (IOP). This translaminar pressure gradient pushes the optic nerve head forward, flattens the posterior sclera, shortens axial eye length (causing a +0.50 to +1.75 diopter hyperopic farsighted shift), and induces optic disc edema.",
    watchTriggers: [
      {
        metric: "Nocturnal Pulse Wave Transit Time (PWTT) & Cephalic Plethysmography",
        threshold: "Sustained nocturnal pulse wave velocity rise + morning frontal headache + visual acuity shift",
        sensorSource: "Xiaomi Watch H1 Optical PPG + Crew Visual Acuity Log",
        clinicalMeaning: "Uncompensated cephalad venous congestion and elevated nocturnal translaminar pressure gradient",
      },
    ],
    hermesAutomatedActions: [
      {
        subsystem: "ECLSS",
        actionCode: "CO2-SCRUB-LOW-SETPOINT",
        description: "Lowers cabin CO2 partial pressure setpoint below 2.0 mmHg (0.26 kPa) via CDRA/amine beds to prevent hypercapnic cerebral vasodilation.",
        executionLatencyMs: 550,
      },
      {
        subsystem: "MED-BAY",
        actionCode: "OCULAR-OCT-ULTRASOUND-CALIB",
        description: "Initializes Spectralis OCT (Optical Coherence Tomography) and high-frequency ocular ultrasound probe for Optic Nerve Sheath Diameter (ONSD) measurement.",
        executionLatencyMs: 400,
      },
    ],
    stepByStepGuide: [
      {
        stepNumber: 1,
        phase: "High-Frequency Ocular Ultrasound (ONSD & Globe Flattening)",
        action: "Perform closed-lid B-scan ocular ultrasound using a 10–14 MHz linear array probe to measure Optic Nerve Sheath Diameter (ONSD) 3 mm posterior to the globe.",
        clinicalDetail:
          "Apply sterile coupling gel over the closed eyelid (avoiding corneal pressure). An ONSD > 5.8–6.0 mm (measured 3 mm behind the retina) combined with anterior protrusion of the optic nerve head > 0.8 mm and posterior scleral flattening confirms elevated retrobulbar CSF pressure.",
        timeTarget: "0–15 minutes",
      },
      {
        stepNumber: 2,
        phase: "Optical Coherence Tomography (OCT) & Retinal Fundoscopy",
        action: "Quantify Total Retinal Thickness (TRT) and Retinal Nerve Fiber Layer (RNFL) thickness via onboard OCT.",
        clinicalDetail:
          "Frisén Grade >= 1 optic disc edema, chorioretinal folds, or increase in peripapillary TRT > 50 µm from pre-flight baseline warrants active pharmacological and mechanical intervention.",
        timeTarget: "15–30 minutes",
      },
      {
        stepNumber: 3,
        phase: "Lower Body Negative Pressure (LBNP) & Venous Thigh Cuffs (Braslet-M)",
        action: "Place crewmember in the Chibis Lower Body Negative Pressure (LBNP) suit at -25 to -40 mmHg for 45–60 minutes daily and apply calibrated thigh veno-occlusive cuffs.",
        clinicalDetail:
          "LBNP mechanically draws 500–800 mL of blood back into the pelvic and lower-extremity capacitance vessels, immediately decompressing the internal jugular vein and reducing optic nerve sheath distension.",
        timeTarget: "Daily countermeasure session",
      },
      {
        stepNumber: 4,
        phase: "Carbonic Anhydrase Inhibitor Therapy (Acetazolamide) & B-Vitamin One-Carbon Supplementation",
        action: "Initiate Acetazolamide (Diamox) 250–500 mg PO BID (confirming normal renal function and absence of nephrolithiasis history) plus Methylcobalamin/Folate/B6.",
        clinicalDetail:
          "Acetazolamide inhibits choroid plexus carbonic anhydrase, reducing cerebrospinal fluid (CSF) production by 30–50%. Caution: Acetazolamide alkalinizes urine and decreases urinary citrate, which increases calcium phosphate kidney stone risk in 0G—must co-administer high fluid intake and monitor renal ultrasound. Add L-Methylfolate, Vitamin B12, and Pyridoxine (B6) for crewmembers with MTRR/SHMT1 one-carbon metabolism polymorphisms linked to SANS endothelial dysfunction.",
        timeTarget: "Ongoing therapeutic regimen",
      },
      {
        stepNumber: 5,
        phase: "Adjustable Space Anticipation Glasses & ARED Resistive Load Modification",
        action: "Dial adjustable-focus SuperFocus/Space Anticipation spectacles (+0.50 to +2.00 D) to restore cockpit display visual acuity and avoid Valsalva strain during heavy ARED squats.",
        clinicalDetail:
          "Instruct astronaut to breathe continuously during Advanced Resistive Exercise Device (ARED) deadlifts/squats to avoid transient ICP spikes > 40 mmHg.",
        timeTarget: "Immediate operational adjustment",
      },
    ],
    medicationsRequired: [
      {
        name: "Acetazolamide (Diamox)",
        dosage: "250 mg PO twice daily (titrate up to 500 mg BID only under Flight Surgeon clearance with renal stone monitoring)",
        route: "Oral",
        kitLocation: "ISS Crew Medical Restraint Pack B (Neuro-Ophthalmic Drawer)",
      },
      {
        name: "One-Carbon Homocysteine Countermeasure Complex (L-Methylfolate + B12 + B6 + Riboflavin)",
        dosage: "L-Methylfolate 1 mg + Methylcobalamin 1,000 mcg + Pyridoxine 25 mg + Riboflavin 50 mg PO daily",
        route: "Oral",
        kitLocation: "Daily Crew Nutritional & Countermeasure Locker",
      },
    ],
    equipmentRequired: [
      "10–14 MHz Linear Array Ocular Ultrasound Probe (for ONSD 3 mm behind globe)",
      "Heidelberg Spectralis Optical Coherence Tomography (OCT) & Fundoscope",
      "Chibis Lower Body Negative Pressure (LBNP) Suit & Braslet-M Thigh Cuffs",
      "Adjustable-Diopter Space Anticipation Spectacles (+0.25D to +2.50D)",
    ],
    doNotDo: [
      "DO NOT perform a lumbar puncture in microgravity unless life-threatening meningitis or subarachnoid hemorrhage is suspected and strict CMRS restraint is established.",
      "DO NOT prescribe Acetazolamide without aggressive hydration and renal stone screening, as carbonic anhydrase inhibition precipitates calcium phosphate calculi in 0G.",
      "DO NOT allow cabin CO2 partial pressure to exceed 3.0 mmHg—chronic hypercapnia powerfully dilates cerebral arterioles and worsens SANS.",
    ],
    nasaReferenceStandard: "NASA Spaceflight-Associated Neuro-ocular Syndrome (SANS) Clinical Practice Guideline",
  },
  {
    id: "toxic-atmosphere-ammonia",
    title: "Toxic Cabin Atmosphere (Ammonia NH3, Hydrazine N2H4, or CO2 Hypercapnia)",
    codeName: "ECLSS-TOX-ATMOS-NH3",
    category: "life_support",
    severity: "critical",
    shortDescription:
      "Emergency response to external/internal thermal coolant loop Ammonia (NH3) rupture, EVA suit Hydrazine (N2H4) propellant contamination, or Carbon Dioxide Removal Assembly (CDRA) failure causing acute hypercapnia.",
    spaceMechanism:
      "Spacecraft rely on pressurized anhydrous Ammonia ($\text{NH}_3$) in external radiator heat-exchangers coupled across thin metal interfaces to internal water thermal loops; a micro-crack injects caustic ammonia gas directly into cabin air, causing liquefactive necrosis of corneal and alveolar epithelium within seconds. Furthermore, in microgravity, absence of natural buoyancy convection means exhaled $\text{CO}_2$ forms invisible stagnant pockets around a sleeping or stationary astronaut's head if ventilation fans fail.",
    watchTriggers: [
      {
        metric: "Respiratory Rate, HRV & Environmental Gas Telemetry",
        threshold: "RR > 26 breaths/min + SpO2 < 91% + Cabin NH3 > 25 ppm or pCO2 > 5.0 mmHg",
        sensorSource: "Xiaomi Watch H1 Bio-Impedance Respiration + ECLSS Major Constituent Analyzer (MCA)",
        clinicalMeaning: "Acute chemical inhalational bronchospasm or hypercapnic respiratory acidosis",
      },
    ],
    hermesAutomatedActions: [
      {
        subsystem: "ECLSS",
        actionCode: "LOOP-ISOLATE-TCCS-MAX",
        description: "Closes internal/external heat-exchanger isolation valves immediately, disables inter-module ventilation fans to contain the toxic plume, and switches Trace Contaminant Control Subassembly (TCCS) to emergency purge.",
        executionLatencyMs: 90,
      },
      {
        subsystem: "CREW-ALERT",
        actionCode: "TOXIC-MASK-DON-ALARM",
        description: "Triggers distinct 3-pulse Toxic Atmosphere alarm and illuminates emergency egress path to uncontaminated return spacecraft.",
        executionLatencyMs: 110,
      },
    ],
    stepByStepGuide: [
      {
        stepNumber: 1,
        phase: "Immediate Donning of Full-Face Portable Breathing Apparatus (PBA) (0–15 sec)",
        action: "Don the full-face Positive-Pressure Portable Breathing Apparatus (PBA) or Ammonia Respirator Cartridges within 15 seconds—protecting both eyes and lungs simultaneously.",
        clinicalDetail:
          "Anhydrous ammonia is highly water-soluble and reacts immediately with tear film and upper airway moisture to form caustic ammonium hydroxide ($\text{NH}_4\text{OH}$), causing rapid laryngeal edema and corneal opacification.",
        timeTarget: "0–15 seconds",
      },
      {
        stepNumber: 2,
        phase: "Evacuate Contaminated Module & Execute Ammonia/Hydrazine Decontamination",
        action: "Translate into the safe-haven segment, seal the hatch, and test cabin air using Dräger colorimetric tubes or the Compound Specific Analyzer-Combustion Products (CSA-CP).",
        clinicalDetail:
          "Strip any clothing or EVA gear contaminated with liquid ammonia or hydrazine inside the airlock. For hydrazine ($\text{N}_2\text{H}_4$) exposure, monitor for methemoglobinemia and neurotoxic seizures (treat with high-dose Pyridoxine / Vitamin B6 25 mg/kg IV).",
        timeTarget: "1–5 minutes",
      },
      {
        stepNumber: 3,
        phase: "Zero-G Ocular Chemical Irrigation using Morgan Lens",
        action: "For ammonia ocular exposure, insert a Morgan Therapeutic Lens connected to a pressurized 1,000 mL Normal Saline/Lactated Ringer's bag with a drainage collection pouch.",
        clinicalDetail:
          "Pouring open water over an eye in microgravity creates a floating caustic sphere of ammonium hydroxide that spreads to the uninjured eye and crewmates. Use a sealed Morgan Lens or eye-cup adaptor to irrigate continuously for 30 minutes until conjunctival sac pH reaches 7.0–7.4.",
        timeTarget: "5–35 minutes",
      },
      {
        stepNumber: 4,
        phase: "Management of Inhalational Bronchospasm & Non-Cardiogenic Pulmonary Edema",
        action: "Administer nebulized/MDI Albuterol (Salbutamol) 4–8 puffs via spacer, IV Dexamethasone 10 mg, and humidified 100% O2.",
        clinicalDetail:
          "Inspect the posterior pharynx for stridor or mucosal sloughing. If progressive laryngeal edema develops, secure the airway early—delayed edema makes cricothyrotomy necessary.",
        timeTarget: "10–30 minutes",
      },
      {
        stepNumber: 5,
        phase: "Reversal of CO2 Hypercapnic Narcosis / Stagnant Air Pocket",
        action: "If crewmember is somnolent, confused, or tachypneic from localized CO2 pocket (>10–15 mmHg), activate portable personal fan, administer 100% O2, and deploy LiOH (Lithium Hydroxide) emergency canisters.",
        clinicalDetail:
          "Wait to avoid rapid over-hyperventilation alkalosis which can trigger post-hypercapnic arrhythmias; lower PaCO2 steadily while monitoring ECG on Xiaomi Watch H1.",
        timeTarget: "5–20 minutes",
      },
    ],
    medicationsRequired: [
      {
        name: "Salbutamol (Albuterol) Metered-Dose Inhaler",
        dosage: "4–8 puffs (90 mcg/puff) via valved holding chamber every 20 minutes for acute chemical bronchospasm",
        route: "Inhalation",
        kitLocation: "ISS Crew Medical Restraint Pack A",
      },
      {
        name: "Dexamethasone Sodium Phosphate",
        dosage: "10 mg IV/IM immediately for chemical laryngotracheitis and airway edema",
        route: "IV/IM",
        kitLocation: "ISS Crew Medical Restraint Pack A",
      },
      {
        name: "Tetracaine 0.5% Ophthalmic Drops + 0.9% Normal Saline (Morgan Lens)",
        dosage: "1–2 drops Tetracaine for blepharospasm relief, followed by 1,000–2,000 mL pressurized saline irrigation",
        route: "Topical Ophthalmic",
        kitLocation: "Eye & ENT Sub-Pack",
      },
      {
        name: "Pyridoxine (Vitamin B6) IV (for Hydrazine N2H4 Toxicity)",
        dosage: "25 mg/kg IV (up to 5 g) over 30 minutes for hydrazine-induced GABA depletion / seizures",
        route: "Pressurized IV",
        kitLocation: "EVA Airlock Emergency Pouch",
      },
    ],
    equipmentRequired: [
      "Full-Face Portable Breathing Apparatus (PBA) with O2 Cylinder",
      "Compound Specific Analyzer (CSA-CP) & Ammonia Dräger Tubes",
      "Morgan Ocular Irrigation Lens + Closed Zero-G Effluent Collection Bag",
      "Emergency Lithium Hydroxide (LiOH) CO2 Scrubbing Canisters",
    ],
    doNotDo: [
      "DO NOT irrigate chemical eye injuries with an open squirt bottle in microgravity—floating caustic fluid spheres will contaminate the cabin and other crewmembers' eyes.",
      "DO NOT enter a module with an active Ammonia alarm (> 300 ppm IDLH) without a sealed positive-pressure full-face mask.",
      "DO NOT sleep in a crew berth or temporary module area without verifying active forced-air ventilation—localized CO2 pockets form within 20 minutes in 0G.",
    ],
    nasaReferenceStandard: "ISS Toxic Spill / Ammonia Leak Emergency Book & NASA Spacecraft Maximum Allowable Concentrations (SMAC)",
  },
  {
    id: "zero-g-cardiac-thrombosis",
    title: "Internal Jugular Venous Thrombosis (JVT) & Arrhythmia in Microgravity",
    codeName: "CARDIO-JVT-ARRHYTHMIA-0G",
    category: "cardiovascular",
    severity: "high",
    shortDescription:
      "Management of Spaceflight Venous Thrombosis (occlusive or non-occlusive Internal Jugular Vein thrombus discovered on ISS) and microgravity atrial/ventricular arrhythmias.",
    spaceMechanism:
      "In terrestrial gravity, the Internal Jugular Vein (IJV) collapses when upright due to hydrostatic drainage toward the right atrium. In microgravity, chronic cephalad fluid shift causes persistent IJV engorgement, venous stasis, retrograde/stagnant blood flow, and endothelial stretch—creating Virchow's Triad in the neck veins of healthy astronauts. Simultaneously, spaceflight cardiac remodeling (10–12% left ventricular mass atrophy, autonomic shift, hypokalemia/hypomagnesemia, and cosmic radiation endothelial stress) predisposes crew to Atrial Fibrillation and non-sustained Ventricular Tachycardia.",
    watchTriggers: [
      {
        metric: "Single-Lead ECG Rhythm & R-R Interval Irregularity",
        threshold: "Irregularly irregular rhythm (AFib > 30 sec), QTc > 500 ms, or NSVT (>= 3 consecutive ventricular beats > 120 bpm)",
        sensorSource: "Xiaomi Watch H1 ECG + Continuous Optical PPG Arrhythmia Engine",
        clinicalMeaning: "Spaceflight-associated atrial fibrillation or ventricular ectopy requiring telemetry evaluation",
      },
    ],
    hermesAutomatedActions: [
      {
        subsystem: "MED-BAY",
        actionCode: "VASCULAR-DOPPLER-PROTOCOL",
        description: "Loads the bilateral Internal Jugular Vein (IJV) compression & color Doppler ultrasound guided workflow onto the medical display.",
        executionLatencyMs: 320,
      },
      {
        subsystem: "COMM-RELAY",
        actionCode: "CARDIO-THROMBOSIS-CONSULT",
        description: "Transmits high-resolution DICOM vascular ultrasound clips and 12-lead ECG waveform to NASA Cardiovascular & Thrombosis Specialist Panel.",
        executionLatencyMs: 600,
      },
    ],
    stepByStepGuide: [
      {
        stepNumber: 1,
        phase: "Bilateral Internal Jugular Vein Ultrasound Assessment",
        action: "Perform high-frequency linear vascular ultrasound (L12-5 MHz) of the left and right Internal Jugular, Subclavian, and Brachiocephalic veins.",
        clinicalDetail:
          "Assess for intraluminal echogenic thrombus, spontaneous echo contrast ('rouleaux/smoke'), loss of venous compressibility, and color/pulsed-wave Doppler flow pattern (Grade 1 normal anterograde vs. Grade 3–4 stagnant or retrograde flow). Left IJV is preferentially affected due to anatomical compression of the left brachiocephalic vein.",
        timeTarget: "0–20 minutes",
      },
      {
        stepNumber: 2,
        phase: "Immediate Initiation of Parenteral Anticoagulation (Enoxaparin)",
        action: "For confirmed occlusive or high-risk non-occlusive IJV thrombus, initiate Enoxaparin (Lovenox) 1.0 mg/kg SC every 12 hours (or 1.5 mg/kg SC once daily to conserve syringe inventory).",
        clinicalDetail:
          "When drawing up Enoxaparin in microgravity from multi-dose vials, use a surface-tension fluid-transfer adapter so air bubbles are excluded. Avoid vigorous neck massage or deep ultrasound probe compression over a fresh thrombus to prevent pulmonary embolism.",
        timeTarget: "Within 30 minutes of diagnosis",
      },
      {
        stepNumber: 3,
        phase: "Transition to Oral Direct Factor Xa Inhibitor (Apixaban) for Long-Duration Mission",
        action: "After 5–7 days of parenteral Enoxaparin, transition to oral Apixaban (Eliquis) 5 mg PO twice daily for a minimum of 3 months (or until 4 days prior to atmospheric re-entry/landing).",
        clinicalDetail:
          "CRITICAL RE-ENTRY RULE: Discontinue Apixaban 72–96 hours (and Enoxaparin 24–36 hours) prior to Soyuz/Dragon/Orion atmospheric re-entry and splashdown to prevent catastrophic intracranial or retroperitoneal hemorrhage under +4G to +8G landing impact forces.",
        timeTarget: "Days 5–90 of treatment",
      },
      {
        stepNumber: 4,
        phase: "Chibis LBNP & Venous Flow Restoration Protocol",
        action: "Once stable on anticoagulation for >= 14 days and thrombus organization is confirmed on ultrasound, utilize gentle Lower Body Negative Pressure (-20 mmHg) or Mueller inspiratory resistance maneuvers to restore anterograde IJV drainage.",
        clinicalDetail:
          "Inspiratory resistance breathing reduces intrathoracic pressure, drawing blood from the internal jugular veins into the right atrium.",
        timeTarget: "Post-acute stabilization",
      },
      {
        stepNumber: 5,
        phase: "Management of Hemodynamically Stable vs. Unstable Arrhythmias",
        action: "Acquire a 12-lead ECG and check i-STAT point-of-care electrolytes ($K^+$, $Mg^{2+}$, $Ca^{2+}$). Correct $K^+ > 4.2\\text{ mEq/L}$ and $Mg^{2+} > 2.2\\text{ mg/dL}$; give Amiodarone 150 mg IV over 10 min for sustained VTach or symptomatic AFib.",
        clinicalDetail:
          "If hemodynamically unstable (hypotension, chest pain, altered mental status), secure astronaut to the electrically isolated CMRS board and perform synchronized cardioversion (100–200 J biphasic).",
        timeTarget: "0–15 minutes for arrhythmia",
      },
    ],
    medicationsRequired: [
      {
        name: "Enoxaparin Sodium (Lovenox)",
        dosage: "1.0 mg/kg Subcutaneous every 12 hours (or 1.5 mg/kg SC every 24 hours)",
        route: "Subcutaneous Injection",
        kitLocation: "ISS Crew Medical Restraint Pack B",
      },
      {
        name: "Apixaban (Eliquis)",
        dosage: "10 mg PO BID x 7 days (if no Enoxaparin lead-in), then 5 mg PO BID; HOLD 72–96h before re-entry",
        route: "Oral",
        kitLocation: "Deep-Space Chronic & Cardiovascular Med Locker",
      },
      {
        name: "Amiodarone Hydrochloride",
        dosage: "150 mg IV infused over 10 minutes via pressurized syringe pump, then 1 mg/min x 6 hours",
        route: "Pressurized IV",
        kitLocation: "ISS Crew Medical Restraint Pack A",
      },
    ],
    equipmentRequired: [
      "High-Frequency Linear Vascular Ultrasound Probe (L12-5 MHz)",
      "Xiaomi Watch H1 Continuous ECG + 12-Lead Spacecraft Holter",
      "Abbott i-STAT Point-of-Care Blood Analyzer (CHEM8+ Cartridge)",
      "Andexanet Alfa / Protamine Sulfate Reversal Kit (for trauma/landing contingency)",
    ],
    doNotDo: [
      "DO NOT apply aggressive manual compression over the neck when a fresh Internal Jugular Vein thrombus is visualized—risk of dislodging a fatal pulmonary embolus.",
      "DO NOT continue oral anticoagulants (Apixaban) through high-G atmospheric re-entry and landing without stopping 72–96 hours prior (or administering reversal agent).",
      "DO NOT place an internal jugular central venous catheter on the side of stagnant or thrombosed venous flow.",
    ],
    nasaReferenceStandard: "NEJM ISS Venous Thrombosis Case Protocol (Auñón-Chancellor et al.) & NASA Space Cardiology Standard",
  },
  {
    id: "space-renal-stone",
    title: "Microgravity Nephrolithiasis (Acute Renal Stone Crisis) & Bone Loss",
    codeName: "RENAL-CALC-BONE-0G",
    category: "neuro_ocular",
    severity: "high",
    shortDescription:
      "Emergency management of acute obstructing ureterolithiasis (kidney stone colic), urosepsis prevention, and osteoclast bone resorption countermeasures in microgravity.",
    spaceMechanism:
      "Unloaded weight-bearing bones in microgravity lose 1.0–1.5% of their mineral density per month (osteoclastic resorption > osteoblastic formation), dumping large quantities of calcium and phosphate directly into the bloodstream and urine (hypercalciuria). Combined with spaceflight dehydration (reduced thirst drive + 15% plasma volume contraction), decreased urinary volume, lower urinary pH, and hypocitraturia, astronauts experience a 3- to 5-fold spike in calcium oxalate, calcium phosphate, and uric acid supersaturation. An obstructing stone complicated by urinary tract infection can rapidly progress to lethal urosepsis in deep space.",
    watchTriggers: [
      {
        metric: "Autonomic Pain Index (HRV LF/HF Ratio + Electrodermal Activity + Tachycardia)",
        threshold: "Acute HR spike > 115 bpm + HRV RMSSD < 14 ms + severe flank-to-groin pain paroxysms",
        sensorSource: "Xiaomi Watch H1 PPG + Skin Conductance / Temperature",
        clinicalMeaning: "Severe visceral sympathetic activation consistent with acute ureteral colic (or core fever > 38.2°C indicating obstructive pyelonephritis)",
      },
    ],
    hermesAutomatedActions: [
      {
        subsystem: "MED-BAY",
        actionCode: "RENAL-US-HYDRONEPHROSIS-SCAN",
        description: "Configures C5-2 curvilinear ultrasound probe with Color Doppler 'Twinkling Artifact' preset to localize ureteral calculi and grade hydronephrosis.",
        executionLatencyMs: 380,
      },
    ],
    stepByStepGuide: [
      {
        stepNumber: 1,
        phase: "Acute Multimodal Analgesia (NSAID + Antiemetic)",
        action: "Administer Ketorolac (Toradol) 30 mg IV/IM immediately plus Ondansetron 4–8 mg ODT/IV for nausea.",
        clinicalDetail:
          "Ketorolac is superior to opioids alone in renal colic because prostaglandin synthesis inhibition directly reduces glomerular afferent arteriolar pressure, ureteral smooth muscle spasm, and renal capsular distension. If pain remains > 7/10 after 20 minutes, titrate Morphine 2–4 mg IV or intranasal Ketamine 0.5 mg/kg.",
        timeTarget: "0–10 minutes",
      },
      {
        stepNumber: 2,
        phase: "Renal & Bladder Ultrasound with Color Doppler 'Twinkling Artifact'",
        action: "Scan the affected kidney, ureterovesical junction (UVJ), and bladder using the 2–5 MHz curvilinear ultrasound probe.",
        clinicalDetail:
          "Measure stone acoustic shadow diameter, grade pelvicalyceal dilation (hydronephrosis), and verify presence of asymmetric ureteral jets into the bladder on Color Doppler. Stones <= 5 mm have an > 80% spontaneous expulsion rate; stones > 7–8 mm carry high risk of persistent obstruction.",
        timeTarget: "10–25 minutes",
      },
      {
        stepNumber: 3,
        phase: "Medical Expulsive Therapy (Tamsulosin) & Pressurized IV Hydration",
        action: "Administer Tamsulosin (Flomax) 0.4 mg PO once daily and infuse 1,000 mL 0.9% Normal Saline via pneumatic pressure cuff.",
        clinicalDetail:
          "Alpha-1A adrenergic blockade relaxes distal ureteral smooth muscle and intramural UVJ tone, accelerating stone passage and reducing analgesic requirements.",
        timeTarget: "Within 30 minutes",
      },
      {
        stepNumber: 4,
        phase: "Screen for Obstructive Urosepsis & Early Parenteral Antibiotics",
        action: "Perform urine dipstick (leukocyte esterase, nitrites, pH, hematuria) and i-STAT blood lactate/creatinine. If fever (>38.0°C), leukocytosis, or nitrite-positive urine is present with hydronephrosis, start Ceftriaxone 1–2 g IV/IM or Levofloxacin 750 mg IV immediately.",
        clinicalDetail:
          "An infected obstructed kidney is a true spaceflight surgical emergency. If refractory obstructive pyelonephritis occurs, prepare for ultrasound-guided percutaneous nephrostomy tube placement on the CMRS.",
        timeTarget: "Within 45 minutes",
      },
      {
        stepNumber: 5,
        phase: "Long-Term Prevention: Potassium Citrate, ARED Exercise & Bisphosphonates",
        action: "Initiate Potassium Citrate 20 mEq PO daily, maintain urine output > 2.5 L/day, and administer Zoledronic Acid / Alendronate + ARED resistive loading.",
        clinicalDetail:
          "Potassium Citrate forms soluble complexes with urinary calcium and raises urine pH to prevent both calcium oxalate and uric acid crystallization.",
        timeTarget: "Preventive maintenance",
      },
    ],
    medicationsRequired: [
      {
        name: "Ketorolac Tromethamine (Toradol)",
        dosage: "30 mg IV/IM initially, then 15–30 mg every 6 hours (max 5 days; hold if acute kidney injury)",
        route: "IV/IM",
        kitLocation: "ISS Crew Medical Restraint Pack A",
      },
      {
        name: "Tamsulosin Hydrochloride (Flomax)",
        dosage: "0.4 mg PO once daily (30 minutes after same meal each day)",
        route: "Oral",
        kitLocation: "ISS Crew Medical Restraint Pack B",
      },
      {
        name: "Potassium Citrate Extended-Release",
        dosage: "20 mEq (2,160 mg) PO once or twice daily for urinary alkalinization and citrate chelation",
        route: "Oral",
        kitLocation: "Deep-Space Chronic & Countermeasure Med Locker",
      },
      {
        name: "Ceftriaxone Sodium",
        dosage: "1–2 g IV/IM every 24 hours if concomitant urinary tract infection / obstructive pyelonephritis",
        route: "IV/IM",
        kitLocation: "ISS Crew Medical Restraint Pack B",
      },
    ],
    equipmentRequired: [
      "Curvilinear Abdominal Ultrasound Probe (2–5 MHz) with Color Doppler",
      "Focused Ultrasound Stone Propulsion (Burst Wave Lithotripsy / Ultrasonic Propulsion) Module",
      "Urine Collection Device (UCD) + Strainer Filter & Multistix Dipstick",
      "Ultrasound-Guided Percutaneous Nephrostomy Kit (8 Fr Pigtail Catheter)",
    ],
    doNotDo: [
      "DO NOT ignore fever or chills in a crewmember with a known renal stone—infected hydronephrosis progresses to septic shock within hours.",
      "DO NOT administer Ketorolac if solitary functional kidney obstruction or severe creatinine elevation is detected on i-STAT.",
      "DO NOT give excessive Vitamin D3 (>2,000 IU/day) or high-dose calcium supplements in microgravity—bone resorption already causes hypercalciuria.",
    ],
    nasaReferenceStandard: "NASA Renal Stone Risk & Ultrasonic Propulsion Countermeasure Protocol",
  },
  {
    id: "behavioral-psychiatric-crisis",
    title: "Deep-Space Behavioral, Isolation & Acute Psychiatric Emergency",
    codeName: "PSYCH-ISOLATION-HRV-0G",
    category: "behavioral",
    severity: "high",
    shortDescription:
      "Management of acute panic/anxiety crisis, circadian sleep-wake desynchrony, extreme confinement/Mars communication-delay psychosis, and non-violent behavioral restraint in spacecraft.",
    spaceMechanism:
      "Orbital astronauts witness 16 sunrises every 24 hours (one every 90 minutes), while deep-space Mars crews face extreme sensory monotony, 35–55 m³ habitable volume confinement, 20-minute one-way communication blackouts, chronic cosmic HZE neuro-inflammation in the prefrontal cortex and hippocampus, and high-stakes operational workload. Circadian misalignment and chronic sleep truncation (< 6 hours/night) precipitate acute panic episodes, depressive withdrawal, or reactive psychosis that directly threatens spacecraft integrity.",
    watchTriggers: [
      {
        metric: "Continuous HRV (RMSSD / SDNN), Sleep Architecture & Stress Score",
        threshold: "HRV RMSSD < 18 ms for > 48h + REM/Deep sleep < 45 min/night + Resting HR > 98 bpm",
        sensorSource: "Xiaomi Watch H1 24/7 PPG + Sleep Stage & Stress Algorithm",
        clinicalMeaning: "Severe sympathetic hyperarousal, circadian collapse, and impending behavioral decompensation",
      },
    ],
    hermesAutomatedActions: [
      {
        subsystem: "ECLSS",
        actionCode: "SSL-CIRCADIAN-PHASE-SHIFT",
        description: "Adjusts Solid-State Lighting (SSL) module LEDs to 530 nm / 6500K melanopic blue-depleted warm spectrum (1800K) to suppress cortisol and promote pineal melatonin release.",
        executionLatencyMs: 200,
      },
      {
        subsystem: "MED-BAY",
        actionCode: "NEURO-HRV-BIOFEEDBACK-INIT",
        description: "Launches private, encrypted Hermes Behavioral Guidance & 0.1 Hz Resonance Breathing HRV Biofeedback session synced with the astronaut's Xiaomi Watch H1.",
        executionLatencyMs: 310,
      },
    ],
    stepByStepGuide: [
      {
        stepNumber: 1,
        phase: "Environmental Safety Check & Verbal De-Escalation",
        action: "Ensure the distressed crewmember is away from airlock controls, hatch equalization valves, and sharp medical tools; engage in calm, non-confrontational verbal de-escalation.",
        clinicalDetail:
          "Rule out organic spaceflight causes of acute delirium/agitation first: check cabin CO2 partial pressure (hypercapnia), SpO2 (hypoxia), blood glucose, and toxic exposure. Speak slowly at eye level (anchor both yourself and the patient to foot loops so neither floats menacingly above the other).",
        timeTarget: "0–5 minutes",
      },
      {
        stepNumber: 2,
        phase: "Xiaomi Watch H1 0.1 Hz Resonance HRV Biofeedback & Sensory Grounding",
        action: "For acute panic attack or sympathetic surge, guide the astronaut through 6-breaths-per-minute (4-sec inhale, 6-sec exhale) vagal pacing using live Xiaomi Watch H1 HRV feedback.",
        clinicalDetail:
          "Resonance breathing at 0.1 Hz stimulates the vagus nerve via the respiratory sinus arrhythmia baroreflex, rapidly lowering heart rate by 15–25 bpm and aborting hyperventilation-induced paresthesias.",
        timeTarget: "5–15 minutes",
      },
      {
        stepNumber: 3,
        phase: "Pharmacological Anxiolysis or Acute Agitation Control",
        action: "For severe refractory panic or acute agitation, administer Oral/Sublingual Lorazepam 1–2 mg or Intranasal Midazolam 5 mg (via Mucosal Atomization Device) + Olanzapine 5–10 mg ODT if psychotic features are present.",
        clinicalDetail:
          "Intranasal Midazolam and Orally Disintegrating Tablet (ODT) Olanzapine achieve rapid CNS onset within 5–10 minutes in microgravity without requiring needle sticks in an agitated patient.",
        timeTarget: "10–20 minutes",
      },
      {
        stepNumber: 4,
        phase: "Zero-G Soft Restraint on CMRS (Last Resort for Imminent Crew/Vehicle Danger)",
        action: "If the crewmember is actively psychotic and attempting to breach hatches or harm crew, two crewmembers use the 'Wrap-and-Tether' maneuver to secure the patient onto the padded CMRS.",
        clinicalDetail:
          "Monitor continuous SpO2 and ECG via Xiaomi Watch H1 every 5 minutes during physical/chemical restraint to prevent positional asphyxiation or respiratory depression. Keep Flumazenil 0.2 mg IV at bedside.",
        timeTarget: "Only if immediate safety threat",
      },
      {
        stepNumber: 5,
        phase: "Circadian Entrainment & Private Flight Psychiatrist Tele-Consult",
        action: "Establish a protected 8.5-hour sleep window using dynamic Solid-State Lighting (480 nm blue-enriched morning light, blue-depleted evening light) + Melatonin 3 mg or Tasimelteon 20 mg PO 30 minutes before sleep.",
        clinicalDetail:
          "Schedule a private, encrypted Private Psychological Conference (PPC) with ground behavioral health specialists.",
        timeTarget: "Ongoing recovery phase",
      },
    ],
    medicationsRequired: [
      {
        name: "Midazolam Hydrochloride (Intranasal / IM)",
        dosage: "5 mg Intranasal (2.5 mg per nostril via atomizer) or 5 mg IM for acute panic/agitation or seizure",
        route: "Intranasal Atomizer or IM",
        kitLocation: "ISS Crew Medical Restraint Pack A",
      },
      {
        name: "Olanzapine (Zyprexa Zydis ODT)",
        dosage: "5–10 mg Orally Disintegrating Tablet (up to 20 mg/24h) for acute spaceflight psychosis or severe agitation",
        route: "Sublingual ODT",
        kitLocation: "ISS Crew Medical Restraint Pack B",
      },
      {
        name: "Tasimelteon (Hetlioz) / Melatonin",
        dosage: "Tasimelteon 20 mg PO or Melatonin 3 mg PO 30 minutes prior to target sleep onset",
        route: "Oral",
        kitLocation: "Crew Sleep & Circadian Countermeasure Kit",
      },
      {
        name: "Modafinil (Provigil)",
        dosage: "100–200 mg PO upon awakening for emergency operational alertness during circadian slam-shifts",
        route: "Oral",
        kitLocation: "Crew Sleep & Circadian Countermeasure Kit",
      },
    ],
    equipmentRequired: [
      "Xiaomi Watch H1 HRV Biofeedback & Sleep Telemetry Engine",
      "Dynamic Solid-State Lighting (SSL) Circadian Spectrum Array",
      "Mucosal Atomization Device (MAD) for Intranasal Midazolam",
      "Crew Medical Restraint System (CMRS) Padded Soft-Strap Set",
    ],
    doNotDo: [
      "DO NOT assume acute confusion or agitation is purely psychological without first checking cabin CO2, O2, and blood glucose.",
      "DO NOT hover physically 'above' an agitated crewmember in 0G—orient yourself in the same visual vertical plane to reduce perceived threat.",
      "DO NOT combine high-dose parenteral benzodiazepines with parenteral Olanzapine simultaneously due to risk of synergistic respiratory depression.",
    ],
    nasaReferenceStandard: "NASA Behavioral Health & Performance (BHP) Deep-Space Psychiatric Protocol",
  },
  {
    id: "spacecraft-zero-g-fire",
    title: "Spacecraft Microgravity Fire & Smoke Inhalation",
    codeName: "ECLSS-FIRE-0G-SMOKE",
    category: "life_support",
    severity: "critical",
    shortDescription:
      "Suppression of spherical microgravity flames, immediate ventilation cut-off, fine-water mist / CO2 extinguishment, and treatment of Carbon Monoxide (CO), Hydrogen Cyanide (HCN), and HCl smoke inhalation.",
    spaceMechanism:
      "In microgravity, hot combustion gases do not rise because there is no buoyancy-driven natural convection. Consequently, flames in 0G form quiet, dim-blue, hollow spheres fed exclusively by slow molecular oxygen diffusion and forced cabin ventilation fans. If cabin ventilation remains on, fans blow floating molten plastic/metal droplets throughout the module; if ventilation is cut off immediately, the spherical flame starves itself of oxygen. Furthermore, pyrolysis of spacecraft Kapton/Teflon wire insulation releases toxic Carbon Monoxide ($\text{CO}$), Hydrogen Cyanide ($\text{HCN}$), and Hydrogen Fluoride/Chloride ($\text{HF}/\text{HCl}$).",
    watchTriggers: [
      {
        metric: "Carboxyhemoglobin / SpO2 Gap, Tachycardia & Cabin Photoelectric Smoke Detector",
        threshold: "HR > 130 bpm + RR > 28/min + CSA-CP CO > 50 ppm or HCN > 4 ppm",
        sensorSource: "Xiaomi Watch H1 Telemetry + Spacecraft Smoke & CSA-CP Sensors",
        clinicalMeaning: "Active combustion event with toxic carboxyhemoglobin/cyanide histotoxic hypoxia",
      },
    ],
    hermesAutomatedActions: [
      {
        subsystem: "ECLSS",
        actionCode: "VENT-CUTOFF-BUS-ISOLATE",
        description: "Immediately cuts all inter-module and intra-module cabin ventilation fans to starve the 0G flame of convective oxygen and sheds electrical power to the faulted rack.",
        executionLatencyMs: 45,
      },
      {
        subsystem: "CREW-ALERT",
        actionCode: "FIRE-CLASS-1-ALARM",
        description: "Activates Master Fire Alarm, illuminates emergency egress strobes to return vehicles, and unlocks Portable Breathing Apparatus (PBA) and Fine-Water Mist Extinguishers.",
        executionLatencyMs: 80,
      },
    ],
    stepByStepGuide: [
      {
        stepNumber: 1,
        phase: "Verify Ventilation Cut-Off, Isolate Rack Power & Don PBA (0–20 sec)",
        action: "Ensure Hermes has cut all cabin ventilation fans and de-energized the smoking avionics rack; don Positive-Pressure Portable Breathing Apparatus (PBA) immediately.",
        clinicalDetail:
          "Never open an avionics rack door to fight a fire in 0G! Instead, insert the extinguisher nozzle directly into the dedicated Rack Fire Port aperture so floating embers and toxic smoke cannot escape into the cabin.",
        timeTarget: "0–20 seconds",
      },
      {
        stepNumber: 2,
        phase: "Discharge Fine-Water Mist or CO2 Portable Fire Extinguisher (PFE)",
        action: "Brace your feet in deck foot-restraints (extinguisher discharge thrust will propel an unanchored astronaut backward!) and discharge the Fine-Water Mist or CO2 PFE into the fire port.",
        clinicalDetail:
          "NASA ISS/Artemis Fine-Water Mist extinguishers produce 30–100 micron water droplets that evaporate on the flame front, absorbing massive latent heat and displacing oxygen without damaging adjacent electronics or raising cabin CO2 to lethal levels.",
        timeTarget: "20–60 seconds",
      },
      {
        stepNumber: 3,
        phase: "Assess Crew for Thermal Airway Burns, CO & Cyanide Poisoning",
        action: "Examine for singed nasal vibrissae, carbonaceous sputum, hoarseness, or stridor. Do NOT trust standard pulse oximetry SpO2 alone during CO poisoning!",
        clinicalDetail:
          "Standard two-wavelength pulse oximeters cannot distinguish Carboxyhemoglobin (COHb) from Oxyhemoglobin ($\text{O}_2\text{Hb}$) and will falsely read 98–100% SpO2 even in lethal CO poisoning. Administer 100% O2 via tight-fitting non-rebreather/PBA mask immediately (reduces COHb half-life from 320 minutes on air to 74 minutes on 100% O2).",
        timeTarget: "1–10 minutes",
      },
      {
        stepNumber: 4,
        phase: "Empiric Hydroxocobalamin (Cyanokit) for Smoke-Induced Cyanide Toxicity",
        action: "For any smoke inhalation victim with altered mental status, hypotension, or elevated i-STAT blood lactate (> 8 mmol/L), infuse Hydroxocobalamin 5 g IV over 15 minutes.",
        clinicalDetail:
          "Burning spacecraft polymer insulation releases Hydrogen Cyanide ($\text{HCN}$), which inhibits cytochrome c oxidase (Complex IV). Hydroxocobalamin binds cyanide directly to form non-toxic cyanocobalamin (Vitamin B12), excreted renally.",
        timeTarget: "10–25 minutes",
      },
    ],
    medicationsRequired: [
      {
        name: "100% Medical Oxygen (via PBA / Demand Regulator)",
        dosage: "100% FiO2 continuously for minimum 4–6 hours until COHb < 3% and neurological baseline restored",
        route: "Inhalation (Sealed Mask)",
        kitLocation: "Wall-Mounted Emergency PBA Station",
      },
      {
        name: "Hydroxocobalamin (Cyanokit) (or Sodium Thiosulfate)",
        dosage: "5 g IV infused over 15 minutes via pressurized cuff for suspected cyanide inhalation",
        route: "Pressurized IV",
        kitLocation: "EVA Airlock & Fire Contingency Medical Pouch",
      },
      {
        name: "Salbutamol (Albuterol) MDI + Ipratropium",
        dosage: "4–8 puffs every 20 minutes for smoke/acid-gas induced bronchospasm",
        route: "Inhalation",
        kitLocation: "ISS Crew Medical Restraint Pack A",
      },
    ],
    equipmentRequired: [
      "NASA Fine-Water Mist / CO2 Portable Fire Extinguisher (PFE)",
      "Portable Breathing Apparatus (PBA) Full-Face Hood",
      "Compound Specific Analyzer - Combustion Products (CSA-CP: CO, HCN, HCl)",
      "contaminant Clean-Up Filter Assembly (CCFA) & HEPA Scrubbers",
    ],
    doNotDo: [
      "DO NOT leave cabin ventilation fans running during a fire—convective airflow is the sole oxygen supply feeding a 0G flame.",
      "DO NOT fire a CO2 extinguisher without anchoring your feet in deck restraints—Newtonian thrust will hurl you across the module.",
      "DO NOT rely on a 99% SpO2 reading to rule out Carbon Monoxide poisoning—COHb mimics oxyhemoglobin on standard optical sensors.",
    ],
    nasaReferenceStandard: "ISS Fire Response Generic Checklist & NASA STD-6001 Flammability/Combustion Toxicology",
  },
  {
    id: "hypothermia-eclss-failure",
    title: "ECLSS Thermal Loop Failure & Severe Hypothermia / Heatstroke in Space",
    codeName: "THERMAL-ECLSS-LCVG-0G",
    category: "life_support",
    severity: "high",
    shortDescription:
      "Management of severe spacecraft cabin hypothermia (Apollo 13 / power loss scenario) or EVA Liquid Cooling and Ventilation Garment (LCVG) pump failure causing exertional spaceflight heatstroke.",
    spaceMechanism:
      "In the vacuum of space, heat cannot be dissipated or absorbed by conduction or convection—only by thermal radiation. Furthermore, inside a spacecraft or EVA suit in microgravity, absence of buoyant natural convection means body heat forms a stagnant thermal boundary layer around the skin. If the EVA suit's LCVG water pump or sublimator fails during solar illumination (+120°C exterior), core temperature rises by > 1.5°C/hour (hyperthermia). Conversely, if spacecraft electrical power and ammonia/water thermal loops fail in deep shadow (-150°C exterior), cabin temperature drops toward freezing and conductive heat loss through metallic hull contact induces severe hypothermia (< 32°C) and Osborne J-wave arrhythmias.",
    watchTriggers: [
      {
        metric: "Wrist Skin Temperature, Core Thermal Flux Estimate & ECG Osborne J-Waves",
        threshold: "Estimated Core Temp < 35.0°C (with bradycardia < 48 bpm) OR > 39.2°C (with tachycardia > 150 bpm)",
        sensorSource: "Xiaomi Watch H1 NTC Thermal Sensor + PPG/ECG",
        clinicalMeaning: "Decompensated thermal dysregulation from ECLSS or LCVG cooling loop failure",
      },
    ],
    hermesAutomatedActions: [
      {
        subsystem: "ECLSS",
        actionCode: "THERMAL-LOOP-BYPASS-RECOVER",
        description: "Switches thermal control system to redundant Pump Module Loop B and modulates radiator louvres to stabilize habitable module temperature.",
        executionLatencyMs: 290,
      },
    ],
    stepByStepGuide: [
      {
        stepNumber: 1,
        phase: "Scenario A (EVA Hyperthermia / Heatstroke): Immediate Shade Translation & LCVG Bypass",
        action: "If LCVG cooling water flow fails during EVA, cease all metabolic physical work immediately, translate into spacecraft orbital shadow, and connect the Auxiliary Cooling Umbilical in the airlock.",
        clinicalDetail:
          "Without active water cooling, an astronaut's 300–500 W metabolic heat load cannot escape the multi-layer Orthofabric/Mylar vacuum insulation of the spacesuit. Once doffed from the suit, apply cold water-soaked towels directly to the neck, axillae, and groin (using surface-tension contact rather than spraying water).",
        timeTarget: "0–10 minutes",
      },
      {
        stepNumber: 2,
        phase: "Scenario B (ECLSS Power Loss / Severe Hypothermia): Multi-Layer Kapton Insulation & Active Core Rewarming",
        action: "Isolate the crew in the smallest habitable volume (or return capsule), don dry Liquid Cooling/Warming Garments, and wrap in aluminized Mylar/Kapton thermal blankets.",
        clinicalDetail:
          "Handle severely hypothermic crewmembers (< 30–32°C) with extreme gentleness when strapping onto the CMRS—rough movement or jarring can precipitate refractory Ventricular Fibrillation in a cold, irritable myocardium.",
        timeTarget: "0–15 minutes",
      },
      {
        stepNumber: 3,
        phase: "Heated Pressurized IV Crystalloids & Humidified Oxygen",
        action: "For moderate-to-severe hypothermia, infuse 0.9% Normal Saline warmed to 40–42°C via the medical fluid warmer and 300 mmHg pressure cuff.",
        clinicalDetail:
          "Apply chemical heat packs to the thorax, axillae, and groin only (Active Core Rewarming). Avoid warming extremities first, which dilates peripheral vasoconstricted beds and causes 'Afterdrop'—shunting cold, acidotic blood back to the heart.",
        timeTarget: "15–45 minutes",
      },
    ],
    medicationsRequired: [
      {
        name: "0.9% Sodium Chloride (Warmed to 40°C for Hypothermia / Cooled for Heatstroke)",
        dosage: "500–1,000 mL IV via 300 mmHg pneumatic pressure bag and inline thermal sleeve",
        route: "Pressurized IV",
        kitLocation: "EVA Airlock Emergency Pouch",
      },
      {
        name: "Midazolam (for Hyperthermic Rigors / Heatstroke Seizures)",
        dosage: "2.5–5 mg IV/IM/Intranasal to abolish shivering thermogenesis during active cooling",
        route: "IV/IM/IN",
        kitLocation: "ISS Crew Medical Restraint Pack A",
      },
    ],
    equipmentRequired: [
      "Liquid Cooling and Ventilation Garment (LCVG) with Bidirectional Thermal Control",
      "Aluminized Kapton / Multi-Layer Insulation (MLI) Emergency Blankets",
      "Inline Medical IV Fluid Warmer + 300 mmHg Pressure Infuser",
      "Core Tympanic / Esophageal Temperature Probe",
    ],
    doNotDo: [
      "DO NOT administer anti-arrhythmic drugs or repeated shocks to a severely hypothermic (< 30°C) patient beyond initial defibrillation until core temperature is warmed above 30–32°C.",
      "DO NOT rewarm a hypothermic astronaut's arms and legs before warming the core thorax—peripheral vasodilation causes lethal core temperature Afterdrop.",
      "DO NOT administer Acetaminophen or Ibuprofen for exertional heatstroke—antipyretics act on hypothalamic prostaglandin setpoints and are ineffective (and hepatotoxic/nephrotoxic) in environmental hyperthermia.",
    ],
    nasaReferenceStandard: "NASA-STD-3001 Thermal Environment & EVA LCVG Failure Contingency",
  },
  {
    id: "eva-trauma-hemorrhage",
    title: "Microgravity Trauma, Severe Hemorrhage & Fracture Immobilization",
    codeName: "TRAUMA-HEMORRHAGE-0G",
    category: "trauma_eva",
    severity: "critical",
    shortDescription:
      "Control of high-momentum crush injury, arterial/venous hemorrhage in 0G, Tranexamic Acid (TXA) administration, and fracture reduction/splinting on the CMRS without gravitational traction.",
    spaceMechanism:
      "A 500 kg payload rack or orbital replacement unit floating at 0.5 m/s in microgravity Appears weightless, yet possesses identical inertial mass ($F = ma$) and kinetic energy ($\\frac{1}{2}mv^2$) to a 500 kg mass on Earth—capable of causing severe crush fractures and arterial lacerations. In microgravity, arterial blood spurts in linear trajectories across the cabin while venous blood pools into large expanding surface-tension domes over the wound, obscuring the bleeding vessel. Additionally, astronauts enter trauma already hypovolemic (10–15% spaceflight plasma volume contraction) and with impaired baroreceptor compensation, accelerating hemorrhagic shock.",
    watchTriggers: [
      {
        metric: "Shock Index (HR / Systolic BP Estimate) & Pulse Wave Amplitude",
        threshold: "HR > 125 bpm + PPG Dicrotic Notch loss + Shock Index > 1.0",
        sensorSource: "Xiaomi Watch H1 Optical PPG + Pulse Transit Time BP Estimator",
        clinicalMeaning: "Class II/III hemorrhagic shock aggravated by baseline spaceflight hypovolemia",
      },
    ],
    hermesAutomatedActions: [
      {
        subsystem: "MED-BAY",
        actionCode: "TRAUMA-CMRS-SUCTION-PREP",
        description: "Activates high-flow centrifugal surgical suction (to capture floating blood domes) and unlocks the Trauma & Hemorrhage Sub-Pack.",
        executionLatencyMs: 260,
      },
    ],
    stepByStepGuide: [
      {
        stepNumber: 1,
        phase: "Tether Patient to CMRS & Apply CAT Tourniquet / QuikClot Hemostatic Gauze (0–2 min)",
        action: "Restrain the injured crewmember on the CMRS immediately. For life-threatening extremity bleeding, apply a Combat Application Tourniquet (CAT) 5–7 cm proximal to the wound; for junctional/truncal wounds, pack tightly with Kaolin/Chitosan Hemostatic Gauze (QuikClot/Celox).",
        clinicalDetail:
          "Use the centrifugal surgical suction wand to aspirate the expanding surface-tension blood dome so you can visualize the exact bleeding point before packing. Hold uninterrupted manual pressure for 3 full minutes while anchored in deck foot-loops.",
        timeTarget: "0–3 minutes",
      },
      {
        stepNumber: 2,
        phase: "Early Tranexamic Acid (TXA) & Pressurized Volume Resuscitation",
        action: "Establish IV/IO access and infuse Tranexamic Acid (TXA) 1 g IV over 10 minutes, followed by 500 mL boluses of warmed Lactated Ringer's / Lyophilized Freeze-Dried Plasma via 300 mmHg pressure cuff.",
        clinicalDetail:
          "Because astronauts have a 10–15% baseline reduction in red cell mass and plasma volume ('Space Anemia'), even a 750 mL blood loss in microgravity produces Class III shock physiology.",
        timeTarget: "3–15 minutes",
      },
      {
        stepNumber: 3,
        phase: "Wound Closure in Microgravity (Cyanoacrylate / Staples / Barbed Sutures)",
        action: "Irrigate laceration using a closed splash-shield syringe system and close with Dermabond tissue adhesive, skin staples, or knotless barbed sutures.",
        clinicalDetail:
          "Spaceflight impairs fibroblast collagen deposition and wound healing while increasing Staphylococcus aureus virulence; apply topical mupirocin/bacitracin and administer prophylactic Cefazolin/Ceftriaxone 1 g IV/IM for open contaminated wounds.",
        timeTarget: "15–30 minutes",
      },
      {
        stepNumber: 4,
        phase: "Zero-G Fracture Reduction & SAM Splinting without Gravity Traction",
        action: "Administer Ketamine 0.25–0.5 mg/kg IV (or Midazolam + Fentanyl/Morphine), anchor the proximal limb segment to the CMRS frame with a counter-traction strap, and apply axial manual traction to align the fracture before molding a SAM Splint / Vacuum Splint.",
        clinicalDetail:
          "Verify distal radial/dorsalis pedis pulse via Doppler ultrasound before and after splinting. Remember that bone fracture healing (callus mineralization) is delayed in 0G due to mechanical unloading and osteoclastic dominance.",
        timeTarget: "20–45 minutes",
      },
    ],
    medicationsRequired: [
      {
        name: "Tranexamic Acid (TXA)",
        dosage: "1 g IV over 10 minutes (within 3 hours of injury), followed by 1 g over 8 hours",
        route: "Pressurized IV / IO",
        kitLocation: "Trauma & Minor Surgery Sub-Pack",
      },
      {
        name: "Ketamine Hydrochloride",
        dosage: "0.25–0.5 mg/kg IV slow push (analgesic dose) or 1.0–1.5 mg/kg IV for procedural fracture reduction",
        route: "Pressurized IV / IM / Intranasal",
        kitLocation: "ISS Crew Medical Restraint Pack A",
      },
      {
        name: "Ceftriaxone (or Ertapenem) for Open Fracture / Crush Injury",
        dosage: "1–2 g IV/IM every 24 hours",
        route: "IV/IM",
        kitLocation: "ISS Crew Medical Restraint Pack B",
      },
    ],
    equipmentRequired: [
      "Combat Application Tourniquet (CAT Gen-7) & QuikClot Kaolin Hemostatic Gauze",
      "Centrifugal Zero-G Surgical Suction & Splash-Shield Wound Irrigator",
      "Malleable SAM Structural Aluminum Splints & Vacuum Extremity Splint",
      "300 mmHg Pneumatic IV Pressure Bag + Freeze-Dried Plasma / Crystalloid",
    ],
    doNotDo: [
      "DO NOT irrigate an open bleeding wound without a splash-containment shield and active suction—aerosolized blood droplets float indefinitely in cabin air.",
      "DO NOT attempt to reduce a displaced long-bone fracture without strapping the patient's torso/proximal limb to the CMRS for counter-traction.",
      "DO NOT underestimate blood loss volume in microgravity—surface-tension domes conceal large volumes and astronauts have 15% less baseline blood volume.",
    ],
    nasaReferenceStandard: "NASA Exploration Medical Capability (ExMC) Trauma & Hemorrhage Clinical Guide",
  },
];
