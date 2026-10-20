import { cn } from "@/lib/cn";

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("skeleton rounded-card", className)} aria-hidden />;
}

/** Full-page loading state used while IndexedDB hydrates. */
export function PageSkeleton() {
  return (
    <div className="space-y-4 px-5 pt-6" aria-busy="true" aria-live="polite">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-8 w-52" />
      <Skeleton className="h-40 w-full rounded-card-lg" />
      <div className="grid grid-cols-2 gap-3">
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
      </div>
      <Skeleton className="h-20 w-full" />
      <span className="sr-only">加载中</span>
    </div>
  );
}
