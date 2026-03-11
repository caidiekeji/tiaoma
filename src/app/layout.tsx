import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import Toast from '@/components/Toast';
import { ToastProvider } from '@/lib/toast';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#1f2937' },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL('https://tiaoma.example.com'),
  title: {
    default: '条码生成器 - 条形码和二维码在线生成工具',
    template: '%s | 条码生成器',
  },
  description:
    '免费在线条形码和二维码生成工具，支持 CODE128、CODE39、EAN-13、EAN-8、UPC、ITF14 等多种条码格式，自定义样式，一键下载。',
  keywords: [
    '条形码生成器',
    '二维码生成器',
    'QR Code',
    'CODE128',
    'EAN-13',
    '条码',
    'barcode',
    'qrcode',
    '在线生成',
    '免费工具',
  ],
  authors: [{ name: '条码生成器团队' }],
  creator: '条码生成器',
  publisher: '条码生成器',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: 'https://tiaoma.example.com',
    siteName: '条码生成器',
    title: '条码生成器 - 条形码和二维码在线生成工具',
    description:
      '免费在线条形码和二维码生成工具，支持多种格式，自定义样式，一键下载。',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: '条码生成器',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '条码生成器 - 条形码和二维码在线生成工具',
    description:
      '免费在线条形码和二维码生成工具，支持多种格式，自定义样式，一键下载。',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: 'https://tiaoma.example.com',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="antialiased bg-gray-50 dark:bg-gray-900 transition-colors">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ToastProvider>
            {children}
            <Toast />
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
