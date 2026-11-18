import React, { useState, useEffect } from 'react';
import { Users, Search, UserX, UserCheck, AlertTriangle } from 'lucide-react';
import { adminApi } from '../../api/admin.api';
import { AdminLayout } from './AdminLayout';
import { Pagination } from '../../components/Pagination';

export const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Disable account modal
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [disableReason, setDisableReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getCustomers({ page, search, limit: 10 });
      setCustomers(res.data.customers || res.data || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error('Failed to load customers', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [page, search]);

  const handleToggleStatus = async (customer) => {
    const id = customer.userId || customer.id;
    const isCurrentlyActive = customer.isActive !== false;

    if (isCurrentlyActive) {
      // Need to ask for reason to disable
      setSelectedCustomer(customer);
      setDisableReason('');
    } else {
      // Re-enable
      try {
        await adminApi.updateCustomerStatus(id, { isActive: true, disabledReason: null });
        await fetchCustomers();
      } catch (err) {
        alert('Failed to re-enable account');
      }
    }
  };

  const handleConfirmDisable = async (e) => {
    e.preventDefault();
    if (!disableReason.trim()) {
      alert('A reason is required to disable customer accounts.');
      return;
    }

    try {
      setSubmitting(true);
      const id = selectedCustomer.userId || selectedCustomer.id;
      // Doc Section 6.8 & 8: 403 Account disabled with reason
      await adminApi.updateCustomerStatus(id, {
        isActive: false,
        disabledReason: disableReason.trim(),
      });
      setSelectedCustomer(null);
      await fetchCustomers();
    } catch (err) {
      alert('Failed to disable account');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminLayout
      title="Customer Relationship Management (CRM)"
      subtitle="View customer order totals, audit malicious activity, disable or reinstate accounts with reasons"
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-3 text-text-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search customers by name, email, phone..."
              className="w-full pl-9 pr-3 py-2 bg-bg-card  rounded-xl text-xs text-white"
            />
          </div>
        </div>

        <div className="bg-bg-card  rounded-3xl overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.45)]">
          <table className="w-full text-xs text-left">
            <thead className="text-[11px] uppercase tracking-wider text-text-muted bg-bg-elevated/50 ">
              <tr>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Contact Phone</th>
                <th className="py-3.5 px-4">Total Orders</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Disabled Reason</th>
                <th className="py-3.5 px-4 text-right">Account Control</th>
              </tr>
            </thead>
            <tbody className="">
              {customers.map((c) => {
                const id = c.userId || c.id;
                const isActive = c.isActive !== false;
                const orderCount = c._count?.orders || c.ordersCount || 0;

                return (
                  <tr key={id} className="hover:bg-bg-elevated/30">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-white">{c.name}</div>
                      <div className="text-[10px] text-text-muted">{c.email}</div>
                    </td>
                    <td className="py-3.5 px-4 text-text-secondary">{c.phone || '—'}</td>
                    <td className="py-3.5 px-4 font-bold text-white">
                      {orderCount} orders
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          isActive
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}
                      >
                        {isActive ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-text-muted max-w-xs truncate">
                      {c.disabledReason || '—'}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleToggleStatus(c)}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold border transition ${
                          isActive
                            ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border-rose-500/30'
                            : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                        }`}
                      >
                        {isActive ? 'Disable Account' : 'Re-enable Account'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="p-4 ">
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        </div>
      </div>

      {/* Disable Account Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-bg-card  w-full max-w-md rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-status-danger">
              <UserX className="w-6 h-6" />
              <h3 className="text-base font-bold text-white uppercase tracking-wider">
                Disable Customer Account
              </h3>
            </div>

            <p className="text-xs text-text-muted">
              Customer: <span className="text-white font-semibold">{selectedCustomer.name}</span> ({selectedCustomer.email}).
              Disabled users are instantly blocked on their next API request (HTTP 403).
            </p>

            <form onSubmit={handleConfirmDisable} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-text-secondary uppercase mb-1">
                  Reason for Account Disabling *
                </label>
                <textarea
                  rows={3}
                  required
                  value={disableReason}
                  onChange={(e) => setDisableReason(e.target.value)}
                  placeholder="Suspected COD refusal fraud, abusive review spam, repeated invalid returns..."
                  className="w-full p-2.5 bg-bg-elevated  rounded-xl text-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedCustomer(null)}
                  className="px-4 py-2 text-text-secondary hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-status-danger text-white font-semibold rounded-xl hover:bg-red-600 transition"
                >
                  {submitting ? 'Disabling...' : 'Confirm Disable'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
