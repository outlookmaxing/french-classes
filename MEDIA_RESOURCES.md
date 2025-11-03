# Media Resources Guide

Все медиа-ресурсы в проекте должны быть бесплатными (CC0/Public Domain) и высокого качества.

## Изображения

### Unsplash (CC0 - бесплатно для коммерческого использования)

**Cafes parisiens:**
- https://unsplash.com/s/photos/paris-cafe
- Ключевые слова: "french cafe", "paris coffee", "bistro"
- Рекомендуемые: утренний свет, теплые тона, атмосферные

**Emotions & People:**
- https://unsplash.com/s/photos/french-people
- Ключевые слова: "facial expressions", "emotions portrait"
- Нужно: радость, грусть, усталость, удивление

**French Food:**
- https://unsplash.com/s/photos/french-food
- Ключевые слова: "croissant", "baguette", "french breakfast"
- Рекомендуемые: крупные планы, естественное освещение

**Paris Landmarks:**
- https://unsplash.com/s/photos/paris
- Ключевые слова: "eiffel tower", "louvre", "seine river"
- Стиль: акварельные, мягкие, атмосферные

### Pexels (CC0 - бесплатно)
- https://www.pexels.com/search/paris%20cafe/
- Аналогичные категории как Unsplash
- Хороший backup источник

### Рекомендации по выбору изображений:
1. Разрешение: минимум 1920x1080px
2. Стиль: мягкий, естественный, теплый
3. Цвета: соответствуют нашей палитре (пастельные)
4. Без текста и логотипов
5. Не стоковые позы - естественные моменты

---

## Аудио

### Freesound.org (CC0 и CC-BY)

**Амбиенс кафе:**
```
https://freesound.org/search/?q=cafe+paris
https://freesound.org/search/?q=french+restaurant
https://freesound.org/search/?q=coffee+shop+ambience
```

Конкретные файлы (CC0):
- Street sounds Montmartre: https://freesound.org/people/Mxsmanic/sounds/149194/
- French Cafe Ambience: поиск "french cafe ambience cc0"

**Природа и улицы:**
```
https://freesound.org/search/?q=paris+street
https://freesound.org/search/?q=french+market
https://freesound.org/search/?q=rain+france
```

**Звуки дома:**
```
https://freesound.org/search/?q=door+open
https://freesound.org/search/?q=water+running
https://freesound.org/search/?q=clock+ticking
```

### Forvo (Произношение от носителей)
- https://forvo.com/languages/fr/
- API: https://api.forvo.com/
- Использовать: для каждого нового слова
- Лицензия: указывать источник

### Запись собственного аудио

**Для диалогов нужны носители:**
1. Найти франкоговорящих друзей/фрилансеров
2. Скрипты готовы в content/lessons/
3. Формат: MP3, 128kbps, моно
4. Без фонового шума

**Критерии качества:**
- Четкая артикуляция
- Естественная скорость (0.85x от обычной)
- Эмоциональная окраска
- Без акцента (Paris standard)

---

## Анимации Lottie

### LottieFiles (Бесплатные и платные)
- https://lottiefiles.com/
- Ключевые слова: "emotions", "actions", "french"
- Лицензия: проверять для каждого файла

### Что нужно:

**Эмоции (10 анимаций):**
- Радость, грусть, удивление, усталость
- Злость, страх, задумчивость, волнение
- Стиль: минималистичный, плавный

**Действия (30 анимаций):**
- Ходьба, еда, питье, чтение, сон
- Письмо, разговор по телефону, работа
- Приготовление еды, уборка
- Стиль: силуэты или простые персонажи

**Объекты (20 анимаций):**
- Еда: хлеб, кофе, круассан
- Дом: стол, стул, кровать, дверь
- Город: машины, деревья, здания
- Стиль: иконки, минимализм

### Создание собственных Lottie:
1. After Effects + Bodymovin plugin
2. Или использовать Lottie Editor online
3. Экспортировать JSON
4. Оптимизировать размер (<100KB)

---

## Структура файлов

```
public/assets/
├── images/
│   ├── emotions/
│   │   ├── happy.webp
│   │   ├── sad.webp
│   │   └── ...
│   ├── food/
│   │   ├── croissant.webp
│   │   ├── baguette.webp
│   │   └── ...
│   ├── paris/
│   │   ├── eiffel-tower.webp
│   │   ├── cafe-terrace.webp
│   │   └── ...
│   └── lessons/
│       ├── lesson-intro.webp
│       ├── lesson-bonjour.webp
│       └── ...
│
├── audio/
│   ├── ambiance/
│   │   ├── cafe-morning.mp3
│   │   ├── paris-street.mp3
│   │   └── ...
│   ├── pronunciation/
│   │   ├── bonjour.mp3
│   │   ├── merci.mp3
│   │   └── ...
│   └── dialogues/
│       ├── intro-sprite.mp3
│       ├── cafe-dialogue.mp3
│       └── ...
│
└── lottie/
    ├── emotions/
    │   ├── happy.json
    │   └── ...
    ├── actions/
    │   ├── walking.json
    │   └── ...
    └── objects/
        ├── croissant.json
        └── ...
```

---

## Приоритетный список для загрузки

### Неделя 1: Базовые ресурсы (50 файлов)

**Изображения (20 файлов):**
- [ ] 5 эмоциональных лиц
- [ ] 5 парижских кафе
- [ ] 5 французской еды
- [ ] 5 парижских мест

**Аудио (15 файлов):**
- [ ] 5 амбиенсов (кафе, улица, дом, парк, метро)
- [ ] 10 произношений базовых слов (Forvo)

**Lottie (15 файлов):**
- [ ] 5 эмоций (радость, грусть, усталость, удивление, нейтральное)
- [ ] 5 действий (ходьба, еда, сон, говорение, мышление)
- [ ] 5 объектов (кофе, хлеб, дом, стул, книга)

### Неделя 2: Расширение (100 файлов)

**Изображения (40 файлов):**
- [ ] 10 объектов дома
- [ ] 10 продуктов питания
- [ ] 10 городских сцен
- [ ] 10 природных пейзажей

**Аудио (30 файлов):**
- [ ] 10 амбиенсов
- [ ] 20 произношений слов

**Lottie (30 файлов):**
- [ ] 10 эмоций (полный набор)
- [ ] 15 действий
- [ ] 5 объектов

### Неделя 3: Полный набор (250 файлов)

Достаточно для всех 18 уроков программы.

---

## Оптимизация медиа

### Изображения:
```bash
# Конвертация в WebP (лучшее сжатие)
cwebp input.jpg -q 85 -o output.webp

# Resize до нужного размера
convert input.jpg -resize 1920x1080 output.jpg
```

### Аудио:
```bash
# Конвертация в MP3 с оптимальным битрейтом
ffmpeg -i input.wav -b:a 128k -ac 1 output.mp3

# Обрезка тишины
ffmpeg -i input.mp3 -af silenceremove=1:0:-50dB output.mp3
```

### Lottie:
- Удалить неиспользуемые слои
- Упростить пути
- Использовать символы для повторяющихся элементов
- Оптимизировать через lottie-optimizer

---

## Лицензирование

### Всегда указывать источник (даже для CC0):

```markdown
## Credits

### Images
- Paris Cafe photos by [Photographer Name] on Unsplash
- Emotion portraits by [Photographer Name] on Pexels

### Audio
- Cafe ambience by [Username] on Freesound.org (CC0)
- French pronunciation from Forvo.com

### Animations
- Emotion animations by [Author Name] on LottieFiles
```

### При использовании CC-BY (требует атрибуции):
Обязательно указывать:
1. Имя автора
2. Название произведения
3. Ссылку на источник
4. Тип лицензии

---

## Контрольный список перед использованием

- [ ] Проверена лицензия (CC0 или CC-BY)
- [ ] Качество соответствует стандартам
- [ ] Размер оптимизирован
- [ ] Файл переименован по стандарту
- [ ] Добавлен в правильную папку
- [ ] Указан в content manifest
- [ ] Добавлен в credits (если нужно)

---

## Полезные инструменты

**Для поиска:**
- https://search.creativecommons.org/
- https://www.openverse.org/

**Для оптимизации:**
- TinyPNG - сжатие изображений
- Squoosh - WebP конвертация
- Audacity - редактирование аудио
- LottieFiles Editor - редактирование анимаций

**Для проверки лицензий:**
- Creative Commons License Checker
- EXIF data viewer (для изображений)

---

*Обновлено: 2025-11-03*
