
import { DashboardClient } from "@/components/dashboard/dashboard-client";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardClient />
    </Suspense>
  );
}


function DashboardSkeleton() {
    return (
      <div className="flex flex-col h-screen">
        <header className="flex items-center h-16 px-4 border-b shrink-0 md:px-6">
          <Skeleton className="h-8 w-32" />
          <div className="ml-auto">
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        </header>
        <div className="flex flex-1">
            <div className="hidden md:block w-64 border-r p-2">
                <Skeleton className="h-10 w-full mb-2" />
                <Skeleton className="h-12 w-full mb-1" />
                <Skeleton className="h-12 w-full mb-1" />
                <Skeleton className="h-12 w-full mb-1" />
            </div>
            <div className="flex-1 p-4 space-y-4">
              <Skeleton className="h-20 w-3/4" />
              <Skeleton className="h-20 w-3/4 ml-auto" />
              <Skeleton className="h-20 w-3/4" />
            </div>
        </div>
      </div>
    );
  }
