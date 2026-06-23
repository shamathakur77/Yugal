// FILE: animations.js
/* =============================================================
   animations.js — purely decorative builders & effects.
   Full rewrite for YUGAL. Adds:
     1. Entrance sequence (mandala + wordmark overlay)
     2. Enhanced ambient petals (20, randomised, palette)
     3. Firefly layer (30 slow-floating motes)
     4. celebrateCheck()  — checklist tick glow + rising petals
     5. revealPanel()     — tab-switch slide/fade
     6. Parallax header on scroll
     7. Ripple on tap (event delegation)
   Pre-existing builders kept intact (still called by app.js):
     buildToran(), buildFrames(), celebrate()
   These touch only their own DOM nodes plus `MONTHS`/`lang`.
   Every public function is attached to `window`.
   ============================================================= */

/* ---- shared palette ---- */
var ANIM_PALETTE = ['#e0a030', '#e8a55f', '#5fa89c', '#e8c869', '#d4a843'];

/* =============================================================
   1. ENTRANCE SEQUENCE
   Injects a centered fine-line mandala SVG + YUGAL wordmark into
   #entranceOverlay, then fades/slides the overlay away after 2.2s.
   ============================================================= */
function buildMandalaSVG() {
  var petals = Array.from({ length: 12 }, function (_, i) {
    var a = i * 30 * Math.PI / 180;
    var x1 = Math.cos(a) * 50, y1 = Math.sin(a) * 50;
    var x2 = Math.cos(a) * 100, y2 = Math.sin(a) * 100;
    var ex = (x1 * 1.5).toFixed(1), ey = (y1 * 1.5).toFixed(1);
    return '<line x1="' + x1.toFixed(1) + '" y1="' + y1.toFixed(1) + '" x2="' + x2.toFixed(1) + '" y2="' + y2.toFixed(1) + '" stroke="#e0a030" stroke-width="0.6" opacity="0.5"/>' +
      '<ellipse cx="' + ex + '" cy="' + ey + '" rx="8" ry="4" transform="rotate(' + (i * 30) + ' ' + ex + ' ' + ey + ')" fill="none" stroke="#e8c869" stroke-width="0.7" opacity="0.6"/>';
  }).join('');
  return '<svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg" opacity="0.85">' +
    '<circle cx="150" cy="150" r="140" fill="none" stroke="#e0a030" stroke-width="0.8" opacity="0.4"/>' +
    '<circle cx="150" cy="150" r="110" fill="none" stroke="#e8c869" stroke-width="0.5" opacity="0.5"/>' +
    '<circle cx="150" cy="150" r="80" fill="none" stroke="#e0a030" stroke-width="0.6" opacity="0.6"/>' +
    '<g transform="translate(150,150)">' + petals + '</g>' +
    '<circle cx="150" cy="150" r="10" fill="#e0a030" opacity="0.3"/>' +
    '</svg>';
}

function playEntrance() {
  var overlay = document.getElementById('entranceOverlay');
  if (!overlay) return;
  var holder = document.getElementById('entranceMandala');
  if (holder && !holder.innerHTML.trim()) holder.innerHTML = buildMandalaSVG();
  // Reduced-motion users: skip the delay, hide immediately.
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var wait = reduce ? 200 : 2200;
  setTimeout(function () { overlay.classList.add('hidden'); }, wait);
  // Remove from the flow once the transition completes so it never blocks taps.
  setTimeout(function () { if (overlay && overlay.parentNode) overlay.style.display = 'none'; }, wait + 900);
}
window.playEntrance = playEntrance;

/* =============================================================
   PRE-EXISTING: toran garland (kept verbatim in behaviour)
   ============================================================= */
function buildToran() {
  var s = '<svg viewBox="0 0 400 34" preserveAspectRatio="none"><path d="M0 5 Q200 28 400 5" stroke="var(--gold)" stroke-width="1.5" fill="none"/>';
  for (var x = 14; x < 400; x += 20) {
    var dip = 5 + 23 * Math.sin((x / 400) * Math.PI);
    s += '<circle cx="' + x + '" cy="' + (dip + 6) + '" r="2.3" fill="var(--rust)"/>';
    s += '<path d="M' + x + ' ' + (dip + 8) + ' q-3 8 0 13 q3 -5 0 -13" fill="var(--p-roma)" opacity=".7"/>';
  }
  document.getElementById('toran').innerHTML = s + '</svg>';
}
window.buildToran = buildToran;

/* =============================================================
   2. ENHANCED PETALS — 20 teardrop petals, randomised size,
   opacity, rotation, soft blur shadow, staggered delay.
   ============================================================= */
function buildPetals() {
  var cols = ['#e0a030', '#e8a55f', '#5fa89c', '#e8c869', '#d4a843'];
  var h = '';
  for (var i = 0; i < 20; i++) {
    var x = Math.random() * 98;
    var dur = 8 + Math.random() * 8;          // 8–16s fall
    var del = -Math.random() * 14;            // staggered head-start
    var sz = 4 + Math.random() * 8;           // 4–12px
    var op = (0.4 + Math.random() * 0.4).toFixed(2); // 0.4–0.8
    var rot = Math.floor(Math.random() * 360);
    var c = cols[i % cols.length];
    var sway = (Math.random() * 12 - 6).toFixed(1);
    h += '<div class="petal" style="left:' + x + 'vw;animation-duration:' + dur.toFixed(1) +
      's;animation-delay:' + del.toFixed(1) + 's;--sway:' + sway + 'px;filter:drop-shadow(0 0 0.5px rgba(0,0,0,.4));">' +
      '<svg width="' + (sz * 2).toFixed(0) + '" height="' + (sz * 2).toFixed(0) + '" viewBox="0 0 12 12" style="transform:rotate(' + rot + 'deg)">' +
      '<path d="M6 1 Q10 5 6 11 Q2 5 6 1" fill="' + c + '" opacity="' + op + '"/></svg></div>';
  }
  document.getElementById('petalLayer').innerHTML = h;
}
window.buildPetals = buildPetals;

/* =============================================================
   3. FIREFLY LAYER — 30 tiny warm motes, slow float, no events.
   ============================================================= */
function buildFireflies() {
  var layer = document.getElementById('fireflyLayer');
  if (!layer) {
    layer = document.createElement('div');
    layer.id = 'fireflyLayer';
    document.body.appendChild(layer);
  }
  var h = '';
  for (var i = 0; i < 30; i++) {
    var x = (Math.random() * 100).toFixed(1);
    var y = (Math.random() * 100).toFixed(1);
    var dur = (8 + Math.random() * 8).toFixed(1);   // 8–16s
    var del = (-Math.random() * 16).toFixed(1);
    var op = (0.1 + Math.random() * 0.25).toFixed(2); // 0.1–0.35
    var dx = (Math.random() * 40 - 20).toFixed(0);
    var dy = (Math.random() * 40 - 20).toFixed(0);
    h += '<div class="firefly" style="left:' + x + 'vw;top:' + y + 'vh;width:2px;height:2px;' +
      'opacity:' + op + ';--fx:' + dx + 'px;--fy:' + dy + 'px;' +
      'animation:fireDrift ' + dur + 's ease-in-out ' + del + 's infinite;"></div>';
  }
  layer.innerHTML = h;
}
window.buildFireflies = buildFireflies;

/* =============================================================
   PRE-EXISTING: cultural side frames (Warli + Jharokha)
   ============================================================= */
function buildFrames() {
  var warli = '<svg viewBox="0 0 22 600" preserveAspectRatio="none" class="draw"><g stroke="var(--p-roma)" stroke-width="1.3" fill="none">' +
    [50, 150, 360, 470, 560].map(function (y) {
      return '<g transform="translate(11,' + y + ')"><circle r="3"/><line x1="0" y1="3" x2="0" y2="12"/><line x1="0" y1="6" x2="-5" y2="10"/><line x1="0" y1="6" x2="5" y2="10"/><line x1="0" y1="12" x2="-4" y2="19"/><line x1="0" y1="12" x2="4" y2="19"/></g>';
    }).join('') +
    '<g transform="translate(11,255)"><circle r="5"/><line x1="0" y1="-9" x2="0" y2="-6"/><line x1="0" y1="9" x2="0" y2="6"/><line x1="-9" y1="0" x2="-6" y2="0"/><line x1="9" y1="0" x2="6" y2="0"/></g></g></svg>';
  var jhar = '<svg viewBox="0 0 22 600" preserveAspectRatio="none" class="draw"><g stroke="var(--p-pfam)" stroke-width="1.2" fill="none">' +
    [60, 230, 400, 540].map(function (y) {
      return '<g transform="translate(11,' + y + ')"><path d="M-8 16 V4 a8 8 0 0 1 16 0 V16"/><path d="M-4 16 V7 a4 4 0 0 1 8 0 V16"/></g>';
    }).join('') +
    '<g transform="translate(11,145)"><circle r="7"/><path d="M0 -7 Q3 -3 0 0 Q-3 -3 0 -7"/><path d="M0 7 Q3 3 0 0 Q-3 3 0 7"/></g>' +
    '<g transform="translate(11,320)"><path d="M0 -8 L6 0 L0 8 L-6 0 Z"/></g></g></svg>';
  document.getElementById('frameL').innerHTML = warli;
  document.getElementById('frameR').innerHTML = jhar;
}
window.buildFrames = buildFrames;

/* =============================================================
   PRE-EXISTING: celebration burst (fired when a month hits 100%)
   ============================================================= */
function celebrate(mi) {
  var layer = document.getElementById('petalLayer');
  var cols = ['#e0a030', '#e8a55f', '#5fa89c', '#e8c869', '#d4a843'];
  for (var i = 0; i < 28; i++) {
    var d = document.createElement('div'); d.className = 'burst';
    var x = Math.random() * 100, sz = 6 + Math.random() * 7, c = cols[i % cols.length], rot = Math.random() * 360;
    d.style.cssText = 'left:' + x + 'vw;top:28vh;animation-delay:' + (Math.random() * 0.3) + 's;';
    d.innerHTML = '<svg width="' + (sz * 2) + '" height="' + (sz * 2) + '" viewBox="0 0 12 12" style="transform:rotate(' + rot + 'deg)"><path d="M6 1 Q10 5 6 11 Q2 5 6 1" fill="' + c + '"/></svg>';
    layer.appendChild(d);
    (function (node) { setTimeout(function () { node.remove(); }, 2600); })(d);
  }
  var M = MONTHS[lang][mi]; var msg = { en: 'done!', hi: 'पूर्ण!', mr: 'पूर्ण!' }[lang];
  var toast = document.createElement('div'); toast.className = 'celebrate-toast'; toast.innerHTML = '✨ ' + M.m + ' ' + msg + ' ✨';
  document.body.appendChild(toast); setTimeout(function () { toast.remove(); }, 2600);
}
window.celebrate = celebrate;

/* =============================================================
   4. CHECKLIST COMPLETION ANIMATION
   celebrateCheck(itemEl): glow pulse on the item + 3 tiny petals
   that float up from the item then fade. Also rings a soft chime
   via audio.js (window.playChime) when available.
   ============================================================= */
function celebrateCheck(itemEl) {
  if (!itemEl) return;
  itemEl.classList.remove('check-glow');
  // force reflow so the animation can re-trigger on repeated ticks
  void itemEl.offsetWidth;
  itemEl.classList.add('check-glow');
  setTimeout(function () { itemEl.classList.remove('check-glow'); }, 600);

  var rect = itemEl.getBoundingClientRect();
  var cx = rect.left + rect.width * 0.18;
  var cy = rect.top + rect.height / 2;
  var cols = ['#e0a030', '#e8c869', '#5fa89c'];
  for (var i = 0; i < 3; i++) {
    var p = document.createElement('div');
    p.className = 'check-petal';
    var dx = (i - 1) * 16 + (Math.random() * 8 - 4);
    var c = cols[i % cols.length];
    p.style.cssText = 'left:' + (cx + dx) + 'px;top:' + cy + 'px;animation-delay:' + (i * 60) + 'ms;';
    p.innerHTML = '<svg width="14" height="14" viewBox="0 0 12 12"><path d="M6 1 Q10 5 6 11 Q2 5 6 1" fill="' + c + '"/></svg>';
    document.body.appendChild(p);
    (function (node) { setTimeout(function () { node.remove(); }, 1300); })(p);
  }
  if (typeof window.playChime === 'function') { try { window.playChime(); } catch (e) {} }
}
window.celebrateCheck = celebrateCheck;

/* =============================================================
   5. TAB SWITCH — revealPanel(panelEl): slide-in + fade.
   Replaces the old .leafturn keyframe (the CSS .panel.active rule
   no longer animates; this drives the motion instead).
   Also plays a quiet whoosh via audio.js when available.
   ============================================================= */
function revealPanel(panelEl) {
  if (!panelEl) return;
  panelEl.classList.remove('panel-reveal');
  void panelEl.offsetWidth; // reflow to restart the animation
  panelEl.classList.add('panel-reveal');
  setTimeout(function () { panelEl.classList.remove('panel-reveal'); }, 420);
  if (typeof window.playWhoosh === 'function') { try { window.playWhoosh(); } catch (e) {} }
}
window.revealPanel = revealPanel;

/* =============================================================
   6. PARALLAX HEADER — shift header background-position-y with scroll.
   ============================================================= */
function initParallaxHeader() {
  var header = document.querySelector('header');
  if (!header) return;
  var ticking = false;
  function update() {
    var y = window.scrollY || window.pageYOffset || 0;
    header.style.backgroundPositionY = (y * 0.3).toFixed(1) + 'px';
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { window.requestAnimationFrame(update); ticking = true; }
  }, { passive: true });
}
window.initParallaxHeader = initParallaxHeader;

/* =============================================================
   7. RIPPLE ON TAP — gold circle that expands and fades from the
   tap point of any <button> or .card. Event delegation on document.
   ============================================================= */
function spawnRipple(clientX, clientY, target) {
  var host = target.closest ? (target.closest('button') || target.closest('.card')) : null;
  if (!host) return;
  var rect = host.getBoundingClientRect();
  // ensure the host can contain an absolutely-positioned child
  var pos = window.getComputedStyle(host).position;
  if (pos === 'static') host.style.position = 'relative';
  if (window.getComputedStyle(host).overflow === 'visible') host.style.overflow = 'hidden';
  var size = Math.max(rect.width, rect.height);
  var r = document.createElement('span');
  r.className = 'ripple-el';
  r.style.width = r.style.height = size + 'px';
  r.style.left = (clientX - rect.left - size / 2) + 'px';
  r.style.top = (clientY - rect.top - size / 2) + 'px';
  host.appendChild(r);
  setTimeout(function () { r.remove(); }, 560);
}
function initRipple() {
  var handler = function (e) {
    var pt = e.touches && e.touches[0] ? e.touches[0] : e;
    if (pt.clientX == null) return;
    spawnRipple(pt.clientX, pt.clientY, e.target);
  };
  document.addEventListener('mousedown', handler, { passive: true });
  document.addEventListener('touchstart', handler, { passive: true });
}
window.initRipple = initRipple;

/* =============================================================
   AUTO-INIT — the decorative effects that don't depend on app
   state can wire themselves up on DOM ready. buildToran/Petals/
   Frames are still invoked by app.js boot() (we don't duplicate).
   ============================================================= */
(function () {
  function init() {
    playEntrance();
    buildFireflies();
    initParallaxHeader();
    initRipple();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
