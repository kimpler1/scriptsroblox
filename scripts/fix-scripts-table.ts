import { query } from "../lib/db.server"

async function fixScriptsTable() {
  try {
    console.log("Checking scripts table structure...")

    // Проверяем, существует ли таблица scripts
    const tables = await query("SHOW TABLES LIKE 'scripts'")
    if ((tables as any[]).length === 0) {
      console.log("Scripts table does not exist. Creating...")

      // Создаем таблицу scripts
      await query(`
        CREATE TABLE scripts (
          id INT AUTO_INCREMENT PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          instructions TEXT,
          code TEXT NOT NULL,
          mode_id INT NOT NULL,
          image_url TEXT,
          views INT DEFAULT 0,
          created_by VARCHAR(255),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (mode_id) REFERENCES modes(id)
        )
      `)

      console.log("Scripts table created successfully.")
    } else {
      console.log("Scripts table exists. Checking structure...")

      // Проверяем структуру таблицы
      const columns = await query("SHOW COLUMNS FROM scripts")
      console.log("Current columns:", columns)

      // Проверяем, есть ли все необходимые колонки
      const columnNames = (columns as any[]).map((col) => col.Field)

      if (!columnNames.includes("title")) {
        console.log("Adding title column...")
        await query("ALTER TABLE scripts ADD COLUMN title VARCHAR(255) NOT NULL")
      }

      if (!columnNames.includes("description")) {
        console.log("Adding description column...")
        await query("ALTER TABLE scripts ADD COLUMN description TEXT")
      }

      if (!columnNames.includes("instructions")) {
        console.log("Adding instructions column...")
        await query("ALTER TABLE scripts ADD COLUMN instructions TEXT")
      }

      if (!columnNames.includes("code")) {
        console.log("Adding code column...")
        await query("ALTER TABLE scripts ADD COLUMN code TEXT NOT NULL")
      }

      if (!columnNames.includes("mode_id")) {
        console.log("Adding mode_id column...")
        await query("ALTER TABLE scripts ADD COLUMN mode_id INT NOT NULL")
        await query("ALTER TABLE scripts ADD FOREIGN KEY (mode_id) REFERENCES modes(id)")
      }

      if (!columnNames.includes("image_url")) {
        console.log("Adding image_url column...")
        await query("ALTER TABLE scripts ADD COLUMN image_url TEXT")
      }

      if (!columnNames.includes("views")) {
        console.log("Adding views column...")
        await query("ALTER TABLE scripts ADD COLUMN views INT DEFAULT 0")
      }

      if (!columnNames.includes("created_by")) {
        console.log("Adding created_by column...")
        await query("ALTER TABLE scripts ADD COLUMN created_by VARCHAR(255)")
      }

      if (!columnNames.includes("created_at")) {
        console.log("Adding created_at column...")
        await query("ALTER TABLE scripts ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
      }

      console.log("Scripts table structure checked and fixed if needed.")
    }

    // Проверяем существующие режимы
    console.log("\nChecking existing modes...")
    const modes = await query("SELECT id, name FROM modes")
    console.log("Existing modes:", modes)

    // Проверяем существующие скрипты
    console.log("\nChecking existing scripts...")
    const scripts = await query("SELECT id, title, mode_id FROM scripts")
    console.log("Existing scripts:", scripts)

    console.log("\nDatabase check and fix completed successfully.")
    process.exit(0)
  } catch (error) {
    console.error("Error fixing database structure:", error)
    process.exit(1)
  }
}

fixScriptsTable()

