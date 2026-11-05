// Node harness: loads the inline script of cucumber-panic.html with a stubbed canvas and DOM.
// Usage: node cucumber-panic.test.mjs <path-to-html>
import fs from 'node:fs';
import assert from 'node:assert/strict';

const htmlPath = process.argv[2] || 'src/main/resources/cucumber-panic.html';
const html = fs.readFileSync(htmlPath, 'utf8');
const m = /<script>([\s\S]*?)<\/script>/.exec(html);
assert.ok(m, 'page has an inline script');

function memStore() {
  const d = {};
  return { getItem: (k) => (k in d ? d[k] : null), setItem: (k, v) => { d[k] = String(v); } };
}
const throwingStore = { getItem() { throw new Error('blocked'); }, setItem() { throw new Error('blocked'); } };

function makeEnv(w, h, store) {
  const winL = {}, canL = {}, docL = {};
  const ctx = new Proxy({}, { get: (t, p) => (p in t ? t[p] : () => {}), set: (t, p, v) => { t[p] = v; return true; } });
  const canvas = {
    style: {}, width: 800, height: 600,
    getContext: () => ctx,
    addEventListener: (n, f) => { (canL[n] = canL[n] || []).push(f); },
    getBoundingClientRect() {
      const cw = parseInt(this.style.width) || 800, ch = parseInt(this.style.height) || 600;
      return { left: (win.innerWidth - cw) / 2, top: (win.innerHeight - ch) / 2, width: cw, height: ch };
    }
  };
  const win = {
    innerWidth: w, innerHeight: h, rafCb: null, localStorage: store || memStore(),
    addEventListener: (n, f) => { (winL[n] = winL[n] || []).push(f); },
    requestAnimationFrame: (cb) => { win.rafCb = cb; return 1; }
  };
  const document = {
    getElementById: () => canvas, hidden: false,
    addEventListener: (n, f) => { (docL[n] = docL[n] || []).push(f); }
  };
  new Function('window', 'document', m[1])(win, document);
  const fire = (l, n, e) => (l[n] || []).forEach((f) => f(Object.assign({ preventDefault() {} }, e)));
  return {
    win, canvas, g: win.__game,
    key: (n, e) => fire(winL, n, e),
    ptr: (n, e) => fire(canL, n, e),
    doc: (n, e) => fire(docL, n, e), document,
    resizeTo(nw, nh) { win.innerWidth = nw; win.innerHeight = nh; fire(winL, 'resize', {}); }
  };
}

let failed = 0;
function test(name, fn) {
  try { fn(); console.log('ok   ' + name); } catch (e) { failed++; console.log('FAIL ' + name + ': ' + e.message); }
}
const hold = (env, secs) => { for (let i = 0; i < secs * 60; i++) env.g.step(1 / 60); };

test('starts in the start phase and Space starts play', () => {
  const env = makeEnv(1280, 720);
  assert.equal(env.g.state.phase, 'start');
  env.key('keydown', { key: ' ' });
  assert.equal(env.g.state.phase, 'play');
});

test('a2_holding Right raises x and stops at the right edge', () => {
  const env = makeEnv(1280, 720);
  env.g.start();
  const x0 = env.g.state.cat.x;
  env.key('keydown', { key: 'ArrowRight' });
  env.g.step(0.1);
  assert.ok(env.g.state.cat.x > x0);
  hold(env, 1);
  assert.equal(env.g.state.cat.x, env.g.W - env.g.state.cat.w / 2);
  env.key('keyup', { key: 'ArrowRight' });
});

test('a2_holding Left stops at the left edge (A key)', () => {
  const env = makeEnv(1280, 720);
  env.g.start();
  env.key('keydown', { key: 'a' });
  hold(env, 2);
  assert.equal(env.g.state.cat.x, env.g.state.cat.w / 2);
});

test('a2_tap on the left half moves the cat left, right half moves right', () => {
  const env = makeEnv(1280, 720);
  env.g.start();
  const x0 = env.g.state.cat.x;
  env.ptr('pointerdown', { clientX: 400, clientY: 360 });
  env.g.step(0.1);
  assert.ok(env.g.state.cat.x < x0);
  env.ptr('pointerup', {});
  env.ptr('pointerdown', { clientX: 900, clientY: 360 });
  const x1 = env.g.state.cat.x;
  env.g.step(0.1);
  assert.ok(env.g.state.cat.x > x1);
});

test('a10_resize keeps the whole field visible at its aspect ratio', () => {
  const env = makeEnv(1280, 720);
  const check = (w, h) => {
    const v = env.g.view;
    assert.ok(v.cssW <= w && v.cssH <= h, 'fits ' + w + 'x' + h);
    assert.ok(Math.abs(v.cssW / v.cssH - 800 / 600) < 0.01, 'aspect ratio');
  };
  check(1280, 720);
  env.resizeTo(400, 800);
  check(400, 800);
  assert.equal(env.g.view.cssW, 400);
  assert.equal(env.g.view.cssH, 300);
});

test('pointer coordinates map back to logical ones', () => {
  const env = makeEnv(400, 800);
  const p = env.g.toLogical(200, 400); // centre of the window
  assert.ok(Math.abs(p.x - 400) < 1 && Math.abs(p.y - 300) < 1);
});

test('animation loop clamps the delta', () => {
  const env = makeEnv(1280, 720);
  env.g.start();
  env.key('keydown', { key: 'ArrowRight' });
  const x0 = env.g.state.cat.x;
  env.win.rafCb(0);
  env.win.rafCb(5000); // a 5 s stall counts as at most 50 ms
  assert.ok(env.g.state.cat.x - x0 <= 400 * 0.05 + 1e-6);
});

const onCat = (s) => ({ x: s.cat.x, y: s.cat.y - s.cat.h / 2 });
// a stable setup: no random spawns land on the cat (spawn x pinned far from it)
const quiet = (env) => { env.g.start(); env.g.setRandom(() => 0); };

test('a3_difficulty at scores 0, 300 and 1000', () => {
  const env = makeEnv(1280, 720);
  const d = env.g.difficulty;
  assert.deepEqual([d(0).spawnRate, d(300).spawnRate, d(1000).spawnRate], [1, 4, 5]);
  assert.deepEqual([d(0).fallSpeed, d(300).fallSpeed, d(1000).fallSpeed], [200, 500, 500]);
});

test('a4_cucumber on the cat costs one life and disappears', () => {
  const env = makeEnv(1280, 720);
  quiet(env);
  const s = env.g.state;
  s.cucumbers.push(onCat(s));
  env.g.step(0.001);
  assert.equal(s.lives, 2);
  assert.equal(s.cucumbers.filter((c) => Math.abs(c.x - s.cat.x) < 5 && c.y > 400).length, 0);
});

test('a5_fish on the cat adds exactly 10 and disappears', () => {
  const env = makeEnv(1280, 720);
  quiet(env);
  const s = env.g.state;
  s.fish.push(onCat(s));
  env.g.step(0.001);
  assert.equal(s.score, 10);
  assert.equal(s.fish.length, 0);
});

test('a6_game over at 0 lives, then Space restarts with 3 lives and score 0', () => {
  const env = makeEnv(1280, 720);
  quiet(env);
  const s = env.g.state;
  s.score = 50; s.lives = 1;
  s.cucumbers.push(onCat(s));
  env.g.step(0.001);
  assert.equal(s.lives, 0);
  assert.equal(s.phase, 'over');
  assert.equal(s.best, 50);
  env.g.draw();
  const before = s.cucumbers.length;
  env.g.step(1);
  assert.equal(s.cucumbers.length, before, 'play has stopped');
  env.key('keydown', { key: ' ' });
  assert.equal(s.phase, 'play');
  assert.equal(s.lives, 3);
  assert.equal(s.score, 0);
});

test('a6_tap restarts after game over', () => {
  const env = makeEnv(1280, 720);
  quiet(env);
  env.g.state.phase = 'over';
  env.ptr('pointerdown', { clientX: 640, clientY: 360 });
  assert.equal(env.g.state.phase, 'play');
  assert.equal(env.g.state.lives, 3);
});

test('a14_exactly 3 fish spawn in 9 s and a fish at the bottom vanishes silently', () => {
  const env = makeEnv(1280, 720);
  env.g.start();
  const s = env.g.state;
  env.g.setRandom(() => 0);   // spawn at the far left, away from the cat
  s.cat.x = 700;
  for (let i = 0; i < 9 * 60; i++) { s.lives = 1000; env.g.step(1 / 60); }
  assert.equal(s.fishSpawned, 3);
  s.fish.length = 0; s.cucumbers.length = 0;
  s.fish.push({ x: 20, y: 590 });
  const score = s.score, lives = s.lives;
  env.g.step(0.2);
  assert.equal(s.fish.length, 0);
  assert.equal(s.score, score);
  assert.equal(s.lives, lives);
});

test('a15_two cucumbers within 1 s cost one life; one after 1 s costs another', () => {
  const env = makeEnv(1280, 720);
  quiet(env);
  const s = env.g.state;
  s.cucumbers.push(onCat(s), onCat(s));
  env.g.step(0.001);
  assert.equal(s.lives, 2);
  s.cucumbers.push(onCat(s));
  env.g.step(0.5);
  assert.equal(s.lives, 2);
  env.g.step(0.6);
  s.cucumbers.push(onCat(s));
  env.g.step(0.001);
  assert.equal(s.lives, 1);
});

// ---- Task 3 ----
const endGameWith = (env, score) => {
  env.g.start();
  const s = env.g.state;
  s.score = score; s.lives = 1;
  s.cucumbers.push(onCat(s));
  env.g.step(0.001);
  assert.equal(s.phase, 'over');
};

test('a7_best score is stored when beaten, survives reload, and is kept when not beaten', () => {
  const store = memStore();
  store.setItem('cucumberPanicBest', '100');
  let env = makeEnv(1280, 720, store);
  assert.equal(env.g.state.best, 100);
  env.g.setRandom(() => 0);
  endGameWith(env, 120);
  assert.equal(env.g.state.best, 120);
  env = makeEnv(1280, 720, store); // reload
  assert.equal(env.g.state.best, 120);
  env.g.setRandom(() => 0);
  endGameWith(env, 80);
  assert.equal(env.g.state.best, 120);
  env = makeEnv(1280, 720, store);
  assert.equal(env.g.state.best, 120);
});

test('a9_blocked storage: game still plays and best updates for the session', () => {
  const env = makeEnv(1280, 720, throwingStore);
  env.key('keydown', { key: ' ' });
  assert.equal(env.g.state.phase, 'play');
  env.g.setRandom(() => 0);
  endGameWith(env, 70);
  assert.equal(env.g.state.best, 70);
  env.key('keydown', { key: ' ' });
  assert.equal(env.g.state.phase, 'play');
  endGameWith(env, 30);
  assert.equal(env.g.state.best, 70);
});

for (const [name, fire] of [
  ['P', (env) => env.key('keydown', { key: 'p' })],
  ['Escape', (env) => env.key('keydown', { key: 'Escape' })]
]) {
  test('a8_' + name + ' pauses and resumes from the same positions', () => {
    const env = makeEnv(1280, 720);
    env.g.start();
    env.g.setRandom(() => 0);
    const s = env.g.state;
    s.cucumbers.push({ x: 20, y: 100 });
    fire(env);
    assert.equal(s.phase, 'paused');
    const y = s.cucumbers[0].y, acc = s.spawnAcc, ft = s.fishTimer;
    env.win.rafCb(0); env.win.rafCb(40);
    env.g.step(1);
    assert.equal(s.cucumbers[0].y, y);
    assert.equal(s.spawnAcc, acc);
    assert.equal(s.fishTimer, ft);
    fire(env);
    assert.equal(s.phase, 'play');
    env.g.step(0.1);
    assert.ok(s.cucumbers[0].y > y);
  });
}

test('a8_window blur and tab hidden pause the game', () => {
  const env = makeEnv(1280, 720);
  env.g.start();
  env.key('blur', {});
  assert.equal(env.g.state.phase, 'paused');
  env.key('keydown', { key: 'p' });
  assert.equal(env.g.state.phase, 'play');
  env.document.hidden = true;
  env.doc('visibilitychange', {});
  assert.equal(env.g.state.phase, 'paused');
});

test('a11_20 life losses each show a 2 s bubble with a line from the set and a shriek', () => {
  const env = makeEnv(1280, 720);
  env.g.start();
  env.g.setRandom(() => 0);
  const s = env.g.state;
  assert.ok(env.g.LINES.length >= 6);
  const seen = new Set();
  for (let i = 0; i < 20; i++) {
    env.g.setRandom(() => (i % env.g.LINES.length) / env.g.LINES.length + 0.001);
    s.lives = 3; s.immune = 0;
    const n = env.g.soundLog.length;
    s.cucumbers.length = 0;
    s.cucumbers.push(onCat(s));
    env.g.step(0.001);
    assert.ok(env.g.LINES.includes(s.bubbleText));
    seen.add(s.bubbleText);
    assert.ok(s.bubbleTimer > 1.99 && s.bubbleTimer <= 2);
    assert.equal(env.g.soundLog.slice(n).filter((x) => x === 'shriek').length, 1);
    env.g.step(1.5);
    assert.ok(s.bubbleTimer > 0.4);
    env.g.step(0.6);
    assert.equal(s.bubbleTimer, 0);
  }
  assert.ok(seen.size >= 5);
});

test('a13_M and the on-screen button toggle sound for the next hit', () => {
  const env = makeEnv(1280, 720);
  env.g.start();
  env.g.setRandom(() => 0);
  const s = env.g.state;
  const hit = () => {
    s.lives = 3; s.immune = 0; s.cucumbers.length = 0;
    const n = env.g.soundLog.length;
    s.cucumbers.push(onCat(s));
    env.g.step(0.001);
    return env.g.soundLog.slice(n).filter((x) => x === 'shriek').length;
  };
  assert.equal(hit(), 1);
  env.key('keydown', { key: 'm' });
  assert.equal(hit(), 0);
  env.key('keydown', { key: 'm' });
  assert.equal(hit(), 1);
  // on-screen button: logical (778, 34) -> client coordinates at 1280x720 (scale 1.2)
  const click = () => env.ptr('pointerdown', { clientX: (1280 - 960) / 2 + 778 * 1.2, clientY: 34 * 1.2 });
  click();
  assert.equal(s.muted, true);
  assert.equal(hit(), 0);
  click();
  assert.equal(hit(), 1);
  assert.equal(s.phase, 'play');
});

if (failed) { console.log(failed + ' failed'); process.exit(1); }
console.log('all passed');
