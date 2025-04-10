"use client";

import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
import { getCategories } from "@/services/api";
// import { CategoryCard } from "@/components/category-card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CategoriesPage() {
  // const router = useRouter();
  const [categories, setCategories] = useState<
    { id: string; name: string; icon: string; imageUrl: string }[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const categoriesData = await getCategories();

        // Ajouter des URLs d'images pour chaque catégorie
        // Dans un environnement réel, ces URLs viendraient de votre API
        const categoriesWithImages = categoriesData.map((cat) => ({
          ...cat,
          imageUrl: `/placeholder.svg?height=400&width=400&text=${cat.name}`,
          // Dans un environnement réel, vous utiliseriez de vraies images:
          // imageUrl: `/images/categories/${cat.id}.jpg`
        }));

        setCategories(categoriesWithImages);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

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

        <h1 className="text-3xl font-bold mb-8">Toutes les catégories</h1>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {Array(15)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={i} className="aspect-square rounded-lg" />
              ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                id={category.id}
                title={category.name}
                imageUrl={category.imageUrl}
                href={`/explore?category=${category.id}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

import Image from "next/image";
import { cn } from "@/lib/utils";

interface CategoryCardProps {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  href: string;
  className?: string;
}

const CategoryCard = ({
  id,
  title,
  description,
  imageUrl,
  // href,
  className,
}: CategoryCardProps) => {
  return (
    <Link href={`/category/${id}`} className={cn("block group", className)}>
      <div className="rounded-lg overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition-shadow bg-white h-full">
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={imageUrl || "/placeholder.svg?height=200&width=200"}
            alt={title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex items-end">
            <h3 className="text-white font-bold p-4 text-lg group-hover:text-teal-300 transition-colors">
              {title}
            </h3>
          </div>
        </div>
        {description && (
          <div className="p-3">
            <p className="text-sm text-gray-600">{description}</p>
          </div>
        )}
      </div>
    </Link>
  );
};
