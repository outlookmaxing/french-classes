import { z } from "zod";

export const SceneType = z.enum(["immersion", "visual-recall", "audio-choice"]);

const base = z.object({
  id: z.string().min(1),
  type: SceneType,
  order: z.number().int().nonnegative(),
  lessonId: z.string().min(1),
  title: z.string().optional()
});

export const ImmersionScene = base.extend({
  type: z.literal("immersion"),
  media: z.object({
    lottie: z.string().min(1),
    audioSprite: z.string().min(1),
    cues: z.array(
      z.object({
        t: z.tuple([z.number().nonnegative(), z.number().nonnegative()]), // [start, end]
        text: z.string()
      })
    )
  }),
  hints: z.array(z.object({ icon: z.string(), hint: z.string() })).optional(),
  checks: z.array(z.object({ kind: z.string(), target: z.string() })).optional(),
  successFX: z.string().optional()
});

export const VisualRecallScene = base.extend({
  type: z.literal("visual-recall"),
  image: z.string().min(1),
  blocks: z.array(z.string().min(1)).min(1),
  answer: z.array(z.string().min(1)).min(1),
  tts: z.string().optional(),
  onCorrect: z.object({ fx: z.string().optional(), unlock: z.string().optional() }).optional(),
  onWrong: z.object({ fx: z.string().optional() }).optional()
});

export const AudioChoiceScene = base.extend({
  type: z.literal("audio-choice"),
  audio: z.string().min(1),
  options: z.array(
    z.object({
      image: z.string().min(1),
      label: z.string().min(1),
      correct: z.boolean()
    })
  ).min(2),
  onCorrect: z.object({ fx: z.string().optional() }).optional(),
  onWrong: z.object({ fx: z.string().optional() }).optional()
});

export const AnyScene = z.discriminatedUnion("type", [
  ImmersionScene, VisualRecallScene, AudioChoiceScene
]);

export type TImmersionScene = z.infer<typeof ImmersionScene>;
export type TVisualRecallScene = z.infer<typeof VisualRecallScene>;
export type TAudioChoiceScene = z.infer<typeof AudioChoiceScene>;
export type TAnyScene = z.infer<typeof AnyScene>;