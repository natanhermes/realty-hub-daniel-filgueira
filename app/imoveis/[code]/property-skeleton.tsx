import { Skeleton } from "@/components/ui/skeleton"

export function PropertySkeleton() {
  return (
    <main className="min-h-screen pb-16">
      <div className="container mx-auto px-4 mt-4">
        <div className="bg-background rounded-xl shadow-xl p-4 sm:p-6 md:p-8 mb-8">
          <div className="flex flex-wrap justify-between items-center mb-6">
            <Skeleton className="h-4 w-40" />
            <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
              <Skeleton className="h-8 w-24 sm:w-36" />
              <Skeleton className="h-8 w-24 sm:w-36" />
              <Skeleton className="h-8 w-24 sm:w-36" />
            </div>
          </div>

          <div className="mb-6">
            <Skeleton className="h-8 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2 mb-4" />
            <Skeleton className="h-8 w-32" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 p-3 sm:p-4 bg-muted/30 rounded-lg mb-6 sm:mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                <Skeleton className="h-6 w-6 mb-2" />
                <Skeleton className="h-4 w-16 mb-1" />
                <Skeleton className="h-4 w-10" />
              </div>
            ))}
          </div>

          <div className="mb-6 sm:mb-8">
            <Skeleton className="h-6 w-64 mb-4" />
            <Skeleton className="h-20 w-full" />
          </div>

          <div className="mb-6 sm:mb-8">
            <Skeleton className="h-6 w-64 mb-4" />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
            <div>
              <Skeleton className="h-6 w-64 mb-4" />
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-10 w-full mb-2" />
              ))}
            </div>
            <div>
              <Skeleton className="h-6 w-64 mb-4" />
              <Skeleton className="h-[200px] sm:h-[250px] w-full" />
            </div>
          </div>

          <Skeleton className="h-32 w-full" />
        </div>
      </div>

      <div className="container mx-auto px-4 mt-8 sm:mt-16">
        <Skeleton className="h-6 w-64 mb-6 sm:mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      </div>
    </main>
  )
}
