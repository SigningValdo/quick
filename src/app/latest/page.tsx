"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
// import { CampaignCard } from "@/components/campaign-card"
// import { SkeletonCard } from "@/components/ui/skeleton-card"
import { getPaymentLinks } from "@/services/api";
import type { PaymentLinkData } from "@/types/payment-link";
// Ajouter l'import pour le carousel
// import { FeaturedCarouselLarge } from "@/components/featured-carousel-large"
import Image from "next/image";

export default function LatestPage() {
  const [campaigns, setCampaigns] = useState<PaymentLinkData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchCampaigns = async () => {
      setIsLoading(true);
      try {
        const response = await getPaymentLinks({
          sort: "recent",
          page: currentPage,
          limit: 12,
        });

        setCampaigns(response.data);
        setTotalPages(response.totalPages);
      } catch (error) {
        console.error("Erreur lors du chargement des derniers projets:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCampaigns();
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-warmgray-50 border-b border-gray-200">
        <div className="container py-12 md:py-16">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="mb-4">Nouveautés</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              Les derniers projets
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Découvrez les projets les plus récents qui viennent d'être lancés
              sur notre plateforme.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Latest Projects Carousel */}
      {!isLoading && campaigns.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container">
            <h2 className="text-2xl font-bold mb-8">Nouveautés à la une</h2>

            <FeaturedCarouselLarge>
              {campaigns
                .slice(0, Math.min(3, campaigns.length))
                .map((campaign) => (
                  <div
                    key={campaign.id}
                    className="relative aspect-[21/9] rounded-lg overflow-hidden"
                  >
                    <Image
                      src={campaign.images[0] || "/placeholder.svg"}
                      alt={campaign.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                      <Badge className="bg-teal-600 border-none mb-4">
                        {campaign.category}
                      </Badge>
                      <h3 className="text-3xl font-bold mb-2">
                        {campaign.title}
                      </h3>
                      <p className="text-lg text-white/80 mb-4 max-w-2xl">
                        {campaign.description
                          .replace(/<[^>]*>?/gm, "")
                          .substring(0, 150)}
                        ...
                      </p>

                      {campaign.type === "fundraising" &&
                        campaign.raised !== undefined &&
                        campaign.goal !== undefined && (
                          <div className="space-y-2 max-w-md mb-6">
                            <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/30">
                              <div
                                className="h-full bg-teal-500"
                                style={{
                                  width: `${Math.min(
                                    (campaign.raised / campaign.goal) * 100,
                                    100
                                  )}%`,
                                }}
                              />
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="font-medium">
                                {campaign.raised.toLocaleString()} € collectés
                              </span>
                              <span>
                                {Math.round(
                                  (campaign.raised / campaign.goal) * 100
                                )}
                                % de l'objectif
                              </span>
                            </div>
                          </div>
                        )}

                      <Button
                        asChild
                        className="bg-teal-600 hover:bg-teal-700 rounded-full"
                      >
                        <Link href={`/${campaign.id}`}>Voir ce projet</Link>
                      </Button>
                    </div>
                  </div>
                ))}
            </FeaturedCarouselLarge>
          </div>
        </section>
      )}

      {/* Projects Grid */}
      <section className="py-16 bg-warmgray-50">
        <div className="container">
          <h2 className="text-2xl font-bold mb-8">Tous les derniers projets</h2>
          {isLoading ? (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array(12)
                .fill(0)
                .map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
            </div>
          ) : campaigns.length > 0 ? (
            <>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
              <div className="bg-warmgray-50 rounded-lg p-8 max-w-md mx-auto">
                <h3 className="text-xl font-bold mb-2">Aucun projet trouvé</h3>
                <p className="text-gray-600 mb-6">
                  Aucun projet récent n'est disponible pour le moment.
                </p>
                <Button
                  asChild
                  className="bg-teal-600 hover:bg-teal-700 rounded-full"
                >
                  <Link href="/explore">Explorer tous les projets</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-warmgray-50">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">
              Vous avez une idée de projet ?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Lancez votre propre projet et rejoignez notre communauté de
              créateurs.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-teal-600 hover:bg-teal-700 rounded-full"
            >
              <Link href="/create">Créer un projet</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

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

import type React from "react";

import { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeaturedCarouselLargeProps {
  children: React.ReactNode[];
  autoplay?: boolean;
  autoplayInterval?: number;
  className?: string;
  showIndicators?: boolean;
  showArrows?: boolean;
}

const FeaturedCarouselLarge = ({
  children,
  autoplay = true,
  autoplayInterval = 5000,
  className = "",
  showIndicators = true,
  showArrows = true,
}: FeaturedCarouselLargeProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Gérer l'autoplay
  useEffect(() => {
    if (autoplay && !isPaused && children.length > 1) {
      timerRef.current = setInterval(() => {
        setDirection(1);
        setCurrentIndex((prevIndex) =>
          prevIndex === children.length - 1 ? 0 : prevIndex + 1
        );
      }, autoplayInterval);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [autoplay, autoplayInterval, isPaused, children.length]);

  // Fonctions de navigation
  const next = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setDirection(1);
    setCurrentIndex((prevIndex) =>
      prevIndex === children.length - 1 ? 0 : prevIndex + 1
    );
    setIsPaused(true);
  };

  const prev = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setDirection(-1);
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? children.length - 1 : prevIndex - 1
    );
    setIsPaused(true);
  };

  // Variantes d'animation
  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  return (
    <div
      className={cn("relative overflow-hidden", className)}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
          }}
          className="w-full"
        >
          {children[currentIndex]}
        </motion.div>
      </AnimatePresence>

      {showArrows && children.length > 1 && (
        <>
          <Button
            variant="outline"
            size="icon"
            className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/80 backdrop-blur-sm shadow-md"
            onClick={prev}
          >
            <ChevronLeft className="h-5 w-5" />
            <span className="sr-only">Précédent</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/80 backdrop-blur-sm shadow-md"
            onClick={next}
          >
            <ChevronRight className="h-5 w-5" />
            <span className="sr-only">Suivant</span>
          </Button>
        </>
      )}

      {showIndicators && children.length > 1 && (
        <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-1">
          {children.map((_, index) => (
            <Button
              key={index}
              variant="outline"
              size="icon"
              className={`h-2 w-2 rounded-full p-0 ${
                index === currentIndex
                  ? "bg-teal-600 border-teal-600"
                  : "bg-white/80 backdrop-blur-sm"
              }`}
              onClick={() => {
                setCurrentIndex(index);
                setIsPaused(true);
              }}
            >
              <span className="sr-only">
                Aller à la diapositive {index + 1}
              </span>
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};
