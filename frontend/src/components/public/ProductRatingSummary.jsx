import React, { useMemo } from 'react';
import { Star } from 'lucide-react';

// Re-usable StarRating component (matching screenshot style)
const StarRating = ({ rating, size = "h-5 w-5" }) => {
  const stars = [];
  const roundedRating = Math.round(rating * 2) / 2; // Rounds to nearest 0.5
  for (let i = 1; i <= 5; i++) {
    if (i <= roundedRating) {
      stars.push(<Star key={i} className={`${size} fill-blue-500 text-blue-500`} />);
    } else {
      stars.push(<Star key={i} className={`${size} text-gray-300`} />);
    }
  }
  return <div className="flex items-center">{stars}</div>;
};

export const ProductRatingSummary = ({ reviews, questions, onTabSelect }) => {
  // Calculate average rating
  const avgRating = useMemo(() => {
    if (!reviews || reviews.length === 0) return 0;
    const total = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (total / reviews.length).toFixed(1); // e.g., "4.9"
  }, [reviews]);

  if (reviews.length === 0 && questions.length === 0) {
    return null; // Don't show anything if there are no reviews or questions
  }

  return (
    <div className="mt-4 flex items-center space-x-3 divide-x divide-gray-300">
      {reviews.length > 0 && (
        <div className="flex items-center space-x-2">
          <StarRating rating={avgRating} />
          <span className="font-semibold text-blue-600">{avgRating}/5.0</span>
          <button 
            onClick={() => onTabSelect('reviews')} 
            className="text-sm text-gray-600 hover:underline me-3 cursor-pointer"
          >
            {reviews.length} Reviews
          </button>
        </div>
      )}
      {questions.length > 0 && (
        <div className="pl-3">
          <button 
            onClick={() => onTabSelect('questions')} 
            className="text-sm text-gray-600 hover:underline cursor-pointer"
          >
            {questions.length} Questions
          </button>
        </div>
      )}
    </div>
  );
}; 