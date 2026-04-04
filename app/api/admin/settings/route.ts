import { NextResponse } from "next/server"
import connect_db from "@/config/db"
import Settings from "@/app/models/settings";

export async function GET() {
  await connect_db()

  let settings = await Settings.findOne().sort({ _id: -1 })

  if (!settings) {
    settings = await Settings.create({})
  }

  return NextResponse.json(settings)
}

export async function POST(req: Request) {
  await connect_db()

  const body = await req.json()
  const payload = {
    introVideoLink: typeof body?.introVideoLink === "string" ? body.introVideoLink : "",
    marqueeText: typeof body?.marqueeText === "string" ? body.marqueeText : "",
    theme: typeof body?.theme === "string" ? body.theme : "default",
    showPricing: Boolean(body?.showPricing),
    enablePricingPage: Boolean(body?.enablePricingPage),
  }

  let settings = await Settings.findOne().sort({ _id: -1 })

  if (!settings) {
    settings = await Settings.create({})
  }

  settings.introVideoLink = payload.introVideoLink
  settings.marqueeText = payload.marqueeText
  settings.theme = payload.theme
  settings.showPricing = payload.showPricing
  settings.enablePricingPage = payload.enablePricingPage

  await settings.save()

  return NextResponse.json(settings)
}
