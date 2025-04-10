import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container py-12">
        <Skeleton className="h-6 w-40 mb-8" />
        <Skeleton className="h-10 w-64 mb-8" />

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {Array(15)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="rounded-lg overflow-hidden">
                <Skeleton className="aspect-square w-full" />
                <div className="p-3">
                  <Skeleton className="h-6 w-3/4" />
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}
