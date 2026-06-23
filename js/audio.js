// FILE: audio.js
/* =============================================================
   audio.js — ambient music toggle + Web Audio SFX + daily blessing.
   No build step, pure vanilla. Touches only its own DOM / globals.
   Public API: window.playChime(), window.playWhoosh(),
               window.toggleMusic(), window.setBlessing()
   Also injects the floating #musicToggle button and populates the
   #blessingCard at the top of the planner panel.
   ============================================================= */

/* ----- placeholder track. The family will swap `url` for the real
   shehnai/wedding recording later (any direct .mp3 URL works). ----- */
var TRACK = {
  name: "Shehnai Reverie",
  url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
};

(function () {
  'use strict';

  /* ---------- shared AudioContext (created lazily on first interaction) ---------- */
  var AC = null;
  function ctx() {
    if (!AC) {
      var Ctor = window.AudioContext || window.webkitAudioContext;
      if (!Ctor) return null;
      AC = new Ctor();
    }
    if (AC.state === 'suspended') { try { AC.resume(); } catch (e) {} }
    return AC;
  }

  /* ---------- state ---------- */
  var musicPlaying = false;
  var sfxMuted = false;            // toggled by long-press / right-click
  var audioEl = null;              // <audio> element for the music track
  var trackGain = null;            // GainNode for music fades
  var trackSource = null;          // MediaElementSource node
  var fadeTimer = null;

  /* ============================================================
     MUSIC — play/pause with fade in/out, looped.
     ============================================================ */
  function ensureMusicGraph() {
    if (audioEl) return true;
    var c = ctx();
    if (!c) return false;
    audioEl = new Audio();
    audioEl.src = TRACK.url;
    audioEl.loop = true;
    audioEl.crossOrigin = 'anonymous';
    audioEl.preload = 'auto';
    try {
      trackSource = c.createMediaElementSource(audioEl);
      trackGain = c.createGain();
      trackGain.gain.value = 0;
      trackSource.connect(trackGain);
      trackGain.connect(c.destination);
    } catch (e) {
      // If routing through WebAudio fails (rare CORS edge), fall back to
      // controlling the element's own volume directly.
      trackSource = null; trackGain = null;
    }
    return true;
  }

  function fadeTo(target, seconds) {
    var c = ctx();
    if (trackGain && c) {
      var now = c.currentTime;
      trackGain.gain.cancelScheduledValues(now);
      trackGain.gain.setValueAtTime(trackGain.gain.value, now);
      trackGain.gain.linearRampToValueAtTime(target, now + seconds);
    } else if (audioEl) {
      // element-volume fallback
      var steps = 20, i = 0;
      var start = audioEl.volume;
      clearInterval(fadeTimer);
      fadeTimer = setInterval(function () {
        i++;
        audioEl.volume = Math.max(0, Math.min(1, start + (target - start) * (i / steps)));
        if (i >= steps) clearInterval(fadeTimer);
      }, (seconds * 1000) / steps);
    }
  }

  function startMusic() {
    if (!ensureMusicGraph()) return;
    var p = audioEl.play();
    if (p && p.catch) p.catch(function () { /* autoplay blocked until gesture; we are in a gesture */ });
    fadeTo(0.55, 1.5);              // 1.5s fade-in
    musicPlaying = true;
    updateToggleVisual();
  }

  function stopMusic() {
    if (!audioEl) { musicPlaying = false; updateToggleVisual(); return; }
    fadeTo(0.0, 1.0);               // fade out over 1s
    setTimeout(function () { if (!musicPlaying) try { audioEl.pause(); } catch (e) {} }, 1050);
    musicPlaying = false;
    updateToggleVisual();
  }

  function toggleMusic() {
    if (musicPlaying) stopMusic(); else startMusic();
  }
  window.toggleMusic = toggleMusic;

  /* ============================================================
     SFX — chime (bell) on checklist completion, whoosh on tab switch.
     Both respect the sfxMuted flag.
     ============================================================ */
  function playChime() {
    if (sfxMuted) return;
    var c = ctx(); if (!c) return;
    var now = c.currentTime;
    var osc = c.createOscillator();
    var g = c.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, now);          // A5 bell
    // envelope: quick attack, gentle decay over ~0.3s
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(0.18, now + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.32);
    osc.connect(g); g.connect(c.destination);
    osc.start(now);
    osc.stop(now + 0.34);
  }
  window.playChime = playChime;

  function playWhoosh() {
    if (sfxMuted) return;
    var c = ctx(); if (!c) return;
    var now = c.currentTime;
    var dur = 0.15;
    var frames = Math.floor(c.sampleRate * dur);
    var buf = c.createBuffer(1, frames, c.sampleRate);
    var data = buf.getChannelData(0);
    for (var i = 0; i < frames; i++) data[i] = (Math.random() * 2 - 1);
    var src = c.createBufferSource();
    src.buffer = buf;
    var g = c.createGain();
    g.gain.setValueAtTime(0.0001, now);
    g.gain.linearRampToValueAtTime(0.05, now + 0.02);   // very quiet
    g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
    // gentle low-pass so it reads as a soft breath, not static
    var lp = c.createBiquadFilter();
    lp.type = 'lowpass'; lp.frequency.value = 1600;
    src.connect(lp); lp.connect(g); g.connect(c.destination);
    src.start(now); src.stop(now + dur);
  }
  window.playWhoosh = playWhoosh;

  /* ============================================================
     FLOATING MUSIC TOGGLE BUTTON (#musicToggle)
     - click: toggle music
     - long-press (touch) / right-click: toggle SFX mute only
     - hover/tap shows the track name tooltip above the button
     ============================================================ */
  var diyaSVG =
    '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="var(--gold)" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">' +
    '<path d="M12 3c.6 1.6.4 2.7-.4 3.6"/>' +
    '<path d="M4 13c0 0 3-1.5 8-1.5S20 13 20 13c0 2.5-3.6 4.5-8 4.5S4 15.5 4 13z"/>' +
    '<path d="M11 11.4c.2-1.2 1-2 2.4-2.2-1 .8-1.1 1.6-.9 2.3"/>' +
    '<ellipse cx="12" cy="13" rx="3" ry="1" fill="var(--gold-bright)" stroke="none" opacity="0.7"/>' +
    '</svg>';

  var btn, tip, pressTimer = null, longPressed = false;

  function buildToggle() {
    btn = document.getElementById('musicToggle');
    if (!btn) {
      btn = document.createElement('button');
      btn.id = 'musicToggle';
      btn.type = 'button';
      btn.setAttribute('aria-label', 'Play ambient music');
      document.body.appendChild(btn);
    }
    btn.innerHTML = diyaSVG + '<span class="mt-tip" id="mtTip"></span>';
    tip = document.getElementById('mtTip');
    setTip();

    btn.addEventListener('click', function (e) {
      if (longPressed) { longPressed = false; return; } // a long-press already handled it
      toggleMusic();
      flashTip();
    });

    // right-click toggles SFX only
    btn.addEventListener('contextmenu', function (e) {
      e.preventDefault();
      sfxMuted = !sfxMuted;
      updateToggleVisual(); flashTip();
    });

    // long-press (touch) toggles SFX only
    btn.addEventListener('touchstart', function () {
      longPressed = false;
      pressTimer = setTimeout(function () {
        longPressed = true;
        sfxMuted = !sfxMuted;
        updateToggleVisual(); flashTip();
      }, 600);
    }, { passive: true });
    function clearPress() { clearTimeout(pressTimer); }
    btn.addEventListener('touchend', clearPress, { passive: true });
    btn.addEventListener('touchmove', clearPress, { passive: true });

    updateToggleVisual();
  }

  function setTip() {
    if (!tip) return;
    var label = TRACK.name;
    if (sfxMuted) label += ' · SFX off';
    label += musicPlaying ? ' · playing' : '';
    tip.textContent = label;
  }
  function flashTip() {
    setTip();
    if (!tip) return;
    tip.classList.add('show');
    clearTimeout(flashTip._t);
    flashTip._t = setTimeout(function () { tip.classList.remove('show'); }, 1600);
  }
  function updateToggleVisual() {
    if (!btn) return;
    btn.classList.toggle('playing', musicPlaying);
    btn.classList.toggle('sfx-muted', sfxMuted);
    setTip();
  }
  function expose() { window.__musicState = { get playing() { return musicPlaying; }, get sfxMuted() { return sfxMuted; } }; }
  // expose a tiny read-only helper for debugging / gallery hooks
  window.updateMusicToggleVisual = updateToggleVisual;
  // make updateToggleVisual reachable to the music fns above
  // (they are in the same closure, so this is just for external callers)
  /* eslint-disable no-unused-vars */
  var _exposeRefs = { setTip: setTip, flashTip: flashTip };
  /* eslint-enable no-unused-vars */
  // re-bind the closure-internal references used by start/stop music
  // (start/stop call updateToggleVisual directly — defined above)

  /* ============================================================
     TODAY'S BLESSING — 30 genuine wedding blessings
     (10 Sanskrit, 10 Hindi, 10 Marathi). dayOfYear % 30 picks one.
     ============================================================ */
  var BLESSINGS = [
    /* --- 10 Sanskrit --- */
    { original: "समानी व आकूतिः समाना हृदयानि वः।", translation: "May your intentions be one, may your hearts be united. (Rig Veda)", lang: "sa" },
    { original: "धर्मेच अर्थेच कामेच नातिचरामि।", translation: "In duty, in prosperity, in love — I shall never fail you. (the marriage vow)", lang: "sa" },
    { original: "सह नाववतु सह नौ भुनक्तु सह वीर्यं करवावहै।", translation: "May we be protected together, nourished together, work with vigour together.", lang: "sa" },
    { original: "गृहिणी गृहमुच्यते।", translation: "It is the companion who makes a house a home.", lang: "sa" },
    { original: "यत्र नार्यस्तु पूज्यन्ते रमन्ते तत्र देवताः।", translation: "Where women are honoured, there the divine rejoices. (Manusmriti)", lang: "sa" },
    { original: "अन्योन्यं सुखिनौ भवतम्।", translation: "May the two of you bring happiness to one another.", lang: "sa" },
    { original: "सौभाग्यं सन्ततिं चैव लभेताम् दम्पती सदा।", translation: "May this couple always be blessed with good fortune and lineage.", lang: "sa" },
    { original: "ॐ सह नौ यशः सह नौ ब्रह्मवर्चसम्।", translation: "May glory and radiance be ours together.", lang: "sa" },
    { original: "प्रेम्णा सदा संयुक्तौ भवतम्।", translation: "May you remain ever bound together by love.", lang: "sa" },
    { original: "शुभं भवतु कल्याणं आयुरारोग्यसम्पदाम्।", translation: "May there be auspiciousness, well-being, long life, health and abundance.", lang: "sa" },
    /* --- 10 Hindi --- */
    { original: "आपका साथ सदा बना रहे, प्रेम कभी कम न हो।", translation: "May your companionship last forever, and your love never wane.", lang: "hi" },
    { original: "दो दिल, दो परिवार, एक नई दुनिया — मुबारक हो।", translation: "Two hearts, two families, one new world — congratulations.", lang: "hi" },
    { original: "जीवन भर एक-दूसरे का हाथ थामे रहना।", translation: "Hold each other's hand all your life long.", lang: "hi" },
    { original: "आपके आँगन में सदा खुशियों के फूल खिलें।", translation: "May flowers of joy forever bloom in your courtyard.", lang: "hi" },
    { original: "हर सुख-दुख में एक-दूसरे के साथी बनो।", translation: "Be each other's companion in every joy and every sorrow.", lang: "hi" },
    { original: "आपका रिश्ता चाँद-सूरज जैसा अटूट हो।", translation: "May your bond be as unbreakable as the sun and the moon.", lang: "hi" },
    { original: "नई ज़िंदगी की शुरुआत मंगलमय हो।", translation: "May the beginning of your new life be auspicious.", lang: "hi" },
    { original: "विश्वास और सम्मान आपके प्रेम की नींव बने।", translation: "May trust and respect be the foundation of your love.", lang: "hi" },
    { original: "आपकी जोड़ी सलामत रहे, सदा हँसती-मुस्कुराती रहे।", translation: "May your pair be blessed, always laughing and smiling.", lang: "hi" },
    { original: "ईश्वर आप दोनों को सुख, शांति और समृद्धि दे।", translation: "May God grant you both happiness, peace and prosperity.", lang: "hi" },
    /* --- 10 Marathi --- */
    { original: "तुमचं सहजीवन सुखाचं आणि समृद्धीचं होवो.", translation: "May your life together be full of happiness and prosperity.", lang: "mr" },
    { original: "दोन कुटुंबं एक झाली, अभिनंदन!", translation: "Two families have become one — congratulations!", lang: "mr" },
    { original: "एकमेकांची साथ आयुष्यभर अशीच राहो.", translation: "May you stay by each other's side all your life.", lang: "mr" },
    { original: "तुमच्या संसारात नेहमी प्रेम आणि आनंद नांदो.", translation: "May love and joy always dwell in your home.", lang: "mr" },
    { original: "सुख-दुःखात एकमेकांचे आधार बना.", translation: "Be each other's support in joy and in sorrow.", lang: "mr" },
    { original: "तुमचं नातं विश्वासाने अधिक घट्ट होवो.", translation: "May your bond grow stronger with trust.", lang: "mr" },
    { original: "नवीन आयुष्याची सुरुवात मंगलमय होवो.", translation: "May the start of your new life be auspicious.", lang: "mr" },
    { original: "देव तुम्हाला निरोगी आणि दीर्घ आयुष्य देवो.", translation: "May God grant you health and a long life.", lang: "mr" },
    { original: "तुमची जोडी सदा सुखी राहो.", translation: "May your pair remain ever happy.", lang: "mr" },
    { original: "प्रेम, आदर आणि समजूतदारपणा सदैव राहो.", translation: "May love, respect and understanding always remain.", lang: "mr" }
  ];

  function dayOfYear() {
    var now = new Date();
    var start = new Date(now.getFullYear(), 0, 0);
    var diff = now - start;
    return Math.floor(diff / 86400000);
  }

  function setBlessing() {
    var b = BLESSINGS[dayOfYear() % BLESSINGS.length];
    var t = document.getElementById('blessingText');
    var tr = document.getElementById('blessingTranslation');
    if (t) t.textContent = b.original;
    if (tr) tr.textContent = b.translation;
  }
  window.setBlessing = setBlessing;

  /* ============================================================
     INIT
     ============================================================ */
  function init() {
    buildToggle();
    expose();
    setBlessing();
    // Refresh the blessing if the app is left open across midnight.
    setInterval(setBlessing, 60 * 60 * 1000);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
