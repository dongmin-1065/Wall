'use client';
import { useState } from 'react';
import ManagePostModal from './ManagePostModal';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function formatAbsoluteTime(dateString: string, isUpdate: boolean) {
  const date = new Date(dateString);
  const yy = date.getFullYear().toString().slice(-2);
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const hh = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  const ampm = date.getHours() >= 12 ? 'PM' : 'AM';
  
  return `${yy}/${mm}/${dd} ${ampm} ${hh}:${min} ${isUpdate ? '수정' : '작성'}`;
}

const colorStyles: Record<string, string> = {
  yellow: "bg-[#FEF3C7] border-yellow-200 hover:border-yellow-300",
  blue: "bg-blue-100 border-blue-200 hover:border-blue-300",
  pink: "bg-pink-100 border-pink-200 hover:border-pink-300",
  green: "bg-green-100 border-green-200 hover:border-green-300",
  purple: "bg-purple-100 border-purple-200 hover:border-purple-300",
};

export default function PostItem({ post, keywords }: { post: any, keywords: any[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: post.id });

  const style = { transform: CSS.Translate.toString(transform), transition, zIndex: isDragging ? 10 : 1 };
  const bgStyle = colorStyles[post.color] || colorStyles.yellow;
  
  const targetDate = post.updated_at ? post.updated_at : post.created_at;
  const isUpdate = !!post.updated_at;
  
  // Find keyword name for this post
  const keywordObj = keywords.find(k => k.id === post.keyword_id);
  const keywordName = keywordObj ? keywordObj.name : '기타';

  return (
    <>
      <div 
        ref={setNodeRef} 
        style={style} 
        className={`${bgStyle} ${isDragging ? 'shadow-xl scale-[1.02]' : 'shadow-sm'} p-5 rounded-2xl border flex flex-col gap-3 group relative transition-all min-h-[160px]`}
      >
        <div className="flex justify-between items-start gap-3">
          <div className="flex flex-col items-start gap-1">
            {/* 태그 표시 */}
            <span className="text-[10px] font-bold bg-white/50 px-2 py-0.5 rounded text-slate-600 border border-black/5 shadow-sm">
              #{keywordName}
            </span>
            <h4 className="font-bold text-lg text-slate-900 leading-tight block break-all">{post.title}</h4>
          </div>
          
          <div className="flex items-center gap-1 sm:opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              type="button" 
              {...attributes} 
              {...listeners}
              className="touch-none text-slate-400 hover:text-slate-700 bg-black/5 hover:bg-black/10 rounded-lg p-1.5 cursor-grab active:cursor-grabbing flex-shrink-0"
              title="잡아서 이동"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="12" r="1"/><circle cx="9" cy="5" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="19" r="1"/></svg>
            </button>
            <button 
              type="button" 
              onClick={() => setIsModalOpen(true)}
              className="text-slate-400 hover:text-blue-600 bg-black/5 hover:bg-blue-100/50 rounded-lg p-1.5 flex-shrink-0"
              title="관리 (수정/삭제)"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z"/><path d="m15 5 3 3"/></svg>
            </button>
          </div>
        </div>
        
        <p className="text-slate-800 text-sm whitespace-pre-wrap leading-relaxed line-clamp-4 mt-1 break-words cursor-text pointer-events-none">
          {post.content}
        </p>
        
        <div className="text-xs text-slate-500 mt-auto pt-3 border-t border-black/5 flex justify-between items-center pointer-events-none">
          <span suppressHydrationWarning>{formatAbsoluteTime(targetDate, isUpdate)}</span>
        </div>
      </div>
      
      {isModalOpen && (
        <ManagePostModal post={post} keywords={keywords} onClose={() => setIsModalOpen(false)} />
      )}
    </>
  );
}
