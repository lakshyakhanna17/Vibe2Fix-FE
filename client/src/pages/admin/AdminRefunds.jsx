import React, { useState, useEffect } from 'react';
import { RotateCcw, Check, X, AlertCircle } from 'lucide-react';
import { adminApi } from '../../api/admin.api';
import { AdminLayout } from './AdminLayout';
import { StatusBadge } from '../../components/StatusBadge';

export const AdminRefunds = () => {
  const [refunds, setRefunds] = useState([]);
  const [loading, setLoading] = useState(true);

  // Decision Modal
  const [activeRefund, setActiveRefund] = useState(null);
  const [decision, setDecision] = useState('Approved'); // Approved | Rejected | Refunded
  const [adminNote, setAdminNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchRefunds = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getRefunds();
      setRefunds(res.data.refunds || res.data || []);
    } catch (err) {
      console.error('Failed to load admin refunds', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRefunds();
  }, []);

  const handleOpenDecision = (ref, initialDecision) => {
    setActiveRefund(ref);
    setDecision(initialDecision);
    setAdminNote('');
  };

  const handleConfirmDecision = async (e) => {
    e.preventDefault();
    if (decision === 'Rejected' && !adminNote.trim()) {
      alert('Rejection requires providing an administrative note.');
      return;
    }

    try {
      setSubmitting(true);
      await adminApi.updateRefundStatus(activeRefund.refundId || activeRefund.id, {
        status: decision,
        adminNote: adminNote.trim(),
      });
      setActiveRefund(null);
      await fetchRefunds();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update refund status');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminLayout
      title="Returns & Refunds Adjudication Queue"
      subtitle="Review 7-day post-delivery customer claims, inspect reasons, approve, reject or finalize COD returns"
    >
      <div className="space-y-6">
        <div className="bg-bg-card  rounded-3xl overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.45)]">
          <table className="w-full text-xs text-left">
            <thead className="text-[11px] uppercase tracking-wider text-text-muted bg-bg-elevated/50 ">
              <tr>
                <th className="py-3.5 px-4">Order / ID</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Reason</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4 text-right">Decision</th>
              </tr>
            </thead>
            <tbody className="">
              {refunds.map((r) => {
                const id = r.refundId || r.id;
                const isRequested = r.status === 'Requested';
                const isApproved = r.status === 'Approved';

                return (
                  <tr key={id} className="hover:bg-bg-elevated/30">
                    <td className="py-3.5 px-4 font-mono font-bold text-accent">
                      {r.order?.orderNumber || r.orderId}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-white">{r.user?.name}</div>
                      <div className="text-[10px] text-text-muted">{r.user?.email}</div>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-white">
                      ₹{Number(r.amount).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 max-w-xs text-text-secondary">
                      <p className="line-clamp-2">{r.reason}</p>
                      {r.adminNote && (
                        <p className="text-amber-400 text-[10px] mt-1 font-mono">
                          Note: {r.adminNote}
                        </p>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={r.status} />
                    </td>
                    <td className="py-3.5 px-4 text-text-muted">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {isRequested && (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenDecision(r, 'Approved')}
                            className="px-2.5 py-1 bg-teal-500/10 hover:bg-teal-500/20 text-teal-400 border border-teal-500/30 rounded-lg transition"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleOpenDecision(r, 'Rejected')}
                            className="px-2.5 py-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-lg transition"
                          >
                            Reject
                          </button>
                        </div>
                      )}

                      {isApproved && (
                        <button
                          onClick={() => handleOpenDecision(r, 'Refunded')}
                          className="px-3 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg transition"
                        >
                          Mark Refunded
                        </button>
                      )}

                      {!isRequested && !isApproved && (
                        <span className="text-text-muted text-[11px]">Completed</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Decision Modal */}
      {activeRefund && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-bg-card  w-full max-w-md rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white uppercase tracking-wider">
              Refund Decision: {decision}
            </h3>

            <div className="p-3 bg-bg-elevated rounded-xl  text-xs space-y-1">
              <p>
                <span className="text-text-muted">Customer Reason:</span>{' '}
                <span className="text-white">{activeRefund.reason}</span>
              </p>
              <p>
                <span className="text-text-muted">Refund Amount:</span>{' '}
                <span className="text-accent font-bold">
                  ₹{Number(activeRefund.amount).toLocaleString('en-IN')}
                </span>
              </p>
            </div>

            <form onSubmit={handleConfirmDecision} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-text-secondary uppercase mb-1">
                  Administrative Note {decision === 'Rejected' ? '*' : '(Optional)'}
                </label>
                <textarea
                  rows={3}
                  required={decision === 'Rejected'}
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  placeholder={
                    decision === 'Rejected'
                      ? 'State clear reason for rejecting the return claim...'
                      : 'Internal or customer note...'
                  }
                  className="w-full p-2.5 bg-bg-elevated  rounded-xl text-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveRefund(null)}
                  className="px-4 py-2 text-text-secondary hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-accent text-black font-semibold rounded-xl hover:bg-accent-hover transition"
                >
                  {submitting ? 'Saving...' : `Confirm ${decision}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
