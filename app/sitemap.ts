import type { MetadataRoute } from 'next';
import getProjectsAction from './Actions/get-paginated-projects';
import connect_db from '@/config/db';
import Blog from '@/app/models/blog';

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
    "about",
    "contact",
    "projects",
    "blogs",
    // service pages
    "services",
    "services/autocad-drafting",
    "services/3d-elevation",
    "services/interior-designing",
    "services/vastu-consultation",
    "services/construction-estimate",
    "services/map-approval",
  ].map((page) => ({
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/${page}`,
    lastModified: new Date(),
    changeFrequency: "yearly" as const,
    priority: 0.8,
  }));

  // Fetch all published blog posts for dynamic sitemap entries
  let blogEntries: MetadataRoute.Sitemap = [];
  try {
    await connect_db();
    const blogs = await Blog.find({ isPublished: true })
      .select("_id updatedAt createdAt")
      .lean() as { _id: any; updatedAt?: Date; createdAt?: Date }[];

    blogEntries = blogs.map((blog) => ({
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/blogs/${blog._id.toString()}`,
      lastModified: new Date(blog.updatedAt ?? blog.createdAt ?? Date.now()),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));
  } catch (error) {
    console.error("Error fetching blogs for sitemap:", error);
  }

  return [
    {
      url: `${process.env.NEXT_PUBLIC_SITE_URL}`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 1,
    },
    ...staticPages,
    ...sitemapEntries,
    ...blogEntries,
  ];
}
