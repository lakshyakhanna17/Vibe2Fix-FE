import React, { useState, useEffect } from 'react';
import { Search, Filter, Truck, X, AlertCircle } from 'lucide-react';
import { adminApi } from '../../api/admin.api';
import { AdminLayout } from './AdminLayout';
import { StatusBadge } from '../../components/StatusBadge';
import { Pagination } from '../../components/Pagination';

const NEXT_STATUS_MAP = {
  Placed: 'Packed',
  Packed: 'Shipped',
  Shipped: 'Out for Delivery',
  'Out for Delivery': 'Delivered',
};

export const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchOrderNumber, setSearchOrderNumber] = useState('');
  const [loading, setLoading] = useState(true);

  // Status advancement drawer state
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [advancingStatus, setAdvancingStatus] = useState(false);
  const [courier, setCourier] = useState('');
  const [trackingId, setTrackingId] = useState('');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getOrders({
        page,
        limit: 10,
        status: statusFilter,
        search: searchOrderNumber,
      });
      setOrders(res.data.orders || res.data || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error('Failed to load admin orders', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page, statusFilter, searchOrderNumber]);

  const handleOpenDrawer = (order) => {
    setSelectedOrder(order);
    setCourier(order.courier || '');
    setTrackingId(order.trackingId || '');
  };

  const handleAdvanceStatus = async () => {
    const current = selectedOrder.orderStatus;
    const nextStatus = NEXT_STATUS_MAP[current];

    if (!nextStatus) return;

    // Doc rule 6.3: Shipped requires courier and trackingId
    if (nextStatus === 'Shipped') {
      if (!courier.trim() || !trackingId.trim()) {
        alert('Advancing to Shipped status strictly requires a Courier name and Tracking ID.');
        return;
      }
    }

    try {
      setAdvancingStatus(true);
      await adminApi.updateOrderStatus(selectedOrder.orderId || selectedOrder.id, {
        status: nextStatus,
        courier: courier.trim(),
        trackingId: trackingId.trim(),
      });
      setSelectedOrder(null);
      await fetchOrders();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update order status');
    } finally {
      setAdvancingStatus(false);
    }
  };

  return (
    <AdminLayout
      title="Store Order Fulfillment Center"
      subtitle="Filter orders by lifecycle state, search by ORD-YYYYMMDD-NNNN, advance fulfillment"
    >
      <div className="space-y-6">
        {/* Filters bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-3 text-text-muted" />
            <input
              type="text"
              value={searchOrderNumber}
              onChange={(e) => {
                setSearchOrderNumber(e.target.value);
                setPage(1);
              }}
              placeholder="Search by orderNumber (e.g. ORD-...)"
              className="w-full pl-9 pr-3 py-2 bg-bg-card  rounded-xl text-xs text-white"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-text-muted" />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 bg-bg-card  rounded-xl text-xs text-white"
            >
              <option value="">All Statuses</option>
              <option value="Placed">Placed</option>
              <option value="Packed">Packed</option>
              <option value="Shipped">Shipped</option>
              <option value="Out for Delivery">Out for Delivery</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-bg-card  rounded-3xl overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.45)]">
          <table className="w-full text-xs text-left">
            <thead className="text-[11px] uppercase tracking-wider text-text-muted bg-bg-elevated/50 ">
              <tr>
                <th className="py-3.5 px-4">Order Number</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Payment</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Courier / Tracking</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="">
              {orders.map((o) => {
                const id = o.orderId || o.id;
                const orderNum = o.orderNumber || o.order_number;
                const total = Number(o.totalAmount || o.total_amount || 0);
                const nextStep = NEXT_STATUS_MAP[o.orderStatus];

                return (
                  <tr key={id} className="hover:bg-bg-elevated/30">
                    <td className="py-3.5 px-4 font-mono font-bold text-accent">
                      {orderNum}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-white">{o.user?.name || o.addressName}</div>
                      <div className="text-[10px] text-text-muted">{o.addressPhone}</div>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-white">
                      ₹{total.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-[11px] font-semibold text-text-secondary">
                        {o.paymentStatus} (COD)
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={o.orderStatus} />
                    </td>
                    <td className="py-3.5 px-4 text-text-muted">
                      {o.courier ? `${o.courier} (${o.trackingId})` : '—'}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {nextStep && o.orderStatus !== 'Cancelled' ? (
                        <button
                          onClick={() => handleOpenDrawer(o)}
                          className="px-3 py-1.5 bg-accent/10 hover:bg-accent/20 border border-accent/30 text-accent font-semibold rounded-lg text-xs transition"
                        >
                          Advance to {nextStep}
                        </button>
                      ) : (
                        <span className="text-text-muted text-[11px]">Finalized</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="p-4 ">
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        </div>
      </div>

      {/* Advancement Drawer / Slide-over */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-md bg-bg-card  h-full p-6 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 ">
                <h3 className="font-bold text-white uppercase tracking-wider">
                  Advance Order Lifecycle
                </h3>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-1 rounded-full text-text-muted hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2 text-xs">
                <p>
                  <span className="text-text-muted">Order:</span>{' '}
                  <span className="font-mono font-bold text-white">
                    {selectedOrder.orderNumber}
                  </span>
                </p>
                <p>
                  <span className="text-text-muted">Current Status:</span>{' '}
                  <span className="text-white font-semibold">{selectedOrder.orderStatus}</span>
                </p>
                <p>
                  <span className="text-text-muted">Next Step:</span>{' '}
                  <span className="text-accent font-bold">
                    {NEXT_STATUS_MAP[selectedOrder.orderStatus]}
                  </span>
                </p>
              </div>

              {NEXT_STATUS_MAP[selectedOrder.orderStatus] === 'Shipped' && (
                <div className="space-y-3 pt-3  text-xs">
                  <div className="p-3 bg-accent/10 border border-accent/20 rounded-xl text-accent text-[11px]">
                    Shipping requires recording dispatch logistics for customer tracking.
                  </div>

                  <div>
                    <label className="block text-text-secondary uppercase font-semibold mb-1">
                      Courier Partner *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Blue Dart, Delhivery, DTDC"
                      value={courier}
                      onChange={(e) => setCourier(e.target.value)}
                      className="w-full p-2.5 bg-bg-elevated  rounded-xl text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-text-secondary uppercase font-semibold mb-1">
                      Tracking Waybill ID *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. TRK-98721345"
                      value={trackingId}
                      onChange={(e) => setTrackingId(e.target.value)}
                      className="w-full p-2.5 bg-bg-elevated  rounded-xl text-white font-mono"
                    />
                  </div>
                </div>
              )}

              {NEXT_STATUS_MAP[selectedOrder.orderStatus] === 'Delivered' && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-xs">
                  Delivered status marks paymentStatus = 'Paid' (COD collected) and initiates the 7-day customer return window.
                </div>
              )}
            </div>

            <div className="pt-4  flex gap-3">
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="flex-1 py-3 text-xs text-text-secondary hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={advancingStatus}
                onClick={handleAdvanceStatus}
                className="flex-1 py-3 bg-accent text-black font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-accent-hover transition shadow-[0_4px_0_0_#000000]"
              >
                {advancingStatus ? 'Updating...' : `Confirm: ${NEXT_STATUS_MAP[selectedOrder.orderStatus]}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
