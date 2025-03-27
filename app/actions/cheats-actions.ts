"use server"

import { query } from "@/lib/db.server"
import type { Cheat } from "@/lib/types"
import "server-only"

// Получение всех читов
export async function getAllCheats(): Promise<Cheat[]> {
  const sql = "SELECT * FROM cheats ORDER BY created_at DESC"
  const results = await query(sql)

  // Преобразуем результаты для совместимости с клиентским кодом
  return (results as any[]).map((cheat) => ({
    ...cheat,
    fullDescription: cheat.full_description,
    downloadUrlPC: cheat.download_url_pc,
    downloadUrlAPK: cheat.download_url_apk,
    createdAt: cheat.created_at,
    createdBy: cheat.created_by,
  }))
}

// Получение чита по ID
export async function getCheatById(id: string): Promise<Cheat | null> {
  const sql = "SELECT * FROM cheats WHERE id = ?"
  const results = await query(sql, [id])
  const cheats = results as any[]

  if (cheats.length === 0) {
    return null
  }

  // Преобразуем результат для совместимости с клиентским кодом
  const cheat = cheats[0]
  return {
    ...cheat,
    fullDescription: cheat.full_description,
    downloadUrlPC: cheat.download_url_pc,
    downloadUrlAPK: cheat.download_url_apk,
    createdAt: cheat.created_at,
    createdBy: cheat.created_by,
  }
}

// Создание нового чита
export async function createCheat(cheatData: Omit<Cheat, "id">): Promise<Cheat> {
  const { name, description, fullDescription, image, type, color, downloadUrlPC, downloadUrlAPK, createdBy } = cheatData

  const sql = `
    INSERT INTO cheats (
      name, description, full_description, image_url, 
      type, color, download_url_pc, download_url_apk, created_by
    ) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `

  const result = await query(sql, [
    name,
    description,
    fullDescription,
    image,
    type,
    color,
    downloadUrlPC,
    downloadUrlAPK,
    createdBy,
  ])

  const insertId = (result as any).insertId

  // Получаем созданный чит
  return (await getCheatById(insertId.toString())) as Cheat
}

// Обновление чита
export async function updateCheat(id: string, cheatData: Partial<Omit<Cheat, "id" | "createdAt">>): Promise<Cheat> {
  const { name, description, fullDescription, image, type, color, downloadUrlPC, downloadUrlAPK } = cheatData

  let sql = "UPDATE cheats SET "
  const params = []

  if (name !== undefined) {
    sql += "name = ?, "
    params.push(name)
  }

  if (description !== undefined) {
    sql += "description = ?, "
    params.push(description)
  }

  if (fullDescription !== undefined) {
    sql += "full_description = ?, "
    params.push(fullDescription)
  }

  if (image !== undefined) {
    sql += "image_url = ?, "
    params.push(image)
  }

  if (type !== undefined) {
    sql += "type = ?, "
    params.push(type)
  }

  if (color !== undefined) {
    sql += "color = ?, "
    params.push(color)
  }

  if (downloadUrlPC !== undefined) {
    sql += "download_url_pc = ?, "
    params.push(downloadUrlPC)
  }

  if (downloadUrlAPK !== undefined) {
    sql += "download_url_apk = ?, "
    params.push(downloadUrlAPK)
  }

  // Удаляем последнюю запятую и пробел
  sql = sql.slice(0, -2)

  sql += " WHERE id = ?"
  params.push(id)

  await query(sql, params)

  // Получаем обновленный чит
  const updatedCheat = await getCheatById(id)
  if (!updatedCheat) {
    throw new Error("Cheat not found after update")
  }

  return updatedCheat
}

// Удаление чита
export async function deleteCheat(id: string): Promise<void> {
  const sql = "DELETE FROM cheats WHERE id = ?"
  await query(sql, [id])
}

// Экспортируем функции с альтернативными именами для совместимости
export const fetchCheatById = getCheatById
export const updateExistingCheat = updateCheat
export const deleteExistingCheat = deleteCheat
export const fetchAllCheats = getAllCheats
export const createNewCheat = createCheat

