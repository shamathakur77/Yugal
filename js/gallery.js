// FILE: gallery.js
/* =============================================================
   gallery.js — adds a Gallery tab to YUGAL.
   - injects a nav button (camera icon, trilingual label) before Wishes
   - builds #panel-gallery: a "+ Add Photo" card, 5 illustrated SVG
     scene postcards (Haldi, Mehndi, Baraat, Pheras, Reception), and
     any user-uploaded photos (base64 in localStorage 'gallery_photos')
   - captions are contenteditable; an "uploaded by" tag shows the
     current persona (me) from localStorage
   - clicking a card opens the shared #lightbox with swipe nav
   Also (non-invasively) wires the new animation hooks into the app:
   celebrateCheck() on a checklist tick, revealPanel()/whoosh on tab
   switch — by wrapping the existing global functions, never editing
   app.js. Depends on globals: lang, me, T, show (from app.js).
   ============================================================= */

(function () {
  'use strict';

  var LS_KEY = 'gallery_photos';

  /* ---------- trilingual labels (gallery.js owns these; lang.js untouched) ---------- */
  var GAL = {
    en: { tab: "Gallery", add: "Add Photo", by: "uploaded by", cap: "Tap to add a caption…", you: "you",
          scenes: { haldi: "Haldi", mehndi: "Mehndi", baraat: "Baraat", pheras: "Pheras", reception: "Reception" } },
    hi: { tab: "गैलरी", add: "फोटो जोड़ें", by: "द्वारा अपलोड", cap: "कैप्शन जोड़ने के लिए टैप करें…", you: "आप",
          scenes: { haldi: "हल्दी", mehndi: "मेहंदी", baraat: "बारात", pheras: "फेरे", reception: "रिसेप्शन" } },
    mr: { tab: "गॅलरी", add: "फोटो जोडा", by: "द्वारे अपलोड", cap: "कॅप्शन जोडण्यासाठी टॅप करा…", you: "तुम्ही",
          scenes: { haldi: "हळद", mehndi: "मेंदी", baraat: "वरात", pheras: "फेरे", reception: "स्वागत समारंभ" } }
  };
  function L() { return GAL[(typeof lang !== 'undefined' && lang) || 'en'] || GAL.en; }

  /* ---------- persona name for the "uploaded by" tag ---------- */
  function meName() {
    var m = (typeof me !== 'undefined' && me) ? me : null;
    if (!m) return L().you;
    try {
      if (typeof T !== 'undefined' && T[lang] && T[lang].people && T[lang].people[m])
        return String(T[lang].people[m]).split(' · ')[0];
    } catch (e) {}
    return m;
  }

  /* =============================================================
     ILLUSTRATED SCENE SVGs — fine-line, gold/rust/teal palette,
     subtle washes only. Each scene is 16/9 (viewBox 320x180).
     ============================================================= */
  function svgFrame(inner, wash) {
    return '<svg viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">' +
      '<defs>' +
      '<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0" stop-color="' + (wash || '#3a1f1a') + '" stop-opacity="0.55"/>' +
      '<stop offset="1" stop-color="#1a0f0a" stop-opacity="0.85"/></linearGradient>' +
      '</defs>' +
      '<rect width="320" height="180" fill="url(#sky)"/>' +
      '<rect x="6" y="6" width="308" height="168" rx="10" fill="none" stroke="#e0a030" stroke-width="0.8" opacity="0.5"/>' +
      inner + '</svg>';
  }
  var G = '#e0a030', GB = '#e8c869', R = '#e8a55f', TL = '#5fa89c';

  function sceneHaldi() {
    // sun + turmeric bowls + flowers
    var rays = '';
    for (var i = 0; i < 12; i++) {
      var a = i * 30 * Math.PI / 180;
      rays += '<line x1="' + (160 + Math.cos(a) * 26).toFixed(1) + '" y1="' + (60 + Math.sin(a) * 26).toFixed(1) +
        '" x2="' + (160 + Math.cos(a) * 38).toFixed(1) + '" y2="' + (60 + Math.sin(a) * 38).toFixed(1) +
        '" stroke="' + GB + '" stroke-width="0.8" opacity="0.6"/>';
    }
    var inner =
      '<circle cx="160" cy="60" r="22" fill="' + G + '" opacity="0.18"/>' +
      '<circle cx="160" cy="60" r="22" fill="none" stroke="' + GB + '" stroke-width="1"/>' + rays +
      '<path d="M70 150 q20 -28 44 0" fill="' + G + '" opacity="0.12" stroke="' + G + '" stroke-width="1"/>' +
      '<path d="M206 150 q20 -28 44 0" fill="' + R + '" opacity="0.12" stroke="' + R + '" stroke-width="1"/>' +
      // marigold blossoms
      flowers(110, 130, G) + flowers(210, 132, R) + flowers(160, 150, GB);
    return svgFrame(inner, '#5a3a1e');
  }
  function flowers(cx, cy, c) {
    var s = '<g>';
    for (var i = 0; i < 8; i++) {
      var a = i * 45 * Math.PI / 180;
      s += '<ellipse cx="' + (cx + Math.cos(a) * 6).toFixed(1) + '" cy="' + (cy + Math.sin(a) * 6).toFixed(1) +
        '" rx="3.4" ry="2" transform="rotate(' + (i * 45) + ' ' + (cx + Math.cos(a) * 6).toFixed(1) + ' ' + (cy + Math.sin(a) * 6).toFixed(1) + ')" fill="none" stroke="' + c + '" stroke-width="0.8" opacity="0.8"/>';
    }
    return s + '<circle cx="' + cx + '" cy="' + cy + '" r="2.4" fill="' + c + '" opacity="0.6"/></g>';
  }
  function sceneMehndi() {
    // open hand + paisley mehndi pattern
    var inner =
      '<g transform="translate(160,96)" stroke="' + G + '" fill="none" stroke-width="1">' +
      '<path d="M-40 50 q-6 -40 6 -70 q4 -10 10 -4 q-4 18 0 34" opacity="0.7"/>' +
      // fingers
      '<path d="M-24 -18 q2 -34 8 -34 q6 0 6 30" opacity="0.7"/>' +
      '<path d="M-8 -22 q2 -40 8 -40 q6 0 5 36" opacity="0.7"/>' +
      '<path d="M9 -20 q4 -36 10 -34 q5 2 2 34" opacity="0.7"/>' +
      '<path d="M24 -10 q8 -26 14 -22 q4 4 -2 30" opacity="0.7"/>' +
      '<path d="M-40 50 q40 20 78 -6 q6 -28 0 -52" opacity="0.7"/>' +
      // paisley + dots
      '<path d="M0 6 q16 -2 14 16 q-2 14 -14 12 q-10 -2 -8 -14 q2 -10 12 -8" stroke="' + R + '" opacity="0.85"/>' +
      '<circle r="2" cx="0" cy="6" fill="' + GB + '" stroke="none"/>' +
      '<path d="M-18 0 q-8 8 0 16" stroke="' + TL + '"/>' +
      '<path d="M18 -2 q8 8 0 18" stroke="' + TL + '"/>' +
      '</g>';
    return svgFrame(inner, '#4a2a18');
  }
  function sceneBaraat() {
    // decorated horse silhouette + crowd + a lantern
    var crowd = '';
    for (var i = 0; i < 7; i++) {
      var x = 30 + i * 14;
      crowd += '<g transform="translate(' + x + ',150)" stroke="' + GB + '" stroke-width="0.8" fill="none" opacity="0.6">' +
        '<circle cx="0" cy="-14" r="3"/><path d="M0 -11 v12 M-4 -6 h8 M-3 1 l3 8 M3 1 l-3 8"/></g>';
    }
    var inner =
      crowd +
      '<g transform="translate(210,150)" stroke="' + G + '" stroke-width="1.1" fill="none">' +
      '<path d="M-34 0 q4 -26 22 -28 q8 -1 14 6 q10 -2 16 4 q-6 6 -14 5 q-2 14 -10 16 l2 -14 q-10 2 -16 -2 l-2 13 q-8 -2 -8 -19z"/>' +
      '<path d="M-12 -22 q2 -8 -2 -12" opacity="0.7"/>' + // ear/plume
      '<path d="M-34 0 l-4 6 M-30 2 l-4 6 M-2 6 l0 8 M-10 6 l-2 8" />' + // legs
      '<path d="M-2 -22 q6 -6 14 -4" stroke="' + R + '" opacity="0.8"/>' + // canopy
      '</g>' +
      // lantern
      '<g transform="translate(70,52)" stroke="' + GB + '" stroke-width="0.9" fill="none" opacity="0.8">' +
      '<line x1="0" y1="-14" x2="0" y2="-4"/><path d="M-8 -4 h16 l-2 18 h-12 z"/><circle cx="0" cy="6" r="3" fill="' + G + '" opacity="0.4" stroke="none"/></g>';
    return svgFrame(inner, '#5a2e1e');
  }
  function scenePheras() {
    // sacred fire + two pairs of hands offering
    var flames = '';
    for (var i = 0; i < 5; i++) {
      var x = 142 + i * 9;
      flames += '<path d="M' + x + ' 130 q-4 -18 4 -30 q8 12 4 30" fill="' + R + '" opacity="' + (0.25 + i * 0.08).toFixed(2) + '" stroke="' + G + '" stroke-width="0.6"/>';
    }
    var inner =
      '<path d="M120 132 h80 l-8 14 h-64 z" fill="none" stroke="' + G + '" stroke-width="1"/>' + // kund
      flames +
      '<path d="M150 96 q-6 -10 4 -14" fill="none" stroke="' + GB + '" stroke-width="0.7" opacity="0.6"/>' + // wisp
      // hands offering (left + right)
      '<g stroke="' + GB + '" stroke-width="1" fill="none" opacity="0.85">' +
      '<path d="M70 110 q14 -10 30 -6 q6 2 6 8 q-16 -2 -30 6 q-8 0 -6 -8z"/>' +
      '<path d="M250 110 q-14 -10 -30 -6 q-6 2 -6 8 q16 -2 30 6 q8 0 6 -8z"/>' +
      '</g>' +
      // petals dropping
      '<circle cx="160" cy="70" r="1.6" fill="' + GB + '"/><circle cx="148" cy="80" r="1.4" fill="' + R + '"/><circle cx="172" cy="82" r="1.4" fill="' + TL + '"/>';
    return svgFrame(inner, '#4a2418');
  }
  function sceneReception() {
    // stage arch + couple silhouette + string lights
    var lights = '';
    for (var i = 0; i < 14; i++) {
      lights += '<circle cx="' + (24 + i * 20) + '" cy="' + (30 + Math.sin(i) * 4).toFixed(1) + '" r="1.6" fill="' + GB + '" opacity="0.8"/>';
    }
    var inner =
      '<path d="M40 60 q120 -54 240 0" fill="none" stroke="' + G + '" stroke-width="1" opacity="0.7"/>' + lights +
      // arch / mandap
      '<path d="M90 150 V70 q70 -34 140 0 V150" fill="none" stroke="' + G + '" stroke-width="1.1"/>' +
      '<path d="M110 150 V80 q50 -22 100 0 V150" fill="' + G + '" opacity="0.06" stroke="' + R + '" stroke-width="0.7"/>' +
      // couple silhouette
      '<g transform="translate(150,118)" stroke="' + GB + '" stroke-width="1" fill="none">' +
      '<circle cx="0" cy="-16" r="4"/><path d="M0 -12 v16 M-6 -4 q6 6 12 0 M-4 4 l-2 22 M4 4 l2 22"/>' +
      '<circle cx="22" cy="-14" r="4"/><path d="M22 -10 v14 M16 -2 q6 6 12 0 M18 4 q-2 12 -2 22 M26 4 q2 12 4 22" opacity="0.9"/>' +
      '<path d="M22 -10 q-2 -8 6 -10" stroke="' + R + '" opacity="0.7"/>' + // veil
      '</g>';
    return svgFrame(inner, '#3a2030');
  }

  var SCENES = [
    { key: 'haldi', svg: sceneHaldi },
    { key: 'mehndi', svg: sceneMehndi },
    { key: 'baraat', svg: sceneBaraat },
    { key: 'pheras', svg: scenePheras },
    { key: 'reception', svg: sceneReception }
  ];

  /* =============================================================
     LIGHTBOX — self-contained (the app's openLB() is bound to PHOTOS;
     gallery items are different sources, so we drive #lightbox here).
     Supports button nav + touch swipe (>50px).
     ============================================================= */
  var galItems = [];   // [{src, cap}]
  var galIdx = 0;

  function lbEls() {
    return {
      box: document.getElementById('lightbox'),
      img: document.getElementById('lbImg'),
      cap: document.getElementById('lbCap')
    };
  }
  function galOpen(i) {
    galItems = collectItems();
    galIdx = i;
    renderLB();
    var e = lbEls(); if (e.box) e.box.classList.remove('hide');
    // take over the nav buttons + close while a gallery item is shown
    galActive = true;
  }
  function galNav(dir) {
    if (!galItems.length) return;
    galIdx = (galIdx + dir + galItems.length) % galItems.length;
    renderLB();
  }
  function renderLB() {
    var e = lbEls(); if (!e.img) return;
    var it = galItems[galIdx]; if (!it) return;
    e.img.src = it.src;
    if (e.cap) e.cap.textContent = it.cap || '';
  }
  // Collect every gallery card image+caption in DOM order.
  function collectItems() {
    var out = [];
    var cards = document.querySelectorAll('#panel-gallery .gallery-card[data-galsrc]');
    cards.forEach(function (c) {
      out.push({ src: c.getAttribute('data-galsrc'), cap: (c.querySelector('.gallery-caption') || {}).textContent || '' });
    });
    return out;
  }

  /* We intercept the lightbox nav/close ONLY while a gallery image is
     active, then hand control back to the app's PHOTOS lightbox. */
  var galActive = false;
  function wrapLightboxControls() {
    var origNav = window.navLB, origClose = window.closeLB;
    window.navLB = function (dir) {
      if (galActive) return galNav(dir);
      if (typeof origNav === 'function') return origNav(dir);
    };
    window.closeLB = function () {
      galActive = false;
      if (typeof origClose === 'function') return origClose();
      var e = lbEls(); if (e.box) e.box.classList.add('hide');
    };
    // When the app opens its own PHOTOS lightbox, release gallery control.
    var origOpen = window.openLB;
    if (typeof origOpen === 'function') {
      window.openLB = function (idx) { galActive = false; return origOpen(idx); };
    }
  }
  function bindLightboxSwipe() {
    var box = document.getElementById('lightbox'); if (!box) return;
    var sx = null, sy = null;
    box.addEventListener('touchstart', function (e) {
      var t = e.changedTouches[0]; sx = t.clientX; sy = t.clientY;
    }, { passive: true });
    box.addEventListener('touchend', function (e) {
      if (sx === null) return;
      var t = e.changedTouches[0];
      var dx = t.clientX - sx, dy = t.clientY - sy;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
        if (galActive) galNav(dx < 0 ? 1 : -1);
        else if (typeof window.navLB === 'function') window.navLB(dx < 0 ? 1 : -1);
      }
      sx = sy = null;
    }, { passive: true });
  }

  /* =============================================================
     RENDER THE GALLERY PANEL
     ============================================================= */
  function cameraSVG() {
    return '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.6"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>';
  }

  function loadPhotos() {
    try { return JSON.parse(localStorage.getItem(LS_KEY) || '[]'); }
    catch (e) { return []; }
  }
  function savePhotos(arr) {
    try { localStorage.setItem(LS_KEY, JSON.stringify(arr)); }
    catch (e) { alert('Could not save photo — storage may be full.'); }
  }

  function escapeHTML(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function sceneCard(scene) {
    var lab = L().scenes[scene.key];
    var cap = lab; // default caption is the scene name; editable
    return '<div class="gallery-card" data-galsrc="' + svgDataURI(scene.svg()) + '">' +
      '<div class="gallery-media" onclick="window.YUGAL_GALLERY.open(this)">' + scene.svg() + '</div>' +
      '<div class="gallery-caption" contenteditable="true" data-ph="' + escapeHTML(L().cap) + '">' + escapeHTML(cap) + '</div>' +
      '<div class="gallery-by">' + escapeHTML(L().by) + ' · ' + escapeHTML(meName()) + '</div>' +
      '</div>';
  }
  function svgDataURI(svg) {
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
  }

  function photoCard(p, idx) {
    return '<div class="gallery-card" data-galsrc="' + p.src + '" data-photo="' + idx + '">' +
      '<button class="gallery-del" title="Remove" onclick="window.YUGAL_GALLERY.del(' + idx + ')">&#x2715;</button>' +
      '<div class="gallery-media" onclick="window.YUGAL_GALLERY.open(this)"><img src="' + p.src + '" alt="" loading="lazy"></div>' +
      '<div class="gallery-caption" contenteditable="true" data-ph="' + escapeHTML(L().cap) + '" ' +
      'oninput="window.YUGAL_GALLERY.editCap(' + idx + ', this.textContent)">' + escapeHTML(p.cap || '') + '</div>' +
      '<div class="gallery-by">' + escapeHTML(L().by) + ' · ' + escapeHTML(p.by || meName()) + '</div>' +
      '</div>';
  }

  function renderGallery() {
    var panel = document.getElementById('panel-gallery');
    if (!panel) return;
    var photos = loadPhotos();
    var h = '<div class="gallery-head"><h2 class="disp gallery-title">' + escapeHTML(L().tab) + '</h2></div>';
    // + Add Photo card
    h += '<div class="gallery-add" onclick="window.YUGAL_GALLERY.pick()">' +
      '<div class="ga-plus">+</div><div class="ga-label">' + escapeHTML(L().add) + '</div>' +
      '<input type="file" id="galFile" accept="image/*" style="display:none" ' +
      'onchange="window.YUGAL_GALLERY.upload(this)"></div>';
    // user photos first (most recent on top), then the illustrated scenes
    photos.forEach(function (p, i) { h += photoCard(p, i); });
    SCENES.forEach(function (sc) { h += sceneCard(sc); });
    panel.innerHTML = h;
  }

  /* ---------- upload handling ---------- */
  function pick() { var f = document.getElementById('galFile'); if (f) f.click(); }
  function upload(input) {
    var file = input.files && input.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function (e) {
      var photos = loadPhotos();
      photos.unshift({ src: e.target.result, cap: '', by: meName(), ts: Date.now() });
      savePhotos(photos);
      renderGallery();
    };
    reader.readAsDataURL(file);
  }
  function del(idx) {
    var photos = loadPhotos();
    photos.splice(idx, 1);
    savePhotos(photos);
    renderGallery();
  }
  function editCap(idx, text) {
    var photos = loadPhotos();
    if (photos[idx]) { photos[idx].cap = String(text).slice(0, 200); savePhotos(photos); }
  }
  function open(mediaEl) {
    var card = mediaEl.closest('.gallery-card');
    if (!card) return;
    var items = collectItems();
    var src = card.getAttribute('data-galsrc');
    var i = 0;
    for (var k = 0; k < items.length; k++) { if (items[k].src === src) { i = k; break; } }
    galOpen(i);
  }

  /* =============================================================
     NAV BUTTON injection + localized label refresh
     ============================================================= */
  function injectNavButton() {
    var nav = document.getElementById('navBar') || document.querySelector('nav');
    if (!nav || document.getElementById('galleryTabBtn')) return;
    var btn = document.createElement('button');
    btn.id = 'galleryTabBtn';
    btn.setAttribute('data-tab', 'panel-gallery');
    btn.onclick = function () { window.show('panel-gallery', btn); };
    btn.innerHTML = cameraSVG() + '<span class="gal-tab-label">' + escapeHTML(L().tab) + '</span>';
    // place just before the Wishes button if present, else append
    var wishesBtn = nav.querySelector('button[data-tab="wishes"]');
    if (wishesBtn) nav.insertBefore(btn, wishesBtn);
    else nav.appendChild(btn);
  }
  function refreshLabels() {
    var lab = document.querySelector('#galleryTabBtn .gal-tab-label');
    if (lab) lab.textContent = L().tab;
    // re-render the panel so scene names / placeholders follow the language
    renderGallery();
  }

  /* =============================================================
     HOOKS — wire the new animation helpers WITHOUT editing app.js:
     wrap window.show (tab switch) and window.toggleCheck (tick).
     ============================================================= */
  function wrapAppFns() {
    // tab switch -> revealPanel + whoosh, and refresh gallery labels on entry
    var origShow = window.show;
    if (typeof origShow === 'function') {
      window.show = function (id, btn) {
        var r = origShow.apply(this, arguments);
        var panel = document.getElementById(id);
        if (typeof window.revealPanel === 'function') window.revealPanel(panel);
        return r;
      };
    }
    // checklist tick -> celebrateCheck glow + rising petals + chime,
    // but ONLY when an item just became "done". NOTE: app.js declares
    // STATE with `let`, so it is a global *lexical* binding, NOT a
    // window property — we must read the bare identifier, guarded.
    function checkState(k) {
      try { return !!(STATE && STATE.checks && STATE.checks[k]); }
      catch (e) { return false; }
    }
    var origToggle = window.toggleCheck;
    if (typeof origToggle === 'function') {
      window.toggleCheck = function (k) {
        var before = checkState(k);
        var r = origToggle.apply(this, arguments);
        var after = checkState(k);
        if (!before && after) {
          // renderPlanner() rebuilt #plannerBody; query the fresh element.
          var el = document.querySelector('#plannerBody .item[onclick*="\'' + k + '\'"]');
          if (el && typeof window.celebrateCheck === 'function') window.celebrateCheck(el);
        }
        return r;
      };
    }
    // language switch -> refresh gallery labels too
    var origApply = window.applyLang;
    if (typeof origApply === 'function') {
      window.applyLang = function () {
        var r = origApply.apply(this, arguments);
        refreshLabels();
        // keep the "uploaded by · you/me" tag in sync after persona change
        return r;
      };
    }
    // persona change -> refresh "uploaded by" tags
    var origSetMe = window.setMe;
    if (typeof origSetMe === 'function') {
      window.setMe = function (n) { var r = origSetMe.apply(this, arguments); renderGallery(); return r; };
    }
  }

  /* =============================================================
     PUBLIC NAMESPACE (used by inline onclick/oninput in cards)
     ============================================================= */
  window.YUGAL_GALLERY = {
    pick: pick, upload: upload, del: del, editCap: editCap, open: open,
    render: renderGallery, navLB: galNav, openIndex: galOpen
  };

  /* =============================================================
     INIT — app.js loads AFTER this file, so defer the wrapping of
     its globals to DOM ready (by which point app.js has defined them).
     ============================================================= */
  function init() {
    injectNavButton();
    renderGallery();
    wrapLightboxControls();
    bindLightboxSwipe();
    wrapAppFns();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
