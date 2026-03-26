import type { PipelineStage } from "mongoose"

import Client from "@/app/models/client"

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

export async function searchClientsWithSummary(search: string, limit = 20) {
  const trimmedSearch = search.trim()
  const regex = trimmedSearch ? new RegExp(escapeRegex(trimmedSearch), "i") : null

  const pipeline: PipelineStage[] = [
    {
      $lookup: {
        from: "projects",
        localField: "_id",
        foreignField: "clientId",
        as: "projects",
      },
    },
    {
      $lookup: {
        from: "shareddocuments",
        localField: "_id",
        foreignField: "clientId",
        as: "documents",
      },
    },
    {
      $addFields: {
        projectCount: { $size: "$projects" },
        documentCount: { $size: "$documents" },
        latestProjectAt: { $max: "$projects.createdAt" },
        latestDocumentAt: { $max: "$documents.createdAt" },
        projectTitlesText: {
          $reduce: {
            input: "$projects.title",
            initialValue: "",
            in: { $concat: ["$$value", " ", { $ifNull: ["$$this", ""] }] },
          },
        },
        documentTitlesText: {
          $reduce: {
            input: "$documents.title",
            initialValue: "",
            in: { $concat: ["$$value", " ", { $ifNull: ["$$this", ""] }] },
          },
        },
      },
    },
  ]

  if (regex) {
    pipeline.push({
      $match: {
        $or: [
          { name: { $regex: regex } },
          { mobile: { $regex: regex } },
          { email: { $regex: regex } },
          { company: { $regex: regex } },
          { addressLine1: { $regex: regex } },
          { addressLine2: { $regex: regex } },
          { city: { $regex: regex } },
          { state: { $regex: regex } },
          { postalCode: { $regex: regex } },
          { projectTitlesText: { $regex: regex } },
          { documentTitlesText: { $regex: regex } },
        ],
      },
    })
  }

  pipeline.push(
    { $sort: { updatedAt: -1, createdAt: -1 } },
    { $limit: limit },
    {
      $project: {
        _id: 1,
        name: 1,
        mobile: 1,
        email: 1,
        company: 1,
        addressLine1: 1,
        addressLine2: 1,
        city: 1,
        state: 1,
        postalCode: 1,
        notes: 1,
        createdAt: 1,
        updatedAt: 1,
        projectCount: 1,
        documentCount: 1,
        latestProjectAt: 1,
        latestDocumentAt: 1,
        recentProjects: { $slice: ["$projects", 3] },
        recentDocuments: { $slice: ["$documents", 3] },
      },
    }
  )

  return await Client.aggregate(pipeline)
}
