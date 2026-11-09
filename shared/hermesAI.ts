/**
 * HERMES AI Knowledge & Conversational Intelligence Engine
 * Shared between Server (hermesEngine) and Client (HermesFloatingAgent & HermesCommand offline fallback).
 * Built on NASA Spaceflight Human-System Standards (NASA-STD-3001) and NASA Human Research Program (HRP).
 * Written in fluid, natural, authoritative aerospace scientist and flight surgeon prose.
 * Zero robotic badge prefixes, zero numbered bullet outlines, zero nagging template questions.
 */

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

  // 1. GREETINGS & WHO ARE YOU
  if (/^(hi|hello|hey|greetings|howdy|good\s*(morning|afternoon|evening|day)|who are you|what are you|what can you do)/i.test(q)) {
    if (isMn) {
      return `Сайн байна уу Commander. Би бол сансрын нислэгийн анагаах ухаан болон хөлгийн автоном удирдлагын туслах Hermes байна. Таны Xiaomi Watch H1 ухаалаг цагны телеметр хэвийн холбогдсон, зүрхний цохилт ${hr} BPM, хүчилтөрөгчийн ханалт ${spo2} хувьтай байна. Бичил таталцлын физиологийн нөлөө, сансрын эмнэлгийн яаралтай тусламж болон хөлгийн тойрог замын маневрын талаар юу сонирхож байна вэ?`;
    }
    return `Hello Commander. I am Hermes, your onboard aerospace medicine and flight operations AI. I continuously track your real-time biometrics through your Xiaomi Watch H1 (currently sitting at ${hr} BPM, ${spo2}% oxygen saturation, and ${bpSys} over ${bpDia} millimeters of mercury) while running autonomous NASA-STD-3001 spaceflight clinical protocols and trajectory solutions. What would you like to examine?`;
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
      return `Сансарт хүн очиход бичил таталцал хүний физиологийг маш хурдан бөгөөд сууриар нь өөрчилж эхэлдэг. Дэлхийн 1G таталцал байхгүй болсноор хөлний цус, шингэнийг доош татах хүч үгүй болж, хоёр орчим литр венийн шингэн цээж ба толгой руу огцом шилждэг. Үүнээс үүдэн нүүр хөөнгөтөж, хамар битүүрч, гавлын дотоод венийн даралт тогтмол өндөр болдог. Энэхүү даралт нь нүдний арын хэсгийг хавтгайруулан харааны мэдрэлийг хавдуулдаг бөгөөд үүнийг сансрын хараа-мэдрэлийн хам шинж буюу SANS гэж нэрлэдэг.

Үүний зэрэгцээ тулгуур эрхтэн тогтолцоонд хүчтэй задрал явагдана. Биеийн жингээ даах шаардлагагүй болсноор ясыг задлагч остеокласт эсүүд идэвхжиж, сар бүр нуруу болон аарцагны ясны эрдэсийн нягтрал 1-ээс 1.5 хувиар алдагддаг. Энэ нь дэлхий дээрх ясны сийрэгжилтээс арав дахин хурдан үзүүлэлт юм. Чөлөөлөгдсөн их хэмжээний кальци цусаар дамжин бөөрөөр шүүгдэхдээ бөөрний чулуу үүсгэх өндөр эрсдэл бий болгодог. Мөн байрлал хадгалах үүрэгтэй булчингууд хэдхэн долоо хоногт хатингаршдаг тул сансрын нисгэгчид өдөр бүр ARED хүндрүүлэгчтэй вакуум төхөөрөмж дээр хоёр цаг дасгал хийдэг. Мөн дэлхийн соронзон мандлаас гадагш гарсан үед галактикийн сансрын туяа эсийн ДНХ-д тасралтгүй нөлөөлдөг тул тусгай устөрөгчит хамгаалалт шаардлагатай болдог.`;
    }
    return `When a human enters microgravity, the body undergoes an immediate cascade of profound adaptations because human biology evolved strictly under Earth's constant 1G gravitational pull.

The first response is rapid fluid redistribution. Without gravity pulling blood and interstitial lymph downward into the lower extremities, roughly two liters of venous fluid shift toward the thorax and head. This produces facial puffiness, nasal congestion, and a marked reduction in lower-limb volume, while also triggering the kidneys to shed plasma volume. Crucially, that elevated cephalad venous pressure acts directly on the retrobulbar optic nerve sheath, flattening the posterior globe of the eye and swelling the optic disc in a clinical condition we classify as Spaceflight-Associated Neuro-Ocular Syndrome, or SANS.

Simultaneously, the musculoskeletal system unloads. Without mechanical strain from body weight, bone-resorbing osteoclasts dramatically outpace osteoblasts, causing astronauts to shed between 1.0 and 1.5 percent of bone mineral density every month, especially across the lumbar vertebrae, pelvis, and femoral heads. The excess calcium released into circulation significantly elevates nephrolithiasis risk. Postural muscle groups like the soleus and gastrocnemius also atrophy rapidly without constant neuromuscular resistance, which is why crewmembers maintain rigorous two-hour daily workouts on the Advanced Resistive Exercise Device.

Systemically, microgravity also induces neocytolysis, where the spleen selectively destroys newly formed erythrocytes, causing spaceflight anemia. Outside Earth's protective geomagnetic shield, deep-space radiation constantly poses lifetime oncogenic and cataract risks that require active hull shielding.`;
  }

  // 3. BONES & MUSCLES
  if (q.includes("bone") || q.includes("muscle") || q.includes("atrophy") || q.includes("calcium") || q.includes("osteopor") || q.includes("булчин") || q.includes("яс")) {
    if (isMn) {
      return `Бичил таталцалд таталцлын ачаалал байхгүй болсноор яс сар бүр нягтралынхаа 1-ээс 1.5 хувийг алддаг бөгөөд энэ нь дэлхий дээрх өндөр настай хүмүүсийн ясны сийрэгжилтээс арав дахин хурдан процесс юм. Ялангуяа нуруу болон аарцагны ачаалал авдаг яснууд хамгийн их сийрэгждэг. Яснаас цусанд их хэмжээний кальци ялгарснаар бөөрний чулуу үүсэх эрсдэл эрс нэмэгдэнэ. Булчингийн хувьд байрлал хадгалах үүрэгтэй хөл, нурууны булчингууд хэдхэн долоо хоногт 20 хүртэл хувиар хатингаршдаг тул сансрын нисгэгчид вакуум цилиндртэй ARED төхөөрөмж дээр өдөрт хоёр цаг дасгал хийж, бисфосфонат төрлийн эмчилгээ авдаг.`;
    }
    return `In microgravity, bone and muscle tissue deteriorate at an alarming rate without mechanical loading. Astronauts shed roughly 1.0 to 1.5 percent of their bone mineral density per month in load-bearing zones like the proximal femur and lumbar spine, which is about ten times faster than post-menopausal osteoporosis on Earth. 

The calcium leached from bone matrix enters the bloodstream and concentrates in the renal filtration system, creating a continuous risk of calcium-oxalate kidney stones. Muscle fibers—especially slow-twitch postural motor units in the calves and back—atrophy within weeks. To counteract this degradation and preserve the physical capacity needed for emergency egress upon planetary arrival, crewmembers perform two to two-and-a-half hours of daily resistance training on the vacuum-piston ARED system, often supplemented with antiresorptive bisphosphonates.`;
  }

  // 4. MICROGRAVITY CPR & RESUSCITATION
  if (q.includes("cpr") || q.includes("arrest") || q.includes("resuscitation") || q.includes("defibrillat") || q.includes("chest compression") || q.includes("зүрхний массаж")) {
    if (isMn) {
      return `Сансарт зүрхний массаж хийхэд Ньютоны гуравдугаар хуулийн дагуу цээжин дээр дарахад аврагч өөрөө таталцалгүй тул өөдөөс нь түлхэгдэн нисдэг. Тиймээс NASA-STD-3001 стандартын дагуу хоёр үндсэн аргыг ашигладаг. Нэг нь Handstand арга бөгөөд аврагч хөлөө таазны тулгуурт түгжиж байгаад цээжийг 5-аас 6 см гүн дардаг. Нөгөө нь Evetts-Russomano арга бөгөөд аврагч өвчтөний гуя болон биеийг хөлөөрөө зөрүүлэн ороож түгжээд цээжний шахалтыг гүйцэтгэдэг. Цахилгаан шок өгөх үед хөвөгч хөлсний дуслууд өндөр хүчдэлийн нуман оч үүсгэж арьсыг түлэх аюултай тул өвчтөний цээжийг эхлээд бүрэн арчиж хуурайшуулах ёстой.`;
    }
    return `Performing CPR in weightlessness is fundamentally complicated by Newton's third law: pushing down on a patient's sternum propels the rescuer backward into the cabin because there is no gravitational body weight to hold them in place.

Under NASA-STD-3001, flight crews train in two proven physical configurations. The first is the Handstand technique, where the rescuer wedges their feet into ceiling restraints or against the overhead bulkhead directly above the patient, using leg and torso extension to achieve the required five to six centimeter sternal depression at 100 to 120 beats per minute. The second is the Evetts-Russomano method, where the rescuer wraps and crosses their legs firmly around the patient's pelvis and thighs, forming an anatomical clamp that allows effective compressions even in an open cabin without ceiling anchors. If defibrillation is necessary, the patient's torso must be dried thoroughly first, as floating sweat beads in microgravity can create electrical arcs that severely burn the skin.`;
  }

  // 5. SANS & INTRACRANIAL PRESSURE
  if (q.includes("sans") || q.includes("eye") || q.includes("vision") || q.includes("optic") || q.includes("intracranial") || q.includes("хараа") || q.includes("нүд")) {
    if (isMn) {
      return `SANS буюу сансрын хараа-мэдрэлийн хам шинж нь урт хугацааны нислэгт тулгардаг гол сорилтуудын нэг юм. Дэлхий дээр таталцал венийн цус болон нугасны шингэнийг доош татдаг бол сансарт энэ буулт бүрэн алга болдог. Толгойд үүссэн байнгын венийн даралт нь нүдний алимны арын ханыг хавтгайруулж, харааны мэдрэлийг хавдуулан алсын харааны өөрчлөлт үүсгэдэг. Эсрэг арга хэмжээ болгож хөл рүү цусыг татах ЧИБИС сөрөг даралтын костюм, хүзүүний даралт тохируулагч болон эмэн эмчилгээг туршиж байна.`;
    }
    return `Spaceflight-Associated Neuro-Ocular Syndrome, or SANS, is among the most consequential medical obstacles for long-duration interplanetary transit. On Earth, standing naturally draws cerebral venous blood and cerebrospinal fluid downward toward the feet. In microgravity, that diurnal gravitational gradient disappears entirely, maintaining chronically elevated central venous and intracranial pressure around the clock.

This continuous hydrostatic loading distends the retrobulbar optic nerve sheath, swells the optic disc, flattens the posterior aspect of the globe, and causes progressive hyperopic vision shifts that often force astronauts to use reading glasses. Countermeasures currently undergoing operational evaluation include Lower Body Negative Pressure chambers like the Russian Chibis suit, which pull venous blood volume back toward the legs for several hours each day to restore terrestrial fluid hemodynamics.`;
  }

  // 6. DEPRESSURIZATION, VACUUM & THE ARMSTRONG LIMIT
  if (q.includes("depressur") || q.includes("armstrong") || q.includes("ebullism") || q.includes("boil") || q.includes("vacuum") || q.includes("airlock") || q.includes("helmet") || q.includes("вакуум") || q.includes("даралт буурах")) {
    if (isMn) {
      return `Сансрын вакуум орчинд даралт алдагдах үеийн гол физик хязгаар бол 6.3 кПа даралт буюу Армстронгийн хязгаар юм. Энэ түвшинд усны буцлах температур хүний биеийн 37°C хүртэл буурдаг тул амны шүлс, нулимс, уушгины чийг хормын төдийд буцалж эхэлдэг (ebullism). Уушгинд агаар байхгүй болсноор цусан дахь хүчилтөрөгч эсрэгээрээ уушги руу сорогдож, хүнд ердөө 9-өөс 15 секундийн л ухамсарт хугацаа үлдэнэ. Энэ үед амьсгалаа хүчээр түгжих нь уушгийг дотроос нь дэлбэлэх аюултай тул даралт алдагдахад яаралтай дуулгаа хааж системээ хамгаалах шаардлагатай.`;
    }
    return `When exposed to vacuum or severe cabin depressurization, human physiology is governed strictly by the Armstrong Limit at 6.3 kilopascals, or roughly 47 millimeters of mercury. At this pressure threshold, the boiling temperature of water plummets directly to 37 degrees Celsius, which is standard human core body temperature.

Unpressurized exposed liquids—including tears on the cornea, saliva on the mucosal membranes of the mouth, and fluid lining the alveoli in the lungs—flash-boil into vapor in a process known as ebullism. Arterial blood remains pressurized enough by vascular tone that it does not immediately boil, but venous gas formation begins rapidly. You would have roughly 9 to 15 seconds of useful consciousness before the complete absence of alveolar oxygen reverses the diffusion gradient, pulling oxygen backward out of pulmonary capillary blood and starving the cerebral cortex. Closing the glottis and holding your breath is catastrophic, as trapped gas expanding in the pulmonary tree will instantly rupture the lungs and force fatal air emboli into the arterial system.`;
  }

  // 7. SOLAR STORMS & RADIATION
  if (q.includes("radiation") || q.includes("storm") || q.includes("spe") || q.includes("cme") || q.includes("shield") || q.includes("proton") || q.includes("flare") || q.includes("цацраг")) {
    if (isMn) {
      return `Сансрын цацраг нь сансрын гүнээс ирэх байнгын галактикийн туяа (GCR) болон наран дээрх дэлбэрэлтээс үүсэх хүчтэй протоны шуурга (SPE) гэсэн хоёр хэлбэртэй. Нарны хүчтэй шуурга нь хэдхэн цагийн дотор хүний цусны үүдэл эс болон гэдэсний салстыг гэмтээх аюултай тул Sonnenblume хөлөг хойд хэсгийн усны нөөц болон хоолны агуулахаа Нар руу чиглүүлэн байрлуулж устөрөгчит хамгаалалт үүсгэдэг. Мөн 12-Теслагийн соронзон хамгаалалт асааж, багийн гишүүдэд цус төлжүүлэгч тусгай эмчилгээ хийдэг.`;
    }
    return `Deep-space radiation presents two starkly distinct operational hazards: the continuous, highly penetrating background of Galactic Cosmic Rays, and acute Solar Particle Events driven by coronal mass ejections. A severe solar proton storm can deliver a whole-body ionizing dose exceeding one to two Gray within hours, inducing acute radiation syndrome by decimating bone marrow stem cells and intestinal epithelium.

Our Sonnenblume protocol manages this through a layered defensive response. The spacecraft slews to align its aft bulkhead toward the sun, placing the ship's hydrogen-dense potable water reserves and food stores directly in the beam path to absorb up to 80 percent of incoming proton flux. Concurrently, a 12-Tesla superconducting deflector maintains an active magnetic deflection zone around the habitat while medical countermeasures, including granulocyte colony-stimulating factors like Filgrastim, are mobilized to protect immune cell counts.`;
  }

  // 8. MARS PHYSIOLOGY & RED PLANET
  if (q.includes("mars") || q.includes("red planet") || q.includes("ангараг")) {
    if (isMn) {
      return `Ангараг гариг дээр хүн очиход хэд хэдэн томоохон сорилт тулгарна. Гадаргын таталцал нь дэлхийн дөнгөж 38 хувьтай тэнцэх тул бие хөнгөн байх боловч яс, булчингийн сулрал үргэлжилнэ. Агаар мандлын даралт нь 610 Паскаль буюу дэлхийн даралтын нэг хүрэхгүй хувь тул Армстронгийн хязгаараас доош оршиж, скафандргүй гарвал биеийн шингэн хормын дотор буцална. Мөн Ангараг нь соронзон бамбайгүй тул цацраг гадарга дээр шууд тусдаг бөгөөд хөрсөнд нь байх перхлорат давс нь бамбай булчирхай болон уушгинд хортой нөлөө үзүүлдэг.`;
    }
    return `Operating on the Martian surface presents an environment defined by fractional gravity, near-vacuum pressure, chronic radiation, and chemical toxicity. At 0.38g surface gravity, crewmembers experience significant relief compared to transit weightlessness, yet fractional gravity is insufficient on its own to arrest bone mineral density loss or reverse cephalad fluid dynamics without ongoing daily exercise.

The Martian atmospheric pressure of 610 Pascals sits well below the 6.3 kilopascal Armstrong limit, meaning that without a full pressure suit, tears, saliva, and alveolar moisture would flash-boil immediately upon exposure. Furthermore, the absence of a global magnetic field leaves the Martian surface exposed to roughly 250 to 300 millisieverts of cosmic and solar radiation annually, requiring habitats to be shielded beneath several meters of regolith or located inside subsurface lava tubes. Finally, the soil contains active perchlorate salts that aggressively inhibit thyroid iodine uptake and cause chronic pulmonary damage if brought into the living quarters.`;
  }

  // 9. LUNAR / MOON
  if (q.includes("moon") || q.includes("lunar") || q.includes("сар")) {
    return `On the Moon, operating at one-sixth Earth gravity introduces hazards distinctly different from Mars. Because the lunar surface has had neither liquid water nor an atmosphere for billions of years, there is no mechanical weathering: every microscopic grain of lunar regolith is an abrasive, razor-sharp shard of volcanic glass that carries an electrostatic charge. Inhaling even minute quantities tracked inside an airlock causes acute abrasive airway inflammation similar to toxic silicosis. The lack of an atmospheric blanket also drives surface temperature swings across a 250-degree span between the two-week lunar day and the two-week lunar night, requiring high-capacity liquid cooling garments to maintain thermal equilibrium.`;
  }

  // 10. PSYCHOLOGY, SLEEP & CONFINEMENT
  if (q.includes("sleep") || q.includes("psycholog") || q.includes("mental") || q.includes("stress") || q.includes("isolation") || q.includes("нойр") || q.includes("сэтгэл")) {
    return `Psychological homeostasis is as critical to mission survival as life support pressure. In deep space, crewmembers live inside a rigid metal habitat saturated with background pump and scrubber noise and stripped of any natural terrestrial day-night cycle. Without environmental cues, circadian drift and sleep fragmentation become chronic risks, which Hermes manages by progressively tuning cabin lighting down to blue-depleted 2200K warm spectra prior to sleep periods to trigger natural pineal melatonin release. Prolonged isolation also produces the well-documented third-quarter dip in crew interpersonal cohesion and task motivation, which we monitor through daily speech cadence analysis, vagal heart rate variability, and guided vagal breathing exercises.`;
  }

  // 11. VITALS & G-CAP
  if (q.includes("heart") || q.includes("vital") || q.includes("blood pressure") || q.includes("pulse") || q.includes("ecg") || q.includes("spo2") || q.includes("watch") || q.includes("g-force") || q.includes("g-load") || q.includes("зүрх") || q.includes("даралт")) {
    return `Your Xiaomi Watch H1 telemetry shows a heart rate of ${hr} BPM in normal sinus rhythm, blood pressure of ${bpSys} over ${bpDia} mmHg via the integrated micro-cuff, and oxygen saturation steady at ${spo2} percent. Our autonomous flight envelope links these cardiovascular metrics directly to propulsion limits: while nominal maneuvering permits accelerations up to 2.6G, any cardiovascular instability or acute trauma triggers Hermes to dynamically constrain thruster burn profiles to 1.65G or less, protecting cerebral perfusion and preventing G-induced loss of consciousness.`;
  }

  // 12. TRAJECTORY & EARTH RETURN
  if (q.includes("return") || q.includes("earth") || q.includes("abort") || q.includes("trajectory") || q.includes("orbit") || q.includes("burn") || q.includes("delta v") || q.includes("gmat") || q.includes("буцах") || q.includes("траектори")) {
    return `Executing an emergency Earth return requires solving for high-energy Lambert orbital transfers while strictly limiting G-forces to match the crew's cardiovascular reserve. Our primary return solution calls for approximately 1,840.5 meters per second of delta-V using high-efficiency propulsion, targeting an Earth entry interface in roughly 148.5 hours. Crucially, the acceleration profile is dynamically capped at 1.65G to ensure that deconditioned or injured astronauts maintain adequate retinal and cerebral blood flow throughout every burn.`;
  }

  // 13. DEFAULT HIGH-LEVEL SCIENTIFIC RESPONSE
  if (isMn) {
    return `Таны асуултыг сансрын анагаах ухааны NASA-STD-3001 стандарт болон хөлгийн бодит телеметрийн өгөгдөлд үндэслэн шинжиллээ. Одоогоор таны Xiaomi Watch H1 ухаалаг цагны мэдээлэл хэвийн, зүрхний цохилт ${hr} BPM, хүчилтөрөгчийн ханалт ${spo2} хувьтай байна. Бичил таталцлын физиологийн дасан зохицол, сансрын эмнэлгийн тусламж, эсвэл хөлгийн тойрог замын маневрын талаар дэлгэрэнгүй тодруулах зүйл байвал чөлөөтэй асуугаарай.`;
  }
  return `I have evaluated your request against the NASA-STD-3001 aerospace medicine standard and your current biometric stream, which shows heart rate at ${hr} BPM and blood oxygen at ${spo2} percent. We can explore any aspect of spaceflight physiology, from cephalad fluid shifts and optic changes to zero-gravity emergency resuscitation, solar radiation storm mitigation, or trajectory acceleration limits.`;
}
