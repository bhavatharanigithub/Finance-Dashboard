import React from 'react';
import { TrendingUp, ArrowUpRight, ArrowDownRight, Activity, Wallet, Layers } from 'lucide-react';

const INVESTMENTS = [
  { name: 'S&P 500 ETF (VOO)',   type: 'Stock / ETF',     value: 12500.50, change:  8.2,  color: '#758FBE' },
  { name: 'Crypto (BTC)',        type: 'Cryptocurrency',  value: 4500.20,  change: -2.3,  color: '#D6C180' },
  { name: 'Tech Growth Fund',    type: 'Mutual Fund',     value: 8700.00,  change: 12.5,  color: '#D686A5' },
  { name: 'Green Energy Index',  type: 'ESG Stock',       value: 3200.75,  change:  4.8,  color: '#22C55E' },
];

const total = INVESTMENTS.reduce((s, i) => s + i.value, 0);

const InvestmentsPage = () => (
  <div>
    <header className="page-header">
      <div>
        <h1 className="page-title">Portfolio Overview</h1>
        <p className="page-subtitle">Track your wealth and market performance</p>
      </div>
      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <button className="btn btn-outline"><Activity size={16} /> Market Analysis</button>
        <button className="btn btn-primary"><Wallet size={16} /> Add Asset</button>
      </div>
    </header>

    {/* Summary cards */}
    <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', marginBottom: '1.75rem' }}>
      <div className="stat-card stat-balance">
        <div className="stat-header">
          <h3>Net Portfolio Value</h3>
          <div className="stat-icon"><Layers size={19} /></div>
        </div>
        <div className="value">${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
        <p style={{ color: 'var(--success)', fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.2rem', marginTop: '0.4rem' }}>
          <ArrowUpRight size={13} /> +4.8% this month
        </p>
      </div>
      <div className="stat-card stat-income">
        <div className="stat-header">
          <h3>Est. Annual Return</h3>
          <div className="stat-icon"><TrendingUp size={19} /></div>
        </div>
        <div className="value">$2,450.00</div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.4rem' }}>Projected at current yield</p>
      </div>
      <div className="stat-card" style={{ borderTop: '3px solid var(--gold)' }}>
        <div className="stat-header">
          <h3>Best Performer</h3>
          <div className="stat-icon" style={{ background: 'var(--gold-light)', color: '#92611a' }}><TrendingUp size={19} /></div>
        </div>
        <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text)' }}>Tech Growth Fund</div>
        <p style={{ color: 'var(--success)', fontSize: '0.8rem', fontWeight: 600, marginTop: '0.4rem' }}>+12.5% this month</p>
      </div>
    </div>

    {/* Holdings table */}
    <div className="table-container">
      <div className="table-header">
        <h2>Current Holdings</h2>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{INVESTMENTS.length} assets</span>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>Asset Name</th>
            <th>Category</th>
            <th style={{ textAlign: 'right' }}>Current Value</th>
            <th style={{ textAlign: 'center' }}>Monthly Change</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {INVESTMENTS.map((inv, i) => {
            const up = inv.change > 0;
            return (
              <tr key={i}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: inv.color + '1a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: inv.color }}>
                      <TrendingUp size={16} />
                    </div>
                    <span style={{ fontWeight: 600 }}>{inv.name}</span>
                  </div>
                </td>
                <td>
                  <span className="badge" style={{ background: inv.color + '18', color: inv.color, border: `1px solid ${inv.color}40` }}>
                    {inv.type}
                  </span>
                </td>
                <td style={{ textAlign: 'right', fontWeight: 700 }}>
                  ${inv.value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </td>
                <td style={{ textAlign: 'center' }}>
                  <span style={{
                    color: up ? 'var(--success)' : 'var(--danger)',
                    fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.2rem',
                    background: up ? 'var(--success-light)' : 'var(--danger-light)',
                    padding: '0.25rem 0.65rem', borderRadius: '20px', fontSize: '0.82rem',
                  }}>
                    {up ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                    {Math.abs(inv.change)}%
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.85rem' }}>
                    <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--success)' }} />
                    <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Active</span>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </div>
);

export default InvestmentsPage;
