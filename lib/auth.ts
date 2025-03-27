import { query } from "@/lib/db.server"
import type { User } from "@/lib/types"
import bcrypt from "bcryptjs"
import "server-only"

// Получение пользователя по имени пользователя
export async function getUserByUsername(username: string): Promise<User | null> {
  const sql = "SELECT * FROM users WHERE username = ?"
  const results = await query(sql, [username])
  const users = results as User[]

  return users.length > 0 ? users[0] : null
}

// Проверка учетных данных пользователя
export async function verifyUserCredentials(username: string, password: string): Promise<User | null> {
  const user = await getUserByUsername(username)

  if (!user) {
    return null
  }

  // Проверяем пароль
  const passwordMatch = await bcrypt.compare(password, user.password)

  if (!passwordMatch) {
    return null
  }

  // Не возвращаем пароль
  const { password: _, ...userWithoutPassword } = user
  return userWithoutPassword as User
}

// Создание нового пользователя
export async function createUser(userData: { username: string; password: string; isAdmin?: boolean }): Promise<User> {
  const { username, password, isAdmin = false } = userData

  // Проверяем, существует ли пользователь
  const existingUser = await getUserByUsername(username)
  if (existingUser) {
    throw new Error("Username already exists")
  }

  // Хешируем пароль
  const hashedPassword = await bcrypt.hash(password, 10)

  const sql = "INSERT INTO users (username, password, is_admin) VALUES (?, ?, ?)"
  const result = await query(sql, [username, hashedPassword, isAdmin])

  const insertId = (result as any).insertId

  // Возвращаем созданного пользователя без пароля
  return {
    id: insertId,
    username,
    is_admin: isAdmin,
    created_at: new Date().toISOString(),
  }
}

