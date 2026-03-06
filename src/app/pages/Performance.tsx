import { useState, useEffect } from 'react';
import { Zap, X, Play, CheckCircle2 } from 'lucide-react';
import { ModuleHeader } from '../components/ModuleHeader';

type Screen = 'overview' | 'ram-freed';

const generateSparkline = (base: number, variance: number, count = 20) =>
  Array.from({ length: count }, () => base + (Math.random() - 0.5) * variance * 2);

const metricWidgets = [
  {
    id: 'cpu',
    label: 'CPU Usage',
    icon: '🔲',
    color: '#4DA6D8',
    value: '34%',
    unit: '',
    data: generateSparkline(34, 15),
  },
  {
    id: 'ram',
    label: 'RAM Used',
    icon: '💾',
    color: '#7B52C8',
    value: '12.4',
    unit: 'GB',
    data: generateSparkline(65, 10),
  },
  {
    id: 'disk',
    label: 'Disk Free',
    icon: '💿',
    color: '#2E9C6A',
    value: '148',
    unit: 'GB',
    data: generateSparkline(40, 5),
  },
  {
    id: 'battery',
    label: 'Battery',
    icon: '🔋',
    color: '#3CB875',
    value: '87%',
    unit: '',
    data: generateSparkline(87, 3),
  },
];

const processes = [
  { name: 'Xcode', icon: '🔨', cpu: '38.2%', ram: '2.1 GB', pid: 4231 },
  { name: 'Google Chrome', icon: '🌐', cpu: '18.7%', ram: '1.8 GB', pid: 2844 },
  { name: 'Figma Desktop', icon: '🎨', cpu: '12.4%', ram: '890 MB', pid: 5102 },
  { name: 'Slack', icon: '💼', cpu: '8.1%', ram: '654 MB', pid: 1983 },
  { name: 'Spotlight', icon: '🔍', cpu: '5.9%', ram: '234 MB', pid: 320 },
  { name: 'kernel_task', icon: '⚙️', cpu: '4.2%', ram: '1.2 GB', pid: 0 },
];

const maintenanceTasks = [
  { id: 'scripts', icon: '📋', name: 'Run Maintenance Scripts', desc: 'Cleans system databases, rebuilds system caches', lastRun: '3 days ago' },
  { id: 'dns', icon: '🌐', name: 'Flush DNS Cache', desc: 'Resolves slow page loads and DNS lookup issues', lastRun: '1 week ago' },
  { id: 'spotlight', icon: '🔍', name: 'Rebuild Spotlight Index', desc: 'Fixes slow search results and missing files', lastRun: 'Never' },
  { id: 'mail', icon: '📧', name: 'Rebuild Mail Index', desc: 'Speeds up Mail search and fixes delivery issues', lastRun: '2 weeks ago' },
  { id: 'purgeable', icon: '💿', name: 'Free Purgeable Space', desc: 'Reclaims storage marked as purgeable by macOS', lastRun: '1 day ago' },
];

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 100;
  const h = 40;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * h * 0.8 - 4;
    return `${x},${y}`;
  });

  return (
    <svg width={w} height={h} style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id={`sg-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline
        points={pts.join(' ')}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="animate-sparkline"
      />
    </svg>
  );
}

export function Performance() {
  const [screen, setScreen] = useState<Screen>('overview');
  const [ramBefore, setRamBefore] = useState(12400);
  const [ramAfter, setRamAfter] = useState<number | null>(null);
  const [runningTasks, setRunningTasks] = useState<Set<string>>(new Set());
  const [doneTasks, setDoneTasks] = useState<Set<string>>(new Set());
  const [forceQuit, setForceQuit] = useState<string | null>(null);

  const freeRam = () => {
    // simulate
    setTimeout(() => {
      setRamAfter(8200);
      setScreen('ram-freed');
    }, 1000);
  };

  const runTask = (id: string) => {
    setRunningTasks(prev => new Set([...prev, id]));
    setTimeout(() => {
      setRunningTasks(prev => { const s = new Set(prev); s.delete(id); return s; });
      setDoneTasks(prev => new Set([...prev, id]));
    }, 1500);
  };

  // ─── RAM Freed ─────────────────────────────────────────────
  if (screen === 'ram-freed') {
    const freed = ramBefore - (ramAfter ?? ramBefore);
    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(10,18,28,0.9)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          fontFamily: 'var(--font-text)',
        }}
      >
        <div
          className="animate-scale-in"
          style={{
            background: '#1C2E3E',
            borderRadius: 20,
            padding: '40px 48px',
            textAlign: 'center',
            width: 460,
            border: '1px solid rgba(46,156,106,0.2)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
          }}
        >
          <div style={{ fontSize: 48 }}>🚀</div>
          <div style={{ color: '#2E9C6A', fontSize: 48, fontWeight: 700, fontFamily: 'var(--font-display)', lineHeight: 1, marginTop: 8 }}>
            {(freed / 1024).toFixed(1)} GB
          </div>
          <div style={{ color: '#FFFFFF', fontSize: 16, fontWeight: 600, marginTop: 6 }}>RAM Freed</div>

          {/* Before/After bars */}
          <div style={{ marginTop: 24, textAlign: 'left' }}>
            {[
              { label: 'Before', value: ramBefore, max: 16384, color: '#E07A30' },
              { label: 'After', value: ramAfter ?? ramBefore, max: 16384, color: '#2E9C6A' },
            ].map(bar => (
              <div key={bar.label} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ color: '#8BA8BE', fontSize: 12 }}>{bar.label}</span>
                  <span style={{ color: '#FFFFFF', fontSize: 12, fontWeight: 500 }}>
                    {(bar.value / 1024).toFixed(1)} GB / 16 GB
                  </span>
                </div>
                <div style={{ height: 10, borderRadius: 5, background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${(bar.value / bar.max) * 100}%`,
                      background: bar.color,
                      borderRadius: 5,
                      transition: 'width 0.8s ease',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => setScreen('overview')}
            style={{
              marginTop: 24,
              width: '100%',
              height: 44,
              borderRadius: 12,
              background: '#2E9C6A',
              border: 'none',
              color: '#FFFFFF',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'var(--font-text)',
              boxShadow: '0 0 16px rgba(46,156,106,0.3)',
            }}
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  // ─── Overview ──────────────────────────────────────────────
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', fontFamily: 'var(--font-text)' }}>
      <ModuleHeader
        icon={Zap}
        iconColor="#E07A30"
        title="Performance"
        subtitle="CPU, RAM, disk usage and optimization tools"
        ctaLabel="Free RAM"
        onCta={freeRam}
        secondaryLabel="Settings"
      />
      <div className="dark-scroll" style={{ flex: 1, overflowY: 'auto', padding: 28 }}>
        {/* Metric Widgets */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 28 }}>
          {metricWidgets.map((widget, i) => (
            <div
              key={widget.id}
              className={`animate-stagger-${i + 1}`}
              style={{
                padding: '16px',
                borderRadius: 12,
                background: '#1C2E3E',
                border: '1px solid rgba(255,255,255,0.06)',
                boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 16 }}>{widget.icon}</span>
                <span style={{ color: '#8BA8BE', fontSize: 11 }}>{widget.label}</span>
              </div>
              <div style={{ color: '#FFFFFF', fontSize: 22, fontWeight: 700, fontFamily: 'var(--font-display)', lineHeight: 1 }}>
                {widget.value}
                <span style={{ color: '#8BA8BE', fontSize: 12, fontWeight: 400 }}>{widget.unit}</span>
              </div>
              <Sparkline data={widget.data} color={widget.color} />
            </div>
          ))}
        </div>

        {/* Process Table */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ color: '#8BA8BE', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
            Top CPU Consumers
          </div>
          <div
            style={{
              background: '#1C2E3E',
              borderRadius: 12,
              border: '1px solid rgba(255,255,255,0.06)',
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 80px 100px 80px',
                padding: '8px 16px',
                background: 'rgba(255,255,255,0.03)',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              {['Process', 'CPU', 'Memory', ''].map(h => (
                <div key={h} style={{ color: '#4A6070', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  {h}
                </div>
              ))}
            </div>

            {processes.map((proc, i) => (
              <div
                key={proc.pid}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 80px 100px 80px',
                  padding: '10px 16px',
                  borderBottom: i < processes.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                  alignItems: 'center',
                  transition: 'background 0.1s',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 20 }}>{proc.icon}</span>
                  <div>
                    <div style={{ color: '#FFFFFF', fontSize: 13, fontWeight: 500 }}>{proc.name}</div>
                    <div style={{ color: '#4A6070', fontSize: 10, fontFamily: 'var(--font-mono)' }}>PID {proc.pid}</div>
                  </div>
                </div>
                <div style={{ color: parseFloat(proc.cpu) > 20 ? '#E07A30' : '#FFFFFF', fontSize: 13, fontWeight: 500 }}>
                  {proc.cpu}
                </div>
                <div style={{ color: '#8BA8BE', fontSize: 13 }}>{proc.ram}</div>
                <button
                  onClick={() => setForceQuit(proc.name)}
                  style={{
                    height: 26,
                    padding: '0 10px',
                    borderRadius: 6,
                    background: forceQuit === proc.name ? 'rgba(224,82,82,0.15)' : 'transparent',
                    border: `1px solid ${forceQuit === proc.name ? 'rgba(224,82,82,0.3)' : 'rgba(255,255,255,0.08)'}`,
                    color: '#E05252',
                    fontSize: 11,
                    cursor: 'pointer',
                    fontFamily: 'var(--font-text)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  <X size={11} />
                  Quit
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Maintenance Tasks */}
        <div>
          <div style={{ color: '#8BA8BE', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
            Maintenance Tasks
          </div>
          {maintenanceTasks.map(task => {
            const isRunning = runningTasks.has(task.id);
            const isDone = doneTasks.has(task.id);
            return (
              <div
                key={task.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  padding: '14px 16px',
                  borderRadius: 12,
                  background: isDone ? 'rgba(46,156,106,0.04)' : '#1C2E3E',
                  border: `1px solid ${isDone ? 'rgba(46,156,106,0.15)' : 'rgba(255,255,255,0.06)'}`,
                  marginBottom: 8,
                  transition: 'all 0.2s',
                }}
              >
                <span style={{ fontSize: 24 }}>{task.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ color: isDone ? '#3CB875' : '#FFFFFF', fontSize: 13, fontWeight: 500 }}>{task.name}</div>
                  <div style={{ color: '#8BA8BE', fontSize: 11, marginTop: 2 }}>{task.desc}</div>
                  <div style={{ color: '#4A6070', fontSize: 10, marginTop: 2 }}>Last run: {task.lastRun}</div>
                </div>
                {isDone ? (
                  <CheckCircle2 size={22} style={{ color: '#3CB875', flexShrink: 0 }} />
                ) : (
                  <button
                    onClick={() => runTask(task.id)}
                    disabled={isRunning}
                    style={{
                      height: 32,
                      padding: '0 14px',
                      borderRadius: 8,
                      background: isRunning ? 'rgba(26,107,154,0.15)' : '#1A6B9A',
                      border: 'none',
                      color: isRunning ? '#4A6070' : '#FFFFFF',
                      fontSize: 12,
                      fontWeight: 500,
                      cursor: isRunning ? 'wait' : 'pointer',
                      fontFamily: 'var(--font-text)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      flexShrink: 0,
                      transition: 'all 0.15s',
                    }}
                  >
                    {isRunning ? (
                      <>
                        <div className="animate-spin-slow" style={{ width: 12, height: 12, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.2)', borderTop: '2px solid #fff' }} />
                        Running...
                      </>
                    ) : (
                      <>
                        <Play size={12} />
                        Run
                      </>
                    )}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
