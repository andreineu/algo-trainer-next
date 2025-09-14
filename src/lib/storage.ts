'use client';

import type { RunHistoryEntry, RunResult } from './types';

const KEY = 'algoTrainer:history';
const CAP = 200;

export function loadHistory(): RunHistoryEntry[] {
    if (typeof window === 'undefined') return [];

    try {
        const raw = localStorage.getItem(KEY);

        if (raw === null) return [];

        const arr = JSON.parse(raw) as RunHistoryEntry[];

        return Array.isArray(arr) ? arr : [];
    } catch {
        // noop
        return [];
    }
}

export function saveHistory(list: RunHistoryEntry[]): void {
    if (typeof window === 'undefined') return;

    try {
        localStorage.setItem(KEY, JSON.stringify(list));
    } catch {
        // noop
    }
}

export function saveRun(params: { problemId: string; code: string; result: RunResult }): void {
    const list = loadHistory();
    const entry: RunHistoryEntry = {
        id: `${String(Date.now())}-${Math.random().toString(36).slice(2, 8)}`,
        problemId: params.problemId,
        code: params.code,
        createdAt: new Date().toISOString(),
        result: params.result,
    };

    const next = [entry, ...list].slice(0, CAP);

    saveHistory(next);
}
