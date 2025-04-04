import db from "@/lib/db";
import { BooleanFields, NumericFields, Property, PropertyFeatures, PropertyFilters } from "@/types/Property";
import { PropertyHttpError } from "../errors/property-http-error";
import { PropertyValidationError } from "../errors/property-validation-error";
import { parseBooleanValue, parseNumericValue, validateRequiredFields } from "@/lib/utils";
import { validateNumericValues } from "@/lib/utils";
import { infrastructure } from "@prisma/client";
import { uploadPropertyImage } from "@/lib/s3";

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
    });
    return properties;
  }

  static async listHighlightedProperties() {
    const properties = await db.property.findMany({
      where: {
        highlight: true
      },
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

  static async createOrUpdateProperty(formData: FormData, propertyId?: string, isUpdate?: boolean) {
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


      const images = formData.getAll('images') as File[];
      if (isUpdate) {
        const property = await db.property.findUnique({
          where: { id: propertyId },
        })

        if (!property) {
          throw new PropertyHttpError('Imóvel não encontrado', 404);
        }

        await db.property.update({
          where: { id: propertyId },
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
            location: rawData.location,
            description: rawData.description,
          }
        }).catch(() => {
          throw new PropertyHttpError(`Erro ao atualizar imóvel no banco de dados`, 500);
        });

        if (images.length > 0) {
          const existingImages = formData.getAll('existingImages') as File[];
          const imageAlreadyUploaded = existingImages.map(image => image.name);

          const imagesToUpload = images.filter(image => !imageAlreadyUploaded.includes(image.name));

          const uploadedImagesS3 = await Promise.all(
            imagesToUpload.map(async (image) => {
              const url = await uploadPropertyImage(image, property.id);
              return { url, propertyId: property.id };
            })
          );

          await db.image.createMany({
            data: uploadedImagesS3
          });

          await db.infrastructure.update({
            where: { propertyId: property.id },
            data: infrastructureData
          });
        }

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
          neighborhood: rawData.neighborhood,
          location: rawData.location,
          description: rawData.description,
          active: true
        }
      }).catch((error) => {
        if (error.code === 'P2002') {
          throw new PropertyHttpError('Já existe um imóvel com este código', 409);
        }
        throw new PropertyHttpError(`Erro ao criar imóvel no banco de dados`, 500);
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

      if (error instanceof PropertyHttpError) {
        return { success: false, error: error.message };
      }
      if (error instanceof PropertyValidationError) {
        return { success: false, error: error.message };
      }
      if (error instanceof SyntaxError) {
        return { success: false, error: 'Formato de dados inválido' };
      }

      return { success: false, error: 'Ocorreu um erro ao criar a propriedade. Por favor, tente novamente.' };
    }
  }

  static async deleteProperty(propertyId: string) {
    await db.property.delete({
      where: { id: propertyId }
    });
  }
}
