import React from 'react';
import { Check, XCircle } from 'lucide-react';

const ORDER_STEPS = ['Placed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'];

export const StatusTimeline = ({ history = [], currentStatus = 'Placed' }) => {
  if (currentStatus === 'Cancelled') {
    return (
      <div className="bg-red-500/15 rounded-2xl p-4 flex items-center gap-3 text-status-danger">
        <XCircle className="w-5 h-5 flex-shrink-0" />
        <div>
          <p className="font-bold text-xs uppercase tracking-wide">Order Cancelled</p>
          <p className="text-[11px] text-text-muted">This order was cancelled before dispatch. Inventory and coupons have been restored.</p>
        </div>
      </div>
    );
  }

  const currentIndex = ORDER_STEPS.indexOf(currentStatus);

  return (
    <div className="py-4">
      <div className="relative flex items-center justify-between">
        {/* Background track line */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-bg-elevated -translate-y-1/2 z-0" />
        {/* Active track line */}
        <div
          className="absolute top-1/2 left-0 h-0.5 bg-white -translate-y-1/2 z-0 transition-all duration-300"
          style={{
            width: `${Math.max(0, (currentIndex / (ORDER_STEPS.length - 1)) * 100)}%`,
          }}
        />

        {ORDER_STEPS.map((step, idx) => {
          const isCompleted = idx <= currentIndex;
          const isCurrent = idx === currentIndex;

          // Find timestamp in history if present
          const historyEntry = history.find((h) => h.status === step);

          return (
            <div key={step} className="relative z-10 flex flex-col items-center group">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all select-none ${
                  isCompleted
                    ? 'bg-white text-black shadow-[0_2px_0_0_#0A0A0C]'
                    : 'bg-bg-card  text-text-muted'
                } ${isCurrent ? 'scale-110 ring-2 ring-white/50' : ''}`}
              >
                {isCompleted ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : idx + 1}
              </div>

              <div className="mt-2 text-center">
                <p
                  className={`text-[11px] font-bold ${
                    isCurrent ? 'text-white' : isCompleted ? 'text-text-primary' : 'text-text-muted'
                  }`}
                >
                  {step}
                </p>
                {historyEntry?.changedAt && (
                  <p className="text-[9px] text-text-muted mt-0.5">
                    {new Date(historyEntry.changedAt).toLocaleDateString([], {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
