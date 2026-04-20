import type { Metadata } from 'next';
import { Inter, DM_Mono } from 'next/font/google';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
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
    'AI-native Chief of Staff and strategic operator who builds the systems founders rely on. Direct C-suite report at an AI-native company.',
  metadataBase: new URL('https://iankuksov.com'),
  openGraph: {
    title: 'Ian Kuksov — Operator · Builder · Chief of Staff',
    description:
      'AI-native Chief of Staff and strategic operator who builds the systems founders rely on.',
    type: 'website',
    locale: 'en_US',
  },
  other: {
    'theme-color': '#F8F9FA',
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
      data-theme="neobrutal"
      className={`${inter.variable} ${dmMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
