import db from "@/lib/db";
import { Property, PropertyFilters } from "@/types/Property";

interface PaginatedResponse {
  items: Property[];
  total: number;
  totalPages: number;
  currentPage: number;
}

export class PropertyService {
  static async listProperties() {
    const properties = await db.property.findMany({
      include: {
        image: true,
        infrastructure: true,
      },
    });
    return properties;
  }

  static async listPropertiesByFilters(filters: PropertyFilters): Promise<PaginatedResponse> {
    const itemsPerPage = 10;
    const page = filters.page || 1;
    const skip = (page - 1) * itemsPerPage;

    const where: any = {};

    if (filters.query) {
      where.OR = [
        {
          title: {
            contains: filters.query,
            mode: 'insensitive'
          }
        },
        {
          neighborhood: {
            contains: filters.query,
            mode: 'insensitive'
          }
        },
        {
          code: {
            contains: filters.query,
            mode: 'insensitive'
          }
        }
      ];
    }

    if (filters.purpose) {
      where.purpose = filters.purpose;
    }

    if (filters.propertyType) {
      where.propertyType = filters.propertyType;
    }

    if (filters.minPrice) {
      where.OR = [
        {
          AND: [
            { salePrice: { not: 0 } },
            { salePrice: { not: null } },
            { salePrice: { gte: parseFloat(filters.minPrice) } }
          ]
        },
        {
          AND: [
            { rentalPrice: { not: 0 } },
            { rentalPrice: { not: null } },
            { rentalPrice: { gte: parseFloat(filters.minPrice) } }
          ]
        },
        {
          AND: [
            { dailyPrice: { not: 0 } },
            { dailyPrice: { not: null } },
            { dailyPrice: { gte: parseFloat(filters.minPrice) } }
          ]
        }
      ];
    }

    if (filters.maxPrice) {
      where.AND = [
        {
          OR: [
            { salePrice: 0 },
            { salePrice: null },
            { salePrice: { lte: parseFloat(filters.maxPrice) } }
          ]
        },
        {
          OR: [
            { rentalPrice: 0 },
            { rentalPrice: null },
            { rentalPrice: { lte: parseFloat(filters.maxPrice) } }
          ]
        },
        {
          OR: [
            { dailyPrice: 0 },
            { dailyPrice: null },
            { dailyPrice: { lte: parseFloat(filters.maxPrice) } }
          ]
        }
      ];
    }

    if (filters.minArea) {
      where.AND = [
        {
          totalArea: {
            gte: parseFloat(filters.minArea)
          }
        }
      ];
    }

    if (filters.bedrooms) {
      where.AND = [
        {
          numberOfBedrooms: {
            gte: parseInt(filters.bedrooms)
          }
        }
      ];
    }

    const [items, total] = await Promise.all([
      db.property.findMany({
        where: {
          ...where,
          active: true
        },
        skip,
        take: itemsPerPage,
        include: {
          image: true,
          infrastructure: true,
        }
      }),
      db.property.count({ where: { ...where, active: true } })
    ]);

    return {
      items,
      total,
      totalPages: Math.ceil(total / itemsPerPage),
      currentPage: page
    };
  }

  static async getPropertyByCode(code: string): Promise<Property | null> {
    const property = await db.property.findUnique({
      where: { code },
      include: {
        image: true,
        infrastructure: true,
      },
    }) as Property | null;
    return property;
  }
}
