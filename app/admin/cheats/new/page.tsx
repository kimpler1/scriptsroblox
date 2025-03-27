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
import { ImageUpload } from "@/components/image-upload"
import { FileUpload } from "@/components/file-upload"

export default function NewCheatPage() {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [fullDescription, setFullDescription] = useState("")
  const [image, setImage] = useState("")
  const [type, setType] = useState("Универсальный")
  const [color, setColor] = useState("purple")
  const [downloadUrlPC, setDownloadUrlPC] = useState("")
  const [downloadUrlAPK, setDownloadUrlAPK] = useState("")
  const [isLoading, setIsLoading] = useState(false)
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      console.log("Creating cheat with data:", {
        name,
        description,
        fullDescription,
        image,
        type,
        color,
        downloadUrlPC,
        downloadUrlAPK,
      })

      const response = await fetch("/api/cheats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          description,
          full_description: fullDescription,
          image_url: image,
          type,
          color,
          download_url_pc: downloadUrlPC,
          download_url_apk: downloadUrlAPK,
          created_by: user?.username || "Администратор",
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create cheat")
      }

      toast({
        title: "Чит добавлен",
        description: "Чит успешно добавлен на сайт",
      })

      router.push("/admin")
    } catch (error) {
      console.error("Failed to create cheat:", error)
      toast({
        title: "Ошибка",
        description: "Не удалось добавить чит: " + (error instanceof Error ? error.message : "Неизвестная ошибка"),
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (authLoading || !user?.isAdmin) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Добавить новый чит</CardTitle>
          <CardDescription>Заполните форму для добавления нового чита на сайт</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Название (до 120 символов)</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required maxLength={120} />
              <div className="text-xs text-gray-500 text-right">{name.length}/120 символов</div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Краткое описание (до 600 символов)</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={2}
                maxLength={600}
              />
              <div className="text-xs text-gray-500 text-right">{description.length}/600 символов</div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullDescription">Полное описание (до 600 символов)</Label>
              <Textarea
                id="fullDescription"
                value={fullDescription}
                onChange={(e) => setFullDescription(e.target.value)}
                required
                rows={4}
                maxLength={600}
              />
              <div className="text-xs text-gray-500 text-right">{fullDescription.length}/600 символов</div>
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
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Сохранение..." : "Сохранить чит"}
              </Button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

