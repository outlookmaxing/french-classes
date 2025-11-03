import { ArrowLeft } from 'lucide-react';
import { TAnyScene } from '../schemas/scene';
import { SceneImmersion } from './scenes/SceneImmersion';
import { SceneVisualRecall } from './scenes/SceneVisualRecall';
import { SceneAudioChoice } from './scenes/SceneAudioChoice';
import { SceneEchoAuditif } from './scenes/SceneEchoAuditif';
import { SceneMicroDialogue } from './scenes/SceneMicroDialogue';
import { SceneCultureMinute } from './scenes/SceneCultureMinute';

interface SceneHostProps {
  scene: TAnyScene;
  onComplete: () => void;
  onBack: () => void;
  nextAssets?: string[];
}

export function SceneHost({ scene, onComplete, onBack, nextAssets = [] }: SceneHostProps) {
  // Route to specific scene component based on type
  switch (scene.type) {
    case 'immersion':
      return (
        <SceneImmersion
          scene={scene}
          onComplete={onComplete}
          onBack={onBack}
          nextAssets={nextAssets}
        />
      );

    case 'visual-recall':
      return (
        <SceneVisualRecall
          scene={scene}
          onComplete={onComplete}
          onBack={onBack}
          nextAssets={nextAssets}
        />
      );

    case 'audio-choice':
      return (
        <SceneAudioChoice
          scene={scene}
          onComplete={onComplete}
          onBack={onBack}
          nextAssets={nextAssets}
        />
      );

    case 'echo-auditif':
      return (
        <SceneEchoAuditif
          scene={scene}
          onComplete={onComplete}
          onBack={onBack}
          nextAssets={nextAssets}
        />
      );

    case 'micro-dialogue':
      return (
        <SceneMicroDialogue
          scene={scene}
          onComplete={onComplete}
          onBack={onBack}
          nextAssets={nextAssets}
        />
      );

    case 'culture-minute':
      return (
        <SceneCultureMinute
          scene={scene}
          onComplete={onComplete}
          onBack={onBack}
          nextAssets={nextAssets}
        />
      );

    default:
      // Fallback for unknown scene types
      const fallbackScene = scene as any; // Type assertion for fallback
      return (
        <div className="min-h-screen w-full flex flex-col p-8">
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-gray-700 hover:bg-white/50 transition-all duration-300"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-light">Retour</span>
            </button>
          </div>

          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-4xl font-light text-gray-800 mb-8">
                {fallbackScene.title || 'Scene'}
              </h2>
              <p className="text-gray-600">Scene type "{fallbackScene.type}" not implemented yet.</p>
            </div>
          </div>
        </div>
      );
  }
}