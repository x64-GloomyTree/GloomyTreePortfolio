(() => {
'use strict';
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const root = document.documentElement;
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const smooth = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
const isMobile = matchMedia('(max-width: 760px)').matches;

const intro = $('#intro'), dive = $('#dive'), terminal = $('#terminal');
const sun = $('#sun'), moon = $('#moon');
const modeBtn = $('#modeBtn'), depthMeter = $('#depthMeter');

/* ---------- Stars ---------- */
(() => {
  const box = $('#stars');
  for (let i = 0; i < 90; i++) {
    const s = document.createElement('i');
    s.style.left = Math.random() * 100 + '%';
    s.style.top = Math.random() * 100 + '%';
    s.style.animationDelay = (-Math.random() * 3) + 's';
    s.style.scale = (0.5 + Math.random()).toFixed(2);
    box.appendChild(s);
  }
})();

/* ---------- Day / night ---------- */
const CYCLE_SECONDS = 120;
const MODES = { cycle: '🌞 Cycle', day: '☀️ Day', night: '🌙 Night' };
const d0 = new Date();
let phase = (d0.getHours() * 60 + d0.getMinutes()) / 1440; // 0 = midnight, 0.5 = noon
let mode = 'cycle';
let nightVal = 0;

modeBtn.addEventListener('click', () => {
  mode = mode === 'cycle' ? 'day' : mode === 'day' ? 'night' : 'cycle';
  modeBtn.textContent = MODES[mode];
});

function updateTime(dt) {
  if (mode === 'cycle') {
    phase = (phase + dt / CYCLE_SECONDS) % 1;
  } else {
    const target = mode === 'day' ? 0.5 : 0;
    const d = (target - phase + 1) % 1;
    const step = dt * 0.35;
    phase = d < step ? target : (phase + step) % 1;
  }
  const s = -Math.cos(2 * Math.PI * phase);
  nightVal = 1 - smooth(-0.18, 0.22, s);
  const dusk = clamp(1 - Math.abs(s + 0.02) / 0.38, 0, 1);
  root.style.setProperty('--night', nightVal.toFixed(3));
  root.style.setProperty('--dusk', dusk.toFixed(3));
  const a = 2 * Math.PI * (phase - 0.25);
  sun.style.left = (50 - Math.cos(a) * 44) + '%';
  sun.style.top = (62 - Math.sin(a) * 42) + '%';
  moon.style.left = (50 + Math.cos(a) * 44) + '%';
  moon.style.top = (62 + Math.sin(a) * 42) + '%';
}

/* ---------- Canvas: fish, bubbles, plankton ---------- */
const cv = $('#fx'), ctx = cv.getContext('2d');
let W = 0, H = 0, DPR = 1;
function resize() {
  DPR = Math.min(window.devicePixelRatio || 1, 2);
  W = innerWidth; H = innerHeight;
  cv.width = W * DPR; cv.height = H * DPR;
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
}
addEventListener('resize', () => { resize(); computeStageDepths(); });
resize();

const mouse = { x: -999, y: -999 };
addEventListener('pointermove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
addEventListener('pointerleave', () => { mouse.x = mouse.y = -999; });
addEventListener('touchend', () => { mouse.x = mouse.y = -999; });

const HUES = [18, 48, 330, 185, 105, 270];
const SCHOOLS = [];
const FISH_PER = isMobile ? 6 : 11;
HUES.forEach((hue, i) => {
  const sc = { hue, off: i * 1.7, members: [], size: 7 + (i % 3) * 2.5 };
  for (let k = 0; k < FISH_PER; k++) {
    sc.members.push({ x: Math.random() * W, y: Math.random() * H, vx: Math.random() * 2 - 1, vy: Math.random() * 2 - 1, ph: Math.random() * 6.28, sc });
  }
  SCHOOLS.push(sc);
});

const bubbles = [];
function newBubble(own, x, y, extra) {
  return Object.assign({ x: x ?? Math.random() * W, y: y ?? H + Math.random() * H, r: 2 + Math.random() * 7, vy: 0.4 + Math.random() * 0.9, vx: 0, ph: Math.random() * 6.28, own: !!own, life: 1, color: null }, extra);
}
for (let i = 0; i < (isMobile ? 16 : 30); i++) bubbles.push(newBubble(false, undefined, Math.random() * H));

function burst(x, y, n, color) {
  for (let i = 0; i < n; i++) {
    const ang = Math.random() * Math.PI * 2, sp = Math.random() * 3 + 0.5;
    bubbles.push(newBubble(true, x, y, { r: 2 + Math.random() * 6, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp * 0.6 + 0.8, life: 1, color }));
  }
}

const plankton = Array.from({ length: isMobile ? 30 : 70 }, () => ({ x: Math.random() * W, y: Math.random() * H, ph: Math.random() * 6.28, sp: 0.1 + Math.random() * 0.3 }));

function drawFish(f, depthF, alpha) {
  const sc = f.sc, s = sc.size;
  const ang = Math.atan2(f.vy, f.vx), flip = f.vx < 0;
  const wig = Math.sin(f.ph) * 0.45;
  const light = 58 - depthF * 6;
  const col = `hsl(${sc.hue},92%,${light}%)`;
  ctx.save();
  ctx.translate(f.x, f.y);
  ctx.rotate(ang);
  if (flip) ctx.scale(1, -1);
  if (depthF > 0.35) { ctx.shadowColor = `hsl(${sc.hue},100%,65%)`; ctx.shadowBlur = 14 * depthF; }
  ctx.fillStyle = col;
  ctx.beginPath();
  ctx.moveTo(-s * 0.8, 0);
  ctx.lineTo(-s * 1.7, -s * 0.7 + wig * s);
  ctx.lineTo(-s * 1.7, s * 0.7 + wig * s);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(0, 0, s, s * 0.58, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.fillStyle = 'rgba(255,255,255,.42)';
  ctx.beginPath();
  ctx.ellipse(s * 0.05, s * 0.2, s * 0.8, s * 0.26, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.beginPath(); ctx.arc(s * 0.55, -s * 0.12, s * 0.2, 0, 6.28); ctx.fill();
  ctx.fillStyle = '#1a2a55';
  ctx.beginPath(); ctx.arc(s * 0.6, -s * 0.12, s * 0.1, 0, 6.28); ctx.fill();
  ctx.restore();
}

function drawBubble(b, a) {
  ctx.globalAlpha = a;
  if (b.color) {
    ctx.fillStyle = b.color;
    ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, 6.28); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,.8)';
    ctx.beginPath(); ctx.arc(b.x - b.r * 0.3, b.y - b.r * 0.3, b.r * 0.3, 0, 6.28); ctx.fill();
  } else {
    ctx.fillStyle = 'rgba(255,255,255,.14)';
    ctx.strokeStyle = 'rgba(255,255,255,.75)';
    ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, 6.28); ctx.fill(); ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,.9)';
    ctx.beginPath(); ctx.arc(b.x - b.r * 0.35, b.y - b.r * 0.35, b.r * 0.25, 0, 6.28); ctx.fill();
  }
}

let waterF = 0, depthF = 0;
function updateFx(dt, t) {
  const k = dt * 60;
  ctx.clearRect(0, 0, W, H);
  if (waterF > 0.01) {
    ctx.globalAlpha = waterF;
    SCHOOLS.forEach(sc => {
      const tx = W * (0.5 + 0.4 * Math.sin(t * 0.18 + sc.off)), ty = H * (0.5 + 0.36 * Math.sin(t * 0.23 + sc.off * 1.3));
      sc.members.forEach(f => {
        let cx = 0, cy = 0, ax = 0, ay = 0, sx = 0, sy = 0, n = 0;
        for (const g of sc.members) {
          if (g === f) continue;
          const dx = g.x - f.x, dy = g.y - f.y, d2 = dx * dx + dy * dy;
          if (d2 < 22500) { cx += g.x; cy += g.y; ax += g.vx; ay += g.vy; n++; if (d2 < 700) { sx -= dx; sy -= dy; } }
        }
        if (n) { f.vx += ((cx / n - f.x) * 0.0007 + (ax / n - f.vx) * 0.05 + sx * 0.004) * k; f.vy += ((cy / n - f.y) * 0.0007 + (ay / n - f.vy) * 0.05 + sy * 0.004) * k; }
        f.vx += (tx - f.x) * 0.00012 * k; f.vy += (ty - f.y) * 0.00012 * k;
        const mdx = f.x - mouse.x, mdy = f.y - mouse.y, md2 = mdx * mdx + mdy * mdy;
        if (md2 < 22500) { const m = (1 - Math.sqrt(md2) / 150) * 0.5; f.vx += mdx * m * 0.02 * k; f.vy += mdy * m * 0.02 * k; }
        if (f.x < 40) f.vx += 0.1 * k; if (f.x > W - 40) f.vx -= 0.1 * k;
        if (f.y < 60) f.vy += 0.1 * k; if (f.y > H - 60) f.vy -= 0.1 * k;
        const sp = Math.hypot(f.vx, f.vy) || 1, max = md2 < 22500 ? 4.2 : 2.3, min = 0.9;
        const lim = clamp(sp, min, max);
        f.vx = f.vx / sp * lim; f.vy = f.vy / sp * lim;
        f.x += f.vx * k; f.y += f.vy * k;
        f.ph += (0.15 + lim * 0.08) * k;
        drawFish(f, depthF, waterF);
      });
    });
    ctx.globalAlpha = 1;
  }
  // plankton
  if (nightVal > 0.05 && waterF > 0.01) {
    plankton.forEach(p => {
      p.ph += 0.02 * k; p.y -= p.sp * k * 0.5; p.x += Math.sin(p.ph) * 0.3 * k;
      if (p.y < -5) { p.y = H + 5; p.x = Math.random() * W; }
      ctx.globalAlpha = nightVal * waterF * (0.35 + 0.65 * Math.abs(Math.sin(p.ph)));
      ctx.fillStyle = '#b9fff0'; ctx.shadowColor = '#7dffe0'; ctx.shadowBlur = 8;
      ctx.beginPath(); ctx.arc(p.x, p.y, 2, 0, 6.28); ctx.fill();
    });
    ctx.shadowBlur = 0;
  }
  // bubbles
  for (let i = bubbles.length - 1; i >= 0; i--) {
    const b = bubbles[i];
    b.ph += 0.05 * k; b.y -= b.vy * k; b.x += (b.vx + Math.sin(b.ph) * 0.3) * k;
    if (b.own) { b.vx *= 0.97; b.vy = b.vy * 0.99 + 0.01; b.life -= 0.012 * k; if (b.life <= 0 || b.y < -20) { bubbles.splice(i, 1); continue; } }
    else if (b.y < -20) { b.y = H + 20; b.x = Math.random() * W; }
    drawBubble(b, b.own ? clamp(b.life, 0, 1) : waterF * 0.9);
  }
  ctx.globalAlpha = 1;
}

/* ---------- Scroll, depth, glide ---------- */
const stages = $$('.stage');
const zoneOf = m => m < 200 ? 'Sunlight zone' : m < 1000 ? 'Twilight zone' : m < 4000 ? 'Midnight zone' : 'Abyssal zone';
const depthFromFrac = f => Math.round(6000 * Math.pow(f, 1.4) / 10) * 10;
const fmt = n => n.toLocaleString('en-US');
function fracAtCenter(centerY) {
  const top = dive.getBoundingClientRect().top + scrollY;
  return clamp((centerY - top) / Math.max(1, dive.offsetHeight - innerHeight), 0, 1);
}
function computeStageDepths() {
  stages.forEach(st => {
    const r = st.getBoundingClientRect();
    const m = depthFromFrac(fracAtCenter(r.top + scrollY + r.height / 2));
    $('.depth-tag', st).textContent = `${zoneOf(m)} · ${fmt(m)} m`;
  });
}

let gliding = false, cancelGlide = false;
['wheel', 'touchstart', 'keydown'].forEach(ev => addEventListener(ev, () => { if (gliding) cancelGlide = true; }, { passive: true }));
function glideTo(y, ms = 2800) {
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
$('#nextBtn').addEventListener('click', () => glideTo(pageTop(dive)));
$('#toTerminal').addEventListener('click', () => glideTo(pageTop(terminal) - 20, 2200));
$('#toSurface').addEventListener('click', () => glideTo(0, 4200));

let lastDepthText = '';
function updateScroll() {
  const r = dive.getBoundingClientRect();
  waterF = clamp((H - r.top) / (H * 0.7), 0, 1) * clamp(r.bottom / (H * 0.6), 0, 1);
  const frac = clamp((scrollY + H / 2 - (r.top + scrollY)) / Math.max(1, dive.offsetHeight - H), 0, 1);
  const inWater = r.top < H / 2;
  const m = inWater ? depthFromFrac(frac) : 0;
  depthF = clamp(m / 4000, 0, 1);
  const txt = (m === 0 ? 'Surface' : zoneOf(m)) + ' · ' + fmt(m) + ' m';
  if (txt !== lastDepthText) { depthMeter.textContent = txt; lastDepthText = txt; }
}

/* ---------- Reveal cards ---------- */
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: 0.25 });
stages.forEach(s => io.observe(s));

/* ---------- Treasure chest ---------- */
const chest = $('#chest'), dlgText = $('#dlgText'), mailBox = $('#mailBox'), mailLink = $('#mailLink'), copyBtn = $('#copyBtn');
const MAIL = ['vermillou', 'gmail.com'];
chest.addEventListener('click', () => {
  const open = chest.classList.toggle('open');
  chest.setAttribute('aria-expanded', String(open));
  if (open) {
    const addr = MAIL.join('@');
    mailLink.textContent = addr; mailLink.href = 'mailto:' + addr;
    mailBox.hidden = false;
    dlgText.textContent = 'Treasure found! Write to me here:';
    const r = chest.getBoundingClientRect();
    burst(r.left + r.width / 2, r.top + r.height * 0.4, 46, '#ffd23f');
    burst(r.left + r.width / 2, r.top + r.height * 0.4, 18, '#ff7ab8');
  } else {
    mailBox.hidden = true;
    dlgText.textContent = 'Psst! My email is hidden in this chest. Open it!';
  }
});
copyBtn.addEventListener('click', async () => {
  const addr = MAIL.join('@');
  try { await navigator.clipboard.writeText(addr); }
  catch (e) { const ta = document.createElement('textarea'); ta.value = addr; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove(); }
  copyBtn.textContent = 'Copied!'; setTimeout(() => copyBtn.textContent = 'Copy', 1600);
});

/* ---------- Retro terminal ---------- */
const xp = $('#xpBody');
const SCRIPT = [
  { t: 'Microsoft Windows XP [Version 5.1.2600]', c: 'dim' },
  { t: '(C) Copyright 1985-2001 Microsoft Corp.', c: 'dim' },
  { t: '' },
  { p: 'C:\\GloomyTree>', t: ' whoami' },
  { t: 'marine-sciences-student / developer', c: 'cy' },
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
  xp.appendChild(div);
  return div;
}
async function runTerminal() {
  if (typed) return; typed = true;
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const cur = document.createElement('span'); cur.className = 'cursor';
  for (const item of SCRIPT) {
    const div = addLine(item);
    if (div._t && item.t) {
      if (reduce) div._t.textContent = item.t;
      else { div.appendChild(cur); for (const ch of item.t) { div._t.textContent += ch; await sleep(item.p ? 55 : 14); } await sleep(item.p ? 300 : 60); }
    } else if (item.link && !reduce) await sleep(250);
  }
  const act = document.createElement('div'); act.className = 'xp-actions';
  act.innerHTML = '<a class="xp-btn go" href="https://github.com/x64-GloomyTree" target="_blank" rel="noopener">Open GitHub &gt;</a>';
  xp.appendChild(act);
  const last = document.createElement('div');
  last.innerHTML = '<span class="pr">C:\\GloomyTree></span> ';
  last.appendChild(cur); xp.appendChild(last);
}
new IntersectionObserver((es, o) => { if (es[0].isIntersecting) { runTerminal(); o.disconnect(); } }, { threshold: 0.35 }).observe($('.xp-window'));

const clock = $('#clock');
const tick = () => clock.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
tick(); setInterval(tick, 30000);

/* ---------- Main loop ---------- */
let last = performance.now();
function frame(now) {
  const dt = Math.min((now - last) / 1000, 0.05); last = now;
  updateTime(dt);
  updateScroll();
  updateFx(dt, now / 1000);
  requestAnimationFrame(frame);
}
window.addEventListener('load', computeStageDepths);
computeStageDepths();
requestAnimationFrame(frame);
})();
