'use client';

import { useCallback, useState, type Dispatch, type SetStateAction } from 'react';
import type { Problem, RunResult } from '@/lib/types';
import { RunStatus } from '@/lib/enums';
import { runCodeInWorker } from '@/lib/workerRunner';
import { saveRun } from '@/lib/storage';

type Options = {
    timeLimitMs?: number;
};

const DEFAULT_TIME_LIMIT = 2500;

export type UseProblemRunnerReturn = {
    code: string;
    setCode: Dispatch<SetStateAction<string>>;
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    loading: boolean;
    result: RunResult | null;
    handleRun: () => Promise<void>;
};

export function useProblemRunner(problem: Problem, opts?: Options): UseProblemRunnerReturn {
    const [code, setCode] = useState(problem.starterCode);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<RunResult | null>(null);

    const timeLimitMs = opts?.timeLimitMs ?? DEFAULT_TIME_LIMIT;

    const handleRun = useCallback(async () => {
        setOpen(true);
        setLoading(true);

        try {
            const res = await runCodeInWorker({
                code,
                tests: problem.tests,
                timeLimitMs,
                functionName: problem.functionName,
            });

            setResult(res);
            saveRun({ problemId: problem.id, code, result: res });
        } catch {
            setResult({
                cases: [],
                summary: { total: 0, passed: 0, failed: 0, status: RunStatus.Error },
            });
        } finally {
            setLoading(false);
        }
    }, [code, problem.id, problem.tests, problem.functionName, timeLimitMs]);

    return {
        code,
        setCode,
        open,
        setOpen,
        loading,
        result,
        handleRun,
    } as const;
}
