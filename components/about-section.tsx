import Image from "next/image"

export function AboutSection() {
  return (
    <section id="about" className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 lg:px-10 lg:py-24">
      <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
        {/* Left Column - Image with Classic Frame */}
        <div className="relative order-2 lg:order-1">
          {/* Decorative border frame */}
          <div className="absolute -inset-4 border-2 border-primary/20 sm:-inset-6" />
          <div className="relative aspect-[4/3] w-full overflow-hidden">
            <Image
              src="/entry_1.jpeg"
              alt="Vrindavan restaurant interior"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          {/* Corner accents */}
          <div className="absolute -left-2 -top-2 h-8 w-8 border-l-2 border-t-2 border-primary" />
          <div className="absolute -right-2 -top-2 h-8 w-8 border-r-2 border-t-2 border-primary" />
          <div className="absolute -bottom-2 -left-2 h-8 w-8 border-b-2 border-l-2 border-primary" />
          <div className="absolute -bottom-2 -right-2 h-8 w-8 border-b-2 border-r-2 border-primary" />
        </div>

        {/* Right Column - Content */}
        <div className="space-y-6 order-1 lg:order-2">
          <div>
            <h2 className="font-serif text-3xl tracking-wide text-foreground sm:text-4xl lg:text-5xl">
              About Vrindavan
            </h2>
            <div className="mt-4 h-1 w-20 bg-primary" />
          </div>

          <div className="space-y-4 text-muted-foreground">
            <p className="text-base leading-relaxed lg:text-lg">
              Welcome to Vrindavan, where culinary excellence meets timeless elegance. 
              Our restaurant offers an unforgettable dining experience that celebrates 
              authentic flavors and exceptional hospitality.
            </p>
            <p className="text-base leading-relaxed lg:text-lg">
              With a commitment to using the finest ingredients and traditional cooking 
              techniques, we craft dishes that tell a story of heritage and innovation. 
              Each meal is prepared with passion and served in an atmosphere designed 
              for memorable moments.
            </p>
            <p className="text-base leading-relaxed lg:text-lg">
              Whether you're joining us for an intimate dinner or a special celebration, 
              our dedicated team ensures every visit is extraordinary.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
