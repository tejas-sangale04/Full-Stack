"use client"

import { useState, useEffect, useRef, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { ChevronLeft, ChevronRight, Search, X } from "lucide-react"
import { Navbar } from "@/components/navbar"
import FloatingBookingButton from "@/components/floating-booking-button"
import { getMenuItems } from "@/app/actions/menu"

type MenuItem = {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
}

const TAB_IMAGES: Record<string, string | null> = {
  "All Day" : "/fullday.jpg",
  "Breakfast": "/breakfast_image.jpg",
  "Cold Beverages": "/beverages.jpg",
  "Marathi Special": "/patodii.png",
  "Starters" : "/manchurian_img.png",
  "Main Course" : "/angara.jpeg",
  "Paneer Special" : "/panner_1.png",
  "Tandoori Bread" : "/tandorrr.png",
  "Basmati Ki Khushboo" : "/biryani.png",
};

function MenuContent() {
  const searchParams = useSearchParams()
  const tabParam = searchParams.get("tab")
  
  const [dbItems, setDbItems] = useState<MenuItem[]>([])
  const [tabs, setTabs] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState<string>("")
  const [search, setSearch] = useState("")
  const tabBarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function loadMenu() {
      try {
        const fetchedItems = await getMenuItems()
        setDbItems(fetchedItems)
        const uniqueCategories = Array.from(new Set(fetchedItems.map(i => i.category)))
        
        // Ensure "Breakfast" is default if not specified
        const standardOrder = ["All Day", "Breakfast", "Cold Beverages", "Starters", "Main Course", "Paneer Special", "Marathi Special", "Tandoori Bread", "Basmati Ki Khushboo"]
        uniqueCategories.sort((a, b) => {
          const aIdx = standardOrder.indexOf(a)
          const bIdx = standardOrder.indexOf(b)
          if (aIdx !== -1 && bIdx !== -1) return aIdx - bIdx
          if (aIdx !== -1) return -1
          if (bIdx !== -1) return 1
          return a.localeCompare(b)
        })
        
        setTabs(uniqueCategories)
        
        if (uniqueCategories.length > 0) {
          const defaultTab = uniqueCategories.includes("Breakfast") ? "Breakfast" : uniqueCategories[0];
          setActiveTab(tabParam && uniqueCategories.includes(tabParam) ? tabParam : defaultTab)
        }
      } catch (error) {
        console.error("Failed to load menu", error)
        alert("Wait! Something went wrong while loading the menu. Please check your database connection or try again later.")
      }
    }
    loadMenu()
  }, [tabParam])

  const scrollTabs = (dir: "left" | "right") => {
    if (tabBarRef.current) {
      tabBarRef.current.scrollBy({ left: dir === "left" ? -200 : 200, behavior: "smooth" })
    }
  }

  // When searching, show results across all tabs; otherwise show current tab
  const filteredItems = search.trim()
    ? dbItems.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()))
    : dbItems.filter((item) => item.category === activeTab)

  const currentImage = TAB_IMAGES[activeTab] || null;

  return (
    <div className="min-h-screen bg-amber-50/50">
      <Navbar />

      {/* Hero: text left, image right */}
      <section className="mx-auto max-w-[1440px] px-6 pt-16 pb-0 lg:px-16">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-16">
          <div className="flex-1">
            <p className="mb-2 text-sm tracking-[0.15em] text-muted-foreground">
              Authentic Indian cuisine
            </p>
            <h1 className="font-serif text-5xl leading-tight text-foreground lg:text-6xl">
              Our Menus
            </h1>
            <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground" style={{ textAlign: "justify" }}>
              At Vrundavan, you&apos;ll find the soul of traditional Indian cooking —
              home kitchens, street stalls, and festive feasts all on one table.
              Come, eat your way through flavours crafted with love, for breakfast,
              lunch, evening chai, or a full dinner spread. Much awaits you.
            </p>
          </div>

          <div className="w-full lg:w-[480px] xl:w-[540px] flex-shrink-0">
            {currentImage ? (
              <img
                src={currentImage}
                alt={activeTab}
                className="h-72 w-full rounded-xl object-cover shadow-lg lg:h-80"
              />
            ) : (
              <div className="h-72 w-full rounded-xl border-2 border-dashed border-border bg-background flex flex-col items-center justify-center gap-2 text-muted-foreground lg:h-80">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 opacity-25" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-sm font-medium">Add {activeTab} image</p>
                <p className="text-xs opacity-50">Set image in TAB_IMAGES array</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Scrollable Tab Bar */}
      <div className="sticky top-[65px] z-40 mt-10 border-y border-border bg-amber-50/90 backdrop-blur-sm">
        <div className="mx-auto max-w-[1440px] flex items-center px-4 lg:px-16">
          <button onClick={() => scrollTabs("left")} className="flex-shrink-0 p-2 text-muted-foreground hover:text-foreground transition-colors" aria-label="Scroll left">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div ref={tabBarRef} className="flex flex-1 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); setSearch("") }}
                className={`flex-shrink-0 px-8 py-4 text-xs font-semibold tracking-[0.15em] transition-all border-b-2 ${
                  activeTab === tab && !search
                    ? "border-foreground text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.toUpperCase()}
              </button>
            ))}
          </div>
          <button onClick={() => scrollTabs("right")} className="flex-shrink-0 p-2 text-muted-foreground hover:text-foreground transition-colors" aria-label="Scroll right">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Menu Items */}
      <main className="mx-auto max-w-[1440px] px-6 py-12 lg:px-16">

        {/* Search bar */}
        <div className="mb-8 flex flex-wrap items-center gap-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search menu items..."
              className="w-full rounded-lg border border-border bg-background pl-9 pr-9 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          {search && (
            <p className="text-sm text-muted-foreground">
              {filteredItems.length} result{filteredItems.length !== 1 ? "s" : ""} for &quot;{search}&quot;
            </p>
          )}
        </div>

        <h2 className="mb-6 font-serif text-2xl tracking-wide text-foreground">
          {search ? "Search Results" : activeTab}
        </h2>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-lg border border-border bg-background px-5 py-3.5 shadow-sm transition-all hover:shadow-md hover:border-primary/30"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-sm border-2 border-green-600 bg-white">
                    <div className="h-2.5 w-2.5 rounded-full bg-green-600" />
                  </div>
                  <span className="font-serif text-sm text-foreground">{item.name}</span>
                </div>
                <span className="ml-4 flex-shrink-0 text-sm font-semibold text-primary">
                  ₹{item.price}/-
                </span>
              </div>
            ))
          ) : (
            <p className="col-span-3 py-10 text-center text-muted-foreground">
              No items found for &quot;{search}&quot;
            </p>
          )}
        </div>
      </main>

      <FloatingBookingButton />
    </div>
  )
}

export default function MenuPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-amber-50/50" />}>
      <MenuContent />
    </Suspense>
  )
}
