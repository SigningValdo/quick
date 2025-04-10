import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section Skeleton */}
      <section className="bg-warmgray-50 border-b border-gray-200">
        <div className="container py-12 md:py-16">
          <div className="max-w-3xl mx-auto text-center">
            <Skeleton className="h-6 w-32 mx-auto mb-4" />
            <Skeleton className="h-12 w-3/4 mx-auto mb-6" />
            <Skeleton className="h-6 w-full mx-auto mb-2" />
            <Skeleton className="h-6 w-5/6 mx-auto" />
          </div>
        </div>
      </section>

      {/* Featured Collections Carousel Skeleton */}
      <section className="py-16 bg-white">
        <div className="container">
          <Skeleton className="h-8 w-48 mb-8" />
          <div className="aspect-[21/9] rounded-lg overflow-hidden">
            <Skeleton className="h-full w-full" />
          </div>
        </div>
      </section>

      {/* Collections Grid Skeleton */}
      <section className="py-16">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array(9)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="rounded-lg overflow-hidden border border-gray-200">
                  <Skeleton className="aspect-[16/9] w-full" />
                  <div className="p-6 space-y-3">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* CTA Section Skeleton */}
      <section className="py-16 bg-teal-600">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <Skeleton className="h-10 w-2/3 mx-auto mb-6 bg-white/20" />
            <Skeleton className="h-6 w-full mx-auto mb-8 bg-white/20" />
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Skeleton className="h-12 w-48 rounded-full mx-auto sm:mx-0" />
              <Skeleton className="h-12 w-48 rounded-full mx-auto sm:mx-0" />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
