import React from 'react';
import { Star } from 'lucide-react';

export const StarRating = ({ rating = 0, size = 16, interactive = false, onRatingChange }) => {
  const roundedRating = Math.round(Number(rating));

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = star <= roundedRating;
        return (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onRatingChange && onRatingChange(star)}
            className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'} p-0.5`}
          >
            <Star
              size={size}
              className={`${
                isFilled
                  ? 'fill-amber-400 text-amber-400'
                  : 'fill-transparent text-bg-border hover:text-amber-300'
              } transition-colors`}
            />
          </button>
        );
      })}
    </div>
  );
};
