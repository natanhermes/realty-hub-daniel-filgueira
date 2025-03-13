'use client'
import loginAction from "@/app/actions/loginAction";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Form from "next/form";
import { useActionState } from "react";

export default function LoginForm() {
	const [state, formAction, isPending] = useActionState(loginAction, null)
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
					<Label>Username</Label>
					<Input type="text" name="username" placeholder="fulanodetal" />
				</div>
				<div>
					<Label>Senha</Label>
					<Input type="password" name="password" placeholder="********" />
				</div>
				<div>
					<Button disabled={isPending} className="w-full mt-6" type="submit">
						Login
					</Button>
				</div>
			</Form>
		</>
	)
}
