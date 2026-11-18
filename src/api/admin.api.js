import client from './client';
import { mockAdminApi } from '../mock/mockApi';

const USE_MOCK = import.meta.env.VITE_USE_MOCK_DATA === 'true';

const realAdminApi = {
  // Dashboard
  getDashboardKPIs: () => client.get('/api/admin/dashboard'),

  // Products
  getProducts: (params = {}) => client.get('/api/admin/products', { params }),
  createProduct: (formData) =>
    client.post('/api/admin/products', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  updateProduct: (id, formData) =>
    client.put(`/api/admin/products/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  deleteProduct: (id) => client.delete(`/api/admin/products/${id}`),

  // Categories
  getCategories: () => client.get('/api/categories'),
  createCategory: (data) => client.post('/api/admin/categories', data),
  updateCategory: (id, data) => client.put(`/api/admin/categories/${id}`, data),
  deleteCategory: (id) => client.delete(`/api/admin/categories/${id}`),

  // Orders
  getOrders: (params = {}) => client.get('/api/admin/orders', { params }),
  updateOrderStatus: (id, data) => client.put(`/api/admin/orders/${id}/status`, data), // { status, courier, trackingId }

  // Refunds
  getRefunds: () => client.get('/api/admin/refunds'),
  updateRefundStatus: (id, data) => client.put(`/api/admin/refunds/${id}`, data), // { status, adminNote }

  // Reviews
  getReportedReviews: () => client.get('/api/admin/reviews/reported'),
  dismissReviewReport: (id) => client.put(`/api/admin/reviews/${id}/dismiss`),
  removeReview: (id) => client.delete(`/api/admin/reviews/${id}`),

  // Customers
  getCustomers: (params = {}) => client.get('/api/admin/customers', { params }),
  updateCustomerStatus: (id, data) => client.put(`/api/admin/customers/${id}/status`, data), // { isActive, disabledReason }

  // Coupons
  getCoupons: () => client.get('/api/admin/coupons'),
  createCoupon: (data) => client.post('/api/admin/coupons', data),
  updateCoupon: (id, data) => client.put(`/api/admin/coupons/${id}`, data),
  deleteCoupon: (id) => client.delete(`/api/admin/coupons/${id}`),
};

export const adminApi = USE_MOCK ? mockAdminApi : realAdminApi;
