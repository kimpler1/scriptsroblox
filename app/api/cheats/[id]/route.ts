import { NextResponse } from "next/server"
import { fetchCheatById, updateExistingCheat, deleteExistingCheat } from "@/app/actions/cheats-actions"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const cheat = await fetchCheatById(params.id)

    if (!cheat) {
      return NextResponse.json({ error: "Cheat not found" }, { status: 404 })
    }

    return NextResponse.json(cheat)
  } catch (error) {
    console.error("Error fetching cheat:", error)
    return NextResponse.json({ error: "Failed to fetch cheat" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const data = await request.json()
    const { name, description, full_description, image_url, type, color, download_url_pc, download_url_apk } = data

    const updatedCheat = await updateExistingCheat(params.id, {
      name,
      description,
      fullDescription: full_description,
      image: image_url,
      type,
      color,
      downloadUrlPC: download_url_pc,
      downloadUrlAPK: download_url_apk,
    })

    return NextResponse.json(updatedCheat)
  } catch (error) {
    console.error("Error updating cheat:", error)
    return NextResponse.json({ error: "Failed to update cheat" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await deleteExistingCheat(params.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting cheat:", error)
    return NextResponse.json({ error: "Failed to delete cheat" }, { status: 500 })
  }
}

