import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST() {
  // Удаляем куки
  cookies().delete("auth_token")

  return NextResponse.json({ success: true })
}

