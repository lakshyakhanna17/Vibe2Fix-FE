import React, { useState, useEffect } from 'react';
import { User, MapPin, Plus, Trash2, Edit2, Shield, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { addressApi } from '../api/order.api';

export const ProfilePage = () => {
  const { user } = useAuth();

  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [addressForm, setAddressForm] = useState({
    name: '',
    phone: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
    addressType: 'home',
    isDefault: false,
  });

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const res = await addressApi.getAddresses();
      setAddresses(res.data.addresses || res.data || []);
    } catch (err) {
      console.error('Failed to load profile addresses', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await addressApi.updateAddress(editingId, addressForm);
      } else {
        await addressApi.addAddress(addressForm);
      }
      await fetchAddresses();
      setShowForm(false);
      setEditingId(null);
      setAddressForm({
        name: '',
        phone: '',
        line1: '',
        line2: '',
        city: '',
        state: '',
        pincode: '',
        country: 'India',
        addressType: 'home',
        isDefault: false,
      });
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save address');
    }
  };

  const handleEdit = (addr) => {
    setEditingId(addr.addressId || addr.id);
    setAddressForm({
      name: addr.name,
      phone: addr.phone,
      line1: addr.line1,
      line2: addr.line2 || '',
      city: addr.city,
      state: addr.state,
      pincode: addr.pincode,
      country: addr.country || 'India',
      addressType: addr.addressType || addr.address_type || 'home',
      isDefault: addr.isDefault || addr.is_default || false,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this address?')) return;
    try {
      await addressApi.deleteAddress(id);
      await fetchAddresses();
    } catch (err) {
      alert('Failed to delete address');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Account Info Card */}
      <div className="bg-bg-card  rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-accent/20 border border-accent/40 flex items-center justify-center text-accent text-2xl font-black uppercase">
            {user?.name?.[0] || 'U'}
          </div>
          <div>
            <h1 className="text-xl font-bold text-white uppercase tracking-wider">{user?.name}</h1>
            <p className="text-xs text-text-muted mt-0.5">{user?.email}</p>
            {user?.phone && <p className="text-xs text-text-muted mt-0.5">{user?.phone}</p>}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3 py-1 bg-accent/10 border border-accent/20 text-accent text-xs font-semibold rounded-full uppercase tracking-wider">
            Role: {user?.role || 'Customer'}
          </span>
        </div>
      </div>

      {/* Saved Addresses Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between pb-3 ">
          <div>
            <h2 className="text-lg font-bold text-white uppercase tracking-wider">
              Saved Delivery Destinations
            </h2>
            <p className="text-xs text-text-muted mt-0.5">
              Manage your residential and commercial delivery locations
            </p>
          </div>

          <button
            onClick={() => {
              setEditingId(null);
              setAddressForm({
                name: '',
                phone: '',
                line1: '',
                line2: '',
                city: '',
                state: '',
                pincode: '',
                country: 'India',
                addressType: 'home',
                isDefault: false,
              });
              setShowForm(!showForm);
            }}
            className="px-4 py-2 bg-accent text-black font-semibold text-xs rounded-xl flex items-center gap-1.5 transition"
          >
            <Plus className="w-4 h-4" />
            <span>{showForm ? 'Close Form' : 'Add Address'}</span>
          </button>
        </div>

        {/* Address Form */}
        {showForm && (
          <form
            onSubmit={handleSaveAddress}
            className="p-6 bg-bg-card  rounded-2xl space-y-4 text-xs"
          >
            <h3 className="font-bold text-white uppercase tracking-wider">
              {editingId ? 'Edit Address' : 'New Address'}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Full Name *"
                required
                value={addressForm.name}
                onChange={(e) => setAddressForm({ ...addressForm, name: e.target.value })}
                className="p-3 bg-bg-elevated  rounded-xl text-white"
              />
              <input
                type="tel"
                placeholder="Contact Phone *"
                required
                value={addressForm.phone}
                onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                className="p-3 bg-bg-elevated  rounded-xl text-white"
              />
            </div>

            <input
              type="text"
              placeholder="Address Line 1 *"
              required
              value={addressForm.line1}
              onChange={(e) => setAddressForm({ ...addressForm, line1: e.target.value })}
              className="w-full p-3 bg-bg-elevated  rounded-xl text-white"
            />
            <input
              type="text"
              placeholder="Address Line 2 (Optional)"
              value={addressForm.line2}
              onChange={(e) => setAddressForm({ ...addressForm, line2: e.target.value })}
              className="w-full p-3 bg-bg-elevated  rounded-xl text-white"
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="City *"
                required
                value={addressForm.city}
                onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                className="p-3 bg-bg-elevated  rounded-xl text-white"
              />
              <input
                type="text"
                placeholder="State *"
                required
                value={addressForm.state}
                onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                className="p-3 bg-bg-elevated  rounded-xl text-white"
              />
              <input
                type="text"
                placeholder="Pincode *"
                required
                value={addressForm.pincode}
                onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })}
                className="p-3 bg-bg-elevated  rounded-xl text-white"
              />
            </div>

            <div className="flex items-center gap-6 pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="type"
                  checked={addressForm.addressType === 'home'}
                  onChange={() => setAddressForm({ ...addressForm, addressType: 'home' })}
                  className="text-accent"
                />
                <span className="text-white">Home</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="type"
                  checked={addressForm.addressType === 'work'}
                  onChange={() => setAddressForm({ ...addressForm, addressType: 'work' })}
                  className="text-accent"
                />
                <span className="text-white">Work</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer ml-auto">
                <input
                  type="checkbox"
                  checked={addressForm.isDefault}
                  onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                  className="text-accent rounded"
                />
                <span className="text-white">Set as default</span>
              </label>
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-text-secondary hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-accent text-black font-semibold rounded-xl hover:bg-accent-hover transition"
              >
                Save
              </button>
            </div>
          </form>
        )}

        {/* Address Cards Grid */}
        {addresses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addresses.map((addr) => {
              const id = addr.addressId || addr.id;
              const isDef = addr.isDefault || addr.is_default;

              return (
                <div
                  key={id}
                  className="bg-bg-card  rounded-2xl p-5 space-y-3 relative hover:border-text-secondary transition"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-xs uppercase tracking-wider">
                      {addr.name}
                    </span>
                    <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-bg-elevated  text-text-secondary">
                      {addr.addressType || 'Home'}
                    </span>
                  </div>

                  <p className="text-xs text-text-secondary leading-relaxed">
                    {addr.line1}, {addr.line2 && `${addr.line2}, `}
                    {addr.city}, {addr.state} - {addr.pincode}
                  </p>
                  <p className="text-xs text-text-muted">Phone: {addr.phone}</p>

                  <div className="pt-3  flex items-center justify-between">
                    {isDef ? (
                      <span className="text-[10px] font-bold text-accent uppercase flex items-center gap-1">
                        <Check className="w-3 h-3 stroke-[3]" /> Default Delivery Address
                      </span>
                    ) : <div />}

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(addr)}
                        className="p-1.5 text-text-muted hover:text-white transition"
                        title="Edit address"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(id)}
                        className="p-1.5 text-text-muted hover:text-status-danger transition"
                        title="Delete address"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-xs text-text-muted">No addresses saved yet.</p>
        )}
      </div>
    </div>
  );
};
