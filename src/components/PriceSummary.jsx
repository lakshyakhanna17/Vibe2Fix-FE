import React from 'react';
import { Tag, Check, ArrowRight } from 'lucide-react';

export const PriceSummary = ({
  subtotal = 0,
  discount = 0,
  shippingCharge = 50,
  totalAmount = 0,
  coupon = null,
  onApplyCoupon,
  onRemoveCoupon,
  couponError,
  couponCodeInput,
  setCouponCodeInput,
  showCouponInput = true,
}) => {
  return (
    <div className="bg-bg-card  rounded-2xl p-6 space-y-5">
      <h3 className="font-bold text-base text-white uppercase tracking-wider pb-3 ">
        Order Summary
      </h3>

      {/* Coupon Application Box */}
      {showCouponInput && (
        <div className="space-y-2">
          {coupon ? (
            <div className="flex items-center justify-between p-3 rounded-xl bg-status-success/15 text-xs text-status-success">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-status-success" />
                <div>
                  <span className="font-bold text-status-success uppercase">{coupon.code}</span>
                  <span className="text-text-muted ml-2">applied</span>
                </div>
              </div>
              <button
                type="button"
                onClick={onRemoveCoupon}
                className="text-text-muted hover:text-status-danger text-xs font-semibold underline transition"
              >
                Remove
              </button>
            </div>
          ) : (
            <div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCodeInput}
                  onChange={(e) => setCouponCodeInput(e.target.value.toUpperCase())}
                  placeholder="Enter coupon (e.g. SAVE20)"
                  className="flex-1 px-3 py-2 bg-bg-elevated rounded-xl text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:bg-[#28282D] uppercase tracking-wider font-mono shadow-inner"
                />
                <button
                  type="button"
                  onClick={onApplyCoupon}
                  className="btn-3d px-4 py-2 text-xs rounded-xl"
                >
                  Apply
                </button>
              </div>
              {couponError && (
                <p className="text-[11px] text-status-danger mt-1.5 pl-1">{couponError}</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Numerical breakdown */}
      <div className="space-y-2.5 text-xs">
        <div className="flex justify-between text-text-secondary">
          <span>Items Subtotal</span>
          <span className="text-white font-medium">₹{Number(subtotal).toLocaleString('en-IN')}</span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-status-success font-medium">
            <span>Coupon Discount</span>
            <span>- ₹{Number(discount).toLocaleString('en-IN')}</span>
          </div>
        )}

        <div className="flex justify-between text-text-secondary">
          <div className="flex items-center gap-1.5">
            <span>Delivery Shipping Fee</span>
            {subtotal >= 500 && (
              <span className="text-[10px] text-status-success bg-status-success/10 px-1.5 py-0.5 rounded font-semibold">
                Free Over ₹500
              </span>
            )}
          </div>
          <span className="text-white font-medium">
            {shippingCharge === 0 ? (
              <span className="text-status-success font-semibold uppercase">Free</span>
            ) : (
              `₹${shippingCharge}`
            )}
          </span>
        </div>

        <div className="pt-3  flex justify-between items-baseline text-sm">
          <span className="font-bold text-white uppercase tracking-wider">Total Amount</span>
          <span className="text-xl font-black text-white tracking-tight">
            ₹{Number(totalAmount).toLocaleString('en-IN')}
          </span>
        </div>

        <p className="text-[10px] text-text-muted pt-1">
          * Cash on Delivery (COD) payment collected upon doorstep arrival.
        </p>
      </div>
    </div>
  );
};
