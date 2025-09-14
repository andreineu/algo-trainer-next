'use client';

import {
    Box,
    CircularProgress,
    Divider,
    Modal,
    Fab,
    IconButton,
    Stack,
    Typography,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Chip,
    Paper,
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import type { ReactElement } from 'react';
import type { Problem, RunCaseResult, RunResult } from '@/lib/types';
import { RunStatus } from '@/lib/enums';
import Editor from '@monaco-editor/react';
import { useProblemRunner } from '@/hooks/useProblemRunner';
import { safeJson } from '@/lib/format';

function caseStatusLabel(runCase: RunCaseResult): string {
    if (runCase.pass) return 'Passed';
    if (typeof runCase.error === 'string' && runCase.error.length > 0) return 'Error';

    return 'Failed';
}

function caseBorderColor(runCase: RunCaseResult): string {
    if (runCase.pass) return 'success.main';
    if (typeof runCase.error === 'string' && runCase.error.length > 0) return 'warning.main';

    return 'error.main';
}

function summaryColor(run: RunResult | null): 'success' | 'error' | 'warning' | 'default' {
    const colors = {
        [RunStatus.Passed]: 'success',
        [RunStatus.Pending]: 'default',
        [RunStatus.Failed]: 'error',
        [RunStatus.Timeout]: 'warning',
        [RunStatus.Error]: 'error',
    } as const;

    return typeof run?.summary.status !== 'undefined' ? colors[run.summary.status] : 'default';
}

function caseIcon(runCase: RunCaseResult): ReactElement {
    if (runCase.pass) return <CheckCircleOutlineIcon color="success" fontSize="small" />;
    if (typeof runCase.error === 'string' && runCase.error.length > 0)
        return <ErrorOutlineIcon color="warning" fontSize="small" />;

    return <HighlightOffIcon color="error" fontSize="small" />;
}

function LabelAndCode({ label, value }: { label: string; value: unknown }): ReactElement {
    return (
        <Box sx={{ mb: 0.5 }}>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {label}
            </Typography>
            <Box
                component="pre"
                sx={{
                    m: 0,
                    mt: 0.25,
                    p: 1,
                    borderRadius: 1,
                    bgcolor: 'background.default',
                    border: '1px solid',
                    borderColor: 'divider',
                    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                    fontSize: 12,
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                }}
            >
                {safeJson(value)}
            </Box>
        </Box>
    );
}

export default function ProblemDetail({ problem }: { problem: Problem }): ReactElement {
    const { code, setCode, open, setOpen, loading, result, handleRun } = useProblemRunner(problem);

    return (
        <Box
            sx={{
                height: '100vh',
                maxWidth: '1600px',
                mx: 'auto',
                position: 'relative',
                p: '2rem',
            }}
        >
            <Paper sx={{ height: '100%', overflow: 'hidden' }} elevation={3}>
                <Editor
                    theme="vs-dark"
                    height="100%"
                    defaultLanguage="javascript"
                    value={code}
                    onChange={(v) => {
                        setCode(v ?? '');
                    }}
                    options={{
                        fontSize: 14,
                        minimap: { enabled: false },
                        tabSize: 4,
                        insertSpaces: true,
                        detectIndentation: false,
                        padding: { top: 16 },
                    }}
                />
            </Paper>

            <Fab
                variant="extended"
                size="small"
                color="primary"
                onClick={() => {
                    handleRun().catch(() => {
                        // noop
                    });
                }}
                sx={{
                    position: 'absolute',
                    right: 64,
                    bottom: 48,
                    zIndex: (t) => t.zIndex.drawer + 1,
                }}
            >
                <PlayArrowIcon />
                Run
            </Fab>

            <Modal
                open={open}
                onClose={() => {
                    setOpen(false);
                }}
                keepMounted
            >
                <Box
                    role="dialog"
                    aria-label="Run results"
                    sx={{
                        position: 'fixed',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: { xs: '90vw', sm: 640, md: 720 },
                        maxHeight: '85vh',
                        p: 2,
                        bgcolor: 'background.default',
                        backgroundImage: 'none',
                        border: '1px solid',
                        borderColor: 'divider',
                        overflow: 'auto',
                        boxShadow: 24,
                        borderRadius: 1,
                    }}
                >
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Typography variant="h6">Results</Typography>
                        <IconButton
                            onClick={() => {
                                setOpen(false);
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </Stack>
                    <Divider sx={{ my: 1 }} />
                    {loading && (
                        <Stack alignItems="center" justifyContent="center" sx={{ py: 4 }}>
                            <CircularProgress />
                        </Stack>
                    )}
                    {!loading && result && (
                        <Box>
                            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                                <Chip
                                    size="small"
                                    label={result.summary.status}
                                    color={summaryColor(result)}
                                />
                                <Chip
                                    size="small"
                                    variant="outlined"
                                    label={`Total: ${String(result.summary.total)}`}
                                />
                                <Chip
                                    size="small"
                                    color="success"
                                    variant="outlined"
                                    label={`Passed: ${String(result.summary.passed)}`}
                                />
                                <Chip
                                    size="small"
                                    color="error"
                                    variant="outlined"
                                    label={`Failed: ${String(result.summary.failed)}`}
                                />
                            </Stack>
                            <List dense>
                                {result.cases.map((c) => (
                                    <ListItem
                                        key={c.index}
                                        alignItems="flex-start"
                                        sx={{
                                            borderLeft: 3,
                                            borderColor: caseBorderColor(c),
                                            mb: 1,
                                            borderRadius: 1,
                                            bgcolor: 'background.paper',
                                        }}
                                    >
                                        <ListItemIcon sx={{ minWidth: 32, mt: 0.25 }}>
                                            {caseIcon(c)}
                                        </ListItemIcon>
                                        <ListItemText
                                            disableTypography
                                            primary={
                                                <Typography
                                                    variant="subtitle2"
                                                    sx={{ fontWeight: 600 }}
                                                >
                                                    Case #{String(c.index + 1)} —{' '}
                                                    {caseStatusLabel(c)}
                                                </Typography>
                                            }
                                            secondary={
                                                <Box sx={{ mt: 0.5 }}>
                                                    <LabelAndCode label="Input" value={c.input} />
                                                    <LabelAndCode
                                                        label="Expected"
                                                        value={c.expected}
                                                    />
                                                    <LabelAndCode label="Actual" value={c.actual} />
                                                    {typeof c.error === 'string' &&
                                                        c.error.length > 0 && (
                                                            <Typography
                                                                variant="caption"
                                                                color="warning.main"
                                                            >
                                                                Error: {c.error}
                                                            </Typography>
                                                        )}
                                                </Box>
                                            }
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </Box>
                    )}
                </Box>
            </Modal>
        </Box>
    );
}
