import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { email, password } = await req.json()

  if (
    email === process.env.ADMIN_EMAIL &&
    password === process.env.ADMIN_PASSWORD
  ) {
    const response = NextResponse.json({ success: true })

    response.cookies.set("admin_token", "logged_in", {
      httpOnly: true,
      secure: true,
      path: "/",
      maxAge: 60 * 60 * 24,
    })

    return response
  }

  return NextResponse.json(
    { error: "Invalid credentials" },
    { status: 401 }
  )
}
