"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useClient } from "@/hooks/use-client"

export function ScriptsFilter() {
  const [searchQuery, setSearchQuery] = useState("")
  const isClient = useClient()
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!isClient) return

    // Получаем текущий поисковый запрос из URL
    const query = searchParams.get("q")
    if (query) {
      setSearchQuery(query)
    }
  }, [isClient, searchParams])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    if (searchQuery.trim()) {
      router.push(`/modes?q=${encodeURIComponent(searchQuery.trim())}`)
    } else {
      router.push("/modes")
    }
  }

  const clearSearch = () => {
    setSearchQuery("")
    router.push("/modes")
  }

  // Рендерим упрощенную версию на сервере
  if (!isClient) {
    return (
      <div className="flex flex-col space-y-4">
        <div className="relative">
          <div className="h-12 bg-gray-100 rounded-xl"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col space-y-4">
      <form onSubmit={handleSearch} className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Введите название игры, например Blox Fruits..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 py-6 rounded-xl pr-24"
        />
        {searchQuery && (
          <Button
            type="button"
            variant="ghost"
            className="absolute right-20 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
            onClick={clearSearch}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
        <Button
          type="submit"
          className="absolute right-1.5 top-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg"
        >
          Найти
        </Button>
      </form>
    </div>
  )
}

