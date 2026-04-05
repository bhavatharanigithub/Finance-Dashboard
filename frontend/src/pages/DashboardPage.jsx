import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';
import {
  DollarSign, TrendingUp, TrendingDown, Download,
  ArrowUpRight, ArrowDownRight, Calendar, PieChart, Activity, Sparkles,
} from 'lucide-react';

const PASTEL_COLORS = [
  '#758FBE','#D686A5','#C87B69','#D6C180','#9B6B4E',
  '#22C55E','#8B9FCC','#E0A0B8','#A8C8B8','#C4A882',
];

const DashboardPage = () => {
  const [summary,    setSummary]    = useState(null);
  const [recent,     setRecent]     = useState([]);
  const [trends,     setTrends]     = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    (async () => {
      try {
        const [sumRes, recRes, trendRes, catRes] = await Promise.all([
          api.get('/summary'),
          api.get('/summary/recent'),
          api.get('/summary/trends'),
          api.get('/summary/categories?type=EXPENSE').catch(() => ({ data: [] })),
        ]);
        setSummary(sumRes.data);
        setRecent(recRes.data);
        setTrends(trendRes.data);
        setCategories(catRes.data);
      } catch (err) {
        console.error('Error fetching dashboard data', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleExportCsv = async () => {
    try {
      const response = await api.get('/export/csv', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'finance_report.csv');
      document.body.appendChild(link);
      link.click(); link.remove();
    } catch { alert('Failed to export CSV'); }
  };

  if (loading) {
    return (
      <div className="loader-container">
        <div className="loader" />
        <p>Loading your financial summary…</p>
      </div>
    );
  }

  /* ── Trend chart ── */
  const renderTrendChart = () => {
    if (!trends?.length)
      return <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No trend data yet.</div>;

    const grouped = {};
    trends.forEach(t => {
      const d = new Date(t.month);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const label = d.toLocaleDateString(undefined, { month: 'short', year: '2-digit' });
      if (!grouped[key]) grouped[key] = { label, income: 0, expense: 0 };
      if (t.type === 'INCOME') grouped[key].income += Number(t.total);
      else grouped[key].expense += Number(t.total);
    });

    const data = Object.values(grouped).slice(0, 6).reverse();
    const maxVal = Math.max(...data.flatMap(d => [d.income, d.expense]), 100);
    const W = 100, H = 160, PAD = 28;

    return (
      <div style={{ width: '100%', overflowX: 'auto' }}>
        <svg viewBox={`0 0 ${W * data.length} ${H + PAD}`} style={{ width: '100%', minHeight: 200 }}>
          {data.map((d, i) => {
            const x = i * W + 16;
            const incH = Math.max((d.income  / maxVal) * H, 2);
            const expH = Math.max((d.expense / maxVal) * H, 2);
            return (
              <g key={d.label}>
                <title>{d.label} — Income: ${d.income.toLocaleString()}, Expense: ${d.expense.toLocaleString()}</title>
                <rect x={x}      y={H - incH} width={22} height={incH} fill="#22C55E" rx={5} opacity={0.82} />
                <rect x={x + 26} y={H - expH} width={22} height={expH} fill="#EF4444" rx={5} opacity={0.82} />
                <text x={x + 23} y={H + 18} textAnchor="middle" fill="#9B6B4E" style={{ fontSize: '10px', fontWeight: 600 }}>{d.label}</text>
              </g>
            );
          })}
        </svg>
        <div style={{ display: 'flex', gap: '1.25rem', justifyContent: 'center', marginTop: '0.5rem' }}>
          {[['#22C55E', 'Income'], ['#EF4444', 'Expense']].map(([bg, label]) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <div style={{ width: 10, height: 10, background: bg, borderRadius: 2 }} />{label}
            </div>
          ))}
        </div>
      </div>
    );
  };

  /* ── Categories ── */
  const renderCategories = () => {
    if (!categories?.length)
      return <div style={{ textAlign: 'center', padding: '1rem', color: 'var(--text-muted)' }}>No category data.</div>;

    const top = categories.slice(0, 7);
    const total = top.reduce((s, c) => s + Number(c.total), 0);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {top.map((cat, i) => {
          const pct = total > 0 ? ((Number(cat.total) / total) * 100).toFixed(1) : 0;
          const color = PASTEL_COLORS[i % PASTEL_COLORS.length];
          return (
            <div key={cat.category}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem', fontSize: '0.85rem' }}>
                <span style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ width: 9, height: 9, borderRadius: '50%', background: color, display: 'inline-block' }} />
                  {cat.category}
                </span>
                <span style={{ color: 'var(--text-muted)' }}>
                  ${Number(cat.total).toLocaleString(undefined, { minimumFractionDigits: 0 })}{' '}
                  <span style={{ color, fontWeight: 700 }}>({pct}%)</span>
                </span>
              </div>
              <div style={{ height: 6, background: 'var(--border)', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 3, transition: 'width 0.6s ease' }} />
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const StatCard = ({ title, value, icon, colorClass, trend }) => (
    <div className={`stat-card ${colorClass}`}>
      <div className="stat-header">
        <h3>{title}</h3>
        <div className="stat-icon">{icon}</div>
      </div>
      <div className="value">${Number(value || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
      {trend && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.65rem', fontSize: '0.82rem' }}>
          <span style={{ color: trend > 0 ? 'var(--success)' : 'var(--danger)', fontWeight: 600, display: 'flex', alignItems: 'center' }}>
            {trend > 0 ? <ArrowUpRight size={15} /> : <ArrowDownRight size={15} />}
            {Math.abs(trend)}%
          </span>
          <span style={{ color: 'var(--text-muted)' }}>vs last month</span>
        </div>
      )}
    </div>
  );

  return (
    <div>
      <header className="page-header">
        <div>
          <h1 className="page-title">Overview</h1>
          <p className="page-subtitle">
            Welcome back, <strong style={{ color: 'var(--primary)' }}>{user?.name?.split(' ')[0] || 'User'}</strong>! Here's your financial snapshot.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={handleExportCsv} className="btn btn-outline">
            <Download size={17} />
            <span className="nav-text">Export CSV</span>
          </button>
        </div>
      </header>

      {/* Welcome banner */}
      <div style={{
        background: 'var(--gradient)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.5rem 2rem',
        marginBottom: '1.75rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        boxShadow: '0 6px 24px rgba(117,143,190,0.25)',
      }}>
        <div>
          <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.82rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Net Balance
          </div>
          <div style={{ color: '#fff', fontSize: '2.2rem', fontWeight: 700, letterSpacing: '-0.02em' }}>
            ${Number(summary?.netBalance || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', marginTop: '0.2rem' }}>
            Total across all accounts
          </div>
        </div>
        <Sparkles size={48} style={{ color: 'rgba(255,255,255,0.25)' }} />
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <StatCard title="Total Income"   value={summary?.totalIncome}  icon={<TrendingUp size={20} />}  colorClass="stat-income"  trend={12.5} />
        <StatCard title="Total Expenses" value={summary?.totalExpense} icon={<TrendingDown size={20} />} colorClass="stat-expense" trend={-4.2} />
        <StatCard title="Net Balance"    value={summary?.netBalance}   icon={<DollarSign size={20} />}  colorClass="stat-balance" />
      </div>

      {/* Charts */}
      <div className="charts-grid">
        <div className="chart-card">
          <div className="chart-header">
            <h2>Monthly Trends</h2>
            <Calendar size={17} style={{ color: 'var(--text-muted)' }} />
          </div>
          {renderTrendChart()}
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <h2>Recent Activity</h2>
            <Activity size={17} style={{ color: 'var(--text-muted)' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
            {recent.map(rec => (
              <div key={rec.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem', borderRadius: 'var(--radius-md)', background: 'var(--surface-alt)' }}>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 10,
                    background: rec.type === 'INCOME' ? 'var(--success-light)' : 'var(--danger-light)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: rec.type === 'INCOME' ? 'var(--success)' : 'var(--danger)',
                  }}>
                    {rec.type === 'INCOME' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{rec.category}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      {new Date(rec.date).toLocaleDateString(undefined, { day: '2-digit', month: 'short' })}
                    </div>
                  </div>
                </div>
                <div style={{ fontWeight: 700, color: rec.type === 'INCOME' ? 'var(--success)' : 'var(--danger)', fontSize: '0.9rem' }}>
                  {rec.type === 'INCOME' ? '+' : '-'}${Number(rec.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </div>
              </div>
            ))}
            {recent.length === 0 && (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No recent activity.</div>
            )}
          </div>
        </div>
      </div>

      {/* Category breakdown */}
      <div className="chart-card">
        <div className="chart-header">
          <h2>Expense Breakdown by Category</h2>
          <PieChart size={17} style={{ color: 'var(--text-muted)' }} />
        </div>
        {renderCategories()}
      </div>
    </div>
  );
};

export default DashboardPage;
