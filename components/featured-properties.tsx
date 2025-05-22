"use client"

import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import type { Property } from "@/types/Property"
import Link from "next/link"
import { PropertyCard } from "./property-card"
import { forwardRef } from "react"

export const FeaturedProperties = forwardRef<HTMLDivElement>((_, ref) => {
  const { data: properties, isLoading } = useQuery<Property[]>({
    queryKey: ['properties'],
    queryFn: () => fetch(`/api/properties/highlights`).then(res => res.json()),
  })

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" id="property-highlight" ref={ref}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!properties || properties.length === 0) {
    return (
      <section ref={ref} id="property-highlight" className="py-20 bg-gray-50">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-4xl font-bold mb-4 text-lightGold">Imóveis em destaque</h2>
            <p className="max-w-2xl mx-auto">
              Nenhum imóvel encontrado.
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section ref={ref} id="property-highlight" className="py-20 bg-gray-50">
      <div className="container px-4 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-2xl md:text-4xl font-bold mb-4 text-lightGold">Imóveis em destaque</h2>
          <p className=" max-w-2xl mx-auto">
            Selecionamos os melhores imóveis de alto padrão para você.
          </p>
          <p className=" max-w-2xl mx-auto">
            Conforto, sofisticação e exclusividade em cada detalhe.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {properties.map((property) => {
            return (
              <PropertyCard
                key={property.id}
                property={property}
                featured={!!property.highlight}
                navigationUrl={`/imoveis/${property.code}`}
              />
            )
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center mt-12"
        >
          <Link href="/imoveis" className="inline-flex items-center text-gray-900 font-medium hover:underline">
            Ver todos os imóveis <ArrowRight size={16} className="ml-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
})

FeaturedProperties.displayName = "FeaturedProperties"
