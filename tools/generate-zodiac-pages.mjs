// 12 burc SEO landing sayfasi uretici.
// Usage: node tools/generate-zodiac-pages.mjs
// Output: koc.html, boga.html, ikizler.html, yengec.html, aslan.html,
// basak.html, terazi.html, akrep.html, yay.html, oglak.html, kova.html,
// balik.html (repo root'a yazilir, GitHub Pages serve eder)

import { zodiacs } from './zodiac-data.mjs';
import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '..');

function render(z) {
  const title = `${z.nameAccented} Burcu Ozellikleri, Karakteri ve Yorumu | Astro Dozi`;
  const description = `${z.nameAccented} burcu ${z.dateRange} arasi dogan kisiler icin detayli karakter analizi, ask, kariyer, burc uyumu ve gunluk yorum. Yapay zeka destekli kisisel astroloji.`;
  const ogImage = 'https://astro.dozi.app/assets/astro_dozi_main.png';
  const canonical = `https://astro.dozi.app/${z.slug}.html`;

  return `<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="${description}">
    <meta name="keywords" content="${z.nameAccented} burcu, ${z.nameAccented} burcu yorumu, ${z.nameAccented} burcu ozellikleri, ${z.nameAccented} burcu karakteri, ${z.nameAccented} burcu uyumu, ${z.nameAccented} burcu ask, burc yorumu, astroloji">
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
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="css/zodiac-detail.css">
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "${z.nameAccented} Burcu Ozellikleri, Karakteri ve Yorumu",
        "description": "${description}",
        "image": "${ogImage}",
        "author": {
            "@type": "Organization",
            "name": "Bardino Technology"
        },
        "publisher": {
            "@type": "Organization",
            "name": "Astro Dozi",
            "logo": {
                "@type": "ImageObject",
                "url": "https://astro.dozi.app/assets/astro_dozi_icon_fg.png"
            }
        },
        "mainEntityOfPage": "${canonical}",
        "about": {
            "@type": "Thing",
            "name": "${z.nameAccented} burcu"
        }
    }
    </script>
</head>
<body>
    <!-- Navbar -->
    <nav class="navbar" id="navbar">
        <div class="nav-container">
            <a href="/" class="nav-logo">
                <img src="assets/astro_dozi_icon_fg.png" alt="Astro Dozi">
                <span>Astro Dozi</span>
            </a>
            <ul class="nav-links">
                <li><a href="/#features">Ozellikler</a></li>
                <li><a href="/#pricing">Premium</a></li>
                <li><a href="/app.html" class="nav-cta">Uygulamaya Git</a></li>
            </ul>
        </div>
    </nav>

    <main class="zodiac-detail">
        <header class="zodiac-detail-hero">
            <div class="zodiac-detail-symbol" aria-hidden="true">${z.symbol}</div>
            <h1>${z.nameAccented} Burcu</h1>
            <p class="zodiac-detail-meta">
                <span>${z.dateRange}</span>
                <span class="dot"></span>
                <span>${z.element}</span>
                <span class="dot"></span>
                <span>${z.ruler}</span>
                <span class="dot"></span>
                <span>${z.quality}</span>
            </p>
            <a href="app.html?sign=${z.appSign}" class="btn-primary btn-glow">
                <span>&#9734;</span>
                <span>Gunluk ${z.nameAccented} Yorumumu Oku</span>
            </a>
        </header>

        <section class="zodiac-detail-intro">
            <p>${z.intro}</p>
        </section>

        <section class="zodiac-detail-section">
            <h2>${z.nameAccented} Burcu Karakter Ozellikleri</h2>
            <ul class="zodiac-detail-list">
                ${z.characteristics.map(c => `<li>${c}</li>`).join('\n                ')}
            </ul>
        </section>

        <section class="zodiac-detail-section">
            <h2>${z.nameAccented} Burcu Ask Hayati</h2>
            <p>${z.love}</p>
        </section>

        <section class="zodiac-detail-section">
            <h2>${z.nameAccented} Burcu Kariyer ve Meslek</h2>
            <p>${z.career}</p>
        </section>

        <section class="zodiac-detail-section">
            <h2>${z.nameAccented} Burcu Uyumu</h2>
            <div class="zodiac-compat">
                <div class="zodiac-compat-col">
                    <h3>En Iyi Uyum</h3>
                    <p>${z.bestMatch.join(', ')}</p>
                </div>
                <div class="zodiac-compat-col">
                    <h3>Dikkat Edilmesi Gereken</h3>
                    <p>${z.worstMatch.join(', ')}</p>
                </div>
            </div>
            <p class="zodiac-detail-cta-inline">
                Partneriyle detayli uyum analizi icin
                <a href="app.html?feature=compatibility&sign=${z.appSign}">Astro Dozi'de Burc Uyumu</a> ozelligini kullanabilirsin.
            </p>
        </section>

        <section class="zodiac-detail-section">
            <h2>Unlu ${z.nameAccented} Burclari</h2>
            <p>${z.celebrities.join(' - ')}</p>
        </section>

        <section class="zodiac-detail-section">
            <h2>${z.nameAccented} Burcu Sansli Degerleri</h2>
            <div class="zodiac-lucky-grid">
                <div class="zodiac-lucky"><span>Sansli Sayi</span><strong>${z.luckyNumber}</strong></div>
                <div class="zodiac-lucky"><span>Sansli Renk</span><strong>${z.luckyColor}</strong></div>
                <div class="zodiac-lucky"><span>Sansli Gun</span><strong>${z.luckyDay}</strong></div>
                <div class="zodiac-lucky"><span>Sansli Tas</span><strong>${z.luckyStone}</strong></div>
            </div>
        </section>

        <section class="zodiac-detail-cta">
            <h2>${z.nameAccented} Burcunun Bugunku Yorumu</h2>
            <p>Astro Dozi, dogum haritana ozel ${z.nameAccented} burcu yorumu hazirliyor. Swiss Ephemeris ile gercek gezegen pozisyonlari, Gemini AI ile kisisel rehberlik.</p>
            <a href="app.html?sign=${z.appSign}" class="btn-primary btn-glow">
                <span>&#9734;</span>
                <span>Bugunku Yorumumu Goster</span>
            </a>
            <p class="zodiac-detail-store">
                <a href="https://play.google.com/store/apps/details?id=com.bardino.zodi" target="_blank" rel="noopener">Google Play'den indir</a>
            </p>
        </section>

        <nav class="zodiac-detail-other">
            <h3>Diger Burclar</h3>
            <div class="zodiac-detail-other-grid">
                ${zodiacs.filter(x => x.slug !== z.slug).map(x =>
                    `<a href="${x.slug}.html"><span>${x.symbol}</span> ${x.nameAccented}</a>`
                ).join('\n                ')}
            </div>
        </nav>
    </main>

    <footer class="footer">
        <div class="container">
            <div class="footer-bottom">
                <p>&copy; 2026 Bardino Technology. Tum haklari saklidir.</p>
            </div>
        </div>
    </footer>
</body>
</html>
`;
}

for (const z of zodiacs) {
  const html = render(z);
  const path = join(REPO_ROOT, `${z.slug}.html`);
  writeFileSync(path, html, 'utf8');
  console.log(`wrote ${z.slug}.html (${html.length} bytes)`);
}

console.log(`\n${zodiacs.length} zodiac landing pages generated.`);
