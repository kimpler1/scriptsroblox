"use client"

import { createContext, useContext } from "react"

interface AuthContextType {
  user: any | null
  isLoading: boolean
  signIn: (username: string, password: string) => Promise<boolean>
  signOut: () => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  signIn: async () => false,
  signOut: () => {},
})

export const useAuth = () => useContext(AuthContext)

