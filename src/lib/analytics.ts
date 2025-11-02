import { supabase } from './supabase';
import { getCurrentUser } from './auth';

export async function track(eventName: string, payload: any = {}) {
  try {
    const user = await getCurrentUser();
    if (!user) return; // Don't track if no user

    await supabase.from('user_events').insert({
      user_id: user.id,
      event_name: eventName,
      payload,
      created_at: new Date().toISOString()
    });
  } catch (error) {
    console.error('Analytics tracking failed:', error);
  }
}