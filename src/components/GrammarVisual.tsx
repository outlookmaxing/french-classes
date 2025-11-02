import { useState } from 'react';
import { ArrowRight, Circle } from 'lucide-react';

interface GrammarVisualProps {
  type: 'etre' | 'avoir' | 'verbs' | 'articles';
  onComplete?: () => void;
}

export function GrammarVisual({ type, onComplete }: GrammarVisualProps) {
  const [step, setStep] = useState(0);

  const renderEtreVisual = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-3xl font-light text-gray-800 mb-4">être = состояние</h3>
        <p className="text-gray-600 font-light">Глагол "быть" описывает, кто вы или как себя чувствуете</p>
      </div>

      <div className="flex items-center justify-center gap-8">
        <div
          className="relative w-32 h-32 rounded-full flex items-center justify-center transition-all duration-500"
          style={{
            background: 'linear-gradient(135deg, #F5B6B4 0%, #A7D8F0 100%)',
            transform: step >= 1 ? 'scale(1.1)' : 'scale(1)',
          }}
        >
          <span className="text-4xl">😊</span>
        </div>

        {step >= 1 && (
          <ArrowRight className="w-8 h-8 text-gray-400 animate-fadeIn" />
        )}

        {step >= 1 && (
          <div className="animate-fadeIn">
            <div className="text-2xl font-light text-gray-800">Je suis</div>
            <div className="text-xl text-gray-600">content</div>
          </div>
        )}
      </div>

      <div className="flex justify-center gap-4">
        {['Je suis content', 'Elle est fatiguée', 'Nous sommes heureux'].map((example, i) => (
          <button
            key={i}
            onClick={() => setStep(i + 1)}
            className={`px-6 py-3 rounded-full font-light transition-all duration-300 ${
              step > i
                ? 'bg-gradient-to-r from-pink-200 to-blue-200 text-gray-800'
                : 'bg-white/50 text-gray-600 hover:bg-white/70'
            }`}
          >
            {example}
          </button>
        ))}
      </div>
    </div>
  );

  const renderAvoirVisual = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-3xl font-light text-gray-800 mb-4">avoir = обладание</h3>
        <p className="text-gray-600 font-light">Глагол "иметь" показывает, что у вас есть</p>
      </div>

      <div className="flex items-center justify-center gap-8">
        <div
          className="relative w-32 h-32 rounded-full flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, #C5E3C8 0%, #F9E79F 100%)',
          }}
        >
          <span className="text-4xl">👤</span>
        </div>

        <div className="flex flex-col gap-2">
          <Circle className="w-6 h-6 text-green-400 fill-green-400" />
          <Circle className="w-6 h-6 text-green-400 fill-green-400" />
          <Circle className="w-6 h-6 text-green-400 fill-green-400" />
        </div>

        <div>
          <div className="text-2xl font-light text-gray-800">J'ai</div>
          <div className="text-xl text-gray-600">des amis</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
        {[
          { fr: "J'ai faim", emoji: '🍽️' },
          { fr: "J'ai froid", emoji: '❄️' },
          { fr: "J'ai 20 ans", emoji: '🎂' },
          { fr: "J'ai mal", emoji: '🤕' }
        ].map((item, i) => (
          <button
            key={i}
            className="p-4 rounded-2xl bg-white/50 hover:bg-white/70 transition-all duration-300 backdrop-blur-sm"
          >
            <div className="text-3xl mb-2">{item.emoji}</div>
            <div className="text-sm font-light text-gray-700">{item.fr}</div>
          </button>
        ))}
      </div>
    </div>
  );

  const renderArticlesVisual = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-3xl font-light text-gray-800 mb-4">Les articles</h3>
        <p className="text-gray-600 font-light">Артикли как цвета слов</p>
      </div>

      <div className="grid grid-cols-2 gap-8 max-w-2xl mx-auto">
        <div className="space-y-4">
          <div
            className="p-6 rounded-3xl"
            style={{
              background: 'linear-gradient(135deg, #A7D8F0 0%, #7FB3D5 100%)',
            }}
          >
            <div className="text-center">
              <div className="text-2xl font-light text-white mb-2">le</div>
              <div className="text-sm text-white/80">masculin</div>
              <div className="mt-4 text-xl text-white">☀️ le soleil</div>
            </div>
          </div>

          <div
            className="p-6 rounded-3xl"
            style={{
              background: 'linear-gradient(135deg, #F5B6B4 0%, #E89B98 100%)',
            }}
          >
            <div className="text-center">
              <div className="text-2xl font-light text-white mb-2">la</div>
              <div className="text-sm text-white/80">féminin</div>
              <div className="mt-4 text-xl text-white">🌙 la lune</div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <div
            className="p-6 rounded-3xl"
            style={{
              background: 'linear-gradient(135deg, #C5E3C8 0%, #A8D5AC 100%)',
            }}
          >
            <div className="text-center">
              <div className="text-2xl font-light text-white mb-2">les</div>
              <div className="text-sm text-white/80">pluriel</div>
              <div className="mt-4 text-xl text-white">⭐ les étoiles</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-8">
      {type === 'etre' && renderEtreVisual()}
      {type === 'avoir' && renderAvoirVisual()}
      {type === 'articles' && renderArticlesVisual()}

      {onComplete && (
        <div className="text-center mt-12">
          <button
            onClick={onComplete}
            className="px-8 py-4 rounded-full bg-gradient-to-r from-green-200 to-blue-200 text-gray-800 font-light hover:shadow-lg transition-all duration-300"
          >
            Compris! 🌱
          </button>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}
