type Severity = 'critical' | 'high' | 'medium' | 'low' | 'clean';

const config: Record<Severity, { bg: string; text: string; border: string; label: string }> = {
  critical: { bg: 'rgba(224,82,82,0.12)', text: '#E05252', border: 'rgba(224,82,82,0.3)', label: 'Critical' },
  high:     { bg: 'rgba(224,122,48,0.12)', text: '#E07A30', border: 'rgba(224,122,48,0.3)', label: 'High' },
  medium:   { bg: 'rgba(224,122,48,0.08)', text: '#E0A030', border: 'rgba(224,160,48,0.25)', label: 'Medium' },
  low:      { bg: 'rgba(77,166,216,0.10)', text: '#4DA6D8', border: 'rgba(77,166,216,0.25)', label: 'Low' },
  clean:    { bg: 'rgba(60,184,117,0.10)', text: '#3CB875', border: 'rgba(60,184,117,0.25)', label: 'Clean' },
};

interface ThreatBadgeProps {
  severity: Severity;
  label?: string;
}

export function ThreatBadge({ severity, label }: ThreatBadgeProps) {
  const c = config[severity];
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        height: 22,
        padding: '0 8px',
        borderRadius: 6,
        background: c.bg,
        border: `1px solid ${c.border}`,
        color: c.text,
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
        fontFamily: 'var(--font-text)',
        whiteSpace: 'nowrap',
      }}
    >
      {label || c.label}
    </span>
  );
}
