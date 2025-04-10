"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
// Ajouter l'import pour le carousel
// import { FeaturedCarouselLarge } from "@/components/featured-carousel-large"

// Collections fictives pour la démo
const mockCollections = [
  {
    id: "innovation",
    title: "Innovation & Technologie",
    description: "Découvrez les projets qui façonnent notre futur",
    imageUrl: "/placeholder.svg?height=400&width=800&text=Innovation",
    count: 24,
  },
  {
    id: "creative",
    title: "Projets créatifs",
    description: "Art, musique, films et plus encore",
    imageUrl: "/placeholder.svg?height=400&width=800&text=Créatifs",
    count: 36,
  },
  {
    id: "social",
    title: "Impact social",
    description: "Projets qui changent le monde pour le mieux",
    imageUrl: "/placeholder.svg?height=400&width=800&text=Impact",
    count: 18,
  },
  {
    id: "education",
    title: "Éducation",
    description: "Projets éducatifs et bourses d'études",
    imageUrl: "/placeholder.svg?height=400&width=800&text=Éducation",
    count: 15,
  },
  {
    id: "environment",
    title: "Environnement",
    description: "Initiatives pour protéger notre planète",
    imageUrl: "/placeholder.svg?height=400&width=800&text=Environnement",
    count: 22,
  },
  {
    id: "health",
    title: "Santé & Bien-être",
    description: "Projets liés à la santé et au bien-être",
    imageUrl: "/placeholder.svg?height=400&width=800&text=Santé",
    count: 29,
  },
  {
    id: "community",
    title: "Projets communautaires",
    description: "Initiatives locales et communautaires",
    imageUrl: "/placeholder.svg?height=400&width=800&text=Communauté",
    count: 31,
  },
  {
    id: "sports",
    title: "Sports & Loisirs",
    description: "Projets sportifs et récréatifs",
    imageUrl: "/placeholder.svg?height=400&width=800&text=Sports",
    count: 17,
  },
  {
    id: "food",
    title: "Alimentation & Cuisine",
    description: "Projets culinaires et alimentaires",
    imageUrl: "/placeholder.svg?height=400&width=800&text=Cuisine",
    count: 20,
  },
];

export default function CollectionsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [collections, setCollections] = useState(mockCollections);

  useEffect(() => {
    // Simuler un chargement
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-warmgray-50 border-b border-gray-200">
        <div className="container py-12 md:py-16">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="mb-4">Collections</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              Explorez nos collections thématiques
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Découvrez des projets soigneusement sélectionnés et regroupés par
              thèmes pour faciliter votre exploration.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Collections Carousel */}
      <section className="py-16 bg-white">
        <div className="container">
          <h2 className="text-2xl font-bold mb-8">Collections en vedette</h2>

          {isLoading ? (
            <div className="aspect-[21/9] bg-gray-200 animate-pulse rounded-lg"></div>
          ) : (
            <FeaturedCarouselLarge>
              {collections.slice(0, 3).map((collection) => (
                <div
                  key={collection.id}
                  className="relative aspect-[21/9] rounded-lg overflow-hidden"
                >
                  <Image
                    src={collection.imageUrl || "/placeholder.svg"}
                    alt={collection.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                    <h3 className="text-3xl font-bold mb-2">
                      {collection.title}
                    </h3>
                    <p className="text-lg text-white/80 mb-6 max-w-2xl">
                      {collection.description}
                    </p>
                    <Button
                      asChild
                      className="bg-teal-600 hover:bg-teal-700 rounded-full"
                    >
                      <Link href={`/collections/${collection.id}`}>
                        Explorer cette collection
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </FeaturedCarouselLarge>
          )}
        </div>
      </section>

      {/* Collections Grid */}
      <section className="py-16 bg-warmgray-50">
        <div className="container">
          <h2 className="text-2xl font-bold mb-8">Toutes les collections</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoading
              ? Array(9)
                  .fill(0)
                  .map((_, i) => (
                    <div
                      key={i}
                      className="rounded-lg overflow-hidden border border-gray-200 animate-pulse"
                    >
                      <div className="aspect-[16/9] bg-gray-200"></div>
                      <div className="p-6 space-y-3">
                        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))
              : collections.map((collection) => (
                  <Link
                    key={collection.id}
                    href={`/collections/${collection.id}`}
                    className="group"
                  >
                    <div className="rounded-lg overflow-hidden border border-gray-200 hover:shadow-md transition-shadow h-full flex flex-col">
                      <div className="relative aspect-[16/9] overflow-hidden">
                        <Image
                          src={collection.imageUrl || "/placeholder.svg"}
                          alt={collection.title}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                        />
                      </div>
                      <div className="p-6 bg-white flex-grow">
                        <h3 className="text-xl font-bold mb-2 group-hover:text-teal-600 transition-colors">
                          {collection.title}
                        </h3>
                        <p className="text-gray-600 mb-4">
                          {collection.description}
                        </p>
                        <div className="flex items-center justify-between mt-auto">
                          <span className="text-sm text-gray-500">
                            {collection.count} projets
                          </span>
                          <span className="text-teal-600 flex items-center text-sm font-medium">
                            Explorer <ArrowRight className="h-4 w-4 ml-1" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-teal-600 text-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Vous ne trouvez pas ce que vous cherchez ?
            </h2>
            <p className="text-xl text-teal-50 mb-8">
              Explorez tous nos projets ou créez le vôtre dès maintenant.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="rounded-full"
              >
                <Link href="/explore">Explorer tous les projets</Link>
              </Button>
              <Button
                asChild
                size="lg"
                className="bg-white text-teal-600 hover:bg-teal-50 rounded-full"
              >
                <Link href="/create">Créer un projet</Link>
              </Button>
            </div>
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
