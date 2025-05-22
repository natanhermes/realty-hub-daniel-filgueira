import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { listPropertiesAction } from '@/app/actions/listPropertiesAction';
import { Property } from '@/types/Property';
import { ListProperties } from './list-properties';
import { Plus } from 'lucide-react';
import { auth } from '@/auth';

export default async function MyProperties() {
  const properties = await listPropertiesAction() as Property[]

  const session = await auth()
  const isAdmin = session?.user?.username === 'admin' || session?.user?.username === 'danielfilgueira';

  return (
    <>
      <div className='flex justify-between items-center mb-4'>
        <h1 className="text-3xl text-darkBlue font-bold">Meus imóveis</h1>

        <div className='flex items-center gap-4'>
          {isAdmin && (
            <Link href="/arearestrita/cadastro">
              <Button variant="outline" className='text-darkBlue'>
                <Plus size={16} />
                Novo usuário
              </Button>
            </Link>
          )}

          <Link href="/dashboard/my-properties/create">
            <Button variant="outline" className='text-darkBlue'>
              <Plus size={16} />
              Novo
            </Button>
          </Link>
        </div>
      </div>

      <ListProperties properties={properties} />
    </>
  );
}
