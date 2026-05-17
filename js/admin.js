/* ═══════════════════════════════════════════════════════
   ADMIN DASHBOARD — JavaScript
   Tính toán và hiển thị thống kê học sinh cho Admin
═══════════════════════════════════════════════════════ */

'use strict';

// ── Supabase config (giống app.js) ──
const SUPABASE_URL = 'https://eehegsaxegizcynygafk.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVlaGVnc2F4ZWdpemN5bnlnYWZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5MzIyNTcsImV4cCI6MjA5MjUwODI1N30.RsAipm-k-6sGT5fnDJp1wQ8Q8rQrLvabYyfgMscDIc4';

let _sbClient = null;
function getSupabase() {
  if (_sbClient) return _sbClient;
  if (!window.supabase) { console.error('Supabase SDK chưa load!'); return null; }
  _sbClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
  return _sbClient;
}

// ── Session (lấy từ sessionStorage giống app.js) ──
const SESSION_KEY = 'erase_auth_user';
function getAuthUser() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) { return null; }
}

/* ════════════════════════════════════════════════════════
   ANALYTICS ENGINE
   Tính toán 5 chỉ số từ raw game_logs
════════════════════════════════════════════════════════ */
const AnalyticsEngine = {

  // Ánh xạ errorType → text mô tả cho GĐ1 và GĐ2
  ERROR_LABELS: {
    chuyenVe: {
      gd1: 'Không tìm ra lỗi chuyển vế',
      gd2: 'Nhầm khi sửa quy tắc chuyển vế',
    },
    thuTu: {
      gd1: 'Không tìm ra lỗi thứ tự phép tính',
      gd2: 'Nhầm khi sửa thứ tự phép tính',
    },
    tinhToan: {
      gd1: 'Không tìm ra lỗi tính toán',
      gd2: 'Không sửa được lỗi tính toán',
    },
    ngoac: {
      gd1: 'Không tìm ra lỗi dấu ngoặc',
      gd2: 'Nhầm khi sửa dấu ngoặc',
    },
    dauNgoac: {
      gd1: 'Không tìm ra lỗi dấu ngoặc',
      gd2: 'Nhầm khi sửa dấu ngoặc',
    },
  },

  /** Parse jsonb field từ Supabase (có thể là string hoặc array) */
  _parse(field, fallback = []) {
    if (!field) return fallback;
    if (Array.isArray(field)) return field;
    try { return JSON.parse(field); } catch { return fallback; }
  },

  /**
   * Từ danh sách logs của 1 học sinh, tính 5 chỉ số.
   * @param {string} name - Tên học sinh
   * @param {Array}  logs - Tất cả rows của HS này từ game_logs
   * @returns {Object} stats object
   */
  computeStudentStats(name, logs) {
    const totalGames = logs.length;

    if (totalGames === 0) {
      return {
        name,
        totalGames: 0,
        errorGD1: null,
        errorGD2: null,
        avgSpeedSec: null,
        progress: 'na',
        progressDelta: null,
        warning: false,
      };
    }

    // ── Tập hợp số liệu thô ──
    let totalQs = 0;
    let failDetectCount = 0;     // câu bị 'X' ở GĐ1
    let failCorrectCount = 0;    // câu bị 'X' ở GĐ2
    let totalWrongClicks = 0;
    let speedSamples = [];       // [sec] mỗi câu

    // Đếm thất bại theo errorType
    const detectFails  = {};  // { chuyenVe: { total: 5, fail: 3 }, ... }
    const correctFails = {};

    logs.forEach(log => {
      const dRes  = this._parse(log.detect_results);
      const cRes  = this._parse(log.correct_results);
      const dTime = this._parse(log.detect_times);
      const cTime = this._parse(log.correct_times);
      const wClk  = this._parse(log.wrong_clicks);
      const eType = this._parse(log.error_types);
      const n = log.total_questions || 0;

      totalQs += n;

      for (let i = 0; i < n; i++) {
        const dR = dRes[i];
        const cR = cRes[i];
        const et = eType[i] || 'unknown';

        // Thống kê GĐ1
        if (!detectFails[et])  detectFails[et]  = { total: 0, fail: 0 };
        detectFails[et].total++;
        if (dR === 'X') { failDetectCount++; detectFails[et].fail++; }

        // Thống kê GĐ2
        if (!correctFails[et]) correctFails[et] = { total: 0, fail: 0 };
        correctFails[et].total++;
        if (cR === 'X') { failCorrectCount++; correctFails[et].fail++; }

        // Click nhầm
        totalWrongClicks += (wClk[i] || 0);

        // Tốc độ = tổng thời gian mỗi câu (GĐ1 + GĐ2)
        const dt = dTime[i] || 0;
        const ct = cTime[i] || 0;
        if (dt > 0 || ct > 0) speedSamples.push(dt + ct);
      }
    });

    // ── Tính tỉ lệ thất bại ──
    const failRateD = totalQs > 0 ? (failDetectCount  / totalQs) * 100 : 0;
    const failRateC = totalQs > 0 ? (failCorrectCount / totalQs) * 100 : 0;
    const avgWrongClicks = totalGames > 0 ? totalWrongClicks / totalGames : 0;

    // ── GĐ1 lỗi nổi bật ──
    const errorGD1 = this._findTopError(detectFails, 40, 'gd1') ||
      (avgWrongClicks >= 2 ? 'Chưa nhận diện được dấu sai' : null);

    // ── GĐ2 lỗi nổi bật ──
    const errorGD2 = this._findTopError(correctFails, 40, 'gd2');

    // ── Tốc độ trung bình ──
    const avgSpeedSec = speedSamples.length > 0
      ? Math.round(speedSamples.reduce((a, b) => a + b, 0) / speedSamples.length)
      : null;

    // ── Tiến bộ ──
    const { progress, delta } = this._calcProgress(logs);

    // ── ⚠️ Cảnh báo ──
    const warning = (failRateD >= 30 && failRateC >= 30) || progress === 'down';

    return {
      name,
      totalGames,
      errorGD1,
      errorGD2,
      avgSpeedSec,
      progress,
      progressDelta: delta,
      warning,
    };
  },

  /** Tìm loại lỗi có tỉ lệ thất bại cao nhất và >= ngưỡng */
  _findTopError(failMap, threshold, phase) {
    let best = null;
    let bestScore = 0;

    Object.entries(failMap).forEach(([et, { total, fail }]) => {
      if (total < 2) return; // không đủ mẫu
      const rate = (fail / total) * 100;
      if (rate >= threshold && rate > bestScore) {
        bestScore = rate;
        const labels = this.ERROR_LABELS[et];
        best = labels ? labels[phase] : null;
      }
    });
    return best;
  },

  /** So sánh 3 ván gần nhất vs 3 ván trước đó */
  _calcProgress(logs) {
    if (logs.length < 6) return { progress: 'na', delta: null };

    // sort theo played_at tăng dần (đã sort từ server nhưng đảm bảo)
    const sorted = [...logs].sort((a, b) =>
      new Date(a.played_at) - new Date(b.played_at)
    );

    const calcScore = log => {
      const maxPts = (log.total_questions || 1) * 25;
      return maxPts > 0 ? (log.score / maxPts) * 100 : 0;
    };

    const n = sorted.length;
    const recent3 = sorted.slice(n - 3).map(calcScore);
    const prev3   = sorted.slice(n - 6, n - 3).map(calcScore);

    const mean = arr => arr.reduce((a, b) => a + b, 0) / arr.length;
    const recentMean = mean(recent3);
    const prevMean   = mean(prev3);
    const delta = Math.round(recentMean - prevMean);

    if (delta >= 5)  return { progress: 'up',     delta };
    if (delta <= -5) return { progress: 'down',   delta };
    return             { progress: 'stable', delta };
  },
};

/* ════════════════════════════════════════════════════════
   ADMIN DASHBOARD UI
════════════════════════════════════════════════════════ */
const AdminDashboard = {
  _allStats: [],      // tất cả stats học sinh (sau khi fetch)
  _filtered: [],      // stats sau filter/search
  _sortCol: 'name',
  _sortDir: 'asc',
  _filterMode: 'all', // 'all' | 'warning' | 'progress_down'

  /** Load dữ liệu từ Supabase và render bảng */
  async load() {
    this._setLoading(true);

    try {
      const sb = getSupabase();
      if (!sb) throw new Error('Không thể kết nối Supabase');

      // 1. Fetch game_logs
      const { data: logs, error: logErr } = await sb
        .from('game_logs')
        .select('*')
        .order('played_at', { ascending: true });

      if (logErr) throw new Error(logErr.message);

      // 2. Group logs theo player_name
      const byStudent = {};
      (logs || []).forEach(log => {
        const n = log.player_name;
        if (!n || n === '_global_config') return;
        if (!byStudent[n]) byStudent[n] = [];
        byStudent[n].push(log);
      });

      // 3. Tính stats từng học sinh
      this._allStats = Object.entries(byStudent)
        .map(([name, studentLogs]) =>
          AnalyticsEngine.computeStudentStats(name, studentLogs)
        );

      // 4. Fetch profiles để lấy danh sách học sinh có game_logs = 0
      const { data: profiles } = await sb
        .from('profiles')
        .select('name, role')
        .eq('role', 'student');

      // Thêm HS chưa có log nào
      (profiles || []).forEach(p => {
        if (!byStudent[p.name]) {
          this._allStats.push(AnalyticsEngine.computeStudentStats(p.name, []));
        }
      });

      // 5. Cập nhật summary cards
      this._renderSummaryCards();

      // 6. Render bảng
      this._applyFilterAndSort();
      this._updateLastUpdated();

    } catch (e) {
      console.error('[AdminDashboard]', e);
      this._showError(e.message);
    } finally {
      this._setLoading(false);
    }
  },

  /** Filter + sort rồi render bảng */
  _applyFilterAndSort() {
    const q = (document.getElementById('adm-search')?.value || '').toLowerCase().trim();

    // Filter
    let result = this._allStats.filter(s => {
      if (q && !s.name.toLowerCase().includes(q)) return false;
      if (this._filterMode === 'warning' && !s.warning) return false;
      if (this._filterMode === 'progress_down' && s.progress !== 'down') return false;
      return true;
    });

    // Sort
    const col = this._sortCol;
    const dir = this._sortDir === 'asc' ? 1 : -1;
    result.sort((a, b) => {
      if (col === 'name')    return dir * a.name.localeCompare(b.name);
      if (col === 'games')   return dir * ((a.totalGames || 0) - (b.totalGames || 0));
      if (col === 'speed')   return dir * ((a.avgSpeedSec ?? 999) - (b.avgSpeedSec ?? 999));
      if (col === 'progress') {
        const order = { up: 1, stable: 2, na: 3, down: 4 };
        return dir * ((order[a.progress] || 3) - (order[b.progress] || 3));
      }
      return 0;
    });

    this._filtered = result;
    this._renderTable(result);
    this._updateFooterCount(result.length);
  },

  /** Render summary cards (tổng số HS, số HS cần chú ý, v.v.) */
  _renderSummaryCards() {
    const total   = this._allStats.length;
    const warning = this._allStats.filter(s => s.warning).length;
    const progUp  = this._allStats.filter(s => s.progress === 'up').length;
    const progDn  = this._allStats.filter(s => s.progress === 'down').length;

    this._setCard('sc-total',   total);
    this._setCard('sc-warning', warning);
    this._setCard('sc-up',      progUp);
    this._setCard('sc-down',    progDn);
  },

  _setCard(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  },

  /** Render bảng HTML */
  _renderTable(stats) {
    const tbody = document.getElementById('adm-tbody');
    if (!tbody) return;

    if (stats.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="5">
            <div class="adm-empty">
              <div class="adm-empty-icon">🔍</div>
              <div class="adm-empty-title">Không tìm thấy học sinh nào</div>
              <div class="adm-empty-sub">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</div>
            </div>
          </td>
        </tr>`;
      return;
    }

    tbody.innerHTML = stats.map((s, i) => this._renderRow(s, i)).join('');
  },

  _renderRow(s, i) {
    // ── Tên ──
    const avatarEmojis = ['🕵️','🔍','📋','🗝️','💼','🔦','🧩','📁'];
    const emoji = avatarEmojis[i % avatarEmojis.length];
    const warnHtml = s.warning
      ? `<span class="warn-icon" title="Học sinh cần chú ý">⚠️</span>` : '';
    const nameHtml = `
      <div class="student-name-cell">
        <div class="student-avatar">${emoji}</div>
        <div>
          <div class="student-name-text">${this._esc(s.name)} ${warnHtml}</div>
        </div>
      </div>`;

    // ── Ván ──
    const gamesHtml = `<div class="games-badge">${s.totalGames}</div>`;

    // ── Lỗi hay gặp ──
    const gd1Text = s.errorGD1 || '—';
    const gd2Text = s.errorGD2 || '—';
    const errorsHtml = `
      <div class="error-phase-row">
        <span class="phase-label ph1">GĐ1</span>
        <span class="error-text ${s.errorGD1 ? 'has-error' : 'no-error'}">${this._esc(gd1Text)}</span>
      </div>
      <div class="error-phase-row">
        <span class="phase-label ph2">GĐ2</span>
        <span class="error-text ${s.errorGD2 ? 'has-error' : 'no-error'}">${this._esc(gd2Text)}</span>
      </div>`;

    // ── Tốc độ TB ──
    let speedHtml;
    if (s.avgSpeedSec === null) {
      speedHtml = `<span style="color:var(--white-ghost);font-style:italic">—</span>`;
    } else {
      const max = 120; // giả sử 2 phút là chậm nhất, để làm màu thanh
      const pct = Math.min(100, (s.avgSpeedSec / max) * 100);
      // Màu: nhanh = xanh, chậm = đỏ
      const clr = s.avgSpeedSec <= 30 ? '#2ed573' : s.avgSpeedSec <= 60 ? '#f5c518' : '#ff4757';
      speedHtml = `
        <div class="speed-val">${s.avgSpeedSec}s</div>
        <div class="speed-unit">/ câu</div>
        <div class="speed-bar-wrap">
          <div class="speed-bar" style="width:${pct}%;background:${clr}"></div>
        </div>`;
    }

    // ── Tiến bộ ──
    let progressHtml;
    const pd = s.progressDelta;
    if (s.progress === 'up') {
      progressHtml = `
        <div class="progress-badge up">↑ Tốt lên</div>
        ${pd !== null ? `<div class="progress-delta">+${pd}% so với 3 ván trước</div>` : ''}`;
    } else if (s.progress === 'down') {
      progressHtml = `
        <div class="progress-badge down">↓ Thụt lùi</div>
        ${pd !== null ? `<div class="progress-delta">${pd}% so với 3 ván trước</div>` : ''}`;
    } else if (s.progress === 'stable') {
      progressHtml = `
        <div class="progress-badge stable">→ Ổn định</div>
        ${pd !== null ? `<div class="progress-delta">${pd >= 0 ? '+' : ''}${pd}%</div>` : ''}`;
    } else {
      const vanLeft = Math.max(0, 6 - s.totalGames);
      progressHtml = `<div class="progress-badge na">— Cần ${vanLeft} ván nữa</div>`;
    }

    return `
      <tr>
        <td class="col-name">${nameHtml}</td>
        <td class="col-games">${gamesHtml}</td>
        <td class="col-errors">${errorsHtml}</td>
        <td class="col-speed">${speedHtml}</td>
        <td class="col-progress">${progressHtml}</td>
      </tr>`;
  },

  /** Escape HTML để tránh XSS */
  _esc(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  },

  _setLoading(on) {
    const tbody = document.getElementById('adm-tbody');
    const loadingEl = document.getElementById('adm-loading');
    if (!tbody) return;
    if (on) {
      tbody.style.display = 'none';
      if (loadingEl) loadingEl.style.display = 'flex';
    } else {
      tbody.style.display = '';
      if (loadingEl) loadingEl.style.display = 'none';
    }
    const refreshBtn = document.getElementById('btn-refresh');
    if (refreshBtn) refreshBtn.disabled = on;
  },

  _showError(msg) {
    const tbody = document.getElementById('adm-tbody');
    if (tbody) {
      tbody.style.display = '';
      tbody.innerHTML = `
        <tr><td colspan="5">
          <div class="adm-empty">
            <div class="adm-empty-icon">⚠️</div>
            <div class="adm-empty-title">Lỗi tải dữ liệu</div>
            <div class="adm-empty-sub">${this._esc(msg)}</div>
          </div>
        </td></tr>`;
    }
  },

  _updateLastUpdated() {
    const el = document.getElementById('adm-last-updated');
    if (el) {
      const now = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
      el.textContent = `Cập nhật lúc ${now}`;
    }
  },

  _updateFooterCount(n) {
    const el = document.getElementById('adm-footer-count');
    if (el) el.textContent = `Hiển thị ${n} / ${this._allStats.length} học sinh`;
  },

  /** Toggle sort column */
  sort(col) {
    if (this._sortCol === col) {
      this._sortDir = this._sortDir === 'asc' ? 'desc' : 'asc';
    } else {
      this._sortCol = col;
      this._sortDir = 'asc';
    }
    // Update header icons
    document.querySelectorAll('.adm-table th').forEach(th => th.classList.remove('sorted'));
    const th = document.querySelector(`th[data-col="${col}"]`);
    if (th) {
      th.classList.add('sorted');
      const icon = th.querySelector('.sort-icon');
      if (icon) icon.textContent = this._sortDir === 'asc' ? '▲' : '▼';
    }
    this._applyFilterAndSort();
  },

  /** Filter mode */
  setFilter(mode, btn) {
    this._filterMode = mode;
    document.querySelectorAll('.adm-filter-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    this._applyFilterAndSort();
  },
};

/* ════════════════════════════════════════════════════════
   BOOTSTRAP
════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', async () => {
  const user = getAuthUser();

  // Kiểm tra quyền admin
  if (!user || user.role !== 'admin') {
    document.body.innerHTML = `
      <div class="adm-denied">
        <div class="adm-denied-icon">🔒</div>
        <div class="adm-denied-title">Truy cập bị từ chối</div>
        <div class="adm-denied-sub">Màn hình này chỉ dành cho Admin. Vui lòng đăng nhập với tài khoản có quyền Admin.</div>
        <a class="btn-back-main" href="index.html">← Quay về trang chính</a>
      </div>`;
    return;
  }

  // Hiển thị tên admin
  const adminNameEl = document.getElementById('adm-admin-name');
  if (adminNameEl) adminNameEl.textContent = `👑 ${user.name}`;

  // Wire up search
  const searchInput = document.getElementById('adm-search');
  if (searchInput) {
    let searchTimer;
    searchInput.addEventListener('input', () => {
      clearTimeout(searchTimer);
      searchTimer = setTimeout(() => AdminDashboard._applyFilterAndSort(), 250);
    });
  }

  // Wire up refresh
  const refreshBtn = document.getElementById('btn-refresh');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => AdminDashboard.load());
  }

  // Load data
  await AdminDashboard.load();
});
