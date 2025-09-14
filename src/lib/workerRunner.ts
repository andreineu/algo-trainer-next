"use client";
import { RunResult } from './types';

type RunnerInput = { code: string; tests: { input: unknown; output: unknown }[]; timeLimitMs: number };

export function runCodeInWorker(input: RunnerInput): Promise<RunResult> {
  return new Promise((resolve, reject) => {
    const worker = new Worker('/workers/runner.js');
    const timer = setTimeout(() => {
      try { worker.terminate(); } catch {}
      reject(new Error('Worker timeout'));
    }, input.timeLimitMs + 200); // small guard over worker timeout

    worker.onmessage = (e) => {
      clearTimeout(timer);
      worker.terminate();
      resolve(e.data as RunResult);
    };
    worker.onerror = (err) => {
      clearTimeout(timer);
      worker.terminate();
      reject(err);
    };
    worker.postMessage(input);
  });
}

