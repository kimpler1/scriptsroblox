import { query } from "../lib/db.server"

async function testInsertScript() {
  try {
    console.log("Testing script insertion...")

    // Получаем ID первого режима
    const modes = await query("SELECT id FROM modes LIMIT 1")
    if ((modes as any[]).length === 0) {
      console.error("No modes found in the database. Please create a mode first.")
      process.exit(1)
    }

    const modeId = (modes as any[])[0].id
    console.log(`Using mode ID: ${modeId}`)

    // Пробуем вставить тестовый скрипт
    const insertSql = `
      INSERT INTO scripts (title, description, code, mode_id, created_by, views) 
      VALUES (?, ?, ?, ?, ?, 0)
    `

    const result = await query(insertSql, [
      "Test Script",
      "This is a test script",
      "print('Hello, World!')",
      modeId,
      "Test User",
    ])

    const insertId = (result as any).insertId
    console.log(`Test script inserted with ID: ${insertId}`)

    // Проверяем, что скрипт был успешно вставлен
    const script = await query("SELECT * FROM scripts WHERE id = ?", [insertId])
    console.log("Inserted script:", script)

    // Удаляем тестовый скрипт
    await query("DELETE FROM scripts WHERE id = ?", [insertId])
    console.log("Test script deleted.")

    console.log("Script insertion test completed successfully.")
    process.exit(0)
  } catch (error) {
    console.error("Error testing script insertion:", error)
    process.exit(1)
  }
}

testInsertScript()

