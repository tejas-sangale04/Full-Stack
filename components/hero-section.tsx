"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"


const heroImages = [
  "/dish_1.jpg",
  "/dish_4.png",
  "/dish_5.jpg",
  "/dish_7.png",
  "/dish_9.png"
]

export function HeroSection() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length)
    }, 4000) // Change image every 4 seconds

    return () => clearInterval(interval)
  }, [])

  const goToPrevious = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? heroImages.length - 1 : prevIndex - 1
    )
  }

  const goToNext = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length)
  }

  return (
    <section className="relative mx-auto max-w-[1440px] px-4 py-4 sm:px-4 lg:px-10 lg:py-6">
      <div className="relative aspect-[7/6] w-full overflow-hidden sm:aspect-[16/8] lg:aspect-[15/7]">
        {/* Decorative border frame */}
        <div className="absolute inset-3 z-10 border border-muted-foreground/20 sm:inset-6 lg:inset-10" />

        {/* Hero Images with Slider Effect */}
        {heroImages.map((image, index) => (
          <img
            key={image}
            src={image}
            alt={`Vrundavan dish ${index + 1}`}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
              currentImageIndex === index ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}

        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        {/* Left Arrow */}
        <button
          onClick={goToPrevious}
          className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-background/80 p-2 text-foreground transition-all hover:bg-background hover:scale-110 sm:left-8 lg:left-12"
          aria-label="Previous image"
        >
          <ChevronLeft className="h-6 w-6 sm:h-8 sm:w-8" />
        </button>

        {/* Right Arrow */}
        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-background/80 p-2 text-foreground transition-all hover:bg-background hover:scale-110 sm:right-8 lg:right-12"
          aria-label="Next image"
        >
          <ChevronRight className="h-6 w-6 sm:h-8 sm:w-8" />
        </button>


        {/* Slider Indicators */}
        <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 gap-2 sm:bottom-12 lg:bottom-16">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`h-2 w-2 rounded-full transition-all ${
                currentImageIndex === index
                  ? 'w-8 bg-background'
                  : 'bg-background/50 hover:bg-background/75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>


      </div>
    </section>
  )
}
