'use client';
import { useState, useTransition } from "react";
import { createKeyword, updateKeyword, deleteKeyword } from "@/lib/supabase/actions";

export default function KeywordSettingsModal({ keywords, onClose }: { keywords: any[], onClose: () => void }) {
  const [isPending, startTransition] = useTransition();
  const [isAddMode, setIsAddMode] = useState(false);
  const [newKeywordName, setNewKeywordName] = useState("");
  const [editKeywordId, setEditKeywordId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeywordName.trim()) return;
    
    startTransition(async () => {
      const res = await createKeyword(newKeywordName);
      if (!res.error) {
         setNewKeywordName("");
         setIsAddMode(false);
      } else { alert(res.error); }
    });
  };

  const handleEditSubmit = async (e: React.FormEvent, id: string) => {
    e.preventDefault();
    if (!editName.trim()) { setEditKeywordId(null); return; }
    
    startTransition(async () => {
      const res = await updateKeyword(id, editName);
      if (!res.error) {
        setEditKeywordId(null);
      } else { alert(res.error); }
    });
  };

  const handleDelete = async (id: string) => {
    if (confirm("정말로 이 사용자 정의 분류를 삭제하시겠습니까?\n(해당 분류를 쓰던 글들은 분류 잃음으로 남게 됩니다)")) {
      startTransition(async () => {
        const res = await deleteKeyword(id);
        if (res.error) alert(res.error);
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
          <h3 className="font-bold text-lg text-slate-800">분류(카테고리) 설정</h3>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>

        <div className="p-5 flex flex-col gap-4 max-h-[60vh] overflow-y-auto">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-500">현재 분류 목록</span>
              <button 
                onClick={() => setIsAddMode(!isAddMode)} 
                className="text-xs font-bold px-2 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-md transition-colors"
              >
                {isAddMode ? '추가 취소' : '+ 항목 추가'}
              </button>
            </div>

            {isAddMode && (
              <form onSubmit={handleAddSubmit} className="flex gap-2 p-2 bg-blue-50 rounded-lg animate-in slide-in-from-top-2">
                <input 
                  autoFocus
                  className="flex-1 p-2 text-sm outline-none rounded-md border border-blue-200 focus:ring-2 focus:ring-blue-300"
                  placeholder="새 분류 이름 입력"
                  value={newKeywordName}
                  onChange={e => setNewKeywordName(e.target.value)}
                />
                <button type="submit" disabled={isPending} className="px-3 bg-blue-600 text-white rounded-md text-sm font-bold hover:bg-blue-700">저장</button>
              </form>
            )}

            <div className="flex flex-col gap-1.5 mt-2">
              {keywords.map(kw => {
                const isEditing = editKeywordId === kw.id;
                
                if (isEditing) {
                  return (
                    <form key={kw.id} onSubmit={(e) => handleEditSubmit(e, kw.id)} className="flex items-center gap-2 p-2 bg-white border-2 border-blue-400 rounded-xl shadow-sm">
                      <input 
                        autoFocus
                        className="flex-1 px-2 py-1 text-sm outline-none font-medium"
                        value={editName}
                        onChange={e => setEditName(e.target.value)}
                      />
                      <button type="submit" disabled={isPending} className="px-3 py-1 bg-blue-600 text-white rounded-md text-xs font-bold shrink-0">확인</button>
                    </form>
                  );
                }

                return (
                  <div key={kw.id} className="group flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-white hover:border-slate-200 hover:shadow-sm transition-all">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${kw.is_default ? 'bg-amber-400' : 'bg-blue-400'}`}></span>
                      <span className="font-semibold text-slate-700 text-sm">{kw.name}</span>
                      {kw.is_default && <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded ml-1">기본</span>}
                    </div>

                    {!kw.is_default && (
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => { setEditName(kw.name); setEditKeywordId(kw.id); }}
                          disabled={isPending}
                          className="p-1.5 bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg" title="수정"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 20h9"/><path d="M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z"/></svg>
                        </button>
                        <button 
                          onClick={() => handleDelete(kw.id)}
                          disabled={isPending}
                          className="p-1.5 bg-slate-50 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg" title="삭제"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
