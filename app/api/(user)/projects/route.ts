export const dynamic = 'force-static';
export const revalidate = 60 * 60 *24;

import Project from "@/app/models/project";
import { NextResponse } from "next/server";
import connect_db from "@/config/db";

export async function GET() {
  try {
    await connect_db();

    const projects = await Project.find({ isActive: true }).sort({ createdAt: -1 }).exec();
    return NextResponse.json({ projects });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}
