'use server'

import db from "@/lib/db";
import { uploadPropertyImage } from "@/lib/s3";
import { image, infrastructure, property } from "@prisma/client"
import { PropertyValidationError } from "../errors/property-validation-error";
import { PropertyHttpError } from "../errors/property-http-error";

type PropertyFeatures = Omit<property & { infrastructure: infrastructure | null, images: image[] }, "id" | "createdAt" | "updatedAt">

type NumericFields = {
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

type BooleanFields = {
  acceptsFinancing: string | null
  acceptsExchange: string | null
}

function parseNumericValue<T extends number | null>(value: string | null, parser: (val: string) => number): T {
  return value ? parser(value) as T : null as T
}

function parseBooleanValue(value: string | null): boolean {
  return value === 'true'
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

function validateRequiredFields(data: Partial<PropertyFeatures> & NumericFields & BooleanFields) {
  const requiredFields = ['code', 'propertyType', 'purpose', 'neighborhood', 'location'];

  for (const field of requiredFields) {
    if (!data[field as keyof typeof data]) {
      throw new PropertyValidationError(`Campo obrigatório não preenchido: ${field}`);
    }
  }
}

function validateNumericValues(data: NumericFields) {
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

export default async function createOrUpdatePropertyAction(formData: FormData, propertyId?: string, isUpdate?: boolean) {
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

    if (images.length === 0 && !isUpdate) {
      throw new PropertyHttpError('É necessário enviar pelo menos uma imagem', 400);
    }

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
      if (images.length > 0) {
        const uploadedImagesS3 = await Promise.all(
          images.map(async (image) => {
            const url = await uploadPropertyImage(image, property.id);
            return { url, propertyId: property.id };
          })
        );

        await db.image.createMany({
          data: uploadedImagesS3
        });
      }

      await db.infrastructure.create({
        data: {
          ...infrastructureData,
          propertyId: property.id
        }
      });
      return { success: true, data: property };
    } catch (_) {
      if (!isUpdate) {
        await db.property.delete({
          where: { id: property.id }
        });
      }
      throw new PropertyHttpError('Erro ao processar imagens ou infraestrutura', 500);
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