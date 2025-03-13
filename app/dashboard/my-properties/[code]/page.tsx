import { PropertyService } from '@/app/services/propertyService';
import { ImageGalleryClient } from '@/components/image-gallery-client';

interface PropertyDetailsProps {
  params: Promise<{ code: string }>;
}

export default async function PropertyDetails({ params }: PropertyDetailsProps) {

  const { code } = await params;
  const property = await PropertyService.getPropertyByCode(code);

  if (!property) {
    return <div>Imóvel não encontrado</div>;
  }

  return (
    <ImageGalleryClient property={property} isEditing />
  );
}
