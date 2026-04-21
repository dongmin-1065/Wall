'use client';
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import KeywordSettingsModal from "./KeywordSettingsModal";

export default function SearchInput({ initialQuery, currentKeyword, keywords }: { initialQuery: string; currentKeyword: string; keywords: any[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(initialQuery);
  const [isPending, startTransition] = useTransition();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (query) {
      params.set('q', query);
    } else {
      params.delete('q');
    }
    
    startTransition(() => {
      router.push(`/?${params.toString()}`);
    });
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    const params = new URLSearchParams(searchParams);
    if (val === "all") params.delete("keyword");
    else params.set("keyword", val);
    
    startTransition(() => {
      router.push(`/?${params.toString()}`);
    });
  };

  return (
    <>
      <div className="flex w-full items-center gap-2">
        <form onSubmit={handleSearch} className="relative flex-1 flex flex-col sm:flex-row gap-2 w-full">
          <div className="flex gap-2 w-full">
            {/* Category Filter Dropdown */}
            <select 
              value={currentKeyword || "all"} 
              onChange={handleCategoryChange}
              className="shrink-0 max-w-[120px] sm:max-w-none px-3 py-2.5 rounded-xl border border-slate-200 bg-white outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 text-sm md:text-base cursor-pointer shadow-sm text-slate-700 font-semibold"
            >
              <option value="all">모든 분류</option>
              {keywords.map(kw => <option key={kw.id} value={kw.id}>{kw.name}</option>)}
            </select>

            {/* Keyword Search Input */}
            <div className="relative flex-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              <input 
                type="text" 
                placeholder="제목, 내용 검색..." 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 text-sm md:text-base transition-all placeholder:text-slate-400 shadow-sm"
              />
            </div>
            
            <button type="submit" disabled={isPending} className="bg-slate-800 hover:bg-slate-900 active:bg-slate-950 px-4 sm:px-5 py-2.5 rounded-xl text-white text-sm md:text-base font-semibold shadow-sm transition-colors whitespace-nowrap hidden sm:block">
              {isPending ? '검색 중...' : '검색'}
            </button>
          </div>
        </form>

        {/* Gear icon to manage keywords */}
        <button 
          onClick={() => setIsSettingsOpen(true)}
          className="shrink-0 flex items-center justify-center p-3 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-colors shadow-sm"
          title="분류 관리"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
        </button>
      </div>

      {isSettingsOpen && <KeywordSettingsModal keywords={keywords} onClose={() => setIsSettingsOpen(false)} />}
    </>
  );
}
