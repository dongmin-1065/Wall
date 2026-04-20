'use server';

import { createClient } from './server';
import { revalidatePath } from 'next/cache';

export async function getPosts(searchQuery?: string) {
  const supabase = await createClient();
  let query = supabase.from('posts')
    .select('id, title, content, color, sort_order, created_at, updated_at')
    .order('sort_order', { ascending: false })
    .order('created_at', { ascending: false });

  if (searchQuery) {
    query = query.or(`title.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`);
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

  if (!title || !password || !content) return { error: '모든 필드를 입력해야 합니다.' };

  let maxOrder = 0;
  const { data: maxRecord } = await supabase.from('posts').select('sort_order').order('sort_order', { ascending: false }).limit(1).single();
  if (maxRecord && maxRecord.sort_order !== null) maxOrder = maxRecord.sort_order;

  const { error } = await supabase.from('posts').insert([{ title, password, content, color, sort_order: maxOrder + 1 }]);
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

  if (!id || !passwordInput || !title || !content || !color) return { error: '모든 필드를 입력해야 합니다.' };

  const { data: post, error: fetchError } = await supabase.from('posts').select('password').eq('id', id).single();
  if (fetchError || !post) return { error: '게시글을 찾을 수 없습니다.' };
  if (post.password !== passwordInput) return { error: '비밀번호가 일치하지 않습니다.' };

  const { error: updateError } = await supabase.from('posts').update({ 
    title, content, color, updated_at: new Date().toISOString() 
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
