import { mockStore } from './mockStore';

// Simulate slight async network delay for realism (100ms)
const delay = (ms = 80) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper: Axios-like response format { data, status }
const response = (data, status = 200) => ({ data, status, headers: {} });

// Helper: Axios-like error format
const error = (message, status = 400) => {
  const err = new Error(message);
  err.response = { data: { message }, status };
  return err;
};

// ======================== AUTH MOCK API ========================
export const mockAuthApi = {
  login: async ({ email, password }) => {
    await delay();
    const cleanEmail = email?.trim().toLowerCase();

    // Check pre-configured demo users
    if (
      (cleanEmail === 'customer@vibe2fix.com' || cleanEmail === 'admin@vibe2fix.com') &&
      password === 'demo12345'
    ) {
      const users = mockStore.getUsers();
      const user = users.find((u) => u.email.toLowerCase() === cleanEmail) || {
        userId: cleanEmail.includes('admin') ? 'usr-admin-1' : 'usr-customer-1',
        name: cleanEmail.includes('admin') ? 'Admin Demo' : 'Customer Demo',
        email: cleanEmail,
        role: cleanEmail.includes('admin') ? 'admin' : 'user',
        isActive: true,
      };

      if (!user.isActive) {
        throw error(user.disabledReason || 'Account disabled', 403);
      }

      const token = `mock-jwt-token-${user.role}-${Date.now()}`;
      mockStore.setToken(token);
      mockStore.setCurrentUser(user);

      return response({ token, user, message: 'Login successful' });
    }

    // Check dynamically registered users
    const users = mockStore.getUsers();
    const foundUser = users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (foundUser && (password === 'demo12345' || foundUser.mockPassword === password)) {
      if (!foundUser.isActive) {
        throw error(foundUser.disabledReason || 'Account disabled', 403);
      }
      const token = `mock-jwt-token-${foundUser.role}-${Date.now()}`;
      mockStore.setToken(token);
      mockStore.setCurrentUser(foundUser);
      return response({ token, user: foundUser, message: 'Login successful' });
    }

    throw error('Invalid email or password. Use demo accounts or demo12345.', 401);
  },

  register: async ({ name, email, password, phone }) => {
    await delay();
    if (!password || password.length < 8) {
      throw error('Password must be at least 8 characters', 400);
    }
    const users = mockStore.getUsers();
    const cleanEmail = email?.trim().toLowerCase();
    if (users.some((u) => u.email.toLowerCase() === cleanEmail)) {
      throw error('Email already registered', 409);
    }

    const newUser = {
      userId: `usr-${Date.now()}`,
      name: name?.trim() || 'New User',
      email: cleanEmail,
      phone: phone || '',
      role: 'user', // strictly user role per doc
      isActive: true,
      disabledReason: null,
      mockPassword: password,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    mockStore.setUsers(users);

    return response({ message: 'Registration successful! You may now sign in.', user: newUser });
  },

  getMe: async () => {
    await delay(30);
    const user = mockStore.getCurrentUser();
    if (!user) {
      throw error('Please log in', 401);
    }
    return response({ user });
  },

  forgotPassword: async () => {
    await delay();
    // Anti-enumeration: always 200
    return response({ message: 'If that email is registered, a reset link has been generated.' });
  },

  resetPassword: async ({ token, password }) => {
    await delay();
    if (!token) throw error('Invalid or expired reset link', 400);
    if (!password || password.length < 8) throw error('Password must be at least 8 characters', 400);
    return response({ message: 'Password updated successfully' });
  },
};

// ======================== PRODUCT & CATEGORY MOCK API ========================
export const mockProductApi = {
  getProducts: async (params = {}) => {
    await delay();
    let products = mockStore.getProducts().filter((p) => p.isActive !== false);

    // Search filter (name, description)
    if (params.search) {
      const q = params.search.toLowerCase().trim();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.description && p.description.toLowerCase().includes(q))
      );
    }

    // Category filter (slug or id)
    if (params.category) {
      const catQuery = params.category.toLowerCase().trim();
      products = products.filter((p) =>
        p.categories?.some(
          (c) =>
            c.slug?.toLowerCase() === catQuery ||
            c.categoryId?.toLowerCase() === catQuery ||
            c.name?.toLowerCase() === catQuery
        )
      );
    }

    // Price filter (maxPrice)
    if (params.maxPrice) {
      const max = Number(params.maxPrice);
      products = products.filter((p) => Number(p.price) <= max);
    }

    // Rating filter (minRating)
    if (params.minRating) {
      const minRat = Number(params.minRating);
      products = products.filter((p) => Number(p.avgRating || 0) >= minRat);
    }

    // In stock only filter
    if (params.inStock === true || params.inStock === 'true') {
      products = products.filter((p) => p.stock > 0);
    }

    // Sort order
    if (params.sort) {
      switch (params.sort) {
        case 'price_asc':
          products.sort((a, b) => Number(a.price) - Number(b.price));
          break;
        case 'price_desc':
          products.sort((a, b) => Number(b.price) - Number(a.price));
          break;
        case 'rating':
          products.sort((a, b) => Number(b.avgRating || 0) - Number(a.avgRating || 0));
          break;
        case 'popularity':
          products.sort((a, b) => Number(b.soldCount || 0) - Number(a.soldCount || 0));
          break;
        case 'newest':
        default:
          // Keep default product ordering
          break;
      }
    }

    // Pagination
    const page = parseInt(params.page || 1, 10);
    const limit = parseInt(params.limit || 12, 10);
    const total = products.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const start = (page - 1) * limit;
    const paginated = products.slice(start, start + limit);

    return response({
      products: paginated,
      total,
      page,
      totalPages,
    });
  },

  getProductById: async (id) => {
    await delay();
    const products = mockStore.getProducts();
    const product = products.find((p) => p.productId === id || p.id === id);
    if (!product) throw error('Product not found', 404);
    return response({ product });
  },

  getProductReviews: async (id) => {
    await delay();
    const reviews = mockStore.getReviews().filter((r) => r.productId === id && r.reviewStatus !== 'Removed');
    return response({ reviews });
  },
};

export const mockCategoryApi = {
  getCategories: async () => {
    await delay(30);
    const categories = mockStore.getCategories();
    return response({ categories });
  },
};

// ======================== CART & WISHLIST MOCK API ========================
export const mockCartApi = {
  getCart: async () => {
    await delay(30);
    const cart = mockStore.getCart();
    const products = mockStore.getProducts();

    // Reconcile live product availability & prices
    let subtotal = 0;
    const items = cart.items.map((item) => {
      const p = products.find((prod) => prod.productId === item.productId) || item.product;
      const isAvailable = p && p.isActive !== false && p.stock >= item.quantity;
      const price = Number(p?.price || item.price || 0);
      subtotal += price * item.quantity;
      return {
        ...item,
        isAvailable,
        product: p,
      };
    });

    // Re-verify coupon if applied
    let discount = 0;
    if (cart.coupon) {
      if (cart.coupon.type === 'percent') {
        discount = Math.min((subtotal * cart.coupon.value) / 100, cart.coupon.maxDiscount || Infinity);
      } else {
        discount = cart.coupon.value;
      }
    }

    const updated = {
      ...cart,
      items,
      subtotal,
      discount,
      shippingCharge: subtotal >= 500 || subtotal === 0 ? 0 : 50,
      totalAmount: Math.max(0, subtotal - discount + (subtotal >= 500 || subtotal === 0 ? 0 : 50)),
    };
    mockStore.setCart(updated);
    return response(updated);
  },

  addItem: async (productId, quantity = 1) => {
    await delay();
    const cart = mockStore.getCart();
    const products = mockStore.getProducts();
    const p = products.find((prod) => prod.productId === productId);
    if (!p) throw error('Product not found', 404);
    if (p.stock < quantity) throw error(`No stock left for ${p.name}`, 409);

    const existingIdx = cart.items.findIndex((i) => i.productId === productId);
    if (existingIdx >= 0) {
      const newQty = cart.items[existingIdx].quantity + quantity;
      if (p.stock < newQty) throw error(`Cannot add more. Only ${p.stock} units in stock.`, 409);
      cart.items[existingIdx].quantity = newQty;
    } else {
      cart.items.push({
        cartItemId: `c-item-${Date.now()}`,
        productId,
        quantity,
        isAvailable: true,
        product: p,
      });
    }

    mockStore.setCart(cart);
    return mockCartApi.getCart();
  },

  updateQuantity: async (productId, quantity) => {
    await delay();
    const cart = mockStore.getCart();
    const products = mockStore.getProducts();
    const p = products.find((prod) => prod.productId === productId);

    if (quantity <= 0) {
      return mockCartApi.removeItem(productId);
    }

    if (p && p.stock < quantity) {
      throw error(`Only ${p.stock} available in stock`, 409);
    }

    const item = cart.items.find((i) => i.productId === productId);
    if (item) {
      item.quantity = quantity;
    }
    mockStore.setCart(cart);
    return mockCartApi.getCart();
  },

  removeItem: async (productId) => {
    await delay();
    const cart = mockStore.getCart();
    cart.items = cart.items.filter((i) => i.productId !== productId);
    mockStore.setCart(cart);
    return mockCartApi.getCart();
  },

  applyCoupon: async (code) => {
    await delay();
    const coupons = mockStore.getCoupons();
    const upperCode = code.toUpperCase().trim();
    const coupon = coupons.find((c) => c.code === upperCode && c.isActive);

    if (!coupon) throw error('Invalid coupon', 400);

    const cart = mockStore.getCart();
    const subtotal = cart.items.reduce((sum, i) => sum + Number(i.product?.price || 0) * i.quantity, 0);

    if (subtotal < Number(coupon.minOrder || 0)) {
      throw error(`Coupon requires minimum cart subtotal of ₹${coupon.minOrder}`, 400);
    }

    cart.coupon = coupon;
    mockStore.setCart(cart);
    return mockCartApi.getCart();
  },

  removeCoupon: async () => {
    await delay();
    const cart = mockStore.getCart();
    cart.coupon = null;
    cart.discount = 0;
    mockStore.setCart(cart);
    return mockCartApi.getCart();
  },
};

export const mockWishlistApi = {
  getWishlist: async () => {
    await delay(30);
    const wishlist = mockStore.getWishlist();
    return response({ items: wishlist });
  },

  addItem: async (productId) => {
    await delay(30);
    const wishlist = mockStore.getWishlist();
    const products = mockStore.getProducts();
    const p = products.find((prod) => prod.productId === productId);

    if (!wishlist.some((item) => item.productId === productId)) {
      wishlist.push({
        wishlistItemId: `w-${Date.now()}`,
        productId,
        product: p,
      });
      mockStore.setWishlist(wishlist);
    }
    return response({ items: wishlist });
  },

  removeItem: async (productId) => {
    await delay(30);
    let wishlist = mockStore.getWishlist();
    wishlist = wishlist.filter((item) => item.productId !== productId);
    mockStore.setWishlist(wishlist);
    return response({ items: wishlist });
  },
};

// ======================== ADDRESSES & ORDERS MOCK API ========================
export const mockAddressApi = {
  getAddresses: async () => {
    await delay(30);
    const addresses = mockStore.getAddresses();
    return response({ addresses });
  },

  addAddress: async (data) => {
    await delay();
    const addresses = mockStore.getAddresses();
    const newAddr = {
      addressId: `addr-${Date.now()}`,
      userId: mockStore.getCurrentUser()?.userId || 'usr-customer-1',
      ...data,
      isDefault: addresses.length === 0 ? true : !!data.isDefault,
    };
    if (newAddr.isDefault) {
      addresses.forEach((a) => (a.isDefault = false));
    }
    addresses.push(newAddr);
    mockStore.setAddresses(addresses);
    return response({ address: newAddr });
  },

  updateAddress: async (id, data) => {
    await delay();
    const addresses = mockStore.getAddresses();
    const idx = addresses.findIndex((a) => a.addressId === id);
    if (idx >= 0) {
      if (data.isDefault) {
        addresses.forEach((a) => (a.isDefault = false));
      }
      addresses[idx] = { ...addresses[idx], ...data };
      mockStore.setAddresses(addresses);
      return response({ address: addresses[idx] });
    }
    throw error('Address not found', 404);
  },

  deleteAddress: async (id) => {
    await delay();
    let addresses = mockStore.getAddresses();
    addresses = addresses.filter((a) => a.addressId !== id);
    mockStore.setAddresses(addresses);
    return response({ message: 'Address removed' });
  },
};

export const mockOrderApi = {
  createOrder: async ({ addressId }) => {
    await delay(120);
    const cart = mockStore.getCart();
    if (!cart.items || cart.items.length === 0) {
      throw error('Cart is empty', 400);
    }

    const addresses = mockStore.getAddresses();
    const selectedAddress = addresses.find((a) => a.addressId === addressId) || addresses[0];
    if (!selectedAddress) throw error('Please provide a valid delivery address', 400);

    const products = mockStore.getProducts();

    // Guarded stock verification & decrement (Doc section 6.2)
    for (const item of cart.items) {
      const p = products.find((prod) => prod.productId === item.productId);
      if (!p || p.stock < item.quantity) {
        throw error(`No stock left for ${p?.name || 'an item'}`, 409);
      }
      p.stock -= item.quantity;
      p.soldCount = (p.soldCount || 0) + item.quantity;
    }
    mockStore.setProducts(products);

    // Calculate money snapshots
    const subtotal = cart.items.reduce((sum, i) => sum + Number(i.product?.price || 0) * i.quantity, 0);
    const discount = cart.discount || 0;
    const shippingCharge = subtotal >= 500 ? 0 : 50;
    const totalAmount = Math.max(0, subtotal - discount + shippingCharge);

    // Generate readable orderNumber: ORD-YYYYMMDD-NNNN
    const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `ORD-${today}-${randomSuffix}`;

    const newOrder = {
      orderId: `ord-${Date.now()}`,
      orderNumber,
      userId: mockStore.getCurrentUser()?.userId || 'usr-customer-1',
      orderStatus: 'Placed',
      paymentStatus: 'Pending',
      courier: null,
      trackingId: null,
      subtotal,
      discount,
      shippingCharge,
      totalAmount,
      addressName: selectedAddress.name,
      addressPhone: selectedAddress.phone,
      addressLine1: selectedAddress.line1,
      addressLine2: selectedAddress.line2 || '',
      addressCity: selectedAddress.city,
      addressState: selectedAddress.state,
      addressPincode: selectedAddress.pincode,
      createdAt: new Date().toISOString(),
      deliveredAt: null,
      items: cart.items.map((i) => ({
        orderItemId: `item-${Date.now()}-${Math.random()}`,
        productId: i.productId,
        productName: i.product?.name || 'Hardware Part',
        price: Number(i.product?.price || 0),
        quantity: i.quantity,
        productImage: i.product?.images?.[0]?.imageUrl || 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=400&q=80',
      })),
      statusHistory: [
        { status: 'Placed', changedAt: new Date().toISOString() },
      ],
    };

    const orders = mockStore.getOrders();
    orders.unshift(newOrder);
    mockStore.setOrders(orders);

    // Clear cart
    mockStore.setCart({ items: [], coupon: null, discount: 0 });

    return response({ order: newOrder });
  },

  getOrders: async (params = {}) => {
    await delay();
    const orders = mockStore.getOrders();
    const page = parseInt(params.page || 1, 10);
    const limit = parseInt(params.limit || 10, 10);
    const start = (page - 1) * limit;

    return response({
      orders: orders.slice(start, start + limit),
      total: orders.length,
      page,
      totalPages: Math.ceil(orders.length / limit) || 1,
    });
  },

  getOrderByNumber: async (orderNumber) => {
    await delay();
    const orders = mockStore.getOrders();
    const order = orders.find((o) => o.orderNumber === orderNumber);
    if (!order) throw error('Order not found', 404);
    return response({ order });
  },

  cancelOrder: async (orderNumber) => {
    await delay();
    const orders = mockStore.getOrders();
    const order = orders.find((o) => o.orderNumber === orderNumber);
    if (!order) throw error('Order not found', 404);

    // Rule 6.4: Customer can cancel only while Placed or Packed
    if (order.orderStatus !== 'Placed' && order.orderStatus !== 'Packed') {
      throw error('Order can no longer be cancelled', 400);
    }

    order.orderStatus = 'Cancelled';
    order.statusHistory.push({ status: 'Cancelled', changedAt: new Date().toISOString() });

    // Restore stock
    const products = mockStore.getProducts();
    for (const itm of order.items) {
      const p = products.find((prod) => prod.productId === itm.productId);
      if (p) {
        p.stock += itm.quantity;
        p.soldCount = Math.max(0, (p.soldCount || 0) - itm.quantity);
      }
    }
    mockStore.setProducts(products);
    mockStore.setOrders(orders);

    return response({ order, message: 'Order successfully cancelled. Stock restored.' });
  },

  requestRefund: async (orderNumber, { reason }) => {
    await delay();
    const orders = mockStore.getOrders();
    const order = orders.find((o) => o.orderNumber === orderNumber);
    if (!order) throw error('Order not found', 404);

    if (order.orderStatus !== 'Delivered') {
      throw error('Refunds only allowed on Delivered orders', 400);
    }

    // Check 7-day window
    if (order.deliveredAt) {
      const diff = Date.now() - new Date(order.deliveredAt).getTime();
      if (diff > 7 * 24 * 60 * 60 * 1000) {
        throw error('Return window has expired', 400);
      }
    }

    // Check open refund
    const refunds = mockStore.getRefunds();
    const existing = refunds.find(
      (r) => (r.order?.orderNumber === orderNumber || r.orderId === order.orderId) && (r.status === 'Requested' || r.status === 'Approved')
    );
    if (existing) {
      throw error('A refund request is already open for this order', 409);
    }

    const newRefund = {
      refundId: `ref-${Date.now()}`,
      orderId: order.orderId,
      userId: order.userId,
      amount: order.totalAmount,
      reason: reason || 'Defective hardware or dissatisfaction',
      status: 'Requested',
      adminNote: null,
      createdAt: new Date().toISOString(),
      order: {
        orderNumber: order.orderNumber,
        totalAmount: order.totalAmount,
      },
      user: {
        name: order.addressName,
        email: 'customer@vibe2fix.com',
      },
      refundStatusHistory: [
        { status: 'Requested', changedAt: new Date().toISOString() },
      ],
    };

    refunds.unshift(newRefund);
    mockStore.setRefunds(refunds);

    return response({ refund: newRefund, message: 'Refund request submitted' });
  },
};

export const mockRefundApi = {
  getMyRefunds: async () => {
    await delay();
    const refunds = mockStore.getRefunds();
    return response({ refunds });
  },
};

export const mockReviewApi = {
  submitReview: async (productId, formData) => {
    await delay();
    const user = mockStore.getCurrentUser() || { name: 'Verified Customer', email: 'customer@vibe2fix.com' };
    const rating = Number(formData.get('rating') || 5);
    const comment = formData.get('comment') || '';

    const newRev = {
      reviewId: `rev-${Date.now()}`,
      productId,
      userId: user.userId || 'usr-customer-1',
      rating,
      comment,
      reviewStatus: 'Active',
      createdAt: new Date().toISOString(),
      user: { name: user.name, email: user.email },
      images: [],
    };

    const reviews = mockStore.getReviews();
    reviews.unshift(newRev);
    mockStore.setReviews(reviews);

    // Recalculate average rating & review count for product
    const products = mockStore.getProducts();
    const p = products.find((prod) => prod.productId === productId);
    if (p) {
      const activeRevs = reviews.filter((r) => r.productId === productId && r.reviewStatus !== 'Removed');
      const sum = activeRevs.reduce((acc, r) => acc + Number(r.rating), 0);
      p.avgRating = parseFloat((sum / activeRevs.length).toFixed(2));
      p.reviewCount = activeRevs.length;
      mockStore.setProducts(products);
    }

    return response({ review: newRev, message: 'Review published' });
  },

  reportReview: async (id, reason) => {
    await delay();
    const reviews = mockStore.getReviews();
    const r = reviews.find((rev) => rev.reviewId === id);
    if (r) {
      r.reviewStatus = 'Flagged';
      r.reports = r.reports || [];
      r.reports.push({ reportReason: reason, reportedAt: new Date().toISOString() });
      mockStore.setReviews(reviews);
    }
    return response({ message: 'Review reported for moderation' });
  },
};

// ======================== ADMIN MOCK API ========================
export const mockAdminApi = {
  getDashboardKPIs: async () => {
    await delay();
    const orders = mockStore.getOrders();
    const products = mockStore.getProducts();
    const users = mockStore.getUsers().filter((u) => u.role === 'user');
    const refunds = mockStore.getRefunds();
    const reviews = mockStore.getReviews();

    // Delivered revenue (where paymentStatus === 'Paid' and not refunded)
    const totalRevenue = orders
      .filter((o) => o.orderStatus === 'Delivered' && o.paymentStatus === 'Paid')
      .reduce((sum, o) => sum + Number(o.totalAmount || 0), 0);

    // Low stock items (stock <= 5 and isActive)
    const lowStockAlerts = products.filter((p) => p.stock <= 5 && p.isActive !== false);

    // Pending refunds
    const pendingRefunds = refunds.filter((r) => r.status === 'Requested').length;

    // Flagged reviews
    const flaggedReviews = reviews.filter((r) => r.reviewStatus === 'Flagged').length;

    // Group orders by status
    const statusCounts = {};
    orders.forEach((o) => {
      statusCounts[o.orderStatus] = (statusCounts[o.orderStatus] || 0) + 1;
    });
    const ordersByStatus = Object.entries(statusCounts).map(([orderStatus, count]) => ({
      orderStatus,
      _count: { id: count },
      count,
    }));

    return response({
      totalRevenue,
      totalOrders: orders.length,
      totalCustomers: users.length,
      lowStockAlerts,
      pendingRefunds,
      flaggedReviews,
      ordersByStatus,
    });
  },

  getProducts: async (params = {}) => {
    await delay();
    let products = mockStore.getProducts(); // Includes inactive for admin
    if (params.search) {
      const q = params.search.toLowerCase().trim();
      products = products.filter((p) => p.name.toLowerCase().includes(q));
    }
    if (params.category) {
      products = products.filter((p) =>
        p.categories?.some((c) => c.slug === params.category || c.categoryId === params.category)
      );
    }
    const page = parseInt(params.page || 1, 10);
    const limit = parseInt(params.limit || 10, 10);
    const start = (page - 1) * limit;

    return response({
      products: products.slice(start, start + limit),
      total: products.length,
      page,
      totalPages: Math.ceil(products.length / limit) || 1,
    });
  },

  createProduct: async (formData) => {
    await delay();
    const products = mockStore.getProducts();
    const name = formData.get('name');
    const price = Number(formData.get('price'));
    const stock = parseInt(formData.get('stock') || 10, 10);
    const description = formData.get('description') || '';

    const newProd = {
      productId: `prod-${Date.now()}`,
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      price,
      stock,
      description,
      avgRating: 5.0,
      reviewCount: 0,
      soldCount: 0,
      isActive: true,
      images: [
        {
          imageId: `img-${Date.now()}`,
          imageUrl: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80',
          isPrimary: true,
        },
      ],
      categories: [],
    };
    products.unshift(newProd);
    mockStore.setProducts(products);
    return response({ product: newProd });
  },

  updateProduct: async (id, formData) => {
    await delay();
    const products = mockStore.getProducts();
    const p = products.find((prod) => prod.productId === id);
    if (!p) throw error('Product not found', 404);

    if (formData.get('name')) p.name = formData.get('name');
    if (formData.get('price')) p.price = Number(formData.get('price'));
    if (formData.get('stock')) p.stock = parseInt(formData.get('stock'), 10);
    if (formData.get('description')) p.description = formData.get('description');

    mockStore.setProducts(products);
    return response({ product: p });
  },

  deleteProduct: async (id) => {
    await delay();
    const products = mockStore.getProducts();
    const p = products.find((prod) => prod.productId === id);
    if (p) {
      p.isActive = false; // Soft delete per doc
      mockStore.setProducts(products);
    }
    return response({ message: 'Product archived' });
  },

  getCategories: async () => mockCategoryApi.getCategories(),

  createCategory: async (data) => {
    await delay();
    const categories = mockStore.getCategories();
    const newCat = {
      categoryId: `cat-${Date.now()}`,
      ...data,
    };
    categories.push(newCat);
    mockStore.setCategories(categories);
    return response({ category: newCat });
  },

  updateCategory: async (id, data) => {
    await delay();
    const categories = mockStore.getCategories();
    const idx = categories.findIndex((c) => c.categoryId === id);
    if (idx >= 0) {
      categories[idx] = { ...categories[idx], ...data };
      mockStore.setCategories(categories);
      return response({ category: categories[idx] });
    }
    throw error('Category not found', 404);
  },

  deleteCategory: async (id) => {
    await delay();
    let categories = mockStore.getCategories();
    categories = categories.filter((c) => c.categoryId !== id);
    mockStore.setCategories(categories);
    return response({ message: 'Category removed' });
  },

  getOrders: async (params = {}) => {
    await delay();
    let orders = mockStore.getOrders();
    if (params.status) {
      orders = orders.filter((o) => o.orderStatus === params.status);
    }
    if (params.search) {
      const q = params.search.toLowerCase().trim();
      orders = orders.filter((o) => o.orderNumber.toLowerCase().includes(q));
    }
    const page = parseInt(params.page || 1, 10);
    const limit = parseInt(params.limit || 10, 10);
    const start = (page - 1) * limit;

    return response({
      orders: orders.slice(start, start + limit),
      total: orders.length,
      page,
      totalPages: Math.ceil(orders.length / limit) || 1,
    });
  },

  updateOrderStatus: async (id, { status, courier, trackingId }) => {
    await delay();
    const orders = mockStore.getOrders();
    const order = orders.find((o) => o.orderId === id || o.id === id);
    if (!order) throw error('Order not found', 404);

    order.orderStatus = status;
    order.statusHistory = order.statusHistory || [];
    order.statusHistory.push({ status, changedAt: new Date().toISOString() });

    if (courier) order.courier = courier;
    if (trackingId) order.trackingId = trackingId;

    if (status === 'Delivered') {
      order.deliveredAt = new Date().toISOString();
      order.paymentStatus = 'Paid';
    }

    mockStore.setOrders(orders);
    return response({ order });
  },

  getRefunds: async () => {
    await delay();
    const refunds = mockStore.getRefunds();
    return response({ refunds });
  },

  updateRefundStatus: async (id, { status, adminNote }) => {
    await delay();
    const refunds = mockStore.getRefunds();
    const ref = refunds.find((r) => r.refundId === id || r.id === id);
    if (!ref) throw error('Refund claim not found', 404);

    ref.status = status;
    if (adminNote) ref.adminNote = adminNote;
    ref.refundStatusHistory = ref.refundStatusHistory || [];
    ref.refundStatusHistory.push({ status, changedAt: new Date().toISOString() });

    if (status === 'Refunded') {
      const orders = mockStore.getOrders();
      const o = orders.find((ord) => ord.orderId === ref.orderId || ord.orderNumber === ref.order?.orderNumber);
      if (o) o.paymentStatus = 'Refunded';
      mockStore.setOrders(orders);
    }

    mockStore.setRefunds(refunds);
    return response({ refund: ref });
  },

  getReportedReviews: async () => {
    await delay();
    const reviews = mockStore.getReviews().filter((r) => r.reviewStatus === 'Flagged');
    return response({ reviews });
  },

  dismissReviewReport: async (id) => {
    await delay();
    const reviews = mockStore.getReviews();
    const r = reviews.find((rev) => rev.reviewId === id || rev.id === id);
    if (r) {
      r.reviewStatus = 'Active';
      r.reports = [];
      mockStore.setReviews(reviews);
    }
    return response({ message: 'Report dismissed, review is active' });
  },

  removeReview: async (id) => {
    await delay();
    const reviews = mockStore.getReviews();
    const r = reviews.find((rev) => rev.reviewId === id || rev.id === id);
    if (r) {
      r.reviewStatus = 'Removed';
      mockStore.setReviews(reviews);
    }
    return response({ message: 'Review removed from store' });
  },

  getCustomers: async (params = {}) => {
    await delay();
    let customers = mockStore.getUsers().filter((u) => u.role === 'user');
    if (params.search) {
      const q = params.search.toLowerCase().trim();
      customers = customers.filter(
        (c) => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q)
      );
    }
    const orders = mockStore.getOrders();
    const enriched = customers.map((c) => ({
      ...c,
      _count: { orders: orders.filter((o) => o.userId === c.userId).length },
    }));

    return response({ customers: enriched, total: enriched.length, totalPages: 1 });
  },

  updateCustomerStatus: async (id, { isActive, disabledReason }) => {
    await delay();
    const users = mockStore.getUsers();
    const u = users.find((user) => user.userId === id || user.id === id);
    if (!u) throw error('User not found', 404);

    u.isActive = isActive;
    u.disabledReason = disabledReason || null;
    mockStore.setUsers(users);
    return response({ user: u });
  },

  getCoupons: async () => {
    await delay();
    const coupons = mockStore.getCoupons();
    return response({ coupons });
  },

  createCoupon: async (data) => {
    await delay();
    const coupons = mockStore.getCoupons();
    const newCoupon = {
      couponId: `coup-${Date.now()}`,
      ...data,
      code: data.code.toUpperCase().trim(),
    };
    coupons.push(newCoupon);
    mockStore.setCoupons(coupons);
    return response({ coupon: newCoupon });
  },

  updateCoupon: async (id, data) => {
    await delay();
    const coupons = mockStore.getCoupons();
    const idx = coupons.findIndex((c) => c.couponId === id);
    if (idx >= 0) {
      coupons[idx] = { ...coupons[idx], ...data, code: data.code.toUpperCase().trim() };
      mockStore.setCoupons(coupons);
      return response({ coupon: coupons[idx] });
    }
    throw error('Coupon not found', 404);
  },

  deleteCoupon: async (id) => {
    await delay();
    let coupons = mockStore.getCoupons();
    coupons = coupons.filter((c) => c.couponId !== id);
    mockStore.setCoupons(coupons);
    return response({ message: 'Coupon deleted' });
  },
};
