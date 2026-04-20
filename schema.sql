-- Supabase SQL Editor 실행용 테이블 생성 코드
-- 이 파일은 로컬 참고용입니다. 실제 이 파일이 자동으로 DB를 생성해주지는 않습니다.
-- 이 코드를 모두 복사하여 Supabase 대시보드의 "SQL Editor" 화면 하단에 붙여넣고 [Run] 하시면 됩니다.

create table public.posts (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  content text not null,
  password text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 보안: 누구나 글은 조회할 수 있도록 RLS(Row Level Security) 설정
alter table public.posts enable row level security;
create policy "누구나 조회 가능" on public.posts for select using (true);
create policy "Insert는 누구나 가능" on public.posts for insert with check (true);
