"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft } from "lucide-react"
import { CampaignCard } from "@/components/campaign-card"
import { SkeletonCard } from "@/components/ui/skeleton-card"
import { getPaymentLinks } from "@/services/api"
import type { PaymentLinkData } from "@/types/payment-link"

// Collections fictives pour la démo
const mockCollections = [
  {
    id: "innovation",
    title: "Innovation & Technologie",
    description:
      "Découvrez les projets qui façonnent notre futur avec des innovations technologiques révolutionnaires. Cette collection regroupe des startups, des inventeurs et des visionnaires qui repoussent les limites de ce qui est possible.",
    imageUrl: "/placeholder.svg?height=400&width=800&text=Innovation",
    count: 24,
  },
  {
    id: "creative",
    title: "Projets créatifs",
    description:
      "Art, musique, films et plus encore. Cette collection célèbre la créativité sous toutes ses formes, des artistes émergents aux projets culturels ambitieux qui enrichissent notre monde.",
    imageUrl: "/placeholder.svg?height=400&width=800&text=Créatifs",
    count: 36,
  },
  {
    id: "social",
    title: "Impact social",
    description:
      "Projets qui changent le monde pour le mieux. Cette collection met en lumière des initiatives qui s'attaquent aux problèmes sociaux, soutiennent les communautés vulnérables et créent un impact positif durable.",
    imageUrl: "/placeholder.svg?height=400&width=800&text=Impact",
    count: 18,
  },
  {
    id: "education",
    title: "Éducation",
    description:
      "Projets éducatifs et bourses d'études qui transforment l'apprentissage et ouvrent de nouvelles opportunités. Cette collection regroupe des initiatives qui rendent l'éducation plus accessible, innovante et inclusive.",
    imageUrl: "/placeholder.svg?height=400&width=800&text=Éducation",
    count: 15,
  },
  {
    id: "environment",
    title: "Environnement",
    description:
      "Initiatives pour protéger notre planète et construire un avenir durable. Cette collection présente des projets de conservation, d'énergie renouvelable et de solutions écologiques innovantes.",
    imageUrl: "/placeholder.svg?height=400&width=800&text=Environnement",
    count: 22,
  },
  {
    id: "health",
    title: "Santé & Bien-être",
    description:
      "Projets liés à la santé et au bien-être qui améliorent la qualité de vie. Cette collection comprend des innovations médicales, des initiatives de santé communautaire et des solutions de bien-être accessibles.",
    imageUrl: "/placeholder.svg?height=400&width=800&text=Santé",
    count: 29,
  },
  {
    id: "community",
    title: "Projets communautaires",
    description:
      "Initiatives locales et communautaires qui renforcent les liens sociaux et améliorent la vie quotidienne. Cette collection célèbre l'esprit communautaire et l'entraide à travers divers projets locaux.",
    imageUrl: "/placeholder.svg?height=400&width=800&text=Communauté",
    count: 31,
  },
  {
    id: "sports",
    title: "Sports & Loisirs",
    description:
      "Projets sportifs et récréatifs qui encouragent l'activité physique et le divertissement. Cette collection regroupe des initiatives sportives, des équipements innovants et des événements récréatifs.",
    imageUrl: "/placeholder.svg?height=400&width=800&text=Sports",
    count: 17,
  },
  {
    id: "food",
    title: "Alimentation & Cuisine",
    description:
      "Projets culinaires et alimentaires qui transforment notre façon de manger. Cette collection présente des initiatives gastronomiques, des innovations alimentaires durables et des concepts culinaires créatifs.",
    imageUrl: "/placeholder.svg?height=400&width=800&text=Cuisine",
    count: 20,
  },
]

export default function CollectionDetailPage() {
  const params = useParams()
  const router = useRouter()
  const collectionId = params.id as string

  const [collection, setCollection] = useState<(typeof mockCollections)[0] | null>(null)
  const [campaigns, setCampaigns] = useState<PaymentLinkData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        // Trouver la collection correspondante
        const foundCollection = mockCollections.find((c) => c.id === collectionId)

        if (!foundCollection) {
          // Si la collection n'existe pas, rediriger vers la page des collections
          router.push("/collections")
          return
        }

        setCollection(foundCollection)

        // Récupérer les campagnes (simulé avec l'API existante)
        const campaignsData = await getPaymentLinks({
          page: currentPage,
          limit: 9,
        })

        setCampaigns(campaignsData.data)
        setTotalPages(campaignsData.totalPages)
      } catch (error) {
        console.error("Erreur lors du chargement de la collection:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [collectionId, currentPage, router])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  if (!collection && !isLoading) {
    return null // La redirection sera gérée dans l'effet
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gray-900 text-white">
        {collection && (
          <div className="absolute inset-0 opacity-40">
            <Image
              src={collection.imageUrl || "/placeholder.svg"}
              alt={collection.title}
              fill
              className="object-cover"
            />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/70 to-gray-900/90" />

        <div className="container relative z-10 py-16 md:py-24">
          <Link href="/collections" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-8">
            <ArrowLeft className="h-4 w-4" />
            Toutes les collections
          </Link>

          {isLoading ? (
            <>
              <div className="h-8 w-32 bg-white/20 rounded mb-4"></div>
              <div className="h-12 w-3/4 bg-white/20 rounded mb-6"></div>
              <div className="h-6 w-full bg-white/20 rounded mb-2"></div>
              <div className="h-6 w-5/6 bg-white/20 rounded"></div>
            </>
          ) : (
            collection && (
              <>
                <Badge className="bg-white text-gray-900 mb-4">Collection</Badge>
                <h1 className="text-4xl md:text-5xl font-bold mb-6">{collection.title}</h1>
                <p className="text-xl text-white/80 max-w-3xl mb-8">{collection.description}</p>
                <div className="text-sm text-white/60">{collection.count} projets dans cette collection</div>
              </>
            )
          )}
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-16">
        <div className="container">
          <h2 className="text-2xl font-bold mb-8">Projets dans cette collection</h2>

          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(9)
                .fill(0)
                .map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
            </div>
          ) : campaigns.length > 0 ? (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {campaigns.map((campaign) => (
                  <CampaignCard
                    key={campaign.id}
                    id={campaign.id}
                    title={campaign.title}
                    category={campaign.category}
                    image={campaign.images[0]}
                    merchant={campaign.merchant}
                    raised={campaign.raised}
                    goal={campaign.goal}
                    daysLeft={campaign.daysLeft}
                    supporters={campaign.supporters}
                    price={"price" in campaign ? campaign.price : undefined}
                    originalPrice={"discountPrice" in campaign ? campaign.price : undefined}
                    date={"date" in campaign ? campaign.date : undefined}
                    featured={campaign.featured}
                    type={campaign.type}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-12">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="rounded-full"
                    >
                      Précédent
                    </Button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        onClick={() => handlePageChange(page)}
                        className={`rounded-full ${currentPage === page ? "bg-teal-600 hover:bg-teal-700" : ""}`}
                      >
                        {page}
                      </Button>
                    ))}

                    <Button
                      variant="outline"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="rounded-full"
                    >
                      Suivant
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <div className="bg-warmgray-50 rounded-lg p-8 max-w-md mx-auto">
                <h3 className="text-xl font-bold mb-2">Aucun projet trouvé</h3>
                <p className="text-gray-600 mb-6">
                  Aucun projet n'est disponible dans cette collection pour le moment.
                </p>
                <Button asChild className="bg-teal-600 hover:bg-teal-700 rounded-full">
                  <Link href="/collections">Explorer d'autres collections</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Related Collections */}
      <section className="py-16 bg-warmgray-50">
        <div className="container">
          <h2 className="text-2xl font-bold mb-8">Collections similaires</h2>

          <div className="grid md:grid-cols-3 gap-6">
            {mockCollections
              .filter((c) => c.id !== collectionId)
              .slice(0, 3)
              .map((relatedCollection) => (
                <Link key={relatedCollection.id} href={`/collections/${relatedCollection.id}`} className="group">
                  <div className="rounded-lg overflow-hidden border border-gray-200 hover:shadow-md transition-shadow h-full flex flex-col">
                    <div className="relative aspect-[16/9] overflow-hidden">
                      <Image
                        src={relatedCollection.imageUrl || "/placeholder.svg"}
                        alt={relatedCollection.title}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                    <div className="p-6 bg-white flex-grow">
                      <h3 className="text-xl font-bold mb-2 group-hover:text-teal-600 transition-colors">
                        {relatedCollection.title}
                      </h3>
                      <p className="text-gray-600 line-clamp-2">{relatedCollection.description}</p>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </section>
    </div>
  )
}
