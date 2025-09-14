"use client";
import { PropsWithChildren } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { darkTheme } from '@/lib/theme';

export default function ThemeRegistry({ children }: PropsWithChildren) {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}

