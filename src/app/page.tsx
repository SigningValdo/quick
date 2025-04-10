"use client";

import type React from "react";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, TrendingUp, Clock, Award, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Briefcase,
  GraduationCap,
  Heart,
  Calendar,
  ShoppingBag,
  Gift,
} from "lucide-react";
import { useI18n } from "@/i18n/i18n-context";
import {
  getFeaturedLinks,
  getPaymentLinks,
  getCategories,
} from "@/services/api";
import type { PaymentLinkData } from "@/types/payment-link";
import { Badge } from "@/components/ui/badge";

export default function HomePage() {
  const { t, locale } = useI18n();
  const [featuredLinks, setFeaturedLinks] = useState<PaymentLinkData[]>([]);
  const [popularLinks, setPopularLinks] = useState<PaymentLinkData[]>([]);
  const [newLinks, setNewLinks] = useState<PaymentLinkData[]>([]);
  const [endingSoonLinks, setEndingSoonLinks] = useState<PaymentLinkData[]>([]);
  const [categories, setCategories] = useState<
    { id: string; name: string; icon: string; imageUrl: string }[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("recommended");

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Get featured links
        const featured = await getFeaturedLinks(5, locale);
        setFeaturedLinks(featured);

        // Get popular links
        const popular = await getPaymentLinks({
          sort: "popular",
          limit: 8,
          lang: locale,
        });
        setPopularLinks(popular.data);

        // Get new links
        const newProjects = await getPaymentLinks({
          sort: "recent",
          limit: 8,
          lang: locale,
        });
        setNewLinks(newProjects.data);

        // Get ending soon links
        const endingSoon = await getPaymentLinks({
          sort: "days-left",
          limit: 8,
          lang: locale,
        });
        setEndingSoonLinks(endingSoon.data);

        // Get categories
        const cats = await getCategories(locale);
        // Add image URLs to categories
        const categoriesWithImages = cats.map((cat) => ({
          ...cat,
          imageUrl: `/placeholder.svg?height=400&width=400&text=${cat.name}`,
        }));
        setCategories(categoriesWithImages);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [locale]);

  // Platform stats
  const stats = [
    {
      label: t("home.stats.projectsFunded", {
        defaultValue: "Projets financés",
      }),
      value: 235789,
      prefix: "",
      suffix: "",
    },
    {
      label: t("home.stats.amountCollected", {
        defaultValue: "Montant collecté",
      }),
      value: 6500000,
      prefix: "€",
      suffix: "",
    },
    {
      label: t("home.stats.successRate", { defaultValue: "Taux de réussite" }),
      value: 78,
      prefix: "",
      suffix: "%",
    },
    {
      label: t("home.stats.contributors", { defaultValue: "Contributeurs" }),
      value: 892450,
      prefix: "",
      suffix: "",
    },
  ];

  // Données fictives pour les témoignages
  const testimonials = [
    {
      content: t("home.testimonials.content1", {
        defaultValue:
          "Quick m'a permis de collecter rapidement des fonds pour mon projet. L'interface est intuitive et les options de personnalisation sont excellentes.",
      }),
      author: {
        name: "Thomas Lefebvre",
        role: t("home.testimonials.role1", { defaultValue: "Entrepreneur" }),
        avatar: "/placeholder.svg?height=100&width=100",
      },
      rating: 5,
    },
    {
      content: t("home.testimonials.content2", {
        defaultValue:
          "J'ai pu financer mon traitement médical grâce à la générosité des donateurs sur Quick. La plateforme est sécurisée et transparente.",
      }),
      author: {
        name: "Émilie Moreau",
        role: t("home.testimonials.role2", { defaultValue: "Bénéficiaire" }),
        avatar: "/placeholder.svg?height=100&width=100",
      },
      rating: 5,
    },
    {
      content: t("home.testimonials.content3", {
        defaultValue:
          "Notre association utilise Quick pour toutes nos collectes de fonds. Le service client est réactif et les frais sont raisonnables.",
      }),
      author: {
        name: "Jean Dubois",
        role: t("home.testimonials.role3", {
          defaultValue: "Directeur d'association",
        }),
        avatar: "/placeholder.svg?height=100&width=100",
      },
      rating: 4,
    },
  ];

  // Fonction pour obtenir l'icône correspondant à une catégorie
  const getCategoryIcon = (iconName: string) => {
    const icons: Record<string, React.ReactNode> = {
      Heart: <Heart className="h-6 w-6 text-teal-600" />,
      GraduationCap: <GraduationCap className="h-6 w-6 text-teal-600" />,
      Briefcase: <Briefcase className="h-6 w-6 text-teal-600" />,
      Calendar: <Calendar className="h-6 w-6 text-teal-600" />,
      ShoppingBag: <ShoppingBag className="h-6 w-6 text-teal-600" />,
      Gift: <Gift className="h-6 w-6 text-teal-600" />,
    };

    return icons[iconName] || <Heart className="h-6 w-6 text-teal-600" />;
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-white border-b">
        <div className="container py-12 md:py-16 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <motion.h1
                className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {t("home.hero.title", {
                  defaultValue: "Donnez vie à vos idées avec Quick",
                })}
              </motion.h1>
              <motion.p
                className="text-xl text-gray-600 max-w-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                {t("home.hero.subtitle", {
                  defaultValue:
                    "Créez des liens de paiement personnalisés pour vos projets, événements ou collectes de fonds en quelques clics.",
                })}
              </motion.p>
              <motion.div
                className="flex flex-wrap gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Button
                  asChild
                  size="lg"
                  className="bg-teal-600 hover:bg-teal-700 rounded-full px-8"
                >
                  <Link href="/create">
                    {t("home.hero.createLink", {
                      defaultValue: "Créer un lien",
                    })}
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="rounded-full px-8"
                >
                  <Link href="/explore">
                    {t("home.hero.exploreProjects", {
                      defaultValue: "Explorer les projets",
                    })}
                  </Link>
                </Button>
              </motion.div>
            </div>
            <div className="relative">
              {isLoading ? (
                <div className="aspect-[4/3] bg-gray-100 animate-pulse rounded-lg"></div>
              ) : featuredLinks.length > 0 ? (
                <FeaturedProject project={featuredLinks[0]} />
              ) : (
                <div className="aspect-[4/3] bg-gray-100 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">
                    {t("home.hero.noFeaturedProjects", {
                      defaultValue: "Aucun projet en vedette",
                    })}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-50 py-12 border-b">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {stats.map((stat, index) => (
              <StatsCounter
                key={index}
                label={stat.label}
                value={stat.value}
                prefix={stat.prefix}
                suffix={stat.suffix}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl md:text-3xl font-bold">
              {t("home.categories.title", {
                defaultValue: "Parcourir par catégorie",
              })}
            </h2>
            <Link
              href="/categories"
              className="text-teal-600 hover:text-teal-700 font-medium flex items-center gap-1"
            >
              {t("home.categories.viewAll", {
                defaultValue: "Voir toutes les catégories",
              })}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
            {isLoading
              ? Array(6)
                  .fill(0)
                  .map((_, i) => (
                    <div
                      key={i}
                      className="aspect-square bg-gray-100 animate-pulse rounded-lg"
                    ></div>
                  ))
              : categories.slice(0, 6).map((category) => (
                  <CategoryCard
                    key={category.id}
                    id={category.id}
                    title={t(`categories.${category.id}`, {
                      defaultValue: category.name,
                    })}
                    imageUrl={category.imageUrl}
                    href={`/explore?category=${category.id}`}
                  />
                ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-10"
          >
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl md:text-3xl font-bold">
                {t("home.projects.title", {
                  defaultValue: "Projets à découvrir",
                })}
              </h2>
              <TabsList className="bg-white border rounded-full p-1">
                <TabsTrigger
                  value="recommended"
                  className="rounded-full data-[state=active]:bg-teal-600 data-[state=active]:text-white"
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  {t("home.projects.recommended", {
                    defaultValue: "Recommandés",
                  })}
                </TabsTrigger>
                <TabsTrigger
                  value="new"
                  className="rounded-full data-[state=active]:bg-teal-600 data-[state=active]:text-white"
                >
                  <Zap className="h-4 w-4 mr-2" />
                  {t("home.projects.new", { defaultValue: "Nouveautés" })}
                </TabsTrigger>
                <TabsTrigger
                  value="ending"
                  className="rounded-full data-[state=active]:bg-teal-600 data-[state=active]:text-white"
                >
                  <Clock className="h-4 w-4 mr-2" />
                  {t("home.projects.endingSoon", {
                    defaultValue: "Bientôt terminés",
                  })}
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="recommended" className="mt-0">
              {isLoading ? (
                <div className="aspect-[21/9] bg-gray-200 animate-pulse rounded-lg"></div>
              ) : (
                <>
                  <FeaturedCarouselLarge>
                    {popularLinks
                      .slice(0, Math.min(3, popularLinks.length))
                      .map((project) => (
                        <div
                          key={project.id}
                          className="relative aspect-[21/9] rounded-lg overflow-hidden"
                        >
                          <Image
                            src={project.images[0] || "/placeholder.svg"}
                            alt={project.title}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                            <Badge className="bg-teal-600 border-none mb-4">
                              {project.category}
                            </Badge>
                            <h3 className="text-3xl font-bold mb-2">
                              {project.title}
                            </h3>
                            <p className="text-lg text-white/80 mb-4 max-w-2xl">
                              {project.description
                                .replace(/<[^>]*>?/gm, "")
                                .substring(0, 150)}
                              ...
                            </p>

                            {project.type === "fundraising" &&
                              project.raised !== undefined &&
                              project.goal !== undefined && (
                                <div className="space-y-2 max-w-md mb-6">
                                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/30">
                                    <div
                                      className="h-full bg-teal-500"
                                      style={{
                                        width: `${Math.min(
                                          (project.raised / project.goal) * 100,
                                          100
                                        )}%`,
                                      }}
                                    />
                                  </div>
                                  <div className="flex justify-between text-sm">
                                    <span className="font-medium">
                                      {project.raised.toLocaleString()} €
                                      collectés
                                    </span>
                                    <span>
                                      {Math.round(
                                        (project.raised / project.goal) * 100
                                      )}
                                      {"% de l'objectif"}
                                    </span>
                                  </div>
                                </div>
                              )}

                            <Button
                              asChild
                              className="bg-teal-600 hover:bg-teal-700 rounded-full"
                            >
                              <Link href={`/${project.id}`}>
                                Voir ce projet
                              </Link>
                            </Button>
                          </div>
                        </div>
                      ))}
                  </FeaturedCarouselLarge>

                  <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {popularLinks.slice(3, 7).map((project) => (
                      <CampaignCard
                        key={project.id}
                        id={project.id}
                        title={project.title}
                        category={project.category}
                        image={project.images[0]}
                        merchant={project.merchant}
                        raised={project.raised}
                        goal={project.goal}
                        daysLeft={project.daysLeft}
                        supporters={project.supporters}
                        price={"price" in project ? project.price : undefined}
                        originalPrice={
                          "discountPrice" in project ? project.price : undefined
                        }
                        date={"date" in project ? project.date : undefined}
                        featured={project.featured}
                        type={project.type}
                      />
                    ))}
                  </div>
                </>
              )}
            </TabsContent>

            <TabsContent value="new" className="mt-0">
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {Array(8)
                    .fill(0)
                    .map((_, i) => (
                      <div
                        key={i}
                        className="aspect-[3/4] bg-gray-100 animate-pulse rounded-lg"
                      ></div>
                    ))}
                </div>
              ) : (
                <ProjectCarousel projects={newLinks} />
              )}
            </TabsContent>

            <TabsContent value="ending" className="mt-0">
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {Array(8)
                    .fill(0)
                    .map((_, i) => (
                      <div
                        key={i}
                        className="aspect-[3/4] bg-gray-100 animate-pulse rounded-lg"
                      ></div>
                    ))}
                </div>
              ) : (
                <ProjectCarousel projects={endingSoonLinks} />
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Featured Collections */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl md:text-3xl font-bold">
              {t("home.collections.title", {
                defaultValue: "Collections en vedette",
              })}
            </h2>
            <Link
              href="/collections"
              className="text-teal-600 hover:text-teal-700 font-medium flex items-center gap-1"
            >
              {t("home.collections.viewAll", {
                defaultValue: "Voir toutes les collections",
              })}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Collection cards */}
            <Link href="/collections/innovation" className="group">
              <div className="relative aspect-[16/9] overflow-hidden rounded-t-lg">
                <Image
                  src="/placeholder.svg?height=400&width=800&text=Innovation"
                  alt="Innovation"
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <div className="bg-gray-50 p-6 rounded-b-lg border border-t-0">
                <h3 className="text-xl font-bold mb-2 group-hover:text-teal-600 transition-colors">
                  {t("home.collections.innovationTitle", {
                    defaultValue: "Innovation & Technologie",
                  })}
                </h3>
                <p className="text-gray-600">
                  {t("home.collections.innovationDescription", {
                    defaultValue:
                      "Découvrez les projets qui façonnent notre futur",
                  })}
                </p>
              </div>
            </Link>

            <Link href="/collections/creative" className="group">
              <div className="relative aspect-[16/9] overflow-hidden rounded-t-lg">
                <Image
                  src="/placeholder.svg?height=400&width=800&text=Créatifs"
                  alt="Créatifs"
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <div className="bg-gray-50 p-6 rounded-b-lg border border-t-0">
                <h3 className="text-xl font-bold mb-2 group-hover:text-teal-600 transition-colors">
                  {t("home.collections.creativeTitle", {
                    defaultValue: "Projets créatifs",
                  })}
                </h3>
                <p className="text-gray-600">
                  {t("home.collections.creativeDescription", {
                    defaultValue: "Art, musique, films et plus encore",
                  })}
                </p>
              </div>
            </Link>

            <Link href="/collections/social" className="group">
              <div className="relative aspect-[16/9] overflow-hidden rounded-t-lg">
                <Image
                  src="/placeholder.svg?height=400&width=800&text=Impact"
                  alt="Impact social"
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <div className="bg-gray-50 p-6 rounded-b-lg border border-t-0">
                <h3 className="text-xl font-bold mb-2 group-hover:text-teal-600 transition-colors">
                  {t("home.collections.socialTitle", {
                    defaultValue: "Impact social",
                  })}
                </h3>
                <p className="text-gray-600">
                  {t("home.collections.socialDescription", {
                    defaultValue: "Projets qui changent le monde pour le mieux",
                  })}
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl md:text-3xl font-bold">
              {t("home.successStories.title", {
                defaultValue: "Histoires de réussite",
              })}
            </h2>
            <Link
              href="/success-stories"
              className="text-teal-600 hover:text-teal-700 font-medium flex items-center gap-1"
            >
              {t("home.successStories.viewAll", {
                defaultValue: "Voir toutes les histoires",
              })}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg overflow-hidden shadow-sm border">
              <div className="grid md:grid-cols-2">
                <div className="relative aspect-square md:aspect-auto">
                  <Image
                    src="/placeholder.svg?height=600&width=600&text=Success"
                    alt="Histoire de réussite"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6 flex flex-col">
                  <div className="flex items-center gap-2 mb-4">
                    <Award className="h-5 w-5 text-yellow-500" />
                    <span className="text-sm font-medium text-yellow-500">
                      {t("home.successStories.projectOfMonth", {
                        defaultValue: "Projet du mois",
                      })}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">
                    {t("home.successStories.project1Title", {
                      defaultValue: "EcoTech: Solution d'énergie renouvelable",
                    })}
                  </h3>
                  <p className="text-gray-600 mb-4 flex-grow">
                    {t("home.successStories.project1Description", {
                      defaultValue:
                        "Ce projet a dépassé son objectif de financement de 200% et a révolutionné l'accès à l'énergie propre dans les zones rurales.",
                    })}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>€125,000 collectés</span>
                    <span>1,245 contributeurs</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg overflow-hidden shadow-sm border">
              <div className="grid md:grid-cols-2">
                <div className="relative aspect-square md:aspect-auto">
                  <Image
                    src="/placeholder.svg?height=600&width=600&text=Success"
                    alt="Histoire de réussite"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6 flex flex-col">
                  <div className="flex items-center gap-2 mb-4">
                    <Award className="h-5 w-5 text-yellow-500" />
                    <span className="text-sm font-medium text-yellow-500">
                      {t("home.successStories.popularProject", {
                        defaultValue: "Projet populaire",
                      })}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">
                    {t("home.successStories.project2Title", {
                      defaultValue: "ArtSpace: Galerie communautaire",
                    })}
                  </h3>
                  <p className="text-gray-600 mb-4 flex-grow">
                    {t("home.successStories.project2Description", {
                      defaultValue:
                        "Ce projet a transformé un espace abandonné en une galerie d'art vibrante qui accueille maintenant des artistes locaux.",
                    })}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>€75,000 collectés</span>
                    <span>890 contributeurs</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-teal-600 text-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              {t("home.cta.title", {
                defaultValue: "Prêt à lancer votre projet ?",
              })}
            </h2>
            <p className="text-xl text-teal-50 mb-8">
              {t("home.cta.subtitle", {
                defaultValue:
                  "Rejoignez des milliers de créateurs qui ont donné vie à leurs idées grâce à Quick.",
              })}
            </p>
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="rounded-full px-8"
            >
              <Link href="/create">
                {t("home.cta.startNow", {
                  defaultValue: "Commencer maintenant",
                })}
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

import { Users } from "lucide-react";

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
  href,
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

interface FeaturedProjectProps {
  project: PaymentLinkData;
}

const FeaturedProject = ({ project }: FeaturedProjectProps) => {
  const { id, title, category, images, merchant, type } = project;
  const raised = "raised" in project ? project.raised : undefined;
  const goal = "goal" in project ? project.goal : undefined;
  const daysLeft = "daysLeft" in project ? project.daysLeft : undefined;

  return (
    <motion.div
      className="relative rounded-lg overflow-hidden shadow-lg border"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Link href={`/${id}`} className="block">
        <div className="relative aspect-[4/3]">
          <Image
            src={images[0] || "/placeholder.svg"}
            alt={title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>

          <div className="absolute top-4 left-4 flex gap-2">
            <Badge className="bg-teal-600 text-white border-none">
              En vedette
            </Badge>
            <Badge variant="outline" className="bg-white/80 backdrop-blur-sm">
              {category}
            </Badge>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <h3 className="text-2xl font-bold mb-2 line-clamp-2">{title}</h3>

            <div className="flex items-center gap-3 mb-3">
              <div className="relative h-8 w-8 overflow-hidden rounded-full border border-white/30">
                <Image
                  src={merchant.avatar || "/placeholder.svg"}
                  alt={merchant.name}
                  fill
                  className="object-cover"
                />
              </div>
              <span className="text-sm">{merchant.name}</span>
            </div>

            {type === "fundraising" &&
              raised !== undefined &&
              goal !== undefined && (
                <div className="space-y-2">
                  <div className="h-2 w-full overflow-hidden rounded-full bg-white/30">
                    <div
                      className="h-full bg-teal-500"
                      style={{
                        width: `${Math.min((raised / goal) * 100, 100)}%`,
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">
                      {raised.toLocaleString()} € collectés
                    </span>
                    <span>
                      {Math.round((raised / goal) * 100)}
                      {"% de l'objectif"}
                    </span>
                  </div>
                </div>
              )}

            {daysLeft && (
              <div className="mt-2 text-sm">
                {daysLeft > 0
                  ? `${daysLeft} jours restants`
                  : "Dernières heures !"}
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

import { useRef } from "react";
import { useInView } from "framer-motion";

interface StatsCounterProps {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
}

const StatsCounter = ({
  label,
  value,
  prefix = "",
  suffix = "",
  duration = 2,
}: StatsCounterProps) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const end = value;

    // First three digits count faster, then slow down for larger numbers
    const threshold = 1000;
    const increment =
      end > threshold ? end / (duration * 60) : end / (duration * 30);

    const timer = setInterval(() => {
      start += increment;
      setCount(Math.min(Math.floor(start), end));

      if (start >= end) {
        clearInterval(timer);
        setCount(end);
      }
    }, 16);

    return () => clearInterval(timer);
  }, [isInView, value, duration]);

  const formattedCount = count.toLocaleString();

  return (
    <motion.div
      ref={ref}
      className="text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
    >
      <p className="text-3xl md:text-4xl font-bold text-teal-600">
        {prefix}
        {formattedCount}
        {suffix}
      </p>
      <p className="text-gray-600 mt-2">{label}</p>
    </motion.div>
  );
};

import { ChevronLeft, ChevronRight } from "lucide-react";
// import { CampaignCard } from "@/components/campaign-card";

interface ProjectCarouselProps {
  projects: PaymentLinkData[];
}

const ProjectCarousel = ({ projects }: ProjectCarouselProps) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [itemsPerPage, setItemsPerPage] = useState(4);

  // Determine items per page based on screen width
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerPage(1);
      } else if (window.innerWidth < 768) {
        setItemsPerPage(2);
      } else if (window.innerWidth < 1024) {
        setItemsPerPage(3);
      } else {
        setItemsPerPage(4);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Calculate total pages
  useEffect(() => {
    if (projects.length > 0 && itemsPerPage > 0) {
      setTotalPages(Math.ceil(projects.length / itemsPerPage));
    }
  }, [projects, itemsPerPage]);

  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  // Get current page items
  const getCurrentPageItems = () => {
    const startIndex = currentPage * itemsPerPage;
    return projects.slice(startIndex, startIndex + itemsPerPage);
  };

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={containerRef}>
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          initial={{ opacity: 1 }}
          animate={{ x: `calc(-${currentPage * 100}%)` }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          style={{ width: `${totalPages * 100}%` }}
        >
          {projects.map((project) => (
            <div key={project.id} className="w-full">
              <CampaignCard
                id={project.id}
                title={project.title}
                category={project.category}
                image={project.images[0]}
                merchant={project.merchant}
                raised={project.raised}
                goal={project.goal}
                daysLeft={project.daysLeft}
                supporters={project.supporters}
                price={"price" in project ? project.price : undefined}
                originalPrice={
                  "discountPrice" in project ? project.price : undefined
                }
                date={"date" in project ? project.date : undefined}
                featured={project.featured}
                type={project.type}
              />
            </div>
          ))}
        </motion.div>
      </div>

      {totalPages > 1 && (
        <>
          <Button
            variant="outline"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 rounded-full bg-white shadow-md border-gray-200"
            onClick={prevPage}
          >
            <ChevronLeft className="h-5 w-5" />
            <span className="sr-only">Précédent</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 rounded-full bg-white shadow-md border-gray-200"
            onClick={nextPage}
          >
            <ChevronRight className="h-5 w-5" />
            <span className="sr-only">Suivant</span>
          </Button>

          <div className="flex justify-center mt-8 gap-2">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                className={`h-2 w-2 rounded-full transition-colors ${
                  currentPage === index ? "bg-teal-600" : "bg-gray-300"
                }`}
                onClick={() => setCurrentPage(index)}
                aria-label={`Page ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

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
