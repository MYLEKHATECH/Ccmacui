import { useState, useEffect } from 'react';
import { Sparkles, CheckCircle2, X, RotateCcw, ChevronRight } from 'lucide-react';
import { ModuleHeader } from '../components/ModuleHeader';
import { CircularProgressRing } from '../components/CircularProgressRing';
import { ScanProgressBar } from '../components/ScanProgressBar';
import { ConfettiCanvas } from '../components/ConfettiCanvas';

type Screen = 'welcome' | 'scanning' | 'results' | 'cleaning' | 'complete';

const scanTasks = [
  { id: 'cleanup', label: 'System Junk', icon: '🧹', color: '#4DA6D8', result: '2.3 GB' },
  { id: 'protection', label: 'Malware Scan', icon: '🛡️', color: '#E05252', result: 'No threats' },
  { id: 'performance', label: 'Performance', icon: '⚡', color: '#E07A30', result: 'Optimized' },
  { id: 'apps', label: 'Applications', icon: '📦', color: '#3CB875', result: '840 MB' },
  { id: 'clutter', label: 'My Clutter', icon: '🗂️', color: '#E0A030', result: '1.2 GB' },
];

const resultTiles = [
  {
    id: 'cleanup',
    category: 'Cleanup',
    icon: '🧹',
    color: '#4DA6D8',
    size: '2.31 GB',
    count: '1,234 files',
    files: ['/Library/Caches/com.apple.Safari', '/System/Library/Caches/data', '/var/folders/tmp'],
    selected: true,
  },
  {
    id: 'protection',
    category: 'Protection',
    icon: '🛡️',
    color: '#3CB875',
    size: 'Clean',
    count: '0 threats',
    files: ['No malware found', 'All extensions safe', 'Privacy clean'],
    selected: false,
  },
  {
    id: 'performance',
    category: 'Performance',
    icon: '⚡',
    color: '#E07A30',
    size: '840 MB',
    count: '3 tasks',
    files: ['/Library/LaunchAgents/com.app', 'Flush DNS cache', 'Rebuild Spotlight index'],
    selected: true,
  },
  {
    id: 'apps',
    category: 'Applications',
    icon: '📦',
    color: '#3CB875',
    size: '1.84 GB',
    count: '4 leftover bundles',
    files: ['~/Library/App Support/Skype', '/Users/alex/Downloads/Installers', '~/Library/App Support/Slack'],
    selected: true,
  },
  {
    id: 'clutter',
    category: 'My Clutter',
    icon: '🗂️',
    color: '#E0A030',
    size: '1.18 GB',
    count: '847 duplicates',
    files: ['~/Pictures/Duplicates', '~/Downloads/old files', '~/Desktop/screenshots'],
    selected: true,
  },
];

export function SmartCare() {
  const [screen, setScreen] = useState<Screen>('welcome');
  const [scanProgress, setScanProgress] = useState(0);
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());
  const [currentTask, setCurrentTask] = useState(0);
  const [cleanProgress, setCleanProgress] = useState(0);
  const [selected, setSelected] = useState<Set<string>>(new Set(resultTiles.filter(t => t.selected).map(t => t.id)));

  // Scanning simulation
  useEffect(() => {
    if (screen !== 'scanning') return;
    const interval = setInterval(() => {
      setScanProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(() => setScreen('results'), 400);
          return 100;
        }
        const next = p + 2.5;
        const taskIdx = Math.floor((next / 100) * scanTasks.length);
        setCurrentTask(Math.min(taskIdx, scanTasks.length - 1));
        if (taskIdx > 0) {
          setCompletedTasks(prev => {
            const s = new Set(prev);
            for (let i = 0; i < taskIdx; i++) s.add(scanTasks[i].id);
            return s;
          });
        }
        return next;
      });
    }, 80);
    return () => clearInterval(interval);
  }, [screen]);

  // Cleaning simulation
  useEffect(() => {
    if (screen !== 'cleaning') return;
    const interval = setInterval(() => {
      setCleanProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(() => setScreen('complete'), 400);
          return 100;
        }
        return p + 3.3;
      });
    }, 60);
    return () => clearInterval(interval);
  }, [screen]);

  const toggleSelect = (id: string) => {
    setSelected(prev => {
      const s = new Set(prev);
      if (s.has(id)) s.delete(id);
      else s.add(id);
      return s;
    });
  };

  const selectedSize = resultTiles.filter(t => selected.has(t.id)).reduce((acc, t) => {
    const n = parseFloat(t.size);
    return isNaN(n) ? acc : acc + n;
  }, 0);

  const startOver = () => {
    setScreen('welcome');
    setScanProgress(0);
    setCompletedTasks(new Set());
    setCurrentTask(0);
    setCleanProgress(0);
    setSelected(new Set(resultTiles.filter(t => t.selected).map(t => t.id)));
  };

  // ─── Welcome ─────────────────────────────────────────────
  if (screen === 'welcome') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
        <ModuleHeader
          icon={Sparkles}
          iconColor="#2E9C6A"
          title="Smart Care"
          subtitle="Complete Mac health check — one click, full results"
          ctaLabel="Run Smart Care"
          onCta={() => setScreen('scanning')}
          secondaryLabel="Settings"
        />
        <div
          className="dark-scroll"
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: 28,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {/* Health Ring */}
          <div className="animate-fade-slide-up" style={{ textAlign: 'center', marginBottom: 32 }}>
            <CircularProgressRing size={180} value={88} label="Health Score" sublabel="Excellent" color="#2E9C6A" />
            <div style={{ marginTop: 12 }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '4px 14px',
                  borderRadius: 20,
                  background: 'rgba(46,156,106,0.12)',
                  border: '1px solid rgba(46,156,106,0.3)',
                  color: '#2E9C6A',
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                ✨ Excellent
              </span>
            </div>
            <p style={{ color: '#8BA8BE', fontSize: 12, marginTop: 8 }}>
              Last scan: Yesterday at 2:34 PM
            </p>
          </div>

          {/* Stats Row */}
          <div style={{ display: 'flex', gap: 16, marginBottom: 32, width: '100%', maxWidth: 640 }}>
            {[
              { label: 'Junk Found', value: '4.5 GB', icon: '🧹', color: '#4DA6D8' },
              { label: 'Threats', value: '0', icon: '🛡️', color: '#3CB875' },
              { label: 'Perf Score', value: '94 / 100', icon: '⚡', color: '#E07A30' },
            ].map((stat, i) => (
              <div
                key={stat.label}
                className={`animate-stagger-${i + 1}`}
                style={{
                  flex: 1,
                  padding: '16px 20px',
                  borderRadius: 12,
                  background: '#1C2E3E',
                  border: '1px solid rgba(255,255,255,0.06)',
                  textAlign: 'center',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
                }}
              >
                <div style={{ fontSize: 24, marginBottom: 6 }}>{stat.icon}</div>
                <div
                  style={{
                    color: stat.color,
                    fontSize: 20,
                    fontWeight: 700,
                    fontFamily: 'var(--font-display)',
                  }}
                >
                  {stat.value}
                </div>
                <div style={{ color: '#8BA8BE', fontSize: 11, marginTop: 2 }}>{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Module Status Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, 1fr)',
              gap: 12,
              width: '100%',
              maxWidth: 700,
            }}
          >
            {scanTasks.map((task, i) => (
              <div
                key={task.id}
                className={`animate-stagger-${Math.min(i + 1, 5)}`}
                style={{
                  padding: '16px 12px',
                  borderRadius: 12,
                  background: '#1C2E3E',
                  border: '1px solid rgba(255,255,255,0.06)',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: 28, marginBottom: 8 }}>{task.icon}</div>
                <div style={{ color: '#FFFFFF', fontSize: 12, fontWeight: 500, marginBottom: 4 }}>
                  {task.label}
                </div>
                <div style={{ color: task.color, fontSize: 11 }}>{task.result}</div>
              </div>
            ))}
          </div>

          {/* Main CTA */}
          <button
            onClick={() => setScreen('scanning')}
            style={{
              marginTop: 36,
              width: 260,
              height: 52,
              borderRadius: 14,
              background: 'linear-gradient(135deg, #2E9C6A, #35B57A)',
              border: 'none',
              color: '#FFFFFF',
              fontSize: 16,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              boxShadow: '0 0 24px rgba(46,156,106,0.35)',
              fontFamily: 'var(--font-text)',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
            onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
          >
            <Sparkles size={18} />
            Run Smart Care
          </button>
        </div>
      </div>
    );
  }

  // ─── Scanning ─────────────────────────────────────────────
  if (screen === 'scanning') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
        <ModuleHeader
          icon={Sparkles}
          iconColor="#2E9C6A"
          title="Smart Care"
          subtitle="Scanning your Mac..."
          ctaVariant="scanning"
          ctaLabel="Scanning…"
        />
        <div
          className="dark-scroll"
          style={{ flex: 1, overflowY: 'auto', padding: 28 }}
        >
          {/* Overall Progress */}
          <div
            style={{
              marginBottom: 28,
              padding: '20px 24px',
              background: '#1C2E3E',
              borderRadius: 14,
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <ScanProgressBar value={scanProgress} />
            <div style={{ color: '#8BA8BE', fontSize: 12, marginTop: 8, textAlign: 'right' }}>
              Est. 30 seconds remaining
            </div>
          </div>

          {/* Task Tiles */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 12,
            }}
          >
            {scanTasks.map((task, i) => {
              const isDone = completedTasks.has(task.id);
              const isActive = i === currentTask && !isDone;
              return (
                <div
                  key={task.id}
                  style={{
                    padding: '20px',
                    borderRadius: 14,
                    background: isDone ? 'rgba(46,156,106,0.06)' : '#1C2E3E',
                    border: `1px solid ${isDone ? 'rgba(46,156,106,0.2)' : isActive ? `${task.color}40` : 'rgba(255,255,255,0.06)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    boxShadow: isDone ? 'none' : isActive ? `0 0 16px ${task.color}20` : 'none',
                    transition: 'all 0.3s',
                  }}
                >
                  <div style={{ fontSize: 36 }}>{task.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: '#FFFFFF', fontSize: 14, fontWeight: 500, marginBottom: 4 }}>
                      {task.label}
                    </div>
                    <div style={{ color: isDone ? '#3CB875' : isActive ? task.color : '#8BA8BE', fontSize: 12 }}>
                      {isDone ? `✓ ${task.result}` : isActive ? 'Scanning...' : 'Waiting'}
                    </div>
                    {isActive && (
                      <div style={{ marginTop: 8 }}>
                        <div
                          style={{
                            height: 4,
                            borderRadius: 2,
                            background: 'rgba(255,255,255,0.08)',
                            overflow: 'hidden',
                          }}
                        >
                          <div
                            className="animate-shimmer"
                            style={{
                              height: '100%',
                              width: '60%',
                              background: `linear-gradient(90deg, ${task.color}, ${task.color}aa)`,
                              borderRadius: 2,
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  {isDone && (
                    <CheckCircle2 size={22} style={{ color: '#3CB875', flexShrink: 0 }} />
                  )}
                  {isActive && (
                    <div
                      className="animate-spin-slow"
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: '50%',
                        border: `2px solid ${task.color}30`,
                        borderTop: `2px solid ${task.color}`,
                        flexShrink: 0,
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Cancel */}
          <div style={{ textAlign: 'right', marginTop: 20 }}>
            <button
              onClick={startOver}
              style={{
                height: 36,
                padding: '0 18px',
                borderRadius: 10,
                background: 'transparent',
                border: '1px solid #1A6B9A',
                color: '#4DA6D8',
                fontSize: 13,
                cursor: 'pointer',
                fontFamily: 'var(--font-text)',
              }}
            >
              Cancel Scan
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── Results ─────────────────────────────────────────────
  if (screen === 'results') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', position: 'relative' }}>
        <ModuleHeader
          icon={Sparkles}
          iconColor="#2E9C6A"
          title="Smart Care"
          subtitle="Scan complete — review and clean"
          ctaLabel="Run Again"
          onCta={() => { startOver(); setScreen('scanning'); }}
          secondaryLabel="Settings"
        />
        <div className="dark-scroll" style={{ flex: 1, overflowY: 'auto', padding: 28 }}>
          {/* Summary Hero */}
          <div
            className="animate-fade-slide-up"
            style={{
              textAlign: 'center',
              marginBottom: 28,
              padding: '24px',
              background: 'linear-gradient(135deg, rgba(46,156,106,0.08), rgba(26,107,154,0.08))',
              borderRadius: 16,
              border: '1px solid rgba(46,156,106,0.15)',
            }}
          >
            <div
              style={{
                fontSize: 52,
                fontWeight: 700,
                color: '#2E9C6A',
                fontFamily: 'var(--font-display)',
                lineHeight: 1,
              }}
            >
              5.53 GB
            </div>
            <div style={{ color: '#8BA8BE', fontSize: 14, marginTop: 6 }}>can be cleaned from your Mac</div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12, gap: 8 }}>
              <button
                onClick={() => setSelected(new Set(resultTiles.map(t => t.id)))}
                style={{ background: 'none', border: 'none', color: '#4DA6D8', fontSize: 12, cursor: 'pointer' }}
              >
                Select All
              </button>
              <span style={{ color: '#4A6070' }}>·</span>
              <button
                onClick={() => setSelected(new Set())}
                style={{ background: 'none', border: 'none', color: '#4DA6D8', fontSize: 12, cursor: 'pointer' }}
              >
                Deselect All
              </button>
            </div>
          </div>

          {/* Result Tiles Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 12,
              marginBottom: 100,
            }}
          >
            {resultTiles.map((tile, i) => {
              const isSelected = selected.has(tile.id);
              return (
                <div
                  key={tile.id}
                  className={`animate-stagger-${Math.min(i + 1, 5)}`}
                  onClick={() => toggleSelect(tile.id)}
                  style={{
                    padding: '18px',
                    borderRadius: 14,
                    background: isSelected ? '#1C2E3E' : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${isSelected ? `${tile.color}30` : 'rgba(255,255,255,0.06)'}`,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    opacity: isSelected ? 1 : 0.55,
                    boxShadow: isSelected ? `0 4px 16px rgba(0,0,0,0.25)` : 'none',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: 26 }}>{tile.icon}</span>
                      <div>
                        <div style={{ color: '#FFFFFF', fontSize: 14, fontWeight: 600 }}>{tile.category}</div>
                        <div style={{ color: '#8BA8BE', fontSize: 11 }}>{tile.count}</div>
                      </div>
                    </div>
                    <div
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: 6,
                        border: `2px solid ${isSelected ? tile.color : 'rgba(255,255,255,0.2)'}`,
                        background: isSelected ? tile.color : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        transition: 'all 0.15s',
                      }}
                    >
                      {isSelected && <CheckCircle2 size={13} color="#fff" />}
                    </div>
                  </div>

                  {/* File paths preview */}
                  <div style={{ marginBottom: 12 }}>
                    {tile.files.map((f, fi) => (
                      <div
                        key={fi}
                        style={{
                          color: '#4A6070',
                          fontSize: 10,
                          fontFamily: 'var(--font-mono)',
                          padding: '2px 0',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {f}
                      </div>
                    ))}
                  </div>

                  {/* Size */}
                  <div
                    style={{
                      color: isSelected ? tile.color : '#8BA8BE',
                      fontSize: 22,
                      fontWeight: 700,
                      fontFamily: 'var(--font-display)',
                    }}
                  >
                    {tile.size}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sticky Action Bar */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '16px 28px',
            background: 'linear-gradient(0deg, #0F1B26 70%, transparent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ color: '#8BA8BE', fontSize: 13 }}>
            <span style={{ color: '#FFFFFF', fontWeight: 600 }}>{selected.size} categories</span> selected
            {selectedSize > 0 && (
              <span style={{ color: '#2E9C6A', marginLeft: 8 }}>· {selectedSize.toFixed(2)} GB to free</span>
            )}
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={() => {}}
              style={{
                height: 40,
                padding: '0 18px',
                borderRadius: 10,
                background: 'transparent',
                border: '1px solid #1A6B9A',
                color: '#4DA6D8',
                fontSize: 13,
                cursor: 'pointer',
                fontFamily: 'var(--font-text)',
              }}
            >
              Review Details
            </button>
            <button
              onClick={() => setScreen('cleaning')}
              disabled={selected.size === 0}
              style={{
                height: 40,
                padding: '0 24px',
                borderRadius: 10,
                background: selected.size > 0 ? '#2E9C6A' : 'rgba(255,255,255,0.08)',
                border: 'none',
                color: selected.size > 0 ? '#FFFFFF' : 'rgba(255,255,255,0.3)',
                fontSize: 13,
                fontWeight: 600,
                cursor: selected.size > 0 ? 'pointer' : 'not-allowed',
                fontFamily: 'var(--font-text)',
                boxShadow: selected.size > 0 ? '0 0 16px rgba(46,156,106,0.3)' : 'none',
              }}
            >
              Clean {selectedSize > 0 ? `${selectedSize.toFixed(1)} GB` : ''}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── Cleaning ─────────────────────────────────────────────
  if (screen === 'cleaning') {
    const paths = [
      '/Library/Caches/com.apple.Safari/WebKitCache',
      '/var/folders/tmpfiles/TemporaryItems',
      '/Users/alex/Library/Caches/Metadata',
      '/System/Library/Caches/com.apple.ATS',
      '/Library/Application Support/Adobe/Cache',
    ];
    const idx = Math.floor((cleanProgress / 100) * paths.length);
    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(10,18,28,0.92)',
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
            width: 440,
            border: '1px solid rgba(46,156,106,0.2)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
          }}
        >
          <CircularProgressRing size={140} value={cleanProgress} label="Cleaning" color="#2E9C6A" animate={false} />
          <div style={{ marginTop: 24, color: '#FFFFFF', fontSize: 18, fontWeight: 600 }}>
            Cleaning your Mac...
          </div>
          <div
            style={{
              marginTop: 8,
              color: '#4A6070',
              fontSize: 11,
              fontFamily: 'var(--font-mono)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {paths[Math.min(idx, paths.length - 1)]}
          </div>
          <div style={{ marginTop: 20 }}>
            <ScanProgressBar value={cleanProgress} variant="scanning" showLabel={false} />
          </div>
        </div>
      </div>
    );
  }

  // ─── Complete ─────────────────────────────────────────────
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <ModuleHeader
        icon={Sparkles}
        iconColor="#2E9C6A"
        title="Smart Care"
        subtitle="Cleaning complete!"
        ctaLabel="Run Again"
        onCta={startOver}
      />
      <div
        className="dark-scroll"
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: 28,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Celebration */}
        <div
          className="animate-fade-slide-up"
          style={{
            textAlign: 'center',
            marginBottom: 36,
            padding: '32px 40px',
            background: 'linear-gradient(135deg, rgba(46,156,106,0.1), rgba(26,107,154,0.1))',
            borderRadius: 20,
            border: '1px solid rgba(46,156,106,0.2)',
            width: '100%',
            maxWidth: 520,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Confetti dots */}
          <ConfettiCanvas />

          <div style={{ fontSize: 48 }}>🎉</div>
          <div
            style={{
              fontSize: 56,
              fontWeight: 700,
              color: '#2E9C6A',
              fontFamily: 'var(--font-display)',
              lineHeight: 1,
              marginTop: 8,
            }}
          >
            5.53 GB
          </div>
          <div style={{ color: '#8BA8BE', fontSize: 16, marginTop: 6, fontWeight: 500 }}>
            Freed from your Mac
          </div>
          <div style={{ color: '#4A6070', fontSize: 12, marginTop: 4 }}>
            Your Mac is now running at peak performance
          </div>
        </div>

        {/* Stats */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 12,
            width: '100%',
            maxWidth: 620,
            marginBottom: 32,
          }}
        >
          {[
            { label: 'Junk Removed', value: '3.2 GB', icon: '🧹', color: '#4DA6D8' },
            { label: 'Threats Removed', value: '0', icon: '🛡️', color: '#3CB875' },
            { label: 'Apps Updated', value: '3', icon: '📦', color: '#E07A30' },
            { label: 'Duplicates', value: '847', icon: '🗂️', color: '#7B52C8' },
          ].map((s, i) => (
            <div
              key={s.label}
              className={`animate-stagger-${i + 1}`}
              style={{
                padding: '16px',
                borderRadius: 12,
                background: '#1C2E3E',
                border: '1px solid rgba(255,255,255,0.06)',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: 22, marginBottom: 6 }}>{s.icon}</div>
              <div style={{ color: s.color, fontSize: 18, fontWeight: 700, fontFamily: 'var(--font-display)' }}>
                {s.value}
              </div>
              <div style={{ color: '#8BA8BE', fontSize: 10, marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: 12 }}>
          <button
            onClick={startOver}
            style={{
              height: 44,
              padding: '0 28px',
              borderRadius: 12,
              background: '#2E9C6A',
              border: 'none',
              color: '#FFFFFF',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'var(--font-text)',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              boxShadow: '0 0 16px rgba(46,156,106,0.3)',
            }}
          >
            <RotateCcw size={16} />
            Done
          </button>
          <button
            onClick={() => setScreen('results')}
            style={{
              height: 44,
              padding: '0 22px',
              borderRadius: 12,
              background: 'transparent',
              border: '1px solid #1A6B9A',
              color: '#4DA6D8',
              fontSize: 14,
              cursor: 'pointer',
              fontFamily: 'var(--font-text)',
            }}
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}