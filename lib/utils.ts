import { PropertyValidationError } from "@/app/errors/property-validation-error"
import { BooleanFields, NumericFields, PropertyFeatures } from "@/types/Property"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number) {
  return price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function parseNumericValue<T extends number | null>(value: string | null, parser: (val: string) => number): T {
  return value ? parser(value) as T : null as T
}

export function parseBooleanValue(value: string | null): boolean {
  return value === 'true'
}

export function validateRequiredFields(data: Partial<PropertyFeatures> & NumericFields & BooleanFields) {
  const requiredFields = ['code', 'propertyType', 'purpose', 'neighborhood', 'location'];

  for (const field of requiredFields) {
    if (!data[field as keyof typeof data]) {
      throw new PropertyValidationError(`Campo obrigatório não preenchido: ${field}`);
    }
  }
}

export function validateNumericValues(data: NumericFields) {
  const numericFields = {
    salePrice: 'Preço de venda',
    rentalPrice: 'Preço de aluguel',
    dailyPrice: 'Preço diária',
    totalArea: 'Área total',
    builtArea: 'Área construída',
    numberOfBedrooms: 'Número de quartos',
    numberOfBathrooms: 'Número de banheiros'
  };

  for (const [field, label] of Object.entries(numericFields)) {
    if (data[field as keyof NumericFields] && parseFloat(data[field as keyof NumericFields]!) < 0) {
      throw new PropertyValidationError(`${label} não pode ser negativo`);
    }
  }
}
