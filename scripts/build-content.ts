/* eslint-disable no-console */
import fs from "fs";
import path from "path";
import { createHash } from "crypto";
import { fileURLToPath } from "url";
import { AnyScene } from "../src/schemas/scene.js";
import { z } from "zod";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONTENT_DIR = path.resolve(__dirname, "../content");
const PUBLIC_DIR = path.resolve(__dirname, "../public");
const MANIFEST_OUT = path.join(PUBLIC_DIR, "content-manifest.json");

const WorldMeta = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  order: z.number().int(),
  level: z.string().optional(),
  cover: z.string().optional()
});

const LessonMeta = z.object({
  id: z.string(),
  worldId: z.string(),
  slug: z.string(),
  title: z.string(),
  order: z.number().int(),
  isCore: z.boolean().optional().default(false),
  difficulty: z.number().int().optional().default(1),
  cover: z.string().optional()
});

type World = z.infer<typeof WorldMeta>;
type Lesson = z.infer<typeof LessonMeta>;

function sha256File(absPath: string) {
  const buf = fs.readFileSync(absPath);
  return createHash("sha256").update(buf).digest("hex");
}

function sha256String(s: string) {
  return createHash("sha256").update(s).digest("hex");
}

function readJSON<T = any>(absPath: string): T {
  const raw = fs.readFileSync(absPath, "utf-8");
  return JSON.parse(raw) as T;
}

function exists(p: string) { return fs.existsSync(p); }

function collectFiles(dir: string, ext: RegExp) {
  const out: string[] = [];
  (function walk(d: string) {
    for (const name of fs.readdirSync(d)) {
      const p = path.join(d, name);
      const st = fs.statSync(p);
      if (st.isDirectory()) walk(p);
      else if (ext.test(name)) out.push(p);
    }
  })(dir);
  return out;
}

function rel(p: string) {
  // делаем путь web-относительным от public root (предполагаем /public как deploy root)
  // если ассеты лежат в /public/assets — оставляем /assets/…
  const idx = p.split(path.sep).lastIndexOf("public");
  if (idx >= 0) {
    const parts = p.split(path.sep).slice(idx + 1);
    return "/" + parts.join("/");
  }
  // если файл внутри /content с ссылкой вида /assets/... — оставляем как есть
  return p;
}

async function main() {
  if (!exists(CONTENT_DIR)) {
    console.error("No /content directory found");
    process.exit(1);
  }
  if (!exists(PUBLIC_DIR)) fs.mkdirSync(PUBLIC_DIR, { recursive: true });

  // --- Worlds (MDX frontmatter в JSON рядом, для MVP допускаем JSON-метаданные)
  const worldsDir = path.join(CONTENT_DIR, "worlds");
  const lessonsDir = path.join(CONTENT_DIR, "lessons");

  const worlds: World[] = [];
  const lessons: Lesson[] = [];
  const scenes: any[] = [];

  // worlds: ищем *.json (или вы потом замените на разбор MDX фронтматтера)
  if (exists(worldsDir)) {
    for (const file of collectFiles(worldsDir, /\.json$/)) {
      const meta = WorldMeta.parse(readJSON(file));
      worlds.push(meta);
    }
  }

  // lessons + scenes
  if (exists(lessonsDir)) {
    for (const lessonFolder of fs.readdirSync(lessonsDir)) {
      const lessonPath = path.join(lessonsDir, lessonFolder);
      if (!fs.statSync(lessonPath).isDirectory()) continue;

      const lessonMetaPath = path.join(lessonPath, "lesson.json");
      if (!exists(lessonMetaPath)) {
        console.error(`Missing lesson.json in ${lessonPath}`);
        process.exit(1);
      }
      const meta = LessonMeta.parse(readJSON(lessonMetaPath));
      lessons.push(meta);

      const scenesDir = path.join(lessonPath, "scenes");
      if (!exists(scenesDir)) {
        console.warn(`No scenes/ in ${lessonPath}`);
        continue;
      }

      for (const sceneFile of collectFiles(scenesDir, /\.json$/)) {
        const raw = fs.readFileSync(sceneFile, "utf-8");
        let json: any;
        try { json = JSON.parse(raw); } catch (e) {
          console.error(`Invalid JSON: ${sceneFile}`);
          throw e;
        }
        // автоподстановка lessonId если не указан
        if (!json.lessonId) json.lessonId = meta.id;

        const scene = AnyScene.parse(json);

        // соберём список ассетов для кэша
        const assets = new Set<string>();
        if (scene.type === "immersion") {
          if (scene.media?.lottie) assets.add(scene.media.lottie);
          if (scene.media?.audioSprite) assets.add(scene.media.audioSprite);
        }
        if (scene.type === "visual-recall") {
          assets.add(scene.image);
        }
        if (scene.type === "audio-choice") {
          assets.add(scene.audio);
          scene.options.forEach((o: any) => assets.add(o.image));
        }

        const contentHash = sha256String(raw);
        scenes.push({
          id: scene.id,
          type: scene.type,
          lessonId: scene.lessonId,
          order: scene.order,
          hash: `sha256:${contentHash}`,
          assets: [...assets]
        });
      }
    }
  }

  // доп. хеш ассетов (если ассеты лежат в /public)
  const assetHashes: Record<string, string> = {};
  for (const scene of scenes) {
    for (const a of scene.assets) {
      const abs = path.resolve(__dirname, "..", "public", a.replace(/^\//, ""));
      if (exists(abs)) {
        assetHashes[a] = `sha256:${sha256File(abs)}`;
      } else {
        // ассет может быть внешним CDN или ещё не положен — предупреждаем
        console.warn(`Asset not found in /public: ${a}`);
      }
    }
  }

  const manifest = {
    version: new Date().toISOString(),
    worlds: worlds.sort((a, b) => a.order - b.order),
    lessons: lessons.sort((a, b) => a.order - b.order),
    scenes: scenes.sort((a, b) => a.order - b.order),
    assets: assetHashes
  };

  fs.writeFileSync(MANIFEST_OUT, JSON.stringify(manifest, null, 2), "utf-8");
  console.log(`Manifest written: ${rel(MANIFEST_OUT)}`);
}

main().catch((e) => { console.error(e); process.exit(1); });