import { useState } from 'react';
import { BookOpen, X } from 'lucide-react';

interface CultureCardProps {
  word: string;
  etymology: string;
  funFact: string;
  onClose: () => void;
}

export function CultureCard({ word, etymology, funFact, onClose }: CultureCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
      <div
        className="relative max-w-md w-full"
        style={{
          perspective: '1000px'
        }}
      >
        <div
          className={`relative w-full transition-transform duration-700`}
          style={{
            transformStyle: 'preserve-3d',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
          }}
        >
          <div
            className="w-full p-8 rounded-3xl shadow-2xl"
            style={{
              background: 'linear-gradient(135deg, #F5F3EF 0%, #EAE6E1 100%)',
              backfaceVisibility: 'hidden',
              border: '3px solid rgba(255, 255, 255, 0.5)',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1), inset 0 0 40px rgba(255, 255, 255, 0.5)'
            }}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/50 hover:bg-white/70 transition-all duration-300"
            >
              <X className="w-5 h-5 text-gray-700" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-full bg-gradient-to-br from-purple-200 to-pink-200">
                <BookOpen className="w-6 h-6 text-purple-700" />
              </div>
              <h3 className="text-2xl font-light text-gray-800">Culture minute</h3>
            </div>

            <div className="space-y-6">
              <div>
                <div className="text-4xl font-light text-center mb-4 text-gray-800">
                  {word}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-sm uppercase tracking-wide text-gray-500 mb-2">
                    Этимология
                  </h4>
                  <p className="text-gray-700 font-light leading-relaxed">
                    {etymology}
                  </p>
                </div>

                <div>
                  <h4 className="text-sm uppercase tracking-wide text-gray-500 mb-2">
                    Интересный факт
                  </h4>
                  <p className="text-gray-700 font-light leading-relaxed">
                    {funFact}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsFlipped(!isFlipped)}
                className="w-full py-3 px-6 rounded-full bg-gradient-to-r from-purple-200 to-pink-200 text-gray-800 font-light hover:shadow-lg transition-all duration-300"
              >
                {isFlipped ? 'Voir la face' : 'Voir le dos'}
              </button>
            </div>
          </div>

          <div
            className="absolute inset-0 w-full p-8 rounded-3xl shadow-2xl"
            style={{
              background: 'linear-gradient(135deg, #D8C5E6 0%, #C5E3C8 100%)',
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
              border: '3px solid rgba(255, 255, 255, 0.5)',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1), inset 0 0 40px rgba(255, 255, 255, 0.5)'
            }}
          >
            <div className="flex items-center justify-center h-full">
              <p className="text-xl text-gray-700 font-light text-center italic">
                "Chaque mot est une histoire"
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
