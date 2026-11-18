import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, AlertTriangle, ArrowRight, ShoppingBag, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { QuantitySelector } from '../components/QuantitySelector';
import { PriceSummary } from '../components/PriceSummary';

export const CartPage = () => {
  const { isAuthenticated } = useAuth();
  const {
    items,
    itemCount,
    subtotal,
    discount,
    shippingCharge,
    totalAmount,
    hasOutOfStockItems,
    coupon,
    couponError,
    updateCartQuantity,
    removeFromCart,
    applyCoupon,
    removeCoupon,
    loading,
  } = useCart();

  const navigate = useNavigate();
  const [couponInput, setCouponInput] = useState('');

  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <ShoppingBag className="w-12 h-12 text-text-muted mx-auto" />
        <h2 className="text-xl font-bold text-white uppercase tracking-wider">Please Sign In</h2>
        <p className="text-xs text-text-muted max-w-sm mx-auto">
          Cart management and order placement requires user authentication.
        </p>
        <Link
          to="/login"
          className="inline-block px-6 py-2.5 bg-accent text-black font-semibold text-xs rounded-xl"
        >
          Sign In
        </Link>
      </div>
    );
  }

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    try {
      await applyCoupon(couponInput.trim());
      setCouponInput('');
    } catch (err) {
      // Error handled by context
    }
  };

  if (items.length === 0 && !loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-bg-card  flex items-center justify-center mx-auto text-text-muted">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-white uppercase tracking-wider">Your Shopping Cart is Empty</h2>
        <p className="text-xs text-text-muted max-w-sm mx-auto">
          Explore our product catalog to discover hardware, smart devices, and electronics.
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-black font-bold text-xs uppercase tracking-wider rounded-xl shadow-[0_4px_0_0_#000000]"
        >
          <span>Browse Products</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-2xl font-black text-white uppercase tracking-wider">
          Shopping Cart ({itemCount} items)
        </h1>
        <p className="text-xs text-text-muted mt-1">
          Review quantities, applied discounts, and doorstep Cash on Delivery terms
        </p>
      </div>

      {/* Stock warning notification according to Section 6.1 */}
      {hasOutOfStockItems && (
        <div className="p-4 rounded-2xl bg-status-danger/10 border border-status-danger/40 flex items-center gap-3 text-status-danger text-xs">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <div>
            <p className="font-bold">Some items in your cart are currently out of stock.</p>
            <p className="text-text-secondary">Please remove or reduce unavailable quantities before proceeding to checkout.</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Cart Item Rows */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => {
            const product = item.product || {};
            const productId = item.productId || product.productId || product.id;
            const price = Number(product.price || item.price || 0);
            const lineTotal = price * item.quantity;
            const isAvailable = item.isAvailable !== false && product.stock >= item.quantity;

            const img =
              product.images?.find((i) => i.isPrimary || i.is_primary)?.imageUrl ||
              product.images?.[0]?.imageUrl ||
              product.productImage ||
              'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=400&q=80';

            return (
              <div
                key={item.cartItemId || productId}
                className={`p-4 bg-bg-card border rounded-2xl transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                  !isAvailable ? 'border-status-danger/50 bg-status-danger/5' : ''
                }`}
              >
                <div className="flex items-center gap-4">
                  <img
                    src={img}
                    alt={product.name}
                    className="w-20 h-20 rounded-xl object-cover bg-bg-elevated flex-shrink-0 "
                  />
                  <div>
                    <Link
                      to={`/products/${productId}`}
                      className="font-semibold text-sm text-white hover:text-accent transition uppercase tracking-wide line-clamp-1"
                    >
                      {product.name}
                    </Link>
                    <p className="text-xs text-text-muted mt-0.5">
                      Unit Price: ₹{price.toLocaleString('en-IN')}
                    </p>

                    {!isAvailable && (
                      <span className="inline-block mt-1 px-2 py-0.5 bg-status-danger/20 text-status-danger text-[10px] font-bold rounded">
                        Out of stock (Available: {product.stock || 0})
                      </span>
                    )}
                  </div>
                </div>

                {/* Quantity and Actions */}
                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-0 ">
                  <QuantitySelector
                    value={item.quantity}
                    min={1}
                    max={Math.min(product.stock || 10, 10)}
                    onChange={(newQty) => updateCartQuantity(productId, newQty)}
                  />

                  <div className="text-right min-w-[80px]">
                    <span className="text-xs text-text-muted block sm:hidden">Line Total</span>
                    <span className="text-sm font-bold text-white">
                      ₹{lineTotal.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeFromCart(productId)}
                    className="p-2 text-text-muted hover:text-status-danger transition"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Price Breakdown Sidebar & Proceed to Checkout */}
        <div className="lg:col-span-1 space-y-4">
          <PriceSummary
            subtotal={subtotal}
            discount={discount}
            shippingCharge={shippingCharge}
            totalAmount={totalAmount}
            coupon={coupon}
            couponError={couponError}
            couponCodeInput={couponInput}
            setCouponCodeInput={setCouponInput}
            onApplyCoupon={handleApplyCoupon}
            onRemoveCoupon={removeCoupon}
          />

          <button
            type="button"
            disabled={hasOutOfStockItems || items.length === 0}
            onClick={() => navigate('/checkout')}
            className="w-full py-4 px-6 bg-accent hover:bg-accent-hover text-black font-black text-xs uppercase tracking-wider rounded-2xl transition shadow-[0_4px_0_0_#000000] flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
