import { useState, useEffect } from 'react';
import { ArrowLeft, Volume2, Lightbulb } from 'lucide-react';
import { TVisualRecallScene } from '../../schemas/scene';
import { usePrefetchNextScene } from '../../hooks/usePrefetchNextScene';
import { track } from '../../lib/analytics';
import { saveSceneProgress } from '../../hooks/useProgress';
import { useSplash } from '../../hooks/useSplash';
import WatercolorSplash from '../WatercolorSplash';

interface SceneVisualRecallProps {
  scene: TVisualRecallScene;
  onComplete: () => void;
  onBack: () => void;
  nextAssets?: string[];
}

export function SceneVisualRecall({ scene, onComplete, onBack, nextAssets = [] }: SceneVisualRecallProps) {
  const [showHint, setShowHint] = useState(false);
  const [selectedBlocks, setSelectedBlocks] = useState<string[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const { trigger: triggerSplash, currentSplash } = useSplash();

  // Prefetch next scene assets
  usePrefetchNextScene(nextAssets);

  // Analytics tracking
  useEffect(() => {
    track('scene_opened', { sceneId: scene.id, sceneType: scene.type });
  }, [scene.id]);

  const playAudio = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'fr-FR';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
    track('audio_play', { sceneId: scene.id, type: 'tts', text });
  };

  const handleBlockClick = (block: string) => {
    if (selectedBlocks.includes(block)) {
      setSelectedBlocks(prev => prev.filter(b => b !== block));
    } else if (selectedBlocks.length < scene.answer.length) {
      const newSelection = [...selectedBlocks, block];
      setSelectedBlocks(newSelection);

      // Check if complete answer
      if (newSelection.length === scene.answer.length) {
        const correct = newSelection.every(block => scene.answer.includes(block)) &&
                       scene.answer.every(ans => newSelection.includes(ans));
        setIsCorrect(correct);

        // Trigger appropriate splash
        triggerSplash(correct ? 'success' : 'error');

        track(correct ? 'answer_correct' : 'answer_wrong', {
          sceneId: scene.id,
          answer: newSelection,
          correct: scene.answer
        });

        // Save progress
        saveSceneProgress({
          sceneId: scene.id,
          stars: correct ? 3 : 1
        }).catch(error => console.error('Failed to save progress:', error));

        setTimeout(onComplete, 1500);
      }
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
          {scene.tts && (
            <button
              onClick={() => playAudio(scene.tts || 'Audio')}
              className="p-3 rounded-full bg-white/50 hover:bg-white/70 transition-all duration-300 backdrop-blur-sm"
            >
              <Volume2 className="w-5 h-5 text-gray-700" />
            </button>
          )}

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
          {scene.title || 'Visual Recall'}
        </h2>

        {showHint && (
          <div className="mb-8 p-6 rounded-3xl max-w-md mx-auto animate-fadeIn"
               style={{
                 background: 'rgba(255, 255, 255, 0.6)',
                 backdropFilter: 'blur(10px)',
                 border: '2px solid rgba(255, 255, 255, 0.4)'
               }}>
            <p className="text-gray-700 font-light text-center">
              Select the correct blocks to form the word or phrase.
            </p>
          </div>
        )}

        {/* Image display */}
        {scene.image && (
          <div className="mb-8">
            <img
              src={scene.image}
              alt="Visual recall reference"
              className="max-w-md max-h-64 object-contain rounded-2xl shadow-lg"
            />
          </div>
        )}

        {/* Answer blocks */}
        <div className="flex flex-wrap justify-center gap-4 max-w-2xl mx-auto mb-8" role="group" aria-label="Select word blocks to form the answer">
          {scene.blocks.map((block, index) => {
            const isSelected = selectedBlocks.includes(block);
            const isInAnswer = scene.answer.includes(block);
            const showResult = isCorrect !== null;

            let bgColor = 'rgba(255, 255, 255, 0.5)';
            if (showResult) {
              if (isSelected && isInAnswer) {
                bgColor = '#D4EDDA'; // Success green
              } else if (isSelected && !isInAnswer) {
                bgColor = '#F8D7DA'; // Error red
              } else if (!isSelected && isInAnswer) {
                bgColor = '#FFF3CD'; // Missing yellow
              }
            } else if (isSelected) {
              bgColor = '#E3F2FD'; // Selection blue
            }

            return (
              <button
                key={index}
                onClick={() => !showResult && handleBlockClick(block)}
                disabled={showResult}
                className={`px-6 py-3 rounded-xl text-lg font-light transition-all duration-300 ${
                  !showResult ? 'hover:scale-105 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2' : ''
                }`}
                style={{
                  background: bgColor,
                  backdropFilter: 'blur(10px)',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  boxShadow: isSelected ? '0 4px 12px rgba(0, 0, 0, 0.15)' : '0 2px 6px rgba(0, 0, 0, 0.05)'
                }}
                aria-label={`Select word block: ${block}`}
                role="button"
                tabIndex={0}
              >
                {block}
              </button>
            );
          })}
        </div>

        {isCorrect !== null && (
          <div className={`text-center text-2xl font-light ${
            isCorrect ? 'text-green-600' : 'text-red-600'
          }`}>
            {isCorrect ? '✓ Correct!' : '✗ Try again'}
          </div>
        )}

        {/* Watercolor Splash Overlay */}
        {currentSplash && (
          <WatercolorSplash variant={currentSplash as 'success' | 'error' | 'transition'} />
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
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