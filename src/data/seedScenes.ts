import { supabase } from '../lib/supabase';

export async function seedScenes() {
  const { data: world } = await supabase
    .from('worlds')
    .select('id')
    .eq('slug', 'moi-et-le-monde')
    .maybeSingle();

  if (!world) {
    console.error('World not found');
    return;
  }

  const scenes = [
    {
      world_id: world.id,
      slug: 'le-miroir',
      type: 'visual_immersion',
      order: 1,
      title_fr: 'Le miroir',
      is_core: true,
      content_spec: {
        description: 'Знакомство с глаголом être через эмоции',
        emotions: ['content', 'fatigué', 'triste', 'heureux'],
        visual: 'mirror'
      }
    },
    {
      world_id: world.id,
      slug: 'les-salutations',
      type: 'visual_recall',
      order: 2,
      title_fr: 'Les salutations',
      is_core: true,
      content_spec: {
        description: 'Приветствия и социальные ритуалы',
        phrases: ['Salut!', 'Bonjour!', 'Bonsoir!', 'Ça va?'],
        visual: 'paris_street'
      }
    },
    {
      world_id: world.id,
      slug: 'les-emotions',
      type: 'visual_recall',
      order: 3,
      title_fr: 'Les émotions',
      is_core: true,
      content_spec: {
        description: 'Прилагательные и согласование по роду',
        emotions: ['heureux/heureuse', 'triste', 'en colère', 'surpris/surprise']
      }
    },
    {
      world_id: world.id,
      slug: 'les-verbes',
      type: 'visual_immersion',
      order: 4,
      title_fr: 'Les verbes de la vie',
      is_core: true,
      content_spec: {
        description: 'Базовые действия',
        verbs: ['manger', 'boire', 'marcher', 'dormir', 'parler']
      }
    },
    {
      world_id: world.id,
      slug: 'les-couleurs',
      type: 'visual_recall',
      order: 5,
      title_fr: 'Les couleurs et les objets',
      is_core: true,
      content_spec: {
        description: 'Цвета и описание предметов',
        colors: ['rouge', 'bleu', 'vert', 'jaune', 'rose']
      }
    },
    {
      world_id: world.id,
      slug: 'ma-famille',
      type: 'visual_recall',
      order: 6,
      title_fr: 'Ma famille imaginaire',
      is_core: true,
      content_spec: {
        description: 'Семья и местоимения',
        family: ['mon père', 'ma mère', 'mon frère', 'ma sœur']
      }
    },
    {
      world_id: world.id,
      slug: 'les-gouts',
      type: 'associations',
      order: 7,
      title_fr: 'Les goûts et les envies',
      is_core: true,
      content_spec: {
        description: 'Предпочтения: aimer, adorer, détester',
        categories: ['food', 'animals', 'activities']
      }
    },
    {
      world_id: world.id,
      slug: 'mon-corps',
      type: 'visual_immersion',
      order: 8,
      title_fr: 'Mon corps',
      is_core: true,
      content_spec: {
        description: 'Части тела и avoir mal à',
        body_parts: ['la tête', 'le ventre', 'le dos', 'les pieds']
      }
    },
    {
      world_id: world.id,
      slug: 'le-temps',
      type: 'visual_recall',
      order: 9,
      title_fr: 'Le temps et le moment présent',
      is_core: true,
      content_spec: {
        description: 'Время: aujourd\'hui, maintenant, hier, demain',
        time_words: ['aujourd\'hui', 'maintenant', 'hier', 'demain']
      }
    },
    {
      world_id: world.id,
      slug: 'integration',
      type: 'roleplay',
      order: 10,
      title_fr: 'Moi dans le monde',
      is_core: true,
      content_spec: {
        description: 'Интеграция всех навыков в мини-историю',
        story: true
      }
    }
  ];

  for (const scene of scenes) {
    await supabase
      .from('scenes')
      .upsert(scene, { onConflict: 'world_id,slug' });
  }

  console.log('Scenes seeded successfully!');
}
