import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, PackageX } from 'lucide-react';
import { productApi, categoryApi } from '../api/product.api';
import { ProductCard } from '../components/ProductCard';
import { ProductFilters } from '../components/ProductFilters';
import { Pagination } from '../components/Pagination';

export const ProductListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filters state initialized from query params
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    maxPrice: searchParams.get('maxPrice') || '50000',
    minRating: searchParams.get('minRating') || '',
    inStock: searchParams.get('inStock') === 'true',
    sort: searchParams.get('sort') || 'newest',
    page: parseInt(searchParams.get('page') || '1', 10),
  });

  // Debounced search text state (Doc requirement: 300 ms debounce)
  const [searchTerm, setSearchTerm] = useState(filters.search);
  const debounceTimerRef = useRef(null);

  // Load categories
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await categoryApi.getCategories();
        setCategories(res.data.categories || res.data || []);
      } catch (err) {
        console.error('Failed to load categories', err);
      }
    };
    fetchCats();
  }, []);

  // Sync state if URL query params change (e.g. from navbar clicks)
  useEffect(() => {
    const queryCategory = searchParams.get('category') || '';
    const querySearch = searchParams.get('search') || '';
    setFilters((prev) => ({
      ...prev,
      category: queryCategory,
      search: querySearch,
    }));
    setSearchTerm(querySearch);
  }, [searchParams]);

  // Debounce search input (300 ms)
  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchTerm(val);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: val, page: 1 }));
    }, 300);
  };

  // Fetch products whenever filters update
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const params = {
          page: filters.page,
          limit: 12,
          sort: filters.sort,
          ...(filters.search && { search: filters.search }),
          ...(filters.category && { category: filters.category }),
          ...(filters.maxPrice && { maxPrice: filters.maxPrice }),
          ...(filters.minRating && { minRating: filters.minRating }),
          ...(filters.inStock && { inStock: true }),
        };

        const res = await productApi.getProducts(params);
        const fetchedProducts = res.data.products || res.data || [];
        setProducts(fetchedProducts);
        setTotalPages(res.data.totalPages || res.data.pages || 1);
      } catch (err) {
        console.error('Failed to load products', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filters]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setFilters({
      search: '',
      category: '',
      maxPrice: '50000',
      minRating: '',
      inStock: false,
      sort: 'newest',
      page: 1,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Search Header Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-bg-card rounded-3xl p-4 shadow-[0_8px_30px_rgba(0,0,0,0.35)]">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-4 top-3.5 text-neutral-400 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search catalog by hardware specifications, model, or brand..."
            className="w-full pl-11 pr-4 py-3 bg-[#212126] hover:bg-[#282830] focus:bg-[#2B2B34] rounded-2xl text-xs sm:text-sm text-white placeholder:text-neutral-400 font-medium focus:outline-none transition-all duration-200 shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]"
          />
        </div>

        <button
          type="button"
          onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
          className="lg:hidden flex items-center justify-center gap-2 px-4 py-2.5 bg-bg-elevated rounded-2xl text-xs font-semibold text-white shadow"
        >
          <SlidersHorizontal className="w-4 h-4 text-accent" />
          <span>Toggle Filters</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Filter Sidebar */}
        <div className="hidden lg:block lg:col-span-1">
          <ProductFilters
            categories={categories}
            filters={filters}
            onChange={setFilters}
            onReset={handleResetFilters}
          />
        </div>

        {/* Mobile Filter Drawer */}
        {mobileFilterOpen && (
          <div className="lg:hidden col-span-1">
            <ProductFilters
              categories={categories}
              filters={filters}
              onChange={(f) => {
                setFilters(f);
                setMobileFilterOpen(false);
              }}
              onReset={handleResetFilters}
            />
          </div>
        )}

        {/* Product Grid / Results */}
        <main className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between text-xs text-text-muted  pb-3">
            <span>
              Showing <span className="text-white font-semibold">{products.length}</span> hardware results
            </span>
            {filters.category && (
              <span className="text-accent font-medium">
                Category: {filters.category}
              </span>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="aspect-square bg-bg-card rounded-2xl animate-pulse " />
              ))}
            </div>
          ) : products.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                {products.map((product) => (
                  <ProductCard key={product.productId || product.id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              <Pagination
                currentPage={filters.page}
                totalPages={totalPages}
                onPageChange={(p) => setFilters((prev) => ({ ...prev, page: p }))}
              />
            </>
          ) : (
            <div className="text-center py-20 bg-bg-card  rounded-2xl space-y-3">
              <PackageX className="w-12 h-12 text-text-muted mx-auto" />
              <h3 className="text-base font-bold text-white uppercase tracking-wider">No Products Found</h3>
              <p className="text-xs text-text-muted max-w-sm mx-auto">
                No catalog items matched your selected filter criteria. Try resetting price, rating, or search terms.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 bg-bg-elevated hover:bg-bg-border text-white text-xs font-semibold rounded-xl  transition"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
