/* ============================================================
   PokéAPI Explorer — Shared JavaScript Utilities
   ============================================================ */

const API = 'https://pokeapi.co/api/v2';
const SPRITES = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon';
const ARTWORK  = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork';

/* === CACHE === */
const _cache = new Map();
async function apiFetch(path) {
  const url = path.startsWith('http') ? path : `${API}${path}`;
  if (_cache.has(url)) return _cache.get(url);
  const r = await fetch(url);
  if (!r.ok) throw new Error(`API error ${r.status}: ${url}`);
  const d = await r.json();
  _cache.set(url, d);
  return d;
}

/* === CONSTANTS === */
const TYPES = [
  'normal','fire','water','electric','grass','ice',
  'fighting','poison','ground','flying','psychic','bug',
  'rock','ghost','dragon','dark','steel','fairy'
];

const TYPE_COLORS = {
  normal:'#9FA19F', fire:'#E62829',    water:'#2980EF', electric:'#FAC000',
  grass:'#3FA129',  ice:'#3DCEF3',     fighting:'#FF8000', poison:'#9141CB',
  ground:'#915121', flying:'#81B9F1',  psychic:'#EF4179',  bug:'#91A119',
  rock:'#AFA981',   ghost:'#704170',   dragon:'#5060E1',   dark:'#624D4E',
  steel:'#60A1B8',  fairy:'#EF70EF'
};

const STAT_COLORS = {
  'hp':'#FF5959', 'attack':'#F5AC78', 'defense':'#FAE078',
  'special-attack':'#9DB7F5', 'special-defense':'#A7DB8D', 'speed':'#FA92B2'
};

const STAT_LABELS = {
  'hp':'HP','attack':'Atk','defense':'Def',
  'special-attack':'Sp.Atk','special-defense':'Sp.Def','speed':'Spd'
};

/* === TYPE EFFECTIVENESS MATRIX (Gen 6+) === */
const ATK_CHART = {
  normal:   {normal:1,fire:1,water:1,electric:1,grass:1,ice:1,fighting:1,poison:1,ground:1,flying:1,psychic:1,bug:1,rock:.5,ghost:0,dragon:1,dark:1,steel:.5,fairy:1},
  fire:     {normal:1,fire:.5,water:.5,electric:1,grass:2,ice:2,fighting:1,poison:1,ground:1,flying:1,psychic:1,bug:2,rock:.5,ghost:1,dragon:.5,dark:1,steel:2,fairy:1},
  water:    {normal:1,fire:2,water:.5,electric:1,grass:.5,ice:1,fighting:1,poison:1,ground:2,flying:1,psychic:1,bug:1,rock:2,ghost:1,dragon:.5,dark:1,steel:1,fairy:1},
  electric: {normal:1,fire:1,water:2,electric:.5,grass:.5,ice:1,fighting:1,poison:1,ground:0,flying:2,psychic:1,bug:1,rock:1,ghost:1,dragon:.5,dark:1,steel:1,fairy:1},
  grass:    {normal:1,fire:.5,water:2,electric:1,grass:.5,ice:1,fighting:1,poison:.5,ground:2,flying:.5,psychic:1,bug:.5,rock:2,ghost:1,dragon:.5,dark:1,steel:.5,fairy:1},
  ice:      {normal:1,fire:.5,water:.5,electric:1,grass:2,ice:.5,fighting:1,poison:1,ground:2,flying:2,psychic:1,bug:1,rock:1,ghost:1,dragon:2,dark:1,steel:.5,fairy:1},
  fighting: {normal:2,fire:1,water:1,electric:1,grass:1,ice:2,fighting:1,poison:.5,ground:1,flying:.5,psychic:.5,bug:.5,rock:2,ghost:0,dragon:1,dark:2,steel:2,fairy:.5},
  poison:   {normal:1,fire:1,water:1,electric:1,grass:2,ice:1,fighting:1,poison:.5,ground:.5,flying:1,psychic:1,bug:1,rock:.5,ghost:.5,dragon:1,dark:1,steel:0,fairy:2},
  ground:   {normal:1,fire:2,water:1,electric:2,grass:.5,ice:1,fighting:1,poison:2,ground:1,flying:0,psychic:1,bug:.5,rock:2,ghost:1,dragon:1,dark:1,steel:2,fairy:1},
  flying:   {normal:1,fire:1,water:1,electric:.5,grass:2,ice:1,fighting:2,poison:1,ground:1,flying:1,psychic:1,bug:2,rock:.5,ghost:1,dragon:1,dark:1,steel:.5,fairy:1},
  psychic:  {normal:1,fire:1,water:1,electric:1,grass:1,ice:1,fighting:2,poison:2,ground:1,flying:1,psychic:.5,bug:1,rock:1,ghost:1,dragon:1,dark:0,steel:.5,fairy:1},
  bug:      {normal:1,fire:.5,water:1,electric:1,grass:2,ice:1,fighting:.5,poison:.5,ground:1,flying:.5,psychic:2,bug:1,rock:1,ghost:.5,dragon:1,dark:2,steel:.5,fairy:.5},
  rock:     {normal:1,fire:2,water:1,electric:1,grass:1,ice:2,fighting:.5,poison:1,ground:.5,flying:2,psychic:1,bug:2,rock:1,ghost:1,dragon:1,dark:1,steel:.5,fairy:1},
  ghost:    {normal:0,fire:1,water:1,electric:1,grass:1,ice:1,fighting:1,poison:1,ground:1,flying:1,psychic:2,bug:1,rock:1,ghost:2,dragon:1,dark:.5,steel:1,fairy:1},
  dragon:   {normal:1,fire:1,water:1,electric:1,grass:1,ice:1,fighting:1,poison:1,ground:1,flying:1,psychic:1,bug:1,rock:1,ghost:1,dragon:2,dark:1,steel:.5,fairy:0},
  dark:     {normal:1,fire:1,water:1,electric:1,grass:1,ice:1,fighting:.5,poison:1,ground:1,flying:1,psychic:2,bug:1,rock:1,ghost:2,dragon:1,dark:.5,steel:1,fairy:.5},
  steel:    {normal:1,fire:.5,water:.5,electric:.5,grass:1,ice:2,fighting:1,poison:1,ground:1,flying:1,psychic:1,bug:1,rock:2,ghost:1,dragon:1,dark:1,steel:.5,fairy:2},
  fairy:    {normal:1,fire:.5,water:1,electric:1,grass:1,ice:1,fighting:2,poison:.5,ground:1,flying:1,psychic:1,bug:1,rock:1,ghost:1,dragon:2,dark:2,steel:.5,fairy:1},
};

/* === SIDEBAR INJECTION === */
const NAV_PAGES = [
  {id:'index',    href:'index.html',     icon:'🏠', label:'Overview'},
  {id:'pokemon',  href:'pokemon.html',   icon:'⚡', label:'Pokémon Explorer'},
  {id:'types',    href:'types.html',     icon:'🔥', label:'Type Chart'},
  {id:'moves',    href:'moves.html',     icon:'💥', label:'Move Library'},
  {id:'items',    href:'items.html',     icon:'🎒', label:'Items'},
  {id:'locations',href:'locations.html', icon:'🗺️', label:'Locations & Encounters'},
  {id:'evolution',href:'evolution.html', icon:'🔄', label:'Evolution Chains'},
  {id:'reference',href:'reference.html', icon:'📖', label:'API Reference'},
];

function buildSidebar(active) {
  const el = document.getElementById('sidebar');
  if (!el) return;
  el.innerHTML = `
    <a href="index.html" class="sidebar-logo">
      <div class="pokeball"></div>
      <div><div class="sidebar-title">PokéAPI</div><div class="sidebar-subtitle">Explorer</div></div>
    </a>
    <nav class="sidebar-nav">
      <div class="nav-section">Pages</div>
      ${NAV_PAGES.map(p=>`
        <a href="${p.href}" class="nav-link${p.id===active?' active':''}">
          <span class="nav-icon">${p.icon}</span>
          <span>${p.label}</span>
        </a>`).join('')}
    </nav>
    <div class="sidebar-footer">
      <a href="https://pokeapi.co/docs/v2" target="_blank" class="api-badge">📄 PokéAPI v2 Docs</a>
    </div>`;
}

/* === HELPERS === */
const cap = s => s ? s.replace(/-/g,' ').replace(/\b\w/g,c=>c.toUpperCase()) : '';
const padId = n => String(n).padStart(3,'0');
const urlId = url => parseInt(url.split('/').filter(Boolean).pop());
const spriteUrl = id => `${SPRITES}/${id}.png`;
const artworkUrl = id => `${ARTWORK}/${id}.png`;

function typeBadge(t) { return `<span class="type-badge ${t}">${t}</span>`; }
function typeBadges(types) {
  const names = types.map(t => t?.type?.name || t);
  return `<div class="type-badges">${names.map(typeBadge).join('')}</div>`;
}

function statBar(name, val) {
  const color = STAT_COLORS[name] || '#aaa';
  const label = STAT_LABELS[name] || cap(name);
  const pct = Math.min(100, (val/255)*100);
  return `<div class="stat-row">
    <div class="stat-name">${label}</div>
    <div class="stat-value">${val}</div>
    <div class="stat-bar-track"><div class="stat-bar-fill" style="width:${pct}%;background:${color}"></div></div>
  </div>`;
}

function renderStats(stats) {
  return `<div class="stats-list">${stats.map(s=>statBar(s.stat.name,s.base_stat)).join('')}</div>`;
}

function catBadge(cat) { return `<span class="cat-badge ${cat}">${cat}</span>`; }

function flavorText(species, lang='en') {
  const entries = (species.flavor_text_entries||[]).filter(e=>e.language.name===lang);
  const e = entries.find(e=>e.version.name.includes('sword'))
         || entries.find(e=>e.version.name.includes('sun'))
         || entries.find(e=>e.version.name.includes('x'))
         || entries[entries.length-1];
  return e ? e.flavor_text.replace(/\f|\n/g,' ') : '—';
}

function evoCondition(d) {
  if (!d || !Object.keys(d).length) return '';
  const parts = [];
  if (d.min_level)           parts.push(`Lv ${d.min_level}`);
  if (d.item)                parts.push(`Use ${cap(d.item.name)}`);
  if (d.held_item)           parts.push(`Hold ${cap(d.held_item.name)}`);
  if (d.min_happiness)       parts.push(`Friendship ${d.min_happiness}+`);
  if (d.min_affection)       parts.push(`Affection ${d.min_affection}+`);
  if (d.known_move)          parts.push(`Know ${cap(d.known_move.name)}`);
  if (d.location)            parts.push(`At ${cap(d.location.name)}`);
  if (d.time_of_day)         parts.push(cap(d.time_of_day));
  if (d.needs_overworld_rain) parts.push('In Rain');
  if (d.party_species)       parts.push(`With ${cap(d.party_species.name)}`);
  if (d.trade_species)       parts.push(`Trade for ${cap(d.trade_species.name)}`);
  if (d.trigger?.name==='trade' && !parts.length) parts.push('Trade');
  if (d.trigger?.name==='level-up' && !parts.length) parts.push('Level Up');
  if (d.trigger?.name==='use-item' && d.item) parts.push(`Use ${cap(d.item.name)}`);
  if (d.trigger?.name==='shed' ) parts.push('Shed (Empty slot + Poké Ball)');
  return parts.join(', ') || (d.trigger?.name ? cap(d.trigger.name) : '');
}

/* Render full evolution chain (recursive) */
function renderEvoNode(node, depth=0) {
  const id = urlId(node.species.url);
  const name = cap(node.species.name);
  const cond = node.evolution_details?.[0] ? evoCondition(node.evolution_details[0]) : '';

  if (!node.evolves_to.length) {
    return `<div class="evo-poke" onclick="goToPokemon('${node.species.name}')">
      <img src="${spriteUrl(id)}" alt="${name}" onerror="this.src='${artworkUrl(id)}'">
      <div class="evo-poke-name">${name}</div>
    </div>`;
  }

  const branches = node.evolves_to.map(child => {
    const childId = urlId(child.species.url);
    const childName = cap(child.species.name);
    const childCond = child.evolution_details?.[0] ? evoCondition(child.evolution_details[0]) : '';
    const grandchildren = child.evolves_to.length ? renderEvoNode(child, depth+1) : null;
    const childPoke = `<div class="evo-poke" onclick="goToPokemon('${child.species.name}')">
      <img src="${spriteUrl(childId)}" alt="${childName}" onerror="this.src='${artworkUrl(childId)}'">
      <div class="evo-poke-name">${childName}</div>
    </div>`;
    if (grandchildren) {
      return `<div class="evo-stage">
        <div class="evo-arrow-wrap"><div class="evo-arrow">→</div><div class="evo-cond">${childCond}</div></div>
        ${childPoke}
        ${grandchildren}
      </div>`;
    }
    return `<div class="evo-stage">
      <div class="evo-arrow-wrap"><div class="evo-arrow">→</div><div class="evo-cond">${childCond}</div></div>
      ${childPoke}
    </div>`;
  });

  return `<div class="evo-stage">
    <div class="evo-poke" onclick="goToPokemon('${node.species.name}')">
      <img src="${spriteUrl(id)}" alt="${name}" onerror="this.src='${artworkUrl(id)}'">
      <div class="evo-poke-name">${name}</div>
    </div>
    <div class="evo-group">${branches.join('')}</div>
  </div>`;
}

/* === LOADING / ERROR TEMPLATES === */
function loadingHTML(msg='Loading…') {
  return `<div class="loading-center"><div class="spinner"></div><span>${msg}</span></div>`;
}
function errorHTML(msg) {
  return `<div class="loading-center"><span style="font-size:2rem">⚠️</span><span style="color:var(--red);font-weight:600">${msg}</span></div>`;
}
function emptyHTML(msg) {
  return `<div class="loading-center"><span style="font-size:2rem">🔍</span><span>${msg}</span></div>`;
}

/* === TABS === */
function initTabs(root) {
  root = root || document;
  root.querySelectorAll('.tabs').forEach(tabs => {
    const btns = tabs.querySelectorAll('.tab-btn');
    const parent = tabs.parentElement;
    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        btns.forEach(b=>b.classList.remove('active'));
        parent.querySelectorAll('.tab-panel').forEach(p=>p.classList.remove('active'));
        btn.classList.add('active');
        const target = parent.querySelector(`.tab-panel[data-panel="${btn.dataset.tab}"]`);
        if (target) target.classList.add('active');
      });
    });
  });
}

/* === ACCORDION === */
function initAccordions(root) {
  root = root || document;
  root.querySelectorAll('.acc-header').forEach(h => {
    h.addEventListener('click', () => {
      const body = h.nextElementSibling;
      h.classList.toggle('open');
      body.classList.toggle('open');
    });
  });
}

/* === COPY BUTTON === */
function initCopyBtns(root) {
  root = root || document;
  root.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const block = btn.closest('.code-block');
      const text = block?.querySelector('pre')?.textContent || '';
      navigator.clipboard.writeText(text).then(() => {
        const orig = btn.textContent;
        btn.textContent = '✓ Copied';
        btn.style.color = '#a6e3a1';
        setTimeout(() => { btn.textContent = orig; btn.style.color = ''; }, 2000);
      });
    });
  });
}

/* === ANIMATED COUNTER === */
function animCount(el, target, duration=1100) {
  const start = Date.now();
  const tick = () => {
    const pct = Math.min(1, (Date.now()-start)/duration);
    const ease = 1 - Math.pow(1-pct, 3);
    el.textContent = Math.round(ease * target).toLocaleString();
    if (pct < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

/* === DEBOUNCE === */
function debounce(fn, ms=300) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(()=>fn(...args), ms); };
}

/* === FORMAT HELPERS === */
function fmtHeight(dm)  { return `${(dm/10).toFixed(1)} m`; }
function fmtWeight(hg)  { return `${(hg/10).toFixed(1)} kg`; }
function fmtCost(p)     { return p === 0 ? 'Not for sale' : `₽${p.toLocaleString()}`; }
function moveDispVal(v) { return v == null ? '—' : v; }
