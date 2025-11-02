import { useState, useCallback } from 'react';

export function useSplash() {
  const [currentSplash, setCurrentSplash] = useState<string | null>(null);

  const trigger = useCallback((variant: 'success' | 'error' | 'transition' = 'success') => {
    setCurrentSplash(variant);

    // Auto-clear after animation
    setTimeout(() => {
      setCurrentSplash(null);
    }, 900); // Slightly longer than animation
  }, []);

  return {
    trigger,
    currentSplash,
    isActive: currentSplash !== null
  };
}