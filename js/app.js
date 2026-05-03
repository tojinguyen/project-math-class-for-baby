/* ══ QUESTIONS ══ */
// Đã chuyển lên Database (Supabase). Code cũ đã được xóa.




/* ══ BRIEFING TEXTS ══ */
const BRIEFS = [
  "🚨 BRIEFING MẬT! Có kẻ IMPOSTOR đã làm sai dấu trong bài giải. Nhiệm vụ: tìm ra hạng tử bị sai dấu khi chuyển vế. Nhớ: +a → −a khi sang vế khác!",
  "🔍 ĐIỀU TRA! Ai đó đã cố tình không đổi dấu khi chuyển vế. Nhìn kỹ từng bước — dấu cộng/trừ có bị giữ nguyên không? Tìm ra và bắt ngay!",
  "⚠️ CAUTION! Vụ án này phức tạp hơn — có thể bị đánh lạc hướng. Kiểm tra từng hạng tử được chuyển vế. Mỗi hạng tử phải đổi dấu riêng!",
  "🔴 RED FLAG! Impostor lần này giấu lỗi trong bước bỏ ngoặc. Nhớ: a(b−c) = a·b − a·c. Phải nhân với MỌI hạng tử trong ngoặc!",
  "💀 FINAL TASK! Impostor khó nhất đang ẩn náu trong dấu trừ trước ngoặc. Quy tắc: −(a−b) = −a+b. Đây là vụ cuối — không được sai!",
];
const CREW_EMOJIS = ['🕵️', '🔍', '📁', '🗝️', '💼', '🔦', '📋', '🧩'];

/* ══ QUESTION MANAGER ══ */
const QuestionManager = {
  bank: [],

  async init() {
    // Load 100% from Cloud (Supabase)
    try {
      const cloudData = await CloudBank.fetchAll();
      if (cloudData && cloudData.length > 0) {
        this.bank = CloudBank.mapFromDB(cloudData);
        window._bankQuestions = this.bank;
        console.log(`Loaded ${this.bank.length} questions from Cloud.`);

        // Update UI if on Profile screen
        if (typeof Profile !== 'undefined' && Profile.renderBank) {
          Profile.renderBank();
        }
      } else {
        console.warn('No questions found in Cloud.');
      }
    } catch (e) {
      console.error('Cloud Load failed:', e);
    }
  },

  async save(data) {
    this.bank = data;
    window._bankQuestions = data;

    // Push to Cloud (Supabase) — nguồn duy nhất
    try {
      await CloudBank.pushAll(data);
      toast('✓ Đã lưu lên Database thành công!', 'correct');
    } catch (e) {
      console.error('Failed to save to Cloud:', e);
      toast('Lưu Database thất bại!', 'warn');
    }
  },

  clear() {
    this.bank = [];
    window._bankQuestions = [];
  },

  getQuestions(totalCount, options = {}) {
    const bank = this.bank;
    if (bank.length === 0) {
      toast('Ngân hàng đề trống! Hãy nạp đề ở phần Hồ Sơ.', 'warn');
      return [];
    }

    // Helper: pick up to `count` questions from a group, preferring unique topics
    const selectFrom = (group, count) => {
      if (count <= 0) return [];
      const shuffled = [...group].sort(() => Math.random() - 0.5);
      const selected = [];
      const topics = new Set();
      for (const q of shuffled) {
        if (selected.length >= count) break;
        if (!topics.has(q.topic)) { selected.push(q); topics.add(q.topic); }
      }
      for (const q of shuffled) {
        if (selected.length >= count) break;
        if (!selected.includes(q)) selected.push(q);
      }
      return selected;
    };

    // ── Solo / Practice mode: single difficulty filter ──
    if (options.difficultyFilter) {
      let pool = bank.filter(q => q.difficulty === options.difficultyFilter);
      if (pool.length === 0) {
        toast('Chưa có câu hỏi ở cấp độ này! Đang dùng câu bất kỳ.', 'warn');
        pool = bank;
      }
      return selectFrom(pool, totalCount).sort(() => Math.random() - 0.5).slice(0, totalCount);
    }

    // ── Mixed mode (challenge or default): group by difficulty, apply ratios ──
    const easy   = bank.filter(q => q.difficulty === 'easy');
    const medium = bank.filter(q => q.difficulty === 'medium');
    const hard   = bank.filter(q => q.difficulty === 'hard');

    const ratios = options.ratios || { easy: 0.5, medium: 0.3, hard: 0.2 };
    let nEasy   = Math.max(0, Math.round(totalCount * ratios.easy));
    let nMedium = Math.max(0, Math.round(totalCount * ratios.medium));
    let nHard   = Math.max(0, totalCount - nEasy - nMedium);

    let result = [
      ...selectFrom(easy,   nEasy),
      ...selectFrom(medium, nMedium),
      ...selectFrom(hard,   nHard),
    ];

    // Fallback: fill remaining slots with any question not yet selected
    if (result.length < totalCount) {
      const extra = bank.filter(q => !result.includes(q))
        .sort(() => Math.random() - 0.5)
        .slice(0, totalCount - result.length);
      result = result.concat(extra);
    }

    return result.sort(() => Math.random() - 0.5).slice(0, totalCount);
  }
};

/* ══ PRACTICE LEVEL SYSTEM ══ */
const PracticeLevel = {
  LEVELS: [
    { id: 1, name: 'Dễ',         difficulty: 'easy',   emoji: '🟢', color: '#2ed573' },
    { id: 2, name: 'Trung Bình', difficulty: 'medium', emoji: '🟡', color: '#f5c518' },
    { id: 3, name: 'Khó',        difficulty: 'hard',   emoji: '🔴', color: '#ff4757' },
  ],
  getKey(name) { return `${name.trim()}_practice_level`; },
  getHistoryKey(name, level) { return `${name.trim()}_practice_hist_lv${level}`; },
  getLevel(name) {
    const v = parseInt(localStorage.getItem(this.getKey(name)));
    return isNaN(v) ? 1 : Math.max(1, Math.min(3, v));
  },
  setLevel(name, level) {
    localStorage.setItem(this.getKey(name), Math.max(1, Math.min(3, level)));
  },
  getLevelInfo(level) { return this.LEVELS[(level || 1) - 1]; },
  getHistory(name, level) {
    try {
      const raw = localStorage.getItem(this.getHistoryKey(name, level));
      return raw ? JSON.parse(raw) : [];
    } catch(e) { return []; }
  },
  clearHistory(name, level) {
    localStorage.removeItem(this.getHistoryKey(name, level));
  },
  // Add game result, keep only last 2. Returns updated history array.
  _pushResult(name, level, accuracyPct) {
    const hist = this.getHistory(name, level);
    hist.push(accuracyPct);
    const trimmed = hist.slice(-2);
    localStorage.setItem(this.getHistoryKey(name, level), JSON.stringify(trimmed));
    return trimmed;
  },
  // Evaluate level change after a game. Returns { action: 'up'|'down'|null, newLevel, history }
  evaluate(name, currentLevel, accuracyPct) {
    const history = this._pushResult(name, currentLevel, accuracyPct);
    if (history.length < 2) return { action: null, newLevel: currentLevel, history };

    const last2 = history.slice(-2);
    const bothAbove80 = last2.every(p => p >= 80);
    const bothBelow50 = last2.every(p => p < 50);

    if (bothAbove80 && currentLevel < 3) {
      const newLevel = currentLevel + 1;
      this.setLevel(name, newLevel);
      this.clearHistory(name, currentLevel);
      this.clearHistory(name, newLevel);
      return { action: 'up', newLevel, history };
    }
    if (bothBelow50 && currentLevel > 1) {
      const newLevel = currentLevel - 1;
      this.setLevel(name, newLevel);
      this.clearHistory(name, currentLevel);
      this.clearHistory(name, newLevel);
      return { action: 'down', newLevel, history };
    }
    return { action: null, newLevel: currentLevel, history };
  },
};

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

/* ══ SHARED LEADERBOARD SYNC (Supabase) ══ */
const LeaderboardSync = {
  enabled: true,
  supabaseUrl: 'https://eehegsaxegizcynygafk.supabase.co',
  supabaseKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVlaGVnc2F4ZWdpemN5bnlnYWZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5MzIyNTcsImV4cCI6MjA5MjUwODI1N30.RsAipm-k-6sGT5fnDJp1wQ8Q8rQrLvabYyfgMscDIc4',
  client: null,

  init() {
    if (this.client || !window.supabase) return;
    const { createClient } = window.supabase;
    this.client = createClient(this.supabaseUrl, this.supabaseKey);
  },

  getDeviceId() {
    let id = localStorage.getItem('erase_device_id');
    if (!id) {
      id = 'dev-' + Math.random().toString(36).substr(2, 9) + '-' + Date.now();
      localStorage.setItem('erase_device_id', id);
    }
    return id;
  },

  async uploadProfile(profile) {
    if (!this.enabled || !window.supabase) return;
    this.init();
    const { error } = await this.client.from('profiles').upsert({
      ...profile,
      last_active: new Date().toISOString()
    });
    if (error) {
      console.error('Supabase Profile Sync Error:', error.message);
      throw error; // Throw so caller can catch it
    }
  },

  async fetchScores() {
    if (!this.enabled || !window.supabase) return null;
    this.init();
    try {
      const { data, error } = await this.client.from('profiles').select('name, xp').order('xp', { ascending: false }).limit(20);
      if (error) return null;
      return data;
    } catch (e) { return null; }
  },

  async getProfile(name) {
    if (!this.enabled || !window.supabase || !name) return null;
    this.init();
    const { data, error } = await this.client.from('profiles').select('*').eq('name', name).maybeSingle();
    if (error) {
      console.error('Supabase Get Profile Error:', error.message);
      throw error;
    }
    return data;
  },

  async getProfileById(id) {
    if (!this.enabled || !window.supabase || !id) return null;
    this.init();
    const { data, error } = await this.client.from('profiles').select('*').eq('id', id).maybeSingle();
    if (error) {
      console.error('Supabase Get Profile By ID Error:', error.message);
      throw error;
    }
    return data;
  }
};

/* ══ GAME ANALYSIS ENGINE ══ */
const GameAnalysis = {
  analyze(games) {
    if (!games || !games.length) return { tag: '✅ Không điểm yếu', color: '#2ed573' };
    let totalGames = games.length, totalQ = 0, dFailBoth = 0, cFailBoth = 0, totalWrongClicks = 0, fastAndWrong = 0;
    let subjectStats = {
      chuyenVe: { count: 0, fail: 0, label: '🔴 Sai quy tắc chuyển vế', color: '#e74c3c' },
      tinhToan: { count: 0, fail: 0, label: '🔴 Sai tính toán', color: '#e67e22' },
      thuTu: { count: 0, fail: 0, label: '🔴 Sai thứ tự phép tính', color: '#9b59b6' }
    };
    games.forEach(g => {
      let qrs = g.qResults || [], an = g.analytics || {}, dAtt = an.dAttempts || [], cAtt = an.cAttempts || [],
        wClicks = an.wrongClicks || [], dTimes = an.dTimes || [], activeQs = g.activeQuestions || [];
      qrs.forEach((qr, i) => {
        if (!qr) return; totalQ++;
        if (dAtt[i] === 'X') dFailBoth++;
        if (cAtt[i] === 'X') cFailBoth++;
        totalWrongClicks += (wClicks[i] || 0);
        if ((dTimes[i] || 99) < 8 && (!qr.dOk || !qr.cOk)) fastAndWrong++;
        let q = activeQs[i] || {}, et = q.errorType;
        if (et && subjectStats[et]) { subjectStats[et].count++; if (!qr.dOk || !qr.cOk) subjectStats[et].fail++; }
      });
    });
    let pct = (v, t) => t ? (v / t * 100) : 0;
    let subjectResults = Object.keys(subjectStats).map(k => {
      let s = subjectStats[k]; let score = s.count >= 2 ? pct(s.fail, s.count) : 0; return { ...s, score };
    }).filter(s => s.score >= 40);
    let behaviorResults = [
      { score: pct(dFailBoth, totalQ), label: '🔴 Hay bỏ sót lỗi', color: '#e74c3c', thresholdMet: pct(dFailBoth, totalQ) >= 30 },
      { score: pct(cFailBoth, totalQ), label: '🟠 Hay sửa sai', color: '#e67e22', thresholdMet: pct(cFailBoth, totalQ) >= 30 },
      { score: (totalWrongClicks / totalGames), label: '🟣 Click nhầm nhiều', color: '#8e44ad', thresholdMet: (totalWrongClicks / totalGames >= 2.5) },
      { score: fastAndWrong, label: '🔵 Đoán nhanh, sai nhiều', color: '#2980b9', thresholdMet: (fastAndWrong >= 2) }
    ];
    let validBehaviors = behaviorResults.filter(b => b.thresholdMet);
    if (subjectResults.length) {
      subjectResults.sort((a, b) => b.score - a.score);
      return { tag: `${subjectResults[0].label} (${Math.round(subjectResults[0].score)}%)`, color: subjectResults[0].color };
    }
    if (validBehaviors.length) {
      validBehaviors.sort((a, b) => b.score - a.score);
      return { tag: `${validBehaviors[0].label}`, color: validBehaviors[0].color };
    }
    return { tag: '✅ Không điểm yếu', color: '#2ed573' };
  }
};

/* ══ XP SYSTEM ══ */
const XP = {
  _cache: {},
  _currentName: '',

  async getProfile(playerName) {
    if (this._cache[playerName]) return this._cache[playerName];
    const profile = await LeaderboardSync.getProfile(playerName);
    if (profile) {
      this._cache[playerName] = profile;
    }
    return profile;
  },

  async handleRegister() {
    const nameInput = document.getElementById('player-name');
    const name = nameInput.value.trim();
    if (!name) {
      toast('Vui lòng nhập tên thật của bạn!', 'warn');
      return;
    }

    const btn = document.getElementById('btn-register-name');
    const statusEl = document.getElementById('name-check-status');

    btn.disabled = true;
    btn.textContent = 'Đang check...';

    try {
      const exists = await LeaderboardSync.getProfile(name);
      if (exists) {
        statusEl.style.display = 'block';
        statusEl.style.color = 'var(--red)';
        statusEl.textContent = '❌ Tên này đã có thám tử khác sử dụng!';
        toast('Tên đã tồn tại!', 'error');
      } else {
        const newProfile = {
          id: LeaderboardSync.getDeviceId(),
          name: name,
          xp: 0,
          best_streak: 0,
          total_cases: 0,
          perfect_cases: 0
        };
        await LeaderboardSync.uploadProfile(newProfile);
        this._cache[name] = newProfile;

        statusEl.style.display = 'block';
        statusEl.style.color = 'var(--green)';
        statusEl.textContent = '✅ Đăng ký thành công! Chào mừng thám tử mới!';
        toast('Đăng ký thành công!', 'correct');
        this.renderWelcome(true); // Force refresh with the new name
      }
    } catch (e) {
      console.error(e);
      statusEl.style.display = 'block';
      statusEl.style.color = 'var(--red)';
      statusEl.textContent = '❌ Lỗi đăng ký: ' + (e.message || 'Không thể kết nối Database');
      toast('Đăng ký thất bại!', 'error');
    } finally {
      btn.disabled = false;
      btn.textContent = 'Đăng ký';
    }
  },

  async saveProfile(playerName, xpAdd, bestStreak = 0, perfectCasesAdd = 0) {
    let profile = await this.getProfile(playerName);
    if (!profile) {
      // Nếu chưa có (chưa đăng ký) thì tạo profile tạm để lưu kết quả
      profile = {
        id: 'dev-' + Math.random().toString(36).substr(2, 9) + '-' + Date.now(),
        name: playerName,
        xp: 0,
        best_streak: 0,
        total_cases: 0,
        perfect_cases: 0
      };
    }
    profile.xp += xpAdd;
    if (bestStreak > (profile.best_streak || 0)) profile.best_streak = bestStreak;
    profile.total_cases = (profile.total_cases || 0) + 1;
    profile.perfect_cases = (profile.perfect_cases || 0) + perfectCasesAdd;

    await LeaderboardSync.uploadProfile(profile);
    this._cache[playerName] = profile;
    return profile;
  },

  getRank(xp) {
    let currentRank = XP_RANKS[0];
    for (let i = 0; i < XP_RANKS.length; i++) {
      if (xp >= XP_RANKS[i].required) currentRank = XP_RANKS[i];
    }
    return currentRank;
  },

  _nameTimeout: null,
  async renderWelcome(forceNameFromInput = false) {
    const nameInput = document.getElementById('player-name');
    if (!nameInput) return;

    const statusEl = document.getElementById('name-check-status');
    const regBtn = document.getElementById('btn-register-name');
    const errorEl = document.getElementById('name-error-msg');

    if (this._nameTimeout) clearTimeout(this._nameTimeout);

    this._nameTimeout = setTimeout(async () => {
      let profile = null;
      let name = nameInput.value.trim();
      const deviceId = LeaderboardSync.getDeviceId();

      // Nếu lần đầu load (không phải do gõ phím), thử tìm theo Device ID
      if (!forceNameFromInput && !name) {
        profile = await LeaderboardSync.getProfileById(deviceId);
        if (profile) {
          nameInput.value = profile.name;
          name = profile.name;
        }
      } else if (name) {
        profile = await this.getProfile(name);
      }

      const startBtns = document.querySelectorAll('.mode-card');
      let isOwner = true;

      if (profile) {
        // Kiểm tra xem profile này có thuộc về máy này không
        if (profile.id !== deviceId) {
          isOwner = false;
          if (statusEl) {
            statusEl.style.display = 'block';
            statusEl.style.color = 'var(--red)';
            statusEl.textContent = '❌ Tên này đã có chủ trên máy khác!';
          }
          if (regBtn) regBtn.style.display = 'none';
        } else {
          if (statusEl) {
            statusEl.style.display = 'block';
            statusEl.style.color = 'var(--cyan)';
            statusEl.textContent = '🕵️ Hồ sơ thám tử của bạn';
          }
          if (regBtn) regBtn.style.display = 'none';
        }
      } else {
        if (statusEl) {
          if (!name) {
            statusEl.style.display = 'none';
          } else {
            statusEl.style.display = 'block';
            statusEl.style.color = 'var(--yellow)';
            statusEl.textContent = '❓ Tên này chưa được đăng ký';
          }
        }
        if (regBtn) regBtn.style.display = name ? 'block' : 'none';
      }

      // Vô hiệu hóa nút chơi nếu không phải chủ sở hữu (chỉ làm mờ, vẫn cho click để hiện thông báo)
      startBtns.forEach(btn => {
        btn.style.opacity = isOwner ? '1' : '0.3';
      });

      const xp = profile ? profile.xp : 0;
      const rank = this.getRank(xp);

      // Hiển thị Rank
      const rankEl = document.getElementById('wx-rank');
      if (rankEl) {
        rankEl.innerHTML = `${rank.emoji} ${rank.name}`;
        rankEl.style.color = rank.color;
      }

      const fill = document.getElementById('wx-fill');
      if (fill) fill.style.background = rank.color;

      // UI Progress
      const elText = document.getElementById('wx-text');
      const elNext = document.getElementById('wx-next');

      if (rank.level === 10) {
        if (elText) elText.textContent = `${xp} XP (MAX)`;
        if (fill) fill.style.width = '100%';
        if (elNext) elNext.textContent = 'Đã đạt cấp bậc cao nhất!';
      } else {
        const xpInLevel = xp - rank.required;
        if (elText) elText.textContent = `${xp} / ${rank.required + rank.next} XP`;
        const pct = Math.min(100, Math.round((xpInLevel / rank.next) * 100));
        if (fill) fill.style.width = `${pct}%`;
        const remain = (rank.required + rank.next) - xp;
        if (elNext) elNext.textContent = `Cần ${remain} XP nữa để lên cấp ${XP_RANKS[rank.level].name}`;
      }

      if (errorEl) errorEl.style.display = 'none';

      // Show practice level badge
      const lvBadge = document.getElementById('wx-practice-level');
      if (lvBadge) {
        if (name && isOwner) {
          const lv = PracticeLevel.getLevel(name);
          const lvInfo = PracticeLevel.getLevelInfo(lv);
          lvBadge.innerHTML = `Cấp tự luyện: ${lvInfo.emoji} <strong>${lvInfo.name}</strong>`;
          lvBadge.style.color = lvInfo.color;
          lvBadge.style.display = 'block';
        } else {
          lvBadge.style.display = 'none';
        }
      }
    }, name === this._currentName ? 0 : 500);

    this._currentName = name;
  },

  calcGameXP(score, hp, bestStreak, perfectCount) {
    let xp = Math.floor(score / 3);
    if (hp === 3) xp += 20;
    if (bestStreak >= 5) xp += 15;
    if (perfectCount > 0) xp += perfectCount * 10;
    return xp;
  },

  async checkAndStart(mode) {
    const nameInput = document.getElementById('player-name');
    const name = nameInput ? nameInput.value.trim() : '';
    if (!name) {
      toast('Vui lòng nhập và đăng ký tên trước khi chơi!', 'warn');
      if (nameInput) nameInput.focus();
      return;
    }
    const profile = await this.getProfile(name);
    if (!profile) {
      toast('Tên này chưa được đăng ký! Vui lòng bấm Đăng ký.', 'warn');
      return;
    }
    if (profile.id !== LeaderboardSync.getDeviceId()) {
      toast('Tên này đã được người khác sử dụng trên máy khác!', 'error');
      return;
    }

    if (mode === 'lobby') {
      showScreen('screen-lobby');
      Lobby.init();
    } else if (mode === 'solo') {
      Game.startGame();
    }
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

/* ══ SESSION PERSISTENCE ══ */
const SessionManager = {
  KEY: 'erase_room_session',
  GAME_KEY: 'erase_game_session',
  saveStudent(roomCode, name) {
    sessionStorage.setItem(this.KEY, JSON.stringify({ role: 'student', roomCode, name }));
  },
  saveHost(roomCode, activeQuestions, qIdx, gameStarted) {
    sessionStorage.setItem(this.KEY, JSON.stringify({ role: 'host', roomCode, activeQuestions, qIdx, gameStarted }));
  },
  clear() { sessionStorage.removeItem(this.KEY); },
  get() {
    try { const r = sessionStorage.getItem(this.KEY); return r ? JSON.parse(r) : null; }
    catch (e) { return null; }
  },
  saveGame() {
    sessionStorage.setItem(this.GAME_KEY, JSON.stringify({
      name: S.name, qIdx: S.qIdx, score: S.score,
      qResults: S.qResults, analytics: S.analytics,
      hp: S.hp, streak: S.streak, bestStreak: S.bestStreak, comboMult: S.comboMult,
      activeQuestions: S.activeQuestions,
    }));
  },
  clearGame() { sessionStorage.removeItem(this.GAME_KEY); },
  getGame() {
    try { const r = sessionStorage.getItem(this.GAME_KEY); return r ? JSON.parse(r) : null; }
    catch (e) { return null; }
  }
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
  
  // 1. Fractions: a/b -> math-frac
  const withFractions = escaped.replace(
    /([−-]?[A-Za-z0-9.()]+)\s*\/\s*([−-]?[A-Za-z0-9.()]+)/g,
    '<span class="math-frac"><span class="math-frac-top">$1</span><span class="math-frac-bottom">$2</span></span>'
  );
  
  // 2. Exponents: a^b -> math-sup (support standard and full-width carets)
  return withFractions.replace(
    /([A-Za-z0-9.()]+)\s*[\^＾]\s*([−-]?[A-Za-z0-9.()]+)/g,
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
    if (/[\/^＾]/.test(txt) && txt.trim()) targets.push(node);
    node = walker.nextNode();
  }
  targets.forEach(textNode => {
    const html = formatMathText(textNode.nodeValue || '');
    if (!html || html === textNode.nodeValue) return;
    const wrap = document.createElement('span');
    wrap.className = 'math-formatted-wrap';
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
  const hintEl = document.getElementById('hint-content');
  hintEl.innerHTML = q.hint || 'Chú ý dấu khi chuyển vế.';
  applyMathFormatting(hintEl);
  
  const ruleEl = document.getElementById('rule-content');
  ruleEl.innerHTML = q.rule || 'Mỗi hạng tử chuyển vế phải đổi dấu!';
  applyMathFormatting(ruleEl);

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
    localStorage.setItem('erase_player_name', S.name);
    S.qIdx = 0; S.score = 0; S.qResults = [];
    S.analytics = { dAttempts: [], cAttempts: [], dTimes: [], cTimes: [], wrongClicks: [], extra: [] };
    S.active = true;
    HP.reset(); Streak.reset();

    // Load practice level for this player
    S.practiceLevel = PracticeLevel.getLevel(S.name);
    const lvInfo = PracticeLevel.getLevelInfo(S.practiceLevel);

    const count = window._bankQCount || (6 + Math.floor(Math.random() * 3));
    S.activeQuestions = QuestionManager.getQuestions(count, { difficultyFilter: lvInfo.difficulty });

    SessionManager.saveGame();
    showScreen('screen-game');
    Briefing.show(0, S.activeQuestions[0]).then(() => renderQ(0));
  },
  exitToMenu() {
    SessionManager.clearGame(); stopTimer(); S.active = false;
    XP.renderWelcome(); // Update level text
    showScreen('screen-welcome');
  },
  restartGame() { this.startGame(); },
  gameOver() {
    SessionManager.clearGame();
    stopTimer(); showScreen('screen-gameover');
    document.getElementById('go-score').textContent = S.score;
    const p = pct(S.score, S.activeQuestions.length * 25);
    
    // Evaluate practice level on game over
    let practiceMsg = '';
    if (S.practiceLevel !== undefined) {
      let totalAccPts = 0;
      const maxAccPts = S.activeQuestions.length * 2;
      S.activeQuestions.forEach((_, i) => {
        const da = S.analytics.dAttempts[i];
        const ca = S.analytics.cAttempts[i];
        if (da === 1) totalAccPts += 1.0;
        else if (da === 2) totalAccPts += 0.5;
        if (ca === 1) totalAccPts += 1.0;
        else if (ca === 2) totalAccPts += 0.5;
      });
      const accuracyPct = Math.round((totalAccPts / maxAccPts) * 100);
      const result = PracticeLevel.evaluate(S.name, S.practiceLevel, accuracyPct);
      if (result.action === 'down') {
        S.practiceLevel = result.newLevel;
        const newLvInfo = PracticeLevel.getLevelInfo(result.newLevel);
        practiceMsg = `<br><br><span style="color:#ff4757">📉 2 ván liên tiếp < 50% — Bạn đã bị hạ về cấp <strong>${newLvInfo.name}</strong> để luyện tập thêm!</span>`;
      } else if (accuracyPct < 50 && S.practiceLevel > 1) {
        practiceMsg = `<br><br><span style="color:#f5c518">⚠️ Cẩn thận! Nếu đạt < 50% ở ván tiếp theo, bạn sẽ bị hạ cấp!</span>`;
      }
    }

    let msg = 'Ôn lại quy tắc chuyển vế rồi nhận vụ mới! +a → −a, −a → +a 💪';
    if (p >= 50) msg = 'Suýt rồi! Lần sau cẩn thận hơn là phá án ngay!';
    document.getElementById('go-msg').innerHTML = msg + practiceMsg;
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
    SessionManager.saveGame();
    Briefing.show(S.qIdx, S.activeQuestions[S.qIdx]).then(() => renderQ(S.qIdx));
  },

  showResults() {
    SessionManager.clearGame();
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

    // ── Practice Level evaluation (solo mode only) ──
    const levelEl = document.getElementById('res-level-msg');
    if (levelEl && S.practiceLevel !== undefined) {
      // Accuracy: each question = 2 pts (1 detect + 1 correct), partial credit for 2nd attempt
      let totalAccPts = 0;
      const maxAccPts = S.activeQuestions.length * 2;
      S.activeQuestions.forEach((_, i) => {
        const da = S.analytics.dAttempts[i];
        const ca = S.analytics.cAttempts[i];
        if (da === 1) totalAccPts += 1.0;
        else if (da === 2) totalAccPts += 0.5;
        if (ca === 1) totalAccPts += 1.0;
        else if (ca === 2) totalAccPts += 0.5;
      });
      const accuracyPct = Math.round((totalAccPts / maxAccPts) * 100);

      const result = PracticeLevel.evaluate(S.name, S.practiceLevel, accuracyPct);

      if (result.action === 'up') {
        const newLvInfo = PracticeLevel.getLevelInfo(result.newLevel);
        S.practiceLevel = result.newLevel;
        levelEl.innerHTML = `<div class="level-up-banner">🎉 THĂNG CẤP! 2 ván liên tiếp ≥ 80% — Bạn đã mở khóa cấp <strong>${newLvInfo.name}</strong>! Ván tiếp theo sẽ khó hơn.</div>`;
        setTimeout(spawnConfetti, 200);
      } else if (result.action === 'down') {
        const newLvInfo = PracticeLevel.getLevelInfo(result.newLevel);
        S.practiceLevel = result.newLevel;
        levelEl.innerHTML = `<div class="level-info-banner">📉 2 ván liên tiếp < 50% — Về cấp <strong>${newLvInfo.name}</strong> để ôn tập thêm. Đạt ≥ 80% trong 2 ván liên tiếp để thăng cấp!</div>`;
      } else {
        const currentLv = PracticeLevel.getLevelInfo(S.practiceLevel);
        const hist = result.history; // last 1–2 results including current game
        let msg = '';
        if (S.practiceLevel < 3) {
          const nextLvInfo = PracticeLevel.getLevelInfo(S.practiceLevel + 1);
          if (accuracyPct >= 80) {
            msg = `🔥 Ván này đạt <strong>${accuracyPct}%</strong>! Đạt ≥ 80% ván tiếp nữa để lên cấp ${nextLvInfo.emoji} <strong>${nextLvInfo.name}</strong>!`;
          } else if (S.practiceLevel > 1 && accuracyPct < 50) {
            const prevLvInfo = PracticeLevel.getLevelInfo(S.practiceLevel - 1);
            msg = `⚠️ Ván này đạt <strong>${accuracyPct}%</strong> — cẩn thận! Đạt < 50% ván tiếp nữa sẽ về cấp ${prevLvInfo.name}.`;
          } else {
            msg = `Ván này đạt <strong>${accuracyPct}%</strong> — cần ≥ 80% trong 2 ván liên tiếp để lên cấp ${nextLvInfo.emoji} ${nextLvInfo.name}.`;
          }
        } else {
          if (accuracyPct < 50) {
            const prevLvInfo = PracticeLevel.getLevelInfo(S.practiceLevel - 1);
            msg = `⚠️ Đạt <strong>${accuracyPct}%</strong> — cẩn thận! Đạt < 50% ván tiếp nữa sẽ về cấp ${prevLvInfo.name}.`;
          } else {
            msg = `Đạt <strong>${accuracyPct}%</strong> — duy trì phong độ nhé!`;
          }
        }
        levelEl.innerHTML = `<div class="level-info-banner">${currentLv.emoji} Cấp <strong>${currentLv.name}</strong> — ${msg}</div>`;
      }
    } else if (levelEl) {
      levelEl.innerHTML = '';
    }

    this.save();
  },
  async save() {
    const perfectCount = S.qResults.filter(r => r && r.perfect).length;
    const earnedXp = XP.calcGameXP(S.score, S.hp, S.bestStreak, perfectCount);
    const perfectCasesAdd = perfectCount === S.activeQuestions.length ? 1 : 0;

    await XP.saveProfile(S.name, earnedXp, S.bestStreak, perfectCasesAdd);
    XP.renderWelcome(); // Update UI in welcome screen
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
    const info = document.getElementById('bank-count-label') || document.getElementById('wf-bank-status');
    if (info) info.innerHTML = `✓ ${this._parsed.length} câu đã nạp · ${count}/lượt`;
    this.close(); toast(`✓ Đã nạp ${this._parsed.length} câu!`, 'ok');
  }
};
// Add listeners safely
document.addEventListener('DOMContentLoaded', () => {
  const bta = document.getElementById('bank-textarea');
  if (bta) {
    bta.addEventListener('input', function () { if (this.value.trim()) BankModal.parseJSON(this.value.trim()); });
  }
  const dz = document.getElementById('bm-drop-zone');
  if (dz) {
    dz.addEventListener('dragover', e => { e.preventDefault(); dz.classList.add('drag-over') });
    dz.addEventListener('dragleave', () => dz.classList.remove('drag-over'));
    dz.addEventListener('drop', e => {
      e.preventDefault(); dz.classList.remove('drag-over');
      const f = e.dataTransfer.files[0];
      if (f && f.name.endsWith('.json')) {
        const sub = document.getElementById('bm-drop-sub');
        if (sub) sub.textContent = f.name;
        const r = new FileReader(); r.onload = ev => BankModal.parseJSON(ev.target.result); r.readAsText(f);
      }
    });
  }
});

/* ══════════════════════════════════════════════
   CHALLENGE MODE
══════════════════════════════════════════════ */


/* ══ CLOUD BANK (Supabase) ══ */
const CloudBank = {
  async fetchAll() {
    if (!LeaderboardSync.enabled || !window.supabase) return null;
    LeaderboardSync.init();
    try {
      const { data, error } = await LeaderboardSync.client
        .from('questions')
        .select('*')
        .order('id', { ascending: true });
      if (error) {
        console.error('Supabase Question Fetch Error:', error.message);
        return null;
      }
      return data;
    } catch (e) {
      console.error('CloudBank Fetch Error:', e);
      return null;
    }
  },

  async pushAll(questions) {
    if (!LeaderboardSync.enabled || !window.supabase) return;
    LeaderboardSync.init();

    // Prepare for DB: stringify JSON fields
    const toPush = questions.map(q => ({
      ...q,
      steps: typeof q.steps !== 'string' ? JSON.stringify(q.steps) : q.steps,
      errTokens: typeof q.errTokens !== 'string' ? JSON.stringify(q.errTokens) : q.errTokens,
      primaryErr: typeof q.primaryErr !== 'string' ? JSON.stringify(q.primaryErr) : q.primaryErr,
      correction: typeof q.correction !== 'string' ? JSON.stringify(q.correction) : q.correction,
    }));

    const { error } = await LeaderboardSync.client
      .from('questions')
      .upsert(toPush, { onConflict: 'id' });

    if (error) throw error;
  },

  async deleteAll() {
    if (!LeaderboardSync.enabled || !window.supabase) throw new Error('Supabase chưa được kết nối.');
    LeaderboardSync.init();
    const { data, error } = await LeaderboardSync.client
      .from('questions')
      .delete()
      .not('id', 'is', null)
      .select('id');
    if (error) throw error;
    if (!data || data.length === 0) throw new Error('Không xóa được dữ liệu. Kiểm tra quyền DELETE trong Supabase RLS.');
  },

  mapFromDB(data) {
    return data.map(q => ({
      ...q,
      difficulty: q.difficulty || 'easy',
      topic: q.topic || 'Toán học',
      steps: typeof q.steps === 'string' ? JSON.parse(q.steps) : q.steps,
      errTokens: typeof q.errTokens === 'string' ? JSON.parse(q.errTokens) : q.errTokens,
      primaryErr: typeof q.primaryErr === 'string' ? JSON.parse(q.primaryErr) : q.primaryErr,
      correction: typeof q.correction === 'string' ? JSON.parse(q.correction) : q.correction,
    }));
  }
};

/* ══════════════════════════════════════════════
   PROFILE SCREEN
══════════════════════════════════════════════ */
const Profile = {
  async init() {
    await this.renderStats();
    this.renderBank();
    this.renderHistory();
  },

  async renderStats() {
    const bank = window._bankQuestions || null;
    const bankCount = bank ? bank.length : 0;
    document.getElementById('ps-bank-count').innerHTML = `${bankCount}<span> câu</span>`;
  },

  renderBank() {
    const bank = window._bankQuestions;
    const listEl = document.getElementById('bank-q-list');
    const emptyEl = document.getElementById('bank-empty-state');
    const clearBtn = document.getElementById('btn-clear-bank');
    const countLbl = document.getElementById('bank-count-label');

    if (!bank || !bank.length) {
      emptyEl.style.display = 'block'; listEl.innerHTML = ''; clearBtn.style.display = 'none';
      countLbl.textContent = bank === null ? 'Đang tải từ Database...' : 'Ngân hàng trống. Upload file JSON để bắt đầu.';
      document.getElementById('ps-bank-count').innerHTML = '0<span> câu</span>';
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
    applyMathFormatting(listEl);
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
    // Lịch sử chi tiết tạm thời tắt khi chuyển sang Database
    const tbody = document.getElementById('history-tbody');
    const empty = document.getElementById('history-empty');
    tbody.innerHTML = '';
    empty.style.display = 'block';
    empty.textContent = 'Dữ liệu lịch sử đã được chuyển lên đám mây. ☁️';
  },

  handleFile(e) {
    const f = e.target.files[0]; if (!f) return;
    const r = new FileReader();
    r.onload = async ev => await this.applyJSON(ev.target.result, f.name);
    r.readAsText(f);
  },

  togglePaste() {
    const p = document.getElementById('paste-panel');
    p.classList.toggle('show');
    if (p.classList.contains('show')) document.getElementById('profile-paste-area').focus();
  },

  async applyPaste() {
    await this.applyJSON(document.getElementById('profile-paste-area').value);
  },

  async applyJSON(str, filename) {
    const vEl = document.getElementById('paste-validation');
    vEl.style.display = 'none';
    try {
      const data = JSON.parse(str.trim());
      if (!Array.isArray(data) || !data.length) throw new Error('Cần mảng JSON ít nhất 1 phần tử');
      const req = ['id', 'topic', 'problem', 'steps', 'errTokens', 'primaryErr', 'correction'];
      const miss = req.filter(k => !data[0].hasOwnProperty(k));
      if (miss.length) throw new Error('Thiếu trường: ' + miss.join(', '));

      await QuestionManager.save(data);
      window._bankQCount = Math.min(parseInt(document.getElementById('profile-q-count').value) || 7, data.length);
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

  async clearBank() {
    if (!confirm('Xóa toàn bộ ngân hàng đề tùy chỉnh? Sẽ về đề mặc định.')) return;
    try {
      await CloudBank.deleteAll();
    } catch (e) {
      console.error('Xóa database thất bại:', e);
      toast('Xóa thất bại: ' + (e.message || e), 'warn');
      return;
    }
    QuestionManager.clear();
    window._bankQCount = null;
    const b = document.getElementById('bank-mode-badge');
    const s = document.getElementById('wf-bank-status');
    if (b) b.innerHTML = '📁';
    if (s) s.textContent = '';
    document.getElementById('profile-q-count').value = 7;
    this.renderBank(); this.renderStats();
    toast('Đã xóa ngân hàng tùy chỉnh', '');
  },

  async syncCloud() {
    const btn = document.getElementById('btn-sync-bank');
    if (!btn) return;
    btn.disabled = true;
    const oldText = btn.innerHTML;
    btn.innerHTML = '⌛ Đang tải...';

    try {
      const data = await CloudBank.fetchAll();
      if (data && data.length > 0) {
        const mapped = CloudBank.mapFromDB(data);
        QuestionManager.save(mapped); // This will also save to local
        this.renderBank();
        this.renderStats();
        this.updateWelcomeBadge(mapped.length);
        toast(`✓ Đồng bộ thành công ${mapped.length} câu!`, 'correct');
      } else {
        toast('Không tìm thấy dữ liệu trên Cloud.', 'warn');
      }
    } catch (e) {
      console.error(e);
      toast('Lỗi đồng bộ: ' + e.message, 'error');
    } finally {
      btn.disabled = false;
      btn.innerHTML = oldText;
    }
  }
};




/* ══════════════════════════════════════════════════════════════
   LOBBY — choose host or join
══════════════════════════════════════════════════════════════ */
const Lobby = {
  init() {
    const pool = window._bankQuestions || [];
    document.getElementById('host-q-count').max = pool.length;
    document.getElementById('host-q-note').textContent = `/ ${pool.length} câu có sẵn`;
    
    const nameInput = document.getElementById('player-name');
    const name = nameInput ? nameInput.value.trim() : '';
    const disp = document.getElementById('join-name-display');
    if (disp) disp.textContent = name;
  },
  switchTab(tab) {
    document.querySelectorAll('.ltab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.lobby-panel').forEach(p => p.classList.remove('active'));
    document.getElementById('ltab-' + tab).classList.add('active');
    document.getElementById('lpanel-' + tab).classList.add('active');

    if (tab === 'join') {
      const nameInput = document.getElementById('player-name');
      const name = nameInput ? nameInput.value.trim() : '';
      const disp = document.getElementById('join-name-display');
      if (disp) disp.textContent = name;
    }
  },
  _presets: {
    review: { easy: 0.70, medium: 0.30, hard: 0.00 },
    normal: { easy: 0.40, medium: 0.40, hard: 0.20 },
    exam:   { easy: 0.20, medium: 0.50, hard: 0.30 },
  },
  _selectedPreset: 'review',

  selectPreset(el) {
    document.querySelectorAll('.host-preset-card').forEach(c => c.classList.remove('active'));
    el.classList.add('active');
    this._selectedPreset = el.dataset.preset;
  },

  startHost() {
    const count = parseInt(document.getElementById('host-q-count').value) || 5;
    const ratios = this._presets[this._selectedPreset] || this._presets.normal;
    RoomHost.init(count, ratios);
  },
  joinRoom() {
    const rawCode = document.getElementById('join-code-input').value.trim().toUpperCase();
    const nameInput = document.getElementById('player-name');
    const name = nameInput ? nameInput.value.trim() : '';

    // Normalize code: remove hyphens and spaces
    let code = rawCode.replace(/[-\s]/g, '');

    // Auto-prefix ERAS if only 4 digits provided
    if (code.length === 4 && /^\d+$/.test(code)) {
      code = 'ERAS' + code;
    }

    if (!code || code.length < 4) { toast('Mã phòng không hợp lệ!', 'err'); return; }
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

  init(qCount, ratios) {
    this.activeQuestions = QuestionManager.getQuestions(qCount, { ratios });
    this.qIdx = 0; this.gameStarted = false;
    this.conns = {};

    // Generate room code: ERAS-XXXX
    const rand = Math.floor(1000 + Math.random() * 9000);
    this.roomCode = 'ERAS' + rand;

    showScreen('screen-host');
    document.getElementById('hb-room-code').textContent = this.roomCode;
    document.getElementById('hwcd-code').textContent = this.roomCode;
    document.getElementById('host-waiting-view').style.display = 'flex';
    document.getElementById('host-game-view').style.display = 'none';

    if (typeof Peer === 'undefined') {
      toast('Lỗi: Thư viện PeerJS không tải được. Kiểm tra kết nối mạng!', 'err');
      showScreen('screen-lobby');
      return;
    }

    SessionManager.saveHost(this.roomCode, this.activeQuestions, this.qIdx, false);
    this._createPeer();
  },

  restore(session) {
    this.roomCode = session.roomCode;
    this.activeQuestions = session.activeQuestions;
    this.qIdx = session.qIdx;
    this.gameStarted = session.gameStarted;
    this.conns = {};

    showScreen('screen-host');
    document.getElementById('hb-room-code').textContent = this.roomCode;
    document.getElementById('hwcd-code').textContent = this.roomCode;

    if (this.gameStarted) {
      document.getElementById('host-waiting-view').style.display = 'none';
      const gv = document.getElementById('host-game-view');
      gv.style.display = 'flex'; gv.style.flexDirection = 'column';
      document.getElementById('host-q-num').style.display = 'flex';
      document.getElementById('host-timer-wrap').style.display = 'flex';
      this._loadCase(this.qIdx);
    } else {
      document.getElementById('host-waiting-view').style.display = 'flex';
      document.getElementById('host-game-view').style.display = 'none';
    }

    if (typeof Peer === 'undefined') {
      toast('Lỗi: Thư viện PeerJS không tải được!', 'err');
      return;
    }
    this._createPeer(0, true);
  },

  _createPeer(retryCount = 0, isRestore = false) {
    const peerId = 'erase-room-' + this.roomCode;
    console.log('RoomHost: Creating Peer with ID:', peerId, isRestore ? '(restore)' : '');

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
      toast(isRestore ? ('✓ Đã khôi phục phòng: ' + this.roomCode) : ('✓ Phòng đã tạo: ' + this.roomCode), 'ok');
    });
    this.peer.on('connection', conn => this._onConnection(conn));
    this.peer.on('disconnected', () => {
      console.warn('Host disconnected from signaling server. Reconnecting...');
      this.peer.reconnect();
    });
    this.peer.on('error', err => {
      console.error('Host Peer Error:', err);
      if (err.type === 'unavailable-id') {
        if (isRestore && retryCount < 5) {
          const wait = (retryCount + 1) * 3;
          toast(`Đang chờ phiên cũ hết hạn... thử lại sau ${wait}s`, '');
          setTimeout(() => this._createPeer(retryCount + 1, true), wait * 1000);
        } else {
          toast('Mã phòng đã tồn tại, thử lại!', 'err');
          SessionManager.clear();
          showScreen('screen-lobby');
        }
      } else {
        toast('Lỗi kết nối: ' + err.type, 'err');
      }
    });
  },

  _saveSession() {
    SessionManager.saveHost(this.roomCode, this.activeQuestions, this.qIdx, this.gameStarted);
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

    let correct = false;
    if (q.correction.type === 'mc' || q.correction.type === 'symbol') {
      correct = mcSel === q.correction.correct;
    } else {
      // Text answer
      const val = (mcSel || '').toString().trim().replace(/\s+/g, '');
      correct = q.correction.correctAnswers && q.correction.correctAnswers.some(a => a.replace(/\s+/g, '') === val);
    }

    let pts = 0;
    if (correct) {
      pts = p.cAttempt === 1 ? 10 : 5;
      if (p.dOk && p.cAttempt === 1) pts += 5; // perfect bonus
      p.score += pts; p.cAnswered = true;
      p.conn.send({ type: 'correct_result', correct: true, pts, exp: q.correction.exp, cAttempt: p.cAttempt });
    } else if (p.cAttempt < 2) {
      pts = -5;
      p.score += pts;
      p.conn.send({ type: 'correct_result', correct: false, again: true, pts, cAttempt: p.cAttempt });
    } else {
      p.cAnswered = true;
      pts = -5;
      p.score += pts;
      const disp = q.correction.displayCorrect || q.correction.correct || (q.correction.correctAnswers ? q.correction.correctAnswers[0] : '?');
      p.conn.send({ type: 'correct_result', correct: false, again: false, pts, answer: disp, exp: q.correction.exp, cAttempt: p.cAttempt });
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
    if (allDone) {
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
    this._saveSession();
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
    this._saveSession();
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
    const btnNext = document.getElementById('host-btn-next');
    btnNext.textContent = 'Vụ tiếp ▶';
    btnNext.onclick = () => this.nextCase();
    btnNext.disabled = false;
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
    console.log('RoomHost: revealAnswer clicked. Phase:', this.phase, 'qIdx:', this.qIdx);
    const q = this.activeQuestions[this.qIdx];
    if (this.phase === 'detect') {
      q.errTokens.forEach(t => {
        const e = document.getElementById(`htk-${t}`);
        if (e) { e.classList.add('revealed-error'); }
      });
      const fb = document.getElementById('host-feedback');
      fb.className = 'ch-feedback-big show fc-warn';
      fb.innerHTML = `<div class="cfb-icon">💡</div><div class="cfb-text"><strong>Đây là dấu bị làm sai!</strong><div class="cfb-rule">${q.rule}</div></div>`;
      applyMathFormatting(fb);
      this._broadcast({ type: 'reveal_detect', errTokens: q.errTokens, rule: q.rule });
      document.getElementById('host-btn-skip').style.display = 'inline-flex';
    } else {
      const disp = q.correction.displayCorrect || q.correction.correct || (q.correction.correctAnswers ? q.correction.correctAnswers[0] : '?');
      const fb = document.getElementById('host-feedback');
      fb.className = 'ch-feedback-big show fc-correct';
      fb.innerHTML = `<div class="cfb-icon">✅</div><div class="cfb-text"><strong>Cách sửa đúng:</strong> <span class="math-tex">${disp}</span><div class="cfb-rule">${q.correction.exp || ''}</div></div>`;
      applyMathFormatting(fb);
      this._broadcast({ type: 'reveal_correct', answer: disp, exp: q.correction.exp });
      document.getElementById('host-btn-next').disabled = false;
    }
  },

  moveToCorrection() {
    console.log('RoomHost: moveToCorrection clicked. qIdx:', this.qIdx);
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
    this._broadcast({
      type: 'phase',
      phase: 'correct',
      correction: {
        question: q.correction.question,
        wrongExpr: q.correction.wrongExpr,
        symbols: q.correction.symbols,
        type: q.correction.type,
        opts: q.correction.opts
      }
    });
  },

  nextCase() {
    console.log('RoomHost: nextCase clicked. Current qIdx:', this.qIdx);
    this._stopTimer();
    if (this.qIdx + 1 >= this.activeQuestions.length) {
      this._showHostResults(); return;
    }
    this._loadCase(this.qIdx + 1);
  },

  _showHostResults() {
    this._stopTimer();
    const players = Object.values(this.conns).sort((a, b) => b.score - a.score);
    this._broadcast({ type: 'game_end', leaderboard: players.map(p => ({name: p.name, score: p.score})) });
    
    const list = document.getElementById('room-results-list');
    list.innerHTML = players.map((p, i) => {
      let crown = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`;
      let bg = i === 0 ? 'rgba(245,197,24,0.15)' :
               i === 1 ? 'rgba(200,200,200,0.1)' :
               i === 2 ? 'rgba(176,141,87,0.1)' : 'var(--space2)';
      let border = i === 0 ? '2px solid rgba(245,197,24,0.5)' : 
                   i === 1 ? '2px solid rgba(200,200,200,0.5)' : 
                   i === 2 ? '2px solid rgba(176,141,87,0.5)' : '2px solid var(--border)';
      let textColor = i === 0 ? 'var(--yellow)' : 'var(--white)';
      
      return `<div style="display:flex;align-items:center;background:${bg};border:${border};padding:15px 20px;border-radius:12px;margin-bottom:8px; transform: scale(${i===0?1.03:1}); transition: transform 0.2s;">
                <div style="font-size:32px;width:50px;text-align:center;">${crown}</div>
                <div style="flex:1;font-weight:900;font-size:20px;margin-left:15px;color:${textColor};">${p.name}</div>
                <div style="font-family:var(--font-title);font-size:28px;color:${textColor};">${p.score} <span style="font-size:14px;opacity:0.7;">PT</span></div>
              </div>`;
    }).join('');
    
    document.getElementById('btn-room-results-close').onclick = () => this.exitToMenu();
    showScreen('screen-room-results');
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
    SessionManager.clear();
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
    SessionManager.saveStudent(code, name);

    showScreen('screen-student');
    document.getElementById('sb-name').textContent = name;
    document.getElementById('sb-room').textContent = 'PHÒNG: ' + code;
    document.getElementById('student-score').textContent = '0';
    document.getElementById('student-waiting-view').style.display = 'flex';
    document.getElementById('student-q-card').style.display = 'none';
    document.getElementById('student-sw-dots').style.display = 'flex';
    document.getElementById('student-game-over-ctrl').style.display = 'none';
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
      case 'reveal_correct':
        this._revealCorrect(data.answer, data.exp);
        break;
      case 'game_end':
        this._showGameEnd(data.leaderboard);
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
    const studentHint = document.getElementById('student-hint');
    studentHint.innerHTML = q.hint || '';
    applyMathFormatting(studentHint);

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
      document.getElementById('student-btn-detect').disabled = true;
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
    document.getElementById('student-btn-correct').disabled = true;

    const area = document.getElementById('student-corr-input'); area.innerHTML = '';
    const type = corr.type;
    if (type === 'symbol') {
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
    } else if (type === 'mc') {
      const mc = document.createElement('div'); mc.className = 'mc-options';
      (corr.opts || []).forEach((opt, i) => {
        const letter = ['A', 'B', 'C', 'D'][i] || '?';
        const d = document.createElement('div'); d.className = 'mc-opt'; d.id = 'stmco-' + i;
        d.innerHTML = `<span class="mc-letter">${letter}</span>${opt}`;
        d.addEventListener('click', () => {
          for (let j = 0; j < corr.opts.length; j++) {
            const el = document.getElementById('stmco-' + j); if (el) el.className = 'mc-opt';
          }
          d.className = 'mc-opt selected'; this.mcSel = i;
          document.getElementById('student-btn-correct').disabled = false;
        });
        mc.appendChild(d);
      });
      area.appendChild(mc);
    } else {
      const wrap = document.createElement('div'); wrap.className = 'answer-line';
      const lbl = document.createElement('span'); lbl.className = 'answer-label'; lbl.textContent = 'ĐÁP ÁN:';
      const inp = document.createElement('input'); inp.type = 'text'; inp.className = 'answer-input'; inp.id = 'st-ans-input';
      inp.placeholder = 'Nhập biểu thức đúng…';
      inp.addEventListener('input', () => {
        this.mcSel = inp.value.trim();
        document.getElementById('student-btn-correct').disabled = !this.mcSel;
      });
      inp.addEventListener('keydown', e => { if (e.key === 'Enter') this.submitCorrect(); });
      wrap.appendChild(lbl); wrap.appendChild(inp); area.appendChild(wrap);
      setTimeout(() => inp.focus(), 150);
    }
  },

  submitCorrect() {
    if (this.mcSel === null || this.mcSel === '' || this.cAttempt >= 2) return;
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
      if (data.pts) { this.score += data.pts; this._updateScore(); }
      this.mcSel = null;
      const area = document.getElementById('student-corr-input');
      area.querySelectorAll('.sym-key').forEach(b => b.className = 'sym-key');
      area.querySelectorAll('.mc-opt').forEach(b => b.className = 'mc-opt');
      const msg = data.pts ? `<strong>Chưa đúng — còn 1 lần!</strong><br><em style="color:var(--red)">${data.pts} điểm</em>` : '<strong>Chưa đúng — còn 1 lần!</strong>';
      this._showStudentFB('correct', '❌', msg, 'wrong');
      document.getElementById('student-btn-correct').disabled = true;
    } else {
      if (data.pts) { this.score += data.pts; this._updateScore(); }
      const msg = data.pts ? `<em style="color:var(--red)">${data.pts} điểm</em>` : '';
      this._showStudentFB('correct', '💔',
        `<strong>Đáp án đúng là: <em style="color:var(--yellow)">${data.answer || '?'}</em></strong><br>${msg}<div class="fc-explain">${data.exp || ''}</div>`, 'wrong');
      setTimeout(() => {
        document.getElementById('wo-title').textContent = '⏳ Chờ vụ án tiếp theo...';
        document.getElementById('wo-sub').textContent = 'Lần này chưa sửa được đâu nhé!';
        document.getElementById('wo-pts').textContent = data.pts || 0;
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

  _revealCorrect(answer, exp) {
    this._showStudentFB('correct', '💡', `<strong>GV đã hiện đáp án!</strong><br>Đáp án: <em style="color:var(--yellow)">${answer}</em><div class="fc-explain">${exp || ''}</div>`, 'wait');
    document.getElementById('student-btn-correct').disabled = true;
  },

  _showGameEnd(leaderboard) {
    document.getElementById('waiting-overlay').classList.remove('show');
    document.getElementById('student-q-card').style.display = 'none';
    document.getElementById('student-waiting-view').style.display = 'none';

    if (leaderboard) {
      const list = document.getElementById('room-results-list');
      list.innerHTML = leaderboard.map((p, i) => {
        let crown = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`;
        let bg = i === 0 ? 'rgba(245,197,24,0.15)' :
                 i === 1 ? 'rgba(200,200,200,0.1)' :
                 i === 2 ? 'rgba(176,141,87,0.1)' : 'var(--space2)';
        let border = i === 0 ? '2px solid rgba(245,197,24,0.5)' : 
                     i === 1 ? '2px solid rgba(200,200,200,0.5)' : 
                     i === 2 ? '2px solid rgba(176,141,87,0.5)' : '2px solid var(--border)';
        let textColor = i === 0 ? 'var(--yellow)' : 'var(--white)';
        
        let isMe = p.name === S.name;
        if (isMe) {
            bg = 'rgba(46,213,115,0.15)';
            border = '2px solid var(--green)';
            textColor = 'var(--white)';
        }
        
        return `<div style="display:flex;align-items:center;background:${bg};border:${border};padding:15px 20px;border-radius:12px;margin-bottom:8px; transform: scale(${isMe||i===0?1.03:1}); transition: transform 0.2s;">
                  <div style="font-size:32px;width:50px;text-align:center;">${crown}</div>
                  <div style="flex:1;font-weight:900;font-size:20px;margin-left:15px;color:${textColor};">${p.name} ${isMe ? ' <span style="font-size:14px;color:var(--green);">(BẠN)</span>' : ''}</div>
                  <div style="font-family:var(--font-title);font-size:28px;color:${isMe?'var(--green)':textColor};">${p.score} <span style="font-size:14px;opacity:0.7;">PT</span></div>
                </div>`;
      }).join('');
      document.getElementById('btn-room-results-close').onclick = () => this.exitToMenu();
      showScreen('screen-room-results');
      spawnConfetti();
    } else {
      // Fallback
      const wv = document.getElementById('student-waiting-view');
      wv.style.display = 'flex';
      document.getElementById('student-wait-title').textContent = '🏆 Vụ án kết thúc!';
      document.getElementById('student-wait-sub').textContent = `Tổng điểm của bạn: ${this.score} điểm`;
      document.getElementById('student-sw-dots').style.display = 'none';
      const ctrl = document.getElementById('student-game-over-ctrl');
      ctrl.style.display = 'flex';
      document.getElementById('student-final-score').textContent = this.score;
      spawnConfetti();
    }
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
  },

  exitToMenu() {
    SessionManager.clear();
    if (this.hostConn) this.hostConn.close();
    location.reload();
  }
};

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
  XP.renderWelcome();
  QuestionManager.init();

  const session = SessionManager.get();
  if (session) {
    setTimeout(() => {
      if (session.role === 'student') {
        toast('Đang kết nối lại phòng ' + session.roomCode + '...', 'ok');
        RoomStudent.init(session.roomCode, session.name);
      } else if (session.role === 'host') {
        toast('Đang khôi phục phòng ' + session.roomCode + '...', 'ok');
        RoomHost.restore(session);
      }
    }, 600);
  }

  const gameSave = !session && SessionManager.getGame();
  if (gameSave && gameSave.activeQuestions && gameSave.activeQuestions.length) {
    setTimeout(() => {
      Object.assign(S, {
        name: gameSave.name,
        qIdx: gameSave.qIdx,
        score: gameSave.score,
        qResults: gameSave.qResults || [],
        analytics: gameSave.analytics || { dAttempts: [], cAttempts: [], dTimes: [], cTimes: [], wrongClicks: [], extra: [] },
        hp: gameSave.hp,
        streak: gameSave.streak,
        bestStreak: gameSave.bestStreak,
        comboMult: gameSave.comboMult,
        activeQuestions: gameSave.activeQuestions,
        active: true,
      });
      toast('Đã khôi phục game — tiếp tục vụ án ' + (S.qIdx + 1) + '!', 'ok');
      showScreen('screen-game');
      HP.render();
      Streak.render();
      updateScoreUI();
      renderQ(S.qIdx);
    }, 600);
  }
});

