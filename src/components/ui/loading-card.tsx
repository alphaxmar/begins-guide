
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface LoadingCardProps {
  showImage?: boolean;
  showBadge?: boolean;
}

const LoadingCard = ({ showImage = true, showBadge = true }: LoadingCardProps) => {
  return (
    <Card className="overflow-hidden">
      {showImage && <Skeleton className="h-48 w-full" />}
      <CardHeader>
        {showBadge && <Skeleton className="h-4 w-16" />}
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-10 w-full" />
      </CardContent>
    </Card>
  );
};

export { LoadingCard };
