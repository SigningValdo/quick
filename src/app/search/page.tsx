"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
// import { CampaignCard } from "@/components/campaign-card"
// import { SkeletonCard } from "@/components/ui/skeleton-card";
import { SearchSuggestions } from "@/components/search-suggestions";
import {
  SearchIcon,
  SlidersHorizontal,
  X,
  Grid,
  List,
  ArrowUpDown,
  TrendingUp,
  Clock,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useI18n } from "@/i18n/i18n-context";
import { searchPaymentLinks, getCategories } from "@/services/api";
import type { PaymentLinkData } from "@/types/payment-link";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { t } = useI18n();

  // États pour les filtres
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || "all"
  );
  const [selectedType, setSelectedType] = useState(
    searchParams.get("type") || "all"
  );
  const [priceRange, setPriceRange] = useState<[number, number]>([
    Number(searchParams.get("minPrice") || 0),
    Number(searchParams.get("maxPrice") || 10000),
  ]);
  const [daysLeft, setDaysLeft] = useState<number | null>(
    searchParams.get("daysLeft") ? Number(searchParams.get("daysLeft")) : null
  );
  const [onlyFeatured, setOnlyFeatured] = useState(
    searchParams.get("featured") === "true"
  );
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "relevance");
  const [viewMode, setViewMode] = useState<"grid" | "list">(
    (searchParams.get("view") as "grid" | "list") || "grid"
  );

  // États pour les résultats
  const [searchResults, setSearchResults] = useState<PaymentLinkData[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get("page") || 1)
  );
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    []
  );
  const [error, setError] = useState<string | null>(null);

  // Types de liens disponibles
  const linkTypes = [
    { id: "all", name: "Tous les types" },
    { id: "donation", name: "Don" },
    { id: "fundraising", name: "Collecte de fonds" },
    { id: "event", name: "Événement" },
    { id: "product_digital", name: "Produit numérique" },
    { id: "product_physical", name: "Produit physique" },
  ];

  // Récupérer les catégories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const cats = await getCategories();
        // Ajouter l'option "Toutes" en premier
        setCategories([{ id: "all", name: "Toutes les catégories" }, ...cats]);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Effectuer la recherche lorsque les paramètres changent
  useEffect(() => {
    const query = searchParams.get("q") || "";
    if (query) {
      performSearch(query);
    } else if (
      searchParams.has("category") ||
      searchParams.has("type") ||
      searchParams.has("featured")
    ) {
      // Si pas de requête mais des filtres, effectuer une recherche avec filtres
      performSearch("");
    } else {
      // Réinitialiser les résultats si pas de requête ni de filtres
      setSearchResults([]);
      setTotalResults(0);
      setTotalPages(1);
    }
  }, [searchParams]);

  // Fonction pour effectuer la recherche
  const performSearch = async (query: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const params: any = {
        page: currentPage,
        limit: 12,
      };

      if (selectedCategory !== "all") params.category = selectedCategory;
      if (selectedType !== "all") params.type = selectedType;
      if (onlyFeatured) params.featured = true;
      if (sortBy !== "relevance") params.sort = sortBy;
      if (priceRange[0] > 0) params.minPrice = priceRange[0];
      if (priceRange[1] < 10000) params.maxPrice = priceRange[1];
      if (daysLeft) params.daysLeft = daysLeft;

      const results = await searchPaymentLinks(query, params);

      setSearchResults(results.data);
      setTotalResults(results.total);
      setCurrentPage(results.page);
      setTotalPages(results.totalPages);
    } catch (error) {
      console.error("Error performing search:", error);
      setError(
        "Une erreur est survenue lors de la recherche. Veuillez réessayer."
      );
      setSearchResults([]);
      setTotalResults(0);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  };

  // Gérer la soumission de la recherche
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);
    updateSearchParams();
  };

  // Mettre à jour les paramètres de recherche dans l'URL
  const updateSearchParams = () => {
    const params = new URLSearchParams();

    if (searchQuery) params.set("q", searchQuery);
    if (selectedCategory !== "all") params.set("category", selectedCategory);
    if (selectedType !== "all") params.set("type", selectedType);
    if (onlyFeatured) params.set("featured", "true");
    if (sortBy !== "relevance") params.set("sort", sortBy);
    if (viewMode !== "grid") params.set("view", viewMode);
    if (currentPage > 1) params.set("page", currentPage.toString());
    if (priceRange[0] > 0) params.set("minPrice", priceRange[0].toString());
    if (priceRange[1] < 10000) params.set("maxPrice", priceRange[1].toString());
    if (daysLeft) params.set("daysLeft", daysLeft.toString());

    router.push(`/search?${params.toString()}`);
  };

  // Gérer le changement de page
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);

    // Mettre à jour l'URL avec la nouvelle page
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`/search?${params.toString()}`);

    // Faire défiler vers le haut de la page
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Réinitialiser les filtres
  const handleReset = () => {
    setSearchQuery(searchParams.get("q") || "");
    setSelectedCategory("all");
    setSelectedType("all");
    setPriceRange([0, 10000]);
    setDaysLeft(null);
    setOnlyFeatured(false);
    setSortBy("relevance");
    setCurrentPage(1);

    // Réinitialiser l'URL en conservant uniquement la requête
    const query = searchParams.get("q");
    if (query) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    } else {
      router.push("/search");
    }
  };

  // Gérer les suggestions de recherche
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (value.length > 2) {
      // Simuler des suggestions basées sur la saisie
      const mockSuggestions = [
        `${value} collecte de fonds`,
        `${value} événement`,
        `${value} donation`,
        `${value} projet`,
      ];
      setSuggestions(mockSuggestions);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // Sélectionner une suggestion
  const handleSelectSuggestion = (suggestion: string) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);

    // Mettre à jour l'URL et effectuer la recherche
    const params = new URLSearchParams();
    params.set("q", suggestion);
    router.push(`/search?${params.toString()}`);
  };

  // Appliquer les filtres
  const applyFilters = () => {
    setCurrentPage(1);
    updateSearchParams();
    setIsFilterOpen(false);
  };

  return (
    <div className="min-h-screen bg-warmgray-50">
      {/* En-tête de recherche */}
      <div className="bg-white border-b sticky top-0 z-20">
        <div className="container py-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <Link
              href="/"
              className="text-2xl font-bold text-gofundme-600 mr-4"
            >
              Quick
            </Link>

            <form onSubmit={handleSearch} className="relative flex-1 max-w-3xl">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="search"
                placeholder="Rechercher des campagnes, des événements, des produits..."
                value={searchQuery}
                onChange={handleInputChange}
                className="pl-10 pr-4 py-2.5 h-12 text-base rounded-full border-gray-300 focus:border-gofundme-600 focus:ring-gofundme-600 w-full"
                onFocus={() =>
                  searchQuery.length > 2 && setShowSuggestions(true)
                }
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              />

              {/* Suggestions de recherche */}
              {showSuggestions && suggestions.length > 0 && (
                <SearchSuggestions
                  suggestions={suggestions}
                  onSelect={handleSelectSuggestion}
                />
              )}

              <Button
                type="submit"
                className="absolute right-1 top-1/2 -translate-y-1/2 bg-gofundme-600 hover:bg-gofundme-700 rounded-full h-10 px-5"
              >
                Rechercher
              </Button>
            </form>

            <div className="flex items-center gap-2 ml-auto">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="gap-2 rounded-full border-gray-300"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filtres
              </Button>

              <div className="hidden md:flex border rounded-md">
                <Button
                  variant="ghost"
                  size="icon"
                  className={viewMode === "grid" ? "bg-gray-100" : ""}
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="h-4 w-4" />
                  <span className="sr-only">Affichage en grille</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className={viewMode === "list" ? "bg-gray-100" : ""}
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                  <span className="sr-only">Affichage en liste</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filtres mobiles */}
      <AnimatePresence>
        {isFilterOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden bg-white border-b"
          >
            <div className="container py-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-lg">Filtres</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsFilterOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-2">Catégories</h4>
                  <Select
                    value={selectedCategory}
                    onValueChange={setSelectedCategory}
                  >
                    <SelectTrigger className="rounded-md border-gray-300">
                      <SelectValue placeholder="Sélectionner une catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Types</h4>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger className="rounded-md border-gray-300">
                      <SelectValue placeholder="Sélectionner un type" />
                    </SelectTrigger>
                    <SelectContent>
                      {linkTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Fourchette de prix (€)</h4>
                  <div className="px-2">
                    <Slider
                      value={priceRange}
                      min={0}
                      max={10000}
                      step={100}
                      onValueChange={(value) =>
                        setPriceRange(value as [number, number])
                      }
                      className="my-6"
                    />
                    <div className="flex items-center justify-between text-sm">
                      <span>{priceRange[0].toLocaleString()} €</span>
                      <span>{priceRange[1].toLocaleString()} €</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Jours restants</h4>
                  <Select
                    value={daysLeft?.toString() || ""}
                    onValueChange={(value) =>
                      setDaysLeft(value ? Number.parseInt(value) : null)
                    }
                  >
                    <SelectTrigger className="rounded-md border-gray-300">
                      <SelectValue placeholder="Tous" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous</SelectItem>
                      <SelectItem value="7">7 jours ou moins</SelectItem>
                      <SelectItem value="14">14 jours ou moins</SelectItem>
                      <SelectItem value="30">30 jours ou moins</SelectItem>
                      <SelectItem value="60">60 jours ou moins</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="mobile-featured"
                    checked={onlyFeatured}
                    onCheckedChange={(checked) =>
                      setOnlyFeatured(checked as boolean)
                    }
                  />
                  <label
                    htmlFor="mobile-featured"
                    className="text-sm cursor-pointer"
                  >
                    Campagnes en vedette uniquement
                  </label>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Trier par</h4>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="rounded-md border-gray-300">
                      <SelectValue placeholder="Trier par" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="relevance">Pertinence</SelectItem>
                      <SelectItem value="recent">Plus récents</SelectItem>
                      <SelectItem value="amount-high">
                        Montant collecté (élevé)
                      </SelectItem>
                      <SelectItem value="amount-low">
                        Montant collecté (faible)
                      </SelectItem>
                      <SelectItem value="trending">Tendances</SelectItem>
                      <SelectItem value="days-left">Jours restants</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    onClick={handleReset}
                    className="flex-1 rounded-full"
                  >
                    Réinitialiser
                  </Button>
                  <Button
                    onClick={applyFilters}
                    className="flex-1 bg-gofundme-600 hover:bg-gofundme-700 rounded-full"
                  >
                    Appliquer
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container py-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Filtres latéraux (desktop) */}
          <div className="hidden md:block space-y-6 bg-white p-6 rounded-lg border border-gray-200 h-fit sticky top-28">
            <div>
              <h3 className="font-medium text-lg mb-4">Filtres</h3>

              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-3">Catégories</h4>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <div key={category.id} className="flex items-center">
                        <Checkbox
                          id={`category-${category.id}`}
                          checked={selectedCategory === category.id}
                          onCheckedChange={() =>
                            setSelectedCategory(category.id)
                          }
                        />
                        <label
                          htmlFor={`category-${category.id}`}
                          className="ml-2 text-sm cursor-pointer"
                        >
                          {category.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Types</h4>
                  <div className="space-y-2">
                    {linkTypes.map((type) => (
                      <div key={type.id} className="flex items-center">
                        <Checkbox
                          id={`type-${type.id}`}
                          checked={selectedType === type.id}
                          onCheckedChange={() => setSelectedType(type.id)}
                        />
                        <label
                          htmlFor={`type-${type.id}`}
                          className="ml-2 text-sm cursor-pointer"
                        >
                          {type.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Fourchette de prix (€)</h4>
                  <div className="px-2">
                    <Slider
                      value={priceRange}
                      min={0}
                      max={10000}
                      step={100}
                      onValueChange={(value) =>
                        setPriceRange(value as [number, number])
                      }
                      className="my-6"
                    />
                    <div className="flex items-center justify-between text-sm">
                      <span>{priceRange[0].toLocaleString()} €</span>
                      <span>{priceRange[1].toLocaleString()} €</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Jours restants</h4>
                  <Select
                    value={daysLeft?.toString() || ""}
                    onValueChange={(value) =>
                      setDaysLeft(value ? Number.parseInt(value) : null)
                    }
                  >
                    <SelectTrigger className="rounded-md border-gray-300">
                      <SelectValue placeholder="Tous" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous</SelectItem>
                      <SelectItem value="7">7 jours ou moins</SelectItem>
                      <SelectItem value="14">14 jours ou moins</SelectItem>
                      <SelectItem value="30">30 jours ou moins</SelectItem>
                      <SelectItem value="60">60 jours ou moins</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="featured"
                    checked={onlyFeatured}
                    onCheckedChange={(checked) =>
                      setOnlyFeatured(checked as boolean)
                    }
                  />
                  <label htmlFor="featured" className="text-sm cursor-pointer">
                    Campagnes en vedette uniquement
                  </label>
                </div>

                <Button
                  variant="outline"
                  onClick={handleReset}
                  className="w-full rounded-full"
                >
                  Réinitialiser les filtres
                </Button>

                <Button
                  onClick={applyFilters}
                  className="w-full bg-gofundme-600 hover:bg-gofundme-700 rounded-full"
                >
                  Appliquer les filtres
                </Button>
              </div>
            </div>
          </div>

          {/* Résultats de recherche */}
          <div className="md:col-span-3 space-y-6">
            {/* Barre d'outils des résultats */}
            <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center bg-white p-4 rounded-lg border border-gray-200">
              <div>
                <h2 className="font-medium text-lg">
                  {searchParams.has("q")
                    ? `Résultats pour "${searchParams.get("q")}"`
                    : "Toutes les campagnes"}
                </h2>
                <div className="text-sm text-gray-500">
                  {totalResults} résultat{totalResults !== 1 ? "s" : ""}
                </div>

                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedCategory !== "all" && (
                    <Badge
                      variant="outline"
                      className="flex items-center gap-1 bg-white"
                    >
                      {categories.find((c) => c.id === selectedCategory)
                        ?.name || selectedCategory}
                      <button
                        onClick={() => {
                          setSelectedCategory("all");
                          updateSearchParams();
                        }}
                      >
                        <X className="h-3 w-3 ml-1" />
                      </button>
                    </Badge>
                  )}
                  {selectedType !== "all" && (
                    <Badge
                      variant="outline"
                      className="flex items-center gap-1 bg-white"
                    >
                      {linkTypes.find((t) => t.id === selectedType)?.name ||
                        selectedType}
                      <button
                        onClick={() => {
                          setSelectedType("all");
                          updateSearchParams();
                        }}
                      >
                        <X className="h-3 w-3 ml-1" />
                      </button>
                    </Badge>
                  )}
                  {onlyFeatured && (
                    <Badge
                      variant="outline"
                      className="flex items-center gap-1 bg-white"
                    >
                      Campagnes en vedette
                      <button
                        onClick={() => {
                          setOnlyFeatured(false);
                          updateSearchParams();
                        }}
                      >
                        <X className="h-3 w-3 ml-1" />
                      </button>
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Select
                  value={sortBy}
                  onValueChange={(value) => {
                    setSortBy(value);
                    updateSearchParams();
                  }}
                >
                  <SelectTrigger className="w-full sm:w-[200px] rounded-md border-gray-300">
                    <div className="flex items-center gap-2">
                      {sortBy === "relevance" && (
                        <SearchIcon className="h-4 w-4" />
                      )}
                      {sortBy === "recent" && <Clock className="h-4 w-4" />}
                      {sortBy === "trending" && (
                        <TrendingUp className="h-4 w-4" />
                      )}
                      {(sortBy === "amount-high" ||
                        sortBy === "amount-low") && (
                        <ArrowUpDown className="h-4 w-4" />
                      )}
                      <SelectValue placeholder="Trier par" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">
                      <div className="flex items-center gap-2">
                        <SearchIcon className="h-4 w-4" />
                        <span>Pertinence</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="recent">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>Plus récents</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="amount-high">
                      <div className="flex items-center gap-2">
                        <ArrowUpDown className="h-4 w-4" />
                        <span>Montant collecté (élevé)</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="amount-low">
                      <div className="flex items-center gap-2">
                        <ArrowUpDown className="h-4 w-4" />
                        <span>Montant collecté (faible)</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="trending">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" />
                        <span>Tendances</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* État de chargement */}
            {isLoading && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array(6)
                  .fill(0)
                  .map((_, i) => (
                    <SkeletonCard key={i} />
                  ))}
              </div>
            )}

            {/* Message d'erreur */}
            {error && !isLoading && (
              <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <h3 className="text-lg font-medium mb-2 text-red-600">
                  Une erreur est survenue
                </h3>
                <p className="text-gray-600 mb-6">{error}</p>
                <Button
                  onClick={handleReset}
                  className="bg-gofundme-600 hover:bg-gofundme-700 rounded-full"
                >
                  Réessayer
                </Button>
              </div>
            )}

            {/* Aucun résultat */}
            {!isLoading && !error && searchResults.length === 0 && (
              <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <h3 className="text-lg font-medium mb-2">
                  Aucun résultat trouvé
                </h3>
                <p className="text-gray-600 mb-6">
                  Aucune campagne ne correspond à vos critères de recherche.
                  Essayez de modifier vos filtres ou votre requête.
                </p>
                <Button
                  onClick={handleReset}
                  className="bg-gofundme-600 hover:bg-gofundme-700 rounded-full"
                >
                  Réinitialiser les filtres
                </Button>
              </div>
            )}

            {/* Liste des résultats */}
            {!isLoading && !error && searchResults.length > 0 && (
              <>
                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                      : "space-y-4"
                  }
                >
                  {searchResults.map((result) => (
                    <CampaignCard
                      key={result.id}
                      id={result.id}
                      title={result.title}
                      category={result.category}
                      image={result.images[0]}
                      merchant={result.merchant}
                      raised={result.raised}
                      goal={result.goal}
                      daysLeft={result.daysLeft}
                      supporters={result.supporters}
                      price={"price" in result ? result.price : undefined}
                      originalPrice={
                        "discountPrice" in result ? result.price : undefined
                      }
                      date={"date" in result ? result.date : undefined}
                      featured={result.featured}
                      type={result.type}
                      description={
                        result.description
                          .replace(/<[^>]*>?/gm, "")
                          .substring(0, 100) + "..."
                      }
                      viewMode={viewMode}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-8">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
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
                            variant={
                              currentPage === page ? "default" : "outline"
                            }
                            size="sm"
                            className={`rounded-full ${
                              currentPage === page
                                ? "bg-gofundme-600 hover:bg-gofundme-700"
                                : ""
                            }`}
                            onClick={() => handlePageChange(page)}
                          >
                            {page}
                          </Button>
                        )
                      )}

                      <Button
                        variant="outline"
                        size="sm"
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

import Image from "next/image";
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

import { Skeleton } from "@/components/ui/skeleton";

function SkeletonCard() {
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
}

import { Search } from "lucide-react";

interface SearchSuggestionsProps {
  suggestions: string[];
  onSelect: (suggestion: string) => void;
}

function SearchSuggestions({ suggestions, onSelect }: SearchSuggestionsProps) {
  return (
    <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-60 overflow-y-auto">
      <ul className="py-2">
        {suggestions.map((suggestion, index) => (
          <li
            key={index}
            className="px-4 py-2 hover:bg-warmgray-50 cursor-pointer flex items-center gap-2"
            onClick={() => onSelect(suggestion)}
          >
            <Search className="h-4 w-4 text-gray-400" />
            <span>{suggestion}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
