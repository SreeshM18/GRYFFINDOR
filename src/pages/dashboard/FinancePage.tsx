import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  DollarSign,
  TrendingDown,
  Calendar,
  ExternalLink,
  Plus,
  Download,
  AlertCircle,
  ShieldCheck,
  Split,
} from 'lucide-react';
import { soundFx } from '../../components/ui/AudioSynthesizer';
import { workOs } from '../../services/workOsStorage';
import { FinanceItem } from '../../types/workOs';

export const FinancePage: React.FC = () => {
  const [finances, setFinances] = useState<FinanceItem[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [category, setCategory] = useState<FinanceItem['category']>('infrastructure');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState<FinanceItem['currency']>('USD');
  const [billingCycle, setBillingCycle] = useState<FinanceItem['billingCycle']>('monthly');
  const [nextDate, setNextDate] = useState('');
  const [paidBy, setPaidBy] = useState<FinanceItem['paidBy']>('shared');
  const [portalUrl, setPortalUrl] = useState('');

  const loadData = () => {
    setFinances(workOs.getFinances());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !amount) return;

    soundFx.playClick();
    workOs.createFinance({
      name: name.trim(),
      category,
      amount: parseFloat(amount),
      currency,
      billingCycle,
      nextBillingDate: nextDate || undefined,
      paidBy,
      splitRatio: '50/50',
      url: portalUrl || undefined,
    });

    setName('');
    setAmount('');
    setNextDate('');
    setPortalUrl('');
    setShowAddModal(false);
    loadData();
  };

  const handleExportCsv = () => {
    soundFx.playClick();
    const headers = ['Subscription Name', 'Category', 'Amount', 'Currency', 'Billing Cycle', 'Paid By', 'Split Ratio', 'Next Renewal'];
    const rows = finances.map((f) => [
      `"${f.name}"`,
      f.category,
      f.amount,
      f.currency,
      f.billingCycle,
      f.paidBy,
      f.splitRatio,
      f.nextBillingDate || 'N/A',
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Sreesh_Mrithula_Studio_Finances_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Calculations
  const usdItems = finances.filter((f) => f.currency === 'USD' && f.billingCycle === 'monthly');
  const totalUsdMonthly = usdItems.reduce((acc, f) => acc + f.amount, 0);
  const inrItems = finances.filter((f) => f.currency === 'INR' && f.billingCycle === 'yearly');
  const totalInrYearly = inrItems.reduce((acc, f) => acc + f.amount, 0);

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-subtle pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold font-display tracking-tight text-content-primary">
              Studio Finance & Infrastructure Subscriptions
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-burgundy/20 text-burgundy-soft uppercase">
              50 / 50 Transparency
            </span>
          </div>
          <p className="text-xs text-content-secondary mt-1">
            Track domain names, Vercel/Supabase servers, API quotas, and shared software infrastructure.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border-subtle bg-surface-elevated text-content-secondary hover:text-content-primary text-xs font-mono transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-burgundy hover:bg-burgundy-soft text-white text-xs font-medium shadow-sm transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Expense</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl border border-border-subtle bg-surface-card flex items-center justify-between">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-content-muted">Monthly Burn (USD)</div>
            <div className="text-2xl font-bold font-display text-content-primary mt-1">
              ${totalUsdMonthly} <span className="text-xs font-mono text-content-muted">/ month</span>
            </div>
            <div className="text-[10px] font-mono text-emerald-400 mt-1">Split: ${totalUsdMonthly / 2} each</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-burgundy/10 border border-burgundy/20 flex items-center justify-center text-burgundy-soft">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-border-subtle bg-surface-card flex items-center justify-between">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-content-muted">Annual Infrastructure (INR)</div>
            <div className="text-2xl font-bold font-display text-content-primary mt-1">
              ₹{totalInrYearly} <span className="text-xs font-mono text-content-muted">/ year</span>
            </div>
            <div className="text-[10px] font-mono text-content-muted mt-1">Domains & registrar lock</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <CreditCard className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-border-subtle bg-surface-card flex items-center justify-between">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-content-muted">Allocation Split</div>
            <div className="text-2xl font-bold font-display text-content-primary mt-1">50% / 50%</div>
            <div className="text-[10px] font-mono text-content-muted mt-1">Equal co-founder parity</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <Split className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Subscriptions Table */}
      <div className="rounded-2xl border border-border-subtle bg-surface-card overflow-hidden shadow-sm">
        <div className="p-5 border-b border-border-subtle flex items-center justify-between">
          <h2 className="text-sm font-semibold text-content-primary">Active Subscriptions & Infrastructure</h2>
          <span className="text-[10px] font-mono text-content-muted">{finances.length} Active Services</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border-subtle bg-surface-elevated/40 text-[11px] font-mono uppercase text-content-muted">
                <th className="py-3 px-6">Service / Vendor</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Cost</th>
                <th className="py-3 px-4">Cycle</th>
                <th className="py-3 px-4">Paid By</th>
                <th className="py-3 px-4">Next Renewal</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle text-xs">
              {finances.map((item) => (
                <tr key={item.id} className="hover:bg-surface-elevated/30 transition-colors">
                  <td className="py-4 px-6">
                    <div className="font-semibold text-content-primary">{item.name}</div>
                    <div className="text-[10px] font-mono text-content-muted">Shared Studio Infrastructure</div>
                  </td>

                  <td className="py-4 px-4">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded uppercase tracking-wider bg-surface-elevated border border-border-subtle text-content-secondary">
                      {item.category}
                    </span>
                  </td>

                  <td className="py-4 px-4 font-mono font-bold text-content-primary">
                    {item.currency === 'USD' ? `$${item.amount}` : `₹${item.amount}`}
                  </td>

                  <td className="py-4 px-4 font-mono text-[11px] capitalize text-content-muted">
                    {item.billingCycle}
                  </td>

                  <td className="py-4 px-4">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-burgundy/15 text-burgundy-soft capitalize">
                      {item.paidBy}
                    </span>
                  </td>

                  <td className="py-4 px-4 font-mono text-[11px] text-content-secondary">
                    {item.nextBillingDate || 'Auto-renewal'}
                  </td>

                  <td className="py-4 px-4 text-right">
                    {item.url && (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-lg border border-border-subtle bg-surface-elevated text-content-muted hover:text-content-primary inline-flex items-center gap-1 transition-colors"
                        title="Manage Portal"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Subscription Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-border-subtle bg-surface-card p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border-subtle pb-3">
              <h3 className="text-sm font-bold font-display text-content-primary">Add Studio Expense</h3>
              <button onClick={() => setShowAddModal(false)} className="text-content-muted text-xs">✕</button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs text-content-secondary">Service Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Supabase Compute Add-on"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-border-subtle bg-surface-elevated text-content-primary focus:outline-none focus:border-burgundy"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs text-content-secondary">Amount</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="25.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-border-subtle bg-surface-elevated text-content-primary focus:outline-none focus:border-burgundy"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-content-secondary">Currency</label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value as FinanceItem['currency'])}
                    className="w-full text-xs p-2.5 rounded-xl border border-border-subtle bg-surface-elevated text-content-primary"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="INR">INR (₹)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs text-content-secondary">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as FinanceItem['category'])}
                    className="w-full text-xs p-2.5 rounded-xl border border-border-subtle bg-surface-elevated text-content-primary"
                  >
                    <option value="infrastructure">Infrastructure / Cloud</option>
                    <option value="domain">Domain Names</option>
                    <option value="ai_api">AI APIs (LLM/Vision)</option>
                    <option value="software">Design Software</option>
                    <option value="hardware">Hardware</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-content-secondary">Billing Cycle</label>
                  <select
                    value={billingCycle}
                    onChange={(e) => setBillingCycle(e.target.value as FinanceItem['billingCycle'])}
                    className="w-full text-xs p-2.5 rounded-xl border border-border-subtle bg-surface-elevated text-content-primary"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                    <option value="one_time">One-Time</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-content-secondary">Billing Portal URL (Optional)</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={portalUrl}
                  onChange={(e) => setPortalUrl(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-border-subtle bg-surface-elevated text-content-primary focus:outline-none focus:border-burgundy"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border-subtle">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 text-xs font-mono text-content-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-burgundy text-white text-xs font-medium"
                >
                  Save Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

