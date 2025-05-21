"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Share2, MapPin, Bed, Bath, Square, Car, Shield } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PropertyGallery } from "@/components/property-gallery"
import { PropertyContactForm } from "@/components/property-contact-form"
import { SimilarProperties } from "@/components/similar-properties"
import { ScheduleVisitModal } from "@/components/schedule-visit-modal"
import { toast } from "sonner"
import { useQuery } from "@tanstack/react-query"
import { PropertySkeleton } from "./property-skeleton"

import sanitizeHtml from 'sanitize-html';
import type { Property } from "@/types/Property"

const infrastructureLabelsMap = {
  "hasBarbecue": 'Churrasqueira',
  "hasPool": 'Piscina',
  "hasPartyRoom": 'Salão de festa',
  "has24hPorter": 'Portaria 24 horas',
  "hasGourmetArea": 'Área Gourmet',
  "hasPlayground": 'Playground',
  "hasGym": 'Academia',
  "hasGarden": 'Jardim',
  "hasCourt": 'Quadra',
  "hasAirConditioning": 'Ar-condicionado',
  "hasCustomFurniture": 'Móveis personalizados',
  "hasBalcony": 'Varanda',
  "hasOffice": 'Escritório',
  "hasSolarEnergy": 'Energia Solar',
  "hasElevator": 'Elevador',
}

export default function PropertyDetailPage() {
  const params = useParams()
  const { code } = params
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false)
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null)

  const openScheduleModal = () => {
    setIsScheduleModalOpen(true)
  }

  const closeScheduleModal = () => {
    setIsScheduleModalOpen(false)
  }

  const { data: property, isLoading, error } = useQuery<Property>({
    queryKey: ['property', code],
    queryFn: async () => {
      const res = await fetch(`/api/property/${code}`)
      if (!res.ok) throw new Error('Erro ao buscar imóvel')
      const data = await res.json()
      return data
    }
  })

  const safeDescription = sanitizeHtml(property?.description ?? '', {
    allowedTags: ['p', 'strong', 'em', 'ul', 'ol', 'li', 'br', 'a'],
    allowedAttributes: {
      a: ['href', 'target'],
    },
  });

  const propertyType: Record<Property['propertyType'], string> = {
    'house': 'Casa',
    'lot': 'Loteamento',
    'apartment': 'Apartamento',
    'commercial': 'Comercial'
  }

  const address = `${property?.street}, ${property?.number} - ${property?.neighborhood}, ${property?.city} - ${property?.state}`;

  const embedUrl = coords
    ? `https://www.google.com/maps?q=${coords.lat},${coords.lng}&output=embed`
    : `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`

  useEffect(() => {
    if (!property) return;

    const fetchCoords = async () => {
      try {
        const res = await fetch('/api/property/get-coords-by-address', {
          method: 'POST',
          body: JSON.stringify({
            address,
          })
        });
        const data = await res.json();

        setCoords({ lat: data.lat, lng: data.lng })
      } catch (err) {
        console.error('Erro ao obter coordenadas:', err);
      }
    };

    fetchCoords();
  }, [property]);

  if (error) {
    toast.error(error.name, {
      description: error.message
    })
  }

  if (isLoading) {
    return (
      <PropertySkeleton />
    )
  }

  if (!property) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold mb-4">Imóvel não encontrado</h1>
        <p className="text-muted-foreground mb-6">O imóvel que você está procurando não existe ou foi removido.</p>
        <Link href="/imoveis">
          <Button>Voltar para listagem</Button>
        </Link>
      </div>
    )
  }

  const infrastructureLabels = Object.entries(infrastructureLabelsMap).filter(([key]) => property.infrastructure ? property.infrastructure[key] : []).map(([, label]) => label)

  return (
    <main className="min-h-screen pb-16">
      <PropertyGallery media={property.image.map(file => ({ type: file.type as "image" | "video", url: file.url }))} title={property.title} />

      <div className="container mx-auto px-4 mt-4 relative z-10">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-background rounded-xl shadow-xl p-4 sm:p-6 md:p-8 mb-8"
        >
          <div className="flex flex-wrap justify-between items-center mb-6">
            <Link href="/imoveis" className="flex items-center text-muted-foreground hover:text-foreground">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para listagem
            </Link>
            <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
              {/* <Button variant="outline" size="sm" className="flex items-center" onClick={openScheduleModal}>
                <Calendar className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Agendar visita</span>
                <span className="sm:hidden">Agendar</span>
              </Button> */}
              <Button variant="outline" size="sm" className="flex items-center" onClick={async () => {
                await navigator.clipboard.writeText(window.location.href)
                toast.success('Tudo certo!', {
                  description: 'O link de compartilhamento copiado para área de transferência.',
                  duration: 2000
                })
              }}>
                <Share2 className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Compartilhar</span>
              </Button>
              {/* <Button variant="outline" size="sm" className="flex items-center">
                <Heart className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Favoritar</span>
              </Button> */}
            </div>
          </div>

          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">{property.title}</h1>
            <div className="flex items-center text-muted-foreground mb-4">
              <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
              <span className="text-sm sm:text-base">{property.neighborhood}</span>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-primary">
              {property.salePrice?.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 p-3 sm:p-4 bg-muted/30 rounded-lg mb-6 sm:mb-8">
            <div className="flex flex-col items-center text-center">
              <Bed className="h-5 w-5 sm:h-6 sm:w-6 text-primary mb-1 sm:mb-2" />
              <span className="text-xs sm:text-sm text-muted-foreground">Quartos</span>
              <span className="font-bold">{property.numberOfBedrooms}</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <Bath className="h-5 w-5 sm:h-6 sm:w-6 text-primary mb-1 sm:mb-2" />
              <span className="text-xs sm:text-sm text-muted-foreground">Banheiros</span>
              <span className="font-bold">{property.numberOfBathrooms}</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <Square className="h-5 w-5 sm:h-6 sm:w-6 text-primary mb-1 sm:mb-2" />
              <span className="text-xs sm:text-sm text-muted-foreground">Área</span>
              <span className="font-bold">{property.totalArea} m²</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <Car className="h-5 w-5 sm:h-6 sm:w-6 text-primary mb-1 sm:mb-2" />
              <span className="text-xs sm:text-sm text-muted-foreground">Vagas</span>
              <span className="font-bold">{property.numberOfParkingSpots}</span>
            </div>
          </div>

          <div className="mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Descrição</h2>
            <div
              className="text-sm sm:text-base text-muted-foreground leading-relaxed"
              dangerouslySetInnerHTML={{ __html: safeDescription }}
            />
          </div>

          <div className="mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Características e diferenciais</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
              {infrastructureLabels.map((value, index) => (
                <motion.div
                  key={value + index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                  className="flex items-center p-2 sm:p-3 bg-muted/30 rounded-lg"
                >
                  <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-primary mr-2 sm:mr-3 flex-shrink-0" />
                  <span className="text-sm sm:text-base">{value}</span>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Informações Adicionais</h2>
              <ul className="space-y-2 sm:space-y-3">
                <li className="flex justify-between p-2 sm:p-3 bg-muted/30 rounded-lg">
                  <span className="text-sm sm:text-base text-muted-foreground">Tipo de Imóvel</span>
                  <span className="text-sm sm:text-base font-medium capitalize">{propertyType[property.propertyType]}</span>
                </li>
                <li className="flex justify-between p-2 sm:p-3 bg-muted/30 rounded-lg">
                  <span className="text-sm sm:text-base text-muted-foreground">Ano de Construção</span>
                  <span className="text-sm sm:text-base font-medium">{property.constructionYear}</span>
                </li>
                <li className="flex justify-between p-2 sm:p-3 bg-muted/30 rounded-lg">
                  <span className="text-sm sm:text-base text-muted-foreground">Área do Terreno</span>
                  <span className="text-sm sm:text-base font-medium">{property.totalArea} m²</span>
                </li>
                <li className="flex justify-between p-2 sm:p-3 bg-muted/30 rounded-lg">
                  <span className="text-sm sm:text-base text-muted-foreground">Área Construída</span>
                  <span className="text-sm sm:text-base font-medium">{property.builtArea} m²</span>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Localização</h2>
              <div className="h-[200px] sm:h-[250px] bg-muted rounded-lg overflow-hidden">
                <iframe
                  className="w-full h-full"
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  src={embedUrl}>
                </iframe>
              </div>
            </div>
          </div>

          <PropertyContactForm propertyTitle={property.title} propertyCode={property.code} />
        </motion.div>
      </div>

      <div className="container mx-auto px-4 mt-8 sm:mt-16">
        <h2 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8">Imóveis Similares</h2>
        <SimilarProperties currentPropertyId={property.id} propertyType={property.propertyType} />
      </div>

      <ScheduleVisitModal isOpen={isScheduleModalOpen} onClose={closeScheduleModal} propertyTitle={property.title} />
    </main>
  )
}
