import type { Mode, Script } from "@/lib/types"

// Получение всех режимов с подсчетом скриптов
export async function getAllModes(): Promise<Mode[]> {
  const response = await fetch("/api/modes", { cache: "no-store" })
  if (!response.ok) {
    throw new Error("Failed to fetch modes")
  }
  return response.json()
}

// Получение режима по ID
export async function getModeById(id: string): Promise<Mode | null> {
  const response = await fetch(`/api/modes/${id}`, { cache: "no-store" })
  if (!response.ok) {
    if (response.status === 404) {
      return null
    }
    throw new Error("Failed to fetch mode")
  }
  return response.json()
}

// Получение скриптов для конкретного режима
export async function getScriptsForMode(modeId: string): Promise<Script[]> {
  const response = await fetch(`/api/scripts?mode=${modeId}`, { cache: "no-store" })
  if (!response.ok) {
    throw new Error("Failed to fetch scripts for mode")
  }
  return response.json()
}

// Создание нового режима
export async function createMode(modeData: Omit<Mode, "id" | "scriptCount">): Promise<Mode> {
  const response = await fetch("/api/modes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: modeData.name,
      description: modeData.description,
      image_url: modeData.image,
      created_by: modeData.createdBy,
    }),
  })

  if (!response.ok) {
    throw new Error("Failed to create mode")
  }

  return response.json()
}

// Обновление режима
export async function updateMode(
  id: string,
  modeData: Partial<Omit<Mode, "id" | "scriptCount" | "createdBy" | "createdAt">>,
): Promise<Mode> {
  const response = await fetch(`/api/modes/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: modeData.name,
      description: modeData.description,
      image_url: modeData.image,
    }),
  })

  if (!response.ok) {
    throw new Error("Failed to update mode")
  }

  return response.json()
}

// Удаление режима
export async function deleteMode(id: string): Promise<void> {
  const response = await fetch(`/api/modes/${id}`, {
    method: "DELETE",
  })

  if (!response.ok) {
    throw new Error("Failed to delete mode")
  }
}

