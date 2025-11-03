import { useState, useEffect } from 'react';
import { ArrowLeft, Volume2, Headphones } from 'lucide-react';
import { TEchoAuditifScene } from '../../schemas/scene';
import { usePrefetchNextScene } from '../../hooks/usePrefetchNextScene';
import { track } from '../../lib/analytics';
import { saveSceneProgress } from '../../hooks/useProgress';
import { useSplash } from '../../hooks/useSplash';
import WatercolorSplash from '../WatercolorSplash';

interface SceneEchoAuditifProps {
  scene: TEchoAuditifScene;
  onComplete: () => void;
  onBack: () => void;
  nextAssets?: string[];
}

export function SceneEchoAuditif({ scene, onComplete, onBack, nextAssets = [] }: SceneEchoAuditifProps) {
  const [hasPlayed, setHasPlayed] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const { trigger: triggerSplash, currentSplash } = useSplash();

  usePrefetchNextScene(nextAssets);

  useEffect(() => {
    track('scene_opened', { sceneId: scene.id, sceneType: scene.type });
  }, [scene.id]);

  const playAudio = () => {
    if (scene.audio) {
      const audio = new Audio(scene.audio);
      audio.play();
      setHasPlayed(true);
      track('audio_play', { sceneId: scene.id, type: 'ambiance' });
    }
  };

  const handleOptionClick = async (index: number) => {
    const option = scene.contextOptions[index];
    setSelectedOption(index);

    track(option.correct ? 'answer_correct' : 'answer_wrong', {
      sceneId: scene.id,
      option: option.text
    });

    triggerSplash(option.correct ? 'success' : 'error');

    if (option.correct) {
      try {
        await saveSceneProgress({ sceneId: scene.id, stars: 4 });
      } catch (error) {
        console.error('Failed to save progress:', error);
      }

      setTimeout(onComplete, 1500);
    } else {
      setTimeout(() => setSelectedOption(null), 1500);
    }
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
      </div>

      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-6">
            <Headphones className="w-12 h-12 text-blue-500" />
            <h2 className="text-4xl font-light text-gray-800">
              {scene.title || 'Echo Auditif'}
            </h2>
          </div>

          {scene.description && (
            <p className="text-lg text-gray-600 font-light max-w-2xl">
              {scene.description}
            </p>
          )}
        </div>

        <div className="mb-12">
          <button
            onClick={playAudio}
            className="relative group"
            disabled={!scene.audio}
          >
            <div
              className="w-48 h-48 rounded-full flex items-center justify-center transition-all duration-500"
              style={{
                background: hasPlayed
                  ? 'linear-gradient(135deg, #A7D8F0 0%, #F5B6B4 100%)'
                  : 'linear-gradient(135deg, #E0E0E0 0%, #C0C0C0 100%)',
                boxShadow: hasPlayed
                  ? '0 20px 60px rgba(167, 216, 240, 0.4)'
                  : '0 10px 30px rgba(0, 0, 0, 0.1)',
                transform: hasPlayed ? 'scale(1)' : 'scale(0.95)',
              }}
            >
              <Volume2
                className="w-20 h-20 text-white"
                style={{
                  animation: hasPlayed ? 'pulse 2s ease-in-out infinite' : 'none'
                }}
              />
            </div>

            {!hasPlayed && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-white text-lg font-light animate-pulse">
                  Ecouter
                </span>
              </div>
            )}
          </button>
        </div>

        {hasPlayed && (
          <div className="w-full max-w-2xl space-y-4 animate-fadeIn">
            <div className="text-center mb-8">
              <p className="text-xl text-gray-700 font-light">
                Que percevez-vous?
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Choisissez l'atmosphere qui correspond
              </p>
            </div>

            <div className="grid gap-4">
              {scene.contextOptions.map((option, index) => {
                const isSelected = selectedOption === index;

                return (
                  <button
                    key={index}
                    onClick={() => handleOptionClick(index)}
                    disabled={selectedOption !== null}
                    className="p-6 rounded-2xl text-left transition-all duration-300 hover:scale-102 disabled:cursor-not-allowed"
                    style={{
                      background: isSelected
                        ? option.correct
                          ? 'linear-gradient(135deg, #C5E3C8 0%, #7FB069 100%)'
                          : 'linear-gradient(135deg, #F8D7DA 0%, #E89B98 100%)'
                        : 'rgba(255, 255, 255, 0.6)',
                      backdropFilter: 'blur(10px)',
                      border: '2px solid rgba(255, 255, 255, 0.4)',
                      boxShadow: isSelected
                        ? '0 8px 24px rgba(0, 0, 0, 0.1)'
                        : '0 4px 12px rgba(0, 0, 0, 0.05)'
                    }}
                  >
                    <div className="flex items-center gap-4">
                      {option.emotion && (
                        <span className="text-4xl">{getEmotionEmoji(option.emotion)}</span>
                      )}
                      <p className="text-xl text-gray-800 font-light flex-1">
                        {option.text}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {scene.emotionTags && scene.emotionTags.length > 0 && (
              <div className="mt-8 text-center">
                <p className="text-sm text-gray-500 mb-3">Emotions pressenties:</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {scene.emotionTags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-4 py-2 rounded-full text-sm font-light"
                      style={{
                        background: 'rgba(255, 255, 255, 0.5)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.3)'
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {currentSplash && (
        <WatercolorSplash variant={currentSplash as 'success' | 'error' | 'transition'} />
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.8; }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

function getEmotionEmoji(emotion: string): string {
  const emojiMap: Record<string, string> = {
    'calme': '😌',
    'joyeux': '😊',
    'triste': '😢',
    'fatigue': '😴',
    'stress': '😰',
    'chaleur': '☀️',
    'froid': '❄️',
    'pluie': '🌧️',
    'vent': '💨',
    'matin': '🌅',
    'soir': '🌆',
    'nuit': '🌙'
  };

  return emojiMap[emotion.toLowerCase()] || '✨';
}
