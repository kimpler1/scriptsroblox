"use client"

import type React from "react"

import Link from "next/link"
import Image from "next/image"
import { notFound, useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, Download, ShieldCheck, Zap, Cpu, Layers } from "lucide-react"
import { useState, useEffect } from "react"
import { getCheatById } from "@/lib/cheats"
import type { Cheat } from "@/lib/types"
import { toast } from "@/lib/toast"
import { useClient } from "@/hooks/use-client"

export default function CheatPage() {
  // Используем хук useParams вместо props
  const params = useParams()
  const cheatId = typeof params?.id === "string" ? params.id : ""

  const router = useRouter()
  const [cheat, setCheat] = useState<Cheat | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDownloadingPC, setIsDownloadingPC] = useState(false)
  const [isDownloadingAPK, setIsDownloadingAPK] = useState(false)
  const isClient = useClient()

  useEffect(() => {
    if (!isClient || !cheatId) return

    let isMounted = true

    const fetchCheat = async () => {
      try {
        const cheatData = await getCheatById(cheatId)

        if (!isMounted) return

        if (cheatData) {
          setCheat(cheatData)
        } else {
          // Если чит не найден, перенаправляем на страницу со всеми читами
          router.push("/cheats")
        }

        setIsLoading(false)
      } catch (error) {
        console.error("Failed to fetch cheat:", error)

        if (isMounted) {
          toast({
            title: "Ошибка",
            description: "Не удалось загрузить данные чита",
            variant: "destructive",
          })
          setIsLoading(false)
        }
      }
    }

    fetchCheat()

    return () => {
      isMounted = false
    }
  }, [cheatId, router, isClient])

  // Рендерим упрощенную версию на сервере
  if (!isClient) {
    return <div className="container mx-auto px-4 py-8">Загрузка...</div>
  }

  if (isLoading) {
    return <div className="container mx-auto px-4 py-8">Загрузка...</div>
  }

  if (!cheat) {
    return notFound()
  }

  // Определяем иконку в зависимости от типа чита
  let icon
  switch (cheat.color) {
    case "purple":
      icon = <ShieldCheck className="h-6 w-6 text-purple-500" />
      break
    case "blue":
      icon = <Cpu className="h-6 w-6 text-blue-500" />
      break
    case "amber":
      icon = <Zap className="h-6 w-6 text-amber-500" />
      break
    case "green":
      icon = <Layers className="h-6 w-6 text-green-500" />
      break
    default:
      icon = <ShieldCheck className="h-6 w-6 text-purple-500" />
  }

  const handleDownloadPC = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsDownloadingPC(true)

    // Имитация загрузки из базы данных
    toast({
      title: "Загрузка началась",
      description: `Загрузка ${cheat.name} для ПК из базы данных...`,
    })

    // Имитация задержки загрузки
    const timer = setTimeout(() => {
      setIsDownloadingPC(false)

      if (cheat.downloadUrlPC) {
        // Извлекаем имя файла и данные из base64 строки
        const fileNameMatch = cheat.downloadUrlPC.match(/filename=(.*?);/)
        const fileName = fileNameMatch ? fileNameMatch[1] : `${cheat.name}-pc.zip`

        // Создаем ссылку для скачивания
        const link = document.createElement("a")
        link.href = cheat.downloadUrlPC
        link.download = fileName
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      } else {
        toast({
          title: "Ошибка",
          description: "Файл для скачивания не найден",
          variant: "destructive",
        })
      }
    }, 1500)

    return () => clearTimeout(timer)
  }

  const handleDownloadAPK = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsDownloadingAPK(true)

    // Имитация загрузки из базы данных
    toast({
      title: "Загрузка началась",
      description: `Загрузка ${cheat.name} APK из базы данных...`,
    })

    // Имитация задержки загрузки
    const timer = setTimeout(() => {
      setIsDownloadingAPK(false)

      if (cheat.downloadUrlAPK) {
        // Извлекаем имя файла и данные из base64 строки
        const fileNameMatch = cheat.downloadUrlAPK.match(/filename=(.*?);/)
        const fileName = fileNameMatch ? fileNameMatch[1] : `${cheat.name}-android.apk`

        // Создаем ссылку для скачивания
        const link = document.createElement("a")
        link.href = cheat.downloadUrlAPK
        link.download = fileName
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      } else {
        toast({
          title: "Ошибка",
          description: "Файл для скачивания не найден",
          variant: "destructive",
        })
      }
    }, 1500)

    return () => clearTimeout(timer)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/cheats">
        <Button variant="outline" size="sm" className="mb-4 flex items-center">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Назад к читам
        </Button>
      </Link>

      <div className="bg-white rounded-2xl shadow-md overflow-hidden mb-8">
        <div className="relative h-[300px] w-full">
          <Image
            src={cheat.image || "/placeholder.svg?height=300&width=600"}
            alt={cheat.name}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="flex items-center mb-2">
              {icon}
              <h1 className="text-4xl font-bold text-white ml-2">{cheat.name}</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Card className="border-0 shadow-md rounded-2xl overflow-hidden">
            <CardContent className="p-8">
              <div className="prose max-w-none">
                <h2 className="text-2xl font-bold mb-4">Описание</h2>
                <p className="text-gray-700 mb-6">{cheat.fullDescription}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="border-0 shadow-md rounded-2xl overflow-hidden sticky top-24">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-4">Скачать {cheat.name}</h3>

              <div className="space-y-4">
                <Button
                  className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl transition-all duration-300 hover:shadow-md"
                  onClick={handleDownloadPC}
                  disabled={isDownloadingPC}
                >
                  <Download className="mr-2 h-4 w-4" />
                  {isDownloadingPC ? "Загрузка..." : `Скачать ${cheat.name} ПК`}
                </Button>

                <Button
                  className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl transition-all duration-300 hover:shadow-md"
                  onClick={handleDownloadAPK}
                  disabled={isDownloadingAPK}
                >
                  <Download className="mr-2 h-4 w-4" />
                  {isDownloadingAPK ? "Загрузка..." : `Скачать ${cheat.name} APK`}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

