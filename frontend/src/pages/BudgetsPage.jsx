import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { PiggyBank, Target, AlertTriangle, CheckCircle2, TrendingDown } from 'lucide-react';

const BUDGET_TARGETS = [
  { category: 'Rent',          target: 2000, color: '#758FBE' },
  { category: 'Groceries',     target: 800,  color: '#22C55E' },
  { category: 'Dining Out',    target: 500,  color: '#D6C180' },
  { category: 'Transport',     target: 300,  color: '#D686A5' },
  { category: 'Utilities',     target: 400,  color: '#C87B69' },
  { category: 'Entertainment', target: 200,  color: '#9B6B4E' },
];

const BudgetsPage = () => {
  const [reportData, setReportData] = useState([]);
  const [loading,    setLoading]    = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/summary/category', { params: { type: 'EXPENSE' } });
        setReportData(res.data || []);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    })();
  }, []);

  const budgets = BUDGET_TARGETS.map(bt => {
    const actual     = reportData.find(r => r.category === bt.category)?.total || 0;
    const percentage = (actual / bt.target) * 100;
    return { ...bt, actual, percentage };
  });

  const totalBudget = budgets.reduce((s, b) => s + b.target,  0);
  const totalSpent  = budgets.reduce((s, b) => s + b.actual, 0);
  const overCount   = budgets.filter(b => b.percentage > 100).length;

  if (loading) return (
    <div className="loader-container"><div className="loader" /><p>Loading budgets…</p></div>
  );

  return (
    <div>
      <header className="page-header">
        <div>
          <h1 className="page-title">Budget Management</h1>
          <p className="page-subtitle">Track spending against your monthly targets</p>
        </div>
        <button className="btn btn-primary"><Target size={16} /> Adjust Targets</button>
      </header>

      {/* Summary strip */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3,1fr)', marginBottom: '1.75rem' }}>
        <div className="stat-card stat-balance">
          <div className="stat-header"><h3>Total Budget</h3><div className="stat-icon"><PiggyBank size={19} /></div></div>
          <div className="value">${totalBudget.toLocaleString()}</div>
        </div>
        <div className="stat-card stat-expense">
          <div className="stat-header"><h3>Total Spent</h3><div className="stat-icon"><TrendingDown size={19} /></div></div>
          <div className="value">${totalSpent.toLocaleString()}</div>
        </div>
        <div className="stat-card" style={{ borderTop: '3px solid var(--gold)' }}>
          <div className="stat-header">
            <h3>Over Budget</h3>
            <div className="stat-icon" style={{ background: 'var(--gold-light)', color: '#92611a' }}><AlertTriangle size={19} /></div>
          </div>
          <div className="value" style={{ color: overCount > 0 ? 'var(--danger)' : 'var(--success)' }}>
            {overCount} {overCount === 1 ? 'category' : 'categories'}
          </div>
        </div>
      </div>

      {/* Budget cards grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
        {budgets.map(budget => {
          const over = budget.percentage > 100;
          const pct  = Math.min(budget.percentage, 100);
          return (
            <div key={budget.category} className="chart-card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                <div style={{
                  width: 46, height: 46, borderRadius: 12,
                  background: budget.color + '1a',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: budget.color,
                }}>
                  <PiggyBank size={22} />
                </div>
                <span style={{
                  display: 'flex', alignItems: 'center', gap: '0.3rem',
                  fontSize: '0.72rem', fontWeight: 700,
                  color: over ? '#b91c1c' : '#15803d',
                  background: over ? 'var(--danger-light)' : 'var(--success-light)',
                  padding: '0.25rem 0.65rem', borderRadius: '20px',
                }}>
                  {over ? <AlertTriangle size={11} /> : <CheckCircle2 size={11} />}
                  {over ? 'Over Budget' : 'On Track'}
                </span>
              </div>

              <div style={{ marginBottom: '1.1rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700 }}>{budget.category}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.15rem' }}>
                  Budget: ${budget.target.toLocaleString()}
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.55rem' }}>
                <span>Spent: <span style={{ color: over ? 'var(--danger)' : 'var(--text)' }}>${budget.actual.toLocaleString()}</span></span>
                <span style={{ color: over ? 'var(--danger)' : budget.color }}>{Math.round(budget.percentage)}%</span>
              </div>

              <div style={{ height: 8, background: 'var(--border)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{
                  width: `${pct}%`, height: '100%',
                  background: over ? 'var(--danger)' : budget.color,
                  borderRadius: 4, transition: 'width 0.6s ease',
                }} />
              </div>

              <p style={{ color: 'var(--text-hint)', fontSize: '0.75rem', marginTop: '0.5rem' }}>
                ${Math.max(0, budget.target - budget.actual).toLocaleString()} remaining
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BudgetsPage;
