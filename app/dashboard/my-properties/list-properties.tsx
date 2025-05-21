'use client'
import { PropertyCard } from "@/components/property-card";
import type { Property } from "@/types/Property";
import { motion } from "framer-motion";

interface ListPropertiesProps {
  properties: Property[]
}

export function ListProperties({ properties }: ListPropertiesProps) {

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
    >
      {properties?.map((property) => {
        return (
          <motion.div key={property.id} variants={item}>
            <PropertyCard property={property} featured={!!property.highlight} navigationUrl={`/dashboard/my-properties/${property.code}`} />
          </motion.div>
        )
      })}
    </motion.div>
  );
}