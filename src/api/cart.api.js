import client from './client';
import { mockCartApi, mockWishlistApi } from '../mock/mockApi';

const USE_MOCK = import.meta.env.VITE_USE_MOCK_DATA === 'true';

const realCartApi = {
  getCart: () => client.get('/api/cart'),
  addItem: (productId, quantity = 1) => client.post('/api/cart/items', { productId, quantity }),
  updateQuantity: (productId, quantity) => client.put(`/api/cart/items/${productId}`, { quantity }),
  removeItem: (productId) => client.delete(`/api/cart/items/${productId}`),
  applyCoupon: (code) => client.post('/api/cart/coupon', { code: code.toUpperCase() }),
  removeCoupon: () => client.delete('/api/cart/coupon'),
};

const realWishlistApi = {
  getWishlist: () => client.get('/api/wishlist'),
  addItem: (productId) => client.post(`/api/wishlist/${productId}`),
  removeItem: (productId) => client.delete(`/api/wishlist/${productId}`),
};

export const cartApi = USE_MOCK ? mockCartApi : realCartApi;
export const wishlistApi = USE_MOCK ? mockWishlistApi : realWishlistApi;
