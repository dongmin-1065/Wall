import Header from "@/components/Header";
import CreatePostForm from "@/components/CreatePostForm";
import SearchInput from "@/components/SearchInput";
import PostList from "@/components/PostList";
import { getPosts, getKeywords } from "@/lib/supabase/actions";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; keyword?: string }>;
}) {
  const { q, keyword } = await searchParams;
  
  const [posts, keywords] = await Promise.all([
    getPosts(q, keyword),
    getKeywords()
  ]);

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      {/* 1. Main Search & Filtering Area */}
      <section className="flex flex-col gap-5 mt-2">
        <div className="flex items-center justify-between gap-4 flex-wrap w-full">
          <div className="flex items-center gap-2 text-slate-600 font-medium">
            <span className="bg-amber-100/60 text-amber-800 px-3 py-1.5 rounded-full text-sm border border-amber-200">총 {posts?.length || 0}개의 메모</span>
          </div>
          <div className="flex-1 flex justify-end min-w-[280px]">
            <SearchInput initialQuery={q || ""} currentKeyword={keyword || ""} keywords={keywords || []} />
          </div>
        </div>

        <div className="bg-white/40 backdrop-blur-md rounded-3xl p-4 sm:p-6 shadow-sm border border-white/50">
          <PostList posts={posts || []} keywords={keywords || []} />
        </div>
      </section>

      {/* 2. Create Post Form Area */}
      <section className="bg-white/60 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-sm border border-white/80">
        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <span className="text-2xl">📝</span> 새 글 작성하기
        </h2>
        <CreatePostForm keywords={keywords || []} />
      </section>
    </div>
  );
}
