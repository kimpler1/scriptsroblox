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
import type { Mode } from "@/lib/types"
import { ImageUpload } from "@/components/image-upload"

export default function NewScriptPage() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [code, setCode] = useState("")
  const [modeId, setModeId] = useState("")
  const [image, setImage] = useState("")
  const [modes, setModes] = useState<Mode[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [modesLoading, setModesLoading] = useState(true)
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
    const fetchModes = async () => {
      try {
        const response = await fetch("/api/modes")
        if (!response.ok) {
          throw new Error("Failed to fetch modes")
        }
        const data = await response.json()
        setModes(data)
      } catch (error) {
        console.error("Failed to fetch modes:", error)
        toast({
          title: "Ошибка",
          description: "Не удалось загрузить режимы",
          variant: "destructive",
        })
      } finally {
        setModesLoading(false)
      }
    }

    if (!authLoading && user?.isAdmin) {
      fetchModes()
    }
  }, [authLoading, user, toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      console.log("Creating script with data:", {
        title,
        description,
        code,
        modeId,
        image,
      })

      const response = await fetch("/api/scripts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          code,
          mode_id: modeId,
          image_url: image,
          created_by: user?.username || "Администратор",
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create script")
      }

      toast({
        title: "Скрипт добавлен",
        description: "Скрипт успешно добавлен на сайт",
      })

      router.push("/admin")
    } catch (error) {
      console.error("Failed to create script:", error)
      toast({
        title: "Ошибка",
        description: "Не удалось добавить скрипт: " + (error instanceof Error ? error.message : "Неизвестная ошибка"),
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
          <CardTitle>Добавить новый скрипт</CardTitle>
          <CardDescription>Заполните форму для добавления нового скрипта</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Название</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
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

            <div className="space-y-2">
              <Label htmlFor="code">Код скрипта</Label>
              <Textarea
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
                rows={8}
                className="font-mono"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mode">Режим игры</Label>
              <Select value={modeId} onValueChange={setModeId} required>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите режим" />
                </SelectTrigger>
                <SelectContent>
                  {modesLoading ? (
                    <SelectItem value="loading" disabled>
                      Загрузка режимов...
                    </SelectItem>
                  ) : modes.length > 0 ? (
                    modes.map((mode) => (
                      <SelectItem key={mode.id} value={mode.id.toString()}>
                        {mode.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="empty" disabled>
                      Нет доступных режимов
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              {modes.length === 0 && !modesLoading && (
                <p className="text-sm text-amber-600 mt-1">
                  Сначала добавьте хотя бы один режим игры в разделе "Режимы"
                </p>
              )}
            </div>

            <ImageUpload value={image} onChange={setImage} label="Изображение скрипта" />
          </CardContent>
          <CardFooter>
            <div className="flex gap-4 w-full">
              <Button type="button" variant="outline" onClick={() => router.back()} className="w-full">
                Отмена
              </Button>
              <Button type="submit" className="w-full" disabled={isLoading || modes.length === 0}>
                {isLoading ? "Сохранение..." : "Сохранить скрипт"}
              </Button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

