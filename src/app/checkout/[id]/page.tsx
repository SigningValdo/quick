"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";

// Données fictives pour la campagne
const campaignData = {
  id: "1",
  title: "Aide pour les frais médicaux de Sophie",
  image: "/placeholder.svg?height=400&width=600",
  merchant: {
    name: "Marie Dupont",
    avatar: "/placeholder.svg?height=100&width=100",
  },
};

export default function CheckoutPage({ params }: { params: { id: string } }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  // Formulaire de paiement
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    cardNumber: "",
    expiryDate: "",
    cvc: "",
    message: "",
  });

  // Effet pour scroller en haut de la page lors du chargement
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const amountParam = searchParams.get("amount");
    if (amountParam) {
      setAmount(amountParam);
    }
  }, [searchParams]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simuler un traitement de paiement
    setTimeout(() => {
      setIsProcessing(false);

      // Rediriger vers la page de confirmation avec les paramètres appropriés
      const params = new URLSearchParams();
      params.set("status", "success");
      params.set("orderId", `ORD-${Math.floor(Math.random() * 1000000)}`);
      params.set("amount", amount);
      params.set("linkId", params.id);

      router.push(`/payment-confirmation?${params.toString()}`);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="container max-w-4xl">
        {isComplete ? null : (
          <>
            {/* En-tête */}
            <div className="mb-8">
              <Link
                href={`/${params.id}`}
                className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Retour au lien
              </Link>
              <h1 className="text-2xl font-bold">Faire un don</h1>
            </div>

            {/* Contenu principal */}
            <div className="grid md:grid-cols-3 gap-8">
              {/* Formulaire de paiement */}
              <div className="md:col-span-2 space-y-6">
                <Card>
                  <CardContent className="p-6">
                    {step === 1 ? (
                      <div className="space-y-4">
                        <h2 className="text-lg font-medium">Montant du don</h2>
                        <div>
                          <Label htmlFor="amount">Montant (€)</Label>
                          <div className="relative mt-1">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2">
                              €
                            </span>
                            <Input
                              id="amount"
                              type="number"
                              min="1"
                              value={amount}
                              onChange={(e) => setAmount(e.target.value)}
                              className="pl-8"
                            />
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="anonymous"
                            checked={isAnonymous}
                            onCheckedChange={(checked) =>
                              setIsAnonymous(checked as boolean)
                            }
                          />
                          <label
                            htmlFor="anonymous"
                            className="text-sm cursor-pointer"
                          >
                            Faire un don anonyme
                          </label>
                        </div>
                        <div>
                          <Label htmlFor="message">Message (optionnel)</Label>
                          <textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleInputChange}
                            className="mt-1 w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="Laissez un message d'encouragement..."
                          />
                        </div>
                        <Button
                          onClick={() => setStep(2)}
                          disabled={!amount || Number.parseFloat(amount) <= 0}
                          className="w-full bg-teal-600 hover:bg-teal-700"
                        >
                          Continuer
                        </Button>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <h2 className="text-lg font-medium">
                          Informations personnelles
                        </h2>
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div>
                            <Label htmlFor="fullName">Nom complet</Label>
                            <Input
                              id="fullName"
                              name="fullName"
                              value={formData.fullName}
                              onChange={handleInputChange}
                              required
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              required
                              className="mt-1"
                            />
                          </div>
                        </div>

                        <h2 className="text-lg font-medium pt-2">
                          Méthode de paiement
                        </h2>
                        <Tabs
                          defaultValue="card"
                          onValueChange={setPaymentMethod}
                          className="w-full"
                        >
                          <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="card">Carte</TabsTrigger>
                            <TabsTrigger value="paypal">PayPal</TabsTrigger>
                            <TabsTrigger value="bank">Virement</TabsTrigger>
                          </TabsList>
                          <TabsContent value="card" className="space-y-4 pt-4">
                            <div>
                              <Label htmlFor="cardNumber">
                                Numéro de carte
                              </Label>
                              <Input
                                id="cardNumber"
                                name="cardNumber"
                                value={formData.cardNumber}
                                onChange={handleInputChange}
                                required
                                className="mt-1"
                                placeholder="1234 5678 9012 3456"
                              />
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                              <div>
                                <Label htmlFor="expiryDate">
                                  {"Date d'expiration"}
                                </Label>
                                <Input
                                  id="expiryDate"
                                  name="expiryDate"
                                  value={formData.expiryDate}
                                  onChange={handleInputChange}
                                  required
                                  className="mt-1"
                                  placeholder="MM/AA"
                                />
                              </div>
                              <div>
                                <Label htmlFor="cvc">CVC</Label>
                                <Input
                                  id="cvc"
                                  name="cvc"
                                  value={formData.cvc}
                                  onChange={handleInputChange}
                                  required
                                  className="mt-1"
                                  placeholder="123"
                                />
                              </div>
                            </div>
                          </TabsContent>
                          <TabsContent value="paypal" className="pt-4">
                            <div className="text-center py-8">
                              <p className="mb-4">
                                Vous serez redirigé vers PayPal pour finaliser
                                votre paiement.
                              </p>
                              <Image
                                src="/placeholder.svg?height=60&width=200"
                                alt="PayPal"
                                width={200}
                                height={60}
                                className="mx-auto"
                              />
                            </div>
                          </TabsContent>
                          <TabsContent value="bank" className="pt-4">
                            <div className="border rounded-md p-4 bg-muted/50">
                              <h3 className="font-medium mb-2">
                                Coordonnées bancaires
                              </h3>
                              <p className="text-sm mb-1">
                                IBAN: FR76 1234 5678 9012 3456 7890 123
                              </p>
                              <p className="text-sm mb-1">BIC: ABCDEFGHIJK</p>
                              <p className="text-sm text-muted-foreground mt-2">
                                Veuillez indiquer {campaignData.title} en
                                référence de votre virement.
                              </p>
                            </div>
                          </TabsContent>
                        </Tabs>

                        <div className="flex items-center space-x-2 pt-2">
                          <Checkbox id="terms" required />
                          <label
                            htmlFor="terms"
                            className="text-sm cursor-pointer"
                          >
                            {"J'accepte les"}
                            <Link
                              href="/terms"
                              className="text-teal-600 hover:underline"
                            >
                              {"conditions d'utilisation"}
                            </Link>{" "}
                            et la{" "}
                            <Link
                              href="/privacy"
                              className="text-teal-600 hover:underline"
                            >
                              politique de confidentialité
                            </Link>
                          </label>
                        </div>

                        <div className="flex gap-2 pt-2">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setStep(1)}
                            className="flex-1"
                          >
                            Retour
                          </Button>
                          <Button
                            type="submit"
                            disabled={isProcessing}
                            className="flex-1 bg-teal-600 hover:bg-teal-700"
                          >
                            {isProcessing ? (
                              <div className="flex items-center">
                                <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2" />
                                Traitement...
                              </div>
                            ) : (
                              `Payer ${Number.parseFloat(
                                amount
                              ).toLocaleString()} €`
                            )}
                          </Button>
                        </div>
                      </form>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Résumé de la commande */}
              <div>
                <Card>
                  <CardContent className="p-6 space-y-4">
                    <h2 className="text-lg font-medium">Résumé</h2>
                    <div className="flex items-center gap-3 pb-4 border-b">
                      <div className="relative h-16 w-16 overflow-hidden rounded-md flex-shrink-0">
                        <Image
                          src={campaignData.image || "/placeholder.svg"}
                          alt={campaignData.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-medium line-clamp-2">
                          {campaignData.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {campaignData.merchant.name}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Montant du don</span>
                        <span className="font-medium">
                          {Number.parseFloat(amount || "0").toLocaleString()} €
                        </span>
                      </div>
                      <div className="flex justify-between text-muted-foreground text-sm">
                        <span>Frais de traitement</span>
                        <span>0,00 €</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg pt-2 border-t">
                        <span>Total</span>
                        <span>
                          {Number.parseFloat(amount || "0").toLocaleString()} €
                        </span>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      <p>100% de votre don va directement à la campagne.</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
