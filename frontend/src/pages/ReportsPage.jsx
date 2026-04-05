import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';
import { BarChart3, PieChart, Download, DollarSign } from 'lucide-react';

const PASTEL = ['#758FBE','#D686A5','#C87B69','#D6C180','#9B6B4E','#22C55E','#8B9FCC','#C4A882'];

const ReportsPage = () => {
  const [expenses, setExpenses] = useState([]);
  const [incomes,  setIncomes]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [eRes, iRes] = await Promise.all([
          api.get('/summary/category', { params: { type: 'EXPENSE' } }),
          api.get('/summary/category', { params: { type: 'INCOME'  } }),
        ]);
        setExpenses(eRes.data || []);
        setIncomes(iRes.data  || []);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    })();
  }, []);

  const totalExpense = expenses.reduce((a, c) => a + (c.total || 0), 0);
  const totalIncome  = incomes.reduce( (a, c) => a + (c.total || 0), 0);

  const BarList = ({ items, total, colorBase }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {items.map((item, i) => {
        const pct = total > 0 ? ((item.total / total) * 100).toFixed(1) : 0;
        const color = PASTEL[i % PASTEL.length];
        return (
          <div key={item.category}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem', fontSize: '0.875rem' }}>
              <span style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, display: 'inline-block' }} />
                {item.category}
              </span>
              <span style={{ color: 'var(--text-muted)' }}>
                ${Number(item.total).toLocaleString()}{' '}
                <span style={{ color, fontWeight: 700 }}>({pct}%)</span>
              </span>
            </div>
            <div style={{ height: 7, background: 'var(--border)', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 4, transition: 'width 0.6s ease' }} />
            </div>
          </div>
        );
      })}
      {items.length === 0 && <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No data recorded.</p>}
    </div>
  );

  return (
    <div>
      <header className="page-header">
        <div>
          <h1 className="page-title">Financial Reports</h1>
          <p className="page-subtitle">Detailed analysis of your spending and income patterns</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-outline"><Download size={16} /> Export CSV</button>
          {user?.role === 'ROLE_ADMIN' && (
            <button className="btn btn-primary" onClick={() => navigate('/records', { state: { openModal: true } })}>
              <DollarSign size={16} /> New Transaction
            </button>
          )}
        </div>
      </header>

      {/* Summary cards */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', marginBottom: '1.75rem' }}>
        <div className="stat-card stat-expense">
          <div className="stat-header">
            <h3>Total Expenses</h3>
            <div className="stat-icon"><BarChart3 size={19} /></div>
          </div>
          <div className="value">${totalExpense.toLocaleString()}</div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.4rem' }}>Based on current data</p>
        </div>
        <div className="stat-card stat-income">
          <div className="stat-header">
            <h3>Total Income</h3>
            <div className="stat-icon"><PieChart size={19} /></div>
          </div>
          <div className="value">${totalIncome.toLocaleString()}</div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.4rem' }}>Based on current data</p>
        </div>
        <div className="stat-card stat-balance">
          <div className="stat-header">
            <h3>Top Expense</h3>
            <div className="stat-icon"><BarChart3 size={19} /></div>
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text)' }}>
            {expenses[0]?.category || 'N/A'}
          </div>
          <p style={{ color: 'var(--danger)', fontSize: '0.8rem', fontWeight: 600, marginTop: '0.4rem' }}>
            {expenses[0] ? `$${Number(expenses[0].total).toLocaleString()} spent` : 'No data'}
          </p>
        </div>
      </div>

      {/* Breakdown grids */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.4rem' }}>
        <div className="chart-card">
          <div className="chart-header">
            <h2>Expense Breakdown</h2>
            <div style={{ background: 'var(--danger-light)', color: 'var(--danger)', padding: '0.3rem 0.75rem', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 700 }}>
              EXPENSE
            </div>
          </div>
          {loading ? <div className="loader-container" style={{ height: 120 }}><div className="loader" /></div>
            : <BarList items={expenses} total={totalExpense} />}
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <h2>Income Breakdown</h2>
            <div style={{ background: 'var(--success-light)', color: 'var(--success)', padding: '0.3rem 0.75rem', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 700 }}>
              INCOME
            </div>
          </div>
          {loading ? <div className="loader-container" style={{ height: 120 }}><div className="loader" /></div>
            : <BarList items={incomes} total={totalIncome} />}
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
