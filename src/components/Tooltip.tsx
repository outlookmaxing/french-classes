import { useState } from 'react';
import { HelpCircle } from 'lucide-react';

interface TooltipProps {
  french: string;
  translation?: string;
  pronunciation?: string;
  children?: React.ReactNode;
  inline?: boolean;
}

export function Tooltip({ french, translation, pronunciation, children, inline = false }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  const content = children || french;

  if (inline) {
    return (
      <span className="relative inline-block group">
        <span
          className="border-b border-dotted border-gray-400 cursor-help"
          onMouseEnter={() => setIsVisible(true)}
          onMouseLeave={() => setIsVisible(false)}
          onClick={() => setIsVisible(!isVisible)}
        >
          {content}
        </span>
        {isVisible && (
          <span
            className="absolute z-50 px-3 py-2 text-sm font-light rounded-xl shadow-lg whitespace-nowrap animate-fadeIn pointer-events-none"
            style={{
              bottom: 'calc(100% + 8px)',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'rgba(36, 59, 85, 0.95)',
              backdropFilter: 'blur(10px)',
              color: 'white',
            }}
          >
            {translation && <div className="text-xs opacity-80 mb-1">{translation}</div>}
            {pronunciation && <div className="text-xs opacity-60">[{pronunciation}]</div>}
            <div
              className="absolute w-2 h-2 rotate-45"
              style={{
                bottom: '-4px',
                left: '50%',
                transform: 'translateX(-50%) rotate(45deg)',
                background: 'rgba(36, 59, 85, 0.95)',
              }}
            />
          </span>
        )}
      </span>
    );
  }

  return (
    <div className="relative inline-block group">
      <button
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onClick={() => setIsVisible(!isVisible)}
        className="p-1 rounded-full hover:bg-white/30 transition-all duration-300"
      >
        <HelpCircle className="w-4 h-4 text-gray-500" />
      </button>
      {isVisible && (
        <div
          className="absolute z-50 px-4 py-3 text-sm font-light rounded-xl shadow-2xl animate-fadeIn pointer-events-none"
          style={{
            bottom: 'calc(100% + 12px)',
            right: '0',
            minWidth: '200px',
            background: 'rgba(36, 59, 85, 0.95)',
            backdropFilter: 'blur(10px)',
            color: 'white',
          }}
        >
          <div className="font-medium mb-2">{french}</div>
          {translation && <div className="text-xs opacity-80 mb-1">{translation}</div>}
          {pronunciation && <div className="text-xs opacity-60">[{pronunciation}]</div>}
          <div
            className="absolute w-2 h-2 rotate-45"
            style={{
              bottom: '-4px',
              right: '12px',
              background: 'rgba(36, 59, 85, 0.95)',
            }}
          />
        </div>
      )}
    </div>
  );
}
