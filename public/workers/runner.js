function deepEqual(a, b) {
    if (a === b) return true;
    if (a && b && typeof a === 'object' && typeof b === 'object') {
        if (Array.isArray(a) && Array.isArray(b)) {
            if (a.length !== b.length) return false;
            for (let i = 0; i < a.length; i++) if (!deepEqual(a[i], b[i])) return false;
            return true;
        }
        if (a instanceof Date && b instanceof Date) return a.getTime() === b.getTime();
        const aKeys = Object.keys(a),
            bKeys = Object.keys(b);
        if (aKeys.length !== bKeys.length) return false;
        for (const k of aKeys) if (!deepEqual(a[k], b[k])) return false;
        return true;
    }
    return Number.isNaN(a) && Number.isNaN(b);
}

async function loadUserModule({ code, functionName }) {
    let source = String(code || '');
    const hasExport = /\bexport\s+(default|\{)/.test(source);
    if (!hasExport) {
        source += `\nexport default ${functionName};\n`;
    }
    const blob = new Blob([source], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    try {
        const mod = await import(url);
        return mod;
    } finally {
        URL.revokeObjectURL(url);
    }
}

self.onmessage = async (e) => {
    const { code, tests, timeLimitMs, functionName } = e.data || {};

    const TIMEOUT = typeof timeLimitMs === 'number' ? timeLimitMs : 2500;
    let timedOut = false;
    let userFn;

    const cases = [];
    try {
        const mod = await loadUserModule({ code, functionName });
        userFn = mod.default || (functionName && mod[functionName]);
    } catch (err) {
        self.postMessage({
            cases: [],
            summary: { total: 0, passed: 0, failed: 0, status: 'Error' },
        });
        return;
    }
    if (typeof userFn !== 'function') {
        self.postMessage({
            cases: [],
            summary: { total: 0, passed: 0, failed: 0, status: 'Error' },
        });
        return;
    }

    const timeoutId = setTimeout(() => {
        timedOut = true;
    }, TIMEOUT);

    let passed = 0;
    let failed = 0;

    for (let i = 0; i < tests.length; i++) {
        const t = tests[i];
        const caseStart = Date.now();
        if (timedOut) break;
        try {
            let args;
            if (Array.isArray(t.input)) args = t.input;
            else if (t && typeof t.input === 'object') args = Object.values(t.input);
            else args = [t.input];

            const actual = userFn.apply(null, args);
            const pass = deepEqual(actual, t.output);
            pass ? passed++ : failed++;
            cases.push({
                index: i,
                input: t.input,
                expected: t.output,
                actual,
                pass,
                durationMs: Date.now() - caseStart,
            });
        } catch (err) {
            failed++;
            cases.push({
                index: i,
                input: t.input,
                expected: t.output,
                actual: null,
                pass: false,
                error: String(err),
                durationMs: Date.now() - caseStart,
            });
        }
    }

    clearTimeout(timeoutId);

    let status = 'Passed';
    if (timedOut) status = 'Timeout';
    else if (failed > 0) status = 'Failed';

    self.postMessage({
        cases,
        summary: { total: tests.length, passed, failed, status },
    });
};
