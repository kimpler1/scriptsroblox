"use client"

import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"
import { useEffect, useState } from "react"
import type { Mode } from "@/lib/types"
import { getAllModes } from "@/lib/modes"
import { ScriptsFilter } from "@/components/scripts-filter"
import { useClient } from "@/hooks/use-client"
import { useSearchParams } from "next/navigation"

export default function ModesPage() {
  const [modes, setModes] = useState<Mode[]>([])
  const [filteredModes, setFilteredModes] = useState<Mode[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const isClient = useClient()
  const searchParams = useSearchParams()
  const searchQuery = searchParams.get("q") || ""

  useEffect(() => {
    if (!isClient) return

    const fetchModes = async () => {
      try {
        const modesData = await getAllModes()
        setModes(modesData)

        // Применяем фильтрацию, если есть поисковый запрос
        if (searchQuery) {
          const filtered = modesData.filter(
            (mode) =>
              mode.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              mode.description.toLowerCase().includes(searchQuery.toLowerCase()),
          )
          setFilteredModes(filtered)
        } else {
          setFilteredModes(modesData)
        }
      } catch (error) {
        console.error("Failed to fetch modes:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchModes()
  }, [isClient, searchQuery])

  // Рендерим упрощенную версию на сервере
  if (!isClient) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Поиск плейса</h1>
        <div className="mb-8">
          <div className="flex flex-col space-y-4">
            <div className="relative">
              <div className="h-12 bg-gray-100 rounded-xl"></div>
            </div>
          </div>
        </div>
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Популярные плейсы</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <div className="col-span-4 text-center py-12">
              <p className="text-gray-500">Загрузка режимов...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Поиск плейса</h1>
        <div className="mb-8">
          <ScriptsFilter />
        </div>
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Популярные плейсы</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <div className="col-span-4 text-center py-12">
              <p className="text-gray-500">Загрузка режимов...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const displayTitle = searchQuery ? `Результаты поиска: "${searchQuery}"` : "Популярные плейсы"

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Поиск плейса</h1>
      <div className="mb-8">
        <ScriptsFilter />
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">{displayTitle}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredModes.map((mode) => (
            <Link key={mode.id} href={`/modes/${mode.id}`}>
              <Card className="overflow-hidden h-full transition-all hover:shadow-lg border-0 shadow-sm bg-white rounded-xl group">
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={mode.image || `/placeholder.svg?height=160&width=320`}
                    alt={mode.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="text-2xl font-bold text-white truncate">{mode.name}</h3>
                  </div>
                </div>
                <CardContent className="p-4">
                  <p className="text-gray-600 line-clamp-2 mb-3">{mode.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="text-amber-600 font-medium">
                      {mode.scriptCount}{" "}
                      {mode.scriptCount === 1
                        ? "скрипт"
                        : mode.scriptCount > 1 && mode.scriptCount < 5
                          ? "скрипта"
                          : "скриптов"}
                    </div>
                    <div className="text-green-600 font-medium flex items-center">
                      Смотреть
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}

          {filteredModes.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm col-span-4">
              <h3 className="text-2xl font-bold mb-2">Плейсы не найдены</h3>
              <p className="text-muted-foreground">
                {searchQuery
                  ? `По запросу "${searchQuery}" ничего не найдено. Попробуйте изменить параметры поиска.`
                  : "Попробуйте изменить параметры поиска или добавьте новые плейсы через админ-панель"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

