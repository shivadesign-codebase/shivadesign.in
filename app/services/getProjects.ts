import connect_db from '@/config/db';
import Project, { IProject } from '../models/project';

export interface GetProjectsOptions {
  primary_tag?: string;
  limit?: number;
  page?: number;
}

export const getProjects = async ({
  primary_tag,
  limit = 10,
  page = 1,
}: GetProjectsOptions): Promise<IProject[]> => {
  await connect_db();

  try {
    const query = primary_tag ? { primary_tag } : {};
    const skip = (page - 1) * limit;

    const projects = await Project.find(query).sort({ createdAt: -1 }).limit(limit).skip(skip).exec();

    return projects;
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
};
