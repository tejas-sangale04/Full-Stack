"use client"

import { useLanguage } from "@/components/language-provider"

export function DifferentiatorSection() {
  const { t } = useLanguage()

  return (
    <section className="relative w-full h-auto min-h-[600px] flex items-center mb-16 overflow-hidden">
      {/* Background Image - with a fallback color and gradient overlay */}
      <div 
        className="absolute inset-0 z-0 bg-neutral-900 bg-cover bg-center"
        style={{ backgroundImage: "url('/farmtotable.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/50 lg:bg-gradient-to-r lg:from-black/70 lg:via-black/30 lg:to-transparent" />
      </div>

      {/* Decorative border frame similar to Hero/About sections */}
      <div className="absolute inset-6 z-10 border border-white/10 sm:inset-10 lg:inset-16 pointer-events-none" />

      <div className="relative z-20 w-full max-w-[1440px] mx-auto px-6 py-20 sm:px-12 lg:px-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          
          {/* Left Column - Content */}
          <div className="space-y-8 max-w-2xl text-white">
            <div>
              <h4 className="text-[#c5a059] font-sans font-bold tracking-[0.3em] text-xs uppercase mb-4">
                {t("differentiator")}
              </h4>
              <h2 className="font-serif text-5xl sm:text-6xl lg:text-7xl tracking-wide leading-tight">
                {t("farm_to_table")}
              </h2>
              {/* Accent line similar to AboutSection */}
              <div className="mt-6 h-1.5 w-24 bg-[#c5a059]" />
            </div>

            <p className="font-sans text-stone-200 leading-relaxed text-lg sm:text-xl max-w-xl">
              {t("farm_desc")}
            </p>
          </div>


        </div>
      </div>
    </section>
  )
}
