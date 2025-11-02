import { useEffect, useRef } from 'react';

export function WatercolorBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#F5B6B4', '#A7D8F0', '#C5E3C8', '#F9E79F', '#D8C5E6'];

    class WatercolorBlob {
      x: number;
      y: number;
      radius: number;
      color: string;
      vx: number;
      vy: number;
      opacity: number;

      constructor() {
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * canvas!.height;
        this.radius = Math.random() * 150 + 100;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.vx = (Math.random() - 0.5) * 0.2;
        this.vy = (Math.random() - 0.5) * 0.2;
        this.opacity = Math.random() * 0.15 + 0.05;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < -this.radius) this.x = canvas!.width + this.radius;
        if (this.x > canvas!.width + this.radius) this.x = -this.radius;
        if (this.y < -this.radius) this.y = canvas!.height + this.radius;
        if (this.y > canvas!.height + this.radius) this.y = -this.radius;
      }

      draw(ctx: CanvasRenderingContext2D) {
        const gradient = ctx.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, this.radius
        );
        gradient.addColorStop(0, this.color + Math.floor(this.opacity * 255).toString(16).padStart(2, '0'));
        gradient.addColorStop(0.7, this.color + '10');
        gradient.addColorStop(1, this.color + '00');

        ctx.fillStyle = gradient;
        ctx.filter = 'blur(40px)';
        ctx.fillRect(this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
        ctx.filter = 'none';
      }
    }

    const blobs: WatercolorBlob[] = [];
    for (let i = 0; i < 8; i++) {
      blobs.push(new WatercolorBlob());
    }

    function animate() {
      if (!ctx || !canvas) return;

      ctx.fillStyle = '#F5F3EF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      blobs.forEach(blob => {
        blob.update();
        blob.draw(ctx);
      });

      requestAnimationFrame(animate);
    }

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10"
      style={{ mixBlendMode: 'multiply' }}
    />
  );
}
