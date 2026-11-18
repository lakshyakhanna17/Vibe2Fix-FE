import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, ArrowRight, Clock, ChevronRight } from 'lucide-react';
import { orderApi } from '../api/order.api';
import { StatusBadge } from '../components/StatusBadge';
import { Pagination } from '../components/Pagination';

export const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async (pageNum) => {
    try {
      setLoading(true);
      const res = await orderApi.getOrders({ page: pageNum, limit: 10 });
      setOrders(res.data.orders || res.data || []);
      setTotalPages(res.data.totalPages || res.data.pages || 1);
    } catch (err) {
      console.error('Failed to load orders', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(page);
  }, [page]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-2xl font-black text-white uppercase tracking-wider">
          Order History ({orders.length})
        </h1>
        <p className="text-xs text-text-muted mt-1">
          Track packages, view delivery receipts, cancel pre-dispatch orders, or request refunds
        </p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-28 bg-bg-card  rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => {
            const orderNum = order.orderNumber || order.order_number;
            const items = order.items || order.orderItems || [];
            const total = Number(order.totalAmount || order.total_amount || 0);

            return (
              <div
                key={order.orderId || order.id || orderNum}
                className="bg-bg-card  rounded-2xl p-6 hover: transition flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-mono font-bold text-sm text-accent">
                      {orderNum}
                    </span>
                    <StatusBadge status={order.orderStatus || order.order_status} />
                    <span className="text-xs text-text-muted">
                      Placed on {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Order items summary preview */}
                  <div className="flex flex-wrap gap-2 text-xs text-text-secondary pt-1">
                    {items.map((item, idx) => (
                      <span key={idx} className="bg-bg-elevated px-2.5 py-1 rounded-lg ">
                        {item.productName || item.product?.name} &times; {item.quantity}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto pt-4 md:pt-0 border-t md:border-0 ">
                  <div className="text-left md:text-right">
                    <span className="text-[11px] text-text-muted block">Total (COD)</span>
                    <span className="text-base font-bold text-white">
                      ₹{total.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <Link
                    to={`/orders/${orderNum}`}
                    className="px-4 py-2 bg-bg-elevated hover:bg-bg-border text-white text-xs font-semibold rounded-xl  hover:border-accent flex items-center gap-1.5 transition"
                  >
                    <span>Details & Timeline</span>
                    <ChevronRight className="w-4 h-4 text-accent" />
                  </Link>
                </div>
              </div>
            );
          })}

          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      ) : (
        <div className="text-center py-20 bg-bg-card  rounded-2xl space-y-4">
          <Package className="w-12 h-12 text-text-muted mx-auto stroke-[1.5]" />
          <h2 className="text-lg font-bold text-white uppercase tracking-wider">No Orders Found</h2>
          <p className="text-xs text-text-muted max-w-sm mx-auto">
            You haven't placed any hardware or electronic orders yet.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-black font-bold text-xs uppercase tracking-wider rounded-xl shadow-[0_4px_0_0_#000000]"
          >
            <span>Start Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
};
