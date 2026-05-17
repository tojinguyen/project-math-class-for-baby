-- ════════════════════════════════════════════════════════════════
-- MIGRATION: Tạo bảng game_logs để lưu dữ liệu từng ván chơi
-- Chạy script này trong Supabase Dashboard → SQL Editor
-- ════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS game_logs (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id       text        NOT NULL,
  player_name     text        NOT NULL,
  played_at       timestamptz NOT NULL DEFAULT now(),
  total_questions int         NOT NULL DEFAULT 0,
  score           int         NOT NULL DEFAULT 0,
  detect_results  jsonb       NOT NULL DEFAULT '[]',   -- dAttempts: [1, 2, 'X', 1, ...]
  correct_results jsonb       NOT NULL DEFAULT '[]',   -- cAttempts: [1, 'X', 2, ...]
  detect_times    jsonb       NOT NULL DEFAULT '[]',   -- giây mỗi câu GĐ1
  correct_times   jsonb       NOT NULL DEFAULT '[]',   -- giây mỗi câu GĐ2
  wrong_clicks    jsonb       NOT NULL DEFAULT '[]',   -- số click nhầm mỗi câu
  error_types     jsonb       NOT NULL DEFAULT '[]'    -- loại lỗi mỗi câu ['chuyenVe','thuTu',...]
);

-- Index để query nhanh theo player
CREATE INDEX IF NOT EXISTS idx_game_logs_player_name ON game_logs (player_name);
CREATE INDEX IF NOT EXISTS idx_game_logs_played_at   ON game_logs (played_at DESC);

-- ════════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY
-- ════════════════════════════════════════════════════════════════

ALTER TABLE game_logs ENABLE ROW LEVEL SECURITY;

-- Mọi người dùng (anon) đều có thể INSERT log ván chơi của mình
CREATE POLICY "Anyone can insert game logs"
  ON game_logs FOR INSERT
  TO anon
  WITH CHECK (true);

-- Mọi người đều có thể SELECT (admin filter ở client-side bằng role check)
-- Nếu muốn bảo mật hơn có thể đổi thành chỉ service_role mới SELECT được
CREATE POLICY "Anyone can read game logs"
  ON game_logs FOR SELECT
  TO anon
  USING (true);

-- ════════════════════════════════════════════════════════════════
-- KIỂM TRA: Xem cấu trúc bảng sau khi tạo
-- ════════════════════════════════════════════════════════════════
-- SELECT column_name, data_type, column_default
-- FROM information_schema.columns
-- WHERE table_name = 'game_logs'
-- ORDER BY ordinal_position;
