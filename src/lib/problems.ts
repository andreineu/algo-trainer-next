import problemsData from '../../data/problems.json';
import { Difficulty } from './enums';
import type { Problem } from './types';

// Cast JSON to typed Problems
const problems: Problem[] = (problemsData as any).map((p: any) => ({
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

