import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Cpu } from 'lucide-react';
import { productApi, categoryApi } from '../api/product.api';
import { ProductCard } from '../components/ProductCard';
import { ParticleHero } from '../components/ParticleHero';

export const HomePage = () => {
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [catRes, prodRes] = await Promise.all([
          categoryApi.getCategories(),
          productApi.getProducts({ limit: 8, sort: 'popularity' }),
        ]);

        setCategories(catRes.data.categories || catRes.data || []);
        setFeaturedProducts(prodRes.data.products || prodRes.data || []);
      } catch (err) {
        console.error('Error fetching homepage data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-16 pb-20">
      {/* High-Stakes Interactive Particle Mesh Hero & Flagship Bento Showcase */}
      <ParticleHero />

      {/* 3D Pop Category Pills */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-sm sm:text-base font-extrabold uppercase tracking-wider text-white">
              Shop By Hardware Division
            </h2>
            <p className="text-xs text-text-muted mt-0.5">Explore specialized engineering divisions</p>
          </div>
          <Link
            to="/products"
            className="text-xs font-semibold text-text-secondary hover:text-white flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {categories.map((cat) => (
            <Link
              key={cat.categoryId || cat.id}
              to={`/products?category=${cat.slug || cat.categoryId}`}
              className="tab-3d p-4 rounded-2xl text-center flex flex-col items-center justify-center gap-2 group"
            >
              <div className="w-9 h-9 rounded-xl bg-bg-elevated flex items-center justify-center text-white group-hover:scale-105 transition-transform">
                <Cpu className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-bold text-text-primary group-hover:text-white uppercase tracking-wider">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-sm sm:text-base font-extrabold uppercase tracking-wider text-white">
              Trending Hardware & Devices
            </h2>
            <p className="text-xs text-text-muted mt-0.5">Customer favorites backed by verified ratings</p>
          </div>
          <Link
            to="/products?sort=popularity"
            className="text-xs font-semibold text-text-secondary hover:text-white flex items-center gap-1"
          >
            <span>See Popular</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="aspect-square bg-bg-card rounded-2xl  animate-pulse" />
            ))}
          </div>
        ) : featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {featuredProducts.map((product) => (
              <ProductCard key={product.productId || product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-bg-card  rounded-2xl">
            <ShoppingBag className="w-10 h-10 text-text-muted mx-auto mb-2" />
            <p className="text-sm font-semibold text-white">No products found</p>
          </div>
        )}
      </section>
    </div>
  );
};
