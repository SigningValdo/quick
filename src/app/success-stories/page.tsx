"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
// import { SkeletonCard } from "@/components/ui/skeleton-card";
import { Award, Heart } from "lucide-react";
import { getPaymentLinks } from "@/services/api";
import type { PaymentLinkData } from "@/types/payment-link";

// Importer le nouveau composant de carousel
// import { FeaturedCarouselLarge } from "@/components/featured-carousel-large";

export default function SuccessStoriesPage() {
  const [stories, setStories] = useState<PaymentLinkData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchStories = async () => {
      setIsLoading(true);
      try {
        // Dans un environnement réel, vous auriez un endpoint spécifique pour les success stories
        // Ici, nous utilisons les données de test avec un filtre
        const response = await getPaymentLinks({
          featured: true,
          page: currentPage,
          limit: 6,
        });

        setStories(response.data);
        setTotalPages(response.totalPages);
      } catch (error) {
        console.error("Erreur lors du chargement des success stories:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStories();
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-teal-600 text-white py-16">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="bg-white text-teal-600 mb-4">
              Histoires inspirantes
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Histoires de réussite
            </h1>
            <p className="text-xl text-teal-50 mb-8">
              Découvrez comment des personnes comme vous ont réussi à financer
              leurs projets et à réaliser leurs rêves grâce à notre plateforme.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Success Story */}
      {!isLoading && stories.length > 0 && (
        <section className="py-16 bg-warmgray-50">
          <div className="container">
            <h2 className="text-2xl font-bold mb-8">Histoires à la une</h2>

            <FeaturedCarouselLarge>
              {stories
                .slice(0, Math.min(3, stories.length))
                .map((story, index) => (
                  <div
                    key={story.id}
                    className="grid md:grid-cols-2 gap-8 items-center"
                  >
                    <div className="relative aspect-square rounded-lg overflow-hidden">
                      <Image
                        src={
                          story.images[0] ||
                          "/placeholder.svg?height=600&width=600&text=Success"
                        }
                        alt={story.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="space-y-6">
                      <div className="flex items-center gap-2">
                        <Award className="h-5 w-5 text-yellow-500" />
                        <span className="text-sm font-medium text-yellow-500">
                          Histoire à la une
                        </span>
                      </div>
                      <h3 className="text-3xl font-bold">{story.title}</h3>
                      <p className="text-gray-600">
                        {story.description
                          .replace(/<[^>]*>?/gm, "")
                          .substring(0, 300)}
                        ...
                      </p>

                      {story.type === "fundraising" &&
                        story.raised !== undefined &&
                        story.goal !== undefined && (
                          <div className="space-y-2">
                            <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
                              <div
                                className="h-full bg-teal-600"
                                style={{
                                  width: `${Math.min(
                                    (story.raised / story.goal) * 100,
                                    100
                                  )}%`,
                                }}
                              />
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="font-medium">
                                {story.raised.toLocaleString()} € collectés
                              </span>
                              <span className="text-gray-500">
                                Objectif: {story.goal.toLocaleString()} €
                              </span>
                            </div>
                          </div>
                        )}

                      <div className="flex flex-wrap gap-4">
                        <Button
                          asChild
                          className="bg-teal-600 hover:bg-teal-700 rounded-full"
                        >
                          <Link href={`/${story.id}`}>
                            Voir l'histoire complète
                          </Link>
                        </Button>
                        <Button
                          asChild
                          variant="outline"
                          className="rounded-full"
                        >
                          <Link href="/create">Créer votre projet</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
            </FeaturedCarouselLarge>
          </div>
        </section>
      )}

      {/* Success Stories Grid */}
      <section className="py-16">
        <div className="container">
          <h2 className="text-2xl font-bold mb-8">
            Toutes les histoires de réussite
          </h2>

          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(6)
                .fill(0)
                .map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
            </div>
          ) : stories.length > 0 ? (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stories.map((story) => (
                  <div
                    key={story.id}
                    className="group flex flex-col gap-4 gofundme-card p-4"
                  >
                    <Link href={`/${story.id}`} className="block">
                      <div className="relative aspect-[16/10] overflow-hidden rounded-lg">
                        <Image
                          src={story.images[0] || "/placeholder.svg"}
                          alt={story.title}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                        />
                      </div>
                    </Link>
                    <div>
                      <Link
                        href={`/${story.id}`}
                        className="block group-hover:text-teal-600 transition-colors"
                      >
                        <h3 className="text-lg font-bold mb-2 line-clamp-2">
                          {story.title}
                        </h3>
                      </Link>

                      <div className="mb-3 text-sm text-gray-600 line-clamp-3">
                        {story.description
                          .replace(/<[^>]*>?/gm, "")
                          .substring(0, 150)}
                        ...
                      </div>

                      {story.type === "fundraising" &&
                        story.raised !== undefined &&
                        story.goal !== undefined && (
                          <div className="space-y-2 mb-3">
                            <div className="flex justify-between text-sm">
                              <span className="font-medium">
                                {story.raised.toLocaleString()} € collectés
                              </span>
                              <span className="text-gray-500">
                                Objectif: {story.goal.toLocaleString()} €
                              </span>
                            </div>
                          </div>
                        )}

                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Heart className="h-3.5 w-3.5 text-teal-600" />
                        <span>
                          {story.supporters ||
                            Math.floor(Math.random() * 100 + 20)}{" "}
                          personnes ont soutenu
                        </span>
                      </div>
                    </div>
                  </div>
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
                <h3 className="text-xl font-bold mb-2">
                  Aucune histoire trouvée
                </h3>
                <p className="text-gray-600 mb-6">
                  Nous n'avons pas encore d'histoires de réussite à partager.
                  Revenez bientôt !
                </p>
                <Button
                  asChild
                  className="bg-teal-600 hover:bg-teal-700 rounded-full"
                >
                  <Link href="/explore">Explorer les projets</Link>
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
              Prêt à écrire votre propre histoire de réussite ?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Rejoignez des milliers de créateurs qui ont donné vie à leurs
              idées grâce à notre plateforme.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-teal-600 hover:bg-teal-700 rounded-full"
            >
              <Link href="/create">Créer votre projet maintenant</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

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
