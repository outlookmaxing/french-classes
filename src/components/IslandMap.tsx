import { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { supabase, type World } from '../lib/supabase';

export function IslandMap() {
  const [worlds, setWorlds] = useState<World[]>([]);
  const [hoveredIsland, setHoveredIsland] = useState<string | null>(null);

  useEffect(() => {
    loadWorlds();
  }, []);

  async function loadWorlds() {
    const { data } = await supabase
      .from('worlds')
      .select('*')
      .order('order')
      .maybeSingle();

    if (data) {
      setWorlds([data]);
    }
  }

  const handleIslandClick = (worldSlug: string) => {
    window.location.hash = `#world/${worldSlug}`;
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-8">
      <div className="text-center space-y-12">
        <div className="space-y-4 animate-fadeIn">
          <h1 className="text-5xl font-light text-gray-800" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Souffle
          </h1>
          <p className="text-xl text-gray-600 font-light">
            Путешествие во французский через образы и эмоции
          </p>
        </div>

        <div className="flex flex-col items-center gap-8 mt-16">
          {worlds.map((world, index) => (
            <button
              key={world.id}
              onClick={() => handleIslandClick(world.slug)}
              onMouseEnter={() => setHoveredIsland(world.id)}
              onMouseLeave={() => setHoveredIsland(null)}
              className="relative group"
              style={{
                animation: `floatIn 1s ease-out ${index * 0.2}s both`
              }}
            >
              <div
                className="relative w-80 h-80 rounded-full transition-all duration-700 ease-out"
                style={{
                  background: `radial-gradient(circle at 30% 30%, ${world.color_palette.primary}40, ${world.color_palette.secondary}30, ${world.color_palette.accent}20)`,
                  transform: hoveredIsland === world.id ? 'scale(1.05) translateY(-8px)' : 'scale(1)',
                  boxShadow: hoveredIsland === world.id
                    ? `0 20px 60px ${world.color_palette.primary}30, inset 0 0 60px ${world.color_palette.secondary}20`
                    : `0 10px 40px ${world.color_palette.primary}20, inset 0 0 40px ${world.color_palette.secondary}15`,
                  filter: 'blur(1px)',
                }}
              >
                <div className="absolute inset-0 rounded-full overflow-hidden">
                  <div
                    className="absolute inset-0 opacity-30"
                    style={{
                      background: `radial-gradient(circle at 70% 40%, ${world.color_palette.accent}60 0%, transparent 50%)`,
                      animation: 'breathe 4s ease-in-out infinite'
                    }}
                  />
                </div>
              </div>

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8">
                <Sparkles
                  className="w-12 h-12 mb-4 transition-transform duration-500"
                  style={{
                    color: world.color_palette.primary,
                    transform: hoveredIsland === world.id ? 'rotate(20deg) scale(1.2)' : 'rotate(0deg) scale(1)',
                    filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.1))'
                  }}
                />
                <h2
                  className="text-3xl font-light mb-2"
                  style={{
                    color: '#243B55',
                    textShadow: '0 2px 4px rgba(255,255,255,0.5)'
                  }}
                >
                  {world.title_fr}
                </h2>
                <p className="text-sm font-light text-gray-700">
                  {world.title_ru}
                </p>
              </div>

              <div
                className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                Начать путешествие
              </div>
            </button>
          ))}

          <div className="mt-8 flex items-center gap-2 text-sm text-gray-500">
            <span className="inline-block w-3 h-3 rounded-full bg-green-400 animate-pulse" />
            <span>0/10 семян понимания</span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes floatIn {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes breathe {
          0%, 100% {
            transform: scale(1) translate(0, 0);
            opacity: 0.3;
          }
          50% {
            transform: scale(1.3) translate(-5%, -5%);
            opacity: 0.5;
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
