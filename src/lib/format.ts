export function safeJson(v: unknown): string {
  try {
    return JSON.stringify(v);
  } catch {
    try {
      // Fallback best-effort
      return String(v);
    } catch {
      return '[unserializable]';
    }
  }
}

