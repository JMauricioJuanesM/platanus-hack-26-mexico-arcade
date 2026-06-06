const GW = 800, GH = 600, STORAGE_KEY = 'deploy-wars-scores-v1', MAX_SCORES = 5, ROUND_DURATION = 60;
const C = {bg:'#080c12', grid:'#161b22', p1:'#00ff88', p2:'#ff2d6b', acc:'#00d4ff', amb:'#ffaa00', w:'#e8f0ff', gy:'#2a3040', dGy:'#121824', bug:'#ff4422', pkg:'#ffdd00'};
const N = (c) => parseInt(c.slice(1), 16);
const T = (s, x, y, t, sz, c, o=0.5, d=10, st={}) => s.add.text(x, y, t, {fontFamily:'monospace', fontSize:sz, color:c, ...st}).setOrigin(o).setDepth(d);
const R = (s, x, y, w, h, c, a=1, d=2) => s.add.rectangle(x, y, w, h, c, a).setDepth(d);
const neon = (c, sz='24px') => ({fontSize:sz, fontStyle:'bold', stroke:'#000', strokeThickness:3, shadow:{color:c, fill:true, blur:8}});
const CDMX_BUGS = ['LUZ','SISMO','TRÁFICO','METRO','VPN','NULL','MERGE','STACK','CORS','TIMEOUT','SEGFAULT','GIT BLAME','CFE','AWS DOWN','OOM KILLED','DOCKER PANIC','SPAGHETTI','TORTILLA OVERFLOW','JUNIOR BUG'];
const CDMX_FEATURES = ['prod','metro','api','ui','xochi','db','tepito','sdk','reforma','cdmx','backend','staging','tlalpan','coyoacan','condesa','iztacalco','roma','polanco','tacos','miches','pesero','oxxo','gansito','esquites','tortas','chapultepec','metrobus'];
const CDMX_MSGS = ['CDMX 🌮','SHIP IT!','PROD!','CONDESA','ONLINE 🚀','¡ÉCHALE!','A PROD BANDA','¡QUÉ CHINGON!','DESPLEGADO 🎉','IT WORKS 🙌','¡A WEBO! 🌮','SIN MIEDO 💪','JALA FINO 😎','PROD READY ⚡','MERGED! 🚀','NO EXPLOTÓ 🎉','¡OTRO TACO! 🌮','¡AL CIEN! 🔥','DEPLOY DE VIERNES ⚠️','TODO OK 👍'];
const COMMIT_PFXS = ['fix','feat','chore','refactor','perf','test','build','ci','hotfix','revert','docs','style','hack','cleanup','security'];
const mkCommit = () => `${COMMIT_PFXS[Phaser.Math.Between(0,COMMIT_PFXS.length-1)]}:\n${CDMX_FEATURES[Phaser.Math.Between(0,CDMX_FEATURES.length-1)]}`;
const AI_WINS = [
  '¡Te ganó la IA otra vez! 🤖 😂',
  '¿Skynet? No, un script de 20 líneas. 🤖',
  'La IA dominando... y tú de espectador. 😭',
  '¿Ya probaste programar sin bugs? 💻',
  'DEV_BOT se la sabe toda. 🤖 🔥',
  'ChatGPT programa mejor que esto. 💀',
  '¡Fue error de capa 8! 🧑‍💻 ❌',
  'La IA deployó en caliente y tú... F. 💀',
  'Reiniciando al programador... 🤖 🔄',
  'Tu código da más miedo que el sismo. 👻',
  'Tu commit fue rechazado por feo. 💅',
  'DEV_BOT deployó 3 veces mientras leías esto. 🚀',
  'Tu código no compila ni con rezos. 📿 💀',
  '¿Seguro que pasaste la entrevista? 🧐 😂',
  'Error 404: Habilidad no encontrada. 🔍 💀',
  'Mucho docker, poco deploy. 🐳 😭',
  'DEV_BOT: 1 | Humano cansado: 0. 🤖 🏆',
  'Ni copilot te salva de esta. ✈️ 💥'
];
const SISMO_TITLES = ['¡SISMO! EVACUAR PROD ⚠️','¡ALERTA SÍSMICA! ¡CORRE A STAGING! 🚨','¡TEMBLOR! SE CAYÓ EL RACK 🏢','¡SISMO! ¡CORRE AL PUNTO DE REUNIÓN! 🟢','¡EL BACKEND SE TAMBALEA! 🫨'];
const BLACKOUT_TITLES = ['¡APAGÓN EN LA CONDESA! 🔌','¡SE CAYÓ FINTUAL! 🕯️','¡CORTE DE LUZ EN PLATANUS! ⚡','¡APAGÓN EN EL BACKEND! 🔌','¡APAGÓN EN LA ROMA! 🕯️','¡CABLEBUS SIN ENERGÍA! 🚠','¡SE CAYÓ AWS US-EAST-1! ☁️','¡CORTE DE CFE! 🔌'];
const LAG_TITLES = ['¡LAG EN EL METRO CDMX! 🐢','¡INTERNET DE CIBER CAFÉ! 🐌','¡INFINITUM LENTO! 🐢','¡DESBORDAMIENTO DE COLA! ⏳','¡LAG EN EL METROBUS! 🚍','¡TRAFICO EN PERIFERICO! 🚗','¡LAG EN PLATANUS! 🐌','¡DNS NO RESPONDE! 🐢'];
const AI_QUIPS = ['DEV_BOT conectado','Compilando...','Stack overflow?','git stash pop','npm install...','Loading node_modules','sudo rm -rf /','No veo fallas en mi lógica','¿Y tu test unitario?','Humano detectado: fácil','deploy_final_v2.sh','¿Quién metió este bug?'];
const L_GRID = 'ABCDEFG HIJKLMN OPQRSTU VWXYZ._ DEL,END'.split(' ').map(r => r.split(r.includes(',')?',':''));
const K = {
  P1_U:['w'],P1_D:['s'],P1_L:['a'],P1_R:['d'],P1_1:['u'],P1_2:['i'],P1_3:['o'],P1_4:['j'],P1_5:['k'],P1_6:['l'],
  P2_U:['ArrowUp'],P2_D:['ArrowDown'],P2_L:['ArrowLeft'],P2_R:['ArrowRight'],P2_1:['r'],P2_2:['t'],P2_3:['y'],P2_4:['f'],P2_5:['g'],P2_6:['h'],
  S1:['Enter'],S2:['2']
};
const K2A = {};
Object.entries(K).forEach(([c, ks]) => ks.forEach(k => K2A[k===' '?'space':k.toLowerCase()] = c));
const config = {
  type: Phaser.AUTO, width: GW, height: GH, parent: 'game-root', backgroundColor: C.bg,
  physics: { default: 'arcade', arcade: { gravity: { y: 0 } } },
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
  scene: { preload, create, update }
};

function preload() {}
function create() {
  const s = this;
  s.st = {
    phase:'loading', mode:'two_player', scores:{p1:0,p2:0}, timer:ROUND_DURATION, combo:{p1:0,p2:0},
    highScores:[], winner:null, menu:{cursor:0, cooldown:0, lastAxis:0}, modeSel:{cursor:0, cooldown:0},
    nameEntry:{letters:[], row:0, col:0, moveCooldown:0, confirmCooldown:0, lastVec:{x:0,y:0}},
    hotfix:{p1:0,p2:0}, revert:{p1:0,p2:0},
    event:null, eventTimer:0, musicStarted:0, glitchTimer:0, level:1,
    overclock:{p1:0,p2:0}, overclockActive:{p1:0,p2:0}, beam:{p1:0,p2:0}, gitPull:{p1:0,p2:0},
    magnetActiveUntil:{p1:0,p2:0}, firewall:{p1:0,p2:0}, lives:{p1:3,p2:3}
  };
  createControls(s); drawBackground(s); createHud(s); createPlayfield(s);
  createTitleScreen(s); createModeScreen(s); createGameOverScreen(s); createEndChoiceScreen(s);
  createSub(s, 'leaderScreen', 'TABLA DE LÍDERES', '');
  createSub(s, 'ctrlScreen', 'CONTROLES', 'B1: Hotfix | B2: Revert | B3: Overclock\nB4: Laser | B5: Git Pull | B6: Firewall\n\n1. RECOGE {} | 2. DEPLOY -> Servidor\n3. EVITA BUGS | 4. RECOVERY (\u2665)', '11px');
  createPauseScreen(s);
  loadHighScores().then(hs => { s.st.highScores = hs; refreshTitleScores(s); }).catch(() => {});
  showTitle(s);
}
function update(time, delta) {
  const s = this, ph = s.st.phase; updateGlitch(s, time);
  if (ph === 'start') handleTitleMenu(s, time);
  else if (ph === 'modesel') handleModeMenu(s, time);
  else if (ph === 'playing') updateGame(s, time, delta);
  else if (ph === 'paused') { if (consumePressed(s, ['S1','S2'])) resumeGame(s); }
  else if (ph === 'gameover') handleNameEntry(s, time);
  else if (ph === 'endChoice') handleEndChoice(s, time);
  else if (consumePressed(s, ['S1','S2','P1_1','P2_1'])) {
    if (ph === 'saved') returnToTitle(s);
    else if (ph === 'leaderboard' || ph === 'controls') { (ph==='leaderboard'?s.leaderScreen:s.ctrlScreen).setVisible(0); showTitle(s); }
  }
}
function createControls(s) {
  s.ctrl = { held: {}, pressed: {} };
  window.addEventListener('keydown', e => {
    const code = K2A[e.key === ' ' ? 'space' : e.key.toLowerCase()];
    if (code) { if (!s.ctrl.held[code]) s.ctrl.pressed[code] = 1; s.ctrl.held[code] = 1; }
  });
  window.addEventListener('keyup', e => {
    const code = K2A[e.key === ' ' ? 'space' : e.key.toLowerCase()];
    if (code) s.ctrl.held[code] = 0;
  });
}
const held = (s, c) => s.ctrl.held[c] === 1;
function consumePressed(s, codes) {
  for (const c of codes) if (s.ctrl.pressed[c]) { s.ctrl.pressed[c] = 0; return 1; }
  return 0;
}
const axisH = (s) => (held(s,'P1_L')||held(s,'P2_L')?-1:0) + (held(s,'P1_R')||held(s,'P2_R')?1:0);
const axisV = (s) => (held(s,'P1_U')||held(s,'P2_U')?-1:0) + (held(s,'P1_D')||held(s,'P2_D')?1:0);
function drawBackground(s) {
  R(s, 400, 300, 800, 600, N(C.bg), 1, 0);
  const g = s.add.graphics().lineStyle(1, N(C.grid), 0.15).setDepth(0);
  for (let x=0; x<=800; x+=40) { g.moveTo(x,0); g.lineTo(x,600); }
  for (let y=0; y<=600; y+=40) { g.moveTo(0,y); g.lineTo(800,y); }
  g.strokePath().lineStyle(1, N(C.acc), 0.25);
  for (let x=40; x<800; x+=80) for (let y=40; y<600; y+=80) { g.moveTo(x-4,y); g.lineTo(x+4,y); g.moveTo(x,y-4); g.lineTo(x,y+4); }
  g.strokePath();
  const bgItems = [
    { t: '{ }', x: 120, y: 150, r: -15, s: 1.2 },
    { t: 'git', x: 680, y: 480, r: 25, s: 1.0 },
    { t: 'PROD', x: 650, y: 140, r: 10, s: 0.8 },
    { t: 'deploy', x: 180, y: 450, r: -20, s: 1.1 }
  ];
  bgItems.forEach(item => {
    const txt = T(s, item.x, item.y, item.t, '130px', C.acc, 0.5, 0, { fontStyle: 'bold', shadow: { color: C.acc, fill: true, blur: 20 } });
    txt.setAlpha(0.035).setRotation(Phaser.Math.DegToRad(item.r)).setScale(item.s);
    s.tweens.add({ targets: txt, y: item.y + 15, rotation: txt.rotation + 0.05, duration: 6000 + Math.random() * 2000, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
  });
  const sg = s.add.graphics().setDepth(50).setAlpha(0.04).fillStyle(0,1);
  for (let y=0; y<600; y+=3) sg.fillRect(0,y,800,1);
}
function createHud(s) {
  s.hud = {}; const n = (c) => neon(c);
  s.hud.p1Score = T(s, 30, 12, '', '24px', C.p1, 0, 10, n(C.p1)).setVisible(0);
  s.hud.p2Score = T(s, 770, 12, '', '24px', C.p2, 1, 10, n(C.p2)).setOrigin(1,0).setVisible(0);
  s.hud.timer = T(s, 400, 12, '', '36px', C.amb, 0.5, 10, {fontStyle:'bold', stroke:'#000', strokeThickness:4, shadow:{color:C.amb, fill:1, blur:10}}).setOrigin(0.5,0).setVisible(0);
  s.hud.p1Combo = T(s, 30, 44, '', '13px', C.acc, 0).setVisible(0);
  s.hud.p2Combo = T(s, 770, 44, '', '13px', C.acc, 1).setOrigin(1,0).setVisible(0);
  s.hud.p1Hotfix = T(s, 30, 62, 'HOTFIX B1 ▣', '11px', C.acc, 0).setVisible(0);
  s.hud.p2Hotfix = T(s, 770, 62, 'HOTFIX B1 ▣', '11px', C.acc, 1).setOrigin(1,0).setVisible(0);
  s.hud.p1Revert = T(s, 30, 76, 'REVERT B2 ⚡', '11px', C.amb, 0).setVisible(0);
  s.hud.p2Revert = T(s, 770, 76, 'REVERT B2 ⚡', '11px', C.amb, 1).setOrigin(1,0).setVisible(0);
  s.hud.eventBanner = T(s, 400, 280, '', '32px', C.p2, 0.5, 45, {fontStyle:'bold', stroke:'#000', strokeThickness:5, shadow:{color:C.p2, fill:1, blur:15}}).setVisible(0);
  s.hud.p1label = T(s, 60, 150, '◀ P1 (WASD + U/I)', '11px', C.p1+'44', 0).setVisible(0);
  s.hud.p2label = T(s, 60, 450, '◀ P2 (ARROWS + R/T)', '11px', C.p2+'44', 0).setVisible(0);
  s.hud.divider = s.add.graphics().setDepth(10).setVisible(0);
}
function showHud(s, show) {
  const v = show, is2P = s.st.mode === 'two_player';
  ['p1Score','p2Score','timer','p1Combo','p1Hotfix','p1Revert','p1label'].forEach(k => s.hud[k].setVisible(v));
  s.hud.p2Score.setVisible(v);
  if (!is2P) ['p2Combo','p2Hotfix','p2Revert','p2label'].forEach(k => s.hud[k].setVisible(0));
  else ['p2Combo','p2Hotfix','p2Revert','p2label'].forEach(k => s.hud[k].setVisible(v));
  s.hud.divider.setVisible(v && is2P);
}
function refreshHud(s) {
  const p1H = '♥'.repeat(s.st.lives.p1), p2H = '♥'.repeat(s.st.lives.p2);
  s.hud.p1Score.setText(`DEPLOYS: ${String(s.st.scores.p1).padStart(2,0)} [${p1H}]`);
  if (s.st.mode === 'one_player') {
    s.hud.p2Score.setText(`DEV_BOT: ${String(s.st.scores.p2).padStart(2,0)} [${p2H}]`);
    s.hud.timer.setText(`LVL ${s.st.level}`).setColor('#ff0');
  } else {
    s.hud.p2Score.setText(`DEPLOYS: ${String(s.st.scores.p2).padStart(2,0)} [${p2H}]`);
    const t = Math.ceil(s.st.timer); s.hud.timer.setText(t).setColor(t<=10 ? C.p2 : C.amb);
  }
  s.hud.p1Combo.setText(s.st.combo.p1>1 ? `COMBO x${s.st.combo.p1}` : '');
  s.hud.p2Combo.setText(s.st.combo.p2>1 ? `COMBO x${s.st.combo.p2}` : '');
  const now = s.time.now;
  s.hud.p1Hotfix.setColor(now < s.st.hotfix.p1 ? C.p2 : C.acc);
  s.hud.p1Revert.setColor(now < s.st.revert.p1 ? C.p2 : C.amb);
  s.hud.p2Hotfix.setColor(now < s.st.hotfix.p2 ? C.p2 : C.acc);
  s.hud.p2Revert.setColor(now < s.st.revert.p2 ? C.p2 : C.amb);
}
function createPlayfield(s) {
  s.pf = { packages:[], bugs:[], hearts:[], firewalls:[] };
  s.pf.p1 = createShip(s, 120, 150, N(C.p1));
  s.pf.p2 = createShip(s, 120, 450, N(C.p2));
  s.pf.srv1 = createServerCabinet(s, 755, 50, N(C.p1));
  s.pf.srv2 = createServerCabinet(s, 755, 350, N(C.p2));
  s.laserGraphics = s.add.graphics().setDepth(9); s.overlayGraphics = s.add.graphics().setDepth(29);
}
function createShip(s, x, y, color) {
  const g = s.add.graphics().setPosition(x,y).setDepth(11);
  g.fillStyle(color, 1).fillTriangle(18,0,-8,12,-8,-12).fillStyle(0xffffff, 0.4).fillTriangle(6,0,-6,6,-6,-6);
  g.lineStyle(1.5, 0xffffff, 0.8).strokeTriangle(18,0,-8,12,-8,-12);
  g.lineStyle(1.5, color, 1).beginPath().moveTo(-8,8).lineTo(-14,14).moveTo(-8,-8).lineTo(-14,-14).strokePath();
  g.hitFlash = g.revertUntil = 0; g.carrying = [];
  g.shield = s.add.graphics().setDepth(12).setVisible(0); return g;
}
function createServerCabinet(s, x, y, color, h=200) {
  const c = s.add.container(x, y).setDepth(8);
  c.add(R(s, 20, h/2, 40, h, 0x0a1018).setStrokeStyle(2, color, 0.8));
  const g = s.add.graphics().fillStyle(0x182436, 0.9);
  for(let i=0; i<10; i++) g.fillRect(5, 12+i*18, 30, 12);
  c.add(g); c.leds = [];
  for(let i=0; i<10; i++) { const l = s.add.circle(30, 18+i*18, 2, 0x00ff88, 1); c.add(l); c.leds.push(l); }
  c.add(T(s, 20, h-10, 'PROD', '9px', '#fff6', 0.5, 0, {fontStyle:'bold'}));
  c.add(c.zone = R(s, -10, h/2, 6, h, color, 0.45));
  s.tweens.add({ targets: c.zone, alpha: 0.1, duration: 600, yoyo: 1, repeat: -1 });
  c.add(c.arrow = T(s, -22, h/2, '➜ DEPLOY TO PROD', '9px', color, 0.5, 0, {fontStyle:'bold'}).setAngle(-90));
  s.tweens.add({ targets: c.arrow, scale: 1.1, duration: 500, yoyo: 1, repeat: -1 });
  return c.setVisible(0);
}
function updateServerLeds(t, srv, col) {
  if (!srv.visible) return;
  const cs = [col, 0x00ff88, 0xffaa00, 0x182436];
  srv.leds.forEach((l, i) => { if (Math.floor(t/150+i)%3===0) l.setFillStyle(cs[i%3], 1); });
}
function showPlayfield(s, show) {
  const m = s.st.mode, is1P = m === 'one_player', is2P = m === 'two_player';
  s.pf.p1.setVisible(show); s.pf.p2.setVisible(show && (is2P||is1P));
  s.pf.srv1.setVisible(show); s.pf.srv2.setVisible(show && (is2P||is1P));
}
function spawnPackage(s, lane) {
  const is1P = s.st.mode==='one_player', ly = is1P?300:(lane===1?150:450);
  const x = Phaser.Math.Between(150, 620), y = Phaser.Math.Between(ly-(is1P?200:110), ly+(is1P?260:110));
  const c = s.add.container(x, y).setDepth(9); const aura = s.add.circle(0,0,26, N(C.pkg), 0.16); c.add(aura);
  const box = R(s,0,0,54,38,0x0a1018).setStrokeStyle(2, N(C.pkg), 1); c.add(box);
  const sym = T(s,0,0, mkCommit(), '8.5px', C.pkg, 0.5, 0, {fontStyle:'bold', align:'center'}); c.add(sym);
  const lbl = T(s,0,-29, '{}', '11px', C.acc, 0.5, 0, {fontStyle:'bold', stroke:'#000', strokeThickness:2}); c.add(lbl);
  s.tweens.add({ targets: aura, scale: 1.45, alpha: 0.02, duration: 750, yoyo: 1, repeat: -1 });
  s.tweens.add({ targets: [box, sym], y: -5, duration: 900, yoyo: 1, repeat: -1 });
  const obj = { container:c, lane, x, y, carried:0 }; s.pf.packages.push(obj); return obj;
}
function spawnBug(s, lane) {
  const is1P = s.st.mode==='one_player', ly = is1P?300:(lane===1?150:450);
  const fl = Math.random()<0.5, x = fl?-20:820, y = Phaser.Math.Between(ly-(is1P?200:120), ly+(is1P?270:120));
  const circ = s.add.graphics().setDepth(9).fillStyle(N(C.bug),0.9).fillCircle(0,0,9).lineStyle(1.5,0xff8866,1).strokeCircle(0,0,9);
  circ.lineStyle(1,N(C.bug),1).beginPath().moveTo(-9,-2).lineTo(-13,-6).moveTo(-9,2).lineTo(-13,6).moveTo(9,-2).lineTo(13,-6).moveTo(9,2).lineTo(13,6).strokePath().setPosition(x,y);
  const lbl = T(s, x, y+14, CDMX_BUGS[Phaser.Math.Between(0,7)], '8px', C.bug, 0.5, 10, {fontStyle:'bold', stroke:'#000', strokeThickness:2});
  const obj = { circ, lbl, lane, x, y, vx: Phaser.Math.Between(100,200)*(fl?1:-1), vy:0, fromHotfix:0 };
  s.pf.bugs.push(obj); return obj;
}
function spawnRubble(s) {
  const x = Phaser.Math.Between(100, 680), y = 60, lane = s.st.mode==='one_player'?1:(Math.random()<0.5?1:2);
  const circ = s.add.graphics().setDepth(9).fillStyle(N(C.p2),0.75).fillCircle(0,0,12).lineStyle(2,0xffffff,1).strokeCircle(0,0,12).setPosition(x,y);
  const lbl = T(s, x, y+15, '⚠️ SISMO ALERT', '8px', C.p2, 0.5, 10, {fontStyle:'bold'});
  const obj = { circ, lbl, lane, x, y, vx:0, vy:240, isRubble:1 };
  s.tweens.add({ targets: circ, scale: 1.3, duration: 250, yoyo: 1, repeat: -1 });
  s.pf.bugs.push(obj); return obj;
}
const destroyPkg = (s, p) => { p.container.destroy(); s.pf.packages.splice(s.pf.packages.indexOf(p), 1); };
const destroyBug = (s, b) => { b.circ.destroy(); b.lbl.destroy(); s.pf.bugs.splice(s.pf.bugs.indexOf(b), 1); };
function clearPlayfieldObjects(s) {
  [...s.pf.packages].forEach(p => destroyPkg(s,p)); [...s.pf.bugs].forEach(b => destroyBug(s,b));
  s.pf.hearts.forEach(h => h.container.destroy()); s.pf.hearts = [];
  s.pf.firewalls.forEach(f => f.rect.destroy()); s.pf.firewalls = [];
  s.laserGraphics.clear();
}
function checkDeployCollision(s, t) {
  const is1P = s.st.mode==='one_player';
  const check = (ship, pid, sx, sy1, sy2) => {
    if (ship.carrying.length && Math.abs(ship.x-sx)<45 && ship.y>=sy1 && ship.y<=sy2) {
      const sc = ship.carrying.length; ship.carrying.forEach(p => destroyPkg(s, p)); ship.carrying = [];
      const pts = sc===3?6:sc===2?3:1; s.st.scores[pid] += pts; s.st.combo[pid] += sc;
      if (pid==='p1' && is1P) {
        const ol = s.st.level; s.st.level = Math.floor(s.st.scores.p1/10)+1;
        if (s.st.level>ol) { showDeployMsg(s, ship.x, ship.y-20, `⚡ LVL ${s.st.level}!`, pid); spawnParticles(s, ship.x, ship.y, 0xffff00, 25); }
      }
      showDeployMsg(s, ship.x, ship.y, `${CDMX_MSGS[Phaser.Math.Between(0,CDMX_MSGS.length-1)]} (+${pts}!)`, pid);
      pulseSrv(s, pid==='p1'?s.pf.srv1:s.pf.srv2, N(pid==='p1'?C.p1:C.p2));
      playSound(s, 'deploy'); spawnParticles(s, ship.x, ship.y, N(pid==='p1'?C.p1:C.p2), 20+sc*5);
    }
  };
  check(s.pf.p1, 'p1', 745, 90, is1P?580:290);
  if (s.st.mode!=='one_player' || is1P) check(s.pf.p2, 'p2', 745, is1P?90:310, 580);
}
function updateCDMXEvents(s, t) {
  if (!s.st.eventTimer) s.st.eventTimer = t + 14000;
  if (t >= s.st.eventTimer && !s.st.event) {
    const evs = ['sismo','blackout','lag'], type = evs[Phaser.Math.Between(0,2)], dur = type==='blackout'?5500:7000;
    s.st.event = { type, until: t+dur, nextRubble:0 }; s.st.eventTimer = t+dur+15000;
    const sismT = SISMO_TITLES[Phaser.Math.Between(0,SISMO_TITLES.length-1)], blkT = BLACKOUT_TITLES[Phaser.Math.Between(0,BLACKOUT_TITLES.length-1)], lagT = LAG_TITLES[Phaser.Math.Between(0,LAG_TITLES.length-1)];
    const titles = { sismo:sismT, blackout:blkT, lag:lagT };
    const cols = { sismo:C.p2, blackout:C.amb, lag:C.acc };
    s.hud.eventBanner.setText(titles[type]).setColor(cols[type]).setVisible(1);
    s.tweens.add({ targets: s.hud.eventBanner, scale: 1.15, alpha: {from:0.1, to:1}, duration: 350, yoyo: 1, repeat: 3, onComplete:()=>s.hud.eventBanner.setVisible(0) });
    playSound(s, type);
  }
  if (s.st.event) {
    if (t >= s.st.event.until) { s.st.event = null; s.overlayGraphics.clear(); s.cameras.main.setScroll(0,0); return; }
    const type = s.st.event.type;
    if (type === 'sismo') {
      s.cameras.main.setScroll(Math.sin(t*0.08)*4.5, Math.cos(t*0.08)*4.5);
      if (t >= s.st.event.nextRubble) { spawnRubble(s); s.st.event.nextRubble = t+Phaser.Math.Between(700,1400); }
    } else if (type === 'blackout') {
      s.overlayGraphics.clear().fillStyle(0x020308, Math.random()<0.05?0.25:(0.76+Math.sin(t*0.05)*0.12)).fillRect(0,0,800,600).setBlendMode(Phaser.BlendModes.ERASE).fillStyle(0xffffff,1);
      s.overlayGraphics.fillCircle(s.pf.p1.x, s.pf.p1.y, 80+Math.sin(t*0.07)*12);
      s.overlayGraphics.fillCircle(s.pf.p2.x, s.pf.p2.y, 80+Math.cos(t*0.07)*12);
      s.overlayGraphics.setBlendMode(Phaser.BlendModes.NORMAL);
    }
  }
}
function doHotfix(s, pid, ship, t) {
  if (s.st.mode === 'two_player') {
    const bug = spawnBug(s, pid==='p1'?2:1); bug.circ.setPosition(ship.x, ship.y); bug.lbl.setPosition(ship.x, ship.y+14);
    bug.x = ship.x; bug.y = ship.y; bug.vx = 220; bug.vy = ((pid==='p1'?450:150)-ship.y)*1.8; bug.fromHotfix = 1;
    playSound(s,'hotfix'); spawnParticles(s, ship.x, ship.y, N(C.bug), 8);
  } else {
    s.pf.bugs.forEach(b => {
      if (Math.sqrt((b.x-ship.x)**2+(b.y-ship.y)**2)<140) {
        spawnParticles(s, b.x, b.y, N(C.bug), 8);
        const txt = T(s, b.x, b.y, 'BUG SOLVED', '9px', '#00ff88', 0.5, 20, {fontStyle:'bold', stroke:'#000', strokeThickness:2.5});
        s.tweens.add({ targets: txt, y: b.y-35, alpha: 0, duration: 650, onComplete:()=>txt.destroy() });
        s.time.delayedCall(10, ()=>destroyBug(s,b));
      }
    });
    const htx = T(s, ship.x, ship.y-25, 'HOTFIX PULSE', '10px', C.acc, 0.5, 20, {fontStyle:'bold', stroke:'#000', strokeThickness:2.5});
    s.tweens.add({ targets: htx, y: ship.y-50, alpha:0, duration: 550, onComplete:()=>htx.destroy() });
    const c = s.add.circle(ship.x, ship.y, 10, N(C.acc), 0.08).setStrokeStyle(2, N(C.acc), 0.8).setDepth(10);
    s.tweens.add({ targets: c, scale: 14, alpha: 0, duration: 400, onComplete:()=>c.destroy() });
    playSound(s,'hotfix');
  }
}
function doRevert(s, pid, ship, t) {
  ship.revertUntil = t+280; playSound(s,'revert'); spawnDashEffect(s, ship, N(pid==='p1'?C.p1:C.p2));
  ship.x = Math.min(ship.x+120, 730); ship.shield.clear().lineStyle(2, N(C.acc), 1).fillStyle(N(C.acc), 0.15).strokeCircle(0,0,24).fillCircle(0,0,24).setPosition(ship.x, ship.y).setVisible(1);
  s.time.delayedCall(280, () => { if(ship.active) ship.shield.setVisible(0); });
}
function doSkill(s, type, pid, ship, t) {
  playSound(s, type==='beam'?'hotfix':'revert');
  const txts = {overclock:'OVERCLOCK', beam:'BEAM!', gitPull:'GIT PULL', firewall:'FIREWALL'};
  const cols = {overclock:C.amb, beam:C.p2, gitPull:C.pkg, firewall:C.p1};
  const txt = T(s, ship.x, ship.y-25, txts[type], '10px', cols[type], 0.5, 20, {fontStyle:'bold', stroke:'#000', strokeThickness:2});
  s.tweens.add({ targets: txt, y: ship.y-50, alpha: 0, duration: 600, onComplete:()=>txt.destroy() });
  if(type==='overclock'){ s.st.overclockActive[pid]=t+1800; s.st.overclock[pid]=t+5000; }
  if(type==='beam'){
    s.st.beam[pid]=t+4000; const l=s.add.graphics().setDepth(10).lineStyle(3, N(pid==='p1'?C.p1:C.p2), 1).lineBetween(ship.x+20, ship.y, 740, ship.y);
    s.time.delayedCall(120,()=>l.destroy());
    s.pf.bugs.forEach(b => { if(b.x>ship.x && Math.abs(b.y-ship.y)<22){ spawnParticles(s,b.x,b.y,N(C.bug),8); destroyBug(s,b); } });
  }
  if(type==='gitPull'){ s.st.gitPull[pid]=t+6000; s.st.magnetActiveUntil[pid]=t+1000; }
  if(type==='firewall'){
    s.st.firewall[pid]=t+8000; const r=R(s, ship.x+35, ship.y, 8, 70, N(pid==='p1'?C.p1:C.p2), 0.55).setStrokeStyle(1.5, 0xffffff).setDepth(10);
    r.endTime=t+3000; s.tweens.add({ targets: r, alpha: 0.2, duration: 300, yoyo: 1, repeat: -1 });
    s.pf.firewalls.push({ rect:r, x:ship.x+35, y:ship.y });
  }
}
function spawnHeart(s) {
  const x = Phaser.Math.Between(150, 620), y = Phaser.Math.Between(110, 540), c = s.add.container(x,y).setDepth(9);
  const aura = s.add.circle(0,0,22, N(C.p1), 0.22); c.add(aura);
  c.add(R(s,0,0,24,24,0x0a1018).setStrokeStyle(2, N(C.p1), 1));
  c.add(T(s,0,0,'♥', '14px', C.p1, 0.5, 0, {fontStyle:'bold'}));
  c.add(T(s,0,-20, 'LIFE', '8px', C.p1, 0.5, 0, {fontStyle:'bold', stroke:'#000', strokeThickness:2}));
  s.tweens.add({ targets: aura, scale: 1.3, alpha: 0.05, duration: 600, yoyo: 1, repeat: -1 });
  s.pf.hearts.push({ container:c, x, y });
}
function updateAI(s, dt, t, spd) {
  const ship = s.pf.p2;
  if (s.st.lives.p2 <= 0) {
    if (!s.st.aiRespawnAt) {
      if(ship.visible){ ship.setVisible(0); spawnParticles(s, ship.x, ship.y, N(C.p2), 20); playSound(s,'hit'); }
      s.st.aiRespawnAt = t + 3000;
    } else if (t >= s.st.aiRespawnAt) {
      s.st.lives.p2 = 2; s.st.aiRespawnAt = 0;
      ship.carrying.forEach(p => destroyPkg(s, p)); ship.carrying = [];
      ship.setPosition(120, 450); ship.setVisible(1);
      showDeployMsg(s, 120, 450, AI_QUIPS[Phaser.Math.Between(0,AI_QUIPS.length-1)], 'p2');
    }
    return;
  }
  s.st.aiRespawnAt = 0;
  // Margen de error aleatorio (~35% de falla)
  const err = Math.random() < 0.35;
  let tx = ship.x, ty = ship.y, nb = null, mbd = 9999;
  s.pf.bugs.forEach(b => { const d = Math.sqrt((b.x-ship.x)**2+(b.y-ship.y)**2); if(d<mbd && b.x<ship.x+100){ mbd=d; nb=b; } });
  let dg = 0;
  if (!err && nb && mbd < 90) {
    dg=1; tx=ship.x-40; ty=ship.y+(nb.y>ship.y?-90:90);
    if(mbd<45){ if(t>=s.st.hotfix.p2){ doHotfix(s,'p2',ship,t); s.st.hotfix.p2=t+2500;} else if(t>=s.st.revert.p2){ doRevert(s,'p2',ship,t); s.st.revert.p2=t+3000;} }
  }
  let np = null, mpd = 9999;
  s.pf.packages.forEach(p => { if(!p.carried){ const d = Math.sqrt((p.x-ship.x)**2+(p.y-ship.y)**2); if(d<mpd){ mpd=d; np=p; }} });
  if (!err) {
    if(!dg){ if(ship.carrying.length>=3){ tx=710; ty=450; } else if(np){ tx=np.x; ty=np.y; } else { tx=400; ty=450; } }
    if (t>=(s.st.overclock.p2||0) && t>=(s.st.overclockActive.p2||0) && (ship.carrying.length>=3||mpd>180)) { doSkill(s,'overclock','p2',ship,t); s.st.overclock.p2=t+4500; }
    if (t>=(s.st.beam.p2||0) && s.pf.bugs.some(b=>b.x>ship.x&&b.x<ship.x+250&&Math.abs(b.y-ship.y)<22)) { doSkill(s,'beam','p2',ship,t); s.st.beam.p2=t+4000; }
    if (t>=(s.st.gitPull.p2||0) && ship.carrying.length<3 && s.pf.packages.filter(p=>!p.carried).length>=2) { doSkill(s,'gitPull','p2',ship,t); s.st.gitPull.p2=t+5000; }
  } else {
    // Movimiento errático aleatorio y disparatado
    tx = ship.x + Phaser.Math.Between(-300, 300);
    ty = ship.y + Phaser.Math.Between(-200, 200);
    // Malgasta habilidades sin sentido
    if (Math.random() < 0.1 && t >= s.st.hotfix.p2) { doHotfix(s,'p2',ship,t); s.st.hotfix.p2=t+2500; }
    else if (Math.random() < 0.1 && t >= s.st.revert.p2) { doRevert(s,'p2',ship,t); s.st.revert.p2=t+3000; }
  }
  const v = { x:tx-ship.x, y:ty-ship.y }, len = Math.sqrt(v.x**2+v.y**2);
  if(len>5){ const asp = spd*(t<s.st.overclockActive.p2?1.5:1); ship.x = Phaser.Math.Clamp(ship.x+v.x/len*asp*dt, 25, 705); ship.y = Phaser.Math.Clamp(ship.y+v.y/len*asp*dt, 95, 575); ship.setPosition(ship.x, ship.y); }
  if(ship.carrying.length<3) for(const p of s.pf.packages) if(!p.carried && Math.sqrt((ship.x-p.x)**2+(ship.y-p.y)**2)<32){ p.carried=1; ship.carrying.push(p); playSound(s,'pickup'); break; }
}
function updateGame(s, t, delta) {
  const dt = delta/1000, is1P = s.st.mode==='one_player', is2P = s.st.mode==='two_player';
  if(is1P) s.st.timer += dt; else s.st.timer = Math.max(s.st.timer-dt, 0);
  if((!is1P && s.st.timer<=0) || s.st.lives.p1<=0 || (is2P && s.st.lives.p2<=0)){ finishGame(s); return; }
  if(consumePressed(s, ['S1','S2'])){ pauseGame(s); return; }
  updateCDMXEvents(s, t); const lag = s.st.event && s.st.event.type==='lag', spd = lag?150:260;
  updatePlayer(s, 'p1', dt, t, spd); if(is2P) updatePlayer(s, 'p2', dt, t, spd); else if(is1P) updateAI(s, dt, t, spd);
  updatePackages(s, dt); if(!s.st.nextHeartTime) s.st.nextHeartTime = t+20000;
  if(t>=s.st.nextHeartTime){ spawnHeart(s); s.st.nextHeartTime = t+Phaser.Math.Between(20000,30000); }
  s.pf.hearts = s.pf.hearts.filter(h => {
    h.container.y = h.y + Math.sin(t*0.005)*4;
    for(const pid of ['p1','p2']){
      const ship = pid==='p1'?s.pf.p1:s.pf.p2; if(ship.visible && Math.sqrt((ship.x-h.x)**2+(ship.y-h.container.y)**2)<30){
        s.st.lives[pid] = Math.min(3, s.st.lives[pid]+1); playSound(s,'pickup'); showDeployMsg(s, ship.x, ship.y, '❤ +1 HP!', pid); h.container.destroy(); return 0;
      }
    } return 1;
  });
  s.pf.firewalls = s.pf.firewalls.filter(f => { if(t>=f.rect.endTime){ f.rect.destroy(); return 0; } return 1; });
  updateBugs(s, dt, t); checkDeployCollision(s, t); refreshHud(s);
  updateServerLeds(t, s.pf.srv1, N(C.p1)); if(is2P) updateServerLeds(t, s.pf.srv2, N(C.p2));
  updateShipVisuals(s, t); drawLaserConnections(s);
}
function updatePlayer(s, pid, dt, t, spd) {
  const ship = pid==='p1'?s.pf.p1:s.pf.p2, is1P = s.st.mode==='one_player';
  const keys = pid==='p1'?['P1_L','P1_R','P1_U','P1_D','P1_1','P1_2','P1_3','P1_4','P1_5','P1_6']:['P2_L','P2_R','P2_U','P2_D','P2_1','P2_2','P2_3','P2_4','P2_5','P2_6'];
  const keys2 = (pid==='p1' && is1P)?['P2_L','P2_R','P2_U','P2_D','P2_1','P2_2','P2_3','P2_4','P2_5','P2_6']:null;
  const hk = (i) => held(s,keys[i])||(keys2 && held(s,keys2[i]));
  const ck = (i) => consumePressed(s,[keys[i]])||(keys2 && consumePressed(s,[keys2[i]]));
  let vx = (hk(0)?-1:0)+(hk(1)?1:0), vy = (hk(2)?-1:0)+(hk(3)?1:0);
  if(vx && vy){ vx*=0.707; vy*=0.707; }
  const minY = pid==='p1'?95:315, maxY = pid==='p1'?(is1P?575:280):575;
  const oc = t < s.st.overclockActive[pid], asp = spd*(oc?1.55:1);
  ship.x = Phaser.Math.Clamp(ship.x+vx*asp*dt, 25, 705); ship.y = Phaser.Math.Clamp(ship.y+vy*asp*dt, minY, maxY);
  ship.setPosition(ship.x, ship.y); if(ship.shield.visible) ship.shield.setPosition(ship.x, ship.y);
  if(consumePressed(s, [keys[4]])||(keys2&&consumePressed(s,[keys2[4]]))) { if(t>=s.st.hotfix[pid]){ doHotfix(s, pid, ship, t); s.st.hotfix[pid]=t+2000; } }
  if(consumePressed(s, [keys[5]])||(keys2&&consumePressed(s,[keys2[5]]))) { if(t>=s.st.revert[pid]){ doRevert(s, pid, ship, t); s.st.revert[pid]=t+3000; } }
  if(ck(6) && t>=s.st.overclock[pid]) doSkill(s,'overclock',pid,ship,t);
  if(ck(7) && t>=s.st.beam[pid]) doSkill(s,'beam',pid,ship,t);
  if(ck(8) && t>=s.st.gitPull[pid]) doSkill(s,'gitPull',pid,ship,t);
  if(ck(9) && t>=s.st.firewall[pid]) doSkill(s,'firewall',pid,ship,t);
  if(ship.carrying.length<3) for(const p of s.pf.packages) if(!p.carried && (is1P || p.lane===(pid==='p1'?1:2)) && Math.sqrt((ship.x-p.x)**2+(ship.y-p.y)**2)<32){
    p.carried=1; ship.carrying.push(p); playSound(s,'pickup'); const tag = T(s, p.x, p.y-15, `PR #${ship.carrying.length} ADDED`, '9px', C.pkg, 0.5, 20, {fontStyle:'bold'});
    s.tweens.add({ targets: tag, y: p.y-45, alpha: 0, duration: 800, onComplete:()=>tag.destroy() }); break;
  }
}
function updatePackages(s, dt) {
  const is1P = s.st.mode==='one_player', now = s.time.now;
  s.pf.packages.forEach(p => {
    if(p.carried) return; let ts = null, md = 9999;
    ['p1','p2'].forEach(pid => {
      const ship = pid==='p1'?s.pf.p1:s.pf.p2; if(!ship.visible || ship.carrying.length>=3) return;
      const mag = now < s.st.magnetActiveUntil[pid], r = mag?9999:120;
      if(!is1P && p.lane!==(pid==='p1'?1:2)) return;
      const dx = ship.x-p.x, dy = ship.y-p.y, d = Math.sqrt(dx*dx+dy*dy);
      if(d<r && d<md){ md=d; ts={ship,dx,dy,mag}; }
    });
    if(ts){ const pull = ts.mag?280:(120-md)*(ts.mag?8:2.8); p.x += (ts.dx/Math.max(1,md))*pull*dt*3.5; p.y += (ts.dy/Math.max(1,md))*pull*dt*3.5; p.container.setPosition(p.x,p.y); }
  });
  ['p1','p2'].forEach(pid => {
    const ship = pid==='p1'?s.pf.p1:s.pf.p2; let px=ship.x, py=ship.y;
    ship.carrying.forEach(p => { p.x += (px-34-p.x)*0.22; p.y += (py-p.y)*0.22; p.container.setPosition(p.x,p.y); px=p.x; py=p.y; });
  });
}
function drawLaserConnections(s) {
  s.laserGraphics.clear().lineStyle(1.8, 0x00d4ff, 0.75);
  ['p1','p2'].forEach(pid => {
    const ship = pid==='p1'?s.pf.p1:s.pf.p2; if(ship.carrying.length){ s.laserGraphics.beginPath().moveTo(ship.x, ship.y); ship.carrying.forEach(p => s.laserGraphics.lineTo(p.x, p.y)); s.laserGraphics.strokePath(); }
  });
}
function updateBugs(s, dt, t) {
  const m = s.st.mode, is1P = m==='one_player', is2P = m==='two_player', lm = is1P?(1+(s.st.level-1)*0.15):1;
  s.pf.bugs.forEach(b => {
    b.x += b.vx*dt; b.y += (b.vy||0)*dt; if(b.fromHotfix && is2P){ b.vy += Math.sign((b.lane===1?s.pf.p1:s.pf.p2).y-b.y)*450*dt; b.vy = Phaser.Math.Clamp(b.vy, -220, 220); }
    let blk = 0; s.pf.firewalls.forEach(f => { if(Math.abs(b.x-f.x)<18 && Math.abs(b.y-f.y)<45){ spawnParticles(s,b.x,b.y,N(C.bug),8); destroyBug(s,b); blk=1; } });
    if(blk) return; if(b.x<-80 || b.x>880 || b.y<-40 || b.y>640){ destroyBug(s,b); return; }
    b.circ.setPosition(b.x, b.y); b.lbl.setPosition(b.x, b.y+13);
    if(is1P){ checkBugHit(s,b,'p1',s.pf.p1,t); checkBugHit(s,b,'p2',s.pf.p2,t); } else if(b.lane===1) checkBugHit(s,b,'p1',s.pf.p1,t); else if(b.lane===2 && is2P) checkBugHit(s,b,'p2',s.pf.p2,t);
  });
  const lag = s.st.event && s.st.event.type==='lag', chance = (lag?0.005:0.015), bChance = (lag?0.008:(is1P?0.035:0.025))*lm;
  if(s.pf.packages.filter(p=>!p.carried && p.lane===1).length< (is1P?5:2) && Math.random()<chance) spawnPackage(s,1);
  if(s.pf.bugs.filter(b=>b.lane===1 && !b.isRubble).length< Math.floor((is1P?5:3)*lm) && Math.random()<bChance) spawnBug(s,1).vx *= (is1P?lm:1);
  if(s.pf.packages.filter(p=>!p.carried && p.lane===2).length< (is1P?5:2) && Math.random()<chance) spawnPackage(s,2);
  if(s.pf.bugs.filter(b=>b.lane===2 && !b.isRubble).length< Math.floor((is1P?5:3)*lm) && Math.random()<bChance) spawnBug(s,2).vx *= (is1P?lm:1);
}
function checkBugHit(s, b, pid, ship, t) {
  if (t < ship.revertUntil || Math.sqrt((b.x-ship.x)**2+(b.y-ship.y)**2) >= 22) return;
  ship.hitFlash = t+900; s.st.combo[pid]=0; s.st.lives[pid]=Math.max(0, s.st.lives[pid]-1);
  if(ship.carrying.length){ ship.carrying.forEach(p => { spawnParticles(s,p.x,p.y,N(C.pkg),6); destroyPkg(s,p); }); ship.carrying=[]; showDeployMsg(s, ship.x, ship.y, 'CONFLICT!', pid); }
  else showDeployMsg(s, ship.x, ship.y, 'BUG!', pid);
  s.cameras.main.shake(160, 0.0075); playSound(s,'hit'); spawnParticles(s, ship.x, ship.y, N(C.bug), 12); destroyBug(s,b);
}
function updateShipVisuals(s, t) {
  [s.pf.p1, s.pf.p2].forEach(ship => { if(!ship.visible) return; ship.setAlpha(t<ship.hitFlash?(Math.floor(t/80)%2?0.25:1):t<ship.revertUntil?0.45:1); if(Math.random()<0.35){ const p=s.add.circle(ship.x-12, ship.y+Phaser.Math.Between(-4,4), Phaser.Math.Between(2,4), N(ship===s.pf.p1?C.p1:C.p2), 0.7).setDepth(10); s.tweens.add({ targets:p, x:ship.x-Phaser.Math.Between(15,30), alpha:0, scale:0.3, duration: Phaser.Math.Between(150,300), onComplete:()=>p.destroy() }); } });
}
function spawnParticles(s, x, y, col, count) {
  for(let i=0; i<count; i++){ const p=s.add.circle(x,y,Phaser.Math.Between(2.5,6),col,1).setDepth(15), a=Phaser.Math.FloatBetween(0,Math.PI*2), d=Phaser.Math.Between(25,75); s.tweens.add({ targets:p, x:x+Math.cos(a)*d, y:y+Math.sin(a)*d, alpha:0, duration:Phaser.Math.Between(250,500), onComplete:()=>p.destroy() }); }
}
function spawnDashEffect(s, ship, col) { const t=s.add.triangle(ship.x, ship.y, 18,0,-10,12,-10,-12, col, 0.45).setDepth(10); s.tweens.add({ targets:t, x:ship.x-50, alpha:0, scaleX:0.25, duration:260, onComplete:()=>t.destroy() }); }
function showDeployMsg(s, x, y, msg, pid) {
  const t = T(s, x, y-20, msg, '13px', pid==='p1'?C.p1:C.p2, 0.5, 20, {fontStyle:'bold', stroke:'#000', strokeThickness:3});
  s.tweens.add({ targets: t, y: y-85, alpha: 0, duration: 1300, onComplete:()=>t.destroy() });
}
const pulseSrv = (s, srv, col) => s.tweens.add({ targets: srv, scale: 1.15, duration: 90, yoyo: 1, repeat: 1 });
function updateGlitch(s, t) {
  if (s.titleTxt && t > s.st.glitchTimer) {
    s.st.glitchTimer = t + Phaser.Math.Between(2000, 4500); const o = 'DEPLOY WARS', n = o.split(''), c = Phaser.Math.Between(1,4);
    for(let i=0; i<c; i++) n[Phaser.Math.Between(0, n.length-1)] = '!@#$%^&*<>/\\|?'[Phaser.Math.Between(0, 13)];
    s.titleTxt.setText(n.join('')).setX(400+Phaser.Math.Between(-4,4)); s.time.delayedCall(70, ()=>s.titleTxt.setText(o).setX(400));
  }
}
function createTitleScreen(s) {
  const c = s.add.container(0, 0).setDepth(30); s.titleScreen = c;
  c.add([R(s, 400, 300, 800, 600, N(C.bg), 0.98), s.glow = R(s, 400, 130, 520, 105, N(C.acc), 0.03).setStrokeStyle(1.5, N(C.acc), 0.25), T(s, 400, 60, 'PLATANUS HACK', '12px', C.acc), s.titleTxt = T(s, 400, 118, 'DEPLOY WARS', '58px', C.p1, 0.5, 10, neon(C.p1, '58px')), T(s, 400, 178, 'Ship code. Dodge bugs. Dominate CDMX prod.', '13px', C.w+'99'), T(s, 400, 406, '── MEJORES SCORES ──', '12px', C.acc), s.titleScores = T(s, 400, 424, '', '12px', C.w+'aa', 0.5).setOrigin(0.5, 0), T(s, 400, 582, 'MOVER ↕   CONFIRMAR B1/S1', '10px', '#fff4')]);
  s.titleBtns = ['[ JUGAR ]', '[ LÍDERES ]', '[ CONTROLES ]'].map((l, i) => {
    const y = 240+i*52, bg = R(s, 400, y, 280, 38, N(C.dGy), 0.95).setStrokeStyle(2, N(C.gy), 0.8), txt = T(s, 400, y, l, '18px', C.w, 0.5, 10, {fontStyle:'bold'});
    c.add([bg, txt]); return { bg, txt };
  });
  s.tweens.add({ targets: s.glow, alpha: 0.08, duration: 1400, yoyo: 1, repeat: -1 }); s.tweens.add({ targets: s.titleTxt, scale: 1.02, duration: 1500, yoyo: 1, repeat: -1 }); c.setVisible(0);
}
function showTitle(s) { s.st.phase = 'start'; s.st.menu = { cursor: 0, cooldown: 0, lastAxis: 0 }; refreshTitleScores(s); updateTitleButtons(s); s.titleScreen.setVisible(1); startAmbientMusic(s); }
function updateTitleButtons(s) { s.titleBtns.forEach(({ bg, txt }, i) => { const a = i === s.st.menu.cursor; bg.setFillStyle(a?N(C.p1):N(C.dGy), a?1:0.95).setStrokeStyle(2, a?N(C.w):N(C.gy), 1); txt.setColor(a?C.bg:C.w); }); }
function refreshTitleScores(s) { const hs = s.st.highScores; s.titleScores.setText(hs.length ? hs.slice(0,3).map((e,i) => `${i+1}. ${e.name} ${e.score} [${e.mode||'2P'}]`).join('\n') : 'sin puntuaciones'); }
function handleTitleMenu(s, t) {
  const m = s.st.menu, av = axisV(s); if (t >= m.cooldown && av !== 0 && m.lastAxis !== av) { m.cursor = Phaser.Math.Wrap(m.cursor+av, 0, 3); m.cooldown = t+160; updateTitleButtons(s); playSound(s,'click'); }
  m.lastAxis = av; if (consumePressed(s, ['P1_1','P2_1','S1','S2'])) { playSound(s,'select'); s.titleScreen.setVisible(0); if(m.cursor===0) showModeSelect(s); else if(m.cursor===1) showLeaderboard(s); else { s.st.phase = 'controls'; s.ctrlScreen.setVisible(1); } }
}
function createModeScreen(s) {
  const c = s.add.container(0, 0).setDepth(31); s.modeScreen = c;
  c.add([R(s, 400, 300, 800, 600, N(C.bg), 0.98), T(s, 400, 120, 'MODO DE JUEGO', '32px', C.acc, 0.5, 10, {fontStyle:'bold'}), T(s, 400, 582, 'MOVER ↕   CONFIRMAR B1/S1', '10px', '#fff4')]);
  s.modeBtns = [{l:'[ 1 JUGADOR ]', s:'En solitario. Vence al reloj.', y:220}, {l:'[ 2 JUGADORES ]', s:'DevOps PvP. Lanza bugs.', y:300}].map((m, i) => {
    const bg = R(s, 400, m.y, 340, 42, N(C.dGy), 0.95).setStrokeStyle(2, N(C.gy), 0.8), txt = T(s, 400, m.y-6, m.l, '20px', C.w, 0.5, 10, {fontStyle:'bold'}), sub = T(s, 400, m.y+12, m.s, '10px', C.w+'66');
    c.add([bg, txt, sub]); return { bg, txt };
  }); c.setVisible(0);
}
function showModeSelect(s) { s.st.phase = 'modesel'; s.st.modeSel = { cursor: 0, cooldown: 0 }; updateModeBtns(s); s.modeScreen.setVisible(1); }
function updateModeBtns(s) { s.modeBtns.forEach(({ bg, txt }, i) => { const a = i === s.st.modeSel.cursor; bg.setFillStyle(a?N(C.p1):N(C.dGy), a?1:1).setStrokeStyle(2, a?N(C.w):N(C.gy), 1); txt.setColor(a?C.bg:C.w); }); }
function handleModeMenu(s, t) {
  const ms = s.st.modeSel, av = axisV(s); if (t >= ms.cooldown && av !== 0) { ms.cursor = Phaser.Math.Wrap(ms.cursor+av, 0, 2); ms.cooldown = t+160; updateModeBtns(s); playSound(s,'click'); }
  if (consumePressed(s, ['P1_1','P2_1','S1','S2'])) { s.st.mode = ms.cursor? 'two_player':'one_player'; playSound(s,'select'); s.modeScreen.setVisible(0); startMatch(s); }
}
function startMatch(s) {
  const t = s.time.now, m = s.st.mode==='one_player'; Object.assign(s.st, { scores:{p1:0,p2:0}, combo:{p1:0,p2:0}, timer:ROUND_DURATION, hotfix:{p1:0,p2:0}, revert:{p1:0,p2:0}, event:null, eventTimer:t+15000, lives:{p1:3,p2:3}, level:1, overclock:{p1:0,p2:0}, overclockActive:{p1:0,p2:0}, beam:{p1:0,p2:0}, gitPull:{p1:0,p2:0}, magnetActiveUntil:{p1:0,p2:0}, firewall:{p1:0,p2:0}, nextHeartTime:t+20000, phase:'countdown' });
  s.overlayGraphics.clear(); s.cameras.main.setScroll(0,0); s.pf.p1.setPosition(120,150); s.pf.p2.setPosition(120,450); s.pf.p1.carrying=[]; s.pf.p2.carrying=[]; s.pf.p1.hitFlash=s.pf.p2.hitFlash=0;
  clearPlayfieldObjects(s); showHud(s, 1); showPlayfield(s, 1); refreshHud(s); startAmbientMusic(s);
  const tut = m ? '💡 1P: Lleva {} al Servidor verde.\nB1 Hotfix|B2 Revert|B3 Overclock\nB4 Láser|B5 Git Pull|B6 Firewall' : '💡 2P: Lleva commits al Servidor. Chocar=-1HP.\nB1 Hotfix(bug)|B2 Revert|B3 Overclock\nB4 Láser|B5 Git Pull|B6 Firewall';
  const box = s.add.container(400, 535).setDepth(20).setAlpha(0); const txt = T(s, 0, 0, tut, '11px', '#ff0', 0.5, 0, {align:'center', stroke:'#000', strokeThickness:3.5, lineSpacing:4}); box.add(R(s, 0, 0, txt.width+24, txt.height+16, 0, 0.85).setStrokeStyle(1.5, N(C.p1), 0.75)); box.add(txt);
  s.tweens.add({ targets: box, alpha: 1, duration: 600, delay: 1000, onComplete: () => s.tweens.add({ targets: box, alpha: 0, duration: 600, delay: 8500, onComplete: () => box.destroy() }) });
  const msgs = ['3','2','1','DEPLOY!']; let idx = 0; const cd = T(s, 400, 300, '', '76px', C.p1, 0.5, 40, neon(C.p1, '76px'));
  const tick = () => { cd.setText(msgs[idx]).setAlpha(1).setScale(1); s.tweens.add({ targets:cd, scale:1.35, alpha:0, duration:750 }); playSound(s, idx<3?'click':'select'); idx++; if(idx<4) s.time.delayedCall(900, tick); else s.time.delayedCall(800, ()=>{cd.destroy(); s.st.phase='playing';}); }; tick();
}
const pauseGame = (s) => { s.st.phase = 'paused'; s.pauseScreen.setVisible(1); };
const resumeGame = (s) => { s.pauseScreen.setVisible(0); s.st.phase = 'playing'; };
function finishGame(s) {
  s.st.phase = 'transition';
  s.cameras.main.shake(350, 0.02);
  s.cameras.main.flash(300, 255, 0, 0);
  playSound(s, 'gameover');
  if (s.st.scores.p2 > s.st.scores.p1) {
    s.time.delayedCall(420, () => playSound(s, 'laugh'));
  }
  s.time.delayedCall(350, () => {
    s.overlayGraphics.clear();
    s.cameras.main.setScroll(0,0);
    clearPlayfieldObjects(s);
    showPlayfield(s, 0);
    showHud(s, 0);
    s.st.phase = 'endChoice';
    showEndChoice(s);
  });
}
const returnToTitle = (s) => { s.gameOverScreen.setVisible(0); if(s.endChoiceScreen) s.endChoiceScreen.setVisible(0); s.st.nameEntry.letters = []; showTitle(s); };
function createEndChoiceScreen(s) {
  const c = s.add.container(0, 0).setDepth(36); s.endChoiceScreen = c;
  c.add(R(s, 400, 300, 800, 600, N(C.bg), 0.97));
  s.ecTitle = T(s, 400, 180, 'GAME OVER', '42px', C.amb, 0.5, 10, {fontStyle:'bold', shadow:{color:C.amb, fill:1, blur:10}});
  s.ecResult = T(s, 400, 240, '', '18px', C.w, 0.5, 10, {align:'center'});
  c.add([s.ecTitle, s.ecResult]);
  const btns = [{l:'▶ REINTENTAR', col:C.p1}, {l:'✖ TERMINAR', col:C.p2}];
  s.ecBtns = btns.map(({l, col}, i) => {
    const y = 320+i*64, bg = R(s, 400, y, 300, 46, N(C.dGy), 0.95).setStrokeStyle(2, N(col), 0.8), txt = T(s, 400, y, l, '22px', col, 0.5, 10, {fontStyle:'bold'});
    c.add([bg, txt]); return { bg, txt, col };
  });
  c.add(T(s, 400, 490, 'MOVER ↕   CONFIRMAR B1/S1', '10px', '#fff4'));
  c.setVisible(0);
}
function showEndChoice(s) {
  s.st.endCursor = 0; s.st.endCooldown = 0;
  const p1 = s.st.scores.p1, p2 = s.st.scores.p2, is2P = s.st.mode==='two_player';
  const best = s.st.sessionBest || 0;
  if (is2P) {
    s.st.winner = p1===p2?'draw':p1>p2?'p1':'p2';
    const msg = s.st.winner==='p2' ? AI_WINS[Phaser.Math.Between(0, AI_WINS.length-1)] : (s.st.winner==='draw'?'¡EMPATE!':'P1 GANA');
    s.ecResult.setText(`${msg}\nP1: ${p1} deploys   P2: ${p2} deploys\nMejor sesión: ${best} pts`);
  } else {
    s.st.winner = 'p1';
    const isBotBetter = p2 > p1;
    const msg = isBotBetter ? AI_WINS[Phaser.Math.Between(0, AI_WINS.length-1)] : '¡Buen intento, humano! 👍';
    s.ecResult.setText(`${msg}\nTus Deploys: ${p1} vs DEV_BOT: ${p2}\nMejor sesión: ${best} pts`);
  }
  updateEcBtns(s); s.endChoiceScreen.setVisible(1);
}
function updateEcBtns(s) {
  s.ecBtns.forEach(({bg, txt, col}, i) => { const a = i===s.st.endCursor; bg.setFillStyle(a?N(col):N(C.dGy), a?1:0.95).setStrokeStyle(2, N(col), a?1:0.5); txt.setColor(a?C.bg:col).setAlpha(1); });
}
function handleEndChoice(s, t) {
  const av = axisV(s);
  if (t >= s.st.endCooldown && av !== 0) { s.st.endCursor = Phaser.Math.Wrap(s.st.endCursor+av, 0, 2); s.st.endCooldown = t+160; updateEcBtns(s); playSound(s,'click'); }
  if (consumePressed(s, ['P1_1','P2_1','S1','S2','P1_2','P2_2'])) {
    playSound(s,'select'); s.endChoiceScreen.setVisible(0);
    if (s.st.endCursor === 0) { startMatch(s); }
    else { s.st.phase = 'gameover'; showGameOver(s); }
  }
}
function createGameOverScreen(s) {
  const c = s.add.container(0, 0).setDepth(35); s.gameOverScreen = c;
  c.add([R(s, 400, 300, 800, 600, N(C.bg), 0.98), s.goTitle = T(s, 400, 50, 'GAME OVER', '42px', C.amb, 0.5, 10, {fontStyle:'bold', shadow:{color:C.amb, fill:1, blur:10}}), s.goResult = T(s, 400, 102, '', '20px', C.w, 0.5, 10, {align:'center'}), T(s, 400, 150, 'TUS INICIALES:', '12px', C.acc+'88'), s.goNameVal = T(s, 400, 182, '_ _ _', '42px', C.p1, 0.5, 10, {fontStyle:'bold', letterSpacing:12}), s.goScoreList = T(s, 400, 442, '', '12px', C.w+'bb', 0.5).setOrigin(0.5, 0), s.goReplayBg = R(s, 400, 222, 330, 26, 0x151622).setStrokeStyle(2, N(C.amb), 0.9), s.goReplayTxt = T(s, 400, 222, '⚡ REPLAY: PRESIONA B3 (O/Y) ⚡', '11px', '#ffdd00', 0.5, 10, {fontStyle:'bold'}), s.goSaveStatus = T(s, 400, 582, '', '11px', C.p1, 0.5).setOrigin(0.5, 1)]);
  s.goGridItems = []; L_GRID.forEach((row, r) => { const rw = row.length*50; row.forEach((v, cl) => { const x = 400-rw/2+25+cl*50, y = 265+r*34, w = v.length>1; const cell = R(s, x, y, w?58:38, 26, N(C.dGy), 0.95).setStrokeStyle(2, N(C.gy), 0.8), lbl = T(s, x, y, v, w?'12px':'16px', C.w, 0.5, 10, {fontStyle:'bold'}); c.add([cell, lbl]); s.goGridItems.push({ cell, lbl, row:r, col:cl, val:v }); }); });
  s.tweens.add({ targets: [s.goReplayBg, s.goReplayTxt], scale: 1.04, duration: 650, yoyo: 1, repeat: -1 }); c.setVisible(0);
}
function showGameOver(s) {
  const p1 = s.st.scores.p1, p2 = s.st.scores.p2, is2P = s.st.mode === 'two_player';
  const sc = is2P ? (s.st.winner==='p1'?p1:p2) : p1;
  if (sc > (s.st.sessionBest||0)) s.st.sessionBest = sc;
  if (is2P) { s.st.winner = p1===p2 ? 'draw' : p1>p2 ? 'p1':'p2'; s.goResult.setText(`${s.st.winner==='draw'?'¡EMPATE!':(s.st.winner==='p1'?'P1 GANA':'P2 GANA')}\nP1: ${p1}  P2: ${p2}`); }
  else { s.st.winner = 'p1'; s.goResult.setText(`${p1} DEPLOYS | LVL ${s.st.level}`); }
  s.st.nameEntry = { letters: [], row: 0, col: 0, moveCooldown: 0, confirmCooldown: 0, lastVec: { x: 0, y: 0 } };
  refreshNameEntry(s); updateGridHighlight(s); refreshGoScores(s); s.goSaveStatus.setText('Selecciona letras y confirma'); s.gameOverScreen.setVisible(1);
}
const refreshNameEntry = (s) => { const ls = [...s.st.nameEntry.letters]; while(ls.length<3) ls.push('_'); s.goNameVal.setText(ls.join(' ')); };
const refreshGoScores = (s) => { const hs = s.st.highScores; s.goScoreList.setText(hs.length ? hs.slice(0,3).map((e,i) => `${i+1}. ${e.name} ${e.score}pts [${e.mode||'2P'}]`).join('\n') : 'sin records'); };
function updateGridHighlight(s) { s.goGridItems.forEach(i => { const a = i.row === s.st.nameEntry.row && i.col === s.st.nameEntry.col; i.cell.setFillStyle(a?N(C.p1):N(C.dGy), a?1:0.95).setStrokeStyle(2, a?N(C.w):N(C.gy), 1); i.lbl.setColor(a?C.bg:C.w); }); }
function handleNameEntry(s, t) {
  if (consumePressed(s, ['P1_3', 'P2_3'])) { playSound(s,'select'); s.gameOverScreen.setVisible(0); startMatch(s); return; }
  const e = s.st.nameEntry, ax = axisH(s), ay = axisV(s);
  if (t >= e.moveCooldown && (ax || ay) && (e.lastVec.x !== ax || e.lastVec.y !== ay)) {
    if (ay) { e.row = Phaser.Math.Wrap(e.row+ay, 0, 5); e.col = Math.min(e.col, L_GRID[e.row].length-1); }
    if (ax) { e.col = Phaser.Math.Wrap(e.col+ax, 0, L_GRID[e.row].length); }
    e.moveCooldown = t+160; updateGridHighlight(s); playSound(s,'click');
  }
  e.lastVec = {x:ax, y:ay}; if (t >= e.confirmCooldown && consumePressed(s, ['P1_1','P2_1','S1','S2'])) {
    e.confirmCooldown = t+180; playSound(s,'select'); const v = L_GRID[e.row][e.col];
    if (v === 'DEL') e.letters.pop(); else if (v === 'END') { if (e.letters.length) submitScore(s); } else { if (e.letters.length>=3) e.letters.shift(); e.letters.push(v); } refreshNameEntry(s);
  }
}
function submitScore(s) {
  const n = s.st.nameEntry.letters.join('')||'???', sc = s.st.winner==='p2'?s.st.scores.p2:s.st.scores.p1;
  const e = { name:n, score:sc, mode:s.st.mode==='one_player'?'1P':'2P', savedAt:new Date().toISOString().slice(0,10) };
  s.goSaveStatus.setText('¡Guardado! Presiona START.'); s.st.phase = 'saved'; persistScore(e).then(hs => { s.st.highScores = hs; refreshTitleScores(s); refreshGoScores(s); });
}
function createSub(s, name, title, body, sz='20px') {
  const c = s.add.container(0, 0).setDepth(32).setVisible(0);
  c.add([R(s, 400, 300, 800, 600, N(C.bg), 0.98), T(s, 400, 70, `── ${title} ──`, '26px', C.acc, 0.5, 10, {fontStyle:'bold'}), c.txt = T(s, 400, 130, body, sz, C.w, 0.5).setOrigin(0.5, 0), T(s, 400, 580, 'START = REGRESAR', '11px', '#fff4')]);
  s[name] = c;
}
function showLeaderboard(s) {
  const hs = s.st.highScores; const txt = hs.length ? hs.map((e,i) => `${String(i+1).padStart(2,0)} ${e.name.padEnd(3,' ')} ${String(e.score).padStart(2,' ')} [${e.mode||'2P'}]`).join('\n') : 'sin puntuaciones';
  s.st.phase = 'leaderboard'; s.leaderScreen.txt.setText(txt); s.leaderScreen.setVisible(1);
}
function createPauseScreen(s) { const c = s.add.container(0, 0).setDepth(40); s.pauseScreen = c; c.add([R(s, 400, 300, 800, 600, N(C.bg), 0.85), T(s, 400, 270, 'PAUSA', '56px', C.amb, 0.5, 10, {fontStyle:'bold', shadow:{color:C.amb, fill:1, blur:10}}), T(s, 400, 330, 'PRESIONA START PARA REANUDAR', '14px', C.w+'88')]); c.setVisible(0); }
function startAmbientMusic(s) {
  if (s.st.musicStarted) return; s.st.musicStarted = 1;
  try {
    const ctx = s.sound.context, out = ctx.createGain(); out.gain.value = 0.65; out.connect(ctx.destination);
    const dly = ctx.createDelay(1.5), dfb = ctx.createGain(); dly.delayTime.value = 0.36; dfb.gain.value = 0.22; dly.connect(dfb); dfb.connect(dly); dfb.connect(out);
    const filt = ctx.createBiquadFilter(); filt.type = 'lowpass'; filt.frequency.value = 850; filt.connect(out); filt.connect(dly);
    const chords = [
      [130.8, 164.8, 196.0, 246.9],
      [155.6, 196.0, 233.1, 293.7],
      [174.6, 220.0, 261.6, 329.6],
      [116.5, 146.8, 174.6, 220.0]
    ];
    [[130.8,0,'sawtooth'],[155.5,6,'sawtooth'],[196,0,'triangle']].forEach(([f,d,t]) => { const o = ctx.createOscillator(), g = ctx.createGain(); o.type = t; o.frequency.value = f; o.detune.value = d; g.gain.value = 0.02; o.connect(g); g.connect(filt); o.start(); });
    const schedMusic = (step = 0) => {
      if (s.st.phase === 'paused') { s.time.delayedCall(100, () => schedMusic(step)); return; }
      const now = ctx.currentTime;
      const inMenu = s.st.phase === 'start' || s.st.phase === 'modesel' || s.st.phase === 'gameover' || s.st.phase === 'endChoice' || s.st.phase === 'transition';
      const chord = chords[Math.floor(step/16)%4];
      const f = chord[step%4];
      const oA = ctx.createOscillator(), gA = ctx.createGain();
      oA.type = 'triangle'; oA.frequency.setValueAtTime(f * 2, now);
      gA.gain.setValueAtTime(inMenu ? 0.045 : 0.09, now); gA.gain.exponentialRampToValueAtTime(0.001, now+0.15);
      oA.connect(gA); gA.connect(out); oA.start(); oA.stop(now+0.15);
      if (step % 2 === 0 || step % 4 === 3) {
        const oB = ctx.createOscillator(), gB = ctx.createGain();
        oB.type = 'sawtooth'; const fB = [65.4, 77.8, 87.3, 58.2][Math.floor(step/8)%4] * (step % 4 === 3 ? 1.5 : 1);
        oB.frequency.setValueAtTime(fB, now);
        gB.gain.setValueAtTime(inMenu ? 0.06 : 0.12, now); gB.gain.exponentialRampToValueAtTime(0.001, now+0.20);
        oB.connect(gB); gB.connect(filt); oB.start(); oB.stop(now+0.20);
      }
      if (!inMenu) {
        if (step % 2 === 0) {
          const isKick = (step/2) % 2 === 0;
          const oD = ctx.createOscillator(), gD = ctx.createGain();
          if (isKick) {
            oD.frequency.setValueAtTime(130, now); oD.frequency.exponentialRampToValueAtTime(45, now+0.12);
            gD.gain.setValueAtTime(0.48, now); gD.gain.linearRampToValueAtTime(0.001, now+0.12);
          } else {
            oD.type = 'triangle'; oD.frequency.setValueAtTime(9000, now);
            gD.gain.setValueAtTime(0.12, now); gD.gain.exponentialRampToValueAtTime(0.001, now+0.07);
          }
          oD.connect(gD); gD.connect(out); oD.start(); oD.stop(now+0.15);
        } else {
          const oH = ctx.createOscillator(), gH = ctx.createGain();
          oH.type = 'triangle'; oH.frequency.setValueAtTime(10000, now);
          gH.gain.setValueAtTime(0.06, now); gH.gain.exponentialRampToValueAtTime(0.001, now+0.04);
          oH.connect(gH); gH.connect(out); oH.start(); oH.stop(now+0.04);
        }
      }
      let delay = 160;
      if (s.st.event) {
        if (s.st.event.type === 'lag') delay = 280;
        else delay = 100;
      }
      s.time.delayedCall(delay, () => schedMusic(step+1));
    };
    schedMusic(0);
  } catch(_) {}
}
function playSound(s, type) {
  try {
    const ctx = s.sound.context, n = ctx.currentTime;
    const p = (f, d, t='square', f2, v=0.1) => {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.connect(g); g.connect(ctx.destination);
      o.type = t; o.frequency.setValueAtTime(f, n); if(f2) o.frequency.exponentialRampToValueAtTime(f2, n+d);
      g.gain.setValueAtTime(v, n); g.gain.exponentialRampToValueAtTime(0.001, n+d); o.start(n); o.stop(n+d);
    };
    if (type === 'click') p(1100, 0.05, 'square', 0, 0.06);
    else if (type === 'select') p(660, 0.1, 'square', 1320);
    else if (type === 'pickup') p(440, 0.07, 'triangle', 880);
    else if (type === 'deploy') {
      p(523, 0.10, 'square');
      s.time.delayedCall(100, () => p(784, 0.10, 'square'));
    }
    else if (type === 'hit') p(220, 0.2, 'sawtooth', 55, 0.15);
    else if (type === 'hotfix') p(160, 0.1, 'sawtooth', 800);
    else if (type === 'revert') p(880, 0.1, 'triangle', 220);
    else if (type === 'sismo') {
      p(110, 1.2, 'sawtooth', 40, 0.45);
      const o2 = ctx.createOscillator(), g2 = ctx.createGain();
      o2.connect(g2); g2.connect(ctx.destination); o2.type = 'sawtooth';
      o2.frequency.setValueAtTime(440, n); o2.frequency.linearRampToValueAtTime(880, n+0.4); o2.frequency.linearRampToValueAtTime(440, n+0.8);
      g2.gain.setValueAtTime(0.12, n); g2.gain.linearRampToValueAtTime(0.001, n+0.9);
      o2.start(n); o2.stop(n+0.9);
    }
    else if (type === 'blackout') {
      p(600, 1.0, 'sawtooth', 30, 0.35);
    }
    else if (type === 'lag') {
      p(400, 0.15, 'square', 100, 0.15);
      s.time.delayedCall(150, () => playSound(s, 'click'));
      s.time.delayedCall(300, () => playSound(s, 'click'));
    }
    else if (type === 'gameover') {
      p(392, 0.18, 'sawtooth', 196, 0.22);
      s.time.delayedCall(160, () => p(311, 0.18, 'sawtooth', 155, 0.22));
      s.time.delayedCall(320, () => p(261, 0.35, 'sawtooth', 65, 0.25));
    }
    else if (type === 'laugh') {
      p(660, 0.06, 'square', 0, 0.18);
      s.time.delayedCall(100, () => p(660, 0.06, 'square', 0, 0.18));
      s.time.delayedCall(200, () => p(660, 0.06, 'square', 0, 0.18));
      s.time.delayedCall(300, () => p(880, 0.2, 'square', 440, 0.18));
    }
  } catch(_) {}
}
function getStorage() {
  if (window.platanusArcadeStorage) return window.platanusArcadeStorage;
  return {
    async get(k) { try { const r = localStorage.getItem(k); return r?{found:1, value:JSON.parse(r)}:{found:0}; } catch{ return {found:0}; } },
    async set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch{} }
  };
}
async function loadHighScores() { const r = await getStorage().get(STORAGE_KEY); return r.found?r.value.slice(0, MAX_SCORES):[]; }
async function persistScore(e) { const hs = await loadHighScores(), n = hs.concat(e).sort((a,b)=>b.score-a.score).slice(0, MAX_SCORES); await getStorage().set(STORAGE_KEY, n); return n; }

new Phaser.Game(config);