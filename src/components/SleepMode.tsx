import { useState, useEffect } from 'react';
import { Moon, X, Play, Pause } from 'lucide-react';

interface SleepModeProps {
  phrases: string[];
  onClose: () => void;
}

export function SleepMode({ phrases, onClose }: SleepModeProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [stars, setStars] = useState<Array<{ x: number; y: number; delay: number }>>([]);

  useEffect(() => {
    const newStars = Array.from({ length: 30 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 3
    }));
    setStars(newStars);
  }, []);

  useEffect(() => {
    if (!isPlaying) return;

    const speakPhrase = () => {
      if ('speechSynthesis' in window && phrases.length > 0) {
        const utterance = new SpeechSynthesisUtterance(phrases[currentIndex]);
        utterance.lang = 'fr-FR';
        utterance.rate = 0.7;
        utterance.pitch = 0.9;
        utterance.volume = 0.8;

        utterance.onend = () => {
          setTimeout(() => {
            setCurrentIndex((prev) => (prev + 1) % phrases.length);
          }, 3000);
        };

        window.speechSynthesis.speak(utterance);
      }
    };

    speakPhrase();

    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isPlaying, currentIndex, phrases]);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #1a1a2e 0%, #0f0f1e 100%)'
      }}
    >
      {stars.map((star, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: '2px',
            height: '2px',
            animation: `twinkle ${2 + star.delay}s ease-in-out infinite`,
            animationDelay: `${star.delay}s`,
            opacity: 0
          }}
        />
      ))}

      <button
        onClick={onClose}
        className="absolute top-8 right-8 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 backdrop-blur-sm"
      >
        <X className="w-6 h-6 text-white" />
      </button>

      <div className="relative min-h-screen flex flex-col items-center justify-center p-8">
        <div className="mb-12">
          <Moon className="w-20 h-20 text-blue-200 opacity-70" />
        </div>

        <div className="text-center mb-16 max-w-2xl">
          <h2 className="text-4xl font-light text-white mb-4">
            Mode sommeil
          </h2>
          <p className="text-lg text-blue-200 font-light opacity-70">
            Fermez les yeux et laissez les mots flotter dans votre esprit
          </p>
        </div>

        <div className="relative w-full max-w-xl">
          <div
            className="text-center p-12 rounded-3xl transition-opacity duration-1000"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              minHeight: '200px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <p
              className="text-2xl font-light text-white transition-opacity duration-700"
              style={{
                opacity: isPlaying ? 1 : 0.3,
                textShadow: '0 2px 20px rgba(255, 255, 255, 0.3)'
              }}
            >
              {phrases[currentIndex] || 'Détendez-vous...'}
            </p>
          </div>

          <div className="flex items-center justify-center gap-4 mt-12">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-6 rounded-full transition-all duration-500 hover:scale-110"
              style={{
                background: isPlaying
                  ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                  : 'rgba(255, 255, 255, 0.1)',
                boxShadow: isPlaying
                  ? '0 8px 32px rgba(102, 126, 234, 0.4)'
                  : '0 4px 16px rgba(0, 0, 0, 0.2)'
              }}
            >
              {isPlaying ? (
                <Pause className="w-8 h-8 text-white" />
              ) : (
                <Play className="w-8 h-8 text-white" />
              )}
            </button>
          </div>

          <div className="text-center mt-8">
            <p className="text-sm text-blue-200 opacity-50">
              {currentIndex + 1} / {phrases.length}
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes twinkle {
          0%, 100% {
            opacity: 0;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.5);
          }
        }
      `}</style>
    </div>
  );
}
