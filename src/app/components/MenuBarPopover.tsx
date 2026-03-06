import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import {
  Sparkles, Trash2, Shield, Zap, LayoutGrid, Layers,
  ScanLine, Cloud, Bot, ExternalLink, X, Cpu, MemoryStick,
  HardDrive, Wifi, ChevronRight, RefreshCw, Flame
} from 'lucide-react';
import { CircularProgressRing } from './CircularProgressRing';

// ─── Types ────────────────────────────────────────────────────────────────────
interface MenuBarPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  anchorRef: React.RefObject<HTMLElement | null>;
}

// ─── Static mock data ─────────────────────────────────────────────────────────
const diskUsed = 347;
const diskTotal = 512;
const diskPct = Math.round((diskUsed / diskTotal) * 100);

const quickStats = [
  { label: 'CPU', value: '28%', icon: Cpu, color: '#E07A30', spark: [20, 35, 28, 45, 28, 22, 28] },
  { label: 'RAM', value: '8.4 GB', icon: MemoryStick, color: '#4DA6D8', spark: [60, 65, 70, 68, 74, 72, 74] },
  { label: 'Temp', value: '52°C', icon: Flame, color: '#E05252', spark: [48, 50, 52, 51, 53, 52, 52] },
  { label: 'Network', value: '12 MB/s', icon: Wifi, color: '#2E9C6A', spark: [5, 12, 8, 15, 12, 10, 12] },
];

const quickActions = [
  { label: 'Run Smart Scan', icon: Sparkles, color: '#2E9C6A', path: '/app', action: 'scan' },
  { label: 'Empty Junk', icon: Trash2, color: '#4DA6D8', path: '/app/cleanup', action: 'clean' },
  { label: 'Free Up RAM', icon: MemoryStick, color: '#E07A30', path: '/app/performance', action: 'ram' },
];

const moduleLinks = [
  { label: 'Smart Care', icon: Sparkles, color: '#2E9C6A', path: '/app' },
  { label: 'Protection', icon: Shield, color: '#E05252', path: '/app/protection' },
  { label: 'Cleanup', icon: Trash2, color: '#4DA6D8', path: '/app/cleanup' },
  { label: 'Performance', icon: Zap, color: '#E07A30', path: '/app/performance' },
  { label: 'Apps', icon: LayoutGrid, color: '#4DA6D8', path: '/app/applications' },
  { label: 'Space Lens', icon: ScanLine, color: '#7B52C8', path: '/app/space-lens' },
];

// ─── Sparkline SVG ────────────────────────────────────────────────────────────
function Sparkline({ values, color }: { values: number[]; color: string }) {
  const w = 48;
  const h = 20;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const pts = values.map((v, i) => {
    const x = (i / (values.length - 1)) * w;
    const y = h - ((v - min) / range) * (h - 2) - 1;
    return `${x},${y}`;
  });
  const polyline = pts.join(' ');
  const lastPt = pts[pts.length - 1].split(',');

  return (
    <svg width={w} height={h} style={{ display: 'block', overflow: 'visible' }}>
      <polyline
        points={polyline}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.7}
      />
      <circle cx={lastPt[0]} cy={lastPt[1]} r={2.5} fill={color} />
    </svg>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function MenuBarPopover({ isOpen, onClose, anchorRef }: MenuBarPopoverProps) {
  const navigate = useNavigate();
  const popoverRef = useRef<HTMLDivElement>(null);
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const [pos, setPos] = useState({ top: 0, right: 0 });

  // Position below the anchor element
  useEffect(() => {
    if (isOpen && anchorRef.current) {
      const rect = anchorRef.current.getBoundingClientRect();
      setPos({
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right - 4,
      });
    }
  }, [isOpen, anchorRef]);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node) &&
        anchorRef.current &&
        !anchorRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen, onClose, anchorRef]);

  // Keyboard close
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  const handleNavigate = (path: string) => {
    navigate(path);
    onClose();
  };

  const handleQuickAction = (action: string, path: string) => {
    setActiveAction(action);
    setTimeout(() => {
      setActiveAction(null);
      navigate(path);
      onClose();
    }, 600);
  };

  if (!isOpen) return null;

  const diskColor = diskPct > 80 ? '#E05252' : diskPct > 60 ? '#E07A30' : '#2E9C6A';

  return (
    <>
      {/* Caret arrow */}
      <div
        style={{
          position: 'fixed',
          top: pos.top - 6,
          right: pos.right + 10,
          width: 12,
          height: 6,
          zIndex: 9999,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: 12,
            height: 12,
            background: '#162130',
            border: '1px solid rgba(255,255,255,0.10)',
            transform: 'rotate(45deg)',
            transformOrigin: 'center',
            marginTop: 4,
            marginLeft: 0,
          }}
        />
      </div>

      {/* Popover Panel */}
      <div
        ref={popoverRef}
        className="animate-slide-down-popover"
        style={{
          position: 'fixed',
          top: pos.top,
          right: pos.right,
          width: 292,
          background: '#0F1B26',
          border: '1px solid rgba(255,255,255,0.10)',
          borderRadius: 14,
          boxShadow: '0 24px 60px rgba(0,0,0,0.6), 0 0 0 0.5px rgba(255,255,255,0.04) inset',
          zIndex: 9998,
          overflow: 'hidden',
          fontFamily: 'var(--font-text)',
          backdropFilter: 'blur(20px)',
        }}
      >

        {/* ── Header ── */}
        <div
          style={{
            padding: '14px 16px 12px',
            background: '#0D1922',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 7,
              background: 'linear-gradient(135deg, #1A6B9A, #2E9C6A)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              boxShadow: '0 0 12px rgba(46,156,106,0.35)',
            }}
          >
            <Sparkles size={15} color="#fff" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ color: '#FFFFFF', fontSize: 13, fontWeight: 600, lineHeight: 1.2 }}>
              CCMac
            </div>
            <div style={{ color: '#4A6070', fontSize: 10, marginTop: 1 }}>
              v4.0 · Last scan: Today 2:34 PM
            </div>
          </div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <button
              onClick={() => handleNavigate('/app')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                padding: '4px 8px',
                borderRadius: 6,
                background: 'rgba(46,156,106,0.12)',
                border: '1px solid rgba(46,156,106,0.3)',
                color: '#2E9C6A',
                fontSize: 11,
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'var(--font-text)',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(46,156,106,0.22)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(46,156,106,0.12)';
              }}
            >
              <ExternalLink size={10} />
              Open
            </button>
            <button
              onClick={onClose}
              style={{
                width: 22,
                height: 22,
                borderRadius: 5,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: '#4A6070',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.color = '#8BA8BE';
                e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = '#4A6070';
                e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
              }}
            >
              <X size={12} />
            </button>
          </div>
        </div>

        {/* ── Disk Health ── */}
        <div
          style={{
            padding: '14px 16px',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
            display: 'flex',
            alignItems: 'center',
            gap: 16,
          }}
        >
          <CircularProgressRing
            size={72}
            value={diskPct}
            color={diskColor}
            label="Disk"
          />
          <div style={{ flex: 1 }}>
            <div style={{ color: '#FFFFFF', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
              Disk Health
            </div>
            {/* Usage bar */}
            <div
              style={{
                height: 5,
                borderRadius: 3,
                background: 'rgba(255,255,255,0.08)',
                overflow: 'hidden',
                marginBottom: 5,
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${diskPct}%`,
                  borderRadius: 3,
                  background: `linear-gradient(90deg, ${diskColor}aa, ${diskColor})`,
                  transition: 'width 0.8s cubic-bezier(0.4,0,0.2,1)',
                }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#8BA8BE', fontSize: 10 }}>
                <span style={{ color: diskColor, fontWeight: 600 }}>{diskUsed} GB</span> used
              </span>
              <span style={{ color: '#4A6070', fontSize: 10 }}>{diskTotal} GB total</span>
            </div>
            <div style={{ marginTop: 6 }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '2px 7px',
                  borderRadius: 4,
                  background: diskPct > 80
                    ? 'rgba(224,82,82,0.12)'
                    : diskPct > 60
                    ? 'rgba(224,122,48,0.12)'
                    : 'rgba(46,156,106,0.12)',
                  border: `1px solid ${diskColor}30`,
                  color: diskColor,
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                }}
              >
                {diskPct > 80 ? '⚠ Near Full' : diskPct > 60 ? '● Moderate' : '✓ Healthy'}
              </span>
            </div>
          </div>
        </div>

        {/* ── System Stats ── */}
        <div
          style={{
            padding: '12px 16px',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
          }}
        >
          <div style={{ color: '#4A6070', fontSize: 10, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 10 }}>
            Live System
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {quickStats.map((stat) => (
              <div
                key={stat.label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 10px',
                  borderRadius: 8,
                  background: '#1C2E3E',
                  border: '1px solid rgba(255,255,255,0.05)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <stat.icon size={12} style={{ color: stat.color, flexShrink: 0 }} />
                  <div>
                    <div style={{ color: '#4A6070', fontSize: 9, lineHeight: 1.2 }}>{stat.label}</div>
                    <div style={{ color: '#FFFFFF', fontSize: 11, fontWeight: 600, lineHeight: 1.3 }}>{stat.value}</div>
                  </div>
                </div>
                <Sparkline values={stat.spark} color={stat.color} />
              </div>
            ))}
          </div>
        </div>

        {/* ── Quick Actions ── */}
        <div
          style={{
            padding: '12px 16px',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
          }}
        >
          <div style={{ color: '#4A6070', fontSize: 10, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 10 }}>
            Quick Actions
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {quickActions.map((action) => {
              const isActive = activeAction === action.action;
              return (
                <button
                  key={action.action}
                  onClick={() => handleQuickAction(action.action, action.path)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '9px 12px',
                    borderRadius: 9,
                    background: isActive
                      ? `rgba(${action.color === '#2E9C6A' ? '46,156,106' : action.color === '#4DA6D8' ? '77,166,216' : '224,122,48'},0.15)`
                      : '#162130',
                    border: `1px solid ${isActive ? action.color + '40' : 'rgba(255,255,255,0.06)'}`,
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s',
                    fontFamily: 'var(--font-text)',
                  }}
                  onMouseEnter={e => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                      e.currentTarget.style.borderColor = action.color + '30';
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isActive) {
                      e.currentTarget.style.background = '#162130';
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                    }
                  }}
                >
                  <div
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: 7,
                      background: action.color + '18',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      border: `1px solid ${action.color}25`,
                    }}
                  >
                    {isActive
                      ? <RefreshCw size={13} style={{ color: action.color, animation: 'spin-slow 1s linear infinite' }} />
                      : <action.icon size={13} style={{ color: action.color }} />
                    }
                  </div>
                  <span style={{ color: '#FFFFFF', fontSize: 12, fontWeight: 500, flex: 1 }}>
                    {isActive ? 'Starting…' : action.label}
                  </span>
                  <ChevronRight size={12} style={{ color: '#4A6070' }} />
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Module Shortcuts ── */}
        <div style={{ padding: '12px 16px 14px' }}>
          <div style={{ color: '#4A6070', fontSize: 10, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 10 }}>
            Modules
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
            {moduleLinks.map((mod) => (
              <button
                key={mod.path}
                onClick={() => handleNavigate(mod.path)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 5,
                  padding: '9px 6px',
                  borderRadius: 9,
                  background: '#1C2E3E',
                  border: '1px solid rgba(255,255,255,0.05)',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-text)',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = mod.color + '15';
                  e.currentTarget.style.borderColor = mod.color + '35';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = '#1C2E3E';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 8,
                    background: mod.color + '18',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: `1px solid ${mod.color}25`,
                  }}
                >
                  <mod.icon size={14} style={{ color: mod.color }} />
                </div>
                <span style={{ color: '#8BA8BE', fontSize: 10, lineHeight: 1.2, textAlign: 'center' }}>
                  {mod.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Footer ── */}
        <div
          style={{
            padding: '10px 16px',
            borderTop: '1px solid rgba(255,255,255,0.05)',
            background: '#0D1922',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: '#2E9C6A',
                boxShadow: '0 0 6px rgba(46,156,106,0.7)',
                animation: 'glow-pulse 2s ease-in-out infinite',
              }}
            />
            <span style={{ color: '#4A6070', fontSize: 10 }}>Protection active</span>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button
              onClick={() => handleNavigate('/app')}
              style={{
                background: 'none',
                border: 'none',
                color: '#4A6070',
                fontSize: 10,
                cursor: 'pointer',
                padding: 0,
                fontFamily: 'var(--font-text)',
                transition: 'color 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.color = '#8BA8BE'}
              onMouseLeave={e => e.currentTarget.style.color = '#4A6070'}
            >
              Settings
            </button>
            <span style={{ color: '#1A3050' }}>·</span>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                color: '#4A6070',
                fontSize: 10,
                cursor: 'pointer',
                padding: 0,
                fontFamily: 'var(--font-text)',
                transition: 'color 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.color = '#8BA8BE'}
              onMouseLeave={e => e.currentTarget.style.color = '#4A6070'}
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </>
  );
}