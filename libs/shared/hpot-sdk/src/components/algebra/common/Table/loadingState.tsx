import { Skeleton } from "@/components/algebra/ui/skeleton";

export const LoadingState = () => (
  <div className="flex flex-col w-full gap-4 p-4">
    {[1, 2, 3, 4].map((v) => (
      <Skeleton
        key={`table-skeleton-${v}`}
        className="w-full h-[50px] bg-card-light rounded-xl"
      />
    ))}
  </div>
);
