/* =============================================================
   nav.js — collapsed nav + more drawer logic for YUGAL v2
   Loaded last. Depends on show() from app.js.
   ============================================================= */

/* Secondary tabs — these live in the More drawer, not the main nav */
const SECONDARY_TABS = ['decisions','tracker','rsvp','budget','panel-gallery','wishes'];

/* Track drawer state */
let moreDrawerOpen = false;

function toggleMore() {
  moreDrawerOpen ? closeMore() : openMore();
}

function openMore() {
  moreDrawerOpen = true;
  const drawer = document.getElementById('moreDrawer');
  const backdrop = document.getElementById('moreBackdrop');
  const btn = document.getElementById('moreBtn');
  if (drawer) { drawer.classList.add('open'); drawer.setAttribute('aria-hidden','false'); }
  if (backdrop) backdrop.classList.add('open');
  if (btn) btn.setAttribute('aria-expanded','true');
}

function closeMore() {
  moreDrawerOpen = false;
  const drawer = document.getElementById('moreDrawer');
  const backdrop = document.getElementById('moreBackdrop');
  const btn = document.getElementById('moreBtn');
  if (drawer) { drawer.classList.remove('open'); drawer.setAttribute('aria-hidden','true'); }
  if (backdrop) backdrop.classList.remove('open');
  if (btn) btn.setAttribute('aria-expanded','false');
}

/* Called by more-item buttons in the drawer */
function showMore(tab) {
  closeMore();
  /* De-activate main nav buttons */
  document.querySelectorAll('#navBar button[data-tab]').forEach(b => b.classList.remove('active'));
  /* Mark more button as secondary-active */
  const moreBtn = document.getElementById('moreBtn');
  if (moreBtn) moreBtn.classList.add('secondary-active');
  /* Activate the drawer item */
  document.querySelectorAll('.more-item').forEach(b => b.classList.remove('active'));
  const item = document.querySelector(`.more-item[data-tab="${tab}"]`);
  if (item) item.classList.add('active');
  /* Delegate to existing show() */
  if (typeof show === 'function') show(tab, null);
}

/* Patch the main show() to clear secondary state when a primary tab is picked */
(function patchShow() {
  const _orig = window.show;
  if (typeof _orig !== 'function') {
    // app.js might not be loaded yet — retry
    setTimeout(patchShow, 100);
    return;
  }
  window.show = function(id, btn) {
    const moreBtn = document.getElementById('moreBtn');
    if (!SECONDARY_TABS.includes(id)) {
      if (moreBtn) moreBtn.classList.remove('secondary-active');
      document.querySelectorAll('.more-item').forEach(b => b.classList.remove('active'));
    }
    return _orig(id, btn);
  };
})();

/* Close drawer on Escape */
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape' && moreDrawerOpen) closeMore();
});

/* ---- Language persistence (aria-pressed + localStorage) -------- */
/* Patch setLang to update aria-pressed */
(function patchLang() {
  const _orig = window.setLang;
  if (typeof _orig !== 'function') {
    setTimeout(patchLang, 100);
    return;
  }
  window.setLang = function(l) {
    _orig(l);
    document.querySelectorAll('.lang-switch button').forEach(b => {
      b.setAttribute('aria-pressed', b.getAttribute('data-l') === l ? 'true' : 'false');
      b.classList.toggle('on', b.getAttribute('data-l') === l);
    });
  };
})();

/* ---- Skeleton loader hide on budget render -------------------- */
(function hideBudgetSkeleton() {
  const skel = document.getElementById('budgetSkeleton');
  if (!skel) return;
  /* Hide after short delay so real content has time to render */
  setTimeout(function() { skel.classList.add('loaded'); }, 900);
})();

/* ---- Empty state hints ---------------------------------------- */
function updateEmptyHints() {
  /* Budget */
  const budgetList = document.getElementById('budgetList');
  const budgetHint = document.getElementById('budgetHint');
  if (budgetList && budgetHint) {
    budgetHint.classList.toggle('has-items', budgetList.children.length > 0);
  }
  /* Tracker */
  const todoList = document.getElementById('todoList');
  const trackerHint = document.getElementById('trackerHint');
  if (todoList && trackerHint) {
    trackerHint.classList.toggle('has-items', todoList.children.length > 0);
  }
}
/* Check on a short interval until state is rendered, then watch */
(function pollHints() {
  updateEmptyHints();
  let count = 0;
  const iv = setInterval(function() {
    updateEmptyHints();
    count++;
    if (count > 20) clearInterval(iv);
  }, 500);
})();

/* ---- Lightbox counter ----------------------------------------- */
/* Patch navLB and openLightbox to update counter */
(function patchLightbox() {
  function updateCounter() {
    const counter = document.getElementById('lbCounter');
    if (!counter) return;
    /* Try to read from gallery.js globals if exposed */
    if (typeof window._lbIdx !== 'undefined' && typeof window._lbTotal !== 'undefined') {
      counter.textContent = `${window._lbIdx + 1} / ${window._lbTotal}`;
    }
  }
  const _navOrig = window.navLB;
  if (typeof _navOrig === 'function') {
    window.navLB = function(d) { _navOrig(d); updateCounter(); };
  }
})();

/* ---- Who modal: expose closeWho for skip button --------------- */
window.closeWho = window.closeWho || function() {
  const modal = document.getElementById('whoModal');
  if (modal) modal.classList.add('hide');
};

/* ---- whoBtn: only show on interactive tabs -------------------- */
const IDENTITY_TABS = ['planner','decisions','rsvp','votes'];
function updateWhoBtnVisibility(tabId) {
  const btn = document.getElementById('whoBtn');
  if (!btn) return;
  btn.style.display = IDENTITY_TABS.includes(tabId) ? '' : 'none';
}
/* Hook into show */
(function hookWhoBtn() {
  const _orig = window.show;
  if (typeof _orig !== 'function') { setTimeout(hookWhoBtn, 150); return; }
  window.show = function(id, btn) {
    updateWhoBtnVisibility(id);
    return _orig(id, btn);
  };
})();
/* Set initial state */
updateWhoBtnVisibility('story');
