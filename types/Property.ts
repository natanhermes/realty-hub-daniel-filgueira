import { image, infrastructure, property } from "@prisma/client";

export type Property = property & {
  image: image[]
  infrastructure: infrastructure | null
}

export type PropertyFilters = {
  query?: string
  purpose?: string
  propertyType?: string
  minPrice?: string
  maxPrice?: string
  minArea?: string
  bedrooms?: string
  neighborhood?: string
  page?: number
}

