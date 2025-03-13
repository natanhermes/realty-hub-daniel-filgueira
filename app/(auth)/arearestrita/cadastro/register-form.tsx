'use client'

import Form from "next/form"
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useActionState } from "react"
import registerAction from "@/app/actions/registerAction"

export default function RegisterForm() {
	const [state, formAction, isPending] = useActionState(registerAction, null)

	return (
		<>
			{state?.success === false && (
				<div className="text-xs mb-6 flex flex-col bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
					<strong className="font-bold">Erro!</strong>
					<span className="block sm:inline">{state.message}</span>
				</div>
			)}
			<Form action={formAction}>
				<div>
					<Label>Nome</Label>
					<Input type="text" name="name" placeholder="Fulano de Tal" />
				</div>
				<div>
					<Label>Usuário</Label>
					<Input type="text" name="username" placeholder="fulanodetal" />
				</div>
				<div>
					<Label>Senha</Label>
					<Input type="password" name="password" placeholder="********" />
				</div>
				<div>
					<Button disabled={isPending} className="w-full mt-6" type="submit">
						{isPending ? 'Registrando...' : 'Registrar'}
					</Button>
				</div>
			</Form>
		</>
	)
}
