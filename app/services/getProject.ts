import connect_db from '@/config/db'
import Project, { IProject } from '../models/project'

export const getProject = async (id: string): Promise<IProject | null> => {
  await connect_db()

  try {
    const project = await Project.findById(id).exec()
    return project
  } catch (error) {
    console.error("Error fetching project:", error)
    return null
  }
}
