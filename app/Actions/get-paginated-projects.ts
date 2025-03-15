'use server';

import { IProject } from "../models/project";
import { getProjects } from "../services/getProjects";

interface GetProjectsActionProps {
  primary_tag?: string;
  limit?: number;
  page?: number;
}

const getProjectsAction = async ({ primary_tag, limit = 10, page = 1 }: GetProjectsActionProps): Promise<string> => {
  try {
    const projects: IProject[] = await getProjects({
      primary_tag,
      limit,
      page,
    });

    return JSON.stringify(projects);
  } catch (error) {
    console.error("Error in getProjectsAction:", error);
    return JSON.stringify({
      error: error instanceof Error ? error.message : "An unknown error occurred.",
    });
  }
};

export default getProjectsAction;
