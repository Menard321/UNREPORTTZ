import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/lib/context/auth-context';
import { ThemeProvider } from '@/lib/context/theme-provider';

export const metadata: Metadata = {
  title: 'UniReportTZ — Academic Reports, Built Around Your University',
  description: 'Tanzania-focused AI-powered academic reporting platform for university students. Create, structure, edit, verify, format, preview and export professional reports.',
  keywords: 'UniReportTZ, Academic Reports Tanzania, UDSM field report, UDOM final year project, SUA research report, Mzumbe internship report, Tanzania AI report writer',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light" suppressHydrationWarning>
      <body className="bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 antialiased font-sans">
        <ThemeProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
