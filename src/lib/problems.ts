import problemsData from '../../data/problems.json';
import type { Difficulty } from './enums';
import type { Problem } from './types';

// Cast JSON to typed Problems
const problems: Problem[] = problemsData.map((p) => ({
    ...p,
    difficulty: p.difficulty as Difficulty,
}));

export function getProblems(): Problem[] {
    return problems;
}

export function getProblemBySlug(slug: string): Problem | undefined {
    return problems.find((p) => p.slug === slug);
}

export function getProblemSlugs(): string[] {
    return problems.map((p) => p.slug);
}
