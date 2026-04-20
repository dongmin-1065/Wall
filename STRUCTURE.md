# 디렉토리 구조 및 역할 (STRUCTURE.md)

## 1. 전체 디렉토리 트리
```text
Wall/
├── .env.local
├── PRD.md
├── idea.md
├── STRUCTURE.md
├── TASK.md
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.mjs
├── next.config.ts
├── components/
│   ├── PostList.tsx
│   ├── PostItem.tsx
│   ├── CreatePostForm.tsx
│   ├── DeletePostModal.tsx
│   └── Header.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   └── server.ts
│   └── utils.ts
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── error.tsx
│   └── globals.css
```

## 2. 각 파일/폴더 역할
- `app/`: Next.js App Router의 핵심 라우팅 폴더입니다.
  - `page.tsx`: 메인 페이지로, 게시글 목록과 검색 엔진, 작성 버튼을 표시합니다.
  - `layout.tsx`: 전역 레이아웃 및 폰트/메타데이터를 설정합니다.
  - `globals.css`: 전역 스타일 및 Tailwind CSS 초기화 파일입니다.
  - `error.tsx`: 전역 에러 바운더리로 에러 발생 시 부드러운 UI를 제공합니다.
- `components/`: UI를 구성하는 재사용 가능한 단위 컴포넌트 폴더입니다.
  - `PostList.tsx`: Supabase에서 불러온 게시글 목록을 매핑하여 렌더링합니다.
  - `PostItem.tsx`: 개별 게시글의 UI를 담당합니다.
  - `CreatePostForm.tsx`: 새로운 게시글 작성 폼(제목, 내용, 비밀번호 입력)을 담당합니다.
  - `DeletePostModal.tsx`: 게시글을 삭제하거나 수정할 때 비밀번호를 검증받는 모달입니다.
  - `Header.tsx`: 서비스 상단 타이틀과 메타 정보 렌더링을 담당합니다.
- `lib/supabase/`: 데이터베이스와 연동하기 위한 클라이언트 및 서버 액션 보조 유틸입니다.

## 3. 환경변수 목록 (.env.local)
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase 프로젝트 고유 URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase 익명 엑세스 기본 Public Key
