import { useEffect, useRef } from "react";
import Lottie from "lottie-react";

type Props = {
  variant?: "success" | "error" | "transition";
  onDone?: () => void;
};

export default function WatercolorSplash({ variant = "success", onDone }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current!;
    el.classList.add("animate-fade");

    // Auto-remove after animation (assuming ~850ms animation)
    const timer = setTimeout(() => {
      onDone?.();
      el.style.display = 'none';
    }, 850);

    return () => clearTimeout(timer);
  }, [onDone]);

  // Placeholder animation data - in real app, load from JSON files
  const getAnimationData = () => {
    switch (variant) {
      case "success":
        return {
          v: "5.5.7",
          meta: { g: "LottieFiles AE 0.1.20" },
          fr: 30,
          ip: 0,
          op: 25,
          w: 500,
          h: 500,
          nm: "Success Splash",
          ddd: 0,
          assets: [],
          layers: [{
            ddd: 0,
            ind: 1,
            ty: 4,
            nm: "Splash",
            sr: 1,
            ks: {
              o: { a: 0, k: 100 },
              r: { a: 0, k: 0 },
              p: { a: 0, k: [250, 250, 0] },
              a: { a: 0, k: [0, 0, 0] },
              s: { a: 1, k: [
                { i: { x: [0.833, 0.833, 0.833], y: [0.833, 0.833, 0.833] }, o: { x: [0.167, 0.167, 0.167], y: [0.167, 0.167, 0.167] }, t: 0, s: [0, 0, 100] },
                { t: 25, s: [150, 150, 100] }
              ]}
            },
            ao: 0,
            shapes: [{
              ty: "gr",
              it: [{
                d: 1,
                ty: "el",
                s: { a: 0, k: [200, 200] },
                p: { a: 0, k: [0, 0] }
              }, {
                ty: "fl",
                c: { a: 0, k: [0.2, 0.8, 0.4, 1] } // Success green
              }, {
                ty: "tr",
                p: { a: 0, k: [0, 0] },
                a: { a: 0, k: [0, 0] },
                s: { a: 0, k: [100, 100] },
                r: { a: 0, k: 0 },
                o: { a: 0, k: 100 }
              }]
            }],
            ip: 0,
            op: 25,
            st: 0
          }]
        };

      case "error":
        return {
          v: "5.5.7",
          meta: { g: "LottieFiles AE 0.1.20" },
          fr: 30,
          ip: 0,
          op: 25,
          w: 500,
          h: 500,
          nm: "Error Splash",
          ddd: 0,
          assets: [],
          layers: [{
            ddd: 0,
            ind: 1,
            ty: 4,
            nm: "Splash",
            sr: 1,
            ks: {
              o: { a: 0, k: 100 },
              r: { a: 0, k: 0 },
              p: { a: 0, k: [250, 250, 0] },
              a: { a: 0, k: [0, 0, 0] },
              s: { a: 1, k: [
                { i: { x: [0.833, 0.833, 0.833], y: [0.833, 0.833, 0.833] }, o: { x: [0.167, 0.167, 0.167], y: [0.167, 0.167, 0.167] }, t: 0, s: [0, 0, 100] },
                { t: 25, s: [120, 120, 100] }
              ]}
            },
            ao: 0,
            shapes: [{
              ty: "gr",
              it: [{
                d: 1,
                ty: "el",
                s: { a: 0, k: [200, 200] },
                p: { a: 0, k: [0, 0] }
              }, {
                ty: "fl",
                c: { a: 0, k: [0.9, 0.3, 0.3, 1] } // Error red
              }, {
                ty: "tr",
                p: { a: 0, k: [0, 0] },
                a: { a: 0, k: [0, 0] },
                s: { a: 0, k: [100, 100] },
                r: { a: 0, k: 0 },
                o: { a: 0, k: 100 }
              }]
            }],
            ip: 0,
            op: 25,
            st: 0
          }]
        };

      case "transition":
        return {
          v: "5.5.7",
          meta: { g: "LottieFiles AE 0.1.20" },
          fr: 30,
          ip: 0,
          op: 25,
          w: 500,
          h: 500,
          nm: "Transition Splash",
          ddd: 0,
          assets: [],
          layers: [{
            ddd: 0,
            ind: 1,
            ty: 4,
            nm: "Splash",
            sr: 1,
            ks: {
              o: { a: 0, k: 100 },
              r: { a: 0, k: 0 },
              p: { a: 0, k: [250, 250, 0] },
              a: { a: 0, k: [0, 0, 0] },
              s: { a: 1, k: [
                { i: { x: [0.833, 0.833, 0.833], y: [0.833, 0.833, 0.833] }, o: { x: [0.167, 0.167, 0.167], y: [0.167, 0.167, 0.167] }, t: 0, s: [0, 0, 100] },
                { t: 25, s: [180, 180, 100] }
              ]}
            },
            ao: 0,
            shapes: [{
              ty: "gr",
              it: [{
                d: 1,
                ty: "el",
                s: { a: 0, k: [200, 200] },
                p: { a: 0, k: [0, 0] }
              }, {
                ty: "fl",
                c: { a: 0, k: [0.7, 0.5, 0.9, 1] } // Transition purple
              }, {
                ty: "tr",
                p: { a: 0, k: [0, 0] },
                a: { a: 0, k: [0, 0] },
                s: { a: 0, k: [100, 100] },
                r: { a: 0, k: 0 },
                o: { a: 0, k: 100 }
              }]
            }],
            ip: 0,
            op: 25,
            st: 0
          }]
        };

      default:
        return null;
    }
  };

  const animationData = getAnimationData();

  if (!animationData) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center"
    >
      <Lottie
        animationData={animationData}
        loop={false}
        autoplay={true}
        style={{
          width: '300px',
          height: '300px',
        }}
      />
    </div>
  );
}