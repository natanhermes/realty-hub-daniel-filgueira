import { PropertyFilters } from "@/types/Property";
import { PropertyService } from "../services/propertyService";

export async function fetchInitialProperties() {
  const emptyFilters: PropertyFilters = {
    query: '',
    purpose: '',
    propertyType: '',
    minPrice: '',
    maxPrice: '',
    minArea: '',
    bedrooms: '',
    neighborhood: ''
  }

  try {
    return await PropertyService.listPropertiesByFilters(emptyFilters)
  } catch (error) {
    console.error('Erro ao buscar propriedades iniciais:', error)
    return { items: [], total: 0, totalPages: 0 }
  }
}
