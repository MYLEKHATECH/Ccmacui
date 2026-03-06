import { useState } from 'react';
import { Cloud, CheckCircle2, Trash2, Download, CloudOff, Unlink } from 'lucide-react';
import { ModuleHeader } from '../components/ModuleHeader';

type Screen = 'connect' | 'space-lens' | 'complete';

const cloudServices = [
  {
    id: 'icloud',
    name: 'iCloud Drive',
    icon: '☁️',
    color: '#4DA6D8',
    usedGB: 42.8,
    totalGB: 200,
    connected: true,
  },
  {
    id: 'gdrive',
    name: 'Google Drive',
    icon: '🟢',
    color: '#3CB875',
    usedGB: 8.2,
    totalGB: 15,
    connected: false,
  },
  {
    id: 'onedrive',
    name: 'OneDrive',
    icon: '🔵',
    color: '#1A6B9A',
    usedGB: 0,
    totalGB: 5,
    connected: false,
  },
  {
    id: 'dropbox',
    name: 'Dropbox',
    icon: '📦',
    color: '#7B52C8',
    usedGB: 0,
    totalGB: 2,
    connected: false,
  },
];

const cloudFiles = [
  { name: 'vacation_photos_2023.zip', path: '/iCloud Drive/Downloads', size: '2.8 GB', cloudOnly: true, type: '📦' },
  { name: 'old_project_backup.tar.gz', path: '/iCloud Drive/Documents', size: '4.2 GB', cloudOnly: true, type: '🗜️' },
  { name: 'design_assets.fig', path: '/iCloud Drive/Figma Projects', size: '284 MB', cloudOnly: false, type: '🎨' },
  { name: 'Xcode_14_installer.dmg', path: '/iCloud Drive/Downloads', size: '6.8 GB', cloudOnly: false, type: '💿' },
  { name: 'iPhone_Photos_2022.pkg', path: '/iCloud Drive/Photos', size: '18.4 GB', cloudOnly: true, type: '📷' },
  { name: 'meeting_recordings/', path: '/iCloud Drive/Documents/Meetings', size: '3.1 GB', cloudOnly: false, type: '🎥' },
];

export function CloudCleanup() {
  const [screen, setScreen] = useState<Screen>('connect');
  const [connected, setConnected] = useState<Set<string>>(new Set(['icloud']));
  const [activeCloud, setActiveCloud] = useState<string>('icloud');
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [connecting, setConnecting] = useState<string | null>(null);

  const connect = (id: string) => {
    setConnecting(id);
    setTimeout(() => {
      setConnected(prev => new Set([...prev, id]));
      setConnecting(null);
    }, 1500);
  };

  const disconnect = (id: string) => {
    setConnected(prev => { const s = new Set(prev); s.delete(id); return s; });
  };

  const toggleFile = (name: string) => {
    setSelectedFiles(prev => {
      const s = new Set(prev);
      if (s.has(name)) s.delete(name);
      else s.add(name);
      return s;
    });
  };

  const totalSelected = cloudFiles
    .filter(f => selectedFiles.has(f.name))
    .reduce((acc, f) => acc + parseFloat(f.size), 0);

  // ─── Connect Accounts ──────────────────────────���──────────
  if (screen === 'connect') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', fontFamily: 'var(--font-text)' }}>
        <ModuleHeader
          icon={Cloud}
          iconColor="#4DA6D8"
          title="Cloud Cleanup"
          subtitle="Free up storage across all your cloud services"
          ctaLabel={connected.size > 0 ? 'View Cloud Files' : undefined}
          onCta={() => setScreen('space-lens')}
          secondaryLabel="Settings"
        />
        <div className="dark-scroll" style={{ flex: 1, overflowY: 'auto', padding: 28 }}>
          <div style={{ marginBottom: 24 }}>
            <div style={{ color: '#8BA8BE', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>
              Connected Services ({connected.size} / {cloudServices.length})
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14, maxWidth: 700 }}>
              {cloudServices.map((svc, i) => {
                const isConnected = connected.has(svc.id);
                const isConnecting = connecting === svc.id;
                const usedPct = (svc.usedGB / svc.totalGB) * 100;

                return (
                  <div
                    key={svc.id}
                    className={`animate-stagger-${Math.min(i + 1, 4)}`}
                    style={{
                      padding: '20px',
                      borderRadius: 16,
                      background: isConnected ? `rgba(${svc.color === '#4DA6D8' ? '77,166,216' : svc.color === '#3CB875' ? '60,184,117' : svc.color === '#1A6B9A' ? '26,107,154' : '123,82,200'},0.06)` : '#1C2E3E',
                      border: `1px solid ${isConnected ? `${svc.color}30` : 'rgba(255,255,255,0.06)'}`,
                      boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
                      position: 'relative',
                    }}
                  >
                    {/* Connected Dot */}
                    {isConnected && (
                      <div
                        style={{
                          position: 'absolute',
                          top: 14,
                          right: 14,
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          background: '#3CB875',
                          boxShadow: '0 0 6px rgba(60,184,117,0.5)',
                        }}
                      />
                    )}

                    {/* Service Icon + Name */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                      <div
                        style={{
                          width: 52,
                          height: 52,
                          borderRadius: 14,
                          background: `${svc.color}15`,
                          border: `1px solid ${svc.color}30`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 28,
                          flexShrink: 0,
                        }}
                      >
                        {svc.icon}
                      </div>
                      <div>
                        <div style={{ color: '#FFFFFF', fontSize: 16, fontWeight: 600 }}>{svc.name}</div>
                        {isConnected ? (
                          <div style={{ color: '#3CB875', fontSize: 11, marginTop: 2 }}>Connected</div>
                        ) : (
                          <div style={{ color: '#4A6070', fontSize: 11, marginTop: 2 }}>Not connected</div>
                        )}
                      </div>
                    </div>

                    {/* Storage Bar */}
                    {isConnected && svc.usedGB > 0 && (
                      <div style={{ marginBottom: 14 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                          <span style={{ color: '#8BA8BE', fontSize: 11 }}>Storage</span>
                          <span style={{ color: '#FFFFFF', fontSize: 11, fontWeight: 500 }}>
                            {svc.usedGB} GB / {svc.totalGB} GB
                          </span>
                        </div>
                        <div style={{ height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                          <div
                            style={{
                              height: '100%',
                              width: `${usedPct}%`,
                              background: usedPct > 80 ? '#E05252' : svc.color,
                              borderRadius: 3,
                              transition: 'width 0.5s ease',
                            }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Action */}
                    {isConnected ? (
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button
                          onClick={() => setScreen('space-lens')}
                          style={{
                            flex: 2,
                            height: 34,
                            borderRadius: 8,
                            background: svc.color,
                            border: 'none',
                            color: '#FFFFFF',
                            fontSize: 12,
                            fontWeight: 600,
                            cursor: 'pointer',
                            fontFamily: 'var(--font-text)',
                          }}
                        >
                          View Files →
                        </button>
                        <button
                          onClick={() => disconnect(svc.id)}
                          style={{
                            flex: 1,
                            height: 34,
                            borderRadius: 8,
                            background: 'transparent',
                            border: '1px solid rgba(255,255,255,0.1)',
                            color: '#8BA8BE',
                            fontSize: 11,
                            cursor: 'pointer',
                            fontFamily: 'var(--font-text)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 4,
                          }}
                        >
                          <Unlink size={11} />
                          Disconnect
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => connect(svc.id)}
                        disabled={isConnecting}
                        style={{
                          width: '100%',
                          height: 36,
                          borderRadius: 8,
                          background: isConnecting ? `${svc.color}30` : 'transparent',
                          border: `1px solid ${svc.color}`,
                          color: svc.color,
                          fontSize: 13,
                          fontWeight: 600,
                          cursor: isConnecting ? 'wait' : 'pointer',
                          fontFamily: 'var(--font-text)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 8,
                          transition: 'all 0.15s',
                        }}
                        onMouseEnter={e => !isConnecting && (e.currentTarget.style.background = `${svc.color}15`)}
                        onMouseLeave={e => !isConnecting && (e.currentTarget.style.background = 'transparent')}
                      >
                        {isConnecting ? (
                          <>
                            <div className="animate-spin-slow" style={{ width: 14, height: 14, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.2)', borderTop: `2px solid ${svc.color}` }} />
                            Connecting...
                          </>
                        ) : (
                          <>
                            <Cloud size={14} />
                            Connect
                          </>
                        )}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Info Box */}
          <div
            style={{
              maxWidth: 700,
              padding: '16px 20px',
              borderRadius: 12,
              background: 'rgba(26,107,154,0.06)',
              border: '1px solid rgba(26,107,154,0.15)',
            }}
          >
            <div style={{ color: '#4DA6D8', fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
              🔒 Secure & Private
            </div>
            <div style={{ color: '#8BA8BE', fontSize: 12, lineHeight: 1.6 }}>
              CCMac uses OAuth to connect to your cloud services. We never store your credentials or access your files directly — all cleanup actions are performed through official APIs.
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── Cloud Space Lens ──────────────────────────────────────
  if (screen === 'space-lens') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', fontFamily: 'var(--font-text)' }}>
        <ModuleHeader
          icon={Cloud}
          iconColor="#4DA6D8"
          title="Cloud Files"
          subtitle="Manage files across connected cloud services"
          ctaLabel="Back"
          onCta={() => setScreen('connect')}
        />

        {/* Service Tabs */}
        <div style={{ display: 'flex', padding: '0 24px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          {cloudServices.filter(s => connected.has(s.id)).map(svc => (
            <button
              key={svc.id}
              onClick={() => setActiveCloud(svc.id)}
              style={{
                padding: '10px 18px',
                background: 'none',
                border: 'none',
                borderBottom: activeCloud === svc.id ? `2px solid ${svc.color}` : '2px solid transparent',
                color: activeCloud === svc.id ? '#FFFFFF' : '#8BA8BE',
                fontSize: 13,
                fontWeight: activeCloud === svc.id ? 600 : 400,
                cursor: 'pointer',
                fontFamily: 'var(--font-text)',
                marginBottom: -1,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <span>{svc.icon}</span>
              {svc.name}
            </button>
          ))}
        </div>

        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          {/* File List */}
          <div className="dark-scroll" style={{ flex: 1, overflowY: 'auto', padding: '16px 24px' }}>
            <div style={{ color: '#8BA8BE', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
              Large Files in Cloud
            </div>
            {cloudFiles.map(file => {
              const isSel = selectedFiles.has(file.name);
              return (
                <div
                  key={file.name}
                  onClick={() => toggleFile(file.name)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '12px 14px',
                    borderRadius: 10,
                    background: isSel ? 'rgba(224,82,82,0.05)' : '#1C2E3E',
                    border: `1px solid ${isSel ? 'rgba(224,82,82,0.2)' : 'rgba(255,255,255,0.05)'}`,
                    marginBottom: 6,
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  <span style={{ fontSize: 22 }}>{file.type}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ color: '#FFFFFF', fontSize: 13, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {file.name}
                    </div>
                    <div style={{ color: '#4A6070', fontSize: 10, fontFamily: 'var(--font-mono)' }}>{file.path}</div>
                  </div>
                  {/* Cloud Only badge */}
                  {file.cloudOnly ? (
                    <span style={{ fontSize: 10, color: '#4DA6D8', background: 'rgba(77,166,216,0.1)', border: '1px solid rgba(77,166,216,0.2)', borderRadius: 4, padding: '1px 6px', fontWeight: 700, flexShrink: 0 }}>
                      ☁ CLOUD ONLY
                    </span>
                  ) : (
                    <span style={{ fontSize: 10, color: '#8BA8BE', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 4, padding: '1px 6px', flexShrink: 0 }}>
                      📥 LOCAL COPY
                    </span>
                  )}
                  <span style={{ color: '#4DA6D8', fontSize: 12, fontWeight: 500, flexShrink: 0 }}>{file.size}</span>
                  <div
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: 4,
                      border: `2px solid ${isSel ? '#E05252' : 'rgba(255,255,255,0.2)'}`,
                      background: isSel ? '#E05252' : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      transition: 'all 0.1s',
                    }}
                  >
                    {isSel && <div style={{ width: 6, height: 6, borderRadius: 1, background: '#fff' }} />}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Panel */}
          <div style={{ width: 220, padding: '16px', background: '#0D1922', borderLeft: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ color: '#8BA8BE', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Actions</div>
            {[
              { icon: Trash2, label: 'Delete from Cloud', color: '#E05252', bg: 'rgba(224,82,82,0.1)', border: 'rgba(224,82,82,0.2)' },
              { icon: CloudOff, label: 'Remove Local Copy', color: '#E07A30', bg: 'rgba(224,122,48,0.1)', border: 'rgba(224,122,48,0.2)' },
              { icon: Download, label: 'Download & Remove', color: '#4DA6D8', bg: 'rgba(77,166,216,0.1)', border: 'rgba(77,166,216,0.2)' },
            ].map(action => (
              <button
                key={action.label}
                onClick={() => selectedFiles.size > 0 && setScreen('complete')}
                disabled={selectedFiles.size === 0}
                style={{
                  height: 38,
                  borderRadius: 10,
                  background: selectedFiles.size > 0 ? action.bg : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${selectedFiles.size > 0 ? action.border : 'rgba(255,255,255,0.05)'}`,
                  color: selectedFiles.size > 0 ? action.color : '#4A6070',
                  fontSize: 12,
                  cursor: selectedFiles.size > 0 ? 'pointer' : 'not-allowed',
                  fontFamily: 'var(--font-text)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  transition: 'all 0.15s',
                }}
              >
                <action.icon size={13} />
                {action.label}
              </button>
            ))}

            {selectedFiles.size > 0 && (
              <div style={{ padding: '10px', borderRadius: 8, background: 'rgba(46,156,106,0.06)', border: '1px solid rgba(46,156,106,0.15)', textAlign: 'center' }}>
                <div style={{ color: '#2E9C6A', fontSize: 16, fontWeight: 700, fontFamily: 'var(--font-display)' }}>
                  {totalSelected.toFixed(1)} GB
                </div>
                <div style={{ color: '#8BA8BE', fontSize: 11, marginTop: 2 }}>selected to free</div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ─── Complete ─────────────────────────────────────────────
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', fontFamily: 'var(--font-text)' }}>
      <ModuleHeader
        icon={Cloud}
        iconColor="#4DA6D8"
        title="Cloud Cleanup"
        subtitle="Cleanup complete!"
        ctaLabel="Done"
        onCta={() => setScreen('connect')}
      />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 28 }}>
        <div
          className="animate-scale-in"
          style={{
            textAlign: 'center',
            padding: '36px 48px',
            background: 'linear-gradient(135deg, rgba(77,166,216,0.08), rgba(26,107,154,0.06))',
            borderRadius: 20,
            border: '1px solid rgba(77,166,216,0.2)',
            maxWidth: 480,
          }}
        >
          <div style={{ fontSize: 48, marginBottom: 12 }}>☁️</div>
          <div style={{ color: '#4DA6D8', fontSize: 48, fontWeight: 700, fontFamily: 'var(--font-display)', lineHeight: 1 }}>
            {totalSelected.toFixed(1)} GB
          </div>
          <div style={{ color: '#FFFFFF', fontSize: 16, fontWeight: 600, marginTop: 8 }}>Freed from Cloud</div>
          <div style={{ color: '#8BA8BE', fontSize: 13, marginTop: 6 }}>All selected files have been successfully removed</div>

          {/* Service breakdown */}
          <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'rgba(255,255,255,0.04)', borderRadius: 8 }}>
              <span style={{ color: '#8BA8BE', fontSize: 12 }}>☁️ iCloud Drive</span>
              <span style={{ color: '#4DA6D8', fontSize: 12, fontWeight: 500 }}>{(totalSelected * 0.7).toFixed(1)} GB freed</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
            <button
              onClick={() => setScreen('connect')}
              style={{ flex: 1, height: 42, borderRadius: 10, background: '#4DA6D8', border: 'none', color: '#FFFFFF', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-text)' }}
            >
              Done
            </button>
            <button
              onClick={() => setScreen('space-lens')}
              style={{ flex: 1, height: 42, borderRadius: 10, background: 'transparent', border: '1px solid #1A6B9A', color: '#4DA6D8', fontSize: 14, cursor: 'pointer', fontFamily: 'var(--font-text)' }}
            >
              View Cloud →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}