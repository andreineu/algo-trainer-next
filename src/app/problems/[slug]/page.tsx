import type { ReactElement } from 'react';
import { notFound } from 'next/navigation';
import { getProblemBySlug, getProblemSlugs } from '@/lib/problems';
import ProblemDetail from '@/components/ProblemDetail';

export function generateStaticParams(): { slug: string }[] {
    return getProblemSlugs().map((slug) => ({ slug }));
}

export default async function ProblemDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<ReactElement> {
    const { slug } = await params;
    const problem = getProblemBySlug(slug);

    if (!problem) return notFound();

    return <ProblemDetail problem={problem} />;
}
