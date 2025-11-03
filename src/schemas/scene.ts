import { z } from "zod";

export const SceneType = z.enum([
  "immersion",
  "visual-recall",
  "audio-choice",
  "echo-auditif",
  "micro-dialogue",
  "culture-minute",
  "erreur-vivante",
  "association-sensorielle"
]);

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

// Echo Auditif: слушаем без текста, угадываем контекст
export const EchoAuditifScene = base.extend({
  type: z.literal("echo-auditif"),
  audio: z.string().min(1),
  description: z.string().optional(),
  emotionTags: z.array(z.string()).optional(),
  contextOptions: z.array(z.object({
    text: z.string(),
    emotion: z.string().optional(),
    correct: z.boolean()
  })).min(2)
});

// Micro-Dialogue: живая ситуация с репликами
export const MicroDialogueScene = base.extend({
  type: z.literal("micro-dialogue"),
  situation: z.string(),
  image: z.string().optional(),
  audio: z.string().optional(),
  dialogue: z.array(z.object({
    speaker: z.string(),
    text: z.string(),
    translation: z.string().optional(),
    audio: z.string().optional()
  })),
  userPrompt: z.string(),
  responses: z.array(z.object({
    text: z.string(),
    translation: z.string().optional(),
    correct: z.boolean(),
    feedback: z.string().optional()
  }))
});

// Culture Minute: история слова, факт, этимология
export const CultureMinuteScene = base.extend({
  type: z.literal("culture-minute"),
  word: z.string(),
  etymology: z.string(),
  funFact: z.string(),
  image: z.string().optional(),
  audio: z.string().optional(),
  examples: z.array(z.object({
    text: z.string(),
    translation: z.string().optional()
  })).optional()
});

// Erreur Vivante: находим типичные ошибки
export const ErreurVivanteScene = base.extend({
  type: z.literal("erreur-vivante"),
  incorrectPhrase: z.string(),
  correctPhrase: z.string(),
  explanation: z.string(),
  translation: z.string().optional(),
  image: z.string().optional(),
  audio: z.string().optional(),
  similarMistakes: z.array(z.object({
    incorrect: z.string(),
    correct: z.string()
  })).optional()
});

// Association Sensorielle: связываем образы, запахи, звуки
export const AssociationSensorielleScene = base.extend({
  type: z.literal("association-sensorielle"),
  targetWord: z.string(),
  translation: z.string().optional(),
  sensoryElements: z.array(z.object({
    type: z.enum(["image", "sound", "color", "emotion"]),
    value: z.string(),
    label: z.string().optional()
  })),
  associations: z.array(z.object({
    word: z.string(),
    related: z.boolean()
  }))
});

export const AnyScene = z.discriminatedUnion("type", [
  ImmersionScene,
  VisualRecallScene,
  AudioChoiceScene,
  EchoAuditifScene,
  MicroDialogueScene,
  CultureMinuteScene,
  ErreurVivanteScene,
  AssociationSensorielleScene
]);

export type TImmersionScene = z.infer<typeof ImmersionScene>;
export type TVisualRecallScene = z.infer<typeof VisualRecallScene>;
export type TAudioChoiceScene = z.infer<typeof AudioChoiceScene>;
export type TEchoAuditifScene = z.infer<typeof EchoAuditifScene>;
export type TMicroDialogueScene = z.infer<typeof MicroDialogueScene>;
export type TCultureMinuteScene = z.infer<typeof CultureMinuteScene>;
export type TErreurVivanteScene = z.infer<typeof ErreurVivanteScene>;
export type TAssociationSensorielleScene = z.infer<typeof AssociationSensorielleScene>;
export type TAnyScene = z.infer<typeof AnyScene>;