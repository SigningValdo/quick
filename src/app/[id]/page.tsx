"use client";

import type React from "react";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Calendar,
  Clock,
  Heart,
  Share2,
  Users,
  Facebook,
  Twitter,
  Mail,
  LinkIcon,
  Bell,
  CheckCircle2,
  MapPin,
  Tag,
} from "lucide-react";
import { useMobile } from "@/hooks/use-mobile";
import { PaymentLinkData } from "@/types/payment-link";

// Données fictives pour les liens de paiement
const paymentLinks: Record<string, PaymentLinkData> = {
  "1": {
    id: "1",
    title: "Aide pour les frais médicaux de Sophie",
    description: `
      <p>Sophie, 8 ans, a été diagnostiquée avec une maladie rare qui nécessite un traitement spécialisé non couvert par l'assurance maladie. Votre soutien nous aidera à couvrir les frais médicaux, les déplacements pour les consultations et les médicaments.</p>
      <p>Le traitement doit commencer rapidement pour maximiser les chances de guérison. Chaque don, quel que soit son montant, nous rapproche de notre objectif.</p>
      <h3>À quoi servira votre don</h3>
      <ul>
        <li>Traitement médical spécialisé (70%)</li>
        <li>Frais de déplacement pour les consultations (20%)</li>
        <li>Médicaments et équipements (10%)</li>
      </ul>
      <p>Nous vous tiendrons régulièrement informés de l'évolution de la situation de Sophie et de l'utilisation des fonds.</p>
    `,
    category: "Médical",
    type: "fundraising",
    images: [
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
    ],
    merchant: {
      name: "Marie Dupont",
      avatar: "/placeholder.svg?height=100&width=100",
      bio: "Mère de Sophie, je cherche à financer les traitements médicaux de ma fille atteinte d'une maladie rare.",
      location: "Lyon, France",
      verified: true,
      joinedDate: "Janvier 2023",
    },
    raised: 8500,
    goal: 10000,
    daysLeft: 15,
    supporters: 124,
    donationOptions: [
      { amount: 10, label: "Contribuer aux médicaments" },
      { amount: 50, label: "Aider pour un rendez-vous médical" },
      { amount: 100, label: "Soutenir une semaine de traitement" },
      { amount: 500, label: "Financer un mois de traitement" },
    ],
    updates: [
      {
        date: "15 mars 2023",
        title: "Premier rendez-vous médical",
        content:
          "Nous avons rencontré le spécialiste aujourd'hui. Le traitement pourra commencer dès la semaine prochaine. Merci pour votre soutien !",
      },
      {
        date: "22 mars 2023",
        title: "Début du traitement",
        content:
          "Sophie a commencé son traitement aujourd'hui. Elle est courageuse et les médecins sont optimistes. Nous vous tiendrons informés des progrès.",
      },
    ],
    comments: [
      {
        author: {
          name: "Jean Martin",
          avatar: "/placeholder.svg?height=100&width=100",
        },
        date: "20 mars 2023",
        content:
          "Bon courage à Sophie et à toute votre famille. Nous pensons fort à vous.",
      },
      {
        author: {
          name: "Lucie Bernard",
          avatar: "/placeholder.svg?height=100&width=100",
        },
        date: "18 mars 2023",
        content:
          "J'ai partagé votre campagne avec mes amis. J'espère que vous atteindrez rapidement votre objectif.",
      },
    ],
  },
  "2": {
    id: "2",
    title: "Festival de musique électronique - Édition 2023",
    description: `
      <p>Rejoignez-nous pour la 5ème édition de notre festival de musique électronique annuel. Trois jours de musique non-stop avec plus de 30 artistes sur 4 scènes différentes.</p>
      <p>Cette année, nous accueillons des artistes internationaux et locaux pour une expérience musicale inoubliable.</p>
      <h3>Au programme</h3>
      <ul>
        <li>DJ sets et performances live</li>
        <li>Zones de détente et espaces chill-out</li>
        <li>Food trucks et bars</li>
        <li>Camping sur place disponible</li>
      </ul>
      <p>Ne manquez pas cet événement incontournable de la scène électronique française !</p>
    `,
    category: "Musique",
    type: "event",
    images: [
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
    ],
    merchant: {
      name: "Electro Events",
      avatar: "/placeholder.svg?height=100&width=100",
      bio: "Organisateur d'événements musicaux depuis 2015.",
      location: "Montpellier, France",
      verified: true,
      joinedDate: "Mars 2020",
    },
    date: "15-17 juillet 2023",
    time: "14:00 - 02:00",
    location: "Parc des Expositions, Montpellier",
    organizer: "Electro Events",
    ticketOptions: [
      {
        id: "pass-1jour",
        name: "Pass 1 jour",
        price: 45,
        description: "Accès au festival pour une journée au choix",
        available: 500,
      },
      {
        id: "pass-3jours",
        name: "Pass 3 jours",
        price: 110,
        description: "Accès au festival pour les trois jours",
        available: 300,
      },
      {
        id: "pass-vip",
        name: "Pass VIP",
        price: 180,
        description: "Accès VIP avec lounge privé et boissons incluses",
        available: 50,
        maxPerOrder: 4,
      },
    ],
    eventDetails: {
      agenda: "Programmation complète disponible sur notre site web",
      speakers: [
        {
          name: "DJ Pulse",
          bio: "DJ international avec plus de 15 ans d'expérience",
          avatar: "/placeholder.svg?height=100&width=100",
        },
        {
          name: "Electra",
          bio: "Productrice et DJ, spécialisée dans la techno mélodique",
          avatar: "/placeholder.svg?height=100&width=100",
        },
      ],
    },
  },
  "3": {
    id: "3",
    title: "Cours de photographie numérique avancée",
    description: `
      <p>Ce cours complet de photographie numérique avancée vous permettra de maîtriser votre appareil photo et de réaliser des images professionnelles.</p>
      <p>Conçu par des photographes professionnels, ce cours couvre tous les aspects techniques et artistiques de la photographie moderne.</p>
      <h3>Ce que vous apprendrez</h3>
      <ul>
        <li>Maîtrise complète du mode manuel</li>
        <li>Composition avancée et théorie des couleurs</li>
        <li>Post-traitement avec Lightroom et Photoshop</li>
        <li>Techniques d'éclairage en studio et en extérieur</li>
        <li>Création d'un portfolio professionnel</li>
      </ul>
      <p>Accès à vie au contenu et aux mises à jour futures.</p>
    `,
    category: "Formation",
    type: "product_digital",
    images: [
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
    ],
    merchant: {
      name: "Studio Lumière",
      avatar: "/placeholder.svg?height=100&width=100",
      bio: "École de photographie en ligne depuis 2018.",
      location: "Paris, France",
      verified: true,
      joinedDate: "Juin 2019",
    },
    price: 199,
    discountPrice: 149,
    features: [
      "Plus de 50 heures de contenu vidéo HD",
      "200+ exercices pratiques",
      "Accès à un groupe privé d'entraide",
      "Certificat de réussite",
      "30 jours de garantie satisfait ou remboursé",
    ],
    fileType: "Vidéos MP4 + PDF",
    fileSize: "8.5 GB",
    deliveryMethod: "download",
    previewUrl: "/placeholder.svg?height=600&width=800",
  },
  "4": {
    id: "4",
    title: "Montre connectée SportTrack Pro",
    description: `
      <p>La SportTrack Pro est la montre connectée ultime pour les sportifs exigeants. Avec son suivi précis de plus de 20 activités sportives et son autonomie exceptionnelle, elle vous accompagnera dans tous vos défis.</p>
      <p>Son écran AMOLED haute résolution et sa résistance à l'eau jusqu'à 50m en font un compagnon idéal pour tous vos entraînements.</p>
      <h3>Caractéristiques principales</h3>
      <ul>
        <li>Écran AMOLED 1.4" (454 x 454 pixels)</li>
        <li>GPS intégré avec GLONASS et Galileo</li>
        <li>Capteur cardiaque optique de dernière génération</li>
        <li>Autonomie: jusqu'à 14 jours en utilisation normale</li>
        <li>Étanchéité 5 ATM (50m)</li>
        <li>Bluetooth 5.0, compatible Android et iOS</li>
      </ul>
      <p>Garantie 2 ans et livraison gratuite en France métropolitaine.</p>
    `,
    category: "Technologie",
    type: "product_physical",
    images: [
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
    ],
    merchant: {
      name: "TechFit",
      avatar: "/placeholder.svg?height=100&width=100",
      bio: "Spécialiste des équipements connectés pour le sport.",
      location: "Bordeaux, France",
      verified: true,
      joinedDate: "Avril 2021",
    },
    price: 249,
    discountPrice: 199,
    features: [
      "GPS intégré haute précision",
      "Suivi de 20+ activités sportives",
      "Analyse avancée du sommeil",
      "Notifications smartphone",
      "Résistant à l'eau (5 ATM)",
    ],
    variants: [
      {
        id: "color",
        name: "Couleur",
        options: [
          { id: "black", name: "Noir" },
          { id: "silver", name: "Argent" },
          { id: "blue", name: "Bleu" },
        ],
      },
      {
        id: "band",
        name: "Bracelet",
        options: [
          { id: "silicone", name: "Silicone" },
          { id: "leather", name: "Cuir", price: 20 },
          { id: "metal", name: "Métal", price: 30 },
        ],
      },
    ],
    inventory: 150,
    weight: "48g",
    dimensions: "45 x 45 x 12 mm",
    shippingOptions: [
      {
        id: "standard",
        name: "Livraison standard",
        price: 0,
        estimatedDelivery: "3-5 jours ouvrés",
      },
      {
        id: "express",
        name: "Livraison express",
        price: 9.99,
        estimatedDelivery: "1-2 jours ouvrés",
      },
    ],
  },
  "5": {
    id: "5",
    title: "Don pour la protection des océans",
    description: `
      <p>Votre don nous aide à protéger les océans et la vie marine contre la pollution plastique, la surpêche et le changement climatique.</p>
      <p>Nous menons des actions concrètes sur le terrain et des campagnes de sensibilisation pour préserver ces écosystèmes essentiels à notre planète.</p>
      <h3>Nos actions</h3>
      <ul>
        <li>Nettoyage des plages et des fonds marins</li>
        <li>Réhabilitation des écosystèmes marins endommagés</li>
        <li>Lutte contre la pêche illégale</li>
        <li>Sensibilisation du public et éducation</li>
        <li>Plaidoyer pour des politiques de protection marine</li>
      </ul>
      <p>Chaque don, quel que soit son montant, contribue à notre mission de préservation des océans pour les générations futures.</p>
    `,
    category: "Environnement",
    type: "donation",
    images: [
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
    ],
    merchant: {
      name: "Océans Bleus",
      avatar: "/placeholder.svg?height=100&width=100",
      bio: "ONG dédiée à la protection des océans et de la biodiversité marine.",
      location: "Marseille, France",
      verified: true,
      joinedDate: "Février 2018",
    },
    donationOptions: [
      { amount: 5, label: "Nettoyage d'une plage" },
      { amount: 20, label: "Protection d'un récif corallien" },
      { amount: 50, label: "Programme éducatif pour les écoles" },
      { amount: 100, label: "Campagne de sensibilisation" },
    ],
  },
};

export default function PaymentLinkDetailPage({
  params,
}: {
  params: { id: string };
}) {
  // Déclarer tous les hooks au début du composant
  const router = useRouter();
  // const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [donationAmount, setDonationAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [newComment, setNewComment] = useState("");
  const [selectedTicket, setSelectedTicket] = useState("");
  const [selectedVariants, setSelectedVariants] = useState<
    Record<string, string>
  >({});
  const [quantity, setQuantity] = useState(1);
  const isMobile = useMobile();
  const [isMobileState, setIsMobileState] = useState(isMobile);

  // Effet pour gérer la redirection et le montage
  useEffect(() => {
    setMounted(true);
    if (params.id === "explore") {
      router.replace("/explore");
    }
    // Effet pour scroller en haut de la page lors du chargement
    window.scrollTo(0, 0);
  }, [params.id, router]);

  // Effet pour mettre à jour l'état mobile
  useEffect(() => {
    setIsMobileState(isMobile);
  }, [isMobile]);

  // Si nous sommes en train de rediriger vers /explore, ne rien afficher
  if (!mounted || params.id === "explore") {
    return null;
  }

  // Récupérer les données du lien de paiement
  const linkData = paymentLinks[params.id];

  if (!linkData) {
    return (
      <div className="container py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">
          Lien de paiement introuvable
        </h1>
        <p className="mb-8">
          {"Le lien que vous recherchez n'existe pas ou a été supprimé."}
        </p>
        <CTAButton asChild>
          <Link href="/">{"Retour à l'accueil"}</Link>
        </CTAButton>
      </div>
    );
  }

  const handleDonationOptionClick = (amount: number) => {
    setDonationAmount(amount);
    setCustomAmount(amount.toString());
  };

  const handleCustomAmountChange = (amount: string) => {
    setCustomAmount(amount);
    setDonationAmount(null);
  };

  const handleTicketSelect = (ticketId: string) => {
    setSelectedTicket(ticketId);
  };

  const handleVariantChange = (variantId: string, optionId: string) => {
    setSelectedVariants((prev) => ({
      ...prev,
      [variantId]: optionId,
    }));
  };

  const handleQuantityChange = (newQuantity: number) => {
    setQuantity(newQuantity);
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    // Logique pour soumettre le commentaire
    setNewComment("");
  };

  // Fonction pour rendre le contenu spécifique au type
  const renderTypeSpecificContent = () => {
    switch (linkData.type) {
      case "fundraising": {
        const fundraisingData = linkData;
        return (
          <Tabs defaultValue="story" className="w-full">
            <TabsList className="grid w-full grid-cols-3 rounded-full p-1 bg-warmgray-50">
              <TabsTrigger value="story" className="rounded-full">
                Histoire
              </TabsTrigger>
              <TabsTrigger value="updates" className="rounded-full">
                Actualités ({fundraisingData.updates.length})
              </TabsTrigger>
              <TabsTrigger value="comments" className="rounded-full">
                Commentaires ({fundraisingData.comments.length})
              </TabsTrigger>
            </TabsList>
            <TabsContent value="story" className="mt-6">
              <Card className="border-gray-200">
                <CardContent className="p-6">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: fundraisingData.description,
                    }}
                    className="prose max-w-none"
                  />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="updates" className="mt-6 space-y-4">
              {fundraisingData.updates.map((update, index) => (
                <Card key={index} className="border-gray-200">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-2 text-sm text-gray-500">
                      <Calendar className="h-4 w-4" />
                      <span>{update.date}</span>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">
                      {update.title}
                    </h3>
                    <p className="text-gray-700">{update.content}</p>
                  </CardContent>
                </Card>
              ))}
              <div className="flex items-center justify-center gap-2 p-4">
                <button className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border border-gray-200 hover:border-gofundme-600 text-gray-700 hover:text-gofundme-600 transition-colors">
                  <Bell className="h-4 w-4" />
                  Recevoir les actualités
                </button>
              </div>
            </TabsContent>
            <TabsContent value="comments" className="mt-6 space-y-4">
              {fundraisingData.comments.map((comment, index) => (
                <Card key={index} className="border-gray-200">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <div className="gofundme-avatar h-10 w-10">
                        <Image
                          src={comment.author.avatar || "/placeholder.svg"}
                          alt={comment.author.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">
                            {comment.author.name}
                          </span>
                          <span className="text-xs text-gray-500">
                            {comment.date}
                          </span>
                        </div>
                        <p className="text-gray-700">{comment.content}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              <Card className="border-gray-200">
                <CardContent className="p-6">
                  <form onSubmit={handleSubmitComment}>
                    <div className="space-y-4">
                      <div>
                        <label
                          htmlFor="comment"
                          className="block text-sm font-medium mb-1 text-gray-700"
                        >
                          Ajouter un commentaire
                        </label>
                        <Textarea
                          id="comment"
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="Partagez vos encouragements..."
                          className="min-h-[100px] rounded-lg border-gray-300 focus:border-gofundme-600 focus:ring-gofundme-600"
                        />
                      </div>
                      <CTAButton type="submit">Publier</CTAButton>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        );
      }

      case "event": {
        const eventData = linkData;
        return (
          <Card className="border-gray-200">
            <CardContent className="p-6">
              <div className="space-y-6">
                <div
                  dangerouslySetInnerHTML={{ __html: eventData.description }}
                  className="prose max-w-none"
                />

                <div className="grid md:grid-cols-2 gap-6 mt-8">
                  <div className="space-y-4">
                    <h3 className="gofundme-subheading">
                      {"Détails de l'événement"}
                    </h3>
                    <div className="flex items-start gap-3">
                      <Calendar className="h-5 w-5 text-gofundme-600 mt-0.5" />
                      <div>
                        <p className="font-medium">Date</p>
                        <p className="text-sm text-gray-600">
                          {eventData.date}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-gofundme-600 mt-0.5" />
                      <div>
                        <p className="font-medium">Heure</p>
                        <p className="text-sm text-gray-600">
                          {eventData.time}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-gofundme-600 mt-0.5" />
                      <div>
                        <p className="font-medium">Lieu</p>
                        <p className="text-sm text-gray-600">
                          {eventData.location}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="gofundme-subheading">Organisateur</h3>
                    <div className="flex items-center gap-3">
                      <div className="gofundme-avatar h-12 w-12">
                        <Image
                          src={eventData.merchant.avatar || "/placeholder.svg"}
                          alt={eventData.merchant.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium">{eventData.merchant.name}</p>
                        <p className="text-sm text-gray-600">
                          {eventData.merchant.bio}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {eventData.eventDetails.speakers &&
                  eventData.eventDetails.speakers.length > 0 && (
                    <div className="mt-8">
                      <h3 className="gofundme-subheading mb-4">Intervenants</h3>
                      <div className="grid sm:grid-cols-2 gap-4">
                        {eventData.eventDetails.speakers.map(
                          (speaker, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-3 p-4 border rounded-lg bg-warmgray-50"
                            >
                              <div className="gofundme-avatar h-12 w-12">
                                <Image
                                  src={speaker.avatar || "/placeholder.svg"}
                                  alt={speaker.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div>
                                <p className="font-medium">{speaker.name}</p>
                                <p className="text-sm text-gray-600">
                                  {speaker.bio}
                                </p>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}
              </div>
            </CardContent>
          </Card>
        );
      }

      case "product_digital":
      case "product_physical": {
        const productData = linkData;
        return (
          <Card className="border-gray-200">
            <CardContent className="p-6">
              <div className="space-y-6">
                <div
                  dangerouslySetInnerHTML={{ __html: productData.description }}
                  className="prose max-w-none"
                />

                <div className="mt-8">
                  <h3 className="gofundme-subheading mb-4">Caractéristiques</h3>
                  <ul className="space-y-3">
                    {productData.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="rounded-full bg-gofundme-100 p-1 mt-0.5">
                          <CheckCircle2 className="h-3 w-3 text-gofundme-600" />
                        </div>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {productData.type === "product_physical" && (
                  <div className="mt-8 p-4 bg-warmgray-50 rounded-lg">
                    <h3 className="gofundme-subheading mb-3">
                      Informations de livraison
                    </h3>
                    <div className="space-y-2 text-sm">
                      {productData.shippingOptions?.map((option, index) => (
                        <div key={index} className="flex justify-between">
                          <span className="text-gray-700">
                            {option.name} ({option.estimatedDelivery})
                          </span>
                          <span className="font-medium">
                            {option.price === 0
                              ? "Gratuit"
                              : `${option.price} €`}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between mt-8">
                  <div className="flex items-center gap-2">
                    <div className="gofundme-avatar h-8 w-8">
                      <Image
                        src={productData.merchant.avatar || "/placeholder.svg"}
                        alt={productData.merchant.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span className="text-sm">
                      Vendu par{" "}
                      <span className="font-medium">
                        {productData.merchant.name}
                      </span>
                    </span>
                  </div>

                  {productData.type === "product_physical" && (
                    <div className="text-sm text-gray-600">
                      <Tag className="h-4 w-4 inline mr-1" />
                      <span>En stock: {productData.inventory}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      }

      case "donation": {
        const donationData = linkData;
        return (
          <Card className="border-gray-200">
            <CardContent className="p-6">
              <div
                dangerouslySetInnerHTML={{ __html: donationData.description }}
                className="prose max-w-none"
              />
            </CardContent>
          </Card>
        );
      }

      default:
        return null;
    }
  };

  // Fonction pour rendre les informations de progression (pour les collectes de fonds)
  const renderProgressInfo = () => {
    if (
      linkData.type === "fundraising" &&
      linkData.raised !== undefined &&
      linkData.goal !== undefined
    ) {
      return (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold">
              {linkData.raised.toLocaleString()} €
            </span>
            <span className="text-sm text-gray-600">
              sur {linkData.goal.toLocaleString()} €
            </span>
          </div>
          <ProgressBar value={linkData.raised} max={linkData.goal} size="lg" />

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1.5">
              <Users className="h-4 w-4 text-gray-500" />
              <span>{linkData.supporters} donateurs</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-gray-500" />
              <span>{linkData.daysLeft} jours restants</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header immersif */}
      <div className="relative h-[50vh] bg-gray-900">
        <Image
          src={linkData.images[activeImageIndex] || "/placeholder.svg"}
          alt={linkData.title}
          fill
          className="object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 to-transparent" />
        <div className="container relative z-10 h-full flex flex-col justify-end pb-8">
          <Badge className="mb-4 self-start bg-white text-gray-800">
            {linkData.category}
          </Badge>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            {linkData.title}
          </h1>
          <div className="flex items-center gap-4 text-white/90">
            <div className="flex items-center gap-2">
              <div className="gofundme-avatar h-8 w-8">
                <Image
                  src={linkData.merchant.avatar || "/placeholder.svg"}
                  alt={linkData.merchant.name}
                  fill
                  className="object-cover"
                />
              </div>
              <span>{linkData.merchant.name}</span>
              {linkData.merchant.verified && (
                <CheckCircle2 className="h-4 w-4 text-gofundme-100" />
              )}
            </div>
            {linkData.type === "event" && (
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                <span>{(linkData as any).date}</span>
              </div>
            )}
            {linkData.type === "fundraising" && linkData.daysLeft && (
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                <span>{linkData.daysLeft} jours restants</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className={`container py-8 ${isMobileState ? "pb-24" : ""}`}>
        <div className="grid md:grid-cols-3 gap-8">
          {/* Colonne principale */}
          <div className="md:col-span-2 space-y-8">
            {/* Galerie d'images */}
            <Card className="border-gray-200">
              <CardContent className="p-6">
                <div className="relative aspect-video overflow-hidden rounded-lg mb-4">
                  <Image
                    src={
                      linkData.images[activeImageIndex] || "/placeholder.svg"
                    }
                    alt={linkData.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {linkData.images.map((image, index) => (
                    <button
                      key={index}
                      className={`relative h-16 w-24 overflow-hidden rounded-md ${
                        activeImageIndex === index
                          ? "ring-2 ring-gofundme-600"
                          : ""
                      }`}
                      onClick={() => setActiveImageIndex(index)}
                    >
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`Miniature ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Contenu spécifique au type */}
            {renderTypeSpecificContent()}
          </div>

          {/* Colonne latérale */}
          <div className="space-y-6">
            {/* Carte de progression ou d'action */}
            <Card className="sticky top-20 border-gray-200">
              <CardContent className="p-6 space-y-6">
                {/* Informations de progression pour les collectes de fonds */}
                {renderProgressInfo()}

                {/* CTA spécifique au type */}
                <PaymentCTA
                  linkData={linkData}
                  linkId={params.id}
                  customAmount={customAmount}
                  donationAmount={donationAmount}
                  selectedTicket={selectedTicket}
                  selectedVariants={selectedVariants}
                  quantity={quantity}
                  onDonationAmountChange={handleDonationOptionClick}
                  onCustomAmountChange={handleCustomAmountChange}
                  onTicketSelect={handleTicketSelect}
                  onVariantChange={handleVariantChange}
                  onQuantityChange={handleQuantityChange}
                />

                {/* Boutons d'action */}
                <div className="flex gap-2">
                  <button className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border border-gray-200 hover:border-gofundme-600 text-gray-700 hover:text-gofundme-600 transition-colors">
                    <Heart className="h-4 w-4" />
                    Sauvegarder
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border border-gray-200 hover:border-gofundme-600 text-gray-700 hover:text-gofundme-600 transition-colors">
                    <Share2 className="h-4 w-4" />
                    Partager
                  </button>
                </div>

                {/* Partage social */}
                <div className="pt-4 border-t">
                  <h3 className="text-sm font-medium mb-3">Partager ce lien</h3>
                  <div className="flex gap-2">
                    <button className="flex items-center justify-center h-8 w-8 rounded-full border border-gray-200 hover:border-gofundme-600 text-gray-700 hover:text-gofundme-600 transition-colors">
                      <Facebook className="h-4 w-4" />
                      <span className="sr-only">Partager sur Facebook</span>
                    </button>
                    <button className="flex items-center justify-center h-8 w-8 rounded-full border border-gray-200 hover:border-gofundme-600 text-gray-700 hover:text-gofundme-600 transition-colors">
                      <Twitter className="h-4 w-4" />
                      <span className="sr-only">Partager sur Twitter</span>
                    </button>
                    <button className="flex items-center justify-center h-8 w-8 rounded-full border border-gray-200 hover:border-gofundme-600 text-gray-700 hover:text-gofundme-600 transition-colors">
                      <Mail className="h-4 w-4" />
                      <span className="sr-only">Partager par email</span>
                    </button>
                    <button className="flex items-center justify-center h-8 w-8 rounded-full border border-gray-200 hover:border-gofundme-600 text-gray-700 hover:text-gofundme-600 transition-colors">
                      <LinkIcon className="h-4 w-4" />
                      <span className="sr-only">Copier le lien</span>
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Profil du marchand */}
            {/* <Card className="border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="gofundme-avatar h-12 w-12">
                    <Image
                      src={linkData.merchant.avatar || "/placeholder.svg"}
                      alt={linkData.merchant.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <h3 className="font-medium">{linkData.merchant.name}</h3>
                      {linkData.merchant.verified && (
                        <CheckCircle2 className="h-4 w-4 text-gofundme-600" />
                      )}
                    </div>
                    <p className="text-xs text-gray-500">
                      {linkData.merchant.location}
                    </p>
                  </div>
                </div>
                <p className="text-sm mb-4 text-gray-700">
                  {linkData.merchant.bio}
                </p>
                <div className="text-xs text-gray-500">
                  Membre depuis {linkData.merchant.joinedDate}
                </div>
              </CardContent>
            </Card> */}
          </div>
        </div>
      </div>

      {/* CTA mobile fixe */}
      {mounted && isMobileState && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t shadow-lg z-40">
          <CTAButton asChild size="lg" className="w-full">
            <Link
              href={`/checkout/${params.id}?${
                linkData.type === "donation" || linkData.type === "fundraising"
                  ? `amount=${customAmount || donationAmount || ""}`
                  : linkData.type === "event"
                  ? `ticket=${selectedTicket}`
                  : `quantity=${quantity}`
              }`}
            >
              {linkData.type === "donation" || linkData.type === "fundraising"
                ? `Faire un don${
                    customAmount || donationAmount
                      ? ` (${Number(
                          customAmount || donationAmount
                        ).toLocaleString()} €)`
                      : ""
                  }`
                : linkData.type === "event"
                ? "Acheter un billet"
                : linkData.type === "product_digital"
                ? "Acheter ce produit"
                : "Ajouter au panier"}
            </Link>
          </CTAButton>
        </div>
      )}
    </div>
  );
}

// import Link from "next/link";
// import { CTAButton } from "@/components/ui/cta-button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  //   PaymentLinkData,
  EventLinkData,
  ProductDigitalLinkData,
  ProductPhysicalLinkData,
} from "@/types/payment-link";

interface PaymentCTAProps {
  linkData: PaymentLinkData;
  linkId: string;
  customAmount?: string;
  donationAmount?: number | null;
  selectedTicket?: string;
  selectedVariants?: Record<string, string>;
  quantity?: number;
  onDonationAmountChange?: (amount: number) => void;
  onCustomAmountChange?: (amount: string) => void;
  onTicketSelect?: (ticketId: string) => void;
  onVariantChange?: (variantId: string, optionId: string) => void;
  onQuantityChange?: (quantity: number) => void;
}

const PaymentCTA = ({
  linkData,
  linkId,
  customAmount = "",
  donationAmount = null,
  selectedTicket = "",
  selectedVariants = {},
  quantity = 1,
  onDonationAmountChange,
  onCustomAmountChange,
  onTicketSelect,
  onVariantChange,
  onQuantityChange,
}: PaymentCTAProps) => {
  // Fonction pour construire l'URL de paiement avec les paramètres appropriés
  const buildPaymentUrl = () => {
    const params = new URLSearchParams();

    switch (linkData.type) {
      case "donation":
      case "fundraising":
        if (customAmount || donationAmount) {
          params.set(
            "amount",
            customAmount || donationAmount?.toString() || ""
          );
        }
        break;
      case "event":
        if (selectedTicket) {
          params.set("ticket", selectedTicket);
        }
        break;
      case "product_digital":
      case "product_physical":
        params.set("quantity", quantity.toString());

        if (
          linkData.type === "product_physical" &&
          Object.keys(selectedVariants).length > 0
        ) {
          Object.entries(selectedVariants).forEach(([variantId, optionId]) => {
            params.set(`variant_${variantId}`, optionId);
          });
        }
        break;
    }

    return `/checkout/${linkId}?${params.toString()}`;
  };

  // Déterminer le texte du bouton en fonction du type
  const getButtonText = () => {
    switch (linkData.type) {
      case "donation":
      case "fundraising":
        return `Faire un don${
          customAmount || donationAmount
            ? ` (${Number(customAmount || donationAmount).toLocaleString()} €)`
            : ""
        }`;
      case "event":
        return "Acheter un billet";
      case "product_digital":
        return "Acheter ce produit";
      case "product_physical":
        return "Ajouter au panier";
      default:
        return "Continuer";
    }
  };

  // Rendu du contenu spécifique au type
  const renderTypeSpecificContent = () => {
    switch (linkData.type) {
      case "donation":
      case "fundraising": {
        const data = linkData as any; // Pour accéder à donationOptions
        return (
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Choisissez un montant</h3>
            <div className="grid grid-cols-2 gap-2">
              {data.donationOptions.map((option: any) => (
                <button
                  key={option.amount}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    donationAmount === option.amount
                      ? "bg-gofundme-600 text-white"
                      : "bg-white border border-gray-200 text-gray-800 hover:border-gofundme-600"
                  }`}
                  onClick={() => onDonationAmountChange?.(option.amount)}
                >
                  {option.amount} €
                </button>
              ))}
            </div>
            <div>
              <label
                htmlFor="custom-amount"
                className="block text-sm font-medium mb-1 text-gray-700"
              >
                Montant personnalisé
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  €
                </span>
                <Input
                  id="custom-amount"
                  type="number"
                  min="1"
                  value={customAmount}
                  onChange={(e) => onCustomAmountChange?.(e.target.value)}
                  className="pl-8 rounded-md border-gray-300 focus:border-gofundme-600 focus:ring-gofundme-600"
                />
              </div>
            </div>
          </div>
        );
      }

      case "event": {
        const eventData = linkData as EventLinkData;
        return (
          <div className="space-y-4">
            <div>
              <label
                htmlFor="ticket-type"
                className="block text-sm font-medium mb-1 text-gray-700"
              >
                Sélectionnez un type de billet
              </label>
              <Select value={selectedTicket} onValueChange={onTicketSelect}>
                <SelectTrigger
                  id="ticket-type"
                  className="rounded-md border-gray-300"
                >
                  <SelectValue placeholder="Choisir un billet" />
                </SelectTrigger>
                <SelectContent>
                  {eventData.ticketOptions.map((ticket) => (
                    <SelectItem key={ticket.id} value={ticket.id}>
                      {ticket.name} - {ticket.price} €{" "}
                      {ticket.available < 10 &&
                        `(${ticket.available} restants)`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedTicket && (
              <div className="p-4 bg-warmgray-50 rounded-lg">
                <p className="font-medium text-gray-900">
                  {"Détails de l'événement"}
                </p>
                <div className="text-sm mt-1 text-gray-700">
                  <p>Date: {eventData.date}</p>
                  <p>Heure: {eventData.time}</p>
                  <p>Lieu: {eventData.location}</p>
                </div>
              </div>
            )}
          </div>
        );
      }

      case "product_digital": {
        const productData = linkData as ProductDigitalLinkData;
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-2xl font-bold text-gray-900">
                  {productData.discountPrice ? (
                    <>
                      <span>{productData.discountPrice} €</span>
                      <span className="text-sm line-through text-gray-500 ml-2">
                        {productData.price} €
                      </span>
                    </>
                  ) : (
                    <span>{productData.price} €</span>
                  )}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
                  onClick={() => onQuantityChange?.(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="w-8 text-center">{quantity}</span>
                <button
                  className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
                  onClick={() => onQuantityChange?.(quantity + 1)}
                >
                  +
                </button>
              </div>
            </div>

            <div className="p-4 bg-warmgray-50 rounded-lg">
              <p className="font-medium text-gray-900">Détails du produit</p>
              <div className="text-sm mt-1 text-gray-700">
                <p>Type de fichier: {productData.fileType}</p>
                <p>Taille: {productData.fileSize}</p>
                <p>
                  Livraison:{" "}
                  {productData.deliveryMethod === "download"
                    ? "Téléchargement immédiat"
                    : "Par email"}
                </p>
              </div>
            </div>
          </div>
        );
      }

      case "product_physical": {
        const productData = linkData as ProductPhysicalLinkData;
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-2xl font-bold text-gray-900">
                  {productData.discountPrice ? (
                    <>
                      <span>{productData.discountPrice} €</span>
                      <span className="text-sm line-through text-gray-500 ml-2">
                        {productData.price} €
                      </span>
                    </>
                  ) : (
                    <span>{productData.price} €</span>
                  )}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
                  onClick={() => onQuantityChange?.(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="w-8 text-center">{quantity}</span>
                <button
                  className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
                  onClick={() => onQuantityChange?.(quantity + 1)}
                  disabled={quantity >= productData.inventory}
                >
                  +
                </button>
              </div>
            </div>

            {productData.variants && productData.variants.length > 0 && (
              <div className="space-y-3">
                {productData.variants.map((variant) => (
                  <div key={variant.id}>
                    <label
                      htmlFor={`variant-${variant.id}`}
                      className="block text-sm font-medium mb-1 text-gray-700"
                    >
                      {variant.name}
                    </label>
                    <Select
                      value={selectedVariants[variant.id] || ""}
                      onValueChange={(value) =>
                        onVariantChange?.(variant.id, value)
                      }
                    >
                      <SelectTrigger
                        id={`variant-${variant.id}`}
                        className="rounded-md border-gray-300"
                      >
                        <SelectValue placeholder={`Choisir ${variant.name}`} />
                      </SelectTrigger>
                      <SelectContent>
                        {variant.options.map((option) => (
                          <SelectItem key={option.id} value={option.id}>
                            {option.name}{" "}
                            {option.price ? `(+${option.price} €)` : ""}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            )}

            <div className="p-4 bg-warmgray-50 rounded-lg">
              <p className="font-medium text-gray-900">Informations produit</p>
              <div className="text-sm mt-1 text-gray-700">
                <p>En stock: {productData.inventory} unités</p>
                {productData.weight && <p>Poids: {productData.weight}</p>}
                {productData.dimensions && (
                  <p>Dimensions: {productData.dimensions}</p>
                )}
              </div>
            </div>
          </div>
        );
      }

      default:
        return null;
    }
  };

  // Vérifier si le bouton doit être désactivé
  const isButtonDisabled = () => {
    switch (linkData.type) {
      case "donation":
      case "fundraising":
        return !customAmount && donationAmount === null;
      case "event":
        return !selectedTicket;
      case "product_physical":
        const physicalProduct = linkData as ProductPhysicalLinkData;
        if (physicalProduct.variants && physicalProduct.variants.length > 0) {
          // Vérifier que toutes les variantes requises sont sélectionnées
          return physicalProduct.variants.some(
            (variant) => !selectedVariants[variant.id]
          );
        }
        return false;
      default:
        return false;
    }
  };

  return (
    <div className="space-y-6">
      {renderTypeSpecificContent()}

      <CTAButton
        asChild
        size="lg"
        className="w-full"
        disabled={isButtonDisabled()}
      >
        <Link href={buildPaymentUrl()}>{getButtonText()}</Link>
      </CTAButton>
    </div>
  );
};

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { cva, type VariantProps } from "class-variance-authority";

const ctaButtonVariants = cva(
  "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-gofundme-600 text-white hover:bg-gofundme-700 rounded-full",
        outline:
          "border border-gofundme-600 text-gofundme-600 hover:bg-gofundme-50 rounded-full",
        ghost:
          "text-gofundme-600 hover:bg-gofundme-50 hover:text-gofundme-700 rounded-full",
        link: "text-gofundme-600 underline-offset-4 hover:underline",
        secondary:
          "bg-warmgray-50 text-gray-900 hover:bg-warmgray-100 rounded-full",
      },
      size: {
        default: "h-10 px-6 py-2",
        sm: "h-8 px-4 text-sm",
        lg: "h-12 px-8 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface CTAButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof ctaButtonVariants> {
  asChild?: boolean;
}

const CTAButton = ({ className, variant, size, ...props }: CTAButtonProps) => {
  return (
    <Button
      className={cn(ctaButtonVariants({ variant, size }), className)}
      {...props}
    />
  );
};
