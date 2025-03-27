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
import type { Mode } from "@/lib/types"
import { ImageUpload } from "@/components/image-upload"

export default function EditModePage({ params }: { params: { id: string } }) {
  const [mode, setMode] = useState<Mode | null>(null)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [image, setImage] = useState("")
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
    const fetchMode = async () => {
      try {
        const response = await fetch(`/api/modes/${params.id}`)
        if (!response.ok) {
          throw new Error("Failed to fetch mode")
        }
        const modeData = await response.json()

        console.log("Fetched mode:", modeData)

        if (modeData) {
          setMode(modeData)
          setName(modeData.name)
          setDescription(modeData.description)
          setImage(modeData.image_url || modeData.image || "")
        } else {
          toast({
            title: "Ошибка",
            description: "Режим не найден",
            variant: "destructive",
          })
          router.push("/admin")
        }
      } catch (error) {
        console.error("Failed to fetch mode:", error)
        toast({
          title: "Ошибка",
          description: "Не удалось загрузить данные режима",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (!authLoading && user?.isAdmin) {
      fetchMode()
    }
  }, [params.id, authLoading, user, router, toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      console.log("Updating mode with data:", {
        id: params.id,
        name,
        description,
        image,
      })

      const response = await fetch(`/api/modes/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          description,
          image_url: image,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to update mode")
      }

      const updatedMode = await response.json()
      setMode(updatedMode)

      toast({
        title: "Режим обновлен",
        description: "Режим успешно обновлен",
      })

      router.push("/admin")
    } catch (error) {
      console.error("Failed to update mode:", error)
      toast({
        title: "Ошибка",
        description: "Не удалось обновить режим: " + (error instanceof Error ? error.message : "Неизвестная ошибка"),
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
          <p>Загрузка данных режима...</p>
        </div>
      </div>
    )
  }

  if (!mode) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <p>Режим не найден</p>
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
          <CardTitle>Редактировать режим</CardTitle>
          <CardDescription>Измените данные режима</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Название</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Описание</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={3}
              />
            </div>

            <ImageUpload value={image} onChange={setImage} label="Изображение режима" />
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

