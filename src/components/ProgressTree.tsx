interface ProgressTreeProps {
  completedSeeds: number;
  totalSeeds: number;
}

export function ProgressTree({ completedSeeds, totalSeeds }: ProgressTreeProps) {
  const progress = completedSeeds / totalSeeds;
  const treeHeight = Math.min(progress * 200, 200);
  const leafCount = Math.floor(progress * 10);

  return (
    <div className="relative w-32 h-48 mx-auto">
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 transition-all duration-1000 ease-out"
        style={{
          width: '8px',
          height: `${treeHeight}px`,
          background: 'linear-gradient(to top, #8B7355, #A0826D)',
          borderRadius: '4px',
        }}
      />

      {Array.from({ length: leafCount }).map((_, i) => {
        const angle = (i / leafCount) * 360;
        const radius = 20 + (i % 3) * 10;
        const x = Math.cos((angle * Math.PI) / 180) * radius;
        const y = Math.sin((angle * Math.PI) / 180) * radius - treeHeight + 20;

        return (
          <div
            key={i}
            className="absolute left-1/2 bottom-0 transition-all duration-500"
            style={{
              transform: `translate(calc(-50% + ${x}px), ${y}px)`,
              animation: `leafFloat ${3 + (i % 3)}s ease-in-out infinite`,
              animationDelay: `${i * 0.1}s`,
            }}
          >
            <div
              className="w-6 h-6 rounded-full"
              style={{
                background: 'radial-gradient(circle at 30% 30%, #C5E3C8, #7FB069)',
                boxShadow: '0 2px 8px rgba(127, 176, 105, 0.3)',
              }}
            />
          </div>
        );
      })}

      {progress >= 1 && (
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="text-4xl">🌳</div>
        </div>
      )}

      <style>{`
        @keyframes leafFloat {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
        }
      `}</style>
    </div>
  );
}
