import { query } from "../lib/db.server"

async function checkDatabaseStructure() {
  try {
    // Проверяем структуру таблицы scripts
    console.log("Checking scripts table structure...")
    const scriptsTableInfo = await query("DESCRIBE scripts")
    console.log("Scripts table structure:", scriptsTableInfo)

    // Проверяем структуру таблицы modes
    console.log("\nChecking modes table structure...")
    const modesTableInfo = await query("DESCRIBE modes")
    console.log("Modes table structure:", modesTableInfo)

    // Проверяем существующие режимы
    console.log("\nChecking existing modes...")
    const modes = await query("SELECT id, name FROM modes")
    console.log("Existing modes:", modes)

    process.exit(0)
  } catch (error) {
    console.error("Error checking database structure:", error)
    process.exit(1)
  }
}

checkDatabaseStructure()

