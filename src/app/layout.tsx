import type { Metadata } from 'next';
import type { ReactElement } from 'react';
import ThemeRegistry from '@/components/ThemeRegistry';
import './globals.css';

export const metadata: Metadata = {
    title: 'AlgoTrainer',
    description: 'Client-only SSG AlgoTrainer with MUI and Monaco',
};

export default function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>): ReactElement {
    return (
        <html lang="en">
            <body suppressHydrationWarning>
                <ThemeRegistry>{children}</ThemeRegistry>
            </body>
        </html>
    );
}
