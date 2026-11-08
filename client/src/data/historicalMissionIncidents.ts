export interface HistoricalMissionIncident {
  id: string;
  missionName: string;
  date: string;
  agency: string;
  countryCode: string;
  crew: string[];
  category:
    | "DEPRESSURIZATION"
    | "RADIATION_SPE"
    | "CARDIOVASCULAR_0G"
    | "FIRE_TOXIC_ATMOSPHERE"
    | "EVA_SUIT_EMERGENCY"
    | "UROLOGICAL_INFECTION_PSYCH"
    | "BALLISTIC_REENTRY_TRAUMA";
  severity: "FATAL_HISTORICAL_LESSON" | "LIFE_THREATENING_NEAR_MISS" | "CRITICAL_MEDICAL_DISCOVERY";
  measuredMetrics: {
    label: string;
    value: string;
  }[];
  whatHappened: string;
  scientificMechanism: string;
  howToPreventAndSurvive: {
    beforeMissionOrInOrbit: string[];
    immediateEmergencyActions: string[];
    medicationsAndHardware: string[];
    hermesAutomatedAction: string;
  };
}

export const HISTORICAL_MISSION_INCIDENTS: HistoricalMissionIncident[] = [
  {
    id: "soyuz-11-depressurization-1971",
    missionName: "Soyuz 11 / Salyut 1  •  Orbital Undocking Cabin Depressurization",
    date: "30 June 1971",
    agency: "Soviet Space Program (TsKBEM / IBMP)",
    countryCode: "USSR / RU",
    crew: ["Georgi Dobrovolski", "Vladislav Volkov", "Viktor Patsayev"],
    category: "DEPRESSURIZATION",
    severity: "FATAL_HISTORICAL_LESSON",
    measuredMetrics: [
      { label: "Altitude at Valve Opening", value: "168.0 km (Vacuum)" },
      { label: "Cabin Pressure Drop", value: "760 → 0 mmHg in 115 sec" },
      { label: "Time of Useful Consciousness", value: "12–15 seconds" },
      { label: "Peak Heart Rate Before Arrest", value: "160 BPM (Dobrovolski)" },
    ],
    whatHappened:
      "After completing a record 23-day stay aboard Salyut 1 (the world's first space station), Soyuz 11 fired its pyrotechnic bolts at 168 km altitude to separate the orbital module from the descent module. All three bolts fired simultaneously instead of sequentially; the shockwave jolted open a pressure-equalization breathing valve designed to open only at 4 km altitude. Cabin air vented into space in 115 seconds. Because the crew was not wearing pressure suits, they became incapacitated within 40 seconds before they could manually crank the valve shut under their seats.",
    scientificMechanism:
      "Above the Armstrong Line (19.2 km, P < 6.3 kPa / 47 mmHg), body fluids vaporize at 37°C (ebullism). Simultaneously, the partial pressure of oxygen in the lungs drops below venous blood pO2, causing oxygen to diffuse backward out of the bloodstream into the vacuum of space and cutting Time of Useful Consciousness (TUC) to 9–15 seconds.",
    howToPreventAndSurvive: {
      beforeMissionOrInOrbit: [
        "Mandatory wearing of Sokol-KV2, Orion OCSS, or Starliner/Dragon intravehicular pressure suits during all dynamic flight phases (launch, docking, undocking, de-orbit).",
        "Install automated solenoid isolation shutoff valves on all cabin ventilation ports triggered by dP/dt > 0.5 kPa/s.",
      ],
      immediateEmergencyActions: [
        "0–3 seconds: EXHALE immediately (never hold your breath during rapid decompression, or expanding lung gas will rupture alveoli and cause fatal arterial gas embolism).",
        "3–8 seconds: Pull pressure suit helmet visor down and lock seal; activate 100% O2 emergency suit feed at 29.6–40.0 kPa.",
        "If unsuited in station module: Don Portable Breathing Apparatus (PBA) mask, evacuate across nearest hatch, and seal module bulkhead.",
      ],
      medicationsAndHardware: [
        "Intravehicular Pressure Suit (Sokol-KV2 / OCSS) at 40 kPa 100% O2",
        "Airlock Hyperbaric Recompression (2.8 ATA / Treatment Table 6) for arterial gas embolism or ebullism",
        "Dexamethasone 8 mg IV + 100% O2 for barotrauma pulmonary edema",
      ],
      hermesAutomatedAction:
        "Hermes MED-SENTINEL & ECLSS detect cabin dP/dt > 0.5 kPa/s or Xiaomi Watch H1 SpO2 drop < 88%, instantly closing pyrotechnic/solenoid hull equalization valves in 40 ms and flooding crew suits with 100% O2.",
    },
  },
  {
    id: "soyuz-39-salyut-6-mongolia-1981",
    missionName: "Soyuz 39 / Salyut 6  •  Cephalad Fluid Shift & Neuro-Vestibular Adaptation",
    date: "22–30 March 1981",
    agency: "Mongolian Academy of Sciences (MAS) & Soviet Interkosmos",
    countryCode: "MN / USSR",
    crew: ["Jügderdemidiin Gürragchaa (Mongolia)", "Vladimir Dzhanibekov (USSR)"],
    category: "CARDIOVASCULAR_0G",
    severity: "CRITICAL_MEDICAL_DISCOVERY",
    measuredMetrics: [
      { label: "Mission Duration & Orbits", value: "7d 20h 42m (124 Orbits)" },
      { label: "Cephalad Blood Shift", value: "+1,650 mL to Thorax/Head" },
      { label: "SMS Reduction via Vorotnik", value: "-64% Vestibular Nausea" },
      { label: "Cumulative Pille TLD Dose", value: "1.48 mSv (188 µSv/day)" },
    ],
    whatHappened:
      "During Mongolia's historic Soyuz 39 mission to Salyut 6, Cosmonaut Jügderdemidiin Gürragchaa and Commander Vladimir Dzhanibekov investigated acute microgravity fluid redistribution, neuro-vestibular Space Motion Sickness (SMS), and circadian rhythm drift across 124 orbits. Upon entering 0G, loss of hydrostatic gravity shifted ~1.65 liters of blood from the legs into the chest and head, causing facial edema, nasal congestion, elevated intracranial pressure, and vestibular conflict.",
    scientificMechanism:
      "In microgravity (g → 0), the hydrostatic pressure gradient disappears. Venous capacitance vessels in the legs empty into the central circulation, stretching atrial receptors (suppressing ADH/aldosterone → Gauer-Henry diuresis) while uncalibrated otolith signals conflict with visual cues during head pitch/yaw movements.",
    howToPreventAndSurvive: {
      beforeMissionOrInOrbit: [
        "Apply the Mongolian-Soviet 'Vorotnik' (Воротник) pneumatic cervical collar during the first 72 hours in orbit to provide calibrated axial neck counter-pressure and dampen vestibular-ocular reflex over-excitation.",
        "Wear 'Braslet-M' femoral venous occlusion cuffs (30–40 mmHg) on upper thighs to trap 400–600 mL of venous blood in the lower extremities.",
      ],
      immediateEmergencyActions: [
        "Monitor stroke volume and cranial pulse blood filling via Kubicek impedance rheography ('Krovoobrashcheniye' protocol) and Xiaomi Watch H1 HRV.",
        "Before Earth return: Execute 2-hour 'Chibis' Lower Body Negative Pressure (-35 mmHg) + oral isotonic fluid-salt loading (1.0 L water + 9g NaCl) to prevent post-landing orthostatic syncope.",
      ],
      medicationsAndHardware: [
        "Vorotnik Cervical Counter-Pressure Collar & Braslet-M Thigh Cuffs",
        "Chibis-M LBNP Vacuum Suit (-25 to -50 mmHg)",
        "Promethazine 25 mg IM or Scopolamine 0.4 mg + Dextroamphetamine 5 mg (if severe SMS persists)",
      ],
      hermesAutomatedAction:
        "Hermes MED-SENTINEL computes Kubicek rheographic stroke volume & MAP from Xiaomi Watch H1 telemetry, prescribing exact Braslet-M cuff pressure and Chibis LBNP negative pressure cycles.",
    },
  },
  {
    id: "apollo-13-cryo-rupture-1970",
    missionName: "Apollo 13  •  Service Module O2 Tank Explosion, CO2 Toxicity & Hypothermia",
    date: "13–17 April 1970",
    agency: "NASA (Johnson Space Center)",
    countryCode: "USA",
    crew: ["Jim Lovell", "Jack Swigert", "Fred Haise"],
    category: "FIRE_TOXIC_ATMOSPHERE",
    severity: "LIFE_THREATENING_NEAR_MISS",
    measuredMetrics: [
      { label: "Distance from Earth at Failure", value: "321,860 km (Cislunar)" },
      { label: "Cabin Partial Pressure CO2", value: "14.8 mmHg (Toxic Threshold)" },
      { label: "Cabin Temperature Drop", value: "3.3 °C (38 °F)" },
      { label: "PC+2 Abort Burn Δv", value: "263.2 m/s (LM Descent Engine)" },
    ],
    whatHappened:
      "At 55 hours 54 minutes Mission Elapsed Time (321,860 km from Earth), a routine cryogenic stir ignited damaged Teflon insulation inside Service Module Oxygen Tank 2, rupturing Tank 2 and causing Tank 1 to leak away. Deprived of Command Module fuel-cell electricity, water, and O2, the crew powered down Odyssey and used the Lunar Module Aquarius as a lifeboat. Cabin CO2 rose toward lethal levels (14.8 mmHg) because square CM LiOH canisters did not fit round LM receptacles, cabin temperature fell to 3.3°C, and severe water rationing caused Fred Haise to develop an acute urinary tract / kidney infection.",
    scientificMechanism:
      "Inspired CO2 above 10–15 mmHg causes hypercapnic acidosis, cerebral vasodilation, severe frontal headaches, tremors, and fatal narcosis above 40 mmHg. Simultaneously, hypothermia (3°C ambient) triggers peripheral vasoconstriction and cold diuresis, while dehydration causes urinary stasis and ascending bacterial pyelonephritis.",
    howToPreventAndSurvive: {
      beforeMissionOrInOrbit: [
        "Standardize universal CO2 scrubber canister geometry and install regenerable dual-bed amine vacuum-swing CO2 scrubbers with cross-module ducting.",
        "Maintain independent battery/RTG emergency survival heaters and never restrict astronaut water intake below 1.5 L/day.",
      ],
      immediateEmergencyActions: [
        "Trajectory Abort: Execute a Pericynthion Free-Return + PC+2 Abort Burn to accelerate Earth return and target the 62.4 km atmospheric entry corridor.",
        "CO2 Scrubbing: Engage backup LiOH manifold immediately when cabin pCO2 exceeds 4.0 mmHg.",
        "Clinical Care: Administer oral Levofloxacin 500 mg q24h + Potassium Citrate 20 mEq + warmed isotonic hydration for urinary tract infection.",
      ],
      medicationsAndHardware: [
        "Cross-Module LiOH / Amine CO2 Scrubber Adapter",
        "Levofloxacin 500 mg PO / Ceftriaxone 1 g IV (for urosepsis/pyelonephritis)",
        "Ketorolac 15 mg IV/IM + Active Liquid Cooling & Warming Garment (LCWG)",
      ],
      hermesAutomatedAction:
        "Hermes NAV-PILOT automatically solves the cislunar Lambert Free-Return trajectory (Δv, burn duration, entry angle γ = -6.18°) and switches ECLSS to cross-module CO2 scrubbing.",
    },
  },
  {
    id: "mir-eo23-fire-1997",
    missionName: "Mir EO-23  •  Solid-Fuel Oxygen Generator (Vika TGK) Blowtorch Fire",
    date: "23 February 1997",
    agency: "Roscosmos & NASA (Phase 1 Shuttle-Mir)",
    countryCode: "RU / USA",
    crew: [
      "Valeri Korzun",
      "Aleksandr Kaleri",
      "Jerry Linenger (NASA Flight Surgeon)",
      "Vasily Tsibliyev",
      "Aleksandr Lazutkin",
      "Reinhold Ewald (ESA/DLR)",
    ],
    category: "FIRE_TOXIC_ATMOSPHERE",
    severity: "LIFE_THREATENING_NEAR_MISS",
    measuredMetrics: [
      { label: "Flame Temperature", value: "600+ °C Molten Metal Jet" },
      { label: "Burn Duration", value: "14 Minutes Continuous" },
      { label: "Cabin Visibility", value: "< 0.3 meters (Dense Smoke)" },
      { label: "Escape Soyuz Blocked", value: "1 of 2 Soyuz Cut Off by Fire" },
    ],
    whatHappened:
      "With 6 crewmembers aboard Mir, a lithium perchlorate (LiClO4) 'Vika' oxygen-generating cartridge in the Kvant-1 module contaminated with a shred of rubber glove erupted into a violent, self-oxidizing 600°C blowtorch flame. Because the cartridge generates its own oxygen, water-based extinguishers could not smother it immediately. Dense, toxic smoke filled the entire station for 14 minutes, blocking the Kvant-1 docking port to one of the two Soyuz return capsules.",
    scientificMechanism:
      "In microgravity, buoyancy convection does not exist, so hot smoke and toxic combustion gases (CO, HCl, metal particulates) do not rise to the ceiling • they form stationary, expanding spheres pushed directly into crew breathing zones by station ventilation fans. Self-oxidizing perchlorate fires cannot be starved of external O2.",
    howToPreventAndSurvive: {
      beforeMissionOrInOrbit: [
        "Store and operate solid-fuel oxygen generators inside fireproof, vacuum-ventable containment housings away from Soyuz/Dragon escape hatches.",
        "Pre-check Portable Breathing Apparatus (PBA) O2 pin mechanisms weekly (on Mir, several PBAs failed to release oxygen when pulled).",
      ],
      immediateEmergencyActions: [
        "Step 1 (< 5 sec): Cut module ventilation fans immediately so airflow does not spread smoke and molten droplets across modules.",
        "Step 2: Don full-face Portable Breathing Apparatus (PBA) mask BEFORE approaching fire.",
        "Step 3: Cool surrounding aluminum hull walls with fine-water mist / foam extinguishers to prevent hull burn-through while isolating power buses.",
      ],
      medicationsAndHardware: [
        "Full-Face Portable Breathing Apparatus (PBA) with 100% O2",
        "Fine-Water Mist / CO2 Spacecraft Fire Extinguisher",
        "100% High-Flow O2 + Hydroxocobalamin 5 g IV + Salbutamol MDI (for smoke/cyanide/CO inhalation)",
      ],
      hermesAutomatedAction:
        "Hermes cuts inter-module ventilation fans within 50 ms of smoke/CO detection, illuminates emergency egress LEDs to both escape vehicles, and monitors crew SpO2/HR via Xiaomi Watch H1.",
    },
  },
  {
    id: "iss-eva23-parmitano-water-2013",
    missionName: "ISS Expedition 36 (EVA-23)  •  Spacesuit Helmet Water Intrusion",
    date: "16 July 2013",
    agency: "ESA (Italy ASI) & NASA",
    countryCode: "ESA / IT / USA",
    crew: ["Luca Parmitano (ESA/ASI)", "Chris Cassidy (NASA)"],
    category: "EVA_SUIT_EMERGENCY",
    severity: "LIFE_THREATENING_NEAR_MISS",
    measuredMetrics: [
      { label: "Water Volume in Helmet", value: "1.5 Liters in 0G" },
      { label: "Bond Number (Bo = ρgL²/σ)", value: "≈ 0.00 (Surface Tension Dominated)" },
      { label: "Audio & Vision Status", value: "Complete Loss during Egress" },
      { label: "Airlock Repressurization", value: "Emergency Expedited" },
    ],
    whatHappened:
      "Forty-four minutes into EVA-23 outside the International Space Station, Italian ESA astronaut Luca Parmitano reported water accumulating at the back of his head inside his EMU spacesuit helmet. Inorganic silicate contamination had clogged the water separator drum holes, routing 1.5 liters of cooling water directly into the helmet air duct. With zero gravity to pull the water downward, surface tension caused the liquid to creep over his scalp, eyes, ears, and nose, blinding him and shorting out his microphone/earphones as the station passed into orbital night.",
    scientificMechanism:
      "In microgravity, the Bond number (ratio of gravitational to capillary forces) approaches zero. Water forms cohesive films that adhere to hydrophilic skin and mucous membranes, creeping directly into the nostrils and mouth upon inhalation and threatening asphyxiation inside a sealed helmet.",
    howToPreventAndSurvive: {
      beforeMissionOrInOrbit: [
        "Install a hydrophobic Helmet Absorption Pad (HAP) at the rear ventilation T-duct and a breath-actuated EVA helmet snorkel reaching the lower suit torso.",
        "Filter cooling loop water with deionizing/silicate-trapping cartridges prior to every EVA.",
      ],
      immediateEmergencyActions: [
        "Abort EVA immediately at the first detection of free moisture inside the helmet (never assume it is a minor drink-bag leak).",
        "Keep head still to minimize capillary sloshing across the face; breathe slowly through the mouth or emergency snorkel.",
        "Use physical safety tether hand-over-hand to return to the airlock if blinded, open the helmet purge valve to displace water from the oral airway, and execute emergency airlock repressurization.",
      ],
      medicationsAndHardware: [
        "EVA Helmet Absorption Pad (HAP) & Emergency Breathing Snorkel",
        "Helmet Purge Valve Override",
        "Suction catheter + PEEP airway support in Quest Airlock post-ingress",
      ],
      hermesAutomatedAction:
        "Hermes monitors suit fan current, humidity, and Xiaomi Watch H1 stress/HR, triggering an automatic EVA Abort beacon and pre-pressurizing the airlock transfer chamber.",
    },
  },
  {
    id: "apollo-aug-1972-solar-storm",
    missionName: "Apollo 16–17 Inter-Mission Extreme Solar Particle Event (SPE Superstorm)",
    date: "4–7 August 1972",
    agency: "NASA & NOAA Space Weather Prediction Center",
    countryCode: "USA",
    crew: ["Uncrewed Window Between Apollo 16 (Apr 1972) & Apollo 17 (Dec 1972)"],
    category: "RADIATION_SPE",
    severity: "CRITICAL_MEDICAL_DISCOVERY",
    measuredMetrics: [
      { label: "Unshielded EVA Skin Dose", value: "~4,000 mSv (4.0 Sv)" },
      { label: "Inside Apollo CM Hull (BFO)", value: "~400–1,100 mSv in 16 hrs" },
      { label: "CME Transit Time (Sun→Earth)", value: "14.6 Hours (Fastest Recorded)" },
      { label: "Proton Flux (≥10 MeV)", value: "> 60,000 PFU" },
    ],
    whatHappened:
      "Just 14 weeks after Apollo 16 returned from the Moon and 4 months before Apollo 17 launched, solar active region McMath 11976 unleashed the fastest Coronal Mass Ejection (14.6 hours Sun-to-Earth) and highest-energy solar proton storm of the space age. Dosimetric reconstruction showed that an astronaut caught on a lunar surface EVA or in a lightly shielded Lunar Module would have absorbed ~4,000 mSv to the skin and >400–1,000 mSv to bone marrow within 16 hours • inducing acute radiation vomiting, severe hematopoietic neutropenia, and potentially fatal Acute Radiation Syndrome (ARS).",
    scientificMechanism:
      "High-energy solar protons (30–200 MeV) penetrate thin aluminum hulls (2–7 g/cm²), causing dense ionization tracks that shatter DNA double strands in rapidly dividing hematopoietic stem cells and intestinal crypt cells, with lymphocyte counts plummeting 50–80% within 24–48 hours (Andrews nomogram).",
    howToPreventAndSurvive: {
      beforeMissionOrInOrbit: [
        "Continuous real-time solar proton monitoring (NOAA GOES ≥10 MeV flux + onboard silicon/Liulin active spectrometers).",
        "Designate a heavily shielded Polyethylene / Potable Water-Wall Storm Shelter (>35 g/cm² hydrogen-rich areal density) in the core module.",
      ],
      immediateEmergencyActions: [
        "Spacecraft Attitude: Slew spacecraft 180° Tail-to-Sun so the main propulsion engines, fuel tanks, and heatshield absorb the incoming proton beam.",
        "Crew Shelter: Retreat immediately into the Water-Wall Storm Shelter and don the Israeli-German 'AstroRad' selective bone-marrow shielding vest.",
        "Pharmacological Prophylaxis: Take Soviet/Roscosmos Indralin B-190 (450 mg PO, DRF = 1.45) + Ondansetron (8 mg ODT) before peak proton arrival; start Filgrastim G-CSF (300 µg SC daily) if blood-forming organ dose exceeds 500 mSv.",
      ],
      medicationsAndHardware: [
        "Indralin B-190 (450 mg PO  •  Soviet/Roscosmos α1-adrenomimetic radioprotectant)",
        "Filgrastim / Neupogen (G-CSF 300 µg SC) + Ondansetron 8 mg ODT",
        "AstroRad Selective Bone-Marrow Vest + Water-Wall Storm Shelter (>35 g/cm²)",
      ],
      hermesAutomatedAction:
        "Hermes RAD-GUARD & NAV-PILOT continuously poll live NOAA GOES proton flux and ship dosimeters; when flux > 10 PFU or dose rate > 100 µSv/h, Hermes autonomously rotates the ship Tail-to-Sun and locks in Storm Shelter mode.",
    },
  },
  {
    id: "soyuz-33-bulgaria-ballistic-1979",
    missionName: "Soyuz 33  •  Main Engine Burn-Through & 9G Ballistic Re-Entry",
    date: "10–12 April 1979",
    agency: "Bulgarian Academy of Sciences & Soviet Interkosmos",
    countryCode: "BG / USSR",
    crew: ["Georgi Ivanov (Bulgaria)", "Nikolai Rukavishnikov (USSR)"],
    category: "BALLISTIC_REENTRY_TRAUMA",
    severity: "LIFE_THREATENING_NEAR_MISS",
    measuredMetrics: [
      { label: "Backup Engine Over-Burn", value: "213 sec (+25 sec Excess)" },
      { label: "Peak Re-Entry Deceleration", value: "8.9 to 10.0 G (+Gx)" },
      { label: "Crew Heart Rate at Peak G", value: "158–172 BPM" },
      { label: "Docking Status", value: "Aborted at 1,000 m from Salyut 6" },
    ],
    whatHappened:
      "During final approach to Salyut 6, the Soyuz 33 KTDU-35 main engine suffered a lateral combustion chamber failure, forcing an immediate mission abort. During the de-orbit burn to return to Earth, the backup engine produced insufficient thrust and failed to shut down at the planned 188 seconds, burning for 213 seconds until Commander Rukavishnikov and Cosmonaut Georgi Ivanov manually cut it off. The excess Δv threw the capsule into a steep 9–10G ballistic re-entry trajectory.",
    scientificMechanism:
      "Sustained chest-to-back (+Gx) acceleration above 8G compresses the anterior thoracic wall, restricts diaphragmatic excursion, collapses posterior basal pulmonary alveoli (right-to-left shunting and arterial hypoxemia), and places extreme preload/afterload stress on the myocardium.",
    howToPreventAndSurvive: {
      beforeMissionOrInOrbit: [
        "Closed-loop accelerometer burn cutoff (integrating actual Δv in m/s rather than relying solely on a fixed timer).",
        "Couple spacecraft entry guidance (bank-angle lift vector modulation) directly to crew cardiovascular telemetry.",
      ],
      immediateEmergencyActions: [
        "Switch entry guidance from pure ballistic spin to active Lift-Vector Bank Modulation to flatten flight path angle γ and cap peak deceleration below 3.5G (or < 2.2G if crew is injured).",
        "Perform rhythmic thoracic/abdominal straining maneuvers and breathe 100% O2 under positive pressure during peak G.",
      ],
      medicationsAndHardware: [
        "Custom-Molded Kazbek Shock-Absorbing Seat Liner",
        "100% O2 Suit Feed during De-orbit & Re-entry",
        "Hermes NAV-PILOT Medically-Capped Bank-Angle Guidance",
      ],
      hermesAutomatedAction:
        "Hermes NAV-PILOT integrates actual IMU Δv in real time to cut off faulty thrusters and modulates re-entry roll/lift to cap peak G-load based on Xiaomi Watch H1 HR, MAP, and SpO2.",
    },
  },
  {
    id: "iss-jugular-thrombosis-2019",
    missionName: "ISS Expedition  •  Zero-G Internal Jugular Venous Thrombosis (JVT)",
    date: "2019 (Published NEJM 2020)",
    agency: "NASA, ESA & Canadian Space Agency",
    countryCode: "USA / ESA / CA",
    crew: ["ISS Long-Duration Crewmember (Day 50 of 6-Month Mission)"],
    category: "CARDIOVASCULAR_0G",
    severity: "CRITICAL_MEDICAL_DISCOVERY",
    measuredMetrics: [
      { label: "Detection Timing", value: "Flight Day 50 (Ultrasound)" },
      { label: "Vein Lumen Occlusion", value: "> 80% Left Internal Jugular" },
      { label: "Anticoagulation Regimen", value: "Enoxaparin → Apixaban" },
      { label: "Pre-Landing Hold Window", value: "96 Hours Before Re-entry" },
    ],
    whatHappened:
      "During a routine vascular ultrasound examination on Flight Day 50 aboard the ISS, a healthy astronaut with no prior clotting history was found to have an occlusive deep vein thrombosis (blood clot) in the left internal jugular vein, accompanied by stagnant/retrograde venous flow in 6 of 11 other astronauts studied • revealing a previously unrecognized life-threatening risk of pulmonary embolism and cerebral venous thrombosis in microgravity.",
    scientificMechanism:
      "Without gravity to drain blood from the head to the heart, internal jugular vein pressure doubles while flow velocity becomes sluggish, bidirectional, or stagnant. Combined with microgravity-induced plasma volume contraction (hemoconcentration) and endothelial activation, this completes Virchow's triad in the neck veins.",
    howToPreventAndSurvive: {
      beforeMissionOrInOrbit: [
        "Perform monthly L12-5 MHz vascular Doppler ultrasound of bilateral internal jugular veins on all long-duration missions.",
        "Use daily Russian Chibis LBNP (-25 mmHg) or Braslet-M thigh cuffs to restore downward cranial venous outflow.",
      ],
      immediateEmergencyActions: [
        "Initiate therapeutic anticoagulation immediately: Enoxaparin 1.5 mg/kg SC once daily (40 days), transitioning to oral Apixaban 5 mg twice daily.",
        "CRITICAL RE-ENTRY RULE: Discontinue anticoagulants 72–96 hours prior to atmospheric re-entry and landing so high-G deceleration trauma does not cause fatal intracranial hemorrhage.",
      ],
      medicationsAndHardware: [
        "Enoxaparin (Lovenox) 1.5 mg/kg SC Syringes",
        "Apixaban (Eliquis) 5 mg Tablets + Protamine Sulfate / Andexanet Alfa reversal",
        "Chibis LBNP & High-Frequency Vascular Ultrasound Probe",
      ],
      hermesAutomatedAction:
        "Hermes MED-SENTINEL tracks cephalad fluid shift index, pulse transit time, and anticoagulation washout countdown before authorizing high-G Earth return burns.",
    },
  },
];
