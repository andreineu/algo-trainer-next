import { notFound } from 'next/navigation';
import { getProblemBySlug, getProblemSlugs } from '@/lib/problems';
import ProblemDetailClient from '@/components/ProblemDetailClient';

export function generateStaticParams() {
  return getProblemSlugs().map((slug) => ({ slug }));
}

export default async function ProblemDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const problem = getProblemBySlug(slug);
  if (!problem) return notFound();
  return <ProblemDetailClient problem={problem} />;
}
