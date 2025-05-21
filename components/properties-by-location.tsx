"use client"

import { forwardRef, useState } from "react"
import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import type { Property } from "@/types/Property"
import { PropertyCard } from "./property-card"

const locations = [
  { id: "Lagoa Nova", name: "Lagoa Nova" },
  { id: "Ponta Negra", name: "Ponta Negra" },
  { id: "Zona Norte", name: "Zona Norte" },
  { id: "Nova Parnamirim", name: "Nova Parnamirim" },
]

export const PropertiesByLocation = forwardRef<HTMLDivElement>((_, ref) => {
  const [activeTab, setActiveTab] = useState("Lagoa Nova")

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const { data: propertiesByLocation, isLoading } = useQuery<Property[]>({
    queryKey: ['properties-by-location', activeTab],
    queryFn: () => fetch(`/api/properties/by-locations?location=${activeTab}`).then(res => res.json()),
  })

  const ListProperties = () => {
    if (isLoading) {
      return (
        <div className="flex h-96 items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      )
    }

    return (
      locations.map((location) => (
        <TabsContent key={location.id} value={location.id}>
          <Link href="/imoveis" className="inline-flex justify-end pb-2 w-full text-gray-900 font-medium hover:underline">
            Ver todos os imóveis <ArrowRight size={16} className="ml-1" />
          </Link>
          <motion.div
            key={activeTab}
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {propertiesByLocation?.map((property) => {
              return (
                <PropertyCard key={property.code} property={property} navigationUrl={`/imoveis/${property.code}`} />
              )
            })}
          </motion.div>
        </TabsContent>
      ))
    )
  }

  return (
    <section id="property-location" ref={ref} className="py-20 bg-white">
      <div className="container px-4 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-lightGold">Imóveis por Localidade</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore nossos imóveis de alto padrão nas melhores localidades do Brasil. Encontre o lugar perfeito para
            você.
          </p>
        </motion.div>

        <Tabs defaultValue="Lagoa Nova" onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
            {locations.map((location) => (
              <TabsTrigger
                key={location.id}
                value={location.id}
                className="data-[state=active]:bg-darkBlue data-[state=active]:text-whiteIce"
              >
                {location.name}
              </TabsTrigger>
            ))}
          </TabsList>
          <ListProperties />
        </Tabs>
      </div>
    </section>
  )
})
