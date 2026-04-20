# 구현 및 개발 작업 (TASK.md)

## Phase 1. 프로젝트 초기 세팅
- [ ] Next.js 15 (또는 최신버전) 프로젝트 초기화 (TypeScript, Tailwind CSS, App Router 적용)
- [ ] Supabase 프로젝트 생성 및 Database table (`posts`) 스키마 구성
- [ ] `STRUCTURE.md` 기반 디렉토리 폴더 및 파일 트리 생성
- [ ] 로컬 `.env.local` 파일 등에 Supabase 환경변수 세팅
- [ ] `lib/supabase/client.ts` 및 `server.ts` 유틸리티 구성

## Phase 2. UI 레이아웃 및 컴포넌트 뼈대 구성
- [ ] `app/layout.tsx` 구성 (전역 폰트 및 한국어 메타데이터 셋업)
- [ ] 공통 상단 `Header.tsx` 구성
- [ ] 메인 `app/page.tsx` 레이아웃 (검색바, 새 글 작성 버튼, 게시글 목록 영역) 뼈대 작성
- [ ] `CreatePostForm.tsx` 작성 폼 UI 구현
- [ ] `PostList.tsx`, `PostItem.tsx` 렌더링 UI 구현

## Phase 3. 데이터 연동 (Supabase CRUD)
- [ ] 메인 페이지에서 서버 컴포넌트 방식으로 글 목록 조회 연동 (Read)
- [ ] 텍스트 입력을 통한 제목/내용 키워드 실시간 검색 필터 동작 연동
- [ ] 새 글 작성 (Create) Server Action 기능 구현 (비밀번호 항목 포함)
- [ ] 수정/삭제 기능 Server Action 구현 (입력된 비밀번호 검증 후 RLS 우회 처리 또는 검증 로직 통과 후 삭제)

## Phase 4. 마무리 및 배포
- [ ] 전체 예외 처리 구성 (폼 빈 칸 유효성 검사, 에러 바운더리 등)
- [ ] 전체 UI 자연스러운 한국어 표기 검토
- [ ] GitHub 연동 및 모바일 반응형 최종 테스트
- [ ] Vercel 배포 진행 및 실기기 검증

## 완료 기준
- [ ] 로컬에서 `npm run dev` 실행 시 에러 없음
- [ ] Vercel 배포 성공
- [ ] 모바일 반응형 정상 동작
- [ ] 핵심 기능 전체 플로우 테스트 완료
