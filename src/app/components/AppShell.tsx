import { useRef, useState } from 'react';
import { Outlet } from 'react-router';
import { Sidebar } from './Sidebar';
import { MenuBarPopover } from './MenuBarPopover';
import { HardDrive, Shield, ChevronDown } from 'lucide-react';

export function AppShell() {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const trayBtnRef = useRef<HTMLButtonElement>(null);

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        background: '#0F1B26',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'var(--font-text)',
        overflow: 'hidden',
      }}
    >
      {/* macOS Window Chrome */}
      <div
        style={{
          height: 28,
          background: '#0D1922',
          display: 'flex',
          alignItems: 'center',
          padding: '0 14px',
          gap: 8,
          flexShrink: 0,
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          WebkitAppRegion: 'drag' as any,
          position: 'relative',
          zIndex: 100,
        }}
      >
        {/* Traffic Light Buttons */}
        <div style={{ display: 'flex', gap: 6, WebkitAppRegion: 'no-drag' as any }}>
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              background: '#FF5F57',
              border: '1px solid rgba(0,0,0,0.2)',
              cursor: 'pointer',
            }}
          />
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              background: '#FFBD2E',
              border: '1px solid rgba(0,0,0,0.2)',
              cursor: 'pointer',
            }}
          />
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              background: '#28CA42',
              border: '1px solid rgba(0,0,0,0.2)',
              cursor: 'pointer',
            }}
          />
        </div>

        {/* Window Title */}
        <div
          style={{
            flex: 1,
            textAlign: 'center',
            color: '#4A6070',
            fontSize: 12,
            fontWeight: 500,
            letterSpacing: '0.01em',
            pointerEvents: 'none',
          }}
        >
          CCMac
        </div>

        {/* ── Menu Bar Tray Items ── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            WebkitAppRegion: 'no-drag' as any,
          }}
        >
          {/* Protection status pill */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              padding: '2px 7px',
              borderRadius: 5,
              background: 'rgba(46,156,106,0.08)',
              border: '1px solid rgba(46,156,106,0.2)',
            }}
          >
            <Shield size={9} style={{ color: '#2E9C6A' }} />
            <span style={{ color: '#2E9C6A', fontSize: 9, fontWeight: 600, letterSpacing: '0.03em' }}>
              Protected
            </span>
          </div>

          {/* Disk usage micro-pill */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              padding: '2px 7px',
              borderRadius: 5,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.07)',
            }}
          >
            <HardDrive size={9} style={{ color: '#8BA8BE' }} />
            <span style={{ color: '#8BA8BE', fontSize: 9 }}>347 / 512 GB</span>
          </div>

          {/* Tray icon button (main trigger) */}
          <button
            ref={trayBtnRef}
            onClick={() => setPopoverOpen(o => !o)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 3,
              padding: '3px 7px',
              borderRadius: 6,
              background: popoverOpen
                ? 'rgba(46,156,106,0.18)'
                : 'rgba(255,255,255,0.05)',
              border: popoverOpen
                ? '1px solid rgba(46,156,106,0.4)'
                : '1px solid rgba(255,255,255,0.08)',
              cursor: 'pointer',
              fontFamily: 'var(--font-text)',
              transition: 'all 0.15s',
              outline: 'none',
            }}
            onMouseEnter={e => {
              if (!popoverOpen) {
                e.currentTarget.style.background = 'rgba(255,255,255,0.09)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
              }
            }}
            onMouseLeave={e => {
              if (!popoverOpen) {
                e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
              }
            }}
            title="CCMac Menu Bar"
          >
            {/* App icon */}
            <div
              style={{
                width: 14,
                height: 14,
                borderRadius: 3,
                background: 'linear-gradient(135deg, #1A6B9A, #2E9C6A)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(255,255,255,0.9)' }} />
            </div>
            <span style={{ color: popoverOpen ? '#2E9C6A' : '#8BA8BE', fontSize: 10, fontWeight: 500 }}>
              CMM
            </span>
            <ChevronDown
              size={9}
              style={{
                color: popoverOpen ? '#2E9C6A' : '#4A6070',
                transform: popoverOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s',
              }}
            />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <Sidebar />
        <main
          style={{
            flex: 1,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            background: '#0F1B26',
          }}
        >
          <Outlet />
        </main>
      </div>

      {/* Menu Bar Popover — rendered via portal-style fixed positioning */}
      <MenuBarPopover
        isOpen={popoverOpen}
        onClose={() => setPopoverOpen(false)}
        anchorRef={trayBtnRef}
      />
    </div>
  );
}