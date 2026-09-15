/**
 * README'deki kartları üretir:
 *   assets/intro.svg           — giriş kartı
 *   assets/project-<slug>.svg  — proje kartları
 *   assets/tech.svg            — teknoloji tablosu
 *   assets/contact-<key>.svg   — iletişim kutuları (her biri ayrı bağlantı)
 *
 * Kullanım: node scripts/build-cards.mjs
 *
 * Kartlar tümüyle statiktir — animasyon, çip rozeti veya pencere süsü yok.
 * İçeriği değiştirmek için aşağıdaki INTRO / PROJECTS / TECH / CONTACT
 * değerlerini düzenle; satır sarma ve yükseklik kendiliğinden hesaplanır.
 */

import { writeFileSync, mkdirSync } from "node:fs";

const INTRO =
  "Bir ürünün tamamını tek başıma kuruyorum: veri modelinden API sözleşmesine, " +
  "mobil arayüzden sunucu dağıtımına kadar. Böyle çalışınca problem tek bir katmanda " +
  "kalmıyor — çok kiracılı bir sistemde verinin sızmaması, iki cihaz aynı anda " +
  "yazdığında doğru işlemin kazanması ve dil modeli yanlış cevap verdiğinde bunun " +
  "fark edilmesi aynı tasarımın parçaları. Aşağıdaki projeler prototip değil; " +
  "kimlik doğrulama, ödeme, gerçek zamanlı senkron ve Docker ile dağıtım dahil " +
  "çalışır halde.";

const PROJECTS = [
  {
    slug: "kosfet",
    title: "Koşfet",
    label: "furkxndev/kosfet",
    desc: "GPS ile koşulan her metre haritadaki H3 altıgenlerini oyuncunun rengine boyar; rakip bölgesinden geçildiğinde alan el değiştirir.",
    bullets: [
      "gridPathCells ile GPS örnekleri arası doldurulur, fetih koridoru kesintisiz kalır",
      "Hücre devri denetim kaydıyla birlikte tek transaction'da yürür",
      "Doğruluk, hız ve ışınlanma kontrolünden geçen güven puanı hileyi eler",
    ],
    stack: "NestJS 11 · TypeORM · PostgreSQL 16 · Expo SDK 54 · h3-js",
  },
  {
    slug: "cutio",
    title: "Cutio",
    label: "özel repo",
    desc: "Randevu tabanlı işletmeler için çok kiracılı platform; işletme kendi randevu bağlantısını paylaşır, müşteri hizmet ve saat seçer.",
    bullets: [
      "tenantId ile veri izolasyonu — her sorgu aktif kiracıyla sınırlı",
      "Müsaitlik motoru çalışma saati, mola, izin ve dolu slotları harmanlar",
      "Arayüz terminolojisi işletmenin sektörüne göre uyarlanır",
    ],
    stack: "NestJS 11 · TypeORM · PostgreSQL · React 19 · Tailwind v4 · Bun",
  },
  {
    slug: "masapp",
    title: "Masapp",
    label: "özel repo",
    desc: "QR ile masadan sipariş, hesap bölüşme ve kartla ödeme; işletme tarafında canlı sipariş ve masa yönetimi.",
    bullets: [
      "Socket.IO ile müşteri ekranı ve işletme paneli anlık senkron kalır",
      "Hesap bölüşme: tüm hesap, kişi başı veya seçili ürün bazında",
      "Paylaşılan sözleşme paketi — frontend ham fetch çağırmaz",
    ],
    stack: "NestJS · Prisma · PostgreSQL · Socket.IO · React 19 · İyzico",
  },
  {
    slug: "gezio",
    title: "Gezio",
    label: "gezio.furkxndev.com",
    desc: "Bütçe, süre ve ilgi alanına göre gün gün program üreten AI destekli seyahat planlama platformu.",
    bullets: [
      "Paylaşılan rota, ziyaretçinin kendi bütçesine göre yeniden kurgulanır",
      "REST API OpenAPI 3 ile belgelenip üçüncü partilere açılır",
      "Tek origin mimarisi: nginx /api proxy'si, CORS katmanı devrede değil",
    ],
    stack: "NestJS · TypeORM · PostgreSQL 17 · React 19 · Docker · nginx",
  },
  {
    slug: "styla",
    title: "Styla",
    label: "furkxndev/styla",
    desc: "Gardırobu dijitalleştirip hava durumu ve kişisel tercihlere göre kombin öneren AI stil asistanı.",
    bullets: [
      "Öneri kural tablosundan değil dil modelinden gelir; backend doğrular ve saklar",
      "Kıyafet görsel analizi ile stil sohbeti aynı AI katmanında toplanır",
      "Admin paneli model, parametre ve token maliyetini izler",
    ],
    stack: "React Native · Expo SDK 54 · NestJS 11 · TypeORM · OpenRouter",
  },
  {
    slug: "local-rag",
    title: "Local RAG",
    label: "furkxndev/foundry-local-rag",
    desc: "Kendi metin dosyaları hakkındaki soruları buluta çıkmadan, tümüyle yerel modelle yanıtlayan RAG uygulaması.",
    bullets: [
      "Parçalama, TF-IDF vektörleri ve arama dış bağımlılık olmadan saf Python",
      "SQLite vektör deposu; benzerlik eşiğin altındaysa model hiç çağrılmaz",
      "Kaynaklar arama adımından yazılır — uydurma referans oluşmaz",
    ],
    stack: "Python · Foundry Local · Phi-4-mini · SQLite",
  },
];

const TECH = [
  { label: "Diller", items: "TypeScript · Java · C# · Python · SQL" },
  { label: "Backend", items: "NestJS · Spring Boot · Node.js · Socket.IO · OpenAPI" },
  { label: "Frontend", items: "React · Next.js · React Native · Tailwind" },
  { label: "Veri", items: "PostgreSQL · MySQL · Prisma · TypeORM" },
  { label: "Altyapı", items: "Docker · nginx · GitHub Actions" },
  { label: "AI", items: "Gemini API · OpenRouter · Foundry Local" },
];

const CONTACT = [
  { key: "mail", label: "E-POSTA", value: "furkxndev@gmail.com" },
  { key: "linkedin", label: "LINKEDIN", value: "linkedin.com/in/furkxndev" },
  { key: "web", label: "PORTFOLYO", value: "furkxndev.com" },
];

const MONO = "ui-monospace, SFMono-Regular, Menlo, monospace";
const SANS = "system-ui, -apple-system, Segoe UI, Helvetica, Arial, sans-serif";
const ACCENT = "#58a6ff";

const W = 436;
const PAD = 22;

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Orantılı yazı tipinde ortalama karakter genişliği ~0.53em, tek aralıklıda 0.6em. */
const sansW = (t, s) => t.length * s * 0.53;
const monoW = (t, s) => t.length * s * 0.6;

/** Metni verilen piksel genişliğine göre kelime kelime satırlara böler. */
function wrap(text, maxW, measure) {
  const words = String(text).split(/\s+/);
  const lines = [];
  let line = "";
  for (const w of words) {
    const next = line ? line + " " + w : w;
    if (line && measure(next) > maxW) {
      lines.push(line);
      line = w;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines;
}

/** Kartın tüm metin bloklarını yerleştirip toplam yüksekliği hesaplar. */
function layout(p) {
  const textW = W - PAD * 2;
  const bulletX = PAD + 12;
  const bulletW = W - bulletX - PAD;

  const descLines = wrap(p.desc, textW, (t) => sansW(t, 13));
  const bulletRows = p.bullets.map((b) => wrap(b, bulletW, (t) => sansW(t, 12.5)));
  const stackLines = wrap(p.stack, textW, (t) => monoW(t, 11));

  let y = 38; // başlık taban çizgisi
  y += 10; // aksan çizgisi
  const descY = y + 26;
  y = descY + (descLines.length - 1) * 18;

  let bulletY = y + 26;
  const bulletYs = [];
  for (const row of bulletRows) {
    bulletYs.push(bulletY);
    bulletY += (row.length - 1) * 17 + 21;
  }
  y = bulletY - 21 + (bulletRows.at(-1)?.length - 1 || 0) * 0;

  const stackY = bulletY + 12;
  const H = stackY + (stackLines.length - 1) * 16 + 20;

  return { descLines, bulletRows, bulletYs, stackLines, descY, stackY, bulletX, H };
}

function card(p, targetH) {
  const L = layout(p);
  const H = Math.max(targetH || 0, L.H);

  let body = `
    <text x="${PAD}" y="38" font-family="${SANS}" font-size="17" font-weight="650" fill="#e6edf3" letter-spacing="-0.2">${esc(p.title)}</text>
    <text x="${W - PAD}" y="37" text-anchor="end" font-family="${MONO}" font-size="11" fill="#6e7681">${esc(p.label)}</text>
    <rect x="${PAD}" y="48" width="26" height="2" rx="1" fill="${ACCENT}"/>`;

  L.descLines.forEach((line, i) => {
    body += `
    <text x="${PAD}" y="${L.descY + i * 18}" font-family="${SANS}" font-size="13" fill="#8b949e">${esc(line)}</text>`;
  });

  L.bulletRows.forEach((row, i) => {
    const y = L.bulletYs[i];
    body += `
    <rect x="${PAD}" y="${y - 7}" width="3" height="3" fill="#484f58"/>`;
    row.forEach((line, li) => {
      body += `
    <text x="${L.bulletX}" y="${y + li * 17}" font-family="${SANS}" font-size="12.5" fill="#8b949e">${esc(line)}</text>`;
    });
  });

  // yığın satırı her zaman kartın altına sabitlenir, böylece eşlenen kartlar hizalı kalır
  const stackTop = H - 20 - (L.stackLines.length - 1) * 16;
  L.stackLines.forEach((line, i) => {
    body += `
    <text x="${PAD}" y="${stackTop + i * 16}" font-family="${MONO}" font-size="11" fill="#6e7681">${esc(line)}</text>`;
  });

  const aria = `${p.title} — ${p.desc}`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${esc(aria)}">
  <title>${esc(aria)}</title>
  <defs><clipPath id="c"><rect width="${W}" height="${H}" rx="12"/></clipPath></defs>
  <g clip-path="url(#c)">
    <rect width="${W}" height="${H}" fill="#0d1117"/>${body}
    <rect x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" rx="12" fill="none" stroke="#21262d"/>
  </g>
</svg>
`;
}

mkdirSync("assets", { recursive: true });

// README'de yan yana duran iki kart aynı yükseklikte bitsin diye satırdaki uzun kart ölçü alınır
const rowH = new Map();
for (let i = 0; i < PROJECTS.length; i += 2) {
  const pair = PROJECTS.slice(i, i + 2);
  const h = Math.max(...pair.map((p) => layout(p).H));
  for (const p of pair) rowH.set(p.slug, h);
}

for (const p of PROJECTS) {
  writeFileSync(`assets/project-${p.slug}.svg`, card(p, rowH.get(p.slug)));
}

// ---------------------------------------------------------------------- giriş

/** Sayfanın açılış paragrafı. Metin kart genişliğine göre kendiliğinden sarılır. */
function introCard() {
  const IW = 900;
  const PADX = 28;
  const LINE_H = 24;
  const FS = 15;
  const lines = wrap(INTRO, IW - PADX * 2, (t) => sansW(t, FS));
  const TOP = 64;
  const H = TOP + (lines.length - 1) * LINE_H + 28;

  let body = `
    <rect x="${PADX}" y="30" width="26" height="2" rx="1" fill="${ACCENT}"/>`;
  lines.forEach((line, i) => {
    body += `
    <text x="${PADX}" y="${TOP + i * LINE_H}" font-family="${SANS}" font-size="${FS}" fill="#c9d1d9">${esc(line)}</text>`;
  });

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${IW} ${H}" width="${IW}" height="${H}" role="img" aria-label="${esc(INTRO)}">
  <title>${esc(INTRO)}</title>
  <defs><clipPath id="c"><rect width="${IW}" height="${H}" rx="12"/></clipPath></defs>
  <g clip-path="url(#c)">
    <rect width="${IW}" height="${H}" fill="#0d1117"/>${body}
    <rect x="0.5" y="0.5" width="${IW - 1}" height="${H - 1}" rx="12" fill="none" stroke="#21262d"/>
  </g>
</svg>
`;
}

// ------------------------------------------------------------------ teknolojiler

/** Etiket sütunu solda sabit, teknolojiler tek satır monospace metin olarak sağda. */
function techCard() {
  const TW = 900;
  const PADX = 28;
  const LABEL_X = PADX;
  const ITEMS_X = 152;
  const ROW_H = 34;
  const TOP = 44;
  const H = TOP + (TECH.length - 1) * ROW_H + 30;

  let body = "";
  TECH.forEach((row, i) => {
    const y = TOP + i * ROW_H;
    if (i > 0) {
      body += `
    <line x1="${PADX}" y1="${y - 21}" x2="${TW - PADX}" y2="${y - 21}" stroke="#161b22"/>`;
    }
    body += `
    <text x="${LABEL_X}" y="${y}" font-family="${SANS}" font-size="12.5" font-weight="600" fill="#c9d1d9">${esc(row.label)}</text>
    <text x="${ITEMS_X}" y="${y}" font-family="${MONO}" font-size="12" fill="#8b949e">${esc(row.items)}</text>`;
  });

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${TW} ${H}" width="${TW}" height="${H}" role="img" aria-label="Kullandığım teknolojiler">
  <title>Kullandığım teknolojiler</title>
  <defs><clipPath id="c"><rect width="${TW}" height="${H}" rx="12"/></clipPath></defs>
  <g clip-path="url(#c)">
    <rect width="${TW}" height="${H}" fill="#0d1117"/>${body}
    <rect x="0.5" y="0.5" width="${TW - 1}" height="${H - 1}" rx="12" fill="none" stroke="#21262d"/>
  </g>
</svg>
`;
}

// --------------------------------------------------------------------- iletişim

function contactCard(c) {
  const CW = 288;
  const CH = 82;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${CW} ${CH}" width="${CW}" height="${CH}" role="img" aria-label="${esc(c.label)}: ${esc(c.value)}">
  <title>${esc(c.label)}: ${esc(c.value)}</title>
  <defs><clipPath id="c"><rect width="${CW}" height="${CH}" rx="12"/></clipPath></defs>
  <g clip-path="url(#c)">
    <rect width="${CW}" height="${CH}" fill="#0d1117"/>
    <rect x="22" y="20" width="18" height="2" rx="1" fill="${ACCENT}"/>
    <text x="22" y="44" font-family="${MONO}" font-size="10.5" fill="#6e7681" letter-spacing="2">${esc(c.label)}</text>
    <text x="22" y="65" font-family="${SANS}" font-size="13.5" fill="#c9d1d9">${esc(c.value)}</text>
    <rect x="0.5" y="0.5" width="${CW - 1}" height="${CH - 1}" rx="12" fill="none" stroke="#21262d"/>
  </g>
</svg>
`;
}

writeFileSync("assets/intro.svg", introCard());
writeFileSync("assets/tech.svg", techCard());
for (const c of CONTACT) writeFileSync(`assets/contact-${c.key}.svg`, contactCard(c));

console.log(
  `Giriş, ${PROJECTS.length} proje, teknoloji ve ${CONTACT.length} iletişim kartı üretildi.`
);
