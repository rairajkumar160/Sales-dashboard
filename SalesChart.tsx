import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

interface ChartDataPoint {
  name: string;
  sales: number;
  orders: number;
  discount: number;
}

interface SalesChartProps {
  data: ChartDataPoint[];
  loading?: boolean;
}

export const SalesChart: React.FC<SalesChartProps> = ({ data, loading = false }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(value);
  };

  // Custom tool tip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div 
          style={{
            background: 'rgba(16, 22, 46, 0.95)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            backdropFilter: 'blur(16px)',
            padding: '1rem',
            borderRadius: '0.75rem',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
          }}
        >
          <p style={{ margin: '0 0 0.5rem 0', fontWeight: 600, color: 'var(--color-text-primary)' }}>
            {label}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {payload.map((pld: any) => (
              <div key={pld.name} style={{ display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'space-between' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                  <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: pld.color }}></span>
                  {pld.name}:
                </span>
                <span style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--color-text-primary)' }}>
                  {pld.name === 'Gross Sales' || pld.name === 'Discount' 
                    ? formatCurrency(pld.value) 
                    : formatNumber(pld.value)}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="glass-card animate-pulse" style={{ height: '350px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '90%' }}>
          <div style={{ height: '20px', width: '20%', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '4px' }}></div>
          <div style={{ height: '250px', width: '100%', backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: '8px' }}></div>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="glass-card" style={{ height: '350px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: '0.5rem', fontWeight: 500 }}>No chart data available for this date</p>
        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Try selecting a different date or checking your connection</p>
      </div>
    );
  }

  return (
    <div className="glass-card animate-fade-in" style={{ height: '100%', minHeight: '380px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div style={{ marginBottom: '1.25rem' }}>
        <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>Sales Performance Trend</h3>
        <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
          Hourly breakdown of gross sales and order volume
        </p>
      </div>
      
      <div style={{ width: '100%', height: '300px', flexGrow: 1 }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: -5, left: -15, bottom: 0 }}>
            <defs>
              <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0.0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis 
              dataKey="name" 
              stroke="var(--color-text-muted)" 
              fontSize={11}
              tickLine={false}
              axisLine={false}
              dy={10}
            />
            <YAxis 
              yAxisId="left"
              stroke="var(--color-text-muted)" 
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={formatCurrency}
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              stroke="var(--color-text-muted)" 
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={formatNumber}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
            <Legend 
              verticalAlign="top" 
              height={36} 
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: '0.8rem', fontWeight: 500, paddingBottom: '10px' }}
            />
            <Area 
              yAxisId="left"
              type="monotone" 
              dataKey="sales" 
              name="Gross Sales" 
              stroke="var(--color-primary)" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorSales)" 
            />
            <Bar 
              yAxisId="right"
              dataKey="orders" 
              name="Orders" 
              fill="var(--color-success)" 
              radius={[4, 4, 0, 0]}
              barSize={16}
              opacity={0.8}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
