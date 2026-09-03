"use client"

import { AuthForm } from "../../../components/auth/auth-form"

export function LoginView() {
  return (
    <div className="theme-grid-bg min-h-screen px-4 py-12 font-mono text-foreground sm:px-6">
      <main className="mx-auto flex w-full max-w-2xl items-center justify-center">
        <AuthForm />
      </main>
    </div>
  )
}
