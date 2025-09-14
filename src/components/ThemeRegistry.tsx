'use client';

import type { PropsWithChildren, ReactElement } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { darkTheme } from '@/lib/theme';

export default function ThemeRegistry({ children }: PropsWithChildren): ReactElement {
    return (
        <AppRouterCacheProvider options={{ key: 'mui' }}>
            <ThemeProvider theme={darkTheme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </AppRouterCacheProvider>
    );
}
