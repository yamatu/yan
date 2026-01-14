import type { Metadata } from 'next';
import { generateBlogMetadata } from './metadata';

interface HeadProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: HeadProps): Promise<Metadata> {
  return generateBlogMetadata(params.slug);
}

export default function Head() {
  return null;
}

