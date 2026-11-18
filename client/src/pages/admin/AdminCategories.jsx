import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Layers } from 'lucide-react';
import { adminApi } from '../../api/admin.api';
import { AdminLayout } from './AdminLayout';
import { ConfirmModal } from '../../components/ConfirmModal';

export const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
  });

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getCategories();
      setCategories(res.data.categories || res.data || []);
    } catch (err) {
      console.error('Failed to load categories', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setFormData({ name: '', slug: '', description: '' });
    setModalOpen(true);
  };

  const handleOpenEdit = (c) => {
    setEditingCategory(c);
    setFormData({
      name: c.name,
      slug: c.slug,
      description: c.description || '',
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await adminApi.updateCategory(editingCategory.categoryId || editingCategory.id, formData);
      } else {
        await adminApi.createCategory(formData);
      }
      setModalOpen(false);
      await fetchCategories();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save category');
    }
  };

  const handleDelete = async () => {
    try {
      await adminApi.deleteCategory(deleteConfirmId);
      setDeleteConfirmId(null);
      await fetchCategories();
    } catch (err) {
      alert('Failed to delete category');
    }
  };

  return (
    <AdminLayout
      title="Hardware Category Architecture"
      subtitle="Organize products into navigable divisions and homepage carousels"
    >
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <p className="text-xs text-text-muted">
            Total active divisions: <span className="text-white font-bold">{categories.length}</span>
          </p>

          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 bg-accent text-black font-semibold text-xs rounded-xl flex items-center gap-1.5 hover:bg-accent-hover transition shadow-[0_4px_0_0_#000000]"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Category</span>
          </button>
        </div>

        {/* Categories Table - Seamless Borderless with Deep Shadow */}
        <div className="bg-bg-card rounded-3xl overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.5)]">
          <table className="w-full text-xs text-left">
            <thead className="text-[11px] uppercase tracking-wider text-text-muted bg-bg-elevated/70">
              <tr>
                <th className="py-3.5 px-4">Name</th>
                <th className="py-3.5 px-4">URL Slug</th>
                <th className="py-3.5 px-4">Description</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => {
                const id = c.categoryId || c.id;
                return (
                  <tr key={id} className="hover:bg-bg-elevated/40 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-white uppercase tracking-wider">
                      {c.name}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-accent">{c.slug}</td>
                    <td className="py-3.5 px-4 text-text-muted">{c.description || '—'}</td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(c)}
                          className="p-1.5 text-text-muted hover:text-white hover:bg-bg-elevated rounded-lg transition"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(id)}
                          className="p-1.5 text-text-muted hover:text-status-danger hover:bg-bg-elevated rounded-lg transition"
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
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-bg-card w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white uppercase tracking-wider">
              {editingCategory ? 'Edit Category' : 'Create Category'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-text-secondary uppercase mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    setFormData({
                      ...formData,
                      name,
                      slug: !editingCategory
                        ? name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
                        : formData.slug,
                    });
                  }}
                  className="w-full p-2.5 bg-bg-elevated rounded-xl text-white shadow-inner focus:outline-none focus:bg-[#28282D]"
                />
              </div>

              <div>
                <label className="block font-semibold text-text-secondary uppercase mb-1">
                  Slug (URL key) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full p-2.5 bg-bg-elevated rounded-xl text-white font-mono shadow-inner focus:outline-none focus:bg-[#28282D]"
                />
              </div>

              <div>
                <label className="block font-semibold text-text-secondary uppercase mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2.5 bg-bg-elevated rounded-xl text-white shadow-inner focus:outline-none focus:bg-[#28282D]"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-text-secondary hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-accent text-black font-semibold rounded-xl hover:bg-accent-hover transition"
                >
                  Save Division
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={handleDelete}
        title="Delete Category?"
        message="This category will be removed from navigation tabs."
        danger
      />
    </AdminLayout>
  );
};
