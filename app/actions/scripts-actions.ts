"use server"

import { query } from "@/lib/db.server"
import type { Script } from "@/lib/types"
import "server-only"

// Получение всех скриптов с возможностью фильтрации
export async function fetchAllScripts({ mode, search }: { mode?: string; search?: string } = {}): Promise<Script[]> {
  let sql = `
    SELECT s.*, m.name as modeName 
    FROM scripts s 
    LEFT JOIN modes m ON s.mode_id = m.id 
    WHERE 1=1
  `
  const params = []

  if (mode) {
    sql += " AND s.mode_id = ?"
    params.push(mode)
  }

  if (search) {
    sql += " AND (s.title LIKE ? OR s.description LIKE ?)"
    params.push(`%${search}%`, `%${search}%`)
  }

  sql += " ORDER BY s.created_at DESC"

  const results = await query(sql, params)

  // Преобразуем результаты для совместимости с клиентским кодом
  return (results as any[]).map((script) => ({
    ...script,
    image: script.image_url,
    modeId: script.mode_id,
    mode: {
      id: script.mode_id,
      name: script.modeName || "Неизвестный режим",
    },
    createdAt: script.created_at,
    createdBy: script.created_by,
  }))
}

// Получение скрипта по ID и увеличение счетчика просмотров
export async function fetchScriptById(id: string, incrementViews = true): Promise<Script | null> {
  // Если нужно увеличить счетчик просмотров
  if (incrementViews) {
    await query("UPDATE scripts SET views = views + 1 WHERE id = ?", [id])
  }

  const sql = `
    SELECT s.*, m.name as modeName 
    FROM scripts s 
    LEFT JOIN modes m ON s.mode_id = m.id 
    WHERE s.id = ?
  `
  const results = await query(sql, [id])
  const scripts = results as any[]

  if (scripts.length === 0) {
    return null
  }

  // Преобразуем результат для совместимости с клиентским кодом
  const script = scripts[0]
  return {
    ...script,
    image: script.image_url,
    modeId: script.mode_id,
    mode: {
      id: script.mode_id,
      name: script.modeName || "Неизвестный режим",
    },
    createdAt: script.created_at,
    createdBy: script.created_by,
  }
}

// Создание нового скрипта
// Проверим функцию createNewScript, чтобы убедиться, что она правильно обрабатывает все поля

// Убедимся, что функция правильно обрабатывает поля modeId и image
export async function createNewScript(
  scriptData: Omit<Script, "id" | "createdAt" | "mode" | "views">,
): Promise<Script> {
  const { title, description, instructions, code, modeId, image, createdBy } = scriptData

  // Добавим логирование для отладки
  console.log("Creating script with data:", {
    title,
    description,
    instructions,
    code,
    modeId,
    image,
    createdBy,
  })

  const sql = `
    INSERT INTO scripts (title, description, instructions, code, mode_id, image_url, created_by) 
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `

  try {
    const result = await query(sql, [
      title,
      description,
      instructions || "", // Обеспечиваем, что instructions не будет undefined
      code,
      modeId,
      image || null, // Обеспечиваем, что image не будет undefined
      createdBy || "Администратор", // Обеспечиваем, что createdBy не будет undefined
    ])

    const insertId = (result as any).insertId

    // Получаем созданный скрипт
    return (await fetchScriptById(insertId.toString(), false)) as Script
  } catch (error) {
    console.error("Error in createNewScript:", error)
    throw error
  }
}

// Обновление скрипта
export async function updateExistingScript(
  id: string,
  scriptData: Partial<Omit<Script, "id" | "createdAt" | "views">>,
): Promise<Script> {
  const { title, description, instructions, code, modeId, image } = scriptData

  let sql = "UPDATE scripts SET "
  const params = []

  if (title !== undefined) {
    sql += "title = ?, "
    params.push(title)
  }

  if (description !== undefined) {
    sql += "description = ?, "
    params.push(description)
  }

  if (instructions !== undefined) {
    sql += "instructions = ?, "
    params.push(instructions)
  }

  if (code !== undefined) {
    sql += "code = ?, "
    params.push(code)
  }

  if (modeId !== undefined) {
    sql += "mode_id = ?, "
    params.push(modeId)
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

  // Получаем обновленный скрипт
  const updatedScript = await fetchScriptById(id, false)
  if (!updatedScript) {
    throw new Error("Script not found after update")
  }

  return updatedScript
}

// Удаление скрипта
export async function deleteExistingScript(id: string): Promise<void> {
  const sql = "DELETE FROM scripts WHERE id = ?"
  await query(sql, [id])
}

