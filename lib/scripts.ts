import type { Script } from "@/lib/types"

// Получение всех скриптов
export async function getAllScripts({ mode, search }: { mode?: string; search?: string } = {}): Promise<Script[]> {
  let url = "/api/scripts"
  const params = new URLSearchParams()

  if (mode) {
    params.append("mode", mode)
  }

  if (search) {
    params.append("search", search)
  }

  if (params.toString()) {
    url += `?${params.toString()}`
  }

  const response = await fetch(url, { cache: "no-store" })
  if (!response.ok) {
    throw new Error("Failed to fetch scripts")
  }
  return response.json()
}

// Получение последних N скриптов
export async function getLatestScripts(count: number): Promise<Script[]> {
  const response = await fetch(`/api/scripts?limit=${count}`, { cache: "no-store" })
  if (!response.ok) {
    throw new Error("Failed to fetch latest scripts")
  }
  return response.json()
}

// Получение скрипта по ID и увеличение счетчика просмотров
export async function getScriptById(id: string, incrementViews = true): Promise<Script | null> {
  const url = incrementViews ? `/api/scripts/${id}` : `/api/scripts/${id}?incrementViews=false`

  const response = await fetch(url, { cache: "no-store" })
  if (!response.ok) {
    if (response.status === 404) {
      return null
    }
    throw new Error("Failed to fetch script")
  }
  return response.json()
}

// Создание нового скрипта
export async function createScript(scriptData: Omit<Script, "id" | "createdAt" | "mode" | "views">): Promise<Script> {
  const response = await fetch("/api/scripts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: scriptData.title,
      description: scriptData.description,
      instructions: scriptData.instructions,
      code: scriptData.code,
      mode_id: scriptData.modeId,
      image_url: scriptData.image,
      created_by: scriptData.createdBy,
    }),
  })

  if (!response.ok) {
    throw new Error("Failed to create script")
  }

  return response.json()
}

// Обновление скрипта
export async function updateScript(
  id: string,
  scriptData: Partial<Omit<Script, "id" | "createdAt" | "views">>,
): Promise<Script> {
  const response = await fetch(`/api/scripts/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: scriptData.title,
      description: scriptData.description,
      instructions: scriptData.instructions,
      code: scriptData.code,
      mode_id: scriptData.modeId,
      image_url: scriptData.image,
    }),
  })

  if (!response.ok) {
    throw new Error("Failed to update script")
  }

  return response.json()
}

// Удаление скрипта
export async function deleteScript(id: string): Promise<void> {
  const response = await fetch(`/api/scripts/${id}`, {
    method: "DELETE",
  })

  if (!response.ok) {
    throw new Error("Failed to delete script")
  }
}

