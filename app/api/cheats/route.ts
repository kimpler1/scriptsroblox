import { NextResponse } from "next/server"
import { fetchAllCheats, createNewCheat } from "@/app/actions/cheats-actions"

export async function GET() {
  try {
    const cheats = await fetchAllCheats()
    return NextResponse.json(cheats)
  } catch (error) {
    console.error("Error fetching cheats:", error)
    return NextResponse.json({ error: "Failed to fetch cheats" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    console.log("Received cheat data:", data)

    const {
      name,
      description,
      full_description,
      image_url,
      type,
      color,
      download_url_pc,
      download_url_apk,
      created_by,
    } = data

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 })
    }

    const newCheat = await createNewCheat({
      name,
      description,
      fullDescription: full_description,
      image: image_url,
      type,
      color,
      downloadUrlPC: download_url_pc,
      downloadUrlAPK: download_url_apk,
      createdBy: created_by,
    })

    console.log("Created new cheat:", newCheat)
    return NextResponse.json(newCheat, { status: 201 })
  } catch (error) {
    console.error("Error creating cheat:", error)
    return NextResponse.json(
      { error: "Failed to create cheat: " + (error instanceof Error ? error.message : "Unknown error") },
      { status: 500 },
    )
  }
}

