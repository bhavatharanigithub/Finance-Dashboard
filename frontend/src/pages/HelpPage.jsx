import React, { useState } from 'react';
import { HelpCircle, Book, MessageSquare, Phone, ShieldCheck, Mail, ChevronDown, ChevronUp } from 'lucide-react';

const FAQS = [
  { q: 'How do I export my data?', a: 'Click the "Export CSV" button in the Dashboard or Records page to download all your financial records instantly.' },
  { q: 'Can I set custom budget targets?', a: 'Yes — head to the Budgets page and click "Adjust Targets" to set your own monthly spending limits per category.' },
  { q: 'What currencies are supported?', a: 'We support USD, EUR, GBP, INR, and more. Select your preferred currency when adding a new record.' },
  { q: 'How secure is my data?', a: 'We use industry-standard JWT authentication and secure backend practices to ensure your data stays private.' },
  { q: 'How do roles work?', a: 'Viewer can see summaries & investments. Analyst also accesses records, reports, and budgets. Admin has full access including user management.' },
];

const Faq = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div style={{
      border: '1px solid var(--border)', borderRadius: 'var(--radius-md)',
      overflow: 'hidden', transition: 'box-shadow 0.2s',
      boxShadow: open ? 'var(--shadow-sm)' : 'none',
    }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%', display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', padding: '1rem 1.25rem',
          background: open ? 'var(--primary-light)' : 'var(--surface)',
          border: 'none', cursor: 'pointer', gap: '1rem',
          fontFamily: 'inherit', textAlign: 'left',
        }}
      >
        <span style={{ fontWeight: 600, fontSize: '0.9rem', color: open ? 'var(--primary)' : 'var(--text)' }}>
          {q}
        </span>
        {open ? <ChevronUp size={16} style={{ color: 'var(--primary)', flexShrink: 0 }} />
               : <ChevronDown size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />}
      </button>
      {open && (
        <div style={{ padding: '0.9rem 1.25rem 1.1rem', background: 'var(--surface)', borderTop: '1px solid var(--border)' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.65, margin: 0 }}>{a}</p>
        </div>
      )}
    </div>
  );
};

const HelpPage = () => (
  <div>
    <header className="page-header">
      <div>
        <h1 className="page-title">Help & Support</h1>
        <p className="page-subtitle">Find answers and get in touch with our team</p>
      </div>
    </header>

    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: '1.4rem', marginBottom: '1.4rem' }}>
      {/* Quick links */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {[
          { icon: Book,        color: 'var(--primary)', bg: 'var(--primary-light)',   title: 'Documentation',      desc: 'Comprehensive guides for all features.', btn: 'View Docs',     cls: 'btn-primary' },
          { icon: ShieldCheck, color: 'var(--success)', bg: 'var(--success-light)',   title: 'Security & Privacy', desc: 'How we protect your financial data.',   btn: 'Privacy Policy', cls: 'btn-outline' },
        ].map(({ icon: Icon, color, bg, title, desc, btn, cls }) => (
          <div key={title} className="chart-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.9rem' }}>
              <div style={{ width: 42, height: 42, borderRadius: 10, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color }}>
                <Icon size={20} />
              </div>
              <h2 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{title}</h2>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '1.1rem' }}>{desc}</p>
            <button className={`btn ${cls}`}>{btn}</button>
          </div>
        ))}
      </div>

      {/* FAQ */}
      <div className="chart-card">
        <div className="chart-header">
          <h2>Frequently Asked Questions</h2>
          <HelpCircle size={17} style={{ color: 'var(--gold)' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {FAQS.map(faq => <Faq key={faq.q} {...faq} />)}
        </div>
      </div>
    </div>

    {/* Contact strip */}
    <div style={{
      background: 'var(--gradient)',
      borderRadius: 'var(--radius-lg)',
      padding: '2rem 2.5rem',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      flexWrap: 'wrap', gap: '1.5rem',
      boxShadow: '0 6px 24px rgba(117,143,190,0.25)',
    }}>
      <div>
        <h2 style={{ color: '#fff', fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.3rem' }}>Still have questions?</h2>
        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}>Our support team is available 24/7 to help.</p>
      </div>
      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        {[
          { Icon: Mail,  val: 'support@financeflow.com' },
          { Icon: Phone, val: '+1 (800) 123-4567' },
        ].map(({ Icon, val }) => (
          <div key={val} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fff', fontWeight: 600, fontSize: '0.9rem' }}>
            <Icon size={18} style={{ opacity: 0.85 }} />{val}
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default HelpPage;
