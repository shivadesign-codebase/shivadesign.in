'use server';

import { IProject } from "../models/project";
import { getProject } from "../services/getProject";

const getProjectAction = async (id: string): Promise<string> => {
  try {
    const project: IProject | null = await getProject(id);

    return JSON.stringify(project);
  } catch (error) {
    console.error("Error in getProjectAction:", error);
    return JSON.stringify({
      error: error instanceof Error ? error.message : "An unknown error occurred.",
    });
  }
};

export default getProjectAction;
