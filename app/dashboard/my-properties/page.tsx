import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { listPropertiesAction } from '@/app/actions/listPropertiesAction';
import { Property } from '@/types/Property';
import { PropertyCard } from '@/components/property-card';

export default async function MyProperties() {
  const properties = await listPropertiesAction() as Property[]

  return (
    <>
      <div className='flex justify-between items-center mb-4'>
        <h1 className="text-3xl font-bold">Meus imóveis</h1>

        <Link href="/dashboard/my-properties/create">
          <Button variant="outline">Adicionar imóvel</Button>
        </Link>
      </div>

      <div className='flex flex-wrap gap-4'>
        {properties.map((property) => (
          <PropertyCard key={property.id} property={property} isAdmin />
        ))}
      </div>
    </>
  );
}
