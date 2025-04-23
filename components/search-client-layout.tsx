'use client'

import wppIcon from '../app/assets/wpp.svg'
import Image from 'next/image'
import { LucideLoader2 } from 'lucide-react'
import { useForm, useWatch } from 'react-hook-form'
import { PropertyCard } from '@/components/property-card'
import { PropertyFilters, Property } from '@/types/Property'
import { useEffect, useState, useCallback } from 'react'
import { debounce } from 'lodash'
import { PaginationComponent } from './pagination-component'
import { Button } from './ui/button'
import { FiltersDrawer } from './filters-drawer'
import { FloatingButton } from './floating-button'
import { PropertyCardSkeleton } from './propery-card-skeleton'

interface PaginationParams {
  page: number
  limit: number
}

interface PropertyResponse {
  items: Property[]
  total: number
  totalPages: number
}

const backgroundImage = `https://d1jn39u3umq5qg.cloudfront.net/static-images/apartamento-piscina.jpg`

export function SearchClientLayout() {
  const [properties, setProperties] = useState<Property[]>([])
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [pagination, setPagination] = useState<PaginationParams>({
    page: 1,
    limit: 10
  })
  const [totalPages, setTotalPages] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
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
  const backgroundImages = [
    `${process.env.NEXT_PUBLIC_AWS_CLOUDFRONT_URL}/static-images/sao-miguel.png`,
    `${process.env.NEXT_PUBLIC_AWS_CLOUDFRONT_URL}/static-images/praia-da-pipa.jpg`,
    `${process.env.NEXT_PUBLIC_AWS_CLOUDFRONT_URL}/static-images/morro-do-careca.png`,
    `${process.env.NEXT_PUBLIC_AWS_CLOUDFRONT_URL}/static-images/arena-das-dunas.jpg`,
  ];

  const filters = useWatch({
    control: form.control
  })

  const fetchProperties = useCallback(async (filters: PropertyFilters, pagination: PaginationParams) => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/properties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ filters, pagination }),
      })
      const data: PropertyResponse = await response.json()
      setProperties(data.items)
      setTotalPages(data.totalPages)
    } catch (error) {
      console.error('Erro ao buscar propriedades:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const debouncedFetch = useCallback(
    debounce((filters: PropertyFilters, pagination: PaginationParams) => {
      fetchProperties(filters, pagination)
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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === backgroundImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="relative min-h-screen">
      <FloatingButton onClick={() => window.open(`https://wa.me/558496703029?text=Olá! Estou vindo do site. Sou cliente e gostaria de mais informações.`, '_blank')} />
      <div className="relative h-[70vh]">
        <div className="absolute inset-0 bg-black/40 z-10" />

        <div className="absolute inset-0">
          {backgroundImages.map((image, index) => (
            <Image
              key={index}
              src={image}
              alt={`Background ${index + 1}`}
              fill
              className={` transition-opacity grayscale duration-1000 ${currentImageIndex === index ? 'opacity-100' : 'opacity-0'
                }`}
              priority={index === 0}
            />
          ))}
        </div>

        <div className="relative z-20">
          <div className="container mx-auto px-4 md:px-16">
            <div className="flex flex-col items-start justify-center h-[60vh]">
              <div className="font-bold mb-8 max-w-3xl text-whiteIce">
                <div className="flex flex-col text-left text-xl sm:text-4xl lg:text-5xl">
                  <p>Encontre o lar dos</p>
                  <p>seus sonhos com facilidade.</p>
                </div>
                <p className='text-left font-semibold text-xs sm:text-sm md:text-xl lg:text-2xl mt-4 '>Use nossos filtros para personalizar sua busca e descubra o imóvel perfeito para você!</p>
              </div>
              <FiltersDrawer form={form} />
            </div>

          </div>
        </div>

      </div>

      {isLoading ? (
        <section className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:justify-items-center p-4'>
          {Array.from({ length: 4 }).map((_, index) => (
            <PropertyCardSkeleton key={index} />
          ))}
        </section>
      ) : properties.length > 0 ? (
        <section className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 md:justify-items-center p-4'>
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
          <PaginationComponent totalPages={totalPages} currentPage={pagination.page} onPageChange={handlePageChange} />
        </section>
      ) : (
        <div className='flex justify-center items-center h-[50vh] w-full mx-auto'>
          <p className='text-gray-500'>Nenhum imóvel encontrado.</p>
        </div>
      )}


      <section className="w-full mt-4 bg-gray-100">
        <div className="container mx-auto max-w-3xl text-gray-600 text-center py-10 px-4">
          <h1 className="text-xl md:text-2xl font-bold mb-2">
            Não achou o imóvel ideal?
          </h1>
          <p className='text-sm md:text-base'>Não se preocupe, nós vamos te ajudar nisso.</p>
          <p className='text-sm md:text-base'>Nossa equipe vai encontrar a melhor condição para você fechar negócio, além de oferecer consultoria especializada para facilitar seu financiamento e garantir as melhores oportunidades!</p>
          <Button
            className="bg-green-600 hover:bg-green-700 mt-4"
            onClick={() => window.open('https://wa.me/558496703029?text=Olá! Estou procurando um imóvel e gostaria de ajuda para encontrar a opção ideal para mim.', '_blank')}
          >
            Entre em contato
            <Image src={wppIcon} alt="WhatsApp" className='w-4 h-4 ml-2' />
          </Button>
        </div>
      </section>
    </main>
  )
}
