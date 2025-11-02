import { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface AudioVisualizerProps {
  text: string;
  autoPlay?: boolean;
}

export function AudioVisualizer({ text, autoPlay = false }: AudioVisualizerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [bars, setBars] = useState<number[]>([0.3, 0.5, 0.7, 0.5, 0.3]);

  useEffect(() => {
    if (autoPlay) {
      playAudio();
    }
  }, [text, autoPlay]);

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setBars(prev => prev.map(() => Math.random() * 0.8 + 0.2));
      }, 100);

      return () => clearInterval(interval);
    } else {
      setBars([0.3, 0.5, 0.7, 0.5, 0.3]);
    }
  }, [isPlaying]);

  const playAudio = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'fr-FR';
      utterance.rate = 0.85;
      utterance.pitch = 1.0;

      utterance.onstart = () => setIsPlaying(true);
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);

      setIsPlaying(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  const stopAudio = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    }
  };

  return (
    <button
      onClick={isPlaying ? stopAudio : playAudio}
      className="group relative flex items-center gap-3 px-6 py-4 rounded-full transition-all duration-500"
      style={{
        background: isPlaying
          ? 'linear-gradient(135deg, #A7D8F0 0%, #F5B6B4 100%)'
          : 'rgba(255, 255, 255, 0.5)',
        backdropFilter: 'blur(10px)',
        border: '2px solid rgba(255, 255, 255, 0.4)',
        boxShadow: isPlaying
          ? '0 8px 24px rgba(167, 216, 240, 0.4)'
          : '0 4px 12px rgba(0, 0, 0, 0.05)',
      }}
    >
      <div className="relative">
        {isPlaying ? (
          <VolumeX className="w-6 h-6 text-gray-800" />
        ) : (
          <Volume2 className="w-6 h-6 text-gray-700" />
        )}
      </div>

      <div className="flex items-end gap-1 h-6">
        {bars.map((height, i) => (
          <div
            key={i}
            className="w-1 rounded-full transition-all duration-100"
            style={{
              height: `${height * 100}%`,
              background: isPlaying
                ? 'linear-gradient(to top, #243B55, #A7D8F0)'
                : '#D1D5DB',
            }}
          />
        ))}
      </div>

      <span className="text-sm font-light text-gray-700">
        {isPlaying ? 'Écoute...' : 'Écouter'}
      </span>
    </button>
  );
}
