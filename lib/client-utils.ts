import mongoose from "mongoose"

import Client from "@/app/models/client"

export type ClientSnapshot = {
  clientId: string
  clientName: string
  clientMobile: string | null
  clientEmail: string | null
}

export type ClientFormPayload = {
  name: string
  mobile?: string | null
  email?: string | null
  addressLine1?: string | null
  addressLine2?: string | null
  city?: string | null
  state?: string | null
  postalCode?: string | null
  company?: string | null
  notes?: string | null
}

export function normalizeOptionalString(value: unknown) {
  if (typeof value !== "string") return null
  const normalized = value.trim()
  return normalized ? normalized : null
}

export function normalizeClientPayload(payload: Record<string, unknown>): ClientFormPayload {
  const name = typeof payload.name === "string" ? payload.name.trim() : ""

  return {
    name,
    mobile: normalizeOptionalString(payload.mobile),
    email: normalizeOptionalString(payload.email)?.toLowerCase() ?? null,
    addressLine1: normalizeOptionalString(payload.addressLine1),
    addressLine2: normalizeOptionalString(payload.addressLine2),
    city: normalizeOptionalString(payload.city),
    state: normalizeOptionalString(payload.state),
    postalCode: normalizeOptionalString(payload.postalCode),
    company: normalizeOptionalString(payload.company),
    notes: normalizeOptionalString(payload.notes),
  }
}

export async function getClientSnapshot(clientId: string): Promise<ClientSnapshot> {
  if (!mongoose.isValidObjectId(clientId)) {
    throw new Error("Invalid client ID")
  }

  const client = await Client.findById(clientId)
    .select("_id name mobile email")
    .lean() as { _id: mongoose.Types.ObjectId | string; name: string; mobile?: string | null; email?: string | null } | null

  if (!client) {
    throw new Error("Client not found")
  }

  return {
    clientId: String(client._id),
    clientName: client.name,
    clientMobile: client.mobile ?? null,
    clientEmail: client.email ?? null,
  }
}

export async function findPotentialClientDuplicate(payload: ClientFormPayload) {
  const orConditions: Record<string, unknown>[] = []

  if (payload.mobile) {
    orConditions.push({ mobile: payload.mobile })
  }

  if (payload.email) {
    orConditions.push({ email: payload.email })
  }

  if (orConditions.length === 0) {
    return null
  }

  return await Client.findOne({ $or: orConditions }).select("_id name mobile email").lean()
}
