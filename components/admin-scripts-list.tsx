"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Edit, Trash2, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Script } from "@/lib/types"
import { useToast } from "@/components/ui/use-toast"
import { formatDate } from "@/lib/utils"

export function AdminScriptsList() {
  const [scripts, setScripts] = useState<Script[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  const fetchScripts = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/scripts")
      if (!response.ok) {
        throw new Error("Failed to fetch scripts")
      }
      const data = await response.json()
      setScripts(data)
    } catch (error) {
      console.error("Failed to fetch scripts:", error)
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить скрипты",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchScripts()
  }, [])

  const handleDelete = async (id: number) => {
    if (!confirm("Вы уверены, что хотите удалить этот скрипт?")) {
      return
    }

    try {
      const response = await fetch(`/api/scripts/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete script")
      }

      setScripts(scripts.filter((script) => script.id !== id))
      toast({
        title: "Скрипт удален",
        description: "Скрипт успешно удален",
      })
    } catch (error) {
      console.error("Failed to delete script:", error)
      toast({
        title: "Ошибка",
        description: "Не удалось удалить скрипт",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return <div>Загрузка скриптов...</div>
  }

  if (scripts.length === 0) {
    return <div>Скрипты не найдены. Добавьте первый скрипт.</div>
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Название</TableHead>
          <TableHead>Режим</TableHead>
          <TableHead>Дата</TableHead>
          <TableHead>Просмотры</TableHead>
          <TableHead className="text-right">Действия</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {scripts.map((script) => (
          <TableRow key={script.id}>
            <TableCell className="font-medium">{script.title}</TableCell>
            <TableCell>{script.modeName || "Неизвестный режим"}</TableCell>
            <TableCell>{formatDate(script.created_at)}</TableCell>
            <TableCell>
              <div className="flex items-center">
                <Eye className="h-4 w-4 mr-1 text-amber-500" />
                {script.views || 0}
              </div>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button asChild size="icon" variant="ghost">
                  <Link href={`/admin/scripts/edit/${script.id}`}>
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Редактировать</span>
                  </Link>
                </Button>
                <Button size="icon" variant="ghost" onClick={() => handleDelete(script.id)}>
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Удалить</span>
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

