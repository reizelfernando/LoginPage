/* =============================================
   main.js — upstaff Academy
   Handles: intro animation + theme toggle

   ANIMATION SEQUENCE:
   ─────────────────────────────────────────────
   0.0s  Page loads
         → Intro overlay visible (slideshow plays)
         → Large logo centered on screen

   2.5s  Logo begins shrinking + flying to top-left
         (CSS transition kicks in via .move-to-nav)

   3.4s  Logo lands in nav bar position
         → Nav logo mark fades in (illusion of landing)
         → Brand name "upstaff" slides/wipes in

   3.8s  Nav links + CTA button fade in

   4.1s  Intro overlay fades out
         → Main page fades in
         → Hero slideshow continues seamlessly
         → Hero text staggers in (CSS transition-delay)
         → Page scroll is unlocked
   ─────────────────────────────────────────────
============================================= */


/* ── GRAB DOM ELEMENTS ─────────────────────── */

const introOverlay = document.getElementById('intro-overlay');
const introLogoWrap = document.getElementById('intro-logo-wrap');
const navLogoMark   = document.getElementById('nav-logo-mark');
const navBrandName  = document.getElementById('nav-brand-name');
const navLinks      = document.getElementById('nav-links');
const ctaBtn        = document.querySelector('.cta-btn');
const headerButtons = document.querySelector('.header-buttons');
const mainPage      = document.getElementById('main-page');
const themeToggle   = document.getElementById('theme-toggle');


/* ── HELPER: Calculate where the logo should fly ──
   Reads the live pixel position of the nav logo mark
   so the flying intro logo lands exactly on top of it,
   regardless of screen size or font-load shifts.
─────────────────────────────────────────────────── */
function getLogoTargetPosition() {
  const navRect = navLogoMark.getBoundingClientRect();

  // Intro logo is 160px wide (set in CSS); nav mark is 42px.
  // Scale = target size / original size
  const introLogoSize = 160;
  const scale = navRect.width / introLogoSize;

  // When .move-to-nav is applied, the transform changes from
  // translate(-50%,-50%) to scale() only.
  // So top/left must point to the nav mark's exact position —
  // no offset needed because translate(0,0) is used in the end state.
  return {
    top:   navRect.top,
    left:  navRect.left,
    scale: scale
  };
}


/* ── INTRO ANIMATION SEQUENCE ──────────────────── */
function runIntroAnimation() {

  // ── Phase 1 ─────────────────────────────────
  // After 2.5s, fly the logo toward the nav bar.
  setTimeout(() => {

    // Use requestAnimationFrame to ensure the browser has fully
    // laid out the nav bar before we measure its position.
    // This prevents the logo from flying to (0,0) if the
    // nav hasn't painted yet.
    requestAnimationFrame(() => {
      const target = getLogoTargetPosition();

      // Safety check — if navLogoMark has no size yet, retry once
      if (target.scale === 0 || isNaN(target.scale)) {
        setTimeout(() => {
          const t2 = getLogoTargetPosition();
          introLogoWrap.style.setProperty('--logo-target-top',   t2.top   + 'px');
          introLogoWrap.style.setProperty('--logo-target-left',  t2.left  + 'px');
          introLogoWrap.style.setProperty('--logo-target-scale', t2.scale);
          introLogoWrap.classList.add('move-to-nav');
        }, 100);
        return;
      }

      introLogoWrap.style.setProperty('--logo-target-top',   target.top   + 'px');
      introLogoWrap.style.setProperty('--logo-target-left',  target.left  + 'px');
      introLogoWrap.style.setProperty('--logo-target-scale', target.scale);

      // Triggers the CSS transition: top + left + scale all animate
      introLogoWrap.classList.add('move-to-nav');
    });

  }, 2500);


  // ── Phase 2 ─────────────────────────────────
  // After the logo finishes flying (2500 + 900ms),
  // snap in the nav logo mark and reveal the brand name.
  setTimeout(() => {

    // The nav logo mark appears — looks like the logo "arrived"
    navLogoMark.classList.add('visible');

    // Brand name wipes in from left using clip-path + translateX
    navBrandName.classList.add('revealed');

  }, 2500 + 900);


  // ── Phase 3 ─────────────────────────────────
  // Nav links + CTA button fade up shortly after.
  setTimeout(() => {

    navLinks.classList.add('visible');
    if (headerButtons) headerButtons.classList.add('visible');

  }, 2500 + 900 + 400);


  // ── Phase 4 ─────────────────────────────────
  // Fade out the overlay, reveal the page.
  setTimeout(() => {

    // Fade out the intro overlay (CSS handles the 0.5s transition)
    introOverlay.classList.add('fade-out');

    // Fade in the main page (triggers hero text CSS animations)
    mainPage.classList.add('visible');

    // Allow the user to scroll again
    document.body.classList.add('unlocked');

    // Once the overlay has fully faded, remove it from the DOM
    setTimeout(() => {
      introOverlay.style.display = 'none';
      introLogoWrap.style.display = 'none';
    }, 600);

  }, 2500 + 900 + 500);

}


/* ── THEME TOGGLE ──────────────────────────────
   Switches between dark (default) and light mode.
   Saves preference to localStorage so it persists.
─────────────────────────────────────────────────── */

// Restore saved theme on page load
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
  document.documentElement.setAttribute('data-theme', 'light');
}

// Toggle on button click
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';

    if (isLight) {
      // Switch to dark mode
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'dark');
    } else {
      // Switch to light mode
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
    }
  });
}


/* ── PREVENT DEFAULT on placeholder links ──────── */
document.querySelectorAll('a[href="#"]').forEach(link => {
  link.addEventListener('click', e => e.preventDefault());
});


/* ── START ──────────────────────────────────────
   Kick off the intro animation once the DOM is ready.
─────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  runIntroAnimation();
});
