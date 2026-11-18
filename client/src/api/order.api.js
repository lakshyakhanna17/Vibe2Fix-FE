import client from './client';
import {
  mockAddressApi,
  mockOrderApi,
  mockRefundApi,
  mockReviewApi,
} from '../mock/mockApi';

const USE_MOCK = import.meta.env.VITE_USE_MOCK_DATA === 'true';

const realAddressApi = {
  getAddresses: () => client.get('/api/addresses'),
  addAddress: (data) => client.post('/api/addresses', data),
  updateAddress: (id, data) => client.put(`/api/addresses/${id}`, data),
  deleteAddress: (id) => client.delete(`/api/addresses/${id}`),
};

const realOrderApi = {
  createOrder: (payload) => client.post('/api/orders', payload),
  getOrders: (params = {}) => client.get('/api/orders', { params }),
  getOrderByNumber: (orderNumber) => client.get(`/api/orders/${orderNumber}`),
  cancelOrder: (orderNumber) => client.put(`/api/orders/${orderNumber}/cancel`),
  requestRefund: (orderNumber, data) => client.post(`/api/orders/${orderNumber}/refund`, data),
};

const realRefundApi = {
  getMyRefunds: () => client.get('/api/refunds'),
};

const realReviewApi = {
  submitReview: (productId, formData) =>
    client.post(`/api/products/${productId}/reviews`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  editReview: (id, data) => client.put(`/api/reviews/${id}`, data),
  deleteReview: (id) => client.delete(`/api/reviews/${id}`),
  reportReview: (id, reportReason) => client.post(`/api/reviews/${id}/report`, { reportReason }),
};

export const addressApi = USE_MOCK ? mockAddressApi : realAddressApi;
export const orderApi = USE_MOCK ? mockOrderApi : realOrderApi;
export const refundApi = USE_MOCK ? mockRefundApi : realRefundApi;
export const reviewApi = USE_MOCK ? mockReviewApi : realReviewApi;
