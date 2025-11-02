import { supabase } from '../lib/supabase';
import { getCurrentUser } from '../lib/auth';

export async function saveSceneProgress({ sceneId, stars }: { sceneId: string; stars: number }) {
  const user = await getCurrentUser();
  if (!user) throw new Error('User not authenticated');

  await supabase
    .from('user_progress')
    .upsert({
      user_id: user.id,
      scene_id: sceneId,
      stars,
      last_seen_at: new Date().toISOString()
    }, { onConflict: 'user_id,scene_id' });
}

export async function getUserProgress(userId: string) {
  const { data, error } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', userId);

  if (error) throw error;
  return data || [];
}