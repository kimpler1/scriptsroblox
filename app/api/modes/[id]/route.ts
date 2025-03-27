import { NextResponse } from "next/server"
import { fetchModeById, updateExistingMode, deleteExistingMode } from "@/app/actions/modes-actions"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const mode = await fetchModeById(params.id)

    if (!mode) {
      return NextResponse.json({ error: "Mode not found" }, { status: 404 })
    }

    return NextResponse.json(mode)
  } catch (error) {
    console.error("Error fetching mode:", error)
    return NextResponse.json({ error: "Failed to fetch mode" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const data = await request.json()
    const { name, description, image_url } = data

    const updatedMode = await updateExistingMode(params.id, {
      name,
      description,
      image: image_url,
    })

    return NextResponse.json(updatedMode)
  } catch (error) {
    console.error("Error updating mode:", error)
    return NextResponse.json({ error: "Failed to update mode" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await deleteExistingMode(params.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting mode:", error)
    return NextResponse.json({ error: "Failed to delete mode" }, { status: 500 })
  }
}

