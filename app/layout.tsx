import type { Metadata } from 'next';

import { Toaster } from 'sonner';

import { ThemeProvider } from '@/components/theme-provider';

import './globals.css';


export const metadata: Metadata = {
  metadataBase: new URL('https://www.queryany.com'), // Replace with your actual domain
  title: 'AI Search - Aggregate Leading AI Models for All Your Information Needs',
  description: 'Use leading AI models like DeepSeek R1,GPT, Claude and Gemini2 to quickly and accurately search for the content you need. Say goodbye to information overload and efficiently get the information you want.',
  keywords: ['AI Search', 'Large Language Models', 'GPT', 'Claude', 'Bard', 'Artificial Intelligence', 'Search Engine', 'Information Retrieval', 'Knowledge Base', 'Question Answering'],
  //openGraph: {
  //  title: 'AI Search - Aggregate Leading AI Models for All Your Information Needs',
   // description: 'Use leading AI models like GPT, Claude, and Bard to quickly and accurately search for the content you need. Say goodbye to information overload and efficiently get the information you want.',
   // url: 'https://www.queryany.com', // Replace with your actual domain
   // siteName: 'AI Search',
    //images: [
    //  '/og-image.png', // Replace with your Open Graph image path, recommended size 1200x630
   // ],
   // locale: 'en_US', // Set to English (US)
   // type: 'website',
 // },
 // twitter: {
  //  card: 'summary_large_image',
  //  title: 'AI Search - Aggregate Leading AI Models for All Your Information Needs',
  //  description: 'Use leading AI models like GPT, Claude, and Bard to quickly and accurately search for the content you need. Say goodbye to information overload and efficiently get the information you want.',
   // site: '@JohnWhiteSun', // Replace with your Twitter username
   // creator: '@JohnWhiteSun', // Replace with your Twitter username
  //  images: [
   //   '/twitter-image.png', // Replace with your Twitter image path, recommended size 800x418
  //  ],
 // },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': 'large',
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
 // icons: {
   // icon: '/favicon.ico', // Replace with your favicon path
  //  apple: '/apple-touch-icon.png', // Replace with your Apple Touch Icon path
  //},
  // Other Metadata options, such as viewport, theme-color, etc.
  //viewport: {
   // width: 'device-width',
   // initialScale: 1,
   // maximumScale: 1,
 // },
  //themeColor: '#ffffff', // Replace with your website theme color
};


export const viewport = {
  maximumScale: 1, // Disable auto-zoom on mobile Safari
};

const LIGHT_THEME_COLOR = 'hsl(0 0% 100%)';
const DARK_THEME_COLOR = 'hsl(240deg 10% 3.92%)';
const THEME_COLOR_SCRIPT = `\
(function() {
  var html = document.documentElement;
  var meta = document.querySelector('meta[name="theme-color"]');
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('name', 'theme-color');
    document.head.appendChild(meta);
  }
  function updateThemeColor() {
    var isDark = html.classList.contains('dark');
    meta.setAttribute('content', isDark ? '${DARK_THEME_COLOR}' : '${LIGHT_THEME_COLOR}');
  }
  var observer = new MutationObserver(updateThemeColor);
  observer.observe(html, { attributes: true, attributeFilter: ['class'] });
  updateThemeColor();
})();`;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const privacyPolicyLink = process.env.NEXT_PUBLIC_PRIVACY_POLICY_LINK || '#';
  const termsOfServiceLink = process.env.NEXT_PUBLIC_TERM_OF_SERVICE_LINK || '#';

  return (
    <html
      lang="en"
      // `next-themes` injects an extra classname to the body element to avoid
      // visual flicker before hydration. Hence the `suppressHydrationWarning`
      // prop is necessary to avoid the React hydration mismatch warning.
      // https://github.com/pacocoursey/next-themes?tab=readme-ov-file#with-app
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: THEME_COLOR_SCRIPT,
          }}
        />
      </head>
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Toaster position="top-center" />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
