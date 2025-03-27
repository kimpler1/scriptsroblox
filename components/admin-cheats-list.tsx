"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Cheat } from "@/lib/types"
import { useToast } from "@/components/ui/use-toast"

export function AdminCheatsList() {
  const [cheats, setCheats] = useState<Cheat[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  const fetchCheats = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/cheats")
      if (!response.ok) {
        throw new Error("Failed to fetch cheats")
      }
      const data = await response.json()
      setCheats(data)
    } catch (error) {
      console.error("Failed to fetch cheats:", error)
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить читы",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCheats()
  }, [])

  const handleDelete = async (id: number) => {
    if (!confirm("Вы уверены, что хотите удалить этот чит?")) {
      return
    }

    try {
      const response = await fetch(`/api/cheats/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete cheat")
      }

      setCheats(cheats.filter((cheat) => cheat.id !== id))
      toast({
        title: "Чит удален",
        description: "Чит успешно удален",
      })
    } catch (error) {
      console.error("Failed to delete cheat:", error)
      toast({
        title: "Ошибка",
        description: "Не удалось удалить чит",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return <div>Загрузка читов...</div>
  }

  if (cheats.length === 0) {
    return <div>Читы не найдены. Добавьте первый чит.</div>
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Название</TableHead>
          <TableHead>Тип</TableHead>
          <TableHead className="text-right">Действия</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {cheats.map((cheat) => (
          <TableRow key={cheat.id}>
            <TableCell className="font-medium">{cheat.name}</TableCell>
            <TableCell>{cheat.type}</TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button asChild size="icon" variant="ghost">
                  <Link href={`/admin/cheats/edit/${cheat.id}`}>
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Редактировать</span>
                  </Link>
                </Button>
                <Button size="icon" variant="ghost" onClick={() => handleDelete(cheat.id)}>
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

