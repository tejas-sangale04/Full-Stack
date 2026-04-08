import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { AboutSection } from "@/components/about-section"
import { DifferentiatorSection } from "@/components/differentiator-section"
import { ServicesSection } from "@/components/services-section"
import { LocationSection } from "@/components/location-section"
//import FloatingBookingButton from "@/components/floating-booking-button"

export default function Home() {
  return (
    <div className="min-h-screen bg-amber-50/50">
      <Navbar />
      <main>
        <HeroSection />
        <AboutSection />
        <DifferentiatorSection />
        <ServicesSection />
        <LocationSection />
      </main>
     {/*<FloatingBookingButton /> */}
    </div>
  )
}
