"use client";

import type React from "react";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronRight,
  Search,
  TrendingUp,
  Clock,
  ArrowUpDown,
} from "lucide-react";
import { getPaymentLinks, getCategories } from "@/services/api";
// import { CampaignCard } from "@/components/campaign-card";
// import { CategoryCard } from "@/components/category-card";
// import { CategoryFilter } from "@/components/category-filter";
// import { FeaturedCampaignCard } from "@/components/featured-campaign-card";
// import { SkeletonCard } from "@/components/ui/skeleton-card";
import { useI18n } from "@/i18n/i18n-context";
import type { PaymentLinkData } from "@/types/payment-link";

export default function ExplorePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useI18n();

  // États pour les filtres et le tri
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || "all"
  );
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "trending");
  const [activeTab, setActiveTab] = useState(searchParams.get("type") || "all");

  // États pour les données
  const [featuredCampaigns, setFeaturedCampaigns] = useState<PaymentLinkData[]>(
    []
  );
  const [campaigns, setCampaigns] = useState<PaymentLinkData[]>([]);
  const [categories, setCategories] = useState<
    { id: string; name: string; icon: string; imageUrl: string }[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  console.log("ExplorePage: Initialisation du composant");

  // Débogage
  useEffect(() => {
    console.log("ExplorePage monté");
    console.log("Catégories:", categories);
    console.log("Campagnes:", campaigns);
  }, [categories, campaigns]);

  // Charger les données
  useEffect(() => {
    const fetchData = async () => {
      console.log("ExplorePage: Début du chargement des données");
      setIsLoading(true);
      try {
        // Récupérer les catégories
        console.log("ExplorePage: Chargement des catégories");
        const categoriesData = await getCategories();
        console.log("ExplorePage: Catégories reçues", categoriesData);

        // Ajouter des URLs d'images pour chaque catégorie
        const categoriesWithImages = [
          {
            id: "all",
            name: "Toutes les catégories",
            icon: "Grid",
            imageUrl: "/placeholder.svg?height=400&width=400&text=Toutes",
          },
          ...categoriesData.map((cat) => ({
            ...cat,
            imageUrl: `/placeholder.svg?height=400&width=400&text=${cat.name}`,
          })),
        ];

        setCategories(categoriesWithImages);
        console.log("ExplorePage: Catégories traitées", categoriesWithImages);

        // Récupérer les campagnes en vedette
        console.log("ExplorePage: Chargement des campagnes en vedette");
        const featuredData = await getPaymentLinks({
          featured: true,
          limit: 3,
        });
        console.log("ExplorePage: Campagnes en vedette reçues", featuredData);
        setFeaturedCampaigns(featuredData.data);

        // Récupérer les campagnes filtrées
        console.log("ExplorePage: Chargement des campagnes filtrées");
        const params: any = {
          page: currentPage,
          limit: 12,
          sort: sortBy,
        };

        if (selectedCategory !== "all") {
          params.category = selectedCategory;
        }

        if (activeTab !== "all") {
          params.type = activeTab;
        }

        const campaignsData = await getPaymentLinks(params);
        console.log("ExplorePage: Campagnes filtrées reçues", campaignsData);
        setCampaigns(campaignsData.data);
        setTotalPages(campaignsData.totalPages);
      } catch (error) {
        console.error(
          "ExplorePage: Erreur lors du chargement des données",
          error
        );
      } finally {
        console.log("ExplorePage: Fin du chargement des données");
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedCategory, sortBy, activeTab, currentPage]);

  // Mettre à jour l'URL lorsque les filtres changent
  useEffect(() => {
    const params = new URLSearchParams();

    if (selectedCategory !== "all") {
      params.set("category", selectedCategory);
    }

    if (sortBy !== "trending") {
      params.set("sort", sortBy);
    }

    if (activeTab !== "all") {
      params.set("type", activeTab);
    }

    if (currentPage > 1) {
      params.set("page", currentPage.toString());
    }

    const queryString = params.toString();
    const url = queryString ? `/explore?${queryString}` : "/explore";

    router.push(url, { scroll: false });
  }, [selectedCategory, sortBy, activeTab, currentPage, router]);

  // Gérer la recherche
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  // Gérer le changement de page
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Gérer le changement de catégorie
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  // Gérer le changement de tri
  const handleSortChange = (sort: string) => {
    setSortBy(sort);
    setCurrentPage(1);
  };

  // Gérer le changement d'onglet (type)
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setCurrentPage(1);
  };

  // Fonction pour rendre le contenu principal
  const renderContent = () => {
    // Afficher les campagnes en vedette uniquement sur la première page et sans filtres
    const showFeatured =
      currentPage === 1 && selectedCategory === "all" && activeTab === "all";

    return (
      <>
        {/* Campagnes en vedette */}
        {showFeatured && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Campagnes en vedette</h2>
              <Link
                href="/search?featured=true"
                className="text-gofundme-600 hover:text-gofundme-700 font-medium flex items-center gap-1"
              >
                Voir tout
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {isLoading
                ? Array(3)
                    .fill(0)
                    .map((_, i) => <SkeletonCard key={i} />)
                : featuredCampaigns.map((campaign) => (
                    <FeaturedCampaignCard
                      key={campaign.id}
                      campaign={campaign}
                    />
                  ))}
            </div>
          </div>
        )}

        {/* Toutes les campagnes */}
        <div>
          <h2 className="text-2xl font-bold mb-6">
            {selectedCategory !== "all"
              ? `Campagnes dans ${
                  categories.find((c) => c.id === selectedCategory)?.name ||
                  selectedCategory
                }`
              : "Toutes les campagnes"}
          </h2>

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
                    description={
                      campaign.description
                        .replace(/<[^>]*>?/gm, "")
                        .substring(0, 100) + "..."
                    }
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
                              ? "bg-gofundme-600 hover:bg-gofundme-700"
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
                  Aucune campagne trouvée
                </h3>
                <p className="text-gray-600 mb-6">
                  Aucune campagne ne correspond à vos critères de recherche.
                  Essayez de modifier vos filtres.
                </p>
                <Button
                  onClick={() => {
                    setSelectedCategory("all");
                    setActiveTab("all");
                    setSortBy("trending");
                  }}
                  className="bg-gofundme-600 hover:bg-gofundme-700 rounded-full"
                >
                  Réinitialiser les filtres
                </Button>
              </div>
            </div>
          )}
        </div>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      {/* {console.log("ExplorePage: Rendu du composant", { isLoading, campaigns, categories })} */}
      {/* Hero Section */}
      <section className="bg-warmgray-50 border-b border-gray-200">
        <div className="container py-12 md:py-16">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
              Découvrez des projets qui ont besoin de votre soutien
            </h1>
            <form
              onSubmit={handleSearch}
              className="relative max-w-xl mx-auto mb-10"
            >
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="search"
                placeholder="Rechercher une campagne..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 h-14 text-base rounded-full border border-gray-300 shadow-sm focus:border-gofundme-600 focus:ring-gofundme-600"
              />
              <Button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-gofundme-600 hover:bg-gofundme-700 rounded-full h-11 px-6"
              >
                Rechercher
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Section des catégories avec images */}
      <section className="py-12 bg-white">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Parcourir par catégorie</h2>
            <Link
              href="/categories"
              className="text-gofundme-600 hover:text-gofundme-700 font-medium flex items-center gap-1"
            >
              Voir toutes les catégories
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {isLoading
              ? Array(6)
                  .fill(0)
                  .map((_, i) => (
                    <div
                      key={i}
                      className="rounded-lg overflow-hidden bg-gray-200 animate-pulse aspect-square"
                    ></div>
                  ))
              : categories
                  .filter((cat) => cat.id !== "all")
                  .slice(0, 6)
                  .map((category) => (
                    <CategoryCard
                      key={category.id}
                      id={category.id}
                      title={category.name}
                      imageUrl={category.imageUrl}
                      href={`/category/${category.id}`}
                    />
                  ))}
          </div>
        </div>
      </section>

      {/* Filtres de catégories */}
      <section className="py-6 border-y border-gray-200 bg-white sticky top-0 z-10">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
            />

            <div className="flex items-center gap-3">
              <Select value={sortBy} onValueChange={handleSortChange}>
                <SelectTrigger className="w-[180px] border-gray-300 rounded-full">
                  <div className="flex items-center gap-2">
                    <ArrowUpDown className="h-4 w-4" />
                    <SelectValue placeholder="Trier par" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="trending">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      <span>Tendances</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="recent">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>Plus récents</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="most-funded">
                    <div className="flex items-center gap-2">
                      <ArrowUpDown className="h-4 w-4" />
                      <span>Plus financés</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Contenu principal */}
      <section className="py-8 md:py-12">
        <div className="container">
          {/* Onglets de type */}
          <Tabs
            value={activeTab}
            onValueChange={handleTabChange}
            className="mb-8"
          >
            <TabsList className="bg-warmgray-50 p-1 rounded-full inline-flex">
              <TabsTrigger
                value="all"
                className="rounded-full data-[state=active]:bg-white"
              >
                Tous
              </TabsTrigger>
              <TabsTrigger
                value="fundraising"
                className="rounded-full data-[state=active]:bg-white"
              >
                Collectes de fonds
              </TabsTrigger>
              <TabsTrigger
                value="donation"
                className="rounded-full data-[state=active]:bg-white"
              >
                Dons
              </TabsTrigger>
              <TabsTrigger
                value="event"
                className="rounded-full data-[state=active]:bg-white"
              >
                Événements
              </TabsTrigger>
              <TabsTrigger
                value="product_digital"
                className="rounded-full data-[state=active]:bg-white"
              >
                Produits numériques
              </TabsTrigger>
              <TabsTrigger
                value="product_physical"
                className="rounded-full data-[state=active]:bg-white"
              >
                Produits physiques
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-0">
              {/* Contenu pour tous les types */}
              {renderContent()}
            </TabsContent>
            <TabsContent value="fundraising" className="mt-0">
              {/* Contenu pour les collectes de fonds */}
              {renderContent()}
            </TabsContent>
            <TabsContent value="donation" className="mt-0">
              {/* Contenu pour les dons */}
              {renderContent()}
            </TabsContent>
            <TabsContent value="event" className="mt-0">
              {/* Contenu pour les événements */}
              {renderContent()}
            </TabsContent>
            <TabsContent value="product_digital" className="mt-0">
              {/* Contenu pour les produits numériques */}
              {renderContent()}
            </TabsContent>
            <TabsContent value="product_physical" className="mt-0">
              {/* Contenu pour les produits physiques */}
              {renderContent()}
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
}

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Users, Calendar } from "lucide-react";

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

import { useRef } from "react";
import { ChevronLeft } from "lucide-react";

interface CategoryFilterProps {
  categories: {
    id: string;
    name: string;
    icon: string;
    imageUrl: string;
  }[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const CategoryFilter = ({
  categories,
  selectedCategory,
  onCategoryChange,
}: CategoryFilterProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  // Vérifier si les flèches de défilement doivent être affichées
  useEffect(() => {
    const checkScroll = () => {
      if (scrollContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } =
          scrollContainerRef.current;
        setShowLeftArrow(scrollLeft > 0);
        setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10); // 10px de marge
      }
    };

    checkScroll();
    window.addEventListener("resize", checkScroll);

    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", checkScroll);
    }

    return () => {
      window.removeEventListener("resize", checkScroll);
      if (scrollContainer) {
        scrollContainer.removeEventListener("scroll", checkScroll);
      }
    };
  }, [categories]);

  // Faire défiler vers la gauche
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: "smooth" });
    }
  };

  // Faire défiler vers la droite
  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: "smooth" });
    }
  };

  // Fonction pour rendre un bouton de catégorie
  const renderCategoryButton = (
    category: CategoryFilterProps["categories"][0]
  ) => {
    const buttonContent = (
      <>
        {/* Miniature de la catégorie */}
        {category.imageUrl && (
          <div className="relative h-6 w-6 overflow-hidden rounded-full">
            <Image
              src={category.imageUrl || "/placeholder.svg"}
              alt=""
              fill
              className="object-cover"
            />
          </div>
        )}
        {category.name}
      </>
    );

    const buttonClasses = cn(
      "whitespace-nowrap rounded-full border border-gray-200 hover:border-gofundme-600 transition-colors flex items-center gap-2",
      selectedCategory === category.id
        ? "bg-gofundme-600 text-white border-gofundme-600 hover:bg-gofundme-700 hover:border-gofundme-700"
        : "bg-white text-gray-700"
    );

    if (category.id === "all") {
      return (
        <Button
          key={category.id}
          variant="outline"
          onClick={() => onCategoryChange(category.id)}
          className={buttonClasses}
        >
          {buttonContent}
        </Button>
      );
    } else {
      return (
        <Link key={category.id} href={`/category/${category.id}`}>
          <Button variant="outline" className={buttonClasses}>
            {buttonContent}
          </Button>
        </Link>
      );
    }
  };

  return (
    <div className="relative w-full max-w-4xl">
      {/* Flèche de défilement gauche */}
      {showLeftArrow && (
        <button
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow-md p-1 border border-gray-200"
          aria-label="Défiler vers la gauche"
        >
          <ChevronLeft className="h-5 w-5 text-gray-600" />
        </button>
      )}

      {/* Conteneur de défilement */}
      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto scrollbar-hide gap-2 px-2 py-1 -mx-2"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {categories.map((category) => renderCategoryButton(category))}
      </div>

      {/* Flèche de défilement droite */}
      {showRightArrow && (
        <button
          onClick={scrollRight}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow-md p-1 border border-gray-200"
          aria-label="Défiler vers la droite"
        >
          <ChevronRight className="h-5 w-5 text-gray-600" />
        </button>
      )}
    </div>
  );
};

interface FeaturedCampaignCardProps {
  campaign: PaymentLinkData;
}

const FeaturedCampaignCard = ({ campaign }: FeaturedCampaignCardProps) => {
  // Extraire les données pertinentes
  const { id, title, category, images, merchant, type } = campaign;
  const raised = "raised" in campaign ? campaign.raised : undefined;
  const goal = "goal" in campaign ? campaign.goal : undefined;
  const daysLeft = "daysLeft" in campaign ? campaign.daysLeft : undefined;
  // const supporters = "supporters" in campaign ? campaign.supporters : undefined;

  // Extraire une description courte
  const shortDescription =
    campaign.description
      .replace(/<[^>]*>?/gm, "") // Supprimer les balises HTML
      .substring(0, 120) + "..."; // Limiter la longueur

  return (
    <Link href={`/${id}`}>
      <div className="group rounded-lg overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition-shadow h-full flex flex-col">
        {/* Image principale */}
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={images[0] || "/placeholder.svg"}
            alt={title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
          <Badge className="absolute left-3 top-3 bg-gofundme-600 text-white border-none">
            En vedette
          </Badge>
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

          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {shortDescription}
          </p>

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
                <span>{daysLeft} jours restants</span>
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
