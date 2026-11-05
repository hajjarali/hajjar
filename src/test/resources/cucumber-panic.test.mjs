// Node harness: loads the inline script of cucumber-panic.html with a stubbed canvas and DOM.
// Usage: node cucumber-panic.test.mjs <path-to-html>
import fs from 'node:fs';
import assert from 'node:assert/strict';

const htmlPath = process.argv[2] || 'src/main/resources/cucumber-panic.html';
const html = fs.readFileSync(htmlPath, 'utf8');
const m = /<script>([\s\S]*?)<\/script>/.exec(html);
assert.ok(m, 'page has an inline script');

function makeEnv(w, h) {
  const winL = {}, canL = {};
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
    innerWidth: w, innerHeight: h, rafCb: null,
    addEventListener: (n, f) => { (winL[n] = winL[n] || []).push(f); },
    requestAnimationFrame: (cb) => { win.rafCb = cb; return 1; }
  };
  const document = { getElementById: () => canvas };
  new Function('window', 'document', m[1])(win, document);
  const fire = (l, n, e) => (l[n] || []).forEach((f) => f(Object.assign({ preventDefault() {} }, e)));
  return {
    win, canvas, g: win.__game,
    key: (n, e) => fire(winL, n, e),
    ptr: (n, e) => fire(canL, n, e),
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

if (failed) { console.log(failed + ' failed'); process.exit(1); }
console.log('all passed');
