-- ════════════════════════════════════════════════════════
-- MIGRATION: Thêm cột password và role vào profiles
-- Chạy script này trong Supabase Dashboard → SQL Editor
-- ════════════════════════════════════════════════════════

-- 1. Thêm cột password (lưu plain text)
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS password TEXT;

-- 2. Thêm cột role với default là 'student'
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'student';

-- 3. (Tùy chọn) Tạo index để tìm kiếm nhanh theo name
CREATE INDEX IF NOT EXISTS idx_profiles_name ON profiles (name);

-- ════════════════════════════════════════════════════════
-- KIỂM TRA: Xem cấu trúc bảng sau khi migration
-- ════════════════════════════════════════════════════════
-- SELECT column_name, data_type, column_default
-- FROM information_schema.columns
-- WHERE table_name = 'profiles'
-- ORDER BY ordinal_position;
