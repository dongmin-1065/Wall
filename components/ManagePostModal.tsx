'use client';
import { useActionState, useEffect, useState } from 'react';
import { deletePost, updatePost } from '@/lib/supabase/actions';

const COLORS = [
  { id: 'yellow', hex: 'bg-[#FEF3C7]' },
  { id: 'blue', hex: 'bg-blue-100' },
  { id: 'pink', hex: 'bg-pink-100' },
  { id: 'green', hex: 'bg-green-100' },
  { id: 'purple', hex: 'bg-purple-100' },
];

export default function ManagePostModal({ post, onClose }: { post: any, onClose: () => void }) {
  const [mode, setMode] = useState<'edit' | 'delete'>('edit');
  
  const [editState, editAction, isEditPending] = useActionState(
    async (prevState: any, formData: FormData) => await updatePost(formData),
    null
  );

  const [deleteState, deleteAction, isDeletePending] = useActionState(
    async (prevState: any, formData: FormData) => {
      const password = formData.get('password') as string;
      if (!password) return { error: '비밀번호를 입력해주세요.' };
      return await deletePost(post.id, password);
    },
    null
  );

  useEffect(() => {
    if (editState?.success || deleteState?.success) {
      onClose();
    }
  }, [editState, deleteState, onClose]);

  const isPending = isEditPending || isDeletePending;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm sm:max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex border-b border-slate-100">
          <button onClick={() => setMode('edit')} className={`flex-1 py-3 text-sm font-bold ${mode === 'edit' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:bg-slate-50'}`}>수정하기</button>
          <button onClick={() => setMode('delete')} className={`flex-1 py-3 text-sm font-bold ${mode === 'delete' ? 'text-red-600 border-b-2 border-red-600' : 'text-slate-500 hover:bg-slate-50'}`}>삭제하기</button>
        </div>

        {mode === 'edit' ? (
          <form action={editAction} className="p-6 flex flex-col gap-4">
            <input type="hidden" name="id" value={post.id} />
            <label className="flex flex-col gap-1.5 text-sm font-semibold text-slate-600">
              제목
              <input name="title" defaultValue={post.title} required className="p-2.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-100" />
            </label>
            <label className="flex flex-col gap-1.5 text-sm font-semibold text-slate-600">
              내용
              <textarea name="content" defaultValue={post.content} required rows={3} className="p-2.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-100 resize-none" />
            </label>
            <div className="flex flex-col gap-1.5 text-sm font-semibold text-slate-600">
              색상
              <div className="flex gap-3">
                {COLORS.map(c => (
                  <label key={c.id} className="relative cursor-pointer">
                    <input type="radio" name="color" value={c.id} defaultChecked={post.color === c.id} className="peer sr-only" />
                    <div className={`w-8 h-8 rounded-full ${c.hex} border-2 border-transparent peer-checked:border-slate-800 hover:scale-110 transition-transform shadow-sm`}></div>
                  </label>
                ))}
              </div>
            </div>
            <label className="flex flex-col gap-1.5 text-sm font-semibold text-slate-600 pt-2 border-t border-slate-100 mt-2">
              비밀번호 인증
              <input type="password" name="password" required placeholder="작성 시 입력한 비밀번호" className="p-2.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-100" />
            </label>
            
            {editState?.error && <p className="text-red-500 text-sm mt-1">{editState.error}</p>}
            
            <div className="flex justify-end gap-2 mt-2">
              <button type="button" onClick={onClose} disabled={isPending} className="px-5 py-2 bg-slate-100 text-slate-700 font-bold rounded-lg hover:bg-slate-200 transition-colors">취소</button>
              <button type="submit" disabled={isPending} className="px-5 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors">{isPending ? '처리중...' : '수정 완료'}</button>
            </div>
          </form>
        ) : (
          <form action={deleteAction} className="p-6 flex flex-col gap-4">
            <p className="text-sm text-slate-600 leading-relaxed bg-red-50 p-3 rounded-lg border border-red-100">
              정말로 이 메모를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </p>
            <label className="flex flex-col gap-1.5 text-sm font-semibold text-slate-600 mt-2">
              비밀번호 인증
              <input type="password" name="password" required placeholder="작성 시 입력한 비밀번호" className="p-3 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-red-100 tracking-widest text-center placeholder:tracking-normal" />
            </label>

            {deleteState?.error && <p className="text-red-500 text-sm">{deleteState.error}</p>}
            
            <div className="flex justify-end gap-2 mt-4">
              <button type="button" onClick={onClose} disabled={isPending} className="px-5 py-2 bg-slate-100 text-slate-700 font-bold rounded-lg hover:bg-slate-200 transition-colors">취소</button>
              <button type="submit" disabled={isPending} className="px-5 py-2 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 transition-colors">{isPending ? '처리중...' : '삭제 확인'}</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
