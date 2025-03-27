import { query } from "../lib/db.server"

async function testConnection() {
  try {
    const result = await query("SELECT 1 + 1 as sum")
    console.log("Database connection successful!")
    console.log("Test query result:", result)
    process.exit(0)
  } catch (error) {
    console.error("Database connection failed:", error)
    process.exit(1)
  }
}

testConnection()

