import { Skeleton } from "@/components/ui/skeleton";

interface ManagementHeaderSkeletonProps {
  showAction?: boolean;
  extraFeatures?: number;
}

const ManagementHeaderSkeleton = ({
  showAction = true,
  extraFeatures = 0,
}: ManagementHeaderSkeletonProps) => {
  const controls = Array.from({ length: Math.max(extraFeatures, 0) });

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 pb-4">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-72" />
      </div>

      <div className="flex min-w-2 items-center justify-center gap-2">
        {controls.map((_, index) => (
          <Skeleton
            key={`control-${index}`}
            className="h-9 w-24 rounded-md"
          />
        ))}

        {showAction && <Skeleton className="h-10 w-32 rounded-md" />}
      </div>
    </div>
  );
};

export default ManagementHeaderSkeleton;
