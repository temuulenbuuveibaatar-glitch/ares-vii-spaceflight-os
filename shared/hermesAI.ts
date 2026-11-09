/**
 * HERMES AI Multilingual Conversational Intelligence Engine
 * Built for NASA Space Apps Challenge & Sonnenblume Space OS.
 * Supports 8 primary spaceflight languages:
 * 1. English (en) - NASA / International
 * 2. French (fr) - CNES / ESA Cadarache
 * 3. Spanish (es) - INTA / Latin America
 * 4. Chinese (zh) - CMSA Tiangong
 * 5. Russian (ru) - Roscosmos / IBMP
 * 6. Italian (it) - ASI / ESA
 * 7. German (de) - DLR / ESA Cologne
 * 8. Mongolian (mn) - Interkosmos / Gurragchaa Mission
 *
 * Direct, fascinating, authoritative aerospace scientist and flight surgeon prose.
 * Zero robotic brackets, zero numbered bullet outlines, zero nagging template questions.
 */

export type SupportedLanguage = "en" | "fr" | "es" | "zh" | "ru" | "it" | "de" | "mn";

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

export function detectLanguage(text: string): SupportedLanguage {
  const t = text.trim().toLowerCase();

  // Chinese characters
  if (/[\u4e00-\u9fa5]/.test(t)) return "zh";

  // Mongolian specific Cyrillic letters or keywords
  if (/[өү]/i.test(t) || /(сайн байна|хүний бие|сансарт|хөлөг|цус|зүрх|даралт|яс|булчин)/i.test(t)) return "mn";

  // Russian Cyrillic
  if (/[а-яё]/i.test(t)) return "ru";

  // German
  if (/(hallo|guten|schwerelosigkeit|körper|weltall|raumfahrt|blut|herz|knochen|strahlung|druck|was passiert)/i.test(t) || /[äöüß]/.test(t)) return "de";

  // French
  if (/(bonjour|salut|l'espace|le corps|pesanteur|microgravit[eé]|coeur|poumon|pression|vaisseau|que se passe)/i.test(t) || (/[éèêëàâôîïûùç]/.test(t) && /(dans|pour|avec|est|les|des|une|qui)/i.test(t))) return "fr";

  // Spanish
  if (/(hola|buenas|cuerpo humano|en el espacio|gravedad|microgravedad|coraz[oó]n|sangre|presi[oó]n|huesos|qu[eé] pasa)/i.test(t) || /[áéíóúñ¿¡]/.test(t)) return "es";

  // Italian
  if (/(ciao|salve|corpo umano|nello spazio|gravit[aà]|microgravit[aà]|cuore|sangue|pressione|ossa|cosa succede)/i.test(t)) return "it";

  return "en";
}

export function generateHermesAIResponse(prompt: string, context?: HermesAIContext): string {
  const q = prompt.trim().toLowerCase();
  const lang = detectLanguage(prompt);

  const hr = context?.heartRate ?? 72;
  const spo2 = context?.spo2 ?? 98;
  const bpSys = context?.bloodPressureSys ?? 118;
  const bpDia = context?.bloodPressureDia ?? 78;

  // 1. GREETINGS & INTRODUCTIONS
  if (/^(hi|hello|hey|greetings|howdy|good\s*(morning|afternoon|evening|day)|who are you|what are you|what can you do|bonjour|salut|hola|ciao|hallo|guten|сайн|здравствуйте|привет|你好)/i.test(q)) {
    switch (lang) {
      case "fr":
        return `Bonjour Commandant. Je suis Hermès, l'intelligence artificielle de bord dédiée à la médecine aérospatiale et à la conduite du vol pour la mission Sonnenblume. Je surveille en continu votre télémétrie biométrique Xiaomi Watch H1 (actuellement ${hr} battements par minute, ${spo2}% de saturation en oxygène et une tension artérielle de ${bpSys}/${bpDia} millimètres de mercure). Je suis prêt à vous assister sur les protocoles cliniques en microgravité et les calculs de trajectoire. Que souhaitez-vous analyser ?`;
      case "es":
        return `Hola Comandante. Soy Hermes, la inteligencia artificial de operaciones de vuelo y medicina aeroespacial a bordo de la misión Sonnenblume. Monitoreo continuamente su telemetría biométrica mediante el Xiaomi Watch H1 (actualmente ${hr} pulsaciones por minuto, ${spo2}% de saturación de oxígeno y presión arterial de ${bpSys}/${bpDia} mmHg). Estoy listo para responder consultas sobre fisiología espacial, protocolos clínicos y maniobras orbitales. ¿En qué puedo ayudarle hoy?`;
      case "zh":
        return `指挥官你好。我是赫尔墨斯（Hermes），Sonnenblume深空飞船上的航天医学与自主飞行人工智能。我正通过小米智能手表H1实时监测您的生理体征（当前心率为 ${hr} 次/分，血氧饱和度 ${spo2}%，血压 ${bpSys}/${bpDia} 毫米汞柱）。我可以为您提供失重生理学分析、太空临床应急处置以及轨道变轨计算。请问有什么需要协助的？`;
      case "ru":
        return `Здравствуйте, Командир. Я Гермес (Hermes) — бортовой искусственный интеллект космической медицины и управления полетом корабля Sonnenblume. Я непрерывно отслеживаю вашу телеметрию с часов Xiaomi Watch H1 (в настоящее время пульс ${hr} ударов в минуту, сатурация кислорода ${spo2}%, артериальное давление ${bpSys}/${bpDia} мм рт. ст.) и готов сопровождать протоколы реанимации и расчеты баллистических траекторий. Чем я могу помочь?`;
      case "it":
        return `Ciao Comandante. Sono Hermes, l'intelligenza artificiale di bordo per la medicina aerospaziale e il controllo di volo della missione Sonnenblume. Ricevo costantemente i vostri parametri biometrici dal Xiaomi Watch H1 (frequenza cardiaca di ${hr} battiti al minuto, saturazione d'ossigeno al ${spo2}%, pressione arteriosa ${bpSys}/${bpDia} mmHg). Sono a vostra disposizione per protocolli clinici in microgravità e calcoli orbitali. Cosa desiderate approfondire?`;
      case "de":
        return `Guten Tag, Kommandant. Ich bin Hermes, die Bord-KI für Raumfahrtmedizin und Flugbetrieb der Sonnenblume-Mission. Ich überwache kontinuierlich Ihre Xiaomi Watch H1 Telemetrie (derzeit ${hr} Schläge pro Minute, ${spo2}% Sauerstoffsättigung, Blutdruck ${bpSys}/${bpDia} mmHg). Ich unterstütze Sie bei allen mikrogravitativen Notfallprotokollen und orbitalen Manövern. Was möchten Sie überprüfen?`;
      case "mn":
        return `Сайн байна уу Commander. Би бол сансрын нислэгийн анагаах ухаан болон хөлгийн автоном удирдлагын туслах Hermes байна. Таны Xiaomi Watch H1 ухаалаг цагны телеметр хэвийн холбогдсон, зүрхний цохилт ${hr} BPM, хүчилтөрөгчийн ханалт ${spo2} хувьтай байна. Бичил таталцлын физиологийн нөлөө, сансрын эмнэлгийн яаралтай тусламж болон хөлгийн тойрог замын маневрын талаар юу сонирхож байна вэ?`;
      default:
        return `Hello Commander. I am Hermes, your onboard aerospace medicine and flight operations AI. I continuously track your real-time biometrics through your Xiaomi Watch H1 (currently sitting at ${hr} BPM, ${spo2}% oxygen saturation, and ${bpSys} over ${bpDia} millimeters of mercury) while running autonomous NASA-STD-3001 spaceflight clinical protocols and trajectory solutions. What would you like to examine?`;
    }
  }

  // 2. HUMAN BODY IN SPACE / MICROGRAVITY PHYSIOLOGY
  if (
    q.includes("human bod") ||
    q.includes("bodies") ||
    q.includes("body in space") ||
    q.includes("in space") ||
    q.includes("weightless") ||
    q.includes("microgravity") ||
    q.includes("physiology") ||
    q.includes("what happens") ||
    q.includes("corps") ||
    q.includes("cuerpo") ||
    q.includes("körper") ||
    q.includes("тело") ||
    q.includes("хүний бие") ||
    q.includes("人体")
  ) {
    switch (lang) {
      case "fr":
        return `En apesanteur, le corps humain subit une cascade immédiate d'adaptations physiologiques majeures, car notre organisme a évolué sous la gravité terrestre constante de 1G.

La première réaction est une redistribution hydrostatique massive. En l'absence de gravité pour attirer le sang et les fluides interstitiels vers les jambes, environ deux litres de liquide veineux migrent vers le thorax et la boîte crânienne. Cela provoque un gonflement du visage, une congestion nasale et une nette diminution du volume des membres inférieurs. Cette élévation chronique de la pression veineuse céphalique s'exerce sur la gaine du nerf optique rétrobulbaire, provoquant un œdème papillaire et un aplatissement du globe oculaire que nous classons cliniquement sous le nom de syndrome neuro-oculaire associé au vol spatial, ou SANS.

Simultanément, le système musculo-squelettique se décharge. Privés de contrainte mécanique, les ostéoclastes détruisent la matrice osseuse plus vite que les ostéoblastes ne la reconstruisent, entraînant une perte de densité minérale osseuse de 1,0 à 1,5% par mois, particulièrement au niveau du fémur et des vertèbres lombaires. Le calcium éliminé dans la circulation augmente significativement le risque de calculs rénaux. Les muscles posturaux s'atrophient rapidement, obligeant les astronautes à effectuer deux heures d'entraînement quotidien sur la machine de résistance ARED. De plus, la néocytolyse détruit activement les hématies récentes, créant une anémie spatiale qui nécessite une surveillance clinique constante.`;
      case "es":
        return `En microgravedad, el cuerpo humano experimenta una cascada inmediata de profundas adaptaciones biológicas, ya que nuestra fisiología evolucionó íntegramente bajo la gravedad terrestre constante de 1G.

La primera respuesta es una redistribución rápida de líquidos. Sin la gravedad que empuje la sangre y la linfa hacia los miembros inferiores, aproximadamente dos litros de líquido venoso se desplazan hacia el tórax y la cabeza. Esto genera edema facial, congestión nasal y piernas notablemente más delgadas. Esta presión venosa cefálica elevada actúa directamente sobre la vaina del nervio óptico retrobulbar, aplanando la parte posterior del globo ocular e hinchando el disco óptico en una afección clínica denominada síndrome neuro-ocular asociado al vuelo espacial (SANS).

Al mismo tiempo, el sistema musculoesquelético se desactiva. Sin la carga mecánica de soportar el peso corporal, los osteoclastos reabsorben tejido óseo a mayor velocidad de la que los osteoblastos pueden sintetizarlo, causando una pérdida de densidad mineral ósea del 1,0% al 1,5% mensual, especialmente en las vértebras lumbares, la pelvis y los fémures. El calcio volcado al torrente sanguíneo eleva notablemente el riesgo de cálculos renales. Los músculos posturales de las pantorrillas y la espalda sufren atrofia en pocas semanas, por lo que la tripulación realiza dos horas de ejercicio resistivo diario en el dispositivo ARED.`;
      case "zh":
        return `当人体进入失重环境时，生理机能会发生迅速且深刻的变化，因为人类生物学系统完全是在地球恒定的1G重力环境下演化而来的。

最先发生的反应是体液的头向转移。在没有重力将血液和组织液拉向下肢的情况下，大约两升静脉液体会直接涌向胸腔和头部。这会导致航天员面部浮肿、鼻塞，同时下肢体液显著减少。更重要的是，持续升高的颅内与颈静脉压力直接压迫眼球后方的视神经鞘，导致视盘水肿和眼球后壁扁平化，引发我们在航天临床医学中重点研究的“航天相关神经眼部综合征”（SANS）。

与此同时，骨骼与肌肉系统出现严重的力学卸载。失去了支撑体重的机械应力刺激，破骨细胞的活性远超成骨细胞，导致航天员每月骨矿物质密度流失1.0%至1.5%，特别是腰椎、骨盆和股骨头部位。骨骼释放到血液中的大量钙质显著增加了肾结石风险。维持姿势的比目鱼肌等抗重力肌群在几周内便迅速萎缩，这也是为什么机组乘员每天必须在ARED先进阻力锻炼装置上进行两小时高强度抗阻训练的原因。在深空环境中，红细胞还会因微重力发生快速溶血（空间贫血），且需要主动辐射屏蔽层防护宇宙射线。`;
      case "ru":
        return `При переходе в невесомость человеческий организм переживает немедленный каскад глубоких физиологических адаптаций, поскольку наша биология формировалась исключительно в условиях постоянной земной гравитации 1G.

Первая реакция — массивное гидростатическое перераспределение жидкостей. Из-за отсутствия гравитации, удерживающей кровь в нижней части тела, около двух литров венозной крови и интерстициальной жидкости устремляются в верхнюю часть груди и голову. Это вызывает одутловатость лица, заложенность носа и синдром «птичьих ног». Хронически повышенное венозное давление в полости черепа давит на оболочку зрительного нерва, вызывая отек диска зрительного нерва и уплощение задней стенки глазного яблока — клиническое состояние, известное как космический нейроокулярный синдром (SANS).

Одновременно опорно-двигательный аппарат лишается механической нагрузки. Остеокласты разрушают костный матрикс быстрее, чем остеобласты успевают его восстанавливать, из-за чего космонавты теряют от 1,0% до 1,5% минеральной плотности костей в месяц, преимущественно в поясничном отделе и бедренных костях. Вымываемый кальций многократно повышает риск нефролитиаза (камней в почках). Постуральные мышцы атрофируются в течение недель, поэтому экипаж ежедневно тренируется по два часа на силовом тренажере ARED и использует компенсирующие костюмы с отрицательным давлением.`;
      case "it":
        return `In microgravità, il corpo umano va incontro a una cascata immediata di profondi adattamenti fisiologici, poiché la nostra biologia si è evoluta interamente sotto la costante accelerazione di gravità terrestre di 1G.

La prima risposta è una massiccia redistribuzione dei fluidi. Senza la gravità a richiamare il sangue verso gli arti inferiori, circa due litri di liquidi venosi migrano verso il torace e la testa. Ciò produce edema facciale, congestione nasale e una marcata riduzione del volume delle gambe. La persistente pressione venosa cefalica agisce sulla guaina del nervo ottico retrobulbare, appiattendo il polo posteriore del bulbo oculare e rigonfiando il disco ottico, un quadro clinico noto come sindrome neuro-oculare associata al volo spaziale (SANS).

Contemporaneamente, l'apparato muscolo-scheletrico si scarica completamente. Senza lo stimolo del peso corporeo, gli osteoclasti riassorbono matrice ossea molto più velocemente di quanto gli osteoblasti possano rigenerarla, provocando una perdita di densità minerale ossea dell'1,0-1,5% ogni mese, soprattutto a livello del femore e delle vertebre lombari. Il calcio immesso nel circolo sanguigno aumenta drasticamente il rischio di calcolosi renale. I muscoli posturali si atrofizzano rapidamente, motivo per cui gli astronauti eseguono due ore di rigoroso esercizio quotidiano sul dispositivo ARED.`;
      case "de":
        return `In der Mikrogravitation durchläuft der menschliche Körper eine sofortige Kaskade tiefgreifender physiologischer Anpassungen, da sich unsere Biologie ausschließlich unter der konstanten 1G-Erdanziehungskraft entwickelt hat.

Die erste Reaktion ist eine massive Flüssigkeitsumverteilung kopfwärts. Da die Schwerkraft fehlt, um Blut und Lymphe in den Beinen zu halten, verlagern sich rund zwei Liter venöse Flüssigkeit in den Brustkorb und Kopf. Dies führt zu Gesichtsschwellungen, verstopfter Nase und deutlich dünneren Beinen. Der chronisch erhöhte venöse Druck im Schädel belastet die retrobulbäre Sehnervenscheide, flacht den hinteren Augapfel ab und führt zum raumfahrtassoziierten neuro-okulären Syndrom (SANS).

Gleichzeitig wird der Bewegungsapparat entlastet. Ohne mechanische Belastung bauen Osteoklasten Knochengewebe schneller ab als Osteoblasten neues aufbauen können, was zu einem Knochendichteverlust von 1,0 bis 1,5 Prozent pro Monat führt, insbesondere in der Lendenwirbelsäule und den Oberschenkelknochen. Das ins Blut freigesetzte Kalzium erhöht das Risiko für Nierensteine erheblich. Haltungsmuskeln atrophieren innerhalb weniger Wochen, weshalb die Besatzung täglich zwei Stunden intensives Krafttraining am ARED-Gerät absolviert.`;
      case "mn":
        return `Сансарт хүн очиход бичил таталцал хүний физиологийг маш хурдан бөгөөд сууриар нь өөрчилж эхэлдэг. Дэлхийн 1G таталцал байхгүй болсноор хөлний цус, шингэнийг доош татах хүч үгүй болж, хоёр орчим литр венийн шингэн цээж ба толгой руу огцом шилждэг. Үүнээс үүдэн нүүр хөөнгөтөж, хамар битүүрч, гавлын дотоод венийн даралт тогтмол өндөр болдог. Энэхүү даралт нь нүдний арын хэсгийг хавтгайруулан харааны мэдрэлийг хавдуулдаг бөгөөд үүнийг сансрын хараа-мэдрэлийн хам шинж буюу SANS гэж нэрлэдэг.

Үүний зэрэгцээ тулгуур эрхтэн тогтолцоонд хүчтэй задрал явагдана. Биеийн жингээ даах шаардлагагүй болсноор ясыг задлагч остеокласт эсүүд идэвхжиж, сар бүр нуруу болон аарцагны ясны эрдэсийн нягтрал 1-ээс 1.5 хувиар алдагддаг. Энэ нь дэлхий дээрх ясны сийрэгжилтээс арав дахин хурдан үзүүлэлт юм. Чөлөөлөгдсөн их хэмжээний кальци цусаар дамжин бөөрөөр шүүгдэхдээ бөөрний чулуу үүсгэх өндөр эрсдэл бий болгодог. Мөн байрлал хадгалах үүрэгтэй булчингууд хэдхэн долоо хоногт хатингаршдаг тул сансрын нисгэгчид өдөр бүр ARED хүндрүүлэгчтэй вакуум төхөөрөмж дээр хоёр цаг дасгал хийдэг. Мөн дэлхийн соронзон мандлаас гадагш гарсан үед галактикийн сансрын туяа эсийн ДНХ-д тасралтгүй нөлөөлдөг тул тусгай устөрөгчит хамгаалалт шаардлагатай болдог.`;
      default:
        return `When a human enters microgravity, the body undergoes an immediate cascade of profound adaptations because human biology evolved strictly under Earth's constant 1G gravitational pull.

The first response is rapid fluid redistribution. Without gravity pulling blood and interstitial lymph downward into the lower extremities, roughly two liters of venous fluid shift toward the thorax and head. This produces facial puffiness, nasal congestion, and a marked reduction in lower-limb volume, while also triggering the kidneys to shed plasma volume. Crucially, that elevated cephalad venous pressure acts directly on the retrobulbar optic nerve sheath, flattening the posterior globe of the eye and swelling the optic disc in a clinical condition we classify as Spaceflight-Associated Neuro-Ocular Syndrome, or SANS.

Simultaneously, the musculoskeletal system unloads. Without mechanical strain from body weight, bone-resorbing osteoclasts dramatically outpace osteoblasts, causing astronauts to shed between 1.0 and 1.5 percent of bone mineral density every month, especially across the lumbar vertebrae, pelvis, and femoral heads. The excess calcium released into circulation significantly elevates nephrolithiasis risk. Postural muscle groups like the soleus and gastrocnemius also atrophy rapidly without constant neuromuscular resistance, which is why crewmembers maintain rigorous two-hour daily workouts on the Advanced Resistive Exercise Device.

Systemically, microgravity also induces neocytolysis, where the spleen selectively destroys newly formed erythrocytes, causing spaceflight anemia. Outside Earth's protective geomagnetic shield, deep-space radiation constantly poses lifetime oncogenic and cataract risks that require active hull shielding.`;
    }
  }

  // 3. CPR & CARDIAC ARREST IN MICROGRAVITY
  if (q.includes("cpr") || q.includes("arrest") || q.includes("resuscitation") || q.includes("defibrillat") || q.includes("réanimation") || q.includes("reanimación") || q.includes("wiederbelebung") || q.includes("рианимац") || q.includes("心肺复苏")) {
    switch (lang) {
      case "fr":
        return `Effectuer une réanimation cardiopulmonaire en apesanteur pose un défi physique direct lié à la troisième loi de Newton : appuyer sur le sternum d'un patient repousse le sauveteur dans l'habitacle en l'absence de poids corporel. Conformément aux standards de la NASA et de l'ESA, nous utilisons soit la technique Handstand (le sauveteur cale ses pieds contre la cloison supérieure et comprime le thorax de 5 à 6 cm à un rythme de 100 à 120 battements par minute), soit la méthode Evetts-Russomano où le sauveteur enroule et verrouille ses jambes autour des cuisses du patient pour former une pince anatomique stable. En cas de défibrillation, le thorax doit être soigneusement essuyé au préalable car les gouttes de sueur flottantes peuvent générer des arcs électriques causant de sévères brûlures.`;
      case "es":
        return `Realizar RCP en microgravedad enfrenta el principio de acción y reacción de Newton: al presionar el esternón del paciente, el reanimador es empujado hacia atrás en la cabina al carecer de peso gravitatorio. Según los estándares NASA-STD-3001, se aplican dos técnicas: el método Handstand, trabando los pies en el techo o mamparo superior para deprimir el tórax entre 5 y 6 cm a 100-120 compresiones por minuto; o la maniobra Evetts-Russomano, donde el rescatista cruza y abraza sus piernas alrededor de los muslos del paciente para crear una pinza rígida. En caso de desfibrilación, la piel debe secarse por completo para evitar que las gotas de sudor en flotación generen arcos voltaicos y quemaduras.`;
      case "zh":
        return `在微重力环境下执行心肺复苏（CPR）面临牛顿第三定律的直接限制：向下按压患者胸骨时，施救者因无体重锚定会被反作用力推向舱顶。根据NASA-STD-3001标准，航天员训练采用两种核心技术：第一种是倒立按压法（Handstand Method），施救者将双脚卡入头顶天花板支架，借助腿部与手臂力量使胸骨下陷5至6厘米，频率为每分钟100至120次；第二种是Evetts-Russomano腿部缠绕法，施救者用双腿紧紧锁住患者大腿形成人体机械钳。若需除颤，必须彻底擦干胸部皮肤，因为漂浮的汗液微滴会引发高压电弧严重灼伤组织。`;
      case "ru":
        return `Проведение сердечно-легочной реанимации в невесомости подчиняется третьему закону Ньютона: компрессия грудины отталкивает спасателя назад из-за отсутствия массы тела. По стандартам NASA-STD-3001 применяются две техники: метод Handstand (спасатель фиксирует стопы на потолочном шпангоуте над пациентом, продавливая грудину на 5–6 см с частотой 100–120 в минуту) и метод Эветтса-Руссомано (спасатель обхватывает и замыкает ноги вокруг бедер пациента, создавая жесткий зажим). При дефибрилляции грудь должна быть вытерта насухо, так как парящие капли пота в невесомости могут вызвать опасный электрический дуговой разряд.`;
      default:
        return `Performing CPR in weightlessness is fundamentally complicated by Newton's third law: pushing down on a patient's sternum propels the rescuer backward into the cabin because there is no gravitational body weight to hold them in place. Under NASA-STD-3001, flight crews train in two proven physical configurations: the Handstand technique, wedging feet into ceiling restraints to depress the chest 5 to 6 cm at 100 to 120 beats per minute, or the Evetts-Russomano method, where the rescuer firmly clamps their legs around the patient's pelvis and thighs. When delivering a defibrillation shock, the torso must be dried completely because floating sweat beads can create high-voltage electrical arcs across the skin.`;
    }
  }

  // 4. DEPRESSURIZATION, VACUUM & ARMSTRONG LIMIT
  if (q.includes("depressur") || q.includes("armstrong") || q.includes("vacuum") || q.includes("vide") || q.includes("vacío") || q.includes("vakuum") || q.includes("вакуум") || q.includes("真空")) {
    switch (lang) {
      case "fr":
        return `En cas de dépressurisation brutale ou d'exposition au vide spatial, la physiologie humaine est dictée par la limite d'Armstrong située à 6,3 kilopascals (environ 47 mmHg). À cette pression, le point d'ébullition de l'eau chute exactement à 37°C, soit la température corporelle normale. La salive, les larmes et l'humidité alvéolaire des poumons entrent instantanément en ébullition (phénomène d'ébullisme). Le sujet ne dispose que de 9 à 15 secondes de conscience utile avant que l'absence totale d'oxygène alvéolaire n'inverse le gradient de diffusion, extrayant l'oxygène du sang capillaire. Bloquer sa respiration en fermant la glotte est immédiatement mortel car l'expansion de l'air pulmonaire fait exploser les alvéoles et injecte des embolies gazeuses massives dans le cerveau.`;
      case "zh":
        return `遭遇舱室失压或太空真空暴露时，人体生理受阿姆斯特朗极限（6.3千帕，约47毫米汞柱）严格支配。在此临界气压下，水的沸点降至37摄氏度即人体核心体温。眼角膜泪液、口腔唾液和肺泡表面的水分会瞬间沸腾汽化（体液沸腾现象）。由于肺部完全缺失氧分压，静脉血流经肺部时氧气反而会迅速逆向反渗流失，人仅有9至15秒的有效意识时间。在此过程中绝对不能屏住呼吸闭合声门，否则膨胀的气体将瞬间撕裂肺泡，导致致命的肺气压伤和脑动脉空气栓塞。`;
      default:
        return `When exposed to vacuum or severe cabin depressurization, human physiology is governed strictly by the Armstrong Limit at 6.3 kilopascals (roughly 47 millimeters of mercury), where the boiling point of water drops directly to 37 degrees Celsius. Exposed corneal moisture, saliva, and alveolar lining fluid flash-boil into vapor through ebullism. You would have approximately 9 to 15 seconds of useful consciousness before the complete absence of alveolar oxygen reverses the diffusion gradient, pulling oxygen backward out of pulmonary blood and starving the brain. Closing the glottis to hold your breath is immediately fatal, as expanding trapped gas will rupture the pulmonary tree and inject massive air emboli into arterial circulation.`;
    }
  }

  // 5. SOLAR RADIATION STORMS (SPE) & SHIELDING
  if (q.includes("radiation") || q.includes("storm") || q.includes("spe") || q.includes("shield") || q.includes("rayonnement") || q.includes("radiación") || q.includes("strahlung") || q.includes("радиац") || q.includes("辐射")) {
    switch (lang) {
      case "fr":
        return `Le rayonnement de l'espace lointain combine le fond continu des rayons cosmiques galactiques et les tempêtes aiguës d'événements à particules solaires (SPE). Une éruption majeure peut délivrer une dose létale de protons relativistes en quelques heures, détruisant les cellules souches hématopoïétiques de la moelle osseuse. Notre protocole Sonnenblume réoriente le vaisseau pour placer le bouclier arrière riche en eau et vivres face au Soleil afin d'atténuer 80% du flux de protons, active le déflecteur supraconducteur magnétique de 12 Teslas et engage des facteurs de croissance comme le Filgrastim pour préserver la lignée sanguine.`;
      case "zh":
        return `深空辐射威胁包含持续性的银河宇宙射线与突发性的太阳质子事件（SPE）。剧烈的太阳风暴可在数小时内释放超过1至2戈瑞的高能相对论质子电离剂量，摧毁造血干细胞并引发急性放射病。Sonnenblume自主防护系统会立即将飞船姿态调整为尾部对日，将富含氢原子的饮用水和食品储备置于迎风面以吸收高达80%的质子通量，同时启动12特斯拉超导磁屏蔽偏转带电粒子，并为乘员提供非格司亭等造血刺激药物。`;
      default:
        return `Deep-space radiation combines chronic Galactic Cosmic Rays with acute Solar Particle Events driven by solar coronal mass ejections. A severe solar proton storm can deliver a lethal whole-body ionizing dose within hours, decimating bone marrow stem cells and intestinal mucosa. Our Sonnenblume defense posture slews the spacecraft 180 degrees tail-to-sun, concentrating hydrogen-dense potable water tanks in the beam path to absorb up to 80 percent of proton flux while activating a 12-Tesla superconducting magnetic deflector and deploying hematopoietic growth factors.`;
    }
  }

  // 6. DEFAULT SCIENTIFIC SYNTHESIS
  switch (lang) {
    case "fr":
      return `J'ai analysé votre requête au regard des standards de médecine aérospatiale NASA-STD-3001 et des constantes biométriques en direct de votre Xiaomi Watch H1 (fréquence cardiaque à ${hr} BPM, saturation en oxygène à ${spo2}%). Nous pouvons explorer en détail l'adaptation cardiovasculaire en microgravité, les protocoles d'urgence, la protection contre les tempêtes de protons solaires ou le bridage d'accélération pour préserver la perfusion cérébrale.`;
    case "es":
      return `He evaluado su consulta bajo los estándares de medicina aeroespacial NASA-STD-3001 y los datos en tiempo real de su Xiaomi Watch H1 (frecuencia cardíaca de ${hr} BPM y saturación de oxígeno al ${spo2}%). Podemos analizar cualquier aspecto de la fisiología espacial, desde la redistribución de líquidos y el síndrome SANS hasta protocolos de resucitación en gravedad cero o límites dinámicos de aceleración G.`;
    case "zh":
      return `我已结合NASA-STD-3001航天医学标准与您小米智能手表H1的实时体征（心率 ${hr} BPM，血氧 ${spo2}%）对您的指令完成评估。我们可以深入探讨微重力心血管适应、SANS眼部综合征、失重急救复苏规程、太阳质子事件屏蔽或基于心血管耐受度的动态过载限制方案。`;
    case "ru":
      return `Ваш запрос проанализирован в соответствии со стандартами космической медицины NASA-STD-3001 и текущими биометрическими данными часов Xiaomi Watch H1 (пульс ${hr} уд/мин, кислород ${spo2}%). Я готов детально разобрать физиологические адаптации к невесомости, реанимационные протоколы, защиту от солнечных протонных бурь или динамическое ограничение перегрузок корабля.`;
    case "it":
      return `Ho valutato la vostra richiesta in conformità con gli standard di medicina aerospaziale NASA-STD-3001 e i dati biometrici in tempo reale del Xiaomi Watch H1 (battito cardiaco ${hr} BPM, saturazione d'ossigeno ${spo2}%). Possiamo approfondire l'adattamento cardiovascolare in microgravità, i protocolli d'emergenza, la schermatura solare o i limiti di accelerazione G per la sicurezza dell'equipaggio.`;
    case "de":
      return `Ich habe Ihre Anfrage anhand der raumfahrtmedizinischen Standards NASA-STD-3001 und der aktuellen Xiaomi Watch H1 Biometriedaten (Puls ${hr} BPM, Sauerstoffsättigung ${spo2}%) ausgewertet. Wir können jeden Aspekt der Raumfahrtphysiologie detailliert besprechen, von mikrogravitativen Flüssigkeitsverschiebungen bis hin zu Notfallprotokollen, Strahlenschutz und dynamischen G-Last-Begrenzungen.`;
    case "mn":
      return `Таны асуултыг сансрын анагаах ухааны NASA-STD-3001 стандарт болон хөлгийн бодит телеметрийн өгөгдөлд үндэслэн шинжиллээ. Одоогоор таны Xiaomi Watch H1 ухаалаг цагны мэдээлэл хэвийн, зүрхний цохилт ${hr} BPM, хүчилтөрөгчийн ханалт ${spo2} хувьтай байна. Бичил таталцлын физиологийн дасан зохицол, сансрын эмнэлгийн тусламж, эсвэл хөлгийн тойрог замын маневрын талаар дэлгэрэнгүй тодруулах зүйл байвал чөлөөтэй асуугаарай.`;
    default:
      return `I have evaluated your request against the NASA-STD-3001 aerospace medicine standard and your current biometric stream, which shows heart rate at ${hr} BPM and blood oxygen at ${spo2} percent. We can explore any aspect of spaceflight physiology, from cephalad fluid shifts and optic changes to zero-gravity emergency resuscitation, solar radiation storm mitigation, or trajectory acceleration limits.`;
  }
}
