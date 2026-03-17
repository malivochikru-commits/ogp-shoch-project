// ══════════════════════════════════════════════════
//  SHARED JS — Human Rights Website
//  Cursor, Particles, Preloader, Nav, Page Transitions
// ══════════════════════════════════════════════════

window.addEventListener('load', function () {
  gsap.registerPlugin(ScrollTrigger);

  // ── CURSOR ──
  var dot = document.getElementById('cdot');
  var ring = document.getElementById('cring');
  if (dot && ring) {
    var mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;
    document.addEventListener('mousemove', function (e) { mx = e.clientX; my = e.clientY; });
    (function loop() {
      rx += (mx - rx) * .12; ry += (my - ry) * .12;
      dot.style.left = mx + 'px'; dot.style.top = my + 'px';
      ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
      requestAnimationFrame(loop);
    })();
    document.querySelectorAll('a, button, .topic-card, .info-card, .video-card').forEach(function (el) {
      el.addEventListener('mouseenter', function () { ring.style.width = '54px'; ring.style.height = '54px'; ring.style.borderColor = 'rgba(79,142,247,.9)'; });
      el.addEventListener('mouseleave', function () { ring.style.width = '36px'; ring.style.height = '36px'; ring.style.borderColor = 'rgba(79,142,247,.6)'; });
    });
  }

  // ── PARTICLES CANVAS ──
  var cv = document.getElementById('bg-canvas');
  if (cv) {
    var cx = cv.getContext('2d'), pts = [];
    function rsz() { cv.width = innerWidth; cv.height = innerHeight; }
    rsz(); window.addEventListener('resize', rsz);
    for (var i = 0; i < 60; i++) pts.push({
      x: Math.random() * innerWidth, y: Math.random() * innerHeight,
      vx: (Math.random() - .5) * .3, vy: -Math.random() * .4 - .05,
      r: Math.random() * 1.2 + .3,
      op: Math.random() * .28 + .06,
      life: Math.random(),
      col: Math.random() > .6 ? '168,85,247' : '79,142,247'
    });
    (function dp() {
      cx.clearRect(0, 0, cv.width, cv.height);
      pts.forEach(function (p) {
        p.x += p.vx; p.y += p.vy; p.life += .002;
        if (p.y < -5 || p.life > 1) { p.x = Math.random() * innerWidth; p.y = innerHeight + 5; p.life = 0; }
        var a = Math.sin(p.life * Math.PI) * p.op;
        cx.beginPath(); cx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        cx.fillStyle = 'rgba(' + p.col + ',' + a + ')'; cx.fill();
      });
      // connection lines between close particles
      for (var j = 0; j < pts.length; j++) {
        for (var k = j + 1; k < pts.length; k++) {
          var dx = pts[j].x - pts[k].x, dy = pts[j].y - pts[k].y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 80) {
            cx.beginPath();
            cx.moveTo(pts[j].x, pts[j].y); cx.lineTo(pts[k].x, pts[k].y);
            cx.strokeStyle = 'rgba(79,142,247,' + ((.06) * (1 - dist / 80)) + ')';
            cx.lineWidth = .5; cx.stroke();
          }
        }
      }
      requestAnimationFrame(dp);
    })();
  }

  // ── PRELOADER ──
  var numEl = document.getElementById('pre-num');
  var fillEl = document.getElementById('pre-fill');
  var preEl = document.getElementById('preloader');
  if (preEl && numEl && fillEl) {
    var val = 0;
    var iv = setInterval(function () {
      val += Math.random() * 4 + 1.5;
      if (val >= 100) { val = 100; clearInterval(iv); setTimeout(preloaderDone, 2500); }
      numEl.textContent = Math.floor(val);
      fillEl.style.width = val + '%';
    }, 28);
    function preloaderDone() {
      gsap.to(preEl, { yPercent: -105, duration: 1.1, ease: 'expo.inOut', onComplete: function () { preEl.style.display = 'none'; startPageAnim(); } });
    }
  } else {
    startPageAnim();
  }

  // ── NAV SCROLL ──
  var navEl = document.getElementById('main-nav');
  if (navEl) {
    window.addEventListener('scroll', function () {
      navEl.classList.toggle('scrolled', scrollY > 50);
    });
    // Highlight active nav link
    var path = location.pathname.split('/').pop() || 'index.html';
    navEl.querySelectorAll('.nav-links a').forEach(function (a) {
      var href = a.getAttribute('href').split('/').pop();
      if (href === path) a.classList.add('active');
    });
  }

  // ── MOBILE NAV ──
  var burger = document.getElementById('nav-burger');
  var mobileNav = document.getElementById('nav-mobile');
  var mobileClose = document.getElementById('nav-close');
  if (burger && mobileNav) {
    burger.addEventListener('click', function () { mobileNav.classList.add('open'); });
    if (mobileClose) mobileClose.addEventListener('click', function () { mobileNav.classList.remove('open'); });
    mobileNav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { mobileNav.classList.remove('open'); });
    });
  }

  // ── PAGE TRANSITIONS ──
  var overlay = document.getElementById('page-transition');
  document.querySelectorAll('a[href]').forEach(function (a) {
    var href = a.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto')) return;
    a.addEventListener('click', function (e) {
      e.preventDefault();
      if (overlay) {
        gsap.to(overlay, {
          yPercent: -100, duration: .7, ease: 'expo.in',
          onComplete: function () { window.location.href = href; }
        });
        overlay.style.transform = 'translateY(100%)';
        gsap.set(overlay, { yPercent: 100 });
        gsap.to(overlay, {
          yPercent: 0, duration: .5, ease: 'expo.out', onComplete: function () {
            gsap.to(overlay, { yPercent: -100, duration: .6, ease: 'expo.in', delay: .05, onComplete: function () { window.location.href = href; } });
          }
        });
      } else {
        window.location.href = href;
      }
    });
  });

  // ── START PAGE ANIMATION ──
  function startPageAnim() {
    var tl = gsap.timeline();
    tl.from('#main-nav', { y: -50, opacity: 0, duration: .7, ease: 'expo.out' })
      .from('.hero-eyebrow', { y: 30, opacity: 0, duration: .6, ease: 'expo.out' }, '-=.3')
      .from('.hero-title .line', { y: 90, opacity: 0, rotateX: -70, transformOrigin: 'bottom', duration: .8, stagger: .13, ease: 'back.out(1.4)' }, '-=.3')
      .from('.hero-desc', { y: 24, opacity: 0, duration: .7, ease: 'expo.out' }, '-=.35')
      .from('.hero-btns', { y: 20, opacity: 0, duration: .6, ease: 'expo.out' }, '-=.3')
      .from('.hero-number', { opacity: 0, x: 60, duration: 1, ease: 'expo.out' }, '-=.8')
      .from('.hero-orb', { scale: 0, opacity: 0, duration: 1.2, stagger: .3, ease: 'expo.out' }, '-=1');

    // Marquee
    gsap.from('.marquee-strip', { scrollTrigger: { trigger: '.marquee-strip', start: 'top 90%' }, y: 30, opacity: 0, duration: .7 });

    // Section reveals
    gsap.utils.toArray('.sec-label').forEach(function (el) {
      gsap.from(el, { scrollTrigger: { trigger: el, start: 'top 88%' }, x: -40, opacity: 0, duration: .7, ease: 'expo.out' });
    });
    gsap.utils.toArray('.sec-title').forEach(function (el) {
      gsap.from(el, { scrollTrigger: { trigger: el, start: 'top 88%' }, y: 50, opacity: 0, duration: .8, ease: 'expo.out' });
    });
    gsap.utils.toArray('.sec-sub').forEach(function (el) {
      gsap.from(el, { scrollTrigger: { trigger: el, start: 'top 88%' }, y: 30, opacity: 0, duration: .7, ease: 'expo.out', delay: .1 });
    });

    // Info cards
    gsap.utils.toArray('.info-card').forEach(function (el, i) {
      gsap.from(el, { scrollTrigger: { trigger: el, start: 'top 86%' }, y: 60, opacity: 0, scale: .97, duration: .8, ease: 'expo.out', delay: (i % 4) * .1 });
    });
    // Topic cards
    gsap.utils.toArray('.topic-card').forEach(function (el, i) {
      gsap.from(el, { scrollTrigger: { trigger: el, start: 'top 88%' }, y: 50, opacity: 0, duration: .7, ease: 'expo.out', delay: (i % 3) * .1 });
    });
    // Video cards
    gsap.utils.toArray('.video-card').forEach(function (el, i) {
      gsap.from(el, { scrollTrigger: { trigger: el, start: 'top 88%' }, y: 40, opacity: 0, duration: .7, ease: 'expo.out', delay: (i % 3) * .12 });
    });
    // Quote blocks
    gsap.utils.toArray('.quote-block').forEach(function (el) {
      gsap.from(el, { scrollTrigger: { trigger: el, start: 'top 86%' }, x: -30, opacity: 0, duration: .8, ease: 'expo.out' });
    });
    // Timeline items
    gsap.utils.toArray('.tl-item').forEach(function (el, i) {
      var tl2 = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 84%' } });
      tl2.from(el, { x: -40, opacity: 0, duration: .7, ease: 'expo.out' })
        .from(el.querySelector('.tl-dot'), { scale: 0, duration: .4, ease: 'back.out(3)' }, '-=.5')
        .from(el.querySelector('.tl-label'), { opacity: 0, x: 16, duration: .4 }, '-=.3')
        .from([el.querySelector('.tl-head'), el.querySelector('.tl-sub')], { opacity: 0, y: 10, stagger: .08, duration: .4 }, '-=.2')
        .from(el.querySelector('.tl-body'), { opacity: 0, y: 8, duration: .4 }, '-=.1');
    });
    // Stat items
    gsap.utils.toArray('.stat-item').forEach(function (el, i) {
      gsap.from(el, { scrollTrigger: { trigger: el, start: 'top 88%' }, y: 30, opacity: 0, duration: .6, ease: 'expo.out', delay: i * .08 });
    });
    // Arrow lists
    gsap.utils.toArray('.arrow-list li').forEach(function (el, i) {
      gsap.from(el, { scrollTrigger: { trigger: el, start: 'top 90%' }, x: -20, opacity: 0, duration: .5, ease: 'expo.out', delay: i * .06 });
    });

    // Card tilt
    document.querySelectorAll('.info-card, .topic-card, .video-card').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var r = card.getBoundingClientRect();
        var dx = (e.clientX - r.left) / r.width - .5;
        var dy = (e.clientY - r.top) / r.height - .5;
        gsap.to(card, { rotateY: dx * 8, rotateX: -dy * 8, transformPerspective: 900, duration: .3, ease: 'power2.out' });
      });
      card.addEventListener('mouseleave', function () {
        gsap.to(card, { rotateY: 0, rotateX: 0, duration: .7, ease: 'elastic.out(1,.5)' });
      });
    });

    // Parallax hero
    gsap.to('.hero-number', { scrollTrigger: { trigger: '.page-hero', scrub: 1 }, yPercent: 20, opacity: 0 });
    gsap.to('.hero-orb-1', { scrollTrigger: { trigger: '.page-hero', scrub: 1.5 }, yPercent: -20 });
    gsap.to('.hero-orb-2', { scrollTrigger: { trigger: '.page-hero', scrub: 2 }, yPercent: -30 });
  }
});
