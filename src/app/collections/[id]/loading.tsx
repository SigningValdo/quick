import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section Skeleton */}
      <section className="relative bg-gray-900 text-white">
        <div className="container relative z-10 py-16 md:py-24">
          <Skeleton className="h-6 w-40 bg-white/20 mb-8" />
          <Skeleton className="h-8 w-32 bg-white/20 mb-4" />
          <Skeleton className="h-12 w-3/4 bg-white/20 mb-6" />
          <Skeleton className="h-6 w-full bg-white/20 mb-2" />
          <Skeleton className="h-6 w-5/6 bg-white/20 mb-8" />
          <Skeleton className="h-4 w-32 bg-white/20" />
        </div>
      </section>

      {/* Projects Grid Skeleton */}
      <section className="py-16">
        <div className="container">
          <Skeleton className="h-8 w-64 mb-8" />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(9)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="rounded-lg overflow-hidden border border-gray-200 h-full">
                  <Skeleton className="aspect-[16/10] w-full" />
                  <div className="p-5 space-y-3">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-2.5 w-full rounded-full" />
                    <div className="flex justify-between pt-1">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <div className="flex justify-between pt-2">
                      <Skeleton className="h-6 w-6 rounded-full" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* Related Collections Skeleton */}
      <section className="py-16 bg-warmgray-50">
        <div className="container">
          <Skeleton className="h-8 w-64 mb-8" />

          <div className="grid md:grid-cols-3 gap-6">
            {Array(3)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="rounded-lg overflow-hidden border border-gray-200 h-full">
                  <Skeleton className="aspect-[16/9] w-full" />
                  <div className="p-6 space-y-3">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>
    </div>
  )
}
