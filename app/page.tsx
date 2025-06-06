'use client'

import { HeroSection } from "@/components/hero-section"
import { FeaturedProperties } from "@/components/featured-properties"
import { PropertiesByLocation } from "@/components/properties-by-location"
import { AboutAgent } from "@/components/about-agent"
import { AboutAgency } from "@/components/about-agency"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { useEffect, useRef } from "react"
import { FloatingButton } from "@/components/floating-button"

const slides = [
  {
    id: 1,
    image: "https://ywqqqbg9btxv4mxt.public.blob.vercel-storage.com/static/background-d9tpoZUCEFFzGW8Yz4RPlSAnejuPmo.jpg",
    alt: "",
  },
  {
    id: 2,
    image: "https://ywqqqbg9btxv4mxt.public.blob.vercel-storage.com/static/apartament-por-do-sol-jA0Cm4s02LiGtaRk31rQufEXycMw4f.jpg",
    alt: "",
  },
  {
    id: 3,
    image: "https://ywqqqbg9btxv4mxt.public.blob.vercel-storage.com/static/apartamento-sala-escada-BqWqPpiqpZclpJpur7QF5tl7XW66nJ.jpg",
    alt: "",
  },
]

export default function Home() {
  const propertyHighlightRef = useRef<HTMLDivElement>(null);
  const propertyByLocationRef = useRef<HTMLDivElement>(null);
  const aboutAgentRef = useRef<HTMLDivElement>(null);
  const aboutAgencyRef = useRef<HTMLDivElement>(null);

  const handleHashScroll = () => {
    const hash = window.location.hash;

    const targets: Record<string, React.RefObject<HTMLDivElement | null>> = {
      '#property-highlight': propertyHighlightRef,
      '#property-location': propertyByLocationRef,
      '#about-agent': aboutAgentRef,
      '#about-agency': aboutAgencyRef,
    };

    const targetRef = targets[hash];
    targetRef?.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    handleHashScroll()
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <FloatingButton onClick={() => window.open(`https://wa.me/558496703029?text=Olá! Estou vindo do site. Sou cliente e gostaria de mais informações.`, '_blank')} />
      <Navbar />
      <main>
        <HeroSection
          slides={slides}
          title={
            <>
              <p>Seu novo lar está</p>
              <p>a um clique de distância.</p>
            </>
          }
          subtitle="Temos o imóvel perfeito para você, sem complicação!"
          showButton
          isHomepage
        />
        <FeaturedProperties ref={propertyHighlightRef} />
        <PropertiesByLocation ref={propertyByLocationRef} />
        <AboutAgent ref={aboutAgentRef} />
        <AboutAgency ref={aboutAgencyRef} />
      </main>
      <Footer />
    </div>
  )
}
