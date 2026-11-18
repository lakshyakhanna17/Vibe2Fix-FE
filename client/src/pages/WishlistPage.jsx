import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { ProductCard } from '../components/ProductCard';

export const WishlistPage = () => {
  const { wishlist, refreshWishlist } = useCart();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-2xl font-black text-white uppercase tracking-wider flex items-center gap-2">
          <Heart className="w-6 h-6 text-status-danger fill-status-danger" />
          <span>My Saved Wishlist ({wishlist.length})</span>
        </h1>
        <p className="text-xs text-text-muted mt-1">
          Save devices and products to purchase later or move directly into your cart
        </p>
      </div>

      {wishlist.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {wishlist.map((item) => {
            const product = item.product || item;
            return (
              <ProductCard
                key={item.wishlistItemId || product.productId || product.id}
                product={product}
              />
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 bg-bg-card  rounded-2xl space-y-4">
          <Heart className="w-12 h-12 text-text-muted mx-auto stroke-[1.5]" />
          <h2 className="text-lg font-bold text-white uppercase tracking-wider">Your Wishlist is Empty</h2>
          <p className="text-xs text-text-muted max-w-sm mx-auto">
            Explore our hardware catalog and click the heart icon on any product to save it here.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-black font-bold text-xs uppercase tracking-wider rounded-xl shadow-[0_4px_0_0_#000000]"
          >
            <span>Browse Products</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
};
