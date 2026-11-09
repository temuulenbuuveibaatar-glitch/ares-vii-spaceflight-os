/**
 * NASA Spaceflight Human-System Standard (NASA-STD-3001)
 * & NASA Human Research Program (HRP) Emergency Clinical Database
 * Built for Sonnenblume (ARES-VII) & Hermes AI Agent.
 */

export interface NASAEmergencyProtocol {
  id: string;
  name: string;
  code: string;
  standard: string;
  mechanism: string;
  clinicalActions: string[];
  medications: string[];
  hardware: string[];
  contraindications: string[];
}

export const NASA_SPACE_MEDICINE_DATABASE: Record<string, NASAEmergencyProtocol> = {
  MICROGRAVITY_CPR: {
    id: "microgravity_cpr",
    name: "0G Cardiopulmonary Resuscitation (ACLS Microgravity)",
    code: "NASA-STD-3001-CPR-0G",
    standard: "NASA-STD-3001 Vol 1 / ISS Emergency Medical Procedures",
    mechanism:
      "In 0G, standard compressions fail due to Newton's 3rd Law (rescuer lifts off patient). Cephalad fluid shifts reduce circulating blood volume by 10-15%, making adequate cardiac output dependent on rigid structural anchor points.",
    clinicalActions: [
      "1. Handstand Method: Anchor rescuer feet to cabin ceiling/bulkhead, hands on lower half of sternum. Depress chest 5-6 cm at 100-120 bpm utilizing arm and leg extension.",
      "2. Evetts-Russomano Technique: Rescuer crosses legs around patient's thighs to form an unbroken anatomical clamp, compressing without external straps.",
      "3. Crew Medical Restraint System (CMRS): Fasten patient to backboard with CMRS chest and waist harness to stabilize the thorax.",
      "4. Defibrillation Safety: Wipe patient dry before shock delivery—floating sweat beads cause dangerous electric arcing in microgravity. Ensure patient is isolated from metallic hull.",
    ],
    medications: [
      "Epinephrine 1 mg IV/IO every 3-5 min (radiation-shielded autoinjector)",
      "Amiodarone 300 mg bolus IV/IO for refractory VF/pulseless VTach",
    ],
    hardware: [
      "CMRS Patient Restraint Board",
      "0G Micro-cuff Oscillometric Monitor",
      "Biphasic Defibrillator with suction pads",
      "Bag-Valve-Mask with viral/micro-droplet bacterial filter",
    ],
    contraindications: [
      "Do NOT attempt chest compressions without anchoring feet or wrapping legs—rescuer will float away.",
      "Do NOT deliver electrical shock if free moisture is visible on patient chest or nearby atmosphere.",
    ],
  },

  SANS_AND_INTRACRANIAL_PRESSURE: {
    id: "sans_icp",
    name: "Spaceflight-Associated Neuro-ocular Syndrome (SANS) & ICP",
    code: "NASA-HRP-SANS-01",
    standard: "NASA Human Research Program Evidence Book on SANS",
    mechanism:
      "Loss of hydrostatic gravity gradient redistributes ~2 liters of venous blood cephalad into head and thorax, leading to chronic jugular venous congestion, elevated intracranial pressure (ICP), optic disc edema, globe flattening, and hyperopic refractive shift.",
    clinicalActions: [
      "1. Lower Body Negative Pressure (LBNP): Place crewmember in Chibis/LBNP suit at -25 to -35 mmHg for 2 hours daily to pull venous pool back into lower extremities.",
      "2. Vorotnik Compression Collar: Apply pneumatic jugular neck collar to modulate venous return and reduce retrobulbar sheath pressure.",
      "3. Optical Coherence Tomography (OCT) & Fundoscopy: Inspect optic nerve head for Frisén Grade 1-3 papilledema and choroidal folds.",
      "4. Resistive Exercise: Perform high-load squats and deadlifts on ARED/resistive trainer to stimulate systemic vascular tone.",
    ],
    medications: [
      "Acetazolamide 250 mg PO BID (carbonic anhydrase inhibitor to lower CSF pressure)",
      "Topical Timolol 0.5% ophthalmic drops for elevated intraocular pressure",
    ],
    hardware: [
      "Chibis/LBNP Lower Body Suction Suit",
      "Vorotnik Pneumatic Jugular Collar",
      "Xiaomi Watch H1 continuous BP and pulse wave transit time (PWTT) monitor",
      "Portable Fundoscopic Ophthalmoscope",
    ],
    contraindications: [
      "Do NOT allow prolonged inverted positioning or heavy head-down activities.",
      "Do NOT exceed -40 mmHg in LBNP suit to avoid syncope and baroreceptor collapse.",
    ],
  },

  DEPRESSURIZATION_AND_EBULLISM: {
    id: "depressurization_ebullism",
    name: "Explosive Depressurization & Armstrong Limit Survival",
    code: "NASA-STD-3001-ECLSS-DEPRESS",
    standard: "NASA Flight Surgeon Handbook: Cabin Atmosphere Loss",
    mechanism:
      "At or below the Armstrong Limit (6.3 kPa / 47 mmHg / ~19.2 km equivalent), ambient pressure matches water vapor pressure at 37°C. Bodily fluids (saliva, tears, alveolar moisture, venous blood) instantly boil (ebullism). Time of Useful Consciousness (TUC) is 9-15 seconds.",
    clinicalActions: [
      "1. Immediate Seal: Don and lock pressure helmet within 8 seconds; initiate 100% emergency O2 flood.",
      "2. Cabin Pressure Floor: Lock ECLSS nitrogen/oxygen feed to maintain cabin at minimum ≥ 55 kPa (8.0 psi) to avert ebullism.",
      "3. Hyperbaric Treatment: If crew member exposed to < 20 kPa, recompress to 101.3 kPa and place in hyperbaric treatment tent to shrink venous air emboli.",
      "4. Decompression Sickness (DCS) Protocol: 2-hour 100% normobaric oxygen pre-breathe to wash out inert nitrogen from fatty tissues and joints.",
    ],
    medications: [
      "High-dose Dexamethasone 10 mg IV for barotraumatic cerebral edema",
      "Intravenous Saline 0.9% for intravascular volume replacement and bubble clearance",
    ],
    hardware: [
      "Quick-Don Emergency Pressure Suits",
      "ECLSS Rapid N2/O2 Injection Valves",
      "Portable Gamow/Hyperbaric Recompression Bag",
    ],
    contraindications: [
      "Do NOT breathe against a closed glottis during pressure drop—causes massive pulmonary barotrauma and tension pneumothorax.",
      "Do NOT delay helmet lock to search for leaks; seal life-support first.",
    ],
  },

  SOLAR_PARTICLE_EVENT_AND_RADIATION: {
    id: "spe_radiation_storm",
    name: "Solar Particle Event (SPE) & Acute Radiation Syndrome",
    code: "NASA-STD-3001-RAD-SPE",
    standard: "NASA Space Radiation Health Project Protocol",
    mechanism:
      "Coronal Mass Ejections (CME) accelerate relativistic protons (10-100+ MeV). Exposure exceeding 1.0 Gy causes Acute Radiation Syndrome (ARS) with hematopoietic cell death, immunosuppression, vomiting, and mucosal breakdown.",
    clinicalActions: [
      "1. Slew Spacecraft Tail-to-Sun (Yaw 180°): Direct aft 15cm potable water storm-shelter bulkhead toward the Sun, attenuating proton dose by 78%.",
      "2. Superconducting Magnetic Shield: Energize 12-Tesla magnetic deflector coils to 100% field strength.",
      "3. Medical Prophylaxis: Administer radioprotectants prior to peak flux arrival.",
      "4. Hematopoietic Support: If dose > 2.0 Gy, initiate daily Granulocyte Colony-Stimulating Factor (G-CSF) to prevent opportunistic bacteremia.",
    ],
    medications: [
      "Soviet B-190 (Indraline alpha-1 agonist) 150 mg PO prior to storm",
      "Filgrastim (Neupogen / G-CSF) 5 mcg/kg/day SC for bone marrow recovery",
      "Ondansetron 8 mg IV/SL for radiation-induced emesis",
      "Potassium Iodide (KI) 130 mg PO for thyroid protection",
    ],
    hardware: [
      "Aft Water Storm-Shelter Bulkhead (15 cm H2O)",
      "12-Tesla Superconducting Magnetic Shielding Coils",
      "Xiaomi Watch H1 integrated dose-rate sensor & heart-rate variability monitor",
    ],
    contraindications: [
      "Do NOT remain in forward cabin or EVA during coronal mass ejection flux.",
      "Do NOT administer live vaccines or immunosuppressive agents following acute exposure.",
    ],
  },

  AMMONIA_LEAK_AND_TOXIC_ECLSS: {
    id: "ammonia_leak",
    name: "Ammonia (NH3) & Toxic Loop Intrusion",
    code: "NASA-STD-3001-TOXIC-NH3",
    standard: "ISS Emergency Ammonia Protocol & NASA Toxicology Group",
    mechanism:
      "High-pressure liquid anhydrous ammonia used in external heat rejection loops can breach heat exchangers into the internal cabin water loop, releasing corrosive NH3 gas. Causes chemical laryngeal spasms, pulmonary edema, and corneal burns.",
    clinicalActions: [
      "1. Don Emergency Quick-Don Masks with Ammonia/P100 filter cartridges immediately.",
      "2. Isolate Module: Close inter-module hatch to isolate contaminated cabin atmosphere.",
      "3. ECLSS Scrubber Mode: Switch environmental scrubbers to high-velocity activated carbon and phosphoric-acid-treated chemisorption beds.",
      "4. Decontamination: Wash exposed skin and conjunctiva with copious eyewash saline for at least 15 minutes.",
    ],
    medications: [
      "Inhaled Albuterol 2.5 mg nebulized for severe bronchospasm",
      "Methylprednisolone 125 mg IV for chemical pneumonitis",
    ],
    hardware: [
      "Quick-Don Ammonia Masks",
      "Dräger Toxic Gas Detection Tubes (NH3)",
      "Phosphoric-Acid Chemisorption Filter Canisters",
    ],
    contraindications: [
      "Do NOT remove breathing mask until gas detector verifies ammonia levels < 2.0 ppm.",
      "Do NOT use pure water mist fire extinguishers directly on concentrated anhydrous ammonia liquid.",
    ],
  },

  ZERO_G_HYPERCAPNIA: {
    id: "zero_g_hypercapnia",
    name: "Microgravity Carbon Dioxide (CO2) Retention & Acidosis",
    code: "NASA-STD-3001-CO2-ECLSS",
    standard: "NASA Standards on Spacecraft Maximum Allowable Concentrations (SMAC)",
    mechanism:
      "In 0G without buoyant convection, exhaled CO2 forms a stationary invisible cloud around an astronaut's face during sleep or confined station tasks. Chronic CO2 > 3.0 mmHg causes cerebral vasodilation, debilitating headaches, cognitive slowing, and respiratory acidosis.",
    clinicalActions: [
      "1. Check Airflow: Verify cabin personal ventilation fans are delivering > 0.15 m/s airflow directly to breathing zone.",
      "2. CDRA Scrubber Cycle: Force Carbon Dioxide Removal Assembly (CDRA) into high-scrub thermal desorber cycle.",
      "3. LiOH Canister Replacement: Insert backup Lithium Hydroxide (LiOH) secondary scrub canisters.",
      "4. Supplemental O2: Administer 30% enriched O2 mask for 30 minutes to reverse cerebral vasodilation.",
    ],
    medications: [
      "Ibuprofen 600 mg PO for hypercapnic vascular headache",
      "Supplemental normobaric oxygen via nasal cannula",
    ],
    hardware: [
      "CDRA (Carbon Dioxide Removal Assembly)",
      "LiOH Scrub Canisters",
      "Xiaomi Watch H1 SpO2 and peripheral micro-perfusion tracking",
    ],
    contraindications: [
      "Do NOT sleep in non-ventilated nooks, dead air pockets, or behind equipment racks.",
      "Do NOT ignore morning throbbing frontal headaches—they are a hallmark warning of CO2 pocketing.",
    ],
  },
};

/**
 * Builds the high-authority NASA Spaceflight Medical & Emergency Knowledge System Prompt
 * for the Google Gemini Agent.
 */
export function buildNASASystemInstruction(contextSummary: string): string {
  const protocolsText = Object.values(NASA_SPACE_MEDICINE_DATABASE)
    .map(
      (p) =>
        `### ${p.name} (${p.code})
Standard: ${p.standard}
Pathophysiology: ${p.mechanism}
Emergency Actions:
${p.clinicalActions.join("\n")}
Medications: ${p.medications.join("; ")}
Equipment: ${p.hardware.join("; ")}
Contraindications: ${p.contraindications.join(" ")}`
    )
    .join("\n\n");

  return `You are HERMES AI, the autonomous Flight Controller & Emergency Space Medicine AI onboard the deep-space spacecraft Sonnenblume (ARES-VII), operating for the NASA Space Apps Challenge.
You represent the four specialized subagents:
- MED-SENTINEL: Cardiovascular triage, microgravity ACLS, and vital stabilization via Xiaomi Watch H1.
- RAD-GUARD: Solar Particle Event (SPE) shielding, water-storm shelter alignment, and radioprotectant deployment.
- PSY-ORACLE: Deep-space cognitive health, SANS intracranial management, and neuro-circadian wellness.
- NAV-PILOT: Orbital mechanics, NASA GMAT trajectory solutions, and dynamic G-load safety capping (≤ 2.6G max).

CURRENT SPACECRAFT & CREW TELEMETRY:
${contextSummary}

OFFICIAL NASA SPACE MEDICINE PROTOCOLS (NASA-STD-3001 & NASA HRP):
${protocolsText}

INSTRUCTIONS:
1. Provide authoritative, scientifically accurate, clinically verified answers based strictly on real NASA, ESA, and space medicine standards.
2. In medical emergencies (0G CPR, SANS, cabin depressurization, solar radiation storms, toxic ammonia, CO2 poisoning), deliver clear, actionable step-by-step clinical instructions.
3. Keep answers concise, direct, and mission-ready (2-4 sentences for voice and fast radio downlink, or structured steps when an emergency procedure is requested).
4. You are completely powered by Google Gemini. Never mention or refer to OpenAI.`;
}
