/* ══ QUESTIONS ══ */
const QUESTIONS = [
  {
    id: 1, difficulty: 'easy', diffLabel: 'DỄ', topic: 'Phương trình bậc nhất',
    problem: 'Giải phương trình: <span class="eq-block">2x + 5 = 13</span> — Impostor đã sai dấu!',
    hint: 'Khi chuyển <strong>+5</strong> sang vế phải, dấu phải đổi thành <strong>−5</strong>.',
    rule: '📌 Quy tắc: <strong>+a → −a</strong>, <strong>−a → +a</strong> khi chuyển vế!',
    errExp: 'Bước chuyển vế giữ nguyên dấu +5 thay vì đổi thành −5. Đúng: 2x = 13 − 5 = 8 → <strong>x = 4</strong>.',
    steps: [
      { id: 's1', label: '[GỐC]', tokens: [{ id: 't11', tx: '2x', tp: 'var' }, { id: 't12', tx: '+', tp: 'op' }, { id: 't13', tx: '5', tp: 'num' }, { id: 't14', tx: '=', tp: 'eq' }, { id: 't15', tx: '13', tp: 'num' }] },
      { id: 's2', label: '[CV]', tokens: [{ id: 't21', tx: '2x', tp: 'var' }, { id: 't22', tx: '=', tp: 'eq' }, { id: 't23', tx: '13', tp: 'num' }, { id: 't24', tx: '+', tp: 'op', err: true }, { id: 't25', tx: '5', tp: 'num' }] },
      { id: 's3', label: '[TÍNH]', tokens: [{ id: 't31', tx: '2x', tp: 'var' }, { id: 't32', tx: '=', tp: 'eq' }, { id: 't33', tx: '18', tp: 'num', err: true }] },
      { id: 's4', label: '[KQ]', tokens: [{ id: 't41', tx: 'x', tp: 'var' }, { id: 't42', tx: '=', tp: 'eq' }, { id: 't43', tx: '9', tp: 'num', err: true }] }
    ], errTokens: ['t24', 't33'], primaryErr: ['t24'],
    correction: {
      type: 'symbol', question: 'Dấu <strong>+</strong> ở bước chuyển vế phải thay bằng dấu gì?', wrongExpr: '2x = 13 <mark>+</mark> 5', symbols: ['+', '−', '×', '÷'], correct: '−',
      exp: '<strong>+5</strong> chuyển sang vế phải → <strong>−5</strong>. Vậy: 2x = 13−5=8 → <strong>x=4</strong>.'
    }
  },
  {
    id: 2, difficulty: 'easy', diffLabel: 'DỄ', topic: 'Phương trình bậc nhất',
    problem: 'Giải phương trình: <span class="eq-block">3x − 7 = 2</span> — Ai đó đã giả mạo dấu!',
    hint: 'Khi chuyển <strong>−7</strong> sang vế phải, dấu <strong>−</strong> đổi thành <strong>+</strong>.',
    rule: '📌 Dấu <strong>−</strong> khi chuyển vế phải trở thành <strong>+</strong>. Đừng giữ nguyên!',
    errExp: 'Bước chuyển vế viết 2 − 7 là sai. −7 chuyển sang phải → +7. Đúng: 3x=2+7=9 → <strong>x=3</strong>.',
    steps: [
      { id: 's1', label: '[GỐC]', tokens: [{ id: 't11', tx: '3x', tp: 'var' }, { id: 't12', tx: '−', tp: 'op' }, { id: 't13', tx: '7', tp: 'num' }, { id: 't14', tx: '=', tp: 'eq' }, { id: 't15', tx: '2', tp: 'num' }] },
      { id: 's2', label: '[CV]', tokens: [{ id: 't21', tx: '3x', tp: 'var' }, { id: 't22', tx: '=', tp: 'eq' }, { id: 't23', tx: '2', tp: 'num' }, { id: 't24', tx: '−', tp: 'op', err: true }, { id: 't25', tx: '7', tp: 'num' }] },
      { id: 's3', label: '[TÍNH]', tokens: [{ id: 't31', tx: '3x', tp: 'var' }, { id: 't32', tx: '=', tp: 'eq' }, { id: 't33', tx: '−5', tp: 'num', err: true }] },
      { id: 's4', label: '[KQ]', tokens: [{ id: 't41', tx: 'x', tp: 'var' }, { id: 't42', tx: '=', tp: 'eq' }, { id: 't43', tx: '−5/3', tp: 'num', err: true }] }
    ], errTokens: ['t24', 't33'], primaryErr: ['t24'],
    correction: {
      type: 'symbol', question: 'Dấu <strong>−</strong> ở bước chuyển vế phải thay bằng dấu gì?', wrongExpr: '3x = 2 <mark>−</mark> 7', symbols: ['+', '−', '×', '÷'], correct: '+',
      exp: '<strong>−7</strong> chuyển sang phải → <strong>+7</strong>. Vậy: 3x=2+7=9 → <strong>x=3</strong>.'
    }
  },
  {
    id: 3, difficulty: 'medium', diffLabel: 'TRUNG BÌNH', topic: 'Phương trình hai vế có ẩn',
    problem: 'Giải phương trình: <span class="eq-block">5x + 3 = 2x − 9</span> — Có kẻ đã sai 1 dấu khi chuyển vế!',
    hint: 'Khi chuyển <strong>+3</strong> sang vế phải, dấu phải đổi thành <strong>−3</strong>.',
    rule: '📌 Mỗi hạng tử khi chuyển vế đều phải <strong>đổi dấu riêng</strong>!',
    errExp: '+3 chuyển sang phải → −3. Đúng: 5x−2x=−9−3=−12 → <strong>x=−4</strong>.',
    steps: [
      { id: 's1', label: '[GỐC]', tokens: [{ id: 't11', tx: '5x', tp: 'var' }, { id: 't12', tx: '+', tp: 'op' }, { id: 't13', tx: '3', tp: 'num' }, { id: 't14', tx: '=', tp: 'eq' }, { id: 't15', tx: '2x', tp: 'var' }, { id: 't16', tx: '−', tp: 'op' }, { id: 't17', tx: '9', tp: 'num' }] },
      { id: 's2', label: '[CV]', tokens: [{ id: 't21', tx: '5x', tp: 'var' }, { id: 't22', tx: '−', tp: 'op' }, { id: 't23', tx: '2x', tp: 'var' }, { id: 't24', tx: '=', tp: 'eq' }, { id: 't25', tx: '−9', tp: 'num' }, { id: 't26', tx: '+', tp: 'op', err: true }, { id: 't27', tx: '3', tp: 'num' }] },
      { id: 's3', label: '[GỌN]', tokens: [{ id: 't31', tx: '3x', tp: 'var' }, { id: 't32', tx: '=', tp: 'eq' }, { id: 't33', tx: '−6', tp: 'num', err: true }] },
      { id: 's4', label: '[KQ]', tokens: [{ id: 't41', tx: 'x', tp: 'var' }, { id: 't42', tx: '=', tp: 'eq' }, { id: 't43', tx: '−2', tp: 'num', err: true }] }
    ], errTokens: ['t26', 't33'], primaryErr: ['t26'],
    correction: {
      type: 'symbol', question: 'Dấu <strong>+</strong> trước 3 ở vế phải phải thay bằng dấu gì?', wrongExpr: '5x − 2x = −9 <mark>+</mark> 3', symbols: ['+', '−', '×', '÷'], correct: '−',
      exp: '<strong>+3</strong> chuyển sang phải → <strong>−3</strong>. Vậy: 3x=−9−3=−12 → <strong>x=−4</strong>.'
    }
  },
  {
    id: 4, difficulty: 'medium', diffLabel: 'TRUNG BÌNH', topic: 'Phương trình có dấu ngoặc',
    problem: 'Giải phương trình: <span class="eq-block">2(x − 3) = 4</span> — Impostor bỏ ngoặc sai rồi!',
    hint: 'Bỏ ngoặc: nhân hệ số với <strong>tất cả</strong> hạng tử trong ngoặc!',
    rule: '📌 <strong>a(b−c) = a·b − a·c</strong> — nhân với MỌI hạng tử!',
    errExp: '2(x−3) phải = 2x−6, không phải 2x−3. Đúng: 2x−6=4 → 2x=10 → <strong>x=5</strong>.',
    steps: [
      { id: 's1', label: '[GỐC]', tokens: [{ id: 't11', tx: '2(x−3)', tp: 'expr' }, { id: 't12', tx: '=', tp: 'eq' }, { id: 't13', tx: '4', tp: 'num' }] },
      { id: 's2', label: '[BỎ()]', tokens: [{ id: 't21', tx: '2x', tp: 'var' }, { id: 't22', tx: '−', tp: 'op' }, { id: 't23', tx: '3', tp: 'num', err: true }, { id: 't24', tx: '=', tp: 'eq' }, { id: 't25', tx: '4', tp: 'num' }] },
      { id: 's3', label: '[CV]', tokens: [{ id: 't31', tx: '2x', tp: 'var' }, { id: 't32', tx: '=', tp: 'eq' }, { id: 't33', tx: '4', tp: 'num' }, { id: 't34', tx: '+', tp: 'op' }, { id: 't35', tx: '3', tp: 'num', err: true }] },
      { id: 's4', label: '[KQ]', tokens: [{ id: 't41', tx: 'x', tp: 'var' }, { id: 't42', tx: '=', tp: 'eq' }, { id: 't43', tx: '3.5', tp: 'num', err: true }] }
    ], errTokens: ['t23', 't35'], primaryErr: ['t23'],
    correction: {
      type: 'text', question: '2(x−3) bỏ ngoặc ra bằng gì? (vd: 2x-6)', wrongExpr: '<mark>2x − 3</mark> = 4', correctAnswers: ['2x-6', '2x - 6'], displayCorrect: '2x − 6 = 4',
      exp: '2×(x−3) = <strong>2x−6</strong>. Vậy: 2x−6=4 → 2x=10 → <strong>x=5</strong>.'
    }
  },
  {
    id: 5, difficulty: 'hard', diffLabel: 'KHÓ', topic: 'Dấu trừ trước ngoặc',
    problem: 'Giải phương trình: <span class="eq-block">3x+2 = x−(4−x)</span> — Impostor ẩn sâu nhất! 👀',
    hint: 'Dấu <strong>−</strong> trước ngoặc: <strong>đổi dấu TẤT CẢ</strong> bên trong!',
    rule: '📌 <strong>−(a−b) = −a+b</strong> — dấu trừ đảo hết dấu trong ngoặc!',
    errExp: '−(4−x) = −4+x (không phải −4−x). Đúng: 3x+2=x−4+x → x=−6.',
    steps: [
      { id: 's1', label: '[GỐC]', tokens: [{ id: 't11', tx: '3x', tp: 'var' }, { id: 't12', tx: '+', tp: 'op' }, { id: 't13', tx: '2', tp: 'num' }, { id: 't14', tx: '=', tp: 'eq' }, { id: 't15', tx: 'x', tp: 'var' }, { id: 't16', tx: '−', tp: 'op' }, { id: 't17', tx: '(4−x)', tp: 'expr' }] },
      { id: 's2', label: '[BỎ()]', tokens: [{ id: 't21', tx: '3x', tp: 'var' }, { id: 't22', tx: '+', tp: 'op' }, { id: 't23', tx: '2', tp: 'num' }, { id: 't24', tx: '=', tp: 'eq' }, { id: 't25', tx: 'x', tp: 'var' }, { id: 't26', tx: '−', tp: 'op' }, { id: 't27', tx: '4', tp: 'num' }, { id: 't28', tx: '−', tp: 'op', err: true }, { id: 't29', tx: 'x', tp: 'var' }] },
      { id: 's3', label: '[CV]', tokens: [{ id: 't31', tx: '3x', tp: 'var' }, { id: 't32', tx: '−', tp: 'op' }, { id: 't33', tx: 'x', tp: 'var' }, { id: 't34', tx: '−', tp: 'op' }, { id: 't35', tx: 'x', tp: 'var', err: true }, { id: 't36', tx: '=', tp: 'eq' }, { id: 't37', tx: '−4', tp: 'num' }, { id: 't38', tx: '−', tp: 'op' }, { id: 't39', tx: '2', tp: 'num' }] },
      { id: 's4', label: '[GỌN]', tokens: [{ id: 't41', tx: 'x', tp: 'var' }, { id: 't42', tx: '=', tp: 'eq' }, { id: 't43', tx: '−6', tp: 'num', err: true }] },
      { id: 's5', label: '[KQ]', tokens: [{ id: 't51', tx: 'x', tp: 'var' }, { id: 't52', tx: '=', tp: 'eq' }, { id: 't53', tx: '−6', tp: 'num', err: true }] }
    ], errTokens: ['t28', 't35'], primaryErr: ['t28'],
    correction: {
      type: 'symbol', question: 'Dấu <strong>−</strong> trước x sau khi bỏ ngoặc phải là dấu gì?', wrongExpr: 'x − 4 <mark>−</mark> x', symbols: ['+', '−', '×', '÷'], correct: '+',
      exp: '−(4−x) = −4<strong>+x</strong>. Vậy: 3x+2=x−4+x → x=−6.'
    }
  }
];

/* ══ BRIEFING TEXTS ══ */
const BRIEFS = [
  "🚨 BRIEFING MẬT! Có kẻ IMPOSTOR đã làm sai dấu trong bài giải. Nhiệm vụ: tìm ra hạng tử bị sai dấu khi chuyển vế. Nhớ: +a → −a khi sang vế khác!",
  "🔍 ĐIỀU TRA! Ai đó đã cố tình không đổi dấu khi chuyển vế. Nhìn kỹ từng bước — dấu cộng/trừ có bị giữ nguyên không? Tìm ra và bắt ngay!",
  "⚠️ CAUTION! Vụ án này phức tạp hơn — có thể bị đánh lạc hướng. Kiểm tra từng hạng tử được chuyển vế. Mỗi hạng tử phải đổi dấu riêng!",
  "🔴 RED FLAG! Impostor lần này giấu lỗi trong bước bỏ ngoặc. Nhớ: a(b−c) = a·b − a·c. Phải nhân với MỌI hạng tử trong ngoặc!",
  "💀 FINAL TASK! Impostor khó nhất đang ẩn náu trong dấu trừ trước ngoặc. Quy tắc: −(a−b) = −a+b. Đây là vụ cuối — không được sai!",
];
const CREW_EMOJIS = ['🕵️', '🔍', '📁', '🗝️', '💼', '🔦', '📋', '🧩'];

/* ══ XP SYSTEM ══ */
const XP_RANKS = [
  { level: 1, name: 'Tập Sự', emoji: '🔍', color: '#8892a4', required: 0, next: 100 },
  { level: 2, name: 'Thám Tử Mới', emoji: '🕵', color: '#2ed573', required: 100, next: 150 },
  { level: 3, name: 'Điều Tra Viên', emoji: '📋', color: '#1a4f7a', required: 250, next: 250 },
  { level: 4, name: 'Thám Tử Cấp 2', emoji: '🔎', color: '#5a3278', required: 500, next: 400 },
  { level: 5, name: 'Thám Tử Cấp 3', emoji: '⚖️', color: '#f5c518', required: 900, next: 600 },
  { level: 6, name: 'Thám Tử Cấp 4', emoji: '🗝', color: '#f5c518', required: 1500, next: 1000 },
  { level: 7, name: 'Thám Tử Trưởng', emoji: '🎯', color: '#ff6314', required: 2500, next: 1500 },
  { level: 8, name: 'Đại Thám Tử', emoji: '💼', color: '#ff4757', required: 4000, next: 2000 },
  { level: 9, name: 'Thám Tử Ưu Tú', emoji: '🏅', color: '#8c0f1e', required: 6000, next: 3000 },
  { level: 10, name: 'Thám Tử Huyền Thoại', emoji: '👑', color: '#8c0f1e', required: 9000, next: 0 },
];

const XP = {
  getProfile(playerName) {
    const profiles = JSON.parse(localStorage.getItem('erase_profiles') || '{}');
    if (!profiles[playerName]) profiles[playerName] = { xp: 0 };
    return profiles[playerName];
  },
  saveProfile(playerName, xpAdd) {
    const profiles = JSON.parse(localStorage.getItem('erase_profiles') || '{}');
    if (!profiles[playerName]) profiles[playerName] = { xp: 0 };
    profiles[playerName].xp += xpAdd;
    localStorage.setItem('erase_profiles', JSON.stringify(profiles));
    return profiles[playerName];
  },
  getRank(xp) {
    let currentRank = XP_RANKS[0];
    for (let i = 0; i < XP_RANKS.length; i++) {
      if (xp >= XP_RANKS[i].required) currentRank = XP_RANKS[i];
    }
    return currentRank;
  },
  renderWelcome() {
    const nameInput = document.getElementById('player-name');
    if (!nameInput) return;
    const name = nameInput.value.trim() || 'Thám Tử';
    const profile = this.getProfile(name);
    const xp = profile.xp;
    const rank = this.getRank(xp);
    
    document.getElementById('wx-rank').innerHTML = `${rank.emoji} ${rank.name}`;
    document.getElementById('wx-rank').style.color = rank.color;
    
    const fill = document.getElementById('wx-fill');
    if(fill) fill.style.background = rank.color;
    
    if (rank.level === 10) {
      const elText = document.getElementById('wx-text');
      if(elText) elText.textContent = `${xp} XP (MAX)`;
      if(fill) fill.style.width = '100%';
      const elNext = document.getElementById('wx-next');
      if(elNext) elNext.textContent = 'Đã đạt cấp bậc cao nhất!';
    } else {
      const xpInLevel = xp - rank.required;
      const elText = document.getElementById('wx-text');
      if(elText) elText.textContent = `${xp} / ${rank.required + rank.next} XP`;
      const pct = Math.min(100, Math.round((xpInLevel / rank.next) * 100));
      if(fill) fill.style.width = `${pct}%`;
      const remain = (rank.required + rank.next) - xp;
      const elNext = document.getElementById('wx-next');
      if(elNext) elNext.textContent = `Cần ${remain} XP nữa để lên cấp ${XP_RANKS[rank.level].name}`;
    }
  },
  calcGameXP(score, hp, bestStreak, perfectCount) {
    let xp = Math.floor(score / 3);
    if (hp === 3) xp += 20;
    if (bestStreak >= 5) xp += 15;
    if (perfectCount > 0) xp += perfectCount * 10;
    return xp;
  }
};

/* ══ STATE ══ */
const S = {
  name: 'Thám Tử', qIdx: 0, score: 0, qResults: [],
  analytics: { dAttempts: [], cAttempts: [], dTimes: [], cTimes: [], wrongClicks: [], extra: [] },
  phase: 'detect', dAttempt: 0, cAttempt: 0,
  selected: new Set(), dStart: 0, cStart: 0, dScore: 0, cScore: 0,
  done: false, timer: null, elapsed: 0, mcSel: null, active: false,
  activeQuestions: [],
  hp: 3, maxHp: 3, streak: 0, bestStreak: 0, comboMult: 1,
};

/* ══ UTILS ══ */
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  window.scrollTo(0, 0);
}
function toast(msg, type = '') {
  const c = document.getElementById('toast-container');
  const d = document.createElement('div'); d.className = 'toast' + (type ? ` t-${type}` : ''); d.textContent = msg; c.appendChild(d);
  setTimeout(() => { d.style.opacity = '0'; d.style.transition = 'opacity .3s'; setTimeout(() => d.remove(), 300) }, 2800);
}
function showFB(id, html, type) {
  const el = document.getElementById(id); el.className = `feedback-card show fc-${type}`; el.innerHTML = html;
  applyMathFormatting(el);
}
function hideFB(id) { document.getElementById(id).className = 'feedback-card' }
function fmt(s) { return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}` }
function pct(a, b) { return b ? Math.round(a / b * 100) : 0 }
function formatMathText(text) {
  const escaped = String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  const withFractions = escaped.replace(
    /([−-]?[A-Za-z0-9.]+)\s*\/\s*([−-]?[A-Za-z0-9.]+)/g,
    '<span class="math-frac"><span class="math-frac-top">$1</span><span class="math-frac-bottom">$2</span></span>'
  );
  return withFractions.replace(
    /([A-Za-z0-9.]+)\s*\^\s*([−-]?[A-Za-z0-9.]+)/g,
    '$1<sup class="math-sup">$2</sup>'
  );
}
function applyMathFormatting(rootEl) {
  if (!rootEl) return;
  const walker = document.createTreeWalker(rootEl, NodeFilter.SHOW_TEXT, null);
  const targets = [];
  let node = walker.nextNode();
  while (node) {
    const txt = node.nodeValue || '';
    if (/[\/^]/.test(txt) && txt.trim()) targets.push(node);
    node = walker.nextNode();
  }
  targets.forEach(textNode => {
    const html = formatMathText(textNode.nodeValue || '');
    if (!html || html === textNode.nodeValue) return;
    const wrap = document.createElement('span');
    wrap.innerHTML = html;
    textNode.replaceWith(wrap);
  });
}
function updateQScore() {
  if (S.done) return;
  let maxD = 0;
  if (S.phase === 'detect') {
    maxD = S.dAttempt === 0 ? Math.round(10 * S.comboMult) : (S.dAttempt === 1 ? Math.round(5 * S.comboMult) : 0);
  } else {
    maxD = S.dScore;
  }
  let maxC = 0;
  if (S.cAttempt === 0) maxC = Math.round(10 * S.comboMult);
  else if (S.cAttempt === 1) maxC = Math.round(5 * S.comboMult);
  
  let bonus = 0;
  if (S.phase === 'detect' && S.dAttempt === 0) bonus = 5;
  else if (S.phase === 'correct' && S.dScore > 0 && S.cAttempt === 0) bonus = 5;

  const qsEl = document.getElementById('paper-q-score');
  if (qsEl) qsEl.textContent = maxD + maxC + bonus;
}

/* ══ TIMER ══ */
function startTimer() { clearInterval(S.timer); S.elapsed = 0; tickTimer(); S.timer = setInterval(tickTimer, 1000) }
function stopTimer() { clearInterval(S.timer); S.timer = null }
function tickTimer() {
  S.elapsed++;
  const el = document.getElementById('timer-disp');
  el.textContent = fmt(S.elapsed);
  el.className = 'timer-val' + (S.elapsed > 90 ? ' danger' : S.elapsed > 60 ? ' warn' : '');
}

/* ══ HP ══ */
const HP = {
  render() {
    for (let i = 1; i <= 3; i++) {
      const h = document.getElementById(`heart-${i}`); if (!h) return;
      h.className = 'heart' + (i > S.hp ? ' lost' : '');
    }
  },
  lose() {
    if (S.hp <= 0) return;
    const dying = document.getElementById(`heart-${S.hp}`);
    if (dying) { dying.className = 'heart shake'; setTimeout(() => { dying.className = 'heart lost'; }, 500); }
    S.hp--; this.render();
    if (S.hp <= 0) setTimeout(() => Game.gameOver(), 700);
  },
  pulse() {
    const h = document.getElementById(`heart-${Math.min(S.hp, 3)}`);
    if (h) { h.classList.add('pulse'); setTimeout(() => h.classList.remove('pulse'), 600); }
  },
  reset() { S.hp = S.maxHp; this.render(); }
};

/* ══ STREAK ══ */
const Streak = {
  inc() {
    S.streak++; if (S.streak > S.bestStreak) S.bestStreak = S.streak;
    S.comboMult = S.streak >= 5 ? 2 : S.streak >= 3 ? 1.5 : 1;
    this.render(); this._popup();
  },
  break() {
    if (S.streak >= 2) this._breakPopup();
    S.streak = 0; S.comboMult = 1; this.render();
  },
  render() {
    const pill = document.getElementById('streak-pill');
    const num = document.getElementById('streak-num');
    const lbl = document.getElementById('streak-label');
    if (!pill) return;
    num.textContent = S.streak;
    if (S.streak === 0) { pill.className = 'streak-pill s0'; lbl.textContent = 'STREAK'; }
    else if (S.streak < 3) { pill.className = 'streak-pill s1'; lbl.textContent = 'STREAK'; }
    else if (S.streak < 5) { pill.className = 'streak-pill s2'; lbl.textContent = '×1.5'; }
    else { pill.className = 'streak-pill s3'; lbl.textContent = '×2.0'; }
  },
  _popup() {
    if (S.streak < 2) return;
    const msgs = { 2: '2 LIÊN TIẾP! 🔥', 3: 'COMBO ×3 🔥🔥', 5: 'COMBO ×5 ⚡⚡', 7: 'UNSTOPPABLE 💥' };
    const msg = msgs[S.streak]; if (!msg) return;
    const el = document.createElement('div'); el.className = 'float-popup';
    el.style.color = S.streak >= 5 ? '#ff6314' : 'var(--yellow)';
    el.textContent = msg; document.body.appendChild(el); setTimeout(() => el.remove(), 1500);
  },
  _breakPopup() {
    const el = document.createElement('div'); el.className = 'float-popup';
    el.style.color = 'var(--red)'; el.style.top = '35%';
    el.textContent = '💔 STREAK VỠ!'; document.body.appendChild(el); setTimeout(() => el.remove(), 1200);
  },
  reset() { S.streak = 0; S.bestStreak = 0; S.comboMult = 1; this.render(); }
};

/* ══ BRIEFING ══ */
const Briefing = {
  _resolve: null,
  show(idx, q) {
    return new Promise(resolve => {
      this._resolve = resolve;
      const overlay = document.getElementById('briefing-overlay');
      const pad = String(idx + 1).padStart(3, '0');
      document.getElementById('briefing-case-num').textContent = `VỤ ÁN ÁN #${pad}`;
      document.getElementById('briefing-title').textContent = q.topic;
      const crewEl = document.getElementById('briefing-crew-emoji');
      crewEl.textContent = CREW_EMOJIS[idx % CREW_EMOJIS.length];
      const diffEl = document.getElementById('briefing-diff');
      diffEl.textContent = q.diffLabel || 'DỄ';
      diffEl.className = 'briefing-diff-badge ' + (q.difficulty === 'easy' ? 'cb-easy' : q.difficulty === 'hard' ? 'cb-hard' : 'cb-medium');
      const okBtn = document.getElementById('btn-start-mission');
      okBtn.classList.remove('ready');
      overlay.style.display = 'flex'; overlay.style.animation = '';
      void overlay.offsetWidth; overlay.style.animation = 'fadeIn .3s ease';
      this._type(BRIEFS[idx % BRIEFS.length], () => { setTimeout(() => okBtn.classList.add('ready'), 200) });
    });
  },
  _type(text, onDone) {
    const el = document.getElementById('briefing-text');
    el.innerHTML = '<span class="cursor"></span>';
    let i = 0;
    const iv = setInterval(() => {
      if (i >= text.length) { clearInterval(iv); el.innerHTML = text + '<span class="cursor"></span>'; if (onDone) onDone(); return; }
      el.innerHTML = text.slice(0, ++i) + '<span class="cursor"></span>';
    }, 20);
  },
  dismiss() {
    document.getElementById('briefing-overlay').style.display = 'none';
    if (this._resolve) { this._resolve(); this._resolve = null; }
  }
};

/* ══ RENDER ══ */
function renderQ(idx) {
  const q = S.activeQuestions[idx];
  S.phase = 'detect'; S.dAttempt = 0; S.cAttempt = 0;
  S.selected = new Set(); S.dScore = 0; S.cScore = 0;
  S.done = false; S.mcSel = null; S.dStart = Date.now();

  const pad = String(idx + 1).padStart(3, '0');
  document.getElementById('hdr-q-chip').textContent = `VỤ ÁN ${idx + 1}/${S.activeQuestions.length}`;
  document.getElementById('progress-fill').style.width = `${(idx / S.activeQuestions.length) * 100}%`;
  document.getElementById('paper-title').textContent = `VỤ ÁN ÁN #${pad}`;
  document.getElementById('paper-qnum').textContent = `Điều tra: ${q.topic}`;
  updateQScore();
  const mainProblem = document.getElementById('q-text-main');
  mainProblem.innerHTML = q.problem;
  applyMathFormatting(mainProblem);
  document.getElementById('hint-content').innerHTML = q.hint || 'Chú ý dấu khi chuyển vế.';
  document.getElementById('rule-content').innerHTML = q.rule || 'Mỗi hạng tử chuyển vế phải đổi dấu!';

  // Case badge difficulty
  const badge = document.getElementById('case-diff-badge');
  badge.textContent = q.diffLabel || 'DỄ';
  badge.className = 'case-badge ' + (q.difficulty === 'easy' ? 'cb-easy' : q.difficulty === 'hard' ? 'cb-hard' : 'cb-medium');

  renderSteps(q); setDetectPhase();
  document.getElementById('correction-box').classList.remove('show');
  hideFB('feedback-main'); hideFB('feedback-correction');
  renderStamps(idx); startTimer();

  const card = document.getElementById('case-card');
  if (card) { card.style.animation = 'none'; void card.offsetWidth; card.style.animation = ''; }
}

function renderSteps(q) {
  const blk = document.getElementById('solution-block'); blk.innerHTML = '';
  q.steps.forEach(step => {
    const row = document.createElement('div'); row.className = 'step-line';
    const lbl = document.createElement('div'); lbl.className = 'step-label'; lbl.textContent = step.label;
    const tks = document.createElement('div'); tks.className = 'step-tokens';
    step.tokens.forEach(tk => {
      const el = document.createElement('span'); el.className = 'token'; el.id = `tk-${tk.id}`; el.innerHTML = formatMathText(tk.tx);
      if (tk.tp === 'op') el.classList.add('op');
      if (tk.tp === 'eq') el.classList.add('eq');
      if (tk.tp === 'plain') el.classList.add('plain');
      el.addEventListener('click', () => onTokenClick(tk.id));
      tks.appendChild(el);
    });
    row.appendChild(lbl); row.appendChild(tks); blk.appendChild(row);
  });
}

function setDetectPhase() {
  const tag = document.getElementById('phase-tag');
  tag.className = 'phase-tag ph-detect';
  document.getElementById('phase-tag-label').textContent = '🔍 GĐ1 — TRUY TÌM NGHI PHẠM';
  document.getElementById('phase-desc').innerHTML = '<strong>Click vào dấu/số bị làm sai</strong> rồi bấm Bắt!';
  document.getElementById('action-bar-detect').style.display = 'flex';
  document.getElementById('btn-detect').disabled = true;
  document.getElementById('btn-correct').disabled = false;
  setPips('d', 2, 0); setPips('c', 2, 0);
}

function setCorrectPhase(q) {
  S.phase = 'correct';
  const tag = document.getElementById('phase-tag');
  tag.className = 'phase-tag ph-correct';
  document.getElementById('phase-tag-label').textContent = '✏️ GĐ2 — SỬA LẠI BẰNG CHỨNG';
  document.getElementById('phase-desc').innerHTML = 'Nghi phạm lộ mặt — hãy <strong>sửa lại cho đúng</strong>!';

  const box = document.getElementById('correction-box'); box.classList.add('show'); S.cStart = Date.now();
  document.getElementById('cb-question-text').innerHTML = q.correction.question;
  document.getElementById('cb-wrong-expr').innerHTML = q.correction.wrongExpr;
  applyMathFormatting(document.getElementById('cb-question-text'));
  applyMathFormatting(document.getElementById('cb-wrong-expr'));

  const area = document.getElementById('correction-input-area'); area.innerHTML = '';
  const type = q.correction.type;
  if (type === 'symbol') {
    const kb = document.createElement('div'); kb.className = 'symbol-keyboard';
    q.correction.symbols.forEach(sym => {
      const btn = document.createElement('button'); btn.className = 'sym-key'; btn.textContent = sym; btn.id = 'sym-' + sym.charCodeAt(0);
      btn.addEventListener('click', () => pickSymbol(sym, q.correction.symbols)); kb.appendChild(btn);
    }); area.appendChild(kb);
  } else if (type === 'mc') {
    const mc = document.createElement('div'); mc.className = 'mc-options';
    ['A', 'B', 'C', 'D'].slice(0, q.correction.opts.length).forEach((l, i) => {
      const d = document.createElement('div'); d.className = 'mc-opt'; d.id = 'mco-' + i;
      d.innerHTML = `<span class="mc-letter">${l}</span>${q.correction.opts[i]}`;
      d.addEventListener('click', () => pickMC(i, q.correction.opts.length)); mc.appendChild(d);
    }); area.appendChild(mc);
  } else {
    const wrap = document.createElement('div'); wrap.className = 'answer-line';
    const lbl = document.createElement('span'); lbl.className = 'answer-label'; lbl.textContent = 'ĐÁP ÁN:';
    const inp = document.createElement('input'); inp.type = 'text'; inp.className = 'answer-input'; inp.id = 'ans-input';
    inp.placeholder = 'Nhập biểu thức đúng…';
    inp.addEventListener('keydown', e => { if (e.key === 'Enter') Game.submitCorrection(); });
    wrap.appendChild(lbl); wrap.appendChild(inp); area.appendChild(wrap);
    setTimeout(() => inp.focus(), 150);
  }
  document.getElementById('btn-correct').disabled = false;
  setPips('c', 2, 0); hideFB('feedback-correction');
  updateQScore();
  setTimeout(() => box.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 150);
}

function pickMC(idx, total) {
  for (let i = 0; i < total; i++) { const e = document.getElementById('mco-' + i); if (e) e.className = 'mc-opt'; }
  document.getElementById('mco-' + idx).className = 'mc-opt selected'; S.mcSel = idx;
}
function pickSymbol(sym, all) {
  all.forEach(s => { const b = document.getElementById('sym-' + s.charCodeAt(0)); if (b) b.className = 'sym-key'; });
  const c = document.getElementById('sym-' + sym.charCodeAt(0)); if (c) c.className = 'sym-key selected'; S.mcSel = sym;
}
function setPips(prefix, total, used) {
  const pfx = prefix === 'd' ? 'd' : 'c';
  for (let i = 1; i <= total; i++) {
    const el = document.getElementById(`${pfx}pip-${i}`);
    if (el) el.className = 'pip' + (i <= used ? ' spent' : prefix === 'd' ? ' live' : ' live-y');
  }
}
function renderStamps(cur) {
  const c = document.getElementById('q-stamps'); c.innerHTML = '';
  S.activeQuestions.forEach((_, i) => {
    const d = document.createElement('div'); d.className = 'q-stamp'; d.id = `qs-${i}`; d.textContent = i + 1;
    const r = S.qResults[i];
    if (i === cur) d.classList.add('current');
    if (r) { if (r.perfect) d.classList.add('done-ok'); else if (r.passed) d.classList.add('done-warn'); else d.classList.add('done-fail'); }
    c.appendChild(d);
  });
}
function updateScoreUI() {
  const sv = document.getElementById('hdr-score');
  sv.textContent = S.score; sv.classList.remove('bump'); void sv.offsetWidth; sv.classList.add('bump');
  document.getElementById('side-score').textContent = S.score;
  document.getElementById('ss-det').textContent = S.qResults.filter(r => r && r.dOk).length;
  document.getElementById('ss-cor').textContent = S.qResults.filter(r => r && r.cOk).length;
  document.getElementById('ss-perf').textContent = S.qResults.filter(r => r && r.perfect).length;
}
function wrongFlash() {
  const sg = document.getElementById('screen-game');
  sg.classList.remove('wrong-flash'); void sg.offsetWidth; sg.classList.add('wrong-flash');
  setTimeout(() => sg.classList.remove('wrong-flash'), 500);
}
function onTokenClick(tid) {
  if (S.done || S.phase !== 'detect') return;
  const el = document.getElementById(`tk-${tid}`);
  if (!el || el.classList.contains('plain')) return;
  if (S.selected.has(tid)) { S.selected.delete(tid); el.classList.remove('selected'); }
  else { S.selected.add(tid); el.classList.add('selected'); }
  document.getElementById('btn-detect').disabled = S.selected.size === 0;
}

/* ══ GAME ══ */
const Game = {
  startGame() {
    S.name = document.getElementById('player-name').value.trim() || 'Thám Tử';
    S.qIdx = 0; S.score = 0; S.qResults = [];
    S.analytics = { dAttempts: [], cAttempts: [], dTimes: [], cTimes: [], wrongClicks: [], extra: [] };
    S.active = true;
    HP.reset(); Streak.reset();
    const pool = window._bankQuestions || QUESTIONS;
    const count = window._bankQCount || Math.min(5, pool.length);
    const shuffled = [...pool].sort(() => Math.random() - .5);
    S.activeQuestions = shuffled.slice(0, Math.min(count, shuffled.length));
    showScreen('screen-game');
    Briefing.show(0, S.activeQuestions[0]).then(() => renderQ(0));
  },
  exitToMenu() { stopTimer(); S.active = false; showScreen('screen-welcome'); },
  restartGame() { this.startGame(); },
  showDashboard() { showScreen('screen-dashboard'); Dashboard.init(); },
  gameOver() {
    stopTimer(); showScreen('screen-gameover');
    document.getElementById('go-score').textContent = S.score;
    const p = pct(S.score, S.activeQuestions.length * 25);
    let msg = 'Ôn lại quy tắc chuyển vế rồi nhận vụ mới! +a → −a, −a → +a 💪';
    if (p >= 50) msg = 'Suýt rồi! Lần sau cẩn thận hơn là phá án ngay!';
    document.getElementById('go-msg').textContent = msg;
  },

  submitDetection() {
    if (S.dAttempt >= 2) return;
    const q = S.activeQuestions[S.qIdx];
    const sel = [...S.selected];
    if (!sel.length) { toast('Click chọn dấu nghi ngờ trước!', ''); return; }
    document.getElementById('btn-detect').disabled = true;
    S.dAttempt++; setPips('d', 2, S.dAttempt);
    if (!S.analytics.wrongClicks[S.qIdx]) S.analytics.wrongClicks[S.qIdx] = 0;
    const correctFound = sel.filter(t => q.errTokens.includes(t));
    const wrongSel = sel.filter(t => !q.errTokens.includes(t));
    S.analytics.wrongClicks[S.qIdx] += wrongSel.length;
    const allPrimary = q.primaryErr.every(e => sel.includes(e));

    if (allPrimary && wrongSel.length === 0) {
      const basePts = S.dAttempt === 1 ? 10 : 5;
      const pts = Math.round(basePts * S.comboMult);
      S.dScore = pts; S.score += pts; updateScoreUI();
      q.errTokens.forEach(t => { const e = document.getElementById(`tk-${t}`); if (e) { e.classList.remove('selected'); e.classList.add('found-correct'); } });
      S.analytics.dAttempts[S.qIdx] = S.dAttempt;
      S.analytics.dTimes[S.qIdx] = Math.round((Date.now() - S.dStart) / 1000);
      document.getElementById('btn-detect').disabled = true;
      const comboMsg = S.comboMult > 1 ? ` 🔥 COMBO ×${S.comboMult}!` : '';
      const praise = S.dAttempt === 1 ? '🎯 NGHI PHẠM BẮT ĐƯỢC! Ngay lần đầu!' : '👁️ ĐÚNG RỒI! Lần này tinh ý hơn!';
      showFB('feedback-main',
        `<span class="fc-icon">${S.dAttempt === 1 ? '🎯' : '👁️'}</span>` +
        `<div class="fc-body"><strong>${praise}</strong> <em style="color:var(--green)">+${pts} điểm${comboMsg}</em>` +
        `<div class="fc-rule">${q.rule}</div>` +
        `<button class="btn-next" onclick="Game.proceedToCorrection()">Tiếp theo: Sửa bằng chứng! ✏️</button>` +
        `</div>`, 'correct');
    } else if (S.dAttempt < 2) {
      let msg = '❌ Chưa đúng — còn 1 lần điều tra nữa!';
      if (correctFound.length > 0) msg += ` (Phát hiện ${correctFound.length} manh mối)`;
      if (wrongSel.length > 0) msg += ' Bỏ bớt chỗ chọn nhầm.';
      wrongFlash();
      showFB('feedback-main',
        `<span class="fc-icon">❌</span><div class="fc-body"><strong>${msg}</strong><br><em style="color:var(--white-ghost)">💡 Gợi ý: xem kỹ bước chuyển vế — dấu có bị giữ nguyên không?</em></div>`, 'wrong');
      document.getElementById('btn-detect').disabled = S.selected.size === 0;
      updateQScore();
    } else {
      q.errTokens.forEach(t => { const e = document.getElementById(`tk-${t}`); if (e) { e.classList.remove('selected'); e.classList.add('revealed-error'); } });
      S.analytics.dAttempts[S.qIdx] = 'X';
      S.analytics.dTimes[S.qIdx] = Math.round((Date.now() - S.dStart) / 1000);
      S.dScore = 0; document.getElementById('btn-detect').disabled = true;
      wrongFlash(); HP.lose(); Streak.break();
      showFB('feedback-main',
        `<span class="fc-icon">💀</span>` +
        `<div class="fc-body"><strong>Impostor thoát! 💔 Mất 1 mạng sống.</strong> Dấu sai đã bị đánh dấu đỏ.` +
        `<div class="fc-rule">${q.rule}</div>` +
        `<button class="btn-next warn" onclick="Game.proceedToCorrection()">Vẫn thử sửa → 🔧</button>` +
        `</div>`, 'warn');
      updateQScore();
    }
  },

  proceedToCorrection() {
    hideFB('feedback-main'); setCorrectPhase(S.activeQuestions[S.qIdx]);
  },

  submitCorrection() {
    if (document.getElementById('btn-correct').disabled || S.done) return;
    const q = S.activeQuestions[S.qIdx]; let ok = false;
    const ctype = q.correction.type;
    if (ctype === 'symbol') {
      if (S.mcSel === null) { toast('Chọn một dấu!', ''); return; }
      ok = (S.mcSel === q.correction.correct);
      q.correction.symbols.forEach(s => {
        const b = document.getElementById('sym-' + s.charCodeAt(0)); if (!b) return;
        if (s === S.mcSel) b.className = 'sym-key ' + (ok ? 'correct' : 'wrong');
        else if (!ok && s === q.correction.correct) b.className = 'sym-key correct reveal';
        else b.className = 'sym-key';
      });
    } else if (ctype === 'mc') {
      if (S.mcSel === null) { toast('Chọn một đáp án!', ''); return; }
      ok = (S.mcSel === q.correction.correct);
      const el = document.getElementById('mco-' + S.mcSel); if (el) el.className = 'mc-opt ' + (ok ? 'correct' : 'wrong');
    } else {
      const inp = document.getElementById('ans-input');
      const val = (inp ? inp.value.trim() : '').replace(/\s+/g, '');
      if (!val) { toast('Nhập đáp án!', ''); return; }
      ok = q.correction.correctAnswers.some(a => a.replace(/\s+/g, '') === val);
      if (inp) inp.className = 'answer-input ' + (ok ? 'correct-input' : 'wrong-input');
    }
    S.cAttempt++; setPips('c', 2, S.cAttempt);

    if (ok) {
      const basePts = S.cAttempt === 1 ? 10 : 5;
      const pts = Math.round(basePts * S.comboMult);
      S.cScore = pts; S.score += pts;
      let bonus = 0;
      if (S.dScore > 0 && S.cAttempt === 1) { bonus = 5; S.score += 5; }
      Streak.inc();
      if (bonus) HP.pulse();
      updateScoreUI();
      const qsEl = document.getElementById('paper-q-score');
      qsEl.textContent = S.dScore + S.cScore + bonus;
      qsEl.classList.remove('pop'); void qsEl.offsetWidth; qsEl.classList.add('pop');
      S.analytics.cAttempts[S.qIdx] = S.cAttempt;
      S.analytics.cTimes[S.qIdx] = Math.round((Date.now() - S.cStart) / 1000);
      this.recordResult(true, bonus > 0);
      if (bonus) spawnConfetti();
      document.getElementById('btn-correct').disabled = true;
      const nextLbl = S.qIdx + 1 >= S.activeQuestions.length ? '🏁 Xem kết quả →' : 'Vụ án tiếp theo →';
      const bonusMsg = bonus ? `<br><strong style="color:var(--yellow)">⭐ PERFECT! +${bonus} bonus điểm!</strong>` : '';
      const comboMsg = S.comboMult > 1 ? `<br><em style="color:var(--yellow)">🔥 COMBO ×${S.comboMult} đang hoạt động!</em>` : '';
      const praise = S.cAttempt === 1 ? '✅ VỤ ÁN ÁN PHÁ GIẢI! GGWP!' : '✅ Đúng rồi! Tiếp tục phát huy!';
      showFB('feedback-correction',
        `<span class="fc-icon">✅</span>` +
        `<div class="fc-body"><strong>${praise}</strong>${bonusMsg}${comboMsg}` +
        `<div class="fc-explain">${q.correction.exp}</div>` +
        `<div class="fc-full">${q.errExp}</div>` +
        `<button class="btn-next" onclick="Game.nextQ()">${nextLbl}</button>` +
        `</div>`, 'correct');
    } else if (S.cAttempt < 2) {
      S.mcSel = null;
      if (ctype === 'symbol') q.correction.symbols.forEach(s => { const b = document.getElementById('sym-' + s.charCodeAt(0)); if (b) b.className = 'sym-key'; });
      document.getElementById('btn-correct').disabled = false;
      showFB('feedback-correction', `<span class="fc-icon">❌</span><div class="fc-body"><strong>Sai rồi — còn 1 lần nữa! 😅</strong><br><em style="color:var(--white-ghost)">Xem gợi ý bên phải và thử lại!</em></div>`, 'wrong');
      updateQScore();
    } else {
      if (ctype === 'symbol') q.correction.symbols.forEach(s => { const b = document.getElementById('sym-' + s.charCodeAt(0)); if (b) b.className = 'sym-key' + (s === q.correction.correct ? ' correct reveal' : ''); });
      else if (ctype === 'mc') { const c = document.getElementById('mco-' + q.correction.correct); if (c) c.className = 'mc-opt correct'; }
      const disp = ctype === 'symbol' ? q.correction.correct : (q.correction.displayCorrect || q.correction.correctAnswers?.[0] || '');
      S.analytics.cAttempts[S.qIdx] = 'X'; S.cScore = 0;
      S.analytics.cTimes[S.qIdx] = Math.round((Date.now() - S.cStart) / 1000);
      document.getElementById('paper-q-score').textContent = S.dScore;
      this.recordResult(false, false); document.getElementById('btn-correct').disabled = true;
      wrongFlash(); HP.lose(); Streak.break();
      const nextLbl2 = S.qIdx + 1 >= S.activeQuestions.length ? '🏁 Xem kết quả →' : 'Vụ án tiếp theo →';
      showFB('feedback-correction',
        `<span class="fc-icon">💀</span>` +
        `<div class="fc-body"><strong>💔 Mất mạng! Đáp án là: <em style="color:var(--yellow)">${disp}</em></strong>` +
        `<div class="fc-explain">${q.correction.exp}</div>` +
        `<div class="fc-full">${q.errExp}</div>` +
        `<button class="btn-next warn" onclick="Game.nextQ()">${nextLbl2}</button>` +
        `</div>`, 'wrong');
    }
  },

  recordResult(cOk, perfect) {
    S.done = true;
    S.qResults[S.qIdx] = { dOk: S.dScore > 0, cOk, perfect, passed: S.dScore > 0 || cOk, total: S.dScore + S.cScore + (perfect ? 5 : 0) };
  },
  nextQ() {
    stopTimer(); renderStamps(S.qIdx);
    if (S.qIdx + 1 >= S.activeQuestions.length) { this.showResults(); return; }
    S.qIdx++;
    Briefing.show(S.qIdx, S.activeQuestions[S.qIdx]).then(() => renderQ(S.qIdx));
  },

  showResults() {
    stopTimer(); showScreen('screen-results');
    const maxPts = S.activeQuestions.length * 25;
    const p = pct(S.score, maxPts);
    const HẠNGS = [
      { min: 95, grade: 'S', title: '👑 THÁM TỬ HUYỀN THOẠI', bar: '#ffd700', barBg: 2 },
      { min: 80, grade: 'A', title: '🌟 THÁM TỬ TRƯỞNG', bar: '#ffd32a', barBg: 1 },
      { min: 65, grade: 'B', title: '🔵 THÁM TỬ CẤP CAO', bar: '#1e90ff', barBg: 0 },
      { min: 50, grade: 'C', title: '🟢 THÁM TỬ CẤP 2', bar: '#2ed573', barBg: 0 },
      { min: 35, grade: 'D', title: '😅 THÁM TỬ TẬP SỰ', bar: '#8892a4', barBg: 0 },
      { min: 0, grade: 'F', title: '💀 BỊ LOẠI — CẦN ÔN TẬP', bar: '#ff4757', barBg: 0 },
    ];
    const rank = HẠNGS.find(r => p >= r.min) || HẠNGS[HẠNGS.length - 1];
    const heroEl = document.getElementById('res-hero');
    heroEl.className = 'res-hero rank-' + rank.grade;
    document.getElementById('res-grade').textContent = rank.grade;
    document.getElementById('res-rank-wrap').className = 'res-rank-wrap rank-' + rank.grade;
    document.getElementById('res-name').textContent = S.name;
    document.getElementById('res-rank-title').textContent = rank.title;
    document.getElementById('res-rank-title').className = 'res-rank-title rank-' + rank.grade;
    setTimeout(() => { document.getElementById('res-bar').style.width = `${p}%`; document.getElementById('res-bar').style.background = rank.bar; }, 100);
    document.getElementById('res-pct').textContent = `Hiệu suất: ${p}%`;
    const sb = document.getElementById('res-score-big');
    sb.innerHTML = `${S.score}<span> điểm</span>`; sb.style.color = rank.bar;

    const prf = S.qResults.filter(r => r && r.perfect).length;
    const det = S.qResults.filter(r => r && r.dOk).length;
    const cor = S.qResults.filter(r => r && r.cOk).length;
    document.getElementById('rb-det').innerHTML = `${pct(det, S.activeQuestions.length)}<span>%</span>`;
    document.getElementById('rb-cor').innerHTML = `${pct(cor, S.activeQuestions.length)}<span>%</span>`;
    document.getElementById('rb-total').innerHTML = `${S.score}<span> đ</span>`;
    document.getElementById('rb-perf').innerHTML = `${prf}<span>/${S.activeQuestions.length}</span>`;

    // Badges
    const badges = [];
    if (S.hp === 3) badges.push('<div class="res-badge rb-hp">❤️❤️❤️ KHÔNG MẤT MẠNG!</div>');
    else if (S.hp > 0) badges.push(`<div class="res-badge rb-hp">${'❤️'.repeat(S.hp)} CÒN ${S.hp} MẠNG</div>`);
    else badges.push('<div class="res-badge rb-hp">💀 Hết mạng</div>');
    if (S.bestStreak >= 5) badges.push(`<div class="res-badge rb-str">⚡ BEST STREAK: ${S.bestStreak}</div>`);
    else if (S.bestStreak >= 2) badges.push(`<div class="res-badge rb-str">🔥 STREAK: ${S.bestStreak}</div>`);
    if (prf === S.activeQuestions.length) badges.push('<div class="res-badge rb-prf">⭐ TẤT CẢ HOÀN HẢO!</div>');
    else if (prf > 0) badges.push(`<div class="res-badge rb-prf">⭐ ${prf} VỤ ÁN HOÀN HẢO</div>`);
    const avgT = S.analytics.dTimes.filter(Boolean);
    if (avgT.length && avgT.reduce((a, b) => a + b, 0) / avgT.length < 12) badges.push('<div class="res-badge rb-spd">⚡ PHẢN XẠ SIÊU NHANH!</div>');
    if (S.comboMult >= 2 || S.bestStreak >= 5) badges.push(`<div class="res-badge rb-combo">🔥 COMBO MASTER!</div>`);
    document.getElementById('res-badges').innerHTML = badges.join('');

    const notes = {
      S: 'Xuất sắc tuyệt đối! Kỹ năng chuyển vế ở đẳng cấp thám tử trưởng. Không một dấu nào thoát!',
      A: 'Xuất sắc! Phát hiện và sửa lỗi cực chuẩn. Chỉ cần luyện thêm tốc độ là perfect!',
      B: 'Khá tốt! Thêm chút luyện tập về dấu chuyển vế là lên rank A ngay.',
      C: 'Được rồi! Chú ý kỹ hơn: +a sang vế kia → −a, −a sang vế kia → +a.',
      D: 'Cần luyện thêm. Mỗi hạng tử khi chuyển vế ĐỀU phải đổi dấu — không có ngoại lệ!',
      F: 'Hãy ôn lại quy tắc chuyển vế cơ bản rồi thử lại nhé. You got this! 💪'
    };
    document.getElementById('teacher-note').innerHTML = `<strong>Phân tích:</strong> ${notes[rank.grade]}`;

    const list = document.getElementById('q-result-list'); list.innerHTML = '';
    S.activeQuestions.forEach((q, i) => {
      const r = S.qResults[i] || {};
      const row = document.createElement('div'); row.className = 'res-case-row';
      row.style.animationDelay = `${i * .08}s`;
      row.innerHTML = `<div class="rcr-num">${i + 1}</div><div class="rcr-topic">${q.topic}</div>
        <div class="rcr-d ${r.dOk ? 'ok' : 'bad'}">${r.dOk ? '✓' : '✗'}</div>
        <div class="rcr-c ${r.cOk ? 'ok' : 'bad'}">${r.cOk ? '✓' : '✗'}</div>
        <div class="rcr-pts">${r.total || 0}</div>`;
      list.appendChild(row);
    });

    if (p >= 80) setTimeout(spawnConfetti, 500);
    this.save();
  },
  save() {
    const perfectCount = S.qResults.filter(r => r && r.perfect).length;
    const earnedXp = XP.calcGameXP(S.score, S.hp, S.bestStreak, perfectCount);
    XP.saveProfile(S.name, earnedXp);
    XP.renderWelcome(); // Update UI in welcome screen
    
    const rec = { name: S.name, date: new Date().toISOString(), score: S.score, qResults: S.qResults, analytics: S.analytics, bestStreak: S.bestStreak, earnedXp: earnedXp };
    const all = JSON.parse(localStorage.getItem('erase_among') || '[]');
    all.push(rec); localStorage.setItem('erase_among', JSON.stringify(all.slice(-20)));
  }
};

/* ══ DASHBOARD ══ */
const Dashboard = {
  init() {
    const all = JSON.parse(localStorage.getItem('erase_among') || '[]');
    const last = all[all.length - 1];
    const data = last || { name: S.name, score: S.score, qResults: S.qResults, analytics: S.analytics };
    document.getElementById('dp-student-name').textContent = `Thám Tử: ${data.name || S.name}`;
    this.student(data); this.analytics(data); this.alerts(data);
  },
  student(d) {
    const qr = d.qResults || []; const n = qr.filter(Boolean).length;
    document.getElementById('dp-total').innerHTML = `${d.score || 0}<span> đ</span>`;
    const det = qr.filter(r => r && r.dOk).length, cor = qr.filter(r => r && r.cOk).length;
    document.getElementById('dp-det-rate').innerHTML = `${pct(det, n || 1)}<span>%</span>`;
    document.getElementById('dp-cor-rate').innerHTML = `${pct(cor, n || 1)}<span>%</span>`;
    const tb = document.getElementById('dp-q-tbody'); tb.innerHTML = '';
    qr.forEach((r, i) => {
      if (!r) return; const q = S.activeQuestions[i] || QUESTIONS[i] || { topic: '—' };
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${i + 1}</td><td>${q.topic}</td><td class="${r.dOk ? 'td-ok' : 'td-bad'}">${r.dOk ? '✓' : '✗'}</td><td class="${r.cOk ? 'td-ok' : 'td-bad'}">${r.cOk ? '✓' : '✗'}</td><td>${r.total || 0}</td>`;
      tb.appendChild(tr);
    });
    const max = (S.activeQuestions.length || 5) * 25; const p = pct(d.score || 0, max);
    let lvl, fb;
    if (p >= 80) { lvl = '<span style="color:var(--yellow);font-weight:800;font-size:14px">👑 THÁM TỬ MVP</span>'; fb = 'Xuất sắc! Kỹ năng phát hiện lỗi đỉnh cao!'; }
    else if (p >= 50) { lvl = '<span style="color:var(--cyan);font-weight:800;font-size:14px">🌟 SKILLED CREW</span>'; fb = 'Khá tốt! Chú ý thêm dấu khi chuyển vế.'; }
    else { lvl = '<span style="color:var(--red);font-weight:800;font-size:14px">💀 ROOKIE</span>'; fb = 'Cần ôn thêm: +a → −a, −a → +a khi chuyển vế.'; }
    document.getElementById('dp-level').innerHTML = lvl;
    document.getElementById('dp-feedback').textContent = fb;
    const an = d.analytics || {}; const times = [...(an.dTimes || []), ...(an.cTimes || [])].filter(Boolean);
    document.getElementById('dp-avg-time').textContent = times.length ? `${Math.round(times.reduce((a, b) => a + b, 0) / times.length)}s/câu` : '—';
  },
  analytics(d) {
    const an = d.analytics || {}; const da = an.dAttempts || []; const ca = an.cAttempts || [];
    const N = S.activeQuestions.length || 5;
    const d1 = da.filter(x => x === 1).length, d2 = da.filter(x => x === 2).length, dx = da.filter(x => x === 'X').length;
    const c1 = ca.filter(x => x === 1).length, c2 = ca.filter(x => x === 2).length, cx = ca.filter(x => x === 'X').length;
    const pp = v => pct(v, N);
    [{ k: 'd1', v: d1 }, { k: 'd2', v: d2 }, { k: 'dx', v: dx }, { k: 'c1', v: c1 }, { k: 'c2', v: c2 }, { k: 'cx', v: cx }].forEach(({ k, v }) => {
      document.getElementById(`an-${k}`).textContent = `${v}/${N}`;
      document.getElementById(`an-${k}b`).style.width = `${pp(v)}%`;
    });
    const tb = document.getElementById('an-table-body'); tb.innerHTML = '';
    S.activeQuestions.forEach((_, i) => {
      const det = da[i] || '—'; const cor = ca[i] || '—'; const wc = (an.wrongClicks || [])[i] || 0;
      const dt = (an.dTimes || [])[i] || '—'; const ct = (an.cTimes || [])[i] || '—';
      const sc = (d.qResults || [])[i]?.total || 0;
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${i + 1}</td><td class="${det === 1 ? 'td-ok' : det === 'X' ? 'td-bad' : 'td-warn'}">${det}</td><td class="${cor === 1 ? 'td-ok' : cor === 'X' ? 'td-bad' : 'td-warn'}">${cor}</td><td class="${wc > 1 ? 'td-bad' : wc ? 'td-warn' : 'td-ok'}">${wc}</td><td>${dt !== '—' ? dt + 's' : dt}</td><td>${ct !== '—' ? ct + 's' : ct}</td><td>${sc}</td>`;
      tb.appendChild(tr);
    });
  },
  alerts(d) {
    const alerts = []; const an = d.analytics || {};
    const da = an.dAttempts || []; const ca = an.cAttempts || []; const wc = an.wrongClicks || [];
    if (da.filter(x => x === 'X').length >= 2) alerts.push(`⚠️ Liên tiếp miss ở ${da.filter(x => x === 'X').length} vụ. Ôn lại quy tắc chuyển vế!`);
    if (wc.reduce((a, b) => a + (b || 0), 0) >= 3) alerts.push('⚠️ Chọn nhầm nhiều — chưa nhận ra vị trí lỗi rõ ràng.');
    if (ca.filter(x => x === 'X').length >= 2) alerts.push(`⚠️ Fix sai ở ${ca.filter(x => x === 'X').length} vụ. Luyện thêm bước sửa lỗi nhé!`);
    const list = document.getElementById('dp-alert-list');
    if (!alerts.length) { list.innerHTML = '<div class="alert-card alert-ok">✓ No alerts! GGWP Thám Tử! 🎉</div>'; return; }
    list.innerHTML = alerts.map(a => `<div class="alert-card">${a}</div>`).join('');
  },
  show(section) {
    document.querySelectorAll('.dash-panel').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.dash-tab').forEach(t => t.classList.remove('active'));
    document.getElementById(`dp-${section}`).classList.add('active');
    document.getElementById(`dt-${section}`).classList.add('active');
  }
};

/* ══ CONFETTI ══ */
function spawnConfetti() {
  const colors = ['#f5c518', '#e8a020', '#ff4757', '#2ed573', '#ffffff', '#c0152a', '#ffd32a'];
  for (let i = 0; i < 50; i++) {
    const p = document.createElement('div'); p.className = 'confetti-piece';
    const sz = 4 + Math.random() * 10;
    p.style.cssText = `left:${Math.random() * 100}vw;top:-20px;background:${colors[Math.floor(Math.random() * colors.length)]};width:${sz}px;height:${sz * .6}px;animation-duration:${1 + Math.random() * 2}s;animation-delay:${Math.random() * .6}s;transform:rotate(${Math.random() * 360}deg);border-radius:${Math.random() > 0.5 ? '50%' : '2px'};`;
    document.body.appendChild(p); setTimeout(() => p.remove(), 4000);
  }
}

/* ══ BANK MODAL ══ */
const BankModal = {
  _parsed: null,
  open() { document.getElementById('bank-modal-overlay').classList.add('open') },
  close() { document.getElementById('bank-modal-overlay').classList.remove('open') },
  closeIfOutside(e) { if (e.target === document.getElementById('bank-modal-overlay')) this.close() },
  tab(t) {
    document.querySelectorAll('.bm-tab').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.bm-panel').forEach(p => p.classList.remove('active'));
    document.getElementById('bmtab-' + t).classList.add('active');
    document.getElementById('bmpanel-' + t).classList.add('active');
  },
  handleFile(e) {
    const f = e.target.files[0]; if (!f) return;
    document.getElementById('bm-drop-sub').textContent = f.name;
    const r = new FileReader(); r.onload = ev => this.parseJSON(ev.target.result); r.readAsText(f);
  },
  parseJSON(str) {
    const v = document.getElementById('bank-validation');
    const pr = document.getElementById('bank-preview');
    try {
      let data = JSON.parse(str);
      if (!Array.isArray(data) || !data.length) throw new Error('Cần mảng JSON có ít nhất 1 câu');
      const req = ['id', 'topic', 'problem', 'steps', 'errTokens', 'primaryErr', 'correction'];
      const miss = req.filter(k => !data[0].hasOwnProperty(k));
      if (miss.length) throw new Error('Thiếu trường: ' + miss.join(', '));
      this._parsed = data;
      v.style.display = 'block'; v.className = 'bm-validation ok'; v.textContent = `✓ Valid — ${data.length} câu hỏi`;
      pr.style.display = 'block';
      document.getElementById('bp-count').textContent = data.length;
      document.getElementById('bp-max').textContent = data.length;
      document.getElementById('bank-q-count').max = data.length;
      const list = document.getElementById('bp-list'); list.innerHTML = '';
      data.forEach((q, i) => {
        const r = document.createElement('div'); r.className = 'bp-row';
        r.innerHTML = `<span class="bp-num">${i + 1}</span><span class="bp-topic">${q.topic}</span><span class="bp-diff">${q.diffLabel || q.difficulty || '—'}</span>`;
        list.appendChild(r);
      });
      document.getElementById('bm-apply-btn').disabled = false;
    } catch (err) {
      this._parsed = null; v.style.display = 'block'; v.className = 'bm-validation err'; v.textContent = '✗ Error: ' + err.message;
      pr.style.display = 'none'; document.getElementById('bm-apply-btn').disabled = true;
    }
  },
  apply() {
    if (!this._parsed) return;
    const count = parseInt(document.getElementById('bank-q-count').value) || this._parsed.length;
    window._bankQuestions = this._parsed; window._bankQCount = count;
    document.getElementById('bank-active-info').innerHTML = `<div class="bank-badge">✓ ${this._parsed.length} câu đã nạp · ${count}/lượt</div>`;
    this.close(); toast(`✓ Đã nạp ${this._parsed.length} câu!`, 'ok');
  }
};
document.getElementById('bank-textarea').addEventListener('input', function () { if (this.value.trim()) BankModal.parseJSON(this.value.trim()); });
const dz = document.getElementById('bm-drop-zone');
if (dz) {
  dz.addEventListener('dragover', e => { e.preventDefault(); dz.classList.add('drag-over') });
  dz.addEventListener('dragleave', () => dz.classList.remove('drag-over'));
  dz.addEventListener('drop', e => {
    e.preventDefault(); dz.classList.remove('drag-over');
    const f = e.dataTransfer.files[0];
    if (f && f.name.endsWith('.json')) {
      document.getElementById('bm-drop-sub').textContent = f.name;
      const r = new FileReader(); r.onload = ev => BankModal.parseJSON(ev.target.result); r.readAsText(f);
    }
  });
}

/* ══════════════════════════════════════════════
   CHALLENGE MODE
══════════════════════════════════════════════ */


/* ══════════════════════════════════════════════
   PROFILE SCREEN
══════════════════════════════════════════════ */
const Profile = {
  init() {
    this.renderStats();
    this.renderBank();
    this.renderHistory();
  },

  renderStats() {
    const bank = window._bankQuestions || null;
    document.getElementById('ps-bank-count').innerHTML = `${bank ? bank.length : 5}<span> câu</span>`;
    const all = JSON.parse(localStorage.getItem('erase_among') || '[]');
    document.getElementById('ps-games').innerHTML = `${all.length}<span> ván</span>`;
    const best = all.reduce((m, r) => Math.max(m, r.score || 0), 0);
    document.getElementById('ps-best').innerHTML = `${best}<span> đ</span>`;
    const acc = all.length ? Math.round(all.map(r => {
      const qr = r.qResults || []; const n = qr.filter(Boolean).length || 1;
      return (qr.filter(x => x && x.dOk).length + qr.filter(x => x && x.cOk).length) / (n * 2) * 100;
    }).reduce((a, b) => a + b, 0) / all.length) : 0;
    document.getElementById('ps-acc').innerHTML = `${acc}<span>%</span>`;
  },

  renderBank() {
    const bank = window._bankQuestions;
    const listEl = document.getElementById('bank-q-list');
    const emptyEl = document.getElementById('bank-empty-state');
    const clearBtn = document.getElementById('btn-clear-bank');
    const countLbl = document.getElementById('bank-count-label');

    if (!bank || !bank.length) {
      emptyEl.style.display = 'block'; listEl.innerHTML = ''; clearBtn.style.display = 'none';
      countLbl.textContent = 'Đang dùng đề mặc định (5 câu)';
      document.getElementById('ps-bank-count').innerHTML = '5<span> câu</span>';
      return;
    }
    emptyEl.style.display = 'none'; clearBtn.style.display = 'inline-flex';
    countLbl.textContent = `Ngân hàng tùy chỉnh: ${bank.length} câu`;
    document.getElementById('ps-bank-count').innerHTML = `${bank.length}<span> câu</span>`;

    listEl.innerHTML = bank.map((q, i) => `
      <div class="bq-row" id="bqrow-${i}" onclick="Profile.toggleDetail(${i})">
        <div class="bq-num">${i + 1}</div>
        <div class="bq-topic">${q.topic || '—'}</div>
        <div class="bq-diff ${q.difficulty === 'easy' ? 'cb-easy' : q.difficulty === 'hard' ? 'cb-hard' : 'cb-medium'}">${q.diffLabel || q.difficulty || '—'}</div>
        <span class="bq-chevron">▶</span>
      </div>
      <div class="bq-detail" id="bqd-${i}">
        <div class="bqd-label">ĐỀ BÀI</div>
        <div style="margin-bottom:8px">${q.problem || '—'}</div>
        <div class="bqd-label">GỢI Ý</div>
        <div style="margin-bottom:8px">${q.hint || '—'}</div>
        <div class="bqd-label">SỐ BƯỚC: ${(q.steps || []).length} · LỖI TẠI TOKEN: ${(q.errTokens || []).join(', ')}</div>
      </div>`).join('');
    document.getElementById('profile-q-count').max = bank.length;
  },

  toggleDetail(i) {
    const row = document.getElementById(`bqrow-${i}`);
    const det = document.getElementById(`bqd-${i}`);
    const isOpen = det.classList.contains('show');
    document.querySelectorAll('.bq-detail.show').forEach(d => d.classList.remove('show'));
    document.querySelectorAll('.bq-row.expanded').forEach(r => r.classList.remove('expanded'));
    if (!isOpen) { det.classList.add('show'); row.classList.add('expanded'); }
  },

  renderHistory() {
    const all = JSON.parse(localStorage.getItem('erase_among') || '[]');
    const tbody = document.getElementById('history-tbody');
    const empty = document.getElementById('history-empty');
    if (!all.length) { tbody.innerHTML = ''; empty.style.display = 'block'; return; }
    empty.style.display = 'none';
    tbody.innerHTML = [...all].reverse().slice(0, 20).map((r, i) => {
      const p = Math.round((r.score || 0) / ((r.qResults || []).filter(Boolean).length || 5) / 25 * 100);
      const grade = p >= 95 ? 'S' : p >= 80 ? 'A' : p >= 65 ? 'B' : p >= 50 ? 'C' : p >= 35 ? 'D' : 'F';
      const streak = r.analytics?.bestStreak || 0;
      const dt = new Date(r.date).toLocaleDateString('vi-VN');
      return `<tr>
        <td style="color:var(--white-ghost)">${i + 1}</td>
        <td>${dt}</td>
        <td style="color:var(--white)">${r.name || '—'}</td>
        <td style="font-family:var(--font-title);font-size:18px;color:var(--yellow)">${r.score || 0}</td>
        <td class="${p >= 60 ? 'td-ok' : p >= 40 ? 'td-warn' : 'td-bad'}">${p}%</td>
        <td style="color:var(--yellow)">${streak > 0 ? '🔥' + streak : '—'}</td>
        <td style="font-family:var(--font-title);font-size:16px;color:${grade === 'S' ? '#ffd700' : grade === 'A' ? 'var(--yellow)' : grade === 'B' ? 'var(--cyan)' : grade === 'C' ? 'var(--green)' : 'var(--red)'}">${grade}</td>
      </tr>`;
    }).join('');
  },

  handleFile(e) {
    const f = e.target.files[0]; if (!f) return;
    const r = new FileReader();
    r.onload = ev => this.applyJSON(ev.target.result, f.name);
    r.readAsText(f);
  },

  togglePaste() {
    const p = document.getElementById('paste-panel');
    p.classList.toggle('show');
    if (p.classList.contains('show')) document.getElementById('profile-paste-area').focus();
  },

  applyPaste() {
    this.applyJSON(document.getElementById('profile-paste-area').value);
  },

  applyJSON(str, filename) {
    const vEl = document.getElementById('paste-validation');
    vEl.style.display = 'none';
    try {
      const data = JSON.parse(str.trim());
      if (!Array.isArray(data) || !data.length) throw new Error('Cần mảng JSON ít nhất 1 phần tử');
      const req = ['id', 'topic', 'problem', 'steps', 'errTokens', 'primaryErr', 'correction'];
      const miss = req.filter(k => !data[0].hasOwnProperty(k));
      if (miss.length) throw new Error('Thiếu trường: ' + miss.join(', '));
      window._bankQuestions = data;
      window._bankQCount = Math.min(parseInt(document.getElementById('profile-q-count').value) || 5, data.length);
      vEl.style.display = 'block';
      vEl.style.background = 'rgba(46,213,115,.08)'; vEl.style.borderLeftColor = 'var(--green)';
      vEl.style.color = 'var(--green)';
      vEl.textContent = `✓ Nạp thành công ${data.length} câu hỏi${filename ? ' từ ' + filename : ''}!`;
      this.updateWelcomeBadge(data.length);
      this.renderBank(); this.renderStats();
      toast(`✓ Đã nạp ${data.length} câu!`, 'ok');
      document.getElementById('paste-panel').classList.remove('show');
    } catch (err) {
      vEl.style.display = 'block';
      vEl.style.background = 'rgba(255,71,87,.08)'; vEl.style.borderLeftColor = 'var(--red)';
      vEl.style.color = 'var(--red)';
      vEl.textContent = '✗ Lỗi: ' + err.message;
    }
  },

  updateQCount() {
    const v = parseInt(document.getElementById('profile-q-count').value) || 5;
    window._bankQCount = v;
    const bank = window._bankQuestions;
    document.getElementById('bank-count-label').textContent =
      bank ? `Ngân hàng tùy chỉnh: ${bank.length} câu (chơi ${Math.min(v, bank.length)}/ván)`
        : `Đề mặc định (chơi ${Math.min(v, 5)}/ván)`;
    this.updateWelcomeBadge(bank?.length || 5);
  },

  updateWelcomeBadge(count) {
    const b = document.getElementById('bank-mode-badge');
    const s = document.getElementById('wf-bank-status');
    // Keep the icon 📁 and avoid overwriting it with long text
    if (b) b.innerHTML = '📁';
    if (s) s.textContent = `Ngân hàng: ${count} câu tùy chỉnh`;
  },

  clearBank() {
    if (!confirm('Xóa toàn bộ ngân hàng đề tùy chỉnh? Sẽ về đề mặc định.')) return;
    window._bankQuestions = null; window._bankQCount = null;
    const b = document.getElementById('bank-mode-badge');
    const s = document.getElementById('wf-bank-status');
    if (b) b.innerHTML = '📁';
    if (s) s.textContent = 'Ngân hàng: Mặc định (5 câu)';
    document.getElementById('profile-q-count').value = 5;
    this.renderBank(); this.renderStats();
    toast('Đã xóa ngân hàng tùy chỉnh', '');
  }
};




/* ══════════════════════════════════════════════════════════════
   LOBBY — choose host or join
══════════════════════════════════════════════════════════════ */
const Lobby = {
  init() {
    const pool = window._bankQuestions || QUESTIONS;
    document.getElementById('host-q-count').max = pool.length;
    document.getElementById('host-q-note').textContent = `/ ${pool.length} câu có sẵn`;
  },
  switchTab(tab) {
    document.querySelectorAll('.ltab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.lobby-panel').forEach(p => p.classList.remove('active'));
    document.getElementById('ltab-' + tab).classList.add('active');
    document.getElementById('lpanel-' + tab).classList.add('active');
  },
  startHost() {
    const count = parseInt(document.getElementById('host-q-count').value) || 5;
    RoomHost.init(count);
  },
  joinRoom() {
    const rawCode = document.getElementById('join-code-input').value.trim().toUpperCase();
    const name = document.getElementById('join-name-input').value.trim();

    // Normalize code: remove hyphens and spaces
    let code = rawCode.replace(/[-\s]/g, '');

    // Auto-prefix ERAS if only 4 digits provided
    if (code.length === 4 && /^\d+$/.test(code)) {
      code = 'ERAS' + code;
    }

    if (!code || code.length < 4) { toast('Mã phòng không hợp lệ!', 'err'); return; }
    if (!name) { toast('Nhập tên của bạn!', 'err'); return; }
    RoomStudent.init(code, name);
  }
};

/* ══════════════════════════════════════════════════════════════
   ROOM HOST — teacher / projector
══════════════════════════════════════════════════════════════ */
const RoomHost = {
  peer: null, roomCode: null,
  conns: {},          // peerId → {conn, name, score, dAttempt, cAttempt, dOk, answered}
  activeQuestions: [],
  qIdx: 0, phase: 'detect', gameStarted: false,
  timer: null, elapsed: 0,

  init(qCount) {
    const pool = window._bankQuestions || QUESTIONS;
    const shuffled = [...pool].sort(() => Math.random() - .5);
    this.activeQuestions = shuffled.slice(0, Math.min(qCount, shuffled.length));
    this.qIdx = 0; this.gameStarted = false;
    this.conns = {};

    // Generate room code: ERAS-XXXX
    const rand = Math.floor(1000 + Math.random() * 9000);
    this.roomCode = 'ERAS' + rand;
    const peerId = 'erase-room-' + this.roomCode;
    console.log('RoomHost: Creating Peer with ID:', peerId);

    showScreen('screen-host');
    document.getElementById('hb-room-code').textContent = this.roomCode;
    document.getElementById('hwcd-code').textContent = this.roomCode;
    document.getElementById('host-waiting-view').style.display = 'flex';
    document.getElementById('host-game-view').style.display = 'none';

    // Check if Peer exists
    if (typeof Peer === 'undefined') {
      toast('Lỗi: Thư viện PeerJS không tải được. Kiểm tra kết nối mạng!', 'err');
      showScreen('screen-lobby');
      return;
    }

    if (this.peer) { try { this.peer.destroy(); } catch (e) { } }

    this.peer = new Peer(peerId, {
      debug: 2,
      config: {
        'iceServers': [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:global.stun.twilio.com:3478' }
        ]
      }
    });
    this.peer.on('open', id => {
      console.log('Host Peer opened with ID:', id);
      toast('✓ Phòng đã tạo: ' + this.roomCode, 'ok');
    });
    this.peer.on('connection', conn => this._onConnection(conn));
    this.peer.on('disconnected', () => {
      console.warn('Host disconnected from signaling server. Reconnecting...');
      this.peer.reconnect();
    });
    this.peer.on('error', err => {
      console.error('Host Peer Error:', err);
      if (err.type === 'unavailable-id') {
        toast('Mã phòng đã tồn tại, thử lại!', 'err');
        showScreen('screen-lobby');
      } else {
        toast('Lỗi kết nối: ' + err.type, 'err');
      }
    });
  },

  _onConnection(conn) {
    // Initialize connection state immediately to avoid race conditions with data events
    this.conns[conn.peer] = { conn, name: '...', score: 0, dAttempt: 0, cAttempt: 0, dOk: false, answered: false, mcSel: null };

    conn.on('open', () => {
      this._updatePlayerCount();
      console.log('Student connected:', conn.peer);
    });
    conn.on('data', data => this._onData(conn.peer, data));
    conn.on('close', () => {
      delete this.conns[conn.peer];
      this._updatePlayerCount();
      this._renderScoreboard();
    });
  },

  _onData(peerId, data) {
    const p = this.conns[peerId];
    if (!p) return;
    switch (data.type) {
      case 'join':
        p.name = data.name;
        this._updatePlayerCount();
        this._renderWaitingChips();
        if (this.gameStarted) {
          // Send current question if game already running
          const q = this.activeQuestions[this.qIdx];
          p.conn.send({ type: 'question', q: this._stripQ(q), qIdx: this.qIdx, total: this.activeQuestions.length, phase: this.phase });
        }
        break;
      case 'detect_answer':
        this._handleDetect(peerId, data.tokenId);
        break;
      case 'correct_answer':
        this._handleCorrect(peerId, data.mcSel);
        break;
    }
  },

  _stripQ(q) {
    // Don't send errTokens/primaryErr to students (no cheating)
    const { errTokens, primaryErr, ...safe } = q;
    return safe;
  },

  _handleDetect(peerId, tokenId) {
    const p = this.conns[peerId];
    if (!p || this.phase !== 'detect' || p.dAttempt >= 2) return;
    const q = this.activeQuestions[this.qIdx];
    p.dAttempt++;
    const isCorrect = q.primaryErr.includes(tokenId) &&
      !Object.values(this.conns).some(x => x !== p && x.answered === true && !q.errTokens.includes(tokenId));
    // Simpler: check if selected token is primary error
    const correct = q.primaryErr.includes(tokenId);

    let pts = 0;
    if (correct) {
      pts = p.dAttempt === 1 ? 10 : 5;
      p.score += pts; p.dOk = true; p.answered = true;
      p.conn.send({ type: 'detect_result', correct: true, pts, errTokens: q.errTokens, rule: q.rule, dAttempt: p.dAttempt });
    } else if (p.dAttempt < 2) {
      p.conn.send({ type: 'detect_result', correct: false, again: true, dAttempt: p.dAttempt });
    } else {
      p.answered = true;
      p.conn.send({ type: 'detect_result', correct: false, again: false, errTokens: q.errTokens, rule: q.rule, dAttempt: p.dAttempt });
    }
    this._renderScoreboard();
    this._updateAnsProgress();
    this._checkAllAnswered();
  },

  _handleCorrect(peerId, mcSel) {
    const p = this.conns[peerId];
    if (!p || this.phase !== 'correct' || p.cAttempt >= 2) return;
    const q = this.activeQuestions[this.qIdx];
    p.cAttempt++;
    const correct = mcSel === q.correction.correct;
    let pts = 0;
    if (correct) {
      pts = p.cAttempt === 1 ? 10 : 5;
      if (p.dOk && p.cAttempt === 1) pts += 5; // perfect bonus
      p.score += pts; p.cAnswered = true;
      p.conn.send({ type: 'correct_result', correct: true, pts, exp: q.correction.exp, cAttempt: p.cAttempt });
    } else if (p.cAttempt < 2) {
      p.conn.send({ type: 'correct_result', correct: false, again: true, cAttempt: p.cAttempt });
    } else {
      p.cAnswered = true;
      const disp = q.correction.correct;
      p.conn.send({ type: 'correct_result', correct: false, again: false, answer: disp, exp: q.correction.exp, cAttempt: p.cAttempt });
    }
    this._renderScoreboard();
    this._updateAnsProgress();
    this._checkAllAnswered();
  },

  _checkAllAnswered() {
    const players = Object.values(this.conns);
    if (!players.length) return;
    const allDone = this.phase === 'detect'
      ? players.every(p => p.answered || p.dAttempt >= 2)
      : players.every(p => p.cAnswered || p.cAttempt >= 2);
    if (allDone && players.length > 0) {
      document.getElementById('hcb-instruction').innerHTML = '<strong style="color:var(--green)">✅ Tất cả HS đã trả lời!</strong>';
      if (this.phase === 'detect') {
        document.getElementById('host-btn-skip').style.display = 'inline-flex';
      } else {
        document.getElementById('host-btn-next').disabled = false;
      }
    }
  },

  startGame() {
    this.gameStarted = true;
    document.getElementById('host-waiting-view').style.display = 'none';
    const gv = document.getElementById('host-game-view');
    gv.style.display = 'flex'; gv.style.flexDirection = 'column';
    document.getElementById('host-q-num').style.display = 'flex';
    document.getElementById('host-timer-wrap').style.display = 'flex';
    this._loadCase(0);
  },

  _loadCase(idx) {
    const q = this.activeQuestions[idx];
    this.phase = 'detect'; this.qIdx = idx;
    // Reset all player states
    Object.values(this.conns).forEach(p => {
      p.dAttempt = 0; p.cAttempt = 0; p.answered = false; p.cAnswered = false; p.dOk = false;
    });

    const pad = String(idx + 1).padStart(3, '0');
    document.getElementById('host-q-num').textContent = `VỤ ÁN ${idx + 1}/${this.activeQuestions.length}`;
    document.getElementById('host-case-title').textContent = `VỤ ÁN #${pad}`;
    document.getElementById('host-topic').textContent = `Điều tra: ${q.topic}`;
    const hostProblem = document.getElementById('host-problem-text');
    hostProblem.innerHTML = q.problem;
    applyMathFormatting(hostProblem);
    document.getElementById('host-btn-next').disabled = true;
    document.getElementById('host-btn-skip').style.display = 'none';
    document.getElementById('hcb-instruction').textContent = 'HS đang tìm nghi phạm...';

    const db = document.getElementById('host-diff-badge');
    db.textContent = q.diffLabel || 'DỄ';
    db.className = 'chq-diff ' + (q.difficulty === 'easy' ? 'cb-easy' : q.difficulty === 'hard' ? 'cb-hard' : 'cb-medium');

    this._renderHostSteps(q);
    document.getElementById('host-correction').classList.remove('show');
    document.getElementById('host-feedback').className = 'ch-feedback-big';
    this._setPhaseUI('detect');
    this._renderScoreboard();
    this._updateAnsProgress();
    this._startTimer();

    // Broadcast question to all students
    this._broadcast({ type: 'question', q: this._stripQ(q), qIdx: idx, total: this.activeQuestions.length, phase: 'detect' });
  },

  _renderHostSteps(q) {
    const blk = document.getElementById('host-solution-block'); blk.innerHTML = '';
    q.steps.forEach(step => {
      const row = document.createElement('div'); row.className = 'step-line';
      const lbl = document.createElement('div'); lbl.className = 'step-label'; lbl.textContent = step.label;
      const tks = document.createElement('div'); tks.className = 'step-tokens';
      step.tokens.forEach(tk => {
        const el = document.createElement('span');
        el.className = 'token'; el.id = `htk-${tk.id}`; el.innerHTML = formatMathText(tk.tx);
        if (tk.tp === 'op') el.classList.add('op');
        if (tk.tp === 'eq') el.classList.add('eq');
        tks.appendChild(el);
      });
      row.appendChild(lbl); row.appendChild(tks); blk.appendChild(row);
    });
  },

  revealAnswer() {
    const q = this.activeQuestions[this.qIdx];
    q.errTokens.forEach(t => {
      const e = document.getElementById(`htk-${t}`);
      if (e) { e.classList.add('revealed-error'); }
    });
    // Show rule + explanation
    const fb = document.getElementById('host-feedback');
    fb.className = 'ch-feedback-big show fc-warn';
    fb.innerHTML = `<div class="cfb-icon">💡</div><div class="cfb-text"><strong>Đây là dấu bị làm sai!</strong><div class="cfb-rule">${q.rule}</div></div>`;
    // Notify students
    this._broadcast({ type: 'reveal_detect', errTokens: q.errTokens, rule: q.rule });
    document.getElementById('host-btn-skip').style.display = 'inline-flex';
  },

  moveToCorrection() {
    const q = this.activeQuestions[this.qIdx];
    this.phase = 'correct';
    this._setPhaseUI('correct');
    // Show correction on host
    document.getElementById('host-corr-q').innerHTML = q.correction.question;
    document.getElementById('host-corr-wrong').innerHTML = q.correction.wrongExpr;
    applyMathFormatting(document.getElementById('host-corr-q'));
    applyMathFormatting(document.getElementById('host-corr-wrong'));
    document.getElementById('host-correction').classList.add('show');
    document.getElementById('host-btn-skip').style.display = 'none';
    document.getElementById('hcb-instruction').textContent = 'HS đang chọn cách sửa...';
    Object.values(this.conns).forEach(p => { p.cAttempt = 0; p.cAnswered = false; });
    this._updateAnsProgress();
    // Broadcast phase change
    this._broadcast({ type: 'phase', phase: 'correct', correction: { question: q.correction.question, wrongExpr: q.correction.wrongExpr, symbols: q.correction.symbols, type: q.correction.type } });
  },

  nextCase() {
    this._stopTimer();
    if (this.qIdx + 1 >= this.activeQuestions.length) {
      this._showHostResults(); return;
    }
    this._loadCase(this.qIdx + 1);
  },

  _showHostResults() {
    this._stopTimer();
    const players = Object.values(this.conns).sort((a, b) => b.score - a.score);
    const fb = document.getElementById('host-feedback');
    fb.className = 'ch-feedback-big show fc-correct';
    let rows = players.map((p, i) => `<div style="display:flex;align-items:center;gap:10px;padding:6px 10px;background:var(--space2);border-radius:8px;margin-bottom:4px"><span style="font-family:var(--font-title);font-size:16px;color:var(--yellow);width:24px">${i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}</span><span style="flex:1;font-weight:800">${p.name}</span><span style="font-family:var(--font-title);font-size:20px;color:var(--yellow)">${p.score}</span></div>`).join('');
    fb.innerHTML = `<div style="width:100%"><div class="cfb-text"><strong>🏆 KẾT THÚC! Bảng xếp hạng:</strong></div><div style="margin-top:10px">${rows}</div></div>`;
    this._broadcast({ type: 'game_end' });
    document.getElementById('host-btn-next').textContent = '🏠 Kết thúc';
    document.getElementById('host-btn-next').onclick = () => this.exitToMenu();
    document.getElementById('host-btn-next').disabled = false;
    spawnConfetti();
  },

  _setPhaseUI(phase) {
    const tag = document.getElementById('host-phase-tag');
    const desc = document.getElementById('host-phase-desc');
    if (phase === 'detect') {
      tag.className = 'phase-tag ph-detect'; tag.querySelector('span').textContent = '🔍 GĐ1 — HS ĐANG TÌM NGHI PHẠM';
      desc.textContent = 'HS bấm vào dấu nghi ngờ trên thiết bị của mình';
    } else {
      tag.className = 'phase-tag ph-correct'; tag.querySelector('span').textContent = '✏️ GĐ2 — HS ĐANG SỬA LỖI';
      desc.textContent = 'HS chọn dấu đúng để sửa lại bằng chứng';
    }
  },

  _renderScoreboard() {
    const list = document.getElementById('hsb-list');
    const count = document.getElementById('hsb-count');
    const players = Object.values(this.conns).sort((a, b) => b.score - a.score);
    count.textContent = players.length + ' HS';
    document.getElementById('hb-players').textContent = players.length + ' HS';
    if (!players.length) {
      list.innerHTML = '<div style="text-align:center;padding:20px;font-size:12px;font-weight:700;color:var(--white-ghost)">Chờ học sinh trả lời...</div>';
      return;
    }
    list.innerHTML = players.map((p, i) => {
      const isDet = this.phase === 'detect';
      const answered = isDet ? p.answered : p.cAnswered;
      const correct = isDet ? p.dOk : (p.cAttempt > 0 && !p.cAnswered && p.cAttempt < 2 ? false : p.cAnswered);
      return `<div class="hsb-row ${answered ? (p.dOk || p.cAnswered ? 'answered' : '') : ''}" id="hsbr-${p.conn.peer}">
        <div class="hsb-rank">${i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}</div>
        <div class="hsb-name">${p.name}</div>
        <div class="hsb-status">${answered ? '✅' : '⏳'}</div>
        <div class="hsb-score">${p.score}</div>
      </div>`;
    }).join('');
  },

  _updateAnsProgress() {
    const players = Object.values(this.conns);
    if (!players.length) { document.getElementById('host-ans-progress').style.width = '0%'; return; }
    const done = this.phase === 'detect'
      ? players.filter(p => p.answered || p.dAttempt >= 2).length
      : players.filter(p => p.cAnswered || p.cAttempt >= 2).length;
    const pct = Math.round(done / players.length * 100);
    document.getElementById('host-ans-progress').style.width = pct + '%';
    document.getElementById('host-ans-count').textContent = `${done}/${players.length} đã trả lời`;
  },

  _updatePlayerCount() {
    const n = Object.keys(this.conns).length;
    document.getElementById('hb-players').textContent = n + ' HS';
    document.getElementById('hw-waiting-note').textContent = `Đã có ${n} học sinh trong phòng`;
    const btn = document.getElementById('host-start-game-btn');
    if (n >= 1) {
      btn.disabled = false; btn.style.opacity = '1'; btn.style.cursor = 'pointer';
    } else {
      btn.disabled = true; btn.style.opacity = '.4'; btn.style.cursor = 'not-allowed';
    }
  },

  _renderWaitingChips() {
    const wrap = document.getElementById('hw-players-waiting');
    const players = Object.values(this.conns).filter(p => p.name !== '...');
    if (!players.length) {
      wrap.innerHTML = '<div style="font-size:13px;font-weight:700;color:var(--white-ghost)">Chưa có học sinh nào...</div>';
      return;
    }
    wrap.innerHTML = players.map(p =>
      `<div class="hw-player-chip">🕵️ ${p.name}</div>`
    ).join('');
  },

  _broadcast(data) {
    Object.values(this.conns).forEach(p => {
      try { p.conn.send(data); } catch (e) { }
    });
  },

  _startTimer() {
    this._stopTimer(); this.elapsed = 0;
    this.timer = setInterval(() => {
      this.elapsed++;
      const el = document.getElementById('host-timer');
      el.textContent = fmt(this.elapsed);
      el.className = 'ch-timer-val' + (this.elapsed > 90 ? ' danger' : this.elapsed > 60 ? ' warn' : '');
    }, 1000);
  },
  _stopTimer() { clearInterval(this.timer); this.timer = null; },

  exitToMenu() {
    this._stopTimer();
    if (this.peer) { this.peer.destroy(); this.peer = null; }
    showScreen('screen-welcome');
  }
};

/* ══════════════════════════════════════════════════════════════
   ROOM STUDENT — per student device
══════════════════════════════════════════════════════════════ */
const RoomStudent = {
  peer: null, hostConn: null,
  name: '', roomCode: '', score: 0,
  phase: 'detect', dAttempt: 0, cAttempt: 0,
  selected: null, mcSel: null,
  currentQ: null,

  init(code, name) {
    this.name = name; this.roomCode = code; this.score = 0;
    this.dAttempt = 0; this.cAttempt = 0; this.selected = null;

    showScreen('screen-student');
    document.getElementById('sb-name').textContent = name;
    document.getElementById('sb-room').textContent = 'PHÒNG: ' + code;
    document.getElementById('student-score').textContent = '0';
    document.getElementById('student-waiting-view').style.display = 'flex';
    document.getElementById('student-q-card').style.display = 'none';
    document.getElementById('student-wait-title').textContent = 'Đang kết nối...';
    document.getElementById('student-wait-sub').textContent = 'Đang tìm phòng ' + code;

    // Check if Peer exists
    if (typeof Peer === 'undefined') {
      toast('Lỗi: Thư viện PeerJS không tải được!', 'err');
      document.getElementById('student-wait-title').textContent = '❌ Lỗi hệ thống!';
      document.getElementById('student-wait-sub').textContent = 'Không thể tải thư viện kết nối.';
      return;
    }

    // Cleanup old peer if exists
    if (this.peer) { try { this.peer.destroy(); } catch (e) { } }

    // Connect to host
    const hostId = 'erase-room-' + code;
    console.log('RoomStudent: Attempting to connect to host:', hostId);
    this.peer = new Peer(null, {
      debug: 2,
      config: {
        'iceServers': [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:global.stun.twilio.com:3478' }
        ]
      }
    });

    // Connection timeout
    let connTimeout = setTimeout(() => {
      if (!this.hostConn || !this.hostConn.open) {
        toast('Kết nối quá lâu, hãy kiểm tra mã phòng!', 'err');
        document.getElementById('student-wait-title').textContent = '❌ Kết nối thất bại!';
        document.getElementById('student-wait-sub').textContent = 'Vui lòng thử lại hoặc kiểm tra mạng.';
      }
    }, 15000);

    this.peer.on('open', id => {
      console.log('Student Peer opened with ID:', id);
      this.hostConn = this.peer.connect(hostId, { reliable: true });

      this.hostConn.on('open', () => {
        clearTimeout(connTimeout);
        this.hostConn.send({ type: 'join', name: this.name });
        document.getElementById('student-wait-title').textContent = '✅ Đã vào phòng!';
        document.getElementById('student-wait-sub').textContent = 'Chờ giáo viên bắt đầu vụ án...';
        toast('✅ Đã vào phòng ' + code, 'ok');
      });
      this.hostConn.on('data', data => this._onData(data));
      this.hostConn.on('close', () => {
        toast('Mất kết nối với phòng!', 'err');
      });
      this.hostConn.on('error', err => {
        console.error('Connection Error:', err);
        toast('Lỗi kết nối học sinh!', 'err');
      });
    });
    this.peer.on('error', err => {
      console.error('Student Peer Error:', err);
      if (err.type === 'peer-unavailable') {
        toast('Không tìm thấy phòng ' + code + '!', 'err');
        document.getElementById('student-wait-title').textContent = '❌ Không tìm thấy phòng!';
        document.getElementById('student-wait-sub').textContent = 'Kiểm tra lại mã phòng và thử lại.';
        setTimeout(() => showScreen('screen-lobby'), 2000);
      } else {
        toast('Lỗi: ' + err.type, 'err');
      }
    });
  },

  _onData(data) {
    switch (data.type) {
      case 'question':
        this.currentQ = data.q;
        this.dAttempt = 0; this.cAttempt = 0;
        this.selected = null; this.mcSel = null;
        this._showQuestion(data.q, data.qIdx, data.total);
        break;
      case 'phase':
        if (data.phase === 'correct') this._showCorrection(data.correction);
        break;
      case 'detect_result':
        this._onDetectResult(data);
        break;
      case 'correct_result':
        this._onCorrectResult(data);
        break;
      case 'reveal_detect':
        this._revealDetect(data.errTokens, data.rule);
        break;
      case 'game_end':
        this._showGameEnd();
        break;
    }
  },

  _showQuestion(q, qIdx, total) {
    document.getElementById('waiting-overlay').classList.remove('show');
    document.getElementById('student-waiting-view').style.display = 'none';
    document.getElementById('student-q-card').style.display = 'block';
    document.getElementById('student-correction').classList.remove('show');

    const pad = String(qIdx + 1).padStart(3, '0');
    document.getElementById('student-case-title').textContent = `VỤ ÁN #${pad}  (${qIdx + 1}/${total})`;
    const studentProblem = document.getElementById('student-problem');
    studentProblem.innerHTML = q.problem;
    applyMathFormatting(studentProblem);
    document.getElementById('student-hint').innerHTML = q.hint || '';

    this.phase = 'detect';
    this._setStudentPhaseUI('detect');
    this._renderStudentSteps(q);

    document.getElementById('student-btn-detect').disabled = true;
    document.getElementById('student-feedback-detect').className = 'student-feedback';
    document.getElementById('student-feedback-correct').className = 'student-feedback';
    this._setPips(2, 0, 'd'); this._setPips(2, 0, 'c');
  },

  _renderStudentSteps(q) {
    const blk = document.getElementById('student-solution-block'); blk.innerHTML = '';
    q.steps.forEach(step => {
      const row = document.createElement('div'); row.className = 'step-line';
      const lbl = document.createElement('div'); lbl.className = 'step-label'; lbl.textContent = step.label;
      const tks = document.createElement('div'); tks.className = 'step-tokens';
      step.tokens.forEach(tk => {
        const el = document.createElement('span');
        el.className = 'token'; el.id = `stk-${tk.id}`; el.innerHTML = formatMathText(tk.tx);
        if (tk.tp === 'op') el.classList.add('op');
        if (tk.tp === 'eq') el.classList.add('eq');
        if (tk.tp === 'plain') el.classList.add('plain');
        el.addEventListener('click', () => this._clickToken(tk.id));
        tks.appendChild(el);
      });
      row.appendChild(lbl); row.appendChild(tks); blk.appendChild(row);
    });
  },

  _clickToken(tid) {
    if (this.phase !== 'detect' || this.dAttempt >= 2) return;
    // Deselect previous
    if (this.selected) {
      const prev = document.getElementById(`stk-${this.selected}`);
      if (prev) prev.classList.remove('selected');
    }
    if (this.selected === tid) {
      this.selected = null;
      document.getElementById('student-btn-detect').disabled = true;
    } else {
      this.selected = tid;
      const el = document.getElementById(`stk-${tid}`);
      if (el) el.classList.add('selected');
      document.getElementById('student-btn-detect').disabled = false;
    }
  },

  submitDetect() {
    if (!this.selected || this.dAttempt >= 2) return;
    this.dAttempt++;
    this._setPips(2, this.dAttempt, 'd');
    document.getElementById('student-btn-detect').disabled = true;
    this.hostConn.send({ type: 'detect_answer', tokenId: this.selected });
    // Show "waiting" feedback
    this._showStudentFB('detect', '⏳', '<strong>Đã gửi! Chờ kết quả...</strong>', 'wait');
  },

  _onDetectResult(data) {
    if (data.correct) {
      this.score += data.pts;
      this._updateScore();
      // Highlight correct tokens on student screen
      data.errTokens.forEach(t => {
        const e = document.getElementById(`stk-${t}`);
        if (e) { e.classList.remove('selected'); e.classList.add('found-correct'); }
      });
      const msg = data.dAttempt === 1 ? '🎯 Chính xác ngay lần đầu!' : '✅ Đúng rồi!';
      this._showStudentFB('detect', '🎯',
        `<strong>${msg}</strong> <em style="color:var(--green)">+${data.pts} điểm!</em><div class="fc-rule">${data.rule}</div>`, 'correct');
      // Show waiting overlay — wait for correction phase
      setTimeout(() => {
        document.getElementById('wo-title').textContent = '⏳ Đợi vụ án tiếp theo...';
        document.getElementById('wo-sub').textContent = 'GV đang xem kết quả cả lớp';
        document.getElementById('wo-pts').textContent = data.pts;
        document.getElementById('waiting-overlay').classList.add('show');
      }, 1500);
    } else if (data.again) {
      if (this.selected) {
        const el = document.getElementById(`stk-${this.selected}`);
        if (el) el.classList.remove('selected');
      }
      this.selected = null;
      this._showStudentFB('detect', '❌', '<strong>Chưa đúng — còn 1 lần nữa!</strong><br><em style="color:var(--white-ghost)">Thử chọn dấu khác nhé 💡</em>', 'wrong');
      document.getElementById('student-btn-detect').disabled = false;
    } else {
      // Both attempts failed
      if (data.errTokens) data.errTokens.forEach(t => {
        const e = document.getElementById(`stk-${t}`); if (e) { e.classList.remove('selected'); e.classList.add('revealed-error'); }
      });
      this._showStudentFB('detect', '💔', `<strong>Hết lượt!</strong><div class="fc-rule">${data.rule || ''}</div>`, 'wrong');
      setTimeout(() => {
        document.getElementById('wo-title').textContent = '⏳ Chờ giáo viên tiếp tục...';
        document.getElementById('wo-sub').textContent = 'Chưa tìm được nghi phạm lần này';
        document.getElementById('wo-pts').textContent = 0;
        document.getElementById('waiting-overlay').classList.add('show');
      }, 1500);
    }
  },

  _showCorrection(corr) {
    document.getElementById('waiting-overlay').classList.remove('show');
    this.phase = 'correct';
    this._setStudentPhaseUI('correct');
    this.cAttempt = 0; this.mcSel = null;
    this._setPips(2, 0, 'c');
    document.getElementById('student-corr-q').innerHTML = corr.question;
    document.getElementById('student-corr-wrong').innerHTML = corr.wrongExpr;
    applyMathFormatting(document.getElementById('student-corr-q'));
    applyMathFormatting(document.getElementById('student-corr-wrong'));
    document.getElementById('student-correction').classList.add('show');
    document.getElementById('student-feedback-correct').className = 'student-feedback';
    document.getElementById('student-btn-correct').disabled = false;

    const area = document.getElementById('student-corr-input'); area.innerHTML = '';
    if (corr.type === 'symbol') {
      const kb = document.createElement('div'); kb.className = 'symbol-keyboard';
      (corr.symbols || []).forEach(sym => {
        const btn = document.createElement('button');
        btn.className = 'sym-key'; btn.textContent = sym; btn.id = 'stsym-' + sym.charCodeAt(0);
        btn.addEventListener('click', () => {
          (corr.symbols || []).forEach(s => { const b = document.getElementById('stsym-' + s.charCodeAt(0)); if (b) b.className = 'sym-key'; });
          btn.className = 'sym-key selected'; this.mcSel = sym;
          document.getElementById('student-btn-correct').disabled = false;
        });
        kb.appendChild(btn);
      });
      area.appendChild(kb);
    }
  },

  submitCorrect() {
    if (!this.mcSel || this.cAttempt >= 2) return;
    this.cAttempt++;
    this._setPips(2, this.cAttempt, 'c');
    document.getElementById('student-btn-correct').disabled = true;
    this.hostConn.send({ type: 'correct_answer', mcSel: this.mcSel });
    this._showStudentFB('correct', '⏳', '<strong>Đã gửi! Chờ kết quả...</strong>', 'wait');
  },

  _onCorrectResult(data) {
    if (data.correct) {
      this.score += data.pts;
      this._updateScore();
      const msg = data.cAttempt === 1 ? '🔓 Phá án thành công! Ngay lần đầu!' : '✅ Đúng rồi!';
      this._showStudentFB('correct', '🔓',
        `<strong>${msg}</strong> <em style="color:var(--green)">+${data.pts} điểm!</em><div class="fc-explain">${data.exp}</div>`, 'correct');
      setTimeout(() => {
        document.getElementById('wo-title').textContent = '⏳ Chờ vụ án tiếp theo...';
        document.getElementById('wo-sub').textContent = 'GV đang xem kết quả cả lớp';
        document.getElementById('wo-pts').textContent = data.pts;
        document.getElementById('waiting-overlay').classList.add('show');
      }, 2000);
    } else if (data.again) {
      this.mcSel = null;
      const area = document.getElementById('student-corr-input');
      area.querySelectorAll('.sym-key').forEach(b => b.className = 'sym-key');
      this._showStudentFB('correct', '❌', '<strong>Chưa đúng — còn 1 lần!</strong>', 'wrong');
      document.getElementById('student-btn-correct').disabled = false;
    } else {
      this._showStudentFB('correct', '💔',
        `<strong>Đáp án đúng là: <em style="color:var(--yellow)">${data.answer || '?'}</em></strong><div class="fc-explain">${data.exp || ''}</div>`, 'wrong');
      setTimeout(() => {
        document.getElementById('wo-title').textContent = '⏳ Chờ vụ án tiếp theo...';
        document.getElementById('wo-sub').textContent = 'Lần này chưa sửa được đâu nhé!';
        document.getElementById('wo-pts').textContent = 0;
        document.getElementById('waiting-overlay').classList.add('show');
      }, 2000);
    }
  },

  _revealDetect(errTokens, rule) {
    errTokens.forEach(t => {
      const e = document.getElementById(`stk-${t}`);
      if (e) { e.classList.remove('selected'); e.classList.add('revealed-error'); }
    });
    this._showStudentFB('detect', '💡', `<strong>GV đã hiện đáp án!</strong><div class="fc-rule">${rule}</div>`, 'wait');
  },

  _showGameEnd() {
    document.getElementById('waiting-overlay').classList.remove('show');
    document.getElementById('student-q-card').style.display = 'none';
    const wv = document.getElementById('student-waiting-view');
    wv.style.display = 'flex';
    document.getElementById('student-wait-title').textContent = '🏆 Vụ án kết thúc!';
    document.getElementById('student-wait-sub').textContent = `Tổng điểm của bạn: ${this.score} điểm`;
    document.querySelector('#student-waiting-view .sw-dots').innerHTML =
      `<div style="font-family:var(--font-title);font-size:40px;color:var(--yellow)">${this.score}</div>`;
    spawnConfetti();
  },

  _showStudentFB(phase, icon, html, type) {
    const id = phase === 'detect' ? 'student-feedback-detect' : 'student-feedback-correct';
    const el = document.getElementById(id);
    el.className = `student-feedback show sf-${type}`;
    el.innerHTML = `<div class="sff-icon">${icon}</div><div class="sff-body">${html}</div>`;
    applyMathFormatting(el);
  },

  _setStudentPhaseUI(phase) {
    const tag = document.getElementById('student-phase-tag');
    if (phase === 'detect') {
      tag.className = 'student-phase-tag spt-detect'; tag.textContent = '🔍 TÌM NGHI PHẠM';
    } else {
      tag.className = 'student-phase-tag spt-correct'; tag.textContent = '✏️ SỬA LỖI';
    }
  },

  _setPips(total, used, pfx) {
    const pre = pfx === 'd' ? 'st-dpip-' : 'st-cpip-';
    for (let i = 1; i <= total; i++) {
      const el = document.getElementById(pre + i);
      if (el) el.className = 'pip' + (i <= used ? ' spent' : pfx === 'd' ? ' live' : ' live-y');
    }
  },

  _updateScore() {
    const el = document.getElementById('student-score');
    el.textContent = this.score;
    el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump');
  }
};

// Initialize XP bar when the script runs
setTimeout(() => XP.renderWelcome(), 100);