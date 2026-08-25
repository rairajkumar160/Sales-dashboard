import { useState, useEffect } from 'react';
import { fetchSalesDashboard } from './api';
import type { SalesDashboardData } from './api';
import { KPICard } from './components/KPICard';
import { SalesChart } from './components/SalesChart';
import { AlertCircle, Calendar, RefreshCw, TrendingUp } from 'lucide-react';

function App() {
  const [selectedDate, setSelectedDate] = useState<string>('2026-05-25');
  const [data, setData] = useState<SalesDashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async (date: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchSalesDashboard(date);
      setData(res);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An unexpected error occurred while fetching dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(selectedDate);
  }, [selectedDate]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
  };

  const handleRetry = () => {
    loadData(selectedDate);
  };

  return (
    <div className="container animate-fade-in">
      {/* Top Header */}
      <header className="dashboard-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <TrendingUp style={{ color: 'var(--color-primary-light)', width: '1.75rem', height: '1.75rem' }} />
            <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 800 }}>
              Sales <span className="text-gradient">Dashboard</span>
            </h1>
          </div>
          <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>
            Real-time sales insights and performance analysis
          </p>
        </div>

        {/* Date Picker Component */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {loading && (
            <RefreshCw 
              style={{ 
                color: 'var(--color-text-muted)', 
                width: '1rem', 
                height: '1rem',
                animation: 'spin 1.5s linear infinite'
              }} 
            />
          )}
          <div className="date-picker-wrapper">
            <Calendar style={{ color: 'var(--color-primary-light)', width: '1rem', height: '1rem' }} />
            <input
              type="date"
              className="date-picker-input"
              value={selectedDate}
              onChange={handleDateChange}
              disabled={loading}
              id="dashboard-date-picker"
            />
          </div>
        </div>
      </header>

      {/* Error Alert Box */}
      {error && (
        <div className="alert-error animate-fade-in">
          <AlertCircle style={{ width: '1.25rem', height: '1.25rem', flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <h4 style={{ margin: '0 0 0.25rem 0', fontWeight: 700, fontSize: '0.95rem' }}>
              Error Fetching Data
            </h4>
            <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.875rem', lineHeight: '1.4' }}>
              {error}
            </p>
            {error.includes('Supabase configuration') && (
              <div style={{ fontSize: '0.8rem', background: 'rgba(0,0,0,0.2)', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '0.75rem' }}>
                <strong>Quick Fix:</strong> Copy <code>.env.example</code> to <code>.env</code> and fill in your actual Supabase URL and anonymous key.
              </div>
            )}
            <button
              onClick={handleRetry}
              style={{
                background: 'rgba(255,255,255,0.15)',
                border: 'none',
                color: 'inherit',
                padding: '0.4rem 0.8rem',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontSize: '0.8rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.25)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)')}
            >
              <RefreshCw style={{ width: '0.8rem', height: '0.8rem' }} /> Retry Connection
            </button>
          </div>
        </div>
      )}

      {/* KPI Cards Grid */}
      <section className="kpi-grid">
        <KPICard
          title="Total Orders"
          value={data?.totalOrders ?? 0}
          type="number"
          icon="ShoppingCart"
          iconColor="primary"
          loading={loading}
          description="Total number of completed orders"
        />
        <KPICard
          title="Total Sales"
          value={data?.totalSales ?? 0}
          type="currency"
          icon="DollarSign"
          iconColor="success"
          loading={loading}
          description="Gross revenue before deductions"
        />
        <KPICard
          title="Total Discount"
          value={data?.totalDiscount ?? 0}
          type="currency"
          icon="Percent"
          iconColor="danger"
          loading={loading}
          description="Promotional and loyalty discounts"
        />
        <KPICard
          title="Net Sales"
          value={data?.netSales ?? 0}
          type="currency"
          icon="TrendingUp"
          iconColor="success"
          loading={loading}
          description="Gross revenue minus discounts"
        />
        <KPICard
          title="Average Order Value"
          value={data?.averageOrderValue ?? 0}
          type="currency"
          icon="Layers"
          iconColor="warning"
          loading={loading}
          description="Average basket size (Net Sales / Orders)"
        />
      </section>

      {/* Charts & Details Grid */}
      <section className="charts-grid">
        {/* Sales Trend Chart */}
        <div>
          <SalesChart 
            data={data?.chartData ?? []} 
            loading={loading} 
          />
        </div>

        {/* Breakdown details table */}
        <div className="glass-card animate-fade-in" style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: '380px' }}>
          <div style={{ marginBottom: '1.25rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>Performance Breakdown</h3>
            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
              Detailed performance metrics per data point
            </p>
          </div>

          <div style={{ flexGrow: 1, overflowY: 'auto', maxHeight: '280px', paddingRight: '4px' }}>
            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="animate-pulse" style={{ height: '40px', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '0.5rem' }}></div>
                ))}
              </div>
            ) : !data?.chartData || data.chartData.length === 0 ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                No breakdown available
              </div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <th style={{ padding: '0.75rem 0.5rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Time / Label</th>
                    <th style={{ padding: '0.75rem 0.5rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase', textAlign: 'right' }}>Sales</th>
                    <th style={{ padding: '0.75rem 0.5rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase', textAlign: 'right' }}>Orders</th>
                    <th style={{ padding: '0.75rem 0.5rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase', textAlign: 'right' }}>AOV</th>
                  </tr>
                </thead>
                <tbody>
                  {data.chartData.map((item, idx) => {
                    const rowNet = item.sales - item.discount;
                    const rowAOV = item.orders > 0 ? rowNet / item.orders : 0;
                    return (
                      <tr 
                        key={idx} 
                        style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                      >
                        <td style={{ padding: '0.75rem 0.5rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>{item.name}</td>
                        <td style={{ padding: '0.75rem 0.5rem', fontSize: '0.85rem', color: 'var(--color-text-primary)', textAlign: 'right', fontWeight: 500 }}>
                          {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(item.sales)}
                        </td>
                        <td style={{ padding: '0.75rem 0.5rem', fontSize: '0.85rem', color: 'var(--color-text-secondary)', textAlign: 'right' }}>
                          {new Intl.NumberFormat('en-US').format(item.orders)}
                        </td>
                        <td style={{ padding: '0.75rem 0.5rem', fontSize: '0.85rem', color: 'var(--color-text-muted)', textAlign: 'right' }}>
                          {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(rowAOV)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ marginTop: '3rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', paddingBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
          &copy; {new Date().getFullYear()} Sales Dashboard Inc. All rights reserved.
        </p>
        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
          <span>Vite + React</span>
          <span>&bull;</span>
          <span>Supabase RPC API</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
