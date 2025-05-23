import { PropertyService } from '@/app/services/propertyService';
import { PropertyForm } from '@/components/property-form';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Slash } from 'lucide-react';
import Link from 'next/link';

interface PropertyDetailsProps {
  params: Promise<{ code: string }>;
}

export default async function PropertyDetails({ params }: PropertyDetailsProps) {
  const { code } = await params;
  const property = await PropertyService.getPropertyByCode(code);

  if (!property) {
    return (
      <div className="flex flex-col items-center pt-32 h-screen">
        <h1 className="text-xl md:text-4xl font-bold text-darkBlue">Imóvel não encontrado</h1>
        <Link href="/dashboard/my-properties">
          <Button variant="link">
            <ArrowLeft size={16} className='text-darkBlue' />
            Voltar para listagem
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <div className="flex gap-4 items-baseline">
        <Link href="/dashboard/my-properties" className="flex items-center text-muted-foreground hover:text-darkBlue mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Link>
        <Slash className=" size-4 text-darkBlue -rotate-[24deg]" />
        <div>
          <h1 className="text-lg lg:text-3xl md:text-4xl font-bold text-darkBlue mb-2">Editar imóvel</h1>
        </div>
      </div>

      <PropertyForm property={property} isEditing />
    </div>
  );
}
