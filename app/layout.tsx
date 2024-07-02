import { Metadata } from 'next';
import Footer from '../components/ui/Footer';
import Navbar from '../components/ui/Navbar';
import { Toaster } from '../components/ui/Toasts/toaster';
import { PropsWithChildren, Suspense } from 'react';
import { getURL } from '../utils/helpers';
import 'styles/main.css';

const meta = {
  title: 'AGI OS',
  description: 'Next Gen AI Employee for Businesses.',
  cardImage: '/og.png',
  robots: 'follow, index',
  favicon: '/favicon.ico',
  url: getURL()
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: meta.title,
    description: meta.description,
    referrer: 'origin-when-cross-origin',
    keywords: ['AI', 'AGI', 'AGIOS', 'Online Business', 'Make Money Online', 'Employee', 'Employee Management', 'Employee Management Software', 'Employee Management Software for Businesses', 'ChatGPT'],
    authors: [{ name: 'AGIOS', url: 'https://agios.live/' }],
    creator: 'Chingu PTE',
    publisher: 'Chingu PTE',
    robots: meta.robots,
    icons: { icon: meta.favicon },
    metadataBase: new URL(meta.url),
    openGraph: {
      url: meta.url,
      title: meta.title,
      description: meta.description,
      images: [meta.cardImage],
      type: 'website',
      siteName: meta.title
    },
    twitter: {
      card: 'summary_large_image',
      site: '@AGIOS_live',
      creator: '@AGIOS_live',
      title: meta.title,
      description: meta.description,
      images: [meta.cardImage]
    }
  };
}

export default async function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
    <head>


      <link href="https://cdn.jsdelivr.net/npm/@sweetalert2/theme-dark@4/dark.css" rel="stylesheet"/>

    </head>
    <body className="bg-black loading">
    <Navbar />
    <main
      id="skip"
      className="min-h-[calc(100dvh-4rem)] md:min-h[calc(100dvh-5rem)] dark text-foreground bg-background"
    >
      {children}
    </main>
    <Footer />
    <Suspense>
      <Toaster />
    </Suspense>
    </body>
    </html>
  );
}
