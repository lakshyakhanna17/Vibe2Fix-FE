import {
  initialCategories,
  initialProducts,
  initialCoupons,
  initialUsers,
  initialAddresses,
  initialOrders,
  initialReviews,
  initialRefunds,
} from './mockData';

// Storage keys
const KEYS = {
  VERSION: 'v2f_mock_version',
  PRODUCTS: 'v2f_mock_products',
  CATEGORIES: 'v2f_mock_categories',
  COUPONS: 'v2f_mock_coupons',
  USERS: 'v2f_mock_users',
  ADDRESSES: 'v2f_mock_addresses',
  ORDERS: 'v2f_mock_orders',
  REVIEWS: 'v2f_mock_reviews',
  REFUNDS: 'v2f_mock_refunds',
  CART: 'v2f_mock_cart',
  WISHLIST: 'v2f_mock_wishlist',
  CURRENT_USER: 'vibe2fix_user',
  TOKEN: 'vibe2fix_token',
};

const CURRENT_VERSION = 'v2f-mock-catalog-v5';

// Helper: safe JSON get
const get = (key, fallback) => {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : fallback;
  } catch (e) {
    return fallback;
  }
};

// Helper: safe JSON set
const set = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Storage write error', e);
  }
};

// Initialize default store in localStorage (and automatically migrate if new version)
export const initializeMockStore = () => {
  const version = localStorage.getItem(KEYS.VERSION);
  const storedProducts = get(KEYS.PRODUCTS, []);
  const hasLegacyIds = storedProducts.some(
    (p) => p.productId === 'prod-01' || p.productId === 'prod-02' || p.productId === 'prod-03'
  );

  // If new version or legacy product IDs found, forcefully re-seed product & category catalogs
  if (version !== CURRENT_VERSION || hasLegacyIds || storedProducts.length < 25) {
    set(KEYS.PRODUCTS, initialProducts);
    set(KEYS.CATEGORIES, initialCategories);
    set(KEYS.COUPONS, initialCoupons);
    set(KEYS.USERS, initialUsers);
    set(KEYS.ADDRESSES, initialAddresses);
    set(KEYS.ORDERS, initialOrders);
    set(KEYS.REVIEWS, initialReviews);
    set(KEYS.REFUNDS, initialRefunds);

    // Seed modern cart items
    set(KEYS.CART, {
      items: [
        {
          cartItemId: 'c-item-1',
          productId: 'prod-aud-01',
          quantity: 1,
          isAvailable: true,
          product: initialProducts[0],
        },
      ],
      coupon: null,
      discount: 0,
    });

    // Seed modern wishlist items
    set(KEYS.WISHLIST, [
      {
        wishlistItemId: 'w-item-1',
        productId: 'prod-fix-01',
        product: initialProducts[26],
      },
      {
        wishlistItemId: 'w-item-2',
        productId: 'prod-pwr-01',
        product: initialProducts[21],
      },
    ]);

    set(KEYS.VERSION, CURRENT_VERSION);
    return;
  }

  if (!localStorage.getItem(KEYS.PRODUCTS)) set(KEYS.PRODUCTS, initialProducts);
  if (!localStorage.getItem(KEYS.CATEGORIES)) set(KEYS.CATEGORIES, initialCategories);
  if (!localStorage.getItem(KEYS.COUPONS)) set(KEYS.COUPONS, initialCoupons);
  if (!localStorage.getItem(KEYS.USERS)) set(KEYS.USERS, initialUsers);
  if (!localStorage.getItem(KEYS.ADDRESSES)) set(KEYS.ADDRESSES, initialAddresses);
  if (!localStorage.getItem(KEYS.ORDERS)) set(KEYS.ORDERS, initialOrders);
  if (!localStorage.getItem(KEYS.REVIEWS)) set(KEYS.REVIEWS, initialReviews);
  if (!localStorage.getItem(KEYS.REFUNDS)) set(KEYS.REFUNDS, initialRefunds);
};

// Run initialization immediately on load
initializeMockStore();

export const mockStore = {
  getProducts: () => get(KEYS.PRODUCTS, initialProducts),
  setProducts: (data) => set(KEYS.PRODUCTS, data),

  getCategories: () => get(KEYS.CATEGORIES, initialCategories),
  setCategories: (data) => set(KEYS.CATEGORIES, data),

  getCoupons: () => get(KEYS.COUPONS, initialCoupons),
  setCoupons: (data) => set(KEYS.COUPONS, data),

  getUsers: () => get(KEYS.USERS, initialUsers),
  setUsers: (data) => set(KEYS.USERS, data),

  getAddresses: () => get(KEYS.ADDRESSES, initialAddresses),
  setAddresses: (data) => set(KEYS.ADDRESSES, data),

  getOrders: () => get(KEYS.ORDERS, initialOrders),
  setOrders: (data) => set(KEYS.ORDERS, data),

  getReviews: () => get(KEYS.REVIEWS, initialReviews),
  setReviews: (data) => set(KEYS.REVIEWS, data),

  getRefunds: () => get(KEYS.REFUNDS, initialRefunds),
  setRefunds: (data) => set(KEYS.REFUNDS, data),

  getCart: () => get(KEYS.CART, { items: [], coupon: null, discount: 0 }),
  setCart: (data) => set(KEYS.CART, data),

  getWishlist: () => get(KEYS.WISHLIST, []),
  setWishlist: (data) => set(KEYS.WISHLIST, data),

  getCurrentUser: () => get(KEYS.CURRENT_USER, null),
  setCurrentUser: (user) => set(KEYS.CURRENT_USER, user),

  getToken: () => localStorage.getItem(KEYS.TOKEN),
  setToken: (token) => {
    if (token) localStorage.setItem(KEYS.TOKEN, token);
    else localStorage.removeItem(KEYS.TOKEN);
  },
  clearAuth: () => {
    localStorage.removeItem(KEYS.CURRENT_USER);
    localStorage.removeItem(KEYS.TOKEN);
  },
};
