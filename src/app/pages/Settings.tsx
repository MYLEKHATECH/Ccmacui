import { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Settings as SettingsIcon, Bell, Shield, CreditCard, Info,
  Calendar, Globe, RefreshCw, Moon, Sparkles, ChevronRight,
  Check, Download, LogOut, Trash2, ExternalLink, Lock,
  BarChart2, Eye, EyeOff, Zap, LayoutGrid, Clock,
  AlertTriangle, Star, User,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
type Section = 'general' | 'schedule' | 'notifications' | 'privacy' | 'subscription' | 'about';

interface ToggleProps {
  checked: boolean;
  onChange: (v: boolean) => void;
  color?: string;
}

interface SelectProps {
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function Toggle({ checked, onChange, color = '#2E9C6A' }: ToggleProps) {
  return (
    <button
      onClick={() => onChange(!checked)}
      style={{
        width: 42,
        height: 24,
        borderRadius: 12,
        background: checked ? color : 'rgba(255,255,255,0.12)',
        border: 'none',
        cursor: 'pointer',
        padding: 0,
        position: 'relative',
        transition: 'background 0.2s',
        flexShrink: 0,
      }}
    >
      <div
        style={{
          width: 18,
          height: 18,
          borderRadius: '50%',
          background: '#FFFFFF',
          position: 'absolute',
          top: 3,
          left: checked ? 21 : 3,
          transition: 'left 0.2s cubic-bezier(0.4,0,0.2,1)',
          boxShadow: '0 1px 4px rgba(0,0,0,0.4)',
        }}
      />
    </button>
  );
}

function Select({ value, options, onChange }: SelectProps) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      style={{
        background: '#1C2E3E',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 8,
        color: '#FFFFFF',
        fontSize: 12,
        padding: '6px 28px 6px 10px',
        cursor: 'pointer',
        outline: 'none',
        appearance: 'none',
        fontFamily: 'var(--font-text)',
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%238BA8BE' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 8px center',
      }}
    >
      {options.map(o => (
        <option key={o.value} value={o.value} style={{ background: '#1C2E3E' }}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

function SettingRow({
  label,
  description,
  children,
  danger,
}: {
  label: string;
  description?: string;
  children: React.ReactNode;
  danger?: boolean;
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
        padding: '14px 20px',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ color: danger ? '#E05252' : '#FFFFFF', fontSize: 13, fontWeight: 500 }}>
          {label}
        </div>
        {description && (
          <div style={{ color: '#4A6070', fontSize: 11, marginTop: 2, lineHeight: 1.4 }}>
            {description}
          </div>
        )}
      </div>
      <div style={{ flexShrink: 0 }}>{children}</div>
    </div>
  );
}

function SectionCard({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        background: '#1C2E3E',
        borderRadius: 14,
        border: '1px solid rgba(255,255,255,0.06)',
        overflow: 'hidden',
        marginBottom: 16,
      }}
    >
      {children}
    </div>
  );
}

function CardHeader({ title, icon: Icon, color = '#4DA6D8' }: { title: string; icon: any; color?: string }) {
  return (
    <div
      style={{
        padding: '12px 20px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        background: 'rgba(255,255,255,0.02)',
      }}
    >
      <Icon size={14} style={{ color }} />
      <span style={{ color: '#8BA8BE', fontSize: 11, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
        {title}
      </span>
    </div>
  );
}

// ─── Section: General ─────────────────────────────────────────────────────────
function GeneralSection() {
  const [launchAtStartup, setLaunchAtStartup] = useState(true);
  const [launchMinimized, setLaunchMinimized] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [autoUpdate, setAutoUpdate] = useState(true);
  const [betaChannel, setBetaChannel] = useState(false);
  const [language, setLanguage] = useState('en');
  const [updateChannel, setUpdateChannel] = useState('stable');

  return (
    <>
      <SectionCard>
        <CardHeader title="Startup" icon={Zap} color="#E07A30" />
        <SettingRow label="Launch at startup" description="Start CCMac when your Mac boots">
          <Toggle checked={launchAtStartup} onChange={setLaunchAtStartup} />
        </SettingRow>
        <SettingRow label="Start minimized" description="Open directly to the menu bar tray">
          <Toggle checked={launchMinimized} onChange={setLaunchMinimized} color="#4DA6D8" />
        </SettingRow>
      </SectionCard>

      <SectionCard>
        <CardHeader title="Appearance" icon={Moon} color="#7B52C8" />
        <SettingRow label="Dark mode" description="Use the dark macOS aesthetic">
          <Toggle checked={darkMode} onChange={setDarkMode} color="#7B52C8" />
        </SettingRow>
        <SettingRow label="Language">
          <Select
            value={language}
            onChange={setLanguage}
            options={[
              { value: 'en', label: 'English' },
              { value: 'es', label: 'Español' },
              { value: 'fr', label: 'Français' },
              { value: 'de', label: 'Deutsch' },
              { value: 'ja', label: '日本語' },
              { value: 'zh', label: '中文' },
            ]}
          />
        </SettingRow>
      </SectionCard>

      <SectionCard>
        <CardHeader title="Updates" icon={RefreshCw} color="#2E9C6A" />
        <SettingRow label="Automatic updates" description="Download and install updates automatically">
          <Toggle checked={autoUpdate} onChange={setAutoUpdate} />
        </SettingRow>
        <SettingRow label="Beta channel" description="Receive pre-release builds with new features">
          <Toggle checked={betaChannel} onChange={setBetaChannel} color="#E07A30" />
        </SettingRow>
        <SettingRow label="Update channel">
          <Select
            value={updateChannel}
            onChange={setUpdateChannel}
            options={[
              { value: 'stable', label: 'Stable' },
              { value: 'beta', label: 'Beta' },
              { value: 'nightly', label: 'Nightly' },
            ]}
          />
        </SettingRow>
        <div style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ color: '#4A6070', fontSize: 11 }}>Current version: <span style={{ color: '#8BA8BE' }}>4.0.2 (build 1024)</span></span>
          <button
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '6px 14px', borderRadius: 8,
              background: 'rgba(46,156,106,0.12)', border: '1px solid rgba(46,156,106,0.25)',
              color: '#2E9C6A', fontSize: 12, fontWeight: 500, cursor: 'pointer',
              fontFamily: 'var(--font-text)', transition: 'all 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(46,156,106,0.2)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(46,156,106,0.12)'}
          >
            <Download size={12} /> Check Now
          </button>
        </div>
      </SectionCard>
    </>
  );
}

// ─── Section: Scan Schedule ───────────────────────────────────────────────────
function ScheduleSection() {
  const [scheduledScans, setScheduledScans] = useState(true);
  const [frequency, setFrequency] = useState('weekly');
  const [scanTime, setScanTime] = useState('02:00');
  const [scanDay, setScanDay] = useState('sunday');
  const [includeCleanup, setIncludeCleanup] = useState(true);
  const [includeProtection, setIncludeProtection] = useState(true);
  const [includePerformance, setIncludePerformance] = useState(true);
  const [includeApps, setIncludeApps] = useState(false);

  return (
    <>
      <SectionCard>
        <CardHeader title="Automatic Scans" icon={Calendar} color="#4DA6D8" />
        <SettingRow label="Enable scheduled scans" description="Run Smart Care automatically on a set schedule">
          <Toggle checked={scheduledScans} onChange={setScheduledScans} />
        </SettingRow>
        <SettingRow label="Frequency">
          <Select
            value={frequency}
            onChange={setFrequency}
            options={[
              { value: 'daily', label: 'Daily' },
              { value: 'weekly', label: 'Weekly' },
              { value: 'biweekly', label: 'Every 2 weeks' },
              { value: 'monthly', label: 'Monthly' },
            ]}
          />
        </SettingRow>
        {frequency === 'weekly' && (
          <SettingRow label="Day of week">
            <Select
              value={scanDay}
              onChange={setScanDay}
              options={[
                { value: 'monday', label: 'Monday' },
                { value: 'tuesday', label: 'Tuesday' },
                { value: 'wednesday', label: 'Wednesday' },
                { value: 'thursday', label: 'Thursday' },
                { value: 'friday', label: 'Friday' },
                { value: 'saturday', label: 'Saturday' },
                { value: 'sunday', label: 'Sunday' },
              ]}
            />
          </SettingRow>
        )}
        <SettingRow label="Start time" description="Scans run silently in the background">
          <input
            type="time"
            value={scanTime}
            onChange={e => setScanTime(e.target.value)}
            style={{
              background: '#1C2E3E',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 8,
              color: '#FFFFFF',
              fontSize: 12,
              padding: '6px 10px',
              outline: 'none',
              fontFamily: 'var(--font-text)',
              cursor: 'pointer',
            }}
          />
        </SettingRow>
      </SectionCard>

      <SectionCard>
        <CardHeader title="Include in Scheduled Scans" icon={LayoutGrid} color="#7B52C8" />
        <SettingRow label="System Junk & Cleanup" description="Cache files, logs, and temporary data">
          <Toggle checked={includeCleanup} onChange={setIncludeCleanup} />
        </SettingRow>
        <SettingRow label="Malware Protection" description="Virus, adware, and threat detection">
          <Toggle checked={includeProtection} onChange={setIncludeProtection} color="#E05252" />
        </SettingRow>
        <SettingRow label="Performance Boost" description="RAM, login items, and speed tasks">
          <Toggle checked={includePerformance} onChange={setIncludePerformance} color="#E07A30" />
        </SettingRow>
        <SettingRow label="Applications" description="App leftovers and updater scans">
          <Toggle checked={includeApps} onChange={setIncludeApps} color="#4DA6D8" />
        </SettingRow>
      </SectionCard>

      {scheduledScans && (
        <div
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '12px 16px', borderRadius: 10,
            background: 'rgba(46,156,106,0.08)', border: '1px solid rgba(46,156,106,0.2)',
            marginBottom: 16,
          }}
        >
          <Clock size={14} style={{ color: '#2E9C6A', flexShrink: 0 }} />
          <span style={{ color: '#8BA8BE', fontSize: 12 }}>
            Next scan: <span style={{ color: '#2E9C6A', fontWeight: 500 }}>
              Sunday at {scanTime}
            </span>
          </span>
        </div>
      )}
    </>
  );
}

// ─── Section: Notifications ───────────────────────────────────────────────────
function NotificationsSection() {
  const [scanComplete, setScanComplete] = useState(true);
  const [threatDetected, setThreatDetected] = useState(true);
  const [lowDisk, setLowDisk] = useState(true);
  const [weeklyReport, setWeeklyReport] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(true);
  const [tips, setTips] = useState(false);
  const [sound, setSound] = useState(true);
  const [badgeCount, setBadgeCount] = useState(true);

  return (
    <>
      <SectionCard>
        <CardHeader title="Alert Types" icon={Bell} color="#E07A30" />
        <SettingRow label="Scan complete" description="Notify when a scheduled or manual scan finishes">
          <Toggle checked={scanComplete} onChange={setScanComplete} />
        </SettingRow>
        <SettingRow label="Threat detected" description="Immediate alert for malware or suspicious files">
          <Toggle checked={threatDetected} onChange={setThreatDetected} color="#E05252" />
        </SettingRow>
        <SettingRow label="Low disk space" description="Warn when free space drops below 10 GB">
          <Toggle checked={lowDisk} onChange={setLowDisk} color="#E07A30" />
        </SettingRow>
        <SettingRow label="Weekly health report" description="Summary of your Mac's health every Monday">
          <Toggle checked={weeklyReport} onChange={setWeeklyReport} color="#7B52C8" />
        </SettingRow>
        <SettingRow label="Update available" description="Notify when a new CCMac version is ready">
          <Toggle checked={updateAvailable} onChange={setUpdateAvailable} color="#4DA6D8" />
        </SettingRow>
        <SettingRow label="Tips & tricks" description="Occasional productivity tips from CCMac">
          <Toggle checked={tips} onChange={setTips} color="#4DA6D8" />
        </SettingRow>
      </SectionCard>

      <SectionCard>
        <CardHeader title="Delivery" icon={Bell} color="#4DA6D8" />
        <SettingRow label="Notification sound" description="Play a chime with each alert">
          <Toggle checked={sound} onChange={setSound} />
        </SettingRow>
        <SettingRow label="Badge app icon" description="Show unread count on the dock icon">
          <Toggle checked={badgeCount} onChange={setBadgeCount} color="#7B52C8" />
        </SettingRow>
      </SectionCard>
    </>
  );
}

// ─── Section: Privacy ─────────────────────────────────────────────────────────
function PrivacySection() {
  const [analytics, setAnalytics] = useState(true);
  const [crashReports, setCrashReports] = useState(true);
  const [usageStats, setUsageStats] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <SectionCard>
        <CardHeader title="Data & Analytics" icon={BarChart2} color="#4DA6D8" />
        <SettingRow
          label="Share anonymous analytics"
          description="Help improve CCMac by sending anonymized usage data. No personal files are included."
        >
          <Toggle checked={analytics} onChange={setAnalytics} />
        </SettingRow>
        <SettingRow
          label="Send crash reports"
          description="Automatically share diagnostic crash logs with the team."
        >
          <Toggle checked={crashReports} onChange={setCrashReports} />
        </SettingRow>
        <SettingRow
          label="Feature usage statistics"
          description="Track which modules and features you use most."
        >
          <Toggle checked={usageStats} onChange={setUsageStats} color="#7B52C8" />
        </SettingRow>
      </SectionCard>

      <SectionCard>
        <CardHeader title="Security" icon={Lock} color="#E05252" />
        <SettingRow label="Require password for cleanup" description="Authenticate before permanently deleting files">
          <Toggle checked={true} onChange={() => {}} color="#E05252" />
        </SettingRow>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
          <div style={{ color: '#FFFFFF', fontSize: 13, fontWeight: 500, marginBottom: 8 }}>
            Scan exclusions
          </div>
          <div style={{ color: '#4A6070', fontSize: 11, marginBottom: 10 }}>
            These paths are never scanned or cleaned
          </div>
          {['/Users/alex/Documents/Projects', '/Users/alex/Music/Library'].map((path, i) => (
            <div
              key={i}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '6px 10px', borderRadius: 7,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.06)',
                marginBottom: 6,
              }}
            >
              <span style={{ color: '#8BA8BE', fontSize: 11, fontFamily: 'var(--font-mono)' }}>{path}</span>
              <button
                style={{
                  background: 'none', border: 'none', color: '#4A6070',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 2,
                  transition: 'color 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.color = '#E05252'}
                onMouseLeave={e => e.currentTarget.style.color = '#4A6070'}
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}
          <button
            style={{
              marginTop: 6, background: 'none',
              border: '1px dashed rgba(255,255,255,0.1)', borderRadius: 7,
              color: '#4A6070', fontSize: 11, cursor: 'pointer',
              padding: '6px 12px', width: '100%', fontFamily: 'var(--font-text)',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#1A6B9A'; e.currentTarget.style.color = '#4DA6D8'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#4A6070'; }}
          >
            + Add Exclusion
          </button>
        </div>
      </SectionCard>

      <div
        style={{
          padding: '12px 16px', borderRadius: 10, marginBottom: 16,
          background: 'rgba(26,107,154,0.08)', border: '1px solid rgba(26,107,154,0.2)',
          display: 'flex', alignItems: 'flex-start', gap: 10,
        }}
      >
        <Shield size={14} style={{ color: '#4DA6D8', flexShrink: 0, marginTop: 1 }} />
        <span style={{ color: '#8BA8BE', fontSize: 11, lineHeight: 1.5 }}>
          CCMac does not collect or transmit personal files, documents, photos, or passwords.
          All scan results are processed locally on your device.
        </span>
      </div>
    </>
  );
}

// ─── Section: Subscription ────────────────────────────────────────────────────
function SubscriptionSection() {
  const [showKey, setShowKey] = useState(false);
  const licenseKey = 'CMMX-PRO4-8F2A-K91B-ZXQW';

  return (
    <>
      {/* Plan hero card */}
      <div
        style={{
          padding: '24px',
          borderRadius: 16,
          background: 'linear-gradient(135deg, rgba(46,156,106,0.12), rgba(26,107,154,0.12))',
          border: '1px solid rgba(46,156,106,0.25)',
          marginBottom: 16,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Glow orb */}
        <div
          style={{
            position: 'absolute', right: -30, top: -30,
            width: 120, height: 120, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(46,156,106,0.2), transparent 70%)',
            pointerEvents: 'none',
          }}
        />
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <Star size={16} style={{ color: '#FFBD2E' }} />
              <span style={{ color: '#FFFFFF', fontSize: 18, fontWeight: 700 }}>CCMac Premium</span>
            </div>
            <div style={{ color: '#8BA8BE', fontSize: 12 }}>Business · Annual plan</div>
          </div>
          <div
            style={{
              padding: '4px 12px', borderRadius: 20,
              background: 'rgba(46,156,106,0.15)', border: '1px solid rgba(46,156,106,0.35)',
              color: '#2E9C6A', fontSize: 11, fontWeight: 700, letterSpacing: '0.04em',
            }}
          >
            ACTIVE
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          {[
            { label: 'Renews', value: 'Mar 12, 2027' },
            { label: 'Devices', value: '5 / 5 used' },
            { label: 'Price', value: '$39.95 / yr' },
          ].map(item => (
            <div key={item.label}>
              <div style={{ color: '#4A6070', fontSize: 10, marginBottom: 2 }}>{item.label}</div>
              <div style={{ color: '#FFFFFF', fontSize: 13, fontWeight: 500 }}>{item.value}</div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
          <button
            style={{
              padding: '8px 16px', borderRadius: 9, border: 'none',
              background: '#2E9C6A', color: '#FFFFFF', fontSize: 12, fontWeight: 600,
              cursor: 'pointer', fontFamily: 'var(--font-text)', transition: 'all 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#35B57A'}
            onMouseLeave={e => e.currentTarget.style.background = '#2E9C6A'}
          >
            Manage Subscription
          </button>
          <button
            style={{
              padding: '8px 16px', borderRadius: 9,
              border: '1px solid rgba(255,255,255,0.12)',
              background: 'transparent', color: '#8BA8BE', fontSize: 12,
              cursor: 'pointer', fontFamily: 'var(--font-text)', transition: 'all 0.15s',
              display: 'flex', alignItems: 'center', gap: 5,
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'}
          >
            <ExternalLink size={11} /> View Invoice
          </button>
        </div>
      </div>

      <SectionCard>
        <CardHeader title="License Key" icon={Lock} color="#4DA6D8" />
        <div style={{ padding: '14px 20px' }}>
          <div style={{ color: '#4A6070', fontSize: 11, marginBottom: 8 }}>Registered to Alex Johnson · alex@company.com</div>
          <div
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 9, padding: '10px 14px',
            }}
          >
            <span
              style={{
                flex: 1, color: '#8BA8BE', fontSize: 12,
                fontFamily: 'var(--font-mono)', letterSpacing: '0.08em',
              }}
            >
              {showKey ? licenseKey : '●●●●-●●●●-●●●●-●●●●-●●●●'}
            </span>
            <button
              onClick={() => setShowKey(v => !v)}
              style={{
                background: 'none', border: 'none', color: '#4A6070',
                cursor: 'pointer', display: 'flex', alignItems: 'center',
                padding: 2, transition: 'color 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.color = '#8BA8BE'}
              onMouseLeave={e => e.currentTarget.style.color = '#4A6070'}
            >
              {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
        </div>
      </SectionCard>

      <SectionCard>
        <CardHeader title="Included Features" icon={Check} color="#2E9C6A" />
        {[
          'Smart Care (full scan + clean)',
          'Real-time malware protection',
          'Privacy cleaner & extension manager',
          'Performance optimizer & RAM booster',
          'Space Lens treemap & large file finder',
          'Cloud Cleanup (iCloud, Dropbox, Google Drive)',
          'AI Assistant (unlimited queries)',
          'Up to 5 devices',
          'Priority email support',
        ].map((f, i) => (
          <div
            key={i}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 20px',
              borderBottom: i < 8 ? '1px solid rgba(255,255,255,0.04)' : 'none',
            }}
          >
            <Check size={13} style={{ color: '#2E9C6A', flexShrink: 0 }} />
            <span style={{ color: '#FFFFFF', fontSize: 12 }}>{f}</span>
          </div>
        ))}
      </SectionCard>

      <SectionCard>
        <CardHeader title="Account" icon={User} color="#E05252" />
        <SettingRow label="Sign out" description="Remove this device from your account" danger>
          <button
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '6px 14px', borderRadius: 8,
              background: 'rgba(224,82,82,0.1)', border: '1px solid rgba(224,82,82,0.25)',
              color: '#E05252', fontSize: 12, fontWeight: 500, cursor: 'pointer',
              fontFamily: 'var(--font-text)', transition: 'all 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(224,82,82,0.2)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(224,82,82,0.1)'}
          >
            <LogOut size={12} /> Sign Out
          </button>
        </SettingRow>
      </SectionCard>
    </>
  );
}

// ─── Section: About ───────────────────────────────────────────────────────────
function AboutSection() {
  const changelog = [
    { version: '4.0.2', date: 'Feb 28, 2026', notes: 'Fixed memory leak in Space Lens treemap renderer; improved scan speed by 18%.' },
    { version: '4.0.1', date: 'Feb 10, 2026', notes: 'Cloud Cleanup now supports Google Drive Team folders. AI Assistant response latency reduced.' },
    { version: '4.0.0', date: 'Jan 15, 2026', notes: 'Major redesign with new dark macOS aesthetic. Added AI Assistant module, Space Lens, and Cloud Cleanup.' },
    { version: '3.9.8', date: 'Dec 4, 2025', notes: 'Security update patching CVE-2025-4821. Performance improvements for Apple Silicon.' },
  ];

  return (
    <>
      {/* App Identity */}
      <div
        style={{
          display: 'flex', alignItems: 'center', gap: 20,
          padding: '28px 24px',
          background: '#1C2E3E', borderRadius: 16,
          border: '1px solid rgba(255,255,255,0.06)',
          marginBottom: 16,
        }}
      >
        <div
          style={{
            width: 72, height: 72, borderRadius: 18,
            background: 'linear-gradient(135deg, #1A6B9A, #2E9C6A)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 32px rgba(46,156,106,0.4)',
            flexShrink: 0,
          }}
        >
          <Sparkles size={36} color="#fff" />
        </div>
        <div>
          <div style={{ color: '#FFFFFF', fontSize: 22, fontWeight: 700, fontFamily: 'var(--font-display)' }}>
            CCMac
          </div>
          <div style={{ color: '#8BA8BE', fontSize: 13, marginTop: 2 }}>Version 4.0.2 (build 1024)</div>
          <div style={{ color: '#4A6070', fontSize: 11, marginTop: 4 }}>
            © 2026 MacPaw Inc. · All rights reserved
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 10 }}>
            {[
              { label: 'Privacy Policy', href: '#' },
              { label: 'Terms of Use', href: '#' },
              { label: 'Acknowledgements', href: '#' },
            ].map(link => (
              <a
                key={link.label}
                href={link.href}
                style={{
                  color: '#4DA6D8', fontSize: 11, textDecoration: 'none',
                  display: 'flex', alignItems: 'center', gap: 3,
                }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.textDecoration = 'underline'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.textDecoration = 'none'}
              >
                {link.label} <ExternalLink size={9} />
              </a>
            ))}
          </div>
        </div>
      </div>

      <SectionCard>
        <CardHeader title="Changelog" icon={Info} color="#7B52C8" />
        {changelog.map((entry, i) => (
          <div
            key={entry.version}
            style={{
              padding: '14px 20px',
              borderBottom: i < changelog.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <span
                style={{
                  padding: '2px 8px', borderRadius: 5,
                  background: i === 0 ? 'rgba(46,156,106,0.15)' : 'rgba(255,255,255,0.06)',
                  border: `1px solid ${i === 0 ? 'rgba(46,156,106,0.3)' : 'rgba(255,255,255,0.08)'}`,
                  color: i === 0 ? '#2E9C6A' : '#8BA8BE',
                  fontSize: 11, fontWeight: 600,
                }}
              >
                {entry.version}{i === 0 && ' · Current'}
              </span>
              <span style={{ color: '#4A6070', fontSize: 11 }}>{entry.date}</span>
            </div>
            <div style={{ color: '#8BA8BE', fontSize: 12, lineHeight: 1.5 }}>{entry.notes}</div>
          </div>
        ))}
      </SectionCard>

      <SectionCard>
        <CardHeader title="Support" icon={AlertTriangle} color="#E07A30" />
        {[
          { label: 'Help Center & Documentation', icon: ExternalLink, href: '#' },
          { label: 'Contact Support', icon: ExternalLink, href: '#' },
          { label: 'Community Forum', icon: ExternalLink, href: '#' },
        ].map(item => (
          <div
            key={item.label}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '12px 20px', borderBottom: '1px solid rgba(255,255,255,0.04)',
              cursor: 'pointer', transition: 'background 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
          >
            <span style={{ color: '#FFFFFF', fontSize: 13 }}>{item.label}</span>
            <item.icon size={13} style={{ color: '#4A6070' }} />
          </div>
        ))}
      </SectionCard>
    </>
  );
}

// ─── Nav items ────────────────────────────────────────────────────────────────
const sections: { id: Section; label: string; icon: any; color: string }[] = [
  { id: 'general', label: 'General', icon: SettingsIcon, color: '#8BA8BE' },
  { id: 'schedule', label: 'Scan Schedule', icon: Calendar, color: '#4DA6D8' },
  { id: 'notifications', label: 'Notifications', icon: Bell, color: '#E07A30' },
  { id: 'privacy', label: 'Privacy', icon: Shield, color: '#E05252' },
  { id: 'subscription', label: 'Subscription', icon: CreditCard, color: '#2E9C6A' },
  { id: 'about', label: 'About', icon: Info, color: '#7B52C8' },
];

// ─── Main Component ───────────────────────────────────────────────────────────
export function Settings() {
  const navigate = useNavigate();
  const [active, setActive] = useState<Section>('general');

  const renderSection = () => {
    switch (active) {
      case 'general': return <GeneralSection />;
      case 'schedule': return <ScheduleSection />;
      case 'notifications': return <NotificationsSection />;
      case 'privacy': return <PrivacySection />;
      case 'subscription': return <SubscriptionSection />;
      case 'about': return <AboutSection />;
    }
  };

  const activeSection = sections.find(s => s.id === active)!;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Header */}
      <div
        style={{
          height: 80, borderBottom: '1px solid rgba(26,107,154,0.2)',
          display: 'flex', alignItems: 'center', padding: '0 28px', gap: 16,
          flexShrink: 0, background: 'rgba(15,27,38,0.8)',
        }}
      >
        <div
          style={{
            width: 40, height: 40, borderRadius: 10,
            background: 'rgba(138,168,190,0.12)', border: '1px solid rgba(138,168,190,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}
        >
          <SettingsIcon size={22} style={{ color: '#8BA8BE' }} />
        </div>
        <div style={{ flex: 1 }}>
          <h1 style={{ margin: 0, color: '#FFFFFF', fontSize: 22, fontWeight: 600, lineHeight: 1.2, fontFamily: 'var(--font-display)' }}>
            Settings
          </h1>
          <p style={{ margin: 0, color: '#8BA8BE', fontSize: 12, marginTop: 2 }}>
            Manage your CCMac preferences
          </p>
        </div>
        <button
          onClick={() => navigate('/app')}
          style={{
            height: 36, padding: '0 18px', borderRadius: 10,
            background: 'transparent', border: '1px solid #1A6B9A',
            color: '#4DA6D8', fontSize: 13, cursor: 'pointer',
            fontFamily: 'var(--font-text)', transition: 'background 0.15s',
            display: 'flex', alignItems: 'center', gap: 6,
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(26,107,154,0.12)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          ← Back to App
        </button>
      </div>

      {/* Body */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Left nav */}
        <div
          style={{
            width: 200, flexShrink: 0,
            background: '#0D1922',
            borderRight: '1px solid rgba(255,255,255,0.05)',
            padding: '16px 8px',
            display: 'flex', flexDirection: 'column', gap: 2,
          }}
        >
          {sections.map(s => (
            <button
              key={s.id}
              onClick={() => setActive(s.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '9px 12px', borderRadius: 9, border: 'none',
                background: active === s.id ? 'rgba(255,255,255,0.07)' : 'transparent',
                borderLeft: active === s.id ? `2px solid ${s.color}` : '2px solid transparent',
                color: active === s.id ? '#FFFFFF' : '#8BA8BE',
                fontSize: 13, cursor: 'pointer', textAlign: 'left',
                fontFamily: 'var(--font-text)',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => {
                if (active !== s.id) e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
              }}
              onMouseLeave={e => {
                if (active !== s.id) e.currentTarget.style.background = 'transparent';
              }}
            >
              <s.icon size={15} style={{ color: active === s.id ? s.color : '#4A6070', flexShrink: 0 }} />
              <span style={{ fontWeight: active === s.id ? 500 : 400 }}>{s.label}</span>
              {active === s.id && (
                <ChevronRight size={11} style={{ color: '#4A6070', marginLeft: 'auto' }} />
              )}
            </button>
          ))}
        </div>

        {/* Right content */}
        <div
          className="dark-scroll"
          style={{ flex: 1, overflowY: 'auto', padding: 24 }}
        >
          {/* Section heading */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <activeSection.icon size={16} style={{ color: activeSection.color }} />
            <h2 style={{
              margin: 0, color: '#FFFFFF', fontSize: 16, fontWeight: 600,
              fontFamily: 'var(--font-display)',
            }}>
              {activeSection.label}
            </h2>
          </div>

          {renderSection()}
        </div>
      </div>
    </div>
  );
}