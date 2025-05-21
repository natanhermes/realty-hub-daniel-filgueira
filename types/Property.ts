import { image, infrastructure, property } from "@prisma/client";

export type Property = property & {
  image: image[]
  infrastructure: infrastructure & { [key: string]: boolean } | null
}

export type PropertyFilters = {
  currentPropertyId?: string
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

export type PropertyFeatures = Omit<property & { infrastructure: infrastructure | null, images: image[] }, "id" | "createdAt" | "updatedAt">

export type NumericFields = {
  salePrice: string | null
  rentalPrice: string | null
  dailyPrice: string | null
  condominiumFee: string | null
  iptuValue: string | null
  totalArea: string | null
  builtArea: string | null
  numberOfBedrooms: string | null
  numberOfSuites: string | null
  numberOfBathrooms: string | null
  numberOfParkingSpots: string | null
  constructionYear: string | null
  floor: string | null
}

export type BooleanFields = {
  acceptsFinancing: string | null
  acceptsExchange: string | null
}
