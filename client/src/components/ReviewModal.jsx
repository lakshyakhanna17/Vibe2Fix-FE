import React, { useState } from 'react';
import { X, Star, Upload } from 'lucide-react';
import { reviewApi } from '../api/order.api';
import { StarRating } from './StarRating';
import { ImageUploader } from './ImageUploader';

export const ReviewModal = ({ isOpen, onClose, productId, productName, onReviewSubmitted }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [images, setImages] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!comment.trim()) {
      setError('Please provide feedback comments.');
      return;
    }

    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append('rating', rating);
      formData.append('comment', comment);

      images.forEach((img) => {
        if (img instanceof File) {
          formData.append('images', img);
        }
      });

      await reviewApi.submitReview(productId, formData);
      onReviewSubmitted && onReviewSubmitted();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Only verified purchasers can review this product.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-bg-card  w-full max-w-lg rounded-2xl p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-text-muted hover:text-white hover:bg-bg-elevated transition"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-1">
          Write a Verified Review
        </h3>
        <p className="text-xs text-text-muted mb-4">
          For product: <span className="text-white font-medium">{productName}</span>
        </p>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-status-danger/15 text-status-danger text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
              Your Rating
            </label>
            <StarRating rating={rating} size={24} interactive onRatingChange={setRating} />
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
              Your Review
            </label>
            <textarea
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="What did you like or dislike? How is the hardware performance?"
              className="w-full p-3 bg-bg-elevated  rounded-xl text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
              Product Photos (Optional)
            </label>
            <ImageUploader images={images} onChange={setImages} maxFiles={3} maxSizeMB={2} />
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-text-secondary hover:text-white transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 bg-accent hover:bg-accent-hover text-black font-semibold text-xs rounded-xl transition shadow-[0_4px_0_0_#000000] disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Post Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
