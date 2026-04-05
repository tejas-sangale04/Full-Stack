"use client"

import { useState } from "react"
import Link from "next/link"
import { useLanguage } from "@/components/language-provider"

export function ServicesSection() {
  const [currentImageIndex, setCurrentImageIndex] = useState<{ [key: number]: number }>({
    0: 0, 1: 0, 2: 0,
  })
  const { t } = useLanguage()

  const services = [
    {
      id: "menus",
      title: t("services_menus_title"),
      subtitle: t("services_menus_sub"),
      images: ["/breakfast_image.jpg", "/placeholder.jpg", "/placeholder.jpg"],
      link: "/menu",
      boxSize: "px-6 py-6",
    },
    /*{
      id: "reservations",
      title: t("services_reservations_title"),
      subtitle: t("services_reservations_sub"),
      images: ["/reservation.jpg", "/placeholder.jpg", "/placeholder.jpg"],
      link: "/book-table",
      boxSize: "px-4 py-4",
    },*/
    /*{
      id: "offers",
      title: t("services_offers_title"),
      subtitle: t("services_offers_sub"),
      images: ["/offers.png", "/placeholder.jpg", "/placeholder.jpg"],
      link: "/offers",
      boxSize: "px-6 py-6",
    },*/
  ]

  const handleMouseEnter = (index: number) => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => ({
        ...prev,
        [index]: (prev[index] + 1) % services[index].images.length,
      }))
    }, 800)
      ; (window as any)[`carouselInterval${index}`] = interval
  }

  const handleMouseLeave = (index: number) => {
    clearInterval((window as any)[`carouselInterval${index}`])
    setCurrentImageIndex((prev) => ({ ...prev, [index]: 0 }))
  }

  return (
    <section className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 lg:px-10 lg:py-24">
      <div className={`grid gap-8 ${services.length === 1 ? "mx-auto max-w-3xl" : "md:grid-cols-2 lg:grid-cols-3"}`}>
        {services.map((service, index) => (
          <Link
            key={service.id}
            href={service.link}
            className={`group relative block overflow-hidden transition-all duration-500 hover:shadow-2xl ${services.length === 1 ? "aspect-[16/9] md:aspect-[21/9]" : "aspect-[3/4]"}`}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={() => handleMouseLeave(index)}
          >
            {/* Carousel Images */}
            <div className="absolute inset-0">
              {service.images.map((img, imgIndex) => (
                <img
                  key={imgIndex}
                  src={img}
                  alt={`${service.title} ${imgIndex + 1}`}
                  className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-10000 ${currentImageIndex[index] === imgIndex ? "opacity-100 scale-110" : "opacity-0 scale-100"}`}
                />
              ))}
            </div>

            {/* Premium Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-500 group-hover:from-black/90" />

            {/* Content Box */}
            <div className="absolute inset-0 flex items-center justify-center p-6 md:p-12">
              <div className={`relative overflow-hidden border border-white/60 bg-black/10 backdrop-blur-sm text-center transition-all duration-700 group-hover:scale-105 group-hover:bg-black/60 group-hover:border-white/40 ${service.boxSize}`}>
                <div className="relative z-10">
                  <h3 className="font-serif text-3xl tracking-[0.3em] text-white lg:text-5xl uppercase">
                    {service.title}
                  </h3>
                  <div className="mx-auto mt-4 h-px w-12 bg-white/50 transition-all duration-700 group-hover:w-24 group-hover:bg-white" />
                  <p className="mt-6 font-serif text-sm italic text-stone-200 lg:text-lg tracking-wide">
                    {service.subtitle}
                  </p>
                  <div className="mt-8 inline-block border border-white/30 px-6 py-2 text-xs uppercase tracking-[0.2em] text-white opacity-0 transition-all duration-700 group-hover:opacity-100 group-hover:translate-y-0 translate-y-4">
                    Explore Menu
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
