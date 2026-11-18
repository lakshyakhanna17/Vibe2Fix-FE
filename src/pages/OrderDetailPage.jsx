import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Package, 
  MapPin, 
  Truck, 
  ArrowLeft, 
  AlertCircle, 
  RotateCcw, 
  XCircle,
  MessageSquare,
  Receipt
} from 'lucide-react';
import { orderApi } from '../api/order.api';
import { StatusTimeline } from '../components/StatusTimeline';
import { StatusBadge } from '../components/StatusBadge';
import { ConfirmModal } from '../components/ConfirmModal';
import { ReviewModal } from '../components/ReviewModal';

export const OrderDetailPage = () => {
  const { orderNumber } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cancellation state
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  // Refund state
  const [refundModalOpen, setRefundModalOpen] = useState(false);
  const [refundReason, setRefundReason] = useState('');
  const [refunding, setRefunding] = useState(false);

  // Review modal state
  const [reviewModalProduct, setReviewModalProduct] = useState(null);

  const fetchOrderDetail = async () => {
    try {
      setLoading(true);
      const res = await orderApi.getOrderByNumber(orderNumber);
      setOrder(res.data.order || res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch order details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetail();
  }, [orderNumber]);

  // Business logic checks strictly based on Section 6.4 & 6.5
  const orderStatus = order?.orderStatus || order?.order_status;
  const canCancel = orderStatus === 'Placed' || orderStatus === 'Packed';

  // 7-day refund window check: orderStatus = Delivered AND now - deliveredAt <= 7 days
  const deliveredAtDate = order?.deliveredAt || order?.delivered_at ? new Date(order.deliveredAt || order.delivered_at) : null;
  const isDelivered = orderStatus === 'Delivered';
  const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
  const within7Days = deliveredAtDate ? (Date.now() - deliveredAtDate.getTime()) <= sevenDaysMs : true;
  const canRequestRefund = isDelivered && within7Days && !order?.refund;

  const handleCancelOrder = async () => {
    try {
      setCancelling(true);
      await orderApi.cancelOrder(orderNumber);
      await fetchOrderDetail();
      setCancelModalOpen(false);
    } catch (err) {
      alert(err.response?.data?.message || 'Order can no longer be cancelled');
    } finally {
      setCancelling(false);
    }
  };

  const handleRequestRefund = async (e) => {
    e.preventDefault();
    if (!refundReason.trim()) return;

    try {
      setRefunding(true);
      await orderApi.requestRefund(orderNumber, { reason: refundReason.trim() });
      await fetchOrderDetail();
      setRefundModalOpen(false);
      setRefundReason('');
    } catch (err) {
      alert(err.response?.data?.message || 'Refund request failed');
    } finally {
      setRefunding(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 flex justify-center items-center">
        <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-status-danger mx-auto" />
        <h2 className="text-xl font-bold text-white uppercase">{error || 'Order Not Found'}</h2>
        <Link to="/orders" className="px-4 py-2 bg-accent text-black font-semibold text-xs rounded-xl inline-block">
          Return to Order History
        </Link>
      </div>
    );
  }

  const items = order.items || order.orderItems || [];
  const history = order.orderStatusHistory || order.statusHistory || [];
  const subtotal = Number(order.subtotal || 0);
  const discount = Number(order.discount || 0);
  const shippingCharge = Number(order.shippingCharge || order.shipping_charge || 0);
  const totalAmount = Number(order.totalAmount || order.total_amount || 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <Link
        to="/orders"
        className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-white transition"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to all orders
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 ">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-white font-mono tracking-wider">
              {orderNumber}
            </h1>
            <StatusBadge status={orderStatus} />
          </div>
          <p className="text-xs text-text-muted mt-1">
            Placed on {new Date(order.createdAt).toLocaleString()} &bull; Payment:{' '}
            <span className="text-accent font-semibold">{order.paymentStatus || 'Pending'} (COD)</span>
          </p>
        </div>

        {/* Action Buttons: Cancel / Return */}
        <div className="flex items-center gap-3">
          {canCancel && (
            <button
              onClick={() => setCancelModalOpen(true)}
              className="px-4 py-2 bg-status-danger/10 hover:bg-status-danger/20 text-status-danger border border-status-danger/30 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <XCircle className="w-4 h-4" />
              <span>Cancel Order</span>
            </button>
          )}

          {canRequestRefund && (
            <button
              onClick={() => setRefundModalOpen(true)}
              className="px-4 py-2 bg-accent/10 hover:bg-accent/20 text-accent border border-accent/30 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Request 7-Day Refund</span>
            </button>
          )}
        </div>
      </div>

      {/* Tracking Timeline Stepper */}
      <div className="bg-bg-card  rounded-2xl p-6 space-y-4">
        <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider">
          Delivery Status Stepper
        </h3>
        <StatusTimeline history={history} currentStatus={orderStatus} />

        {order.courier && order.trackingId && (
          <div className="p-3 bg-bg-elevated rounded-xl  flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-accent" />
              <span className="text-white font-semibold">Courier: {order.courier}</span>
            </div>
            <span className="font-mono text-accent">Tracking ID: {order.trackingId}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Purchased Items List */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Order Items ({items.length})
          </h3>

          <div className="space-y-3">
            {items.map((item) => {
              const itemPrice = Number(item.price || 0);
              const img =
                item.productImage ||
                item.product?.productImage ||
                'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=300&q=80';

              return (
                <div
                  key={item.orderItemId || item.id}
                  className="bg-bg-card  rounded-2xl p-4 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={img}
                      alt={item.productName}
                      className="w-16 h-16 rounded-xl object-cover bg-bg-elevated "
                    />
                    <div>
                      <h4 className="font-semibold text-xs sm:text-sm text-white uppercase tracking-wide">
                        {item.productName}
                      </h4>
                      <p className="text-xs text-text-muted mt-0.5">
                        Quantity: {item.quantity} &times; ₹{itemPrice.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-sm font-bold text-white">
                      ₹{(itemPrice * item.quantity).toLocaleString('en-IN')}
                    </span>

                    {/* Review Button for Delivered orders */}
                    {isDelivered && (
                      <button
                        onClick={() =>
                          setReviewModalProduct({
                            id: item.productId,
                            name: item.productName,
                          })
                        }
                        className="p-2 bg-bg-elevated hover:bg-bg-border  rounded-xl text-accent hover:text-white transition"
                        title="Review product"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Address and Financial Snapshot */}
        <div className="space-y-6">
          {/* Address Snapshot */}
          <div className="bg-bg-card  rounded-2xl p-6 space-y-3">
            <div className="flex items-center gap-2 pb-2 ">
              <MapPin className="w-4 h-4 text-accent" />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Delivery Address Snapshot
              </h4>
            </div>
            <p className="font-semibold text-xs text-white">{order.addressName}</p>
            <p className="text-xs text-text-secondary leading-relaxed">
              {order.addressLine1}, {order.addressLine2 && `${order.addressLine2}, `}
              {order.addressCity}, {order.addressState} - {order.addressPincode}
            </p>
            <p className="text-xs text-text-muted">Contact: {order.addressPhone}</p>
          </div>

          {/* Money Snapshot */}
          <div className="bg-bg-card  rounded-2xl p-6 space-y-3">
            <div className="flex items-center gap-2 pb-2 ">
              <Receipt className="w-4 h-4 text-accent" />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Price Breakdown (COD)
              </h4>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-text-secondary">
                <span>Subtotal</span>
                <span className="text-white">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-status-success">
                  <span>Coupon Discount</span>
                  <span>- ₹{discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between text-text-secondary">
                <span>Shipping Fee</span>
                <span className="text-white">₹{shippingCharge}</span>
              </div>
              <div className="pt-2  flex justify-between text-sm font-bold text-white">
                <span>Total Amount</span>
                <span className="text-accent text-base">₹{totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirm Order Cancellation Modal */}
      <ConfirmModal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        onConfirm={handleCancelOrder}
        title="Cancel This Order?"
        message="Are you sure you want to cancel this order? Hardware inventory and any applied discount coupon will be immediately returned."
        confirmText="Cancel Order"
        danger
        loading={cancelling}
      />

      {/* Request Refund Modal */}
      {refundModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-bg-card  w-full max-w-md rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white uppercase tracking-wider">
              Request 7-Day Refund
            </h3>
            <p className="text-xs text-text-muted">
              Whole-order refund amount: <span className="text-white font-bold">₹{totalAmount.toLocaleString('en-IN')}</span>
            </p>

            <form onSubmit={handleRequestRefund} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-text-secondary uppercase mb-1">
                  Reason for Return *
                </label>
                <textarea
                  rows={3}
                  required
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  placeholder="Defective unit, damaged in transit, or wrong part received..."
                  className="w-full p-2.5 bg-bg-elevated  rounded-xl text-xs text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRefundModalOpen(false)}
                  className="px-4 py-2 text-xs text-text-secondary hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={refunding}
                  className="px-4 py-2 bg-accent text-black font-semibold text-xs rounded-xl"
                >
                  {refunding ? 'Submitting...' : 'Submit Refund Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Verified Review Modal */}
      {reviewModalProduct && (
        <ReviewModal
          isOpen={!!reviewModalProduct}
          onClose={() => setReviewModalProduct(null)}
          productId={reviewModalProduct.id}
          productName={reviewModalProduct.name}
          onReviewSubmitted={fetchOrderDetail}
        />
      )}
    </div>
  );
};
