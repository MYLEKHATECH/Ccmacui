import { useState } from 'react';
import { Bot, Sparkles, X, Check, ChevronRight, AlertTriangle, Shield, HardDrive, Zap, RefreshCw } from 'lucide-react';
import { ModuleHeader } from '../components/ModuleHeader';
import { CircularProgressRing } from '../components/CircularProgressRing';

type Screen = 'health' | 'insights';
type Priority = 'high' | 'medium' | 'low';

const healthCategories = [
  { label: 'Disk Health', icon: HardDrive, score: 92, color: '#2E9C6A', bar: 0.92 },
  { label: 'Security', icon: Shield, score: 88, color: '#4DA6D8', bar: 0.88 },
  { label: 'Performance', icon: Zap, score: 76, color: '#E07A30', bar: 0.76 },
  { label: 'Updates', icon: RefreshCw, score: 65, color: '#E05252', bar: 0.65 },
];

const recommendations = [
  {
    id: 'r1',
    icon: '🔄',
    title: 'Update 4 apps',
    desc: 'Xcode, Chrome, Figma, and Slack have pending updates with security patches.',
    priority: 'high' as Priority,
    action: 'Update Now',
  },
  {
    id: 'r2',
    icon: '🧹',
    title: 'Clean system caches',
    desc: '3.2 GB of system caches have accumulated since the last cleanup.',
    priority: 'medium' as Priority,
    action: 'Clean Now',
  },
  {
    id: 'r3',
    icon: '🔋',
    title: 'Optimize battery health',
    desc: 'Several background processes are consuming excessive power.',
    priority: 'medium' as Priority,
    action: 'Optimize',
  },
  {
    id: 'r4',
    icon: '🔒',
    title: 'Review app permissions',
    desc: '3 apps have been granted permissions they haven\'t used in over 60 days.',
    priority: 'low' as Priority,
    action: 'Review',
  },
  {
    id: 'r5',
    icon: '📊',
    title: 'Free up startup items',
    desc: '8 apps launch at startup — most aren\'t needed until you open them.',
    priority: 'low' as Priority,
    action: 'Manage',
  },
];

const insightContent = {
  title: 'System Cache Files',
  explanation: `System cache files are created by macOS and your applications to speed things up. When you launch Safari, for example, it saves website data, images, and scripts locally so pages load faster next time.

Over time these caches grow large — often several gigabytes — even though macOS is supposed to clear them automatically. The good news: it's completely safe to delete them. If anything needs the data again, it just rebuilds the cache.`,
  safeToDelete: true,
  size: '3.2 GB',
  fileType: 'System & App Caches',
};

const priorityConfig: Record<Priority, { color: string; bg: string; border: string; label: string }> = {
  high: { color: '#E05252', bg: 'rgba(224,82,82,0.1)', border: 'rgba(224,82,82,0.25)', label: 'High' },
  medium: { color: '#E07A30', bg: 'rgba(224,122,48,0.1)', border: 'rgba(224,122,48,0.25)', label: 'Medium' },
  low: { color: '#4DA6D8', bg: 'rgba(77,166,216,0.1)', border: 'rgba(77,166,216,0.25)', label: 'Low' },
};

export function AIAssistant() {
  const [screen, setScreen] = useState<Screen>('health');
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [done, setDone] = useState<Set<string>>(new Set());

  const overallScore = 82;
  const visibleRecs = recommendations.filter(r => !dismissed.has(r.id) && !done.has(r.id));

  // ─── Health Dashboard ──────────────────────────────────────
  if (screen === 'health') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', fontFamily: 'var(--font-text)' }}>
        <ModuleHeader
          icon={Bot}
          iconColor="#7B52C8"
          title="AI Assistant"
          subtitle="Mac health analysis & smart recommendations"
          ctaLabel="Smart Insights"
          onCta={() => setScreen('insights')}
          secondaryLabel="Settings"
        />
        <div className="dark-scroll" style={{ flex: 1, overflowY: 'auto', padding: 28 }}>
          {/* Health Score Ring */}
          <div
            className="animate-fade-slide-up"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              marginBottom: 32,
            }}
          >
            <div style={{ position: 'relative' }}>
              <CircularProgressRing
                size={200}
                value={overallScore}
                label="Health Score"
                sublabel="Good"
                color="#7B52C8"
              />
              {/* AI Badge */}
              <div
                style={{
                  position: 'absolute',
                  top: -8,
                  right: -8,
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #7B52C8, #4DA6D8)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid #0F1B26',
                  boxShadow: '0 0 12px rgba(123,82,200,0.4)',
                }}
              >
                <Sparkles size={14} color="#fff" />
              </div>
            </div>
            <p style={{ color: '#8BA8BE', fontSize: 12, marginTop: 12, textAlign: 'center' }}>
              Last analyzed: Today at 11:42 AM
            </p>
          </div>

          {/* Health Category Cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 12,
              marginBottom: 32,
              maxWidth: 640,
            }}
          >
            {healthCategories.map((cat, i) => {
              const Icon = cat.icon;
              return (
                <div
                  key={cat.label}
                  className={`animate-stagger-${i + 1}`}
                  style={{
                    padding: '16px',
                    borderRadius: 14,
                    background: '#1C2E3E',
                    border: '1px solid rgba(255,255,255,0.06)',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                    <div
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: 10,
                        background: `${cat.color}15`,
                        border: `1px solid ${cat.color}30`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Icon size={18} style={{ color: cat.color }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ color: '#FFFFFF', fontSize: 13, fontWeight: 500 }}>{cat.label}</div>
                      <div style={{ color: cat.color, fontSize: 11, fontWeight: 600 }}>{cat.score}/100</div>
                    </div>
                  </div>
                  {/* Score Bar */}
                  <div style={{ height: 5, borderRadius: 3, background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${cat.bar * 100}%`,
                        background: cat.color,
                        borderRadius: 3,
                        transition: 'width 1s ease',
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Recommendations */}
          <div style={{ maxWidth: 640 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ color: '#8BA8BE', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Recommendations ({visibleRecs.length})
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  padding: '3px 10px',
                  borderRadius: 20,
                  background: 'rgba(123,82,200,0.1)',
                  border: '1px solid rgba(123,82,200,0.2)',
                }}
              >
                <Sparkles size={11} style={{ color: '#7B52C8' }} />
                <span style={{ color: '#7B52C8', fontSize: 10, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>AI Powered</span>
              </div>
            </div>

            {visibleRecs.length === 0 ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '32px',
                  borderRadius: 14,
                  background: 'rgba(46,156,106,0.05)',
                  border: '1px solid rgba(46,156,106,0.15)',
                }}
              >
                <div style={{ fontSize: 36 }}>✅</div>
                <div style={{ color: '#3CB875', fontSize: 15, fontWeight: 600, marginTop: 8 }}>All recommendations resolved!</div>
                <div style={{ color: '#8BA8BE', fontSize: 12, marginTop: 4 }}>Your Mac is in great shape.</div>
              </div>
            ) : (
              visibleRecs.map(rec => {
                const pc = priorityConfig[rec.priority];
                return (
                  <div
                    key={rec.id}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 12,
                      padding: '14px 16px',
                      borderRadius: 12,
                      background: '#1C2E3E',
                      border: '1px solid rgba(255,255,255,0.06)',
                      marginBottom: 8,
                      transition: 'all 0.2s',
                    }}
                  >
                    <span style={{ fontSize: 26, flexShrink: 0, marginTop: 2 }}>{rec.icon}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <span style={{ color: '#FFFFFF', fontSize: 13, fontWeight: 600 }}>{rec.title}</span>
                        <span
                          style={{
                            fontSize: 9,
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: '0.06em',
                            color: pc.color,
                            background: pc.bg,
                            border: `1px solid ${pc.border}`,
                            borderRadius: 4,
                            padding: '2px 5px',
                          }}
                        >
                          {pc.label}
                        </span>
                      </div>
                      <div style={{ color: '#8BA8BE', fontSize: 12, lineHeight: 1.5 }}>{rec.desc}</div>
                    </div>
                    <div style={{ display: 'flex', gap: 6, flexShrink: 0, marginTop: 2 }}>
                      <button
                        onClick={() => setDone(prev => new Set([...prev, rec.id]))}
                        style={{
                          height: 30,
                          padding: '0 12px',
                          borderRadius: 8,
                          background: '#2E9C6A',
                          border: 'none',
                          color: '#FFFFFF',
                          fontSize: 11,
                          fontWeight: 600,
                          cursor: 'pointer',
                          fontFamily: 'var(--font-text)',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {rec.action}
                      </button>
                      <button
                        onClick={() => setDismissed(prev => new Set([...prev, rec.id]))}
                        style={{
                          width: 30,
                          height: 30,
                          borderRadius: 8,
                          background: 'transparent',
                          border: '1px solid rgba(255,255,255,0.08)',
                          color: '#4A6070',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <X size={13} />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    );
  }

  // ─── Smart Insights Panel ─────────────────────────────────
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', fontFamily: 'var(--font-text)' }}>
      <ModuleHeader
        icon={Sparkles}
        iconColor="#7B52C8"
        title="Smart Insights"
        subtitle="AI-powered explanations for your Mac's file types"
        ctaLabel="Back to Health"
        onCta={() => setScreen('health')}
      />
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* File Type List (left side) */}
        <div
          className="dark-scroll"
          style={{
            width: 240,
            borderRight: '1px solid rgba(255,255,255,0.06)',
            overflowY: 'auto',
            padding: '16px 0',
          }}
        >
          <div style={{ padding: '0 16px', marginBottom: 8, color: '#4A6070', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
            File Types
          </div>
          {[
            { icon: '⚙️', name: 'System Cache', size: '3.2 GB', active: true },
            { icon: '📋', name: 'Log Files', size: '342 MB', active: false },
            { icon: '📦', name: 'App Leftovers', size: '1.8 GB', active: false },
            { icon: '🌐', name: 'Browser Data', size: '890 MB', active: false },
            { icon: '📧', name: 'Mail Cache', size: '1.1 GB', active: false },
            { icon: '🔨', name: 'Xcode Derived', size: '4.8 GB', active: false },
          ].map(item => (
            <div
              key={item.name}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 16px',
                cursor: 'pointer',
                background: item.active ? 'rgba(123,82,200,0.1)' : 'transparent',
                borderLeft: item.active ? '3px solid #7B52C8' : '3px solid transparent',
                transition: 'all 0.1s',
              }}
            >
              <span style={{ fontSize: 18 }}>{item.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ color: '#FFFFFF', fontSize: 12, fontWeight: 500 }}>{item.name}</div>
                <div style={{ color: '#8BA8BE', fontSize: 11 }}>{item.size}</div>
              </div>
              {item.active && <ChevronRight size={12} style={{ color: '#7B52C8' }} />}
            </div>
          ))}
        </div>

        {/* Right: Insights Panel */}
        <div
          className="animate-slide-in-right dark-scroll"
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '24px 28px',
            background: '#0D1922',
          }}
        >
          {/* AI Badge */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '5px 12px',
                borderRadius: 20,
                background: 'linear-gradient(135deg, rgba(123,82,200,0.2), rgba(77,166,216,0.2))',
                border: '1px solid rgba(123,82,200,0.3)',
              }}
            >
              <Sparkles size={12} style={{ color: '#7B52C8' }} />
              <span style={{ color: '#7B52C8', fontSize: 11, fontWeight: 700, letterSpacing: '0.04em' }}>
                Apple Intelligence
              </span>
            </div>
          </div>

          {/* Title */}
          <h2 style={{ color: '#FFFFFF', fontSize: 22, fontWeight: 600, margin: '0 0 6px', fontFamily: 'var(--font-display)' }}>
            {insightContent.title}
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <span style={{ color: '#8BA8BE', fontSize: 12 }}>{insightContent.fileType}</span>
            <span
              style={{
                padding: '3px 10px',
                borderRadius: 6,
                background: insightContent.safeToDelete ? 'rgba(60,184,117,0.12)' : 'rgba(224,82,82,0.12)',
                border: `1px solid ${insightContent.safeToDelete ? 'rgba(60,184,117,0.25)' : 'rgba(224,82,82,0.25)'}`,
                color: insightContent.safeToDelete ? '#3CB875' : '#E05252',
                fontSize: 11,
                fontWeight: 700,
              }}
            >
              {insightContent.safeToDelete ? '✓ Safe to Delete' : '⚠ Review First'}
            </span>
            <span style={{ color: '#4DA6D8', fontSize: 12, fontWeight: 600 }}>{insightContent.size}</span>
          </div>

          {/* Explanation */}
          <div
            style={{
              color: '#FFFFFF',
              fontSize: 14,
              lineHeight: 1.8,
              whiteSpace: 'pre-line',
              marginBottom: 28,
            }}
          >
            {insightContent.explanation}
          </div>

          {/* Tip */}
          <div
            style={{
              padding: '14px 16px',
              borderRadius: 12,
              background: 'rgba(123,82,200,0.08)',
              border: '1px solid rgba(123,82,200,0.2)',
              marginBottom: 24,
            }}
          >
            <div style={{ color: '#7B52C8', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>
              💡 AI Tip
            </div>
            <div style={{ color: '#8BA8BE', fontSize: 12, lineHeight: 1.6 }}>
              Your cache is larger than average for a Mac with your usage pattern. Cleaning it regularly (monthly) can help keep your Mac running smoothly without accumulating large amounts over time.
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={() => {}}
              style={{
                height: 40,
                padding: '0 18px',
                borderRadius: 10,
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.12)',
                color: '#8BA8BE',
                fontSize: 13,
                cursor: 'pointer',
                fontFamily: 'var(--font-text)',
              }}
            >
              Add to Ignore List
            </button>
            <button
              onClick={() => {}}
              style={{
                height: 40,
                padding: '0 22px',
                borderRadius: 10,
                background: '#E05252',
                border: 'none',
                color: '#FFFFFF',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'var(--font-text)',
                boxShadow: '0 0 12px rgba(224,82,82,0.3)',
              }}
            >
              Delete All (3.2 GB)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
