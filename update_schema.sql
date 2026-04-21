-- [Phase 8] 키워드 시스템 업데이트용 SQL 코드
-- Supabase의 "SQL Editor"에 붙여넣고 [Run]을 누르세요.

-- 1. 키워드 테이블 생성
CREATE TABLE IF NOT EXISTS public.keywords (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL UNIQUE,
  is_default boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. 키워드 테이블 RLS 권한 부여 (누구나 조회/생성/수정/삭제 가능)
ALTER TABLE public.keywords ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Keyword 조회 가능" ON public.keywords FOR SELECT USING (true);
CREATE POLICY "Keyword 생성 가능" ON public.keywords FOR INSERT WITH CHECK (true);
CREATE POLICY "Keyword 수정 권한" ON public.keywords FOR UPDATE USING (true);
CREATE POLICY "Keyword 삭제 권한" ON public.keywords FOR DELETE USING (true);

-- 3. 기본 키워드 7종 주입
INSERT INTO public.keywords (name, is_default) VALUES 
('학업', true), ('일정', true), ('개인', true), ('자기계발', true), 
('루틴', true), ('아이디어', true), ('기타', true)
ON CONFLICT (name) DO NOTHING;

-- 4. 기존 posts 테이블에 keyword 연동
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS keyword_id uuid REFERENCES public.keywords(id) ON DELETE SET NULL;

-- 5. 기존에 작성된 게시물들이 있다면 모두 '기타' 카테고리로 기본 배정
DO $$ 
DECLARE
    gita_id uuid;
BEGIN
    SELECT id INTO gita_id FROM public.keywords WHERE name = '기타' LIMIT 1;
    UPDATE public.posts SET keyword_id = gita_id WHERE keyword_id IS NULL;
END $$;
