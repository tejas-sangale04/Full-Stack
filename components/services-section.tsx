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
    {
      id: "reservations",
      title: t("services_reservations_title"),
      subtitle: t("services_reservations_sub"),
      images: ["/reservation.jpg", "/placeholder.jpg", "/placeholder.jpg"],
      link: "/book-table",
      boxSize: "px-4 py-4",
    },
    {
      id: "offers",
      title: t("services_offers_title"),
      subtitle: t("services_offers_sub"),
      images: ["/offers.png", "/placeholder.jpg", "/placeholder.jpg"],
      link: "/offers",
      boxSize: "px-6 py-6",
    },
  ]

  const handleMouseEnter = (index: number) => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => ({
        ...prev,
        [index]: (prev[index] + 1) % services[index].images.length,
      }))
    }, 800)
    ;(window as any)[`carouselInterval${index}`] = interval
  }

  const handleMouseLeave = (index: number) => {
    clearInterval((window as any)[`carouselInterval${index}`])
    setCurrentImageIndex((prev) => ({ ...prev, [index]: 0 }))
  }

  return (
    <section className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 lg:px-10 lg:py-24">
      <div className="grid gap-6 md:grid-cols-3 lg:gap-8">
        {services.map((service, index) => (
          <Link
            key={service.id}
            href={service.link}
            className="group relative block aspect-[3/4] overflow-hidden"
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
                  className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
                    currentImageIndex[index] === imgIndex ? "opacity-100" : "opacity-0"
                  }`}
                />
              ))}
            </div>

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40 transition-all group-hover:bg-black/50" />

            {/* Content Box */}
            <div className="absolute inset-0 flex items-center justify-center p-8">
              <div className={`border-1 border-background bg-background/75 text-center transition-all group-hover:scale-105 group-hover:bg-background ${service.boxSize}`}>
                <h3 className="font-serif text-2xl tracking-[0.2em] text-foreground lg:text-3xl">
                  {service.title}
                </h3>
                <p className="mt-4 font-serif text-sm italic text-muted-foreground lg:text-base">
                  {service.subtitle}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
