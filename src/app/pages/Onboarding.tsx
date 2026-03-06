import { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Sparkles, Shield, Zap, CheckCircle2, Circle, ArrowLeft,
  HardDrive, Bell, Lock, LogIn, ChevronRight, Star,
} from 'lucide-react';

type Screen = 'welcome' | 'permissions' | 'first-scan';

const permissions = [
  {
    icon: HardDrive,
    name: 'Full Disk Access',
    desc: 'Required to scan and clean system files, caches, and application data.',
    key: 'disk',
    required: true,
  },
  {
    icon: Lock,
    name: 'Accessibility',
    desc: 'Allows CCMac to perform certain optimization tasks.',
    key: 'accessibility',
    required: false,
  },
  {
    icon: Bell,
    name: 'Notifications',
    desc: 'Get alerts when threats are found or your Mac needs attention.',
    key: 'notifications',
    required: false,
  },
  {
    icon: LogIn,
    name: 'Login Item',
    desc: 'Start CCMac automatically when you log in to your Mac.',
    key: 'login',
    required: false,
  },
];

const features = [
  { icon: '🧹', label: 'Smart Cleanup' },
  { icon: '🛡️', label: 'Malware Shield' },
  { icon: '⚡', label: 'Speed Boost' },
];

// Particle component
function Particle({ x, y, size, delay, color }: { x: number; y: number; size: number; delay: number; color: string }) {
  return (
    <div
      className="animate-particle-float"
      style={{
        position: 'absolute',
        left: `${x}%`,
        top: `${y}%`,
        width: size,
        height: size,
        borderRadius: '50%',
        background: color,
        opacity: 0.3,
        animationDelay: `${delay}s`,
        animation: `particle-float ${3 + delay}s ease-in-out infinite`,
      }}
    />
  );
}

const particles = [
  { x: 10, y: 20, size: 4, delay: 0, color: '#2E9C6A' },
  { x: 85, y: 15, size: 6, delay: 0.5, color: '#1A6B9A' },
  { x: 20, y: 75, size: 3, delay: 1, color: '#4DA6D8' },
  { x: 75, y: 80, size: 5, delay: 1.5, color: '#7B52C8' },
  { x: 50, y: 10, size: 3, delay: 0.8, color: '#2E9C6A' },
  { x: 92, y: 50, size: 4, delay: 0.3, color: '#4DA6D8' },
  { x: 5, y: 50, size: 5, delay: 1.2, color: '#1A6B9A' },
  { x: 60, y: 90, size: 3, delay: 0.6, color: '#7B52C8' },
];

export function Onboarding() {
  const navigate = useNavigate();
  const [screen, setScreen] = useState<Screen>('welcome');
  const [granted, setGranted] = useState<Set<string>>(new Set());

  const togglePermission = (key: string) => {
    setGranted(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const canContinue = granted.has('disk');

  // ─── Welcome Screen ──────────────────────────────────────
  if (screen === 'welcome') {
    return (
      <div
        className="animate-scale-in"
        style={{
          width: '100vw',
          height: '100vh',
          background: 'linear-gradient(160deg, #0F1B26 0%, #0A1E30 50%, #08192A 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          fontFamily: 'var(--font-text)',
        }}
      >
        {/* Background particles */}
        {particles.map((p, i) => (
          <Particle key={i} {...p} />
        ))}

        {/* Radial glow */}
        <div
          style={{
            position: 'absolute',
            width: 600,
            height: 600,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(46,156,106,0.08) 0%, transparent 70%)',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
          }}
        />

        {/* App Icon */}
        <div
          className="animate-orb-float animate-glow-pulse"
          style={{
            width: 120,
            height: 120,
            borderRadius: 28,
            background: 'linear-gradient(135deg, #1A6B9A 0%, #2E9C6A 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 32,
            position: 'relative',
          }}
        >
          {/* Inner ring */}
          <div
            style={{
              position: 'absolute',
              inset: -8,
              borderRadius: 36,
              border: '1px solid rgba(46,156,106,0.2)',
            }}
          />
          <Sparkles size={56} color="#fff" strokeWidth={1.5} />
        </div>

        {/* Title */}
        <h1
          style={{
            margin: 0,
            color: '#FFFFFF',
            fontSize: 42,
            fontWeight: 700,
            textAlign: 'center',
            fontFamily: 'var(--font-display)',
            letterSpacing: '-0.02em',
          }}
        >
          CCMac
        </h1>
        <p
          style={{
            margin: '10px 0 40px',
            color: '#8BA8BE',
            fontSize: 18,
            textAlign: 'center',
            fontWeight: 400,
          }}
        >
          Your Mac, at its best.
        </p>

        {/* Feature Chips */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 48 }}>
          {features.map(f => (
            <div
              key={f.label}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '9px 18px',
                borderRadius: 40,
                background: 'rgba(255,255,255,0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#FFFFFF',
                fontSize: 13,
                fontWeight: 500,
              }}
            >
              <span>{f.icon}</span>
              {f.label}
            </div>
          ))}
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 32, marginBottom: 48, textAlign: 'center' }}>
          {[
            { value: '29M+', label: 'Downloads' },
            { value: '5.5 GB', label: 'Avg First Clean' },
            { value: '4.9 ★', label: 'Rating' },
          ].map(s => (
            <div key={s.label}>
              <div style={{ color: '#2E9C6A', fontSize: 22, fontWeight: 700, fontFamily: 'var(--font-display)' }}>
                {s.value}
              </div>
              <div style={{ color: '#8BA8BE', fontSize: 12, marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={() => setScreen('permissions')}
          style={{
            width: 240,
            height: 50,
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
            boxShadow: '0 0 30px rgba(46,156,106,0.4)',
            fontFamily: 'var(--font-text)',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 4px 40px rgba(46,156,106,0.6)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 0 30px rgba(46,156,106,0.4)';
          }}
        >
          Get Started
          <ChevronRight size={18} />
        </button>

        <p style={{ marginTop: 16, color: '#4A6070', fontSize: 12 }}>
          Free trial · No credit card required
        </p>
      </div>
    );
  }

  // ─── Permissions Screen ────────────────────────────────────
  if (screen === 'permissions') {
    return (
      <div
        className="animate-scale-in"
        style={{
          width: '100vw',
          height: '100vh',
          background: '#0F1B26',
          display: 'flex',
          flexDirection: 'column',
          padding: 40,
          fontFamily: 'var(--font-text)',
          overflow: 'hidden',
        }}
      >
        {/* Step Indicator */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 32 }}>
          {[1, 2, 3].map(step => (
            <div
              key={step}
              style={{
                width: step === 2 ? 24 : 8,
                height: 8,
                borderRadius: 4,
                background: step === 2 ? '#2E9C6A' : step < 2 ? '#1A6B9A' : 'rgba(255,255,255,0.1)',
                transition: 'all 0.3s',
              }}
            />
          ))}
        </div>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <button
            onClick={() => setScreen('welcome')}
            style={{
              background: 'none',
              border: 'none',
              color: '#8BA8BE',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              fontSize: 13,
              padding: '4px 0',
            }}
          >
            <ArrowLeft size={16} />
            Back
          </button>
        </div>

        <h1
          style={{
            margin: '0 0 6px',
            color: '#FFFFFF',
            fontSize: 28,
            fontWeight: 600,
            fontFamily: 'var(--font-display)',
          }}
        >
          Set Up CCMac
        </h1>
        <p style={{ margin: '0 0 32px', color: '#8BA8BE', fontSize: 14 }}>
          Grant the following permissions to unlock full functionality.
        </p>

        {/* Permissions List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 560 }}>
          {permissions.map(perm => {
            const isGranted = granted.has(perm.key);
            const Icon = perm.icon;
            return (
              <div
                key={perm.key}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  padding: '16px 20px',
                  borderRadius: 12,
                  background: isGranted ? 'rgba(46,156,106,0.06)' : '#1C2E3E',
                  border: `1px solid ${isGranted ? 'rgba(46,156,106,0.25)' : 'rgba(255,255,255,0.06)'}`,
                  transition: 'all 0.2s',
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: isGranted ? 'rgba(46,156,106,0.15)' : 'rgba(26,107,154,0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Icon size={22} style={{ color: isGranted ? '#2E9C6A' : '#4DA6D8' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ color: '#FFFFFF', fontSize: 14, fontWeight: 500 }}>
                      {perm.name}
                    </span>
                    {perm.required && (
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          color: '#E07A30',
                          background: 'rgba(224,122,48,0.12)',
                          border: '1px solid rgba(224,122,48,0.25)',
                          borderRadius: 4,
                          padding: '1px 5px',
                        }}
                      >
                        Required
                      </span>
                    )}
                  </div>
                  <p style={{ margin: '3px 0 0', color: '#8BA8BE', fontSize: 12 }}>{perm.desc}</p>
                </div>
                <button
                  onClick={() => togglePermission(perm.key)}
                  style={{
                    height: 32,
                    padding: '0 14px',
                    borderRadius: 8,
                    background: isGranted ? 'rgba(46,156,106,0.15)' : '#2E9C6A',
                    border: isGranted ? '1px solid rgba(46,156,106,0.3)' : 'none',
                    color: isGranted ? '#2E9C6A' : '#FFFFFF',
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    flexShrink: 0,
                    transition: 'all 0.15s',
                    fontFamily: 'var(--font-text)',
                  }}
                >
                  {isGranted ? (
                    <>
                      <CheckCircle2 size={14} />
                      Granted
                    </>
                  ) : (
                    'Allow'
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Continue */}
        <div style={{ marginTop: 'auto', paddingTop: 32 }}>
          <button
            onClick={() => canContinue && setScreen('first-scan')}
            style={{
              width: 200,
              height: 44,
              borderRadius: 12,
              background: canContinue ? '#2E9C6A' : 'rgba(255,255,255,0.08)',
              border: 'none',
              color: canContinue ? '#FFFFFF' : 'rgba(255,255,255,0.25)',
              fontSize: 14,
              fontWeight: 600,
              cursor: canContinue ? 'pointer' : 'not-allowed',
              fontFamily: 'var(--font-text)',
              boxShadow: canContinue ? '0 0 16px rgba(46,156,106,0.3)' : 'none',
              transition: 'all 0.2s',
            }}
          >
            Continue
          </button>
          {!canContinue && (
            <p style={{ color: '#8BA8BE', fontSize: 12, marginTop: 8 }}>
              Full Disk Access is required to continue.
            </p>
          )}
        </div>
      </div>
    );
  }

  // ─── First Scan Screen ─────────────────────────────────────
  return (
    <div
      className="animate-scale-in"
      style={{
        width: '100vw',
        height: '100vh',
        background: '#0F1B26',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-text)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Step Indicator */}
      <div style={{ display: 'flex', gap: 8, position: 'absolute', top: 40 }}>
        {[1, 2, 3].map(step => (
          <div
            key={step}
            style={{
              width: step === 3 ? 24 : 8,
              height: 8,
              borderRadius: 4,
              background: step === 3 ? '#2E9C6A' : '#1A6B9A',
              transition: 'all 0.3s',
            }}
          />
        ))}
      </div>

      {/* Orb Illustration */}
      <div
        className="animate-orb-float"
        style={{
          width: 280,
          height: 280,
          borderRadius: '50%',
          background: 'radial-gradient(circle at 35% 35%, #1A6B9A, #0F1B26)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 40,
          position: 'relative',
          boxShadow: '0 0 60px rgba(26,107,154,0.3), inset 0 0 60px rgba(46,156,106,0.1)',
        }}
      >
        {/* Rings */}
        {[1, 2, 3].map(i => (
          <div
            key={i}
            style={{
              position: 'absolute',
              inset: -(i * 20),
              borderRadius: '50%',
              border: `1px solid rgba(26,107,154,${0.15 - i * 0.04})`,
            }}
          />
        ))}
        <Sparkles size={80} color="#2E9C6A" strokeWidth={1} />
      </div>

      <h1
        style={{
          margin: 0,
          color: '#FFFFFF',
          fontSize: 28,
          fontWeight: 600,
          textAlign: 'center',
          fontFamily: 'var(--font-display)',
          maxWidth: 500,
        }}
      >
        Let's see what your Mac is hiding
      </h1>
      <p
        style={{
          margin: '12px 0 40px',
          color: '#8BA8BE',
          fontSize: 14,
          textAlign: 'center',
          maxWidth: 380,
        }}
      >
        Smart Care scans your entire system in seconds and finds everything that can be safely removed.
      </p>

      {/* Stats Cards */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 44 }}>
        {[
          { icon: '🧹', value: '5.5 GB', label: 'Avg first scan' },
          { icon: '⭐', value: '29M+', label: 'Downloads' },
          { icon: '🏆', value: '4.9', label: 'Star rating' },
        ].map(s => (
          <div
            key={s.label}
            style={{
              padding: '14px 24px',
              borderRadius: 12,
              background: '#1C2E3E',
              border: '1px solid rgba(255,255,255,0.06)',
              textAlign: 'center',
              minWidth: 110,
            }}
          >
            <div style={{ fontSize: 22, marginBottom: 4 }}>{s.icon}</div>
            <div style={{ color: '#2E9C6A', fontSize: 18, fontWeight: 700, fontFamily: 'var(--font-display)' }}>
              {s.value}
            </div>
            <div style={{ color: '#8BA8BE', fontSize: 11 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Buttons */}
      <button
        onClick={() => navigate('/app')}
        style={{
          width: 260,
          height: 50,
          borderRadius: 14,
          background: 'linear-gradient(135deg, #2E9C6A, #35B57A)',
          border: 'none',
          color: '#FFFFFF',
          fontSize: 15,
          fontWeight: 600,
          cursor: 'pointer',
          boxShadow: '0 0 24px rgba(46,156,106,0.4)',
          fontFamily: 'var(--font-text)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          transition: 'all 0.2s',
        }}
        onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
        onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
      >
        <Sparkles size={18} />
        Run Smart Care
      </button>
      <button
        onClick={() => navigate('/app')}
        style={{
          marginTop: 14,
          background: 'none',
          border: 'none',
          color: '#8BA8BE',
          fontSize: 13,
          cursor: 'pointer',
          textDecoration: 'underline',
          textDecorationColor: 'rgba(139,168,190,0.4)',
        }}
      >
        Skip for now
      </button>
    </div>
  );
}