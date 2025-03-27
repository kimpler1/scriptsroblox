import type { Cheat } from "@/lib/types"

// Получение всех читов
export async function getAllCheats(): Promise<Cheat[]> {
  const response = await fetch("/api/cheats", { cache: "no-store" })
  if (!response.ok) {
    throw new Error("Failed to fetch cheats")
  }
  return response.json()
}

// Получение чита по ID
export async function getCheatById(id: string): Promise<Cheat | null> {
  const response = await fetch(`/api/cheats/${id}`, { cache: "no-store" })
  if (!response.ok) {
    if (response.status === 404) {
      return null
    }
    throw new Error("Failed to fetch cheat")
  }
  return response.json()
}

// Создание нового чита
export async function createCheat(cheatData: Omit<Cheat, "id">): Promise<Cheat> {
  const response = await fetch("/api/cheats", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: cheatData.name,
      description: cheatData.description,
      full_description: cheatData.fullDescription,
      image_url: cheatData.image,
      type: cheatData.type,
      color: cheatData.color,
      download_url_pc: cheatData.downloadUrlPC,
      download_url_apk: cheatData.downloadUrlAPK,
      created_by: cheatData.createdBy,
    }),
  })

  if (!response.ok) {
    throw new Error("Failed to create cheat")
  }

  return response.json()
}

// Обновление чита
export async function updateCheat(id: string, cheatData: Partial<Omit<Cheat, "id" | "createdAt">>): Promise<Cheat> {
  const response = await fetch(`/api/cheats/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: cheatData.name,
      description: cheatData.description,
      full_description: cheatData.fullDescription,
      image_url: cheatData.image,
      type: cheatData.type,
      color: cheatData.color,
      download_url_pc: cheatData.downloadUrlPC,
      download_url_apk: cheatData.downloadUrlAPK,
    }),
  })

  if (!response.ok) {
    throw new Error("Failed to update cheat")
  }

  return response.json()
}

// Удаление чита
export async function deleteCheat(id: string): Promise<void> {
  const response = await fetch(`/api/cheats/${id}`, {
    method: "DELETE",
  })

  if (!response.ok) {
    throw new Error("Failed to delete cheat")
  }
}

