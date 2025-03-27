import { NextResponse } from "next/server"
import { query } from "@/lib/db.server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const mode = searchParams.get("mode") || undefined
    const search = searchParams.get("search") || undefined

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
    return NextResponse.json(results)
  } catch (error) {
    console.error("Error fetching scripts:", error)
    return NextResponse.json({ error: "Failed to fetch scripts", details: String(error) }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    console.log("Received script data:", data)

    const { title, description, code, mode_id, image_url, created_by } = data

    if (!title || !code || !mode_id) {
      return NextResponse.json({ error: "Title, code, and mode_id are required" }, { status: 400 })
    }

    // Проверяем, существует ли режим с указанным ID
    const modeCheckResult = await query("SELECT id FROM modes WHERE id = ?", [mode_id])
    const modes = modeCheckResult as any[]

    if (modes.length === 0) {
      return NextResponse.json({ error: `Mode with ID ${mode_id} does not exist` }, { status: 400 })
    }

    // Вставляем новый скрипт напрямую
    const insertSql = `
      INSERT INTO scripts (title, description, code, mode_id, image_url, created_by, views) 
      VALUES (?, ?, ?, ?, ?, ?, 0)
    `

    const insertResult = await query(insertSql, [
      title,
      description || "",
      code,
      mode_id,
      image_url || null,
      created_by || "Администратор",
    ])

    const insertId = (insertResult as any).insertId

    // Получаем созданный скрипт
    const newScript = await query("SELECT * FROM scripts WHERE id = ?", [insertId])
    const scripts = newScript as any[]

    if (scripts.length === 0) {
      return NextResponse.json({ error: "Script was created but could not be retrieved" }, { status: 500 })
    }

    return NextResponse.json(scripts[0], { status: 201 })
  } catch (error) {
    console.error("Error creating script:", error)
    return NextResponse.json(
      {
        error: "Failed to create script",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

