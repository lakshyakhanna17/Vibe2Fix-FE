import React, { useState, useEffect } from 'react';
import { RotateCcw, Clock, AlertCircle } from 'lucide-react';
import { refundApi } from '../api/order.api';
import { StatusBadge } from '../components/StatusBadge';

export const MyRefundsPage = () => {
  const [refunds, setRefunds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRefunds = async () => {
      try {
        setLoading(true);
        const res = await refundApi.getMyRefunds();
        setRefunds(res.data.refunds || res.data || []);
      } catch (err) {
        console.error('Failed to load refunds', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRefunds();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-2xl font-black text-white uppercase tracking-wider flex items-center gap-2">
          <RotateCcw className="w-6 h-6 text-accent" />
          <span>My Returns & Refunds ({refunds.length})</span>
        </h1>
        <p className="text-xs text-text-muted mt-1">
          Track 7-day post-delivery returns, admin decisions, and COD refund progress
        </p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((n) => (
            <div key={n} className="h-28 bg-bg-card  rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : refunds.length > 0 ? (
        <div className="space-y-4">
          {refunds.map((ref) => {
            const amount = Number(ref.amount || 0);
            const history = ref.refundStatusHistory || ref.statusHistory || [];

            return (
              <div
                key={ref.refundId || ref.id}
                className="bg-bg-card  rounded-2xl p-6 space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 ">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-bold text-accent">
                      {ref.order?.orderNumber || `Order #${ref.orderId}`}
                    </span>
                    <StatusBadge status={ref.status} />
                  </div>
                  <span className="text-sm font-bold text-white">
                    Refund Amount: ₹{amount.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="space-y-1 text-xs">
                  <p className="text-text-secondary">
                    <span className="text-text-muted">Return Reason:</span> {ref.reason}
                  </p>
                  {ref.adminNote && (
                    <p className="text-amber-400 bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20">
                      <span className="font-semibold">Admin Note:</span> {ref.adminNote}
                    </p>
                  )}
                  <p className="text-[11px] text-text-muted">
                    Requested on {new Date(ref.createdAt).toLocaleString()}
                  </p>
                </div>

                {/* Refund Status Steps */}
                {history.length > 0 && (
                  <div className="pt-2 ">
                    <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider block mb-2">
                      Refund Status Audit
                    </span>
                    <div className="flex flex-wrap gap-2 text-xs">
                      {history.map((h, i) => (
                        <span key={i} className="px-2.5 py-1 bg-bg-elevated rounded-lg  text-text-secondary">
                          {h.status} &bull; {new Date(h.changedAt).toLocaleDateString()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 bg-bg-card  rounded-2xl space-y-2">
          <RotateCcw className="w-12 h-12 text-text-muted mx-auto stroke-[1.5]" />
          <h2 className="text-lg font-bold text-white uppercase tracking-wider">No Refund Requests</h2>
          <p className="text-xs text-text-muted max-w-sm mx-auto">
            You currently have no return or refund claims active.
          </p>
        </div>
      )}
    </div>
  );
};
