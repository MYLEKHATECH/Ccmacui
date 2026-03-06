import { useEffect, useRef, useState } from 'react';

interface CircularProgressRingProps {
  size?: number;
  strokeWidth?: number;
  value: number; // 0–100
  label?: string;
  sublabel?: string;
  color?: string;
  animate?: boolean;
}

export function CircularProgressRing({
  size = 160,
  strokeWidth = 8,
  value,
  label,
  sublabel,
  color = '#2E9C6A',
  animate = true,
}: CircularProgressRingProps) {
  const [displayValue, setDisplayValue] = useState(animate ? 0 : value);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (displayValue / 100) * circumference;

  useEffect(() => {
    if (!animate) return;
    const start = performance.now();
    const duration = 1200;
    const from = 0;
    const to = value;

    const frame = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(from + (to - from) * eased);
      if (progress < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }, [value, animate]);

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        {/* Background Ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={strokeWidth}
        />
        {/* Progress Ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#ring-gradient)"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.1s ease' }}
        />
        <defs>
          <linearGradient id="ring-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1A6B9A" />
            <stop offset="100%" stopColor={color} />
          </linearGradient>
        </defs>
      </svg>
      {/* Center Content */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
        }}
      >
        {label ? (
          <>
            <span style={{ color: '#FFFFFF', fontSize: size * 0.18, fontWeight: 700, lineHeight: 1, fontFamily: 'var(--font-display)' }}>
              {Math.round(displayValue)}
            </span>
            <span style={{ color: '#8BA8BE', fontSize: size * 0.09, marginTop: 2 }}>{label}</span>
            {sublabel && (
              <span style={{ color: '#4A6070', fontSize: size * 0.07, marginTop: 1 }}>{sublabel}</span>
            )}
          </>
        ) : null}
      </div>
    </div>
  );
}
