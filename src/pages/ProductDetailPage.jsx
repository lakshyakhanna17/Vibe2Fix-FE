import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Heart, 
  ShoppingBag, 
  Check, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Star, 
  MessageSquare,
  AlertTriangle,
  Flag,
  Share2
} from 'lucide-react';
import { productApi } from '../api/product.api';
import { reviewApi } from '../api/order.api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { StarRating } from '../components/StarRating';
import { QuantitySelector } from '../components/QuantitySelector';
import { ReviewModal } from '../components/ReviewModal';

export const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { addToCart, toggleWishlist, isInWishlist } = useCart();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);

  // Review modal state
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(null);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const [prodRes, revRes] = await Promise.all([
        productApi.getProductById(id),
        productApi.getProductReviews(id),
      ]);

      const prodData = prodRes.data.product || prodRes.data;
      setProduct(prodData);
      setReviews(revRes.data.reviews || revRes.data || []);

      const primary =
        prodData.images?.find((img) => img.isPrimary || img.is_primary)?.imageUrl ||
        prodData.images?.[0]?.imageUrl ||
        prodData.productImage ||
        'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80';
      setSelectedImage(primary);
    } catch (err) {
      console.error('Failed to load product detail', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 flex justify-center items-center">
        <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <p className="text-lg font-bold text-white">Product not found</p>
        <button
          onClick={() => navigate('/products')}
          className="px-4 py-2 bg-accent text-black font-semibold text-xs rounded-xl"
        >
          Return to Catalog
        </button>
      </div>
    );
  }

  const productId = product.productId || product.id;
  const isWishlisted = isInWishlist(productId);
  const price = Number(product.price || 0);
  const avgRating = Number(product.avgRating || product.avg_rating || 0);
  const reviewCount = product.reviewCount || product.review_count || 0;
  const inStock = product.stock > 0 && product.isActive !== false;

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    try {
      setAddingToCart(true);
      await addToCart(productId, quantity);
      setAddedSuccess(true);
      setTimeout(() => setAddedSuccess(false), 2000);
    } catch (err) {
      alert(err.message || 'Failed to add item to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleReportReview = async (reviewId) => {
    const reason = prompt('Please describe why you are reporting this review (e.g., abusive, spam, misleading):');
    if (!reason || !reason.trim()) return;

    try {
      await reviewApi.reportReview(reviewId, reason.trim());
      setReportSuccess('Review has been reported for admin moderation.');
      setTimeout(() => setReportSuccess(null), 3000);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to report review');
    }
  };

  const imagesList = product.images?.length > 0
    ? product.images.map((img) => img.imageUrl)
    : [selectedImage];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      
      {/* Product Main Display Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* Left: Product Gallery */}
        <div className="space-y-4">
          <div className="aspect-square bg-bg-card rounded-3xl  overflow-hidden relative">
            <img
              src={selectedImage}
              alt={product.name}
              className="w-full h-full object-cover object-center"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80';
              }}
            />
            {!inStock && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center">
                <span className="px-4 py-1.5 bg-red-500/80 text-white text-xs font-semibold rounded-full uppercase tracking-wider">
                  Out of Stock
                </span>
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {imagesList.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {imagesList.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(imgUrl)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 flex-shrink-0 transition ${
                    selectedImage === imgUrl ? 'border-accent' : ' opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={imgUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Actions & Specs */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <StarRating rating={avgRating} size={16} />
              <span className="text-xs font-semibold text-white">{avgRating.toFixed(1)}</span>
              <span className="text-xs text-text-muted">({reviewCount} customer reviews)</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-wide leading-tight">
              {product.name}
            </h1>
          </div>

          {/* Price Box */}
          <div className="p-4 bg-bg-card  rounded-2xl flex items-baseline justify-between">
            <div>
              <span className="text-xs text-text-muted block">Direct Price</span>
              <div className="text-3xl font-black text-white tracking-tight">
                ₹{price.toLocaleString('en-IN')}
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs text-text-muted block">Stock Status</span>
              {inStock ? (
                <span className="text-xs font-semibold text-status-success">
                  In Stock ({product.stock} units available)
                </span>
              ) : (
                <span className="text-xs font-semibold text-status-danger">
                  Currently Sold Out
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider">
              Product Overview
            </h3>
            <p className="text-xs text-text-muted leading-relaxed whitespace-pre-line">
              {product.description || 'No detailed specifications provided for this hardware component.'}
            </p>
          </div>

          {/* Purchase Controls */}
          {inStock && (
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-4">
                <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Quantity:
                </span>
                <QuantitySelector
                  value={quantity}
                  min={1}
                  max={Math.min(product.stock, 10)}
                  onChange={setQuantity}
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  disabled={addingToCart}
                  onClick={handleAddToCart}
                  className={`flex-1 py-4 px-6 rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-200 ${
                    addedSuccess
                      ? 'bg-status-success text-white'
                      : 'bg-accent hover:bg-accent-hover text-black shadow-[0_4px_0_0_#000000]'
                  }`}
                >
                  {addedSuccess ? (
                    <>
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>Added to Shopping Cart</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>{addingToCart ? 'Adding...' : 'Add to Cart'}</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => toggleWishlist(productId)}
                  className={`p-4 rounded-2xl border transition ${
                    isWishlisted
                      ? 'bg-status-danger/10 border-status-danger text-status-danger'
                      : 'bg-bg-card  text-text-secondary hover:text-white hover:bg-bg-elevated'
                  }`}
                  title="Save to Wishlist"
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>
          )}

          {/* Delivery & Assurance Pills */}
          <div className="grid grid-cols-2 gap-3 pt-4  text-xs">
            <div className="p-3 bg-bg-card  rounded-xl flex items-center gap-2.5">
              <Truck className="w-4 h-4 text-accent" />
              <div>
                <p className="font-semibold text-white">Flat ₹50 Delivery</p>
                <p className="text-[10px] text-text-muted">Free above ₹500</p>
              </div>
            </div>

            <div className="p-3 bg-bg-card  rounded-xl flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-accent" />
              <div>
                <p className="font-semibold text-white">Cash on Delivery</p>
                <p className="text-[10px] text-text-muted">Pay at delivery</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <section className="pt-8  space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold uppercase tracking-wider text-white">
              Verified Purchaser Reviews ({reviews.length})
            </h2>
            <p className="text-xs text-text-muted mt-0.5">
              Only verified customers with delivered orders may rate and review
            </p>
          </div>

          {isAuthenticated && (
            <button
              onClick={() => setReviewModalOpen(true)}
              className="px-4 py-2.5 bg-bg-elevated hover:bg-bg-border  hover:border-accent text-white text-xs font-semibold rounded-xl flex items-center gap-2 transition"
            >
              <MessageSquare className="w-3.5 h-3.5 text-accent" />
              <span>Write a Review</span>
            </button>
          )}
        </div>

        {reportSuccess && (
          <div className="p-3 rounded-xl bg-status-success/10 border border-status-success/30 text-status-success text-xs">
            {reportSuccess}
          </div>
        )}

        {reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((rev) => (
              <div
                key={rev.reviewId || rev.id}
                className="bg-bg-card  rounded-2xl p-5 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center text-accent font-bold text-xs uppercase">
                      {rev.user?.name?.[0] || 'U'}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white">{rev.user?.name || 'Verified Buyer'}</p>
                      <p className="text-[10px] text-text-muted">
                        Reviewed on {new Date(rev.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <StarRating rating={rev.rating} size={14} />
                    {user?.id !== rev.userId && isAuthenticated && (
                      <button
                        onClick={() => handleReportReview(rev.reviewId || rev.id)}
                        className="text-text-muted hover:text-status-danger p-1 text-[11px] flex items-center gap-1 transition"
                        title="Report abusive review"
                      >
                        <Flag className="w-3 h-3" />
                        <span className="hidden sm:inline">Report</span>
                      </button>
                    )}
                  </div>
                </div>

                <p className="text-xs text-text-secondary leading-relaxed">{rev.comment}</p>

                {/* Review Photos */}
                {rev.images && rev.images.length > 0 && (
                  <div className="flex gap-2 pt-1">
                    {rev.images.map((img, i) => (
                      <img
                        key={i}
                        src={img.imageUrl || img}
                        alt="Review upload"
                        className="w-16 h-16 rounded-lg object-cover "
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-bg-card  rounded-2xl space-y-2">
            <MessageSquare className="w-8 h-8 text-text-muted mx-auto" />
            <p className="text-xs text-text-muted">
              No customer reviews yet. Be the first verified buyer to leave feedback!
            </p>
          </div>
        )}
      </section>

      {/* Write Review Modal */}
      <ReviewModal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        productId={productId}
        productName={product.name}
        onReviewSubmitted={fetchProduct}
      />
    </div>
  );
};
