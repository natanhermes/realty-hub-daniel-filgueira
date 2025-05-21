"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { PropertyCard } from "@/components/property-card"
import { useMutation } from "@tanstack/react-query"
import type { Property } from "@/types/Property"

interface SimilarPropertiesProps {
  currentPropertyId: string
  propertyType: string
}

export function SimilarProperties({ currentPropertyId, propertyType }: SimilarPropertiesProps) {
  const [similarProperties, setSimilarProperties] = useState<any[]>([])

  const { mutateAsync: fetchProperties, isPending: isFetchingProperties } = useMutation({
    mutationFn: async ({ filters }: {
      filters: {
        propertyType?: string
        currentPropertyId?: string
      }
    }) => {
      const fetchPropertiesPromise = (async () => {
        const response = await fetch('/api/properties', {
          method: 'POST',
          body: JSON.stringify({ filters, itemsPerPage: 3 })
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.statusText || 'Erro ao criar imóvel');
        }

        return data;
      })();

      const responseData = await fetchPropertiesPromise

      setSimilarProperties(responseData.items)
    }
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchProperties({ filters: { propertyType, currentPropertyId } })
      } catch (error) {
        console.error("Erro ao buscar imóveis similares:", error)
      }
    }

    fetchData()
  }, [propertyType])

  if (similarProperties.length === 0) {
    return null
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
      {similarProperties.map((property, index) => (
        <motion.div
          key={property.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
        >
          <PropertyCard property={property} navigationUrl={`/imoveis/${property.code}`} />
        </motion.div>
      ))}
    </div>
  )
}
