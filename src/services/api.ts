import type { PaymentLinkData } from "@/types/payment-link"

// URL de base de l'API (à remplacer par votre URL réelle)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.quickpay.com"

// Fonction utilitaire pour les requêtes
async function fetchWithTimeout(resource: string, options: RequestInit & { timeout?: number } = {}) {
  const { timeout = 8000 } = options

  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(resource, {
      ...options,
      signal: controller.signal,
    })
    clearTimeout(id)
    return response
  } catch (error) {
    clearTimeout(id)
    throw error
  }
}

// Récupérer tous les liens de paiement avec filtres
export async function getPaymentLinks(
  params: {
    search?: string
    category?: string
    type?: string
    featured?: boolean
    page?: number
    limit?: number
    sort?: string
    lang?: string
  } = {},
): Promise<{ data: PaymentLinkData[]; total: number; page: number; totalPages: number }> {
  try {
    console.log("API: getPaymentLinks appelé avec params", params)

    // Construire l'URL avec les paramètres de requête
    const queryParams = new URLSearchParams()

    if (params.search) queryParams.set("search", params.search)
    if (params.category) queryParams.set("category", params.category)
    if (params.type) queryParams.set("type", params.type)
    if (params.featured) queryParams.set("featured", "true")
    if (params.page) queryParams.set("page", params.page.toString())
    if (params.limit) queryParams.set("limit", params.limit.toString())
    if (params.sort) queryParams.set("sort", params.sort)
    if (params.lang) queryParams.set("lang", params.lang)

    const url = `${API_BASE_URL}/payment-links?${queryParams.toString()}`
    console.log("API: URL construite", url)

    // Simuler un délai pour tester les états de chargement
    await new Promise((resolve) => setTimeout(resolve, 500))
    console.log("API: Délai simulé terminé")

    // Filtrer les données de test en fonction des paramètres
    let filteredLinks = [...mockPaymentLinks]

    // Filtrer par catégorie si spécifiée
    if (params.category && params.category !== "all") {
      console.log("API: Filtrage par catégorie", params.category)
      filteredLinks = filteredLinks.filter((link) => link.category.toLowerCase() === params.category?.toLowerCase())
    }

    // Filtrer par type si spécifié
    if (params.type && params.type !== "all") {
      console.log("API: Filtrage par type", params.type)
      filteredLinks = filteredLinks.filter((link) => link.type === params.type)
    }

    // Filtrer les liens en vedette si demandé
    if (params.featured) {
      console.log("API: Filtrage des liens en vedette")
      filteredLinks = filteredLinks.filter((link) => link.featured)
    }

    // Paginer les résultats
    const limit = params.limit || 10
    const page = params.page || 1
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedLinks = filteredLinks.slice(startIndex, endIndex)

    console.log("API: Résultats filtrés", {
      total: filteredLinks.length,
      page,
      totalPages: Math.ceil(filteredLinks.length / limit),
      dataCount: paginatedLinks.length,
    })

    return {
      data: paginatedLinks,
      total: filteredLinks.length,
      page: page,
      totalPages: Math.ceil(filteredLinks.length / limit),
    }
  } catch (error) {
    console.error("API: Erreur dans getPaymentLinks", error)
    // En cas d'erreur, retourner des données de test
    return {
      data: mockPaymentLinks.slice(0, params.limit || 10),
      total: mockPaymentLinks.length,
      page: params.page || 1,
      totalPages: Math.ceil(mockPaymentLinks.length / (params.limit || 10)),
    }
  }
}

// Récupérer un lien de paiement par ID
export async function getPaymentLinkById(id: string, lang = "fr"): Promise<PaymentLinkData | null> {
  try {
    // Simuler un délai pour tester les états de chargement
    await new Promise((resolve) => setTimeout(resolve, 300))

    // Utiliser les données de test pour le moment
    const link = mockPaymentLinks.find((link) => link.id === id)
    return link || null

    // Code pour l'intégration réelle avec l'API
    /*
    const response = await fetchWithTimeout(`${API_BASE_URL}/payment-links/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept-Language': lang
      }
    })
    
    if (!response.ok) {
      if (response.status === 404) {
        return null
      }
      throw new Error(`Error fetching payment link: ${response.status}`)
    }
    
    return await response.json()
    */
  } catch (error) {
    console.error(`Failed to fetch payment link with ID ${id}:`, error)
    // En cas d'erreur, retourner null ou chercher dans les données de test
    return mockPaymentLinks.find((link) => link.id === id) || null
  }
}

// Récupérer les liens en vedette
export async function getFeaturedLinks(limit = 3, lang = "fr"): Promise<PaymentLinkData[]> {
  try {
    // Simuler un délai pour tester les états de chargement
    await new Promise((resolve) => setTimeout(resolve, 300))

    // Utiliser les données de test pour le moment
    return mockPaymentLinks.filter((link) => link.featured).slice(0, limit)

    // Code pour l'intégration réelle avec l'API
    /*
    const response = await fetchWithTimeout(`${API_BASE_URL}/payment-links/featured?limit=${limit}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept-Language': lang
      }
    })
    
    if (!response.ok) {
      throw new Error(`Error fetching featured links: ${response.status}`)
    }
    
    return await response.json()
    */
  } catch (error) {
    console.error("Failed to fetch featured links:", error)
    // En cas d'erreur, retourner des données de test
    return mockPaymentLinks.filter((link) => link.featured).slice(0, limit)
  }
}

// Récupérer les catégories disponibles
export async function getCategories(lang = "fr"): Promise<{ id: string; name: string; icon: string }[]> {
  try {
    console.log("API: getCategories appelé")

    // Simuler un délai pour tester les états de chargement
    await new Promise((resolve) => setTimeout(resolve, 200))
    console.log("API: Retourne les catégories", mockCategories)

    // Utiliser les données de test pour le moment
    return mockCategories
  } catch (error) {
    console.error("API: Erreur dans getCategories", error)
    // En cas d'erreur, retourner des données de test
    return mockCategories
  }
}

// Recherche de liens de paiement
export async function searchPaymentLinks(
  query: string,
  params: {
    category?: string
    type?: string
    page?: number
    limit?: number
    lang?: string
  } = {},
): Promise<{ data: PaymentLinkData[]; total: number; page: number; totalPages: number }> {
  try {
    // Construire l'URL avec les paramètres de requête
    const queryParams = new URLSearchParams({ search: query })

    if (params.category) queryParams.set("category", params.category)
    if (params.type) queryParams.set("type", params.type)
    if (params.page) queryParams.set("page", params.page.toString())
    if (params.limit) queryParams.set("limit", params.limit.toString())
    if (params.lang) queryParams.set("lang", params.lang)

    const url = `${API_BASE_URL}/payment-links/search?${queryParams.toString()}`

    // Simuler un délai pour tester les états de chargement
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Filtrer les données de test en fonction de la requête
    const filteredLinks = mockPaymentLinks.filter(
      (link) =>
        link.title.toLowerCase().includes(query.toLowerCase()) ||
        link.description.toLowerCase().includes(query.toLowerCase()) ||
        link.category.toLowerCase().includes(query.toLowerCase()),
    )

    // Filtrer par catégorie si spécifiée
    const categoryFiltered = params.category
      ? filteredLinks.filter((link) => link.category.toLowerCase() === params.category?.toLowerCase())
      : filteredLinks

    // Filtrer par type si spécifié
    const typeFiltered = params.type ? categoryFiltered.filter((link) => link.type === params.type) : categoryFiltered

    // Paginer les résultats
    const limit = params.limit || 10
    const page = params.page || 1
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit

    return {
      data: typeFiltered.slice(startIndex, endIndex),
      total: typeFiltered.length,
      page: page,
      totalPages: Math.ceil(typeFiltered.length / limit),
    }

    // Code pour l'intégration réelle avec l'API
    /*
    const response = await fetchWithTimeout(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept-Language': params.lang || 'fr'
      }
    })
    
    if (!response.ok) {
      throw new Error(`Error searching payment links: ${response.status}`)
    }
    
    return await response.json()
    */
  } catch (error) {
    console.error("Failed to search payment links:", error)
    // En cas d'erreur, retourner un tableau vide
    return {
      data: [],
      total: 0,
      page: params.page || 1,
      totalPages: 0,
    }
  }
}

// Données de test pour les liens de paiement
const mockPaymentLinks: PaymentLinkData[] = [
  {
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
    featured: true,
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
        content: "Bon courage à Sophie et à toute votre famille. Nous pensons fort à vous.",
      },
      {
        author: {
          name: "Lucie Bernard",
          avatar: "/placeholder.svg?height=100&width=100",
        },
        date: "18 mars 2023",
        content: "J'ai partagé votre campagne avec mes amis. J'espère que vous atteindrez rapidement votre objectif.",
      },
    ],
  },
  {
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
    featured: true,
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
  {
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
    featured: true,
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
  {
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
  {
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
    featured: true,
    donationOptions: [
      { amount: 5, label: "Nettoyage d'une plage" },
      { amount: 20, label: "Protection d'un récif corallien" },
      { amount: 50, label: "Programme éducatif pour les écoles" },
      { amount: 100, label: "Campagne de sensibilisation" },
    ],
  },
  {
    id: "6",
    title: "Atelier d'écriture créative en ligne",
    description: `
      <p>Développez votre créativité et améliorez vos compétences d'écriture avec notre atelier d'écriture créative en ligne.</p>
      <p>Animé par des auteurs publiés, cet atelier vous guidera à travers différents exercices et techniques pour libérer votre imagination et structurer vos récits.</p>
      <h3>Programme de l'atelier</h3>
      <ul>
        <li>Trouver l'inspiration et développer des idées</li>
        <li>Créer des personnages mémorables</li>
        <li>Construire des dialogues authentiques</li>
        <li>Maîtriser la structure narrative</li>
        <li>Techniques de révision et d'édition</li>
      </ul>
      <p>Chaque participant recevra des retours personnalisés sur ses textes.</p>
    `,
    category: "Formation",
    type: "event",
    images: [
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
    ],
    merchant: {
      name: "Les Plumes Créatives",
      avatar: "/placeholder.svg?height=100&width=100",
      bio: "Collectif d'auteurs proposant des formations d'écriture depuis 2016.",
      location: "En ligne",
      verified: true,
      joinedDate: "Septembre 2020",
    },
    date: "10-12 août 2023",
    time: "18:00 - 20:00",
    location: "Zoom (lien envoyé après inscription)",
    organizer: "Les Plumes Créatives",
    ticketOptions: [
      {
        id: "standard",
        name: "Accès standard",
        price: 75,
        description: "Accès aux 3 sessions et aux supports de cours",
        available: 30,
      },
      {
        id: "premium",
        name: "Accès premium",
        price: 120,
        description: "Accès aux sessions, supports et 2 séances de coaching individuel",
        available: 15,
      },
    ],
    eventDetails: {
      agenda: "3 sessions de 2 heures sur 3 jours consécutifs",
      speakers: [
        {
          name: "Claire Fontaine",
          bio: "Romancière et scénariste, auteure de 5 romans publiés",
          avatar: "/placeholder.svg?height=100&width=100",
        },
        {
          name: "Marc Dumont",
          bio: "Poète et professeur d'écriture créative à l'université",
          avatar: "/placeholder.svg?height=100&width=100",
        },
      ],
    },
  },
  {
    id: "7",
    title: "E-book: Guide complet de la cuisine végétarienne",
    description: `
      <p>Découvrez plus de 100 recettes végétariennes savoureuses et équilibrées dans ce guide complet de la cuisine végétarienne.</p>
      <p>Que vous soyez végétarien de longue date ou simplement curieux de réduire votre consommation de viande, ce guide vous accompagnera dans votre démarche avec des conseils nutritionnels et des recettes adaptées à tous les niveaux.</p>
      <h3>Contenu du guide</h3>
      <ul>
        <li>Introduction à l'alimentation végétarienne et ses bienfaits</li>
        <li>Guide des ingrédients essentiels et leurs substituts</li>
        <li>100+ recettes classées par saison et par difficulté</li>
        <li>Conseils nutritionnels pour une alimentation équilibrée</li>
        <li>Menus hebdomadaires et listes de courses</li>
      </ul>
      <p>Format PDF optimisé pour tous les appareils.</p>
    `,
    category: "Cuisine",
    type: "product_digital",
    images: [
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
    ],
    merchant: {
      name: "Cuisine Verte",
      avatar: "/placeholder.svg?height=100&width=100",
      bio: "Blog culinaire spécialisé dans la cuisine végétarienne et végétalienne.",
      location: "Toulouse, France",
      verified: true,
      joinedDate: "Mai 2021",
    },
    price: 14.99,
    discountPrice: 9.99,
    features: [
      "200+ pages de contenu",
      "100+ recettes illustrées",
      "Conseils nutritionnels par une diététicienne",
      "Mises à jour gratuites à vie",
      "Format PDF compatible avec tous les appareils",
    ],
    fileType: "PDF",
    fileSize: "15 MB",
    deliveryMethod: "download",
    previewUrl: "/placeholder.svg?height=600&width=800",
  },
  {
    id: "8",
    title: "Kit de jardinage urbain pour balcon",
    description: `
      <p>Transformez votre balcon en un véritable petit jardin urbain avec notre kit complet de jardinage pour espaces restreints.</p>
      <p>Conçu spécifiquement pour les citadins souhaitant cultiver leurs propres herbes aromatiques et légumes, ce kit contient tout le nécessaire pour démarrer votre potager urbain.</p>
      <h3>Contenu du kit</h3>
      <ul>
        <li>3 jardinières adaptées aux balcons avec système d'auto-arrosage</li>
        <li>Terreau spécial potager urbain (10L)</li>
        <li>Sélection de 6 sachets de graines bio (basilic, persil, ciboulette, tomates cerises, radis, laitue)</li>
        <li>Outils de jardinage miniatures (3 pièces)</li>
        <li>Guide pratique du jardinage en ville</li>
      </ul>
      <p>Livraison écologique en emballage recyclé et recyclable.</p>
    `,
    category: "Jardinage",
    type: "product_physical",
    images: [
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
    ],
    merchant: {
      name: "Urban Garden",
      avatar: "/placeholder.svg?height=100&width=100",
      bio: "Spécialiste du jardinage urbain et de la permaculture en ville.",
      location: "Nantes, France",
      verified: true,
      joinedDate: "Mars 2022",
    },
    price: 59.9,
    discountPrice: 49.9,
    features: [
      "Kit complet prêt à l'emploi",
      "Graines 100% bio et locales",
      "Jardinières avec réserve d'eau",
      "Guide détaillé pour débutants",
      "Matériaux durables et écologiques",
    ],
    variants: [
      {
        id: "color",
        name: "Couleur des jardinières",
        options: [
          { id: "terracotta", name: "Terracotta" },
          { id: "anthracite", name: "Anthracite" },
          { id: "white", name: "Blanc" },
        ],
      },
    ],
    inventory: 75,
    weight: "3.5 kg",
    dimensions: "45 x 30 x 25 cm",
    shippingOptions: [
      {
        id: "standard",
        name: "Livraison standard",
        price: 5.9,
        estimatedDelivery: "3-5 jours ouvrés",
      },
      {
        id: "express",
        name: "Livraison express",
        price: 9.9,
        estimatedDelivery: "1-2 jours ouvrés",
      },
    ],
  },
]

// Données de test pour les catégories
const mockCategories = [
  { id: "charity", name: "Caritatif", icon: "Heart" },
  { id: "education", name: "Éducation", icon: "GraduationCap" },
  { id: "medical", name: "Médical", icon: "Briefcase" },
  { id: "events", name: "Événements", icon: "Calendar" },
  { id: "products", name: "Produits", icon: "ShoppingBag" },
  { id: "donations", name: "Dons", icon: "Gift" },
]
