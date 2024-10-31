import { StarIcon } from "lucide-react";
import { Button } from "../ui/button";

function StarReview({ rating, handleRating, size }) { 
  return [1, 2, 3, 4, 5].map((star) => (
    <Button
      variant="outline"
      className={`rounded-lg ${
        star <= rating
          ? "text-yellow-500 hover:bg-black"
          : "text-black hover:bg-primary hover:text-primary-foreground"
      }`}
      key={star}
    >
      <StarIcon
        onClick={handleRating ? () => handleRating(star) : null}
        className={`w-${size} h-${size} ${star <= rating ? "fill-yellow-500" : ""}`}  
      />
    </Button>
  ));
}

export default StarReview;
