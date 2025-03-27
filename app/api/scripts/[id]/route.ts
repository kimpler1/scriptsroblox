import { NextResponse } from "next/server"
import { fetchScriptById, updateExistingScript, deleteExistingScript } from "@/app/actions/scripts-actions"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { searchParams } = new URL(request.url)
    const incrementViews = searchParams.get("incrementViews") !== "false"

    const script = await fetchScriptById(params.id, incrementViews)

    if (!script) {
      return NextResponse.json({ error: "Script not found" }, { status: 404 })
    }

    return NextResponse.json(script)
  } catch (error) {
    console.error("Error fetching script:", error)
    return NextResponse.json({ error: "Failed to fetch script" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const data = await request.json()
    const { title, description, instructions, code, mode_id, image_url } = data

    const updatedScript = await updateExistingScript(params.id, {
      title,
      description,
      instructions,
      code,
      modeId: mode_id,
      image: image_url,
    })

    return NextResponse.json(updatedScript)
  } catch (error) {
    console.error("Error updating script:", error)
    return NextResponse.json({ error: "Failed to update script" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await deleteExistingScript(params.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting script:", error)
    return NextResponse.json({ error: "Failed to delete script" }, { status: 500 })
  }
}

