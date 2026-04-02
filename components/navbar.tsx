"use client"

import { useState, useEffect } from "react"
import { Search, ChevronDown, Menu, X, ChevronRight, LogOut, Languages } from "lucide-react"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import SparkBackground from "./spark"
import { useLanguage } from "@/components/language-provider"

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  
  const { data: session } = useSession()
  const { t, setLanguage } = useLanguage()

  const navLinks = [
    { label: t("about"), href: "#about" },
    { label: t("menu"), href: "/menu", hasDropdown: true, dropdownItems: [
      { label: t("all_day"), href: "/menu?tab=allday" },
      { label: t("starters"), href: "/menu?tab=starters" },
      { label: t("main_course"), href: "/menu?tab=maincourse" },
      { label: t("paneer_special"), href: "/menu?tab=paneerspecial" },
      { label: t("breakfast"), href: "/menu?tab=breakfast" },
      { label: t("drinks"), href: "/menu?tab=drinks" }
    ]},
    { label: t("offers"), href: "/offers"},
    { label: t("contact"), href: "#location"  },
  ]

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header 
      className={`sticky top-0 z-[60] border-b relative overflow-visible transition-all duration-300 ${
        isScrolled 
          ? 'bg-gradient-to-r from-amber-50 via-stone-50 to-amber-50 border-amber-200 shadow-md backdrop-blur-sm' 
          : 'bg-background border-border'
      }`}
    >
      {/* Spark Effect Background - Always visible */}
      <div className="absolute inset-0 pointer-events-none">
        <SparkBackground />
      </div>

      <nav className="relative z-10 mx-auto flex max-w-[1440px] items-center justify-between px-6 py-4 lg:px-10">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0" aria-label="Vrundavan Home">
          <span className={`font-serif text-2xl tracking-[0.25em] lg:text-3xl transition-colors ${
            isScrolled ? 'text-amber-800' : 'text-primary'
          }`}>
            VRUNDAVAN
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <ul className="hidden items-center gap-6 lg:flex xl:gap-8">
          {navLinks.map((link) => (
            <li 
              key={link.label} 
              className="relative group"
              onMouseEnter={() => link.hasDropdown && setOpenDropdown(link.label)}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <Link
                href={link.href}
                className={`group/link relative flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.2em] transition-all xl:text-xs ${
                  isScrolled ? 'text-slate-600 hover:text-amber-800' : 'text-foreground/80 hover:text-primary'
                }`}
              >
                <span className="relative py-1">
                  {link.label}
                  <span className={`absolute bottom-0 left-0 h-[1.5px] w-0 bg-current transition-all duration-300 ease-out group-hover/link:w-full ${
                    isScrolled ? 'bg-amber-800' : 'bg-primary'
                  }`} />
                </span>
                {link.hasDropdown && (
                  <ChevronDown className={`h-3 w-3 transition-transform duration-300 ${openDropdown === link.label ? 'rotate-180' : ''}`} />
                )}
              </Link>

              {/* Dropdown Menu */}
              {link.hasDropdown && openDropdown === link.label && (
                <div className="absolute left-0 top-full mt-2 w-56 rounded-lg bg-background border border-border shadow-xl py-2 z-[100]">
                  <div className="px-4 py-2 text-[10px] font-semibold tracking-[0.15em] text-muted-foreground border-b border-border">
                    {t("select_menu")}
                  </div>
                  {link.dropdownItems?.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="group/item flex items-center justify-between px-4 py-3 text-sm font-serif text-foreground hover:bg-primary/5 transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <ChevronRight className="h-4 w-4 text-primary opacity-0 -translate-x-2 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all" />
                        {item.label}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          {session ? (
            <div className="relative group">
              <button
                className={`flex items-center gap-2 text-xs font-semibold tracking-[0.1em] transition-all px-4 py-2 rounded-full border ${
                  isScrolled 
                    ? 'border-amber-200 text-amber-800 bg-amber-50/50' 
                    : 'border-primary/20 text-primary bg-primary/5'
                }`}
              >
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <span className="uppercase">{session.user?.role || 'User'}</span>
                <ChevronDown className="h-3 w-3 opacity-50 group-hover:rotate-180 transition-transform" />
              </button>
              
              {/* Logout Dropdown on Hover */}
              <div className="absolute right-0 top-full pt-2 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200 z-[100]">
                <div className="w-40 rounded-xl bg-background border border-border shadow-xl overflow-hidden">
                  <div className="px-4 py-2 text-[10px] font-bold text-muted-foreground border-b border-border bg-muted/30 uppercase tracking-widest">
                    {t("account")}
                  </div>
                  <button
                    onClick={() => signOut()}
                    className="w-full flex items-center gap-2 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    {t("logout")}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <Link
              href="/login"
              className={`group/link hidden items-center text-[11px] font-semibold uppercase tracking-[0.2em] transition-all md:inline-flex lg:text-xs ${
                isScrolled ? 'text-slate-600 hover:text-amber-800' : 'text-foreground/80 hover:text-primary'
              }`}
            >
              <span className="relative py-1">
                {t("login_join")}
                <span className={`absolute bottom-0 left-0 h-[1.5px] w-0 bg-current transition-all duration-300 ease-out group-hover/link:w-full ${
                  isScrolled ? 'bg-amber-800' : 'bg-primary'
                }`} />
              </span>
            </Link>
          )}

          <Link
            href="/book-table"
            className={`hidden rounded-full px-5 py-2 text-xs font-semibold tracking-[0.1em] transition-all hover:opacity-90 hover:shadow-lg md:inline-block lg:text-sm ${
              isScrolled ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white' : 'bg-primary text-primary-foreground'
            }`}
          >
            {t("book_now")}
          </Link>

          {/* Language Selector */}
          <div className="relative group">
            <button
              className={`flex h-9 w-9 items-center justify-center rounded-full border transition-all ${
                isScrolled 
                  ? 'border-amber-200 text-amber-700 hover:bg-amber-100' 
                  : 'border-primary/20 text-primary hover:bg-primary/5'
              }`}
            >
              <Languages className="h-4 w-4" />
            </button>
            
            {/* Language Dropdown */}
            <div className="absolute right-0 top-full pt-2 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200 z-[100]">
              <div className="w-32 rounded-xl bg-background border border-border shadow-xl overflow-hidden">
                <div className="px-3 py-2 text-[10px] font-bold text-muted-foreground border-b border-border bg-muted/30 uppercase tracking-widest">
                  {t("language")}
                </div>
                {[
                  { id: "en", label: "English", native: "English" },
                  { id: "mr", label: "Marathi", native: "मराठी" },
                  { id: "hi", label: "Hindi", native: "हिंदी" }
                ].map((lang) => (
                  <button
                    key={lang.id}
                    onClick={() => setLanguage(lang.id as "en" | "mr" | "hi")}
                    className="w-full text-left px-4 py-2.5 text-xs font-medium hover:bg-primary/5 transition-colors flex flex-col"
                  >
                    <span className="text-foreground">{lang.label}</span>
                    <span className="text-[10px] text-muted-foreground">{lang.native}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="flex h-9 w-9 items-center justify-center text-foreground lg:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="relative z-10 border-t border-border bg-background px-6 pb-6 lg:hidden">
          <ul className="flex flex-col gap-4 pt-4">
            {navLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-between text-xs font-bold uppercase tracking-[0.25em] text-foreground/90 py-2 border-b border-border/40 transition-colors active:text-primary active:bg-primary/5"
                >
                  {link.label}
                  {link.hasDropdown ? (
                    <ChevronRight className="h-4 w-4 text-muted-foreground opacity-50" />
                  ) : (
                    <div className="h-1 w-1 rounded-full bg-primary/20" />
                  )}
                </Link>
              </li>
            ))}
            <li className="border-t border-border pt-4">
              {session ? (
                <button
                  onClick={() => {
                    signOut()
                    setMobileOpen(false)
                  }}
                  className="text-sm font-medium tracking-[0.1em] text-foreground block text-left w-full"
                >
                  {t("logout")}
                </button>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="text-sm font-medium tracking-[0.1em] text-foreground block"
                >
                  {t("login_join")}
                </Link>
              )}
            </li>
            <li>
              <Link
                href="/book-table"
                onClick={() => setMobileOpen(false)}
                className="inline-block rounded-full bg-primary px-5 py-2.5 text-sm font-semibold tracking-[0.1em] text-primary-foreground"
              >
                {t("book_now")}
              </Link>
            </li>
            <li className="border-t border-border pt-4">
              <div className="px-2 py-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">
                {t("language")}
              </div>
              <div className="flex flex-wrap gap-2 px-2">
                {[
                  { id: "en", label: "EN", native: "English" },
                  { id: "mr", label: "MR", native: "मराठी" },
                  { id: "hi", label: "HI", native: "हिंदी" }
                ].map((lang) => (
                  <button
                    key={lang.id}
                    onClick={() => {
                      setLanguage(lang.id as "en" | "mr" | "hi")
                      setMobileOpen(false)
                    }}
                    className="flex flex-col items-center justify-center min-w-[60px] p-2 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-all active:scale-95"
                  >
                    <span className="text-xs font-bold text-foreground">{lang.label}</span>
                    <span className="text-[8px] text-muted-foreground">{lang.native}</span>
                  </button>
                ))}
              </div>
            </li>
          </ul>
        </div>
      )}
    </header>
  )
}
