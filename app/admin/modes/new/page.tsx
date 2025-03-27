"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { ImageUpload } from "@/components/image-upload"

export default function NewModePage() {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [image, setImage] = useState("")
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
      console.log("Creating mode with data:", {
        name,
        description,
        image,
      })

      const response = await fetch("/api/modes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          description,
          image_url: image,
          created_by: user?.username || "Администратор",
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create mode")
      }

      toast({
        title: "Режим добавлен",
        description: "Режим успешно добавлен на сайт",
      })

      router.push("/admin")
    } catch (error) {
      console.error("Failed to create mode:", error)
      toast({
        title: "Ошибка",
        description: "Не удалось добавить режим: " + (error instanceof Error ? error.message : "Неизвестная ошибка"),
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
          <CardTitle>Добавить новый режим</CardTitle>
          <CardDescription>Заполните форму для добавления нового режима игры</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Название (до 120 символов)</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required maxLength={120} />
              <div className="text-xs text-gray-500 text-right">{name.length}/120 символов</div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Описание (до 600 символов)</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={4}
                maxLength={600}
              />
              <div className="text-xs text-gray-500 text-right">{description.length}/600 символов</div>
            </div>

            <ImageUpload value={image} onChange={setImage} label="Изображение режима" />
          </CardContent>
          <CardFooter>
            <div className="flex gap-4 w-full">
              <Button type="button" variant="outline" onClick={() => router.back()} className="w-full">
                Отмена
              </Button>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Сохранение..." : "Сохранить режим"}
              </Button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

