'use server'

import db from "@/lib/db";
import { hashSync } from "bcrypt-ts";
import { redirect } from "next/navigation";

export default async function registerAction(_prevState: any, formData: FormData) {
	const entries = Array.from(formData.entries());
	const data = Object.fromEntries(entries) as { name: string; username: string; password: string };

	if (!data.username || !data.name || !data.password) {
		return {
			message: 'Preencha todos os campos!',
			success: false,
		}
	}

	const user = await db.user.findUnique({
		where: {
			username: data.username,
		}
	})

	if (user) {
		return {
			message: 'Usuário já existe!',
			success: false,
		}
	}

	await db.user.create({
		data: {
			username: data.username,
			name: data.name,
			password: hashSync(data.password),
		}
	})

	return redirect('/arearestrita/login')
}