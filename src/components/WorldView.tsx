import { useEffect, useState } from 'react';
import { ArrowLeft, Lock } from 'lucide-react';
import { supabase, type Scene as SceneType, type World } from '../lib/supabase';
import { Scene } from './Scene';
import { ProgressTree } from './ProgressTree';

interface WorldViewProps {
  worldSlug: string;
}

export function WorldView({ worldSlug }: WorldViewProps) {
  const [world, setWorld] = useState<World | null>(null);
  const [scenes, setScenes] = useState<SceneType[]>([]);
  const [currentScene, setCurrentScene] = useState<SceneType | null>(null);
  const [completedScenes, setCompletedScenes] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadWorldAndScenes();
  }, [worldSlug]);

  async function loadWorldAndScenes() {
    const { data: worldData } = await supabase
      .from('worlds')
      .select('*')
      .eq('slug', worldSlug)
      .maybeSingle();

    if (worldData) {
      setWorld(worldData);

      const { data: scenesData } = await supabase
        .from('scenes')
        .select('*')
        .eq('world_id', worldData.id)
        .order('order');

      if (scenesData) {
        setScenes(scenesData);
      }
    }
  }

  const handleSceneClick = (scene: SceneType) => {
    setCurrentScene(scene);
  };

  const handleSceneComplete = () => {
    if (currentScene) {
      setCompletedScenes(prev => new Set([...prev, currentScene.id]));
      setCurrentScene(null);
    }
  };

  const handleBack = () => {
    if (currentScene) {
      setCurrentScene(null);
    } else {
      window.location.hash = '';
    }
  };

  if (currentScene) {
    return (
      <Scene
        scene={currentScene}
        onComplete={handleSceneComplete}
        onBack={handleBack}
      />
    );
  }

  if (!world) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full p-8">
      <button
        onClick={handleBack}
        className="flex items-center gap-2 px-4 py-2 rounded-full text-gray-700 hover:bg-white/50 transition-all duration-300 mb-8"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-light">Carte du monde</span>
      </button>

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16 space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl font-light text-gray-800">
              {world.title_fr}
            </h1>
            <p className="text-xl text-gray-600 font-light">
              {world.description}
            </p>
          </div>

          <ProgressTree completedSeeds={completedScenes.size} totalSeeds={scenes.length} />

          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <span className="inline-block w-3 h-3 rounded-full bg-green-400 animate-pulse" />
            <span>{completedScenes.size}/{scenes.length} семян собрано</span>
          </div>
        </div>

        <div className="relative">
          <div className="absolute left-1/2 top-0 bottom-0 w-1 -translate-x-1/2 opacity-20"
            style={{
              background: `linear-gradient(to bottom, ${world.color_palette.primary}, ${world.color_palette.secondary})`,
              filter: 'blur(2px)'
            }}
          />

          <div className="space-y-8">
            {scenes.map((scene, index) => {
              const isCompleted = completedScenes.has(scene.id);
              const isLocked = index > 0 && !completedScenes.has(scenes[index - 1].id);

              return (
                <div
                  key={scene.id}
                  className="relative"
                  style={{
                    animation: `floatIn 0.6s ease-out ${index * 0.1}s both`
                  }}
                >
                  <button
                    onClick={() => !isLocked && handleSceneClick(scene)}
                    disabled={isLocked}
                    className={`w-full p-6 rounded-3xl transition-all duration-500 ${
                      isLocked ? 'opacity-50 cursor-not-allowed' : 'hover:scale-102 hover:-translate-y-1'
                    }`}
                    style={{
                      background: isCompleted
                        ? `linear-gradient(135deg, ${world.color_palette.accent}40, ${world.color_palette.primary}30)`
                        : 'rgba(255, 255, 255, 0.5)',
                      backdropFilter: 'blur(10px)',
                      border: '2px solid rgba(255, 255, 255, 0.4)',
                      boxShadow: isCompleted
                        ? `0 8px 24px ${world.color_palette.accent}30`
                        : '0 4px 12px rgba(0, 0, 0, 0.05)'
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-light"
                          style={{
                            background: isCompleted
                              ? `linear-gradient(135deg, ${world.color_palette.primary}, ${world.color_palette.secondary})`
                              : 'rgba(255, 255, 255, 0.7)',
                            color: isCompleted ? 'white' : '#243B55'
                          }}
                        >
                          {isLocked ? <Lock className="w-5 h-5" /> : scene.order}
                        </div>
                        <div className="text-left">
                          <h3 className="text-xl font-light text-gray-800">
                            {scene.title_fr}
                          </h3>
                          <p className="text-sm text-gray-600 capitalize">
                            {scene.type.replace(/_/g, ' ')}
                          </p>
                        </div>
                      </div>

                      {isCompleted && (
                        <div className="text-2xl">🌱</div>
                      )}
                    </div>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes floatIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}
