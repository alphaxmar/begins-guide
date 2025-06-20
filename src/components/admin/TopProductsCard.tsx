
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTopSellingProducts } from "@/hooks/useAdminStats";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Badge } from "@/components/ui/badge";

const TopProductsCard = () => {
  const { data: topProducts, isLoading } = useTopSellingProducts(5);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>สินค้าขายดี Top 5</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <LoadingSpinner />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>สินค้าขายดี Top 5</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topProducts?.map((product, index) => (
            <div key={product.product_id} className="flex items-center justify-between p-3 rounded-lg border">
              <div className="flex items-center space-x-3">
                <Badge variant="secondary" className="text-sm">
                  #{index + 1}
                </Badge>
                <div>
                  <h4 className="font-medium text-sm">{product.product_title}</h4>
                  <p className="text-xs text-muted-foreground">
                    ราคา: ฿{Number(product.product_price).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-sm">{product.total_sales} ยอดขาย</p>
                <p className="text-xs text-muted-foreground">
                  รายได้: ฿{Number(product.total_revenue).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
          {(!topProducts || topProducts.length === 0) && (
            <p className="text-center text-muted-foreground py-8">ยังไม่มีข้อมูลยอดขาย</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TopProductsCard;
