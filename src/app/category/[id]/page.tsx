"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
// import { CampaignCard } from "@/components/campaign-card";
// import { SkeletonCard } from "@/components/ui/skeleton-card";
import { ArrowLeft } from "lucide-react";
import { getPaymentLinks, getCategories } from "@/services/api";
import type { PaymentLinkData } from "@/types/payment-link";

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const categoryId = params.id as string;

  const [category, setCategory] = useState<{
    id: string;
    name: string;
    icon: string;
  } | null>(null);
  const [campaigns, setCampaigns] = useState<PaymentLinkData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Récupérer les informations de la catégorie
        const categoriesData = await getCategories();
        const foundCategory = categoriesData.find(
          (cat) => cat.id === categoryId
        );

        if (!foundCategory) {
          // Si la catégorie n'existe pas, rediriger vers la page explore
          router.push("/explore");
          return;
        }

        setCategory(foundCategory);

        // Récupérer les campagnes de cette catégorie
        const campaignsData = await getPaymentLinks({
          category: categoryId,
          page: currentPage,
          limit: 12,
        });

        setCampaigns(campaignsData.data);
        setTotalPages(campaignsData.totalPages);
      } catch (error) {
        console.error("Error fetching category data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [categoryId, currentPage, router]);

  // Gérer le changement de page
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!category && !isLoading) {
    return null; // La redirection sera gérée dans l'effet
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container py-12">
        <Link
          href="/explore"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          {"Retour à l'exploration"}
        </Link>

        <h1 className="text-3xl font-bold mb-4">
          {isLoading ? "Chargement..." : `Catégorie: ${category?.name}`}
        </h1>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array(12)
              .fill(0)
              .map((_, i) => (
                <SkeletonCard key={i} />
              ))}
          </div>
        ) : campaigns.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
                  originalPrice={
                    "discountPrice" in campaign ? campaign.price : undefined
                  }
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

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        onClick={() => handlePageChange(page)}
                        className={`rounded-full ${
                          currentPage === page
                            ? "bg-teal-600 hover:bg-teal-700"
                            : ""
                        }`}
                      >
                        {page}
                      </Button>
                    )
                  )}

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
            <div className="bg-gray-50 rounded-lg p-8 max-w-md mx-auto">
              <h3 className="text-xl font-bold mb-2">
                Aucune campagne trouvée
              </h3>
              <p className="text-gray-600 mb-6">
                {
                  "Aucune campagne n'est disponible dans cette catégorie pour le moment."
                }
              </p>
              <Button
                onClick={() => router.push("/explore")}
                className="bg-teal-600 hover:bg-teal-700 rounded-full"
              >
                {"Explorer d'autres catégories"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, Calendar } from "lucide-react";

interface CampaignCardProps {
  id: string;
  title: string;
  category: string;
  image: string;
  merchant: {
    name: string;
    avatar: string;
    location?: string;
  };
  raised?: number;
  goal?: number;
  daysLeft?: number;
  supporters?: number;
  price?: number;
  originalPrice?: number;
  date?: string;
  featured?: boolean;
  type:
    | "donation"
    | "fundraising"
    | "event"
    | "product_digital"
    | "product_physical";
  description?: string;
  viewMode?: "grid" | "list";
}

const CampaignCard = ({
  id,
  title,
  category,
  image,
  merchant,
  raised,
  goal,
  daysLeft,
  supporters,
  price,
  originalPrice,
  date,
  featured = false,
  type,
  description,
  viewMode = "grid",
}: CampaignCardProps) => {
  // Rendu en mode liste
  if (viewMode === "list") {
    return (
      <Link href={`/${id}`}>
        <div className="group rounded-lg overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition-shadow bg-white">
          <div className="flex flex-col md:flex-row">
            {/* Image */}
            <div className="md:w-1/3 relative">
              <div className="aspect-[16/10] md:h-full relative">
                <Image
                  src={image || "/placeholder.svg"}
                  alt={title}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
                {featured && (
                  <Badge className="absolute left-3 top-3 bg-gofundme-600 text-white border-none">
                    En vedette
                  </Badge>
                )}
                <Badge
                  variant="outline"
                  className="absolute right-3 top-3 bg-white/80 backdrop-blur-sm"
                >
                  {category}
                </Badge>
              </div>
            </div>

            {/* Contenu */}
            <div className="md:w-2/3 p-5 flex flex-col">
              <h3 className="text-lg font-bold mb-2 group-hover:text-gofundme-600 transition-colors">
                {title}
              </h3>

              {description && (
                <p className="text-sm text-gray-600 mb-4">{description}</p>
              )}

              {/* Barre de progression pour les collectes de fonds */}
              {type === "fundraising" &&
                raised !== undefined &&
                goal !== undefined && (
                  <div className="space-y-2 mb-4">
                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full bg-gofundme-600"
                        style={{
                          width: `${Math.min((raised / goal) * 100, 100)}%`,
                        }}
                      />
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">
                        {raised.toLocaleString()} €
                      </span>
                      <span className="text-gray-500">
                        {Math.round((raised / goal) * 100)}% de{" "}
                        {goal.toLocaleString()} €
                      </span>
                    </div>
                  </div>
                )}

              {/* Prix pour les produits */}
              {(type === "product_digital" || type === "product_physical") &&
                price && (
                  <div className="mb-4">
                    <span className="text-lg font-bold">{price} €</span>
                    {originalPrice && originalPrice > price && (
                      <span className="text-sm line-through text-gray-500 ml-2">
                        {originalPrice} €
                      </span>
                    )}
                  </div>
                )}

              {/* Date pour les événements */}
              {type === "event" && date && (
                <div className="flex items-center gap-1.5 text-sm mb-4">
                  <Calendar className="h-4 w-4 text-gofundme-600" />
                  <span>{date}</span>
                </div>
              )}

              {/* Informations supplémentaires */}
              <div className="flex items-center justify-between text-xs text-gray-500 mt-auto">
                <div className="flex items-center gap-1.5">
                  <div className="relative h-6 w-6 overflow-hidden rounded-full border border-gray-200">
                    <Image
                      src={merchant.avatar || "/placeholder.svg"}
                      alt={merchant.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <span>{merchant.name}</span>
                </div>

                {type === "fundraising" && (
                  <div className="flex items-center gap-4">
                    {supporters && (
                      <div className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" />
                        <span>{supporters} donateurs</span>
                      </div>
                    )}
                    {daysLeft && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{daysLeft} jours restants</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Rendu en mode grille (par défaut)
  return (
    <Link href={`/${id}`}>
      <div className="group rounded-lg overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition-shadow h-full flex flex-col bg-white">
        {/* Image principale */}
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={image || "/placeholder.svg"}
            alt={title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
          {featured && (
            <Badge className="absolute left-3 top-3 bg-gofundme-600 text-white border-none">
              En vedette
            </Badge>
          )}
          <Badge
            variant="outline"
            className="absolute right-3 top-3 bg-white/80 backdrop-blur-sm"
          >
            {category}
          </Badge>
        </div>

        {/* Contenu */}
        <div className="p-5 flex-grow flex flex-col">
          <h3 className="text-lg font-bold mb-2 line-clamp-2 group-hover:text-gofundme-600 transition-colors">
            {title}
          </h3>

          {description && (
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
              {description}
            </p>
          )}

          {/* Barre de progression pour les collectes de fonds */}
          {type === "fundraising" &&
            raised !== undefined &&
            goal !== undefined && (
              <div className="space-y-2 mb-4 mt-auto">
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full bg-gofundme-600"
                    style={{
                      width: `${Math.min((raised / goal) * 100, 100)}%`,
                    }}
                  />
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-medium">
                    {raised.toLocaleString()} €
                  </span>
                  <span className="text-gray-500">
                    {Math.round((raised / goal) * 100)}% de{" "}
                    {goal.toLocaleString()} €
                  </span>
                </div>
              </div>
            )}

          {/* Prix pour les produits */}
          {(type === "product_digital" || type === "product_physical") &&
            price && (
              <div className="mb-4 mt-auto">
                <span className="text-lg font-bold">{price} €</span>
                {originalPrice && originalPrice > price && (
                  <span className="text-sm line-through text-gray-500 ml-2">
                    {originalPrice} €
                  </span>
                )}
              </div>
            )}

          {/* Date pour les événements */}
          {type === "event" && date && (
            <div className="flex items-center gap-1.5 text-sm mb-4 mt-auto">
              <Calendar className="h-4 w-4 text-gofundme-600" />
              <span>{date}</span>
            </div>
          )}

          {/* Informations supplémentaires */}
          <div className="flex items-center justify-between text-xs text-gray-500 mt-auto">
            <div className="flex items-center gap-1.5">
              <div className="relative h-6 w-6 overflow-hidden rounded-full border border-gray-200">
                <Image
                  src={merchant.avatar || "/placeholder.svg"}
                  alt={merchant.name}
                  fill
                  className="object-cover"
                />
              </div>
              <span>{merchant.name}</span>
            </div>

            {daysLeft && (
              <div className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                <span>{daysLeft} jours</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

import { Skeleton } from "@/components/ui/skeleton";

const SkeletonCard = () => {
  return (
    <div className="rounded-lg overflow-hidden border border-gray-200 h-full">
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
  );
};
