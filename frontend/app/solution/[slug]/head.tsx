import type { Metadata } from 'next';
import { generateSolutionMetadata } from './metadata';

interface HeadProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: HeadProps): Promise<Metadata> {
  return generateSolutionMetadata(params.slug);
}

export default function Head() {
  return null;
}

