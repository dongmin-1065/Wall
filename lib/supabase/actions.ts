'use server';

import { createClient } from './server';
import { revalidatePath } from 'next/cache';

// ========== KEYWORD ACTIONS ==========

export async function getKeywords() {
  const supabase = await createClient();
  // is_default (안전하게 boolean 내림차순 정렬 시 true가 먼저 옴), 그 다음 생성순 정렬
  const { data, error } = await supabase.from('keywords')
    .select('*')
    .order('is_default', { ascending: false })
    .order('created_at', { ascending: true });
    
  if (error) {
    console.error("Error fetching keywords:", error);
    return [];
  }
  return data;
}

export async function createKeyword(name: string) {
  const supabase = await createClient();
  if (!name.trim()) return { error: '키워드 이름을 입력하세요.' };

  const { error } = await supabase.from('keywords').insert([{ name: name.trim() }]);
  if (error) {
    if (error.code === '23505') return { error: '이미 존재하는 키워드입니다.' };
    return { error: '키워드 추가 중 오류가 발생했습니다.' };
  }
  revalidatePath('/');
  return { success: true };
}

export async function updateKeyword(id: string, newName: string) {
  const supabase = await createClient();
  if (!newName.trim()) return { error: '키워드 이름을 입력하세요.' };

  const { error } = await supabase.from('keywords').update({ name: newName.trim() }).eq('id', id);
  if (error) {
    if (error.code === '23505') return { error: '이미 존재하는 키워드입니다.' };
    return { error: '키워드 수정 중 오류가 발생했습니다.' };
  }
  revalidatePath('/');
  return { success: true };
}

export async function deleteKeyword(id: string) {
  const supabase = await createClient();
  
  // 보안: 기본 키워드는 삭제 불가 로직 (서버단 이중 검증)
  const { data: keyword } = await supabase.from('keywords').select('is_default').eq('id', id).single();
  if (keyword?.is_default) return { error: '기본 키워드는 삭제할 수 없습니다.' };

  const { error } = await supabase.from('keywords').delete().eq('id', id);
  if (error) return { error: '키워드 삭제 중 오류가 발생했습니다.' };
  
  revalidatePath('/');
  return { success: true };
}

// ========== POST ACTIONS ==========

export async function getPosts(searchQuery?: string, keywordId?: string) {
  const supabase = await createClient();
  let query = supabase.from('posts')
    .select('id, title, content, color, sort_order, created_at, updated_at, keyword_id')
    .order('sort_order', { ascending: false })
    .order('created_at', { ascending: false });

  if (searchQuery) {
    query = query.or(`title.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`);
  }
  if (keywordId) {
    query = query.eq('keyword_id', keywordId);
  }

  const { data, error } = await query;
  if (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
  return data;
}

export async function createPost(formData: FormData) {
  const supabase = await createClient();
  const title = formData.get('title') as string;
  const password = formData.get('password') as string;
  const content = formData.get('content') as string;
  const color = formData.get('color') as string || 'yellow';
  const keyword_id = formData.get('keyword_id') as string;

  if (!title || !password || !content || !keyword_id) return { error: '모든 필드를 입력해야 합니다.' };

  let maxOrder = 0;
  const { data: maxRecord } = await supabase.from('posts').select('sort_order').order('sort_order', { ascending: false }).limit(1).single();
  if (maxRecord && maxRecord.sort_order !== null) maxOrder = maxRecord.sort_order;

  const { error } = await supabase.from('posts').insert([{ title, password, content, color, sort_order: maxOrder + 1, keyword_id }]);
  if (error) return { error: '게시글 저장에 실패했습니다.' };

  revalidatePath('/');
  return { success: true };
}

export async function updatePost(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get('id') as string;
  const passwordInput = formData.get('password') as string;
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  const color = formData.get('color') as string;
  const keyword_id = formData.get('keyword_id') as string;

  if (!id || !passwordInput || !title || !content || !color || !keyword_id) return { error: '모든 필드를 입력해야 합니다.' };

  const { data: post, error: fetchError } = await supabase.from('posts').select('password').eq('id', id).single();
  if (fetchError || !post) return { error: '게시글을 찾을 수 없습니다.' };
  if (post.password !== passwordInput) return { error: '비밀번호가 일치하지 않습니다.' };

  const { error: updateError } = await supabase.from('posts').update({ 
    title, content, color, keyword_id, updated_at: new Date().toISOString() 
  }).eq('id', id);

  if (updateError) return { error: '게시글 수정 중 오류가 발생했습니다.' };

  revalidatePath('/');
  return { success: true };
}

export async function deletePost(id: string, passwordInput: string) {
  const supabase = await createClient();
  const { data: post, error: fetchError } = await supabase.from('posts').select('password').eq('id', id).single();
  if (fetchError || !post) return { error: '게시글을 찾을 수 없습니다.' };
  if (post.password !== passwordInput) return { error: '비밀번호가 일치하지 않습니다.' };

  const { error: deleteError } = await supabase.from('posts').delete().eq('id', id);
  if (deleteError) return { error: '게시글 삭제 중 오류가 발생했습니다.' };

  revalidatePath('/');
  return { success: true };
}

export async function updatePostOrder(items: { id: string; sort_order: number }[]) {
  const supabase = await createClient();
  await Promise.all(items.map(item => 
    supabase.from('posts').update({ sort_order: item.sort_order }).eq('id', item.id)
  ));
  revalidatePath('/');
}
