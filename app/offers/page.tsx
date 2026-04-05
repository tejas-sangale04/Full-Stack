"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
//import FloatingBookingButton from "@/components/floating-booking-button"
import { Tag, Loader2 } from "lucide-react"
import { getOffers } from "@/app/actions/offers"
import { useLanguage } from "@/components/language-provider"

type DBOffer = {
  id: string;
  title: string;
  description: string;
  originalPrice?: number | null;
  discountedPrice?: number | null;
  imageUrl?: string | null;
  isActive: boolean;
}



export default function OffersPage() {
  const [dbOffers, setDbOffers] = useState<DBOffer[]>([])
  const [loading, setLoading] = useState(true)
  const { t } = useLanguage()

  useEffect(() => {
    async function loadOffers() {
      try {
        const data = await getOffers()
        setDbOffers(data)
      } catch (error) {
        console.error("Failed to load offers:", error)
      } finally {
        setLoading(false)
      }
    }
    loadOffers()
  }, [])

  return (
    <div className="min-h-screen bg-amber-50/50">
      <Navbar />

      <main className="mx-auto max-w-[1440px] px-6 py-16 lg:px-16">
        {/* Header */}
        <div className="mb-12 text-center">
          <p className="mb-2 text-sm tracking-[0.15em] text-muted-foreground">{t("offers_subtitle")}</p>
          <h1 className="font-serif text-5xl text-foreground lg:text-6xl">{t("offers_title")}</h1>
          <div className="mx-auto mt-4 h-1 w-20 bg-primary" />
          <p className="mt-4 text-base text-muted-foreground">
            {t("offers_description")}
          </p>
        </div>

        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Display DB Offers first */}
            {dbOffers.map((offer) => (
              <div
                key={offer.id}
                className="relative rounded-2xl border border-border bg-background p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/30 flex flex-col"
              >
                <span className="absolute top-4 right-4 rounded-full px-3 py-1 text-[10px] font-bold tracking-widest text-white bg-primary">
                  {t("new_offer_badge")}
                </span>

                <div className="mb-3 flex items-center gap-2">
                  <Tag className="h-3.5 w-3.5 text-primary" />
                  <span className="text-xs font-semibold tracking-[0.15em] text-primary">{t("special_deal_badge")}</span>
                </div>

                <h2 className="mb-2 font-serif text-2xl text-foreground">{offer.title}</h2>
                <p className="mb-6 text-sm text-muted-foreground leading-relaxed flex-1">{offer.description}</p>

                <div className="flex items-end justify-between border-t border-border pt-4">
                  <div>
                    {offer.originalPrice && <p className="text-xs text-muted-foreground line-through">₹{offer.originalPrice}/-</p>}
                    {offer.discountedPrice && <p className="text-2xl font-bold text-primary">₹{offer.discountedPrice}/-</p>}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {offer.originalPrice && offer.discountedPrice && (
                      <span className="rounded-full bg-green-100 px-3 py-1 text-[10px] font-bold text-green-700">
                        {Math.round(((offer.originalPrice - offer.discountedPrice) / offer.originalPrice) * 100)}% OFF
                      </span>
                    )}

                  </div>
                </div>
              </div>
            ))}


          </div>
        )}
      </main>

     {/* <FloatingBookingButton /> */}
    </div>
  )
}
