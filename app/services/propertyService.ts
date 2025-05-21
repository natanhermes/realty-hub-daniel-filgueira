import db from "@/lib/db";
import { BooleanFields, NumericFields, Property, PropertyFeatures, PropertyFilters } from "@/types/Property";
import { PropertyHttpError } from "../errors/property-http-error";
import { PropertyValidationError } from "../errors/property-validation-error";
import { parseBooleanValue, parseNumericValue, validateRequiredFields } from "@/lib/utils";
import { validateNumericValues } from "@/lib/utils";
import { infrastructure } from "@prisma/client";

interface PaginatedResponse {
  items: Property[];
  total: number;
  totalPages: number;
  currentPage: number;
}

const infrastructureFeatures = [
  'hasGym',
  'hasGourmetArea',
  'hasAirConditioning',
  'hasBarbecue',
  'hasOffice',
  'hasSolarEnergy',
  'hasElevator',
  'hasGarden',
  'hasCustomFurniture',
  'hasPool',
  'hasPlayground',
  'has24hPorter',
  'hasCourt',
  'hasPartyRoom',
  'hasBalcony'
];

export class PropertyService {
  static async listProperties() {
    const properties = await db.property.findMany({
      include: {
        image: true,
        infrastructure: true,
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });
    return properties;
  }

  static async listHighlightedProperties() {
    const properties = await db.property.findMany({
      where: {
        highlight: true,
        active: true
      },
      include: {
        image: true,
        infrastructure: true,
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });
    return properties;
  }

  static async listPropertiesByLocations(neighborhood: string) {
    const properties = await db.property.findMany({
      where: {
        active: true,
        neighborhood,
      },
      include: {
        image: true,
        infrastructure: true,
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });

    return properties;
  }

  static async listPropertiesByFilters(filters: PropertyFilters, itemsPerPage: number = 10): Promise<PaginatedResponse> {
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
          id: {
            not: filters.currentPropertyId
          },
          active: true
        },
        skip,
        take: itemsPerPage,
        include: {
          image: true,
          infrastructure: true,
        },
        orderBy: {
          createdAt: 'desc'
        }
      }),
      db.property.count({ where: { ...where, active: true, id: { not: filters.currentPropertyId } } })
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

  static async createOrUpdateProperty(formData: FormData, code?: string, isUpdate?: boolean) {
    try {
      const entries = Array.from(formData.entries());
      const rawData = Object.fromEntries(entries) as unknown as Partial<PropertyFeatures> & NumericFields & BooleanFields;

      validateRequiredFields(rawData);
      validateNumericValues(rawData);

      const propertyFeaturesData = formData.get('propertyFeatures');
      if (!propertyFeaturesData) {
        throw new PropertyHttpError('Características da propriedade não fornecidas', 400);
      }

      const propertyFeatures = JSON.parse(propertyFeaturesData as string);

      const infrastructureData = infrastructureFeatures.reduce((acc, feature) => ({
        ...acc,
        [feature]: propertyFeatures.includes(feature)
      }), {}) as infrastructure;

      if (isUpdate) {
        const property = await db.property.findUnique({
          where: { code },
        })

        if (!property) {
          throw new PropertyHttpError('Imóvel não encontrado', 404);
        }

        await db.property.update({
          where: { code },
          data: {
            code: rawData.code!,
            title: rawData.title!,
            propertyType: rawData.propertyType!,
            purpose: rawData.purpose!,
            salePrice: parseNumericValue(rawData.salePrice, parseFloat),
            rentalPrice: parseNumericValue(rawData.rentalPrice, parseFloat),
            dailyPrice: parseNumericValue(rawData.dailyPrice, parseFloat),
            condominiumFee: parseNumericValue(rawData.condominiumFee, parseFloat),
            iptuValue: parseNumericValue(rawData.iptuValue, parseFloat),
            acceptsFinancing: parseBooleanValue(rawData.acceptsFinancing),
            acceptsExchange: parseBooleanValue(rawData.acceptsExchange),
            totalArea: parseNumericValue(rawData.totalArea, parseFloat),
            builtArea: parseNumericValue(rawData.builtArea, parseFloat),
            numberOfBedrooms: parseNumericValue(rawData.numberOfBedrooms, parseInt),
            numberOfSuites: parseNumericValue(rawData.numberOfSuites, parseInt),
            numberOfBathrooms: parseNumericValue(rawData.numberOfBathrooms, parseInt),
            numberOfParkingSpots: parseNumericValue(rawData.numberOfParkingSpots, parseInt),
            constructionYear: parseNumericValue(rawData.constructionYear, parseInt),
            floor: parseNumericValue(rawData.floor, parseInt),
            neighborhood: rawData.neighborhood,
            state: rawData.state,
            street: rawData.street,
            city: rawData.city,
            cep: rawData.cep,
            number: rawData.number,
            location: rawData.location,
            description: rawData.description,
          }
        }).catch((error) => {
          if (error.code === 'P2002') {
            throw new PropertyHttpError('Já existe um imóvel com este código.', 409);
          }
          throw new PropertyHttpError(`Erro ao atualizar imóvel no banco de dados`, 500);
        });

        await db.infrastructure.update({
          where: { propertyId: property.id },
          data: infrastructureData
        });

        return { success: true, data: property };
      }

      const property = await db.property.create({
        data: {
          code: rawData.code!,
          title: rawData.title!,
          propertyType: rawData.propertyType!,
          purpose: rawData.purpose!,
          salePrice: parseNumericValue(rawData.salePrice, parseFloat),
          rentalPrice: parseNumericValue(rawData.rentalPrice, parseFloat),
          dailyPrice: parseNumericValue(rawData.dailyPrice, parseFloat),
          condominiumFee: parseNumericValue(rawData.condominiumFee, parseFloat),
          iptuValue: parseNumericValue(rawData.iptuValue, parseFloat),
          acceptsFinancing: parseBooleanValue(rawData.acceptsFinancing),
          acceptsExchange: parseBooleanValue(rawData.acceptsExchange),
          totalArea: parseNumericValue(rawData.totalArea, parseFloat),
          builtArea: parseNumericValue(rawData.builtArea, parseFloat),
          numberOfBedrooms: parseNumericValue(rawData.numberOfBedrooms, parseInt),
          numberOfSuites: parseNumericValue(rawData.numberOfSuites, parseInt),
          numberOfBathrooms: parseNumericValue(rawData.numberOfBathrooms, parseInt),
          numberOfParkingSpots: parseNumericValue(rawData.numberOfParkingSpots, parseInt),
          constructionYear: parseNumericValue(rawData.constructionYear, parseInt),
          floor: parseNumericValue(rawData.floor, parseInt),
          neighborhood: rawData.neighborhood!,
          state: rawData.state!,
          cep: rawData.cep!,
          city: rawData.city!,
          number: rawData.number!,
          street: rawData.street!,
          location: rawData.location,
          description: rawData.description,
          active: true
        }
      }).catch((error) => {
        if (error.code === 'P2002') {
          throw new PropertyHttpError('Já existe um imóvel com este código.', 409);
        }
        throw new PropertyHttpError(`Erro ao criar imóvel no banco de dados.`, 500);
      });

      try {
        await db.infrastructure.create({
          data: {
            ...infrastructureData,
            propertyId: property.id
          }
        });
        return { success: true, data: property };
      } catch (_) {
        throw new PropertyHttpError('Erro ao processar infraestrutura', 500);
      }
    } catch (error) {
      console.error('Erro ao criar propriedade:', error);

      let errorMessage = 'Ocorreu um erro ao criar a propriedade. Por favor, tente novamente.';
      let statusCode = 500;

      if (error instanceof PropertyHttpError) {
        errorMessage = error.message;
        statusCode = error.statusCode;
      }

      if (error instanceof PropertyValidationError) {
        errorMessage = error.message;
        statusCode = 400;
      }

      if (error instanceof SyntaxError) {
        errorMessage = 'Formato de dados inválido';
        statusCode = 400;
      }

      return { success: false, error: errorMessage, statusCode };
    }
  }

  static async deleteProperty(code: string) {
    try {
      const property = await db.property.findUnique({
        where: { code }
      });

      if (!property) {
        throw new PropertyHttpError('Imóvel não encontrado.', 404);
      }

      await db.property.delete({
        where: { id: property.id }
      });

      return { success: true };
    } catch (error) {
      console.error('Erro ao deletar propriedade:', error);
      return { success: false, error: 'Erro ao deletar propriedade', statusCode: 500 };
    }
  }

  static async deletePropertyMedia(id: string) {
    try {
      const imageDeleted = await db.image.delete({
        where: { id }
      });

      return { success: true, data: imageDeleted };
    } catch (error) {
      console.error('Erro ao deletar media:', error);
      return { success: false, error: 'Erro ao deletar media', statusCode: 500 };
    }
  }
}
