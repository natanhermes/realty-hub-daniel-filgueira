'use client'

import { DropdownMenu, DropdownMenuLabel, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuItem } from '@/components/ui/dropdown-menu'
import logo from '../app/assets/logo-white.png'
import wppIcon from '../app/assets/wpp.svg'
import Image from 'next/image'
import { LucideLoader2, MenuIcon } from 'lucide-react'
import { useForm, useWatch } from 'react-hook-form'
import { PropertyCard } from '@/components/property-card'
import { PropertyFilters, Property } from '@/types/Property'
import { FormFilterProperty } from '@/components/form-filter-property'
import { useEffect, useState, useCallback } from 'react'
import { debounce } from 'lodash'
import { PaginationComponent } from './pagination-component'
import { Button } from './ui/button'

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

export function SearchClientLayout({ initialData }: { initialData?: PropertyResponse }) {
  const [properties, setProperties] = useState<Property[]>([])
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

  return (
    <main className="relative min-h-screen">
      <div className="relative h-[60vh] flex items-end pb-4 justify-center">
        <div className="absolute inset-0 bg-black/40 z-10" />
        <div className="absolute inset-0">
          <Image
            src={backgroundImage}
            alt="Background"
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="relative z-10">
          <FormFilterProperty form={form} />
        </div>
      </div>

      {isLoading ? (
        <div className='flex justify-center items-center h-[50vh] w-2/4 mx-auto'>
          <LucideLoader2 className='animate-spin text-gray-500' />
        </div>
      ) : properties.length > 0 ? (
        <>
          <section className=' flex md:mx-10 lg:mx-auto flex-wrap items-center justify-center md:justify-evenly p-4 gap-4'>
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </section>
          <PaginationComponent totalPages={totalPages} currentPage={pagination.page} onPageChange={handlePageChange} />
        </>
      ) : (
        <div className='flex justify-center items-center h-[50vh] w-2/4 mx-auto'>
          <p className='text-gray-500'>Nenhum imóvel encontrado para este filtro.</p>
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
            onClick={() => window.open('https://wa.me/5584998128418?text=Olá! Estou procurando um imóvel e gostaria de ajuda para encontrar a opção ideal para mim.', '_blank')}
          >
            Entre em contato
            <Image src={wppIcon} alt="WhatsApp" className='w-4 h-4 ml-2' />
          </Button>
        </div>
      </section>
    </main>
  )
}
