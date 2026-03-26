export type Client = {
  _id: string
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
  createdAt: string
  updatedAt: string
  projectCount?: number
  documentCount?: number
  latestProjectAt?: string | null
  latestDocumentAt?: string | null
  recentProjects?: Array<{ _id: string; title: string; createdAt?: string }>
  recentDocuments?: Array<{ _id: string; title: string; createdAt?: string }>
}
