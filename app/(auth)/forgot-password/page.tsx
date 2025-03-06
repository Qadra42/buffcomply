import { ForgotPasswordForm } from "@/components/forgot-password-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Recuperar Contraseña - Buff Comply",
  description: "Recupera tu contraseña de Buff Comply",
}

export default function ForgotPasswordPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Recuperar contraseña</h1>
          <p className="text-sm text-muted-foreground">Ingresa tu email para recibir un enlace de recuperación</p>
        </div>
        <ForgotPasswordForm />
        <p className="px-8 text-center text-sm text-muted-foreground">
          <a href="/login" className="underline underline-offset-4 hover:text-primary">
            Volver al inicio de sesión
          </a>
        </p>
      </div>
    </div>
  )
}

