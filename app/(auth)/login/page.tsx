import { LoginForm } from "@/components/login-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Login - Buff Comply",
  description: "Login to your Buff Comply account",
}

export default function LoginPage() {
  return (
    <div className="container relative h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-600 to-blue-800" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <div className="mr-2 h-8 w-8 rounded-lg bg-white text-blue-600 flex items-center justify-center font-bold">
            BC
          </div>
          Buff Comply
        </div>
        <div className="relative z-20 mt-auto">
          <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100 drop-shadow-sm">
            Save time, <span className="italic">take control</span>
          </div>
          <p className="text-lg text-blue-100 mt-2 max-w-[420px] opacity-85">
            Streamline your compliance workflow and focus on what matters most.
          </p>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Bienvenido de nuevo</h1>
            <p className="text-sm text-muted-foreground">Ingresa tus credenciales para acceder a tu cuenta</p>
          </div>
          <LoginForm />
          <p className="px-8 text-center text-sm text-muted-foreground">
            Al continuar, aceptas nuestros{" "}
            <a href="#" className="underline underline-offset-4 hover:text-primary">
              Términos de servicio
            </a>{" "}
            y{" "}
            <a href="#" className="underline underline-offset-4 hover:text-primary">
              Política de privacidad
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  )
}

