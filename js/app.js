// ========================================
// Astro Dozi - Web App Logic
// ========================================

// Sign data: id matches Flutter ZodiacSign enum names (English)
// displayName is Turkish for UI
const SIGNS = [
    { id: 'aries', name: 'Koç', emoji: '\u2648', displayName: 'Koç' },
    { id: 'taurus', name: 'Boğa', emoji: '\u2649', displayName: 'Boğa' },
    { id: 'gemini', name: 'İkizler', emoji: '\u264A', displayName: 'İkizler' },
    { id: 'cancer', name: 'Yengeç', emoji: '\u264B', displayName: 'Yengeç' },
    { id: 'leo', name: 'Aslan', emoji: '\u264C', displayName: 'Aslan' },
    { id: 'virgo', name: 'Başak', emoji: '\u264D', displayName: 'Başak' },
    { id: 'libra', name: 'Terazi', emoji: '\u264E', displayName: 'Terazi' },
    { id: 'scorpio', name: 'Akrep', emoji: '\u264F', displayName: 'Akrep' },
    { id: 'sagittarius', name: 'Yay', emoji: '\u2650', displayName: 'Yay' },
    { id: 'capricorn', name: 'Oğlak', emoji: '\u2651', displayName: 'Oğlak' },
    { id: 'aquarius', name: 'Kova', emoji: '\u2652', displayName: 'Kova' },
    { id: 'pisces', name: 'Balık', emoji: '\u2653', displayName: 'Balık' }
];

// State
let currentUser = null;
let coins = 50;
let selectedSign = null;
let isPremium = false;

// DOM refs - set after DOMContentLoaded
let authScreen, appContent, signSelector, horoscopeCard, horoscopeTitle, horoscopeContent;
let coinCount, navUserBtn, premiumModal, coinModal, toast;

// Cloud Functions (initialized in firebase-config.js as regionalFunctions)
let fnGenerateHoroscope;
let fnGenerateFeature;

// ==================== INIT ====================
document.addEventListener('DOMContentLoaded', () => {
    console.log('[Astro Dozi] DOMContentLoaded');

    // Bind DOM refs
    authScreen = document.getElementById('authScreen');
    appContent = document.getElementById('appContent');
    signSelector = document.getElementById('signSelector');
    horoscopeCard = document.getElementById('horoscopeCard');
    horoscopeTitle = document.getElementById('horoscopeTitle');
    horoscopeContent = document.getElementById('horoscopeContent');
    coinCount = document.getElementById('coinCount');
    navUserBtn = document.getElementById('navUserBtn');
    premiumModal = document.getElementById('premiumModal');
    coinModal = document.getElementById('coinModal');
    toast = document.getElementById('toast');

    // Bind Cloud Functions
    fnGenerateHoroscope = regionalFunctions.httpsCallable('generateHoroscope');
    fnGenerateFeature = regionalFunctions.httpsCallable('generateFeature');

    initSignSelector();
    initEventListeners();
    checkAuthState();
    checkUrlParams();
});

function initSignSelector() {
    if (!signSelector) return;
    signSelector.innerHTML = SIGNS.map(sign =>
        `<button class="sign-btn" data-sign="${sign.id}">
            <span>${sign.emoji}</span>
            <span>${sign.displayName}</span>
        </button>`
    ).join('');

    signSelector.querySelectorAll('.sign-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            selectSign(btn.dataset.sign);
        });
    });
}

function initEventListeners() {
    // Auth - only Google Sign-In, no guest
    const googleBtn = document.getElementById('googleSignInBtn');
    if (googleBtn) googleBtn.addEventListener('click', signInWithGoogle);

    // Mobile menu
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            document.getElementById('navLinks').classList.toggle('active');
        });
    }

    // Nav user button
    if (navUserBtn) {
        navUserBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (currentUser) {
                signOut();
            } else {
                showAuth();
            }
        });
    }

    // Features
    document.querySelectorAll('.app-feature-card').forEach(card => {
        card.addEventListener('click', () => {
            const feature = card.dataset.feature;
            const cost = parseInt(card.dataset.cost);
            handleFeatureClick(feature, cost);
        });
    });

    // Buy coins
    const buyBtn = document.getElementById('buyCoinsBtn');
    if (buyBtn) buyBtn.addEventListener('click', showCoinModal);

    // Modals
    const modalClose = document.getElementById('modalClose');
    const coinModalClose = document.getElementById('coinModalClose');
    const modalSpendCoins = document.getElementById('modalSpendCoins');
    const modalBuyCoins = document.getElementById('modalBuyCoins');
    const modalGoPremium = document.getElementById('modalGoPremium');

    if (modalClose) modalClose.addEventListener('click', () => closeModal(premiumModal));
    if (coinModalClose) coinModalClose.addEventListener('click', () => closeModal(coinModal));
    if (modalSpendCoins) modalSpendCoins.addEventListener('click', handleSpendCoins);
    if (modalBuyCoins) modalBuyCoins.addEventListener('click', () => {
        closeModal(premiumModal);
        showCoinModal();
    });
    if (modalGoPremium) modalGoPremium.addEventListener('click', () => {
        closeModal(premiumModal);
        showCoinModal();
    });

    // Coin packs
    document.querySelectorAll('.coin-pack').forEach(pack => {
        pack.addEventListener('click', () => {
            handleCoinPurchase(pack.dataset.pack);
        });
    });

    // Close modals on overlay click
    [premiumModal, coinModal].forEach(modal => {
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) closeModal(modal);
            });
        }
    });
}

function checkUrlParams() {
    const params = new URLSearchParams(window.location.search);
    const sign = params.get('sign');
    if (sign && SIGNS.find(s => s.id === sign)) {
        selectedSign = sign;
    }
}

// ==================== AUTH ====================
function checkAuthState() {
    auth.onAuthStateChanged(async (user) => {
        console.log('[Astro Dozi] Auth state changed:', user ? user.email : 'null');
        if (user) {
            currentUser = user;
            await loadUserData();
            showApp();
        } else {
            // No guest mode — always require sign-in
            showAuth();
        }
    });
}

async function signInWithGoogle() {
    try {
        await auth.signInWithPopup(googleProvider);
        // onAuthStateChanged handles the rest
    } catch (err) {
        console.error('[Astro Dozi] Auth error:', err.code, err.message);
        if (err.code !== 'auth/popup-closed-by-user') {
            showToast('Giriş yapılamadı: ' + err.message);
        }
    }
}

function signOut() {
    auth.signOut();
    currentUser = null;
    showAuth();
    showToast('Çıkış yapıldı.');
}

async function loadUserData() {
    if (!currentUser) return;
    try {
        const doc = await db.collection('users').doc(currentUser.uid).get();
        if (doc.exists) {
            const data = doc.data();
            coins = data.coinBalance != null ? data.coinBalance : 50;
            isPremium = data.isPremium || false;

            // Flutter stores zodiac as enum name: "aries", "taurus", etc.
            if (data.zodiacSign) {
                const zodiacStr = data.zodiacSign.toLowerCase();
                const matchedSign = SIGNS.find(s => s.id === zodiacStr);
                if (matchedSign) {
                    selectedSign = matchedSign.id;
                }
            }
        } else {
            coins = 50;
        }
    } catch (err) {
        console.error('[Astro Dozi] Error loading user data:', err);
        coins = 50;
    }
    updateUI();
}

// ==================== UI ====================
function showAuth() {
    if (authScreen) authScreen.style.display = 'flex';
    if (appContent) appContent.style.display = 'none';
    if (navUserBtn) {
        navUserBtn.textContent = 'Giriş Yap';
        navUserBtn.href = '#';
    }
}

function showApp() {
    if (authScreen) authScreen.style.display = 'none';
    if (appContent) appContent.style.display = 'block';
    updateUI();

    if (navUserBtn) {
        navUserBtn.textContent = currentUser ? 'Çıkış Yap' : 'Giriş Yap';
    }

    if (selectedSign) {
        selectSign(selectedSign);
    }
}

function updateUI() {
    if (coinCount) coinCount.textContent = coins;
    const modalBalance = document.getElementById('modalBalance');
    if (modalBalance) modalBalance.textContent = coins;
}

function selectSign(signId) {
    selectedSign = signId;
    const sign = SIGNS.find(s => s.id === signId);
    if (!sign) return;

    // Update selector
    if (signSelector) {
        signSelector.querySelectorAll('.sign-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.sign === signId);
        });

        const activeBtn = signSelector.querySelector('.sign-btn.active');
        if (activeBtn) {
            activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
    }

    if (horoscopeTitle) horoscopeTitle.textContent = sign.emoji + ' ' + sign.displayName + ' Burç Yorumu';
    loadHoroscope(signId);
}

// ==================== DATE HELPER ====================
function getTodayKey() {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

// ==================== HOROSCOPE ====================
async function loadHoroscope(signId) {
    if (horoscopeContent) {
        horoscopeContent.innerHTML = `
            <div class="loading">
                <div class="spinner"></div>
                <span class="loading-text">Yıldızlar okunuyor...</span>
            </div>
        `;
    }

    const dateKey = getTodayKey();
    const localCacheKey = `horoscope_${signId}_${dateKey}`;

    // 1. Check local cache
    const cached = localStorage.getItem(localCacheKey);
    if (cached) {
        try {
            displayHoroscope(JSON.parse(cached));
            return;
        } catch (e) {
            localStorage.removeItem(localCacheKey);
        }
    }

    // 2. Try Firebase user dailyCache (if logged in)
    if (currentUser) {
        try {
            const firebaseCacheId = `daily_${signId}_${dateKey}`;
            const cacheDoc = await db.collection('users')
                .doc(currentUser.uid)
                .collection('dailyCache')
                .doc(firebaseCacheId)
                .get();

            if (cacheDoc.exists) {
                const data = cacheDoc.data();
                if (data.horoscope) {
                    let horoscope = typeof data.horoscope === 'string'
                        ? JSON.parse(data.horoscope)
                        : data.horoscope;
                    localStorage.setItem(localCacheKey, JSON.stringify(horoscope));
                    displayHoroscope(horoscope);
                    return;
                }
            }
        } catch (err) {
            console.warn('[Astro Dozi] Firebase cache error:', err.message);
        }
    }

    // 3. Generate via Cloud Function
    if (!currentUser) {
        displaySignInPrompt();
        return;
    }

    try {
        console.log('[Astro Dozi] Calling Cloud Function generateHoroscope...');
        const result = await fnGenerateHoroscope({ signId: signId });
        const horoscope = result.data;
        console.log('[Astro Dozi] Cloud Function returned:', horoscope.motto, '(source:', horoscope.source, ')');

        // Cache locally
        localStorage.setItem(localCacheKey, JSON.stringify(horoscope));
        displayHoroscope(horoscope);

    } catch (err) {
        console.error('[Astro Dozi] Cloud Function error:', err.code, err.message);
        if (err.code === 'unauthenticated') {
            displaySignInPrompt();
        } else {
            displayFallbackHoroscope(signId);
        }
    }
}

function displayHoroscope(data) {
    if (!horoscopeContent) return;

    let html = '<div class="horoscope-text">';

    if (data.motto) {
        html += `<p style="font-size:1.1rem;font-weight:600;color:var(--cosmic-purple);margin-bottom:1rem;font-style:italic">"${data.motto}"</p>`;
    }

    if (data.commentary) {
        const paragraphs = data.commentary.split('\n').filter(p => p.trim());
        paragraphs.forEach(p => {
            html += `<p>${p}</p>`;
        });
    }

    // Score bars
    const scores = [];
    if (data.love > 0) scores.push({ label: 'Aşk', value: data.love, color: '#EC4899' });
    if (data.money > 0) scores.push({ label: 'Para', value: data.money, color: '#F59E0B' });
    if (data.health > 0) scores.push({ label: 'Sağlık', value: data.health, color: '#10B981' });
    if (data.career > 0) scores.push({ label: 'Kariyer', value: data.career, color: '#7C3AED' });

    if (scores.length > 0) {
        html += '<div style="margin-top:1.25rem;padding-top:1.25rem;border-top:1px solid #EDE9FE">';
        scores.forEach(s => {
            html += `
                <div style="display:flex;align-items:center;gap:0.75rem;margin-bottom:0.6rem">
                    <span style="font-size:0.8rem;font-weight:600;width:50px;color:var(--text-secondary)">${s.label}</span>
                    <div style="flex:1;height:8px;background:#EDE9FE;border-radius:4px;overflow:hidden">
                        <div class="score-bar-fill" style="width:${s.value}%;height:100%;background:${s.color};border-radius:4px"></div>
                    </div>
                    <span style="font-size:0.75rem;font-weight:600;color:var(--text-muted);width:30px;text-align:right">${s.value}</span>
                </div>
            `;
        });
        html += '</div>';
    }

    // Lucky info
    const extras = [];
    if (data.luckyNumber) extras.push('\u2B50 Şans Sayısı: ' + data.luckyNumber);
    if (data.luckyColor) extras.push('\uD83C\uDFA8 Şans Rengi: ' + data.luckyColor);

    if (extras.length > 0) {
        html += `<p style="margin-top:1rem;font-size:0.85rem;color:var(--text-muted)">${extras.join(' &nbsp;\u2022&nbsp; ')}</p>`;
    }

    html += '</div>';
    horoscopeContent.innerHTML = html;
}

function displayFallbackHoroscope(signId) {
    if (!horoscopeContent) return;
    const sign = SIGNS.find(s => s.id === signId);
    horoscopeContent.innerHTML = `
        <div class="horoscope-text" style="text-align:center;padding:1.5rem 0">
            <p style="font-size:2rem;margin-bottom:0.75rem">${sign.emoji}</p>
            <p style="font-weight:600;margin-bottom:0.75rem">Bugünün ${sign.displayName} burcu yorumu hazırlanıyor...</p>
            <p style="color:var(--text-muted);font-size:0.9rem;margin-bottom:1.25rem">
                Lütfen sayfayı yenileyin veya biraz sonra tekrar deneyin.
            </p>
            <div style="display:flex;gap:0.75rem;justify-content:center;flex-wrap:wrap">
                <button onclick="loadHoroscope('${signId}')"
                   style="display:inline-flex;align-items:center;gap:0.5rem;padding:0.6rem 1.25rem;
                          background:var(--cosmic-bg);color:var(--cosmic-purple);border:2px solid var(--cosmic-purple);
                          border-radius:50px;font-weight:600;font-size:0.9rem;cursor:pointer">
                    Tekrar Dene
                </button>
            </div>
        </div>
    `;
}

function displaySignInPrompt() {
    if (!horoscopeContent) return;
    horoscopeContent.innerHTML = `
        <div class="horoscope-text" style="text-align:center;padding:1.5rem 0">
            <p style="font-size:2rem;margin-bottom:0.75rem">&#10024;</p>
            <p style="font-weight:600;margin-bottom:0.75rem">Burç yorumunu görmek için giriş yap</p>
            <p style="color:var(--text-muted);font-size:0.9rem;margin-bottom:1.25rem">
                Google hesabınla giriş yaparak günlük burç yorumunu ücretsiz okuyabilirsin.
            </p>
            <button onclick="signInWithGoogle()"
               style="display:inline-flex;align-items:center;gap:0.5rem;padding:0.6rem 1.25rem;
                      background:var(--gradient-primary);color:white;
                      border-radius:50px;font-weight:600;font-size:0.9rem;cursor:pointer;border:none">
                Google ile Giriş Yap
            </button>
        </div>
    `;
}

// ==================== FEATURES ====================
let pendingFeature = null;
let pendingCost = 0;

const FEATURE_NAMES = {
    'tarot': 'Tarot Falı',
    'uyum': 'Burç Uyumu',
    'aura': 'Aura Okuma',
    'gecmis': 'Geçmiş Yaşam',
    'cakra': 'Çakra Analizi',
    'yasam': 'Yaşam Yolu'
};

function handleFeatureClick(feature, cost) {
    if (!currentUser) {
        showToast('Bu özelliği kullanmak için giriş yapmalısın.');
        showAuth();
        return;
    }

    pendingFeature = feature;
    pendingCost = cost;

    if (isPremium) {
        executeFeature(feature);
        return;
    }

    const modalCoinCost = document.getElementById('modalCoinCost');
    const modalBalance = document.getElementById('modalBalance');
    if (modalCoinCost) modalCoinCost.textContent = cost + ' Yıldız Tozu Harca';
    if (modalBalance) modalBalance.textContent = coins;

    const spendBtn = document.getElementById('modalSpendCoins');
    if (spendBtn) {
        spendBtn.style.opacity = coins < cost ? '0.5' : '1';
        spendBtn.style.pointerEvents = coins < cost ? 'none' : 'auto';
    }
    openModal(premiumModal);
}

function handleSpendCoins() {
    if (coins >= pendingCost) {
        coins -= pendingCost;
        updateUI();

        if (currentUser) {
            db.collection('users').doc(currentUser.uid).update({
                coinBalance: coins
            }).catch(err => console.error('Coin update error:', err));
        }

        closeModal(premiumModal);
        executeFeature(pendingFeature);
        showToast(pendingCost + ' Yıldız Tozu harcandı.');
    }
}

async function executeFeature(feature) {
    const featureName = FEATURE_NAMES[feature] || feature;

    if (horoscopeTitle) horoscopeTitle.textContent = featureName;
    if (horoscopeContent) {
        horoscopeContent.innerHTML = `
            <div class="loading">
                <div class="spinner"></div>
                <span class="loading-text">${featureName} hazırlanıyor...</span>
            </div>
        `;
    }
    if (horoscopeCard) horoscopeCard.scrollIntoView({ behavior: 'smooth', block: 'start' });

    // Check local cache
    const today = getTodayKey();
    const cacheKey = `feature_${feature}_${today}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
        try {
            displayFeatureResult(feature, JSON.parse(cached));
            return;
        } catch (e) {
            localStorage.removeItem(cacheKey);
        }
    }

    if (!currentUser) {
        displaySignInPrompt();
        return;
    }

    try {
        console.log('[Astro Dozi] Calling Cloud Function generateFeature:', feature);
        const result = await fnGenerateFeature({
            feature: feature,
            signId: selectedSign
        });
        const data = result.data;
        localStorage.setItem(cacheKey, JSON.stringify(data));
        displayFeatureResult(feature, data);

    } catch (err) {
        console.error('[Astro Dozi] Feature error:', err);
        displayFeatureFallback(feature);
    }
}

function displayFeatureResult(feature, data) {
    if (!horoscopeContent) return;
    let html = '<div class="horoscope-text">';

    switch (feature) {
        case 'tarot':
            if (data.cards) {
                const emojis = ['\uD83C\uDCCF', '\u2728', '\uD83C\uDF1F'];
                data.cards.forEach((card, i) => {
                    html += `<div style="background:var(--cosmic-bg);border-radius:16px;padding:1.25rem;margin-bottom:0.75rem">
                        <p style="font-weight:700;color:var(--cosmic-purple);margin-bottom:0.4rem">${emojis[i] || '\u2728'} ${card.name}</p>
                        <p style="font-size:0.9rem;color:var(--text-secondary)">${card.meaning}</p>
                    </div>`;
                });
            }
            if (data.summary) html += `<p style="margin-top:1rem;font-style:italic;color:var(--cosmic-purple)">${data.summary}</p>`;
            break;

        case 'uyum':
            if (data.title) html += `<p style="font-size:1.1rem;font-weight:700;color:var(--cosmic-purple);margin-bottom:1rem">${data.title}</p>`;
            if (data.compatibility) html += `<p>${data.compatibility}</p>`;
            if (data.bestMatch) html += `<p style="margin-top:1rem"><strong>En uyumlu burç:</strong> ${data.bestMatch}</p>`;
            if (data.score) html += `<p><strong>Uyum puanı:</strong> ${data.score}/100</p>`;
            break;

        case 'aura':
            if (data.color) {
                html += `<div style="text-align:center;padding:1.5rem 0">
                    <div style="width:120px;height:120px;border-radius:50%;margin:0 auto 1rem;
                        background:radial-gradient(circle, ${getAuraGradient(data.color)});
                        box-shadow:0 0 40px ${getAuraGlow(data.color)};animation:aura-pulse 2s ease-in-out infinite"></div>
                    <p style="font-size:1.25rem;font-weight:700;color:var(--cosmic-purple)">${data.color}</p>
                    ${data.secondaryColor ? `<p style="font-size:0.85rem;color:var(--text-muted)">İkincil: ${data.secondaryColor}</p>` : ''}
                </div>`;
            }
            if (data.meaning) html += `<p><strong>Anlamı:</strong> ${data.meaning}</p>`;
            if (data.energy) html += `<p><strong>Enerji:</strong> ${data.energy}</p>`;
            if (data.advice) html += `<p style="color:var(--cosmic-purple);font-style:italic;margin-top:1rem">${data.advice}</p>`;
            break;

        case 'gecmis':
            if (data.era) html += `<p style="font-size:0.85rem;color:var(--golden-star);font-weight:600;margin-bottom:0.5rem">${data.era}${data.role ? ' - ' + data.role : ''}</p>`;
            if (data.story) html += `<p>${data.story}</p>`;
            if (data.karmaLesson) html += `<p style="margin-top:1rem"><strong>Karmik Ders:</strong> ${data.karmaLesson}</p>`;
            if (data.connection) html += `<p><strong>Bağlantı:</strong> ${data.connection}</p>`;
            break;

        case 'cakra':
            if (data.chakras) {
                const colors = ['#EF4444', '#F97316', '#EAB308', '#22C55E', '#06B6D4', '#6366F1', '#A855F7'];
                data.chakras.forEach((c, i) => {
                    html += `<div style="display:flex;align-items:center;gap:0.75rem;margin-bottom:0.75rem">
                        <div style="width:12px;height:12px;border-radius:50%;background:${colors[i]||'#888'};flex-shrink:0"></div>
                        <div style="flex:1">
                            <div style="display:flex;justify-content:space-between;margin-bottom:0.25rem">
                                <span style="font-size:0.85rem;font-weight:600">${c.name}</span>
                                <span style="font-size:0.75rem;color:var(--text-muted)">${c.status}%</span>
                            </div>
                            <div style="height:6px;background:#EDE9FE;border-radius:3px;overflow:hidden">
                                <div class="score-bar-fill" style="width:${c.status}%;height:100%;background:${colors[i]||'#888'};border-radius:3px"></div>
                            </div>
                            ${c.note ? `<p style="font-size:0.75rem;color:var(--text-muted);margin-top:0.2rem">${c.note}</p>` : ''}
                        </div>
                    </div>`;
                });
            }
            if (data.overall) html += `<p style="margin-top:1rem"><strong>Genel:</strong> ${data.overall}</p>`;
            if (data.advice) html += `<p style="color:var(--cosmic-purple);font-style:italic">${data.advice}</p>`;
            break;

        case 'yasam':
            if (data.number) {
                html += `<div style="text-align:center;padding:1rem 0">
                    <div style="width:80px;height:80px;border-radius:50%;margin:0 auto 1rem;
                        background:var(--gradient-primary);display:flex;align-items:center;justify-content:center;
                        font-size:2rem;font-weight:800;color:white">${data.number}</div>
                    ${data.title ? `<p style="font-size:1.1rem;font-weight:700;color:var(--cosmic-purple)">${data.title}</p>` : ''}
                </div>`;
            }
            if (data.meaning) html += `<p>${data.meaning}</p>`;
            if (data.strengths) {
                html += `<p style="margin-top:1rem"><strong>Güçlü Yönler:</strong></p><ul style="padding-left:1.25rem;color:var(--text-secondary)">`;
                data.strengths.forEach(s => html += `<li style="margin-bottom:0.3rem">${s}</li>`);
                html += '</ul>';
            }
            if (data.challenges) {
                html += `<p style="margin-top:0.75rem"><strong>Zorluklar:</strong></p><ul style="padding-left:1.25rem;color:var(--text-secondary)">`;
                data.challenges.forEach(c => html += `<li style="margin-bottom:0.3rem">${c}</li>`);
                html += '</ul>';
            }
            if (data.advice) html += `<p style="color:var(--cosmic-purple);font-style:italic;margin-top:1rem">${data.advice}</p>`;
            break;

        default:
            html += `<p>${JSON.stringify(data, null, 2)}</p>`;
    }

    html += '</div>';
    horoscopeContent.innerHTML = html;
}

function displayFeatureFallback(feature) {
    if (!horoscopeContent) return;
    const featureName = FEATURE_NAMES[feature] || feature;
    horoscopeContent.innerHTML = `
        <div class="horoscope-text" style="text-align:center;padding:2rem 0">
            <p style="font-size:1.5rem;margin-bottom:1rem">\u2728</p>
            <p style="font-weight:600">${featureName} şimdi kullanılamıyor.</p>
            <p style="margin-top:0.75rem;color:var(--text-muted);font-size:0.9rem">Lütfen daha sonra tekrar deneyin.</p>
        </div>
    `;
}

function getAuraGradient(color) {
    const map = { 'mor':'124,58,237', 'mavi':'59,130,246', 'yeşil':'34,197,94', 'sarı':'234,179,8',
        'turuncu':'249,115,22', 'kırmızı':'239,68,68', 'pembe':'236,72,153', 'beyaz':'200,200,200', 'altın':'245,158,11' };
    const key = color.toLowerCase();
    for (const [k, v] of Object.entries(map)) {
        if (key.includes(k)) return `rgba(${v},0.3), rgba(${v},0.8)`;
    }
    return 'rgba(124,58,237,0.3), rgba(124,58,237,0.8)';
}

function getAuraGlow(color) {
    const map = { 'mavi':'59,130,246', 'yeşil':'34,197,94', 'sarı':'234,179,8', 'altın':'245,158,11',
        'kırmızı':'239,68,68', 'pembe':'236,72,153' };
    const key = color.toLowerCase();
    for (const [k, v] of Object.entries(map)) {
        if (key.includes(k)) return `rgba(${v},0.4)`;
    }
    return 'rgba(124,58,237,0.4)';
}

// ==================== COIN PURCHASE ====================
function handleCoinPurchase(packId) {
    showToast('Ödeme sistemi yakın zamanda aktif olacak!');
    closeModal(coinModal);
}

// ==================== MODALS ====================
function openModal(modal) {
    if (modal) { modal.classList.add('active'); document.body.style.overflow = 'hidden'; }
}
function closeModal(modal) {
    if (modal) { modal.classList.remove('active'); document.body.style.overflow = ''; }
}
function showCoinModal() { openModal(coinModal); }

// ==================== TOAST ====================
function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}
