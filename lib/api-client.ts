import type { Mode, Script, Cheat } from "@/lib/types"

// API для режимов
export async function fetchModes(): Promise<Mode[]> {
  const response = await fetch("/api/modes")
  if (!response.ok) {
    throw new Error("Failed to fetch modes")
  }
  return response.json()
}

export async function fetchModeById(id: string): Promise<Mode> {
  const response = await fetch(`/api/modes/${id}`)
  if (!response.ok) {
    throw new Error("Failed to fetch mode")
  }
  return response.json()
}

// API для скриптов
export async function fetchScripts(options: { mode?: string; search?: string } = {}): Promise<Script[]> {
  const params = new URLSearchParams()
  if (options.mode) params.append("mode", options.mode)
  if (options.search) params.append("search", options.search)

  const response = await fetch(`/api/scripts?${params.toString()}`)
  if (!response.ok) {
    throw new Error("Failed to fetch scripts")
  }
  return response.json()
}

export async function fetchScriptById(id: string, incrementViews = true): Promise<Script> {
  const params = new URLSearchParams()
  if (!incrementViews) params.append("incrementViews", "false")

  const response = await fetch(`/api/scripts/${id}?${params.toString()}`)
  if (!response.ok) {
    throw new Error("Failed to fetch script")
  }
  return response.json()
}

// API для читов
export async function fetchCheats(): Promise<Cheat[]> {
  const response = await fetch("/api/cheats")
  if (!response.ok) {
    throw new Error("Failed to fetch cheats")
  }
  return response.json()
}

export async function fetchCheatById(id: string): Promise<Cheat> {
  const response = await fetch(`/api/cheats/${id}`)
  if (!response.ok) {
    throw new Error("Failed to fetch cheat")
  }
  return response.json()
}

