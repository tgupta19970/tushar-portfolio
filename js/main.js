/* ============================================================
   TUSHAR'S PORTFOLIO — MAIN JS v2
   ============================================================ */
'use strict';

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initLanguage();
  initNavbar();
  initHeroCanvas();
  initTypewriter();
  initScrollReveal();
  initHamburger();
  initAboutReadMore();
  initExpTabs();
  initExpToggles();
  initSkillBars();
  initProjectModal();
  initContactForm();
  initChatbot();
});

// ─── THEME ────────────────────────────────────────────────────
function initTheme() {
  const saved = localStorage.getItem('portfolio-theme') || 'dark';
  applyTheme(saved);
  document.querySelectorAll('.theme-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      applyTheme(btn.dataset.theme);
      localStorage.setItem('portfolio-theme', btn.dataset.theme);
    });
  });
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (localStorage.getItem('portfolio-theme') === 'system') applyTheme('system');
  });
}

function applyTheme(theme) {
  let effective = theme;
  if (theme === 'system') {
    effective = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  document.documentElement.dataset.theme = effective;
  document.querySelectorAll('.theme-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.theme === theme);
  });
}

// ─── LANGUAGE ─────────────────────────────────────────────────
function initLanguage() {
  const saved = localStorage.getItem('portfolio-lang') || 'en-US';
  applyLanguage(saved);
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      applyLanguage(btn.dataset.lang);
      localStorage.setItem('portfolio-lang', btn.dataset.lang);
    });
  });
}

function applyLanguage(lang) {
  const tr = (window.translations && window.translations[lang]) || window.translations['en-US'] || {};
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (tr[key] !== undefined) {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') el.placeholder = tr[key];
      else el.textContent = tr[key];
    }
  });
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
}

function t(key) {
  const lang = localStorage.getItem('portfolio-lang') || 'en-US';
  const tr = (window.translations && window.translations[lang]) || window.translations['en-US'] || {};
  return tr[key] || key;
}

// ─── NAVBAR ───────────────────────────────────────────────────
function initNavbar() {
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  });
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - navbar.offsetHeight - 16;
        window.scrollTo({ top, behavior: 'smooth' });
        document.getElementById('nav-mobile').classList.remove('open');
        document.getElementById('hamburger').classList.remove('open');
      }
    });
  });
}

// ─── HAMBURGER ────────────────────────────────────────────────
function initHamburger() {
  const hamburger = document.getElementById('hamburger');
  const navMobile = document.getElementById('nav-mobile');
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navMobile.classList.toggle('open');
  });
}

// ─── HERO CANVAS (dot-grid animated) ─────────────────────────
function initHeroCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, dots = [];

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
    buildDots();
  }

  function buildDots() {
    dots = [];
    const sp = 45;
    for (let x = 0; x < W + sp; x += sp) {
      for (let y = 0; y < H + sp; y += sp) {
        dots.push({ x, y, ox: x, oy: y, r: Math.random() * 1.4 + 0.5, phase: Math.random() * Math.PI * 2, speed: Math.random() * 0.5 + 0.3 });
      }
    }
  }

  const isDark = () => document.documentElement.dataset.theme !== 'light';

  function draw(t) {
    ctx.clearRect(0, 0, W, H);
    const dotClr = isDark() ? 'rgba(59,130,246,0.5)' : 'rgba(37,99,235,0.3)';
    const lineClr = isDark() ? 'rgba(59,130,246,0.08)' : 'rgba(37,99,235,0.06)';
    dots.forEach(d => {
      d.x = d.ox + Math.sin(t * d.speed + d.phase) * 3;
      d.y = d.oy + Math.cos(t * d.speed * 0.7 + d.phase) * 3;
    });
    dots.forEach((d, i) => {
      dots.forEach((d2, j) => {
        if (j <= i) return;
        const dist = Math.hypot(d.x - d2.x, d.y - d2.y);
        if (dist < 58) {
          ctx.beginPath();
          ctx.moveTo(d.x, d.y);
          ctx.lineTo(d2.x, d2.y);
          ctx.strokeStyle = lineClr;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      });
    });
    dots.forEach(d => {
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fillStyle = dotClr;
      ctx.fill();
    });
  }

  let frame = 0;
  function animate() { frame += 0.012; draw(frame); requestAnimationFrame(animate); }
  resize();
  window.addEventListener('resize', resize);
  animate();
}

// ─── TYPEWRITER ───────────────────────────────────────────────
function initTypewriter() {
  const el = document.getElementById('hero-subtitle');
  if (!el) return;
  const texts = ['Android & Flutter Developer', 'Mobile App Developer', '15+ Apps in Production', '4.5+ Years of Experience'];
  let textIdx = 0, charIdx = 0, deleting = false;
  function type() {
    const current = texts[textIdx];
    if (!deleting) {
      el.textContent = current.slice(0, charIdx + 1);
      charIdx++;
      if (charIdx === current.length) { deleting = true; setTimeout(type, 1800); return; }
      setTimeout(type, 65);
    } else {
      el.textContent = current.slice(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) { deleting = false; textIdx = (textIdx + 1) % texts.length; }
      setTimeout(type, 35);
    }
  }
  type();
}

// ─── SCROLL REVEAL ────────────────────────────────────────────
function initScrollReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => obs.observe(el));
}

// ─── ABOUT READ MORE ──────────────────────────────────────────
function initAboutReadMore() {
  const btn = document.getElementById('about-readmore');
  const full = document.getElementById('about-full');
  if (!btn || !full) return;
  btn.addEventListener('click', () => {
    const expanded = full.classList.toggle('expanded');
    btn.innerHTML = expanded ? 'Read Less <span class="arrow"> ↑</span>' : 'Read More <span class="arrow"> ↓</span>';
  });
}

// ─── EXPERIENCE TABS ──────────────────────────────────────────
function initExpTabs() {
  const tabs = document.querySelectorAll('.exp-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.exp-panel').forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      const panel = document.getElementById('exp-panel-' + tab.dataset.tab);
      if (panel) panel.classList.add('active');
    });
  });
}

// ─── EXPERIENCE TOGGLES ───────────────────────────────────────
function initExpToggles() {
  document.querySelectorAll('.exp-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.target;
      const details = targetId ? document.getElementById(targetId) : btn.nextElementSibling;
      if (!details) return;
      const isOpen = details.style.display !== 'none' && details.style.display !== '';
      details.style.display = isOpen ? 'none' : 'block';
      btn.innerHTML = isOpen ? `Show Details <span>▼</span>` : `Hide Details <span>▲</span>`;
    });
  });
}

// ─── SKILL BARS ANIMATION ─────────────────────────────────────
function initSkillBars() {
  const bars = document.querySelectorAll('.skill-bar-fill');
  if (!bars.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const bar = e.target;
        const w = bar.dataset.width || 0;
        setTimeout(() => { bar.style.width = w + '%'; }, 200);
        obs.unobserve(bar);
      }
    });
  }, { threshold: 0.3 });
  bars.forEach(bar => obs.observe(bar));
}

// ─── APPS DATA STORE (For Experience Modal & Projects) ─────────
const APPS_DATA = {
  quickbuzz: {
    title: "QuickBuzz",
    subtitle: "Flutter · Short-form News App",
    desc: "QuickBuzz is a short-form news app built to make catching up on headlines effortless. Built in Flutter with REST API integration, it organizes content into swipeable, category-wise cards — browse by topic, search for something specific, or bookmark a story for later. Built around clean architecture and reusable components for easy expansion.",
    features: [
      "Category-wise news browsing (Tech, Sports, World & more)",
      "Search functionality across all articles",
      "Bookmarking for reading later",
      "Swipe-based navigation between stories",
      "REST API–driven live content",
      "Clean Flutter architecture with reusable components"
    ],
    tech: ["Flutter", "Dart", "REST API", "JSON", "Material Design"],
    downloadApk: "assets/quickbuzz.apk",
    images: [
      { src: "assets/qb-home.png", alt: "QuickBuzz home feed" },
      { src: "assets/qb-category.png", alt: "QuickBuzz categories" },
      { src: "assets/qb-detail.png", alt: "QuickBuzz article detail" },
      { src: "assets/qb-search.png", alt: "QuickBuzz search" },
      { src: "assets/quickbuzz-screenshot.png", alt: "QuickBuzz overview" }
    ]
  },
  prism: {
    title: "Prism Plus",
    subtitle: "Android (Java + XML) · Enterprise Operations Suite",
    desc: "Prism Plus is a high-volume, multi-purpose enterprise mobility application deployed across nationwide teams. It unifies workforce attendance tracking, a complete sales management system, and field-visit audit logging into a fast, responsive native Android experience designed for maximum reliability in low-connectivity environments.",
    features: [
      "Real-time Attendance Management with biometric/timestamp verification, reducing manual logging errors by 40%",
      "Comprehensive Sales Management pipeline: order processing, deal stages, and territory performance",
      "On-ground Visit Tracker ensuring geotagged visits and verifiable store check-ins",
      "Offline SQLite persistence with resilient auto-sync when network connectivity resumes",
      "Seamless RESTful API integration with JSON data pipelines connecting directly to enterprise ERPs",
      "Integrated Firebase Crashlytics & Performance Monitoring for proactive bug resolution"
    ],
    tech: ["Android SDK", "Java", "XML Layouts", "SQLite", "RESTful APIs", "Volley", "Firebase Crashlytics", "Google Play Store"],
    downloadApk: null,
    images: [
      { src: "assets/prism1.jpg", alt: "Prism Plus - Attendance Management Dashboard" },
      { src: "assets/prism2.jpg", alt: "Prism Plus - Live Attendance & Team Feed" },
      { src: "assets/prism3.jpg", alt: "Prism Plus - Sales Performance & Pipeline" },
      { src: "assets/prism4.jpg", alt: "Prism Plus - Store Visit Tracking Screen" },
      { src: "assets/prism5.jpg", alt: "Prism Plus - Reports & Offline Sync Status" }
    ]
  },
  multisense: {
    title: "MultiSense",
    subtitle: "Flutter (Dart) · Enterprise Sales & Attendance Platform",
    desc: "MultiSense is a cross-platform mobile application engineered with Flutter to streamline daily sales operations, attendance verification, and team motivation. Built around reactive state management, it provides leadership with instant visibility into field performance while keeping sales representatives engaged with interactive gamification.",
    features: [
      "Optimized Attendance Management workflow with quick check-in and attendance history analytics",
      "Advanced Sales Tracking with real-time target vs. achievement breakdown and regional sales distribution charts",
      "Competitive Real-Time Leaderboard ranking team performance by sales volume, targets, and incentive tiers",
      "Clean, modern Flutter architecture with reusable widget libraries delivering uniform UI on Android & iOS",
      "Optimized JSON serialization and cached REST API endpoints ensuring high frame rates during rapid scrolling",
      "Firebase Analytics and Crashlytics tracking user journeys and ensuring sub-0.5% crash-free session rates"
    ],
    tech: ["Flutter", "Dart", "Cross-Platform", "REST APIs", "State Management", "Firebase Analytics", "Charts & Gamification"],
    downloadApk: null,
    images: [
      { src: "assets/multisense1.jpg", alt: "MultiSense - Sales Analytics & Executive Dashboard" },
      { src: "assets/multisense2.jpg", alt: "MultiSense - Team Leaderboard & Performance Ranking" },
      { src: "assets/multisense3.jpg", alt: "MultiSense - Attendance Verification & Daily Log" },
      { src: "assets/multisense4.jpg", alt: "MultiSense - Product Sales Breakdown Charts" },
      { src: "assets/multisense5.jpg", alt: "MultiSense - Revenue Target vs Achievement Monitor" }
    ]
  },
  vratt: {
    title: "V-Ratt",
    subtitle: "Android (Java + XML) · Retail Audit & Outlet Monitoring",
    desc: "V-Ratt is a specialized native Android utility tailored for retail audit teams, merchandising supervisors, and regional store operations. It equips field agents with structured audit workflows, stock visibility checks, and instant store-level compliance reporting.",
    features: [
      "Interactive Store Visits schedule with map pins, distance calculation, and priority filtering",
      "Dynamic in-store audit questionnaires with validation for shelf space, promo compliance, and stock levels",
      "Photo capture with on-device compression and background upload queue for visual shelf verification",
      "Direct phone call and navigation integrations for seamless routing between retail outlets",
      "Strict backward compatibility and battery-efficient location tracking across diverse Android device tiers",
      "Firebase Performance Monitoring to track network payload times and layout render latencies"
    ],
    tech: ["Android SDK", "Java", "Material Design", "Location Services", "REST APIs", "Volley", "SQLite", "Play Store Rollouts"],
    downloadApk: null,
    images: [
      { src: "assets/vratt1.jpg", alt: "V-Ratt - Retail Outlets Map & Scheduled Visits" },
      { src: "assets/vratt2.jpg", alt: "V-Ratt - Store Visit Schedule & Status Log" },
      { src: "assets/vratt3.jpg", alt: "V-Ratt - In-Store Visual Compliance & Shelving" },
      { src: "assets/vratt4.jpg", alt: "V-Ratt - Outlet Details & Action Item Checklist" },
      { src: "assets/vratt5.jpg", alt: "V-Ratt - Territory Coverage & Audit Summary" }
    ]
  },
  fieldinsight: {
    title: "Field Insight",
    subtitle: "Android (Java + XML) · On-Ground Field Force Automation",
    desc: "Field Insight empowers technical service technicians and on-ground field personnel with structured task execution, job checklists, and real-time supervisory tracking. It was engineered to replace error-prone paper workflows with an intuitive, resilient mobile interface.",
    features: [
      "Daily visit schedules with GPS location tracking and live route updates",
      "Step-by-step equipment inspection checklists with mandatory photo proof of work",
      "Visit summary logging with instant digital customer sign-offs and issue reporting",
      "Local caching via SQLite ensuring full offline operation during field visits in remote facilities",
      "Optimized memory usage and asynchronous image processing to maintain smooth performance on budget handsets",
      "End-to-end Google Play Store lifecycle management including phased rollouts and compliance"
    ],
    tech: ["Android SDK", "Java", "GPS & Geofencing", "REST APIs", "SQLite", "Camera API", "Firebase Crashlytics"],
    downloadApk: null,
    images: [
      { src: "assets/fieldinsight1.jpg", alt: "Field Insight - Daily Schedule & Live GPS Tracking" },
      { src: "assets/fieldinsight2.jpg", alt: "Field Insight - Equipment Inspection Checklist & Camera Capture" },
      { src: "assets/fieldinsight3.jpg", alt: "Field Insight - Job Summary & Work Verification" },
      { src: "assets/fieldinsight4.jpg", alt: "Field Insight - Offline Task Queue & Sync Status" },
      { src: "assets/fieldinsight5.jpg", alt: "Field Insight - Technician Performance & Route Map" }
    ]
  },
  retailspark: {
    title: "Retail Spark",
    subtitle: "Flutter (Dart) · Cross-Platform Retail Operations & POS",
    desc: "Retail Spark is a high-speed cross-platform mobile application developed in Flutter to power retail product discovery, on-demand catalog browsing, stock replenishment, and field order placement with minimal friction.",
    features: [
      "Rich visual catalog grid with category filters, dynamic search, and live inventory count badges",
      "Streamlined shopping cart and instant field order placement workflow",
      "Unified Flutter codebase eliminating duplicate engineering overhead for iOS and Android",
      "Optimized asset loading and smooth micro-interactions that elevate brand perception",
      "RESTful API integration connecting real-time stock levels directly with warehouse management systems",
      "Firebase In-App Messaging and analytics to communicate flash inventory alerts to store supervisors"
    ],
    tech: ["Flutter", "Dart", "Cross-Platform", "REST APIs", "JSON", "Material 3", "State Management", "In-App Messaging"],
    downloadApk: null,
    images: [
      { src: "assets/retailspark1.jpg", alt: "Retail Spark - Interactive Product Catalog & Inventory Badges" },
      { src: "assets/retailspark2.jpg", alt: "Retail Spark - Category Tabs & Stock Availability View" },
      { src: "assets/retailspark3.jpg", alt: "Retail Spark - Shopping Cart & Order Summary Bar" },
      { src: "assets/retailspark4.jpg", alt: "Retail Spark - Product Detail & Variant Selection" },
      { src: "assets/retailspark5.jpg", alt: "Retail Spark - Store Stock Replenishment Dashboard" }
    ]
  },
  storm: {
    title: "Storm",
    subtitle: "Flutter (Dart) · Competitive Performance & KPI Tracker",
    desc: "Storm is an executive-level performance monitoring and sales gamification application built in Flutter. It empowers regional managers and business leaders to track targets, compare regional milestones, and monitor revenue velocity in real time.",
    features: [
      "Dynamic KPI dashboards presenting revenue growth, market share, and customer acquisition metrics",
      "Target vs. Achievement progress bars comparing quarterly performance against organizational milestones",
      "Team performance comparison matrices displaying quotas, achievement rates, and leader rankings",
      "Smooth data animations and chart renders powered by Flutter's customizable graphics pipeline",
      "Multi-region data filtering and period toggles (Monthly, Quarterly, Annual)",
      "Continuous integration and automated build verification for rapid Google Play Store releases"
    ],
    tech: ["Flutter", "Dart", "Data Visualization", "REST APIs", "Cross-Platform", "Firebase Analytics", "Release Management"],
    downloadApk: null,
    images: [
      { src: "assets/storm1.jpg", alt: "Storm - Executive Performance Dashboard & KPI Metrics" },
      { src: "assets/storm2.jpg", alt: "Storm - Target vs Achievement Tracking Bars" },
      { src: "assets/storm3.jpg", alt: "Storm - Team Performance Comparison Table" },
      { src: "assets/storm4.jpg", alt: "Storm - Quarterly Revenue & Growth Analytics" },
      { src: "assets/storm5.jpg", alt: "Storm - Regional Sales Velocity & Rankings" }
    ]
  }
};

let carouselAutoPlayInterval = null;
let currentSlideIndex = 0;

// ─── PROJECT & APP MODAL ──────────────────────────────────────
function initProjectModal() {
  const overlay = document.getElementById('project-modal');
  if (!overlay) return;

  // Open modal on QuickBuzz project card
  const quickbuzzCard = document.getElementById('quickbuzz-card');
  if (quickbuzzCard) {
    quickbuzzCard.addEventListener('click', () => openAppModal('quickbuzz'));
  }
  const quickbuzzBtn = document.querySelector('.project-view-btn');
  if (quickbuzzBtn) {
    quickbuzzBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      openAppModal('quickbuzz');
    });
  }

  // Open modal on Multiplier experience app chips
  document.querySelectorAll('.app-chip[data-app]').forEach(chip => {
    chip.addEventListener('click', () => {
      const appKey = chip.getAttribute('data-app');
      openAppModal(appKey);
    });
    chip.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const appKey = chip.getAttribute('data-app');
        openAppModal(appKey);
      }
    });
  });

  // Modal close handlers
  overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
  document.getElementById('modal-close')?.addEventListener('click', closeModal);
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && overlay.classList.contains('open')) closeModal(); });

  // Carousel Prev / Next buttons
  overlay.querySelector('.carousel-prev')?.addEventListener('click', () => changeSlide(-1));
  overlay.querySelector('.carousel-next')?.addEventListener('click', () => changeSlide(1));
}

function openAppModal(appKey) {
  const data = APPS_DATA[appKey] || APPS_DATA.quickbuzz;
  const overlay = document.getElementById('project-modal');
  if (!overlay) return;

  // Populate Title & Subtitle
  const titleEl = document.getElementById('modal-title-text');
  const subtitleEl = document.getElementById('modal-subtitle-text');
  if (titleEl) titleEl.textContent = data.title;
  if (subtitleEl) subtitleEl.textContent = data.subtitle;

  // Populate Description
  const descEl = document.getElementById('modal-desc-text');
  if (descEl) descEl.textContent = data.desc;

  // Populate Key Features
  const featuresList = document.getElementById('modal-features-list');
  if (featuresList) {
    featuresList.innerHTML = data.features.map(f => `<li>${escapeHtml(f)}</li>`).join('');
  }

  // Populate Tech Tags
  const techWrap = document.getElementById('modal-tech-tags');
  if (techWrap) {
    techWrap.innerHTML = data.tech.map(t => `<span class="skill-tag">${escapeHtml(t)}</span>`).join('');
  }

  // Populate Action buttons (APK download vs Close)
  const downloadBtn = document.getElementById('modal-download-btn');
  if (downloadBtn) {
    if (data.downloadApk) {
      downloadBtn.href = data.downloadApk;
      downloadBtn.style.display = 'inline-flex';
    } else {
      downloadBtn.style.display = 'none';
    }
  }

  // Build Carousel Slides & Dots (5 images per app)
  const track = document.getElementById('modal-carousel-track');
  const dotsWrap = document.getElementById('modal-carousel-dots');
  if (track && dotsWrap) {
    track.innerHTML = data.images.map(img => `
      <div class="carousel-slide">
        <img src="${img.src}" alt="${escapeHtml(img.alt)}" loading="lazy" />
      </div>
    `).join('');

    dotsWrap.innerHTML = data.images.map((_, i) => `
      <button class="carousel-dot ${i === 0 ? 'active' : ''}" aria-label="Go to slide ${i + 1}" data-slide="${i}"></button>
    `).join('');

    dotsWrap.querySelectorAll('.carousel-dot').forEach((dot, idx) => {
      dot.addEventListener('click', () => goToSlide(idx));
    });
  }

  // Reset slide index & start autoplay
  currentSlideIndex = 0;
  updateCarouselTrack();
  startCarouselAutoplay();

  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function updateCarouselTrack() {
  const track = document.getElementById('modal-carousel-track');
  const dots = document.querySelectorAll('#modal-carousel-dots .carousel-dot');
  const totalSlides = dots.length;
  if (!track || totalSlides === 0) return;

  currentSlideIndex = (currentSlideIndex + totalSlides) % totalSlides;
  track.style.transform = `translateX(-${currentSlideIndex * 100}%)`;
  dots.forEach((dot, idx) => {
    dot.classList.toggle('active', idx === currentSlideIndex);
  });
}

function goToSlide(idx) {
  currentSlideIndex = idx;
  updateCarouselTrack();
  restartCarouselAutoplay();
}

function changeSlide(direction) {
  currentSlideIndex += direction;
  updateCarouselTrack();
  restartCarouselAutoplay();
}

function startCarouselAutoplay() {
  if (carouselAutoPlayInterval) clearInterval(carouselAutoPlayInterval);
  carouselAutoPlayInterval = setInterval(() => {
    currentSlideIndex++;
    updateCarouselTrack();
  }, 3800);
}

function restartCarouselAutoplay() {
  startCarouselAutoplay();
}

window.openModal = function() {
  openAppModal('quickbuzz');
};

window.openAppModal = openAppModal;

window.closeModal = function() {
  const overlay = document.getElementById('project-modal');
  if (overlay) overlay.classList.remove('open');
  document.body.style.overflow = '';
  if (carouselAutoPlayInterval) {
    clearInterval(carouselAutoPlayInterval);
    carouselAutoPlayInterval = null;
  }
};

// ─── CONTACT FORM ─────────────────────────────────────────────


function initContactForm() {
    const EMAILJS_SERVICE_ID  = 'service_nx3unlq';   // e.g. 'service_abc123'
    const EMAILJS_TEMPLATE_ID = 'template_zdmopzb';  // e.g. 'template_xyz789'
    const EMAILJS_PUBLIC_KEY  = 'qvigxGVLrxfRUsEoU'; // e.g. 'user_Abc...'
    


    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', async e => {
        e.preventDefault();

        const feedback = document.getElementById('form-feedback');
        const btn = document.getElementById('contact-submit');
        const originalHTML = btn.innerHTML;

        const name    = form.querySelector('#contact-name').value.trim();
        const email   = form.querySelector('#contact-email').value.trim();
        const message = form.querySelector('#contact-message').value.trim();
        const phone   = form.querySelector('#contact-phone').value.trim();
        const company = form.querySelector('#contact-company').value.trim();
        const subject = form.querySelector('#contact-subject').value || 'Portfolio Contact';

        if (!name || !email || !message) {
            showFeedback(feedback, '⚠ Please fill in Name, Email, and Message.', 'error');
            return;
        }

        btn.disabled = true;
        btn.innerHTML = '⏳ Sending…';

        try {
            // Check if credentials are set
            if (!EMAILJS_SERVICE_ID || EMAILJS_SERVICE_ID.includes('YOUR_')) {
                throw new Error("EmailJS credentials not configured");
            }

            console.log("Sending via EmailJS...");

            await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
                from_name: name,
                from_email: email,
                phone: phone || 'Not provided',
                company: company || 'Not provided',
                subject: subject,
                message: message,
                to_email: 'tusharkansal09451@gmail.com'
            });

            showFeedback(feedback, '✅ Message sent successfully!', 'success');
            form.reset();

        } catch (err) {
            console.error("EmailJS Error Details:", err);   // ← This will help us debug
            showFeedback(feedback, '❌ Failed to send. Please try again or use the mail client.', 'error');
            
            // Fallback mailto
            const emailSubject = encodeURIComponent(`[Portfolio] ${subject} — from ${name}`);
            const emailBody = encodeURIComponent(
                `Name: ${name}\nEmail: ${email}\nPhone: ${phone || 'N/A'}\nCompany: ${company || 'N/A'}\nSubject: ${subject}\n\n${message}`
            );
            window.open(`mailto:tusharkansal09451@gmail.com?subject=${emailSubject}&body=${emailBody}`);
        } finally {
            btn.disabled = false;
            btn.innerHTML = originalHTML;
        }
    });
}


/*function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const feedback = document.getElementById('form-feedback');
    const btn = document.getElementById('contact-submit');
    const originalHTML = btn.innerHTML;

    const name    = form.querySelector('#contact-name').value.trim();
    const email   = form.querySelector('#contact-email').value.trim();
    const message = form.querySelector('#contact-message').value.trim();
    const phone   = form.querySelector('#contact-phone').value.trim();
    const company = form.querySelector('#contact-company').value.trim();
    const subject = form.querySelector('#contact-subject').value || 'Portfolio Contact';

    if (!name || !email || !message) {
      showFeedback(feedback, '⚠ Please fill in Name, Email, and Message.', 'error');
      return;
    }

    btn.disabled = true;
    btn.innerHTML = '⏳ Sending…';

    // ── EmailJS Integration ──────────────────────────────────
    // To enable real email delivery:
    // 1. Sign up at https://emailjs.com (free, 200 emails/month)
    // 2. Create a service and email template
    // 3. Replace the three values below with your own credentials
    // ────────────────────────────────────────────────────────
    const EMAILJS_SERVICE_ID  = 'service_nx3unlq';   // e.g. 'service_abc123'
    const EMAILJS_TEMPLATE_ID = 'template_zdmopzb';  // e.g. 'template_xyz789'
    const EMAILJS_PUBLIC_KEY  = 'qvigxGVLrxfRUsEoU';   // e.g. 'user_Abc...'

    try {
      if (typeof emailjs !== 'undefined' && EMAILJS_SERVICE_ID !== 'YOUR_SERVICE_ID') {
        await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
          from_name:    name,
          from_email:   email,
          phone:        phone   || 'Not provided',
          company:      company || 'Not provided',
          subject:      subject,
          message:      message,
          to_email:     'tusharkansal09451@gmail.com'
        }, EMAILJS_PUBLIC_KEY);
        showFeedback(feedback, '✅ ' + t('contact.success'), 'success');
        form.reset();
      } else {
        // Fallback: open mail client with all fields pre-filled
        const emailSubject = encodeURIComponent(`[Portfolio] ${subject} — from ${name}`);
        const emailBody = encodeURIComponent(
          `Name: ${name}\nEmail: ${email}\nPhone: ${phone || 'N/A'}\nCompany: ${company || 'N/A'}\nSubject: ${subject}\n\n${message}`
        );
        window.open(`mailto:tusharkansal09451@gmail.com?subject=${emailSubject}&body=${emailBody}`);
        showFeedback(feedback, '✅ Your mail client has opened — please hit Send there too!', 'success');
        form.reset();
      }
    } catch (err) {
      showFeedback(feedback, '❌ ' + t('contact.error'), 'error');
    } finally {
      btn.disabled = false;
      btn.innerHTML = originalHTML;
    }
  });
}*/

function showFeedback(el, msg, type) {
  el.textContent = msg;
  el.className = type;
  setTimeout(() => { el.textContent = ''; el.className = ''; }, 6000);
}

// ─── AI CHATBOT ───────────────────────────────────────────────
const FAQ = [
  { q: ['hello','hi','hey','greet','namaste','नमस्ते'], a: "Hi there! 👋 I'm Tushar's AI assistant. Ask me about his skills, projects, experience, awards, or how to reach him!" },
  { q: ['experience','years','how long','how much'], a: "Tushar has 4.5+ years of professional mobile development experience — Android (Java) since 2022 at Multiplier Brand Solution, and Flutter for the past ~1.5 years." },
  { q: ['skill','technologies','tech stack','know','expertise'], a: "Tushar's core skills: Android (Java) · Flutter (Dart) · Firebase (Crashlytics, Analytics, Performance) · RESTful APIs · Volley · SQLite · Google Play Store release management. He also uses AI-assisted dev tools daily." },
  { q: ['work','job','company','employer','multiplier','where does'], a: "Tushar currently works at Multiplier Brand Solution (Jan 2022–Present) as a Mobile App Developer — owning 15+ live apps on the Google Play Store." },
  { q: ['app','apps','projects','built','made','portfolio','prism','multisense','vratt','storm','retail spark','field insight'], a: "Apps at Multiplier: Prism Plus · MultiSense · V-Ratt · Field Insight · Retail Spark · Storm — 15+ apps live on the Play Store. Personal project: QuickBuzz (Flutter news app)." },
  { q: ['quickbuzz','news','personal'], a: "QuickBuzz is Tushar's personal Flutter news app with REST API integration, swipeable category cards, search, and bookmarking. You can download the APK from the Projects section!" },
  { q: ['flutter','dart'], a: "Tushar has been working with Flutter/Dart for about 1.5 years, using it to build MultiSense, Retail Spark, Storm, and QuickBuzz." },
  { q: ['android','java'], a: "Android (Java) is Tushar's primary expertise — he built Prism Plus, V-Ratt, Field Insight, and several other production apps with it over 4+ years." },
  { q: ['firebase'], a: "Tushar uses Firebase Analytics, Crashlytics, Performance Monitoring, and In-App Messaging across all his apps to monitor stability and catch crashes before users are impacted." },
  { q: ['contact','email','hire','reach','phone'], a: "📧 tusharkansal09451@gmail.com | 📱 +91 9540380443 | Or use the Contact form on this page — scroll down to the Contact section!" },
  { q: ['education','degree','study','college','bca','ignou','navgurukul'], a: "Tushar holds a BCA from IGNOU (2022–2025) and a Software Programming Diploma from NavGurukul (2020–2021) — NavGurukul's intensive programme launched his dev career." },
  { q: ['award','recognition','achievement','best suggestion','excellence'], a: "Tushar won the Best Suggestion Award (Jul–Sep 2023) for process improvements, and the Excellence in Execution Award (Mar 2026) for disciplined, on-schedule delivery." },
  { q: ['linkedin','github','social','twitter','instagram'], a: "🔗 LinkedIn: linkedin.com/in/tushar-gupta-272192215 | 💻 GitHub: github.com/tushar19970" },
  { q: ['open to work','available','looking for job','hire','opportunity','freelance','contract'], a: "Tushar specializes in Android (Java) and cross-platform Flutter development. You can reach out directly via email at tusharkansal09451@gmail.com or via the Contact section to discuss projects and roles!" },
  { q: ['intern','a2d','backend'], a: "Before mobile development, Tushar did a 2-month backend internship at A2D Innovations (Nov 2021–Jan 2022), which sharpened his understanding of client-server architecture." },
  { q: ['play store','publish','release','deployment'], a: "Tushar manages the full Play Store release cycle — versioning, staged rollouts, release notes, and compliance — for 15+ live apps." },
  { q: ['location','city','india','where are you'], a: "Tushar is based in India and is open to remote as well as on-site opportunities." },
];

function getSmartAnswer(msg) {
  const lower = msg.toLowerCase();
  for (const faq of FAQ) {
    if (faq.q.some(kw => lower.includes(kw))) return faq.a;
  }
  return "Great question! For anything beyond what I know, you can reach Tushar directly at 📧 tusharkansal09451@gmail.com or use the Contact form on this page. 😊";
}

function initChatbot() {
  const fab = document.getElementById('chat-fab');
  const panel = document.getElementById('chat-panel');
  const closeBtn = document.getElementById('chat-close');
  const sendBtn = document.getElementById('chat-send');
  const input = document.getElementById('chat-input');
  const messages = document.getElementById('chat-messages');
  if (!fab || !panel) return;

  fab.addEventListener('click', () => {
    panel.classList.toggle('open');
    fab.setAttribute('aria-expanded', panel.classList.contains('open'));
    if (panel.classList.contains('open')) input.focus();
  });
  closeBtn?.addEventListener('click', () => panel.classList.remove('open'));

  function sendMessage() {
    const msg = input.value.trim();
    if (!msg) return;
    appendMessage(msg, 'user');
    input.value = '';
    const typing = appendTyping();
    setTimeout(() => { typing.remove(); appendMessage(getSmartAnswer(msg), 'bot'); }, 800 + Math.random() * 500);
  }

  sendBtn.addEventListener('click', sendMessage);
  input.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } });

  function getTime() {
    const d = new Date();
    return d.getHours().toString().padStart(2,'0') + ':' + d.getMinutes().toString().padStart(2,'0');
  }

  function appendMessage(text, role) {
    const div = document.createElement('div');
    div.className = `chat-msg ${role}`;
    div.innerHTML = role === 'bot'
      ? `<div class="chat-avatar-sm">🤖</div><div><div class="chat-bubble-msg">${escapeHtml(text)}</div><div class="chat-time">${getTime()}</div></div>`
      : `<div><div class="chat-bubble-msg">${escapeHtml(text)}</div><div class="chat-time" style="text-align:right">${getTime()}</div></div><div class="chat-avatar-sm" style="background:linear-gradient(135deg,#7c3aed,#3b82f6)">👤</div>`;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
    return div;
  }

  function appendTyping() {
    const div = document.createElement('div');
    div.className = 'chat-msg bot';
    div.innerHTML = `<div class="chat-avatar-sm">🤖</div><div class="chat-bubble-msg" style="padding:0.5rem 0.85rem"><div class="typing-indicator"><span></span><span></span><span></span></div></div>`;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
    return div;
  }
}

function escapeHtml(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function downloadResume() {

    const fileId = "1gisfSy5Pdn0DZUB1_yAR923bKA72HyJW";   // Your File ID
    
    const downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
    
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = "Tushar_Gupta_Resume.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
