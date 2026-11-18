import client from './client';
import { mockProductApi, mockCategoryApi } from '../mock/mockApi';

const USE_MOCK = import.meta.env.VITE_USE_MOCK_DATA === 'true';

const realProductApi = {
  getProducts: (params = {}) => client.get('/api/products', { params }),
  getProductById: (id) => client.get(`/api/products/${id}`),
  getProductReviews: (id, params = {}) => client.get(`/api/products/${id}/reviews`, { params }),
};

const realCategoryApi = {
  getCategories: () => client.get('/api/categories'),
};

export const productApi = USE_MOCK ? mockProductApi : realProductApi;
export const categoryApi = USE_MOCK ? mockCategoryApi : realCategoryApi;
