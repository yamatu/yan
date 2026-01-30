import type { Metadata } from 'next';
import { getApiBase } from '../../lib/api';

interface Blog {
  id: number;
  title: string;
  summary?: string;
  content: string;
  path?: string;
  created_at: string;
}

export async function generateBlogMetadata(slug: string): Promise<Metadata> {
  const apiBase = getApiBase();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const normalizedSiteUrl = siteUrl.replace(/\/$/, '');

  try {
    let res = await fetch(`${apiBase}/api/blogs/by-path/${slug}`, { next: { revalidate: 300 } });
    if (!res.ok) {
      res = await fetch(`${apiBase}/api/blogs/${slug}`, { next: { revalidate: 300 } });
      if (!res.ok) throw new Error('Blog not found');
    }

    const blog = (await res.json()) as Blog;

    const description =
      blog.summary ||
      (blog.content ? blog.content.replace(/[#>*_`]/g, '').slice(0, 160) + '...' : 'Blog article from KND.');

    const url = `${normalizedSiteUrl}/blog/${blog.path || blog.id}`;

    return {
      title: `${blog.title} - KND Intelligent Hardware`,
      description,
      alternates: {
        canonical: url,
      },
      openGraph: {
        title: `${blog.title} - KND Intelligent Hardware`,
        description,
        url,
        type: 'article',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${blog.title} - KND Intelligent Hardware`,
        description,
      },
    };
  } catch (error) {
    console.error('Failed to generate blog metadata:', error);
    return {
      title: 'Blog Article - KND Intelligent Hardware',
      description: 'Blog article from KND.',
    };
  }
}
