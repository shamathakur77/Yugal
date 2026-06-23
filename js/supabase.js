/* =============================================================
   supabase.js — all Supabase access isolated in one module.
   Exposes globals: SUPABASE_URL, SUPABASE_ANON_KEY, WEDDING_CODE,
   `online` flag, commit(), initCloud().

   GRACEFUL DEGRADATION
   --------------------
   Every write goes to localStorage first (saveLocal in app.js), so the
   app is fully usable with no network and even if the Supabase CDN
   script failed to load. The cloud layer only *adds* live sync on top.
   If the client can't be created or any call throws, we silently fall
   back to local-only mode and flip the sync indicator to "offline".
   ============================================================= */

const SUPABASE_URL      = "https://mrbzglbnjwoyxtsmmsud.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_SQdkFvRB6M2FTZ96mZOShQ_Lzd9G7y7";
const WEDDING_CODE      = "roma-prashant-nov";

let sb = null;        // Supabase client (null until/unless connected)
let online = false;   // true only after a successful initial sync

/* Small helper to update the header sync pill without crashing if absent. */
function setSyncStatus(state, text){
  const dot = document.getElementById('syncDot');
  const txt = document.getElementById('syncTxt');
  if(dot) dot.className = 'dot ' + state;   // 'on' | 'off'
  if(txt) txt.textContent = text;
}

/* Push current STATE to the cloud. Always saves locally first. */
async function commit(){
  saveLocal();                 // localStorage is the source of truth offline
  if(!online || !sb) return;   // no-op when not synced — never throws
  try{
    await sb.from('wedding').upsert({
      code: WEDDING_CODE, data: STATE, updated: new Date().toISOString()
    });
  }catch(e){
    // A failed push must not break the UI; we stay usable locally.
    online = false;
    setSyncStatus('off', SYNC_TXT[lang] ? SYNC_TXT[lang].offline : 'offline · saved on phone');
    console.warn('cloud push failed — staying local', e);
  }
}

/* Try to connect + do the first sync. Safe to call even when offline. */
async function initCloud(){
  setSyncStatus('off', SYNC_TXT[lang] ? SYNC_TXT[lang].connecting : 'connecting…');

  // The CDN <script> may not have loaded (offline / blocked). Bail cleanly.
  if(typeof supabase === 'undefined' || !supabase.createClient){
    online = false;
    setSyncStatus('off', SYNC_TXT[lang] ? SYNC_TXT[lang].offline : 'offline · saved on phone');
    console.warn('Supabase CDN not available — running local-only');
    return;
  }

  try{
    sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    const { data, error } = await sb
      .from('wedding').select('data').eq('code', WEDDING_CODE).maybeSingle();
    if(error) throw error;

    if(data && data.data){
      // Merge cloud snapshot, re-normalising shape, then re-render.
      STATE = data.data; normaliseState(); saveLocal(); renderAll();
    } else {
      // First run for this wedding code — seed the row from local state.
      await sb.from('wedding').upsert({
        code: WEDDING_CODE, data: STATE, updated: new Date().toISOString()
      });
    }

    online = true;
    setSyncStatus('on', SYNC_TXT[lang] ? SYNC_TXT[lang].live : 'live · synced');

    // Live updates from other family members.
    sb.channel('wp')
      .on('postgres_changes',
          { event:'*', schema:'public', table:'wedding',
            filter:`code=eq.${WEDDING_CODE}` },
          p => { if(p.new && p.new.data){ STATE = p.new.data; normaliseState(); saveLocal(); renderAll(); } })
      .subscribe();
  }catch(e){
    online = false;
    setSyncStatus('off', SYNC_TXT[lang] ? SYNC_TXT[lang].offline : 'offline · saved on phone');
    console.warn('cloud init failed — running local-only', e);
  }
}
