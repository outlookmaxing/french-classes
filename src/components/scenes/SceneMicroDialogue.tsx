import { useState, useEffect } from 'react';
import { ArrowLeft, Volume2 } from 'lucide-react';
import { TMicroDialogueScene } from '../../schemas/scene';
import { Tooltip } from '../Tooltip';
import { usePrefetchNextScene } from '../../hooks/usePrefetchNextScene';
import { track } from '../../lib/analytics';
import { saveSceneProgress } from '../../hooks/useProgress';
import { useSplash } from '../../hooks/useSplash';
import WatercolorSplash from '../WatercolorSplash';

interface SceneMicroDialogueProps {
  scene: TMicroDialogueScene;
  onComplete: () => void;
  onBack: () => void;
  nextAssets?: string[];
}

export function SceneMicroDialogue({ scene, onComplete, onBack, nextAssets = [] }: SceneMicroDialogueProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedResponse, setSelectedResponse] = useState<number | null>(null);
  const { trigger: triggerSplash, currentSplash } = useSplash();

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
  };

  const handleResponse = async (index: number) => {
    const response = scene.responses[index];
    setSelectedResponse(index);

    track(response.correct ? 'answer_correct' : 'answer_wrong', {
      sceneId: scene.id,
      response: response.text
    });

    triggerSplash(response.correct ? 'success' : 'error');

    if (response.correct) {
      playAudio(response.text);

      try {
        await saveSceneProgress({ sceneId: scene.id, stars: 4 });
      } catch (error) {
        console.error('Failed to save progress:', error);
      }

      setTimeout(onComplete, 1500);
    } else {
      setTimeout(() => setSelectedResponse(null), 1500);
    }
  };

  useEffect(() => {
    if (currentStep < scene.dialogue.length) {
      const timer = setTimeout(() => {
        const line = scene.dialogue[currentStep];
        playAudio(line.text);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

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

      <div className="flex-1 flex flex-col items-center justify-center max-w-4xl mx-auto w-full">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-light text-gray-800 mb-4">
            {scene.title || 'Micro-dialogue'}
          </h2>
          <p className="text-lg text-gray-600 font-light">
            {scene.situation}
          </p>
        </div>

        {scene.image && (
          <div className="mb-8 rounded-3xl overflow-hidden shadow-2xl">
            <img
              src={scene.image}
              alt="Scene"
              className="max-w-2xl max-h-80 object-cover"
            />
          </div>
        )}

        <div className="space-y-6 w-full mb-12">
          {scene.dialogue.map((line, index) => (
            <div
              key={index}
              className={`flex ${line.speaker === 'user' ? 'justify-end' : 'justify-start'}`}
              style={{
                animation: index <= currentStep ? 'slideIn 0.5s ease-out' : 'none',
                opacity: index <= currentStep ? 1 : 0
              }}
            >
              <div
                className="max-w-lg p-6 rounded-3xl relative group"
                style={{
                  background: line.speaker === 'user'
                    ? 'linear-gradient(135deg, #F9E79F 0%, #F5B6B4 100%)'
                    : 'rgba(255, 255, 255, 0.7)',
                  backdropFilter: 'blur(10px)',
                  border: '2px solid rgba(255, 255, 255, 0.4)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
                }}
              >
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => playAudio(line.text)}
                    className="p-2 rounded-full hover:bg-white/50 transition-all"
                  >
                    <Volume2 className="w-5 h-5 text-gray-600" />
                  </button>
                  <div className="flex-1">
                    <p className="text-xl font-light text-gray-800 mb-2">
                      {line.text}
                    </p>
                    {line.translation && (
                      <p className="text-sm text-gray-600 opacity-70">
                        {line.translation}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {currentStep >= scene.dialogue.length - 1 && (
          <div className="w-full space-y-4 animate-fadeIn">
            <div className="text-center mb-6">
              <p className="text-xl text-gray-700 font-light flex items-center justify-center gap-2">
                {scene.userPrompt}
                <Tooltip
                  french={scene.userPrompt}
                  translation="Your turn to respond"
                />
              </p>
            </div>

            <div className="grid gap-4">
              {scene.responses.map((response, index) => {
                const isSelected = selectedResponse === index;
                const showFeedback = isSelected && !response.correct;

                return (
                  <div key={index} className="space-y-2">
                    <button
                      onClick={() => handleResponse(index)}
                      disabled={selectedResponse !== null}
                      className="w-full p-6 rounded-2xl text-left transition-all duration-300 hover:scale-102 disabled:cursor-not-allowed"
                      style={{
                        background: isSelected
                          ? response.correct
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
                      <p className="text-lg text-gray-800 font-light mb-2">
                        {response.text}
                      </p>
                      {response.translation && (
                        <p className="text-sm text-gray-600 opacity-70">
                          {response.translation}
                        </p>
                      )}
                    </button>

                    {showFeedback && response.feedback && (
                      <div className="px-4 py-2 rounded-xl bg-yellow-50 border border-yellow-200 animate-fadeIn">
                        <p className="text-sm text-gray-700">{response.feedback}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {currentStep < scene.dialogue.length - 1 && (
          <button
            onClick={() => setCurrentStep(prev => prev + 1)}
            className="px-8 py-4 rounded-full bg-gradient-to-r from-blue-200 to-purple-200 text-gray-800 font-light hover:shadow-lg transition-all duration-300"
          >
            Continuer
          </button>
        )}
      </div>

      {currentSplash && (
        <WatercolorSplash variant={currentSplash as 'success' | 'error' | 'transition'} />
      )}

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
