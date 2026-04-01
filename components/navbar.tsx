"use client"

import { useState, useEffect } from "react"
import { Search, ChevronDown, Menu, X, ChevronRight } from "lucide-react"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import SparkBackground from "./spark"

const navLinks = [
  { label: "ABOUT", href: "#about" },
  { label: "MENU", href: "/menu", hasDropdown: true, dropdownItems: [
    { label: "All Day", href: "/menu?tab=allday" },
    { label: "Starters", href: "/menu?tab=starters" },
    { label: "Main Course", href: "/menu?tab=maincourse" },
    { label: "Paneer Special", href: "/menu?tab=paneerspecial" },
    { label: "Breakfast", href: "/menu?tab=breakfast" },
    { label: "Drinks", href: "/menu?tab=drinks" }
  ]},
  { label: "OFFERS", href: "/offers"},
  { label: "CONTACT", href: "#location"  },
]

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  
  const { data: session } = useSession()

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
        <Link href="/" className="flex-shrink-0" aria-label="Vrindavan Home">
          <span className={`font-serif text-2xl tracking-[0.25em] lg:text-3xl transition-colors ${
            isScrolled ? 'text-amber-800' : 'text-primary'
          }`}>
            VRINDAVAN
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
                className={`flex items-center gap-1 text-xs font-medium tracking-[0.1em] transition-colors xl:text-sm ${
                  isScrolled ? 'text-slate-700 hover:text-amber-700' : 'text-foreground hover:text-primary'
                }`}
              >
                {link.label}
                {link.hasDropdown && (
                  <ChevronDown className="h-3 w-3 text-muted-foreground" />
                )}
              </Link>

              {/* Dropdown Menu */}
              {link.hasDropdown && openDropdown === link.label && (
                <div className="absolute left-0 top-full mt-2 w-56 rounded-lg bg-background border border-border shadow-xl py-2 z-[100]">
                  <div className="px-4 py-2 text-xs font-semibold tracking-[0.15em] text-muted-foreground border-b border-border">
                    SELECT A MENU
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
            <button
              onClick={() => signOut()}
              className={`hidden text-xs font-medium tracking-[0.1em] transition-colors md:inline-block lg:text-sm ${
                isScrolled ? 'text-slate-700 hover:text-amber-700' : 'text-foreground hover:text-primary'
              }`}
            >
              LOGOUT ({session.user?.role})
            </button>
          ) : (
            <Link
              href="/login"
              className={`hidden text-xs font-medium tracking-[0.1em] transition-colors md:inline-block lg:text-sm ${
                isScrolled ? 'text-slate-700 hover:text-amber-700' : 'text-foreground hover:text-primary'
              }`}
            >
              LOGIN / JOIN
            </Link>
          )}

    {/*
          <button
            className={`flex h-9 w-9 items-center justify-center rounded-full border transition-colors ${
              isScrolled 
                ? 'border-amber-700 text-amber-700 hover:bg-amber-700 hover:text-white' 
                : 'border-primary text-primary hover:bg-primary hover:text-primary-foreground'
            }`}
            aria-label="Search"
          >
           <Search className="h-4 w-4" />
          </button>*/}

          <Link
            href="/book-table"
            className={`hidden rounded-full px-5 py-2 text-xs font-semibold tracking-[0.1em] transition-all hover:opacity-90 hover:shadow-lg md:inline-block lg:text-sm ${
              isScrolled ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white' : 'bg-primary text-primary-foreground'
            }`}
          >
            BOOK NOW
          </Link>

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
                  className="flex items-center justify-between text-sm font-medium tracking-[0.1em] text-foreground"
                >
                  {link.label}
                  {link.hasDropdown && (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
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
                  LOGOUT
                </button>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="text-sm font-medium tracking-[0.1em] text-foreground block"
                >
                  LOGIN / JOIN
                </Link>
              )}
            </li>
            <li>
              <Link
                href="/book-table"
                onClick={() => setMobileOpen(false)}
                className="inline-block rounded-full bg-primary px-5 py-2.5 text-sm font-semibold tracking-[0.1em] text-primary-foreground"
              >
                BOOK NOW
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  )
}
