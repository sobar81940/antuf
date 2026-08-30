import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientProvider from "./ClientProvider";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import Script from "next/script";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const metadata = {
  metadataBase: new URL('https://antuf.org'),
  title: {
    default: 'All Nepal Federation of Trade Unions(ANTUF)',
    template: '%s | ANTUF'
  },
  description: 'All Nepal Federation of Trade Unions (ANTUF) advocates for the rights, welfare, and empowerment of workers across Nepal.',
  keywords: ['ANTUF', 'All Nepal Federation of Trade Unions', 'trade unions Nepal', 'workers rights Nepal'],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'ne_NP',
    url: 'https://antuf.org/',
    siteName: 'All Nepal Federation of Trade Unions(ANTUF)',
    images: [
      {
        url: '/images/og-default.jpg',
        width: 1200,
        height: 630,
        alt: 'All Nepal Federation of Trade Unions(ANTUF)'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'All Nepal Federation of Trade Unions(ANTUF)',
    description: 'All Nepal Federation of Trade Unions (ANTUF) advocates for workers across Nepal.',
    images: ['/images/og-default.jpg']
  }
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "All Nepal Federation of Trade Unions",
    alternateName: "ANTUF",
    url: "https://antuf.org",
    logo: "https://antuf.org/images/og-default.jpg",
  };

  return (
    <html lang="ne">

      <body>
        <Script id="antuf-organization-schema" type="application/ld+json">
          {JSON.stringify(structuredData)}
        </Script>
        <AppRouterCacheProvider>
          <ClientProvider>
            {children}
            <ToastContainer />
          </ClientProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
