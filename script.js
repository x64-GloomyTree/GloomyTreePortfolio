(() => {
'use strict';
const ART = {
  lighthouse: String.raw`
      §y*§.
     /_\
    |§y[#]§.|
    |___|
     | |
    /§r===§.\
    |§r###§.|
    |   |
   /§r=====§.\
   |§r#####§.|
   |     |
  /=======\
 _|_______|_
/§c###########§.\
§c~~~~~~~~~~~~~§.
`,
  fisher: String.raw`
o
 \
  \
   \             ,---.
    \           ( o_o )
     \          /|   |\
      \_______ / |___| \
                  | |
                 _| |_
§b====================+=====§.
§b  ||                ||       ||§.
§b  ||                ||       ||§.
`,
  ship: String.raw`
                 §w|\§.
                 §w| \§.         §w|>§.
         §w|>§.      §w|  \§.        §w|_>§.
         §w|_>§.     §w|   \§.       §w|  >§.
         §w|  >§.    §w|____\§.      §w|§.
   §b____§.  §w|  \§.    §w|§.         §b__§.§w|§.§b___§.
  §b/§.    §b\_§.§w|___\___|§.§b________/§.      §b\_§.
 §b/§.   §co§.     §co§.     §co§.     §co§.     §co§.     §b\_§.
§b/§.                                    §b\§.
§b\_____________________________________/§.
     §g)§.   §g(§.      §g)§.      §g(§.    §g)§.
`,
  seaweed_a: String.raw` )
(
 )
(
 )
(
`,
  seaweed_b: String.raw`( 
 )
( 
 )
( 
 )
`,
  crab_a: String.raw`
 (\/)o.o(\/)
`,
  chest_closed: String.raw`


   .----------------.
  /  §y==============§.  \
 /____________________\
|§y======§.|  §y[<>]§.  |§y======§.|
|      |        |      |
|§y======§.|________|§y======§.|
`,
  chest_half: String.raw`

   .----------------.
  /  §y==============§.  \
 /____________________\
  §y'  .  '  *  '  .  '§.
|§y======§.|        |§y======§.|
|      |        |      |
|§y======§.|________|§y======§.|
`,
  chest_open_a: String.raw`
   .----------------.
  /  §y==============§.  \
 /____________________\
   §y*§.   .   §y*§.   .   §y*§.   .
|§yo$O$o$O$o$O$o$O$o$O$o$§.|
|§y======§.|§y$O$o$O$o§.|§y======§.|
|      |        |      |
|§y======§.|________|§y======§.|
`,
  chest_open_b: String.raw`
   .----------------.
  /  §y==============§.  \
 /____________________\
    .   §y*§.   .   §y*§.   .   §y*§.
|§yO$o$O$o$O$o$O$o$O$o$o$§.|
|§y======§.|§y$o$O$o$O§.|§y======§.|
|      |        |      |
|§y======§.|________|§y======§.|
`,
  vent_a: String.raw`
        §d_[]_§.
  §rv§.    §d|    |§.  §rw§.
  §w|§. §rw§. §d/|    |\§. §w|§. §rv§.
  §w|§. §w|§.§d/ |    | \§.§w|§. §w|§.
§d__§w|§.§d_§w|§.§d/__|____|__\§w|§.§d_§w|§.§d__§.
`,
  vent_b: String.raw`
        §d_[]_§.
  §rw§.    §d|    |§.  §rv§.
  §w|§. §rv§. §d/|    |\§. §w|§. §rw§.
  §w|§. §w|§.§d/ |    | \§.§w|§. §w|§.
§d__§w|§.§d_§w|§.§d/__|____|__\§w|§.§d_§w|§.§d__§.
`,
  dumbo_a: String.raw`
   §p_.-"-._§.
 §p~(§. §wo§.  §wo§. §p)~§.
   §p)/||\(§.
  §p(  ||  )§.
`,
  dumbo_b: String.raw`
   §p_.-"-._§.
 §p-(§. §wo§.  §wo§. §p)-§.
   §p(\||/)§.
   §p) || (§.
`,
  tripod: String.raw`
 §d   __§.
 §d><(__§.§wo§.§d>§.
 §d  /|\§.
 §d / | \§.
`,
  brittle: String.raw`
§p\ | /§.
§p -*-§.
§p/ | \§.
`,
  cucumber: String.raw`
§r(o:::::::::)~§.
`
};

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const root = document.documentElement;
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const isMobile = matchMedia('(max-width: 760px)').matches;
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const smooth = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
const lerp = (a, b, t) => a + (b - a) * t;
const mixC = (a, b, t) => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
const rgb = (c, a = 1) => `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a})`;

const markup = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/§([a-z])/g, '<span class="c-$1">').replace(/§\./g, '</span>');
const rows = s => s.replace(/^\n/, '').replace(/\n$/, '').split('\n');
const plain = s => s.replace(/§./g, '');
const padTop = (arr, n) => Array(Math.max(0, n - arr.length)).fill('').concat(arr);

/* ---------- Inject ASCII art ---------- */
$('#lighthouse').innerHTML = markup(ART.lighthouse.replace(/^\n/, '').replace(/\n$/, ''));
$('#fisherArt').innerHTML = markup(ART.fisher.replace(/^\n/, '').replace(/\n$/, ''));
$('#ship').innerHTML = markup(ART.ship.replace(/^\n/, '').replace(/\n$/, ''));
$('#chestArt').innerHTML = markup(padTop(rows(ART.chest_closed), 8).join('\n'));
const critterArt = (id, k) => { $('#' + id + ' pre').innerHTML = markup(rows(ART[k]).join('\n')); };
['tripod', 'brittle', 'cucumber'].forEach(id => critterArt(id, id));
$('#seabed .seabed-title').textContent = [
  '+----------------------+',
  '|   SUNKEN  TREASURE   |',
  '+----------------------+'].join('\n');
const lamp = $('#lamp');
(function placeLamp() { // lamp = row 2, col 6 of the lighthouse sprite
  lamp.style.left = 'calc(5vw + 6ch)';
  lamp.style.bottom = 'calc(42% - 32px + 12 * 16px + 8px)';
})();

/* ---------- Layout metrics ---------- */
const intro = $('#intro'), dive = $('#dive'), terminal = $('#terminal'), timeline = $('#timeline');
const cv = $('#fx'), ctx = cv.getContext('2d');
const FONT = '18px VT323, "Courier New", monospace';
const RH = 16;
let W = 0, H = 0, DPR = 1, cw = 8, introH = 0, wl = 0, pageH = 0, COLS = 0;

function measure() { ctx.font = FONT; cw = ctx.measureText('M').width || 8; COLS = Math.ceil(W / cw) + 2; }
function resize() {
  DPR = Math.min(window.devicePixelRatio || 1, 2);
  W = innerWidth; H = innerHeight;
  cv.width = Math.round(W * DPR); cv.height = Math.round(H * DPR);
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  measure();
}

/* ---------- Line to the Discord hook ---------- */
function placeLine() {
  const tip = $('#tip').getBoundingClientRect(), ir = intro.getBoundingClientRect();
  const line = $('#line');
  const top = tip.top - ir.top + tip.height / 2;
  const len = introH - top + 330;
  line.style.left = (tip.left - ir.left + 4) + 'px';
  line.style.top = top + 'px';
  line.style.height = len + 'px';
  const n = Math.floor(len / RH);
  $('#linePre').textContent = Array.from({ length: n }, (_, i) => i % 9 === 8 ? ':' : '|').join('\n');
}

/* ---------- Spine / sand ---------- */
function buildSpine() {
  const n = Math.floor(timeline.offsetHeight / RH);
  $('#spine').textContent = Array.from({ length: n }, (_, i) => i % 7 === 0 ? '-+-' : ' | ').join('\n');
}
function seeded(seed) { let s = seed; return () => (s = (s * 16807) % 2147483647) / 2147483647; }
function buildSand() {
  const cols = Math.ceil(innerWidth / cw) + 4, rnd = seeded(42), chars = '.,\'`~:;_ ';
  const lines = [];
  for (let r = 0; r < 5; r++) {
    let s = '';
    for (let c = 0; c < cols; c++) s += r === 0 ? '.-~-.' [c % 5] : chars[Math.floor(rnd() * chars.length)];
    lines.push(s);
  }
  $('#sand').textContent = lines.join('\n');
}

/* ---------- Stage depths ---------- */
const stages = $$('.stage');
const zoneOf = m => m < 200 ? 'Sunlight zone' : m < 1000 ? 'Twilight zone' : m < 4000 ? 'Midnight zone' : 'Abyssal zone';
const depthFromFrac = f => Math.round(6000 * Math.pow(f, 2.8) / 10) * 10;
const fmt = n => n.toLocaleString('en-US');
const diveTop = () => dive.getBoundingClientRect().top + scrollY;
function fracAtCenter(cy) { return clamp((cy - diveTop()) / Math.max(1, dive.offsetHeight - H), 0, 1); }
function computeStageDepths() {
  stages.forEach(st => {
    const r = st.getBoundingClientRect();
    const m = depthFromFrac(fracAtCenter(r.top + scrollY + r.height / 2));
    $('.depth-tag', st).textContent = `${zoneOf(m)} : ${fmt(m)} m`;
  });
}

function layout() {
  introH = intro.offsetHeight; wl = Math.round(introH * 0.58);
  buildSpine(); buildSand(); placeLine(); computeStageDepths();
  dTop = pageTop(dive); dH = dive.offsetHeight;
  pageH = document.documentElement.scrollHeight;
}

/* ---------- Day / night ---------- */
const CYCLE_SECONDS = 120;
const MODES = { cycle: '[*] CYCLE', day: '[O] DAY', night: '[C] NIGHT' };
const d0 = new Date();
let phase = (d0.getHours() * 60 + d0.getMinutes()) / 1440;
let mode = 'cycle', nightVal = 0, dusk = 0, sunH = 1;
$('#modeBtn').addEventListener('click', e => {
  mode = mode === 'cycle' ? 'day' : mode === 'day' ? 'night' : 'cycle';
  e.currentTarget.textContent = MODES[mode];
});
function updateTime(dt) {
  if (mode === 'cycle') phase = (phase + dt / CYCLE_SECONDS) % 1;
  else {
    const target = mode === 'day' ? 0.5 : 0, d = (target - phase + 1) % 1, step = dt * 0.35;
    phase = d < step ? target : (phase + step) % 1;
  }
  sunH = -Math.cos(2 * Math.PI * phase);
  nightVal = 1 - smooth(-0.18, 0.22, sunH);
  dusk = clamp(1 - Math.abs(sunH + 0.02) / 0.38, 0, 1);
  root.style.setProperty('--night', nightVal.toFixed(3));
}

/* ---------- Canvas helpers ---------- */
function text(str, x, y, color, alpha = 1) {
  ctx.globalAlpha = alpha; ctx.fillStyle = color;
  ctx.fillText(str, Math.round(x), Math.round(y));
}
function sprite(lines, cx, cy, color, alpha = 1) {
  const w = Math.max(...lines.map(l => l.length)) * cw;
  lines.forEach((l, i) => text(l, cx - w / 2, cy + i * RH, color, alpha));
}
const hash = (a, b) => { let h = (a * 374761393 + b * 668265263) | 0; h = (h ^ (h >>> 13)) * 1274126177; return ((h ^ (h >>> 16)) >>> 0) / 4294967295; };

const SUN = ['    \\   |   /', '  .  \\  |  /  .', '--- (  ###  ) ---', "  '  /  |  \\  '", '    /   |   \\'];
const MOON = ['   _..._', " .'  _.-'", '/   /', '|   |', " \\   '-._", "  '-.__.'"];
const CLOUD = ['    .--.', ' .-(    ).', '(___.__)__)'];
const stars = Array.from({ length: 90 }, () => ({ x: Math.random(), y: Math.random() * 0.56, ch: '.+*'[Math.floor(Math.random() * 3)], ph: Math.random() * 6.28 }));
const clouds = [{ y: 0.12, sp: 9, off: 100 }, { y: 0.28, sp: 6, off: 600 }, { y: 0.2, sp: 12, off: 1100 }];
const gulls = [{ y: 0.14, sp: 38, off: 0 }, { y: 0.24, sp: 28, off: 400 }, { y: 0.34, sp: 46, off: 900 }, { y: 0.19, sp: 33, off: 1300 }];
const SKY_TOP_D = [44, 78, 120], SKY_HOR_D = [120, 164, 186], SKY_TOP_N = [5, 8, 26], SKY_HOR_N = [26, 22, 62];
const WATER = [[0, [30, 92, 112]], [0.08, [24, 80, 108]], [0.25, [20, 60, 102]], [0.45, [24, 44, 96]], [0.65, [26, 34, 82]], [0.82, [16, 22, 58]], [1, [7, 10, 28]]];

/* ---------- Fish, bubbles, plankton, jellies ---------- */
const mouse = { x: -999, y: -999 };
addEventListener('pointermove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
addEventListener('pointerleave', () => { mouse.x = mouse.y = -999; });
addEventListener('touchend', () => { mouse.x = mouse.y = -999; });

const HUES = [18, 48, 330, 185, 105, 270];
const FISH_ASCII = [['><>', '<><'], ['><))o>', '<o((><'], ['><(((o>', '<o)))><']];
const SCHOOLS = [], FISH_PER = isMobile ? 5 : 10;
HUES.forEach((hue, i) => {
  const sc = { hue, off: i * 1.7, spr: FISH_ASCII[i % 3], members: [] };
  for (let k = 0; k < FISH_PER; k++) sc.members.push({ x: Math.random() * innerWidth, y: Math.random() * innerHeight, vx: Math.random() * 2 - 1, vy: Math.random() * 2 - 1, dir: 1, sc });
  SCHOOLS.push(sc);
});
const bubbles = [];
function newBubble(own, x, y, extra) {
  return Object.assign({ x: x ?? Math.random() * W, y: y ?? H + Math.random() * H, r: 1 + Math.random() * 6, vy: 0.4 + Math.random() * 0.8, vx: 0, ph: Math.random() * 6.28, own: !!own, life: 1, ch: null, color: null }, extra);
}
for (let i = 0; i < (isMobile ? 14 : 28); i++) bubbles.push(newBubble(false, undefined, Math.random() * innerHeight));
function burst(x, y, n, color, chars) {
  for (let i = 0; i < n; i++) {
    const a = Math.random() * Math.PI * 2, sp = Math.random() * 3 + 0.5;
    bubbles.push(newBubble(true, x, y, { vx: Math.cos(a) * sp, vy: Math.sin(a) * sp * 0.6 + 0.8, color, ch: chars ? chars[Math.floor(Math.random() * chars.length)] : null }));
  }
}
const plankton = Array.from({ length: isMobile ? 26 : 60 }, () => ({ x: Math.random() * innerWidth, y: Math.random() * innerHeight, ph: Math.random() * 6.28, sp: 0.1 + Math.random() * 0.3 }));
const JELLY = (f) => ['  .-"""-.', ' (  o o  )', "  '-----'", f ? '   ) ) )' : '   ( ( (', f ? '   ( ( (' : '   ) ) )'];
const jellies = [{ xf: 0.1, yf: 0.2, col: [217, 138, 181] }, { xf: 0.86, yf: 0.42, col: [124, 198, 220] }, { xf: 0.14, yf: 0.66, col: [179, 160, 232] }];

/* ---------- Ocean life: sprites, species, field guide data ---------- */
const PAL = { r: '#d9776c', y: '#ecd08a', g: '#7fd1a0', c: '#7cc6dc', p: '#d98ab5', b: '#b88a5a', w: '#dfe8f2', d: '#6f8aa0', o: '#f0964a', k: '#b3a85a', v: '#9a8fe0', s: '#8aa3c8' };
const MIRROR = { '(': ')', ')': '(', '/': '\\', '\\': '/', '<': '>', '>': '<', '[': ']', ']': '[', '{': '}', '}': '{', '`': "'", "'": '`' };
// Turns §-marked art into colored runs so each frame costs a few fillText calls; flip mirrors it.
function compile(src, base, flip) {
  const grid = rows(src).map(line => {
    const out = []; let col = null;
    for (let i = 0; i < line.length; i++) {
      if (line[i] === '§') { col = line[i + 1] === '.' ? null : PAL[line[i + 1]]; i++; continue; }
      out.push([line[i], col]);
    }
    return out;
  });
  const w = Math.max(...grid.map(r => r.length));
  if (flip) grid.forEach((r, i) => { while (r.length < w) r.push([' ', null]); grid[i] = r.reverse().map(([c, k]) => [MIRROR[c] || c, k]); });
  const runs = [];
  grid.forEach((r, y) => {
    let s = '', key = null, x0 = 0;
    const flush = () => { if (key && key !== ' ') runs.push({ x: x0, y, s, col: key }); };
    r.forEach(([c, k], x) => { const kk = c === ' ' ? ' ' : (k || base); if (kk !== key) { flush(); key = kk; s = ''; x0 = x; } s += c; });
    flush();
  });
  return { w, h: grid.length, runs };
}
const both = (src, base) => ({ r: compile(src, base, false), l: compile(src, base, true) });
function drawArt(a, x, y, alpha) {
  for (const run of a.runs) text(run.s, x + run.x * cw, y + run.y * RH, run.col, alpha);
}

const SEA = {
  turtle: [String.raw`
      §g_______§.
    §g/\ \/ \/ /\§.§k___§.
 §k~~§.§g|__\/\_/\/__|§.§k_o\§.
      §k\_\§.    §k\_\§.
`, String.raw`
      §g_______§.
    §g/\ \/ \/ /\§.§k___§.
 §k~~§.§g|__\/\_/\/__|§.§k_o\§.
     §k/_/§.     §k/_/§.
`],
  manta: [String.raw`
   .__
    \ '-.__
 ~~--==(   oo>
    / .-'''
   '''
`, String.raw`
    ___
   '-. '-.__
 ~~--==(   oo>
   .-' .-'''
    '''
`],
  humpback: [String.raw`
 _                  __..---~~~~~~~--..__
\ '.__..---~~~~~~~~~                    ''-._
 >   ___                           §wo§.        '.
/_.''   ''--..____        ____..----------..__/
                  '\_ \_.'  _.'
                     '-.__.'
`],
  shark: [String.raw`
                 |\
         ___..---' '-..__
 \'.--''~                ''-._
  >    -      §w))))§.    §wo§.    __ >
 /.'--..__         __..--''
          '--/\---'
`, String.raw`
                 |\
         ___..---' '-..__
  \.--''~                ''-._
  )>   -      §w))))§.    §wo§.    __ >
  /'--..__         __..--''
          '--/\---'
`],
  sperm: [String.raw`
  _                   .____________________
 \ '-.___.-------------'                    |
  >  _                                 §wo§.    |
 /_.' '--.___________________   ____________/
                             \_/  §w\/\/\/\/§.
`],
  squid: [String.raw`
     /\
    /  \
   |    |
   |    |
   | §wO§.  |
   |    |
   /\/\/\
  (( || ))
   )) || ((
  ((  ||  ))
   )  ||  (
  (   ||   )
      ''
`, String.raw`
     /\
    /  \
   |    |
   |    |
   | §wO§.  |
   |    |
   /\/\/\
  )) || ((
   (( || ))
  ))  ||  ((
   (  ||  )
  )   ||   (
      ''
`],
  angler: [String.raw`
        _.~
    ___/
  /'    §wo§.  '\
 >  ((     §wV§.\
  \_   .§wvVvVv§./
    '-.____.'
`],
  reef: [String.raw`
    §p\|/§.         §y.-.§.     §c)\(/)(§.
  §p\ \|/ /§.      §y(   )§.    §c\\||//§.
   §p\_|_/§.  §o\|/§.  §y'-'§.     §c(____)§.
§d.-~~~~~~~~§o\|/§.§d~~~~~~~~~~~~~~~~~~~~-.§.
§d/  .  ,  .   ,  .   '   .   ,   .   \§.
`, String.raw`
    §p\|/§.         §y.-.§.     §c(/)(\)§.
  §p\ \|/ /§.      §y(   )§.    §c//||\\§.
   §p\_|_/§.  §o\|/§.  §y'-'§.     §c(____)§.
§d.-~~~~~~~~§o\|/§.§d~~~~~~~~~~~~~~~~~~~~-.§.
§d/  .  ,  .   ,  .   '   .   ,   .   \§.
`],
  ledge: [String.raw`
§d   .-~~-._.--.__§.
§d _/  ,   .    ' '-._§.
§d/ .    '   ,  .     \__§.
`],
  clown: [String.raw`§o><§w|§o)§w|§o>§.`]
};
const S = {};
const SPR_BASE = { turtle: '#9fc28a', manta: '#8aa3c8', humpback: '#9fb4d0', shark: '#8fa9c4', sperm: '#8a93ad', squid: '#d9776c', angler: '#6d7a96', reef: '#dfe8f2', ledge: '#6f8aa0', clown: '#f0964a' };
Object.entries(SEA).forEach(([k, frames]) => { S[k] = frames.map(f => both(f, SPR_BASE[k])); });

// Depths in metres place each species at its real zone on the dive.
const SPECIES = {
  kelp: { name: 'Giant kelp', sci: 'Macrocystis pyrifera', zone: 'Sunlight zone', fact: 'One of the fastest-growing organisms on Earth, up to about 50 cm a day. Gas-filled bladders (pneumatocysts) hold its fronds up toward the light.', art: '   )\n  (,\n   )\n  ,(\n   )\n  (', col: 'k' },
  coral: { name: 'Reef-building coral', sci: 'Scleractinia', zone: 'Sunlight zone', fact: 'Each polyp hosts symbiotic algae (zooxanthellae) that photosynthesise and supply most of its energy, which is why reefs stay in sunlit water.', art: SEA.reef[0] },
  clown: { name: 'Clown anemonefish', sci: 'Amphiprion ocellaris', zone: 'Sunlight zone', fact: 'A mucus coat protects it from its anemone\'s stinging cells. All are born male; when a group\'s female dies, the dominant male changes sex to replace her.', art: SEA.clown[0] },
  turtle: { name: 'Green sea turtle', sci: 'Chelonia mydas', zone: 'Sunlight zone', fact: 'Adults graze on seagrass and algae. That plant diet tints their body fat green, which gave the species its name.', art: SEA.turtle[0] },
  manta: { name: 'Giant oceanic manta ray', sci: 'Mobula birostris', zone: 'Sunlight zone', fact: 'Wingspan up to about 7 m. It filter-feeds on zooplankton and has one of the largest brain-to-body ratios of any fish.', art: SEA.manta[0] },
  jelly: { name: 'Moon jellyfish', sci: 'Aurelia aurita', zone: 'Sunlight zone', fact: 'No brain, heart or blood. Sensory organs called rhopalia around the bell detect light and keep it oriented.', art: JELLY(0).join('\n'), col: 'p' },
  humpback: { name: 'Humpback whale', sci: 'Megaptera novaeangliae', zone: 'Sunlight zone', fact: 'Males sing long, complex songs lasting up to 20 minutes, and whole populations shift their song from year to year.', art: SEA.humpback[0] },
  shark: { name: 'Blue shark', sci: 'Prionace glauca', zone: 'Sunlight to twilight zone', fact: 'One of the widest-ranging sharks, crossing entire ocean basins. It dives into the twilight zone to hunt squid.', art: SEA.shark[0] },
  siphon: { name: 'Giant siphonophore', sci: 'Praya dubia', zone: 'Twilight zone', fact: 'Not a single animal but a colony of specialised zooids. It can reach 40 to 50 m, longer than a blue whale.', art: '  ()\n  o *\n *  o\n  o  *\n   *  o\n  o *', col: 'c' },
  squid: { name: 'Giant squid', sci: 'Architeuthis dux', zone: 'Twilight to midnight zone', fact: 'Its eyes reach about 27 cm across, among the largest in the animal kingdom, thought to help it spot the glow stirred up by approaching sperm whales.', art: SEA.squid[0] },
  sperm: { name: 'Sperm whale', sci: 'Physeter macrocephalus', zone: 'Dives to the midnight zone', fact: 'Dives beyond 1,000 m to hunt squid and can hold its breath for over an hour. It has the largest brain of any known animal.', art: SEA.sperm[0] },
  angler: { name: 'Humpback anglerfish', sci: 'Melanocetus johnsonii', zone: 'Midnight zone', fact: 'The female dangles a lure (esca) lit by bioluminescent bacteria living inside it. Males are tiny by comparison.', art: SEA.angler[0] },
  dumbo: { name: 'Dumbo octopus', sci: 'Grimpoteuthis', zone: 'Abyssal zone', fact: 'Hovers by flapping ear-like fins. Among the deepest-living octopuses, recorded close to 7,000 m.', art: ART.dumbo_a },
  tripod: { name: 'Tripod fish', sci: 'Bathypterois grallator', zone: 'Midnight to abyssal zone', fact: 'Stands on three stiff, elongated fin rays facing into the current, waiting for prey to drift into its outstretched pectoral fins.', art: ART.tripod },
  brittle: { name: 'Brittle star', sci: 'Ophiuroidea', zone: 'Every depth', fact: 'Relatives of sea stars that crawl with snake-like arms. They carpet large stretches of the deep seafloor.', art: ART.brittle },
  cucumber: { name: 'Sea cucumber', sci: 'Holothuroidea', zone: 'Abyssal zone', fact: 'Often the most abundant large animal on abyssal plains, slowly vacuuming organic "marine snow" from the sediment.', art: ART.cucumber },
  vent: { name: 'Giant tube worms', sci: 'Riftia pachyptila', zone: 'Hydrothermal vents', fact: 'Vent fluid can exceed 350 °C. These worms have no mouth or gut as adults: bacteria inside them turn hydrogen sulfide into food.', art: ART.vent_a }
};
const GUIDE_ORDER = Object.keys(SPECIES);

// Big passers-by cross the screen now and then at their own depth; t in seconds.
const PASSERS = [
  { id: 'turtle', m: 30, sp: 42, period: 34, off: 4 },
  { id: 'manta', m: 70, sp: 55, period: 41, off: 18 },
  { id: 'humpback', m: 140, sp: 38, period: 52, off: 30 },
  { id: 'shark', m: 320, sp: 80, period: 29, off: 9 },
  { id: 'sperm', m: 1300, sp: 34, period: 58, off: 22 }
];
const KELP = [{ xf: 0.025, top: 12, ph: 0 }, { xf: 0.06, top: 24, ph: 1.7 }, { xf: 0.095, top: 9, ph: 3.1 }, { xf: 0.13, top: 34, ph: 4.4 }];
const KELP_BASE = 120;
const hits = [], food = [], pings = [], sparks = [];
const flash = {};
let dTop = 0, dH = 1, fedAt = -99, curDepth = 0;
const yAt = m => dTop + Math.pow(m / 6000, 1 / 2.8) * Math.max(1, dH - H);
function hit(id, x, y, w, h) { hits.push({ id, x, y, w, h }); }
function hitAt(x, y) { for (let i = hits.length - 1; i >= 0; i--) { const h = hits[i]; if (x >= h.x && x <= h.x + h.w && y >= h.y && y <= h.y + h.h) return h.id; } return null; }

let waterF = 0, depthF = 0, scrollYc = 0, diveRect = null;

function drawBackground(t) {
  const sy = scrollYc;
  const dayTop = mixC(mixC(SKY_TOP_D, SKY_TOP_N, nightVal), [70, 50, 100], dusk * 0.4);
  const dayHor = mixC(mixC(SKY_HOR_D, SKY_HOR_N, nightVal), [196, 110, 84], dusk * 0.65);
  ctx.globalAlpha = 1;
  const wy0 = wl - sy;
  // sky
  if (wy0 > 0) {
    const g = ctx.createLinearGradient(0, -sy, 0, wy0);
    g.addColorStop(0, rgb(dayTop)); g.addColorStop(1, rgb(dayHor));
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, Math.min(H, wy0) + 1);
    // stars
    if (nightVal > 0.05) stars.forEach(s => text(s.ch, s.x * W, s.y * wl - sy, '#e8eeff', nightVal * (0.45 + 0.5 * Math.sin(t * 2 + s.ph))));
    // sun / moon
    const a = 2 * Math.PI * (phase - 0.25);
    const sx = W * (0.5 - Math.cos(a) * 0.44), sY = wl - Math.sin(a) * wl * 0.72 - sy;
    const mx = W * (0.5 + Math.cos(a) * 0.44), mY = wl + Math.sin(a) * wl * 0.72 - sy;
    sprite(SUN, sx, sY - 40, '#f0d27a', 1 - nightVal);
    sprite(MOON, mx, mY - 48, '#dfe6ff', nightVal);
    // clouds
    clouds.forEach(c => {
      const x = ((t * c.sp + c.off) % (W + 300)) - 150;
      sprite(CLOUD, x, c.y * wl - sy, rgb(mixC([225, 232, 245], [70, 72, 112], nightVal)), 0.8);
    });
    // gulls
    gulls.forEach(gl => {
      const x = ((t * gl.sp + gl.off) % (W + 100)) - 50, y = gl.y * wl + Math.sin(t * 1.3 + gl.off) * 10 - sy;
      text(Math.floor(t * 3 + gl.off) % 2 ? '\\v/' : '-v-', x, y, rgb(mixC([240, 244, 250], [120, 124, 160], nightVal)), 0.95);
    });
    // lighthouse beam
    const lr = lamp.getBoundingClientRect();
    if (lr.width) {
      const lx = lr.left + 3, ly = lr.top + 3, sw = Math.cos(t * 0.5), aBeam = 0.15 + nightVal * 0.55;
      ctx.fillStyle = '#fff2a8';
      for (let side = -1; side <= 1; side += 2) {
        const len = 34 * Math.max(0, side * sw);
        for (let d = 2; d < len; d++) {
          const hw = Math.floor(d * 0.14);
          for (let k = -hw; k <= hw; k++) text(k === 0 ? '-' : '.', lx + side * d * cw, ly + k * RH - 6, '#fff2a8', (1 - d / len) * aBeam);
        }
      }
    }
  }
  // water (sea seen from above, then underwater)
  if (wy0 < H) {
    const y0 = Math.max(0, wy0), pg = Math.max(pageH, wl + 1000);
    const g = ctx.createLinearGradient(0, wy0, 0, pg - sy);
    WATER.forEach(([f, c]) => g.addColorStop(f, rgb(mixC(c, [3, 6, 18], nightVal * 0.55))));
    ctx.fillStyle = g; ctx.fillRect(0, y0, W, H - y0);
    // the deep swallows light, so bioluminescence has something to glow against
    if (depthF > 0) { ctx.fillStyle = `rgba(2,4,14,${(depthF * 0.55).toFixed(3)})`; ctx.fillRect(0, y0, W, H - y0); }
  }
  // waves in the sea band
  const nW = Math.floor((introH - wl) / RH);
  const dimN = 1 - nightVal * 0.5;
  for (let r = 0; r <= nW; r++) {
    const y = wl + r * RH - sy;
    if (y < -RH || y > H) continue;
    let s = '';
    const dir = r % 2 ? 1 : -1, sp = 1.1 + r * 0.12;
    for (let c = 0; c < COLS; c++) {
      const v = Math.sin(c * 0.33 + t * sp * dir + r * 1.7);
      s += v > 0.7 ? '^' : v > 0.2 ? '~' : v > -0.3 ? '-' : v > -0.7 ? '_' : ' ';
    }
    const k = r / nW;
    text(s, 0, y, r === 0 ? rgb([196, 230, 238]) : rgb(mixC([130, 195, 212], [50, 100, 130], k)), (0.9 - k * 0.5) * dimN);
  }
  // underwater details
  const uw = introH - sy;
  if (uw < H) {
    ctx.fillStyle = rgb([150, 210, 225], 0.07 * (1 - nightVal * 0.6));
    ctx.fillRect(0, Math.max(0, uw), W, 90);
    let surf = '';
    for (let c = 0; c < COLS; c++) surf += Math.sin(c * 0.4 + t * 1.6) > 0 ? '~' : '-';
    text(surf, 0, uw, rgb([190, 228, 236]), 0.5 * dimN);
    // light rays
    const rayA = 0.13 * (1 - nightVal * 0.85);
    for (let k = 0; k < 12; k++) {
      const bx = ((k * 17 + t * 1.4) % (COLS + 20)) - 10;
      for (let rr = 1; rr < 26; rr++) {
        const y = uw + rr * RH;
        if (y < -RH || y > H) continue;
        text('/', (bx - rr * 0.7) * cw, y, '#bfe6f0', rayA * (1 - rr / 26));
      }
    }
    // drifting particles
    const base = Math.floor(sy / RH), off = sy % RH, tick = Math.floor(t * 1.2);
    const rowsOnScreen = Math.ceil(H / RH) + 1;
    for (let r = 0; r < rowsOnScreen; r++) {
      const y = r * RH - off;
      if (y < uw + 20) continue;
      const wr = base + r + tick;
      let s = '', any = false;
      for (let c = 0; c < COLS; c++) {
        const h = hash(c, wr);
        if (h < 0.012) { s += '.'; any = true; } else if (h < 0.017) { s += ':'; any = true; } else if (h < 0.02) { s += "'"; any = true; } else s += ' ';
      }
      if (any) text(s, 0, y, rgb(mixC([140, 205, 222], [160, 150, 230], depthF)), 0.32 * (1 - nightVal * 0.3));
    }
  }
  ctx.globalAlpha = 1;
}

const onScreen = (y, h) => y + h > -40 && y < H + 40;
const glow = (col, blur) => { ctx.shadowColor = col; ctx.shadowBlur = blur; };
function flashOf(id, dt) { const f = flash[id] || 0; flash[id] = Math.max(0, f - dt * 0.7); return f; }

function drawScenery(dt, t) {
  hits.length = 0;
  if (waterF <= 0.01) return;
  const sy = scrollYc, narrow = W < 760, dim = narrow ? 0.55 : 1, f2 = Math.floor(t * 1.4) % 2;

  // kelp forest rooted on a rocky ledge, left edge
  const kb = yAt(KELP_BASE) - sy;
  if (onScreen(yAt(5) - sy, kb - yAt(5) + sy + 60)) {
    let minY = kb;
    KELP.forEach(k => {
      const ty = yAt(k.top) - sy, n = Math.max(2, Math.floor((kb - ty) / RH)), bx = W * k.xf;
      for (let i = 0; i < n; i++) {
        const y = kb - i * RH;
        if (y < -RH || y > H + RH) continue;
        const amp = Math.min(i * 0.09, 2.6), sw = Math.sin(t * 0.7 + k.ph + i * 0.17) * amp;
        const nx = Math.sin(t * 0.7 + k.ph + (i + 1) * 0.17) * Math.min((i + 1) * 0.09, 2.6);
        const x = bx + sw * cw;
        // wavy stipe, with a bladder and a frond every few rows that trails with the swell
        text((i + Math.floor(k.ph)) % 2 ? ')' : '(', x, y, '#b3a85a', 0.9 * dim);
        if (i % 4 === 2 && i < n - 1) {
          const side = (i >> 2) % 2 ? 1 : -1, drift = nx - sw > 0 ? 1 : 0;
          text('o', x + side * cw, y, '#d8c070', 0.8 * dim);
          text(side > 0 ? (drift ? '~~-' : '~-') : (drift ? '-~' : '-~~'), side > 0 ? x + 2 * cw : x - (drift ? 3 : 4) * cw, y - 3, '#8fae5a', 0.75 * dim);
        }
      }
      minY = Math.min(minY, ty);
    });
    drawArt(S.ledge[0].r, 0, kb + RH * 0.6, 0.9 * dim);
    hit('kelp', 0, minY, W * 0.16, kb - minY + RH * 3);
  }

  // coral reef with anemone and clownfish, right edge
  const ry = yAt(45) - sy, reef = S.reef[f2].r;
  if (onScreen(ry, reef.h * RH)) {
    const rx = W - reef.w * cw - (narrow ? -cw * 8 : W * 0.02);
    drawArt(reef, rx, ry, 0.95 * dim);
    hit('coral', rx, ry, 22 * cw, reef.h * RH);
    const ax = rx + 30 * cw, ay = ry + RH * 0.5;
    for (let i = 0; i < 2; i++) {
      const a = t * 0.9 + i * Math.PI, cx = ax + Math.cos(a) * 5 * cw, cy = ay - RH * 1.2 + Math.sin(a * 2) * 8;
      const c = S.clown[0][Math.sin(a) > 0 ? 'l' : 'r'];
      drawArt(c, cx, cy, dim);
      hit('clown', cx - 4, cy - 4, c.w * cw + 8, RH + 8);
    }
  }

  // passers-by
  PASSERS.forEach(p => {
    const frames = S[p.id], a0 = frames[0].r, span = a0.w * cw + 40;
    const cross = (W + span * 2) / p.sp, ph = (t + p.off) % (p.period + cross);
    if (ph > cross) return;
    const y = yAt(p.m) - sy + Math.sin(t * 0.5 + p.off) * 14;
    if (!onScreen(y, a0.h * RH)) return;
    const pass = Math.floor((t + p.off) / (p.period + cross)), ltr = pass % 2 === 0;
    const fr = frames[frames.length > 1 ? Math.floor(t * (p.id === 'shark' ? 3 : 1.3)) % frames.length : 0][ltr ? 'r' : 'l'];
    const x = ltr ? -span + ph * p.sp : W + span - ph * p.sp - fr.w * cw;
    const fl = flashOf(p.id, dt);
    if (fl) glow('#9fe8ff', 12 * fl);
    drawArt(fr, x, y, clamp(0.85 + fl, 0, 1));
    ctx.shadowBlur = 0;
    hit(p.id, x, y, fr.w * cw, fr.h * RH);
  });

  // siphonophore: a long glowing chain drifting in the twilight
  const sx0 = W * (narrow ? 0.08 : 0.2), syT = yAt(650) - sy;
  if (onScreen(syT, 34 * RH)) {
    const fl = flashOf('siphon', dt);
    glow('#7cf0ff', 6 + fl * 10);
    for (let i = 0; i < 34; i++) {
      const x = sx0 + Math.sin(t * 0.45 + i * 0.22) * Math.min(i, 14) * 0.45 * cw, y = syT + i * RH * 0.8;
      const ch = i === 0 ? '()' : i % 3 === 0 ? '*' : i % 3 === 1 ? 'o' : '.';
      const hue = (190 + i * 6 + t * 20) % 360;
      text(ch, x, y, `hsl(${hue},80%,72%)`, clamp(0.35 + 0.35 * Math.sin(t * 2 - i * 0.4) + fl, 0, 1) * dim);
      if (i % 3 === 0 && i) text(i % 2 ? ',' : '`', x + cw * (i % 2 ? 1 : -1), y + 4, '#a0e0f0', 0.4 * dim);
    }
    ctx.shadowBlur = 0;
    hit('siphon', sx0 - 8 * cw, syT, 16 * cw, 34 * RH * 0.8);
  }

  // giant squid hanging in the dark
  const sq = S.squid[f2], qy = yAt(850) - sy + Math.sin(t * 0.3) * 24;
  if (onScreen(qy, sq.r.h * RH)) {
    const qx = W * (narrow ? 0.6 : 0.03) + Math.sin(t * 0.12) * W * 0.02, fl = flashOf('squid', dt);
    if (fl) glow('#ff9a8a', 14 * fl);
    drawArt(sq.r, qx, qy, clamp(0.55 + depthF * 0.2 + fl, 0, 1));
    ctx.shadowBlur = 0;
    hit('squid', qx, qy, sq.r.w * cw, sq.r.h * RH);
  }

  // anglerfish: barely visible body, bright lure
  const ay2 = yAt(2300) - sy;
  if (onScreen(ay2, 7 * RH)) {
    const vx = Math.cos(t * 0.06), ax2 = W * (0.68 + 0.12 * Math.sin(t * 0.06)), an = S.angler[0][vx > 0 ? 'r' : 'l'];
    const fl = flashOf('angler', dt);
    drawArt(an, ax2, ay2, clamp(0.4 + fl, 0, 1));
    const lx = vx > 0 ? ax2 + 10 * cw : ax2 + (an.w - 11) * cw, pulse = 0.6 + 0.4 * Math.sin(t * 2.4);
    glow('#e8ff9a', 10 + 10 * pulse);
    text('@', lx, ay2 - 2, '#f4ffb0', pulse);
    ctx.shadowBlur = 0;
    hit('angler', ax2, ay2 - 6, an.w * cw, an.h * RH + 6);
  }
  ctx.globalAlpha = 1;
}

function drawEffects(dt, t) {
  const k = dt * 60;
  // food pellets sink until eaten
  for (let i = food.length - 1; i >= 0; i--) {
    const p = food[i];
    p.y += 0.45 * k; p.x += Math.sin(t * 2 + p.ph) * 0.25 * k;
    if (p.eaten || p.y > H + 10) { if (p.eaten) burst(p.x, p.y, 2); food.splice(i, 1); continue; }
    text(p.ch, p.x, p.y, '#e8c27a', 0.95);
  }
  // sonar rings light up whatever they sweep past
  for (let i = pings.length - 1; i >= 0; i--) {
    const p = pings[i];
    p.r += 7 * k; p.life -= 0.011 * k; p.y = p.py - scrollYc;
    if (p.life <= 0) { pings.splice(i, 1); continue; }
    const n = Math.max(12, Math.floor(p.r * 2 * Math.PI / (cw * 1.4)));
    glow('#7cf0ff', 10);
    for (const [rr, ch, al] of [[p.r, 'o', 1], [p.r * 0.82, '.', 0.6]]) {
      for (let j = 0; j < n; j++) {
        const a = j / n * Math.PI * 2;
        text(ch, p.x + Math.cos(a) * rr, p.y + Math.sin(a) * rr * 0.75, '#bff9ff', p.life * al);
      }
    }
    ctx.shadowBlur = 0;
    hits.forEach(h => { const d = Math.hypot(h.x + h.w / 2 - p.x, (h.y + h.h / 2 - p.y) / 0.75); if (Math.abs(d - p.r) < 40) flash[h.id] = 1; });
    if (Math.random() < 0.5) { const a = Math.random() * 6.28; sparks.push({ x: p.x + Math.cos(a) * p.r, y: p.y + Math.sin(a) * p.r * 0.75, life: 1, hue: 170 + Math.random() * 60 }); }
  }
  // bioluminescent sparks, thicker the deeper you go
  if (!reduce && Math.random() < depthF * 0.5 * waterF) sparks.push({ x: Math.random() * W, y: Math.random() * H, life: 1, hue: 170 + Math.random() * 90 });
  for (let i = sparks.length - 1; i >= 0; i--) {
    const s = sparks[i];
    s.life -= 0.02 * k;
    if (s.life <= 0) { sparks.splice(i, 1); continue; }
    text(s.life > 0.5 ? '*' : '.', s.x, s.y, `hsl(${s.hue},90%,75%)`, Math.sin(s.life * Math.PI) * 0.9);
  }
  ctx.globalAlpha = 1;
}

function drawLife(dt, t) {
  const k = dt * 60, sy = scrollYc;
  if (waterF > 0.01) {
    SCHOOLS.forEach(sc => {
      const tx = W * (0.5 + 0.4 * Math.sin(t * 0.18 + sc.off)), ty = H * (0.5 + 0.36 * Math.sin(t * 0.23 + sc.off * 1.3));
      const col = `hsl(${sc.hue},55%,${Math.round(68 - depthF * 6)}%)`;
      ctx.fillStyle = col; ctx.globalAlpha = waterF * 0.95;
      if (depthF > 0.35) { ctx.shadowColor = `hsl(${sc.hue},80%,65%)`; ctx.shadowBlur = 8 * depthF; }
      sc.members.forEach(f => {
        let cx = 0, cy = 0, ax = 0, ay = 0, sx = 0, sy2 = 0, n = 0;
        for (const g of sc.members) {
          if (g === f) continue;
          const dx = g.x - f.x, dy = g.y - f.y, d2 = dx * dx + dy * dy;
          if (d2 < 30000) { cx += g.x; cy += g.y; ax += g.vx; ay += g.vy; n++; if (d2 < 1200) { sx -= dx; sy2 -= dy; } }
        }
        if (n) { f.vx += ((cx / n - f.x) * 0.0007 + (ax / n - f.vx) * 0.05 + sx * 0.004) * k; f.vy += ((cy / n - f.y) * 0.0007 + (ay / n - f.vy) * 0.05 + sy2 * 0.004) * k; }
        f.vx += (tx - f.x) * 0.00012 * k; f.vy += (ty - f.y) * 0.00012 * k;
        let fd = null, fdd = 90000;
        for (const p of food) { const dx = p.x - f.x, dy = p.y - f.y, d2 = dx * dx + dy * dy; if (d2 < fdd) { fdd = d2; fd = p; } }
        if (fd) { f.vx += (fd.x - f.x) * 0.0016 * k; f.vy += (fd.y - f.y) * 0.0016 * k; if (fdd < 196) fd.eaten = true; }
        // fish stop fleeing the pointer for a moment after it feeds them
        const mdx = f.x - mouse.x, mdy = f.y - mouse.y, md2 = t - fedAt < 2.5 ? 1e9 : mdx * mdx + mdy * mdy;
        if (md2 < 22500) { const m = (1 - Math.sqrt(md2) / 150) * 0.5; f.vx += mdx * m * 0.02 * k; f.vy += mdy * m * 0.02 * k; }
        if (f.x < 50) f.vx += 0.1 * k; if (f.x > W - 50) f.vx -= 0.1 * k;
        if (f.y < 60) f.vy += 0.1 * k; if (f.y > H - 80) f.vy -= 0.1 * k;
        const sp = Math.hypot(f.vx, f.vy) || 1, lim = clamp(sp, 0.8, md2 < 22500 ? 4 : fd ? 3 : 2.1);
        f.vx = f.vx / sp * lim; f.vy = f.vy / sp * lim;
        f.x += f.vx * k; f.y += f.vy * k;
        if (Math.abs(f.vx) > 0.35) f.dir = f.vx > 0 ? 0 : 1;
        const s = sc.spr[f.dir];
        ctx.fillText(s, Math.round(f.x - s.length * cw / 2), Math.round(f.y));
      });
    });
    ctx.shadowBlur = 0;
    // jellyfish
    jellies.forEach((j, i) => {
      const dTop = diveTop(), y = dTop + j.yf * dive.offsetHeight + Math.sin(t * 0.6 + i * 2) * 30 - sy;
      if (y < -120 || y > H + 20) return;
      const x = W * j.xf + Math.sin(t * 0.4 + i) * 24, f = Math.floor(t * 1.6 + i) % 2;
      const fl = flashOf('jelly' + i, dt);
      ctx.shadowColor = rgb(j.col); ctx.shadowBlur = 4 + nightVal * 12 + fl * 12;
      sprite(JELLY(f), x, y, rgb(j.col), clamp(waterF * 0.9 + fl, 0, 1));
      ctx.shadowBlur = 0;
      hit('jelly' + i, x - 5 * cw, y, 10 * cw, 5 * RH);
    });
  }
  // plankton
  if (nightVal > 0.05 && waterF > 0.01) {
    plankton.forEach(p => {
      p.ph += 0.02 * k; p.y -= p.sp * k * 0.5; p.x += Math.sin(p.ph) * 0.3 * k;
      if (p.y < -5) { p.y = H + 5; p.x = Math.random() * W; }
      text(Math.sin(p.ph) > 0 ? '*' : '.', p.x, p.y, '#b9fff0', nightVal * waterF * (0.35 + 0.65 * Math.abs(Math.sin(p.ph))));
    });
  }
  // bubbles
  for (let i = bubbles.length - 1; i >= 0; i--) {
    const b = bubbles[i];
    b.ph += 0.05 * k; b.y -= b.vy * k; b.x += (b.vx + Math.sin(b.ph) * 0.3) * k;
    if (b.own) { b.vx *= 0.97; b.vy = b.vy * 0.99 + 0.01; b.life -= 0.012 * k; if (b.life <= 0 || b.y < -20) { bubbles.splice(i, 1); continue; } }
    else if (b.y < -20) { b.y = H + 20; b.x = Math.random() * W; }
    const ch = b.ch || (b.r < 2.5 ? '.' : b.r < 4.5 ? 'o' : 'O');
    text(ch, b.x, b.y, b.color || '#cfeaf2', b.own ? clamp(b.life, 0, 1) : waterF * 0.8);
  }
  ctx.globalAlpha = 1;
}

/* ---------- Scroll, depth, glide ---------- */
const depthMeter = $('#depthMeter');
let lastDepthText = '';
function updateScroll() {
  scrollYc = window.scrollY;
  const r = dive.getBoundingClientRect(); diveRect = r;
  waterF = clamp((H - r.top) / (H * 0.7), 0, 1) * clamp(r.bottom / (H * 0.6), 0, 1);
  const frac = clamp((scrollYc + H / 2 - (r.top + scrollYc)) / Math.max(1, dive.offsetHeight - H), 0, 1);
  const m = r.top < H / 2 ? depthFromFrac(frac) : 0;
  depthF = clamp(m / 4000, 0, 1); curDepth = m;
  const txt = (m === 0 ? 'Surface' : zoneOf(m)) + ' ' + fmt(m) + ' m';
  if (txt !== lastDepthText) { depthMeter.textContent = txt; lastDepthText = txt; }
}
let gliding = false, cancelGlide = false;
['wheel', 'touchstart', 'keydown'].forEach(ev => addEventListener(ev, () => { if (gliding) cancelGlide = true; }, { passive: true }));
function glideTo(y, ms = 2800) {
  y = Math.max(0, y);
  if (reduce) { scrollTo(0, y); return; }
  const y0 = scrollY, dy = y - y0, t0 = performance.now();
  gliding = true; cancelGlide = false;
  const ease = t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  burst(W / 2, H * 0.75, 50);
  (function step(now) {
    const p = clamp((now - t0) / ms, 0, 1);
    scrollTo(0, y0 + dy * ease(p));
    if (Math.random() < 0.35) burst(Math.random() * W, H + 10, 3);
    if (p < 1 && !cancelGlide) requestAnimationFrame(step); else gliding = false;
  })(t0);
}
const pageTop = el => el.getBoundingClientRect().top + scrollY;
const TARGETS = { intro: () => 0, timeline: () => pageTop(timeline) - 70, seabed: () => pageTop($('#seabed')) - 30, terminal: () => pageTop(terminal) - 20 };
$('#nextBtn').addEventListener('click', () => glideTo(pageTop(dive) + 140));
$('#toTerminal').addEventListener('click', () => glideTo(TARGETS.terminal(), 2200));
const startMenu = $('#startMenu'), startBtn = $('#startBtn');
startBtn.addEventListener('click', e => { e.stopPropagation(); startMenu.hidden = !startMenu.hidden; startBtn.setAttribute('aria-expanded', String(!startMenu.hidden)); });
document.addEventListener('click', e => { if (!startMenu.contains(e.target)) { startMenu.hidden = true; startBtn.setAttribute('aria-expanded', 'false'); } });
$$('[data-go]').forEach(b => b.addEventListener('click', () => { startMenu.hidden = true; glideTo(TARGETS[b.dataset.go](), b.dataset.go === 'intro' ? 4200 : 2800); }));

/* ---------- Reveal cards ---------- */
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: 0.2 });
stages.forEach(s => io.observe(s));

/* ---------- Seaweed + crab frames ---------- */
const weeds = $$('.weed');
const crab = $('#crab');
let wf = 0;
function animateFrames() {
  wf ^= 1;
  weeds.forEach((w, i) => { w.textContent = ((wf ^ (i & 1)) ? ART.seaweed_a : ART.seaweed_b).replace(/^\n/, '').replace(/\n$/, ''); });
  crab.textContent = wf ? ' (\\/)o.o(\\/)' : ' (/\\)o.o(/\\)';
}
const critterFrames = () => { critterArt('vent', wf ? 'vent_a' : 'vent_b'); critterArt('dumbo', wf ? 'dumbo_a' : 'dumbo_b'); };
animateFrames(); critterFrames(); setInterval(() => { animateFrames(); critterFrames(); }, 750);

/* ---------- Treasure chest ---------- */
const chest = $('#chest'), chestArt = $('#chestArt'), dlgText = $('#dlgText'), mailBox = $('#mailBox'), mailLink = $('#mailLink'), copyBtn = $('#copyBtn');
const MAIL = ['vermillou', 'gmail.com'];
const frame = k => markup(padTop(rows(ART[k]), 8).join('\n'));
let chestOpen = false, sparkle = null, sparkleF = 0;
chest.addEventListener('click', () => {
  chestOpen = !chestOpen;
  chest.setAttribute('aria-expanded', String(chestOpen));
  clearInterval(sparkle);
  if (chestOpen) {
    chestArt.innerHTML = frame('chest_half');
    setTimeout(() => { if (!chestOpen) return; chestArt.innerHTML = frame('chest_open_a'); sparkle = setInterval(() => { sparkleF ^= 1; chestArt.innerHTML = frame(sparkleF ? 'chest_open_b' : 'chest_open_a'); }, 480); }, 260);
    const addr = MAIL.join('@');
    mailLink.textContent = addr; mailLink.href = 'mailto:' + addr; mailBox.hidden = false;
    dlgText.textContent = 'Treasure found! Write to me here:';
    const r = chest.getBoundingClientRect();
    burst(r.left + r.width / 2, r.top + r.height * 0.4, 40, '#ecd08a', '$*o');
    burst(r.left + r.width / 2, r.top + r.height * 0.4, 14, '#d98ab5', '*+');
  } else {
    chestArt.innerHTML = frame('chest_closed'); mailBox.hidden = true;
    dlgText.textContent = 'Psst! My email is hidden in this chest. Open it!';
  }
});
copyBtn.addEventListener('click', async () => {
  const addr = MAIL.join('@');
  try { await navigator.clipboard.writeText(addr); }
  catch (e) { const ta = document.createElement('textarea'); ta.value = addr; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove(); }
  copyBtn.textContent = 'Copied!'; setTimeout(() => copyBtn.textContent = 'Copy', 1600);
});

/* ---------- Terminal ---------- */
const xp = $('#xpBody');
const SCRIPT = [
  { t: '+--------------------------------+', c: 'cy' },
  { t: '|  GLOOMYTREE  ::  GITHUB.EXE    |', c: 'cy' },
  { t: '+--------------------------------+', c: 'cy' },
  { t: 'Microsoft Windows XP [Version 5.1.2600]', c: 'dim' },
  { t: '(C) Copyright 1985-2001 Microsoft Corp.', c: 'dim' },
  { t: '' },
  { p: 'C:\\GloomyTree>', t: ' whoami' },
  { t: 'marine-sciences-student / developer' },
  { t: '' },
  { p: 'C:\\GloomyTree>', t: ' dir /projects' },
  { t: ' <DIR>  discord-bots', c: 'dim' },
  { t: ' <DIR>  roblox-systems', c: 'dim' },
  { t: ' <DIR>  vencord-plugins', c: 'dim' },
  { t: '' },
  { p: 'C:\\GloomyTree>', t: ' start github' },
  { t: 'Opening profile at:' },
  { link: 'https://github.com/x64-GloomyTree' },
  { t: '' }
];
let typed = false;
function addLine(item) {
  const div = document.createElement('div');
  if (item.p) { const s = document.createElement('span'); s.className = 'pr'; s.textContent = item.p; div.appendChild(s); }
  if (item.link) { const a = document.createElement('a'); a.className = 'xp-link'; a.href = item.link; a.target = '_blank'; a.rel = 'noopener'; a.textContent = item.link; div.appendChild(a); }
  else { const s = document.createElement('span'); if (item.c) s.className = item.c; div.appendChild(s); div._t = s; }
  xp.appendChild(div); return div;
}
async function runTerminal() {
  if (typed) return; typed = true;
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const cur = document.createElement('span'); cur.className = 'cursor';
  for (const item of SCRIPT) {
    const div = addLine(item);
    if (div._t && item.t) {
      if (reduce) div._t.textContent = item.t;
      else { div.appendChild(cur); for (const ch of item.t) { div._t.textContent += ch; await sleep(item.p ? 55 : 10); } await sleep(item.p ? 300 : 50); }
    } else if (item.link && !reduce) await sleep(250);
  }
  const act = document.createElement('div'); act.className = 'xp-actions';
  act.innerHTML = '<a class="xp-btn go" href="https://github.com/x64-GloomyTree" target="_blank" rel="noopener">Open GitHub &gt;</a>';
  xp.appendChild(act);
  const last = document.createElement('div');
  last.innerHTML = '<span class="pr">C:\\GloomyTree&gt;</span> '; last.appendChild(cur); xp.appendChild(last);
}
new IntersectionObserver((es, o) => { if (es[0].isIntersecting) { runTerminal(); o.disconnect(); } }, { threshold: 0.35 }).observe($('.crt'));

const clock = $('#clock');
const tick = () => clock.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
tick(); setInterval(tick, 30000);

/* ---------- Field guide ---------- */
const guide = $('#guide'), gArt = $('#gArt');
let gIdx = 0, gReturn = null;
function showSpecies(i) {
  gIdx = (i + GUIDE_ORDER.length) % GUIDE_ORDER.length;
  const sp = SPECIES[GUIDE_ORDER[gIdx]];
  const art = rows(sp.art.startsWith('\n') ? sp.art : '\n' + sp.art).join('\n');
  gArt.innerHTML = sp.col ? `<span class="c-${sp.col}">${markup(art)}</span>` : markup(art);
  $('#gZone').textContent = sp.zone;
  $('#gName').textContent = sp.name;
  $('#gSci').textContent = sp.sci;
  $('#gFact').textContent = sp.fact;
  $('#gCount').textContent = `${gIdx + 1} / ${GUIDE_ORDER.length}`;
}
function openGuide(id, x, y) {
  showSpecies(GUIDE_ORDER.indexOf(id.replace(/\d+$/, '')));
  gReturn = document.activeElement;
  guide.hidden = false;
  const r = guide.getBoundingClientRect(), pad = 10;
  const left = x == null ? (W - r.width) / 2 : clamp(x + 16, pad, W - r.width - pad);
  const top = y == null ? H - r.height - 60 : clamp(y - r.height / 2, pad, H - r.height - 50);
  guide.style.left = left + 'px'; guide.style.top = top + 'px';
  $('#gNext').focus({ preventScroll: true });
}
function closeGuide() {
  if (guide.hidden) return;
  guide.hidden = true;
  if (gReturn && gReturn.focus && gReturn !== document.body) gReturn.focus({ preventScroll: true });
}
$('#gClose').addEventListener('click', closeGuide);
$('#gPrev').addEventListener('click', () => showSpecies(gIdx - 1));
$('#gNext').addEventListener('click', () => showSpecies(gIdx + 1));
$('#guideBtn').addEventListener('click', () => { startMenu.hidden = true; openGuide(GUIDE_ORDER[0]); });
$$('.critter').forEach(b => b.addEventListener('click', e => {
  const r = b.getBoundingClientRect();
  openGuide(b.dataset.species, e.detail ? e.clientX : r.right, e.detail ? e.clientY : r.top);
}));
addEventListener('keydown', e => { if (e.key === 'Escape') { closeGuide(); startMenu.hidden = true; } });

/* ---------- Tips (XP balloon) ---------- */
const balloon = $('#balloon');
let balloonT = 0;
const seen = new Set();
function tip(key, title, body) {
  if (seen.has(key)) return;
  seen.add(key);
  $('#bTitle').textContent = title; $('#bText').textContent = body;
  balloon.hidden = false;
  clearTimeout(balloonT); balloonT = setTimeout(() => { balloon.hidden = true; }, 9000);
}
$('#bClose').addEventListener('click', () => { balloon.hidden = true; });

/* ---------- Clicking the water ---------- */
const INTERACTIVE = 'a,button,input,textarea,.win,.startmenu,.taskbar,.balloon,.catch';
const underwater = y => y > introH - scrollYc;
document.addEventListener('click', e => {
  if (e.target.closest(INTERACTIVE) || !waterF) return;
  const id = hitAt(e.clientX, e.clientY);
  if (id) { openGuide(id, e.clientX, e.clientY); return; }
  if (!underwater(e.clientY)) return;
  if (curDepth < 1000) {
    fedAt = performance.now() / 1000;
    for (let i = 0; i < 5; i++) food.push({ x: e.clientX + (Math.random() - 0.5) * 30, y: e.clientY + (Math.random() - 0.5) * 16, ph: Math.random() * 6.28, ch: '*.:'[i % 3] });
  } else {
    pings.push({ x: e.clientX, py: e.clientY + scrollYc, r: 4, life: 1 });
  }
});
document.addEventListener('pointermove', e => {
  const over = !!hitAt(e.clientX, e.clientY) && !e.target.closest(INTERACTIVE);
  root.classList.toggle('over-creature', over);
});
function checkTips() {
  if (curDepth > 20 && curDepth < 1000) tip('feed', 'You are underwater', 'Click the water to feed the fish. Click any creature to open its field guide entry.');
  else if (curDepth >= 1000) tip('sonar', 'It is dark down here', 'Click the water to send a sonar ping and make the deep glow.');
}

/* ---------- Hydrothermal vent smoke ---------- */
const ventEl = $('#vent');
function ventSmoke() {
  if (reduce || Math.random() > 0.35) return;
  const r = ventEl.getBoundingClientRect();
  if (r.bottom < 0 || r.top > H || !r.width) return;
  bubbles.push(newBubble(true, r.left + r.width / 2 + (Math.random() - 0.5) * 6, r.top + 4, { vx: (Math.random() - 0.5) * 0.4, vy: 0.5 + Math.random() * 0.4, color: Math.random() < 0.25 ? '#e8907f' : '#b4bccb', ch: '()~.'[Math.floor(Math.random() * 4)] }));
}

/* ---------- Music: loops, muffled underwater ---------- */
// shortcut: placeholder track at music/theme.mp3; swap the <audio> src when the real file exists.
const music = $('#music'), musicBtn = $('#musicBtn');
let actx = null, lowpass = null, mGain = null, musicOn = false, musicMissing = false, lastCut = 0;
let musicWanted = true;
try { musicWanted = localStorage.getItem('gt-music') !== 'off'; } catch (e) {}
function setMusicBtn() {
  musicBtn.textContent = musicMissing ? '[<?] NO TRACK' : musicOn ? '[<))] ON' : '[<x] OFF';
  musicBtn.title = musicMissing ? 'Add a looping track at music/theme.mp3' : musicOn ? 'Mute music' : 'Play music';
  musicBtn.setAttribute('aria-pressed', String(musicOn));
}
function initAudio() {
  const AC = window.AudioContext || window.webkitAudioContext;
  if (actx || !AC) return;
  actx = new AC();
  lowpass = actx.createBiquadFilter(); lowpass.type = 'lowpass'; lowpass.frequency.value = 20000; lowpass.Q.value = 0.8;
  mGain = actx.createGain(); mGain.gain.value = 0.6;
  actx.createMediaElementSource(music).connect(lowpass).connect(mGain).connect(actx.destination);
}
function playMusic() {
  initAudio();
  if (actx && actx.state === 'suspended') actx.resume();
  music.play().then(() => { musicOn = true; musicMissing = false; setMusicBtn(); }).catch(() => { musicOn = false; setMusicBtn(); });
}
music.addEventListener('error', () => { musicMissing = true; musicOn = false; setMusicBtn(); });
musicBtn.addEventListener('click', () => {
  if (musicOn) { music.pause(); musicOn = false; musicWanted = false; }
  else { musicWanted = true; playMusic(); }
  try { musicWanted ? localStorage.removeItem('gt-music') : localStorage.setItem('gt-music', 'off'); } catch (e) {}
  setMusicBtn();
});
function firstGesture(e) {
  removeEventListener('click', firstGesture, true); removeEventListener('keydown', firstGesture, true);
  if (musicWanted && e.target !== musicBtn) playMusic();
}
addEventListener('click', firstGesture, true); addEventListener('keydown', firstGesture, true);
function updateMusic() {
  if (!lowpass) return;
  // log-interpolate the cutoff from open air to a deep, dark murmur as the surface passes overhead
  const sub = clamp((scrollYc + H * 0.5 - introH) / (H * 0.25), 0, 1);
  const deep = lerp(1100, 320, depthF), cut = Math.exp(lerp(Math.log(20000), Math.log(deep), sub));
  if (Math.abs(cut - lastCut) / cut < 0.03) return;
  lastCut = cut;
  lowpass.frequency.setTargetAtTime(cut, actx.currentTime, 0.15);
  mGain.gain.setTargetAtTime(lerp(0.6, 0.42, sub), actx.currentTime, 0.2);
}
setMusicBtn();

/* ---------- Main loop ---------- */
let last = performance.now();
function loop(now) {
  const dt = Math.min((now - last) / 1000, 0.05); last = now;
  updateTime(dt); updateScroll();
  ctx.font = FONT; ctx.textBaseline = 'top'; ctx.textAlign = 'left';
  ctx.clearRect(0, 0, W, H);
  drawBackground(now / 1000);
  drawScenery(dt, now / 1000);
  drawLife(dt, now / 1000);
  drawEffects(dt, now / 1000);
  ventSmoke(); checkTips(); updateMusic();
  requestAnimationFrame(loop);
}
let rz; addEventListener('resize', () => { resize(); clearTimeout(rz); rz = setTimeout(layout, 120); });
function start() { resize(); layout(); requestAnimationFrame(loop); }
const ready = document.fonts && document.fonts.load ? document.fonts.load(FONT).catch(() => {}) : Promise.resolve();
Promise.race([ready, new Promise(r => setTimeout(r, 1500))]).then(() => { start(); setTimeout(layout, 600); });
addEventListener('load', () => setTimeout(layout, 200));

})();
