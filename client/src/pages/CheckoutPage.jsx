import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  Plus, 
  ShieldCheck, 
  Truck, 
  AlertCircle, 
  CheckCircle2,
  Banknote
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { addressApi, orderApi } from '../api/order.api';
import { PriceSummary } from '../components/PriceSummary';

export const CheckoutPage = () => {
  const navigate = useNavigate();
  const { items, subtotal, discount, shippingCharge, totalAmount, hasOutOfStockItems, refreshCart } = useCart();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [error, setError] = useState(null);

  // New address state
  const [newAddress, setNewAddress] = useState({
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
      const addrList = res.data.addresses || res.data || [];
      setAddresses(addrList);
      const def = addrList.find((a) => a.isDefault || a.is_default) || addrList[0];
      if (def) {
        setSelectedAddressId(def.addressId || def.id);
      }
    } catch (err) {
      console.error('Failed to load addresses', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleCreateAddress = async (e) => {
    e.preventDefault();
    try {
      const res = await addressApi.addAddress(newAddress);
      await fetchAddresses();
      setShowAddressForm(false);
      setNewAddress({
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

  const handlePlaceOrder = async () => {
    setError(null);

    if (!selectedAddressId) {
      setError('Please select or add a delivery address.');
      return;
    }

    if (hasOutOfStockItems) {
      setError('Cannot place order: some items in your cart are out of stock.');
      return;
    }

    try {
      setPlacingOrder(true);
      // Doc Section 6.2: POST /api/orders with { addressId }
      const res = await orderApi.createOrder({ addressId: selectedAddressId });
      const order = res.data.order || res.data;
      await refreshCart();
      navigate(`/order-success/${order.orderNumber || order.order_number}`);
    } catch (err) {
      // Handles 409 "No stock left for [product]", 400 "Invalid coupon", etc.
      setError(err.response?.data?.message || 'Failed to place order. Inventory may have changed.');
    } finally {
      setPlacingOrder(false);
    }
  };

  if (items.length === 0 && !loading) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-2xl font-black text-white uppercase tracking-wider">
          Checkout & Delivery
        </h1>
        <p className="text-xs text-text-muted mt-1">
          Select delivery location & confirm Cash on Delivery (COD) order
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-status-danger/10 border border-status-danger/40 flex items-center gap-3 text-status-danger text-xs">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left: Addresses & Payment terms */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Saved Addresses Selector */}
          <div className="bg-bg-card  rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 ">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-accent" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Delivery Address
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddressForm(!showAddressForm)}
                className="text-xs text-accent hover:underline flex items-center gap-1 font-semibold"
              >
                <Plus className="w-3.5 h-3.5" />
                {showAddressForm ? 'Cancel' : 'Add New Address'}
              </button>
            </div>

            {/* New Address Form Modal/Drawer */}
            {showAddressForm && (
              <form onSubmit={handleCreateAddress} className="p-4 bg-bg-elevated rounded-xl  space-y-3 text-xs">
                <h4 className="font-semibold text-white uppercase tracking-wider text-[11px]">
                  New Shipping Destination
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Recipient Full Name *"
                    required
                    value={newAddress.name}
                    onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                    className="p-2.5 bg-bg-card  rounded-lg text-white"
                  />
                  <input
                    type="tel"
                    placeholder="Contact Phone *"
                    required
                    value={newAddress.phone}
                    onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                    className="p-2.5 bg-bg-card  rounded-lg text-white"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Address Line 1 (Flat, House no., Building) *"
                  required
                  value={newAddress.line1}
                  onChange={(e) => setNewAddress({ ...newAddress, line1: e.target.value })}
                  className="w-full p-2.5 bg-bg-card  rounded-lg text-white"
                />
                <input
                  type="text"
                  placeholder="Address Line 2 (Area, Street, Landmark)"
                  value={newAddress.line2}
                  onChange={(e) => setNewAddress({ ...newAddress, line2: e.target.value })}
                  className="w-full p-2.5 bg-bg-card  rounded-lg text-white"
                />
                <div className="grid grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="City *"
                    required
                    value={newAddress.city}
                    onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                    className="p-2.5 bg-bg-card  rounded-lg text-white"
                  />
                  <input
                    type="text"
                    placeholder="State *"
                    required
                    value={newAddress.state}
                    onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                    className="p-2.5 bg-bg-card  rounded-lg text-white"
                  />
                  <input
                    type="text"
                    placeholder="Pincode *"
                    required
                    value={newAddress.pincode}
                    onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                    className="p-2.5 bg-bg-card  rounded-lg text-white"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-accent text-black font-semibold text-xs rounded-lg hover:bg-accent-hover transition"
                >
                  Save Address
                </button>
              </form>
            )}

            {/* Address Cards List */}
            {addresses.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {addresses.map((addr) => {
                  const id = addr.addressId || addr.id;
                  const isSelected = selectedAddressId === id;
                  return (
                    <div
                      key={id}
                      onClick={() => setSelectedAddressId(id)}
                      className={`p-4 rounded-xl border cursor-pointer transition relative ${
                        isSelected
                          ? 'border-accent bg-accent/5'
                          : ' bg-bg-elevated hover:border-text-secondary'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-semibold text-white text-xs">{addr.name}</span>
                        <span className="text-[10px] uppercase font-bold text-text-muted px-2 py-0.5 rounded bg-bg-card ">
                          {addr.addressType || 'Home'}
                        </span>
                      </div>
                      <p className="text-xs text-text-secondary leading-relaxed">
                        {addr.line1}, {addr.line2 && `${addr.line2}, `}
                        {addr.city}, {addr.state} - {addr.pincode}
                      </p>
                      <p className="text-xs text-text-muted mt-1">Phone: {addr.phone}</p>
                      {isSelected && (
                        <div className="absolute top-2 right-2 text-accent">
                          <CheckCircle2 className="w-4 h-4 fill-accent text-black" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-text-muted">
                No saved addresses. Please click "Add New Address" above.
              </p>
            )}
          </div>

          {/* Payment Method Details (COD Only) */}
          <div className="bg-bg-card  rounded-2xl p-6 space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider pb-3 ">
              Payment Method
            </h3>
            <div className="p-4 rounded-xl bg-bg-elevated border border-accent/40 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-accent/20 text-accent">
                  <Banknote className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-white text-xs uppercase tracking-wide">
                    Cash on Delivery (COD)
                  </p>
                  <p className="text-[11px] text-text-muted">
                    Pay the total amount in cash to the delivery agent when your order arrives.
                  </p>
                </div>
              </div>
              <span className="text-xs font-semibold text-accent px-2.5 py-1 bg-accent/10 rounded-full border border-accent/20">
                Guaranteed
              </span>
            </div>
          </div>
        </div>

        {/* Right: Order Summary & Confirm Button */}
        <div className="lg:col-span-1 space-y-4">
          <PriceSummary
            subtotal={subtotal}
            discount={discount}
            shippingCharge={shippingCharge}
            totalAmount={totalAmount}
            showCouponInput={false}
          />

          <button
            type="button"
            disabled={placingOrder || hasOutOfStockItems || !selectedAddressId}
            onClick={handlePlaceOrder}
            className="w-full py-4 px-6 bg-accent hover:bg-accent-hover text-black font-black text-xs uppercase tracking-wider rounded-2xl transition shadow-[0_4px_0_0_#000000] flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {placingOrder ? 'Confirming Order...' : 'Place Cash on Delivery Order'}
          </button>
        </div>
      </div>
    </div>
  );
};
