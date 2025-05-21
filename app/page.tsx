'use client'

import { HeroSection } from "@/components/hero-section"
import { FeaturedProperties } from "@/components/featured-properties"
import { PropertiesByLocation } from "@/components/properties-by-location"
import { AboutAgent } from "@/components/about-agent"
import { AboutAgency } from "@/components/about-agency"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { useEffect, useRef } from "react"

const slides = [
  {
    id: 1,
    image: "/assets/background.jpg",
    alt: "",
  },
  {
    id: 2,
    image: "/assets/apartament-por-do-sol.jpg",
    alt: "",
  },
  {
    id: 3,
    image: "/assets/apartamento-sala-escada.jpg",
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
