'use client';

import {
    Box,
    CircularProgress,
    Divider,
    Drawer,
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
import type { Problem } from '@/lib/types';
import Editor from '@monaco-editor/react';
import { useProblemRunner } from '@/hooks/useProblemRunner';
import { safeJson } from '@/lib/format';
// no enum import needed here; we compare string values for display

function caseStatusLabel(c: { pass: boolean; error?: string | undefined }): string {
    if (c.pass) return 'Passed';
    if (typeof c.error === 'string' && c.error.length > 0) return 'Error';

    return 'Failed';
}

function caseBorderColor(c: { pass: boolean; error?: string | undefined }): string {
    if (c.pass) return 'success.main';
    if (typeof c.error === 'string' && c.error.length > 0) return 'warning.main';

    return 'error.main';
}

function summaryColor(s: string): 'success' | 'error' | 'warning' | 'default' {
    if (s === 'Passed') return 'success';

    if (s === 'Failed') return 'error';

    if (s === 'Timeout' || s === 'Error') return 'warning';

    return 'default';
}

function caseIcon(c: { pass: boolean; error?: string | undefined }): ReactElement {
    if (c.pass) return <CheckCircleOutlineIcon color="success" fontSize="small" />;
    if (typeof c.error === 'string' && c.error.length > 0)
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

export default function ProblemDetailClient({ problem }: { problem: Problem }): ReactElement {
    const { code, setCode, open, setOpen, loading, result, handleRun } = useProblemRunner(problem);

    const drawerWidth = 400;

    return (
        <Box sx={{ height: '100vh', position: 'relative', p: '2rem' }}>
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

            <Drawer
                anchor="right"
                open={open}
                onClose={() => {
                    setOpen(false);
                }}
                ModalProps={{ keepMounted: true }}
                slotProps={{
                    paper: {
                        sx: {
                            bgcolor: 'background.default',
                            backgroundImage: 'none',
                            borderLeft: '1px solid',
                            borderColor: 'divider',
                        },
                    },
                }}
            >
                <Box sx={{ width: drawerWidth, p: 2 }} role="presentation">
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
                                    color={summaryColor(result.summary.status)}
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
            </Drawer>
        </Box>
    );
}
