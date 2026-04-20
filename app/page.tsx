import PostList from "@/components/PostList";
import CreatePostForm from "@/components/CreatePostForm";
import SearchInput from "@/components/SearchInput";
import { getPosts } from "@/lib/supabase/actions";

export const dynamic = 'force-dynamic';

export default async function Home(props: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
  const searchParams = await props.searchParams;
  const q = searchParams?.q;
  const posts = await getPosts(q);

  return (
    <div className="flex flex-col gap-8 py-4 sm:py-6">
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">모두의 메모장</h2>
          <p className="mt-2 text-slate-500">어떤 이야기라도 자유롭게 남겨보세요. 모든 글은 즉시 공유됩니다.</p>
        </div>
      </section>

      <section className="w-full">
        <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold mb-4 text-slate-800 flex items-center gap-2">
            <span>✍️</span> 새 글 작성하기
          </h3>
          <CreatePostForm />
        </div>
      </section>

      <section className="w-full flex sm:flex-row flex-col justify-between items-start sm:items-center gap-4 bg-slate-100 rounded-xl p-4 border border-slate-200">
        <div className="flex items-center gap-2 px-1">
          <span className="text-slate-600 font-semibold">현재 등록된 메모</span>
          <span className="bg-blue-100 text-blue-700 px-2.5 py-0.5 rounded-full text-sm font-bold">{posts.length}</span>
        </div>
        <SearchInput defaultQuery={q || ""} />
      </section>

      <section className="w-full">
        <PostList posts={posts} />
      </section>
    </div>
  );
}
