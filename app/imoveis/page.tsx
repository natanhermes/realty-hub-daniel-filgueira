"use client"

import { useEffect, useState } from "react"
import { Filter } from "lucide-react"
import { PropertyGrid } from "@/components/property-grid"
import { FilterSidebar } from "@/components/filter-sidebar"
import { Button } from "@/components/ui/button"
import { Footer } from "@/components/footer"
import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { useForm, useWatch } from "react-hook-form"
import type { Property, PropertyFilters } from "@/types/Property"
import { debounce } from "lodash"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { useMobile } from "@/hooks/use-mobile"

const slides = [
  { id: 1, image: "https://ywqqqbg9btxv4mxt.public.blob.vercel-storage.com/static/arena-das-dunas-s3do8q6Zw3cipXA9eCbl165qx4xez4.jpg", alt: "Estádio Arena das Dunas - Natal/RN" },
  { id: 2, image: "https://ywqqqbg9btxv4mxt.public.blob.vercel-storage.com/static/morro-do-careca-7ut2fv3VRStPJsC6fBFL2g48KOsnov.png", alt: "Morro do careca - Praia de Ponta Negra" },
  { id: 3, image: "https://ywqqqbg9btxv4mxt.public.blob.vercel-storage.com/static/praia-da-pipa-WLgnmNfsqcS9bIVHQ4CKo85k1zwAsM.jpg", alt: "Falésias da praia de pipa" },
  { id: 4, image: "https://ywqqqbg9btxv4mxt.public.blob.vercel-storage.com/static/sao-miguel-jfVBJ7bPZ4VcNnPo1vgTrbOkrbyVDV.png", alt: "Falésias da praia de pipa" },
]

interface PaginationParams {
  page: number
  limit: number
}

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [pagination, setPagination] = useState<PaginationParams>({ page: 1, limit: 10 })

  const isMobile = useMobile()

  const form = useForm<PropertyFilters>({
    defaultValues: {
      query: '',
      purpose: '',
      propertyType: '',
      minPrice: '',
      maxPrice: '',
      minArea: '',
      bedrooms: '',
      neighborhood: '',
      page: 1
    }
  })

  const filters = useWatch({ control: form.control })

  const { mutateAsync: fetchProperties, isPending: isFetchingProperties } = useMutation({
    mutationFn: async ({ filters, pagination }: { filters: PropertyFilters, pagination: PaginationParams }) => {
      const fetchPromise = (async () => {
        const response = await fetch('/api/properties', {
          method: 'POST',
          body: JSON.stringify({ filters, pagination })
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.statusText || 'Erro ao buscar imóveis')
        }

        return data
      })()

      toast.promise(fetchPromise, {
        loading: 'Buscando imóveis...',
        error: (e) => e.message
      })

      const result = await fetchPromise

      setProperties(result.items)
    }
  })

  useEffect(() => {
    const debounced = debounce(
      (filters: PropertyFilters, pagination: PaginationParams) => {
        fetchProperties({ filters, pagination })
      },
      500
    )

    debounced(filters, pagination)

    return () => {
      debounced.cancel()
    }
  }, [filters, pagination, fetchProperties])

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }))
  }

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen)
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <HeroSection
          slides={slides}
          title={
            <>
              <p>Encontre o lar dos</p>
              <p>seus sonhos com facilidade.</p>
            </>
          }
          subtitle="Use nossos filtros para personalizar sua busca e descubra o imóvel perfeito para você!"
        />

        <div className="container mx-auto px-4 py-8 relative">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl md:text-4xl font-bold text-lightGold">Nossos Imóveis</h1>
            <Button onClick={toggleFilter} variant="outline" className="text-darkBlue flex items-center gap-2">
              <Filter className="h-4 w-4" />
              {!isMobile && <span>Filtros</span>}
            </Button>
          </div>

          <div className="flex">
            <FilterSidebar form={form} isOpen={isFilterOpen} onClose={toggleFilter} />

            {isFetchingProperties ? (
              <div className="h-[40vh] w-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="w-full">
                <PropertyGrid properties={properties} />
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
