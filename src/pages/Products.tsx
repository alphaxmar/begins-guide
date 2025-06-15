
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import ProductCard from "@/components/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Tables } from "@/integrations/supabase/types";

const fetchProducts = async () => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data;
};

const Products = () => {
  const { data: products, isLoading } = useQuery<Tables<'products'>[]>({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  return (
    <div className="py-12">
      <h1 className="text-3xl font-bold text-center mb-8">สินค้าทั้งหมด</h1>
      
      {isLoading ? (
        <div className="grid gap-8 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="space-y-4">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
      ) : products && products.length > 0 ? (
        <div className="grid gap-8 md:grid-cols-2">
          {products.map((product) => (
            <ProductCard
              key={product.slug}
              {...product}
              imageUrl={product.image_url || ""}
              description={product.description || ""}
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground">
          ยังไม่มีสินค้าในขณะนี้ จะถูกเพิ่มเข้ามาเร็วๆ นี้
        </p>
      )}
    </div>
  );
};

export default Products;
