
"use client"
import { SessionProvider } from "next-auth/react"

export default function AuthProvider({children}: {children: React.ReactNode}) {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  )
}

//now move to layout.tsx to put sessionprovider and wrap the body with authprovider