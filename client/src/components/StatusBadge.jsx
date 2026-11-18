import React from 'react';

export const StatusBadge = ({ status }) => {
  const getBadgeStyle = (statusVal) => {
    switch (statusVal) {
      case 'Placed':
        return 'bg-bg-elevated text-text-primary';
      case 'Packed':
        return 'bg-amber-500/15 text-amber-300';
      case 'Shipped':
        return 'bg-neutral-800 text-neutral-200';
      case 'Out for Delivery':
        return 'bg-neutral-700 text-white font-bold';
      case 'Delivered':
        return 'bg-emerald-500/15 text-emerald-400 font-bold';
      case 'Cancelled':
        return 'bg-red-500/15 text-red-400';
      case 'Requested':
        return 'bg-amber-500/15 text-amber-300';
      case 'Approved':
        return 'bg-emerald-500/15 text-emerald-400 font-bold';
      case 'Refunded':
        return 'bg-emerald-500/15 text-emerald-400 font-bold';
      case 'Rejected':
        return 'bg-red-500/15 text-red-400';
      default:
        return 'bg-bg-elevated text-text-secondary';
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border shadow-[0_1px_0_0_#0A0A0C] ${getBadgeStyle(
        status
      )}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5"></span>
      {status}
    </span>
  );
};
