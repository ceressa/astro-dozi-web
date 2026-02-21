// ========================================
// Astro Dozi - Web App Logic
// ========================================

// Sign data: id matches Flutter ZodiacSign enum names (English)
// displayName is Turkish for UI
const SIGNS = [
    { id: 'aries', name: 'Koc', emoji: '\u2648', displayName: 'Koc' },
    { id: 'taurus', name: 'Boga', emoji: '\u2649', displayName: 'Boga' },
    { id: 'gemini', name: 'Ikizler', emoji: '\u264A', displayName: 'Ikizler' },
    { id: 'cancer', name: 'Yengec', emoji: '\u264B', displayName: 'Yengec' },
    { id: 'leo', name: 'Aslan', emoji: '\u264C', displayName: 'Aslan' },
    { id: 'virgo', name: 'Basak', emoji: '\u264D', displayName: 'Basak' },
    { id: 'libra', name: 'Terazi', emoji: '\u264E', displayName: 'Terazi' },
    { id: 'scorpio', name: 'Akrep', emoji: '\u264F', displayName: 'Akrep' },
    { id: 'sagittarius', name: 'Yay', emoji: '\u2650', displayName: 'Yay' },
    { id: 'capricorn', name: 'Oglak', emoji: '\u2651', displayName: 'Oglak' },
    { id: 'aquarius', name: 'Kova', emoji: '\u2652', displayName: 'Kova' },
    { id: 'pisces', name: 'Balik', emoji: '\u2653', displayName: 'Balik' }
];

// State
let currentUser = null;
let coins = 50;
let selectedSign = null;
let isPremium = false;
let geminiApiKey = null;

// DOM refs - set after DOMContentLoaded
let authScreen, appContent, signSelector, horoscopeCard, horoscopeTitle, horoscopeContent;
let coinCount, navUserBtn, premiumModal, coinModal, toast;

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

    console.log('[Astro Dozi] DOM refs bound:', {
        authScreen: !!authScreen,
        appContent: !!appContent,
        signSelector: !!signSelector,
        horoscopeCard: !!horoscopeCard,
        horoscopeContent: !!horoscopeContent
    });

    initSignSelector();
    initEventListeners();
    preloadGeminiKey();
    checkAuthState();
    checkUrlParams();
});

async function preloadGeminiKey() {
    try {
        console.log('[Astro Dozi] Fetching Gemini key from Firestore...');
        const configDoc = await db.collection('app_config').doc('web').get();
        if (configDoc.exists) {
            geminiApiKey = configDoc.data().geminiKey || null;
            console.log('[Astro Dozi] Gemini key loaded:', geminiApiKey ? 'YES (length: ' + geminiApiKey.length + ')' : 'NO');
        } else {
            console.warn('[Astro Dozi] app_config/web document not found!');
        }
    } catch (e) {
        console.error('[Astro Dozi] Failed to load Gemini key:', e.code, e.message);
    }
}

function initSignSelector() {
    if (!signSelector) return;
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
    const googleBtn = document.getElementById('googleSignInBtn');
    const guestBtn = document.getElementById('guestBtn');
    if (googleBtn) googleBtn.addEventListener('click', signInWithGoogle);
    if (guestBtn) guestBtn.addEventListener('click', continueAsGuest);

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
    console.log('[Astro Dozi] Checking auth state...');
    auth.onAuthStateChanged(async (user) => {
        console.log('[Astro Dozi] Auth state changed:', user ? user.email : 'null');
        if (user) {
            currentUser = user;
            await loadUserData();
            showApp();
        } else {
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
    console.log('[Astro Dozi] Google sign-in started...');
    try {
        const result = await auth.signInWithPopup(googleProvider);
        currentUser = result.user;
        console.log('[Astro Dozi] Signed in as:', currentUser.email, 'UID:', currentUser.uid);
        // loadUserData and showApp are handled by onAuthStateChanged
    } catch (err) {
        console.error('[Astro Dozi] Auth error:', err.code, err.message);
        if (err.code !== 'auth/popup-closed-by-user') {
            showToast('Giris yapilamadi: ' + err.message);
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
    localStorage.removeItem('astro_dozi_data');
    showAuth();
    showToast('Cikis yapildi.');
}

async function loadUserData() {
    if (!currentUser) return;
    console.log('[Astro Dozi] Loading user data for UID:', currentUser.uid);
    try {
        const doc = await db.collection('users').doc(currentUser.uid).get();
        console.log('[Astro Dozi] User doc exists:', doc.exists);
        if (doc.exists) {
            const data = doc.data();
            console.log('[Astro Dozi] User data keys:', Object.keys(data));
            console.log('[Astro Dozi] zodiacSign field:', data.zodiacSign);
            console.log('[Astro Dozi] coinBalance:', data.coinBalance);
            console.log('[Astro Dozi] isPremium:', data.isPremium);

            coins = data.coinBalance != null ? data.coinBalance : 50;
            isPremium = data.isPremium || false;

            // Flutter stores zodiac as enum name: "aries", "taurus", "gemini", etc.
            // Field name is "zodiacSign" (not "selectedZodiac")
            if (data.zodiacSign) {
                const zodiacStr = data.zodiacSign.toLowerCase();
                const matchedSign = SIGNS.find(s => s.id === zodiacStr);
                if (matchedSign) {
                    selectedSign = matchedSign.id;
                    console.log('[Astro Dozi] User zodiac matched:', selectedSign, '->', matchedSign.name);
                } else {
                    console.warn('[Astro Dozi] Unknown zodiac value:', data.zodiacSign);
                }
            } else {
                console.log('[Astro Dozi] No zodiacSign in user data');
            }
        } else {
            console.log('[Astro Dozi] User document does not exist, using defaults');
            coins = 50;
        }
    } catch (err) {
        console.error('[Astro Dozi] Error loading user data:', err.code, err.message);
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
    console.log('[Astro Dozi] Showing auth screen');
    if (authScreen) authScreen.style.display = 'flex';
    if (appContent) appContent.style.display = 'none';
    if (navUserBtn) {
        navUserBtn.textContent = 'Giris Yap';
        navUserBtn.href = '#';
    }
}

function showApp() {
    console.log('[Astro Dozi] Showing app, selectedSign:', selectedSign);
    if (authScreen) authScreen.style.display = 'none';
    if (appContent) appContent.style.display = 'block';
    updateUI();

    if (navUserBtn) {
        navUserBtn.textContent = currentUser ? 'Cikis Yap' : 'Giris Yap';
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
    if (!sign) {
        console.warn('[Astro Dozi] selectSign: unknown signId:', signId);
        return;
    }

    console.log('[Astro Dozi] Selected sign:', signId, '->', sign.name);

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

    if (horoscopeTitle) horoscopeTitle.textContent = sign.emoji + ' ' + sign.name + ' Burc Yorumu';
    loadHoroscope(signId);
    saveGuestData();
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
    console.log('[Astro Dozi] === loadHoroscope START for:', signId, '===');

    if (horoscopeContent) {
        horoscopeContent.innerHTML = `
            <div class="loading">
                <div class="spinner"></div>
                <span class="loading-text">Yildizlar okunuyor...</span>
            </div>
        `;
    }

    const dateKey = getTodayKey();
    const localCacheKey = `horoscope_${signId}_${dateKey}`;

    // 1. Check local cache (localStorage)
    const cached = localStorage.getItem(localCacheKey);
    if (cached) {
        try {
            console.log('[Astro Dozi] [1] Found in local cache');
            displayHoroscope(JSON.parse(cached));
            return;
        } catch (e) {
            console.warn('[Astro Dozi] [1] Local cache parse failed, clearing');
            localStorage.removeItem(localCacheKey);
        }
    } else {
        console.log('[Astro Dozi] [1] No local cache');
    }

    // 2. Try Firebase user dailyCache (if logged in)
    // Flutter format: doc ID = "daily_{sign.name}_{YYYY-MM-DD}"
    // Data: { horoscope: "JSON string", zodiac: "aries", date: "2026-02-21", createdAt: ... }
    if (currentUser) {
        try {
            const firebaseCacheId = `daily_${signId}_${dateKey}`;
            console.log('[Astro Dozi] [2] Checking Firebase user cache:', `users/${currentUser.uid}/dailyCache/${firebaseCacheId}`);
            const cacheDoc = await db.collection('users')
                .doc(currentUser.uid)
                .collection('dailyCache')
                .doc(firebaseCacheId)
                .get();

            if (cacheDoc.exists) {
                const data = cacheDoc.data();
                console.log('[Astro Dozi] [2] Firebase cache found, keys:', Object.keys(data));

                // Flutter stores horoscope as a JSON string in the "horoscope" field
                if (data.horoscope) {
                    try {
                        let horoscope;
                        if (typeof data.horoscope === 'string') {
                            horoscope = JSON.parse(data.horoscope);
                        } else {
                            horoscope = data.horoscope;
                        }
                        console.log('[Astro Dozi] [2] Parsed horoscope from Firebase cache:', horoscope.motto);
                        localStorage.setItem(localCacheKey, JSON.stringify(horoscope));
                        displayHoroscope(horoscope);
                        return;
                    } catch (e) {
                        console.error('[Astro Dozi] [2] Failed to parse Firebase cached horoscope:', e.message);
                    }
                } else {
                    console.log('[Astro Dozi] [2] Firebase cache doc exists but no horoscope field');
                }
            } else {
                console.log('[Astro Dozi] [2] No Firebase user cache for:', firebaseCacheId);
            }
        } catch (err) {
            console.error('[Astro Dozi] [2] Firebase user cache error:', err.code, err.message);
        }
    } else {
        console.log('[Astro Dozi] [2] Skipped (no user)');
    }

    // 3. Try shared daily_horoscopes collection (written by web app)
    try {
        const sign = SIGNS.find(s => s.id === signId);
        console.log('[Astro Dozi] [3] Checking daily_horoscopes for sign:', sign.displayName, 'date:', dateKey);
        const snapshot = await db.collection('daily_horoscopes')
            .where('zodiacSign', '==', sign.displayName)
            .where('date', '==', dateKey)
            .limit(1)
            .get();

        console.log('[Astro Dozi] [3] daily_horoscopes results:', snapshot.size);
        if (!snapshot.empty) {
            const data = snapshot.docs[0].data();
            console.log('[Astro Dozi] [3] Found in daily_horoscopes:', data.motto);
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
            localStorage.setItem(localCacheKey, JSON.stringify(horoscope));
            displayHoroscope(horoscope);
            return;
        }
    } catch (err) {
        console.error('[Astro Dozi] [3] daily_horoscopes query error:', err.code, err.message);
        // This might fail if composite index is needed - that's okay, fall through to Gemini
    }

    // 4. Generate via Gemini AI
    console.log('[Astro Dozi] [4] No cache found anywhere, generating via Gemini...');
    await generateHoroscope(signId);
}

async function generateHoroscope(signId) {
    const sign = SIGNS.find(s => s.id === signId);
    const dateKey = getTodayKey();
    const today = new Date();
    const months = ['Ocak', 'Subat', 'Mart', 'Nisan', 'Mayis', 'Haziran',
                    'Temmuz', 'Agustos', 'Eylul', 'Ekim', 'Kasim', 'Aralik'];
    const dateStr = `${today.getDate()} ${months[today.getMonth()]} ${today.getFullYear()}`;

    try {
        const apiKey = await getGeminiKey();
        console.log('[Astro Dozi] [4] Gemini key available:', apiKey ? 'YES' : 'NO');

        if (!apiKey) {
            console.error('[Astro Dozi] [4] No Gemini key! Cannot generate horoscope.');
            displayFallbackHoroscope(signId);
            return;
        }

        const prompt = `Sen Astro Dozi'nin yapay zeka astrologusun. Samimi, bilge ve biraz gizemli bir tonla konusuyorsun. Turkce yaz.

Burc: ${sign.displayName}, Bugunku tarih: ${dateStr}. Bugunun burc yorumunu yaz.

Yanitini SADECE asagidaki JSON formatinda ver, baska hicbir sey yazma:
{"motto":"Gunun mottosu","commentary":"Detayli yorum 2-3 paragraf 150-200 kelime","love":75,"money":60,"health":80,"career":70,"luckyColor":"Renk","luckyNumber":7}`;

        console.log('[Astro Dozi] [4] Calling Gemini API for:', sign.displayName);
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

        console.log('[Astro Dozi] [4] Gemini response status:', response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('[Astro Dozi] [4] Gemini API error body:', errorText);
            throw new Error('Gemini API error: ' + response.status);
        }

        const result = await response.json();
        const text = result.candidates?.[0]?.content?.parts?.[0]?.text || '';
        console.log('[Astro Dozi] [4] Gemini raw text (first 300 chars):', text.substring(0, 300));

        // Parse JSON from response (handle markdown code blocks)
        let jsonStr = text;
        const jsonCodeBlock = text.match(/```json\s*([\s\S]*?)\s*```/);
        if (jsonCodeBlock) {
            jsonStr = jsonCodeBlock[1];
        } else {
            const jsonObj = text.match(/\{[\s\S]*\}/);
            if (jsonObj) jsonStr = jsonObj[0];
        }

        const horoscope = JSON.parse(jsonStr);
        console.log('[Astro Dozi] [4] Parsed horoscope OK, motto:', horoscope.motto);

        // Cache locally
        const localCacheKey = `horoscope_${signId}_${dateKey}`;
        localStorage.setItem(localCacheKey, JSON.stringify(horoscope));

        // Save to shared daily_horoscopes collection for other users
        try {
            await db.collection('daily_horoscopes').add({
                zodiacSign: sign.displayName,
                date: dateKey,
                ...horoscope,
                generatedAt: firebase.firestore.FieldValue.serverTimestamp(),
                source: 'web'
            });
            console.log('[Astro Dozi] [4] Saved to daily_horoscopes collection');
        } catch (e) {
            console.warn('[Astro Dozi] [4] Could not save to daily_horoscopes:', e.message);
        }

        // Also save to user's dailyCache if logged in
        if (currentUser) {
            try {
                const firebaseCacheId = `daily_${signId}_${dateKey}`;
                await db.collection('users')
                    .doc(currentUser.uid)
                    .collection('dailyCache')
                    .doc(firebaseCacheId)
                    .set({
                        horoscope: JSON.stringify(horoscope),
                        zodiac: signId,
                        date: dateKey,
                        createdAt: firebase.firestore.FieldValue.serverTimestamp()
                    });
                console.log('[Astro Dozi] [4] Saved to user dailyCache');
            } catch (e) {
                console.warn('[Astro Dozi] [4] Could not save to user cache:', e.message);
            }
        }

        displayHoroscope(horoscope);

    } catch (err) {
        console.error('[Astro Dozi] [4] Gemini generation error:', err);
        displayFallbackHoroscope(signId);
    }
}

async function getGeminiKey() {
    // Return cached key if available
    if (geminiApiKey) return geminiApiKey;

    // Try Firestore
    try {
        console.log('[Astro Dozi] getGeminiKey: fetching from Firestore...');
        const configDoc = await db.collection('app_config').doc('web').get();
        if (configDoc.exists) {
            geminiApiKey = configDoc.data().geminiKey || null;
            console.log('[Astro Dozi] getGeminiKey: got key:', geminiApiKey ? 'YES' : 'NO');
            return geminiApiKey;
        } else {
            console.warn('[Astro Dozi] getGeminiKey: app_config/web doc not found');
        }
    } catch (e) {
        console.error('[Astro Dozi] getGeminiKey error:', e.code, e.message);
    }

    return null;
}

function displayHoroscope(data) {
    if (!horoscopeContent) {
        console.error('[Astro Dozi] displayHoroscope: horoscopeContent is null!');
        return;
    }

    console.log('[Astro Dozi] displayHoroscope called with:', data.motto);

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
    if (data.luckyColor) extras.push('\uD83C\uDFA8 Sans Rengi: ' + data.luckyColor);

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
            <p style="font-weight:600;margin-bottom:0.75rem">Bugunun ${sign.name} burcu yorumu hazirlaniyor...</p>
            <p style="color:var(--text-muted);font-size:0.9rem;margin-bottom:1.25rem">
                Lutfen sayfayi yenileyin veya biraz sonra tekrar deneyin.
            </p>
            <div style="display:flex;gap:0.75rem;justify-content:center;flex-wrap:wrap">
                <button onclick="loadHoroscope('${signId}')"
                   style="display:inline-flex;align-items:center;gap:0.5rem;padding:0.6rem 1.25rem;
                          background:var(--cosmic-bg);color:var(--cosmic-purple);border:2px solid var(--cosmic-purple);
                          border-radius:50px;font-weight:600;font-size:0.9rem;cursor:pointer">
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
        prompt: `Sen Astro Dozi'nin tarot ustasisin. Turkce yaz. Kullaniciya 3 kartlik bir tarot fali ac. Yanitini SADECE JSON formatinda ver:
{"cards":[{"name":"Kart","meaning":"Anlami"},{"name":"Kart","meaning":"Anlami"},{"name":"Kart","meaning":"Anlami"}],"summary":"Genel mesaj"}`
    },
    'uyum': {
        name: 'Burc Uyumu',
        prompt: `Sen Astro Dozi'nin burc uyumu uzmanisin. Turkce yaz. Secili burcun genel uyum analizini yap. Yanitini SADECE JSON formatinda ver:
{"title":"Uyum Baslik","compatibility":"Genel uyum analizi 2-3 paragraf","bestMatch":"En uyumlu burc","score":85}`
    },
    'aura': {
        name: 'Aura Okuma',
        prompt: `Sen Astro Dozi'nin enerji okuyucususun. Turkce yaz. Aura rengini analiz et. Yanitini SADECE JSON formatinda ver:
{"color":"Ana renk","secondaryColor":"Ikincil renk","meaning":"Anlami","energy":"Enerji durumu","advice":"Tavsiye"}`
    },
    'gecmis': {
        name: 'Gecmis Yasam',
        prompt: `Sen Astro Dozi'nin gecmis yasam okuyucususun. Turkce yaz. Gecmis yasam hikayesi anlat. Yanitini SADECE JSON formatinda ver:
{"era":"Donem","role":"Rol","story":"Hikaye 2 paragraf","karmaLesson":"Karmik ders","connection":"Simdiki yasam baglantisi"}`
    },
    'cakra': {
        name: 'Cakra Analizi',
        prompt: `Sen Astro Dozi'nin cakra uzmanisin. Turkce yaz. 7 cakrayi analiz et. Yanitini SADECE JSON formatinda ver:
{"chakras":[{"name":"Kok Cakra","status":75,"note":"Not"},{"name":"Sakral Cakra","status":60,"note":"Not"},{"name":"Solar Pleksus","status":80,"note":"Not"},{"name":"Kalp Cakra","status":70,"note":"Not"},{"name":"Bogaz Cakra","status":65,"note":"Not"},{"name":"Ucuncu Goz","status":85,"note":"Not"},{"name":"Tac Cakra","status":55,"note":"Not"}],"overall":"Genel durum","advice":"Tavsiye"}`
    },
    'yasam': {
        name: 'Yasam Yolu',
        prompt: `Sen Astro Dozi'nin numeroloji uzmanisin. Turkce yaz. Yasam yolu analizi yap. Yanitini SADECE JSON formatinda ver:
{"number":7,"title":"Baslik","meaning":"Anlami 1 paragraf","strengths":["Guc 1","Guc 2","Guc 3"],"challenges":["Zorluk 1","Zorluk 2","Zorluk 3"],"advice":"Tavsiye"}`
    }
};

function handleFeatureClick(feature, cost) {
    pendingFeature = feature;
    pendingCost = cost;

    if (isPremium) {
        executeFeature(feature);
        return;
    }

    const modalCoinCost = document.getElementById('modalCoinCost');
    const modalBalance = document.getElementById('modalBalance');
    if (modalCoinCost) modalCoinCost.textContent = cost + ' Yildiz Tozu Harca';
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

    if (horoscopeTitle) horoscopeTitle.textContent = config.name;
    if (horoscopeContent) {
        horoscopeContent.innerHTML = `
            <div class="loading">
                <div class="spinner"></div>
                <span class="loading-text">${config.name} hazirlaniyor...</span>
            </div>
        `;
    }
    if (horoscopeCard) horoscopeCard.scrollIntoView({ behavior: 'smooth', block: 'start' });

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
                    generationConfig: { temperature: 0.9, maxOutputTokens: 1024 }
                })
            }
        );

        if (!response.ok) throw new Error('API error: ' + response.status);

        const result = await response.json();
        const text = result.candidates?.[0]?.content?.parts?.[0]?.text || '';
        let jsonStr = text;
        const codeBlock = text.match(/```json\s*([\s\S]*?)\s*```/);
        if (codeBlock) jsonStr = codeBlock[1];
        else { const m = text.match(/\{[\s\S]*\}/); if (m) jsonStr = m[0]; }

        const data = JSON.parse(jsonStr);
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
            if (data.bestMatch) html += `<p style="margin-top:1rem"><strong>En uyumlu burc:</strong> ${data.bestMatch}</p>`;
            if (data.score) html += `<p><strong>Uyum puani:</strong> ${data.score}/100</p>`;
            break;

        case 'aura':
            if (data.color) {
                html += `<div style="text-align:center;padding:1.5rem 0">
                    <div style="width:120px;height:120px;border-radius:50%;margin:0 auto 1rem;
                        background:radial-gradient(circle, ${getAuraGradient(data.color)});
                        box-shadow:0 0 40px ${getAuraGlow(data.color)}"></div>
                    <p style="font-size:1.25rem;font-weight:700;color:var(--cosmic-purple)">${data.color}</p>
                    ${data.secondaryColor ? `<p style="font-size:0.85rem;color:var(--text-muted)">Ikincil: ${data.secondaryColor}</p>` : ''}
                </div>`;
            }
            if (data.meaning) html += `<p><strong>Anlami:</strong> ${data.meaning}</p>`;
            if (data.energy) html += `<p><strong>Enerji:</strong> ${data.energy}</p>`;
            if (data.advice) html += `<p style="color:var(--cosmic-purple);font-style:italic;margin-top:1rem">${data.advice}</p>`;
            break;

        case 'gecmis':
            if (data.era) html += `<p style="font-size:0.85rem;color:var(--golden-star);font-weight:600;margin-bottom:0.5rem">${data.era}${data.role ? ' - ' + data.role : ''}</p>`;
            if (data.story) html += `<p>${data.story}</p>`;
            if (data.karmaLesson) html += `<p style="margin-top:1rem"><strong>Karmik Ders:</strong> ${data.karmaLesson}</p>`;
            if (data.connection) html += `<p><strong>Baglanti:</strong> ${data.connection}</p>`;
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
                                <div style="width:${c.status}%;height:100%;background:${colors[i]||'#888'};border-radius:3px"></div>
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
    if (!horoscopeContent) return;
    const config = FEATURE_CONFIG[feature];
    horoscopeContent.innerHTML = `
        <div class="horoscope-text" style="text-align:center;padding:2rem 0">
            <p style="font-size:1.5rem;margin-bottom:1rem">\u2728</p>
            <p style="font-weight:600">${config.name} simdi kullanilamiyor.</p>
            <p style="margin-top:0.75rem;color:var(--text-muted);font-size:0.9rem">Android uygulamasini deneyin.</p>
            <a href="https://play.google.com/store/apps/details?id=com.bardino.zodi" target="_blank"
               style="display:inline-flex;align-items:center;gap:0.5rem;margin-top:1.25rem;padding:0.6rem 1.25rem;
                      background:var(--gradient-primary);color:white;border-radius:50px;text-decoration:none;font-weight:600;font-size:0.9rem">
                Uygulamada Dene
            </a>
        </div>
    `;
}

function getAuraGradient(color) {
    const map = { 'mor':'124,58,237', 'mavi':'59,130,246', 'yesil':'34,197,94', 'sari':'234,179,8',
        'turuncu':'249,115,22', 'kirmizi':'239,68,68', 'pembe':'236,72,153', 'beyaz':'200,200,200', 'altin':'245,158,11' };
    const key = color.toLowerCase();
    for (const [k, v] of Object.entries(map)) {
        if (key.includes(k)) return `rgba(${v},0.3), rgba(${v},0.8)`;
    }
    return 'rgba(124,58,237,0.3), rgba(124,58,237,0.8)';
}

function getAuraGlow(color) {
    const map = { 'mavi':'59,130,246', 'yesil':'34,197,94', 'sari':'234,179,8', 'altin':'245,158,11',
        'kirmizi':'239,68,68', 'pembe':'236,72,153' };
    const key = color.toLowerCase();
    for (const [k, v] of Object.entries(map)) {
        if (key.includes(k)) return `rgba(${v},0.4)`;
    }
    return 'rgba(124,58,237,0.4)';
}

// ==================== COIN PURCHASE ====================
function handleCoinPurchase(packId) {
    showToast('Odeme sistemi yakin zamanda aktif olacak!');
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
