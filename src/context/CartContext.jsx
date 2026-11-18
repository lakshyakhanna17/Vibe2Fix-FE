import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartApi, wishlistApi } from '../api/cart.api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [couponError, setCouponError] = useState(null);

  // Fetch cart
  const refreshCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCart(null);
      return;
    }
    try {
      setLoading(true);
      const res = await cartApi.getCart();
      setCart(res.data);
    } catch (err) {
      console.error('Failed to fetch cart:', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Fetch wishlist
  const refreshWishlist = useCallback(async () => {
    if (!isAuthenticated) {
      setWishlist([]);
      return;
    }
    try {
      setWishlistLoading(true);
      const res = await wishlistApi.getWishlist();
      setWishlist(res.data.items || res.data || []);
    } catch (err) {
      console.error('Failed to fetch wishlist:', err);
    } finally {
      setWishlistLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      refreshCart();
      refreshWishlist();
    } else {
      setCart(null);
      setWishlist([]);
    }
  }, [isAuthenticated, refreshCart, refreshWishlist]);

  const addToCart = async (productId, quantity = 1) => {
    if (!isAuthenticated) {
      throw new Error('Please login to add items to cart');
    }
    await cartApi.addItem(productId, quantity);
    await refreshCart();
  };

  const updateCartQuantity = async (productId, quantity) => {
    if (quantity <= 0) {
      await removeFromCart(productId);
      return;
    }
    await cartApi.updateQuantity(productId, quantity);
    await refreshCart();
  };

  const removeFromCart = async (productId) => {
    await cartApi.removeItem(productId);
    await refreshCart();
  };

  const applyCoupon = async (code) => {
    setCouponError(null);
    try {
      await cartApi.applyCoupon(code);
      await refreshCart();
      return true;
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid coupon';
      setCouponError(msg);
      throw new Error(msg);
    }
  };

  const removeCoupon = async () => {
    setCouponError(null);
    await cartApi.removeCoupon();
    await refreshCart();
  };

  // Wishlist actions
  const toggleWishlist = async (productId) => {
    if (!isAuthenticated) {
      throw new Error('Please login to manage wishlist');
    }
    const isWishlisted = wishlist.some((item) => (item.productId || item.product?.productId) === productId);
    if (isWishlisted) {
      await wishlistApi.removeItem(productId);
    } else {
      await wishlistApi.addItem(productId);
    }
    await refreshWishlist();
  };

  const isInWishlist = (productId) => {
    return wishlist.some((item) => (item.productId || item.product?.productId) === productId);
  };

  // Safe decimal helper calculations
  const items = cart?.items || [];
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  // Subtotal from live item prices
  const subtotal = items.reduce((sum, item) => {
    const price = Number(item.product?.price || item.price || 0);
    return sum + price * item.quantity;
  }, 0);

  // Flat ₹50 rate, free above ₹500 subtotal
  const shippingCharge = subtotal >= 500 || subtotal === 0 ? 0 : 50;

  // Discount
  const discount = Number(cart?.discount || 0);

  // Total
  const totalAmount = Math.max(0, subtotal - discount + shippingCharge);

  // Check if any cart item is out of stock (Stock Guard from Doc 6.1)
  const hasOutOfStockItems = items.some(
    (item) => item.isAvailable === false || (item.product && item.product.stock < item.quantity)
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        items,
        itemCount,
        subtotal,
        discount,
        shippingCharge,
        totalAmount,
        hasOutOfStockItems,
        coupon: cart?.coupon,
        couponError,
        loading,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        applyCoupon,
        removeCoupon,
        refreshCart,
        // Wishlist
        wishlist,
        toggleWishlist,
        isInWishlist,
        refreshWishlist,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
