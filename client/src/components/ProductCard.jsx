import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { StarRating } from './StarRating';

export const ProductCard = ({ product }) => {
  const { isAuthenticated } = useAuth();
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const navigate = useNavigate();

  const [adding, setAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const productId = product.productId || product.id;
  const isWishlisted = isInWishlist(productId);

  // Prisma Decimal wrap
  const price = Number(product.price || 0);
  const avgRating = Number(product.avgRating || product.avg_rating || 0);
  const reviewCount = product.reviewCount || product.review_count || 0;

  // Primary image
  const primaryImg =
    product.images?.find((img) => img.isPrimary || img.is_primary)?.imageUrl ||
    product.images?.[0]?.imageUrl ||
    product.productImage ||
    product.imageUrl ||
    'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=600&q=80';

  const inStock = product.stock > 0 && product.isActive !== false;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    try {
      setAdding(true);
      await addToCart(productId, 1);
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 2000);
    } catch (err) {
      alert(err.message || 'Failed to add item to cart');
    } finally {
      setAdding(false);
    }
  };

  const handleToggleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    try {
      await toggleWishlist(productId);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="group relative bg-bg-card rounded-2xl overflow-hidden transition-all duration-200 flex flex-col h-full shadow-[0_4px_16px_rgba(0,0,0,0.35)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.5)]">
      
      {/* Product Image Box */}
      <Link to={`/products/${productId}`} className="block relative aspect-square bg-[#131315] overflow-hidden">
        <img
          src={primaryImg}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=600&q=80';
          }}
        />

        {/* Wishlist Heart Icon (Top Right) */}
        <button
          type="button"
          onClick={handleToggleWishlist}
          title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-150 z-10 shadow-[0_2px_0_0_#0A0A0C] ${
            isWishlisted
              ? 'bg-status-danger text-white'
              : 'bg-black/70 text-text-secondary hover:text-white hover:bg-black/90'
          }`}
        >
          <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Out of Stock Ribbon / Overlay */}
        {!inStock && (
          <div className="absolute inset-0 bg-black/75 flex items-center justify-center">
            <span className="px-3 py-1 bg-neutral-900 text-neutral-300 text-[10px] font-bold rounded-full uppercase tracking-wider">
              Out of Stock
            </span>
          </div>
        )}
      </Link>

      {/* Card Content Details */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-1.5">
            <StarRating rating={avgRating} size={12} />
            <span className="text-[11px] text-text-muted">
              ({reviewCount})
            </span>
          </div>

          {/* Title */}
          <Link to={`/products/${productId}`} className="block group-hover:text-white transition-colors">
            <h3 className="font-bold text-xs text-text-primary uppercase tracking-wider line-clamp-1">
              {product.name}
            </h3>
          </Link>

          {/* Description snippet */}
          {product.description && (
            <p className="text-[11px] text-text-muted line-clamp-2 mt-1 leading-relaxed">
              {product.description}
            </p>
          )}
        </div>

        {/* Pricing + 3D Quick Add Button */}
        <div className="pt-2 flex items-center justify-between gap-2">
          <div>
            <span className="text-[10px] text-text-muted uppercase font-semibold block">Price</span>
            <span className="text-sm font-black text-white tracking-tight">
              ₹{price.toLocaleString('en-IN')}
            </span>
          </div>

          <button
            type="button"
            disabled={!inStock || adding}
            onClick={handleAddToCart}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all duration-150 ${
              justAdded
                ? 'bg-status-success text-white'
                : inStock
                ? 'btn-3d'
                : 'bg-bg-elevated text-text-muted cursor-not-allowed'
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>Added</span>
              </>
            ) : inStock ? (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>{adding ? '...' : 'Add'}</span>
              </>
            ) : (
              'Sold Out'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
