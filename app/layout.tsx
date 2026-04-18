import type { Metadata } from 'next';
import { Inter, DM_Mono } from 'next/font/google';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { ThemeProvider } from '@/components/ui/ThemeProvider';
import { LayoutProvider } from '@/components/ui/LayoutProvider';
import ThemeSwitcher from '@/components/ui/ThemeSwitcher';
import LayoutSwitcher from '@/components/ui/LayoutSwitcher';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const dmMono = DM_Mono({
  weight: ['400', '500'],
  subsets: ['latin'],
  variable: '--font-dm-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Ian Kuksov — Operator · Builder · Chief of Staff',
    template: '%s | Ian Kuksov',
  },
  description:
    'Chief of Staff and operator who builds the systems founders rely on. 2 years as direct CEO report at a US software company.',
  metadataBase: new URL('https://iankuksov.com'),
  openGraph: {
    title: 'Ian Kuksov — Operator · Builder · Chief of Staff',
    description:
      'Chief of Staff and operator who builds the systems founders rely on.',
    type: 'website',
    locale: 'en_US',
  },
  other: {
    'theme-color': '#0A0B0E',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${dmMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <LayoutProvider>
            <Navbar />
            <main>{children}</main>
            <ThemeSwitcher />
            <LayoutSwitcher />
            <Footer />
          </LayoutProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
