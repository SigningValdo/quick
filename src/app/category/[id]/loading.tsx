import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container py-12">
        <Skeleton className="h-6 w-40 mb-8" />
        <Skeleton className="h-10 w-64 mb-8" />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
    </div>
  )
}
