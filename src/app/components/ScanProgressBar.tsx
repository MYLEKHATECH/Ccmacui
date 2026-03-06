interface ScanProgressBarProps {
  value: number; // 0–100
  variant?: 'scanning' | 'complete' | 'error';
  showLabel?: boolean;
  height?: number;
}

export function ScanProgressBar({
  value,
  variant = 'scanning',
  showLabel = true,
  height = 6,
}: ScanProgressBarProps) {
  const fillColor =
    variant === 'error'
      ? '#E05252'
      : 'linear-gradient(90deg, #1A6B9A, #2E9C6A)';

  return (
    <div style={{ width: '100%' }}>
      {showLabel && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: 6,
            color: '#8BA8BE',
            fontSize: 11,
          }}
        >
          <span>{variant === 'scanning' ? 'Scanning...' : variant === 'error' ? 'Error' : 'Complete'}</span>
          <span style={{ color: '#FFFFFF', fontWeight: 500 }}>{Math.round(value)}%</span>
        </div>
      )}
      <div
        style={{
          width: '100%',
          height,
          borderRadius: height / 2,
          background: 'rgba(255,255,255,0.08)',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <div
          style={{
            height: '100%',
            borderRadius: height / 2,
            width: `${value}%`,
            background: variant === 'error' ? '#E05252' : 'linear-gradient(90deg, #1A6B9A, #2E9C6A)',
            transition: 'width 0.3s ease',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {variant === 'scanning' && (
            <div
              className="animate-shimmer"
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)',
                width: '50%',
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
