import { useState } from 'react';
import { Trash2, CheckSquare, Square, SortAsc, X, FileText } from 'lucide-react';
import { ModuleHeader } from '../components/ModuleHeader';
import { ScanProgressBar } from '../components/ScanProgressBar';

type Screen = 'overview' | 'results' | 'ignore-list';

const categories = [
  { id: 'system-junk', icon: '⚙️', name: 'System Junk', desc: 'Temp files, system caches, broken preferences', size: '1.24 GB', safe: true },
  { id: 'user-cache', icon: '📁', name: 'User Cache Files', desc: 'Application caches accumulated over time', size: '876 MB', safe: true },
  { id: 'logs', icon: '📋', name: 'System & User Logs', desc: 'Log files no longer needed by the system', size: '342 MB', safe: true },
  { id: 'mail', icon: '📧', name: 'Mail Attachments', desc: 'Email attachments stored locally', size: '1.1 GB', safe: false },
  { id: 'lang', icon: '🌐', name: 'Language Files', desc: 'Unused language packs from applications', size: '2.4 GB', safe: true },
  { id: 'trash', icon: '🗑️', name: 'Trash Bin', desc: 'Files waiting to be permanently deleted', size: '680 MB', safe: true },
  { id: 'xcode', icon: '🔨', name: 'Xcode Junk', desc: 'Derived data, simulators, old archives', size: '4.8 GB', safe: true },
  { id: 'old-ios', icon: '📱', name: 'Old iOS Backups', desc: 'iPhone/iPad backups you no longer need', size: '6.2 GB', safe: false },
];

const fileRows = [
  { name: 'SafariCache.db', path: '/Library/Caches/com.apple.Safari', size: '342 MB', type: 'cache' },
  { name: 'CoreDataUbiquitySupport', path: '/Library/Mobile Documents', size: '128 MB', type: 'cloud' },
  { name: 'diagnostics_agent.log', path: '/Library/Logs/DiagnosticReports', size: '84 MB', type: 'log' },
  { name: 'TemporaryItems', path: '/private/var/folders/tmp', size: '244 MB', type: 'temp' },
  { name: 'com.apple.Spotlight', path: '/Library/Caches/Metadata', size: '192 MB', type: 'cache' },
  { name: 'XcodeCache', path: '/Library/Developer/Xcode/DerivedData', size: '1.2 GB', type: 'xcode' },
  { name: 'iPhone_Backup_2024', path: '/Library/Application Support/MobileSync', size: '4.8 GB', type: 'backup' },
  { name: 'locales_unused.pkg', path: '/Applications/Adobe Photoshop/Locales', size: '1.9 GB', type: 'lang' },
];

const ignoreItems = [
  { path: '~/Library/Application Support/Slack/Cache', app: 'Slack', addedDate: '2 weeks ago' },
  { path: '~/Library/Caches/Firefox/Profiles', app: 'Firefox', addedDate: '1 month ago' },
  { path: '~/Documents/Work Projects', app: 'Finder', addedDate: '3 days ago' },
];

export function Cleanup() {
  const [screen, setScreen] = useState<Screen>('overview');
  const [selected, setSelected] = useState<Set<string>>(new Set(['system-junk', 'user-cache', 'logs', 'trash']));
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set(fileRows.map(f => f.name)));
  const [activeCategory, setActiveCategory] = useState<string>('system-junk');
  const [scanning, setScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  const toggleCat = (id: string) => {
    setSelected(prev => {
      const s = new Set(prev);
      if (s.has(id)) s.delete(id);
      else s.add(id);
      return s;
    });
  };

  const startScan = () => {
    setScanning(true);
    setScanProgress(0);
    let p = 0;
    const iv = setInterval(() => {
      p += 4;
      setScanProgress(Math.min(p, 100));
      if (p >= 100) {
        clearInterval(iv);
        setScanning(false);
        setScreen('results');
      }
    }, 60);
  };

  // ─── Overview ──────────────────────────────────────────────
  if (screen === 'overview') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', fontFamily: 'var(--font-text)' }}>
        <ModuleHeader
          icon={Trash2}
          iconColor="#4DA6D8"
          title="Cleanup"
          subtitle="Remove junk files, caches, and unnecessary data"
          ctaLabel={scanning ? 'Scanning...' : 'Scan'}
          onCta={startScan}
          ctaVariant={scanning ? 'scanning' : 'primary'}
          secondaryLabel="Ignore List"
          onSecondary={() => setScreen('ignore-list')}
        />
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          {/* Left: Category List */}
          <div
            className="dark-scroll"
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '20px 24px',
              borderRight: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            {scanning && (
              <div style={{ marginBottom: 20 }}>
                <ScanProgressBar value={scanProgress} />
              </div>
            )}

            <div style={{ color: '#8BA8BE', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
              Select Categories
            </div>

            {categories.map((cat, i) => {
              const isSelected = selected.has(cat.id);
              return (
                <div
                  key={cat.id}
                  onClick={() => toggleCat(cat.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '12px 14px',
                    borderRadius: 10,
                    background: isSelected ? 'rgba(77,166,216,0.06)' : 'transparent',
                    border: `1px solid ${isSelected ? 'rgba(77,166,216,0.2)' : 'transparent'}`,
                    cursor: 'pointer',
                    marginBottom: 6,
                    transition: 'all 0.15s',
                  }}
                >
                  {isSelected ? (
                    <CheckSquare size={18} style={{ color: '#4DA6D8', flexShrink: 0 }} />
                  ) : (
                    <Square size={18} style={{ color: '#4A6070', flexShrink: 0 }} />
                  )}
                  <div style={{ fontSize: 22, flexShrink: 0 }}>{cat.icon}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ color: '#FFFFFF', fontSize: 13, fontWeight: 500 }}>{cat.name}</div>
                    <div style={{ color: '#8BA8BE', fontSize: 11, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {cat.desc}
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: cat.safe ? '#3CB875' : '#E07A30',
                      background: cat.safe ? 'rgba(60,184,117,0.1)' : 'rgba(224,122,48,0.1)',
                      border: `1px solid ${cat.safe ? 'rgba(60,184,117,0.25)' : 'rgba(224,122,48,0.25)'}`,
                      borderRadius: 5,
                      padding: '2px 7px',
                      flexShrink: 0,
                    }}
                  >
                    {cat.size}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Right: Info Card */}
          <div
            style={{
              width: 280,
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
            }}
          >
            <div
              style={{
                padding: '20px',
                background: '#1C2E3E',
                borderRadius: 14,
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <div style={{ fontSize: 28, marginBottom: 10 }}>ℹ️</div>
              <div style={{ color: '#FFFFFF', fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
                Safe to Remove
              </div>
              <div style={{ color: '#8BA8BE', fontSize: 12, lineHeight: 1.6 }}>
                The selected categories contain files that macOS has already flagged as temporary or
                unnecessary. CCMac verifies each file before deletion to ensure nothing important
                is removed.
              </div>
            </div>

            <div
              style={{
                padding: '16px',
                background: 'rgba(224,122,48,0.06)',
                borderRadius: 12,
                border: '1px solid rgba(224,122,48,0.15)',
              }}
            >
              <div style={{ color: '#E07A30', fontSize: 12, fontWeight: 600, marginBottom: 6 }}>
                ⚠️ Review Recommended
              </div>
              <div style={{ color: '#8BA8BE', fontSize: 11, lineHeight: 1.6 }}>
                Mail Attachments and iOS Backups are marked in orange — please review before cleaning.
              </div>
            </div>

            <div style={{ textAlign: 'center', marginTop: 'auto' }}>
              <div style={{ color: '#8BA8BE', fontSize: 11, marginBottom: 4 }}>Selected categories</div>
              <div style={{ color: '#4DA6D8', fontSize: 28, fontWeight: 700, fontFamily: 'var(--font-display)' }}>
                {selected.size} / {categories.length}
              </div>
              <button
                onClick={startScan}
                disabled={selected.size === 0 || scanning}
                style={{
                  marginTop: 16,
                  width: '100%',
                  height: 42,
                  borderRadius: 10,
                  background: selected.size > 0 && !scanning ? '#2E9C6A' : 'rgba(255,255,255,0.08)',
                  border: 'none',
                  color: selected.size > 0 && !scanning ? '#FFFFFF' : 'rgba(255,255,255,0.3)',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: selected.size > 0 && !scanning ? 'pointer' : 'not-allowed',
                  fontFamily: 'var(--font-text)',
                }}
              >
                {scanning ? `Scanning ${Math.round(scanProgress)}%…` : 'Scan'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── Scan Results ──────────────────────────────────────────
  if (screen === 'results') {
    const totalSelected = fileRows.filter(f => selectedFiles.has(f.name)).reduce((acc, f) => {
      const n = parseFloat(f.size);
      return isNaN(n) ? acc : acc + n;
    }, 0);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', fontFamily: 'var(--font-text)' }}>
        <ModuleHeader
          icon={Trash2}
          iconColor="#4DA6D8"
          title="Cleanup"
          subtitle={`Total Found: 17.6 GB`}
          ctaLabel="Clean"
          onCta={() => setScreen('overview')}
          secondaryLabel="Ignore List"
          onSecondary={() => setScreen('ignore-list')}
        />
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          {/* Left: Category List with sizes */}
          <div
            className="dark-scroll"
            style={{
              width: 260,
              overflowY: 'auto',
              padding: '16px 0',
              borderRight: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <div style={{ padding: '0 16px', marginBottom: 12 }}>
              <div style={{ color: '#4DA6D8', fontSize: 13, fontWeight: 700 }}>Total Found: 17.6 GB</div>
            </div>
            {categories.map(cat => (
              <div
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '10px 16px',
                  cursor: 'pointer',
                  background: activeCategory === cat.id ? 'rgba(77,166,216,0.1)' : 'transparent',
                  borderLeft: activeCategory === cat.id ? '3px solid #4DA6D8' : '3px solid transparent',
                  transition: 'all 0.15s',
                }}
              >
                <span style={{ fontSize: 18 }}>{cat.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ color: '#FFFFFF', fontSize: 12, fontWeight: 500 }}>{cat.name}</div>
                </div>
                <span style={{ color: cat.safe ? '#3CB875' : '#E07A30', fontSize: 12, fontWeight: 600 }}>
                  {cat.size}
                </span>
              </div>
            ))}
          </div>

          {/* Right: File List */}
          <div
            className="dark-scroll"
            style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}
          >
            {/* Toolbar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ display: 'flex', gap: 8 }}>
                {['Name', 'Size', 'Date'].map(s => (
                  <button
                    key={s}
                    style={{
                      height: 28,
                      padding: '0 12px',
                      borderRadius: 6,
                      background: s === 'Size' ? 'rgba(77,166,216,0.15)' : 'transparent',
                      border: `1px solid ${s === 'Size' ? 'rgba(77,166,216,0.3)' : 'rgba(255,255,255,0.08)'}`,
                      color: s === 'Size' ? '#4DA6D8' : '#8BA8BE',
                      fontSize: 12,
                      cursor: 'pointer',
                      fontFamily: 'var(--font-text)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    <SortAsc size={12} />
                    {s}
                  </button>
                ))}
              </div>
              <div style={{ color: '#8BA8BE', fontSize: 12 }}>
                <span style={{ color: '#FFFFFF', fontWeight: 500 }}>{selectedFiles.size}</span> items ·{' '}
                <span style={{ color: '#2E9C6A', fontWeight: 500 }}>{totalSelected.toFixed(1)} GB</span> selected
              </div>
            </div>

            {/* File Rows */}
            {fileRows.map(file => {
              const isSel = selectedFiles.has(file.name);
              return (
                <div
                  key={file.name}
                  onClick={() => {
                    setSelectedFiles(prev => {
                      const s = new Set(prev);
                      if (s.has(file.name)) s.delete(file.name);
                      else s.add(file.name);
                      return s;
                    });
                  }}
                  style={{
                    height: 48,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '0 14px',
                    borderRadius: 8,
                    background: isSel ? 'rgba(46,156,106,0.04)' : 'transparent',
                    borderLeft: isSel ? '3px solid #2E9C6A' : '3px solid transparent',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    marginBottom: 2,
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
                  onMouseLeave={e => (e.currentTarget.style.background = isSel ? 'rgba(46,156,106,0.04)' : 'transparent')}
                >
                  <FileText size={18} style={{ color: '#4A6070', flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ color: '#FFFFFF', fontSize: 13, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {file.name}
                    </div>
                    <div style={{ color: '#4A6070', fontSize: 10, fontFamily: 'var(--font-mono)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {file.path}
                    </div>
                  </div>
                  <div style={{ color: '#4DA6D8', fontSize: 12, fontWeight: 500, flexShrink: 0 }}>
                    {file.size}
                  </div>
                  <div
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: 4,
                      border: `2px solid ${isSel ? '#2E9C6A' : 'rgba(255,255,255,0.2)'}`,
                      background: isSel ? '#2E9C6A' : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      transition: 'all 0.15s',
                    }}
                  >
                    {isSel && <div style={{ width: 6, height: 6, borderRadius: 1, background: '#fff' }} />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Action Bar */}
        <div
          style={{
            padding: '12px 24px',
            background: '#0D1922',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ color: '#8BA8BE', fontSize: 13 }}>
            <span style={{ color: '#FFFFFF', fontWeight: 600 }}>{selectedFiles.size} items</span> selected —{' '}
            <span style={{ color: '#2E9C6A', fontWeight: 500 }}>{totalSelected.toFixed(1)} GB</span>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              style={{
                height: 36,
                padding: '0 14px',
                borderRadius: 8,
                background: 'none',
                border: 'none',
                color: '#8BA8BE',
                fontSize: 12,
                cursor: 'pointer',
                fontFamily: 'var(--font-text)',
                textDecoration: 'underline',
                textDecorationColor: 'rgba(139,168,190,0.4)',
              }}
            >
              Ignore Selected
            </button>
            <button
              onClick={() => setScreen('overview')}
              style={{
                height: 36,
                padding: '0 22px',
                borderRadius: 8,
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
              Clean {totalSelected.toFixed(1)} GB
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── Ignore List ───────────────────────────────────────────
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', fontFamily: 'var(--font-text)' }}>
      <ModuleHeader
        icon={Trash2}
        iconColor="#4DA6D8"
        title="Ignore List"
        subtitle="Items CCMac will skip during scans"
        ctaLabel="Back to Cleanup"
        onCta={() => setScreen('overview')}
      />
      <div className="dark-scroll" style={{ flex: 1, overflowY: 'auto', padding: 28 }}>
        {ignoreItems.length === 0 ? (
          <div style={{ textAlign: 'center', paddingTop: 80 }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📋</div>
            <div style={{ color: '#8BA8BE', fontSize: 16 }}>No ignored items yet</div>
          </div>
        ) : (
          <div style={{ maxWidth: 600 }}>
            <div style={{ color: '#8BA8BE', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
              {ignoreItems.length} Ignored Items
            </div>
            {ignoreItems.map(item => (
              <div
                key={item.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '14px 16px',
                  borderRadius: 10,
                  background: '#1C2E3E',
                  border: '1px solid rgba(255,255,255,0.06)',
                  marginBottom: 8,
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ color: '#FFFFFF', fontSize: 13, fontWeight: 500 }}>{item.app}</div>
                  <div style={{ color: '#4A6070', fontSize: 11, fontFamily: 'var(--font-mono)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.path}
                  </div>
                  <div style={{ color: '#4A6070', fontSize: 11, marginTop: 2 }}>Added {item.addedDate}</div>
                </div>
                <button
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 6,
                    background: 'rgba(224,82,82,0.1)',
                    border: '1px solid rgba(224,82,82,0.2)',
                    color: '#E05252',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}