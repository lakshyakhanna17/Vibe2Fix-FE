import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, Star } from 'lucide-react';
import { adminApi } from '../../api/admin.api';
import { AdminLayout } from './AdminLayout';
import { Pagination } from '../../components/Pagination';
import { ImageUploader } from '../../components/ImageUploader';
import { ConfirmModal } from '../../components/ConfirmModal';

export const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);

  // Modal form state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    categoryIds: [],
    images: [],
  });

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const [prodRes, catRes] = await Promise.all([
        adminApi.getProducts({ page, search, category: selectedCategory, limit: 10 }),
        adminApi.getCategories(),
      ]);
      setProducts(prodRes.data.products || prodRes.data || []);
      setTotalPages(prodRes.data.totalPages || 1);
      setCategories(catRes.data.categories || catRes.data || []);
    } catch (err) {
      console.error('Failed to load admin products', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, search, selectedCategory]);

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      stock: '',
      categoryIds: [],
      images: [],
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (p) => {
    setEditingProduct(p);
    setFormData({
      name: p.name,
      description: p.description || '',
      price: Number(p.price),
      stock: p.stock,
      categoryIds: p.categories ? p.categories.map((c) => c.categoryId || c.id) : [],
      images: p.images ? p.images.map((img) => img.imageUrl) : [],
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('description', formData.description);
      data.append('price', formData.price);
      data.append('stock', formData.stock);

      formData.categoryIds.forEach((cId) => data.append('categoryIds', cId));

      formData.images.forEach((img) => {
        if (img instanceof File) {
          data.append('images', img);
        }
      });

      if (editingProduct) {
        await adminApi.updateProduct(editingProduct.productId || editingProduct.id, data);
      } else {
        await adminApi.createProduct(data);
      }

      setModalOpen(false);
      await fetchProducts();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save product');
    }
  };

  const handleDelete = async () => {
    try {
      await adminApi.deleteProduct(deleteConfirmId);
      setDeleteConfirmId(null);
      await fetchProducts();
    } catch (err) {
      alert('Failed to soft delete product');
    }
  };

  return (
    <AdminLayout
      title="Hardware Catalog & Inventory Manager"
      subtitle="Create, edit specifications, upload photos, and monitor stock levels"
    >
      <div className="space-y-6">
        
        {/* Actions bar - Borderless inputs and buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1 max-w-xl">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-text-muted" />
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search products by title or specs..."
                className="w-full pl-10 pr-4 py-2.5 bg-bg-card rounded-2xl text-xs text-white placeholder:text-text-muted focus:outline-none shadow-[0_4px_16px_rgba(0,0,0,0.3)]"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setPage(1);
              }}
              className="px-3.5 py-2.5 bg-bg-card rounded-2xl text-xs text-text-primary focus:outline-none shadow-[0_4px_16px_rgba(0,0,0,0.3)] cursor-pointer"
            >
              <option value="">All Categories (32 products)</option>
              {categories.map((cat) => (
                <option key={cat.categoryId || cat.id} value={cat.slug || cat.categoryId}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleOpenAdd}
            className="btn-3d px-5 py-2.5 text-xs rounded-2xl flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add New Product</span>
          </button>
        </div>

        {/* Seamless Borderless Table Container with Deep Drop Shadow */}
        <div className="bg-bg-card rounded-3xl overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.55)]">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="text-[11px] font-bold uppercase tracking-wider text-text-muted bg-bg-elevated/80 select-none">
                <tr>
                  <th className="py-4 px-6">Product</th>
                  <th className="py-4 px-4">Price</th>
                  <th className="py-4 px-4">Stock</th>
                  <th className="py-4 px-4">Rating</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p, idx) => {
                  const id = p.productId || p.id;
                  const price = Number(p.price || 0);
                  const isStockLow = p.stock <= 5;
                  const primaryImg =
                    p.images?.find((img) => img.isPrimary || img.is_primary)?.imageUrl ||
                    p.images?.[0]?.imageUrl ||
                    p.productImage ||
                    'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=200&q=80';

                  return (
                    <tr
                      key={id}
                      className={`hover:bg-bg-elevated/50 transition-colors duration-150 group ${
                        idx % 2 === 0 ? 'bg-bg-card' : 'bg-[#151517]'
                      }`}
                    >
                      {/* Product Name & Visual Thumbnail */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3.5">
                          <img
                            src={primaryImg}
                            alt={p.name}
                            className="w-11 h-11 rounded-2xl object-cover bg-bg-elevated flex-shrink-0 shadow-[0_4px_10px_rgba(0,0,0,0.4)] group-hover:scale-105 transition-transform"
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=200&q=80';
                            }}
                          />
                          <div className="min-w-0 max-w-sm">
                            <div className="font-bold text-white text-xs uppercase tracking-wide truncate group-hover:text-neutral-200 transition-colors">
                              {p.name}
                            </div>
                            <p className="text-[11px] text-text-muted truncate mt-0.5 leading-relaxed">
                              {p.description || 'Hardware components & modules'}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Price Column */}
                      <td className="py-4 px-4 font-mono font-bold text-white text-sm whitespace-nowrap">
                        ₹{price.toLocaleString('en-IN')}
                      </td>

                      {/* Tactile 3D Stock Pill (No Thin Borders) */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold shadow-[0_2px_0_0_#0A0A0C] ${
                            isStockLow
                              ? 'bg-[#2A2016] text-amber-400'
                              : 'bg-[#162720] text-emerald-400'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isStockLow ? 'bg-amber-400' : 'bg-emerald-400'
                            }`}
                          />
                          {p.stock} in stock
                        </span>
                      </td>

                      {/* Rating Column */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 font-semibold text-white">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{Number(p.avgRating || 0).toFixed(1)}</span>
                          <span className="text-text-muted text-[11px] font-normal">
                            ({p.reviewCount || 0})
                          </span>
                        </div>
                      </td>

                      {/* Active Status Badge */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-[0_2px_0_0_#0A0A0C] ${
                            p.isActive !== false
                              ? 'bg-bg-elevated text-neutral-300'
                              : 'bg-[#2B1717] text-red-400'
                          }`}
                        >
                          {p.isActive !== false ? 'Active' : 'Archived'}
                        </span>
                      </td>

                      {/* Actions with Borderless 3D Tactile Buttons */}
                      <td className="py-4 px-6 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2.5">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(p)}
                            className="p-2.5 rounded-xl bg-bg-elevated text-text-secondary hover:text-white transition-all shadow-[0_3px_0_0_#0A0A0C] active:translate-y-0.5"
                            title="Edit Product"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmId(id)}
                            className="p-2.5 rounded-xl bg-bg-elevated text-text-secondary hover:text-status-danger transition-all shadow-[0_3px_0_0_#0A0A0C] active:translate-y-0.5"
                            title="Archive Product"
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

          <div className="p-4 bg-bg-elevated/40">
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="bg-bg-card w-full max-w-xl rounded-3xl p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.8)] max-h-[90vh] overflow-y-auto space-y-4">
            <h3 className="text-base font-bold text-white uppercase tracking-wider">
              {editingProduct ? 'Edit Hardware Product' : 'Add New Hardware Product'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-text-secondary uppercase mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-3 bg-bg-elevated rounded-2xl text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-text-secondary uppercase mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-3 bg-bg-elevated rounded-2xl text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-text-secondary uppercase mb-1">
                    Price (INR) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full p-3 bg-bg-elevated rounded-2xl text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-text-secondary uppercase mb-1">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full p-3 bg-bg-elevated rounded-2xl text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-text-secondary uppercase mb-1">
                  Hardware Categories
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {categories.map((c) => {
                    const cId = c.categoryId || c.id;
                    const isChecked = formData.categoryIds.includes(cId);
                    return (
                      <label key={cId} className="flex items-center gap-2 p-2.5 bg-bg-elevated rounded-xl cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({ ...formData, categoryIds: [...formData.categoryIds, cId] });
                            } else {
                              setFormData({
                                ...formData,
                                categoryIds: formData.categoryIds.filter((id) => id !== cId),
                              });
                            }
                          }}
                        />
                        <span className="text-white truncate">{c.name}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-text-secondary uppercase mb-1">
                  Product Images (Max 5MB each, JPEG/PNG/WebP)
                </label>
                <ImageUploader
                  images={formData.images}
                  onChange={(imgs) => setFormData({ ...formData, images: imgs })}
                  maxFiles={5}
                  maxSizeMB={5}
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-text-secondary hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-3d px-5 py-2.5 text-xs rounded-xl"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={handleDelete}
        title="Soft Delete Product?"
        message="This product will be archived and hidden from the customer storefront."
        confirmText="Archive"
        danger
      />
    </AdminLayout>
  );
};
