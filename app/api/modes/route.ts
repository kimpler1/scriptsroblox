import { NextResponse } from "next/server"
import { fetchAllModes, createNewMode } from "@/app/actions/modes-actions"

export async function GET() {
  try {
    const modes = await fetchAllModes()
    return NextResponse.json(modes)
  } catch (error) {
    console.error("Error fetching modes:", error)
    return NextResponse.json({ error: "Failed to fetch modes" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const { name, description, image_url, created_by } = data

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 })
    }

    const newMode = await createNewMode({
      name,
      description,
      image: image_url,
      createdBy: created_by,
    })

    return NextResponse.json(newMode, { status: 201 })
  } catch (error) {
    console.error("Error creating mode:", error)
    return NextResponse.json({ error: "Failed to create mode" }, { status: 500 })
  }
}

