import React from 'react';
import * as Icons from 'lucide-react';

interface KPICardProps {
  title: string;
  value: number;
  type: 'currency' | 'number';
  icon: keyof typeof Icons;
  iconColor: 'primary' | 'success' | 'warning' | 'danger';
  loading?: boolean;
  description?: string;
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  type,
  icon,
  iconColor,
  loading = false,
  description,
}) => {
  const IconComponent = Icons[icon] as React.ComponentType<{ className?: string; style?: React.CSSProperties }>;

  const colorClasses = {
    primary: {
      bg: 'rgba(99, 102, 241, 0.15)',
      text: 'text-[#818cf8]',
      icon: '#818cf8',
    },
    success: {
      bg: 'rgba(16, 185, 129, 0.15)',
      text: 'text-[#34d399]',
      icon: '#34d399',
    },
    warning: {
      bg: 'rgba(245, 158, 11, 0.15)',
      text: 'text-[#fbbf24]',
      icon: '#fbbf24,',
    },
    danger: {
      bg: 'rgba(239, 68, 68, 0.15)',
      text: 'text-[#f87171]',
      icon: '#f87171',
    },
  }[iconColor];

  const formatValue = (val: number) => {
    if (type === 'currency') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }).format(val);
    }
    return new Intl.NumberFormat('en-US').format(val);
  };

  if (loading) {
    return (
      <div className="glass-card animate-pulse" style={{ minHeight: '115px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ flex: 1 }}>
            <div style={{ height: '14px', width: '60%', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '4px', marginBottom: '12px' }}></div>
            <div style={{ height: '28px', width: '80%', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '6px' }}></div>
          </div>
          <div style={{ height: '40px', width: '40px', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '10px' }}></div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card animate-fade-in" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
        <div>
          <div className="kpi-title">{title}</div>
          <div className="kpi-value">{formatValue(value)}</div>
        </div>
        <div 
          style={{ 
            backgroundColor: colorClasses.bg, 
            borderRadius: '0.75rem', 
            padding: '0.6rem', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center' 
          }}
        >
          {IconComponent && (
            <IconComponent 
              className={colorClasses.text} 
              style={{ width: '1.25rem', height: '1.25rem', color: colorClasses.icon }} 
            />
          )}
        </div>
      </div>
      {description && (
        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
          {description}
        </div>
      )}
    </div>
  );
};
