/* ================================================
   LUNA SAHNE — script.js  (Premium v2)
   1. Navbar scroll
   2. Hamburger menü
   3. Seans filtre sistemi
   4. İletişim formu
   5. Aktif nav link (Intersection Observer)
   6. Floating bilet butonu
   7. Reveal animasyonları
   8. Stats sayaç animasyonu
   ================================================ */

/* ---------- 1. NAVBAR SCROLL ---------- */
(function () {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  let ticking = false;
  function update() {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }, { passive: true });
  update();
})();


/* ---------- 2. HAMBURGERmenü ---------- */
(function () {
  const btn  = document.getElementById('hamburger');
  const menu = document.getElementById('navLinks');
  if (!btn || !menu) return;

  function close() {
    menu.classList.remove('open');
    btn.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
  function toggle() {
    const open = menu.classList.toggle('open');
    btn.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  }

  btn.addEventListener('click', toggle);
  menu.querySelectorAll('.nav-link').forEach(l => l.addEventListener('click', close));
  document.addEventListener('click', e => {
    if (menu.classList.contains('open') && !menu.contains(e.target) && !btn.contains(e.target)) close();
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
})();


/* ---------- 3. SEANS FİLTRELEME ---------- */
(function () {
  const btns  = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('#sessionsGrid .session-card');
  if (!btns.length || !cards.length) return;

  /* Geçiş stili: her kart için başta hazırla */
  cards.forEach(c => {
    c.style.transition = 'opacity 0.32s ease, transform 0.32s ease, border-color 0.3s, box-shadow 0.3s, background 0.3s';
  });

  btns.forEach(btn => {
    btn.addEventListener('click', function () {
      const f = this.dataset.filter;

      btns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');

      cards.forEach((card, i) => {
        const show =
          f === 'all' ? true :
          f === 'week'  ? card.dataset.week  === 'true' :
          f === 'month' ? card.dataset.month === 'true' : true;

        if (show) {
          card.classList.remove('hidden');
          /* Stagger: 60ms aralıklarla belirsin */
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = '';
          }, i * 60);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(8px)';
          setTimeout(() => card.classList.add('hidden'), 320);
        }
      });
    });
  });
})();


/* ---------- 4. İLETİŞİM FORMU ---------- */
(function () {
  const form     = document.getElementById('contactForm');
  const feedback = document.getElementById('formFeedback');
  if (!form || !feedback) return;

  function showFeedback(msg, type) {
    feedback.textContent = msg;
    feedback.className   = 'form-feedback ' + type;
    if (type === 'success') setTimeout(() => { feedback.className = 'form-feedback'; }, 5500);
  }

  function isEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const name    = form.querySelector('#name').value.trim();
    const email   = form.querySelector('#email').value.trim();
    const message = form.querySelector('#message').value.trim();

    if (!name)          { showFeedback('Lütfen adınızı girin.', 'error'); form.querySelector('#name').focus(); return; }
    if (!isEmail(email)){ showFeedback('Geçerli bir e-posta adresi girin.', 'error'); form.querySelector('#email').focus(); return; }
    if (!message)       { showFeedback('Mesaj alanı boş bırakılamaz.', 'error'); form.querySelector('#message').focus(); return; }

    const submitBtn = form.querySelector('[type="submit"]');
    submitBtn.disabled    = true;
    submitBtn.textContent = 'Gönderiliyor…';

    setTimeout(() => {
      showFeedback('✓ Mesajınız alındı! En kısa sürede size dönüş yapacağız.', 'success');
      form.reset();
      submitBtn.disabled    = false;
      submitBtn.innerHTML   = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg> Mesaj Gönder`;
    }, 1400);
  });
})();


/* ---------- 5. AKTİF NAV LİNK ---------- */
(function () {
  const links    = document.querySelectorAll('.nav-link:not(.nav-cta)');
  const sections = document.querySelectorAll('section[id]');
  if (!links.length || !sections.length) return;

  function activate(id) {
    links.forEach(l => {
      const match = l.getAttribute('href') === '#' + id;
      l.style.color = match ? 'var(--gold)' : '';
    });
  }

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) activate(e.target.id); });
  }, { rootMargin: '-45% 0px -55% 0px', threshold: 0 });

  sections.forEach(s => io.observe(s));
})();


/* ---------- 6. FLOATING BİLET BUTONU ---------- */
(function () {
  const btn  = document.getElementById('floatingTicket');
  const hero = document.getElementById('hero');
  if (!btn || !hero) return;

  btn.style.opacity        = '0';
  btn.style.pointerEvents  = 'none';
  btn.style.transition     = 'opacity 0.35s ease, transform 0.28s cubic-bezier(0.16,1,0.3,1), box-shadow 0.28s';

  let ticking = false;
  function update() {
    const heroBottom = hero.getBoundingClientRect().bottom;
    const show       = heroBottom < 0;
    btn.style.opacity       = show ? '1' : '0';
    btn.style.pointerEvents = show ? 'auto' : 'none';
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }, { passive: true });
  update();
})();


/* ---------- 7. REVEAL ANİMASYONLARI (Intersection Observer) ---------- */
(function () {
  const targets = document.querySelectorAll(
    '.cast-card, .session-card, .review-card, .detail-card, ' +
    '.gallery-card, .contact-form-wrapper, .contact-info-col, ' +
    '.stat-item, .about-quote, .footer-cta-band'
  );
  if (!targets.length || !('IntersectionObserver' in window)) return;

  targets.forEach((el, i) => {
    el.style.opacity   = '0';
    el.style.transform = 'translateY(28px)';
    el.style.transition = `opacity 0.6s ease ${(i % 5) * 70}ms, transform 0.6s cubic-bezier(0.16,1,0.3,1) ${(i % 5) * 70}ms`;
  });

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.opacity   = '1';
        e.target.style.transform = 'translateY(0)';
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  targets.forEach(el => io.observe(el));
})();


/* ---------- 8. STATS SAYAÇ ANİMASYONU ---------- */
(function () {
  const nums = document.querySelectorAll('.stat-num');
  if (!nums.length || !('IntersectionObserver' in window)) return;

  function animateCount(el) {
    const raw    = el.textContent.trim();           /* örn: "28+", "12K+", "%98" */
    const prefix = raw.match(/^[%]/)  ? raw[0] : '';
    const suffix = raw.match(/[+K%]+$/) ? raw.match(/[+K%]+$/)[0] : '';
    const num    = parseFloat(raw.replace(/[^0-9.]/g, '')) || 0;
    const isK    = suffix.includes('K');
    const dur    = 1600;
    const start  = performance.now();

    function tick(now) {
      const p  = Math.min((now - start) / dur, 1);
      const e  = 1 - Math.pow(1 - p, 4);            /* ease-out quart */
      const v  = Math.round(e * num);
      el.textContent = prefix + (isK ? v + 'K' : v) + (suffix.replace('K', '') || '');
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { animateCount(e.target); io.unobserve(e.target); }
    });
  }, { threshold: 0.6 });

  nums.forEach(n => io.observe(n));
})();
