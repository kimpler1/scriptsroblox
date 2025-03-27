"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { getCheatById, updateCheat } from "@/lib/cheats"
import type { Cheat } from "@/lib/types"
import { ImageUpload } from "@/components/image-upload"
import { FileUpload } from "@/components/file-upload"

export default function EditCheatPage({ params }: { params: { id: string } }) {
  const [cheat, setCheat] = useState<Cheat | null>(null)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [fullDescription, setFullDescription] = useState("")
  const [image, setImage] = useState("")
  const [type, setType] = useState("Универсальный")
  const [color, setColor] = useState("purple")
  const [downloadUrlPC, setDownloadUrlPC] = useState("")
  const [downloadUrlAPK, setDownloadUrlAPK] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Check if user is logged in and is admin
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setAuthLoading(false)
  }, [])

  useEffect(() => {
    if (!authLoading && !user?.isAdmin) {
      router.push("/login")
    }
  }, [user, authLoading, router])

  useEffect(() => {
    const fetchCheat = async () => {
      try {
        const cheatData = await getCheatById(params.id)
        if (cheatData) {
          setCheat(cheatData)
          setName(cheatData.name)
          setDescription(cheatData.description)
          setFullDescription(cheatData.fullDescription)
          setImage(cheatData.image || "")
          setType(cheatData.type)
          setColor(cheatData.color)
          setDownloadUrlPC(cheatData.downloadUrlPC)
          setDownloadUrlAPK(cheatData.downloadUrlAPK)
        } else {
          toast({
            title: "Ошибка",
            description: "Чит не найден",
            variant: "destructive",
          })
          router.push("/admin")
        }
      } catch (error) {
        console.error("Failed to fetch cheat:", error)
        toast({
          title: "Ошибка",
          description: "Не удалось загрузить данные чита",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (!authLoading && user?.isAdmin) {
      fetchCheat()
    }
  }, [params.id, authLoading, user, router, toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const updatedCheat = await updateCheat(params.id, {
        name,
        description,
        fullDescription,
        image,
        type,
        color,
        downloadUrlPC,
        downloadUrlAPK,
      })

      setCheat(updatedCheat)

      toast({
        title: "Чит обновлен",
        description: "Чит успешно обновлен",
      })

      router.push("/admin")
    } catch (error) {
      console.error("Failed to update cheat:", error)
      toast({
        title: "Ошибка",
        description: "Не удалось обновить чит",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (authLoading || !user?.isAdmin) {
    return null
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <p>Загрузка данных чита...</p>
        </div>
      </div>
    )
  }

  if (!cheat) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <p>Чит не найден</p>
          <Button onClick={() => router.push("/admin")} className="mt-4">
            Вернуться в админ-панель
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Редактировать чит</CardTitle>
          <CardDescription>Измените данные чита</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Название</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Краткое описание</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullDescription">Полное описание</Label>
              <Textarea
                id="fullDescription"
                value={fullDescription}
                onChange={(e) => setFullDescription(e.target.value)}
                required
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Тип чита</Label>
                <Select value={type} onValueChange={setType} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите тип" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Универсальный">Универсальный</SelectItem>
                    <SelectItem value="Инжектор">Инжектор</SelectItem>
                    <SelectItem value="Эксплойт">Эксплойт</SelectItem>
                    <SelectItem value="Мобильный">Мобильный</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="color">Цвет</Label>
                <Select value={color} onValueChange={setColor} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите цвет" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="purple">Фиолетовый</SelectItem>
                    <SelectItem value="blue">Синий</SelectItem>
                    <SelectItem value="amber">Янтарный</SelectItem>
                    <SelectItem value="green">Зеленый</SelectItem>
                    <SelectItem value="red">Красный</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <ImageUpload value={image} onChange={setImage} label="Изображение чита" />

            <FileUpload
              value={downloadUrlPC}
              onChange={setDownloadUrlPC}
              label="Файл для ПК версии"
              accept=".exe,.zip,.rar"
            />

            <FileUpload
              value={downloadUrlAPK}
              onChange={setDownloadUrlAPK}
              label="Файл для APK версии"
              accept=".apk,.zip"
            />
          </CardContent>
          <CardFooter>
            <div className="flex gap-4 w-full">
              <Button type="button" variant="outline" onClick={() => router.back()} className="w-full">
                Отмена
              </Button>
              <Button type="submit" className="w-full" disabled={isSaving}>
                {isSaving ? "Сохранение..." : "Сохранить изменения"}
              </Button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

