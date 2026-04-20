-- 기존 posts 테이블에 v2 기능용 컬럼 추가하기
-- Supabase SQL Editor 에 아래 코드를 복사해서 실행(Run)해주세요!

ALTER TABLE public.posts 
ADD COLUMN IF NOT EXISTS color text DEFAULT 'yellow',
ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS sort_order integer DEFAULT 0;
