"use server"

import { query } from "@/lib/db.server"
import type { Mode } from "@/lib/types"
import "server-only"

// Получение всех режимов с подсчетом скриптов
export async function fetchAllModes(): Promise<Mode[]> {
  const sql = `
    SELECT m.*, COUNT(s.id) as scriptCount 
    FROM modes m 
    LEFT JOIN scripts s ON m.id = s.mode_id 
    GROUP BY m.id 
    ORDER BY m.created_at DESC
  `
  const results = await query(sql)

  // Преобразуем результаты для совместимости с клиентским кодом
  return (results as any[]).map((mode) => ({
    ...mode,
    scriptCount: mode.scriptCount || 0,
    image: mode.image_url,
    createdAt: mode.created_at,
    createdBy: mode.created_by,
  }))
}

// Получение режима по ID
export async function fetchModeById(id: string): Promise<Mode | null> {
  const sql = `
    SELECT m.*, COUNT(s.id) as scriptCount 
    FROM modes m 
    LEFT JOIN scripts s ON m.id = s.mode_id 
    WHERE m.id = ? 
    GROUP BY m.id
  `
  const results = await query(sql, [id])
  const modes = results as any[]

  if (modes.length === 0) {
    return null
  }

  // Преобразуем результат для совместимости с клиентским кодом
  const mode = modes[0]
  return {
    ...mode,
    scriptCount: mode.scriptCount || 0,
    image: mode.image_url,
    createdAt: mode.created_at,
    createdBy: mode.created_by,
  }
}

// Создание нового режима
export async function createNewMode(modeData: Omit<Mode, "id" | "scriptCount">): Promise<Mode> {
  const { name, description, image, createdBy } = modeData

  const sql = `
    INSERT INTO modes (name, description, image_url, created_by) 
    VALUES (?, ?, ?, ?)
  `

  const result = await query(sql, [name, description, image, createdBy])
  const insertId = (result as any).insertId

  // Получаем созданный режим
  return (await fetchModeById(insertId.toString())) as Mode
}

// Обновление режима
export async function updateExistingMode(
  id: string,
  modeData: Partial<Omit<Mode, "id" | "scriptCount" | "createdBy" | "createdAt">>,
): Promise<Mode> {
  const { name, description, image } = modeData

  let sql = "UPDATE modes SET "
  const params = []

  if (name !== undefined) {
    sql += "name = ?, "
    params.push(name)
  }

  if (description !== undefined) {
    sql += "description = ?, "
    params.push(description)
  }

  if (image !== undefined) {
    sql += "image_url = ?, "
    params.push(image)
  }

  // Удаляем последнюю запятую и пробел
  sql = sql.slice(0, -2)

  sql += " WHERE id = ?"
  params.push(id)

  await query(sql, params)

  // Получаем обновленный режим
  const updatedMode = await fetchModeById(id)
  if (!updatedMode) {
    throw new Error("Mode not found after update")
  }

  return updatedMode
}

// Удаление режима
export async function deleteExistingMode(id: string): Promise<void> {
  const sql = "DELETE FROM modes WHERE id = ?"
  await query(sql, [id])
}

