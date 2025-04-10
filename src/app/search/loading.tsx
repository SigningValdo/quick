import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="min-h-screen bg-warmgray-50">
      {/* En-tête de recherche Skeleton */}
      <div className="bg-white border-b sticky top-0 z-20">
        <div className="container py-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <Skeleton className="h-8 w-24 mr-4" />

            <Skeleton className="h-12 w-full max-w-3xl rounded-full" />

            <div className="flex items-center gap-2 ml-auto">
              <Skeleton className="h-10 w-24 rounded-full" />
              <Skeleton className="h-10 w-20 rounded-md" />
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Filtres latéraux Skeleton */}
          <div className="hidden md:block space-y-6 bg-white p-6 rounded-lg border border-gray-200 h-fit">
            <Skeleton className="h-8 w-32 mb-4" />

            <div className="space-y-6">
              <div>
                <Skeleton className="h-6 w-24 mb-3" />
                <div className="space-y-2">
                  {Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <div key={i} className="flex items-center">
                        <Skeleton className="h-4 w-4 mr-2" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                    ))}
                </div>
              </div>

              <div>
                <Skeleton className="h-6 w-24 mb-3" />
                <div className="space-y-2">
                  {Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <div key={i} className="flex items-center">
                        <Skeleton className="h-4 w-4 mr-2" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                    ))}
                </div>
              </div>

              <div>
                <Skeleton className="h-6 w-32 mb-3" />
                <Skeleton className="h-6 w-full my-6" />
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>

              <Skeleton className="h-10 w-full rounded-md" />
              <Skeleton className="h-10 w-full rounded-md" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
          </div>

          {/* Résultats de recherche Skeleton */}
          <div className="md:col-span-3 space-y-6">
            {/* Barre d'outils des résultats */}
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <Skeleton className="h-6 w-48 mb-2" />
              <Skeleton className="h-4 w-24 mb-2" />
              <div className="flex gap-2 mt-2">
                <Skeleton className="h-6 w-24 rounded-full" />
                <Skeleton className="h-6 w-32 rounded-full" />
              </div>
            </div>

            {/* Grille de résultats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(6)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="rounded-lg overflow-hidden border border-gray-200 bg-white h-full">
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

            {/* Pagination Skeleton */}
            <div className="flex justify-center mt-8">
              <div className="flex gap-2">
                <Skeleton className="h-8 w-24 rounded-full" />
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-8 w-24 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
