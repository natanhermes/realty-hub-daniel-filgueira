"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "bg-darkBlue backdrop-blur-md shadow-sm" : "bg-transparent",
      )}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href={'/'}>
            <p className="text-whiteIce font-bombalurina text-5xl md:text-7xl font-medium">Daniel Filgueira</p>
          </Link>

          <nav className="hidden xl:flex items-center space-x-8">
            <NavLink href="/#property-highlight">Imóveis em Destaque</NavLink>
            <NavLink href="/#property-location">Localidades</NavLink>
            <NavLink href="/#about-agent">Sobre o Corretor</NavLink>
            <NavLink href="/#about-agency">Sobre a Imobiliária</NavLink>
            <Button className="bg-darkBlue hover:bg-darkBlue/90 text-whiteIce">Contato</Button>
          </nav>

          <button className={cn("xl:hidden text-whiteIce")} onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="xl:hidden bg-whiteIce">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <MobileNavLink href="/#property-highlight" onClick={() => setIsOpen(false)}>
              Imóveis em Destaque
            </MobileNavLink>
            <MobileNavLink href="/#property-location" onClick={() => setIsOpen(false)}>
              Localidades
            </MobileNavLink>
            <MobileNavLink href="/#about-agent" onClick={() => setIsOpen(false)}>
              Sobre o Corretor
            </MobileNavLink>
            <MobileNavLink href="/#about-agency" onClick={() => setIsOpen(false)}>
              Sobre a Imobiliária
            </MobileNavLink>
            <Button className="bg-darkBlue hover:bg-darkBlue/90 text-white w-full">Contato</Button>
          </div>
        </div>
      )}
    </header>
  )
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="text-whiteIce hover:text-leadGray font-medium transition-colors">
      {children}
    </Link>
  )
}

function MobileNavLink({
  href,
  onClick,
  children,
}: {
  href: string
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className="text-darkBlue hover:text-leadGray font-medium py-2 transition-colors"
      onClick={onClick}
    >
      {children}
    </Link>
  )
}
