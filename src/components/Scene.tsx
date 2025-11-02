import { useState, useEffect } from 'react';
import { ArrowLeft, Volume2, Lightbulb } from 'lucide-react';
import type { Scene as SceneType } from '../lib/supabase';
import { track } from '../lib/analytics';

interface SceneProps {
  scene: SceneType;
  onComplete: () => void;
  onBack: () => void;
}

export function Scene({ scene, onComplete, onBack }: SceneProps) {
  const [showHint, setShowHint] = useState(false);
  const [userResponse, setUserResponse] = useState<string | null>(null);

  useEffect(() => {
    track('scene_opened', { sceneId: scene.id, sceneType: scene.type });
  }, [scene.id, scene.type]);

  const playAudio = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'fr-FR';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const renderSceneContent = () => {
    switch (scene.type) {
      case 'visual_immersion':
        return (
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

            <div className="flex flex-wrap justify-center gap-4 max-w-2xl mx-auto">
              {['content', 'fatigué', 'triste', 'heureux'].map((emotion) => (
                <button
                  key={emotion}
                  onClick={async () => {
                    setUserResponse(emotion);
                    playAudio(`Je suis ${emotion}`);
        
                    track('answer_correct', { sceneId: scene.id, answer: emotion });
        
                    // Save progress
                    try {
                      await import('../hooks/useProgress').then(({ saveSceneProgress }) =>
                        saveSceneProgress({ sceneId: scene.id, stars: 3 })
                      );
                    } catch (error) {
                      console.error('Failed to save progress:', error);
                    }
        
                    setTimeout(onComplete, 1500);
                  }}
                  className="px-8 py-4 rounded-full text-lg font-light transition-all duration-300 hover:scale-105"
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
                >
                  {emotion}
                </button>
              ))}
            </div>
          </div>
        );

      default:
        return <div className="text-center text-gray-600">Scene type: {scene.type}</div>;
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

        <div className="flex gap-3">
          <button
            onClick={() => {
              playAudio(scene.title_fr);
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
          {scene.title_fr}
        </h2>

        {showHint && (
          <div
            className="mb-8 p-6 rounded-3xl max-w-md mx-auto animate-fadeIn"
            style={{
              background: 'rgba(255, 255, 255, 0.6)',
              backdropFilter: 'blur(10px)',
              border: '2px solid rgba(255, 255, 255, 0.4)'
            }}
          >
            <p className="text-gray-700 font-light text-center">
              Выберите эмоцию, которую вы чувствуете. Не думайте о переводе — просто представьте образ.
            </p>
          </div>
        )}

        {renderSceneContent()}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes breathe {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.02); opacity: 0.95; }
        }
      `}</style>
    </div>
  );
}
