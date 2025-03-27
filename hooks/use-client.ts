"use client"

import { useEffect, useState } from "react"

// Хук для определения, выполняется ли код на клиенте
export function useClient() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return isClient
}

