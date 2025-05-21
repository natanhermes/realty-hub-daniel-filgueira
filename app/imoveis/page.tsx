"use client"

import { useCallback, useEffect, useState } from "react"
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

const slides = [
  {
    id: 1,
    image: "/assets/arena-das-dunas.jpg?height=1080&width=1920",
    alt: "Estádio Arena das Dunas - Natal/RN",
  },
  {
    id: 2,
    image: "/assets/morro-do-careca.png?height=1080&width=1920",
    alt: "Morro do careca - Praia de Ponta Negra",
  },
  {
    id: 3,
    image: "/assets/praia-da-pipa.jpg?height=1080&width=1920",
    alt: "Falésias da praia de pipa",
  },
  {
    id: 4,
    image: "/assets/sao-miguel.png?height=1080&width=1920",
    alt: "Falésias da praia de pipa",
  },
]

interface PaginationParams {
  page: number
  limit: number
}

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [pagination, setPagination] = useState<PaginationParams>({
    page: 1,
    limit: 10
  })
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

  const filters = useWatch({
    control: form.control
  })

  const { mutateAsync: fetchProperties, isPending: isFetchingProperties } = useMutation({
    mutationFn: async ({ filters, pagination }: { filters: PropertyFilters, pagination: PaginationParams }) => {
      const fetchPropertiesPromise = (async () => {
        const response = await fetch('/api/properties', {
          method: 'POST',
          body: JSON.stringify({ filters, pagination })
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.statusText || 'Erro ao criar imóvel');
        }

        return data;
      })();

      toast.promise(fetchPropertiesPromise, {
        loading: 'Buscando imóveis...',
        error: e => e
      })

      const responseData = await fetchPropertiesPromise

      setProperties(responseData.items)
    }
  });

  const debouncedFetch = useCallback(
    debounce((filters: PropertyFilters, pagination: PaginationParams) => {
      fetchProperties({ filters, pagination })
    }, 500),
    [fetchProperties]
  )

  useEffect(() => {
    debouncedFetch(filters, pagination)
    return () => {
      debouncedFetch.cancel()
    }
  }, [filters, pagination, debouncedFetch])

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }))
  }

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen)
  }

  return (
    <div className="min-h-screen ">
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
            <h1 className="text-3xl font-bold">Nossos Imóveis</h1>
            <Button onClick={toggleFilter} variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filtros
            </Button>
          </div>

          <div className="flex">
            <FilterSidebar
              form={form}
              isOpen={isFilterOpen}
              onClose={toggleFilter}
            />

            {isFetchingProperties ? (
              <div className="h-[40vh] w-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : (
              <>
                <div className="w-full">
                  <PropertyGrid properties={properties} />
                </div>
              </>
            )}
          </div>
        </div >
      </main >
      <Footer />
    </div >
  )
}
