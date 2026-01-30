import type { MetadataRoute } from 'next';
import { getApiBase } from './lib/api';

export const revalidate = 3600;

interface Blog {
  id: number;
  path?: string;
}

interface Solution {
  id: number;
  path?: string;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const normalizedSiteUrl = siteUrl.replace(/\/$/, '');

  const baseEntries: MetadataRoute.Sitemap = [
    {
      url: `${normalizedSiteUrl}/`,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${normalizedSiteUrl}/about`,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${normalizedSiteUrl}/news`,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${normalizedSiteUrl}/solution`,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${normalizedSiteUrl}/contact`,
      changeFrequency: 'yearly',
      priority: 0.5,
    },
  ];

  try {
    const apiBase = getApiBase();

    const [blogsRes, solutionsRes] = await Promise.all([
      fetch(`${apiBase}/api/blogs`, { next: { revalidate } }),
      fetch(`${apiBase}/api/solutions`, { next: { revalidate } }),
    ]);

    const blogEntries: MetadataRoute.Sitemap = [];
    const solutionEntries: MetadataRoute.Sitemap = [];

    if (blogsRes.ok) {
      const blogs = (await blogsRes.json()) as Blog[];
      if (blogs && Array.isArray(blogs)) {
        blogs.forEach((blog) => {
          const slug = blog.path || blog.id?.toString();
          if (!slug) return;
          blogEntries.push({
            url: `${normalizedSiteUrl}/blog/${slug}`,
            changeFrequency: 'weekly',
            priority: 0.7,
          });
        });
      }
    }

    if (solutionsRes.ok) {
      const solutions = (await solutionsRes.json()) as Solution[];
      if (solutions && Array.isArray(solutions)) {
        solutions.forEach((solution) => {
          const slug = solution.path || solution.id?.toString();
          if (!slug) return;
          solutionEntries.push({
            url: `${normalizedSiteUrl}/solution/${slug}`,
            changeFrequency: 'weekly',
            priority: 0.7,
          });
        });
      }
    }

    return [...baseEntries, ...blogEntries, ...solutionEntries];
  } catch (error) {
    console.error('Failed to generate sitemap:', error);
    return baseEntries;
  }
}
