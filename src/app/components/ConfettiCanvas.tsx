import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  shape: 'rect' | 'circle' | 'ribbon';
  w: number;
  h: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  fadeStart: number; // frame number when fade begins
}

const COLORS = [
  '#2E9C6A', '#35B57A',   // green
  '#4DA6D8', '#1A6B9A',   // blue
  '#7B52C8', '#9B72E8',   // purple
  '#E07A30', '#F0A060',   // orange
  '#E05252', '#F07070',   // red
  '#FFBD2E', '#FFD566',   // yellow
  '#FFFFFF', '#C8E0F0',   // white / light blue
];

function randomBetween(a: number, b: number) {
  return a + Math.random() * (b - a);
}

function createParticle(canvasWidth: number): Particle {
  const shape = Math.random() < 0.5 ? 'rect' : Math.random() < 0.6 ? 'ribbon' : 'circle';
  const w = shape === 'ribbon' ? randomBetween(2, 4) : randomBetween(6, 12);
  const h = shape === 'ribbon' ? randomBetween(14, 22) : shape === 'rect' ? randomBetween(6, 12) : w;
  return {
    x: randomBetween(canvasWidth * 0.15, canvasWidth * 0.85),
    y: randomBetween(-20, -120),
    vx: randomBetween(-4.5, 4.5),
    vy: randomBetween(-14, -4),
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    shape,
    w,
    h,
    rotation: randomBetween(0, Math.PI * 2),
    rotationSpeed: randomBetween(-0.18, 0.18),
    opacity: 1,
    fadeStart: 0,
  };
}

interface ConfettiCanvasProps {
  /** How many particles to fire (default 160) */
  count?: number;
  /** Total duration in ms before canvas unmounts itself (default 4500) */
  duration?: number;
}

export function ConfettiCanvas({ count = 160, duration = 4500 }: ConfettiCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Match canvas resolution to display
    const dpr = window.devicePixelRatio || 1;
    const W = canvas.offsetWidth;
    const H = canvas.offsetHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.scale(dpr, dpr);

    // Stagger spawning across first 800ms
    const particles: Particle[] = [];
    const spawnIntervalMs = 800;
    let spawnedCount = 0;
    const startTime = performance.now();
    const fadeAfterMs = duration - 1200;

    let frame = 0;

    const tick = (now: number) => {
      const elapsed = now - startTime;

      // Spawn particles gradually
      const targetSpawned = Math.min(count, Math.floor((elapsed / spawnIntervalMs) * count));
      while (spawnedCount < targetSpawned) {
        particles.push(createParticle(W));
        spawnedCount++;
      }

      ctx.clearRect(0, 0, W, H);

      const gravity = 0.38;
      const drag = 0.992;

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        // Physics
        p.vy += gravity;
        p.vx *= drag;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;

        // Fade once elapsed > fadeAfterMs
        if (elapsed > fadeAfterMs) {
          p.opacity = Math.max(0, p.opacity - 0.018);
        }

        // Remove off-screen or fully faded
        if (p.y > H + 40 || p.opacity <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;

        if (p.shape === 'circle') {
          ctx.beginPath();
          ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // rect or ribbon — centered
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        }

        ctx.restore();
        frame++;
      }

      // Stop after duration
      if (elapsed < duration || particles.length > 0) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [count, duration]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 200,
      }}
    />
  );
}
