import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight, Truck } from 'lucide-react';

export const OrderSuccessPage = () => {
  const { orderNumber } = useParams();

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg bg-bg-card  rounded-3xl p-8 sm:p-10 shadow-2xl text-center space-y-6">
        
        <div className="w-16 h-16 rounded-full bg-status-success/20 text-status-success border border-status-success/40 flex items-center justify-center mx-auto">
          <CheckCircle className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
            Order Confirmed!
          </h1>
          <p className="text-xs text-text-muted max-w-sm mx-auto">
            Thank you for ordering with Vibe2Fix. Your hardware package has entered our fulfillment pipeline.
          </p>
        </div>

        {/* Order Number Box */}
        <div className="p-4 bg-bg-elevated  rounded-2xl">
          <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider block">
            Your Order Tracking ID
          </span>
          <span className="text-lg font-mono font-bold text-accent tracking-widest mt-0.5 block select-all">
            {orderNumber}
          </span>
        </div>

        <div className="p-4 rounded-xl bg-accent/5 border border-accent/20 text-xs text-text-secondary text-left flex items-start gap-3">
          <Truck className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-white mb-0.5">Cash on Delivery Reminder</p>
            <p className="text-[11px] text-text-muted">
              Please keep the exact cash amount ready at the time of delivery. Our courier partner will update the status to Paid upon doorstep collection.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link
            to={`/orders/${orderNumber}`}
            className="flex-1 py-3 px-4 bg-accent hover:bg-accent-hover text-black font-bold text-xs uppercase tracking-wider rounded-xl transition shadow-[0_4px_0_0_#000000] flex items-center justify-center gap-1.5"
          >
            <Package className="w-4 h-4" />
            <span>Track Order</span>
          </Link>

          <Link
            to="/products"
            className="flex-1 py-3 px-4 bg-bg-elevated hover:bg-bg-border text-white font-semibold text-xs rounded-xl  transition flex items-center justify-center gap-1.5"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
