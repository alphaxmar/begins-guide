
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOpenCheck } from "lucide-react";
import { Tables } from "@/integrations/supabase/types";

interface ProductEditHeaderProps {
  product: Tables<'products'>;
}

const ProductEditHeader = ({ product }: ProductEditHeaderProps) => {
  if (!product || product.product_type !== 'course') {
    return null;
  }

  return (
    <div className="flex justify-end mb-4">
      <Link to={`/admin/products/${product.slug}/lessons`}>
        <Button variant="outline">
          <BookOpenCheck className="mr-2 h-4 w-4" />
          จัดการบทเรียน
        </Button>
      </Link>
    </div>
  );
};

export default ProductEditHeader;
