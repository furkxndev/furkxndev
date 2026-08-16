/**
 * GitHub API'sinden herkese açık verileri çekip assets/stats.svg ve
 * assets/languages.svg kartlarını üretir.
 *
 * Kullanım: GITHUB_TOKEN=... node scripts/build-stats.mjs <kullanıcı-adı>
 *
 * Üçüncü parti kart servislerine bağımlı kalmamak için var: kartlar bu repoda
 * durur, GitHub Actions günde bir yeniler.
 */

import { writeFileSync, mkdirSync } from "node:fs";

const LOGIN = process.argv[2] || "furkxndev";
const TOKEN = process.env.GITHUB_TOKEN;
if (!TOKEN) {
  console.error("GITHUB_TOKEN gerekli.");
  process.exit(1);
}

const QUERY = `
query($login: String!) {
  user(login: $login) {
    followers { totalCount }
    contributionsCollection {
      totalCommitContributions
      totalPullRequestContributions
      contributionCalendar {
        totalContributions
        weeks { contributionDays { date weekday contributionCount } }
      }
    }
    repositories(first: 100, ownerAffiliations: OWNER, isFork: false, privacy: PUBLIC) {
      totalCount
      nodes {
        stargazerCount
        languages(first: 12, orderBy: { field: SIZE, direction: DESC }) {
          edges { size node { name color } }
        }
      }
    }
  }
}`;

async function fetchStats() {
  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `bearer ${TOKEN}`,
      "Content-Type": "application/json",
      "User-Agent": "furkxndev-profile-stats",
    },
    body: JSON.stringify({ query: QUERY, variables: { login: LOGIN } }),
  });
  if (!res.ok) throw new Error(`GitHub API ${res.status}: ${await res.text()}`);
  const json = await res.json();
  if (json.errors) throw new Error(JSON.stringify(json.errors));
  return json.data.user;
}

/** GitHub'ın katkı ızgarasındaki yeşil tonlarına yakın renk skalası. */
function level(count) {
  if (count === 0) return "#161b22";
  if (count < 3) return "#0e4429";
  if (count < 6) return "#006d32";
  if (count < 10) return "#26a641";
  return "#39d353";
}

function topLanguages(nodes, limit = 6) {
  const totals = new Map();
  for (const repo of nodes) {
    for (const edge of repo.languages.edges) {
      const { name, color } = edge.node;
      const prev = totals.get(name) || { size: 0, color: color || "#8b949e" };
      prev.size += edge.size;
      totals.set(name, prev);
    }
  }
  const sum = [...totals.values()].reduce((a, l) => a + l.size, 0) || 1;
  return [...totals.entries()]
    .sort((a, b) => b[1].size - a[1].size)
    .slice(0, limit)
    .map(([name, l]) => ({ name, color: l.color, pct: (l.size / sum) * 100 }));
}

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const nf = new Intl.NumberFormat("tr-TR");

/** Ortak kart iskeleti: koyu zemin, ince kenarlık, üstte başlık. */
function shell(w, h, title, body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="${esc(title)}">
  <title>${esc(title)}</title>
  <defs><clipPath id="c"><rect width="${w}" height="${h}" rx="12"/></clipPath></defs>
  <g clip-path="url(#c)">
    <rect width="${w}" height="${h}" fill="#0d1117"/>
    <rect x="0" y="0" width="${w}" height="3" fill="#1f6feb" opacity="0.55"/>
    <text x="24" y="34" font-family="system-ui, -apple-system, Segoe UI, Helvetica, Arial, sans-serif"
          font-size="14" font-weight="600" fill="#58a6ff" letter-spacing="0.4">${esc(title)}</text>
${body}
    <rect x="0.5" y="0.5" width="${w - 1}" height="${h - 1}" rx="12" fill="none" stroke="#21262d"/>
  </g>
</svg>
`;
}

/**
 * Aşağıdan yukarı kayarak beliren giriş animasyonu.
 * keyTimes 0 ile başlayıp 1 ile bitmek zorunda; aksi halde tarayıcı
 * animasyonu tamamen yok sayar ve öğe opacity=0'da kalır.
 */
function enter(delay) {
  const d = Math.min(delay, 0.8);
  const e = Math.min(d + 0.12, 0.95);
  return `<animate attributeName="opacity" values="0;0;1;1" keyTimes="0;${d};${e};1" dur="2.4s" fill="freeze"/>
      <animateTransform attributeName="transform" type="translate" additive="sum"
                        values="0 10;0 10;0 0;0 0" keyTimes="0;${d};${e};1" dur="2.4s" fill="freeze"/>`;
}

function statsCard(u) {
  const cc = u.contributionsCollection;
  const stars = u.repositories.nodes.reduce((a, r) => a + r.stargazerCount, 0);

  const tiles = [
    { label: "Katkı (12 ay)", value: cc.contributionCalendar.totalContributions, color: "#3fb950" },
    { label: "Açık repo", value: u.repositories.totalCount, color: "#58a6ff" },
    { label: "Toplam yıldız", value: stars, color: "#d29922" },
    { label: "Takipçi", value: u.followers.totalCount, color: "#a371f7" },
  ];

  let body = "";
  tiles.forEach((t, i) => {
    const x = 24 + (i % 2) * 208;
    const y = 62 + Math.floor(i / 2) * 76;
    body += `
    <g opacity="0">${enter(0.1 + i * 0.09)}
      <rect x="${x}" y="${y}" width="188" height="62" rx="9" fill="#11161f" stroke="#21262d"/>
      <rect x="${x}" y="${y + 12}" width="3" height="38" rx="1.5" fill="${t.color}"/>
      <text x="${x + 18}" y="${y + 32}" font-family="ui-monospace, SFMono-Regular, Menlo, monospace"
            font-size="24" font-weight="700" fill="#e6edf3">${nf.format(t.value)}</text>
      <text x="${x + 18}" y="${y + 50}" font-family="system-ui, -apple-system, Segoe UI, Helvetica, Arial, sans-serif"
            font-size="11.5" fill="#6e7681">${esc(t.label)}</text>
    </g>`;
  });

  // Alt şerit: 12 aylık katkı ızgarası, hücreler soldan sağa dalga hâlinde beliriyor
  const weeks = cc.contributionCalendar.weeks.slice(-53);
  const CELL = 6;
  const STEP = 7.4;
  const GRID_TOP = 226;

  let cells = "";
  weeks.forEach((week, wi) => {
    const delay = Math.min(0.18 + wi * 0.011, 0.85);
    const end = Math.min(delay + 0.1, 0.95);
    for (const day of week.contributionDays) {
      const x = (24 + wi * STEP).toFixed(1);
      const y = (GRID_TOP + day.weekday * STEP).toFixed(1);
      cells += `
      <rect x="${x}" y="${y}" width="${CELL}" height="${CELL}" rx="1.6" fill="${level(day.contributionCount)}" opacity="0">
        <animate attributeName="opacity" values="0;0;1;1" keyTimes="0;${delay.toFixed(3)};${end.toFixed(3)};1" dur="2.4s" fill="freeze"/>
      </rect>`;
    }
  });

  body += `
    <g opacity="0">${enter(0.14)}
      <text x="24" y="215" font-family="system-ui, -apple-system, Segoe UI, Helvetica, Arial, sans-serif"
            font-size="11.5" fill="#6e7681">Son 12 ayın katkı ızgarası</text>
      <text x="420" y="215" text-anchor="end" font-family="ui-monospace, SFMono-Regular, Menlo, monospace"
            font-size="11.5" fill="#6e7681">${nf.format(cc.contributionCalendar.totalContributions)}</text>
    </g>
    <g>${cells}
    </g>`;

  return shell(444, 292, "GitHub istatistikleri", body);
}

function languagesCard(u) {
  const langs = topLanguages(u.repositories.nodes);

  let body = "";
  if (langs.length === 0) {
    body = `
    <text x="24" y="150" font-family="system-ui, sans-serif" font-size="13" fill="#6e7681">Henüz veri yok.</text>`;
  }

  langs.forEach((l, i) => {
    const y = 66 + i * 37;
    const w = Math.max(6, Math.round((l.pct / 100) * 396));
    const delay = 0.12 + i * 0.08;
    body += `
    <g opacity="0">${enter(delay)}
      <text x="24" y="${y}" font-family="system-ui, -apple-system, Segoe UI, Helvetica, Arial, sans-serif"
            font-size="12.5" fill="#c9d1d9">${esc(l.name)}</text>
      <text x="420" y="${y}" text-anchor="end" font-family="ui-monospace, SFMono-Regular, Menlo, monospace"
            font-size="12" fill="#6e7681">${l.pct.toFixed(1)}%</text>
      <rect x="24" y="${y + 7}" width="396" height="7" rx="3.5" fill="#161b22"/>
      <rect x="24" y="${y + 7}" width="0" height="7" rx="3.5" fill="${esc(l.color)}">
        <animate attributeName="width" values="0;0;${w};${w}"
                 keyTimes="0;${delay};${Math.min(delay + 0.45, 0.95)};1" dur="2.4s" fill="freeze"/>
      </rect>
    </g>`;
  });

  return shell(444, 292, "En çok kullandığım diller", body);
}

const user = await fetchStats();
mkdirSync("assets", { recursive: true });
writeFileSync("assets/stats.svg", statsCard(user));
writeFileSync("assets/languages.svg", languagesCard(user));
console.log("assets/stats.svg ve assets/languages.svg güncellendi.");
