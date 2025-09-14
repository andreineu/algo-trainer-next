"use client";
import { RunHistoryEntry, RunResult } from './types';

const KEY = 'algoTrainer:history';
const CAP = 200;

export function loadHistory(): RunHistoryEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw) as RunHistoryEntry[];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

export function saveHistory(list: RunHistoryEntry[]) {
  if (typeof window === 'undefined') return;
  try { localStorage.setItem(KEY, JSON.stringify(list)); } catch {}
}

export function saveRun(params: { problemId: string; code: string; result: RunResult }) {
  const list = loadHistory();
  const entry: RunHistoryEntry = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    problemId: params.problemId,
    code: params.code,
    createdAt: new Date().toISOString(),
    result: params.result,
  };
  const next = [entry, ...list].slice(0, CAP);
  saveHistory(next);
}

