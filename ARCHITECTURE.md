# Архитектура Souffle

## Обзор

Souffle - это Progressive Web Application (PWA) для изучения французского языка через визуальное погружение.

## Технический стек

```
Frontend:
├── React 18 (UI library)
├── TypeScript (Type safety)
├── Vite (Build tool)
└── Tailwind CSS (Styling)

Backend:
├── Supabase (BaaS)
│   ├── PostgreSQL (Database)
│   ├── Row Level Security (Auth & Security)
│   └── Realtime (Future feature)

Audio:
└── Web Speech API (TTS)

Animation:
├── CSS Animations (Watercolor effects)
└── Canvas API (Background effects)
```

## Структура проекта

```
souffle/
├── src/
│   ├── components/          # React компоненты
│   │   ├── WatercolorBackground.tsx   # Акварельный фон
│   │   ├── IslandMap.tsx              # Карта миров
│   │   ├── WorldView.tsx              # Просмотр мира
│   │   ├── Scene.tsx                  # Отдельная сцена
│   │   ├── ProgressTree.tsx           # Дерево прогресса
│   │   ├── CultureCard.tsx            # Культурные факты
│   │   ├── AudioVisualizer.tsx        # Аудио плеер
│   │   ├── GrammarVisual.tsx          # Визуальная грамматика
│   │   └── SleepMode.tsx              # Режим сна
│   │
│   ├── lib/                 # Утилиты и библиотеки
│   │   ├── supabase.ts     # Supabase клиент
│   │   └── srs.ts          # Spaced Repetition System
│   │
│   ├── data/                # Данные и сиды
│   │   ├── seedScenes.ts   # Начальные сцены
│   │   └── cultureCards.ts # Культурные карточки
│   │
│   ├── App.tsx              # Главный компонент
│   ├── main.tsx             # Entry point
│   └── index.css            # Глобальные стили
│
├── scripts/
│   └── init-db.html         # Инициализация БД
│
├── public/                  # Статические файлы
├── dist/                    # Build output
├── .env                     # Переменные окружения
└── package.json
```

## Схема базы данных

```
┌─────────────────┐
│     worlds      │
├─────────────────┤
│ id              │◄──┐
│ slug            │   │
│ title_fr        │   │
│ title_ru        │   │
│ description     │   │
│ order           │   │
│ color_palette   │   │
└─────────────────┘   │
                      │
                      │ world_id
                      │
┌─────────────────┐   │
│     scenes      │   │
├─────────────────┤   │
│ id              │◄──┤
│ world_id        ├───┘
│ slug            │
│ type            │     Types:
│ order           │     - visual_immersion
│ title_fr        │     - visual_recall
│ content_spec    │     - audio_guess
│ is_core         │     - associations
└─────────────────┘     - roleplay
        ▲               - culture
        │               - errors
        │
        │ scene_id
        │
┌─────────────────┐
│ user_progress   │
├─────────────────┤
│ id              │
│ user_id         │
│ scene_id        ├───┘
│ stars           │     (0-5)
│ srs_bucket      │     (0-4)
│ next_review_at  │
│ completed_at    │
└─────────────────┘

┌─────────────────┐
│ culture_cards   │
├─────────────────┤
│ id              │
│ word_or_phrase  │
│ etymology       │
│ fun_fact        │
│ related_scene   │
└─────────────────┘

┌─────────────────┐
│  user_events    │
├─────────────────┤
│ id              │
│ user_id         │
│ event_name      │
│ scene_id        │
│ payload         │
│ created_at      │
└─────────────────┘
```

## Потоки данных

### 1. Загрузка контента

```
User → App → Route Detection
                ↓
        [Home] or [World]
                ↓
        Supabase Query
                ↓
        Cache (useState)
                ↓
        Render Components
```

### 2. Прохождение сцены

```
User → WorldView → Scene Selection
                        ↓
                   Scene Component
                        ↓
                   User Interaction
                        ↓
                   Audio Playback (Web Speech API)
                        ↓
                   Validation
                        ↓
                   Success Animation
                        ↓
                   Save Progress (Supabase)
                        ↓
                   Update SRS Bucket
                        ↓
                   Return to WorldView
```

### 3. SRS (Spaced Repetition System)

```
Scene Completed
    ↓
Calculate Success → Adjust Bucket
    ↓
Bucket 0: 1 day
Bucket 1: 3 days
Bucket 2: 7 days
Bucket 3: 14 days
Bucket 4: 30 days
    ↓
Schedule Next Review
    ↓
Update user_progress
```

## Компонентная архитектура

### Главные экраны

```
App
 ├── WatercolorBackground (фон везде)
 │
 ├── IslandMap (роут: /)
 │   └── Island Cards
 │       └── onClick → navigate to world
 │
 └── WorldView (роут: /world/:slug)
     ├── ProgressTree
     ├── Scene List
     └── Scene Modal
         ├── Scene Content (разные типы)
         ├── AudioVisualizer
         ├── GrammarVisual (если нужно)
         └── CultureCard (после завершения)
```

### Scene Types (расширяемо)

```typescript
type SceneType =
  | 'visual_immersion'    // Погружение через образы
  | 'visual_recall'       // Описание картинок
  | 'audio_guess'         // Угадывание по звуку
  | 'associations'        // Ментальные связи
  | 'roleplay'            // Диалоги
  | 'culture'             // Культурные факты
  | 'errors'              // Типичные ошибки
  | string;               // Кастомные типы
```

## Стратегия рендеринга

### Client-Side Rendering (CSR)

- Используется для всего приложения
- Динамическая загрузка данных из Supabase
- Кэширование в React state

### Преимущества для нашего случая:

1. **Интерактивность**: Много анимаций и взаимодействий
2. **Персонализация**: Прогресс пользователя
3. **Offline-first**: Можно кэшировать сцены в localStorage/IndexedDB

## Оптимизация

### Performance

```typescript
// Lazy loading компонентов
const SleepMode = lazy(() => import('./components/SleepMode'));
const CultureCard = lazy(() => import('./components/CultureCard'));

// Мемоизация
const MemoizedScene = memo(Scene);

// Виртуализация длинных списков
// (пока не требуется, но для будущего)
```

### Кэширование

```typescript
// React Query pattern (можно добавить)
const { data: scenes } = useQuery('scenes', fetchScenes, {
  staleTime: 5 * 60 * 1000, // 5 минут
  cacheTime: 10 * 60 * 1000 // 10 минут
});
```

### Bundle Size

```bash
# Текущий размер
index.js   286 KB (85 KB gzipped)
index.css   15 KB  (3.6 KB gzipped)

# Оптимизации
- Tree shaking (Vite автоматически)
- Code splitting по роутам
- Lazy loading тяжёлых компонентов
```

## Безопасность

### Row Level Security (RLS)

```sql
-- Контент доступен всем
CREATE POLICY "public_read" ON scenes
  FOR SELECT TO anon, authenticated
  USING (true);

-- Прогресс только своему пользователю
CREATE POLICY "own_progress" ON user_progress
  FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());
```

### Environment Variables

```bash
# Публичные (можно показывать)
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=xxx

# Приватные (только на сервере, если нужен)
SUPABASE_SERVICE_ROLE_KEY=xxx  # Не используется в клиенте!
```

## Масштабирование

### Горизонтальное

- **CDN**: Статические файлы через Vercel/Netlify CDN
- **Supabase**: Автоматическое масштабирование БД
- **Edge Functions**: Для сложной логики (будущее)

### Вертикальное

- **Database**: Supabase автоматически
- **Медиа**: S3/R2 + CDN для изображений/аудио
- **Кэш**: Redis для часто запрашиваемых данных

## Мониторинг

### Метрики для отслеживания

```typescript
// Пользовательские метрики
- Завершённые сцены за день
- Время на сцену
- Возвраты к повторению
- Drop-off точки

// Технические метрики
- Time to Interactive (TTI)
- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- API response time
```

### Логирование

```typescript
// user_events таблица
{
  user_id: "uuid",
  event_name: "scene_completed",
  scene_id: "uuid",
  payload: {
    time_spent: 45,
    attempts: 2,
    stars_earned: 3
  }
}
```

## Будущие улучшения

### Краткосрочные (1-3 месяца)

- [ ] Progressive Web App (PWA) манифест
- [ ] Offline mode с Service Worker
- [ ] Push уведомления для повторений
- [ ] Распознавание речи (Azure/Google)

### Среднесрочные (3-6 месяцев)

- [ ] Gamification (достижения, стрики)
- [ ] Социальные функции (друзья, лидерборд)
- [ ] A/B тестирование упражнений
- [ ] Персонализированный путь обучения

### Долгосрочные (6-12 месяцев)

- [ ] Мобильные приложения (React Native)
- [ ] AI генерация упражнений
- [ ] Голосовой ассистент
- [ ] Уровни A2, B1, B2

## Разработка

### Локальный запуск

```bash
npm install
npm run dev
```

### Тестирование

```bash
npm run test          # Unit tests (будущее)
npm run test:e2e      # E2E tests (будущее)
npm run typecheck     # TypeScript check
```

### Деплой

```bash
npm run build
vercel deploy --prod
```

---

Документация обновлена: 2025-11-02
