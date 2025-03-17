import type { MetadataRoute } from 'next';
import getProjectsAction from './actions/get-paginated-projects';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!process.env.NEXT_PUBLIC_SITE_URL) {
    throw new Error("Environment variable NEXT_PUBLIC_SITE_URL is not set.");
  }

  const allProjects = [];
  let page = 1;
  let hasMoreProjects = true;

  try {
    while (hasMoreProjects) {
      const response: string = await getProjectsAction({
        limit: 10,
        page: page,
      });

      const Projects = response ? JSON.parse(response) : [];
      allProjects.push(...Projects);

      // Stop fetching if fewer than `limit` Projects are returned
      hasMoreProjects = Projects.length === 10;
      page++;
    }
  } catch (error) {
    console.error("Error fetching Projects:", error);
  }

  const sitemapEntries: MetadataRoute.Sitemap = allProjects.map((project) => {

    return {
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/projects/${project._id}`,
      lastModified: new Date(project.updatedAt || project.createdAt || Date.now()),
      changeFrequency: "weekly",
      priority: 0.9
    };
  });

  const staticPages = [
    "contact",
    "projects",
    "services/autocad-drafting",
    "services/3d-elevation",
    "services/site-inspection",
    "services/interior-designing",
  ].map((page) => ({
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/${page}`,
    lastModified: new Date(),
    changeFrequency: "yearly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: `${process.env.NEXT_PUBLIC_SITE_URL}`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 1,
    },
    ...staticPages,
    ...sitemapEntries,
  ];
}
