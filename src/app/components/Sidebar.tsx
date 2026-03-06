import { NavLink, useNavigate } from 'react-router';
import {
  Sparkles, Trash2, Shield, Zap, LayoutGrid,
  Layers, ScanLine, Cloud, Bot, Settings, User, ChevronRight
} from 'lucide-react';

const navItems = [
  { path: '/app', label: 'Smart Care', icon: Sparkles, color: '#2E9C6A', exact: true },
  { path: '/app/cleanup', label: 'Cleanup', icon: Trash2, color: '#4DA6D8' },
  { path: '/app/protection', label: 'Protection', icon: Shield, color: '#E05252' },
  { path: '/app/performance', label: 'Performance', icon: Zap, color: '#E07A30' },
  { path: '/app/applications', label: 'Applications', icon: LayoutGrid, color: '#4DA6D8' },
  { path: '/app/clutter', label: 'My Clutter', icon: Layers, color: '#E07A30' },
  { path: '/app/space-lens', label: 'Space Lens', icon: ScanLine, color: '#7B52C8' },
  { path: '/app/cloud', label: 'Cloud Cleanup', icon: Cloud, color: '#4DA6D8' },
  { path: '/app/assistant', label: 'Assistant', icon: Bot, color: '#7B52C8' },
];

export function Sidebar() {
  const navigate = useNavigate();

  return (
    <aside
      style={{
        width: 220,
        minWidth: 220,
        background: '#152230',
        borderRight: '1px solid #1A6B9A40',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        boxShadow: '4px 0 20px rgba(0,0,0,0.23)',
        fontFamily: 'var(--font-text)',
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: '20px 20px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: 'linear-gradient(135deg, #1A6B9A, #2E9C6A)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 16px 2px rgba(46,156,106,0.3)',
            flexShrink: 0,
          }}
        >
          <Sparkles size={18} color="#fff" />
        </div>
        <div>
          <div style={{ color: '#FFFFFF', fontSize: 14, fontWeight: 600, lineHeight: 1.2 }}>
            CCMac
          </div>
          <div style={{ color: '#8BA8BE', fontSize: 10, lineHeight: 1.3 }}>v4.0 · Business</div>
        </div>
      </div>

      {/* Nav Items */}
      <nav style={{ flex: 1, padding: '8px 0', overflowY: 'auto' }}>
        {navItems.map(({ path, label, icon: Icon, color, exact }) => (
          <NavLink
            key={path}
            to={path}
            end={exact}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '9px 20px',
              textDecoration: 'none',
              color: isActive ? '#FFFFFF' : '#8BA8BE',
              background: isActive ? '#1A6B9A20' : 'transparent',
              borderLeft: isActive ? `3px solid ${color}` : '3px solid transparent',
              transition: 'background 0.15s, color 0.15s',
              cursor: 'pointer',
              position: 'relative',
            })}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement;
              if (!el.classList.contains('active')) {
                el.style.background = 'rgba(255,255,255,0.05)';
              }
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement;
              if (!el.dataset.active) {
                el.style.background = el.dataset.active ? '#1A6B9A20' : 'transparent';
              }
            }}
          >
            {({ isActive }) => (
              <>
                <Icon
                  size={18}
                  style={{ color: isActive ? color : '#8BA8BE', flexShrink: 0 }}
                />
                <span style={{ fontSize: 13, fontWeight: isActive ? 500 : 400, flex: 1 }}>
                  {label}
                </span>
                {isActive && (
                  <ChevronRight size={13} style={{ color: '#4A6070', marginLeft: 'auto' }} />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom — User Section */}
      <div
        style={{
          padding: '12px 16px',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #1A6B9A, #4DA6D8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <User size={16} color="#fff" />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ color: '#FFFFFF', fontSize: 12, fontWeight: 500, lineHeight: 1.2 }}>
            Alex Johnson
          </div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              background: 'rgba(46,156,106,0.15)',
              border: '1px solid rgba(46,156,106,0.3)',
              borderRadius: 4,
              padding: '1px 6px',
              marginTop: 2,
            }}
          >
            <span style={{ color: '#2E9C6A', fontSize: 9, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Premium
            </span>
          </div>
        </div>
        <button
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 4,
            borderRadius: 6,
            color: '#4A6070',
            display: 'flex',
            alignItems: 'center',
            transition: 'color 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = '#8BA8BE')}
          onMouseLeave={e => (e.currentTarget.style.color = '#4A6070')}
          onClick={() => navigate('/app/settings')}
        >
          <Settings size={16} />
        </button>
      </div>
    </aside>
  );
}