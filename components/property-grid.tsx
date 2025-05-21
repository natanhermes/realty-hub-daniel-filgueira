"use client"

import { motion, AnimatePresence } from "framer-motion"
import { PropertyCard } from "@/components/property-card"
import type { Property } from "@/types/Property"

interface PropertyGridProps {
  properties: Property[]
}

export function PropertyGrid({ properties }: PropertyGridProps) {
  if (properties?.length === 0) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-[40vh] col-span-full flex w-full items-center justify-center py-12">
        <p className="text-xl text-muted-foreground">Nenhum imóvel encontrado com os filtros selecionados.</p>
      </motion.div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <AnimatePresence>
        {properties?.map((property, index) => (
          <motion.div
            key={property.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ delay: index * 0.05, duration: 0.4 }}
          >
            <PropertyCard property={property} navigationUrl={`/imoveis/${property.code}`} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
