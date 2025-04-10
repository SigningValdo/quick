// "use client";
// import Link from "next/link";
// import { CTAButton } from "@/components/ui/cta-button";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import type {
//   PaymentLinkData,
//   EventLinkData,
//   ProductDigitalLinkData,
//   ProductPhysicalLinkData,
// } from "@/types/payment-link";

// interface PaymentCTAProps {
//   linkData: PaymentLinkData;
//   linkId: string;
//   customAmount?: string;
//   donationAmount?: number | null;
//   selectedTicket?: string;
//   selectedVariants?: Record<string, string>;
//   quantity?: number;
//   onDonationAmountChange?: (amount: number) => void;
//   onCustomAmountChange?: (amount: string) => void;
//   onTicketSelect?: (ticketId: string) => void;
//   onVariantChange?: (variantId: string, optionId: string) => void;
//   onQuantityChange?: (quantity: number) => void;
// }

// export function PaymentCTA({
//   linkData,
//   linkId,
//   customAmount = "",
//   donationAmount = null,
//   selectedTicket = "",
//   selectedVariants = {},
//   quantity = 1,
//   onDonationAmountChange,
//   onCustomAmountChange,
//   onTicketSelect,
//   onVariantChange,
//   onQuantityChange,
// }: PaymentCTAProps) {
//   // Fonction pour construire l'URL de paiement avec les paramètres appropriés
//   const buildPaymentUrl = () => {
//     const params = new URLSearchParams();

//     switch (linkData.type) {
//       case "donation":
//       case "fundraising":
//         if (customAmount || donationAmount) {
//           params.set(
//             "amount",
//             customAmount || donationAmount?.toString() || ""
//           );
//         }
//         break;
//       case "event":
//         if (selectedTicket) {
//           params.set("ticket", selectedTicket);
//         }
//         break;
//       case "product_digital":
//       case "product_physical":
//         params.set("quantity", quantity.toString());

//         if (
//           linkData.type === "product_physical" &&
//           Object.keys(selectedVariants).length > 0
//         ) {
//           Object.entries(selectedVariants).forEach(([variantId, optionId]) => {
//             params.set(`variant_${variantId}`, optionId);
//           });
//         }
//         break;
//     }

//     return `/checkout/${linkId}?${params.toString()}`;
//   };

//   // Déterminer le texte du bouton en fonction du type
//   const getButtonText = () => {
//     switch (linkData.type) {
//       case "donation":
//       case "fundraising":
//         return `Faire un don${
//           customAmount || donationAmount
//             ? ` (${Number(customAmount || donationAmount).toLocaleString()} €)`
//             : ""
//         }`;
//       case "event":
//         return "Acheter un billet";
//       case "product_digital":
//         return "Acheter ce produit";
//       case "product_physical":
//         return "Ajouter au panier";
//       default:
//         return "Continuer";
//     }
//   };

//   // Rendu du contenu spécifique au type
//   const renderTypeSpecificContent = () => {
//     switch (linkData.type) {
//       case "donation":
//       case "fundraising": {
//         const data = linkData as any; // Pour accéder à donationOptions
//         return (
//           <div className="space-y-4">
//             <h3 className="font-medium text-gray-900">Choisissez un montant</h3>
//             <div className="grid grid-cols-2 gap-2">
//               {data.donationOptions.map((option: any) => (
//                 <button
//                   key={option.amount}
//                   className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
//                     donationAmount === option.amount
//                       ? "bg-gofundme-600 text-white"
//                       : "bg-white border border-gray-200 text-gray-800 hover:border-gofundme-600"
//                   }`}
//                   onClick={() => onDonationAmountChange?.(option.amount)}
//                 >
//                   {option.amount} €
//                 </button>
//               ))}
//             </div>
//             <div>
//               <label
//                 htmlFor="custom-amount"
//                 className="block text-sm font-medium mb-1 text-gray-700"
//               >
//                 Montant personnalisé
//               </label>
//               <div className="relative">
//                 <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
//                   €
//                 </span>
//                 <Input
//                   id="custom-amount"
//                   type="number"
//                   min="1"
//                   value={customAmount}
//                   onChange={(e) => onCustomAmountChange?.(e.target.value)}
//                   className="pl-8 rounded-md border-gray-300 focus:border-gofundme-600 focus:ring-gofundme-600"
//                 />
//               </div>
//             </div>
//           </div>
//         );
//       }

//       case "event": {
//         const eventData = linkData as EventLinkData;
//         return (
//           <div className="space-y-4">
//             <div>
//               <label
//                 htmlFor="ticket-type"
//                 className="block text-sm font-medium mb-1 text-gray-700"
//               >
//                 Sélectionnez un type de billet
//               </label>
//               <Select value={selectedTicket} onValueChange={onTicketSelect}>
//                 <SelectTrigger
//                   id="ticket-type"
//                   className="rounded-md border-gray-300"
//                 >
//                   <SelectValue placeholder="Choisir un billet" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {eventData.ticketOptions.map((ticket) => (
//                     <SelectItem key={ticket.id} value={ticket.id}>
//                       {ticket.name} - {ticket.price} €{" "}
//                       {ticket.available < 10 &&
//                         `(${ticket.available} restants)`}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>

//             {selectedTicket && (
//               <div className="p-4 bg-warmgray-50 rounded-lg">
//                 <p className="font-medium text-gray-900">
//                   {"Détails de l'événement"}
//                 </p>
//                 <div className="text-sm mt-1 text-gray-700">
//                   <p>Date: {eventData.date}</p>
//                   <p>Heure: {eventData.time}</p>
//                   <p>Lieu: {eventData.location}</p>
//                 </div>
//               </div>
//             )}
//           </div>
//         );
//       }

//       case "product_digital": {
//         const productData = linkData as ProductDigitalLinkData;
//         return (
//           <div className="space-y-4">
//             <div className="flex items-center justify-between">
//               <div>
//                 <span className="text-2xl font-bold text-gray-900">
//                   {productData.discountPrice ? (
//                     <>
//                       <span>{productData.discountPrice} €</span>
//                       <span className="text-sm line-through text-gray-500 ml-2">
//                         {productData.price} €
//                       </span>
//                     </>
//                   ) : (
//                     <span>{productData.price} €</span>
//                   )}
//                 </span>
//               </div>

//               <div className="flex items-center space-x-2">
//                 <button
//                   className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
//                   onClick={() => onQuantityChange?.(Math.max(1, quantity - 1))}
//                   disabled={quantity <= 1}
//                 >
//                   -
//                 </button>
//                 <span className="w-8 text-center">{quantity}</span>
//                 <button
//                   className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
//                   onClick={() => onQuantityChange?.(quantity + 1)}
//                 >
//                   +
//                 </button>
//               </div>
//             </div>

//             <div className="p-4 bg-warmgray-50 rounded-lg">
//               <p className="font-medium text-gray-900">Détails du produit</p>
//               <div className="text-sm mt-1 text-gray-700">
//                 <p>Type de fichier: {productData.fileType}</p>
//                 <p>Taille: {productData.fileSize}</p>
//                 <p>
//                   Livraison:{" "}
//                   {productData.deliveryMethod === "download"
//                     ? "Téléchargement immédiat"
//                     : "Par email"}
//                 </p>
//               </div>
//             </div>
//           </div>
//         );
//       }

//       case "product_physical": {
//         const productData = linkData as ProductPhysicalLinkData;
//         return (
//           <div className="space-y-4">
//             <div className="flex items-center justify-between">
//               <div>
//                 <span className="text-2xl font-bold text-gray-900">
//                   {productData.discountPrice ? (
//                     <>
//                       <span>{productData.discountPrice} €</span>
//                       <span className="text-sm line-through text-gray-500 ml-2">
//                         {productData.price} €
//                       </span>
//                     </>
//                   ) : (
//                     <span>{productData.price} €</span>
//                   )}
//                 </span>
//               </div>

//               <div className="flex items-center space-x-2">
//                 <button
//                   className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
//                   onClick={() => onQuantityChange?.(Math.max(1, quantity - 1))}
//                   disabled={quantity <= 1}
//                 >
//                   -
//                 </button>
//                 <span className="w-8 text-center">{quantity}</span>
//                 <button
//                   className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
//                   onClick={() => onQuantityChange?.(quantity + 1)}
//                   disabled={quantity >= productData.inventory}
//                 >
//                   +
//                 </button>
//               </div>
//             </div>

//             {productData.variants && productData.variants.length > 0 && (
//               <div className="space-y-3">
//                 {productData.variants.map((variant) => (
//                   <div key={variant.id}>
//                     <label
//                       htmlFor={`variant-${variant.id}`}
//                       className="block text-sm font-medium mb-1 text-gray-700"
//                     >
//                       {variant.name}
//                     </label>
//                     <Select
//                       value={selectedVariants[variant.id] || ""}
//                       onValueChange={(value) =>
//                         onVariantChange?.(variant.id, value)
//                       }
//                     >
//                       <SelectTrigger
//                         id={`variant-${variant.id}`}
//                         className="rounded-md border-gray-300"
//                       >
//                         <SelectValue placeholder={`Choisir ${variant.name}`} />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {variant.options.map((option) => (
//                           <SelectItem key={option.id} value={option.id}>
//                             {option.name}{" "}
//                             {option.price ? `(+${option.price} €)` : ""}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </div>
//                 ))}
//               </div>
//             )}

//             <div className="p-4 bg-warmgray-50 rounded-lg">
//               <p className="font-medium text-gray-900">Informations produit</p>
//               <div className="text-sm mt-1 text-gray-700">
//                 <p>En stock: {productData.inventory} unités</p>
//                 {productData.weight && <p>Poids: {productData.weight}</p>}
//                 {productData.dimensions && (
//                   <p>Dimensions: {productData.dimensions}</p>
//                 )}
//               </div>
//             </div>
//           </div>
//         );
//       }

//       default:
//         return null;
//     }
//   };

//   // Vérifier si le bouton doit être désactivé
//   const isButtonDisabled = () => {
//     switch (linkData.type) {
//       case "donation":
//       case "fundraising":
//         return !customAmount && donationAmount === null;
//       case "event":
//         return !selectedTicket;
//       case "product_physical":
//         const physicalProduct = linkData as ProductPhysicalLinkData;
//         if (physicalProduct.variants && physicalProduct.variants.length > 0) {
//           // Vérifier que toutes les variantes requises sont sélectionnées
//           return physicalProduct.variants.some(
//             (variant) => !selectedVariants[variant.id]
//           );
//         }
//         return false;
//       default:
//         return false;
//     }
//   };

//   return (
//     <div className="space-y-6">
//       {renderTypeSpecificContent()}

//       <CTAButton
//         asChild
//         size="lg"
//         className="w-full"
//         disabled={isButtonDisabled()}
//       >
//         <Link href={buildPaymentUrl()}>{getButtonText()}</Link>
//       </CTAButton>
//     </div>
//   );
// }
