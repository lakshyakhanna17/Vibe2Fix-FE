import React, { useState, useEffect } from 'react';
import { Tag, Plus, Edit2, Trash2 } from 'lucide-react';
import { adminApi } from '../../api/admin.api';
import { AdminLayout } from './AdminLayout';
import { ConfirmModal } from '../../components/ConfirmModal';

export const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal form state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const [formData, setFormData] = useState({
    code: '',
    type: 'percent', // percent | flat
    value: '',
    minOrder: '0',
    maxDiscount: '',
    expiry: '',
    usageLimit: '100',
    isActive: true,
  });

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getCoupons();
      setCoupons(res.data.coupons || res.data || []);
    } catch (err) {
      console.error('Failed to load coupons', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleOpenAdd = () => {
    setEditingCoupon(null);
    setFormData({
      code: '',
      type: 'percent',
      value: '',
      minOrder: '0',
      maxDiscount: '',
      expiry: '',
      usageLimit: '100',
      isActive: true,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (c) => {
    setEditingCoupon(c);
    setFormData({
      code: c.code,
      type: c.type,
      value: Number(c.value),
      minOrder: Number(c.minOrder || 0),
      maxDiscount: c.maxDiscount ? Number(c.maxDiscount) : '',
      expiry: c.expiry ? new Date(c.expiry).toISOString().slice(0, 16) : '',
      usageLimit: c.usageLimit || 100,
      isActive: c.isActive !== false,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        code: formData.code.toUpperCase().trim(),
        value: Number(formData.value),
        minOrder: Number(formData.minOrder || 0),
        maxDiscount: formData.maxDiscount ? Number(formData.maxDiscount) : null,
        usageLimit: Number(formData.usageLimit),
        expiry: formData.expiry ? new Date(formData.expiry).toISOString() : null,
      };

      if (editingCoupon) {
        await adminApi.updateCoupon(editingCoupon.couponId || editingCoupon.id, payload);
      } else {
        await adminApi.createCoupon(payload);
      }
      setModalOpen(false);
      await fetchCoupons();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save coupon');
    }
  };

  const handleDelete = async () => {
    try {
      await adminApi.deleteCoupon(deleteConfirmId);
      setDeleteConfirmId(null);
      await fetchCoupons();
    } catch (err) {
      alert('Failed to delete coupon');
    }
  };

  return (
    <AdminLayout
      title="Promotional Coupon & Discount Engine"
      subtitle="Configure percent & flat rate promo codes with minimum cart threshold, usage limits, and expiration"
    >
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <p className="text-xs text-text-muted">
            Total configured promo vouchers: <span className="text-white font-bold">{coupons.length}</span>
          </p>

          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 bg-accent text-black font-semibold text-xs rounded-xl flex items-center gap-1.5 hover:bg-accent-hover transition shadow-[0_4px_0_0_#000000]"
          >
            <Plus className="w-4 h-4" />
            <span>Create Promo Coupon</span>
          </button>
        </div>

        {/* Coupons Table */}
        <div className="bg-bg-card  rounded-3xl overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.45)]">
          <table className="w-full text-xs text-left">
            <thead className="text-[11px] uppercase tracking-wider text-text-muted bg-bg-elevated/50 ">
              <tr>
                <th className="py-3.5 px-4">Coupon Code</th>
                <th className="py-3.5 px-4">Discount Value</th>
                <th className="py-3.5 px-4">Min Cart Order</th>
                <th className="py-3.5 px-4">Max Discount Capped</th>
                <th className="py-3.5 px-4">Limit / Expiry</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="">
              {coupons.map((c) => {
                const id = c.couponId || c.id;
                const isPercent = c.type === 'percent';

                return (
                  <tr key={id} className="hover:bg-bg-elevated/30">
                    <td className="py-3.5 px-4 font-mono font-black text-accent text-sm tracking-wider">
                      {c.code}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-white">
                      {isPercent ? `${Number(c.value)}% OFF` : `₹${Number(c.value)} FLAT`}
                    </td>
                    <td className="py-3.5 px-4 text-text-secondary">
                      ₹{Number(c.minOrder || 0).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 text-text-secondary">
                      {c.maxDiscount ? `₹${Number(c.maxDiscount).toLocaleString('en-IN')}` : 'No Cap'}
                    </td>
                    <td className="py-3.5 px-4 text-text-muted">
                      <div>Limit: {c.usageLimit || '∞'}</div>
                      <div className="text-[10px]">
                        {c.expiry ? `Exp: ${new Date(c.expiry).toLocaleDateString()}` : 'No Expiry'}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[11px] font-bold ${
                          c.isActive !== false ? 'text-status-success' : 'text-status-danger'
                        }`}
                      >
                        {c.isActive !== false ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(c)}
                          className="p-1.5 text-text-muted hover:text-white hover:bg-bg-elevated rounded-lg transition"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(id)}
                          className="p-1.5 text-text-muted hover:text-status-danger hover:bg-bg-elevated rounded-lg transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-bg-card  w-full max-w-md rounded-2xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold text-white uppercase tracking-wider">
              {editingCoupon ? 'Edit Coupon' : 'Create New Coupon'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-text-secondary uppercase mb-1">
                  Coupon Code *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SAVE20, DIWALI500"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  className="w-full p-2.5 bg-bg-elevated  rounded-xl text-white font-mono uppercase tracking-wider"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-text-secondary uppercase mb-1">
                    Discount Type *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full p-2.5 bg-bg-elevated  rounded-xl text-white"
                  >
                    <option value="percent">Percentage (%)</option>
                    <option value="flat">Flat Amount (₹)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-text-secondary uppercase mb-1">
                    Value *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder={formData.type === 'percent' ? 'e.g. 20' : 'e.g. 200'}
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                    className="w-full p-2.5 bg-bg-elevated  rounded-xl text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-text-secondary uppercase mb-1">
                    Min Order Subtotal (₹)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.minOrder}
                    onChange={(e) => setFormData({ ...formData, minOrder: e.target.value })}
                    className="w-full p-2.5 bg-bg-elevated  rounded-xl text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-text-secondary uppercase mb-1">
                    Max Discount Cap (₹)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Optional for %"
                    value={formData.maxDiscount}
                    onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value })}
                    className="w-full p-2.5 bg-bg-elevated  rounded-xl text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-text-secondary uppercase mb-1">
                    Usage Limit (Total)
                  </label>
                  <input
                    type="number"
                    value={formData.usageLimit}
                    onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                    className="w-full p-2.5 bg-bg-elevated  rounded-xl text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-text-secondary uppercase mb-1">
                    Expiration Date
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.expiry}
                    onChange={(e) => setFormData({ ...formData, expiry: e.target.value })}
                    className="w-full p-2.5 bg-bg-elevated  rounded-xl text-white"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="couponActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="rounded text-accent"
                />
                <label htmlFor="couponActive" className="text-white cursor-pointer font-medium">
                  Coupon is active for redemptions
                </label>
              </div>

              <div className="pt-3 flex justify-end gap-2 ">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-text-secondary hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-accent text-black font-semibold rounded-xl hover:bg-accent-hover transition"
                >
                  Save Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={handleDelete}
        title="Delete Coupon?"
        message="This coupon will be deleted and can no longer be redeemed by shoppers."
        danger
      />
    </AdminLayout>
  );
};
