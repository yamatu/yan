import type { Metadata } from 'next';
import { getApiBase } from '../../lib/api';

interface Solution {
  id: number;
  title: string;
  description: string;
  path?: string;
  created_at: string;
}

export async function generateSolutionMetadata(slug: string): Promise<Metadata> {
  const apiBase = getApiBase();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const normalizedSiteUrl = siteUrl.replace(/\/$/, '');

  try {
    let res = await fetch(`${apiBase}/api/solutions/by-path/${slug}`, { next: { revalidate: 300 } });
    if (!res.ok) {
      res = await fetch(`${apiBase}/api/solutions/${slug}`, { next: { revalidate: 300 } });
      if (!res.ok) throw new Error('Solution not found');
    }

    const solution = (await res.json()) as Solution;

    const description =
      solution.description
        ? solution.description.replace(/[#>*_`]/g, '').slice(0, 160) + '...'
        : 'Solution from KND intelligent hardware platform.';

    const url = `${normalizedSiteUrl}/solution/${solution.path || solution.id}`;

    return {
      title: `${solution.title} - KND Intelligent Hardware`,
      description,
      alternates: {
        canonical: url,
      },
      openGraph: {
        title: `${solution.title} - KND Intelligent Hardware`,
        description,
        url,
        type: 'article',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${solution.title} - KND Intelligent Hardware`,
        description,
      },
    };
  } catch (error) {
    console.error('Failed to generate solution metadata:', error);
    return {
      title: 'Solution - KND Intelligent Hardware',
      description: 'Solution from KND intelligent hardware platform.',
    };
  }
}
