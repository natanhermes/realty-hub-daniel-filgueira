import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from '@/components/ui/card';

import RegisterForm from './register-form';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function RegisterPage() {
  const session = await auth();

  if (!session) {
    return redirect('/arearestrita/login');
  }

  return (
    <>
      <Card className="max-w-sm w-full rounded-2xl mt-12">
        <CardHeader>
          <h2 className="text-xl font-bold">Cadastro de gestor</h2>
          <CardDescription>Cadastro de usuário para gerenciar os imóveis anunciados.</CardDescription>
        </CardHeader>
        <CardContent>
          <RegisterForm />
        </CardContent>
      </Card>
    </>
  );
}
