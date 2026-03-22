import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto"

const TOKEN_SEPARATOR = "."
const HASH_SEPARATOR = ":"

function getDocumentSecret() {
  return process.env.DOCUMENT_ACCESS_SECRET || process.env.ADMIN_PASSWORD || "change-this-secret"
}

export function hashDocumentPassword(password: string) {
  const salt = randomBytes(16).toString("hex")
  const hash = scryptSync(password, salt, 64).toString("hex")
  return `${salt}${HASH_SEPARATOR}${hash}`
}

export function verifyDocumentPassword(password: string, storedHash: string) {
  const [salt, hash] = storedHash.split(HASH_SEPARATOR)
  if (!salt || !hash) return false

  const incoming = scryptSync(password, salt, 64)
  const expected = Buffer.from(hash, "hex")

  if (incoming.length !== expected.length) return false
  return timingSafeEqual(incoming, expected)
}

export function createDocumentAccessToken(accessKey: string, expiresAtMs: number) {
  const payload = `${accessKey}${TOKEN_SEPARATOR}${expiresAtMs}`
  const signature = createHmac("sha256", getDocumentSecret()).update(payload).digest("hex")
  return `${payload}${TOKEN_SEPARATOR}${signature}`
}

export function verifyDocumentAccessToken(token: string, expectedAccessKey: string) {
  const [accessKey, expiresAtRaw, signature] = token.split(TOKEN_SEPARATOR)
  if (!accessKey || !expiresAtRaw || !signature) return false
  if (accessKey !== expectedAccessKey) return false

  const payload = `${accessKey}${TOKEN_SEPARATOR}${expiresAtRaw}`
  const expectedSig = createHmac("sha256", getDocumentSecret()).update(payload).digest("hex")
  if (expectedSig.length !== signature.length) return false

  const validSig = timingSafeEqual(Buffer.from(expectedSig), Buffer.from(signature))
  if (!validSig) return false

  const expiresAt = Number(expiresAtRaw)
  if (!Number.isFinite(expiresAt)) return false

  return Date.now() < expiresAt
}

export function getDocumentAccessCookieName(accessKey: string) {
  return `doc_access_${accessKey}`
}

export function createDocumentAccessKey() {
  return randomBytes(12).toString("hex")
}
