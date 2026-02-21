// ========================================
// Astro Dozi - Web App Logic
// ========================================

const SIGNS = [
    { id: 'koc', name: 'Koc', emoji: '\u2648', displayName: 'Koc' },
    { id: 'boga', name: 'Boga', emoji: '\u2649', displayName: 'Boga' },
    { id: 'ikizler', name: 'Ikizler', emoji: '\u264A', displayName: 'Ikizler' },
    { id: 'yengec', name: 'Yengec', emoji: '\u264B', displayName: 'Yengec' },
    { id: 'aslan', name: 'Aslan', emoji: '\u264C', displayName: 'Aslan' },
    { id: 'basak', name: 'Basak', emoji: '\u264D', displayName: 'Basak' },
    { id: 'terazi', name: 'Terazi', emoji: '\u264E', displayName: 'Terazi' },
    { id: 'akrep', name: 'Akrep', emoji: '\u264F', displayName: 'Akrep' },
    { id: 'yay', name: 'Yay', emoji: '\u2650', displayName: 'Yay' },
    { id: 'oglak', name: 'Oglak', emoji: '\u2651', displayName: 'Oglak' },
    { id: 'kova', name: 'Kova', emoji: '\u2652', displayName: 'Kova' },
    { id: 'balik', name: 'Balik', emoji: '\u2653', displayName: 'Balik' }
];

// State
let currentUser = null;
let coins = 50;
let selectedSign = null;
let isPremium = false;

// DOM Elements
const authScreen = document.getElementById('authScreen');
const appContent = document.getElementById('appContent');
const signSelector = document.getElementById('signSelector');
const horoscopeCard = document.getElementById('horoscopeCard');
const horoscopeTitle = document.getElementById('horoscopeTitle');
const horoscopeContent = document.getElementById('horoscopeContent');
const coinCount = document.getElementById('coinCount');
const navUserBtn = document.getElementById('navUserBtn');
const premiumModal = document.getElementById('premiumModal');
const coinModal = document.getElementById('coinModal');
const toast = document.getElementById('toast');

// ==================== INIT ====================
document.addEventListener('DOMContentLoaded', () => {
    initSignSelector();
    initEventListeners();
    checkAuthState();
    checkUrlParams();
});

function initSignSelector() {
    signSelector.innerHTML = SIGNS.map(sign =>
        `<button class="sign-btn" data-sign="${sign.id}">
            <span>${sign.emoji}</span>
            <span>${sign.name}</span>
        </button>`
    ).join('');

    signSelector.querySelectorAll('.sign-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            selectSign(btn.dataset.sign);
        });
    });
}

function initEventListeners() {
    // Auth
    document.getElementById('googleSignInBtn').addEventListener('click', signInWithGoogle);
    document.getElementById('guestBtn').addEventListener('click', continueAsGuest);

    // Mobile menu
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            document.getElementById('navLinks').classList.toggle('active');
        });
    }

    // Nav user button
    navUserBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (currentUser) {
            signOut();
        } else {
            showAuth();
        }
    });

    // Features
    document.querySelectorAll('.app-feature-card').forEach(card => {
        card.addEventListener('click', () => {
            const feature = card.dataset.feature;
            const cost = parseInt(card.dataset.cost);
            handleFeatureClick(feature, cost);
        });
    });

    // Buy coins
    document.getElementById('buyCoinsBtn').addEventListener('click', showCoinModal);

    // Modals
    document.getElementById('modalClose').addEventListener('click', () => closeModal(premiumModal));
    document.getElementById('coinModalClose').addEventListener('click', () => closeModal(coinModal));
    document.getElementById('modalSpendCoins').addEventListener('click', handleSpendCoins);
    document.getElementById('modalBuyCoins').addEventListener('click', () => {
        closeModal(premiumModal);
        showCoinModal();
    });
    document.getElementById('modalGoPremium').addEventListener('click', () => {
        closeModal(premiumModal);
        showCoinModal();
    });

    // Coin packs (Paddle integration placeholder)
    document.querySelectorAll('.coin-pack').forEach(pack => {
        pack.addEventListener('click', () => {
            const packId = pack.dataset.pack;
            handleCoinPurchase(packId);
        });
    });

    // Close modals on overlay click
    [premiumModal, coinModal].forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal(modal);
        });
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
        if (user) {
            currentUser = user;
            await loadUserData();
            showApp();
        } else {
            // Check if guest mode
            const guestMode = localStorage.getItem('astro_dozi_guest');
            if (guestMode) {
                loadGuestData();
                showApp();
            } else {
                showAuth();
            }
        }
    });
}

async function signInWithGoogle() {
    try {
        const result = await auth.signInWithPopup(googleProvider);
        currentUser = result.user;
        await loadUserData();
        showApp();
        showToast('Hos geldin, ' + (currentUser.displayName || 'Kozmik yolcu') + '!');
    } catch (err) {
        console.error('Auth error:', err);
        if (err.code !== 'auth/popup-closed-by-user') {
            showToast('Giris yapilamadi. Tekrar dene.');
        }
    }
}

function continueAsGuest() {
    localStorage.setItem('astro_dozi_guest', 'true');
    loadGuestData();
    showApp();
    showToast('Misafir olarak devam ediyorsun.');
}

function signOut() {
    auth.signOut();
    currentUser = null;
    localStorage.removeItem('astro_dozi_guest');
    showAuth();
    showToast('Cikis yapildi.');
}

async function loadUserData() {
    if (!currentUser) return;
    try {
        const doc = await db.collection('users').doc(currentUser.uid).get();
        if (doc.exists) {
            const data = doc.data();
            coins = data.coinBalance || 50;
            isPremium = data.isPremium || false;
            if (data.selectedZodiac) {
                // Flutter app stores zodiac as enum name
                const signId = data.selectedZodiac.toLowerCase();
                if (SIGNS.find(s => s.id === signId)) {
                    selectedSign = signId;
                }
            }
        } else {
            coins = 50;
        }
    } catch (err) {
        console.error('Error loading user data:', err);
        coins = 50;
    }
    updateUI();
}

function loadGuestData() {
    const savedData = localStorage.getItem('astro_dozi_data');
    if (savedData) {
        const data = JSON.parse(savedData);
        coins = data.coins || 50;
        selectedSign = data.selectedSign || null;
    } else {
        coins = 50;
    }
    updateUI();
}

function saveGuestData() {
    if (!currentUser) {
        localStorage.setItem('astro_dozi_data', JSON.stringify({
            coins: coins,
            selectedSign: selectedSign
        }));
    }
}

// ==================== UI ====================
function showAuth() {
    authScreen.style.display = 'flex';
    appContent.style.display = 'none';
    navUserBtn.textContent = 'Giris Yap';
    navUserBtn.href = '#';
}

function showApp() {
    authScreen.style.display = 'none';
    appContent.style.display = 'block';
    updateUI();

    if (currentUser) {
        navUserBtn.textContent = 'Cikis Yap';
    } else {
        navUserBtn.textContent = 'Giris Yap';
    }

    if (selectedSign) {
        selectSign(selectedSign);
    }
}

function updateUI() {
    coinCount.textContent = coins;
    const modalBalance = document.getElementById('modalBalance');
    if (modalBalance) modalBalance.textContent = coins;
}

function selectSign(signId) {
    selectedSign = signId;
    const sign = SIGNS.find(s => s.id === signId);
    if (!sign) return;

    // Update selector
    signSelector.querySelectorAll('.sign-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.sign === signId);
    });

    // Scroll active button into view
    const activeBtn = signSelector.querySelector('.sign-btn.active');
    if (activeBtn) {
        activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }

    horoscopeTitle.textContent = sign.emoji + ' ' + sign.name + ' Burc Yorumu';
    loadHoroscope(signId);
    saveGuestData();
}

// ==================== HOROSCOPE ====================
async function loadHoroscope(signId) {
    horoscopeContent.innerHTML = `
        <div class="loading">
            <div class="spinner"></div>
            <span class="loading-text">Yildizlar okunuyor...</span>
        </div>
    `;

    const today = new Date();
    const dateKey = today.toISOString().split('T')[0];
    const cacheKey = `horoscope_${signId}_${dateKey}`;

    // Check local cache first
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
        try {
            displayHoroscope(JSON.parse(cached));
            return;
        } catch (e) {
            localStorage.removeItem(cacheKey);
        }
    }

    // Try loading from Firebase user cache (if logged in)
    if (currentUser) {
        try {
            const cacheId = `${signId}_${dateKey}`;
            const cacheDoc = await db.collection('users')
                .doc(currentUser.uid)
                .collection('dailyCache')
                .doc(cacheId)
                .get();

            if (cacheDoc.exists) {
                const data = cacheDoc.data();
                if (data.horoscope) {
                    const horoscope = JSON.parse(data.horoscope);
                    localStorage.setItem(cacheKey, JSON.stringify(horoscope));
                    displayHoroscope(horoscope);
                    return;
                }
            }
        } catch (err) {
            console.error('Firebase cache error:', err);
        }
    }

    // Try loading from shared daily_horoscopes collection
    try {
        const sign = SIGNS.find(s => s.id === signId);
        const snapshot = await db.collection('daily_horoscopes')
            .where('zodiacSign', '==', sign.displayName)
            .where('date', '==', dateKey)
            .limit(1)
            .get();

        if (!snapshot.empty) {
            const data = snapshot.docs[0].data();
            const horoscope = {
                motto: data.motto || '',
                commentary: data.commentary || '',
                love: data.love || 0,
                money: data.money || 0,
                health: data.health || 0,
                career: data.career || 0,
                luckyColor: data.luckyColor || '',
                luckyNumber: data.luckyNumber || 0
            };
            localStorage.setItem(cacheKey, JSON.stringify(horoscope));
            displayHoroscope(horoscope);
            return;
        }
    } catch (err) {
        console.error('Daily horoscopes fetch error:', err);
    }

    // Fallback - Gemini API call via server or show message
    await generateHoroscope(signId);
}

async function generateHoroscope(signId) {
    const sign = SIGNS.find(s => s.id === signId);
    const today = new Date();
    const dateKey = today.toISOString().split('T')[0];
    const months = ['Ocak', 'Subat', 'Mart', 'Nisan', 'Mayis', 'Haziran',
                    'Temmuz', 'Agustos', 'Eylul', 'Ekim', 'Kasim', 'Aralik'];
    const dateStr = `${today.getDate()} ${months[today.getMonth()]} ${today.getFullYear()}`;

    // Try Gemini API directly
    try {
        const apiKey = await getGeminiKey();
        if (!apiKey) {
            displayFallbackHoroscope(signId);
            return;
        }

        const prompt = `Sen Astro Dozi'nin yapay zeka astrologusun. Samimi, bilge ve biraz gizemli bir tonla konusuyorsun.

Burc: ${sign.displayName}, Bugunku tarih: ${dateStr}. Bugunun burc yorumunu yaz.

Yanitini su JSON formatinda ver (baska hicbir sey yazma):
{
  "motto": "Gunun mottosu (kisa, vurucu, 5-10 kelime)",
  "commentary": "Detayli yorum (2-3 paragraf, samimi ve bilge ton, 150-200 kelime)",
  "love": 0 ile 100 arasi sayi,
  "money": 0 ile 100 arasi sayi,
  "health": 0 ile 100 arasi sayi,
  "career": 0 ile 100 arasi sayi,
  "luckyColor": "Renk adi",
  "luckyNumber": 1 ile 99 arasi sayi
}`;

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: {
                        temperature: 0.9,
                        maxOutputTokens: 1024
                    }
                })
            }
        );

        if (!response.ok) throw new Error('Gemini API error: ' + response.status);

        const result = await response.json();
        const text = result.candidates?.[0]?.content?.parts?.[0]?.text || '';

        // Parse JSON from response
        const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/\{[\s\S]*\}/);
        const jsonStr = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : text;
        const horoscope = JSON.parse(jsonStr);

        // Cache it
        const cacheKey = `horoscope_${signId}_${dateKey}`;
        localStorage.setItem(cacheKey, JSON.stringify(horoscope));

        // Also save to Firestore daily_horoscopes for other users
        try {
            await db.collection('daily_horoscopes').add({
                zodiacSign: sign.displayName,
                date: dateKey,
                ...horoscope,
                generatedAt: firebase.firestore.FieldValue.serverTimestamp(),
                source: 'web'
            });
        } catch (e) {
            // Write may fail if not authenticated, that's ok
            console.log('Could not save to Firestore:', e.message);
        }

        displayHoroscope(horoscope);

    } catch (err) {
        console.error('Gemini error:', err);
        displayFallbackHoroscope(signId);
    }
}

async function getGeminiKey() {
    // Try to get from Firestore config (admin-set)
    try {
        const configDoc = await db.collection('app_config').doc('web').get();
        if (configDoc.exists) {
            return configDoc.data().geminiKey || null;
        }
    } catch (e) {
        // Config not accessible
    }

    // Fallback: check if set in localStorage (dev mode)
    return localStorage.getItem('gemini_api_key') || null;
}

function displayHoroscope(data) {
    let html = '<div class="horoscope-text">';

    if (data.motto) {
        html += `<p style="font-size:1.1rem;font-weight:600;color:var(--cosmic-purple);margin-bottom:1rem;font-style:italic">"${data.motto}"</p>`;
    }

    if (data.commentary) {
        // Split commentary into paragraphs
        const paragraphs = data.commentary.split('\n').filter(p => p.trim());
        paragraphs.forEach(p => {
            html += `<p>${p}</p>`;
        });
    }

    // Score bars
    const scores = [];
    if (data.love > 0) scores.push({ label: 'Ask', value: data.love, color: '#EC4899' });
    if (data.money > 0) scores.push({ label: 'Para', value: data.money, color: '#F59E0B' });
    if (data.health > 0) scores.push({ label: 'Saglik', value: data.health, color: '#10B981' });
    if (data.career > 0) scores.push({ label: 'Kariyer', value: data.career, color: '#7C3AED' });

    if (scores.length > 0) {
        html += '<div style="margin-top:1.25rem;padding-top:1.25rem;border-top:1px solid #EDE9FE">';
        scores.forEach(s => {
            html += `
                <div style="display:flex;align-items:center;gap:0.75rem;margin-bottom:0.6rem">
                    <span style="font-size:0.8rem;font-weight:600;width:50px;color:var(--text-secondary)">${s.label}</span>
                    <div style="flex:1;height:8px;background:#EDE9FE;border-radius:4px;overflow:hidden">
                        <div style="width:${s.value}%;height:100%;background:${s.color};border-radius:4px;transition:width 0.8s ease"></div>
                    </div>
                    <span style="font-size:0.75rem;font-weight:600;color:var(--text-muted);width:30px;text-align:right">${s.value}</span>
                </div>
            `;
        });
        html += '</div>';
    }

    // Lucky info
    const extras = [];
    if (data.luckyNumber) extras.push('\u2B50 Sans Sayisi: ' + data.luckyNumber);
    if (data.luckyColor) extras.push('\u{1F3A8} Sans Rengi: ' + data.luckyColor);

    if (extras.length > 0) {
        html += `<p style="margin-top:1rem;font-size:0.85rem;color:var(--text-muted)">${extras.join(' &nbsp;&bull;&nbsp; ')}</p>`;
    }

    html += '</div>';
    horoscopeContent.innerHTML = html;
}

function displayFallbackHoroscope(signId) {
    const sign = SIGNS.find(s => s.id === signId);
    horoscopeContent.innerHTML = `
        <div class="horoscope-text" style="text-align:center;padding:1.5rem 0">
            <p style="font-size:2rem;margin-bottom:0.75rem">${sign.emoji}</p>
            <p style="font-weight:600;margin-bottom:0.75rem">Bugunun ${sign.name} burcu yorumu hazirlanirken bir sorun olustu.</p>
            <p style="color:var(--text-muted);font-size:0.9rem;margin-bottom:1.25rem">
                Detayli ve kisisel yorumlar icin Android uygulamasini indir.
            </p>
            <div style="display:flex;gap:0.75rem;justify-content:center;flex-wrap:wrap">
                <button onclick="loadHoroscope('${signId}')"
                   style="display:inline-flex;align-items:center;gap:0.5rem;padding:0.6rem 1.25rem;
                          background:var(--cosmic-bg);color:var(--cosmic-purple);border:2px solid var(--cosmic-purple);
                          border-radius:50px;text-decoration:none;font-weight:600;font-size:0.9rem;cursor:pointer">
                    Tekrar Dene
                </button>
                <a href="https://play.google.com/store/apps/details?id=com.bardino.zodi"
                   target="_blank"
                   style="display:inline-flex;align-items:center;gap:0.5rem;padding:0.6rem 1.25rem;
                          background:var(--gradient-primary);color:white;
                          border-radius:50px;text-decoration:none;font-weight:600;font-size:0.9rem">
                    Google Play'den Indir
                </a>
            </div>
        </div>
    `;
}

// ==================== FEATURES ====================
let pendingFeature = null;
let pendingCost = 0;

const FEATURE_CONFIG = {
    'tarot': {
        name: 'Tarot Fali',
        prompt: `Sen Astro Dozi'nin tarot ustasisin. Kullaniciya 3 kartlik bir tarot fali ac.

Yanitini su JSON formatinda ver:
{
  "cards": [
    {"name": "Kart Adi", "meaning": "Bu kartın anlamı ve mesajı (2-3 cümle)"},
    {"name": "Kart Adi", "meaning": "Bu kartın anlamı ve mesajı (2-3 cümle)"},
    {"name": "Kart Adi", "meaning": "Bu kartın anlamı ve mesajı (2-3 cümle)"}
  ],
  "summary": "Genel tarot mesajı ve yorumu (1 paragraf, 50-80 kelime)"
}`
    },
    'uyum': {
        name: 'Burc Uyumu',
        needsSecondSign: true,
        prompt: null // will be generated dynamically
    },
    'aura': {
        name: 'Aura Okuma',
        prompt: `Sen Astro Dozi'nin enerji okuyucususun. Kullanicinin aura rengini ve enerji durumunu analiz et.

Yanitini su JSON formatinda ver:
{
  "color": "Ana aura rengi",
  "secondaryColor": "Ikincil aura rengi",
  "meaning": "Aura renginin anlami (2-3 cumle)",
  "energy": "Enerji durumu analizi (1 paragraf, 60-80 kelime)",
  "advice": "Enerji dengesi icin tavsiye (2-3 cumle)"
}`
    },
    'gecmis': {
        name: 'Gecmis Yasam',
        prompt: `Sen Astro Dozi'nin gecmis yasam okuyucususun. Kullanicinin gecmis yasam hikayesini anlat.

Yanitini su JSON formatinda ver:
{
  "era": "Donem (ornegin: Antik Misir, Ortacag Avrupasi, vb)",
  "role": "Gecmis yasamdaki rolu",
  "story": "Gecmis yasam hikayesi (2 paragraf, 100-150 kelime)",
  "karmaLesson": "Bu yasamda tasidigi karmik ders (2-3 cumle)",
  "connection": "Simdiki yasamla baglantisi (2-3 cumle)"
}`
    },
    'cakra': {
        name: 'Cakra Analizi',
        prompt: `Sen Astro Dozi'nin cakra uzmanısin. 7 cakranin durumunu analiz et.

Yanitini su JSON formatinda ver:
{
  "chakras": [
    {"name": "Kok Cakra", "status": 0-100, "note": "Kisa durum notu"},
    {"name": "Sakral Cakra", "status": 0-100, "note": "Kisa durum notu"},
    {"name": "Solar Pleksus", "status": 0-100, "note": "Kisa durum notu"},
    {"name": "Kalp Cakra", "status": 0-100, "note": "Kisa durum notu"},
    {"name": "Bogaz Cakra", "status": 0-100, "note": "Kisa durum notu"},
    {"name": "Ucuncu Goz", "status": 0-100, "note": "Kisa durum notu"},
    {"name": "Tac Cakra", "status": 0-100, "note": "Kisa durum notu"}
  ],
  "overall": "Genel enerji durumu (2-3 cumle)",
  "advice": "Denge icin tavsiye (2-3 cumle)"
}`
    },
    'yasam': {
        name: 'Yasam Yolu',
        prompt: `Sen Astro Dozi'nin numeroloji uzmanısin. Kullanicinin yasam yolu sayisini ve anlamini analiz et.

Yanitini su JSON formatinda ver:
{
  "number": 1-9 arasi yasam yolu sayisi,
  "title": "Yasam yolu basligı",
  "meaning": "Yasam yolu sayisinin anlami (1 paragraf, 60-80 kelime)",
  "strengths": ["Guclu yonler (3 madde)"],
  "challenges": ["Zorluklar (3 madde)"],
  "advice": "Yasam yolu tavsiyes (2-3 cumle)"
}`
    }
};

function handleFeatureClick(feature, cost) {
    pendingFeature = feature;
    pendingCost = cost;

    if (isPremium) {
        executeFeature(feature);
        return;
    }

    document.getElementById('modalCoinCost').textContent = cost + ' Yildiz Tozu Harca';
    document.getElementById('modalBalance').textContent = coins;

    const spendBtn = document.getElementById('modalSpendCoins');
    if (coins < cost) {
        spendBtn.style.opacity = '0.5';
        spendBtn.style.pointerEvents = 'none';
    } else {
        spendBtn.style.opacity = '1';
        spendBtn.style.pointerEvents = 'auto';
    }
    openModal(premiumModal);
}

function handleSpendCoins() {
    if (coins >= pendingCost) {
        coins -= pendingCost;
        updateUI();
        saveGuestData();

        if (currentUser) {
            db.collection('users').doc(currentUser.uid).update({
                coinBalance: coins
            }).catch(err => console.error('Coin update error:', err));
        }

        closeModal(premiumModal);
        executeFeature(pendingFeature);
        showToast(pendingCost + ' Yildiz Tozu harcandi.');
    }
}

async function executeFeature(feature) {
    const config = FEATURE_CONFIG[feature];
    if (!config) return;

    // Show loading
    horoscopeTitle.textContent = config.name;
    horoscopeContent.innerHTML = `
        <div class="loading">
            <div class="spinner"></div>
            <span class="loading-text">${config.name} hazirlaniyor...</span>
        </div>
    `;
    horoscopeCard.scrollIntoView({ behavior: 'smooth', block: 'start' });

    // Check cache
    const today = new Date().toISOString().split('T')[0];
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

    try {
        const apiKey = await getGeminiKey();
        if (!apiKey) {
            displayFeatureFallback(feature);
            return;
        }

        const signInfo = selectedSign ? SIGNS.find(s => s.id === selectedSign) : null;
        const signContext = signInfo ? `\nKullanicinin burcu: ${signInfo.displayName}` : '';

        const prompt = config.prompt + signContext;

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: {
                        temperature: 0.9,
                        maxOutputTokens: 1024
                    }
                })
            }
        );

        if (!response.ok) throw new Error('API error: ' + response.status);

        const result = await response.json();
        const text = result.candidates?.[0]?.content?.parts?.[0]?.text || '';
        const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/\{[\s\S]*\}/);
        const jsonStr = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : text;
        const data = JSON.parse(jsonStr);

        localStorage.setItem(cacheKey, JSON.stringify(data));
        displayFeatureResult(feature, data);

    } catch (err) {
        console.error('Feature error:', err);
        displayFeatureFallback(feature);
    }
}

function displayFeatureResult(feature, data) {
    let html = '<div class="horoscope-text">';

    switch (feature) {
        case 'tarot':
            if (data.cards) {
                const tarotEmojis = ['\u{1F0CF}', '\u2728', '\u{1F31F}'];
                data.cards.forEach((card, i) => {
                    html += `
                        <div style="background:var(--cosmic-bg);border-radius:16px;padding:1.25rem;margin-bottom:0.75rem">
                            <p style="font-weight:700;color:var(--cosmic-purple);margin-bottom:0.4rem">
                                ${tarotEmojis[i] || '\u2728'} ${card.name}
                            </p>
                            <p style="font-size:0.9rem;color:var(--text-secondary)">${card.meaning}</p>
                        </div>
                    `;
                });
            }
            if (data.summary) {
                html += `<p style="margin-top:1rem;font-style:italic;color:var(--cosmic-purple)">${data.summary}</p>`;
            }
            break;

        case 'aura':
            if (data.color) {
                html += `
                    <div style="text-align:center;padding:1.5rem 0">
                        <div style="width:120px;height:120px;border-radius:50%;margin:0 auto 1rem;
                                    background:radial-gradient(circle, ${getAuraGradient(data.color)});
                                    box-shadow:0 0 40px ${getAuraGlow(data.color)}"></div>
                        <p style="font-size:1.25rem;font-weight:700;color:var(--cosmic-purple)">${data.color}</p>
                        ${data.secondaryColor ? `<p style="font-size:0.85rem;color:var(--text-muted)">Ikincil: ${data.secondaryColor}</p>` : ''}
                    </div>
                `;
            }
            if (data.meaning) html += `<p><strong>Anlami:</strong> ${data.meaning}</p>`;
            if (data.energy) html += `<p><strong>Enerji:</strong> ${data.energy}</p>`;
            if (data.advice) html += `<p style="color:var(--cosmic-purple);font-style:italic;margin-top:1rem">${data.advice}</p>`;
            break;

        case 'gecmis':
            if (data.era) html += `<p style="font-size:0.85rem;color:var(--golden-star);font-weight:600;margin-bottom:0.5rem">${data.era} ${data.role ? '- ' + data.role : ''}</p>`;
            if (data.story) html += `<p>${data.story}</p>`;
            if (data.karmaLesson) html += `<p style="margin-top:1rem"><strong>Karmik Ders:</strong> ${data.karmaLesson}</p>`;
            if (data.connection) html += `<p><strong>Simdiki Yasam Baglantisi:</strong> ${data.connection}</p>`;
            break;

        case 'cakra':
            if (data.chakras) {
                const chakraColors = ['#EF4444', '#F97316', '#EAB308', '#22C55E', '#06B6D4', '#6366F1', '#A855F7'];
                data.chakras.forEach((chakra, i) => {
                    html += `
                        <div style="display:flex;align-items:center;gap:0.75rem;margin-bottom:0.75rem">
                            <div style="width:12px;height:12px;border-radius:50%;background:${chakraColors[i] || '#888'};flex-shrink:0"></div>
                            <div style="flex:1">
                                <div style="display:flex;justify-content:space-between;margin-bottom:0.25rem">
                                    <span style="font-size:0.85rem;font-weight:600">${chakra.name}</span>
                                    <span style="font-size:0.75rem;color:var(--text-muted)">${chakra.status}%</span>
                                </div>
                                <div style="height:6px;background:#EDE9FE;border-radius:3px;overflow:hidden">
                                    <div style="width:${chakra.status}%;height:100%;background:${chakraColors[i] || '#888'};border-radius:3px"></div>
                                </div>
                                ${chakra.note ? `<p style="font-size:0.75rem;color:var(--text-muted);margin-top:0.2rem">${chakra.note}</p>` : ''}
                            </div>
                        </div>
                    `;
                });
            }
            if (data.overall) html += `<p style="margin-top:1rem"><strong>Genel:</strong> ${data.overall}</p>`;
            if (data.advice) html += `<p style="color:var(--cosmic-purple);font-style:italic">${data.advice}</p>`;
            break;

        case 'yasam':
            if (data.number) {
                html += `
                    <div style="text-align:center;padding:1rem 0">
                        <div style="width:80px;height:80px;border-radius:50%;margin:0 auto 1rem;
                                    background:var(--gradient-primary);display:flex;align-items:center;justify-content:center;
                                    font-size:2rem;font-weight:800;color:white">${data.number}</div>
                        ${data.title ? `<p style="font-size:1.1rem;font-weight:700;color:var(--cosmic-purple)">${data.title}</p>` : ''}
                    </div>
                `;
            }
            if (data.meaning) html += `<p>${data.meaning}</p>`;
            if (data.strengths) {
                html += `<p style="margin-top:1rem"><strong>Guclu Yonler:</strong></p><ul style="padding-left:1.25rem;color:var(--text-secondary)">`;
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
    const config = FEATURE_CONFIG[feature];
    horoscopeContent.innerHTML = `
        <div class="horoscope-text" style="text-align:center;padding:2rem 0">
            <p style="font-size:1.5rem;margin-bottom:1rem">\u2728</p>
            <p style="font-weight:600">${config.name} simdi kullanilamiyor.</p>
            <p style="margin-top:0.75rem;color:var(--text-muted);font-size:0.9rem">
                Tam deneyim icin Android uygulamasini indir.
            </p>
            <a href="https://play.google.com/store/apps/details?id=com.bardino.zodi"
               target="_blank"
               style="display:inline-flex;align-items:center;gap:0.5rem;margin-top:1.25rem;
                      padding:0.6rem 1.25rem;background:var(--gradient-primary);color:white;
                      border-radius:50px;text-decoration:none;font-weight:600;font-size:0.9rem">
                Uygulamada Dene
            </a>
        </div>
    `;
}

// Helper for aura colors
function getAuraGradient(color) {
    const colorMap = {
        'mor': 'rgba(124,58,237,0.3), rgba(124,58,237,0.8)',
        'mavi': 'rgba(59,130,246,0.3), rgba(59,130,246,0.8)',
        'yesil': 'rgba(34,197,94,0.3), rgba(34,197,94,0.8)',
        'sari': 'rgba(234,179,8,0.3), rgba(234,179,8,0.8)',
        'turuncu': 'rgba(249,115,22,0.3), rgba(249,115,22,0.8)',
        'kirmizi': 'rgba(239,68,68,0.3), rgba(239,68,68,0.8)',
        'pembe': 'rgba(236,72,153,0.3), rgba(236,72,153,0.8)',
        'beyaz': 'rgba(255,255,255,0.3), rgba(200,200,200,0.8)',
        'altin': 'rgba(245,158,11,0.3), rgba(245,158,11,0.8)',
    };
    const key = color.toLowerCase().trim();
    for (const [k, v] of Object.entries(colorMap)) {
        if (key.includes(k)) return v;
    }
    return 'rgba(124,58,237,0.3), rgba(124,58,237,0.8)';
}

function getAuraGlow(color) {
    const key = color.toLowerCase().trim();
    if (key.includes('mavi')) return 'rgba(59,130,246,0.4)';
    if (key.includes('yesil')) return 'rgba(34,197,94,0.4)';
    if (key.includes('sari') || key.includes('altin')) return 'rgba(234,179,8,0.4)';
    if (key.includes('kirmizi')) return 'rgba(239,68,68,0.4)';
    if (key.includes('pembe')) return 'rgba(236,72,153,0.4)';
    return 'rgba(124,58,237,0.4)';
}

// ==================== COIN PURCHASE ====================
function handleCoinPurchase(packId) {
    showToast('Odeme sistemi yakin zamanda aktif olacak. Android uygulamasini dene!');
    closeModal(coinModal);
}

// ==================== MODALS ====================
function openModal(modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

function showCoinModal() {
    openModal(coinModal);
}

// ==================== TOAST ====================
function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}
