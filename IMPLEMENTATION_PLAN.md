# План реализации полной программы Souffle

## Текущий статус

### Что уже готово:

**Архитектура:**
- 8 типов сцен (immersion, visual-recall, audio-choice, echo-auditif, micro-dialogue, culture-minute, erreur-vivante, association-sensorielle)
- Система tooltips для подсказок
- Компоненты для всех новых типов сцен
- SceneHost с роутингом типов
- Система splash-эффектов
- PWA поддержка

**Контент:**
- Lesson 01 (Le miroir) - базовый
- Lesson 02 (Bonjour) - 3 сцены (culture, dialogue, echo)
- Lesson 03 (Emotions) - структура
- Полная программа A0→A1 в PROGRAM.md
- Руководство по медиа в MEDIA_RESOURCES.md

**Проблемы решены:**
- Типы TypeScript скомпилированы
- Build проходит успешно
- Все новые компоненты подключены

---

## Немедленные задачи (эта неделя)

### День 1-2: Медиа-ресурсы

**Приоритет 1 - Изображения (Unsplash/Pexels):**

```bash
cd public/assets/images

# Эмоции
curl -L -o emotions/happy.webp "https://unsplash.com/photos/[happy-face-id]/download?force=true"
curl -L -o emotions/sad.webp "https://unsplash.com/photos/[sad-face-id]/download?force=true"
curl -L -o emotions/tired.webp "https://unsplash.com/photos/[tired-face-id]/download?force=true"

# Кафе
curl -L -o paris/cafe-morning.webp "https://unsplash.com/photos/[cafe-id]/download?force=true"

# Еда
curl -L -o food/croissant.webp "https://unsplash.com/photos/[croissant-id]/download?force=true"
curl -L -o food/baguette.webp "https://unsplash.com/photos/[baguette-id]/download?force=true"
```

**Список изображений для загрузки:**
1. Emotions (5): happy, sad, tired, surprised, neutral
2. Paris cafes (3): morning, afternoon, terrace
3. French food (5): croissant, baguette, cheese, wine, coffee
4. Paris landmarks (3): Eiffel Tower, Louvre, Seine
5. Lesson covers (5): для первых 5 уроков

**Инструкция:**
- Перейти на Unsplash: https://unsplash.com/s/photos/paris-cafe
- Выбрать фото с теплыми тонами, мягким светом
- Download → получить URL
- Скачать через curl или wget
- Конвертировать в WebP если нужно

**Приоритет 2 - Аудио (Freesound.org):**

```bash
cd public/assets/audio

# Амбиенсы
# 1. Зарегистрироваться на Freesound.org
# 2. Найти: "paris cafe ambience cc0"
# 3. Скачать файлы
wget "https://freesound.org/data/previews/[file-id]" -O ambiance/cafe-morning.mp3

# Или использовать Web Speech API для произношения
```

**Приоритет 3 - Lottie анимации:**

Пока используем простые заглушки или минималистичные анимации:
- LottieFiles: https://lottiefiles.com/search?q=emotion&category=free
- Скачать JSON файлы
- Положить в public/assets/lottie/

### День 3: Создание контента для Lesson 02-05

**Lesson 02: Bonjour (уже начат)**
- [x] Culture Minute: bonjour
- [x] Micro-Dialogue: au cafe
- [x] Echo Auditif: sons du matin
- [ ] Visual Recall: salutations (добавить)

**Lesson 03: Emotions**
- [ ] Culture Minute: histoire des emotions en francais
- [ ] Immersion: le miroir des emotions (переработать текущую)
- [ ] Micro-Dialogue: parler de ses sentiments
- [ ] Echo Auditif: voix emotionnelles

**Lesson 04: J'ai faim**
- [ ] Culture Minute: pourquoi "avoir faim"?
- [ ] Association Sensorielle: sensations physiques
- [ ] Micro-Dialogue: a la boulangerie
- [ ] Visual Recall: aliments francais

**Lesson 05: C'est quoi?**
- [ ] Visual Immersion: objets de la maison
- [ ] Echo Auditif: sons de la maison
- [ ] Micro-Dialogue: chez un ami
- [ ] Erreur Vivante: c'est vs il est

### День 4-5: Улучшение существующих сцен

**Добавить Tooltips везде:**

В каждом Micro-Dialogue, где есть французский текст без перевода:

```tsx
import { Tooltip } from '../Tooltip';

// Вместо просто текста:
<p>{line.text}</p>

// Использовать:
<p>
  {line.text.split(' ').map((word, i) => (
    <Tooltip key={i} french={word} translation={getTranslation(word)} inline>
      {word}
    </Tooltip>
  ))}
</p>
```

**Создать словарь переводов:**

```typescript
// src/data/vocabulary.ts
export const vocabulary: Record<string, string> = {
  'bonjour': 'здравствуйте',
  'merci': 'спасибо',
  'comment': 'как',
  'allez': 'идете',
  'vous': 'вы',
  // ... 500+ слов
};

export function getTranslation(word: string): string | undefined {
  const clean = word.toLowerCase().replace(/[.,!?]/g, '');
  return vocabulary[clean];
}
```

**Добавить произношение:**

```typescript
// src/lib/pronunciation.ts
export async function fetchPronunciation(word: string): Promise<string | null> {
  // Forvo API или локальные файлы
  const audioUrl = `/assets/audio/pronunciation/${word}.mp3`;

  try {
    const response = await fetch(audioUrl);
    if (response.ok) return audioUrl;
  } catch {
    return null;
  }

  return null;
}
```

---

## Среднесрочные задачи (2-3 недели)

### Неделя 2: Контент и полировка

**Создать все 18 уроков:**
1. Написать структуру каждого урока (lesson.json)
2. Создать минимум 4 сцены на урок
3. Подготовить тексты Culture Minute для каждого
4. Написать диалоги для Micro-Dialogue

**Записать аудио:**
- Найти франкоговорящих фрилансеров (Fiverr, Upwork)
- Подготовить скрипты из dialogues
- Записать 50 коротких диалогов
- Обработать и оптимизировать

**Создать визуальную грамматику:**
- Анимации для глаголов être, avoir
- Визуализация времен (present, passe compose)
- Схемы для предлогов места
- Таблицы родов и чисел

### Неделя 3: Тестирование и доработка

**Альфа-тестирование:**
- Пригласить 5-10 человек
- Собрать feedback по каждому уроку
- Измерить время прохождения сцен
- Определить сложные места

**Доработка на основе feedback:**
- Упростить сложные сцены
- Добавить подсказки где нужно
- Улучшить объяснения
- Исправить ошибки

**Оптимизация:**
- Сжать все изображения
- Оптимизировать аудио
- Уменьшить размер Lottie
- Улучшить загрузку

---

## Долгосрочные задачи (1-2 месяца)

### Расширенные функции

**Система достижений:**
```typescript
// src/lib/achievements.ts
export const achievements = [
  {
    id: 'first-lesson',
    title: 'Premier pas',
    description: 'Complete your first lesson',
    icon: '🌱'
  },
  {
    id: 'streak-7',
    title: 'Une semaine',
    description: '7 days in a row',
    icon: '🔥'
  }
  // ... 30 achievements
];
```

**Персонализированный путь:**
- A/B тестирование типов сцен
- Адаптация сложности
- Рекомендации на основе прогресса
- Слабые места и фокус

**Социальные функции:**
- Профили пользователей
- Друзья и лидерборд
- Sharing достижений
- Групповые челленджи

---

## Технические детали

### Структура контента (финальная)

```
content/
├── worlds/
│   └── world-moi.json
├── lessons/
│   ├── 01-intro/        # Le miroir (être)
│   ├── 02-bonjour/      # Salutations
│   ├── 03-emotions/     # Emotions et adjectifs
│   ├── 04-jai-faim/     # Avoir + sensations
│   ├── 05-cest-quoi/    # Demonstratifs
│   ├── 06-ou-est/       # Prepositions lieu
│   ├── 07-je-veux/      # Verbes modaux
│   ├── 08-ma-ville/     # Integration bloc 2
│   ├── 09-verbes-er/    # Present -ER (part 1)
│   ├── 10-verbes-er-2/  # Present -ER (part 2)
│   ├── 11-passe-1/      # Passe compose intro
│   ├── 12-passe-2/      # Passe compose practice
│   ├── 13-histoire/     # Integration temps
│   ├── 14-famille/      # La famille
│   ├── 15-famille-2/    # Relations
│   ├── 16-gouts/        # Preferences
│   ├── 17-restaurant/   # Au restaurant
│   └── 18-soiree/       # Integration finale
└── data/
    ├── vocabulary.ts    # 500+ words with translations
    ├── phrases.ts       # Common phrases
    └── grammar.ts       # Grammar explanations
```

### Приоритеты медиа-загрузки

**Критично для MVP (50 файлов):**
- [ ] 10 emotion faces
- [ ] 10 Paris cafes/streets
- [ ] 10 French food items
- [ ] 10 basic objects
- [ ] 5 lesson covers
- [ ] 5 ambient sounds

**Важно для полноты (150 файлов):**
- [ ] 20 action animations
- [ ] 30 pronunciation audio files
- [ ] 20 dialogue audio files
- [ ] 30 Paris landmark photos
- [ ] 20 household objects
- [ ] 30 various scenes

**Расширение (300+ файлов):**
- Все остальное по мере необходимости

---

## Контрольный список запуска

### Перед публичным запуском:

**Контент:**
- [ ] Минимум 5 полных уроков (25+ сцен)
- [ ] Все медиа работают
- [ ] Переводы и подсказки везде
- [ ] Аудио высокого качества

**Техническое:**
- [ ] Build проходит без ошибок
- [ ] TypeScript типы корректны
- [ ] PWA работает offline
- [ ] Тесты покрывают основное
- [ ] Производительность оптимизирована

**UX:**
- [ ] Onboarding для новых пользователей
- [ ] Понятные инструкции
- [ ] Feedback на все действия
- [ ] Грацефулная обработка ошибок

**Данные:**
- [ ] RLS настроен корректно
- [ ] Миграции применены
- [ ] Backup стратегия готова
- [ ] Analytics интегрирована

---

## Метрики для отслеживания

### День 1:
- Количество зарегистрированных пользователей
- Completion rate первой сцены
- Время на сцену

### Неделя 1:
- DAU/MAU ratio
- Retention Day 7
- Средний прогресс (сцен пройдено)
- Самые популярные типы сцен

### Месяц 1:
- Retention Day 30
- NPS score
- Конверсия в платных
- Ошибки и баги

---

## Следующий шаг прямо сейчас

**Приоритет №1: Медиа**

1. Открыть Unsplash: https://unsplash.com/s/photos/paris-cafe
2. Скачать 5 фото кафе
3. Конвертировать в WebP
4. Положить в public/assets/images/paris/
5. Обновить lesson-bonjour cover

**Приоритет №2: Контент**

1. Создать scenes для Lesson 03 (Emotions)
2. Написать Culture Minute про эмоции
3. Создать Micro-Dialogue
4. Добавить Echo Auditif

**Приоритет №3: Tooltips**

1. Создать vocabulary.ts с 100 базовыми словами
2. Интегрировать Tooltip в MicroDialogue
3. Добавить переводы на все французские фразы
4. Тестировать hover/click на мобильных

---

*Этот план живой документ. Обновляется по мере прогресса.*
*Текущая версия: 2025-11-03*
