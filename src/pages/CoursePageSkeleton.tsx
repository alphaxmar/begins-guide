
import { Skeleton } from "@/components/ui/skeleton";

const CoursePageSkeleton = () => {
  return (
    <div className="flex flex-col md:flex-row border rounded-lg overflow-hidden" style={{ height: '80vh' }}>
      <aside className="w-full md:w-80 border-r p-4 space-y-2">
        <Skeleton className="h-8 w-3/4 mb-4" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </aside>
      <main className="flex-1 p-8">
        <Skeleton className="h-8 w-3/4 mb-4" />
        <Skeleton className="aspect-video mb-6" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-5/6" />
      </main>
    </div>
  );
};

export default CoursePageSkeleton;
