import type { ReactElement } from 'react';
import { getProblems } from '@/lib/problems';
import ProblemsList from '@/components/ProblemsList';

export const revalidate = false;

export default function ProblemsPage(): ReactElement {
    const problems = getProblems();

    return <ProblemsList problems={problems} />;
}
