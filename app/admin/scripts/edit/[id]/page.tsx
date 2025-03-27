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
import type { Mode, Script } from "@/lib/types"
import { ImageUpload } from "@/components/image-upload"

export default function EditScriptPage({ params }: { params: { id: string } }) {
  const [script, setScript] = useState<Script | null>(null)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [code, setCode] = useState("")
  const [modeId, setModeId] = useState("")
  const [image, setImage] = useState("")
  const [modes, setModes] = useState<Mode[]>([])
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
    const fetchData = async () => {
      try {
        // Получаем скрипт
        const scriptResponse = await fetch(`/api/scripts/${params.id}?incrementViews=false`)
        if (!scriptResponse.ok) {
          throw new Error("Failed to fetch script")
        }
        const scriptData = await scriptResponse.json()

        // Получаем режимы
        const modesResponse = await fetch("/api/modes")
        if (!modesResponse.ok) {
          throw new Error("Failed to fetch modes")
        }
        const modesData = await modesResponse.json()

        console.log("Fetched script:", scriptData)
        console.log("Fetched modes:", modesData)

        if (scriptData) {
          setScript(scriptData)
          setTitle(scriptData.title)
          setDescription(scriptData.description)
          setCode(scriptData.code)
          setModeId(scriptData.mode_id?.toString() || scriptData.modeId?.toString() || "")
          setImage(scriptData.image_url || scriptData.image || "")
        } else {
          toast({
            title: "Ошибка",
            description: "Скрипт не найден",
            variant: "destructive",
          })
          router.push("/admin")
        }

        setModes(modesData)
      } catch (error) {
        console.error("Failed to fetch data:", error)
        toast({
          title: "Ошибка",
          description: "Не удалось загрузить данные",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (!authLoading && user?.isAdmin) {
      fetchData()
    }
  }, [params.id, authLoading, user, router, toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      console.log("Updating script with data:", {
        id: params.id,
        title,
        description,
        code,
        modeId,
        image,
      })

      const response = await fetch(`/api/scripts/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          instructions: script?.instructions || "", // Сохраняем существующие инструкции
          code,
          mode_id: modeId,
          image_url: image,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to update script")
      }

      toast({
        title: "Скрипт обновлен",
        description: "Скрипт успешно обновлен",
      })

      router.push("/admin")
    } catch (error) {
      console.error("Failed to update script:", error)
      toast({
        title: "Ошибка",
        description: "Не удалось обновить скрипт: " + (error instanceof Error ? error.message : "Неизвестная ошибка"),
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
          <p>Загрузка данных скрипта...</p>
        </div>
      </div>
    )
  }

  if (!script) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <p>Скрипт не найден</p>
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
          <CardTitle>Редактировать скрипт</CardTitle>
          <CardDescription>Измените данные скрипта</CardDescription>
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
                  {modes.map((mode) => (
                    <SelectItem key={mode.id} value={mode.id.toString()}>
                      {mode.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <ImageUpload value={image} onChange={setImage} label="Изображение скрипта" />
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

