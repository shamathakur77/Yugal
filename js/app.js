/* =============================================================
   app.js — core application logic.
   Depends on (loaded first): lang.js, data.js, supabase.js, animations.js
   No framework, no build step. Functions are global so inline
   on* handlers in index.html can reach them.
   ============================================================= */

/* ---------- safe storage ----------
   Some hosts (sandboxed preview iframes, private-mode browsers) throw the
   moment we touch localStorage. We probe once and fall back to an in-memory
   store so the whole app keeps working (it just won't persist across reloads
   in those environments). On normal hosting / your phone, real localStorage
   is used and everything persists exactly as before. window.LS is shared by
   the other scripts (gallery.js) too. */
var LS = (function(){
  try{
    var k='__wp_probe__';
    window.localStorage.setItem(k,'1');
    window.localStorage.removeItem(k);
    return window.localStorage;
  }catch(e){
    var mem={};
    return {
      getItem:function(key){ return Object.prototype.hasOwnProperty.call(mem,key)?mem[key]:null; },
      setItem:function(key,val){ mem[key]=String(val); },
      removeItem:function(key){ delete mem[key]; }
    };
  }
})();
window.LS = LS;

/* ---------- persisted state ---------- */
let lang = LS.getItem('wp_lang') || 'en';
let me   = LS.getItem('wp_me')   || null;
let STATE = (function(){ try{ return JSON.parse(LS.getItem('wp_state') || '{}'); }catch(e){ return {}; } })();

/* Ensure every collection exists no matter what shape we loaded. */
function normaliseState(){
  STATE.checks  = STATE.checks  || {};
  STATE.votes   = STATE.votes   || {};
  STATE.vendors = STATE.vendors || {};
  STATE.todos   = STATE.todos   || [];
  STATE.budget  = STATE.budget  || [];
  STATE.wishes  = STATE.wishes  || [];
  STATE.rsvp    = STATE.rsvp    || [];
}
normaliseState();

/* localStorage is the source of truth; cloud sync layers on top. */
function saveLocal(){
  try{ LS.setItem('wp_state', JSON.stringify(STATE)); }
  catch(e){ console.warn('local save failed', e); }
}


/* ---------- people, owner colours, the date ---------- */
const PEOPLE = {
  RomaFam:     { color:"var(--p-roma)", init:"R" },
  PrashantFam: { color:"var(--p-pfam)", init:"प" },
};
const OWNER_COLOR = { ROMAFAM:"var(--p-roma)", PRASHANTFAM:"var(--p-pfam)", ALL:"var(--p-all)" };

/* ---- Change the wedding date here anytime: new Date(YYYY, MM-1, DD) ---- */
const WEDDING_DATE = new Date(2026, 10, 25); // 25 Nov 2026 (month 10 = November)
/* ----------------------------------------------------------------------- */


/* ===================== RENDERERS & ACTIONS ===================== */
function ownerPill(o){ const color=OWNER_COLOR[o]||"var(--p-all)"; const map={ROMAFAM:"RomaFam",PRASHANTFAM:"PrashantFam",ALL:"ALL"};
  let label=o==="ALL"?"ALL":(T[lang].people[map[o]]||map[o]);
  return `<span class="owner" style="background:${color}22;color:${color}">${label}</span>`; }

function monthProgress(mi){ const items=MONTHS[lang][mi].items; let done=0;
  items.forEach((_,ii)=>{ if(STATE.checks[`${mi}-${ii}`]) done++; });
  return {done, total:items.length, pct:Math.round(done/items.length*100)}; }

function renderProgress(){
  const M=MONTHS[lang]; const short=['Jun','Aug','Sep','Oct','Nov','Dec'];
  let h=`<div class="pstrip">`;
  M.forEach((mo,mi)=>{ const p=monthProgress(mi); const r=15.5, circ=2*Math.PI*r, off=circ*(1-p.pct/100);
    h+=`<div class="pring" onclick="jumpMonth(${mi})">
      <svg width="42" height="42" viewBox="0 0 42 42"><circle cx="21" cy="21" r="${r}" fill="none" stroke="rgba(224,160,48,.18)" stroke-width="3.5"/>
      <circle cx="21" cy="21" r="${r}" fill="none" stroke="${p.pct===100?'#5fa89c':'var(--gold)'}" stroke-width="3.5" stroke-linecap="round"
        stroke-dasharray="${circ}" stroke-dashoffset="${off}" transform="rotate(-90 21 21)" style="transition:stroke-dashoffset .5s"/>
      <text x="21" y="25" text-anchor="middle" font-size="10" fill="var(--ink)" font-family="DM Mono">${p.pct}</text></svg>
      <span>${short[mi]}</span></div>`;
  });
  h+=`</div>`;
  document.getElementById('progressStrip').innerHTML=h;
}
function jumpMonth(mi){ const els=document.querySelectorAll('#plannerBody .month'); if(els[mi]) els[mi].scrollIntoView({behavior:'smooth',block:'start'}); }

function renderPlanner(){ const M=MONTHS[lang]; let h="";
  M.forEach((mo,mi)=>{ h+=`<div class="month"><h2 class="serif">${mo.m}</h2><div class="tag">${mo.tag}</div></div><div class="card">`;
    mo.items.forEach((it,ii)=>{ const key=`${mi}-${ii}`,done=STATE.checks[key];
      h+=`<div class="item ${done?'done':''}" onclick="toggleCheck('${key}')"><div class="box"></div><div class="txt">${it[0]}</div>${ownerPill(it[1])}</div>`;});
    h+=`</div>`; });
  document.getElementById('plannerBody').innerHTML=h; renderProgress(); }

function vdot(name){ const p=PEOPLE[name]; if(!p)return''; return `<span class="vdot" style="background:${p.color}" title="${name}">${p.init}</span>`; }

function renderDecisions(){ const D=DECISIONS[lang]; let h=familySplitHTML()+`<div class="tree-hint">${T[lang].splitTitle} · ${MONTHS[lang].reduce((a,m)=>a+m.items.length,0)} tasks total</div>`+`<div class="banner">${T[lang].decBanner}</div>`;
  D.forEach(d=>{ const votes=STATE.votes[d.id]||{}; const counts=d.opts.map((_,i)=>Object.values(votes).filter(v=>v===i).length); const total=Object.keys(votes).length;
    h+=`<div class="decision"><div class="q serif">${d.q}</div>`;
    d.opts.forEach((o,i)=>{ const mine=me&&votes[me]===i; const pct=total?Math.round(counts[i]/total*100):0;
      const voters=Object.keys(votes).filter(n=>votes[n]===i).map(vdot).join('');
      h+=`<div class="opt ${mine?'voted':''}"><div class="top"><div class="label">${o}</div><button class="votebtn" onclick="castVote('${d.id}',${i})">${mine?T[lang].voted:T[lang].voteBtn}</button></div><div class="bar"><i style="width:${pct}%"></i></div><div class="tally"><span>${counts[i]} ${counts[i]!==1?T[lang].votes:T[lang].vote1} · ${pct}%</span><span class="voters">${voters}</span></div></div>`; });
    h+=`</div>`; });
  document.getElementById('decisions').innerHTML=h; }

function renderVendors(){ const V=VENDORS[lang]; let h=`<div class="banner">${T[lang].venBanner}</div><div class="card">`;
  V.forEach((v,i)=>{
    const vd=STATE.vendors[i]||{};
    const stStr=typeof vd==='string'?vd:vd.status||'wait';
    const lbl={wait:T[lang].vWait,replied:T[lang].vReplied,booked:T[lang].vBooked}[stStr];
    const cls={wait:'s-wait',replied:'s-replied',booked:'s-booked'}[stStr];
    const note=(typeof vd==='object'&&vd.notes)||'';
    const preview=note?note.slice(0,40)+(note.length>40?'…':''):'';
    const previewHtml=note?`<div class="vnote-preview">${preview}</div>`:`<div class="vnote-preview">tap 📝 to add notes</div>`;
    h+=`<div class="vendor" style="flex-wrap:wrap;">
      <div class="vavatar" style="background:linear-gradient(135deg,var(--teal),var(--rust))">${v[0]}</div>
      <div class="vinfo" style="min-width:0;">
        <div class="vn">${v[1]} <button class="vnote-btn" onclick="toggleVnote(${i})" title="Notes">📝</button></div>
        <div class="vr">${v[2]}</div>
        <div id="vprev${i}">${previewHtml}</div>
      </div>
      <button class="vstatus ${cls}" onclick="cycleVendor(${i})">${lbl}</button>
      <div class="vnotes-wrap" id="vnw${i}">
        <textarea class="vnotes-area" id="vta${i}" maxlength="280"
          placeholder="Notes…"
          oninput="document.getElementById('vct${i}').textContent=(280-this.value.length)+' left'"
          onblur="saveVendorNote(${i})"
        >${note}</textarea>
        <div class="vnotes-count" id="vct${i}">${280-note.length} left</div>
      </div>
    </div>`;
  });
  h+=`</div>`; document.getElementById('vendors').innerHTML=h; }

function renderTodos(){ const l=document.getElementById('todoList');
  if(!STATE.todos.length){ l.innerHTML=`<div class="empty">${T[lang].todoEmpty}</div>`; return;}
  l.innerHTML=`<div class="card">`+STATE.todos.map((t,i)=>{ const color=t.by&&PEOPLE[t.by]?PEOPLE[t.by].color:"var(--p-all)"; const lab=t.by?(T[lang].people[t.by]||t.by).split(' · ')[0]:'';
    return `<div class="item ${t.done?'done':''}" onclick="toggleTodo(${i})"><div class="box"></div><div class="txt">${t.text}</div>${t.by?`<span class="owner" style="background:${color}22;color:${color}">${lab}</span>`:''}</div>`;}).join('')+`</div>`; }

function renderBudget(){ const l=document.getElementById('budgetList'); let total=0;
  l.innerHTML=STATE.budget.length?STATE.budget.map((b,i)=>{ total+=Number(b.amt)||0; return `<div class="brow"><div class="bcat">${b.cat}</div><div class="bamt">₹${Number(b.amt).toLocaleString('en-IN')}</div><button class="vstatus s-wait" onclick="delBudget(${i})">✕</button></div>`;}).join(''):`<div class="empty">${T[lang].budgetEmpty}</div>`;
  document.getElementById('bTotal').textContent='₹'+total.toLocaleString('en-IN'); }

function renderAll(){ renderPlanner();renderDecisions();renderVendors();renderTodos();renderBudget();renderWishes();renderSoul();renderStory();renderRsvp(); }

/* ---- wishes wall ---- */
function toggleReaction(wi,emoji){
  if(!me){openWho();return;}
  const w=STATE.wishes[wi];
  if(!w.reactions)w.reactions={};
  if(!w.reactions[emoji])w.reactions[emoji]=[];
  const arr=w.reactions[emoji];
  const idx=arr.indexOf(me);
  if(idx>-1)arr.splice(idx,1); else arr.push(me);
  commit();renderWishes();
}
function renderWishes(){ const l=document.getElementById('wishList'); if(!l)return;
  if(!STATE.wishes.length){ l.innerHTML=`<div class="empty">${T[lang].wishEmpty}</div>`; return;}
  l.innerHTML=STATE.wishes.map((w,i)=>{ const color=w.by&&PEOPLE[w.by]?PEOPLE[w.by].color:"var(--p-all)"; const lab=w.by?(T[lang].people[w.by]||w.by):'';
    const rx=w.reactions||{};
    const pills=REACTIONS.map(e=>{ const voters=rx[e]||[]; const active=me&&voters.includes(me);
      return `<button class="wreact-pill${active?' active':''}" onclick="toggleReaction(${i},'${e}')"><span>${e}</span><span class="rcount">${voters.length||''}</span></button>`;}).join('');
    return `<div class="wish" style="border-left:3px solid ${color}"><div class="wtext">"${w.text}"</div><div class="wby" style="color:${color}">— ${lab}</div><div class="wreact-row">${pills}</div></div>`;}).join(''); }
function addWish(){ const el=document.getElementById('newWish'),t=el.value.trim(); if(!t)return; STATE.wishes.unshift({text:t,by:me||'',reactions:{}}); el.value=''; commit(); renderWishes(); }
// ===== RSVP =====  (RSVP_T string map + rsvpT() live in lang.js)
function addGuest(){const el=document.getElementById('rsvpName');const name=el.value.trim();if(!name)return;if(!STATE.rsvp)STATE.rsvp=[];STATE.rsvp.push({id:Date.now(),name,events:'both',status:'pending',family:'roma',veg:false});el.value='';commit();renderRsvp();}
function cycleRsvpStatus(id){const g=STATE.rsvp.find(x=>x.id===id);if(!g)return;const cycle={pending:'confirmed',confirmed:'declined',declined:'pending'};g.status=cycle[g.status]||'pending';commit();renderRsvp();}
function toggleRsvpEvent(id,val){const g=STATE.rsvp.find(x=>x.id===id);if(!g)return;if(val==='both'){g.events='both';}else{g.events=(g.events===val)?'both':val;}commit();renderRsvp();}
function toggleRsvpFamily(id,val){const g=STATE.rsvp.find(x=>x.id===id);if(!g)return;g.family=val;commit();renderRsvp();}
function toggleRsvpVeg(id){const g=STATE.rsvp.find(x=>x.id===id);if(!g)return;g.veg=!g.veg;commit();renderRsvp();}
function toggleRsvpCard(id){const el=document.getElementById('rc-'+id);if(el)el.classList.toggle('open');}
function deleteGuest(id){STATE.rsvp=STATE.rsvp.filter(x=>x.id!==id);commit();renderRsvp();}
function renderRsvp(){
  if(!STATE.rsvp)STATE.rsvp=[];
  const el=document.getElementById('rsvpList');if(!el)return;
  const confirmed=STATE.rsvp.filter(g=>g.status==='confirmed').length;
  const pending=STATE.rsvp.filter(g=>g.status==='pending').length;
  const declined=STATE.rsvp.filter(g=>g.status==='declined').length;
  const total=STATE.rsvp.length;
  const sm=document.getElementById('rsvpSummary');
  if(sm)sm.innerHTML=
    '<div class="rsvp-stat st-confirmed"><span class="rs-num">'+confirmed+'</span>'+rsvpT('confirmed')+'</div>'+
    '<div class="rsvp-stat st-pending"><span class="rs-num">'+pending+'</span>'+rsvpT('pending')+'</div>'+
    '<div class="rsvp-stat st-declined"><span class="rs-num">'+declined+'</span>'+rsvpT('declined')+'</div>'+
    '<div class="rsvp-stat st-total"><span class="rs-num">'+total+'</span>'+rsvpT('total')+'</div>';
  if(!total){el.innerHTML='<div class="empty">'+(lang==='hi'?'\u0905\u092d\u0940 \u0915\u094b\u0908 \u0905\u0924\u093f\u0925\u093f \u0928\u0939\u0940\u0902':lang==='mr'?'\u0905\u0926\u094d\u092f\u093e\u092a \u092a\u093e\u0939\u0941\u0923\u0947 \u0928\u093e\u0939\u0940\u0924':'No guests yet. Add the first one above.')+'</div>';return;}
  el.innerHTML=STATE.rsvp.map(function(g){
    var stCls='st-'+g.status;
    var stLabel={pending:rsvpT('pending'),confirmed:rsvpT('confirmed'),declined:rsvpT('declined')}[g.status]||g.status;
    var nashikOn=(g.events==='nashik'||g.events==='both');
    var bharOn=(g.events==='bharatpur'||g.events==='both');
    return '<div class="rsvp-card" id="rc-'+g.id+'">'+
      '<div class="rsvp-card-head" onclick="toggleRsvpCard('+g.id+')">'+
        '<span class="rc-name">'+g.name+'</span>'+
        '<button class="rc-status '+stCls+'" onclick="event.stopPropagation();cycleRsvpStatus('+g.id+')">'+stLabel+'</button>'+
        '<button class="rc-del" onclick="event.stopPropagation();deleteGuest('+g.id+')">&#x2715;</button>'+
      '</div>'+
      '<div class="rsvp-card-body">'+
        '<div class="rc-pills">'+
          '<button class="rc-pill'+(nashikOn?' on':'')+'" onclick="toggleRsvpEvent('+g.id+',&#39;nashik&#39;)">'+rsvpT('nashik')+'</button>'+
          '<button class="rc-pill'+(bharOn?' on':'')+'" onclick="toggleRsvpEvent('+g.id+',&#39;bharatpur&#39;)">'+rsvpT('bharatpur')+'</button>'+
          '<button class="rc-pill'+(g.events==='both'?' on':'')+'" onclick="toggleRsvpEvent('+g.id+',&#39;both&#39;)">'+rsvpT('both')+'</button>'+
        '</div>'+
        '<div class="rc-fam">'+
          '<button class="'+(g.family==='roma'?'on-roma':'')+'" onclick="toggleRsvpFamily('+g.id+',&#39;roma&#39;)">'+rsvpT('roma')+'</button>'+
          '<button class="'+(g.family==='prashant'?'on-prashant':'')+'" onclick="toggleRsvpFamily('+g.id+',&#39;prashant&#39;)">'+rsvpT('prashant')+'</button>'+
          '<button class="rc-pill'+(g.veg?' on':'')+'" style="margin-left:auto" onclick="toggleRsvpVeg('+g.id+')">'+rsvpT('veg')+'</button>'+
        '</div>'+
      '</div>'+
    '</div>';
  }).join('');
  const ri=document.getElementById('rsvpName');if(ri)ri.placeholder=(lang==='hi'?'\u0905\u0924\u093f\u0925\u093f \u0915\u093e \u0928\u093e\u092e…':lang==='mr'?'\u092a\u093e\u0939\u0941\u0923\u094d\u092f\u093e\u091a\u0947 \u0928\u093e\u0935…':'Guest name…');
}
document.addEventListener('keydown',function(e){if(document.activeElement&&document.activeElement.id==='rsvpName'&&e.key==='Enter')addGuest();});


/* ---- family split / venn (rendered into decisions top) ---- */
function familySplitHTML(){
  // count owner tags across all months
  let roma=0,prashant=0,shared=0;
  MONTHS[lang].forEach(mo=>mo.items.forEach(it=>{ if(it[1]==='ROMAFAM')roma++; else if(it[1]==='PRASHANTFAM')prashant++; else shared++; }));
  return `<div class="venn">
    <div class="vc" style="--c:var(--p-roma)"><div class="vcount">${roma}</div><div class="vlab">${T[lang].people.RomaFam}</div></div>
    <div class="vshared"><div class="vcount">${shared}</div><div class="vlab">${T[lang].sharedTitle}</div></div>
    <div class="vc" style="--c:var(--p-pfam)"><div class="vcount">${prashant}</div><div class="vlab">${T[lang].people.PrashantFam}</div></div>
  </div>`;
}

/* ---- soul / esoteric tab ---- */

/* ---------- header reel + story jump ---------- */
function buildHeaderReel(){
  const el=document.getElementById('headerReel');if(!el)return;
  el.innerHTML=[0,9,5].map(i=>`<div class="reel-frame" onclick="goStory()"><img src="${PHOTOS[i].b64}" loading="lazy" alt=""></div>`).join('');
}
function goStory(){renderStory();const b=document.querySelector('[data-tab=story]');if(b)show('story',b);}

/* ---------- Soul tab (built inline; no external SOUL data) ---------- */
function renderSoul(){
  const el=document.getElementById('soul');if(!el)return;
  const T2=(e,h,m)=>({en:e,hi:h,mr:m}[lang]||e);
  const chakra=`<svg width="70" height="70" viewBox="0 0 70 70" fill="none" class="chakra-spin"><circle cx="35" cy="35" r="32" stroke="var(--gold)" stroke-width=".8" opacity=".35"/><circle cx="35" cy="35" r="23" stroke="var(--teal)" stroke-width=".7" opacity=".45"/><circle cx="35" cy="35" r="14" stroke="var(--rust)" stroke-width=".9" opacity=".5"/><circle cx="35" cy="35" r="5" fill="var(--gold)" opacity=".65"/>${Array.from({length:16},(_,i)=>{const a=i*22.5*Math.PI/180,x1=35+14*Math.cos(a),y1=35+14*Math.sin(a),x2=35+32*Math.cos(a),y2=35+32*Math.sin(a);return`<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="var(--gold)" stroke-width=".4" opacity=".25"/>`;}).join('')}${Array.from({length:8},(_,i)=>{const a=i*45*Math.PI/180,x=35+23*Math.cos(a),y=35+23*Math.sin(a);return`<path d="M${x.toFixed(1)} ${(y-2.5).toFixed(1)} Q${(x+2.5).toFixed(1)} ${y.toFixed(1)} ${x.toFixed(1)} ${(y+2.5).toFixed(1)} Q${(x-2.5).toFixed(1)} ${y.toFixed(1)} ${x.toFixed(1)} ${(y-2.5).toFixed(1)}" fill="var(--rust)" opacity=".55"/>`;}).join('')}</svg>`;
  el.innerHTML=`<div style="text-align:center;padding:18px 8px 6px;"><div style="display:flex;justify-content:center;margin-bottom:6px;">${chakra}</div><div class="soul-om">ॐ</div><div class="soul-shloka">ॐ तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि<br>धियो यो नः प्रचोदयात्</div><div class="soul-shloka-tr">${T2("May divine light illuminate this union — Gayatri Mantra","यह दिव्य प्रकाश इस मिलन को रोशन करे","हे दिव्य प्रकाश या मिलनाला उजळो")}</div><div style="display:inline-block;background:rgba(232,165,95,.12);border:1px solid rgba(232,165,95,.3);color:var(--rust);border-radius:20px;font-size:9px;padding:4px 12px;">Roma · 15 Dec 1994, 22:45, Nashik &nbsp;|&nbsp; Prashant · 14 Mar 1993</div></div>
<div class="soul-thread"><div class="st-icon">♃</div><div class="st-title">${T2("Both ruled by Jupiter — Devguru","दोनों बृहस्पति के — देवगुरु","दोघे गुरूचे — देवगुरू")}</div><p>${T2("Roma is Dhanu (Sagittarius), Prashant is Meena (Pisces) — both Jupiter's rashis. In Jyotish, Brihaspati is Devguru: planet of dharma, wisdom, and abundance. Two people whose life-purpose answers to the same guru is considered deeply auspicious in shastra.","रोमा धनु, प्रशांत मीन — दोनों बृहस्पति की राशियाँ। बृहस्पति देवगुरु — धर्म, ज्ञान, समृद्धि। शास्त्र में अत्यंत शुभ।","रोमा धनु, प्रशांत मीन — दोन्ही गुरूच्या राशी. गुरू देवगुरू — धर्म, ज्ञान, समृद्धी. शास्त्रात अत्यंत शुभ.")}</p><div class="st-live">${T2("Their home will be a tirtha. A daily puja or shared meal will keep the big Jupiter dreams rooted in earth.","उनका घर एक तीर्थ होगा। दैनिक पूजा या साझा भोजन बड़े सपनों को ज़मीन से जोड़े रखेगा।","त्यांचे घर एक तीर्थ असेल. दैनंदिन पूजा किंवा एकत्र जेवण मोठ्या स्वप्नांना जमिनीशी जोडेल.")}</div></div>
<div class="rashi-row"><div class="rashi-tile"><div class="rashi-sym">♐</div><div class="rashi-devname">धनु राशि</div><div style="font-size:11px;color:var(--gold);margin-bottom:3px;">Roma</div><div class="rashi-sub">${T2("Sagittarius · Fire · Dual","अग्नि · द्विस्वभाव","अग्नी · द्विस्वभाव")}</div></div><div class="rashi-tile"><div class="rashi-sym">♓</div><div class="rashi-devname">मीन राशि</div><div style="font-size:11px;color:var(--rust);margin-bottom:3px;">Prashant</div><div class="rashi-sub">${T2("Pisces · Water · Dual","जल · द्विस्वभाव","जल · द्विस्वभाव")}</div></div></div>
<div class="puja-border"><div class="puja-title">नक्षत्र · Nakshatra</div><p style="font-size:11px;color:var(--muted);text-align:center;margin:0 0 10px;">${T2("The lunar mansion at birth — the soul's fingerprint in Jyotish","जन्म के समय चंद्र नक्षत्र — ज्योतिष में आत्मा की पहचान","जन्माच्या वेळी चंद्र नक्षत्र — ज्योतिषात आत्म्याची ओळख")}</p><div class="naksh-row"><span class="naksh-pill">🌙 Roma · ${T2("Uttara Ashadha","उत्तराषाढ़ा","उत्तराषाढा")}</span><span class="naksh-pill" style="border-color:var(--teal);color:var(--teal);">🌙 Prashant · Revati</span></div><div style="font-size:9px;color:var(--muted);text-align:center;">${T2("Exact nakshatras confirmed by pandit","सटीक नक्षत्र पंडित द्वारा पुष्टि","अचूक नक्षत्र पंडितजींकडून पुष्टी")}</div></div>
<div class="hd-block"><div style="font-family:'Cormorant Garamond',serif;font-size:17px;color:var(--gold-bright);font-weight:700;margin-bottom:10px;text-align:center;">✦ ${T2("Human Design · Roma (22:45)","ह्यूमन डिज़ाइन · रोमा (22:45)","ह्यूमन डिझाइन · रोमा (22:45)")} ✦</div>${[["⚡","TYPE",T2("Manifesting Generator","मैनिफेस्टिंग जनरेटर","मॅनिफेस्टिंग जनरेटर"),T2("Built to respond first, then initiate. High energy, multi-passionate. When frustrated — slow down and wait for a gut response.","पहले प्रतिक्रिया, फिर शुरू। उच्च ऊर्जा। निराश हों तो रुकें।","आधी प्रतिसाद, मग सुरू. उच्च ऊर्जा. निराश झाल्यास थांबा.")],["🎭","PROFILE",T2("3/5 — Martyr & Heretic","3/5 — शहीद और विधर्मी","3/5 — शहीद आणि विधर्मी"),T2("Learns through lived experience (line 3), then becomes the guide others look to (line 5). Her mistakes are her greatest teachers.","अनुभव से सीखती हैं, फिर मार्गदर्शक बनती हैं। उनकी गलतियाँ ही उनके गुरु।","अनुभवातून शिकते, मग मार्गदर्शक होते. चुकाच गुरू.")],["🔴","AUTHORITY",T2("Sacral — gut response","सेक्रल — पेट की आवाज़","सेक्रल — आतड्याचा आवाज"),T2("Decisions live in the body. A physical yes or no — not mental analysis. Big decisions: sleep on it first.","निर्णय शरीर में। बड़े फ़ैसले सोने के बाद बेहतर।","निर्णय शरीरात. मोठे निर्णय झोपेनंतर घेणे बरे.")],["✨","SIGNATURE",T2("Satisfaction & Peace","संतुष्टि और शांति","समाधान आणि शांती"),T2("When she responds to life rather than forces it, she feels deep satisfaction. Frustration = signal to pause.","थोपती नहीं, प्रतिक्रिया देती हैं — गहरी संतुष्टि। निराशा = रुकने का संकेत।","लादत नाही, प्रतिसाद देते — खोल समाधान. निराशा = थांबण्याचा संकेत.")]].map(([ico,sys,val,desc])=>`<div class="hd-row2"><div class="hd-ico">${ico}</div><div style="flex:1;"><div class="hd-sys">${sys}</div><div class="hd-val">${val}</div><div class="hd-desc">${desc}</div></div></div>`).join('')}<div style="font-size:9px;color:var(--muted);margin-top:8px;padding-top:8px;border-top:1px solid var(--line);">${T2("Computed from: 15 Dec 1994, 22:45, Nashik. Prashant HD pending birth time.","गणना: 15 दिसं 1994, 22:45, नासिक। प्रशांत का HD जन्म समय पर निर्भर।","गणना: 15 डिसें 1994, 22:45, नाशिक. प्रशांत HD जन्मवेळेवर अवलंबून.")}</div></div>
<div class="soul-cards"><div class="soul-card" style="--accent:var(--rust)"><span class="sc-icon">🔥💧</span><div class="sc-sys">${T2("VEDIC JYOTISH","वैदिक ज्योतिष","वैदिक ज्योतिष")}</div><div class="sc-title">${T2("Agni & Jal","अग्नि और जल","अग्नी आणि जल")}</div><div class="sc-body">${T2("Roma's Dhanu agni is honest, expansive — moves toward the horizon. Prashant's Meena jal is deep and empathetic. Fire and water create shakti when respected.","रोमा की अग्नि विस्तारशील। प्रशांत का जल गहरा। साथ — शक्ति बनती है।","रोमाची अग्नी विस्तारशील. प्रशांतचे जल खोल. एकत्र — शक्ती.")}</div><div class="sc-live">${T2("Her independence is Dhanu dharma. His silence is Meena depth. Name this for each other early.","उनकी स्वतंत्रता धनु धर्म है। उनकी चुप्पी मीन गहराई।","तिचे स्वातंत्र्य धनु धर्म. त्याची शांतता मीन खोली.")}</div></div><div class="soul-card" style="--accent:var(--gold)"><span class="sc-icon">५✦३</span><div class="sc-sys">${T2("NUMEROLOGY","अंक ज्योतिष","अंकशास्त्र")}</div><div class="sc-title">${T2("Path 5 & 3","जीवन पथ 5 & 3","जीवनमार्ग 5 & 3")}</div><div class="sc-body">${T2("Roma: 5 = freedom, change, the seeker. Prashant: 3 = joy, expression, the storyteller. Together: a home that moves, laughs, and never settles small.","रोमा 5: स्वतंत्रता। प्रशांत 3: आनंद। साथ: चलता-हँसता घर।","रोमा 5: स्वातंत्र्य. प्रशांत 3: आनंद. एकत्र: चालणारे, हसणारे घर.")}</div><div class="sc-live">${T2("Two free spirits need one fixed ritual — a weekly puja or a Sunday meal.","एक स्थिर रिवाज़ चाहिए — साप्ताहिक पूजा या भोजन।","एक स्थिर प्रथा हवी — साप्ताहिक पूजा किंवा जेवण.")}</div></div><div class="soul-card" style="--accent:var(--teal)"><span class="sc-icon">🐕🐓</span><div class="sc-sys">${T2("CHINESE","चीनी","चिनी")}</div><div class="sc-title">${T2("Wood Dog & Water Rooster","वृक्ष कुत्ता & जल मुर्गा","लाकडी कुत्रा & कोंबडा")}</div><div class="sc-body">${T2("Roma: Yang Wood Dog — loyal, shelters her people. Prashant: Yin Water Rooster — sharp, sees every detail. Water feeds wood: his depth nourishes her growth.","रोमा: वफ़ादार रक्षक। प्रशांत: तेज़, बारीकबीन। पानी लकड़ी को पोसता है।","रोमा: निष्ठावान रक्षक. प्रशांत: तीक्ष्ण. पाणी लाकडाला पोसतं.")}</div><div class="sc-live">${T2("She gives loyalty; he gives clarity. This natural split saves a hundred arguments.","वह वफ़ादारी दे; वह स्पष्टता। यह सौ झगड़े बचाता है।","तिने निष्ठा; त्याने स्पष्टता. हे शंभर भांडणे वाचवते.")}</div></div><div class="soul-card" style="--accent:#c97ba0"><span class="sc-icon">🕯️📿</span><div class="sc-sys">${T2("JUNG + KABBALAH","युंग + कबाला","युंग + कबाला")}</div><div class="sc-title">${T2("Seeker & Dreamer","खोजी और स्वप्नद्रष्टा","शोधक आणि स्वप्नाळू")}</div><div class="sc-body">${T2("Roma: the Seeker — moves toward truth. Prashant: the Dreamer — feels what can't be named. The Kabbalah caution: two Jupiter natures can overgive. The loving no is as sacred as the yes.","रोमा: खोजी। प्रशांत: स्वप्नद्रष्टा। कबाला: उदार स्वभाव को 'ना' भी सीखनी चाहिए।","रोमा: शोधक. प्रशांत: स्वप्नाळू. कबाला: 'नाही'ही शिकायला हवे.")}</div><div class="sc-live">${T2("The loving boundary protects the generosity. A no to the wrong things is a yes to what truly matters.","प्रेमपूर्ण सीमा ही उदारता की रक्षा है।","प्रेमळ मर्यादाच औदार्याचे रक्षण करते.")}</div></div></div>
<div class="compat-bar-wrap card"><div style="font-family:'Noto Serif Devanagari',serif;font-size:14px;color:var(--gold-bright);margin-bottom:10px;font-weight:700;text-align:center;">${T2("✦ Guna Milan — A Glimpse ✦","✦ गुण मिलन — एक झलक ✦","✦ गुण मिलन — एक झलक ✦")}</div>${[["Dharma alignment",88],["Samvad",80],["Vikas saath",92],["Dharathal",72]].map(([l,p])=>`<div class="compat-label"><span>${l}</span><span style="color:var(--gold)">${p}%</span></div><div class="compat-bar"><i style="width:${p}%"></i></div><div style="height:8px;"></div>`).join('')}<div style="font-size:9px;color:var(--muted);margin-top:4px;">${T2("Indicative. Full Kundali Milan by a trusted pandit is the sacred final word.","सांकेतिक। पूर्ण कुंडली मिलान पंडित द्वारा।","सांकेतिक. पूर्ण कुंडली मिलान पंडितजींकडून.")}</div></div>
<div class="soul-oneline"><div class="sol-em">🪔</div><h3>${T2("Two diyas, one jyoti","दो दीपक, एक ज्योति","दोन दिवे, एक ज्योत")}</h3><p>${T2("Two generous Jupiter-blessed souls who will build something vast — if they also tend the small steady flame between them. The vision takes care of itself. Protect the hearth.","दो उदार आत्माएँ कुछ विशाल बनाएँगी — अगर वे अपने बीच की छोटी ज्वाला की देखभाल करें। चूल्हा सँभालें।","दोन उदार जीव काहीतरी विशाल उभारतील — जर ते लहानशी ज्योत जपतील. चूल जपा.")}</p></div>`;
}

/* ---------- Story tab (gallery from data.js PHOTOS) ---------- */
function renderStory(){
  const el=document.getElementById('story');if(!el)return;
  const T2=(e,h,m)=>({en:e,hi:h,mr:m}[lang]||e);
  const rng=`<svg width="56" height="56" viewBox="0 0 56 56" fill="none"><circle cx="28" cy="28" r="25" stroke="var(--gold)" stroke-width=".7" opacity=".5" stroke-dasharray="3 4"/><circle cx="28" cy="28" r="17" stroke="var(--rust)" stroke-width=".6" opacity=".4"/><circle cx="28" cy="28" r="9" stroke="var(--gold)" stroke-width=".8" opacity=".6"/><circle cx="28" cy="28" r="3" fill="var(--gold)" opacity=".8"/>${Array.from({length:8},(_,i)=>{const a=i*45*Math.PI/180,x1=28+9*Math.cos(a),y1=28+9*Math.sin(a),x2=28+25*Math.cos(a),y2=28+25*Math.sin(a);return`<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="var(--gold)" stroke-width=".5" opacity=".3"/>`;}).join('')}${Array.from({length:6},(_,i)=>{const a=i*60*Math.PI/180,x=28+17*Math.cos(a),y=28+17*Math.sin(a);return`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="1.8" fill="var(--rust)" opacity=".65"/>`;}).join('')}</svg>`;
  el.innerHTML=`<div style="text-align:center;padding:16px 8px 4px;"><div style="display:flex;justify-content:center;margin-bottom:6px;">${rng}</div><div class="story-rule"></div><div class="story-tag-dev">${T2("शुभ विवाह · Roka Ceremony","शुभ विवाह · रोका","शुभ विवाह · रोका")}</div><h2 class="story-h2">${T2("Our Story","हमारी कहानी","आपली कथा")}</h2><p style="font-size:11px;color:var(--muted);line-height:1.5;max-width:300px;margin:0 auto 8px;">${T2("The day two families said yes. Nashik, 18 February 2026.","वो दिन जब दोनों परिवारों ने हाँ कहा। नासिक, 18 फरवरी 2026।","ज्या दिवशी दोन्ही कुटुंबांनी होकार दिला. नाशिक, 18 फेब्रुवारी 2026.")}</p><div class="story-rule"></div></div>
<div class="sdivider"><span>✦ ${T2("Roma & Prashant","रोमा और प्रशांत","रोमा आणि प्रशांत")} ✦</span></div>
<div class="hscroll">${[0,1,5].map(i=>{const p=PHOTOS[i];return`<div class="hs-item" onclick="openLB(${i})"><img src="${p.b64}" loading="lazy" alt=""><div class="hs-cap">${p.captions[lang]||p.captions.en}</div></div>`;}).join('')}</div>
<div class="sdivider"><span>🪔 ${T2("Aarti & Blessings","आरती और आशीर्वाद","आरती आणि आशीर्वाद")} 🪔</span></div>
<div class="sg2">${[2,7].map(i=>{const p=PHOTOS[i];return`<div class="sg-item" onclick="openLB(${i})"><img src="${p.b64}" loading="lazy" alt=""><div class="sg-cap">${p.captions[lang]||p.captions.en}</div></div>`;}).join('')}<div class="sg-item sg-wide" onclick="openLB(4)"><img src="${PHOTOS[4].b64}" loading="lazy" alt=""><div class="sg-cap">${PHOTOS[4].captions[lang]||PHOTOS[4].captions.en}</div></div></div>
<div class="sdivider"><span>🌸 ${T2("Both Families","दोनों परिवार","दोन्ही कुटुंबे")} 🌸</span></div>
<div class="sg2">${[3,6].map(i=>{const p=PHOTOS[i];return`<div class="sg-item" onclick="openLB(${i})"><img src="${p.b64}" loading="lazy" alt=""><div class="sg-cap">${p.captions[lang]||p.captions.en}</div></div>`;}).join('')}</div>
<div class="sdivider"><span>☀️ ${T2("The Day After","अगले दिन","दुसऱ्या दिवशी")} ☀️</span></div>
<div class="hscroll">${[8,9].map(i=>{const p=PHOTOS[i];return`<div class="hs-item" onclick="openLB(${i})"><img src="${p.b64}" loading="lazy" alt=""><div class="hs-cap">${p.captions[lang]||p.captions.en}</div></div>`;}).join('')}</div>
<div class="story-blessing"><p>${T2('"Two families, two stories, one beginning. May this union be as bright as marigolds and as deep as the Godavari."','"दो परिवार, दो कहानियाँ, एक शुरुआत। गेंदे जैसा उज्ज्वल और गोदावरी जैसा गहरा हो।"','"दोन कुटुंबे, दोन कथा, एक सुरुवात. झेंडूसारखे तेजस्वी आणि गोदावरीसारखे खोल असो."')}</p></div>
<div class="sdivider"><span>✦ ${T2("Share","साझा करें","शेअर करा")} ✦</span></div>
<div class="share-card">
  <div class="share-title">${T[lang].shareTitle}</div>
  <div class="share-sub">${T[lang].shareSub}</div>
  <div class="qr-frame"><img src="./assets/yugal-qr.png" alt="QR" loading="lazy"><div class="qr-scan">📷 ${T[lang].shareScan}</div></div>
  <div class="share-btns">
    <button class="share-wa" onclick="shareWhatsApp()"><svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M17.5 14.4c-.3-.1-1.7-.8-1.9-.9-.3-.1-.5-.1-.7.1-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-1.6-.8-2.7-1.4-3.7-3.2-.3-.5.3-.5.8-1.5.1-.2 0-.3 0-.5 0-.1-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.2.2 2.1 3.3 5.2 4.6 2.6 1.1 2.9.9 3.5.8.6-.1 1.7-.7 2-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.6-.3zM12 2a10 10 0 0 0-8.5 15.3L2 22l4.8-1.5A10 10 0 1 0 12 2zm0 18c-1.5 0-3-.4-4.3-1.2l-.3-.2-2.9.9.9-2.8-.2-.3A8 8 0 1 1 12 20z"/></svg>${T[lang].shareWa}</button>
    <button class="share-copy" id="copyBtn" onclick="copyAppLink()"><svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg><span>${T[lang].shareCopy}</span></button>
  </div>
</div>`;
}

/* ---------- share helpers ---------- */
function appShareURL(){
  // canonical home; falls back to wherever this is currently hosted
  var u = (location.origin && location.origin.indexOf('http')===0) ? (location.origin + location.pathname) : 'https://yugal-beryl.vercel.app/';
  return u.replace(/index\.html$/,'');
}
function shareWhatsApp(){
  try{ if(window.playChime) playChime(); }catch(e){}
  var msg = T[lang].shareMsg + ' ' + appShareURL();
  if(navigator.share){
    navigator.share({title:'YUGAL · Roma & Prashant', text:T[lang].shareMsg, url:appShareURL()}).catch(function(){
      window.open('https://wa.me/?text='+encodeURIComponent(msg),'_blank');
    });
  } else {
    window.open('https://wa.me/?text='+encodeURIComponent(msg),'_blank');
  }
}
function copyAppLink(){
  var url = appShareURL();
  var btn = document.getElementById('copyBtn');
  function done(){
    if(!btn) return;
    var span = btn.querySelector('span');
    var old = span ? span.textContent : '';
    if(span) span.textContent = T[lang].shareCopied;
    btn.classList.add('copied');
    try{ if(window.playChime) playChime(); }catch(e){}
    setTimeout(function(){ if(span) span.textContent = old; btn.classList.remove('copied'); }, 1800);
  }
  if(navigator.clipboard && navigator.clipboard.writeText){
    navigator.clipboard.writeText(url).then(done).catch(function(){ legacyCopy(url); done(); });
  } else { legacyCopy(url); done(); }
}
function legacyCopy(text){
  try{ var t=document.createElement('textarea'); t.value=text; t.style.position='fixed'; t.style.opacity='0'; document.body.appendChild(t); t.select(); document.execCommand('copy'); document.body.removeChild(t); }catch(e){}
}

/* ---------- lightbox gallery ---------- */
let lbIdx=0;
function openLB(idx){lbIdx=idx;updateLB();document.getElementById('lightbox').classList.remove('hide');}
function closeLB(){document.getElementById('lightbox').classList.add('hide');}
function navLB(dir){lbIdx=(lbIdx+dir+PHOTOS.length)%PHOTOS.length;updateLB();}
function updateLB(){const p=PHOTOS[lbIdx];document.getElementById('lbImg').src=p.b64;document.getElementById('lbCap').textContent=p.captions[lang]||p.captions.en;}

/* FIX: lightbox keyboard + touch-swipe navigation.
   Arrow keys / Escape on desktop; horizontal swipe on touch devices.
   Buttons keep working via onclick in index.html. */
(function(){
  let touchX = null, touchY = null;
  document.addEventListener('keydown', function(e){
    const lb = document.getElementById('lightbox');
    if(!lb || lb.classList.contains('hide')) return;
    if(e.key === 'ArrowLeft')  navLB(-1);
    else if(e.key === 'ArrowRight') navLB(1);
    else if(e.key === 'Escape') closeLB();
  });
  function bindSwipe(){
    const lb = document.getElementById('lightbox');
    if(!lb) return;
    lb.addEventListener('touchstart', function(e){
      const t = e.changedTouches[0]; touchX = t.clientX; touchY = t.clientY;
    }, { passive:true });
    lb.addEventListener('touchend', function(e){
      if(touchX === null) return;
      const t = e.changedTouches[0];
      const dx = t.clientX - touchX, dy = t.clientY - touchY;
      // horizontal swipe wins only if clearly horizontal and long enough
      if(Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)){
        navLB(dx < 0 ? 1 : -1);
      }
      touchX = touchY = null;
    }, { passive:true });
  }
  if(document.readyState === 'loading')
    document.addEventListener('DOMContentLoaded', bindSwipe);
  else bindSwipe();
})();

/* ---------- language switching (persisted to localStorage) ---------- */
function applyLang(){ document.body.className='lang-'+lang;
  document.querySelectorAll('[data-t]').forEach(el=>{ const k=el.getAttribute('data-t'); if(T[lang][k])el.textContent=T[lang][k]; });
  document.querySelectorAll('.lang-switch button').forEach(b=>b.classList.toggle('on',b.dataset.l===lang));
  document.getElementById('newTodo').placeholder=T[lang].addTodo; document.getElementById('bCat').placeholder=T[lang].bCat; document.getElementById('bAmt').placeholder=T[lang].bAmt;
  const nw=document.getElementById('newWish'); if(nw) nw.placeholder=T[lang].addWish;
  document.getElementById('whoBtn').textContent=me?(T[lang].iam.replace('…','').trim()+' '+(T[lang].people[me]||me).split(' · ')[0]):T[lang].iam;
  buildWhoGrid(); renderAll(); if(document.getElementById('countdown')) renderCountdown(); }
function setLang(l){ lang=l; LS.setItem('wp_lang',l); applyLang(); }

/* ---------- who-am-I picker ---------- */
function buildWhoGrid(){ const g=document.getElementById('whoGrid');
  g.innerHTML=Object.keys(PEOPLE).map(k=>{ const p=PEOPLE[k]; const label=T[lang].people[k]||k;
    return `<button onclick="setMe('${k}')"><span class="swatch" style="background:${p.color}"></span>${label}</button>`;}).join(''); }
function openWho(){ document.getElementById('whoModal').classList.remove('hide'); }
function setMe(n){ me=n; LS.setItem('wp_me',n);
  document.getElementById('whoBtn').textContent=T[lang].iam.replace('…','').trim()+' '+(T[lang].people[n]||n).split(' · ')[0];
  document.getElementById('whoModal').classList.add('hide'); renderDecisions(); renderTodos(); }


/* ---------- checklist / votes / vendors / todos / budget actions ---------- */
function toggleCheck(k){ const wasMonth=parseInt(k.split('-')[0]); const before=monthProgress(wasMonth).pct;
  STATE.checks[k]=!STATE.checks[k]; commit(); renderPlanner();
  const after=monthProgress(wasMonth).pct;
  if(before<100 && after===100) celebrate(wasMonth); }
function castVote(id,i){ if(!me){openWho();return;} STATE.votes[id]=STATE.votes[id]||{}; STATE.votes[id][me]=i; commit(); renderDecisions(); }
function cycleVendor(i){
  const o={wait:'replied',replied:'booked',booked:'wait'};
  const cur=STATE.vendors[i];
  const curStatus=typeof cur==='object'?cur.status||'wait':cur||'wait';
  const curNotes=typeof cur==='object'?cur.notes||'':'';
  STATE.vendors[i]={status:o[curStatus],notes:curNotes};
  commit(); renderVendors();
}
function toggleVnote(i){
  const w=document.getElementById('vnw'+i);
  w.classList.toggle('open');
  if(w.classList.contains('open')) document.getElementById('vta'+i).focus();
}
function saveVendorNote(i){
  const val=document.getElementById('vta'+i).value.slice(0,280);
  const cur=STATE.vendors[i];
  const curStatus=typeof cur==='object'?cur.status||'wait':cur||'wait';
  STATE.vendors[i]={status:curStatus,notes:val};
  commit();
  const prev=document.getElementById('vprev'+i);
  if(val) prev.innerHTML=`<div class="vnote-preview">${val.slice(0,40)+(val.length>40?'…':'')}</div>`;
  else prev.innerHTML=`<div class="vnote-preview">tap 📝 to add notes</div>`;
}
function addTodo(){ const el=document.getElementById('newTodo'),t=el.value.trim(); if(!t)return; STATE.todos.push({text:t,done:false,by:me||''}); el.value=''; commit(); renderTodos(); }
function toggleTodo(i){ STATE.todos[i].done=!STATE.todos[i].done; commit(); renderTodos(); }
function addBudget(){ const c=document.getElementById('bCat'),a=document.getElementById('bAmt'); if(!c.value.trim())return; STATE.budget.push({cat:c.value.trim(),amt:a.value.replace(/[^0-9]/g,'')||0}); c.value='';a.value=''; commit(); renderBudget(); }
function delBudget(i){ STATE.budget.splice(i,1); commit(); renderBudget(); }

/* ---------- panel switching ---------- */
function show(id,btn){ document.querySelectorAll('.panel').forEach(p=>p.classList.remove('active')); document.getElementById(id).classList.add('active');
  document.querySelectorAll('nav button').forEach(b=>b.classList.remove('active')); btn.classList.add('active'); window.scrollTo({top:0,behavior:'smooth'}); }

/* ---------- countdown ---------- */
function renderCountdown(){
  const now=new Date(); const diff=WEDDING_DATE-now;
  const el=document.getElementById('countdown'); if(!el)return;
  const days=Math.ceil(diff/(1000*60*60*24));
  const word={en:days===1?'day to go':'days to go',hi:'दिन बाकी',mr:'दिवस बाकी'}[lang];
  if(days>0) el.innerHTML=`<span class="cd-num">${days}</span> ${word}`;
  else if(days===0) el.innerHTML={en:'✨ Today is the day ✨',hi:'✨ आज का दिन ✨',mr:'✨ आजचा दिवस ✨'}[lang];
  else el.innerHTML={en:'✨ Just married ✨',hi:'✨ विवाह संपन्न ✨',mr:'✨ विवाह संपन्न ✨'}[lang];
}
/* ---- celebration burst ---- */

/* ---------- bootstrap ---------- */
function boot(){
  buildToran(); buildPetals(); buildFrames();
  buildHeaderReel();
  buildWhoGrid(); applyLang(); renderCountdown();
  if(!me) openWho();
  initCloud();                                  // safe even with no network
  setInterval(renderCountdown, 60*60*1000);     // refresh "days to go" hourly
  const nt = document.getElementById('newTodo');
  if(nt) nt.addEventListener('keydown', e => { if(e.key === 'Enter') addTodo(); });
}
if(document.readyState === 'loading')
  document.addEventListener('DOMContentLoaded', boot);
else boot();

/* Register the service worker for installable PWA / offline shell. */
if('serviceWorker' in navigator){
  window.addEventListener('load', function(){
    navigator.serviceWorker.register('./sw.js').catch(function(e){
      console.warn('SW registration failed', e);
    });
  });
}

