import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section Skeleton */}
      <section className="bg-teal-600 py-16">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <Skeleton className="h-12 w-12 rounded-full mx-auto mb-4 bg-white/20" />
            <Skeleton className="h-12 w-3/4 mx-auto mb-6 bg-white/20" />
            <Skeleton className="h-6 w-full mx-auto mb-2 bg-white/20" />
            <Skeleton className="h-6 w-5/6 mx-auto bg-white/20" />
          </div>
        </div>
      </section>

      {/* Featured Trending Projects Carousel Skeleton */}
      <section className="py-16 bg-white">
        <div className="container">
          <Skeleton className="h-8 w-48 mb-8" />
          <div className="aspect-[21/9] rounded-lg overflow-hidden">
            <Skeleton className="h-full w-full" />
          </div>
        </div>
      </section>

      {/* Projects Grid Skeleton */}
      <section className="py-16">
        <div className="container">
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array(12)
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

      {/* Stats Section Skeleton */}
      <section className="py-16 bg-warmgray-50">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <Skeleton className="h-8 w-64 mx-auto mb-8" />

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <Skeleton className="h-10 w-20 mx-auto mb-2" />
                <Skeleton className="h-4 w-40 mx-auto" />
              </div>

              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <Skeleton className="h-10 w-20 mx-auto mb-2" />
                <Skeleton className="h-4 w-40 mx-auto" />
              </div>

              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <Skeleton className="h-10 w-20 mx-auto mb-2" />
                <Skeleton className="h-4 w-40 mx-auto" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section Skeleton */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <Skeleton className="h-10 w-2/3 mx-auto mb-4" />
            <Skeleton className="h-6 w-full mx-auto mb-8" />
            <Skeleton className="h-12 w-48 rounded-full mx-auto" />
          </div>
        </div>
      </section>
    </div>
  )
}
