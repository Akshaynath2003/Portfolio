/* ===== main.js — Shared across all pages ===== */

// ---- TYPING ANIMATION (Home page) ----
(function initTyping() {
    const el = document.getElementById('typed');
    if (!el) return;
    const roles = ['Web Developer', 'Problem Solver', 'Creative Thinker', 'Lifelong Learner', 'Future Engineer'];
    let roleIndex = 0, charIndex = 0, deleting = false;

    function type() {
        const current = roles[roleIndex];
        if (deleting) {
            el.textContent = current.substring(0, charIndex--);
            if (charIndex < 0) { deleting = false; roleIndex = (roleIndex + 1) % roles.length; setTimeout(type, 600); return; }
        } else {
            el.textContent = current.substring(0, charIndex++);
            if (charIndex > current.length) { deleting = true; setTimeout(type, 2000); return; }
        }
        setTimeout(type, deleting ? 60 : 120);
    }
    setTimeout(type, 800);
})();

// ---- COUNTER ANIMATION (Home page stats) ----
(function initCounters() {
    const counters = document.querySelectorAll('.count');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const target = parseInt(el.dataset.target, 10);
            if (isNaN(target)) return;
            let count = 0;
            const step = Math.max(1, Math.ceil(target / 60));
            const timer = setInterval(() => {
                count = Math.min(count + step, target);
                el.textContent = count;
                if (count >= target) clearInterval(timer);
            }, 25);
            observer.unobserve(el);
        });
    }, { threshold: 0.5 });

    counters.forEach(c => observer.observe(c));
})();

// ---- SKILL BARS ANIMATION (About page) ----
(function initSkillBars() {
    const bars = document.querySelectorAll('.skill-bar-fill');
    if (!bars.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    bars.forEach(b => observer.observe(b));
})();

// ---- SCROLL-TRIGGERED FADE ANIMATIONS ----
(function initScrollAnimations() {
    const animEls = document.querySelectorAll('.animate-fade-up, .animate-fade-left, .animate-fade-right');
    if (!animEls.length) return;

    // Elements with no delay that are above fold should show immediately
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    animEls.forEach(el => observer.observe(el));
})();

// ---- BACK TO TOP ----
(function initBackToTop() {
    const btn = document.getElementById('back-to-top');
    if (!btn) return;
    window.addEventListener('scroll', () => {
        btn.classList.toggle('visible', window.scrollY > 400);
    });
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();

// ---- PROJECT FILTER TABS ----
(function initProjectFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.projects-grid .project-card');
    if (!filterBtns.length) return;

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.dataset.filter;

            projectCards.forEach(card => {
                const category = card.dataset.category || 'other';
                const show = filter === 'all' || category === filter;
                card.style.display = show ? '' : 'none';
            });
        });
    });
})();

// ---- NAV ACTIVE STATE ----
(function setActiveNav() {
    const path = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(link => {
        const href = link.getAttribute('href');
        if (href === path) link.classList.add('active');
        else link.classList.remove('active');
    });
})();

// ---- NAV SCROLL EFFECT ----
window.addEventListener('scroll', () => {
    const nav = document.querySelector('nav');
    if (!nav) return;
    if (window.scrollY > 20) {
        nav.style.borderBottomColor = 'rgba(255,255,255,0.12)';
        nav.style.background = 'rgba(10,10,18,0.95)';
    } else {
        nav.style.borderBottomColor = '';
        nav.style.background = '';
    }
});

// ---- HAMBURGER MENU ----
(function initHamburgerMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    if (!hamburger || !navLinks) return;

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
})();
