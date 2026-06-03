// 4 fal turu icin yaratici, sinematik SEO landing sayfasi uretici.
// Her fal turu icin unique sahne:
//   - coffee : SVG fincan + telve sembolleri canli (kus, yol, kalp...)
//   - tarot  : 3 RWS kart, 3D flip stagger
//   - dream  : 8 ay fazi dongusu + yildiz alani
//   - palm   : SVG el + 4 cizgi (kalp/hayat/kafa/kader) stroke-dasharray draw
// Usage: node tools/generate-fortune-pages.mjs

import { fortunes } from './fortune-data.mjs';
import { fortunesEn } from './fortune-data-en.mjs';
import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '..');
const locale = process.argv[2] || 'tr';
const fortuneData = locale === 'en' ? fortunesEn : fortunes;
const isEn = locale === 'en';

function renderScene(f) {
  switch (f.sceneKind) {
    case 'coffee':
      return `<div class="scene scene-coffee" aria-hidden="true">
                <div class="coffee-aura"></div>
                <svg class="coffee-cup" viewBox="0 0 240 240">
                    <defs>
                        <radialGradient id="cupGrad" cx="50%" cy="40%" r="50%">
                            <stop offset="0%" stop-color="#FFF8E7"/>
                            <stop offset="60%" stop-color="#F4DDB5"/>
                            <stop offset="100%" stop-color="#C97A40"/>
                        </radialGradient>
                        <radialGradient id="telveGrad" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stop-color="#3A1A0A"/>
                            <stop offset="100%" stop-color="#1A0A04"/>
                        </radialGradient>
                    </defs>
                    <ellipse cx="120" cy="60" rx="80" ry="22" fill="url(#cupGrad)" stroke="#D4AF37" stroke-width="2"/>
                    <ellipse cx="120" cy="60" rx="64" ry="16" fill="url(#telveGrad)"/>
                    <path d="M 40 60 Q 50 200 120 210 Q 190 200 200 60" fill="url(#cupGrad)" stroke="#D4AF37" stroke-width="2"/>
                    <path d="M 195 80 Q 230 90 230 130 Q 230 165 200 170" fill="none" stroke="#D4AF37" stroke-width="3"/>
                    <ellipse cx="120" cy="225" rx="90" ry="10" fill="url(#cupGrad)" stroke="#D4AF37" stroke-width="2"/>
                    <!-- Telve sembolleri -->
                    <g class="telve-symbols">
                        <text x="90" y="55" font-size="14" fill="rgba(212,175,55,0.85)">★</text>
                        <text x="135" y="50" font-size="12" fill="rgba(212,175,55,0.7)">♥</text>
                        <text x="115" y="68" font-size="10" fill="rgba(212,175,55,0.65)">∞</text>
                        <text x="150" y="64" font-size="11" fill="rgba(212,175,55,0.8)">⚹</text>
                        <text x="85" y="68" font-size="10" fill="rgba(212,175,55,0.7)">~</text>
                    </g>
                </svg>
                <div class="coffee-steam"><span></span><span></span><span></span></div>
            </div>`;

    case 'tarot':
      return `<div class="scene scene-tarot" aria-hidden="true">
                <div class="tarot-card" style="--i:0">
                    <div class="t-face t-back"><span class="t-mark">✦</span></div>
                    <div class="t-face t-front t-front-1">
                        <span class="t-symbol">☽</span>
                        <span class="t-label">${isEn ? 'Past' : 'Geçmiş'}</span>
                        <span class="t-roman">XVIII</span>
                    </div>
                </div>
                <div class="tarot-card" style="--i:1">
                    <div class="t-face t-back"><span class="t-mark">✦</span></div>
                    <div class="t-face t-front t-front-2">
                        <span class="t-symbol">★</span>
                        <span class="t-label">${isEn ? 'Present' : 'Şimdi'}</span>
                        <span class="t-roman">XVII</span>
                    </div>
                </div>
                <div class="tarot-card" style="--i:2">
                    <div class="t-face t-back"><span class="t-mark">✦</span></div>
                    <div class="t-face t-front t-front-3">
                        <span class="t-symbol">☀</span>
                        <span class="t-label">${isEn ? 'Future' : 'Gelecek'}</span>
                        <span class="t-roman">XIX</span>
                    </div>
                </div>
            </div>`;

    case 'dream':
      return `<div class="scene scene-dream" aria-hidden="true">
                <div class="dream-sky">
                    <span class="dream-star" style="--x:12%;--y:18%;--d:0s"></span>
                    <span class="dream-star" style="--x:78%;--y:22%;--d:0.4s"></span>
                    <span class="dream-star" style="--x:30%;--y:55%;--d:0.8s"></span>
                    <span class="dream-star" style="--x:85%;--y:68%;--d:1.2s"></span>
                    <span class="dream-star" style="--x:20%;--y:78%;--d:1.6s"></span>
                    <span class="dream-star" style="--x:55%;--y:35%;--d:2s"></span>
                    <span class="dream-star" style="--x:65%;--y:82%;--d:2.4s"></span>
                </div>
                <div class="moon-cycle">
                    <span class="moon-phase" style="--i:0"></span>
                    <span class="moon-phase" style="--i:1"></span>
                    <span class="moon-phase" style="--i:2"></span>
                    <span class="moon-phase" style="--i:3"></span>
                    <span class="moon-phase" style="--i:4"></span>
                    <span class="moon-phase" style="--i:5"></span>
                    <span class="moon-phase" style="--i:6"></span>
                    <span class="moon-phase" style="--i:7"></span>
                </div>
                <div class="dream-zzz">💤</div>
            </div>`;

    case 'palm':
      return `<div class="scene scene-palm" aria-hidden="true">
                <svg viewBox="0 0 280 280" class="palm-svg">
                    <defs>
                        <linearGradient id="palmGrad" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stop-color="#F8D5C4"/>
                            <stop offset="100%" stop-color="#EC9F8F"/>
                        </linearGradient>
                    </defs>
                    <!-- Palm shape (simplified) -->
                    <path d="M 90 240 Q 70 180 75 130 Q 78 80 100 60 Q 110 50 120 60 L 120 100 Q 135 50 150 55 Q 165 60 165 100 L 165 110 Q 180 65 195 75 Q 205 85 200 110 L 200 130 Q 215 100 225 115 Q 230 130 220 155 Q 215 200 195 240 Z" fill="url(#palmGrad)" stroke="#D4AF37" stroke-width="1.5" opacity="0.9"/>
                    <!-- Palm lines: each with stroke-dasharray draw animation -->
                    <path class="palm-line palm-line-heart" d="M 110 130 Q 145 115 195 130" fill="none" stroke="#FF6B9D" stroke-width="2.5" stroke-linecap="round"/>
                    <path class="palm-line palm-line-head" d="M 105 155 Q 145 150 185 155" fill="none" stroke="#FFD700" stroke-width="2.5" stroke-linecap="round"/>
                    <path class="palm-line palm-line-life" d="M 110 130 Q 95 180 110 230" fill="none" stroke="#22D3EE" stroke-width="2.5" stroke-linecap="round"/>
                    <path class="palm-line palm-line-fate" d="M 150 240 Q 145 180 150 130" fill="none" stroke="#A78BFA" stroke-width="2.5" stroke-linecap="round"/>
                </svg>
                <div class="palm-legend">
                    <span><i style="background:#FF6B9D"></i>${isEn ? 'Heart' : 'Kalp'}</span>
                    <span><i style="background:#FFD700"></i>${isEn ? 'Head' : 'Kafa'}</span>
                    <span><i style="background:#22D3EE"></i>${isEn ? 'Life' : 'Hayat'}</span>
                    <span><i style="background:#A78BFA"></i>${isEn ? 'Fate' : 'Kader'}</span>
                </div>
            </div>`;

    default:
      return `<div class="scene scene-default" aria-hidden="true"><span class="scene-symbol">${f.symbol}</span></div>`;
  }
}

function render(f) {
  const title = isEn
    ? `${f.name}: Online Divination with AI | Astro Dozi`
    : `${f.name}: AI ile Online ${f.name} | Astro Dozi`;
  const description = f.intro.slice(0, 155);
  const canonical = isEn ? `https://astro.dozi.app/en/${f.slug}.html` : `https://astro.dozi.app/${f.slug}.html`;
  const ogImage = 'https://astro.dozi.app/assets/astro_dozi_main.png';
  const langAttr = isEn ? 'en' : 'tr';
  const appLink = isEn ? '/en/app.html' : '/app.html';
  const ldName = isEn
    ? `How to Do ${f.name} with Astro Dozi`
    : `Astro Dozi ile ${f.name} Nasil Yapilir`;

  return `<!DOCTYPE html>
<html lang="${langAttr}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="${description}">
    <meta name="keywords" content="${f.searchKeyword}">
    <meta name="author" content="Bardino Technology">
    <meta name="robots" content="index, follow">
    <meta property="og:type" content="article">
    <meta property="og:url" content="${canonical}">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <meta property="og:image" content="${ogImage}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${title}">
    <meta name="twitter:description" content="${description}">
    <meta name="theme-color" content="#1E3A5F">
    <link rel="canonical" href="${canonical}">
    <title>${title}</title>
    <link rel="icon" type="image/png" href="assets/astro_dozi_icon_fg.png">
    <link rel="apple-touch-icon" href="assets/astro_dozi_icon_fg.png">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Playfair+Display:wght@700;900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="css/zodiac-detail.css?v=6">
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": "${ldName}",
        "description": "${description}",
        "image": "${ogImage}",
        "step": [
${f.howTo.map((s, i) => `            { "@type": "HowToStep", "position": ${i + 1}, "text": "${s.replace(/"/g, '\\"')}" }`).join(',\n')}
        ]
    }
    </script>
</head>
<body class="fortune-page" style="--accent:${f.accent}">
    <div class="cosmic-bg" aria-hidden="true">
        <div class="nebula nebula-gold"></div>
        <div class="nebula nebula-purple"></div>
        <div class="starfield"></div>
    </div>

    <nav class="navbar" id="navbar">
        <div class="nav-container">
            <a href="/" class="nav-logo">
                <img src="assets/astro_dozi_icon_fg.png" alt="Astro Dozi">
                <span>Astro Dozi</span>
            </a>
            <ul class="nav-links">
                <li><a href="/#features">${isEn ? 'Features' : 'Özellikler'}</a></li>
                <li><a href="/#pricing">Premium</a></li>
                <li><a href="${appLink}" class="nav-cta">${isEn ? 'Open App' : 'Uygulamaya Git'}</a></li>
            </ul>
        </div>
    </nav>

    <main class="fortune-detail">
        <header class="fortune-cinematic-hero">
            ${renderScene(f)}
            <div class="fortune-hero-text">
                <span class="zodiac-hero-eyebrow">${isEn ? 'Fortune Type' : 'Fal Türü'}</span>
                <h1>${f.name}</h1>
                <p class="fortune-tagline">${f.tagline}</p>
                <a href="app.html?feature=${f.feature}" class="zodiac-cta-primary">
                    <span class="cta-icon">&#10024;</span>
                    <span>${isEn ? `Try ${f.name} Now` : `Hemen ${f.name}na Bak`}</span>
                    <span class="cta-arrow">&rarr;</span>
                </a>
            </div>
        </header>

        <section class="zodiac-section zodiac-intro-card">
            <p>${f.intro}</p>
        </section>

        <section class="zodiac-section">
            <h2><span class="section-icon">&#128218;</span> ${isEn ? `History of ${f.name}` : `${f.name}nin Tarihi`}</h2>
            <p>${f.history}</p>
        </section>

        <section class="zodiac-section">
            <h2><span class="section-icon">&#128270;</span> ${isEn ? `How to Do ${f.name}` : `${f.name} Nasil Bakilir`}</h2>
            <ul class="zodiac-traits">
                ${f.howTo.map((s, i) => `<li style="--i:${i}">${s}</li>`).join('\n                ')}
            </ul>
        </section>

        <section class="zodiac-section">
            <h2><span class="section-icon">&#129504;</span> ${isEn ? "Astro Dozi's Method" : "Astro Dozi'nin Yontemi"}</h2>
            <p>${f.method}</p>
        </section>

        <section class="zodiac-section">
            <h2><span class="section-icon">${f.symbol}</span> ${isEn ? `Common Symbols in ${f.name}` : `${f.name}nda Sik Karsilasilan Semboller`}</h2>
            <ul class="zodiac-traits">
                ${f.symbols.map((s, i) => `<li style="--i:${i}"><strong>${s.name}:</strong> ${s.meaning}</li>`).join('\n                ')}
            </ul>
        </section>

        <section class="zodiac-cta-banner">
            <h2>${f.cta}</h2>
            <p>${isEn ? 'Astro Dozi delivers personalised readings based on your birth chart. No two users receive the same result.' : 'Astro Dozi dogum haritana gore kisisellestirilmis yorumlar sunar. Hicbir kullanici ayni sonucu almaz.'}</p>
            <a href="app.html?feature=${f.feature}" class="zodiac-cta-primary">
                <span class="cta-icon">&#10024;</span>
                <span>${isEn ? `Start ${f.name}` : `${f.name}na Basla`}</span>
                <span class="cta-arrow">&rarr;</span>
            </a>
            <p class="zodiac-store-row">
                <a href="https://play.google.com/store/apps/details?id=com.bardino.zodi" target="_blank" rel="noopener">${isEn ? 'Download on Google Play' : "Google Play'den indir"}</a>
            </p>
        </section>

        <nav class="zodiac-other">
            <h3>${isEn ? 'Other Fortune Types' : 'Diger Fal Turleri'}</h3>
            <div class="zodiac-other-grid">
                ${fortuneData.filter(x => x.slug !== f.slug).map(x =>
                    `<a href="${x.slug}.html" class="zodiac-other-card">
                        <span class="other-symbol" style="font-size:2rem">${x.symbol}</span>
                        <span class="other-name">${x.name}</span>
                    </a>`
                ).join('\n                ')}
            </div>
        </nav>
    </main>

    <footer class="footer">
        <div class="container">
            <div class="footer-bottom">
                <p>&copy; 2026 Bardino Technology. ${isEn ? 'All rights reserved.' : 'Tum haklari saklidir.'}</p>
            </div>
        </div>
    </footer>
</body>
</html>
`;
}

for (const f of fortuneData) {
  const html = render(f);
  const dir = isEn ? join(REPO_ROOT, 'en') : REPO_ROOT;
  const path = join(dir, `${f.slug}.html`);
  writeFileSync(path, html, 'utf8');
  console.log(`wrote ${isEn ? 'en/' : ''}${f.slug}.html (${html.length} bytes)`);
}

console.log(`\n${fortuneData.length} fortune pages (${locale.toUpperCase()}) generated.`);
