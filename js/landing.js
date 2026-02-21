// ========================================
// Astro Dozi - Landing Page JS
// ========================================

// Navbar scroll effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// Mobile menu
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navLinks = document.getElementById('navLinks');
if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
}

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            if (navLinks) navLinks.classList.remove('active');
        }
    });
});

// Waitlist form - saves to Firebase
const waitlistForm = document.getElementById('waitlistForm');
if (waitlistForm) {
    waitlistForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('waitlistEmail').value.trim();
        const note = document.getElementById('waitlistNote');

        if (!email) return;

        try {
            // Save to Firestore
            if (typeof firebase !== 'undefined' && firebase.firestore) {
                await firebase.firestore().collection('ios_waitlist').add({
                    email: email,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                    source: 'astro.dozi.app'
                });
            }

            note.textContent = 'Kaydedildi! iOS ciktiginda sana haber verecegiz.';
            note.style.color = '#10B981';
            waitlistForm.reset();
        } catch (err) {
            // Fallback: save to localStorage
            const waitlist = JSON.parse(localStorage.getItem('ios_waitlist') || '[]');
            waitlist.push({ email, timestamp: new Date().toISOString() });
            localStorage.setItem('ios_waitlist', JSON.stringify(waitlist));

            note.textContent = 'Kaydedildi! iOS ciktiginda sana haber verecegiz.';
            note.style.color = '#10B981';
            waitlistForm.reset();
        }
    });
}

// Zodiac hover animations
document.querySelectorAll('.zodiac-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-4px) scale(1.02)';
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});

// Intersection Observer for fade-in animations
const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.feature-card, .pricing-card, .zodiac-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
});
