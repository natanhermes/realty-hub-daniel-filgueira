import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { listPropertiesAction } from '@/app/actions/listPropertiesAction';
import { Property } from '@/types/Property';
import { ListProperties } from './list-properties';
import { Plus } from 'lucide-react';

export default async function MyProperties() {
  const properties = await listPropertiesAction() as Property[]

  return (
    <>
      <div className='flex justify-between items-center mb-4'>
        <h1 className="text-3xl text-darkBlue font-bold">Meus imóveis</h1>

        <Link href="/dashboard/my-properties/create">
          <Button variant="outline" className='text-darkBlue'>
            <Plus size={16} />
            Novo
          </Button>
        </Link>
      </div>

      <ListProperties properties={properties} />
    </>
  );
}
