import { useState, useEffect } from 'react';
import { ArrowLeft, Volume2, Lightbulb } from 'lucide-react';
import { TImmersionScene } from '../../schemas/scene';
import { usePrefetchNextScene } from '../../hooks/usePrefetchNextScene';
import { createSprite } from '../../lib/audioSprite';
import { track } from '../../lib/analytics';
import { saveSceneProgress } from '../../hooks/useProgress';
import { useSplash } from '../../hooks/useSplash';
import WatercolorSplash from '../WatercolorSplash';

interface SceneImmersionProps {
  scene: TImmersionScene;
  onComplete: () => void;
  onBack: () => void;
  nextAssets?: string[];
}

export function SceneImmersion({ scene, onComplete, onBack, nextAssets = [] }: SceneImmersionProps) {
  const [showHint, setShowHint] = useState(false);
  const [userResponse, setUserResponse] = useState<string | null>(null);
  const { trigger: triggerSplash, currentSplash } = useSplash();

  // Prefetch next scene assets
  usePrefetchNextScene(nextAssets);

  // Analytics tracking
  useEffect(() => {
    track('scene_opened', { sceneId: scene.id, sceneType: scene.type });
  }, [scene.id]);

  // Audio sprite for scene
  const audioSprite = scene.media.audioSprite
    ? createSprite(scene.media.audioSprite, Object.fromEntries(
        scene.media.cues.map(cue => [cue.text, cue.t])
      ))
    : null;

  const playAudio = (text: string) => {
    if (audioSprite) {
      audioSprite.play(text);
      track('audio_play', { sceneId: scene.id, type: 'scene', cue: text });
    } else if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'fr-FR';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleAnswer = async (emotion: string) => {
    setUserResponse(emotion);
    playAudio(`Je suis ${emotion}`);

    // Trigger success splash
    triggerSplash('success');

    track('answer_correct', { sceneId: scene.id, answer: emotion });

    // Save progress
    try {
      await saveSceneProgress({ sceneId: scene.id, stars: 3 });
    } catch (error) {
      console.error('Failed to save progress:', error);
    }

    setTimeout(onComplete, 1500);
  };

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

        <div className="flex gap-3">
          <button
            onClick={() => {
              playAudio(scene.title || 'Titre');
              track('audio_play', { sceneId: scene.id, type: 'title' });
            }}
            className="p-3 rounded-full bg-white/50 hover:bg-white/70 transition-all duration-300 backdrop-blur-sm"
          >
            <Volume2 className="w-5 h-5 text-gray-700" />
          </button>

          <button
            onClick={() => setShowHint(!showHint)}
            className="p-3 rounded-full bg-white/50 hover:bg-white/70 transition-all duration-300 backdrop-blur-sm"
          >
            <Lightbulb className={`w-5 h-5 ${showHint ? 'text-yellow-500' : 'text-gray-700'}`} />
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center">
        <h2 className="text-4xl font-light text-gray-800 mb-12 text-center">
          {scene.title}
        </h2>

        {showHint && scene.hints && (
          <div className="mb-8 p-6 rounded-3xl max-w-md mx-auto animate-fadeIn"
               style={{
                 background: 'rgba(255, 255, 255, 0.6)',
                 backdropFilter: 'blur(10px)',
                 border: '2px solid rgba(255, 255, 255, 0.4)'
               }}>
            {scene.hints.map((hint, i) => (
              <p key={i} className="text-gray-700 font-light text-center mb-2">
                {hint.icon} {hint.hint}
              </p>
            ))}
          </div>
        )}

        <div className="space-y-8">
          <div className="relative aspect-video w-full max-w-2xl mx-auto rounded-3xl overflow-hidden shadow-2xl">
            <div
              className="absolute inset-0 flex items-center justify-center text-white text-2xl font-light"
              style={{
                background: 'linear-gradient(135deg, #A7D8F0 0%, #F5B6B4 100%)',
                animation: 'breathe 4s ease-in-out infinite'
              }}
            >
              <div className="text-center space-y-4 p-8">
                <div className="text-6xl">🪞</div>
                <p className="text-3xl">Je suis...</p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4 max-w-2xl mx-auto" role="group" aria-label="Select your current emotion">
            {['content', 'fatigué', 'triste', 'heureux'].map((emotion) => (
              <button
                key={emotion}
                onClick={() => handleAnswer(emotion)}
                className="px-8 py-4 rounded-full text-lg font-light transition-all duration-300 hover:scale-105 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                style={{
                  background: userResponse === emotion
                    ? 'linear-gradient(135deg, #F9E79F 0%, #F5B6B4 100%)'
                    : 'rgba(255, 255, 255, 0.5)',
                  backdropFilter: 'blur(10px)',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  boxShadow: userResponse === emotion
                    ? '0 8px 24px rgba(249, 231, 159, 0.4)'
                    : '0 4px 12px rgba(0, 0, 0, 0.05)'
                }}
                aria-label={`Select emotion: ${emotion}`}
                role="button"
                tabIndex={0}
              >
                {emotion}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Watercolor Splash Overlay */}
      {currentSplash && (
        <WatercolorSplash variant={currentSplash as 'success' | 'error' | 'transition'} />
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes breathe {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.02); opacity: 0.95; }
        }

        @keyframes fade {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .animate-fade {
          animation: fade 0.85s ease-in-out;
        }
      `}</style>
    </div>
  );
}