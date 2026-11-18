import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  ShoppingBag, 
  Users, 
  AlertTriangle, 
  RotateCcw, 
  Flag
} from 'lucide-react';
import { adminApi } from '../../api/admin.api';
import { AdminLayout } from './AdminLayout';

export const AdminDashboard = () => {
  const [kpis, setKpis] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const res = await adminApi.getDashboardKPIs();
        setKpis(res.data);
      } catch (err) {
        console.error('Failed to load dashboard KPIs', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <AdminLayout title="System Dashboard" subtitle="Loading metrics...">
        <div className="py-20 flex justify-center">
          <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      </AdminLayout>
    );
  }

  const totalRevenue = Number(kpis?.totalRevenue || 0);
  const totalOrders = kpis?.totalOrders || 0;
  const totalCustomers = kpis?.totalCustomers || 0;
  const lowStockCount = kpis?.lowStockAlerts?.length || kpis?.lowStockCount || 0;
  const pendingRefunds = kpis?.pendingRefunds || 0;
  const flaggedReviews = kpis?.flaggedReviews || 0;
  const ordersByStatus = kpis?.ordersByStatus || [];
  const lowStockItems = kpis?.lowStockAlerts || [];

  return (
    <AdminLayout
      title="Store KPI Analytics & Dashboard"
      subtitle="Overview of revenue, order flows, inventory alerts, and customer activity"
    >
      <div className="space-y-8">
        {/* KPI Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          
          <div className="bg-bg-card  rounded-2xl p-6 relative overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.3)]">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">
                Total Delivered Revenue
              </span>
              <div className="p-2 rounded-xl bg-bg-elevated text-emerald-400  shadow-[0_2px_0_0_#0A0A0C]">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white mt-3">
              ₹{totalRevenue.toLocaleString('en-IN')}
            </div>
            <p className="text-[11px] text-text-muted mt-1">
              Delivered COD orders (refunds excluded)
            </p>
          </div>

          <div className="bg-bg-card  rounded-2xl p-6 relative overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.3)]">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">
                Total Orders
              </span>
              <div className="p-2 rounded-xl bg-bg-elevated text-neutral-200  shadow-[0_2px_0_0_#0A0A0C]">
                <ShoppingBag className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white mt-3">{totalOrders}</div>
            <p className="text-[11px] text-text-muted mt-1">
              Cumulative lifetime store orders
            </p>
          </div>

          <div className="bg-bg-card  rounded-2xl p-6 relative overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.3)]">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">
                Registered Customers
              </span>
              <div className="p-2 rounded-xl bg-bg-elevated text-neutral-200  shadow-[0_2px_0_0_#0A0A0C]">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white mt-3">{totalCustomers}</div>
            <p className="text-[11px] text-text-muted mt-1">Users with customer accounts</p>
          </div>

          <div className="bg-bg-card  rounded-2xl p-6 relative overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.3)]">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">
                Low Stock Alerts
              </span>
              <div className="p-2 rounded-xl bg-bg-elevated text-amber-400  shadow-[0_2px_0_0_#0A0A0C]">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-amber-400 mt-3">{lowStockCount}</div>
            <p className="text-[11px] text-text-muted mt-1">Units below stock threshold (≤ 5)</p>
          </div>

          <div className="bg-bg-card  rounded-2xl p-6 relative overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.3)]">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">
                Pending Refund Claims
              </span>
              <div className="p-2 rounded-xl bg-bg-elevated text-rose-400  shadow-[0_2px_0_0_#0A0A0C]">
                <RotateCcw className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-rose-400 mt-3">{pendingRefunds}</div>
            <p className="text-[11px] text-text-muted mt-1">Awaiting merchant review</p>
          </div>

          <div className="bg-bg-card  rounded-2xl p-6 relative overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.3)]">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">
                Flagged Reviews
              </span>
              <div className="p-2 rounded-xl bg-bg-elevated text-red-400  shadow-[0_2px_0_0_#0A0A0C]">
                <Flag className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-red-400 mt-3">{flaggedReviews}</div>
            <p className="text-[11px] text-text-muted mt-1">Reported by buyers for spam/abuse</p>
          </div>
        </div>

        {/* Orders By Status Distribution */}
        <div className="bg-bg-card  rounded-2xl p-6 space-y-4 shadow-[0_4px_12px_rgba(0,0,0,0.3)]">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Orders Distribution by Fulfillment Lifecycle
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {['Placed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'].map((status) => {
              const match = ordersByStatus.find((item) => item.orderStatus === status);
              const count = match?._count?.id || match?.count || 0;

              return (
                <div key={status} className="p-3.5 bg-bg-elevated  rounded-xl shadow-[0_2px_0_0_#0A0A0C]">
                  <span className="text-[10px] text-text-muted uppercase tracking-wider font-bold block">
                    {status}
                  </span>
                  <div className="text-xl font-black text-white mt-1">{count}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Low Stock Table */}
        <div className="bg-bg-card  rounded-2xl p-6 space-y-4 shadow-[0_4px_12px_rgba(0,0,0,0.3)]">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>Low Inventory Warnings</span>
          </h3>

          {lowStockItems.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="text-[11px] uppercase tracking-wider text-text-muted ">
                  <tr>
                    <th className="py-3 px-4">Product Name</th>
                    <th className="py-3 px-4">Price</th>
                    <th className="py-3 px-4">Units Remaining</th>
                    <th className="py-3 px-4">Units Sold</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="">
                  {lowStockItems.map((prod) => (
                    <tr key={prod.productId || prod.id} className="hover:bg-bg-elevated/40">
                      <td className="py-3 px-4 font-semibold text-white">{prod.name}</td>
                      <td className="py-3 px-4 font-mono">₹{Number(prod.price).toLocaleString('en-IN')}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20">
                          {prod.stock} units
                        </span>
                      </td>
                      <td className="py-3 px-4 text-text-muted">{prod.soldCount || 0}</td>
                      <td className="py-3 px-4">
                        <span className="text-status-success font-medium">Active</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-xs text-text-muted">All active hardware products are safely stocked above threshold.</p>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};
