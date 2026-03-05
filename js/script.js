/* ============================================================
   PORTFOLIO SCRIPT
   - Custom cursor
   - Navbar scroll & mobile toggle
   - Typing effect
   - Scroll reveal
   - Counter animation
   - Skill bar fill
   - Project filter
   - Contact form
   - Back-to-top button
   ============================================================ */

(function () {
  'use strict';

  /* ── Helpers ──────────────────────────────────────────────── */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  /* ── Custom Cursor ────────────────────────────────────────── */
  const cursor = $('#cursor');
  const follower = $('#cursorFollower');

  if (cursor && follower) {
    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.left = mouseX + 'px';
      cursor.style.top  = mouseY + 'px';
    });

    // Smooth follower with RAF
    function animateFollower() {
      followerX += (mouseX - followerX) * 0.12;
      followerY += (mouseY - followerY) * 0.12;
      follower.style.left = followerX + 'px';
      follower.style.top  = followerY + 'px';
      requestAnimationFrame(animateFollower);
    }
    animateFollower();

    // Hover effect on interactive elements
    const hoverEls = $$('a, button, input, textarea, .skill-item, .project-card, .stat-card, .filter-btn');
    hoverEls.forEach((el) => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('active');
        follower.classList.add('active');
      });
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('active');
        follower.classList.remove('active');
      });
    });
  }

  /* ── Navbar ───────────────────────────────────────────────── */
  const navbar   = $('#navbar');
  const hamburger = $('#hamburger');
  const navLinks  = $('#navLinks');

  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });
  }

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navLinks.classList.toggle('open');
    });
    // Close on link click
    $$('.nav-link', navLinks).forEach((link) => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
      });
    });
  }

  /* Active nav link on scroll */
  const sections = $$('section[id]');
  const navLinkEls = $$('.nav-link');

  function updateActiveNav() {
    const scrollY = window.scrollY + 80;
    sections.forEach((sec) => {
      if (
        scrollY >= sec.offsetTop &&
        scrollY < sec.offsetTop + sec.offsetHeight
      ) {
        navLinkEls.forEach((l) => l.classList.remove('active'));
        const active = navLinkEls.find((l) => l.getAttribute('href') === '#' + sec.id);
        if (active) active.classList.add('active');
      }
    });
  }
  window.addEventListener('scroll', updateActiveNav, { passive: true });

  /* ── Typing Effect ────────────────────────────────────────── */
  const typedEl = $('#typedText');

  if (typedEl) {
    const words = [
      'Full-Stack Developer',
      'UI/UX Enthusiast',
      'Open-Source Contributor',
      'Problem Solver',
    ];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let pauseTimeout = null;

    function type() {
      const current = words[wordIndex];

      if (isDeleting) {
        charIndex--;
      } else {
        charIndex++;
      }

      typedEl.textContent = current.slice(0, charIndex);

      let delay = isDeleting ? 60 : 110;

      if (!isDeleting && charIndex === current.length) {
        // Pause at end of word
        delay = 1800;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        delay = 400;
      }

      clearTimeout(pauseTimeout);
      pauseTimeout = setTimeout(type, delay);
    }

    // Start typing after short delay
    setTimeout(type, 800);
  }

  /* ── Scroll Reveal ────────────────────────────────────────── */
  const revealEls = $$('.reveal');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  revealEls.forEach((el) => observer.observe(el));

  /* ── Counter Animation ─────────────────────────────────────── */
  const statNumbers = $$('.stat-number[data-target]');

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 }
  );

  statNumbers.forEach((el) => counterObserver.observe(el));

  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const duration = 1400;
    const startTime = performance.now();

    function update(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out quart
      const eased = 1 - Math.pow(1 - progress, 4);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  /* ── Skill Bars ───────────────────────────────────────────── */
  const skillBars = $$('.skill-bar-fill[data-width]');

  const barObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.width = entry.target.dataset.width + '%';
          barObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  skillBars.forEach((bar) => barObserver.observe(bar));

  /* ── Project Filter ───────────────────────────────────────── */
  const filterBtns  = $$('.filter-btn');
  const projectCards = $$('.project-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      projectCards.forEach((card) => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  /* ── Contact Form ─────────────────────────────────────────── */
  const contactForm = $('#contactForm');
  const formSuccess = $('#formSuccess');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let valid = true;

      $$('input, textarea', contactForm).forEach((field) => {
        field.classList.remove('error');
        if (!field.value.trim()) {
          field.classList.add('error');
          valid = false;
        }
      });

      // Simple email validation
      const emailField = $('#email');
      if (emailField && emailField.value) {
        const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRe.test(emailField.value)) {
          emailField.classList.add('error');
          valid = false;
        }
      }

      if (!valid) return;

      // Simulate submission
      const submitBtn = contactForm.querySelector('[type="submit"]');
      const submitSpan = submitBtn && submitBtn.querySelector('span');
      if (submitBtn) {
        submitBtn.disabled = true;
        if (submitSpan) submitSpan.textContent = 'Sending…';
      }

      setTimeout(() => {
        contactForm.reset();
        if (submitBtn) {
          submitBtn.disabled = false;
          if (submitSpan) submitSpan.textContent = 'Send Message';
        }
        if (formSuccess) {
          formSuccess.classList.add('show');
          setTimeout(() => formSuccess.classList.remove('show'), 5000);
        }
      }, 1200);
    });

    // Remove error state on input
    $$('input, textarea', contactForm).forEach((field) => {
      field.addEventListener('input', () => field.classList.remove('error'));
    });
  }

  /* ── Back To Top ──────────────────────────────────────────── */
  const backToTop = $('#backToTop');

  if (backToTop) {
    window.addEventListener('scroll', () => {
      backToTop.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ── Footer Year ──────────────────────────────────────────── */
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ── Smooth scroll for anchor links ─────────────────────────── */
  $$('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

})();
