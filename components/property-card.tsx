"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Bath, MapPin, House, BedDouble, ShowerHead, Car } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import type { Property } from "@/types/Property"
import { cn } from "@/lib/utils"

interface PropertyCardProps {
  property: Property
  featured?: boolean
  navigationUrl: string
}

export function PropertyCard({ property, featured = false, navigationUrl }: PropertyCardProps) {
  const imageHighlight = property.image.find(img => img.highlight) || (!!property.image.length && property.image[0])

  const badgePropertyType: Record<Property['propertyType'], string> = {
    'house': 'Casa',
    'lot': 'Loteamento',
    'apartment': 'Apartamento',
    'commercial': 'Comercial'
  }

  return (
    <Link href={`${navigationUrl}`}>
      <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
        <Card className={cn("overflow-hidden h-[520px] border-none shadow-lg", { "opacity-50": !property.active })}>
          <div className="relative h-64 w-full overflow-hidden">
            <Image
              src={imageHighlight ? imageHighlight.url : "/placeholder.svg"}
              alt={property.title}
              fill
              className="object-cover transition-transform duration-500 hover:scale-110"
            />
            {featured && <Badge className="absolute bg-lightGold top-4 left-4 text-whiteIce">Destaque</Badge>}
            <Badge className="absolute top-4 right-4 text-whiteIce">{badgePropertyType[property.propertyType]}</Badge>
          </div>
          <CardContent className="p-6">
            <h3 className="text-xl font-bold mb-2 line-clamp-1">{property.title}</h3>
            <div className="flex items-center text-muted-foreground mb-4">
              <MapPin className="h-4 w-4 mr-1" />
              <span className="text-sm">{property.neighborhood || `${property.city}`}</span>
            </div>
            <div>
              {typeof property.salePrice === 'number' && property.salePrice > 0 && (
                <p className="text-xl font-bold text-primary">
                  {property.salePrice.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })}/venda
                </p>
              )}
              {typeof property.rentalPrice === 'number' && property.rentalPrice > 0 && (
                <p className="text-xl font-bold text-primary">
                  {property.rentalPrice.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })}/aluguel
                </p>
              )}
              {typeof property.dailyPrice === 'number' && property.dailyPrice > 0 && (
                <p className="text-xl font-bold text-primary">
                  {property.dailyPrice.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })}/diária
                </p>
              )}
            </div>
          </CardContent>
          <CardFooter className="px-6 py-4 border-t flex gap-4 flex-wrap">

            <div className='flex items-center gap-1 text-leadGray text-xs'>
              <House size={16} className='text-darkBlue' />
              <span className="text-sm">{property.totalArea} m²</span>
            </div>
            <div className='flex items-center gap-1 text-leadGray text-xs'>
              <BedDouble size={16} className='text-darkBlue' />
              <span className="text-sm">{property.numberOfBedrooms} {property.numberOfBedrooms === 1 ? 'quarto' : 'quartos'}</span>
            </div>
            <div className='flex items-center gap-1 text-leadGray text-xs'>
              <ShowerHead size={16} className='text-darkBlue' />
              <span className="text-sm">{property.numberOfBathrooms} {property.numberOfBathrooms === 1 ? 'banheiro' : 'banheiros'}</span>
            </div>
            <div className='flex items-center gap-1 text-leadGray text-xs'>
              <Bath size={16} className='text-darkBlue' />
              <span className="text-sm">{property.numberOfSuites} {property.numberOfSuites === 1 ? 'suíte' : 'suítes'}</span>
            </div>
            <div className='flex items-center gap-1 text-leadGray text-xs'>
              <Car size={16} className='text-darkBlue' />
              <span className="text-sm">{property.numberOfParkingSpots} {property.numberOfParkingSpots === 1 ? 'vaga' : 'vagas'}</span>
            </div>

          </CardFooter>
        </Card>
      </motion.div>
    </Link>
  )
}
