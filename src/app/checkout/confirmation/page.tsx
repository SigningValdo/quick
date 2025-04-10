"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"

export default function CheckoutConfirmationRedirect() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Récupérer les paramètres de l'URL
    const status = searchParams.get("status") || "success"
    const orderId = searchParams.get("orderId") || `ORD-${Math.floor(Math.random() * 1000000)}`
    const amount = searchParams.get("amount") || "100"
    const linkId = searchParams.get("linkId") || ""

    // Construire l'URL de redirection
    const params = new URLSearchParams()
    params.set("status", status)
    params.set("orderId", orderId)
    params.set("amount", amount)
    if (linkId) params.set("linkId", linkId)

    // Rediriger vers la page de confirmation
    router.replace(`/payment-confirmation?${params.toString()}`)
  }, [router, searchParams])

  return (
    <div className="min-h-screen flex items-center justify-center bg-warmgray-50">
      <div className="text-center">
        <div className="h-16 w-16 mx-auto rounded-full border-4 border-teal-600 border-t-transparent animate-spin" />
        <p className="mt-4 text-gray-600">Redirection en cours...</p>
      </div>
    </div>
  )
}
