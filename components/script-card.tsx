import type { Script } from "@/lib/types"

interface ScriptCardProps {
  script: Script
}

export function ScriptCard({ script }: ScriptCardProps) {
  // Обработка полей, которые могут иметь разные имена
  const imageUrl = script.image_url || script.image || `/placeholder.svg?height=200&width=400`
  const createdAt = script.createdAt || script.created_at || new Date().toISOString()
  const views = typeof script.views === "number" ? script.views : 0

  // Обработка поля mode, которое может иметь разную структуру
  const modeName = script.mode?.name || script.modeName || "Неизвест\

