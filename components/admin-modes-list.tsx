"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Mode } from "@/lib/types"
import { useToast } from "@/components/ui/use-toast"

export function AdminModesList() {
  const [modes, setModes] = useState<Mode[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  const fetchModes = async () => {
    setIsLoading(true)
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
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchModes()
  }, [])

  const handleDelete = async (id: number) => {
    if (!confirm("Вы уверены, что хотите удалить этот режим? Все связанные скрипты также будут удалены.")) {
      return
    }

    try {
      const response = await fetch(`/api/modes/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete mode")
      }

      setModes(modes.filter((mode) => mode.id !== id))
      toast({
        title: "Режим удален",
        description: "Режим успешно удален",
      })
    } catch (error) {
      console.error("Failed to delete mode:", error)
      toast({
        title: "Ошибка",
        description: "Не удалось удалить режим",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return <div>Загрузка режимов...</div>
  }

  if (modes.length === 0) {
    return <div>Режимы не найдены. Добавьте первый режим.</div>
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Название</TableHead>
          <TableHead>Кол-во скриптов</TableHead>
          <TableHead className="text-right">Действия</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {modes.map((mode) => (
          <TableRow key={mode.id}>
            <TableCell className="font-medium">{mode.name}</TableCell>
            <TableCell>{mode.scriptCount}</TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button asChild size="icon" variant="ghost">
                  <Link href={`/admin/modes/edit/${mode.id}`}>
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Редактировать</span>
                  </Link>
                </Button>
                <Button size="icon" variant="ghost" onClick={() => handleDelete(mode.id)}>
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

