 "use client"

import Image from "next/image"
import { useLanguage } from "@/components/language-provider"
 
 export function AboutSection() {
   const { t } = useLanguage()
   
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
               alt="Vrundavan restaurant interior"
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
               {t("about_title")}
             </h2>
             <div className="mt-4 h-1 w-20 bg-primary" />
           </div>
 
           <div className="space-y-4 text-muted-foreground">
             <p className="text-base leading-relaxed lg:text-lg">
               {t("about_p1")}
             </p>
             <p className="text-base leading-relaxed lg:text-lg">
               {t("about_p2")}
             </p>
             <p className="text-base leading-relaxed lg:text-lg">
               {t("about_p3")}
             </p>
           </div>
         </div>
       </div>
     </section>
   )
 }
