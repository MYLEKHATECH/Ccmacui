import { useState } from 'react';
import { ScanLine, ChevronRight, ArrowUp, FolderOpen, Trash2, Grid, Circle } from 'lucide-react';
import { ModuleHeader } from '../components/ModuleHeader';

type ViewMode = 'squares' | 'bubbles';

interface TreeNode {
  id: string;
  name: string;
  size: number; // in MB
  color: string;
  type: string;
  children?: TreeNode[];
  path: string;
}

const rootData: TreeNode[] = [
  { id: 'user', name: 'Users', size: 124800, color: '#4DA6D8', type: 'folder', path: '/Users', children: [
    { id: 'docs', name: 'Documents', size: 42600, color: '#4DA6D8', type: 'folder', path: '/Users/alex/Documents', children: [
      { id: 'work', name: 'Work', size: 18200, color: '#4DA6D8', type: 'folder', path: '/Users/alex/Documents/Work' },
      { id: 'finance', name: 'Finance', size: 8400, color: '#1A6B9A', type: 'folder', path: '/Users/alex/Documents/Finance' },
      { id: 'personal', name: 'Personal', size: 16000, color: '#8BA8BE', type: 'folder', path: '/Users/alex/Documents/Personal' },
    ]},
    { id: 'pics', name: 'Pictures', size: 48200, color: '#7B52C8', type: 'folder', path: '/Users/alex/Pictures' },
    { id: 'dev', name: 'Developer', size: 22400, color: '#2E9C6A', type: 'folder', path: '/Users/alex/Developer' },
    { id: 'dl', name: 'Downloads', size: 11600, color: '#E07A30', type: 'folder', path: '/Users/alex/Downloads' },
  ]},
  { id: 'apps', name: 'Applications', size: 84200, color: '#3CB875', type: 'folder', path: '/Applications', children: [
    { id: 'xcode', name: 'Xcode', size: 12900, color: '#3CB875', type: 'app', path: '/Applications/Xcode.app' },
    { id: 'chrome', name: 'Chrome', size: 450, color: '#3CB875', type: 'app', path: '/Applications/Google Chrome.app' },
    { id: 'figma', name: 'Figma', size: 418, color: '#2E9C6A', type: 'app', path: '/Applications/Figma.app' },
    { id: 'others', name: 'Other Apps', size: 70432, color: '#1A6B9A', type: 'folder', path: '/Applications' },
  ]},
  { id: 'library', name: 'Library', size: 36400, color: '#E05252', type: 'folder', path: '/Library' },
  { id: 'system', name: 'System', size: 18600, color: '#E07A30', type: 'folder', path: '/System' },
  { id: 'private', name: 'Private', size: 8200, color: '#8BA8BE', type: 'folder', path: '/private' },
];

const typeColors: Record<string, string> = {
  Documents: '#4DA6D8',
  Photos: '#7B52C8',
  Applications: '#3CB875',
  System: '#E07A30',
  Developer: '#2E9C6A',
  Other: '#8BA8BE',
  Backups: '#E05252',
};

const colorLegend = Object.entries(typeColors);

function TreemapCell({
  node,
  onClick,
  style,
}: {
  node: TreeNode;
  onClick: (node: TreeNode) => void;
  style: React.CSSProperties;
}) {
  const [hovered, setHovered] = useState(false);
  const [tooltip, setTooltip] = useState<{ x: number; y: number } | null>(null);

  return (
    <div
      className="treemap-cell"
      onClick={() => onClick(node)}
      onMouseEnter={e => {
        setHovered(true);
        setTooltip({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY });
      }}
      onMouseMove={e => setTooltip({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY })}
      onMouseLeave={() => { setHovered(false); setTooltip(null); }}
      style={{
        ...style,
        background: node.color,
        border: '2px solid rgba(15,27,38,0.8)',
        borderRadius: 6,
        overflow: 'hidden',
        cursor: 'pointer',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: '6px 8px',
        boxSizing: 'border-box',
        opacity: hovered ? 0.85 : 0.75,
        transition: 'opacity 0.1s',
      }}
    >
      <div style={{ color: 'rgba(255,255,255,0.9)', fontSize: 11, fontWeight: 600, textShadow: '0 1px 3px rgba(0,0,0,0.5)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {node.name}
      </div>
      <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: 10, textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
        {node.size >= 1024 ? `${(node.size / 1024).toFixed(1)} GB` : `${node.size} MB`}
      </div>
      {hovered && tooltip && (
        <div
          style={{
            position: 'absolute',
            left: Math.min(tooltip.x + 12, 200),
            top: Math.max(tooltip.y - 60, 4),
            background: 'rgba(12,22,34,0.95)',
            border: '1px solid rgba(77,166,216,0.3)',
            borderRadius: 8,
            padding: '8px 12px',
            pointerEvents: 'none',
            zIndex: 100,
            minWidth: 160,
            boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
            fontFamily: 'var(--font-text)',
          }}
        >
          <div style={{ color: '#FFFFFF', fontSize: 12, fontWeight: 600 }}>{node.name}</div>
          <div style={{ color: '#8BA8BE', fontSize: 11, marginTop: 2 }}>{node.path}</div>
          <div style={{ color: '#4DA6D8', fontSize: 11, marginTop: 3, fontWeight: 500 }}>
            {node.size >= 1024 ? `${(node.size / 1024).toFixed(1)} GB` : `${node.size} MB`}
          </div>
        </div>
      )}
    </div>
  );
}

function TreemapLayout({ nodes, onClick }: { nodes: TreeNode[]; onClick: (n: TreeNode) => void }) {
  const total = nodes.reduce((a, n) => a + n.size, 0);

  // Simple squarified treemap - rows
  const rows: TreeNode[][] = [];
  let remaining = [...nodes].sort((a, b) => b.size - a.size);
  while (remaining.length > 0) {
    const row: TreeNode[] = [];
    let rowSize = 0;
    while (remaining.length > 0) {
      row.push(remaining[0]);
      rowSize += remaining[0].size;
      remaining = remaining.slice(1);
      if (rowSize / total > 0.25 && row.length >= 2) break;
      if (row.length >= 4) break;
    }
    rows.push(row);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 3, height: '100%', width: '100%' }}>
      {rows.map((row, ri) => {
        const rowTotal = row.reduce((a, n) => a + n.size, 0);
        const rowFraction = rowTotal / total;
        return (
          <div key={ri} style={{ display: 'flex', gap: 3, flex: `${rowFraction * 100}` }}>
            {row.map(node => {
              const frac = node.size / rowTotal;
              return (
                <TreemapCell
                  key={node.id}
                  node={node}
                  onClick={onClick}
                  style={{ flex: `${frac * 100}` }}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

export function SpaceLens() {
  const [breadcrumb, setBreadcrumb] = useState<string[]>(['Macintosh HD']);
  const [currentNodes, setCurrentNodes] = useState<TreeNode[]>(rootData);
  const [viewMode, setViewMode] = useState<ViewMode>('squares');
  const [selectedNode, setSelectedNode] = useState<TreeNode | null>(null);
  const [sortBy, setSortBy] = useState<'size' | 'name' | 'date'>('size');

  const totalUsed = 256000;
  const diskTotal = 512000;
  const usedGB = (totalUsed / 1024).toFixed(0);
  const totalGB = (diskTotal / 1024).toFixed(0);
  const usedPct = (totalUsed / diskTotal) * 100;

  const drillDown = (node: TreeNode) => {
    setSelectedNode(node);
    if (node.children && node.children.length > 0) {
      setBreadcrumb(prev => [...prev, node.name]);
      setCurrentNodes(node.children);
    }
  };

  const goUp = () => {
    if (breadcrumb.length <= 1) return;
    setBreadcrumb(prev => prev.slice(0, -1));
    setCurrentNodes(rootData);
    setSelectedNode(null);
  };

  const sortedNodes = [...currentNodes].sort((a, b) => {
    if (sortBy === 'size') return b.size - a.size;
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    return 0;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', fontFamily: 'var(--font-text)' }}>
      <ModuleHeader
        icon={ScanLine}
        iconColor="#7B52C8"
        title="Space Lens"
        subtitle="Visualize your disk usage — drill down into any folder"
        secondaryLabel="Settings"
      />

      {/* Toolbar */}
      <div
        style={{
          padding: '10px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          flexShrink: 0,
        }}
      >
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, flex: 1, flexWrap: 'wrap' }}>
          {breadcrumb.map((crumb, i) => (
            <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span
                style={{
                  color: i === breadcrumb.length - 1 ? '#FFFFFF' : '#4DA6D8',
                  fontSize: 12,
                  fontWeight: i === breadcrumb.length - 1 ? 600 : 400,
                  cursor: i < breadcrumb.length - 1 ? 'pointer' : 'default',
                }}
                onClick={() => {
                  if (i < breadcrumb.length - 1) {
                    setBreadcrumb(breadcrumb.slice(0, i + 1));
                    setCurrentNodes(rootData);
                    setSelectedNode(null);
                  }
                }}
              >
                {crumb}
              </span>
              {i < breadcrumb.length - 1 && (
                <ChevronRight size={12} style={{ color: '#4A6070' }} />
              )}
            </span>
          ))}
        </div>

        {/* Sort */}
        <div style={{ display: 'flex', gap: 4 }}>
          {(['size', 'name', 'date'] as const).map(s => (
            <button
              key={s}
              onClick={() => setSortBy(s)}
              style={{
                height: 28,
                padding: '0 10px',
                borderRadius: 6,
                background: sortBy === s ? 'rgba(123,82,200,0.15)' : 'transparent',
                border: `1px solid ${sortBy === s ? 'rgba(123,82,200,0.3)' : 'rgba(255,255,255,0.08)'}`,
                color: sortBy === s ? '#7B52C8' : '#8BA8BE',
                fontSize: 11,
                cursor: 'pointer',
                fontFamily: 'var(--font-text)',
                textTransform: 'capitalize',
              }}
            >
              {s}
            </button>
          ))}
        </div>

        {/* View Toggle */}
        <div style={{ display: 'flex', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, overflow: 'hidden' }}>
          {([
            { mode: 'squares', icon: Grid },
            { mode: 'bubbles', icon: Circle },
          ] as { mode: ViewMode; icon: any }[]).map(({ mode, icon: Icon }) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              style={{
                width: 32,
                height: 28,
                background: viewMode === mode ? 'rgba(123,82,200,0.2)' : 'transparent',
                border: 'none',
                color: viewMode === mode ? '#7B52C8' : '#4A6070',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icon size={14} />
            </button>
          ))}
        </div>

        {breadcrumb.length > 1 && (
          <button
            onClick={goUp}
            style={{
              height: 28,
              padding: '0 12px',
              borderRadius: 6,
              background: 'rgba(77,166,216,0.1)',
              border: '1px solid rgba(77,166,216,0.2)',
              color: '#4DA6D8',
              fontSize: 12,
              cursor: 'pointer',
              fontFamily: 'var(--font-text)',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <ArrowUp size={12} />
            Go Up
          </button>
        )}
      </div>

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Treemap */}
        <div style={{ flex: 1, padding: 16, overflow: 'hidden', position: 'relative' }}>
          <TreemapLayout nodes={sortedNodes} onClick={drillDown} />
        </div>

        {/* Legend + Detail Panel */}
        <div style={{ width: selectedNode ? 280 : 140, display: 'flex', flexDirection: 'column', borderLeft: '1px solid rgba(255,255,255,0.06)', transition: 'width 0.28s ease', overflow: 'hidden' }}>
          {selectedNode ? (
            // Detail Panel
            <div
              className="animate-slide-in-right"
              style={{ padding: '16px', overflowY: 'auto' }}
            >
              <div style={{ color: '#4A6070', fontSize: 11, marginBottom: 12 }}>
                <button
                  onClick={() => setSelectedNode(null)}
                  style={{ background: 'none', border: 'none', color: '#4DA6D8', cursor: 'pointer', fontSize: 11, padding: 0 }}
                >
                  ← Back
                </button>
              </div>
              <div style={{ color: '#FFFFFF', fontSize: 16, fontWeight: 600, marginBottom: 4 }}>{selectedNode.name}</div>
              <div style={{ color: '#4A6070', fontSize: 10, fontFamily: 'var(--font-mono)', marginBottom: 16, wordBreak: 'break-all' }}>
                {selectedNode.path}
              </div>

              {[
                { label: 'Size', value: selectedNode.size >= 1024 ? `${(selectedNode.size / 1024).toFixed(2)} GB` : `${selectedNode.size} MB` },
                { label: 'Items', value: selectedNode.children ? `${selectedNode.children.length} folders` : '1 file' },
                { label: 'Type', value: selectedNode.type },
                { label: 'Modified', value: 'Mar 2, 2026' },
              ].map(row => (
                <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ color: '#8BA8BE', fontSize: 12 }}>{row.label}</span>
                  <span style={{ color: '#FFFFFF', fontSize: 12, fontWeight: 500 }}>{row.value}</span>
                </div>
              ))}

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 20 }}>
                <button
                  style={{
                    height: 36,
                    borderRadius: 8,
                    background: 'rgba(77,166,216,0.1)',
                    border: '1px solid rgba(77,166,216,0.25)',
                    color: '#4DA6D8',
                    fontSize: 12,
                    cursor: 'pointer',
                    fontFamily: 'var(--font-text)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                  }}
                >
                  <FolderOpen size={14} />
                  Open in Finder
                </button>
                <button
                  style={{
                    height: 36,
                    borderRadius: 8,
                    background: 'rgba(224,82,82,0.1)',
                    border: '1px solid rgba(224,82,82,0.25)',
                    color: '#E05252',
                    fontSize: 12,
                    cursor: 'pointer',
                    fontFamily: 'var(--font-text)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                  }}
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              </div>
            </div>
          ) : (
            // Legend
            <div style={{ padding: '16px 12px', overflowY: 'auto' }}>
              <div style={{ color: '#8BA8BE', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
                File Types
              </div>
              {colorLegend.map(([type, color]) => (
                <div key={type} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 3, background: color, flexShrink: 0 }} />
                  <span style={{ color: '#8BA8BE', fontSize: 11 }}>{type}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Status Bar */}
      <div
        style={{
          padding: '10px 24px',
          background: '#0D1922',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          flexShrink: 0,
        }}
      >
        <span style={{ color: '#8BA8BE', fontSize: 12 }}>
          Macintosh HD ·{' '}
          <span style={{ color: '#FFFFFF', fontWeight: 500 }}>{usedGB} GB used</span>
          {' of '}
          <span style={{ color: '#8BA8BE' }}>{totalGB} GB</span>
        </span>
        <div style={{ flex: 1, height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
          <div
            style={{
              height: '100%',
              width: `${usedPct}%`,
              background: usedPct > 85 ? '#E05252' : usedPct > 70 ? '#E07A30' : 'linear-gradient(90deg, #1A6B9A, #2E9C6A)',
              borderRadius: 3,
              transition: 'width 0.5s ease',
            }}
          />
        </div>
        <span style={{ color: '#3CB875', fontSize: 12 }}>{(diskTotal / 1024 - totalUsed / 1024).toFixed(0)} GB free</span>
      </div>
    </div>
  );
}
