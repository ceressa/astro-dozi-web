// 12 burc icin premium SEO landing sayfasi uretici.
// Usage: node tools/generate-zodiac-pages.mjs

import { zodiacs } from './zodiac-data.mjs';
import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '..');

function render(z) {
  const title = `${z.nameAccented} Burcu Özellikleri, Karakteri ve Yorumu | Astro Dozi`;
  const description = `${z.nameAccented} burcu (${z.dateRange}) detaylı karakter analizi, aşk hayatı, kariyer, burç uyumu ve günlük yorum. Yapay zeka destekli kişisel astroloji.`;
  const ogImage = `https://astro.dozi.app/assets/dozi_signs/dozi_sign_${z.appSign}.webp`;
  const canonical = `https://astro.dozi.app/${z.slug}.html`;

  return `<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="${description}">
    <meta name="keywords" content="${z.nameAccented} burcu, ${z.nameAccented} burcu yorumu, ${z.nameAccented} burcu özellikleri, ${z.nameAccented} burcu karakteri, ${z.nameAccented} burcu uyumu, ${z.nameAccented} burcu aşk, burç yorumu, astroloji">
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
    <link rel="stylesheet" href="css/zodiac-detail.css?v=3">
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "${z.nameAccented} Burcu Özellikleri, Karakteri ve Yorumu",
        "description": "${description}",
        "image": "${ogImage}",
        "author": { "@type": "Organization", "name": "Bardino Technology" },
        "publisher": {
            "@type": "Organization",
            "name": "Astro Dozi",
            "logo": { "@type": "ImageObject", "url": "https://astro.dozi.app/assets/astro_dozi_icon_fg.png" }
        },
        "mainEntityOfPage": "${canonical}",
        "about": { "@type": "Thing", "name": "${z.nameAccented} burcu" }
    }
    </script>
</head>
<body class="zodiac-page">
    <!-- Cosmic background layers -->
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
                <li><a href="/#features">Özellikler</a></li>
                <li><a href="/#pricing">Premium</a></li>
                <li><a href="/app.html" class="nav-cta">Uygulamaya Git</a></li>
            </ul>
        </div>
    </nav>

    <main class="zodiac-detail">
        <header class="zodiac-hero">
            <div class="zodiac-hero-mascot">
                <div class="zodiac-hero-glow"></div>
                <img src="assets/dozi_signs/dozi_sign_${z.appSign}.webp" alt="${z.nameAccented} Dozi" loading="eager">
                <div class="zodiac-hero-symbol" aria-hidden="true">${z.symbol}</div>
            </div>
            <div class="zodiac-hero-content">
                <span class="zodiac-hero-eyebrow">Burç Profili</span>
                <h1>${z.nameAccented} Burcu</h1>
                <p class="zodiac-hero-tagline">${z.dateRange}</p>
                <div class="zodiac-hero-chips">
                    <div class="zodiac-chip"><span>Element</span><strong>${z.element}</strong></div>
                    <div class="zodiac-chip"><span>Yönetici</span><strong>${z.ruler}</strong></div>
                    <div class="zodiac-chip"><span>Nitelik</span><strong>${z.quality}</strong></div>
                </div>
                <a href="app.html?sign=${z.appSign}" class="zodiac-cta-primary">
                    <span class="cta-icon">&#10024;</span>
                    <span>Günlük ${z.nameAccented} Yorumumu Oku</span>
                    <span class="cta-arrow">&rarr;</span>
                </a>
            </div>
        </header>

        <section class="zodiac-section zodiac-intro-card">
            <p>${z.intro}</p>
        </section>

        <section class="zodiac-section">
            <h2><span class="section-icon">${z.symbol}</span> ${z.nameAccented} Burcu Karakter Özellikleri</h2>
            <ul class="zodiac-traits">
                ${z.characteristics.map((c, i) => `<li style="--i:${i}">${c}</li>`).join('\n                ')}
            </ul>
        </section>

        <section class="zodiac-section">
            <h2><span class="section-icon">&#10084;</span> ${z.nameAccented} Burcu Aşk Hayatı</h2>
            <p>${z.love}</p>
        </section>

        <section class="zodiac-section">
            <h2><span class="section-icon">&#128188;</span> ${z.nameAccented} Burcu Kariyer ve Meslek</h2>
            <p>${z.career}</p>
        </section>

        <section class="zodiac-section">
            <h2><span class="section-icon">&#128159;</span> ${z.nameAccented} Burcu Uyumu</h2>
            <div class="zodiac-compat">
                <div class="zodiac-compat-card good">
                    <div class="zodiac-compat-label">En İyi Uyum</div>
                    <div class="zodiac-compat-signs">${z.bestMatch.map(s => `<span>${s}</span>`).join('')}</div>
                </div>
                <div class="zodiac-compat-card warn">
                    <div class="zodiac-compat-label">Dikkat Edilmesi Gereken</div>
                    <div class="zodiac-compat-signs">${z.worstMatch.map(s => `<span>${s}</span>`).join('')}</div>
                </div>
            </div>
            <p class="zodiac-inline-cta">
                Partnerinle <a href="app.html?feature=compatibility&sign=${z.appSign}">detaylı uyum analizi</a> için Astro Dozi'de QR ile eşleşme yap.
            </p>
        </section>

        <section class="zodiac-section">
            <h2><span class="section-icon">&#11088;</span> Ünlü ${z.nameAccented} Burçları</h2>
            <div class="zodiac-celebs">
                ${z.celebrities.map(c => `<span class="zodiac-celeb">${c}</span>`).join('\n                ')}
            </div>
        </section>

        <section class="zodiac-section">
            <h2><span class="section-icon">&#127808;</span> ${z.nameAccented} Burcu Şanslı Değerleri</h2>
            <div class="zodiac-lucky-grid">
                <div class="zodiac-lucky"><span class="lucky-label">Şanslı Sayı</span><strong>${z.luckyNumber}</strong></div>
                <div class="zodiac-lucky"><span class="lucky-label">Şanslı Renk</span><strong>${z.luckyColor}</strong></div>
                <div class="zodiac-lucky"><span class="lucky-label">Şanslı Gün</span><strong>${z.luckyDay}</strong></div>
                <div class="zodiac-lucky"><span class="lucky-label">Şanslı Taş</span><strong>${z.luckyStone}</strong></div>
            </div>
        </section>

        <section class="zodiac-cta-banner">
            <img src="assets/dozi_signs/dozi_sign_${z.appSign}.webp" alt="" class="cta-banner-mascot" aria-hidden="true">
            <h2>${z.nameAccented}'in Bugünkü Yorumu Hazır</h2>
            <p>Doğum haritana özel, Swiss Ephemeris hesaplamalarıyla, yapay zekanın yazdığı gerçek kişisel yorumun seni bekliyor.</p>
            <a href="app.html?sign=${z.appSign}" class="zodiac-cta-primary">
                <span class="cta-icon">&#10024;</span>
                <span>Bugünkü Yorumumu Göster</span>
                <span class="cta-arrow">&rarr;</span>
            </a>
            <p class="zodiac-store-row">
                <a href="https://play.google.com/store/apps/details?id=com.bardino.zodi" target="_blank" rel="noopener">Google Play'den indir</a>
            </p>
        </section>

        <nav class="zodiac-other">
            <h3>Diğer Burçlar</h3>
            <div class="zodiac-other-grid">
                ${zodiacs.filter(x => x.slug !== z.slug).map(x =>
                    `<a href="${x.slug}.html" class="zodiac-other-card">
                        <img src="assets/dozi_signs/dozi_sign_${x.appSign}.webp" alt="">
                        <span class="other-name">${x.nameAccented}</span>
                        <span class="other-symbol">${x.symbol}</span>
                    </a>`
                ).join('\n                ')}
            </div>
        </nav>
    </main>

    <footer class="footer">
        <div class="container">
            <div class="footer-bottom">
                <p>&copy; 2026 Bardino Technology. Tüm hakları saklıdır.</p>
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
