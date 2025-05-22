"use client"

import React, { useState, useEffect } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import Link from "next/link"
import { Award, Users, Search, Shield } from "lucide-react"
import { Card, CardContent } from "./ui/card"

interface HeroSectionProps {
  slides: { id: number, image: string; alt: string }[]
  title: React.ReactNode;
  subtitle: React.ReactNode;
  showButton?: boolean
  isHomepage?: boolean
}

const features = [
  {
    icon: <Shield className="h-10 w-10 text-darkBlue" />,
    title: "Os melhores imóveis para você",
    description: "Na Filgueira Imobiliária, oferecemos uma seleção criteriosa de apartamentos, casas, salas comerciais e terrenos. Nossa equipe está pronta para auxiliá-lo na escolha do imóvel ideal. Entre em contato e agende uma visita.",
  },
  {
    icon: <Award className="h-10 w-10 text-darkBlue" />,
    title: "Assessoria completa na sua escolha",
    description: "Desde a definição da localização até os detalhes do imóvel, garantimos um acompanhamento especializado para que você tome a melhor decisão com segurança e tranquilidade.",
  },
  {
    icon: <Users className="h-10 w-10 text-darkBlue" />,
    title: "Atendimento Personalizado",
    description: "Cada cliente recebe um atendimento exclusivo, adaptado às suas necessidades.",
  },
]

export function HeroSection({ slides, title, subtitle, showButton, isHomepage }: HeroSectionProps) {
  const [currentSlide, setCurrentSlide] = useState(0)

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [slides.length])

  return (
    <section className="w-full" id="imoveis-destaque" >
      <div className="relative h-[75vh] md:h-[65vh] w-full overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
          >
            <Image src={slide.image || "/placeholder.svg"} alt={slide.alt} fill className="object-cover grayscale" />
            <div className="absolute inset-0 bg-black/40" />
          </div>
        ))}

        <div className="relative z-10 flex h-full items-center ">
          <div className="container px-4 mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className=" max-w-4xl"
            >
              <div className="mb-6 text-xl font-bold text-whiteIce md:text-5xl lg:text-6xl flex flex-col">
                {title}
              </div>
              <p className="mb-8 text-lg text-white/90 md:text-2xl">{subtitle}</p>
              {showButton && (
                <Link
                  href="/imoveis"
                  className="inline-flex gap-2 bg-darkBlue hover:bg-darkBlue/90 text-whiteIce items-center p-4 rounded-full"
                >
                  <p className="font-bold text-sm">VER IMÓVEIS</p>
                  <Search className="h-4 w-4 font-bold" />
                </Link>
              )}
            </motion.div>
          </div>
        </div>

        {/* Slide indicators */}
        <div className="absolute bottom-8 left-0 right-0 z-10 flex justify-center space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`h-2 w-12 rounded-full transition-all ${index === currentSlide ? "bg-white" : "bg-white/40"}`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </div>
      {isHomepage && (
        <div className="px-4 md:px-20 py-6">
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-20"
          >
            {features.map((feature, index) => (
              <motion.div key={index} variants={item}>
                <Card className="h-full border-none bg-whiteIce shadow-md hover:shadow-lg transition-shadow">
                  <CardContent className="md:px-6 flex flex-col items-center text-center">
                    <div className="mb-4 p-3 rounded-full bg-gray-200">{feature.icon}</div>
                    <h3 className="text-base md:text-lg font-bold mb-2 text-darkBlue">{feature.title}</h3>
                    <p className="text-sm md:text-base text-leadGray italic">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      )}
    </section>
  )
}
