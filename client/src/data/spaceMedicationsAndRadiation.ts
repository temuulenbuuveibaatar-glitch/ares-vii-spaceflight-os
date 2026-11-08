export type SpaceMedCategory =
  | "radioprotectant_ars"
  | "bone_calcium"
  | "neuro_ocular_vestibular"
  | "behavioral_circadian"
  | "cardiovascular_acls"
  | "analgesic_anesthetic"
  | "antibiotic_antimicrobial";

export type RadiationStabilityRating =
  | "High (GCR/SPE Stable > 36 mo)"
  | "Moderate (Shielded Foil Required, 18–24 mo)"
  | "Sensitive (Radiolysis-Prone / Cold-Chain Required)";

export interface SpaceMedication {
  id: string;
  name: string;
  genericName: string;
  category: SpaceMedCategory;
  categoryLabel: string;
  spaceIndication: string;
  terrestrialIndication: string;
  dosage: string;
  route: string;
  microgravityPharmacokinetics: string;
  radiationStability: string;
  radiationStabilityRating: RadiationStabilityRating;
  sideEffects: string[];
  contraindications: string[];
  kitLocation: string;
}

export interface SpaceRadiationType {
  id: string;
  name: string;
  shortCode: string;
  composition: string;
  energyRange: string;
  linearEnergyTransfer: string;
  qualityFactorQ: string;
  primarySource: string;
  biologicalMechanism: string;
  spacecraftPenetrationAndSecondaryHazard: string;
  optimalCountermeasure: string;
}

export interface RadiationDoseBenchmark {
  id: string;
  eventOrMission: string;
  effectiveDosemSv: number;
  doseDisplay: string;
  category: "diagnostic" | "orbital_lunar" | "deep_space" | "regulatory_limit" | "ars_threshold";
  clinicalAndOperationalImpact: string;
}

export interface ShieldingMaterialSpec {
  id: string;
  materialName: string;
  chemicalFormula: string;
  atomicNumberEffectiveZ: string;
  densityGPerCm3: number;
  hydrogenMassFractionPercent: number;
  gcrAttenuationEfficiencyScore: number; // 0-100
  speProtonStoppingScore: number; // 0-100
  secondaryBremsstrahlungNeutronRisk: "Minimal" | "Low" | "Moderate" | "High (Dangerous)";
  massPenaltyFactor: number; // relative attenuation multiplier per g/cm2
  engineeringNotes: string;
}

export interface OrganSusceptibilitySpec {
  id: string;
  organOrTissue: string;
  icrpTissueWeightingFactorWT: number;
  thresholdDoseAcuteGy: string;
  spaceflightManifestation: string;
  cellularTarget: string;
  medicalCountermeasure: string;
}

export const spaceMedicationCategories: {
  id: SpaceMedCategory | "all";
  label: string;
}[] = [
  { id: "all", label: "All Deep-Space Formulary (31)" },
  { id: "radioprotectant_ars", label: "Radioprotectants & ARS Countermeasures" },
  { id: "cardiovascular_acls", label: "0G Cardiovascular, ACLS & Anticoagulation" },
  { id: "neuro_ocular_vestibular", label: "SANS, ICP & Space Motion Sickness" },
  { id: "bone_calcium", label: "Osteoclast Inhibition & Renal Stone Prevention" },
  { id: "behavioral_circadian", label: "Circadian, Sleep & Deep-Space Behavioral" },
  { id: "analgesic_anesthetic", label: "Emergency Analgesics & Dissociative Anesthesia" },
  { id: "antibiotic_antimicrobial", label: "Spaceflight Antimicrobials (Enhanced Virulence)" },
];

export const spaceMedicationsDatabase: SpaceMedication[] = [
  // ============================================================================
  // 1. RADIOPROTECTANTS & ARS COUNTERMEASURES
  // ============================================================================
  {
    id: "filgrastim-gcsf",
    name: "Filgrastim / Neupogen (G-CSF)",
    genericName: "Recombinant Methionyl Human Granulocyte Colony-Stimulating Factor",
    category: "radioprotectant_ars",
    categoryLabel: "Radioprotectants & ARS Countermeasures",
    spaceIndication:
      "Hematopoietic Acute Radiation Syndrome (H-ARS) following unshielded Solar Particle Event (SPE) exposure >= 1.5–2.0 Gy; accelerates neutrophil recovery and reduces lethal sepsis mortality.",
    terrestrialIndication:
      "Chemotherapy-induced febrile neutropenia, bone marrow transplant mobilization, and acute radiation injury.",
    dosage:
      "10 mcg/kg Subcutaneous (SC) once daily starting within 24 hours of SPE radiation exposure; continue until Absolute Neutrophil Count (ANC) > 1,000/µL for 3 consecutive days.",
    route: "Subcutaneous Injection (Prefilled Zero-G Needle-Safe Syringe)",
    microgravityPharmacokinetics:
      "Cephalad fluid shift reduces lower-extremity subcutaneous perfusion by ~25% while increasing deltoid/thoracic SC blood flow; administer into upper arm or anterior abdominal wall for predictable Cmax. Renal clearance of G-CSF is transiently elevated during the first 72h of weightlessness due to hyperfiltration.",
    radiationStability:
      "Liquid protein formulation is highly susceptible to HZE cosmic-ray free-radical oxidation of methionine residues (Met-1, Met-127, Met-138) in aqueous solution. Must be stored in refrigerated (+2°C to +8°C) HDPE-shielded bio-locker or as lyophilized powder for Mars transit.",
    radiationStabilityRating: "Sensitive (Radiolysis-Prone / Cold-Chain Required)",
    sideEffects: [
      "Medullary bone pain (iliac crest/sternum osteoclastic/myeloid expansion)",
      "Transient splenomegaly",
      "Injection site erythema",
      "Mild elevation of alkaline phosphatase and LDH",
    ],
    contraindications: [
      "Known hypersensitivity to E. coli-derived biologic proteins",
      "Concomitant administration during active peak proton flux (wait until storm shelter dose rate < 5 mSv/hr)",
    ],
    kitLocation: "Radiation Storm Shelter Med Locker (Cold-Chain Bio-Vault)",
  },
  {
    id: "pegfilgrastim-neulasta",
    name: "Pegfilgrastim (Neulasta)",
    genericName: "PEGylated Recombinant Human Granulocyte Colony-Stimulating Factor",
    category: "radioprotectant_ars",
    categoryLabel: "Radioprotectants & ARS Countermeasures",
    spaceIndication:
      "Single-dose sustained hematopoietic rescue after high-dose Solar Particle Event (SPE > 2.0 Gy) when crew medical workload or limited syringe inventory precludes daily injections.",
    terrestrialIndication:
      "Prophylaxis of febrile neutropenia and treatment of Hematopoietic Acute Radiation Syndrome.",
    dosage:
      "6 mg Subcutaneous x 1 dose immediately (within 24h post-SPE), followed by a second 6 mg SC dose 7 days later.",
    route: "Subcutaneous Injection",
    microgravityPharmacokinetics:
      "20 kDa polyethylene glycol (PEG) conjugation prevents renal glomerular filtration; clearance is strictly neutrophil-receptor mediated (self-regulating PK as neutrophil counts recover), making it resilient to microgravity renal hemodynamic fluctuations.",
    radiationStability:
      "PEG chain cleavage and protein aggregation can occur under chronic Galactic Cosmic Ray (GCR) secondary neutron bombardment; requires borated-polyethylene thermal cold storage.",
    radiationStabilityRating: "Sensitive (Radiolysis-Prone / Cold-Chain Required)",
    sideEffects: [
      "Diffuse medullary bone ache (manage with Acetaminophen)",
      "Leukocytosis upon marrow recovery",
      "Rare capillary leak syndrome",
    ],
    contraindications: ["Hypersensitivity to pegfilgrastim or filgrastim"],
    kitLocation: "Radiation Storm Shelter Med Locker (Cold-Chain Bio-Vault)",
  },
  {
    id: "amifostine-wr2721",
    name: "Amifostine (WR-2721 / Ethyol)",
    genericName: "S-2-(3-Aminopropylamino)ethyl Phosphorothioic Acid",
    category: "radioprotectant_ars",
    categoryLabel: "Radioprotectants & ARS Countermeasures",
    spaceIndication:
      "Acute cytoprotective free-radical scavenger administered immediately prior to mandatory emergency EVA during an active Solar Particle Event or nuclear thermal propulsion (NTP) reactor anomaly.",
    terrestrialIndication:
      "Cytoprotection against cisplatin nephrotoxicity and radiation-induced xerostomia in head/neck radiotherapy.",
    dosage:
      "200 mg/m² slow IV infusion over 15 minutes (or 500 mg Subcutaneous split into 2 sites) 15–30 minutes before acute radiation exposure, co-administered with Ondansetron 8 mg + 500 mL pressurized NS bolus.",
    route: "Pressurized IV or Subcutaneous",
    microgravityPharmacokinetics:
      "Prodrug dephosphorylated by membrane-bound alkaline phosphatase into the active free thiol metabolite WR-1065, which scavenges hydroxyl radicals ($\cdot\text{OH}$) and donates hydrogen atoms to repair carbon-centered DNA radicals. IMPORTANT: Amifostine causes alpha-adrenergic vasodilation; in astronauts with 15% spaceflight hypovolemia and baroreceptor deconditioning, IV infusion can precipitate profound hypotension unless supine on the CMRS with pressurized saline loading.",
    radiationStability:
      "Crystalline lyophilized thiol prodrug is stable for > 36 months when sealed under dry nitrogen in amber glass vials away from oxygen.",
    radiationStabilityRating: "High (GCR/SPE Stable > 36 mo)",
    sideEffects: [
      "Acute transient hypotension (vasodilatory)",
      "Severe nausea and emesis (requires prophylactic Ondansetron)",
      "Hypocalcemia (inhibits parathyroid hormone secretion)",
      "Flushing and metallic taste",
    ],
    contraindications: [
      "Uncorrected hypovolemia or hypotension",
      "Hypersensitivity to aminothiol compounds",
    ],
    kitLocation: "Radiation Storm Shelter Med Locker",
  },
  {
    id: "potassium-iodide-ki",
    name: "Potassium Iodide (ThyroSafe / Iosat)",
    genericName: "Potassium Iodide (KI)",
    category: "radioprotectant_ars",
    categoryLabel: "Radioprotectants & ARS Countermeasures",
    spaceIndication:
      "Thyroid saturation blockade during Space Fission Surface Power (Kilopower / bimodal nuclear thermal propulsion) fission-product release involving radioactive Iodine-131 ($^{131}\text{I}$).",
    terrestrialIndication:
      "Thyroid blocking agent in nuclear reactor accidents.",
    dosage:
      "130 mg PO once daily (starting ideally 1–2 hours prior to or within 4 hours after radioiodine inhalation); continue daily until cabin air TCCS scrubbing confirms zero I-131.",
    route: "Oral Tablet",
    microgravityPharmacokinetics:
      "Rapidly absorbed in the upper GI tract within 30 minutes despite delayed microgravity gastric emptying; competitively saturates the sodium-iodide symporter (NIS) on thyroid follicular cells and induces the Wolff-Chaikoff effect.",
    radiationStability:
      "Inorganic ionic salt with exceptional resistance to cosmic ionizing radiation (> 5 years shelf life in moisture-proof foil blisters).",
    radiationStabilityRating: "High (GCR/SPE Stable > 36 mo)",
    sideEffects: [
      "Metallic taste and sialadenitis (salivary gland swelling)",
      "Gastrointestinal irritation",
      "Transient hypothyroidism or Jod-Basedow hyperthyroidism",
    ],
    contraindications: [
      "Iodine sensitivity / dermatitis herpetiformis",
      "Hypocomplementemic vasculitis",
      "Note: Does NOT protect against external GCR protons/HZE ions or non-iodine radionuclides",
    ],
    kitLocation: "Radiation Storm Shelter Med Locker",
  },
  {
    id: "prussian-blue-radiogardase",
    name: "Prussian Blue (Radiogardase)",
    genericName: "Insoluble Ferric Hexacyanoferrate(II)",
    category: "radioprotectant_ars",
    categoryLabel: "Radioprotectants & ARS Countermeasures",
    spaceIndication:
      "Internal decorporation of radioactive Cesium-137 ($^{137}\text{Cs}$) or Thallium following nuclear power system or isotopic source breach in closed-loop spacecraft.",
    terrestrialIndication:
      "Internal contamination with radioactive cesium or non-radioactive/radioactive thallium.",
    dosage:
      "3 g (six 500 mg capsules) PO three times daily with meals/water for minimum 30 days; reduces Cs-137 biological half-life from ~110 days down to ~30 days.",
    route: "Oral Capsule",
    microgravityPharmacokinetics:
      "Zero systemic absorption; remains strictly intraluminal within the GI tract where its crystal lattice binds monovalent $^{137}\text{Cs}^+$ ions via ion-exchange, interrupting enterohepatic recirculation. Because microgravity slows colonic transit time by 20–35%, co-administer high fluid/fiber intake to prevent radioactive fecal stasis in the colon.",
    radiationStability:
      "Coordination polymer crystal lattice is virtually unaffected by GCR/SPE radiation doses up to 50 Gy.",
    radiationStabilityRating: "High (GCR/SPE Stable > 36 mo)",
    sideEffects: [
      "Blue discoloration of feces and dentition",
      "Constipation (increases colonic radiation dwell time if untreated)",
      "Mild hypokalemia (binds luminal K+)",
    ],
    contraindications: ["Paralytic ileus or mechanical bowel obstruction"],
    kitLocation: "Radiation Storm Shelter Med Locker",
  },
  {
    id: "ca-zn-dtpa",
    name: "Ca-DTPA & Zn-DTPA",
    genericName: "Pentetate Calcium Trisodium / Pentetate Zinc Trisodium",
    category: "radioprotectant_ars",
    categoryLabel: "Radioprotectants & ARS Countermeasures",
    spaceIndication:
      "Transuranic heavy-metal chelation (Plutonium-238 from Radioisotope Thermoelectric Generators [RTGs] or Americium-241) following rover/lander RTG casing damage or lunar dust inhalation.",
    terrestrialIndication:
      "Internal contamination with transuranium elements (Plutonium, Americium, Curium).",
    dosage:
      "Initial 24 hours: Ca-DTPA 1 g IV over 30 minutes (or nebulized 1 g in 1:1 saline for inhalation exposure). Maintenance (Day 2+): Switch to Zn-DTPA 1 g IV daily to prevent depletion of endogenous zinc and manganese.",
    route: "Pressurized IV or Nebulized Inhalation",
    microgravityPharmacokinetics:
      "Distributes exclusively in extracellular fluid (ECF volume is reduced by ~12–15% in microgravity, yielding slightly higher peak plasma chelate concentrations) and is cleared unchanged by glomerular filtration within 24 hours. Must collect all chelated radioactive urine in shielded LiOH/waste bags—DO NOT recycle through the Urine Processor Assembly (UPA)!",
    radiationStability:
      "Aqueous ampoules show < 3% radiolytic chelate degradation over 36 months when shielded in polyethylene cassettes.",
    radiationStabilityRating: "Moderate (Shielded Foil Required, 18–24 mo)",
    sideEffects: [
      "Depletion of endogenous trace metals (Zn, Mn, Mg) with repeated Ca-DTPA dosing",
      "Nausea, metallic taste, and headache",
      "Bronchospasm when administered via nebulizer",
    ],
    contraindications: [
      "Do not give Ca-DTPA as prolonged maintenance if Zn-DTPA is available (teratogenic/zinc-depleting)",
      "Do not use for Uranium or Neptunium (forms unstable complexes causing renal tubular necrosis)",
    ],
    kitLocation: "Radiation Storm Shelter Med Locker",
  },
  {
    id: "ondansetron-zofran",
    name: "Ondansetron (Zofran ODT / IV)",
    genericName: "Ondansetron Hydrochloride",
    category: "radioprotectant_ars",
    categoryLabel: "Radioprotectants & ARS Countermeasures",
    spaceIndication:
      "First-line control of Prodromal Acute Radiation Syndrome (ARS) emesis during Solar Particle Events, acute Space Adaptation Syndrome (SAS) vomiting, and prevention of lethal vomitus aspiration inside an EVA helmet or storm shelter.",
    terrestrialIndication:
      "Chemotherapy, radiotherapy, and postoperative nausea and vomiting.",
    dosage:
      "8 mg Orally Disintegrating Tablet (ODT) sublingually or 4–8 mg IV every 8 hours (single 16 mg oral dose prior to high-dose radiation exposure).",
    route: "Sublingual ODT or Pressurized IV",
    microgravityPharmacokinetics:
      "Freeze-dried Orally Disintegrating Tablet (ODT) dissolves on the tongue in < 5 seconds without requiring water, bypassing microgravity delayed gastric emptying (gastric stasis during SAS/ARS otherwise delays standard tablet Tmax by > 2 hours). Metabolized by hepatic CYP3A4, CYP1A2, and CYP2D6.",
    radiationStability:
      "Solid ODT blister packs exhibit > 98% chemical potency retention after 30 months on ISS; aqueous IV vials may develop slight yellow radiolytic discoloration without loss of 5-HT3 affinity.",
    radiationStabilityRating: "High (GCR/SPE Stable > 36 mo)",
    sideEffects: [
      "Dose-dependent QTc interval prolongation (monitor on Xiaomi Watch H1 ECG)",
      "Headache and constipation",
      "Transient visual blurring (with rapid IV push)",
    ],
    contraindications: [
      "Congenital long QT syndrome or uncorrected hypokalemia/hypomagnesemia",
      "Concomitant apomorphine use",
    ],
    kitLocation: "Radiation Storm Shelter Med Locker & EVA Airlock Emergency Pouch",
  },

  // ============================================================================
  // 2. BONE & CALCIUM REGULATORS
  // ============================================================================
  {
    id: "zoledronic-acid-reclast",
    name: "Zoledronic Acid (Reclast)",
    genericName: "Zoledronic Acid Monohydrate",
    category: "bone_calcium",
    categoryLabel: "Osteoclast Inhibition & Renal Stone Prevention",
    spaceIndication:
      "Pre-flight and in-flight prevention of microgravity-induced osteoclastic bone loss (1.0–1.5%/month BMD loss in femur/lumbar spine) and secondary hypercalciuric nephrolithiasis on 6–36 month Artemis/Mars missions.",
    terrestrialIndication:
      "Osteoporosis, Paget's disease of bone, and hypercalcemia of malignancy.",
    dosage:
      "5 mg IV infused over >= 15 minutes once every 12 months (typically administered 30 days pre-launch or at 12-month Mars transit mark with 500 mL hydration).",
    route: "Pressurized IV Infusion",
    microgravityPharmacokinetics:
      "Nitrogen-containing bisphosphonate that binds with high affinity to hydroxyapatite crystals at active bone remodeling sites. Inhibits farnesyl pyrophosphate synthase in osteoclasts, inducing osteoclast apoptosis and suppressing urinary calcium excretion by > 40% throughout a 6-month orbital mission.",
    radiationStability:
      "Phosphonate P-C-P backbone is highly resistant to radiolytic cleavage.",
    radiationStabilityRating: "High (GCR/SPE Stable > 36 mo)",
    sideEffects: [
      "Acute-phase flu-like reaction (fever, myalgias, arthralgias for 24–72h post-infusion)",
      "Hypocalcemia if Vitamin D deficient",
      "Rare osteonecrosis of the jaw (complete all dental work prior to mission)",
    ],
    contraindications: [
      "Creatinine clearance < 35 mL/min or acute renal stone obstruction",
      "Uncorrected hypocalcemia",
    ],
    kitLocation: "Deep-Space Chronic & Countermeasure Med Locker",
  },
  {
    id: "alendronate-fosamax",
    name: "Alendronate Sodium (Fosamax)",
    genericName: "Alendronate Sodium",
    category: "bone_calcium",
    categoryLabel: "Osteoclast Inhibition & Renal Stone Prevention",
    spaceIndication:
      "Weekly oral osteoclast inhibitor combined with Advanced Resistive Exercise Device (ARED) loading to preserve trabecular and cortical bone mineral density and reduce urinary calcium supersaturation.",
    terrestrialIndication:
      "Prevention and treatment of osteoporosis.",
    dosage:
      "70 mg PO once weekly upon awakening with 250 mL plain water at least 30 minutes before first food/beverage.",
    route: "Oral Tablet",
    microgravityPharmacokinetics:
      "Oral bioavailability is low (~0.6%) and abolished by food or divalent cations. CRITICAL 0G CAVEAT: On Earth, patients must sit/stand upright for 30 minutes after taking Alendronate to prevent corrosive esophagitis. In microgravity (0G), gravity cannot hold gastric contents down in the stomach—astronauts MUST drink a full 250 mL pouch of water to propel the tablet past the lower esophageal sphincter and avoid Valsalva maneuvers or inverted exercises for 45 minutes.",
    radiationStability:
      "Solid bisphosphonate tablet shows excellent stability (> 36 months) in spaceflight radiation testing.",
    radiationStabilityRating: "High (GCR/SPE Stable > 36 mo)",
    sideEffects: [
      "Reflux esophagitis and esophageal ulceration (elevated risk in 0G due to loss of gravitational gastroesophageal gradient)",
      "Musculoskeletal pain",
      "Dyspepsia",
    ],
    contraindications: [
      "Esophageal stricture, achalasia, or active gastroesophageal reflux in 0G",
      "CrCl < 35 mL/min",
    ],
    kitLocation: "Deep-Space Chronic & Countermeasure Med Locker",
  },
  {
    id: "potassium-citrate-urocit",
    name: "Potassium Citrate (Urocit-K)",
    genericName: "Potassium Citrate Extended-Release",
    category: "bone_calcium",
    categoryLabel: "Osteoclast Inhibition & Renal Stone Prevention",
    spaceIndication:
      "Primary pharmacological countermeasure against microgravity calcium oxalate and uric acid nephrolithiasis; restores urinary citrate and alkalinizes acidic spaceflight urine.",
    terrestrialIndication:
      "Renal tubular acidosis with calcium stones, hypocitraturic calcium oxalate nephrolithiasis.",
    dosage:
      "20 mEq (two 10 mEq / 1,080 mg wax-matrix tablets) PO once or twice daily with meals.",
    route: "Oral Extended-Release Tablet",
    microgravityPharmacokinetics:
      "Absorbed citrate is metabolized hepatically to bicarbonate, raising urinary pH to 6.5–7.0 while un-metabolized filtered citrate chelates free $\text{Ca}^{2+}$ ions into soluble calcium-citrate complexes. Counteracts the spaceflight hypocitraturia caused by high-protein acid-ash space rations and mild intracellular acidosis.",
    radiationStability:
      "Carboxylate salt in carnauba-wax matrix is highly radiation stable (> 36 months); must be protected from high humidity.",
    radiationStabilityRating: "High (GCR/SPE Stable > 36 mo)",
    sideEffects: [
      "GI mucosal irritation, nausea, or loose stools",
      "Hyperkalemia if renal function is impaired",
      "Intact wax ghost matrix excreted in stool (normal finding)",
    ],
    contraindications: [
      "Hyperkalemia (K+ > 5.0 mEq/L) or acute renal failure",
      "Active urinary tract infection with urea-splitting organisms (Proteus)",
    ],
    kitLocation: "Deep-Space Chronic & Countermeasure Med Locker",
  },
  {
    id: "vitamin-d3-k2-complex",
    name: "Cholecalciferol (Vitamin D3) + Menaquinone-7 (Vitamin K2)",
    genericName: "Cholecalciferol 1000 IU + Vitamin K2 (MK-7) 90 mcg",
    category: "bone_calcium",
    categoryLabel: "Osteoclast Inhibition & Renal Stone Prevention",
    spaceIndication:
      "Maintains serum 25(OH)D levels in spacecraft completely devoid of solar UVB radiation (spacecraft windows block all UVB < 315 nm) while Vitamin K2 activates osteocalcin to direct calcium into bone rather than renal/vascular calcification.",
    terrestrialIndication:
      "Vitamin D deficiency and osteopenia prophylaxis.",
    dosage:
      "1,000–2,000 IU Vitamin D3 + 90 mcg Vitamin K2 (MK-7) PO once daily with lipid-containing meal.",
    route: "Oral Softgel / Capsule",
    microgravityPharmacokinetics:
      "Fat-soluble vitamins require bile-salt micellar solubilization; take with meal. Dose is strictly capped at <= 2,000 IU/day in 0G because baseline osteoclastic bone resorption already suppresses endogenous parathyroid hormone (PTH), and excessive Vitamin D3 worsens hypercalciuria.",
    radiationStability:
      "Unsaturated triene and polyisoprenoid side chains are moderately sensitive to lipid peroxidation and cosmic-ray radiolysis; ISS studies show 15–25% potency degradation after 24 months unless packaged with alpha-tocopherol antioxidant in opaque aluminum-foil blisters.",
    radiationStabilityRating: "Moderate (Shielded Foil Required, 18–24 mo)",
    sideEffects: [
      "Hypercalciuria and increased renal stone risk if overdosed (> 4,000 IU/day in 0G)",
    ],
    contraindications: [
      "Hypercalcemia or active acute calcium kidney stone crisis",
      "Concomitant Warfarin anticoagulation (MK-7 antagonizes Vitamin K epoxide reductase)",
    ],
    kitLocation: "Daily Crew Nutritional & Countermeasure Locker",
  },

  // ============================================================================
  // 3. NEURO-OCULAR & VESTIBULAR
  // ============================================================================
  {
    id: "acetazolamide-diamox",
    name: "Acetazolamide (Diamox)",
    genericName: "Acetazolamide",
    category: "neuro_ocular_vestibular",
    categoryLabel: "SANS, ICP & Space Motion Sickness",
    spaceIndication:
      "Treatment of Spaceflight-Associated Neuro-ocular Syndrome (SANS) with Frisén Grade >= 1 optic disc edema, elevated Optic Nerve Sheath Diameter (ONSD > 6.0 mm), and cephalad-shift intracranial hypertension.",
    terrestrialIndication:
      "Idiopathic intracranial hypertension (pseudotumor cerebri), acute angle-closure glaucoma, and high-altitude cerebral/pulmonary edema prophylaxis.",
    dosage:
      "250 mg PO twice daily (may titrate to 500 mg BID under Flight Surgeon OCT/ultrasound monitoring).",
    route: "Oral Tablet",
    microgravityPharmacokinetics:
      "Inhibits carbonic anhydrase (CA-II and CA-IV) in the choroid plexus, decreasing cerebrospinal fluid (CSF) secretion by 30–50% and lowering translaminar optic nerve head pressure. Dual Spaceflight Paradox: While reducing ICP, renal proximal tubular bicarbonate wasting alkalinizes urine and severely reduces urinary citrate excretion—markedly increasing calcium phosphate kidney stone risk in 0G unless paired with aggressive hydration (> 2.5 L/day).",
    radiationStability:
      "Heterocyclic sulfonamide ring is chemically stable under space radiation for > 30 months.",
    radiationStabilityRating: "High (GCR/SPE Stable > 36 mo)",
    sideEffects: [
      "Distal paresthesias ('pins and needles' in fingers/toes)",
      "Dysgeusia (carbonated beverages taste metallic)",
      "Metabolic acidosis, hypokalemia, and hypocitraturic calcium phosphate nephrolithiasis",
      "Polyuria",
    ],
    contraindications: [
      "Active nephrolithiasis or history of calcium phosphate renal stones",
      "Severe sulfa allergy, hypokalemia, or hyponatremia",
    ],
    kitLocation: "ISS Crew Medical Restraint Pack B (Neuro-Ophthalmic Drawer)",
  },
  {
    id: "promethazine-phenergan",
    name: "Promethazine Hydrochloride (IM / Suppository)",
    genericName: "Promethazine Hydrochloride",
    category: "neuro_ocular_vestibular",
    categoryLabel: "SANS, ICP & Space Motion Sickness",
    spaceIndication:
      "Gold-standard NASA rescue therapy for severe Space Adaptation Syndrome (SAS / Space Motion Sickness) during the first 72 hours of orbital insertion or gravitational transition.",
    terrestrialIndication:
      "Severe motion sickness, postoperative nausea/vomiting, and allergic reactions.",
    dosage:
      "25–50 mg Intramuscular (IM) into deltoid or vastus lateralis (or 25 mg rectal suppository) every 8–12 hours as needed; co-administer Dextroamphetamine 5–10 mg PO if daytime operational sedation must be countered.",
    route: "Intramuscular (IM) or Rectal Suppository",
    microgravityPharmacokinetics:
      "During acute Space Motion Sickness, neurovestibular conflict (otolith unloading vs. semicircular canal signals) triggers gastroparesis and retroperistalsis, rendering oral tablets ineffective. IM Promethazine achieves therapeutic central H1 and muscarinic M1 vestibular nucleus blockade within 20 minutes. Remarkable Spaceflight Observation: Astronauts in 0G report significantly less sedation from IM Promethazine compared to ground baseline due to heightened vestibular/sympathetic arousal.",
    radiationStability:
      "Phenothiazine ring undergoes photo-oxidation and radiolytic sulfoxide formation if exposed to UV or unshielded SPE protons; store in light-resistant amber ampoules inside HDPE foam.",
    radiationStabilityRating: "Moderate (Shielded Foil Required, 18–24 mo)",
    sideEffects: [
      "Drowsiness and psychomotor slowing (mitigated by 0G sympathetic state or Scope-Dex)",
      "Dry mouth and blurred vision (anticholinergic)",
      "Rare dystonic extrapyramidal reaction",
      "Severe tissue necrosis if inadvertently injected intra-arterially or subcutaneously",
    ],
    contraindications: [
      "Do NOT administer Subcutaneously or intra-arterially (deep IM only)",
      "Never administer within 24 hours prior to an EVA",
    ],
    kitLocation: "ISS Crew Medical Restraint Pack A & Launch/Entry Suit Medical Kit",
  },
  {
    id: "scopolamine-dextroamphetamine",
    name: "Scope-Dex (Scopolamine + Dextroamphetamine)",
    genericName: "Scopolamine Hydrobromide 0.4 mg + Dextroamphetamine Sulfate 5 mg",
    category: "neuro_ocular_vestibular",
    categoryLabel: "SANS, ICP & Space Motion Sickness",
    spaceIndication:
      "Synergistic prophylaxis and treatment of Space Motion Sickness (SAS) during mission-critical docking, robotic arm operations, or post-landing neurovestibular readaptation without causing sedation.",
    terrestrialIndication:
      "Severe aerospace/maritime motion sickness requiring preserved cognitive vigilance.",
    dosage:
      "0.4 mg Scopolamine + 5 mg Dextroamphetamine PO 1 hour prior to orbital insertion or high-coriolis maneuvers; may repeat every 6 hours for up to 48 hours.",
    route: "Oral Capsule (or Transdermal Scopolamine 1 mg/72h patch + oral Dex)",
    microgravityPharmacokinetics:
      "Scopolamine blocks central muscarinic M1 receptors in the vestibular nuclei and area postrema, while Dextroamphetamine increases synaptic norepinephrine and dopamine in the reticular activating system—both counteracting scopolamine sedation and directly suppressing vestibular sensory conflict.",
    radiationStability:
      "Note: NASA human spaceflight studies found that transdermal Scopolamine patches and combined capsules exhibit accelerated degradation after 18–24 months in space; must be compounded in nitrogen-flushed foil blisters.",
    radiationStabilityRating: "Moderate (Shielded Foil Required, 18–24 mo)",
    sideEffects: [
      "Xerostomia (dry mouth) and mydriasis / cycloplegia (blurred near cockpit vision)",
      "Tachycardia and mild blood pressure elevation",
      "Insomnia if taken within 6 hours of sleep shift",
    ],
    contraindications: [
      "Narrow-angle glaucoma or elevated intraocular pressure",
      "Tachyarrhythmias or structural heart disease",
    ],
    kitLocation: "Launch/Entry & Orbital Insertion Medical Pouch",
  },
  {
    id: "meclizine-antivert",
    name: "Meclizine Hydrochloride (Antivert)",
    genericName: "Meclizine Hydrochloride",
    category: "neuro_ocular_vestibular",
    categoryLabel: "SANS, ICP & Space Motion Sickness",
    spaceIndication:
      "Mild-to-moderate Space Motion Sickness (SAS), neurovestibular Coriolis vertigo, and post-splashdown vestibular disequilibrium.",
    terrestrialIndication:
      "Motion sickness and peripheral vertigo.",
    dosage:
      "25–50 mg PO chewable tablet every 12–24 hours as needed.",
    route: "Oral Chewable Tablet",
    microgravityPharmacokinetics:
      "Piperazine H1 receptor antagonist with lower central anticholinergic toxicity than scopolamine; onset in 1 hour with 12–24 hour duration.",
    radiationStability:
      "Stable solid tablet formulation (> 36 months in spaceflight packaging).",
    radiationStabilityRating: "High (GCR/SPE Stable > 36 mo)",
    sideEffects: ["Mild drowsiness", "Dry mouth", "Fatigue"],
    contraindications: ["Hypersensitivity to piperazine antihistamines"],
    kitLocation: "ISS Crew Medical Restraint Pack B",
  },

  // ============================================================================
  // 4. BEHAVIORAL, SLEEP & CIRCADIAN
  // ============================================================================
  {
    id: "modafinil-provigil",
    name: "Modafinil (Provigil)",
    genericName: "Modafinil",
    category: "behavioral_circadian",
    categoryLabel: "Circadian, Sleep & Deep-Space Behavioral",
    spaceIndication:
      "Countermeasure for acute circadian slam-shifts, extended emergency EVA/docking operations, and fatigue-induced cognitive performance degradation during 24+ hour spacecraft contingencies.",
    terrestrialIndication:
      "Narcolepsy, shift-work disorder, and obstructive sleep apnea residual sleepiness.",
    dosage:
      "100–200 mg PO once at the start of an emergency duty shift (or split 100 mg + 100 mg 4 hours apart).",
    route: "Oral Tablet",
    microgravityPharmacokinetics:
      "Non-amphetamine eugeroic wakefulness agent acting via weak dopamine transporter (DAT) inhibition and orexin/histamine activation in the tuberomammillary nucleus. Preserves executive function, reaction time, and manual docking accuracy in sleep-deprived astronauts without the rebound hypersomnia or cardiovascular sympathomimetic surge of amphetamines.",
    radiationStability:
      "Sulfinyl acetamide structure is highly stable under GCR radiation (> 36 months).",
    radiationStabilityRating: "High (GCR/SPE Stable > 36 mo)",
    sideEffects: [
      "Headache and mild anxiety",
      "Insomnia if administered < 10 hours before scheduled sleep",
      "Rare Stevens-Johnson syndrome",
    ],
    contraindications: [
      "Left ventricular hypertrophy or acute arrhythmia",
      "History of modafinil-induced rash",
    ],
    kitLocation: "Crew Sleep & Circadian Countermeasure Kit",
  },
  {
    id: "tasimelteon-hetlioz",
    name: "Tasimelteon (Hetlioz)",
    genericName: "Tasimelteon",
    category: "behavioral_circadian",
    categoryLabel: "Circadian, Sleep & Deep-Space Behavioral",
    spaceIndication:
      "Master circadian pacemaker entrainment to the 24.0-hour GMT orbital schedule (despite 90-minute sunrises) or the 24-hour 39-minute Martian Sol ('Non-24' circadian desynchrony).",
    terrestrialIndication:
      "Non-24-Hour Sleep-Wake Disorder (Non-24).",
    dosage:
      "20 mg PO 30–60 minutes prior to target bedtime on an empty stomach.",
    route: "Oral Capsule",
    microgravityPharmacokinetics:
      "High-affinity dual Melatonin $\text{MT}_1$ and $\text{MT}_2$ receptor agonist in the suprachiasmatic nucleus (SCN) with higher $\text{MT}_2$ phase-shifting selectivity and longer half-life (~1.3–3.7h) than exogenous melatonin. High-fat space rations delay Cmax by ~1.7 hours; administer fasting.",
    radiationStability:
      "Dihydrobenzofuran carboxamide core is stable for > 36 months in opaque blisters.",
    radiationStabilityRating: "High (GCR/SPE Stable > 36 mo)",
    sideEffects: ["Headache", "Vivid dreams", "Transient ALT elevation"],
    contraindications: [
      "Concomitant strong CYP1A2 inhibitors (fluvoxamine) or CYP3A4 inducers",
    ],
    kitLocation: "Crew Sleep & Circadian Countermeasure Kit",
  },
  {
    id: "melatonin-circadian",
    name: "Melatonin (Pharmaceutical-Grade)",
    genericName: "N-Acetyl-5-Methoxytryptamine",
    category: "behavioral_circadian",
    categoryLabel: "Circadian, Sleep & Deep-Space Behavioral",
    spaceIndication:
      "Daily circadian phase-advancing countermeasure (paired with blue-depleted 1800K Solid-State Lighting) and neuro-radioprotective free-radical scavenger.",
    terrestrialIndication:
      "Circadian rhythm sleep disorders and jet lag.",
    dosage:
      "0.5–3 mg PO 30–60 minutes prior to scheduled sleep window.",
    route: "Oral Sublingual Tablet",
    microgravityPharmacokinetics:
      "Activates $\text{MT}_1$ (suppresses SCN neuronal firing) and $\text{MT}_2$ (phase-shifts circadian rhythm) receptors while crossing the blood-brain barrier to scavenge cosmic-ray-induced hydroxyl and peroxynitrite radicals in hippocampal neurons.",
    radiationStability:
      "Indoleamine ring is moderately sensitive to oxidative radiolysis; store in nitrogen-flushed foil blisters.",
    radiationStabilityRating: "Moderate (Shielded Foil Required, 18–24 mo)",
    sideEffects: ["Morning grogginess if dose > 5 mg", "Vivid dreams"],
    contraindications: ["Autoimmune flare", "Immediate operational watch duty"],
    kitLocation: "Crew Sleep & Circadian Countermeasure Kit",
  },
  {
    id: "zolpidem-ambien",
    name: "Zolpidem Tartrate (Ambien)",
    genericName: "Zolpidem Tartrate",
    category: "behavioral_circadian",
    categoryLabel: "Circadian, Sleep & Deep-Space Behavioral",
    spaceIndication:
      "Short-acting hypnotic for acute spaceflight insomnia (astronauts average only 6.1 hours of fragmented sleep/night on ISS due to noise, fluid shift, and circadian disruption).",
    terrestrialIndication:
      "Short-term treatment of sleep-onset insomnia.",
    dosage:
      "5 mg PO (or 10 mg max) immediately after strapping into the crew sleep berth with >= 7–8 hours before scheduled awakening.",
    route: "Oral Tablet / Sublingual",
    microgravityPharmacokinetics:
      "Selective $\text{GABA}_A$ $\alpha_1$-subunit agonist with rapid onset (15–30 min) and short elimination half-life (~2.5 hours). CRITICAL SPACEFLIGHT SAFETY WARNING: Do NOT administer staggered repeat doses in the middle of the night—if an Emergency Fire or Cabin Depressurization alarm sounds 2 hours after a 10 mg dose, Zolpidem causes severe cognitive ataxia and impairs emergency egress.",
    radiationStability:
      "Imidazopyridine solid tablet retains > 97% potency over 36 months on ISS.",
    radiationStabilityRating: "High (GCR/SPE Stable > 36 mo)",
    sideEffects: [
      "Complex sleep behaviors (sleep-floating in 0G if unstrapped from sleeping bag)",
      "Anterograde amnesia",
      "Impaired emergency alarm reaction time within first 4 hours",
    ],
    contraindications: [
      "Never allow simultaneous Zolpidem use by all crewmembers on a spacecraft (at least one crewmember must remain unmedicated or offset for emergency watch)",
      "History of complex parasomnias",
    ],
    kitLocation: "Crew Sleep & Circadian Countermeasure Kit",
  },
  {
    id: "midazolam-intranasal",
    name: "Midazolam Hydrochloride (Intranasal / IM / IV)",
    genericName: "Midazolam Hydrochloride",
    category: "behavioral_circadian",
    categoryLabel: "Circadian, Sleep & Deep-Space Behavioral",
    spaceIndication:
      "First-line abortive therapy for status epilepticus, hydrazine neurotoxic seizures, acute severe claustrophobic/isolation panic crisis, and procedural sedation on the CMRS.",
    terrestrialIndication:
      "Status epilepticus, acute agitation, and procedural sedation.",
    dosage:
      "Seizure / Acute Panic: 5 mg Intranasal (2.5 mg atomized into each nostril via MAD) or 5–10 mg IM. Procedural sedation: 1–2.5 mg slow IV titrated.",
    route: "Intranasal Atomizer (MAD), IM, or Pressurized IV",
    microgravityPharmacokinetics:
      "At pH < 4 in the vial, Midazolam exists as an open water-soluble ring; at physiological nasal/blood pH 7.4, the diazepine ring closes and becomes highly lipophilic, crossing the nasal mucosa and blood-brain barrier in < 3–5 minutes. In microgravity, cephalad venous engorgement of the nasal turbinates further accelerates intranasal absorption.",
    radiationStability:
      "Aqueous midazolam ampoules show ~8–12% radiolytic degradation after 24 months; store inside high-density polyethylene cassettes.",
    radiationStabilityRating: "Moderate (Shielded Foil Required, 18–24 mo)",
    sideEffects: [
      "Respiratory depression and apnea (keep Flumazenil 0.2 mg IV and BVM ready)",
      "Hypotension in hypovolemic astronauts",
      "Paradoxical agitation",
    ],
    contraindications: [
      "Acute narrow-angle glaucoma",
      "Severe uncompensated respiratory insufficiency without airway support",
    ],
    kitLocation: "ISS Crew Medical Restraint Pack A (Red Resuscitation Sub-Pack)",
  },
  {
    id: "olanzapine-zyprexa-zydis",
    name: "Olanzapine (Zyprexa Zydis ODT)",
    genericName: "Olanzapine",
    category: "behavioral_circadian",
    categoryLabel: "Circadian, Sleep & Deep-Space Behavioral",
    spaceIndication:
      "Emergency stabilization of acute spaceflight psychosis, severe isolation paranoia, or refractory manic/delirious agitation during long-duration lunar/Mars missions.",
    terrestrialIndication:
      "Schizophrenia, acute manic/mixed episodes in bipolar I disorder, and acute agitation.",
    dosage:
      "5–10 mg Orally Disintegrating Tablet (ODT) placed on tongue (dissolves instantly in saliva); may repeat 5 mg after 2 hours (max 20 mg/24h).",
    route: "Sublingual Orally Disintegrating Tablet (ODT)",
    microgravityPharmacokinetics:
      "Potent $\text{D}_2$ and $5\text{-HT}_{2\text{A}}$ antagonist with rapid mucosal/GI absorption and minimal extrapyramidal dystonia risk compared to haloperidol (critical because acute laryngeal dystonia in deep space is life-threatening). Also possesses strong antiemetic properties against space motion sickness and radiation nausea.",
    radiationStability:
      "Lyophilized Zydis wafer is stable for 24–30 months when sealed against moisture and light.",
    radiationStabilityRating: "Moderate (Shielded Foil Required, 18–24 mo)",
    sideEffects: [
      "Sedation and orthostatic hypotension (aggravated during post-landing G-transitions)",
      "Anticholinergic dry mouth and constipation",
      "Mild QTc prolongation",
    ],
    contraindications: [
      "Do NOT co-administer parenteral benzodiazepines within 1 hour of high-dose Olanzapine (risk of cardiorespiratory depression)",
    ],
    kitLocation: "ISS Crew Medical Restraint Pack B (Behavioral Health Safe)",
  },
  {
    id: "sertraline-zoloft",
    name: "Sertraline Hydrochloride (Zoloft)",
    genericName: "Sertraline Hydrochloride",
    category: "behavioral_circadian",
    categoryLabel: "Circadian, Sleep & Deep-Space Behavioral",
    spaceIndication:
      "Sustained management of deep-space depressive disorder, chronic isolation anxiety, and stress-induced hippocampal neurogenesis suppression on multi-year Mars missions.",
    terrestrialIndication:
      "Major depressive disorder, panic disorder, PTSD, and OCD.",
    dosage:
      "50 mg PO once daily (titrate up to 100–200 mg PO daily over 2–4 weeks).",
    route: "Oral Tablet",
    microgravityPharmacokinetics:
      "Selective Serotonin Reuptake Inhibitor (SSRI) with minimal CYP2D6 inhibition compared to fluoxetine or paroxetine, avoiding dangerous metabolic interactions with codeine, metoprolol, or tamoxifen in the space medical kit.",
    radiationStability:
      "Crystalline hydrochloride salt exhibits > 98% stability over 36 months.",
    radiationStabilityRating: "High (GCR/SPE Stable > 36 mo)",
    sideEffects: [
      "Initial GI nausea or loose stools",
      "Insomnia or vivid dreams",
      "Mild platelet aggregation inhibition (monitor if combined with NSAIDs/anticoagulants)",
    ],
    contraindications: [
      "Concomitant MAOIs or linezolid (Serotonin Syndrome)",
    ],
    kitLocation: "Deep-Space Chronic & Countermeasure Med Locker",
  },

  // ============================================================================
  // 5. CARDIOVASCULAR & EMERGENCY RESUSCITATION
  // ============================================================================
  {
    id: "epinephrine-acls",
    name: "Epinephrine (1:10,000 ACLS & 1:1,000 Auto-Injector)",
    genericName: "Epinephrine (Adrenaline)",
    category: "cardiovascular_acls",
    categoryLabel: "0G Cardiovascular, ACLS & Anticoagulation",
    spaceIndication:
      "1) 0G Cardiac Arrest (VF, pVT, Asystole, PEA) during Microgravity CPR; 2) Anaphylactic shock; 3) Refractory hypotension.",
    terrestrialIndication:
      "Cardiac arrest resuscitation and severe anaphylaxis.",
    dosage:
      "Cardiac Arrest (1:10,000): 1 mg (10 mL) IO/IV every 3–5 minutes. Anaphylaxis (1:1,000): 0.3–0.5 mg IM into anterolateral mid-thigh every 5–15 minutes.",
    route: "Intraosseous (IO), Pressurized IV, or IM Auto-Injector",
    microgravityPharmacokinetics:
      "Alpha-1 adrenergic vasoconstriction restores aortic diastolic pressure and coronary perfusion pressure during Handstand/CMRS chest compressions, while Beta-1 agonism increases myocardial contractility. Must flush IO/IV doses with 20 mL Normal Saline from a 300 mmHg pressurized bag.",
    radiationStability:
      "CRITICAL NASA PHARMACOLOGY FINDING: Aqueous Epinephrine is one of the MOST radiation-sensitive drugs in the space kit! Catecholamine oxidation into adrenochrome (pink/brown discoloration) and conversion to biologically inactive D-epinephrine enantiomer occurs rapidly under GCR/SPE radiation. Store in nitrogen-purged, sodium-metabisulfite-stabilized amber glass inside thick HDPE shielding; inspect visually for pink/brown discoloration before injection.",
    radiationStabilityRating: "Sensitive (Radiolysis-Prone / Cold-Chain Required)",
    sideEffects: [
      "Ventricular tachyarrhythmias and severe hypertension",
      "Myocardial ischemia and lactic acidosis",
      "Pulmonary edema",
    ],
    contraindications: [
      "No absolute contraindications in cardiac arrest or life-threatening anaphylaxis",
      "Discard if solution is pink, brown, or contains precipitate (unless no replacement exists in life-or-death arrest)",
    ],
    kitLocation: "ISS Crew Medical Restraint Pack A & EVA Airlock Emergency Pouch",
  },
  {
    id: "amiodarone-cordarone",
    name: "Amiodarone Hydrochloride",
    genericName: "Amiodarone Hydrochloride",
    category: "cardiovascular_acls",
    categoryLabel: "0G Cardiovascular, ACLS & Anticoagulation",
    spaceIndication:
      "Shock-refractory Ventricular Fibrillation (VF) / Pulseless VTach during 0G CPR, hemodynamically stable sustained VTach, and spaceflight Atrial Fibrillation rhythm control.",
    terrestrialIndication:
      "Ventricular fibrillation, unstable/stable ventricular tachycardia, and atrial fibrillation.",
    dosage:
      "Cardiac Arrest: 300 mg IO/IV push, then 150 mg IO/IV if refractory. Stable VTach/AFib: 150 mg IV over 10 minutes via syringe pump, then 1 mg/min x 6 hours.",
    route: "Pressurized IV / IO or Oral Tablet",
    microgravityPharmacokinetics:
      "Class III antiarrhythmic (blocks $\text{K}^+$ repolarization currents, $\text{Na}^+$ channels, L-type $\text{Ca}^{2+}$ channels, and $\beta$-receptors). Aqueous Polysorbate-80 formulation can cause acute vasodilation; infuse via syringe pump in non-arrest patients to prevent hypotension in volume-contracted astronauts.",
    radiationStability:
      "Iodinated benzofuran derivative; aqueous vials can release free iodide under high-dose proton irradiation if unshielded; solid tablets are highly stable.",
    radiationStabilityRating: "Moderate (Shielded Foil Required, 18–24 mo)",
    sideEffects: [
      "Hypotension and bradycardia / AV block",
      "QT prolongation (low risk of Torsades compared to other Class III agents)",
      "Phlebitis (prefer central/IO or large antecubital vein)",
    ],
    contraindications: [
      "Severe sinus node dysfunction or 2nd/3rd-degree AV block without pacemaker",
      "Cardiogenic shock",
    ],
    kitLocation: "ISS Crew Medical Restraint Pack A (Red Resuscitation Sub-Pack)",
  },
  {
    id: "atropine-sulfate",
    name: "Atropine Sulfate",
    genericName: "Atropine Sulfate",
    category: "cardiovascular_acls",
    categoryLabel: "0G Cardiovascular, ACLS & Anticoagulation",
    spaceIndication:
      "Symptomatic vagal bradycardia (including Bezold-Jarisch reflex or extreme carotid baroreceptor stimulation during EVA neck-ring pressure) and toxic organophosphate/hydrazine cholinergic crisis.",
    terrestrialIndication:
      "Symptomatic bradycardia and anticholinesterase poisoning.",
    dosage:
      "1.0 mg IV/IO every 3–5 minutes (maximum total dose 3 mg).",
    route: "Pressurized IV or Intraosseous (IO)",
    microgravityPharmacokinetics:
      "Competitive muscarinic acetylcholine receptor antagonist at the sinoatrial (SA) and atrioventricular (AV) nodes. Because spaceflight reduces vagal baroreflex gain, doses < 0.5 mg can cause paradoxical bradycardia—always administer full 1.0 mg boluses.",
    radiationStability:
      "Tropane ester is stable for 24–36 months in buffered pH 3.5–5.0 prefilled syringes.",
    radiationStabilityRating: "High (GCR/SPE Stable > 36 mo)",
    sideEffects: [
      "Sinus tachycardia and increased myocardial oxygen demand",
      "Mydriasis, blurred vision, and urinary retention",
      "Anticholinergic delirium at high doses",
    ],
    contraindications: [
      "Do not rely on Atropine in Infranodal (Mobitz Type II or 3rd-degree wide-complex) AV block—prepare transcutaneous pacing on CMRS",
    ],
    kitLocation: "ISS Crew Medical Restraint Pack A (Red Resuscitation Sub-Pack)",
  },
  {
    id: "enoxaparin-lovenox",
    name: "Enoxaparin Sodium (Lovenox)",
    genericName: "Low-Molecular-Weight Heparin (LMWH)",
    category: "cardiovascular_acls",
    categoryLabel: "0G Cardiovascular, ACLS & Anticoagulation",
    spaceIndication:
      "Acute initial anticoagulation for Spaceflight Internal Jugular Venous Thrombosis (JVT), subclavian thrombosis, or pulmonary embolism in microgravity (proven during the landmark 2019 ISS JVT case).",
    terrestrialIndication:
      "Deep vein thrombosis (DVT), pulmonary embolism (PE), and acute coronary syndrome.",
    dosage:
      "1.0 mg/kg Subcutaneous every 12 hours (or 1.5 mg/kg SC once every 24 hours to conserve syringe supplies in orbit).",
    route: "Subcutaneous Injection (Anterior Abdominal Wall)",
    microgravityPharmacokinetics:
      "Potentiates Antithrombin III to selectively inhibit Factor Xa (anti-Xa:anti-IIa ratio ~4:1) with predictable bioavailability (> 90%) and no requirement for routine aPTT/INR laboratory monitoring in orbit. Spaceflight Operational Note: Standard terrestrial prefilled Enoxaparin syringes contain an intentional air bubble; in 0G, this air bubble does NOT rise to the plunger end and must be carefully positioned or expelled using a surface-tension adaptor before injection.",
    radiationStability:
      "Polysaccharide glycosaminoglycan chains remain stable for > 24 months when stored at 15–25°C inside radiation-shielded medical lockers.",
    radiationStabilityRating: "Moderate (Shielded Foil Required, 18–24 mo)",
    sideEffects: [
      "Major hemorrhage (retroperitoneal, intracranial, or abdominal wall hematoma)",
      "Heparin-Induced Thrombocytopenia (HIT—check platelet count on Day 5)",
    ],
    contraindications: [
      "MUST DISCONTINUE 24–36 hours prior to high-G spacecraft atmospheric re-entry and splashdown",
      "Active major bleeding or thrombocytopenia (< 50,000/µL, e.g., post-SPE radiation ARS)",
    ],
    kitLocation: "ISS Crew Medical Restraint Pack B",
  },
  {
    id: "apixaban-eliquis",
    name: "Apixaban (Eliquis)",
    genericName: "Apixaban",
    category: "cardiovascular_acls",
    categoryLabel: "0G Cardiovascular, ACLS & Anticoagulation",
    spaceIndication:
      "Long-term oral anticoagulation for Spaceflight Internal Jugular Venous Thrombosis (JVT) and spaceflight Atrial Fibrillation without requiring syringe resupply.",
    terrestrialIndication:
      "Treatment/prevention of DVT/PE and stroke prophylaxis in non-valvular atrial fibrillation.",
    dosage:
      "Venous Thrombosis: 10 mg PO twice daily for 7 days, then 5 mg PO twice daily. Hold 72–96 hours before atmospheric re-entry.",
    route: "Oral Tablet",
    microgravityPharmacokinetics:
      "Direct, reversible Factor Xa inhibitor (inhibits both free and clot-bound Factor Xa). Oral bioavailability (~50%) is unaffected by microgravity gastric pH changes; dual elimination (27% renal, 73% hepatobiliary/fecal) protects against accumulation during mild spaceflight dehydration.",
    radiationStability:
      "Solid pyrazolopyridine tablet is highly resistant to cosmic radiation (> 36 months).",
    radiationStabilityRating: "High (GCR/SPE Stable > 36 mo)",
    sideEffects: [
      "Hemorrhage (epistaxis is common in 0G due to nasal mucosal venous engorgement)",
      "Bruising and hematuria",
    ],
    contraindications: [
      "MUST HOLD 72–96 hours prior to Soyuz/Dragon/Orion landing or prior to EVA suit operations with high crush/trauma risk",
      "Active radiation-induced thrombocytopenia",
    ],
    kitLocation: "Deep-Space Chronic & Cardiovascular Med Locker",
  },
  {
    id: "nitroglycerin-sublingual",
    name: "Nitroglycerin Sublingual Tablets (Nitrostat)",
    genericName: "Glyceryl Trinitrate",
    category: "cardiovascular_acls",
    categoryLabel: "0G Cardiovascular, ACLS & Anticoagulation",
    spaceIndication:
      "Acute coronary syndrome / ischemic angina pectoris and acute hypertensive pulmonary edema in space.",
    terrestrialIndication:
      "Acute relief of angina pectoris.",
    dosage:
      "0.4 mg Sublingual tablet dissolved under tongue every 5 minutes up to 3 doses (only if systolic BP > 100 mmHg).",
    route: "Sublingual Tablet or Lingual Aerosol Spray",
    microgravityPharmacokinetics:
      "Converted by mitochondrial aldehyde dehydrogenase (ALDH2) into Nitric Oxide ($\text{NO}$), stimulating guanylyl cyclase and causing potent venodilation and coronary vasodilation. EXTREME 0G WARNING: Because astronauts have a 10–15% contracted blood volume in microgravity, Nitroglycerin venodilation can cause sudden, severe preload collapse and syncope—always strap patient to the CMRS and have pressurized Normal Saline ready before dosing.",
    radiationStability:
      "Volatile organic nitrate ester; highly prone to sublimation and radiolytic denitration unless sealed in tight borosilicate amber glass vials with metal screw caps.",
    radiationStabilityRating: "Sensitive (Radiolysis-Prone / Cold-Chain Required)",
    sideEffects: [
      "Severe preload-dependent hypotension and reflex tachycardia",
      "Pulsating frontal headache (worsened by baseline 0G cephalad congestion)",
    ],
    contraindications: [
      "Hypovolemia or systolic BP < 95–100 mmHg",
      "Right ventricular infarction",
      "PDE-5 inhibitor use within 24–48 hours",
    ],
    kitLocation: "ISS Crew Medical Restraint Pack A",
  },

  // ============================================================================
  // 6. ANALGESICS & ANESTHETICS
  // ============================================================================
  {
    id: "ketorolac-toradol",
    name: "Ketorolac Tromethamine (Toradol)",
    genericName: "Ketorolac Tromethamine",
    category: "analgesic_anesthetic",
    categoryLabel: "Emergency Analgesics & Dissociative Anesthesia",
    spaceIndication:
      "First-line non-opioid parenteral analgesic for acute microgravity ureterolithiasis (renal stone colic), severe Space Adaptation Back Pain (spinal elongation pain), and musculoskeletal trauma without causing cognitive sedation or respiratory depression.",
    terrestrialIndication:
      "Short-term (<= 5 days) management of moderately severe acute pain.",
    dosage:
      "30 mg IV or 30–60 mg IM initially, then 15–30 mg IV/IM every 6 hours (maximum 5 days total).",
    route: "Pressurized IV or Intramuscular (IM)",
    microgravityPharmacokinetics:
      "Potent COX-1/COX-2 inhibitor that blocks ureteral prostaglandin $\text{E}_2$ synthesis, directly relieving renal pelvic pressure and ureteral spasm during a space kidney stone crisis while preserving 100% astronaut alertness for cockpit operations.",
    radiationStability:
      "Pyrrolizine carboxylic acid tromethamine salt is stable for 24–36 months in light-protected ampoules.",
    radiationStabilityRating: "High (GCR/SPE Stable > 36 mo)",
    sideEffects: [
      "Gastrointestinal ulceration and platelet inhibition",
      "Acute kidney injury if administered in severe dehydration",
    ],
    contraindications: [
      "Active hemorrhage, suspected intracranial bleeding, or radiation thrombocytopenia",
      "Severe renal impairment or solitary obstructed kidney",
      "Do not exceed 5 days of therapy",
    ],
    kitLocation: "ISS Crew Medical Restraint Pack A",
  },
  {
    id: "ketamine-hydrochloride",
    name: "Ketamine Hydrochloride",
    genericName: "Ketamine Hydrochloride",
    category: "analgesic_anesthetic",
    categoryLabel: "Emergency Analgesics & Dissociative Anesthesia",
    spaceIndication:
      "Ideal deep-space battlefield/exploration anesthetic for 0G fracture reduction, chest tube thoracostomy, burn debridement, or surgical procedures on the CMRS because it preserves spontaneous airway reflexes and respiratory drive!",
    terrestrialIndication:
      "Procedural dissociative anesthesia, trauma analgesia, and refractory status asthmaticus.",
    dosage:
      "Sub-dissociative Analgesia: 0.2–0.3 mg/kg slow IV or 0.5 mg/kg Intranasal. Dissociative Procedural Anesthesia: 1.0–1.5 mg/kg IV over 60 seconds or 4 mg/kg IM.",
    route: "Pressurized IV, IM, or Intranasal Atomizer",
    microgravityPharmacokinetics:
      "NMDA glutamate receptor antagonist producing dissociative anesthesia, profound analgesia, and amnesia while maintaining pharyngeal/laryngeal reflexes, respiratory drive (crucial when mechanical ventilation resources in space are limited), and sympathetic cardiovascular tone in hypovolemic trauma.",
    radiationStability:
      "Arylcyclohexylamine hydrochloride solution is exceptionally stable (> 36 months) across temperature extremes and GCR radiation.",
    radiationStabilityRating: "High (GCR/SPE Stable > 36 mo)",
    sideEffects: [
      "Emergence hallucinations/vivid space disorientation (blunt with Midazolam 1–2 mg IV)",
      "Hypersalivation (pre-treat with Atropine or Glycopyrrolate to prevent floating saliva aspiration)",
      "Transient tachycardia and hypertension",
    ],
    contraindications: [
      "Severe uncontrolled hypertension or globe rupture (relative—note recent trauma studies show Ketamine does NOT dangerously spike ICP when ventilation is normal)",
    ],
    kitLocation: "ISS Crew Medical Restraint Pack A & Trauma Sub-Pack",
  },
  {
    id: "morphine-sulfate",
    name: "Morphine Sulfate (Tubex / Auto-Injector)",
    genericName: "Morphine Sulfate",
    category: "analgesic_anesthetic",
    categoryLabel: "Emergency Analgesics & Dissociative Anesthesia",
    spaceIndication:
      "Severe refractory pain from crush trauma, major burns, myocardial infarction, or ureterolithiasis unresponsive to Ketorolac.",
    terrestrialIndication:
      "Severe acute and chronic pain.",
    dosage:
      "2–5 mg slow IV push every 15–30 minutes titrated to pain (or 5–10 mg IM).",
    route: "Pressurized IV or Intramuscular (IM)",
    microgravityPharmacokinetics:
      "Mu-opioid receptor agonist metabolized by hepatic UGT2B7 into active Morphine-6-glucuronide (M6G). In microgravity, reduced hepatic blood flow during SAS and decreased GFR during dehydration can prolong M6G accumulation. Always keep Naloxone 0.4–2 mg IV/IN immediately adjacent.",
    radiationStability:
      "Phenanthrene alkaloid undergoes slow oxidative pseudomorphine dimerization under ionizing radiation; store in nitrogen-purged amber glass.",
    radiationStabilityRating: "Moderate (Shielded Foil Required, 18–24 mo)",
    sideEffects: [
      "Respiratory depression and hypercapnia (dangerous in closed cabin atmosphere)",
      "Severe nausea and vomiting (co-administer Ondansetron)",
      "Histamine-mediated venodilation and hypotension",
    ],
    contraindications: [
      "Unmonitored respiratory depression or acute hypercapnic cabin emergency",
    ],
    kitLocation: "ISS Crew Medical Restraint Pack A (Controlled Narcotic Safe)",
  },

  // ============================================================================
  // 7. SPACEFLIGHT ANTIBIOTICS (ENHANCED MICROBIAL VIRULENCE & IMMUNOSUPPRESSION)
  // ============================================================================
  {
    id: "levofloxacin-levaquin",
    name: "Levofloxacin (Levaquin)",
    genericName: "Levofloxacin",
    category: "antibiotic_antimicrobial",
    categoryLabel: "Spaceflight Antimicrobials (Enhanced Virulence)",
    spaceIndication:
      "Broad-spectrum bactericidal therapy for febrile neutropenia following Solar Particle Event ARS, complicated urinary tract infection / urosepsis (secondary to 0G renal stone), pneumonia, and bacterial sinusitis.",
    terrestrialIndication:
      "Community-acquired/nosocomial pneumonia, complicated UTI/pyelonephritis, and post-exposure inhalational anthrax.",
    dosage:
      "500–750 mg PO or IV once daily for 5–14 days.",
    route: "Oral Tablet or Pressurized IV (99% Bioequivalent!)",
    microgravityPharmacokinetics:
      "Fluoroquinolone DNA gyrase and topoisomerase IV inhibitor with ~99% oral bioavailability—allowing oral tablets in space to achieve identical plasma AUC to IV infusion! Addresses the spaceflight-induced upregulation of Hfq global regulator virulence in Pseudomonas aeruginosa and Escherichia coli.",
    radiationStability:
      "Solid tablet is stable > 36 months; protect from UV light.",
    radiationStabilityRating: "High (GCR/SPE Stable > 36 mo)",
    sideEffects: [
      "Tendonitis and Achilles tendon rupture (caution during high-load ARED resistive squats/treadmill running)",
      "QTc prolongation",
      "GI dysbiosis",
    ],
    contraindications: [
      "History of fluoroquinolone-associated tendon rupture",
      "Separate oral dose by 2 hours from Calcium, Magnesium, or Iron supplements",
    ],
    kitLocation: "ISS Crew Medical Restraint Pack B & Radiation Storm Shelter Med Locker",
  },
  {
    id: "ceftriaxone-rocephin",
    name: "Ceftriaxone Sodium (Rocephin)",
    genericName: "Ceftriaxone Sodium",
    category: "antibiotic_antimicrobial",
    categoryLabel: "Spaceflight Antimicrobials (Enhanced Virulence)",
    spaceIndication:
      "First-line parenteral antibiotic for severe spaceflight sepsis, obstructive pyelonephritis, acute cholecystitis/appendicitis (non-operative antibiotic management in deep space), and open EVA trauma.",
    terrestrialIndication:
      "Sepsis, meningitis, pyelonephritis, intra-abdominal and bone/joint infections.",
    dosage:
      "1–2 g IV or IM every 24 hours (reconstitute IM dose with 1% Lidocaine to minimize injection pain).",
    route: "Pressurized IV or Intramuscular (IM)",
    microgravityPharmacokinetics:
      "Third-generation cephalosporin with a long elimination half-life (6–9 hours) enabling once-daily dosing. Dual renal (60%) and biliary (40%) excretion; note that high-dose Ceftriaxone can precipitate calcium-ceftriaxone biliary sludge in hypercalciuric astronauts—monitor with gallbladder ultrasound.",
    radiationStability:
      "Dry crystalline powder in sealed vials is stable > 36 months; reconstitute in microgravity using closed Luer-lock transfer device to avoid aerosolization.",
    radiationStabilityRating: "High (GCR/SPE Stable > 36 mo)",
    sideEffects: [
      "Biliary pseudolithiasis (calcium-ceftriaxone sludge)",
      "Diarrhea / C. difficile colitis",
      "Hypersensitivity rash",
    ],
    contraindications: [
      "Severe IgE-mediated cephalosporin/penicillin anaphylaxis",
      "Do NOT mix in the same IV line with Calcium-containing solutions (Lactated Ringer's)",
    ],
    kitLocation: "ISS Crew Medical Restraint Pack B",
  },
  {
    id: "amoxicillin-clavulanate-augmentin",
    name: "Amoxicillin-Clavulanate (Augmentin)",
    genericName: "Amoxicillin Trihydrate + Potassium Clavulanate",
    category: "antibiotic_antimicrobial",
    categoryLabel: "Spaceflight Antimicrobials (Enhanced Virulence)",
    spaceIndication:
      "Treatment of odontogenic dental infections, acute bacterial rhinosinusitis (worsened by 0G cephalad sinus congestion), otitis media/barotrauma, and skin/soft-tissue infections.",
    terrestrialIndication:
      "Sinusitis, otitis media, dental abscess, and skin infections.",
    dosage:
      "875 mg / 125 mg PO every 12 hours for 7–10 days with meals.",
    route: "Oral Tablet",
    microgravityPharmacokinetics:
      "Beta-lactam cell-wall inhibitor paired with beta-lactamase inhibitor clavulanate to overcome Staphylococcus aureus and anaerobes.",
    radiationStability:
      "CRITICAL NASA STABILITY FINDING: Potassium Clavulanate is one of the most moisture- and radiation-degradable oral compounds tested on ISS! Must be triple-sealed in desiccant-lined aluminum cold-form foil blisters and rotated every 18 months.",
    radiationStabilityRating: "Sensitive (Radiolysis-Prone / Cold-Chain Required)",
    sideEffects: ["Diarrhea and nausea (take with food)", "Skin rash"],
    contraindications: [
      "Penicillin allergy",
      "History of amoxicillin-clavulanate cholestatic jaundice",
    ],
    kitLocation: "ISS Crew Medical Restraint Pack B",
  },
  {
    id: "azithromycin-zithromax",
    name: "Azithromycin (Zithromax)",
    genericName: "Azithromycin Dihydrate",
    category: "antibiotic_antimicrobial",
    categoryLabel: "Spaceflight Antimicrobials (Enhanced Virulence)",
    spaceIndication:
      "Atypical respiratory tract infections, spaceflight conjunctivitis/blepharitis, traveler/ration enteritis, and penicillin-allergic dental/sinus infections.",
    terrestrialIndication:
      "Community-acquired pneumonia, pharyngitis, sinusitis, and bacterial enteritis.",
    dosage:
      "500 mg PO on Day 1, followed by 250 mg PO once daily on Days 2–5.",
    route: "Oral Tablet or Ophthalmic Solution (AzaSite)",
    microgravityPharmacokinetics:
      "Azalide macrolide that concentrates up to 50-fold inside phagocytes and fibroblasts, delivering sustained tissue levels for 5–7 days after a 5-day course despite microgravity fluid shifts.",
    radiationStability:
      "15-membered lactone ring tablet retains > 96% potency after 28 months in spaceflight testing.",
    radiationStabilityRating: "High (GCR/SPE Stable > 36 mo)",
    sideEffects: ["GI cramping", "QTc interval prolongation"],
    contraindications: [
      "Known QTc > 480 ms or concomitant QT-prolonging antiarrhythmics",
    ],
    kitLocation: "ISS Crew Medical Restraint Pack B",
  },
  {
    id: "tamsulosin-flomax",
    name: "Tamsulosin Hydrochloride (Flomax)",
    genericName: "Tamsulosin Hydrochloride",
    category: "bone_calcium",
    categoryLabel: "Osteoclast Inhibition & Renal Stone Prevention",
    spaceIndication:
      "Medical Expulsive Therapy (MET) for acute microgravity ureterolithiasis (kidney stones <= 8 mm) and acute spaceflight urinary retention (a frequent emergency in 0G caused by anticholinergic SAS drugs + loss of gravitational bladder-trigone filling perception).",
    terrestrialIndication:
      "Benign prostatic hyperplasia (BPH) and distal ureteral stone expulsion.",
    dosage:
      "0.4 mg PO once daily (30 minutes after the same meal each day).",
    route: "Oral Capsule",
    microgravityPharmacokinetics:
      "Selective $\\alpha_{1\\text{A}}$ and $\\alpha_{1\\text{D}}$ adrenoceptor antagonist in the prostatic urethra, bladder neck, and distal ureteral smooth muscle; decreases intramural ureteral peristaltic spasm without significant systemic arterial vasodilation, though mild orthostatic intolerance can occur during G-transitions.",
    radiationStability:
      "Sulfamoylphenethylamine capsule pellets retain > 97% potency over 30 months in space.",
    radiationStabilityRating: "High (GCR/SPE Stable > 36 mo)",
    sideEffects: [
      "Orthostatic dizziness during post-landing or artificial-gravity transitions",
      "Rhinitis and retrograde ejaculation",
      "Intraoperative Floppy Iris Syndrome",
    ],
    contraindications: [
      "Severe orthostatic hypotension or syncope history",
      "Severe sulfa hypersensitivity",
    ],
    kitLocation: "ISS Crew Medical Restraint Pack B",
  },
  {
    id: "tranexamic-acid-txa",
    name: "Tranexamic Acid (TXA / Cyklokapron)",
    genericName: "Tranexamic Acid",
    category: "cardiovascular_acls",
    categoryLabel: "0G Cardiovascular, ACLS & Anticoagulation",
    spaceIndication:
      "Antifibrinolytic hemorrhage control in severe EVA crush trauma, internal truncal bleeding, and refractory microgravity epistaxis (nosebleeds worsened by 0G cephalic venous engorgement) or radiation-induced thrombocytopenic mucosal bleeding.",
    terrestrialIndication:
      "Trauma hemorrhage, postpartum hemorrhage, and heavy surgical bleeding.",
    dosage:
      "Trauma Hemorrhage: 1 g IV infused over 10 minutes within 3 hours of injury, followed by 1 g IV over 8 hours. Refractory 0G Epistaxis: Soak nasal pledget in 500 mg (5 mL) TXA and pack anterior nares.",
    route: "Pressurized IV, Oral, or Topical Hemostatic Packing",
    microgravityPharmacokinetics:
      "Synthetic lysine analog that competitively blocks plasminogen lysine-binding sites, preventing plasmin from degrading fibrin clots. Excreted > 95% unchanged by glomerular filtration.",
    radiationStability:
      "Cyclohexanecarboxylic acid ring is chemically rugged and radiation-stable (> 36 months).",
    radiationStabilityRating: "High (GCR/SPE Stable > 36 mo)",
    sideEffects: [
      "Hypotension if injected via rapid IV bolus (< 1 minute)",
      "Thromboembolic risk if active Internal Jugular Vein Thrombosis (JVT) is present",
      "Color vision disturbance (rare)",
    ],
    contraindications: [
      "Active intravascular clotting or Spaceflight Internal Jugular Venous Thrombosis (JVT)",
      "Subarachnoid hemorrhage",
      "Do not administer > 3 hours after major trauma (CRASH-2 window)",
    ],
    kitLocation: "Trauma & Minor Surgery Sub-Pack",
  },
  {
    id: "hydroxocobalamin-cyanokit",
    name: "Hydroxocobalamin (Cyanokit)",
    genericName: "Hydroxocobalamin (Vitamin B12a)",
    category: "radioprotectant_ars",
    categoryLabel: "Radioprotectants & ARS Countermeasures",
    spaceIndication:
      "Emergency antidote for acute Hydrogen Cyanide (HCN) inhalation poisoning resulting from pyrolysis of Kapton, Teflon, or polyurethane spacecraft wiring insulation during a microgravity cabin fire.",
    terrestrialIndication:
      "Known or suspected cyanide poisoning from smoke inhalation.",
    dosage:
      "5 g IV infused over 15 minutes via 300 mmHg pneumatic pressure sleeve (may repeat a second 5 g dose over 15–120 minutes for cardiac arrest or refractory lactic acidosis).",
    route: "Pressurized IV Infusion",
    microgravityPharmacokinetics:
      "Each trivalent cobalt ion ($\\text{Co}^{3+}$) in hydroxocobalamin binds one cyanide ion ($\\text{CN}^-$) with higher affinity than mitochondrial cytochrome c oxidase ($a_3$), forming non-toxic cyanocobalamin (Vitamin B12) excreted in urine. Unlike nitrites, Hydroxocobalamin does NOT induce methemoglobinemia—preserving oxygen-carrying capacity in smoke inhalation victims who also have Carbon Monoxide (CO) poisoning!",
    radiationStability:
      "Lyophilized dark-red crystalline powder is stable for 36 months when shielded from light and reconstituted immediately prior to infusion.",
    radiationStabilityRating: "High (GCR/SPE Stable > 36 mo)",
    sideEffects: [
      "Transient chromaturia (deep red/burgundy urine for 14–28 days—inform ECLSS Urine Processor team!)",
      "Erythematous skin flushing and transient blood pressure elevation (NO scavenging)",
      "Interferes with colorimetric point-of-care chemistry analyzers",
    ],
    contraindications: ["No contraindications in life-threatening smoke/cyanide inhalation"],
    kitLocation: "EVA Airlock & Fire Contingency Medical Pouch",
  },
  {
    id: "pyridoxine-high-dose-iv",
    name: "Pyridoxine Hydrochloride (High-Dose IV Vitamin B6)",
    genericName: "Pyridoxine Hydrochloride",
    category: "neuro_ocular_vestibular",
    categoryLabel: "SANS, ICP & Space Motion Sickness",
    spaceIndication:
      "Specific neurological antidote for Monomethylhydrazine (MMH) / Anhydrous Hydrazine (N2H4) RCS thruster propellant toxicity following EVA suit contamination and airlock ingress.",
    terrestrialIndication:
      "Hydrazine propellant toxicity, isoniazid (INH) overdose seizures, and Gyromitra mushroom poisoning.",
    dosage:
      "25 mg/kg IV (up to 5 g total) infused over 30–60 minutes; co-administer Midazolam 5 mg IN/IV if active status epilepticus is present.",
    route: "Pressurized IV",
    microgravityPharmacokinetics:
      "Hydrazine propellant reacts with endogenous pyridoxal-5'-phosphate (active Vitamin B6), inhibiting glutamic acid decarboxylase (GAD) and acutely depleting inhibitory $\\gamma$-aminobutyric acid (GABA) in the brain—causing refractory status epilepticus, hemolysis, and hepatic necrosis. High-dose IV Pyridoxine rapidly restores GAD co-factor activity and terminates hydrazine seizures.",
    radiationStability:
      "Pyridine ring hydrochloride is stable for > 30 months when protected from UV light in amber vials.",
    radiationStabilityRating: "High (GCR/SPE Stable > 36 mo)",
    sideEffects: [
      "Sensory peripheral neuropathy (only with prolonged megadose administration)",
      "Mild burning at IV site",
    ],
    contraindications: ["None in acute hydrazine propellant exposure"],
    kitLocation: "EVA Airlock Emergency Pouch",
  },
  {
    id: "salbutamol-albuterol-mdi",
    name: "Salbutamol / Albuterol HFA Inhaler",
    genericName: "Albuterol Sulfate HFA",
    category: "cardiovascular_acls",
    categoryLabel: "0G Cardiovascular, ACLS & Anticoagulation",
    spaceIndication:
      "Acute bronchospasm from anhydrous Ammonia (NH3) coolant leak, spacecraft fire smoke inhalation, lunar/Martian regolith silicate dust irritation ('Lunar Hay Fever'), or anaphylaxis; also adjunctive intracellular shift therapy for hyperkalemia.",
    terrestrialIndication:
      "Asthma, exercise-induced bronchospasm, and acute chemical bronchitis.",
    dosage:
      "4–8 puffs (90 mcg/actuation) via valved holding chamber (spacer) every 20 minutes for 3 doses, then every 1–4 hours as needed.",
    route: "Metered-Dose Inhalation with Valved Holding Chamber",
    microgravityPharmacokinetics:
      "Selective $\\beta_2$-adrenergic agonist relaxing bronchial smooth muscle via cAMP elevation. In microgravity, lack of gravitational sedimentation alters aerosol droplet deposition in the lungs—using a Valved Holding Chamber (spacer) increases distal alveolar/bronchiolar delivery by > 40%.",
    radiationStability:
      "Pressurized HFA-134a canister is stable for 24–36 months; never puncture or expose to vacuum airlock decompression without overpack.",
    radiationStabilityRating: "Moderate (Shielded Foil Required, 18–24 mo)",
    sideEffects: [
      "Sinus tachycardia and skeletal muscle tremor",
      "Intracellular potassium shift (hypokalemia)",
    ],
    contraindications: ["Severe tachyarrhythmia"],
    kitLocation: "ISS Crew Medical Restraint Pack A & EVA Airlock Emergency Pouch",
  },
  {
    id: "dexamethasone-decadron",
    name: "Dexamethasone Sodium Phosphate (Decadron)",
    genericName: "Dexamethasone Sodium Phosphate",
    category: "neuro_ocular_vestibular",
    categoryLabel: "SANS, ICP & Space Motion Sickness",
    spaceIndication:
      "Chemical airway/laryngeal edema after Ammonia or smoke inhalation, severe allergic/anaphylactic reaction, acute radiation-induced cerebral edema, and refractory Space Adaptation Syndrome emesis.",
    terrestrialIndication:
      "Cerebral edema, severe croup/airway inflammation, anaphylaxis, and chemotherapy emesis.",
    dosage:
      "Airway Edema / Anaphylaxis / Cerebral Edema: 10 mg IV/IM initially, then 4 mg IV/IM/PO every 6 hours.",
    route: "Pressurized IV, IM, or Oral Tablet",
    microgravityPharmacokinetics:
      "Long-acting fluorinated glucocorticoid (biological half-life 36–54 hours) with zero mineralocorticoid sodium-retaining activity—crucial so it does not worsen cephalad fluid congestion or SANS optic disc edema.",
    radiationStability:
      "Solid tablets are stable > 36 months; aqueous phosphate ester vials retain > 92% potency over 24 months.",
    radiationStabilityRating: "High (GCR/SPE Stable > 36 mo)",
    sideEffects: [
      "Hyperglycemia and transient leukocytosis",
      "Insomnia and mood elevation",
      "Accelerates osteoclastic bone loss and muscle atrophy if used chronically in 0G",
    ],
    contraindications: [
      "Systemic fungal infection",
      "Avoid prolonged chronic use in microgravity due to synergistic steroid + 0G osteopenia and sarcopenia",
    ],
    kitLocation: "ISS Crew Medical Restraint Pack A",
  },
  {
    id: "naloxone-flumazenil-reversal",
    name: "Naloxone (Narcan) & Flumazenil (Romazicon) Reversal Pair",
    genericName: "Naloxone HCl 2 mg/2 mL + Flumazenil 0.5 mg/5 mL",
    category: "analgesic_anesthetic",
    categoryLabel: "Emergency Analgesics & Dissociative Anesthesia",
    spaceIndication:
      "Mandatory bedside reversal agents for opioid-induced (Morphine/Fentanyl) or benzodiazepine-induced (Midazolam/Zolpidem) respiratory depression during CMRS surgical/trauma procedures.",
    terrestrialIndication:
      "Reversal of opioid and benzodiazepine overdose / respiratory depression.",
    dosage:
      "Naloxone: 0.4–2.0 mg IV/IM or 4 mg Intranasal every 2–3 minutes. Flumazenil: 0.2 mg IV over 15 seconds, repeat up to 1.0 mg max.",
    route: "Intranasal Atomizer (MAD), IM, or Pressurized IV",
    microgravityPharmacokinetics:
      "Competitive $\\mu$-opioid (Naloxone) and $\\text{GABA}_A$ benzodiazepine-site (Flumazenil) antagonists with rapid CNS onset (1–2 minutes IV, 3–5 minutes Intranasal). Because elimination half-lives (~60 min) are shorter than Morphine or Midazolam, monitor continuous SpO2 and EtCO2 for re-sedation.",
    radiationStability:
      "Stable for 24–36 months in light-protected amber glass inside CMRS Pack A.",
    radiationStabilityRating: "High (GCR/SPE Stable > 36 mo)",
    sideEffects: [
      "Acute catecholamine surge, tachycardia, and pulmonary edema (Naloxone)",
      "Precipitated seizures if Flumazenil is given after benzodiazepines were used to stop hydrazine/epileptic seizures",
    ],
    contraindications: [
      "Do NOT administer Flumazenil if Midazolam was given to terminate status epilepticus or hydrazine neurotoxicity",
    ],
    kitLocation: "ISS Crew Medical Restraint Pack A (Red Resuscitation Sub-Pack)",
  },
];

// ==============================================================================
// PART B: SPACE RADIATION PHYSICS, DOSIMETRY & SHIELDING ENCYCLOPEDIA
// ==============================================================================
export const spaceRadiationDatabase = {
  radiationTypes: [
    {
      id: "gcr-hze",
      name: "Galactic Cosmic Rays (GCR) & HZE Heavy Ions",
      shortCode: "GCR / HZE ($^{56}\\text{Fe}$)",
      composition:
        "85% high-energy protons ($^1\\text{H}^+$), 14% alpha particles ($^4\\text{He}^{2+}$), and ~1% fully ionized heavy atomic nuclei (HZE ions from Carbon $^{12}\\text{C}$ to Iron $^{56}\\text{Fe}^{26+}$).",
      energyRange: "100 MeV/nucleon to > 10 GeV/nucleon (Relativistic)",
      linearEnergyTransfer: "High-LET (10 to > 200 keV/µm for Fe-56 tracks)",
      qualityFactorQ: "Q = 2.5 to 30+ (HZE ions inflict 10–30x greater biological damage per Gray than X-rays)",
      primarySource:
        "Isotropic extrasolar supernova remnants outside the solar system; flux is anti-correlated with the 11-year Solar Cycle (GCR peaks during Solar Minimum when the heliospheric magnetic field is weakest).",
      biologicalMechanism:
        "Dense ionization cores ('Bragg track' and delta-ray penumbra) shatter both strands of the DNA helix simultaneously in clustered, complex Double-Strand Breaks (DSBs) that non-homologous end joining (NHEJ) cannot accurately repair—causing genomic chromosomal translocations, hippocampal microglial neuro-inflammation, accelerated atherosclerosis, and premature stem-cell senescence.",
      spacecraftPenetrationAndSecondaryHazard:
        "Extremely penetrating; cannot be completely stopped by practical spacecraft hull thicknesses. Passing through thick high-Z metallic hulls (Aluminum/Titanium) causes nuclear fragmentation and secondary neutron spallation showers.",
      optimalCountermeasure:
        "Low-Z hydrogenous shielding (Liquid Hydrogen propellant, Polyethylene HDPE, Boron Nitride Nanotubes) to fragment heavy HZE nuclei into lower-LET particles without generating secondary neutrons, plus dietary/pharmacological antioxidants and mission duration minimization (Nuclear Thermal / Plasma Propulsion).",
    },
    {
      id: "spe-protons",
      name: "Solar Particle Events (SPE) / Coronal Mass Ejections",
      shortCode: "SPE ($p^+ > 100\\text{ MeV}$)",
      composition:
        "> 95% high-flux solar protons ($^1\\text{H}^+$) with minor helium ions and energetic electrons.",
      energyRange: "10 MeV to 500+ MeV (Soft to Hard Proton Spectrum)",
      linearEnergyTransfer: "Low-to-Moderate LET (0.5 to 10 keV/µm)",
      qualityFactorQ: "Q = 1.5 to 2.0 (ICRP/NASA proton weighting)",
      primarySource:
        "Sporadic X-class solar flares and fast Coronal Mass Ejection (CME) shockwaves from the Sun (highest probability during Solar Maximum—e.g., the August 1972 Apollo storm or October 1989 event).",
      biologicalMechanism:
        "Massive acute dose rate (up to 500–2,000 mSv/hr unshielded in deep space) causes widespread apoptosis of rapidly dividing bone marrow hematopoietic stem cells, intestinal crypt cells, and lymphocytes—triggering Acute Radiation Syndrome (ARS: prodromal vomiting, neutropenia, thrombocytopenia, sepsis).",
      spacecraftPenetrationAndSecondaryHazard:
        "Moderate penetration; protons < 150 MeV are effectively stopped by 20–35 g/cm² of hydrogen-rich mass, though high-Z outer skins generate secondary Bremsstrahlung X-rays.",
      optimalCountermeasure:
        "Immediate retreat to the HDPE / Potable Water-Wall Storm Shelter (> 35 g/cm² areal density), Hermes autonomous Tail-to-Sun spacecraft attitude alignment, Astrorad bone-marrow vest, Ondansetron, and Filgrastim (G-CSF).",
    },
    {
      id: "van-allen-saa",
      name: "Trapped Van Allen Belt Radiation & South Atlantic Anomaly (SAA)",
      shortCode: "TRAPPED ($p^+ / e^-$ BELTS)",
      composition:
        "Inner Belt (1,000–6,000 km): energetic trapped protons (10–400 MeV). Outer Belt (13,000–60,000 km): relativistic electrons (0.1–10 MeV).",
      energyRange: "Protons: 10–400 MeV; Electrons: 0.1–10 MeV",
      linearEnergyTransfer: "Low-to-Moderate LET",
      qualityFactorQ: "Q = 1.0 (Electrons) to 2.0 (Protons)",
      primarySource:
        "Charged particles trapped by Earth's dipole geomagnetic field. Because Earth's magnetic dipole is tilted 11° and offset from its rotational center, the Inner Proton Belt dips down to 200–450 km altitude over Brazil and the South Atlantic Ocean—the South Atlantic Anomaly (SAA).",
      biologicalMechanism:
        "Accounts for > 50% of the daily ionizing dose absorbed by astronauts aboard the ISS (400 km LEO) during multiple daily 10-minute transits through the SAA, inducing visual phosphenes ('cosmic light flashes' in the retina) and cumulative DNA oxidative damage.",
      spacecraftPenetrationAndSecondaryHazard:
        "Relativistic outer-belt electrons striking metallic spacecraft skins decelerate abruptly, emitting intense secondary Bremsstrahlung X-rays inside the cabin during cislunar translunar injection (TLI) transits.",
      optimalCountermeasure:
        "Suspend all EVAs during South Atlantic Anomaly (SAA) orbital passes; use high-thrust orbital transfer trajectories through the Van Allen belts (< 2 hours transit time) and graded-Z (Low-Z outer / High-Z inner) electron/Bremsstrahlung shielding.",
    },
    {
      id: "secondary-albedo-neutrons",
      name: "Secondary Spallation Neutrons & Bremsstrahlung X-Rays",
      shortCode: "SECONDARY ($n^0 / \\gamma$)",
      composition:
        "Uncharged secondary fast/thermal neutrons ($n^0$), pions, recoil protons, and Bremsstrahlung braking photons.",
      energyRange: "0.1 MeV to 500 MeV",
      linearEnergyTransfer: "High-LET via secondary recoil protons (10–80 keV/µm)",
      qualityFactorQ: "Q = 5 to 20 (Energy-dependent neutron radiation weighting $w_R$)",
      primarySource:
        "Generated locally when primary GCR HZE ions or SPE protons collide with high-atomic-number ($Z$) atoms in the spacecraft's aluminum hull, or when cosmic rays strike the lunar/Martian regolith and bounce upward as 'Albedo Neutrons'.",
      biologicalMechanism:
        "Because neutrons carry zero electric charge, they bypass Coulomb repulsion and penetrate deep into visceral organs and bone marrow before colliding elastically with hydrogen nuclei in body water—launching densely ionizing recoil protons inside cell nuclei.",
      spacecraftPenetrationAndSecondaryHazard:
        "Paradoxically increases inside thick Aluminum ($Z=13$) or Lead ($Z=82$) hulls if thickness is insufficient to stop the secondary cascade (the 'Pfotzer Maximum' inside spacecraft walls).",
      optimalCountermeasure:
        "Line the interior of metallic pressure hulls with low-$Z$ Hydrogen-rich Polyethylene (HDPE) and Boron-10 ($^{10}\\text{B}$ has a huge 3,840-barn thermal neutron capture cross-section) or Lithium Hydride ($^6\\text{LiH}$).",
    },
  ] as SpaceRadiationType[],

  doseBenchmarks: [
    {
      id: "chest-xray",
      eventOrMission: "Standard Terrestrial Posterior-Anterior Chest X-Ray",
      effectiveDosemSv: 0.1,
      doseDisplay: "0.1 mSv",
      category: "diagnostic",
      clinicalAndOperationalImpact:
        "Baseline clinical diagnostic reference; zero measurable deterministic or stochastic effect.",
    },
    {
      id: "earth-annual-bg",
      eventOrMission: "Average Annual Terrestrial Background Radiation (Sea Level)",
      effectiveDosemSv: 2.4,
      doseDisplay: "2.4 mSv / year",
      category: "diagnostic",
      clinicalAndOperationalImpact:
        "Protected by Earth's magnetosphere (Lorentz deflection) and 1,033 g/cm² atmospheric column.",
    },
    {
      id: "iss-daily",
      eventOrMission: "ISS Low-Earth Orbit (LEO, 400 km, 51.6° Inclination) Daily Dose",
      effectiveDosemSv: 0.5,
      doseDisplay: "0.4 – 0.8 mSv / day",
      category: "orbital_lunar",
      clinicalAndOperationalImpact:
        "200x terrestrial background; dominated by South Atlantic Anomaly (SAA) trapped proton passes and geomagnetic-cutoff GCR.",
    },
    {
      id: "iss-6-month",
      eventOrMission: "Standard 6-Month ISS Expedition Mission",
      effectiveDosemSv: 120,
      doseDisplay: "80 – 160 mSv",
      category: "orbital_lunar",
      clinicalAndOperationalImpact:
        "Measurable chromosome aberrations in peripheral lymphocytes, retinal phosphene flashes, and subclinical vascular endothelial stiffening.",
    },
    {
      id: "artemis-lunar-30d",
      eventOrMission: "Artemis 30-Day Lunar Gateway & South Pole Surface Mission (No SPE)",
      effectiveDosemSv: 42,
      doseDisplay: "35 – 55 mSv",
      category: "orbital_lunar",
      clinicalAndOperationalImpact:
        "Outside Earth's magnetosphere; ~1.4 mSv/day from unshielded isotropic GCR plus lunar regolith albedo neutrons.",
    },
    {
      id: "nasa-career-limit",
      eventOrMission: "NASA Universal Astronaut Career Permissible Exposure Limit (NASA-STD-3001)",
      effectiveDosemSv: 600,
      doseDisplay: "600 mSv (0.6 Sv)",
      category: "regulatory_limit",
      clinicalAndOperationalImpact:
        "Age- and sex-independent universal career limit adopted by NASA (following NASEM 2021 recommendations) to cap excess lifetime fatal cancer risk below ~3%.",
    },
    {
      id: "mars-roundtrip-1000d",
      eventOrMission: "Full Mars Conjunction Class Round-Trip (360d Transit + 500d Surface)",
      effectiveDosemSv: 950,
      doseDisplay: "650 – 1,200 mSv",
      category: "deep_space",
      clinicalAndOperationalImpact:
        "Exceeds current 600 mSv NASA Career Limit without advanced shielding/propulsion; ~1.84 mSv/day in interplanetary cruise (MSL RAD measurement) + ~0.64 mSv/day on Mars surface.",
    },
    {
      id: "ars-prodromal-1gy",
      eventOrMission: "Acute Radiation Syndrome (ARS) Threshold — Mild Prodromal & Hematopoietic",
      effectiveDosemSv: 1000,
      doseDisplay: "1,000 mSv (1.0 Gy Acute)",
      category: "ars_threshold",
      clinicalAndOperationalImpact:
        "Onset of anorexia, nausea, fatigue within 3–6 hours; 25–50% drop in Absolute Lymphocyte Count within 48 hours; reversible bone marrow suppression.",
    },
    {
      id: "ars-hematopoietic-2gy",
      eventOrMission: "Hematopoietic ARS Crisis (Unshielded Major SPE like Aug 1972 Event)",
      effectiveDosemSv: 2500,
      doseDisplay: "2,000 – 4,000 mSv (2–4 Gy Acute)",
      category: "ars_threshold",
      clinicalAndOperationalImpact:
        "Severe vomiting in 1–2 hours; profound neutropenia and thrombocytopenia peaking at Days 14–28; LD50/60 without Filgrastim (G-CSF) and antibiotic support.",
    },
    {
      id: "ars-gi-6gy",
      eventOrMission: "Gastrointestinal ARS Threshold (Catastrophic Unshielded Solar Super-Storm)",
      effectiveDosemSv: 6000,
      doseDisplay: "6,000+ mSv (6.0+ Gy Acute)",
      category: "ars_threshold",
      clinicalAndOperationalImpact:
        "Denudation of intestinal mucosal villi, intractable bloody diarrhea, bacterial translocation, and septic shock within 5–14 days.",
    },
    {
      id: "ars-cns-10gy",
      eventOrMission: "Cerebrovascular / CNS Neurovascular ARS Threshold",
      effectiveDosemSv: 10000,
      doseDisplay: "10,000+ mSv (10+ Gy Acute)",
      category: "ars_threshold",
      clinicalAndOperationalImpact:
        "Immediate cerebral edema, blood-brain barrier breakdown, ataxia, seizures, and cardiovascular collapse within 24–72 hours.",
    },
  ] as RadiationDoseBenchmark[],

  shieldingMaterials: [
    {
      id: "hdpe-polyethylene",
      materialName: "High-Density Polyethylene (HDPE)",
      chemicalFormula: "(C2H4)n",
      atomicNumberEffectiveZ: "Z_eff ≈ 5.2 (High Hydrogen Ratio)",
      densityGPerCm3: 0.97,
      hydrogenMassFractionPercent: 14.3,
      gcrAttenuationEfficiencyScore: 84,
      speProtonStoppingScore: 92,
      secondaryBremsstrahlungNeutronRisk: "Minimal",
      massPenaltyFactor: 0.58,
      engineeringNotes:
        "Current NASA gold standard for ISS crew quarters and Orion Storm Shelter blocks. High hydrogen atom density maximizes Coulombic proton stopping power per unit mass ($dE/dx \\propto Z/A$) while low atomic mass prevents secondary neutron spallation.",
    },
    {
      id: "liquid-water-wall",
      materialName: "Potable / Greywater Storm-Shelter Jackets",
      chemicalFormula: "H2O",
      atomicNumberEffectiveZ: "Z_eff ≈ 7.4",
      densityGPerCm3: 1.0,
      hydrogenMassFractionPercent: 11.1,
      gcrAttenuationEfficiencyScore: 79,
      speProtonStoppingScore: 89,
      secondaryBremsstrahlungNeutronRisk: "Low",
      massPenaltyFactor: 0.64,
      engineeringNotes:
        "Zero parasitic launch mass penalty because crew already requires potable water, food hydration, and ECLSS greywater storage. Inflatable perimeter water bladders (> 30 g/cm²) form the Artemis/Mars habitat Storm Shelter.",
    },
    {
      id: "lithium-hydride",
      materialName: "Lithium-6 Hydride (Enriched LiH)",
      chemicalFormula: "6LiH",
      atomicNumberEffectiveZ: "Z_eff = 2.0",
      densityGPerCm3: 0.82,
      hydrogenMassFractionPercent: 12.6,
      gcrAttenuationEfficiencyScore: 91,
      speProtonStoppingScore: 95,
      secondaryBremsstrahlungNeutronRisk: "Minimal",
      massPenaltyFactor: 0.49,
      engineeringNotes:
        "Superior nuclear fragmentation and thermal neutron absorption ($^6\\text{Li}(n,\\alpha)^3\\text{H}$ reaction without emitting secondary gamma rays). Used in Space Nuclear Reactor shadow shields and advanced composite liners.",
    },
    {
      id: "bnnt-hydrogenated",
      materialName: "Hydrogenated Boron Nitride Nanotubes (H-BNNT)",
      chemicalFormula: "BN : Hx",
      atomicNumberEffectiveZ: "Z_eff ≈ 5.8",
      densityGPerCm3: 1.38,
      hydrogenMassFractionPercent: 8.5,
      gcrAttenuationEfficiencyScore: 88,
      speProtonStoppingScore: 90,
      secondaryBremsstrahlungNeutronRisk: "Minimal",
      massPenaltyFactor: 0.52,
      engineeringNotes:
        "Structural aerospace nanocomposite with tensile strength > 30 GPa, thermal stability to 800°C, and massive $^{10}\\text{B}$ thermal neutron capture cross-section (3,840 barns). Can be woven directly into EVA spacesuit fabrics and inflatable habitats.",
    },
    {
      id: "active-superconducting-mag",
      materialName: "Active Superconducting Toroidal Magnetic Shield (MgB2 / YBCO)",
      chemicalFormula: "B-Field (3–5 Tesla)",
      atomicNumberEffectiveZ: "Lorentz Force (F = qv × B)",
      densityGPerCm3: 0.0,
      hydrogenMassFractionPercent: 0,
      gcrAttenuationEfficiencyScore: 76,
      speProtonStoppingScore: 98,
      secondaryBremsstrahlungNeutronRisk: "Minimal",
      massPenaltyFactor: 0.35,
      engineeringNotes:
        "Deflects charged SPE protons (< 500 MeV) and lower-energy GCR ions entirely away from the spacecraft hull via Lorentz force without any nuclear collision or secondary neutron creation; requires cryogenic cooling and quench redundancy.",
    },
    {
      id: "aluminum-2219-hull",
      materialName: "Aerospace Aluminum-Lithium Alloy (Bare Hull)",
      chemicalFormula: "Al-Cu-Li (Z = 13)",
      atomicNumberEffectiveZ: "Z = 13.0 (High-Z Metal)",
      densityGPerCm3: 2.84,
      hydrogenMassFractionPercent: 0.0,
      gcrAttenuationEfficiencyScore: 34,
      speProtonStoppingScore: 55,
      secondaryBremsstrahlungNeutronRisk: "High (Dangerous)",
      massPenaltyFactor: 1.15,
      engineeringNotes:
        "COUNTERINTUITIVE PHYSICS HAZARD: Because Aluminum lacks hydrogen and has 27 nucleons per nucleus, relativistic GCR heavy ions ($^{56}\\text{Fe}$) and high-energy protons colliding with Aluminum nuclei shatter them into a lethal forward cone of secondary spallation neutrons and Bremsstrahlung X-rays. Always line the inside of Al hulls with HDPE/Water!",
    },
  ] as ShieldingMaterialSpec[],

  organSusceptibility: [
    {
      id: "bone-marrow-hematopoietic",
      organOrTissue: "Red Bone Marrow (Hematopoietic Stem Cells)",
      icrpTissueWeightingFactorWT: 0.12,
      thresholdDoseAcuteGy: "0.5 Gy (Lymphopenia) / 1.5–2.0 Gy (H-ARS Neutropenia)",
      spaceflightManifestation:
        "Rapid apoptosis of lymphocytes within 6–24 hours, followed by depletion of myeloid and megakaryocytic progenitors causing lethal opportunistic sepsis and hemorrhage at Days 14–28. Aggravated by microgravity 'Space Anemia'.",
      cellularTarget: "CD34+ Hematopoietic Stem Cells & circulating T/B lymphocytes",
      medicalCountermeasure:
        "Astrorad Selective Iliac/Sternal Shielding Vest + Filgrastim (G-CSF 10 mcg/kg/d) + Pegfilgrastim + Levofloxacin prophylaxis.",
    },
    {
      id: "cns-hippocampus",
      organOrTissue: "Central Nervous System (Hippocampus & Prefrontal Cortex)",
      icrpTissueWeightingFactorWT: 0.01,
      thresholdDoseAcuteGy: "0.1–0.4 Gy HZE (Space Brain Cognitive Defect) / 10 Gy (Acute CNS ARS)",
      spaceflightManifestation:
        "Even low-dose HZE heavy ions ($^{56}\\text{Fe}$, $^{48}\\text{Ti}$, $^{16}\\text{O}$) prune dendritic spines, ablate subgranular hippocampal neurogenesis, and activate chronic microglial neuro-inflammation—impairing executive decision-making, spatial memory, and fear extinction on Mars missions.",
      cellularTarget: "Dentate gyrus neural stem cells, prefrontal glutamatergic synapses, and microglia",
      medicalCountermeasure:
        "HDPE crew-berth helmet shielding, Melatonin / Amifostine free-radical scavengers, and aerobic exercise BDNF upregulation.",
    },
    {
      id: "ocular-lens-retina",
      organOrTissue: "Ocular Lens & Retina (Posterior Subcapsular Cataracts)",
      icrpTissueWeightingFactorWT: 0.04,
      thresholdDoseAcuteGy: "0.5 Gy (ICRP Lens Threshold; no true zero-threshold for HZE)",
      spaceflightManifestation:
        "Immediate visual phosphenes ('shooting stars' with eyes closed as HZE ions traverse retinal photoreceptors via Cherenkov/direct ionization) and accelerated posterior subcapsular cataractogenesis in Apollo and ISS astronauts.",
      cellularTarget: "Lens equatorial germinative epithelial cells & retinal rod outer segments",
      medicalCountermeasure:
        "Polycarbonate-visor UV/particle shielding and dietary lutein/zeaxanthin/ascorbate antioxidant protection.",
    },
    {
      id: "cardiovascular-endothelium",
      organOrTissue: "Cardiovascular Endothelium & Coronary Microvasculature",
      icrpTissueWeightingFactorWT: 0.08,
      thresholdDoseAcuteGy: "0.5 Gy (Accelerated Spaceflight Vascular Aging)",
      spaceflightManifestation:
        "HZE ions uncouple endothelial nitric oxide synthase (eNOS), generate peroxynitrite ($\text{ONOO}^-$), accelerate carotid intima-media thickening, and promote coronary plaque destabilization and myocardial fibrosis (observed in Apollo lunar astronauts).",
      cellularTarget: "Coronary and aortic vascular endothelial cells",
      medicalCountermeasure:
        "Thoracic Astrorad shielding, statin/antioxidant endothelial protection, and strict blood pressure/lipid control.",
    },
    {
      id: "gi-tract-mucosa",
      organOrTissue: "Gastrointestinal Tract (Colon & Small Intestinal Crypts)",
      icrpTissueWeightingFactorWT: 0.12,
      thresholdDoseAcuteGy: "6.0 Gy (GI-ARS) / 0.5 Gy (Microbiome Dysbiosis & Tight-Junction Leak)",
      spaceflightManifestation:
        "High mitotic rate makes Lgr5+ intestinal crypt stem cells highly radiosensitive; acute SPE doses > 6 Gy cause mucosal sloughing and gram-negative endotoxemia, while chronic GCR alters gut microbiome diversity.",
      cellularTarget: "Lgr5+ intestinal crypt base columnar stem cells",
      medicalCountermeasure:
        "Abdominal Astrorad shielding, Ondansetron, oral hydration, and broad-spectrum antimicrobials (Ceftriaxone/Levofloxacin).",
    },
    {
      id: "gonads-reproductive",
      organOrTissue: "Gonads (Ovarian Follicles & Testicular Spermatogonia)",
      icrpTissueWeightingFactorWT: 0.08,
      thresholdDoseAcuteGy: "0.15 Gy (Temporary Oligospermia) / 2.5–3.5 Gy (Permanent Ovarian Failure)",
      spaceflightManifestation:
        "Type B spermatogonia and primordial ovarian follicles are exquisitely sensitive to high-LET DNA double-strand breaks, causing temporary or permanent infertility and germ-line genomic instability.",
      cellularTarget: "Spermatogonial stem cells and primordial oocytes",
      medicalCountermeasure:
        "Selective pelvic Astrorad shielding and pre-mission gamete cryopreservation.",
    },
  ] as OrganSusceptibilitySpec[],
};
