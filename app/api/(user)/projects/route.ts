export const dynamic = "force-dynamic";

import Project from "@/app/models/project";
import { NextResponse } from "next/server";
import connect_db from "@/config/db";

export async function GET(req: Request) {
  try {
    await connect_db();

    const { searchParams } = new URL(req.url);

    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 6;
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "All";

    const skip = (page - 1) * limit;

    let query: any = { isActive: true };

    // category filter
    if (category !== "All") {
      query.category = category;
    }

    // search filter (search entire DB)
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
        { type: { $regex: search, $options: "i" } },
      ];
    }

    const projects = await Project.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Project.countDocuments(query);

    return NextResponse.json({
      projects,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });

  } catch (error) {
    console.error("Error fetching projects:", error);

    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}
