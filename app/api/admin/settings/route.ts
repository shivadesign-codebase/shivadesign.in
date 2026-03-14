import { NextResponse } from "next/server"
import connect_db from "@/config/db"
import Settings from "@/app/models/settings";

export async function GET() {
  await connect_db()

  let settings = await Settings.findOne()

  if (!settings) {
    settings = await Settings.create({})
  }

  return NextResponse.json(settings)
}

export async function POST(req: Request) {
  await connect_db()

  const body = await req.json()

  const settings = await Settings.findOneAndUpdate(
    {},
    body,
    { new: true, upsert: true }
  )

  return NextResponse.json(settings)
}
