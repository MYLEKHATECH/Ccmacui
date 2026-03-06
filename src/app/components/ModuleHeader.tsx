import { LucideIcon, Settings } from 'lucide-react';

interface ModuleHeaderProps {
  icon: LucideIcon;
  iconColor: string;
  title: string;
  subtitle: string;
  ctaLabel?: string;
  onCta?: () => void;
  ctaVariant?: 'primary' | 'scanning' | 'disabled';
  secondaryLabel?: string;
  onSecondary?: () => void;
}

export function ModuleHeader({
  icon: Icon,
  iconColor,
  title,
  subtitle,
  ctaLabel,
  onCta,
  ctaVariant = 'primary',
  secondaryLabel,
  onSecondary,
}: ModuleHeaderProps) {
  return (
    <div
      style={{
        height: 80,
        borderBottom: '1px solid rgba(26,107,154,0.2)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 28px',
        gap: 16,
        flexShrink: 0,
        background: 'rgba(15,27,38,0.8)',
      }}
    >
      {/* Icon */}
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 10,
          background: `${iconColor}18`,
          border: `1px solid ${iconColor}30`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Icon size={22} style={{ color: iconColor }} />
      </div>

      {/* Title */}
      <div style={{ flex: 1 }}>
        <h1
          style={{
            margin: 0,
            color: '#FFFFFF',
            fontSize: 22,
            fontWeight: 600,
            lineHeight: 1.2,
            fontFamily: 'var(--font-display)',
          }}
        >
          {title}
        </h1>
        <p style={{ margin: 0, color: '#8BA8BE', fontSize: 12, marginTop: 2 }}>{subtitle}</p>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        {secondaryLabel && (
          <button
            onClick={onSecondary}
            style={{
              height: 36,
              padding: '0 18px',
              borderRadius: 10,
              background: 'transparent',
              border: '1px solid #1A6B9A',
              color: '#4DA6D8',
              fontSize: 13,
              fontWeight: 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontFamily: 'var(--font-text)',
              transition: 'background 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(26,107,154,0.12)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            <Settings size={14} />
            {secondaryLabel}
          </button>
        )}
        {ctaLabel && (
          <button
            onClick={ctaVariant !== 'disabled' ? onCta : undefined}
            style={{
              height: 36,
              padding: '0 22px',
              borderRadius: 10,
              background:
                ctaVariant === 'disabled'
                  ? 'rgba(255,255,255,0.08)'
                  : ctaVariant === 'scanning'
                  ? '#1A6B9A'
                  : '#2E9C6A',
              color:
                ctaVariant === 'disabled' ? 'rgba(255,255,255,0.3)' : '#FFFFFF',
              fontSize: 13,
              fontWeight: 600,
              cursor: ctaVariant === 'disabled' ? 'not-allowed' : 'pointer',
              border: 'none',
              fontFamily: 'var(--font-text)',
              boxShadow:
                ctaVariant === 'primary'
                  ? '0 0 16px 2px rgba(46,156,106,0.3)'
                  : 'none',
              transition: 'background 0.15s, box-shadow 0.15s',
            }}
            onMouseEnter={e => {
              if (ctaVariant === 'primary') {
                e.currentTarget.style.background = '#35B57A';
                e.currentTarget.style.boxShadow = '0 0 20px 4px rgba(46,156,106,0.5)';
              }
            }}
            onMouseLeave={e => {
              if (ctaVariant === 'primary') {
                e.currentTarget.style.background = '#2E9C6A';
                e.currentTarget.style.boxShadow = '0 0 16px 2px rgba(46,156,106,0.3)';
              }
            }}
          >
            {ctaLabel}
          </button>
        )}
      </div>
    </div>
  );
}
