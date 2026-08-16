/**
 * README'deki statik animasyonlu kartları üretir:
 *   assets/tech.svg          — teknoloji rozetleri
 *   assets/experience.svg    — deneyim & eğitim zaman çizelgesi
 *   assets/contact-*.svg     — iletişim kutucukları (her biri ayrı link)
 *
 * Kullanım: node scripts/build-cards.mjs
 *
 * İçeriği değiştirmek için aşağıdaki TECH / TIMELINE / CONTACT dizilerini düzenle.
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

mkdirSync("assets", { recursive: true });
writeFileSync("assets/tech.svg", techCard());
writeFileSync("assets/experience.svg", experienceCard());
for (const c of CONTACT) writeFileSync(`assets/${c.file}.svg`, contactCard(c));
console.log("assets/tech.svg, assets/experience.svg ve iletişim kartları güncellendi.");
