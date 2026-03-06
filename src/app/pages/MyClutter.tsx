import { useState } from 'react';
import { Layers, ScanLine, FileText, Image } from 'lucide-react';
import { ModuleHeader } from '../components/ModuleHeader';

type Screen = 'overview' | 'duplicates' | 'similar-photos';

const duplicateGroups = [
  {
    id: 'g1',
    master: { name: 'family_vacation.jpg', path: '~/Pictures/2023/Summer', size: '4.2 MB' },
    dupes: [
      { name: 'family_vacation copy.jpg', path: '~/Desktop', size: '4.2 MB' },
      { name: 'family_vacation(1).jpg', path: '~/Downloads', size: '4.2 MB' },
    ],
  },
  {
    id: 'g2',
    master: { name: 'project_brief.pdf', path: '~/Documents/Work', size: '1.8 MB' },
    dupes: [
      { name: 'project_brief_backup.pdf', path: '~/Downloads', size: '1.8 MB' },
    ],
  },
  {
    id: 'g3',
    master: { name: 'design-system.fig', path: '~/Documents/Design', size: '28.4 MB' },
    dupes: [
      { name: 'design-system copy.fig', path: '~/Desktop', size: '28.4 MB' },
      { name: 'design-system_old.fig', path: '~/Downloads', size: '28.4 MB' },
    ],
  },
  {
    id: 'g4',
    master: { name: 'receipt-2024-01.pdf', path: '~/Documents/Finance', size: '234 KB' },
    dupes: [
      { name: 'receipt-2024-01 2.pdf', path: '~/Desktop', size: '234 KB' },
    ],
  },
];

const photoGroups = [
  {
    id: 'pg1',
    count: 5,
    size: '18.4 MB',
    similarity: 94,
    colors: ['#4DA6D8', '#1A6B9A', '#8BA8BE', '#152230'],
  },
  {
    id: 'pg2',
    count: 3,
    size: '8.2 MB',
    similarity: 88,
    colors: ['#2E9C6A', '#3CB875', '#1C2E3E', '#0F1B26'],
  },
  {
    id: 'pg3',
    count: 7,
    size: '32.6 MB',
    similarity: 91,
    colors: ['#E07A30', '#E0A030', '#8BA8BE', '#1C2E3E'],
  },
  {
    id: 'pg4',
    count: 4,
    size: '14.1 MB',
    similarity: 96,
    colors: ['#7B52C8', '#4DA6D8', '#152230', '#0F1B26'],
  },
  {
    id: 'pg5',
    count: 6,
    size: '22.8 MB',
    similarity: 87,
    colors: ['#E05252', '#E07A30', '#FFFFFF', '#8BA8BE'],
  },
];

export function MyClutter() {
  const [screen, setScreen] = useState<Screen>('overview');
  const [scanned, setScanned] = useState<Set<string>>(new Set());
  const [scanning, setScanning] = useState<string | null>(null);
  const [selectedDupes, setSelectedDupes] = useState<Set<string>>(new Set(
    duplicateGroups.flatMap(g => g.dupes.map((d, i) => `${g.id}-d-${i}`))
  ));
  const [selectedPhotos, setSelectedPhotos] = useState<Set<string>>(new Set());
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);

  const startScan = (type: string) => {
    setScanning(type);
    setTimeout(() => {
      setScanning(null);
      setScanned(prev => new Set([...prev, type]));
      if (type === 'duplicates') setScreen('duplicates');
      if (type === 'photos') setScreen('similar-photos');
    }, 1800);
  };

  const categoryCards = [
    {
      id: 'duplicates',
      icon: '📂',
      title: 'Duplicates',
      desc: 'Find identical files wasting space',
      gradient: 'linear-gradient(135deg, rgba(77,166,216,0.12), rgba(26,107,154,0.08))',
      border: 'rgba(77,166,216,0.2)',
      color: '#4DA6D8',
      result: scanned.has('duplicates') ? '847 duplicates · 2.1 GB' : null,
      targetScreen: 'duplicates' as Screen,
    },
    {
      id: 'photos',
      icon: '🖼️',
      title: 'Similar Photos',
      desc: 'Find near-duplicate photo clusters',
      gradient: 'linear-gradient(135deg, rgba(123,82,200,0.12), rgba(77,166,216,0.08))',
      border: 'rgba(123,82,200,0.2)',
      color: '#7B52C8',
      result: scanned.has('photos') ? '25 clusters · 96.1 MB' : null,
      targetScreen: 'similar-photos' as Screen,
    },
    {
      id: 'large',
      icon: '📦',
      title: 'Large & Old Files',
      desc: 'Files over 100 MB last accessed > 1 year ago',
      gradient: 'linear-gradient(135deg, rgba(224,122,48,0.12), rgba(224,82,82,0.08))',
      border: 'rgba(224,122,48,0.2)',
      color: '#E07A30',
      result: scanned.has('large') ? '12 files · 8.4 GB' : null,
      targetScreen: 'overview' as Screen,
    },
  ];

  // ─── Overview ─────────────────────────────────────────────
  if (screen === 'overview') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', fontFamily: 'var(--font-text)' }}>
        <ModuleHeader
          icon={Layers}
          iconColor="#E07A30"
          title="My Clutter"
          subtitle="Find and remove duplicates, similar photos, and large old files"
        />
        <div className="dark-scroll" style={{ flex: 1, overflowY: 'auto', padding: 28 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, maxWidth: 800 }}>
            {categoryCards.map((card, i) => (
              <div
                key={card.id}
                className={`animate-stagger-${i + 1}`}
                style={{
                  padding: '24px',
                  borderRadius: 16,
                  background: card.gradient,
                  border: `1px solid ${card.border}`,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                  boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
                }}
              >
                <div style={{ fontSize: 44 }}>{card.icon}</div>
                <div>
                  <div style={{ color: '#FFFFFF', fontSize: 16, fontWeight: 600 }}>{card.title}</div>
                  <div style={{ color: '#8BA8BE', fontSize: 12, marginTop: 4 }}>{card.desc}</div>
                </div>
                {card.result ? (
                  <>
                    <div
                      style={{
                        color: card.color,
                        fontSize: 13,
                        fontWeight: 600,
                        background: `${card.color}12`,
                        borderRadius: 8,
                        padding: '6px 10px',
                        border: `1px solid ${card.color}25`,
                      }}
                    >
                      {card.result}
                    </div>
                    <button
                      onClick={() => setScreen(card.targetScreen === 'overview' ? 'overview' : card.targetScreen)}
                      style={{
                        height: 36,
                        borderRadius: 10,
                        background: card.color,
                        border: 'none',
                        color: '#FFFFFF',
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: 'pointer',
                        fontFamily: 'var(--font-text)',
                      }}
                    >
                      Review →
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => startScan(card.id)}
                    disabled={scanning === card.id}
                    style={{
                      marginTop: 'auto',
                      height: 38,
                      borderRadius: 10,
                      background: scanning === card.id ? `${card.color}30` : card.color,
                      border: 'none',
                      color: '#FFFFFF',
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: scanning === card.id ? 'wait' : 'pointer',
                      fontFamily: 'var(--font-text)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                      boxShadow: `0 0 12px ${card.color}30`,
                    }}
                  >
                    {scanning === card.id ? (
                      <>
                        <div className="animate-spin-slow" style={{ width: 14, height: 14, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.2)', borderTop: '2px solid #fff' }} />
                        Scanning...
                      </>
                    ) : (
                      <>
                        <ScanLine size={14} />
                        Scan
                      </>
                    )}
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Info */}
          <div
            style={{
              marginTop: 28,
              padding: '16px 20px',
              borderRadius: 12,
              background: 'rgba(26,107,154,0.06)',
              border: '1px solid rgba(26,107,154,0.15)',
              maxWidth: 800,
            }}
          >
            <div style={{ color: '#4DA6D8', fontSize: 13, fontWeight: 600, marginBottom: 4 }}>💡 Smart Detection</div>
            <div style={{ color: '#8BA8BE', fontSize: 12, lineHeight: 1.6 }}>
              CCMac uses byte-by-byte comparison for true duplicates and AI-powered perceptual hashing for similar photos. Large & Old Files shows files over 100 MB not opened in over a year.
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── Duplicates ────────────────────────────────────────────
  if (screen === 'duplicates') {
    const selectedCount = selectedDupes.size;
    const selectedMB = selectedCount * 4.1;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', fontFamily: 'var(--font-text)' }}>
        <ModuleHeader
          icon={Layers}
          iconColor="#4DA6D8"
          title="Duplicates"
          subtitle={`${duplicateGroups.reduce((acc, g) => acc + g.dupes.length, 0)} duplicates found`}
          ctaLabel="Back"
          onCta={() => setScreen('overview')}
        />
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          {/* Duplicate Groups */}
          <div className="dark-scroll" style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
            {duplicateGroups.map(group => (
              <div key={group.id} style={{ marginBottom: 16 }}>
                {/* Master File */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '10px 12px',
                    borderRadius: '10px 10px 0 0',
                    background: 'rgba(46,156,106,0.06)',
                    border: '1px solid rgba(46,156,106,0.2)',
                    borderBottom: 'none',
                  }}
                >
                  <FileText size={18} style={{ color: '#4A6070', flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ color: '#FFFFFF', fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {group.master.name}
                    </div>
                    <div style={{ color: '#4A6070', fontSize: 10, fontFamily: 'var(--font-mono)' }}>{group.master.path}</div>
                  </div>
                  <span style={{ color: '#3CB875', fontSize: 11, fontWeight: 700, background: 'rgba(60,184,117,0.12)', border: '1px solid rgba(60,184,117,0.25)', borderRadius: 4, padding: '2px 6px' }}>
                    KEEP
                  </span>
                  <span style={{ color: '#8BA8BE', fontSize: 12 }}>{group.master.size}</span>
                </div>

                {/* Duplicates */}
                {group.dupes.map((dupe, di) => {
                  const key = `${group.id}-d-${di}`;
                  const isSel = selectedDupes.has(key);
                  return (
                    <div
                      key={key}
                      onClick={() => {
                        setSelectedDupes(prev => {
                          const s = new Set(prev);
                          if (s.has(key)) s.delete(key);
                          else s.add(key);
                          return s;
                        });
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        padding: '9px 12px 9px 32px',
                        borderRadius: di === group.dupes.length - 1 ? '0 0 10px 10px' : 0,
                        background: isSel ? 'rgba(224,82,82,0.05)' : '#1C2E3E',
                        border: '1px solid rgba(255,255,255,0.05)',
                        borderTop: 'none',
                        cursor: 'pointer',
                        transition: 'all 0.1s',
                      }}
                    >
                      <FileText size={15} style={{ color: '#4A6070', flexShrink: 0 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ color: '#FFFFFF', fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {dupe.name}
                        </div>
                        <div style={{ color: '#4A6070', fontSize: 10, fontFamily: 'var(--font-mono)' }}>{dupe.path}</div>
                      </div>
                      {isSel && (
                        <span style={{ color: '#E05252', fontSize: 10, fontWeight: 700, background: 'rgba(224,82,82,0.12)', border: '1px solid rgba(224,82,82,0.25)', borderRadius: 4, padding: '2px 6px' }}>
                          DELETE
                        </span>
                      )}
                      <span style={{ color: '#8BA8BE', fontSize: 11 }}>{dupe.size}</span>
                      <div
                        style={{
                          width: 16,
                          height: 16,
                          borderRadius: 4,
                          border: `2px solid ${isSel ? '#E05252' : 'rgba(255,255,255,0.2)'}`,
                          background: isSel ? '#E05252' : 'transparent',
                          flexShrink: 0,
                          transition: 'all 0.1s',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {isSel && <div style={{ width: 5, height: 5, borderRadius: 1, background: '#fff' }} />}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Right: Preview Panel */}
          <div style={{ width: 240, padding: '16px', background: '#0D1922', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ color: '#8BA8BE', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Preview
            </div>
            <div
              style={{
                aspectRatio: '4/3',
                borderRadius: 10,
                background: 'linear-gradient(135deg, #1C2E3E, #152230)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <Image size={36} style={{ color: '#4A6070' }} />
            </div>
            <div style={{ color: '#8BA8BE', fontSize: 12, lineHeight: 1.6 }}>
              Select a file to preview its contents and compare with duplicates.
            </div>
          </div>
        </div>

        {/* Bottom Action Bar */}
        <div style={{ padding: '12px 24px', background: '#0D1922', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ color: '#8BA8BE', fontSize: 13 }}>
            <span style={{ color: '#FFFFFF', fontWeight: 600 }}>{selectedCount} duplicates</span> selected —{' '}
            <span style={{ color: '#2E9C6A' }}>{selectedMB.toFixed(1)} MB</span> to free
          </div>
          <button
            disabled={selectedCount === 0}
            onClick={() => setScreen('overview')}
            style={{
              height: 38,
              padding: '0 22px',
              borderRadius: 10,
              background: selectedCount > 0 ? '#E05252' : 'rgba(255,255,255,0.08)',
              border: 'none',
              color: selectedCount > 0 ? '#FFFFFF' : 'rgba(255,255,255,0.3)',
              fontSize: 13,
              fontWeight: 600,
              cursor: selectedCount > 0 ? 'pointer' : 'not-allowed',
              fontFamily: 'var(--font-text)',
              boxShadow: selectedCount > 0 ? '0 0 12px rgba(224,82,82,0.3)' : 'none',
            }}
          >
            Remove {selectedCount} Duplicate{selectedCount !== 1 ? 's' : ''}
          </button>
        </div>
      </div>
    );
  }

  // ─── Similar Photos ────────────────────────────────────────
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', fontFamily: 'var(--font-text)' }}>
      <ModuleHeader
        icon={Image}
        iconColor="#7B52C8"
        title="Similar Photos"
        subtitle={`${photoGroups.length} clusters of similar photos found`}
        ctaLabel="Back"
        onCta={() => setScreen('overview')}
      />
      <div className="dark-scroll" style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 14,
          }}
        >
          {photoGroups.map(group => {
            const isSel = selectedGroup === group.id;
            return (
              <div
                key={group.id}
                onClick={() => setSelectedGroup(isSel ? null : group.id)}
                style={{
                  borderRadius: 14,
                  background: isSel ? 'rgba(123,82,200,0.1)' : '#1C2E3E',
                  border: `1px solid ${isSel ? 'rgba(123,82,200,0.3)' : 'rgba(255,255,255,0.06)'}`,
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {/* Photo Cluster Thumbnails */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, padding: 6 }}>
                  {group.colors.map((color, ci) => (
                    <div
                      key={ci}
                      style={{
                        aspectRatio: '1',
                        borderRadius: 6,
                        background: `linear-gradient(135deg, ${color}, ${color}aa)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Image size={14} style={{ color: 'rgba(255,255,255,0.3)' }} />
                    </div>
                  ))}
                </div>
                <div style={{ padding: '10px 12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ color: '#FFFFFF', fontSize: 12, fontWeight: 500 }}>
                      {group.count} similar photos
                    </div>
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        color: '#7B52C8',
                        background: 'rgba(123,82,200,0.12)',
                        border: '1px solid rgba(123,82,200,0.25)',
                        borderRadius: 4,
                        padding: '1px 5px',
                      }}
                    >
                      {group.similarity}% similar
                    </span>
                  </div>
                  <div style={{ color: '#8BA8BE', fontSize: 11, marginTop: 4 }}>{group.size}</div>
                </div>
              </div>
            );
          })}
        </div>

        {selectedGroup && (
          <div style={{ marginTop: 24, padding: '16px 20px', background: '#1C2E3E', borderRadius: 14, border: '1px solid rgba(123,82,200,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ color: '#FFFFFF', fontSize: 13, fontWeight: 600 }}>
                Cluster selected — {photoGroups.find(g => g.id === selectedGroup)?.count} photos
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  onClick={() => setScreen('overview')}
                  style={{ height: 34, padding: '0 14px', borderRadius: 8, background: 'transparent', border: '1px solid #1A6B9A', color: '#4DA6D8', fontSize: 12, cursor: 'pointer', fontFamily: 'var(--font-text)' }}
                >
                  Review Manually
                </button>
                <button
                  onClick={() => setScreen('overview')}
                  style={{ height: 34, padding: '0 16px', borderRadius: 8, background: '#7B52C8', border: 'none', color: '#FFFFFF', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-text)' }}
                >
                  Keep Best, Remove Rest
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}