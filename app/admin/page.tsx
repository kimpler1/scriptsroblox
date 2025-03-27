"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AdminScriptsList } from "@/components/admin-scripts-list"
import { AdminModesList } from "@/components/admin-modes-list"
import { AdminCheatsList } from "@/components/admin-cheats-list"

export default function AdminPage() {
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in and is admin
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser)
      setUser(parsedUser)
    }
    setIsLoading(false)
  }, [])

  useEffect(() => {
    if (!isLoading && !user?.isAdmin) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return <div className="container mx-auto px-4 py-8">Загрузка...</div>
  }

  if (!user?.isAdmin) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Админ-панель</h1>
        <div className="flex gap-4">
          <Button asChild>
            <Link href="/admin/scripts/new">
              <Plus className="mr-2 h-4 w-4" />
              Добавить скрипт
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/modes/new">
              <Plus className="mr-2 h-4 w-4" />
              Добавить режим
            </Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/admin/cheats/new">
              <Plus className="mr-2 h-4 w-4" />
              Добавить чит
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <Card className="border-green-100">
          <CardHeader className="border-b border-green-100">
            <CardTitle>Скрипты</CardTitle>
            <CardDescription>Управление скриптами на сайте</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <AdminScriptsList />
          </CardContent>
        </Card>

        <Card className="border-green-100">
          <CardHeader className="border-b border-green-100">
            <CardTitle>Режимы</CardTitle>
            <CardDescription>Управление режимами игр</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <AdminModesList />
          </CardContent>
        </Card>

        <Card className="border-green-100">
          <CardHeader className="border-b border-green-100">
            <CardTitle>Читы</CardTitle>
            <CardDescription>Управление читами для Roblox</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <AdminCheatsList />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

