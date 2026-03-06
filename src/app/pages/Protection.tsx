import { useState, useEffect } from 'react';
import { Shield, AlertTriangle, Eye, Camera, Mic, MapPin, Calendar, Users, HardDrive } from 'lucide-react';
import { ModuleHeader } from '../components/ModuleHeader';
import { ScanProgressBar } from '../components/ScanProgressBar';
import { ThreatBadge } from '../components/ThreatBadge';
import { CircularProgressRing } from '../components/CircularProgressRing';

type Screen = 'overview' | 'scanning' | 'threats' | 'permissions';
type ScanType = 'quick' | 'normal' | 'deep';

const threats = [
  {
    id: 't1',
    name: 'OSX.Shlayer.A',
    path: '/Library/LaunchAgents/com.shlayer.plist',
    type: 'Adware',
    severity: 'critical' as const,
    description: 'Browser hijacker that redirects search results and installs unwanted extensions.',
    action: 'Quarantine',
  },
  {
    id: 't2',
    name: 'MacOS.Bundlore',
    path: '~/Downloads/FlashPlayer_installer.dmg',
    type: 'PUP',
    severity: 'high' as const,
    description: 'Potentially Unwanted Program bundled with fake Flash Player installer.',
    action: 'Delete',
  },
  {
    id: 't3',
    name: 'Tracking Cookie',
    path: '/Library/Cookies/com.google.Chrome.binarycookies',
    type: 'Privacy',
    severity: 'low' as const,
    description: 'Third-party tracking cookies collecting browsing data.',
    action: 'Delete',
  },
];

const permGroups = [
  {
    type: 'Camera',
    icon: Camera,
    color: '#E05252',
    apps: [
      { name: 'Zoom', icon: '💻', enabled: true },
      { name: 'FaceTime', icon: '📹', enabled: true },
      { name: 'Skype', icon: '💬', enabled: false },
    ],
  },
  {
    type: 'Microphone',
    icon: Mic,
    color: '#E07A30',
    apps: [
      { name: 'Zoom', icon: '💻', enabled: true },
      { name: 'Spotify', icon: '🎵', enabled: false },
      { name: 'Slack', icon: '💼', enabled: true },
    ],
  },
  {
    type: 'Location',
    icon: MapPin,
    color: '#4DA6D8',
    apps: [
      { name: 'Maps', icon: '🗺️', enabled: true },
      { name: 'Weather', icon: '🌦️', enabled: true },
    ],
  },
  {
    type: 'Full Disk Access',
    icon: HardDrive,
    color: '#7B52C8',
    apps: [
      { name: 'CCMac', icon: '✨', enabled: true, warn: false },
      { name: 'Backblaze', icon: '☁️', enabled: true },
      { name: 'Some App', icon: '❓', enabled: true, warn: true },
    ],
  },
];

export function Protection() {
  const [screen, setScreen] = useState<Screen>('overview');
  const [scanType, setScanType] = useState<ScanType>('normal');
  const [scanProgress, setScanProgress] = useState(0);
  const [selectedThreat, setSelectedThreat] = useState<string | null>(threats[0].id);
  const [removed, setRemoved] = useState<Set<string>>(new Set());
  const [toggledApps, setToggledApps] = useState<Set<string>>(new Set(
    permGroups.flatMap(g => g.apps.filter(a => a.enabled).map(a => `${g.type}:${a.name}`))
  ));

  useEffect(() => {
    if (screen !== 'scanning') return;
    setScanProgress(0);
    let p = 0;
    const iv = setInterval(() => {
      p += 1.5;
      setScanProgress(Math.min(p, 100));
      if (p >= 100) {
        clearInterval(iv);
        setTimeout(() => setScreen('threats'), 400);
      }
    }, 50);
    return () => clearInterval(iv);
  }, [screen]);

  const activeThreat = threats.find(t => t.id === selectedThreat);
  const visibleThreats = threats.filter(t => !removed.has(t.id));

  const scanTypeConfig = {
    quick: { label: 'Quick Scan', time: '~1 min' },
    normal: { label: 'Normal Scan', time: '~5 min' },
    deep: { label: 'Deep Scan', time: '~20 min' },
  };

  // ─── Overview ──────────────────────────────────────────────
  if (screen === 'overview') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', fontFamily: 'var(--font-text)' }}>
        <ModuleHeader
          icon={Shield}
          iconColor="#3CB875"
          title="Protection"
          subtitle="Real-time malware protection & privacy tools"
          ctaLabel="Scan Now"
          onCta={() => setScreen('scanning')}
          secondaryLabel="Permissions"
          onSecondary={() => setScreen('permissions')}
        />
        <div className="dark-scroll" style={{ flex: 1, overflowY: 'auto', padding: 28 }}>
          {/* Status Hero */}
          <div
            className="animate-fade-slide-up"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              marginBottom: 32,
              padding: '28px',
              background: 'rgba(60,184,117,0.05)',
              borderRadius: 18,
              border: '1px solid rgba(60,184,117,0.15)',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: 88,
                height: 88,
                borderRadius: '50%',
                background: 'rgba(60,184,117,0.12)',
                border: '2px solid rgba(60,184,117,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 16,
                boxShadow: '0 0 30px rgba(60,184,117,0.2)',
              }}
            >
              <Shield size={44} style={{ color: '#3CB875' }} />
            </div>
            <h2 style={{ margin: 0, color: '#FFFFFF', fontSize: 22, fontWeight: 600, fontFamily: 'var(--font-display)' }}>
              Mac Protected
            </h2>
            <p style={{ margin: '6px 0 0', color: '#8BA8BE', fontSize: 13 }}>
              No threats detected · Last scan: Today at 9:12 AM
            </p>
            <p style={{ margin: '4px 0 0', color: '#4A6070', fontSize: 12 }}>
              Next scheduled scan: Tomorrow at 9:00 AM
            </p>
          </div>

          {/* Scan Type Selector */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ color: '#8BA8BE', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
              Scan Type
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              {(['quick', 'normal', 'deep'] as ScanType[]).map(type => (
                <div
                  key={type}
                  onClick={() => setScanType(type)}
                  style={{
                    flex: 1,
                    padding: '14px',
                    borderRadius: 12,
                    background: scanType === type ? 'rgba(46,156,106,0.1)' : '#1C2E3E',
                    border: `1px solid ${scanType === type ? 'rgba(46,156,106,0.3)' : 'rgba(255,255,255,0.06)'}`,
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'all 0.15s',
                  }}
                >
                  <div style={{ color: scanType === type ? '#2E9C6A' : '#FFFFFF', fontSize: 13, fontWeight: 600 }}>
                    {scanTypeConfig[type].label}
                  </div>
                  <div style={{ color: '#8BA8BE', fontSize: 11, marginTop: 3 }}>
                    {scanTypeConfig[type].time}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Privacy Tools */}
          <div>
            <div style={{ color: '#8BA8BE', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
              Privacy Tools
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
              {[
                { icon: '🌐', title: 'Browser Data', desc: 'Clear cookies, cache & history' },
                { icon: '🕐', title: 'Recent Items', desc: 'Remove app usage footprints' },
                { icon: '🔒', title: 'App Permissions', desc: 'Review camera, mic & location' },
              ].map(tool => (
                <div
                  key={tool.title}
                  onClick={() => tool.title === 'App Permissions' && setScreen('permissions')}
                  style={{
                    padding: '16px',
                    borderRadius: 12,
                    background: '#1C2E3E',
                    border: '1px solid rgba(255,255,255,0.06)',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#223549')}
                  onMouseLeave={e => (e.currentTarget.style.background = '#1C2E3E')}
                >
                  <div style={{ fontSize: 26, marginBottom: 8 }}>{tool.icon}</div>
                  <div style={{ color: '#FFFFFF', fontSize: 13, fontWeight: 500, marginBottom: 4 }}>{tool.title}</div>
                  <div style={{ color: '#8BA8BE', fontSize: 11 }}>{tool.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── Scanning ─────────────────────────────────────────────
  if (screen === 'scanning') {
    const files = [
      '/Library/LaunchAgents/com.apple.plist', '/usr/local/lib/libssl.dylib',
      '/Library/Application Support/CrashReporter', '~/Downloads/installer.dmg',
      '/private/var/folders/tmp/com.apple', '/System/Library/CoreServices/boot.efi',
    ];
    const idx = Math.floor((scanProgress / 100) * files.length);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', fontFamily: 'var(--font-text)' }}>
        <ModuleHeader
          icon={Shield}
          iconColor="#1A6B9A"
          title="Protection"
          subtitle="Scanning for threats..."
          ctaVariant="scanning"
          ctaLabel="Scanning…"
        />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 28 }}>
          {/* Radar */}
          <div
            style={{
              position: 'relative',
              width: 280,
              height: 280,
              marginBottom: 32,
            }}
          >
            {/* Rings */}
            {[1, 2, 3].map(i => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  inset: `${(i - 1) * 36}px`,
                  borderRadius: '50%',
                  border: `1px solid rgba(26,107,154,${0.35 - i * 0.08})`,
                }}
              />
            ))}
            {/* Sweep */}
            <div
              className="animate-radar"
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                background: 'conic-gradient(from 0deg, transparent 80%, rgba(46,156,106,0.15) 100%)',
              }}
            />
            {/* Center */}
            <div
              style={{
                position: 'absolute',
                inset: 60,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CircularProgressRing size={160} value={scanProgress} label="Scanning" color="#2E9C6A" animate={false} />
            </div>
            {/* Blips */}
            {[{ top: '22%', left: '65%' }, { top: '60%', left: '18%' }, { top: '74%', left: '72%' }].map((pos, i) => (
              <div
                key={i}
                className="animate-pulse-ring"
                style={{
                  position: 'absolute',
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: '#2E9C6A',
                  top: pos.top,
                  left: pos.left,
                  animationDelay: `${i * 0.6}s`,
                }}
              />
            ))}
          </div>

          {/* Stats Row */}
          <div style={{ display: 'flex', gap: 32, marginBottom: 24, textAlign: 'center' }}>
            {[
              { label: 'Files Scanned', value: Math.round(scanProgress * 127) },
              { label: 'Threats Found', value: scanProgress >= 85 ? 2 : 0 },
              { label: 'Time Elapsed', value: `${Math.round(scanProgress * 0.15)}s` },
            ].map(s => (
              <div key={s.label}>
                <div style={{ color: '#FFFFFF', fontSize: 20, fontWeight: 700, fontFamily: 'var(--font-display)' }}>
                  {s.value}
                </div>
                <div style={{ color: '#8BA8BE', fontSize: 11, marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Current File */}
          <div style={{ color: '#4A6070', fontSize: 11, fontFamily: 'var(--font-mono)', marginBottom: 24 }}>
            {files[Math.min(idx, files.length - 1)]}
          </div>

          {/* Progress Bar */}
          <div style={{ width: 400 }}>
            <ScanProgressBar value={scanProgress} />
          </div>

          <button
            onClick={() => setScreen('overview')}
            style={{
              marginTop: 20,
              height: 36,
              padding: '0 20px',
              borderRadius: 10,
              background: 'transparent',
              border: '1px solid #1A6B9A',
              color: '#4DA6D8',
              fontSize: 13,
              cursor: 'pointer',
              fontFamily: 'var(--font-text)',
            }}
          >
            Stop Scan
          </button>
        </div>
      </div>
    );
  }

  // ─── Threat Found ───────────────────��─────────────────────
  if (screen === 'threats') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', fontFamily: 'var(--font-text)' }}>
        {/* Alert Banner */}
        <div
          className="animate-threat-pulse"
          style={{
            padding: '14px 28px',
            background: 'rgba(224,82,82,0.12)',
            border: '1px solid rgba(224,82,82,0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            flexShrink: 0,
          }}
        >
          <AlertTriangle size={22} style={{ color: '#E05252', flexShrink: 0 }} />
          <div>
            <span style={{ color: '#E05252', fontSize: 16, fontWeight: 700 }}>
              {visibleThreats.length} Threat{visibleThreats.length !== 1 ? 's' : ''} Detected
            </span>
            <span style={{ color: '#8BA8BE', fontSize: 13, marginLeft: 12 }}>
              Immediate action recommended
            </span>
          </div>
        </div>

        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          {/* Left: Threat List */}
          <div className="dark-scroll" style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
            {visibleThreats.map(threat => (
              <div
                key={threat.id}
                onClick={() => setSelectedThreat(threat.id)}
                style={{
                  padding: '14px 16px',
                  borderRadius: 12,
                  background: selectedThreat === threat.id ? 'rgba(224,82,82,0.08)' : '#1C2E3E',
                  border: `1px solid ${selectedThreat === threat.id ? 'rgba(224,82,82,0.3)' : 'rgba(255,255,255,0.06)'}`,
                  cursor: 'pointer',
                  marginBottom: 8,
                  transition: 'all 0.15s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ color: '#E05252', fontSize: 14, fontWeight: 600, marginBottom: 3 }}>{threat.name}</div>
                  <div style={{ color: '#4A6070', fontSize: 11, fontFamily: 'var(--font-mono)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {threat.path}
                  </div>
                  <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        color: '#8BA8BE',
                        background: 'rgba(255,255,255,0.06)',
                        borderRadius: 4,
                        padding: '1px 6px',
                      }}
                    >
                      {threat.type}
                    </span>
                    <ThreatBadge severity={threat.severity} />
                  </div>
                </div>
              </div>
            ))}

            {visibleThreats.length === 0 && (
              <div style={{ textAlign: 'center', paddingTop: 60 }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
                <div style={{ color: '#3CB875', fontSize: 16, fontWeight: 600 }}>All threats removed!</div>
                <button
                  onClick={() => setScreen('overview')}
                  style={{ marginTop: 16, height: 38, padding: '0 20px', borderRadius: 10, background: '#2E9C6A', border: 'none', color: '#FFFFFF', fontSize: 13, cursor: 'pointer', fontFamily: 'var(--font-text)' }}
                >
                  Back to Overview
                </button>
              </div>
            )}
          </div>

          {/* Right: Threat Detail */}
          {activeThreat && (
            <div
              className="animate-slide-in-right"
              style={{
                width: 280,
                padding: '20px',
                background: '#0D1922',
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
              }}
            >
              <div>
                <div style={{ color: '#E05252', fontSize: 16, fontWeight: 700, marginBottom: 6 }}>
                  {activeThreat.name}
                </div>
                <ThreatBadge severity={activeThreat.severity} />
              </div>
              <div style={{ color: '#8BA8BE', fontSize: 12, lineHeight: 1.7 }}>
                {activeThreat.description}
              </div>
              <div>
                <div style={{ color: '#4A6070', fontSize: 10, fontFamily: 'var(--font-mono)', marginBottom: 4 }}>Path:</div>
                <div style={{ color: '#8BA8BE', fontSize: 10, fontFamily: 'var(--font-mono)', wordBreak: 'break-all' }}>
                  {activeThreat.path}
                </div>
              </div>
              <div>
                <div style={{ color: '#8BA8BE', fontSize: 11, marginBottom: 8 }}>Recommended Action:</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {(['Quarantine', 'Delete', 'Ignore'] as const).map(action => (
                    <button
                      key={action}
                      onClick={() => {
                        setRemoved(prev => new Set([...prev, activeThreat.id]));
                        setSelectedThreat(null);
                      }}
                      style={{
                        flex: 1,
                        height: 32,
                        borderRadius: 8,
                        background: activeThreat.action === action ? (action === 'Ignore' ? 'rgba(255,255,255,0.06)' : 'rgba(224,82,82,0.15)') : 'transparent',
                        border: `1px solid ${activeThreat.action === action ? 'rgba(224,82,82,0.3)' : 'rgba(255,255,255,0.08)'}`,
                        color: activeThreat.action === action ? '#E05252' : '#8BA8BE',
                        fontSize: 11,
                        cursor: 'pointer',
                        fontFamily: 'var(--font-text)',
                      }}
                    >
                      {action}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Action Bar */}
        {visibleThreats.length > 0 && (
          <div style={{ padding: '12px 24px', background: '#0D1922', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <button
              onClick={() => setScreen('overview')}
              style={{ height: 38, padding: '0 18px', borderRadius: 10, background: 'transparent', border: '1px solid #1A6B9A', color: '#4DA6D8', fontSize: 13, cursor: 'pointer', fontFamily: 'var(--font-text)' }}
            >
              Review One by One
            </button>
            <button
              onClick={() => setRemoved(new Set(threats.map(t => t.id)))}
              style={{ height: 38, padding: '0 22px', borderRadius: 10, background: '#E05252', border: 'none', color: '#FFFFFF', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-text)', boxShadow: '0 0 12px rgba(224,82,82,0.3)' }}
            >
              Quarantine All
            </button>
          </div>
        )}
      </div>
    );
  }

  // ─── App Permissions ──────────────────────────────────────
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', fontFamily: 'var(--font-text)' }}>
      <ModuleHeader
        icon={Eye}
        iconColor="#7B52C8"
        title="App Permissions"
        subtitle="Review which apps can access sensitive resources"
        ctaLabel="Back"
        onCta={() => setScreen('overview')}
      />
      <div className="dark-scroll" style={{ flex: 1, overflowY: 'auto', padding: 28 }}>
        {permGroups.map(group => {
          const Icon = group.icon;
          return (
            <div key={group.type} style={{ marginBottom: 20 }}>
              {/* Group Header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '10px 14px',
                  borderRadius: 10,
                  background: 'rgba(255,255,255,0.03)',
                  marginBottom: 6,
                }}
              >
                <Icon size={16} style={{ color: group.color }} />
                <span style={{ color: '#FFFFFF', fontSize: 13, fontWeight: 600 }}>{group.type}</span>
                <span
                  style={{
                    marginLeft: 'auto',
                    fontSize: 11,
                    color: '#8BA8BE',
                    background: 'rgba(255,255,255,0.06)',
                    borderRadius: 10,
                    padding: '1px 8px',
                  }}
                >
                  {group.apps.length} apps
                </span>
              </div>

              {/* App Rows */}
              {group.apps.map(app => {
                const key = `${group.type}:${app.name}`;
                const isOn = toggledApps.has(key);
                return (
                  <div
                    key={app.name}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: '10px 14px 10px 24px',
                      borderRadius: 8,
                      marginBottom: 2,
                      background: app.warn ? 'rgba(224,122,48,0.04)' : 'transparent',
                      border: `1px solid ${app.warn ? 'rgba(224,122,48,0.12)' : 'transparent'}`,
                    }}
                  >
                    <span style={{ fontSize: 18 }}>{app.icon}</span>
                    <span style={{ color: '#FFFFFF', fontSize: 13, flex: 1 }}>
                      {app.name}
                      {app.warn && (
                        <span style={{ marginLeft: 8, fontSize: 10, color: '#E07A30', fontWeight: 700 }}>
                          ⚠ Many permissions
                        </span>
                      )}
                    </span>
                    {/* Toggle */}
                    <div
                      onClick={() => {
                        setToggledApps(prev => {
                          const s = new Set(prev);
                          if (s.has(key)) s.delete(key);
                          else s.add(key);
                          return s;
                        });
                      }}
                      style={{
                        width: 40,
                        height: 22,
                        borderRadius: 11,
                        background: isOn ? group.color : 'rgba(255,255,255,0.1)',
                        cursor: 'pointer',
                        position: 'relative',
                        transition: 'background 0.2s',
                        flexShrink: 0,
                      }}
                    >
                      <div
                        style={{
                          position: 'absolute',
                          top: 3,
                          left: isOn ? 21 : 3,
                          width: 16,
                          height: 16,
                          borderRadius: '50%',
                          background: '#FFFFFF',
                          transition: 'left 0.2s',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}