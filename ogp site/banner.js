/**
 * banner.js — инициализация анимированных баннеров на всех секциях
 * Создаёт HTML баннера динамически для каждого элемента .sec-banner
 */
(function() {
  'use strict';

  /* ── HTML-шаблон одного баннера ── */
  function buildBannerHTML(title) {
    return `
      <!-- Волновые слои -->
      <div class="sec-banner__waves">
        <div class="sec-banner__wave sec-banner__wave--1"></div>
        <div class="sec-banner__wave sec-banner__wave--2"></div>
        <div class="sec-banner__wave sec-banner__wave--3"></div>
      </div>

      <!-- Звёздные частицы -->
      <div class="sec-banner__stars" id="banner-stars-${Math.random().toString(36).slice(2,7)}">
      </div>

      <!-- Зелёные сферы -->
      <div class="sec-banner__orb sec-banner__orb--1"></div>
      <div class="sec-banner__orb sec-banner__orb--2"></div>
      <div class="sec-banner__orb sec-banner__orb--3"></div>
      <div class="sec-banner__orb sec-banner__orb--4"></div>
      <div class="sec-banner__orb sec-banner__orb--5"></div>
      <div class="sec-banner__orb sec-banner__orb--6"></div>

      <!-- Корона -->
      <div class="sec-banner__crown">👑</div>

      ${title ? `<div class="sec-banner__title">${title}</div>` : ''}
    `;
  }

  /* ── Генерация звёзд ── */
  function spawnStars(banner) {
    const starsContainer = banner.querySelector('.sec-banner__stars');
    if (!starsContainer) return;
    const count = 18;
    for (let i = 0; i < count; i++) {
      const star = document.createElement('div');
      star.className = 'sec-banner__star';
      const x = 5 + Math.random() * 90;
      const y = 5 + Math.random() * 75;
      const dur  = (2 + Math.random() * 4).toFixed(1) + 's';
      const delay = (Math.random() * 4).toFixed(1) + 's';
      star.style.cssText = `left:${x}%;top:${y}%;--dur:${dur};--delay:${delay};`;
      starsContainer.appendChild(star);
    }
  }

  /* ── Параллакс при движении мыши ── */
  function addParallax(banner) {
    const orbs  = banner.querySelectorAll('.sec-banner__orb');
    const waves = banner.querySelectorAll('.sec-banner__wave');

    banner.addEventListener('mousemove', function(e) {
      const rect = banner.getBoundingClientRect();
      const cx   = (e.clientX - rect.left) / rect.width  - 0.5;  // -0.5 .. 0.5
      const cy   = (e.clientY - rect.top)  / rect.height - 0.5;

      orbs.forEach(function(orb, idx) {
        const factor = 14 + idx * 5;
        orb.style.transform += '';  // reset inline (animation handles base)
        orb.style.translate = `${(cx * factor).toFixed(1)}px ${(cy * factor * 0.5).toFixed(1)}px`;
      });

      waves.forEach(function(wave, idx) {
        const shift = (idx + 1) * 3;
        wave.style.marginLeft = `${(cx * shift).toFixed(1)}px`;
      });
    });

    banner.addEventListener('mouseleave', function() {
      orbs.forEach(function(orb) { orb.style.translate = '0px 0px'; });
      waves.forEach(function(wave) { wave.style.marginLeft = '0px'; });
    });
  }

  /* ── Появление баннера при скролле (Intersection Observer) ── */
  function observeBanners(banners) {
    if (!('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.style.opacity  = '1';
          entry.target.style.transform = 'translateY(0) scale(1)';
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    banners.forEach(function(b) {
      b.style.opacity   = '0';
      b.style.transform = 'translateY(30px) scale(.98)';
      b.style.transition = 'opacity .7s cubic-bezier(.22,1,.36,1), transform .7s cubic-bezier(.22,1,.36,1)';
      io.observe(b);
    });
  }

  /* ── Эффект клика — пульс ── */
  function addClickPulse(banner) {
    banner.addEventListener('click', function(e) {
      const ripple = document.createElement('div');
      const rect   = banner.getBoundingClientRect();
      const size   = Math.max(rect.width, rect.height) * 1.4;
      ripple.style.cssText = [
        'position:absolute',
        'border-radius:50%',
        'pointer-events:none',
        'z-index:30',
        `width:${size}px`,
        `height:${size}px`,
        `left:${e.clientX - rect.left - size/2}px`,
        `top:${e.clientY  - rect.top  - size/2}px`,
        'background:radial-gradient(circle,rgba(76,175,80,.25) 0%,transparent 70%)',
        'transform:scale(0)',
        'animation:bannerRipple .8s ease-out forwards'
      ].join(';');
      banner.appendChild(ripple);
      setTimeout(function() { ripple.remove(); }, 900);
    });
  }

  /* ── Инъекция CSS @keyframes для ripple ── */
  (function injectRippleKeyframes() {
    if (document.getElementById('banner-ripple-kf')) return;
    const s = document.createElement('style');
    s.id = 'banner-ripple-kf';
    s.textContent = '@keyframes bannerRipple{0%{transform:scale(0);opacity:1}100%{transform:scale(1);opacity:0}}';
    document.head.appendChild(s);
  })();

  /* ── Главная инициализация ── */
  function init() {
    const banners = document.querySelectorAll('.sec-banner');
    if (!banners.length) return;

    banners.forEach(function(banner) {
      const title = banner.dataset.title || '';
      // Заполяем баннер только если он пустой
      if (!banner.querySelector('.sec-banner__waves')) {
        banner.innerHTML = buildBannerHTML(title);
        spawnStars(banner);
      }
      addParallax(banner);
      addClickPulse(banner);
    });

    observeBanners(banners);
  }

  /* Запуск после загрузки DOM */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
