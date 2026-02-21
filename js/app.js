// ========================================
// Astro Dozi - Web App Logic
// ========================================

const SIGNS = [
    { id: 'koc', name: 'Koc', emoji: '\u2648', dates: '21 Mar - 19 Nis' },
    { id: 'boga', name: 'Boga', emoji: '\u2649', dates: '20 Nis - 20 May' },
    { id: 'ikizler', name: 'Ikizler', emoji: '\u264A', dates: '21 May - 20 Haz' },
    { id: 'yengec', name: 'Yengec', emoji: '\u264B', dates: '21 Haz - 22 Tem' },
    { id: 'aslan', name: 'Aslan', emoji: '\u264C', dates: '23 Tem - 22 Agu' },
    { id: 'basak', name: 'Basak', emoji: '\u264D', dates: '23 Agu - 22 Eyl' },
    { id: 'terazi', name: 'Terazi', emoji: '\u264E', dates: '23 Eyl - 22 Eki' },
    { id: 'akrep', name: 'Akrep', emoji: '\u264F', dates: '23 Eki - 21 Kas' },
    { id: 'yay', name: 'Yay', emoji: '\u2650', dates: '22 Kas - 21 Ara' },
    { id: 'oglak', name: 'Oglak', emoji: '\u2651', dates: '22 Ara - 19 Oca' },
    { id: 'kova', name: 'Kova', emoji: '\u2652', dates: '20 Oca - 18 Sub' },
    { id: 'balik', name: 'Balik', emoji: '\u2653', dates: '19 Sub - 20 Mar' }
];

// Zodiac ID to Firestore collection name mapping
const SIGN_MAP = {
    'koc': 'Koc',
    'boga': 'Boga',
    'ikizler': 'Ikizler',
    'yengec': 'Yengec',
    'aslan': 'Aslan',
    'basak': 'Basak',
    'terazi': 'Terazi',
    'akrep': 'Akrep',
    'yay': 'Yay',
    'oglak': 'Oglak',
    'kova': 'Kova',
    'balik': 'Balik'
};

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
        showCoinModal(); // For now, redirect to coin purchase
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
    showToast('Misafir olarak devam ediyorsun. Veriler cihazinda saklanir.');
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
            selectedSign = data.selectedZodiac || selectedSign;
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
    document.getElementById('modalBalance').textContent = coins;
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
    const cacheKey = `horoscope_${signId}_${today.toISOString().split('T')[0]}`;

    // Check local cache first
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
        displayHoroscope(JSON.parse(cached));
        return;
    }

    try {
        // Try Firebase
        const signName = SIGN_MAP[signId];
        const dateStr = formatDate(today);

        const snapshot = await db.collection('daily_horoscopes')
            .where('zodiacSign', '==', signName)
            .where('date', '==', dateStr)
            .limit(1)
            .get();

        if (!snapshot.empty) {
            const data = snapshot.docs[0].data();
            const horoscope = {
                general: data.generalComment || data.general || '',
                love: data.loveComment || data.love || '',
                career: data.careerComment || data.career || '',
                health: data.healthComment || data.health || '',
                luckyNumber: data.luckyNumber || '',
                luckyColor: data.luckyColor || '',
                mood: data.mood || '',
                rating: data.rating || data.overallRating || 0
            };
            localStorage.setItem(cacheKey, JSON.stringify(horoscope));
            displayHoroscope(horoscope);
        } else {
            displayFallbackHoroscope(signId);
        }
    } catch (err) {
        console.error('Horoscope fetch error:', err);
        displayFallbackHoroscope(signId);
    }
}

function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function displayHoroscope(data) {
    let html = '<div class="horoscope-text">';

    if (data.general) {
        html += `<p><strong>Genel:</strong> ${data.general}</p>`;
    }
    if (data.love) {
        html += `<p><strong>Ask:</strong> ${data.love}</p>`;
    }
    if (data.career) {
        html += `<p><strong>Kariyer:</strong> ${data.career}</p>`;
    }
    if (data.health) {
        html += `<p><strong>Saglik:</strong> ${data.health}</p>`;
    }

    // Lucky info
    const extras = [];
    if (data.luckyNumber) extras.push('Sans Sayisi: ' + data.luckyNumber);
    if (data.luckyColor) extras.push('Sans Rengi: ' + data.luckyColor);
    if (data.mood) extras.push('Ruh Hali: ' + data.mood);

    if (extras.length > 0) {
        html += `<p style="margin-top:1rem;padding-top:1rem;border-top:1px solid #EDE9FE;font-size:0.85rem;color:#6B7280">
            ${extras.join(' &bull; ')}
        </p>`;
    }

    if (data.rating > 0) {
        const stars = '\u2B50'.repeat(Math.min(data.rating, 5));
        html += `<p style="font-size:0.85rem;color:#6B7280">Gunun Puani: ${stars} (${data.rating}/10)</p>`;
    }

    html += '</div>';
    horoscopeContent.innerHTML = html;
}

function displayFallbackHoroscope(signId) {
    const sign = SIGNS.find(s => s.id === signId);
    horoscopeContent.innerHTML = `
        <div class="horoscope-text">
            <p>Bugunun ${sign.name} burcu yorumu henuz hazirlanmadi.</p>
            <p style="margin-top:1rem">
                <strong>Daha detayli ve kisisel yorumlar icin Android uygulamasini indir:</strong>
            </p>
            <a href="https://play.google.com/store/apps/details?id=com.bardino.zodi"
               target="_blank"
               style="display:inline-flex;align-items:center;gap:0.5rem;margin-top:0.75rem;
                      padding:0.6rem 1.25rem;background:var(--gradient-primary);color:white;
                      border-radius:50px;text-decoration:none;font-weight:600;font-size:0.9rem">
                Google Play'den Indir
            </a>
        </div>
    `;
}

// ==================== FEATURES ====================
let pendingFeature = null;
let pendingCost = 0;

function handleFeatureClick(feature, cost) {
    if (isPremium || coins >= cost) {
        if (isPremium) {
            openFeature(feature);
        } else {
            pendingFeature = feature;
            pendingCost = cost;
            document.getElementById('modalCoinCost').textContent = cost + ' Yildiz Tozu Harca';
            document.getElementById('modalBalance').textContent = coins;
            openModal(premiumModal);
        }
    } else {
        pendingFeature = feature;
        pendingCost = cost;
        document.getElementById('modalCoinCost').textContent = cost + ' Yildiz Tozu Harca';
        document.getElementById('modalBalance').textContent = coins;

        // Disable spend option if not enough
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
}

function handleSpendCoins() {
    if (coins >= pendingCost) {
        coins -= pendingCost;
        updateUI();
        saveGuestData();

        // Save to Firebase if logged in
        if (currentUser) {
            db.collection('users').doc(currentUser.uid).update({
                coinBalance: coins
            }).catch(err => console.error('Coin update error:', err));
        }

        closeModal(premiumModal);
        openFeature(pendingFeature);
        showToast(pendingCost + ' Yildiz Tozu harcandi.');
    }
}

function openFeature(feature) {
    // For web version, show a message directing to the app for full features
    const featureNames = {
        'tarot': 'Tarot Fali',
        'uyum': 'Burc Uyumu',
        'aura': 'Aura Okuma',
        'gecmis': 'Gecmis Yasam',
        'cakra': 'Cakra Analizi',
        'yasam': 'Yasam Yolu'
    };

    const name = featureNames[feature] || feature;

    // Show feature content in horoscope card area
    horoscopeContent.innerHTML = `
        <div class="horoscope-text" style="text-align:center;padding:2rem 0">
            <p style="font-size:1.5rem;margin-bottom:1rem">\u2728</p>
            <p><strong>${name}</strong> ozelligini actiniz!</p>
            <p style="margin-top:1rem;color:var(--text-muted);font-size:0.9rem">
                Bu ozelligin tam deneyimi icin Android uygulamasini indirin.
                Web versiyonunda yakin zamanda aktif olacak.
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

    // Scroll to content
    horoscopeCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ==================== COIN PURCHASE ====================
function handleCoinPurchase(packId) {
    // Paddle integration placeholder
    // TODO: Integrate Paddle.js for real payments
    showToast('Odeme sistemi yakin zamanda aktif olacak.');

    // For now, show the Android app link
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
