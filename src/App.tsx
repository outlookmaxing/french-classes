import { useEffect, useState } from 'react';
import { WatercolorBackground } from './components/WatercolorBackground';
import { IslandMap } from './components/IslandMap';
import { WorldView } from './components/WorldView';
import { ensureAnonSession } from './lib/auth';

function App() {
  const [route, setRoute] = useState<{ type: 'home' | 'world'; worldSlug?: string }>({
    type: 'home'
  });

  useEffect(() => {
    // Initialize anonymous session
    ensureAnonSession().catch(console.error);

    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);

      if (hash.startsWith('world/')) {
        const worldSlug = hash.split('/')[1];
        setRoute({ type: 'world', worldSlug });
      } else {
        setRoute({ type: 'home' });
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <div className="min-h-screen relative">
      <WatercolorBackground />

      {route.type === 'home' && <IslandMap />}
      {route.type === 'world' && route.worldSlug && (
        <WorldView worldSlug={route.worldSlug} />
      )}
    </div>
  );
}

export default App;
