/* ==============================================
   LUNA SAHNE TİYATROSU — script.js
   İçerik:
     1. Navbar scroll efekti
     2. Hamburger menü (mobil)
     3. Seans filtre sistemi
     4. İletişim formu doğrulaması
     5. Smooth scroll + aktif nav link
     6. Kayan (floating) bilet butonu göster/gizle
     7. Yükleme animasyonları (Intersection Observer)
   ============================================== */

/* ------------------------------------------
   1. NAVBAR — Scroll'da arka plan ekleme
------------------------------------------ */
(function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  function handleScroll() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  // Sayfa ilk açıldığında kontrol et
  handleScroll();

  // Scroll olayını dinle (throttle ile performans iyileştirme)
  let scrollTimer;
  window.addEventListener('scroll', function () {
    if (!scrollTimer) {
      scrollTimer = requestAnimationFrame(function () {
        handleScroll();
        scrollTimer = null;
      });
    }
  }, { passive: true });
})();


/* ------------------------------------------
   2. HAMBURGERmenü — Mobil menü aç/kapat
------------------------------------------ */
(function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  if (!hamburger || !navLinks) return;

  // Menüyü aç/kapat
  function toggleMenu() {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
    // Arka plan kaydırmayı engelle
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  // Menüyü kapat
  function closeMenu() {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', toggleMenu);

  // Bir menü linkine tıklayınca menü kapansın
  navLinks.querySelectorAll('.nav-link').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  // Menü dışına tıklayınca kapat
  document.addEventListener('click', function (e) {
    if (navLinks.classList.contains('open') &&
        !navLinks.contains(e.target) &&
        !hamburger.contains(e.target)) {
      closeMenu();
    }
  });

  // ESC tuşuyla menüyü kapat
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
  });
})();


/* ------------------------------------------
   3. SEANS FİLTRELEME — Bu hafta / Bu ay / Tümü
------------------------------------------ */
(function initSessionFilter() {
  const filterBtns   = document.querySelectorAll('.filter-btn');
  const sessionCards = document.querySelectorAll('#sessionsGrid .session-card');
  if (!filterBtns.length || !sessionCards.length) return;

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const filter = btn.dataset.filter; // 'all' | 'week' | 'month'

      // Aktif buton stili
      filterBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');

      // Her kartı filtrele
      sessionCards.forEach(function (card) {
        let show = false;

        if (filter === 'all') {
          show = true;
        } else if (filter === 'week') {
          show = card.dataset.week === 'true';
        } else if (filter === 'month') {
          show = card.dataset.month === 'true';
        }

        // Yumuşak geçiş: önce opacity, sonra display
        if (show) {
          card.classList.remove('hidden');
          // Küçük gecikmeyle opacity geçişi için reflow tetikle
          requestAnimationFrame(function () {
            card.style.opacity = '1';
            card.style.transform = '';
          });
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          // Geçiş bittikten sonra gizle
          setTimeout(function () { card.classList.add('hidden'); }, 300);
        }
      });
    });
  });

  // Kart geçiş stil ayarı
  sessionCards.forEach(function (card) {
    card.style.transition = 'opacity 0.3s ease, transform 0.3s ease, border-color 0.35s ease, box-shadow 0.35s ease';
  });
})();


/* ------------------------------------------
   4. İLETİŞİM FORMU — Basit doğrulama + geri bildirim
------------------------------------------ */
(function initContactForm() {
  const form     = document.getElementById('contactForm');
  const feedback = document.getElementById('formFeedback');
  if (!form || !feedback) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const name    = form.querySelector('#name').value.trim();
    const email   = form.querySelector('#email').value.trim();
    const message = form.querySelector('#message').value.trim();

    // Basit doğrulama
    if (!name) {
      showFeedback('Lütfen adınızı girin.', 'error');
      form.querySelector('#name').focus();
      return;
    }

    if (!isValidEmail(email)) {
      showFeedback('Lütfen geçerli bir e-posta adresi girin.', 'error');
      form.querySelector('#email').focus();
      return;
    }

    if (!message) {
      showFeedback('Lütfen mesajınızı girin.', 'error');
      form.querySelector('#message').focus();
      return;
    }

    // Başarılı gönderim simülasyonu
    const submitBtn = form.querySelector('[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Gönderiliyor…';

    // Gerçek bir arka uç olmadığından 1.5s sonra başarı mesajı göster
    setTimeout(function () {
      showFeedback('✓ Mesajınız alındı! En kısa sürede size ulaşacağız.', 'success');
      form.reset();
      submitBtn.disabled = false;
      submitBtn.textContent = 'Mesaj Gönder';
    }, 1500);
  });

  /** Geri bildirim mesajını göster */
  function showFeedback(message, type) {
    feedback.textContent = message;
    feedback.className = 'form-feedback ' + type;
    feedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    // Başarı mesajı 5s sonra kaybolsun
    if (type === 'success') {
      setTimeout(function () {
        feedback.className = 'form-feedback';
        feedback.textContent = '';
      }, 5000);
    }
  }

  /** E-posta format kontrolü */
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
})();


/* ------------------------------------------
   5. SMOOTH SCROLL + AKTİF NAV LİNK
      (Intersection Observer ile hangi bölümde
       olduğunu takip eder)
------------------------------------------ */
(function initActiveNav() {
  const navLinks = document.querySelectorAll('.nav-link:not(.nav-cta)');
  const sections = document.querySelectorAll('section[id]');
  if (!navLinks.length || !sections.length) return;

  // Aktif link stilini güncelle
  function setActiveLink(id) {
    navLinks.forEach(function (link) {
      const href = link.getAttribute('href');
      if (href === '#' + id) {
        link.style.color = 'var(--gold)';
      } else {
        link.style.color = '';
      }
    });
  }

  // Her bölüm için observer
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        setActiveLink(entry.target.id);
      }
    });
  }, {
    rootMargin: '-50% 0px -50% 0px', // Ortada olanı aktif yap
    threshold: 0
  });

  sections.forEach(function (section) {
    observer.observe(section);
  });
})();


/* ------------------------------------------
   6. FLOATING BİLET BUTONU — Scroll'da göster/gizle
      Hero bölümünde zaten büyük buton olduğu için
      floating buton hero geçene kadar gizlenir
------------------------------------------ */
(function initFloatingBtn() {
  const btn  = document.getElementById('floatingTicket');
  const hero = document.getElementById('hero');
  if (!btn || !hero) return;

  function updateFloatingBtn() {
    const heroBottom = hero.getBoundingClientRect().bottom;
    // Hero ekrandan çıktıysa butonu göster
    if (heroBottom < 0) {
      btn.style.opacity = '1';
      btn.style.pointerEvents = 'auto';
    } else {
      btn.style.opacity = '0';
      btn.style.pointerEvents = 'none';
    }
  }

  // Başlangıçta gizle
  btn.style.opacity = '0';
  btn.style.transition = 'opacity 0.3s ease';
  btn.style.pointerEvents = 'none';

  window.addEventListener('scroll', updateFloatingBtn, { passive: true });
  updateFloatingBtn();
})();


/* ------------------------------------------
   7. YÜKLEMEANİMASYONLARI — Intersection Observer
      Bölümler görünüm alanına girince yukarıdan
      kayarak belirir
------------------------------------------ */
(function initRevealAnimations() {
  // Animasyon eklenecek elemanları seç
  const targets = document.querySelectorAll(
    '.cast-card, .session-card, .review-card, .detail-card, .gallery-item, .contact-form-wrapper, .contact-info'
  );

  if (!targets.length) return;

  // Başlangıç stili: görünmez ve aşağıda
  targets.forEach(function (el) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
  });

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target); // Bir kez animasyon yeter
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  // Kart gecikmeli animasyon (stagger): aynı grid'deki kartlar sırayla gelsin
  targets.forEach(function (el, index) {
    // Her grup içinde maksimum 4 kart gecikmesi uygula
    const delay = (index % 4) * 80;
    el.style.transitionDelay = delay + 'ms';
    observer.observe(el);
  });
})();
