(function(){
'use strict';
const $ = s => document.querySelector(s);
const rm = matchMedia('(prefers-reduced-motion: reduce)').matches;
const hasG = typeof gsap !== 'undefined';
if (hasG && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);

const boom = (o) => {
  if (typeof confetti === 'function') {
    confetti(Object.assign({
      disableForReducedMotion: true,
      zIndex: 200,
      colors: ['#ff5f9e', '#ff9a8b', '#ffd98a', '#ffffff', '#a78bfa']
    }, o));
  }
};

/* Ambient bokeh */
const bk = $('#bokeh'), cols = ['#ff5f9e', '#ff9a8b', '#ffd98a', '#8b7bff'];
for (let i = 0; i < 18; i++) {
  const o = document.createElement('div');
  o.className = 'orb';
  const s = 30 + Math.random() * 110;
  Object.assign(o.style, {
    width: s + 'px',
    height: s + 'px',
    left: Math.random() * 100 + '%',
    top: Math.random() * 100 + '%',
    background: `radial-gradient(circle, ${cols[i % 4]}88, transparent 70%)`
  });
  bk.appendChild(o);
  if (hasG && !rm) {
    gsap.to(o, {
      x: 'random(-80,80)',
      y: 'random(-100,100)',
      scale: 'random(.7,1.3)',
      duration: 'random(8,16)',
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });
  }
}

/* Hero typewriter */
const text = 'Happy 12th Birthday!', tw = $('#tw');
if (rm) {
  tw.textContent = text;
} else {
  let i = 0;
  (function t() {
    tw.textContent = text.slice(0, ++i);
    if (i < text.length) setTimeout(t, 85);
  })();
}

/* 4-Card Dynamic Number Counting */
const born = new Date(2014, 9, 1);
const totalDays = Math.max(4383, Math.floor((Date.now() - born) / 864e5));
const sy = $('#statYears'), sm = $('#statMonths'), sd = $('#statDays');

if (hasG && !rm) {
  const stats = { y: 0, m: 0, d: 0 };
  gsap.to(stats, {
    y: 12,
    m: 144,
    d: totalDays,
    duration: 2.2,
    delay: 0.6,
    ease: 'power2.out',
    onUpdate: () => {
      sy.textContent = Math.round(stats.y);
      sm.textContent = Math.round(stats.m);
      sd.textContent = Math.round(stats.d).toLocaleString();
    }
  });
  gsap.from('.stat-card', {
    opacity: 0,
    y: 25,
    stagger: 0.12,
    duration: 0.8,
    delay: 0.5,
    ease: 'back.out(1.4)'
  });
} else {
  sy.textContent = '12';
  sm.textContent = '144';
  sd.textContent = totalDays.toLocaleString();
}

/* Birthday Cake */
const cg = $('#candles'), NS = 'http://www.w3.org/2000/svg', cc = ['#ff5f9e', '#fff', '#a78bfa', '#ff9a8b', '#fff', '#ffd98a'];
for (let i = 0; i < 6; i++) {
  const x = 100 + i * 20.5;
  const g = document.createElementNS(NS, 'g');
  g.innerHTML = `<rect x="${x - 3}" y="80" width="6" height="24" rx="2" fill="${cc[i]}"/><ellipse class="flame" cx="${x}" cy="70" rx="5" ry="10" fill="url(#fl)"/>`;
  cg.appendChild(g);
}

const smk = $('#smoke');
for (let i = 0; i < 6; i++) {
  const x = 100 + i * 20.5;
  smk.innerHTML += `<path d="M${x} 66q-6-10 0-18t0-16" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round" opacity=".7"/>`;
}

let blown = false, audio;
function beep(f, d, type) {
  try {
    audio = audio || new (window.AudioContext || window.webkitAudioContext)();
    const o = audio.createOscillator(), g = audio.createGain();
    o.type = type || 'triangle';
    o.frequency.setValueAtTime(f, audio.currentTime);
    o.frequency.exponentialRampToValueAtTime(f / 3, audio.currentTime + d);
    g.gain.setValueAtTime(0.15, audio.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + d);
    o.connect(g).connect(audio.destination);
    o.start();
    o.stop(audio.currentTime + d);
  } catch(e) {}
}

function cannon() {
  const end = Date.now() + 1600;
  boom({ particleCount: 140, spread: 100, origin: { x: 0.5, y: 0.6 }, startVelocity: 55 });
  setTimeout(() => {
    boom({ particleCount: 90, angle: 60, spread: 70, origin: { x: 0, y: 0.8 }, startVelocity: 60 });
    boom({ particleCount: 90, angle: 120, spread: 70, origin: { x: 1, y: 0.8 }, startVelocity: 60 });
  }, 350);
  setTimeout(() => {
    boom({ particleCount: 200, spread: 360, startVelocity: 35, gravity: 0.6, ticks: 300, origin: { x: 0.5, y: 0.3 }, scalar: 1.2 });
  }, 800);
  (function rain() {
    boom({ particleCount: 4, angle: 90, spread: 160, origin: { x: Math.random(), y: -0.1 }, gravity: 0.9, startVelocity: 20 });
    if (Date.now() < end + 800) requestAnimationFrame(rain);
  })();
}

function blow() {
  if (blown) return;
  blown = true;
  $('#hint').textContent = '🎉 Wish granted! Your letter is unlocked below 💌';
  $('#hint').classList.remove('pulse-hint');
  beep(320, 0.4, 'sawtooth');
  const L = $('#letter');
  L.style.display = 'block';
  if (hasG && !rm) {
    gsap.to('.flame', { scaleY: 0, scaleX: 0.3, opacity: 0, duration: 0.35, stagger: 0.06, ease: 'power2.in' });
    gsap.to('#smoke', { opacity: 1, duration: 0.3, delay: 0.3 });
    gsap.fromTo('#smoke path', { y: 8 }, { y: -24, opacity: 0, duration: 1.6, delay: 0.35, stagger: 0.05, ease: 'power1.out' });
    gsap.fromTo('.cakebtn', { rotate: -3 }, { rotate: 0, duration: 0.8, ease: 'elastic.out(1, .3)' });
    gsap.from(L, { y: 60, opacity: 0, scale: 0.92, duration: 1, delay: 0.9, ease: 'back.out(1.4)' });
    gsap.from('#letter p, #letter h3', { opacity: 0, y: 16, stagger: 0.25, duration: 0.6, delay: 1.3 });
  }
  cannon();
  setTimeout(() => L.scrollIntoView({ behavior: rm ? 'auto' : 'smooth', block: 'center' }), 1200);
}
$('#cakeBtn').addEventListener('click', blow);

/* Polaroid Gallery (Configured for .jpeg files) */
const caps = [
  'Sweetest Smile ✨',            // pic1: Solo portrait with curtains
  'Traditional & Pretty 🌸',       // pic2: Pink suit at temple
  'All Dressed Up 💖',            // pic3: Orange-pink floral dress
  'Siblings 👩‍❤️‍💋‍👨',     // pic4: Sibling & cousin selfie moment
  'Cutest Pose 🌼',               // pic5: Ethnic top portrait
  'Mall Masti with Gang 🛍️',      // pic6: Fun outing at the mall
  'Birthday Girl Vibes 🎂',       // pic7: Pink cardigan smile
  'Street Walk & Fun ☀️',         // pic8: Outdoor market walk with everyone
  'Cute Smile 🚗',        // pic9: Car selfie
  'Best Brother-Sister Duo 👫',   // pic10: Selfie with bhai
  'Always Cheerful 🌟',           // pic11: Extra memory
  "I'm always with u❤️"             // pic12: Extra memory
];

const grid = $('#grid');
function ph(n) {
  const c = ['#ff5f9e', '#ff9a8b', '#ffd98a', '#8b7bff'];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"><defs><linearGradient id="a" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c[n % 4]}"/><stop offset="1" stop-color="${c[(n + 1) % 4]}"/></linearGradient></defs><rect width="400" height="400" fill="url(#a)"/><text x="200" y="215" font-size="110" text-anchor="middle">${['🎈','🌸','🎁','⭐','🦋','🍰','🌈','🎀','🎶','🌟','💖','🎂'][n % 12]}</text><text x="200" y="330" font-size="26" text-anchor="middle" fill="#fff" font-family="sans-serif">pic${n + 1}.jpeg</text></svg>`;
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

for (let i = 0; i < 12; i++) {
  const b = document.createElement('button');
  b.className = 'pol';
  b.type = 'button';
  const rot = (i % 2 ? 1 : -1) * (1 + Math.random() * 2);
  b.dataset.rot = rot;
  b.style.transform = `rotate(${rot}deg)`;
  
  const im = new Image();
  im.src = `pic${i + 1}.jpeg`;
  im.alt = caps[i];
  im.loading = 'lazy';
  im.onerror = () => { im.onerror = null; im.src = ph(i); };

  const sp = document.createElement('span');
  sp.textContent = caps[i];
  b.append(im, sp);
  grid.appendChild(b);
  b.addEventListener('click', () => openLb(im.src, caps[i]));

  if (hasG && !rm && matchMedia('(hover:hover)').matches) {
    b.addEventListener('mouseenter', () => gsap.to(b, {
      y: -12, rotate: 0, scale: 1.08, zIndex: 5,
      boxShadow: '0 0 40px rgba(255,95,158,.7),0 24px 50px rgba(0,0,0,.5)',
      duration: 0.35, ease: 'power3.out'
    }));
    b.addEventListener('mouseleave', () => gsap.to(b, {
      y: 0, rotate: rot, scale: 1, zIndex: 1,
      boxShadow: '0 12px 30px rgba(0,0,0,.4)',
      duration: 0.4, ease: 'power3.out'
    }));
  }
}

if (hasG && !rm && typeof ScrollTrigger !== 'undefined') {
  gsap.set('.pol', { opacity: 0, y: 50 });
  ScrollTrigger.batch('.pol', {
    start: 'top 92%',
    once: true,
    onEnter: els => gsap.to(els, { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'back.out(1.3)' })
  });
}

/* Lightbox Modal */
const lb = $('#lb');
function openLb(src, cap) {
  $('#lbImg').src = src;
  $('#lbImg').alt = cap;
  $('#lbCap').textContent = cap;
  lb.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  if (hasG && !rm) {
    gsap.fromTo(lb, { opacity: 0 }, { opacity: 1, duration: 0.3 });
    gsap.fromTo(lb.querySelector('figure'), { scale: 0.6, rotate: -6, opacity: 0 }, { scale: 1, rotate: 0, opacity: 1, duration: 0.55, ease: 'back.out(1.5)' });
  }
  $('#lbClose').focus();
}

function closeLb() {
  const done = () => { lb.style.display = 'none'; document.body.style.overflow = ''; };
  hasG && !rm ? gsap.to(lb, { opacity: 0, duration: 0.25, onComplete: done }) : done();
}
$('#lbClose').addEventListener('click', closeLb);
lb.addEventListener('click', e => { if (e.target === lb) closeLb(); });
addEventListener('keydown', e => { if (e.key === 'Escape' && lb.style.display === 'flex') closeLb(); });

/* Floating Balloons */
const bc = ['#ff5f9e', '#ff9a8b', '#ffd98a', '#a78bfa', '#5eead4'];
let poppedCount = 0;

function balloon() {
  if (rm || !hasG || document.hidden) return;
  const b = document.createElement('button');
  b.className = 'balloon';
  b.setAttribute('aria-label', 'Pop balloon');
  b.setAttribute('title', 'Tap me to pop!');
  b.style.background = bc[Math.floor(Math.random() * bc.length)];
  b.style.left = (Math.random() < 0.5 ? Math.random() * 18 : 82 + Math.random() * 12) + '%';
  document.body.appendChild(b);

  const tl = gsap.to(b, {
    y: -(innerHeight + 260),
    x: 'random(-30,30)',
    duration: 'random(11,18)',
    ease: 'none',
    onComplete: () => b.remove()
  });

  b.addEventListener('click', () => {
    const r = b.getBoundingClientRect();
    tl.kill();
    beep(700, 0.12, 'square');
    boom({
      particleCount: 30, spread: 70, startVelocity: 22, scalar: 0.7,
      origin: { x: (r.left + r.width / 2) / innerWidth, y: (r.top + r.height / 2) / innerHeight }
    });
    gsap.to(b, { scale: 1.6, opacity: 0, duration: 0.18, onComplete: () => b.remove() });

    poppedCount++;
    if (poppedCount === 1) {
      const tip = $('#balloonTip');
      if (tip) gsap.to(tip, { opacity: 0, y: 15, duration: 0.8, onComplete: () => tip.remove() });
    }
  });
}
setTimeout(() => { for (let i = 0; i < 3; i++) setTimeout(balloon, i * 900); }, 1800);
setInterval(balloon, 3200);

/* Party Popper Floating Action Button */
let side = 0;
$('#fab').addEventListener('click', e => {
  const r = e.currentTarget.getBoundingClientRect();
  const o = { x: (r.left + r.width / 2) / innerWidth, y: (r.top + r.height / 2) / innerHeight };
  beep(500, 0.2, 'square');
  boom({ particleCount: 90, angle: side % 2 ? 115 : 75, spread: 65, startVelocity: 55, origin: o });
  boom({ particleCount: 50, spread: 120, startVelocity: 30, origin: o, shapes: ['star'], scalar: 1.1 });
  side++;
  if (hasG && !rm) gsap.fromTo(e.currentTarget, { rotate: -25, scale: 1.2 }, { rotate: 0, scale: 1, duration: 0.6, ease: 'elastic.out(1, .4)' });
});
})();