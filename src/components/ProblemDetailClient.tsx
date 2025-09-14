"use client";
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
  Paper,
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import CloseIcon from "@mui/icons-material/Close";
import { Problem } from "@/lib/types";
import Editor from "@monaco-editor/react";
import { useProblemRunner } from "@/hooks/useProblemRunner";
import { safeJson } from "@/lib/format";

export default function ProblemDetailClient({ problem }: { problem: Problem }) {
  const { code, setCode, open, setOpen, loading, result, handleRun } = useProblemRunner(problem);

  const drawerWidth = 400;

  return (
    <Box sx={{ height: "100vh", position: "relative", p: "2rem" }}>
      <Paper sx={{ height: "100%", overflow: "hidden" }} elevation={3}>
        <Editor
          theme="vs-dark"
          height="100%"
          defaultLanguage="javascript"
          value={code}
          onChange={(v) => setCode(v ?? "")}
          options={{
            fontSize: 14,
            minimap: { enabled: false },
            padding: { top: 16 },
          }}
        />
      </Paper>

      <Fab
        variant="extended"
        size="small"
        color="primary"
        onClick={handleRun}
        sx={{
          position: "absolute",
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
        onClose={() => setOpen(false)}
        ModalProps={{ keepMounted: true }}
      >
        <Box sx={{ width: drawerWidth, p: 2 }} role="presentation">
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="h6">Results</Typography>
            <IconButton onClick={() => setOpen(false)}>
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
              <Typography variant="subtitle1" gutterBottom>
                Status: {result.summary.status} — Passed {result.summary.passed}
                /{result.summary.total}
              </Typography>
              <List dense>
                {result.cases.map((c) => (
                  <ListItem key={c.index} divider>
                    <ListItemText
                      primary={`Case #${c.index + 1}: ${
                        c.pass ? "Passed" : c.error ? "Error" : "Failed"
                      }`}
                      secondary={
                        <>
                          <div>Input: {safeJson(c.input)}</div>
                          <div>Expected: {safeJson(c.expected)}</div>
                          <div>Actual: {safeJson(c.actual)}</div>
                          {c.error && <div>Error: {c.error}</div>}
                        </>
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
