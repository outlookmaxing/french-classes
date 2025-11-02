# Примеры использования Souffle

## Структура сцены

### Пример 1: Visual Immersion (Le miroir)

```typescript
{
  world_id: "uuid-here",
  slug: "le-miroir",
  type: "visual_immersion",
  order: 1,
  title_fr: "Le miroir",
  is_core: true,
  content_spec: {
    description: "Знакомство с глаголом être через эмоции",
    visual_type: "emotion_selector",
    options: [
      { text: "content", emoji: "😊", color: "#F9E79F" },
      { text: "fatigué", emoji: "😴", color: "#A7D8F0" },
      { text: "triste", emoji: "😢", color: "#C5E3C8" },
      { text: "heureux", emoji: "😄", color: "#F5B6B4" }
    ],
    grammar_hint: {
      type: "etre",
      explanation: "être описывает состояние, а не действие"
    }
  }
}
```

### Пример 2: Visual Recall (Les couleurs)

```typescript
{
  world_id: "uuid-here",
  slug: "les-couleurs",
  type: "visual_recall",
  order: 5,
  title_fr: "Les couleurs et les objets",
  is_core: true,
  content_spec: {
    description: "Цвета и описание предметов",
    scene_image: "/images/room.jpg",
    targets: [
      { id: 1, phrase: "La table est rouge", x: 30, y: 40 },
      { id: 2, phrase: "Le livre est petit", x: 50, y: 60 },
      { id: 3, phrase: "La chaise est verte", x: 70, y: 50 }
    ],
    word_bank: ["La", "Le", "table", "livre", "chaise", "est", "rouge", "petit", "verte"]
  }
}
```

### Пример 3: Audio Guess

```typescript
{
  world_id: "uuid-here",
  slug: "les-actions",
  type: "audio_guess",
  order: 4,
  title_fr: "Écoute et devine",
  is_core: true,
  content_spec: {
    description: "Угадайте действие по звуку",
    rounds: [
      {
        audio_text: "Elle rit",
        images: [
          { id: "a", url: "/img/crying.jpg", correct: false },
          { id: "b", url: "/img/laughing.jpg", correct: true },
          { id: "c", url: "/img/reading.jpg", correct: false }
        ]
      }
    ]
  }
}
```

## Добавление культурных карточек

### Через SQL

```sql
INSERT INTO culture_cards (word_or_phrase, etymology, fun_fact)
VALUES
  (
    'merci',
    'От латинского "merces" (плата, награда). Раньше говорили "grand merci".',
    'В средневековой Франции "merci" также означало "пощада". Отсюда выражение "être à la merci de".'
  ),
  (
    'liberté',
    'От латинского "libertas". Корень "liber" означал "свободный человек".',
    'Девиз "Liberté, Égalité, Fraternité" появился во время революции, но стал официальным только в 1880.'
  );
```

### Через TypeScript

```typescript
import { supabase } from './lib/supabase';
import { cultureCards } from './data/cultureCards';

async function seedCultureCards() {
  for (const card of cultureCards) {
    await supabase
      .from('culture_cards')
      .insert({
        word_or_phrase: card.word,
        etymology: card.etymology,
        fun_fact: card.funFact
      });
  }
}
```

## Трекинг прогресса пользователя

### Сохранение прогресса

```typescript
async function saveProgress(userId: string, sceneId: string, success: boolean) {
  const { data: existing } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('scene_id', sceneId)
    .maybeSingle();

  const newBucket = existing
    ? getNextBucket(existing.srs_bucket, success)
    : 0;

  const nextReview = calculateNextReview(newBucket);
  const stars = calculateStars(newBucket);

  await supabase
    .from('user_progress')
    .upsert({
      user_id: userId,
      scene_id: sceneId,
      stars,
      srs_bucket: newBucket,
      next_review_at: nextReview.toISOString(),
      last_seen_at: new Date().toISOString(),
      completed_at: success ? new Date().toISOString() : null
    });
}
```

### Получение сцен для повторения

```typescript
async function getReviewScenes(userId: string) {
  const { data } = await supabase
    .from('user_progress')
    .select(`
      *,
      scenes (
        id,
        title_fr,
        type,
        content_spec
      )
    `)
    .eq('user_id', userId)
    .lte('next_review_at', new Date().toISOString())
    .order('next_review_at', { ascending: true })
    .limit(5);

  return data;
}
```

## Создание нового типа упражнения

### 1. Добавить тип в Scene.tsx

```typescript
// src/components/Scene.tsx

const renderSceneContent = () => {
  switch (scene.type) {
    case 'visual_immersion':
      return <VisualImmersion scene={scene} onComplete={handleComplete} />;

    case 'word_match':
      return <WordMatch scene={scene} onComplete={handleComplete} />;

    // Ваш новый тип
    case 'sentence_builder':
      return <SentenceBuilder scene={scene} onComplete={handleComplete} />;

    default:
      return <div>Unknown scene type</div>;
  }
};
```

### 2. Создать компонент

```typescript
// src/components/exercises/SentenceBuilder.tsx

interface SentenceBuilderProps {
  scene: Scene;
  onComplete: () => void;
}

export function SentenceBuilder({ scene, onComplete }: SentenceBuilderProps) {
  const { words, targetSentence } = scene.content_spec;
  const [selected, setSelected] = useState<string[]>([]);

  const checkAnswer = () => {
    if (selected.join(' ') === targetSentence) {
      playSuccessAnimation();
      setTimeout(onComplete, 1500);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="min-h-16 p-4 rounded-3xl bg-white/50">
          {selected.join(' ') || 'Составьте фразу...'}
        </div>
      </div>

      <div className="flex flex-wrap gap-3 justify-center">
        {words.map((word, i) => (
          <button
            key={i}
            onClick={() => setSelected([...selected, word])}
            className="px-6 py-3 rounded-full bg-gradient-to-r from-pink-200 to-blue-200"
          >
            {word}
          </button>
        ))}
      </div>

      <button onClick={checkAnswer}>Vérifier</button>
    </div>
  );
}
```

### 3. Добавить в базу данных

```sql
INSERT INTO scenes (world_id, slug, type, order, title_fr, content_spec)
VALUES (
  'world-uuid',
  'construire-phrases',
  'sentence_builder',
  11,
  'Construire des phrases',
  '{
    "words": ["Je", "suis", "content", "très"],
    "targetSentence": "Je suis très content",
    "hint": "Начните с местоимения"
  }'::jsonb
);
```

## Кастомизация визуальных эффектов

### Изменение цветовой палитры мира

```typescript
const customPalette = {
  primary: '#E8B4F0',    // Светло-фиолетовый
  secondary: '#B4E8E0',   // Бирюзовый
  accent: '#F0D4B4',      // Персиковый
  background: '#F8F5F2'   // Кремовый
};

await supabase
  .from('worlds')
  .update({ color_palette: customPalette })
  .eq('slug', 'moi-et-le-monde');
```

### Добавление своих акварельных текстур

```typescript
// WatercolorBackground.tsx - настройка цветов

const colors = [
  '#E8B4F0',  // Ваш цвет 1
  '#B4E8E0',  // Ваш цвет 2
  '#F0D4B4',  // Ваш цвет 3
  // ...
];
```

## Аналитика и события

### Трекинг событий

```typescript
async function trackEvent(
  userId: string,
  eventName: string,
  sceneId?: string,
  payload?: Record<string, unknown>
) {
  await supabase
    .from('user_events')
    .insert({
      user_id: userId,
      event_name: eventName,
      scene_id: sceneId,
      payload: payload || {}
    });
}

// Использование
trackEvent(userId, 'scene_started', sceneId);
trackEvent(userId, 'scene_completed', sceneId, {
  time_spent: 45,
  attempts: 2
});
trackEvent(userId, 'culture_card_viewed', null, {
  word: 'bizarre'
});
```

## Режим сна

```typescript
import { SleepMode } from './components/SleepMode';

const sleepPhrases = [
  'Je suis content',
  'Elle est fatiguée',
  'Nous sommes heureux',
  'Tu es gentil',
  'Il est calme'
];

<SleepMode
  phrases={sleepPhrases}
  onClose={() => setSleepMode(false)}
/>
```

---

Больше примеров и документации в `README.md` и `SETUP.md`
