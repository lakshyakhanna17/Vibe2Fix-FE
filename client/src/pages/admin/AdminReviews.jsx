import React, { useState, useEffect } from 'react';
import { Flag, ShieldCheck, Trash2, AlertTriangle } from 'lucide-react';
import { adminApi } from '../../api/admin.api';
import { AdminLayout } from './AdminLayout';
import { StarRating } from '../../components/StarRating';
import { ConfirmModal } from '../../components/ConfirmModal';

export const AdminReviews = () => {
  const [reportedReviews, setReportedReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const [confirmAction, setConfirmAction] = useState(null); // { type: 'dismiss' | 'remove', id }

  const fetchReported = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getReportedReviews();
      setReportedReviews(res.data.reviews || res.data.reports || res.data || []);
    } catch (err) {
      console.error('Failed to load reported reviews', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReported();
  }, []);

  const handleExecuteAction = async () => {
    if (!confirmAction) return;

    try {
      if (confirmAction.type === 'dismiss') {
        // Doc rule 6.7: report -> Dismissed, review -> Active
        await adminApi.dismissReviewReport(confirmAction.id);
      } else {
        // Doc rule 6.7: report -> Resolved, review -> Removed (hidden from store)
        await adminApi.removeReview(confirmAction.id);
      }
      setConfirmAction(null);
      await fetchReported();
    } catch (err) {
      alert('Failed to process moderation action');
    }
  };

  return (
    <AdminLayout
      title="Customer Review Moderation Desk"
      subtitle="Examine flagged reviews reported for spam, abuse, or falsification. Dismiss report or remove review."
    >
      <div className="space-y-6">
        {loading ? (
          <div className="py-20 flex justify-center">
            <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : reportedReviews.length > 0 ? (
          <div className="space-y-4">
            {reportedReviews.map((item) => {
              const review = item.review || item;
              const reviewId = review.reviewId || review.id;
              const reports = review.reports || review.reportReviews || [];

              return (
                <div
                  key={reviewId}
                  className="bg-bg-card  rounded-2xl p-6 space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 ">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-status-danger/20 text-status-danger border border-status-danger/30 flex items-center justify-center font-bold text-xs uppercase">
                        !
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white uppercase tracking-wider">
                          Product: {review.product?.name || 'Hardware Unit'}
                        </p>
                        <p className="text-[11px] text-text-muted">
                          Author: {review.user?.name} ({review.user?.email})
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <StarRating rating={review.rating} size={14} />
                      <span className="text-[11px] px-2 py-0.5 rounded font-bold uppercase bg-status-danger/10 text-status-danger border border-status-danger/20">
                        {review.reviewStatus || 'Flagged'}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-white bg-bg-elevated p-3 rounded-xl  leading-relaxed">
                    "{review.comment}"
                  </p>

                  {/* Flag Reports Reasons */}
                  {reports.length > 0 && (
                    <div className="p-3 bg-red-500/5 border border-red-500/20 rounded-xl space-y-1 text-xs">
                      <span className="text-[10px] uppercase font-bold text-status-danger tracking-wider">
                        Report Explanations from Shoppers:
                      </span>
                      {reports.map((rep, idx) => (
                        <p key={idx} className="text-text-secondary text-[11px]">
                          &bull; {rep.reportReason || rep.reason || 'Flagged as abusive or misleading'}
                        </p>
                      ))}
                    </div>
                  )}

                  <div className="pt-2 flex justify-end gap-3">
                    <button
                      onClick={() => setConfirmAction({ type: 'dismiss', id: reviewId })}
                      className="px-4 py-2 bg-bg-elevated hover:bg-bg-border text-white text-xs font-semibold rounded-xl  flex items-center gap-1.5 transition"
                    >
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>Dismiss Report (Keep Active)</span>
                    </button>

                    <button
                      onClick={() => setConfirmAction({ type: 'remove', id: reviewId })}
                      className="px-4 py-2 bg-status-danger/10 hover:bg-status-danger/20 text-status-danger text-xs font-semibold rounded-xl border border-status-danger/30 flex items-center gap-1.5 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Remove Review from Store</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-bg-card  rounded-2xl space-y-2">
            <ShieldCheck className="w-12 h-12 text-emerald-400 mx-auto" />
            <h2 className="text-base font-bold text-white uppercase tracking-wider">
              Moderation Queue Clear
            </h2>
            <p className="text-xs text-text-muted">
              No buyer-flagged reviews currently requiring administrative moderation.
            </p>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={!!confirmAction}
        onClose={() => setConfirmAction(null)}
        onConfirm={handleExecuteAction}
        title={
          confirmAction?.type === 'dismiss'
            ? 'Dismiss Flag Report?'
            : 'Remove Review from Public Store?'
        }
        message={
          confirmAction?.type === 'dismiss'
            ? 'This review will be marked Active and reinstated for shoppers.'
            : 'This review will be marked Removed, hidden from the store, and product average rating recalculated.'
        }
        confirmText={confirmAction?.type === 'dismiss' ? 'Dismiss Report' : 'Remove Review'}
        danger={confirmAction?.type === 'remove'}
      />
    </AdminLayout>
  );
};
