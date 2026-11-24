import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AutoCV - AI-Powered, ATS-Friendly CV Builder',
  description: 'Generate, customize, and export job-tailored, ATS-compliant resumes in PDF, DOCX, and DOC formats.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-slate-50 text-slate-900">
        {children}
      </body>
    </html>
  );
}

