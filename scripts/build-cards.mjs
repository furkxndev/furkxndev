/**
 * README'deki statik animasyonlu kartları üretir:
 *   assets/tech.svg          — teknoloji rozetleri
 *   assets/experience.svg    — deneyim & eğitim zaman çizelgesi
 *   assets/terminal.svg      — üstteki yazan terminal kartı
 *   assets/contact-*.svg     — iletişim kutucukları (her biri ayrı link)
 *   assets/project-*.svg     — öne çıkan proje kartları (her biri ayrı link)
 *
 * Kullanım: node scripts/build-cards.mjs
 *
 * İçeriği değiştirmek için aşağıdaki TERMINAL / TECH / TIMELINE / CONTACT /
 * PROJECTS dizilerini düzenle.
 * Rozet genişlikleri tek aralıklı yazı tipinin 0.6em karakter genişliğinden
 * hesaplanıyor; ölçüm için tarayıcıya gerek yok.
 */

import { writeFileSync, mkdirSync } from "node:fs";

const TECH = [
  { label: "Diller", accent: "#58a6ff", items: ["TypeScript", "JavaScript", "Java", "C#", "Python", "SQL"] },
  { label: "Frontend", accent: "#3fb950", items: ["React 19", "Next.js", "Vite", "Tailwind v4", "Zustand"] },
  { label: "Mobil", accent: "#a371f7", items: ["React Native", "Expo Router", "Reanimated"] },
  { label: "Backend", accent: "#f78166", items: ["NestJS", "Spring Boot", "Node.js", "Express", "Socket.IO", "JWT", "OpenAPI"] },
  { label: "Veri", accent: "#d29922", items: ["PostgreSQL", "MySQL", "Prisma", "TypeORM", "Sequelize"] },
  { label: "DevOps", accent: "#56d4dd", items: ["Docker", "nginx", "GitHub Actions", "Git", "Bun"] },
  { label: "Oyun & AI", accent: "#db61a2", items: ["Unity", "C#", "Gemini API", "Playwright"] },
];

/**
 * "Nasıl çalışıyorum" kartı. Satırlar elle bölünmüş: SVG metni kendiliğinden
 * kaydırmaz, sütun genişliği 199px olduğu için satır başına ~30 karakter sınırı var.
 */
const ABOUT = [
  {
    index: "01",
    accent: "#58a6ff",
    title: "Uçtan uca",
    lines: ["Arayüz, API ve veritabanı", "şeması aynı kafadan çıkar."],
  },
  {
    index: "02",
    accent: "#3fb950",
    title: "Bitmiş iş",
    lines: ["Kimlik doğrulama, gerçek", "zamanlı senkron, ödeme ve", "Docker ile dağıtım dahil."],
  },
  {
    index: "03",
    accent: "#a371f7",
    title: "AI merkezde",
    lines: ["Yapay zekâ süs değil;", "ürünün çekirdeğinde çalışır."],
  },
  {
    index: "04",
    accent: "#d29922",
    title: "Otomasyon",
    lines: ["Tekrar eden işler Playwright", "ve Actions'a devredilir."],
  },
];

const TIMELINE = [
  { title: "Viofun", detail: "Bilgisayar Mühendisliği Stajyeri", period: "Ağu 2026 — devam ediyor", current: true },
  { title: "Moon Workshop", detail: "Bilgisayar Mühendisliği Stajyeri", period: "Tem 2025 — Ağu 2025" },
  { title: "Fırat Üniversitesi", detail: "Bilgisayar Mühendisliği, Lisans", period: "Eki 2023 — Eki 2027", school: true },
];

const CONTACT = [
  { file: "contact-mail", icon: "mail", accent: "#3fb950", label: "E-posta", value: "furkxndev@gmail.com" },
  { file: "contact-linkedin", icon: "linkedin", accent: "#0a66c2", label: "LinkedIn", value: "furkxndev" },
  { file: "contact-x", icon: "x", accent: "#c9d1d9", label: "X", value: "@furkxndev" },
  { file: "contact-web", icon: "web", accent: "#58a6ff", label: "Portfolyo", value: "furkxndev.com" },
];

/**
 * Öne çıkan projeler. Her biri assets/project-<slug>.svg olarak üretilir ve
 * README'de kendi bağlantısıyla birlikte gösterilir.
 *
 * desc ve bullets satırları kendiliğinden sarılır (sansWidth ölçümü), elle
 * bölmeye gerek yok. wide: true olan kart 900px genişliğinde tek başına durur.
 */
const PROJECTS = [
  {
    slug: "kosfet",
    title: "Koşfet",
    badge: "furkxndev/kosfet",
    accent: "#3fb950",
    desc: "GPS ile koştuğun her metre haritadaki H3 altıgenlerini senin rengine boyar; rakibin bölgesinden geçtiğinde alanı ondan çalarsın.",
    bullets: [
      "H3 çözünürlük 11 + gridPathCells ile kesintisiz fetih koridoru",
      "Mülkiyet devri tek transaction'da, denetim kaydıyla birlikte",
      "Anti-cheat: doğruluk, hız ve ışınlanma kontrolü → güven puanı",
    ],
    tech: ["NestJS 11", "TypeORM", "PostgreSQL 16", "Expo SDK 54", "h3-js"],
  },
  {
    slug: "cutio",
    title: "Cutio",
    badge: "özel",
    accent: "#56d4dd",
    desc: "Randevu tabanlı işletmeler için çok kiracılı platform. İşletme kendi randevu linkini paylaşır, müşteri hizmet ve saat seçer.",
    bullets: [
      "tenantId ile veri izolasyonu — her sorgu aktif kiracıyla sınırlı",
      "Müsaitlik motoru çalışma saati, mola, izin ve dolu slotları harmanlar",
      "Sektöre göre uyarlanan terminoloji, mobile-first PWA panel",
    ],
    tech: ["NestJS 11", "TypeORM", "PostgreSQL", "React 19", "Tailwind v4", "Bun"],
  },
  {
    slug: "masapp",
    title: "Masapp",
    badge: "özel",
    accent: "#f78166",
    desc: "QR ile masadan sipariş, hesap bölüşme ve kartla ödeme. İşletme tarafında canlı sipariş ve masa yönetimi.",
    bullets: [
      "Socket.IO ile müşteri ekranı ↔ panel anlık senkron",
      "Hesap bölüşme: tüm hesap, kişi başı veya seçili ürün",
      "Paylaşılan sözleşme paketi — frontend ham fetch çağırmaz",
    ],
    tech: ["NestJS", "Prisma", "PostgreSQL", "Socket.IO", "React 19", "İyzico"],
  },
  {
    slug: "gezio",
    title: "Gezio",
    badge: "gezio.furkxndev.com",
    accent: "#d29922",
    desc: "Bütçe, süre ve ilgi alanına göre gün gün seyahat programı üreten AI destekli seyahat planlama platformu.",
    bullets: [
      "Başkasının rotasını kendi bütçene göre yeniden kurgulama",
      "OpenAPI 3 ile belgelenmiş, üçüncü partilere açık REST API",
      "Tek origin mimarisi — nginx /api proxy'si, CORS yok",
    ],
    tech: ["NestJS", "TypeORM", "PostgreSQL 17", "React 19", "Docker", "nginx"],
  },
  {
    slug: "styla",
    title: "Styla",
    badge: "furkxndev/styla",
    accent: "#a371f7",
    desc: "Gardırobu dijitalleştirip hava durumu ve kişisel tercihlere göre her sabah kombin öneren AI stil asistanı.",
    bullets: [
      "Kural tabanlı öneri yok; kombini LLM üretir, backend doğrulayıp saklar",
      "Kıyafet görsel analizi ve stil sohbeti aynı AI katmanında",
      "Admin paneli: model/parametre ayarı ve maliyet takibi",
    ],
    tech: ["React Native", "Expo SDK 54", "NestJS 11", "TypeORM", "OpenRouter"],
  },
  {
    slug: "paydas",
    title: "Paydaş",
    badge: "furkxndev/paydas",
    accent: "#58a6ff",
    desc: "Ev arkadaşlarının ortak giderlerini, faturalarını ve ev işlerini birlikte yönettiği dijital ev asistanı.",
    bullets: [
      "Eşit, elle veya yüzdeli bölüşüm — kuruş güvenli dağıtım",
      "Borçları en az sayıda transfere indirgeyen hesap kapatma",
      "Tekrarlayan faturalar, görev atama ve yerel hatırlatmalar",
    ],
    tech: ["React Native", "Expo", "NestJS", "PostgreSQL", "Docker"],
  },
  {
    slug: "patibak",
    title: "PatiBak",
    badge: "furkxndev/patibak",
    accent: "#db61a2",
    desc: "Sahiplendirme ve geçici bakıcı eşleştiren uçtan uca mobil platform.",
    bullets: [
      "Okundu bilgili gerçek zamanlı mesajlaşma",
      "JWT + BCrypt oturum, doğrulanmış hesap sistemi",
      "Güven puanı ve yorum tabanlı profil analizi",
    ],
    tech: ["React Native", "Expo Router", "Node.js", "MySQL", "Sequelize"],
  },
  {
    slug: "aifiyet",
    title: "AIfiyet",
    badge: "aifiyet.site",
    accent: "#7ee787",
    desc: "Eldeki malzemeye göre AI ile tarif ve besin değeri üreten beslenme platformu.",
    bullets: [
      "Gemini 2.5 Flash; tehlikeli girdileri reddeden güvenlik katmanı",
      "Controller → Service → Repository katmanlı mimari",
      "Docker Compose ile tek komutta ayağa kalkar",
    ],
    tech: ["Java 17", "Spring Boot", "JPA", "PostgreSQL", "Gemini API", "Docker"],
  },
  {
    slug: "sinav-bildirim",
    title: "OBS Not Bildirici",
    badge: "furkxndev/sinav-bildirim",
    accent: "#e3b341",
    desc: "Yeni açıklanan sınav sonuçlarını Telegram'dan bildiren, GitHub Actions üzerinde 7/24 ücretsiz çalışan bot.",
    bullets: [
      "Playwright ile oturum açma ve sayfa karşılaştırması",
      "Gizlilik önceliği: puan değil yalnızca “açıklandı mı” saklanır",
      "Rastgele gecikme ve saat kısıtıyla engellenmeye karşı korumalı",
    ],
    tech: ["Python", "Playwright", "Telegram Bot API", "GitHub Actions"],
  },
  {
    slug: "local-rag",
    title: "Local RAG",
    badge: "furkxndev/foundry-local-rag",
    accent: "#a5d6ff",
    desc: "Kendi metin dosyaları hakkındaki soruları buluta çıkmadan, tümüyle yerelde çalışan modelle cevaplayan RAG uygulaması.",
    bullets: [
      "Bağımlılık yok: parçalama, TF-IDF vektörler ve arama saf Python",
      "SQLite vektör deposu; benzerlik düşükse model hiç çağrılmaz",
      "Kaynaklar modelden değil arama adımından yazılır — uydurma yok",
    ],
    tech: ["Python", "Foundry Local", "Phi-4-mini", "SQLite"],
  },
  {
    slug: "karanlik-tuzak",
    title: "Karanlık Tuzak",
    badge: "furkxndev/Karanlik-Tuzak",
    accent: "#f0883e",
    desc: "Level Devil tarzı, karanlık atmosferli 2D mobil troll platformer. Sahne kurulumu yok; dünya tümüyle kodla ayağa kalkıyor.",
    bullets: [
      "Sprite, ses ve geometri dahil her şey runtime'da üretiliyor",
      "5 seviye: çöken zemin, sahte kapı, ters yerçekimi, ters kontroller",
      "Coyote-time + jump-buffer ile hassas zıplama hissi",
    ],
    tech: ["Unity 2022.3", "C#", "URP 2D", "2D Physics"],
  },
  {
    slug: "top-climbing",
    title: "Top Climbing",
    badge: "furkxndev/Top-Climbing",
    accent: "#79c0ff",
    desc: "Hill Climb tarzı, fizik tabanlı 2D mobil tırmanma oyunu: sonsuz arazi, yakıt yönetimi ve garaj ekonomisi.",
    bullets: [
      "Gövde + iki tekerlek + WheelJoint2D süspansiyonuyla tam fizik sürüş",
      "Chunk üretimi ve nesne havuzuyla sonsuz prosedürel arazi",
      "Garaj, upgrade ve kalıcı kayıt dahil eksiksiz UI akışı",
    ],
    tech: ["Unity 2022.3", "C#", "URP 2D", "PlayerPrefs"],
  },
];

/**
 * Üstteki terminal kartı. Her blok "$ komut" + çıktı satırından oluşur ve
 * sırayla yazılıyormuş gibi belirir; zamanlama blok sayısına göre hesaplanır.
 */
const TERMINAL = {
  titleBar: "furkan@github — zsh",
  blocks: [
    { cmd: "whoami", out: "Furkan Coşkun · Full-stack Geliştirici", fill: "#8b949e" },
    { cmd: "cat odak.txt", out: "gerçek zamanlı sistemler · ödeme akışları · LLM destekli ürünler", fill: "#8b949e" },
    { cmd: "ls -1 vitrin/", out: "kosfet  cutio  masapp  gezio  styla  paydas  patibak  aifiyet", fill: "#58a6ff" },
    { cmd: "cat durum.txt", out: "Viofun'da stajyer · Cutio ve Koşfet üzerinde çalışıyorum", fill: "#8b949e" },
  ],
};

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const MONO = "ui-monospace, SFMono-Regular, Menlo, monospace";
const SANS = "system-ui, -apple-system, Segoe UI, Helvetica, Arial, sans-serif";

/** Tek aralıklı yazı tiplerinde karakter genişliği ~0.6em'dir. */
const monoWidth = (text, size) => text.length * size * 0.6;

/**
 * Belirme animasyonu. keyTimes 0 ile başlayıp 1 ile bitmek zorunda;
 * bitmezse tarayıcı animasyonu tümüyle yok sayar ve öğe görünmez kalır.
 */
function enter(delay, dy = 8, dur = "2.2s") {
  const d = Math.min(delay, 0.85);
  const e = Math.min(d + 0.1, 0.95);
  return `<animate attributeName="opacity" values="0;0;1;1" keyTimes="0;${d.toFixed(3)};${e.toFixed(3)};1" dur="${dur}" fill="freeze"/>
      <animateTransform attributeName="transform" type="translate" additive="sum" values="0 ${dy};0 ${dy};0 0;0 0" keyTimes="0;${d.toFixed(3)};${e.toFixed(3)};1" dur="${dur}" fill="freeze"/>`;
}

function shell(w, h, aria, body, { radius = 12 } = {}) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="${esc(aria)}">
  <title>${esc(aria)}</title>
  <defs><clipPath id="c"><rect width="${w}" height="${h}" rx="${radius}"/></clipPath></defs>
  <g clip-path="url(#c)">
    <rect width="${w}" height="${h}" fill="#0d1117"/>
${body}
    <rect x="0.5" y="0.5" width="${w - 1}" height="${h - 1}" rx="${radius}" fill="none" stroke="#21262d"/>
  </g>
</svg>
`;
}

// -------------------------------------------------------------- nasıl çalışırım

function aboutCard() {
  const W = 900;
  const COL_W = 199;
  const GAP = 18;
  const X0 = 24;
  const LINE_H = 18;
  const maxLines = Math.max(...ABOUT.map((a) => a.lines.length));
  // 118 = ilk açıklama satırının taban çizgisi; sonrasına 28px alt boşluk kalıyor
  const H = 118 + (maxLines - 1) * LINE_H + 28;

  let body = `
    <text x="${X0}" y="34" font-family="${SANS}" font-size="14" font-weight="600" fill="#58a6ff" letter-spacing="0.4">Nasıl çalışıyorum</text>`;

  ABOUT.forEach((item, i) => {
    const x = X0 + i * (COL_W + GAP);
    const delay = 0.14 + i * 0.11;

    if (i > 0) {
      body += `
    <line x1="${x - GAP / 2}" y1="62" x2="${x - GAP / 2}" y2="${H - 22}" stroke="#21262d">
      <animate attributeName="opacity" values="0;0;1;1" keyTimes="0;${delay.toFixed(3)};${(delay + 0.1).toFixed(3)};1" dur="2.2s" fill="freeze"/>
    </line>`;
    }

    let lines = "";
    item.lines.forEach((line, li) => {
      lines += `
      <text x="${x}" y="${118 + li * LINE_H}" font-family="${SANS}" font-size="12.5" fill="#8b949e">${esc(line)}</text>`;
    });

    body += `
    <g opacity="0">${enter(delay)}
      <text x="${x}" y="${76}" font-family="${MONO}" font-size="12" font-weight="700" fill="${item.accent}" letter-spacing="1">${esc(item.index)}</text>
      <rect x="${x}" y="84" width="0" height="2" rx="1" fill="${item.accent}" opacity="0.75">
        <animate attributeName="width" values="0;0;${COL_W - 40};${COL_W - 40}" keyTimes="0;${delay.toFixed(3)};${Math.min(delay + 0.35, 0.95).toFixed(3)};1" dur="2.2s" fill="freeze"/>
      </rect>
      <text x="${x}" y="${104}" font-family="${SANS}" font-size="14.5" font-weight="700" fill="#e6edf3">${esc(item.title)}</text>${lines}
    </g>`;
  });

  return shell(W, H, "Nasıl çalışıyorum", body);
}

// ---------------------------------------------------------------- teknolojiler

function techCard() {
  const W = 900;
  const LABEL_X = 24;
  const CHIP_X = 148;
  const CHIP_H = 26;
  const CHIP_PAD = 11;
  const GAP = 7;
  const ROW_H = 42;
  const FS = 12.5;

  let body = "";
  let y = 26;
  let n = 0;

  for (const group of TECH) {
    const rowTop = y;
    let x = CHIP_X;
    let chips = "";

    for (const item of group.items) {
      const w = Math.round(monoWidth(item, FS) + CHIP_PAD * 2);
      if (x + w > W - 24) {
        x = CHIP_X;
        y += CHIP_H + GAP;
      }
      const delay = 0.08 + n * 0.022;
      chips += `
      <g opacity="0">${enter(delay, 6)}
        <rect x="${x}" y="${y}" width="${w}" height="${CHIP_H}" rx="7" fill="#161b22" stroke="#21262d"/>
        <text x="${x + CHIP_PAD}" y="${y + 17.5}" font-family="${MONO}" font-size="${FS}" fill="#c9d1d9">${esc(item)}</text>
      </g>`;
      x += w + GAP;
      n++;
    }

    body += `
    <g opacity="0">${enter(0.05 + TECH.indexOf(group) * 0.03, 6)}
      <rect x="${LABEL_X}" y="${rowTop + 7}" width="3" height="12" rx="1.5" fill="${group.accent}"/>
      <text x="${LABEL_X + 13}" y="${rowTop + 17.5}" font-family="${SANS}" font-size="12.5" font-weight="600" fill="#8b949e">${esc(group.label)}</text>
    </g>${chips}`;

    y += ROW_H;
  }

  const H = y + 2;
  return shell(W, H, "Kullandığım teknolojiler", body);
}

// ------------------------------------------------------------------- deneyim

function experienceCard() {
  const W = 900;
  const LINE_X = 44;
  const FIRST = 52;
  const STEP = 74;
  const H = FIRST + STEP * (TIMELINE.length - 1) + 56;

  const lineTop = FIRST - 22;
  const lineBottom = FIRST + STEP * (TIMELINE.length - 1) + 22;
  const lineLen = lineBottom - lineTop;

  let body = `
    <line x1="${LINE_X}" y1="${lineTop}" x2="${LINE_X}" y2="${lineBottom}" stroke="#21262d" stroke-width="2"
          stroke-dasharray="${lineLen}" stroke-dashoffset="${lineLen}">
      <animate attributeName="stroke-dashoffset" values="${lineLen};0;0" keyTimes="0;0.42;1" dur="2.2s" fill="freeze"/>
    </line>`;

  TIMELINE.forEach((item, i) => {
    const cy = FIRST + i * STEP;
    const delay = 0.25 + i * 0.14;
    const color = item.current ? "#3fb950" : item.school ? "#a371f7" : "#8b949e";

    const pulse = item.current
      ? `
      <circle cx="${LINE_X}" cy="${cy}" r="7" fill="none" stroke="#3fb950" stroke-width="1.3">
        <animate attributeName="r" values="7;17;17" dur="2.8s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.6;0;0" dur="2.8s" repeatCount="indefinite"/>
      </circle>`
      : "";

    body += `
    <g opacity="0">${enter(delay)}
      <circle cx="${LINE_X}" cy="${cy}" r="7" fill="#0d1117" stroke="${color}" stroke-width="2"/>
      <circle cx="${LINE_X}" cy="${cy}" r="3" fill="${color}"/>${pulse}
      <text x="${LINE_X + 26}" y="${cy - 2}" font-family="${SANS}" font-size="15.5" font-weight="700" fill="#e6edf3">${esc(item.title)}</text>
      <text x="${LINE_X + 26}" y="${cy + 18}" font-family="${SANS}" font-size="12.5" fill="#8b949e">${esc(item.detail)}</text>
      <text x="${W - 24}" y="${cy + 4}" text-anchor="end" font-family="${MONO}" font-size="12" fill="${item.current ? "#3fb950" : "#6e7681"}">${esc(item.period)}</text>
    </g>`;
  });

  return shell(W, H, "Deneyim ve eğitim", body);
}

// ------------------------------------------------------------------ iletişim

function icon(kind, color) {
  const cx = 32;
  const cy = 46;
  const s = `stroke="${color}" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"`;

  if (kind === "mail") {
    return `<g ${s}>
        <rect x="${cx - 10}" y="${cy - 7}" width="20" height="14" rx="2.5"/>
        <polyline points="${cx - 10},${cy - 5} ${cx},${cy + 3} ${cx + 10},${cy - 5}"/>
      </g>`;
  }
  if (kind === "linkedin") {
    return `<g>
        <rect x="${cx - 10}" y="${cy - 10}" width="20" height="20" rx="4" fill="none" stroke="${color}" stroke-width="1.6"/>
        <circle cx="${cx - 5}" cy="${cy - 5}" r="1.6" fill="${color}"/>
        <rect x="${cx - 6.2}" y="${cy - 2}" width="2.4" height="8" fill="${color}"/>
        <path d="M${cx - 0.5} ${cy + 6} v-8 h2.4 v1 a3.2 3.2 0 0 1 5.6 2.2 v4.8 h-2.4 v-4.4 a1.6 1.6 0 0 0 -3.2 0 v4.4 z" fill="${color}"/>
      </g>`;
  }
  if (kind === "x") {
    return `<g stroke="${color}" fill="none" stroke-width="1.9" stroke-linecap="round">
        <line x1="${cx - 9}" y1="${cy - 9}" x2="${cx + 9}" y2="${cy + 9}"/>
        <line x1="${cx + 9}" y1="${cy - 9}" x2="${cx - 9}" y2="${cy + 9}"/>
      </g>`;
  }
  return `<g ${s}>
      <circle cx="${cx}" cy="${cy}" r="9.5"/>
      <ellipse cx="${cx}" cy="${cy}" rx="4" ry="9.5"/>
      <line x1="${cx - 9.5}" y1="${cy}" x2="${cx + 9.5}" y2="${cy}"/>
    </g>`;
}

function contactCard(c) {
  const W = 220;
  const H = 88;

  const body = `
    <rect x="0" y="0" width="0" height="3" fill="${c.accent}">
      <animate attributeName="width" values="0;0;${W};${W}" keyTimes="0;0.12;0.55;1" dur="2.2s" fill="freeze"/>
    </rect>
    <g opacity="0">${enter(0.2, 6)}
      ${icon(c.icon, c.accent)}
      <text x="58" y="41" font-family="${SANS}" font-size="11" fill="#6e7681" letter-spacing="0.3">${esc(c.label)}</text>
      <text x="58" y="60" font-family="${MONO}" font-size="12" fill="#e6edf3">${esc(c.value)}</text>
    </g>`;

  return shell(W, H, `${c.label}: ${c.value}`, body, { radius: 10 });
}

// ------------------------------------------------------------------- terminal

/**
 * Yazılıyormuş etkisi, metnin üstündeki clipPath'in genişletilmesiyle veriliyor.
 * keyTimes değerleri blok sayısına göre üretilir; döngü 0'da başlayıp 1'de biter.
 */
function terminalCard() {
  const W = 900;
  const FS = 15;
  const CHAR = FS * 0.6;
  const X = 30;
  const TOP = 92; // ilk komut satırının taban çizgisi
  const OUT_DY = 26;
  const BLOCK_H = 60;
  const DUR = "18s";

  const blocks = TERMINAL.blocks;
  const H = TOP + BLOCK_H * blocks.length + 20;
  const SLOT = 0.9 / blocks.length;

  let clips = "";
  let lines = "";

  blocks.forEach((b, i) => {
    const cmdY = TOP + i * BLOCK_H;
    const outY = cmdY + OUT_DY;
    const cmdText = ` ${b.cmd}`;
    // ölçüm yaklaşık olduğu için son karakter kırpılmasın diye birkaç piksel pay bırakılır
    const cmdW = Math.round(monoWidth(`$${cmdText}`, FS)) + 6;
    const outW = Math.round(monoWidth(b.out, FS)) + 6;

    const t0 = +(0.02 + i * SLOT).toFixed(3);
    const t1 = +(t0 + SLOT * 0.28).toFixed(3);
    const t2 = +(t1 + SLOT * 0.12).toFixed(3);
    const t3 = +(t2 + SLOT * 0.4).toFixed(3);

    clips += `
    <clipPath id="c${i}a"><rect x="${X}" y="${cmdY - 16}" height="22" width="0">
      <animate attributeName="width" values="0;0;${cmdW};${cmdW}" keyTimes="0;${t0};${t1};1" dur="${DUR}" repeatCount="indefinite"/>
    </rect></clipPath>
    <clipPath id="c${i}b"><rect x="${X}" y="${outY - 16}" height="22" width="0">
      <animate attributeName="width" values="0;0;${outW};${outW}" keyTimes="0;${t2};${t3};1" dur="${DUR}" repeatCount="indefinite"/>
    </rect></clipPath>`;

    lines += `
      <g clip-path="url(#c${i}a)">
        <text x="${X}" y="${cmdY}"><tspan fill="#3fb950">$</tspan><tspan fill="#c9d1d9">${esc(cmdText)}</tspan></text>
      </g>
      <g clip-path="url(#c${i}b)">
        <text x="${X}" y="${outY}" fill="${b.fill}">${esc(b.out)}</text>
      </g>`;
  });

  const lastY = TOP + BLOCK_H * blocks.length;
  const promptOn = +(0.02 + blocks.length * SLOT).toFixed(3);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="furkan@github terminal — whoami, odak alanları, vitrindeki projeler ve güncel durum">
  <title>furkan@github — whoami</title>

  <defs>
    <clipPath id="win"><rect x="0" y="0" width="${W}" height="${H}" rx="12"/></clipPath>${clips}
  </defs>

  <g clip-path="url(#win)">
    <rect width="${W}" height="${H}" fill="#0d1117"/>

    <rect width="${W}" height="40" fill="#161b22"/>
    <line x1="0" y1="40" x2="${W}" y2="40" stroke="#21262d"/>
    <circle cx="26" cy="20" r="6" fill="#ff5f57"/>
    <circle cx="48" cy="20" r="6" fill="#febc2e"/>
    <circle cx="70" cy="20" r="6" fill="#28c840"/>
    <text x="${W / 2}" y="25" text-anchor="middle" font-family="${MONO}" font-size="12.5" fill="#6e7681">${esc(TERMINAL.titleBar)}</text>

    <g font-family="${MONO}" font-size="${FS}">${lines}

      <g opacity="0">
        <animate attributeName="opacity" values="0;0;1;1" keyTimes="0;${promptOn};${(promptOn + 0.02).toFixed(3)};1" dur="${DUR}" repeatCount="indefinite"/>
        <text x="${X}" y="${lastY}" fill="#3fb950">$</text>
        <rect x="${X + 14}" y="${lastY - 15}" width="9" height="18" fill="#58a6ff">
          <animate attributeName="opacity" values="1;1;0;0;1" keyTimes="0;0.45;0.5;0.95;1" dur="1.2s" repeatCount="indefinite"/>
        </rect>
      </g>
    </g>

    <rect x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" rx="12" fill="none" stroke="#21262d"/>
  </g>
</svg>
`;
}

// -------------------------------------------------------------------- projeler

/** Orantılı yazı tipinde ortalama karakter genişliği ~0.53em. */
const sansWidth = (text, size) => text.length * size * 0.53;

/** Metni verilen piksel genişliğine göre kelime kelime sarar. */
function wrap(text, size, maxW) {
  const lines = [];
  let cur = "";
  for (const word of String(text).split(/\s+/)) {
    const next = cur ? `${cur} ${word}` : word;
    if (cur && sansWidth(next, size) > maxW) {
      lines.push(cur);
      cur = word;
    } else {
      cur = next;
    }
  }
  if (cur) lines.push(cur);
  return lines;
}

const P_PAD = 20;
const P_DESC_FS = 12.5;
const P_DESC_LH = 17;
const P_BULLET_FS = 12;
const P_BULLET_LH = 17;
const P_BULLET_GAP = 4;
const P_BULLET_X = 14; // madde işaretiyle metin arası
const P_CHIP_H = 21;
const P_CHIP_FS = 10.5;
const P_CHIP_PAD = 8;
const P_CHIP_GAP = 6;
const P_TITLE_Y = 42;
const P_DESC_Y = 66;

/** Kartın içeriğini ölçer; yükseklik hesabı ve çizim aynı yerleşimi kullanır. */
function projectLayout(p) {
  const W = p.wide ? 900 : 440;
  const inner = W - P_PAD * 2;
  const descLines = wrap(p.desc, P_DESC_FS, inner);
  const bullets = p.bullets.map((b) => wrap(b, P_BULLET_FS, inner - P_BULLET_X));

  const descEnd = P_DESC_Y + (descLines.length - 1) * P_DESC_LH;
  let y = descEnd + 24;
  const bulletRows = [];
  for (const lines of bullets) {
    bulletRows.push({ y, lines });
    y += lines.length * P_BULLET_LH + P_BULLET_GAP;
  }
  const bulletsEnd = y - P_BULLET_GAP;

  // rozetler satır satır yerleşir
  const chipRows = [[]];
  let x = P_PAD;
  for (const t of p.tech) {
    const w = Math.round(monoWidth(t, P_CHIP_FS) + P_CHIP_PAD * 2);
    if (x > P_PAD && x + w > W - P_PAD) {
      chipRows.push([]);
      x = P_PAD;
    }
    chipRows[chipRows.length - 1].push({ x, w, label: t });
    x += w + P_CHIP_GAP;
  }

  const chipBlock = chipRows.length * P_CHIP_H + (chipRows.length - 1) * P_CHIP_GAP;
  const H = bulletsEnd + 18 + chipBlock + 18;
  return { W, H, descLines, bulletRows, chipRows, chipBlock };
}

/**
 * Tek proje kartı. targetH verilirse kart o yüksekliğe uzatılır ve rozetler
 * alta yaslanır — böylece yan yana duran kartlar aynı hizada biter.
 */
function projectCard(p, targetH) {
  const L = projectLayout(p);
  const W = L.W;
  const H = Math.max(targetH || 0, L.H);
  const chipY = H - 18 - L.chipBlock;

  const badgeW = Math.round(monoWidth(p.badge, 10) + 18);
  const locked = p.badge === "özel";

  let body = `
    <rect x="0" y="0" width="0" height="3" fill="${p.accent}">
      <animate attributeName="width" values="0;0;${W};${W}" keyTimes="0;0.08;0.5;1" dur="2.2s" fill="freeze"/>
    </rect>
    <g opacity="0">${enter(0.12, 7)}
      <text x="${P_PAD}" y="${P_TITLE_Y}" font-family="${SANS}" font-size="15.5" font-weight="700" fill="#e6edf3">${esc(p.title)}</text>
      <g>
        <rect x="${W - P_PAD - badgeW}" y="${P_TITLE_Y - 14}" width="${badgeW}" height="20" rx="6" fill="#161b22" stroke="#21262d"/>
        <text x="${W - P_PAD - badgeW / 2}" y="${P_TITLE_Y}" text-anchor="middle" font-family="${MONO}" font-size="10" fill="${locked ? "#8b949e" : "#6e7681"}">${esc(p.badge)}</text>
      </g>
    </g>`;

  L.descLines.forEach((line, i) => {
    body += `
    <g opacity="0">${enter(0.2 + i * 0.04, 6)}
      <text x="${P_PAD}" y="${P_DESC_Y + i * P_DESC_LH}" font-family="${SANS}" font-size="${P_DESC_FS}" fill="#8b949e">${esc(line)}</text>
    </g>`;
  });

  L.bulletRows.forEach((row, i) => {
    const delay = 0.34 + i * 0.08;
    let lines = "";
    row.lines.forEach((line, li) => {
      lines += `
      <text x="${P_PAD + P_BULLET_X}" y="${row.y + li * P_BULLET_LH}" font-family="${SANS}" font-size="${P_BULLET_FS}" fill="#c9d1d9">${esc(line)}</text>`;
    });
    body += `
    <g opacity="0">${enter(delay, 6)}
      <rect x="${P_PAD + 1}" y="${row.y - 8}" width="5" height="5" rx="1.2" fill="${p.accent}" opacity="0.9"/>${lines}
    </g>`;
  });

  L.chipRows.forEach((row, ri) => {
    const y = chipY + ri * (P_CHIP_H + P_CHIP_GAP);
    row.forEach((chip, ci) => {
      const delay = 0.6 + (ri * 4 + ci) * 0.03;
      body += `
    <g opacity="0">${enter(delay, 5)}
      <rect x="${chip.x}" y="${y}" width="${chip.w}" height="${P_CHIP_H}" rx="6" fill="#161b22" stroke="#21262d"/>
      <text x="${chip.x + P_CHIP_PAD}" y="${y + 14.5}" font-family="${MONO}" font-size="${P_CHIP_FS}" fill="#8b949e">${esc(chip.label)}</text>
    </g>`;
    });
  });

  return shell(W, H, `${p.title} — ${p.desc}`, body, { radius: 10 });
}

mkdirSync("assets", { recursive: true });
writeFileSync("assets/terminal.svg", terminalCard());
writeFileSync("assets/about.svg", aboutCard());
writeFileSync("assets/tech.svg", techCard());
writeFileSync("assets/experience.svg", experienceCard());
for (const c of CONTACT) writeFileSync(`assets/${c.file}.svg`, contactCard(c));

// README'de yan yana duran iki kart aynı yükseklikte bitsin diye satırdaki
// uzun kart ölçü alınır; wide kartlar kendi doğal yüksekliğinde kalır.
const grid = PROJECTS.filter((p) => !p.wide);
const rowH = new Map();
for (let i = 0; i < grid.length; i += 2) {
  const pair = grid.slice(i, i + 2);
  const h = Math.max(...pair.map((p) => projectLayout(p).H));
  for (const p of pair) rowH.set(p.slug, h);
}
for (const p of PROJECTS) {
  writeFileSync(`assets/project-${p.slug}.svg`, projectCard(p, rowH.get(p.slug) || 0));
}

console.log(
  `Kartlar güncellendi: terminal, about, tech, experience, ${CONTACT.length} iletişim, ${PROJECTS.length} proje.`
);
