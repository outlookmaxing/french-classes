import { useState, useEffect } from 'react';
import { ArrowLeft, Volume2, BookOpen } from 'lucide-react';
import { TCultureMinuteScene } from '../../schemas/scene';
import { usePrefetchNextScene } from '../../hooks/usePrefetchNextScene';
import { track } from '../../lib/analytics';
import { saveSceneProgress } from '../../hooks/useProgress';

interface SceneCultureMinuteProps {
  scene: TCultureMinuteScene;
  onComplete: () => void;
  onBack: () => void;
  nextAssets?: string[];
}

export function SceneCultureMinute({ scene, onComplete, onBack, nextAssets = [] }: SceneCultureMinuteProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  usePrefetchNextScene(nextAssets);

  useEffect(() => {
    track('scene_opened', { sceneId: scene.id, sceneType: scene.type });
  }, [scene.id]);

  const playAudio = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'fr-FR';
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
    track('audio_play', { sceneId: scene.id, type: 'word', text });
  };

  const handleComplete = async () => {
    track('culture_card_completed', { sceneId: scene.id, word: scene.word });

    try {
      await saveSceneProgress({ sceneId: scene.id, stars: 5 });
    } catch (error) {
      console.error('Failed to save progress:', error);
    }

    setTimeout(onComplete, 500);
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

      <div className="flex-1 flex items-center justify-center p-4">
        <div
          className="relative max-w-2xl w-full"
          style={{ perspective: '1000px' }}
        >
          <div
            className={`relative w-full transition-transform duration-700`}
            style={{
              transformStyle: 'preserve-3d',
              transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
            }}
          >
            {/* Front side */}
            <div
              className="w-full p-12 rounded-3xl shadow-2xl"
              style={{
                background: 'linear-gradient(135deg, #F5F3EF 0%, #EAE6E1 100%)',
                backfaceVisibility: 'hidden',
                border: '3px solid rgba(255, 255, 255, 0.5)',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1), inset 0 0 40px rgba(255, 255, 255, 0.5)'
              }}
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="p-4 rounded-full bg-gradient-to-br from-purple-200 to-pink-200">
                  <BookOpen className="w-8 h-8 text-purple-700" />
                </div>
                <h3 className="text-3xl font-light text-gray-800">Culture Minute</h3>
              </div>

              {scene.image && (
                <div className="mb-8 rounded-2xl overflow-hidden">
                  <img
                    src={scene.image}
                    alt={scene.word}
                    className="w-full h-64 object-cover"
                  />
                </div>
              )}

              <div className="space-y-8">
                <div className="text-center">
                  <button
                    onClick={() => playAudio(scene.word)}
                    className="inline-flex items-center gap-3 text-5xl font-light text-gray-800 hover:text-purple-700 transition-colors"
                  >
                    {scene.word}
                    <Volume2 className="w-8 h-8 text-gray-400 hover:text-purple-500" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="p-6 rounded-2xl bg-white/50">
                    <h4 className="text-sm uppercase tracking-wide text-purple-600 mb-3 font-medium">
                      Etymologie
                    </h4>
                    <p className="text-gray-700 font-light leading-relaxed">
                      {scene.etymology}
                    </p>
                  </div>

                  <div className="p-6 rounded-2xl bg-white/50">
                    <h4 className="text-sm uppercase tracking-wide text-pink-600 mb-3 font-medium">
                      Le saviez-vous?
                    </h4>
                    <p className="text-gray-700 font-light leading-relaxed">
                      {scene.funFact}
                    </p>
                  </div>

                  {scene.examples && scene.examples.length > 0 && (
                    <div className="p-6 rounded-2xl bg-white/50">
                      <h4 className="text-sm uppercase tracking-wide text-blue-600 mb-3 font-medium">
                        Exemples
                      </h4>
                      <div className="space-y-3">
                        {scene.examples.map((example, i) => (
                          <div key={i} className="flex items-start gap-3">
                            <button
                              onClick={() => playAudio(example.text)}
                              className="mt-1 p-1 rounded-full hover:bg-white/50 transition-all"
                            >
                              <Volume2 className="w-4 h-4 text-gray-500" />
                            </button>
                            <div>
                              <p className="text-gray-800 font-light italic">{example.text}</p>
                              {example.translation && (
                                <p className="text-gray-500 text-sm mt-1">{example.translation}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setIsFlipped(!isFlipped)}
                  className="w-full py-4 px-6 rounded-full bg-gradient-to-r from-purple-200 to-pink-200 text-gray-800 font-light hover:shadow-lg transition-all duration-300"
                >
                  {isFlipped ? 'Voir devant' : 'Voir derriere'}
                </button>
              </div>
            </div>

            {/* Back side */}
            <div
              className="absolute inset-0 w-full p-12 rounded-3xl shadow-2xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #D8C5E6 0%, #C5E3C8 100%)',
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
                border: '3px solid rgba(255, 255, 255, 0.5)',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1), inset 0 0 40px rgba(255, 255, 255, 0.5)'
              }}
            >
              <div className="text-center space-y-8">
                <p className="text-3xl text-gray-700 font-light italic">
                  "Chaque mot est une histoire,<br />
                  chaque phrase un voyage"
                </p>

                <button
                  onClick={handleComplete}
                  className="px-8 py-4 rounded-full bg-white text-gray-800 font-light hover:shadow-lg transition-all duration-300"
                >
                  Compris! Continuer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
