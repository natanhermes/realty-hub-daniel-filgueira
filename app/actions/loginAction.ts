'use server'

import { signIn } from "@/auth"
import { AuthError } from "next-auth"
import { isRedirectError } from "next/dist/client/components/redirect"

export default async function loginAction(_prevState: any, formData: FormData) {
    try {
        await signIn('credentials', {
            username: formData.get('username'),
            password: formData.get('password'),
            redirect: true,
            redirectTo: '/dashboard/my-properties'
        })
        return {
            success: true
        }
    } catch (error) {
        if (isRedirectError(error)) {
            throw error
        }

        if (error instanceof AuthError && error.type === 'CredentialsSignin') {
            return {
                success: false,
                message: 'Dados de login incorretos.'
            }
        }
        return {
            success: false,
            message: 'Ops! Ocorreu um erro ao fazer login.'
        }
    }
}

