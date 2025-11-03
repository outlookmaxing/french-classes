import { useState, useEffect } from 'react';
import { ArrowLeft, Volume2, Lightbulb } from 'lucide-react';
import { TAudioChoiceScene } from '../../schemas/scene';
import { usePrefetchNextScene } from '../../hooks/usePrefetchNextScene';
import { track } from '../../lib/analytics';
import { saveSceneProgress } from '../../hooks/useProgress';
import { useSplash } from '../../hooks/useSplash';
import WatercolorSplash from '../WatercolorSplash';

interface SceneAudioChoiceProps {
  scene: TAudioChoiceScene;
  onComplete: () => void;
  onBack: () => void;
  nextAssets?: string[];
}

export function SceneAudioChoice({ scene, onComplete, onBack, nextAssets = [] }: SceneAudioChoiceProps) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasPlayedAudio, setHasPlayedAudio] = useState(false);
  const { trigger: triggerSplash, currentSplash } = useSplash();

  // Prefetch next scene assets
  usePrefetchNextScene(nextAssets);

  // Analytics tracking
  useEffect(() => {
    track('scene_opened', { sceneId: scene.id, sceneType: scene.type });
  }, [scene.id]);

  const playAudio = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance('Listen and choose the correct image');
      utterance.lang = 'fr-FR';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
    track('audio_play', { sceneId: scene.id, type: 'instruction' });
    setHasPlayedAudio(true);
  };

  const handleOptionClick = (optionIndex: number) => {
    setSelectedOption(optionIndex);
    const isCorrect = scene.options[optionIndex].correct;

    track(isCorrect ? 'answer_correct' : 'answer_wrong', {
      sceneId: scene.id,
      answer: optionIndex,
      correctAnswer: scene.options.findIndex(opt => opt.correct)
    });

    // Trigger appropriate splash
    triggerSplash(isCorrect ? 'success' : 'error');

    // Save progress
    saveSceneProgress({
      sceneId: scene.id,
      stars: isCorrect ? 3 : 1
    }).catch(error => console.error('Failed to save progress:', error));

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
            onClick={playAudio}
            className="p-3 rounded-full bg-white/50 hover:bg-white/70 transition-all duration-300 backdrop-blur-sm"
          >
            <Volume2 className={`w-5 h-5 text-gray-700 ${hasPlayedAudio ? 'text-blue-500' : ''}`} />
          </button>

          <button
            onClick={() => {}}
            className="p-3 rounded-full bg-white/50 hover:bg-white/70 transition-all duration-300 backdrop-blur-sm"
          >
            <Lightbulb className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center">
        <h2 className="text-4xl font-light text-gray-800 mb-12 text-center">
          {scene.title || 'Audio Choice'}
        </h2>

        <div className="mb-8 text-center">
          <p className="text-gray-600 mb-4">Listen to the audio and choose the matching image</p>
          {!hasPlayedAudio && (
            <button
              onClick={playAudio}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Play Audio
            </button>
          )}
        </div>

        {/* Options grid */}
        <div className="grid grid-cols-2 gap-6 max-w-lg mx-auto" role="group" aria-label="Select the correct image">
          {scene.options.map((option, index) => {
            const isSelected = selectedOption === index;
            const isCorrectOption = option.correct;
            const showResult = selectedOption !== null;

            let bgColor = 'rgba(255, 255, 255, 0.5)';
            if (showResult) {
              if (isSelected && isCorrectOption) {
                bgColor = '#D4EDDA'; // Success green
              } else if (isSelected && !isCorrectOption) {
                bgColor = '#F8D7DA'; // Error red
              } else if (!isSelected && isCorrectOption) {
                bgColor = '#FFF3CD'; // Correct option highlight
              }
            } else if (isSelected) {
              bgColor = '#E3F2FD'; // Selection blue
            }

            return (
              <button
                key={index}
                onClick={() => !showResult && handleOptionClick(index)}
                disabled={showResult}
                className={`aspect-square rounded-xl transition-all duration-300 ${
                  !showResult ? 'hover:scale-105 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2' : ''
                }`}
                style={{
                  background: bgColor,
                  backdropFilter: 'blur(10px)',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  boxShadow: isSelected ? '0 4px 12px rgba(0, 0, 0, 0.15)' : '0 2px 6px rgba(0, 0, 0, 0.05)'
                }}
                aria-label={`Option ${index + 1}: ${option.label}`}
                role="button"
                tabIndex={0}
              >
                <div className="w-full h-full flex items-center justify-center">
                  {option.image ? (
                    <img
                      src={option.image}
                      alt={option.label}
                      className="max-w-full max-h-full object-contain rounded-lg"
                    />
                  ) : (
                    <div className="text-4xl">🖼️</div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {selectedOption !== null && (
          <div className={`text-center text-2xl font-light mt-8 ${
            scene.options[selectedOption].correct ? 'text-green-600' : 'text-red-600'
          }`}>
            {scene.options[selectedOption].correct ? '✓ Correct!' : '✗ Try again'}
          </div>
        )}

        {/* Watercolor Splash Overlay */}
        {currentSplash && (
          <WatercolorSplash variant={currentSplash as 'success' | 'error' | 'transition'} />
        )}
      </div>

      <style>{`
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