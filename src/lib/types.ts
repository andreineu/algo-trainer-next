import type { Difficulty, RunStatus } from './enums';

export type TestCase = {
    input: unknown;
    output: unknown;
};

export type Problem = {
    id: string;
    slug: string;
    title: string;
    difficulty: Difficulty;
    descriptionMd: string;
    functionName: string;
    starterCode: string;
    tests: TestCase[];
};

export type RunCaseResult = {
    index: number;
    input: unknown;
    expected: unknown;
    actual: unknown;
    pass: boolean;
    error?: string;
    durationMs?: number;
};

export type RunSummary = {
    total: number;
    passed: number;
    failed: number;
    status: RunStatus;
};

export type RunResult = {
    cases: RunCaseResult[];
    summary: RunSummary;
};

export type RunHistoryEntry = {
    id: string;
    problemId: string;
    code: string;
    createdAt: string; // ISO
    result: RunResult;
};
