
import { Star } from 'lucide-react';

interface RatingDisplayProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

const RatingDisplay = ({ 
  rating, 
  maxRating = 5, 
  size = 'md',
  showText = true 
}: RatingDisplayProps) => {
  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {Array.from({ length: maxRating }, (_, index) => {
          const starValue = index + 1;
          const isFilled = rating >= starValue;
          const isHalfFilled = rating >= starValue - 0.5 && rating < starValue;

          return (
            <Star
              key={index}
              className={`${sizeClasses[size]} ${
                isFilled
                  ? 'fill-yellow-400 text-yellow-400'
                  : isHalfFilled
                  ? 'fill-yellow-200 text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          );
        })}
      </div>
      {showText && (
        <span className={`${textSizeClasses[size]} text-muted-foreground ml-1`}>
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
};

export default RatingDisplay;
