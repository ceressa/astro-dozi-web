// 4 fal turu icin SEO landing sayfasi uretici.
// Usage: node tools/generate-fortune-pages.mjs

import { fortunes } from './fortune-data.mjs';
import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '..');

function render(f) {
  const title = `${f.name}: AI ile Online ${f.name} | Astro Dozi`;
  const description = `${f.intro.slice(0, 155)}`;
  const canonical = `https://astro.dozi.app/${f.slug}.html`;
  const ogImage = 'https://astro.dozi.app/assets/astro_dozi_main.png';

  return `<!DOCTYPE html>
<html lang="tr">
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
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="css/zodiac-detail.css">
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": "Astro Dozi ile ${f.name} Nasil Yapilir",
        "description": "${description}",
        "image": "${ogImage}",
        "step": [
${f.howTo.map((s, i) => `            {
                "@type": "HowToStep",
                "position": ${i + 1},
                "text": "${s}"
            }`).join(',\n')}
        ]
    }
    </script>
</head>
<body>
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

    <main class="fortune-detail">
        <header class="fortune-detail-hero">
            <div class="fortune-detail-symbol" aria-hidden="true">${f.symbol}</div>
            <h1>${f.name}</h1>
            <p class="zodiac-detail-meta"><span>Yapay Zeka Destekli</span><span class="dot"></span><span>Ucretsiz Deneme</span></p>
            <a href="app.html?feature=${f.feature}" class="btn-primary btn-glow">
                <span>&#9734;</span>
                <span>Hemen ${f.name}na Bak</span>
            </a>
        </header>

        <section class="zodiac-detail-intro">
            <p>${f.intro}</p>
        </section>

        <section class="fortune-detail-section">
            <h2>${f.name}nin Tarihi</h2>
            <p>${f.history}</p>
        </section>

        <section class="fortune-detail-section">
            <h2>${f.name} Nasil Bakilir</h2>
            <ul class="fortune-detail-list">
                ${f.howTo.map(s => `<li>${s}</li>`).join('\n                ')}
            </ul>
        </section>

        <section class="fortune-detail-section">
            <h2>Astro Dozi'nin Yontemi</h2>
            <p>${f.method}</p>
        </section>

        <section class="fortune-detail-section">
            <h2>${f.name}nda Sik Karsilasilan Semboller</h2>
            <ul class="fortune-detail-list">
                ${f.symbols.map(s => `<li><strong>${s.name}:</strong> ${s.meaning}</li>`).join('\n                ')}
            </ul>
        </section>

        <section class="fortune-detail-cta">
            <h2>${f.cta}</h2>
            <p>Astro Dozi, dogum haritana gore kisisellestirilmis yorumlar sunar. Hicbir kullanici ayni sonucu almaz.</p>
            <a href="app.html?feature=${f.feature}" class="btn-primary btn-glow">
                <span>&#9734;</span>
                <span>${f.name}na Basla</span>
            </a>
            <p class="zodiac-detail-store">
                <a href="https://play.google.com/store/apps/details?id=com.bardino.zodi" target="_blank" rel="noopener">Google Play'den indir</a>
            </p>
        </section>

        <nav class="zodiac-detail-other">
            <h3>Diger Fal Turleri</h3>
            <div class="zodiac-detail-other-grid">
                ${fortunes.filter(x => x.slug !== f.slug).map(x =>
                    `<a href="${x.slug}.html"><span>${x.symbol}</span> ${x.name}</a>`
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

for (const f of fortunes) {
  const html = render(f);
  const path = join(REPO_ROOT, `${f.slug}.html`);
  writeFileSync(path, html, 'utf8');
  console.log(`wrote ${f.slug}.html (${html.length} bytes)`);
}

console.log(`\n${fortunes.length} fortune landing pages generated.`);
