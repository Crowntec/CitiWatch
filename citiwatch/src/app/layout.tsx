import type { Metadata } from "next";
import "./globals.css";
import ErrorBoundary from "@/components/ErrorBoundary";
import { AuthProvider } from "@/auth/AuthContext";

// Use CSS system fonts instead of Google Fonts to avoid network issues
const geistSans = {
  variable: "--font-geist-sans",
};

const geistMono = {
  variable: "--font-geist-mono",
};

export const metadata: Metadata = {
  metadataBase: new URL('https://citiwatch-kappa.vercel.app'),
  title: {
    default: "CitiWatch - Digital Citizen Reporting Platform",
    template: "%s | CitiWatch"
  },
  description: "CitiWatch is a comprehensive digital platform that empowers citizens to report municipal issues, track complaint resolution, and engage with local government services. Submit reports, track progress, and help build better communities.",
  keywords: ["citizen reporting", "municipal services", "complaint management", "community engagement", "local government", "civic platform", "issue tracking"],
  authors: [{ name: "CitiWatch Team" }],
  creator: "CitiWatch",
  publisher: "CitiWatch Platform",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://citiwatch-kappa.vercel.app",
    siteName: "CitiWatch",
    title: "CitiWatch - Digital Citizen Reporting Platform",
    description: "Empowering citizens to report municipal issues and track complaint resolution. Join thousands of users building better communities through digital civic engagement.",
    images: [
      {
        url: "/primarylogo.png",
        width: 1200,
        height: 630,
        alt: "CitiWatch - Digital Citizen Reporting Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CitiWatch - Digital Citizen Reporting Platform",
    description: "Report municipal issues, track complaints, and engage with local government services through our comprehensive digital platform.",
    images: ["/primarylogo.png"],
    creator: "@citiwatch",
    site: "@citiwatch",
  },
  category: "Government & Civic Engagement",
  classification: "Public Service Platform",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://kit.fontawesome.com" />
        <link rel="preconnect" href="https://cdnjs.cloudflare.com" />
        
        {/* Favicon and App Icons */}
        <link rel="icon" href="/primarylogo.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/primarylogo.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/primarylogo.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/primarylogo.png" />
        
        {/* PWA and Mobile */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1e293b" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="CitiWatch" />
        
        {/* External Resources */}
        <script src="https://kit.fontawesome.com/b8581067ed.js" crossOrigin="anonymous" async></script>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/remixicon/4.6.0/remixicon.min.css" />
        
        {/* Performance and Security */}
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="format-detection" content="telephone=no" />
        
        {/* Additional SEO */}
        <link rel="canonical" href="https://citiwatch-kappa.vercel.app" />
        <meta name="language" content="English" />
        <meta name="revisit-after" content="7 days" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ErrorBoundary>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
