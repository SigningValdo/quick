import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  console.log("ExplorePage: Rendu du composant de chargement")

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section Skeleton */}
      <section className="bg-warmgray-50 border-b border-gray-200">
        <div className="container py-12 md:py-16">
          <div className="max-w-2xl mx-auto text-center">
            <Skeleton className="h-10 w-3/4 mx-auto mb-6" />
            <Skeleton className="h-14 w-full mx-auto mb-10 rounded-full" />
            <div className="flex flex-wrap justify-center gap-3">
              {Array(6)
                .fill(0)
                .map((_, i) => (
                  <Skeleton key={i} className="h-10 w-24 rounded-full" />
                ))}
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section Skeleton */}
      <section className="py-12 bg-white">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-6 w-40" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array(6)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={i} className="aspect-square rounded-lg" />
              ))}
          </div>
        </div>
      </section>

      {/* Filtres de catégories Skeleton */}
      <section className="py-6 border-y border-gray-200 bg-white sticky top-0 z-10">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex gap-2 overflow-x-auto w-full max-w-4xl">
              {Array(8)
                .fill(0)
                .map((_, i) => (
                  <Skeleton key={i} className="h-10 w-24 rounded-full flex-shrink-0" />
                ))}
            </div>

            <Skeleton className="h-10 w-[180px]" />
          </div>
        </div>
      </section>

      {/* Contenu principal Skeleton */}
      <section className="py-8 md:py-12">
        <div className="container">
          {/* Onglets Skeleton */}
          <div className="mb-8">
            <Skeleton className="h-10 w-[400px] rounded-full" />
          </div>

          {/* Featured Campaigns Skeleton */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-6 w-24" />
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {Array(3)
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

          {/* All Campaigns Skeleton */}
          <div>
            <Skeleton className="h-8 w-64 mb-6" />

            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array(12)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="rounded-lg overflow-hidden border border-gray-200 h-full">
                    <Skeleton className="aspect-[16/10] w-full" />
                    <div className="p-5 space-y-3">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-full" />
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
        </div>
      </section>
    </div>
  )
}
