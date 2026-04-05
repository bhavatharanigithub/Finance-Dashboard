import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import {
  Search,
  Filter,
  Trash2,
  Edit2,
  ChevronLeft,
  ChevronRight,
  X,
  CreditCard,
  DollarSign,
  Calendar,
  FileText,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

const RecordsPage = () => {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  const [formData, setFormData] = useState({
    amount: '',
    type: 'EXPENSE',
    category: '',
    date: new Date().toISOString().split('T')[0],
    currency: 'USD',
    paymentMethod: 'Credit Card',
    notes: ''
  });

  const [filters, setFilters] = useState({
    category: '',
    type: '',
    search: ''
  });

  const isAdmin = user?.role === 'ROLE_ADMIN';

  useEffect(() => {
    fetchRecords();
  }, [page, filters]);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const params = { page, size: 10, ...filters };
      const response = await api.get('/records', { params });
      setRecords(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      console.error('Error fetching records', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingRecord) {
        await api.put(`/records/${editingRecord.id}`, formData);
      }
      setShowModal(false);
      setEditingRecord(null);
      resetForm();
      fetchRecords();
    } catch (err) {
      alert('Failed to update record');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;
    try {
      await api.delete(`/records/${id}`);
      fetchRecords();
    } catch (err) {
      alert('Failed to delete record');
    }
  };

  const openEdit = (record) => {
    setEditingRecord(record);
    setFormData({
      amount: record.amount,
      type: record.type,
      category: record.category,
      date: record.date,
      currency: record.currency || 'USD',
      paymentMethod: record.paymentMethod || 'Cash',
      notes: record.notes || ''
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      amount: '',
      type: 'EXPENSE',
      category: '',
      date: new Date().toISOString().split('T')[0],
      currency: 'USD',
      paymentMethod: 'Credit Card',
      notes: ''
    });
  };

  const categoryColors = {
    Salary: '#6366f1', Freelance: '#8b5cf6', Dividends: '#a78bfa',
    'Investment Gain': '#7c3aed', Rent: '#ef4444', Groceries: '#f97316',
    'Dining Out': '#f59e0b', Transport: '#eab308', Utilities: '#84cc16',
    Subscription: '#06b6d4', Shopping: '#ec4899', Health: '#10b981',
    Gym: '#14b8a6', Travel: '#3b82f6', Entertainment: '#f43f5e',
    Insurance: '#64748b', Education: '#0ea5e9', Gifts: '#d946ef',
  };

  const getCategoryColor = (cat) => categoryColors[cat] || '#94a3b8';

  return (
    <div className="records-page">
      <header className="page-header">
        <div>
          <h1 className="page-title">Financial Records</h1>
          <p className="page-subtitle">View and manage your financial transactions</p>
        </div>
      </header>

      <div className="table-container">
        {/* Filters */}
        <div className="table-filters">
          <div className="search-box">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              className="form-control"
              placeholder="Search records..."
              value={filters.search}
              onChange={(e) => { setFilters(prev => ({ ...prev, search: e.target.value })); setPage(0); }}
            />
          </div>
          <div className="filter-group">
            <select
              className="form-control filter-select"
              value={filters.type}
              onChange={(e) => { setFilters(prev => ({ ...prev, type: e.target.value })); setPage(0); }}
            >
              <option value="">All Types</option>
              <option value="INCOME">Income</option>
              <option value="EXPENSE">Expense</option>
            </select>
            <input
              type="text"
              className="form-control filter-category"
              placeholder="Filter by category"
              value={filters.category}
              onChange={(e) => { setFilters(prev => ({ ...prev, category: e.target.value })); setPage(0); }}
            />
          </div>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Category</th>
              <th>Payment</th>
              <th>Type</th>
              <th style={{ textAlign: 'right' }}>Amount</th>
              {isAdmin && <th style={{ textAlign: 'center' }}>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={isAdmin ? 6 : 5} style={{ textAlign: 'center', padding: '3rem' }}>
                <div className="loader" style={{ margin: '0 auto 1rem' }}></div>
                Loading records...
              </td></tr>
            ) : records.length === 0 ? (
              <tr><td colSpan={isAdmin ? 6 : 5} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                <FileText size={40} style={{ marginBottom: '0.75rem', opacity: 0.3 }} />
                <div>No records found.</div>
              </td></tr>
            ) : (
              records.map(rec => (
                <tr key={rec.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Calendar size={14} style={{ color: 'var(--text-muted)' }} />
                      {new Date(rec.date).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <div style={{
                        width: 8, height: 8, borderRadius: '50%',
                        background: getCategoryColor(rec.category), flexShrink: 0
                      }} />
                      <div>
                        <div style={{ fontWeight: 600 }}>{rec.category}</div>
                        {rec.notes && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{rec.notes.slice(0, 30)}{rec.notes.length > 30 ? '…' : ''}</div>}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                      <CreditCard size={14} style={{ color: 'var(--text-muted)' }} />
                      {rec.paymentMethod || 'Cash'}
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${rec.type === 'INCOME' ? 'badge-income' : 'badge-expense'}`}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                      {rec.type === 'INCOME' ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                      {rec.type}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right', fontWeight: '700', color: rec.type === 'INCOME' ? 'var(--success)' : 'var(--danger)' }}>
                    {rec.type === 'INCOME' ? '+' : '-'}${Number(rec.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  {isAdmin && (
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                        <button onClick={() => openEdit(rec)} className="btn" style={{ padding: '0.4rem 0.65rem', border: '1px solid var(--border)' }} title="Edit">
                          <Edit2 size={15} />
                        </button>
                        <button className="btn" style={{ padding: '0.4rem 0.65rem', border: '1px solid var(--border)', color: 'var(--danger)' }}
                          onClick={() => handleDelete(rec.id)} title="Delete">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className="table-pagination">
          <div className="pagination-info">
            Page {page + 1} of {Math.max(totalPages, 1)}
          </div>
          <div className="pagination-actions">
            <button className="btn pagination-btn" disabled={page === 0} onClick={() => setPage(p => Math.max(0, p - 1))}>
              <ChevronLeft size={16} />
            </button>
            <button className="btn pagination-btn" disabled={page >= totalPages - 1} onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Edit Modal — Admin only */}
      {showModal && editingRecord && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ animation: 'slideUp 0.3s ease-out' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700 }}>Edit Record</h2>
              <button onClick={() => { setShowModal(false); setEditingRecord(null); }}
                style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Amount</label>
                  <div style={{ position: 'relative' }}>
                    <DollarSign size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input type="number" step="0.01" className="form-control" style={{ paddingLeft: '2rem' }}
                      value={formData.amount} onChange={e => setFormData({ ...formData, amount: e.target.value })} required />
                  </div>
                </div>
                <div className="form-group">
                  <label>Type</label>
                  <select className="form-control" value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })} required>
                    <option value="INCOME">Income</option>
                    <option value="EXPENSE">Expense</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Category</label>
                <input type="text" className="form-control" placeholder="e.g., Food, Salary, Rent"
                  value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Date</label>
                  <input type="date" className="form-control"
                    value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Currency</label>
                  <select className="form-control" value={formData.currency} onChange={e => setFormData({ ...formData, currency: e.target.value })}>
                    <option value="USD">$ USD</option>
                    <option value="EUR">€ EUR</option>
                    <option value="GBP">£ GBP</option>
                    <option value="INR">₹ INR</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Payment Method</label>
                <select className="form-control" value={formData.paymentMethod} onChange={e => setFormData({ ...formData, paymentMethod: e.target.value })}>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Debit Card">Debit Card</option>
                  <option value="Cash">Cash</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                </select>
              </div>
              <div className="form-group">
                <label>Notes</label>
                <textarea className="form-control" rows="3" placeholder="Additional details..."
                  value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })}></textarea>
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <button type="button" className="btn" style={{ flex: 1, border: '1px solid var(--border)' }}
                  onClick={() => { setShowModal(false); setEditingRecord(null); }}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Update Record</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecordsPage;
