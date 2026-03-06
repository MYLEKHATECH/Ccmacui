import { useState } from 'react';
import { LayoutGrid, Search, X, Download, ArrowRight, CheckCircle2 } from 'lucide-react';
import { ModuleHeader } from '../components/ModuleHeader';

type Screen = 'app-list' | 'uninstall-modal' | 'updater';
type Filter = 'all' | 'recent' | 'unused' | 'large';

const apps = [
  { id: 'xcode', name: 'Xcode', icon: '🔨', version: '15.3', size: '12.6 GB', date: 'Jan 2024', category: 'Developer', unused: false, leftovers: ['~/Library/Developer/Xcode', '~/Library/Caches/com.apple.dt.Xcode'] },
  { id: 'figma', name: 'Figma', icon: '🎨', version: '116.14', size: '418 MB', date: 'Mar 2024', category: 'Design', unused: false, leftovers: ['~/Library/Application Support/Figma'] },
  { id: 'skype', name: 'Skype', icon: '💬', version: '8.101', size: '184 MB', date: 'Aug 2023', category: 'Communication', unused: true, leftovers: ['~/Library/Application Support/Skype', '~/Library/Caches/com.skype.skype'] },
  { id: 'vlc', name: 'VLC Media Player', icon: '🎬', version: '3.0.20', size: '64 MB', date: 'Nov 2023', category: 'Media', unused: true, leftovers: ['~/Library/Application Support/org.videolan.vlc'] },
  { id: 'zoom', name: 'Zoom', icon: '💻', version: '6.0.2', size: '209 MB', date: 'Feb 2024', category: 'Communication', unused: false, leftovers: ['~/Library/Application Support/zoom.us'] },
  { id: 'slack', name: 'Slack', icon: '💼', version: '4.36', size: '354 MB', date: 'Mar 2024', category: 'Communication', unused: false, leftovers: ['~/Library/Application Support/Slack'] },
  { id: 'spotify', name: 'Spotify', icon: '🎵', version: '1.2.30', size: '286 MB', date: 'Feb 2024', category: 'Music', unused: false, leftovers: ['~/Library/Application Support/Spotify'] },
  { id: 'chrome', name: 'Google Chrome', icon: '🌐', version: '123.0', size: '440 MB', date: 'Mar 2024', category: 'Browser', unused: false, leftovers: ['~/Library/Application Support/Google/Chrome'] },
  { id: 'sketch', name: 'Sketch', icon: '✏️', version: '99.1', size: '186 MB', date: 'Dec 2023', category: 'Design', unused: true, leftovers: ['~/Library/Application Support/com.bohemiancoding.sketch3'] },
  { id: 'pycharm', name: 'PyCharm', icon: '🐍', version: '2023.3', size: '1.2 GB', date: 'Oct 2023', category: 'Developer', unused: true, leftovers: ['~/Library/Application Support/JetBrains/PyCharm2023.3', '~/Library/Caches/JetBrains/PyCharm2023.3'] },
];

const updates = [
  { id: 'xcode', name: 'Xcode', icon: '🔨', current: '15.2', latest: '15.3', size: '800 MB' },
  { id: 'chrome', name: 'Google Chrome', icon: '🌐', current: '122.0', latest: '123.0', size: '45 MB' },
  { id: 'figma', name: 'Figma', icon: '🎨', current: '115.10', latest: '116.14', size: '24 MB' },
  { id: 'slack', name: 'Slack', icon: '💼', current: '4.35', latest: '4.36', size: '10 MB' },
];

export function Applications() {
  const [screen, setScreen] = useState<Screen>('app-list');
  const [tab, setTab] = useState<'installed' | 'updater'>('installed');
  const [filter, setFilter] = useState<Filter>('all');
  const [search, setSearch] = useState('');
  const [expandedApp, setExpandedApp] = useState<string | null>(null);
  const [uninstallApp, setUninstallApp] = useState<typeof apps[0] | null>(null);
  const [selectedLeftovers, setSelectedLeftovers] = useState<Set<string>>(new Set());
  const [updatedApps, setUpdatedApps] = useState<Set<string>>(new Set());
  const [updatingApps, setUpdatingApps] = useState<Set<string>>(new Set());
  const [uninstalledApps, setUninstalledApps] = useState<Set<string>>(new Set());

  const filteredApps = apps
    .filter(a => !uninstalledApps.has(a.id))
    .filter(a => {
      if (filter === 'recent') return !a.unused;
      if (filter === 'unused') return a.unused;
      if (filter === 'large') return parseFloat(a.size) > 300;
      return true;
    })
    .filter(a => a.name.toLowerCase().includes(search.toLowerCase()));

  const openUninstall = (app: typeof apps[0]) => {
    setUninstallApp(app);
    setSelectedLeftovers(new Set(app.leftovers));
    setScreen('uninstall-modal');
  };

  const doUpdate = (id: string) => {
    setUpdatingApps(prev => new Set([...prev, id]));
    setTimeout(() => {
      setUpdatingApps(prev => { const s = new Set(prev); s.delete(id); return s; });
      setUpdatedApps(prev => new Set([...prev, id]));
    }, 1800);
  };

  const doUpdateAll = () => updates.forEach(u => doUpdate(u.id));

  // ─── Uninstall Modal ───────────────────────────────────────
  if (screen === 'uninstall-modal' && uninstallApp) {
    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(10,18,28,0.85)',
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
            borderRadius: 18,
            padding: '32px 36px',
            width: 480,
            border: '1px solid rgba(224,82,82,0.2)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 6 }}>
            <span style={{ fontSize: 48 }}>{uninstallApp.icon}</span>
            <div>
              <div style={{ color: '#FFFFFF', fontSize: 18, fontWeight: 600 }}>Uninstall {uninstallApp.name}</div>
              <div style={{ color: '#8BA8BE', fontSize: 12, marginTop: 2 }}>
                This will remove {uninstallApp.leftovers.length + 1} files ({uninstallApp.size})
              </div>
            </div>
          </div>

          <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '16px 0' }} />

          {/* Leftover Files */}
          <div style={{ color: '#8BA8BE', fontSize: 12, marginBottom: 10 }}>
            Leftover files to remove:
          </div>
          <div style={{ maxHeight: 160, overflowY: 'auto' }} className="dark-scroll">
            {uninstallApp.leftovers.map(lo => {
              const isSel = selectedLeftovers.has(lo);
              return (
                <div
                  key={lo}
                  onClick={() => {
                    setSelectedLeftovers(prev => {
                      const s = new Set(prev);
                      if (s.has(lo)) s.delete(lo);
                      else s.add(lo);
                      return s;
                    });
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '8px 10px',
                    borderRadius: 8,
                    cursor: 'pointer',
                    background: isSel ? 'rgba(224,82,82,0.05)' : 'transparent',
                    marginBottom: 4,
                    transition: 'all 0.1s',
                  }}
                >
                  <div
                    style={{
                      width: 16,
                      height: 16,
                      borderRadius: 4,
                      border: `2px solid ${isSel ? '#E05252' : 'rgba(255,255,255,0.2)'}`,
                      background: isSel ? '#E05252' : 'transparent',
                      flexShrink: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.1s',
                    }}
                  >
                    {isSel && <div style={{ width: 6, height: 6, borderRadius: 1, background: '#fff' }} />}
                  </div>
                  <span style={{ color: '#8BA8BE', fontSize: 11, fontFamily: 'var(--font-mono)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {lo}
                  </span>
                </div>
              );
            })}
          </div>

          <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '16px 0' }} />

          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={() => setScreen('app-list')}
              style={{
                flex: 1,
                height: 40,
                borderRadius: 10,
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.12)',
                color: '#8BA8BE',
                fontSize: 13,
                cursor: 'pointer',
                fontFamily: 'var(--font-text)',
              }}
            >
              Cancel
            </button>
            <button
              onClick={() => {
                setUninstalledApps(prev => new Set([...prev, uninstallApp.id]));
                setScreen('app-list');
              }}
              style={{
                flex: 2,
                height: 40,
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
              Uninstall + Clean {selectedLeftovers.size} Files
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── App List / Updater ────────────────────────────────────
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', fontFamily: 'var(--font-text)' }}>
      <ModuleHeader
        icon={LayoutGrid}
        iconColor="#4DA6D8"
        title="Applications"
        subtitle="Manage, uninstall and update your apps"
        ctaLabel={tab === 'updater' ? 'Update All' : undefined}
        onCta={doUpdateAll}
        secondaryLabel="Settings"
      />

      {/* Tabs */}
      <div
        style={{
          display: 'flex',
          gap: 0,
          padding: '12px 24px 0',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        {(['installed', 'updater'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: '8px 18px',
              background: 'none',
              border: 'none',
              borderBottom: tab === t ? '2px solid #2E9C6A' : '2px solid transparent',
              color: tab === t ? '#FFFFFF' : '#8BA8BE',
              fontSize: 13,
              fontWeight: tab === t ? 600 : 400,
              cursor: 'pointer',
              fontFamily: 'var(--font-text)',
              marginBottom: -1,
              transition: 'all 0.15s',
            }}
          >
            {t === 'installed' ? 'Installed Apps' : 'App Updater'}
            {t === 'updater' && updates.filter(u => !updatedApps.has(u.id)).length > 0 && (
              <span
                style={{
                  marginLeft: 6,
                  background: '#E07A30',
                  borderRadius: 10,
                  padding: '1px 6px',
                  fontSize: 10,
                  fontWeight: 700,
                  color: '#FFFFFF',
                }}
              >
                {updates.filter(u => !updatedApps.has(u.id)).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {tab === 'installed' ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Search + Filters */}
          <div style={{ padding: '16px 24px', display: 'flex', gap: 12, alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#4A6070' }} />
              <input
                type="text"
                placeholder="Search apps..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{
                  width: '100%',
                  height: 38,
                  borderRadius: 10,
                  background: '#1C2E3E',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: '#FFFFFF',
                  fontSize: 13,
                  padding: '0 12px 0 36px',
                  outline: 'none',
                  fontFamily: 'var(--font-text)',
                  boxSizing: 'border-box',
                }}
              />
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {(['all', 'recent', 'unused', 'large'] as Filter[]).map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  style={{
                    height: 30,
                    padding: '0 12px',
                    borderRadius: 20,
                    background: filter === f ? 'rgba(77,166,216,0.15)' : 'transparent',
                    border: `1px solid ${filter === f ? 'rgba(77,166,216,0.3)' : 'rgba(255,255,255,0.08)'}`,
                    color: filter === f ? '#4DA6D8' : '#8BA8BE',
                    fontSize: 12,
                    cursor: 'pointer',
                    fontFamily: 'var(--font-text)',
                    textTransform: 'capitalize',
                  }}
                >
                  {f === 'all' ? 'All' : f === 'recent' ? 'Recently Used' : f === 'unused' ? 'Unused' : 'Large Apps'}
                </button>
              ))}
            </div>
          </div>

          {/* App List */}
          <div className="dark-scroll" style={{ flex: 1, overflowY: 'auto', padding: '8px 24px' }}>
            {filteredApps.map(app => (
              <div key={app.id}>
                <div
                  onClick={() => setExpandedApp(expandedApp === app.id ? null : app.id)}
                  style={{
                    height: 52,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '0 14px',
                    borderRadius: 10,
                    cursor: 'pointer',
                    background: expandedApp === app.id ? 'rgba(77,166,216,0.06)' : 'transparent',
                    borderLeft: expandedApp === app.id ? '3px solid #4DA6D8' : '3px solid transparent',
                    marginBottom: expandedApp === app.id ? 0 : 2,
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => { if (expandedApp !== app.id) e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
                  onMouseLeave={e => { if (expandedApp !== app.id) e.currentTarget.style.background = 'transparent'; }}
                >
                  <span style={{ fontSize: 28, flexShrink: 0 }}>{app.icon}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ color: '#FFFFFF', fontSize: 13, fontWeight: 500 }}>{app.name}</div>
                    <div style={{ color: '#4A6070', fontSize: 11 }}>v{app.version} · {app.date}</div>
                  </div>
                  {app.unused && (
                    <span style={{ fontSize: 10, color: '#E07A30', background: 'rgba(224,122,48,0.1)', border: '1px solid rgba(224,122,48,0.2)', borderRadius: 4, padding: '1px 6px', fontWeight: 700 }}>
                      Unused
                    </span>
                  )}
                  <span
                    style={{
                      color: '#4DA6D8',
                      fontSize: 12,
                      fontWeight: 500,
                      padding: '3px 8px',
                      borderRadius: 6,
                      background: 'rgba(77,166,216,0.08)',
                    }}
                  >
                    {app.size}
                  </span>
                  <button
                    onClick={e => { e.stopPropagation(); openUninstall(app); }}
                    style={{
                      height: 28,
                      padding: '0 12px',
                      borderRadius: 8,
                      background: 'transparent',
                      border: '1px solid rgba(224,82,82,0.3)',
                      color: '#E05252',
                      fontSize: 11,
                      cursor: 'pointer',
                      fontFamily: 'var(--font-text)',
                      flexShrink: 0,
                    }}
                  >
                    Uninstall
                  </button>
                </div>
                {/* Expanded: Leftover files */}
                {expandedApp === app.id && (
                  <div
                    style={{
                      padding: '10px 14px 14px 54px',
                      borderLeft: '3px solid #4DA6D8',
                      marginBottom: 4,
                      background: 'rgba(77,166,216,0.03)',
                      borderRadius: '0 0 10px 10px',
                    }}
                  >
                    <div style={{ color: '#8BA8BE', fontSize: 11, marginBottom: 8 }}>
                      Leftover files found ({app.leftovers.length}):
                    </div>
                    {app.leftovers.map(lo => (
                      <div key={lo} style={{ color: '#4A6070', fontSize: 10, fontFamily: 'var(--font-mono)', padding: '2px 0' }}>
                        📁 {lo}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        // Updater Tab
        <div className="dark-scroll" style={{ flex: 1, overflowY: 'auto', padding: '16px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ color: '#FFFFFF', fontSize: 13 }}>
              <span style={{ fontWeight: 600 }}>{updates.filter(u => !updatedApps.has(u.id)).length}</span>
              <span style={{ color: '#8BA8BE' }}> apps have updates available</span>
            </div>
            <button
              onClick={doUpdateAll}
              style={{
                height: 36,
                padding: '0 18px',
                borderRadius: 10,
                background: '#2E9C6A',
                border: 'none',
                color: '#FFFFFF',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'var(--font-text)',
                boxShadow: '0 0 12px rgba(46,156,106,0.3)',
              }}
            >
              Update All
            </button>
          </div>

          {updates.map(update => {
            const isUpdated = updatedApps.has(update.id);
            const isUpdating = updatingApps.has(update.id);
            return (
              <div
                key={update.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  padding: '14px 16px',
                  borderRadius: 12,
                  background: isUpdated ? 'rgba(60,184,117,0.05)' : '#1C2E3E',
                  border: `1px solid ${isUpdated ? 'rgba(60,184,117,0.15)' : 'rgba(255,255,255,0.06)'}`,
                  marginBottom: 8,
                  opacity: isUpdated ? 0.6 : 1,
                  transition: 'all 0.3s',
                }}
              >
                <span style={{ fontSize: 32 }}>{update.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ color: '#FFFFFF', fontSize: 13, fontWeight: 500 }}>{update.name}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 3 }}>
                    <span style={{ color: '#8BA8BE', fontSize: 12 }}>v{update.current}</span>
                    <ArrowRight size={12} style={{ color: '#4A6070' }} />
                    <span style={{ color: '#2E9C6A', fontSize: 12, fontWeight: 500 }}>v{update.latest}</span>
                    <span style={{ color: '#4A6070', fontSize: 11 }}>· {update.size}</span>
                  </div>
                </div>
                {isUpdated ? (
                  <CheckCircle2 size={22} style={{ color: '#3CB875' }} />
                ) : (
                  <button
                    onClick={() => doUpdate(update.id)}
                    disabled={isUpdating}
                    style={{
                      height: 32,
                      padding: '0 16px',
                      borderRadius: 8,
                      background: isUpdating ? 'rgba(26,107,154,0.15)' : '#1A6B9A',
                      border: 'none',
                      color: isUpdating ? '#4A6070' : '#FFFFFF',
                      fontSize: 12,
                      fontWeight: 500,
                      cursor: isUpdating ? 'wait' : 'pointer',
                      fontFamily: 'var(--font-text)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                    }}
                  >
                    {isUpdating ? (
                      <>
                        <div className="animate-spin-slow" style={{ width: 12, height: 12, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.2)', borderTop: '2px solid #fff' }} />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Download size={12} />
                        Update
                      </>
                    )}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
