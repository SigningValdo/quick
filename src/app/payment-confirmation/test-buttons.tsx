"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"

export function TestButtons() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const changeStatus = (newStatus: string) => {
    const params = new URLSearchParams(searchParams)
    params.set("status", newStatus)
    router.push(`/payment-confirmation?${params.toString()}`)
  }

  // Ne montrer ces boutons qu'en mode développement
  if (process.env.NODE_ENV !== "development") {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white p-2 rounded-lg shadow-lg border z-50">
      <div className="text-xs font-bold mb-2">Test des statuts (dev uniquement)</div>
      <div className="flex flex-wrap gap-2">
        <Button size="sm" variant="outline" onClick={() => changeStatus("success")}>
          Réussi
        </Button>
        <Button size="sm" variant="outline" onClick={() => changeStatus("failed")}>
          Échoué
        </Button>
        <Button size="sm" variant="outline" onClick={() => changeStatus("canceled")}>
          Annulé
        </Button>
        <Button size="sm" variant="outline" onClick={() => changeStatus("pending")}>
          En attente
        </Button>
        <Button size="sm" variant="outline" onClick={() => changeStatus("processing")}>
          Traitement
        </Button>
      </div>
    </div>
  )
}
