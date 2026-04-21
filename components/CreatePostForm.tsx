'use client';
import { useActionState } from 'react';
import { createPost } from '@/lib/supabase/actions';

const COLORS = [
  { id: 'yellow', hex: 'bg-[#FEF3C7]', label: '노랑' },
  { id: 'blue', hex: 'bg-blue-100', label: '파랑' },
  { id: 'pink', hex: 'bg-pink-100', label: '분홍' },
  { id: 'green', hex: 'bg-green-100', label: '초록' },
  { id: 'purple', hex: 'bg-purple-100', label: '보라' },
];

export default function CreatePostForm({ keywords }: { keywords: any[] }) {
  const [state, action, isPending] = useActionState(async (prevState: any, formData: FormData) => {
    return await createPost(formData);
  }, null);

  return (
    <form action={action} className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* 키워드 셀렉트 (NEW) */}
        <label className="flex flex-col sm:w-48 gap-1.5 focus-within:text-blue-600 transition-colors">
          <span className="text-sm font-semibold text-slate-600 inherit">분류</span>
          <select name="keyword_id" defaultValue="" required className="w-full rounded-lg border-slate-200 p-3 text-slate-900 border focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all cursor-pointer bg-white">
            <option value="" disabled>선택해주세요</option>
            {keywords.map(k => <option key={k.id} value={k.id}>{k.name}</option>)}
          </select>
        </label>
        
        <label className="flex flex-col flex-1 gap-1.5 focus-within:text-blue-600 transition-colors">
          <span className="text-sm font-semibold text-slate-600 inherit">제목</span>
          <input 
            name="title"
            required 
            type="text" 
            placeholder="간결하고 명확한 제목" 
            className="w-full rounded-lg border-slate-200 p-3 text-slate-900 border focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400" 
          />
        </label>
        
        <label className="flex flex-col sm:w-48 gap-1.5 focus-within:text-blue-600 transition-colors">
          <span className="text-sm font-semibold text-slate-600 inherit">비밀번호</span>
          <input 
            name="password"
            required 
            type="password" 
            placeholder="수정/삭제용" 
            className="w-full rounded-lg border-slate-200 p-3 text-slate-900 border focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400" 
          />
        </label>
      </div>

      <div className="flex flex-col gap-2 mt-1">
        <span className="text-sm font-semibold text-slate-600">포스트잇 색상</span>
        <div className="flex items-center gap-3">
          {COLORS.map(color => (
            <label key={color.id} className="relative cursor-pointer flex items-center justify-center">
              <input type="radio" name="color" value={color.id} defaultChecked={color.id === 'yellow'} className="peer sr-only" />
              <div className={`w-8 h-8 rounded-full ${color.hex} border-2 border-transparent peer-checked:border-slate-800 hover:scale-110 transition-transform shadow-sm`} title={color.label}></div>
            </label>
          ))}
        </div>
      </div>

      <label className="flex flex-col gap-1.5 focus-within:text-blue-600 transition-colors mt-1">
        <span className="text-sm font-semibold text-slate-600 inherit">내용</span>
        <textarea 
          name="content"
          required 
          placeholder="이곳에 메모를 자유롭게 적어주세요..." 
          rows={3} 
          className="w-full rounded-lg border-slate-200 p-3 text-slate-900 border focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all resize-none placeholder:text-slate-400" 
        />
      </label>

      {state?.error && <p className="text-red-500 text-sm">{state.error}</p>}
      {state?.success && <p className="text-green-600 text-sm font-semibold">✅ 작성이 완료되었습니다!</p>}

      <div className="flex justify-end mt-2">
        <button 
          type="submit" 
          disabled={isPending}
          className="bg-slate-800 hover:bg-slate-900 active:bg-slate-950 disabled:bg-slate-300 text-white font-bold py-3 px-8 rounded-lg transition-colors shadow-sm outline-none focus:ring-4 focus:ring-slate-600/20"
        >
          {isPending ? "작성 중..." : "작성 완료"}
        </button>
      </div>
    </form>
  );
}
