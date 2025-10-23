import './globals.scss';
import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import { NotificationProvider } from '../contexts/NotificationContext';
import { NeuroCoinProvider } from '../contexts/NeuroCoinContext';
import { LanguageProvider } from '../contexts/LanguageContext';
import { SocketProvider } from '../contexts/SocketContext';
import { AuthProvider } from '../contexts/AuthContext';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-poppins',
  fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
});

export const metadata: Metadata = {
  title: 'Neurovia Dashboard',
  description: 'Advanced Discord Bot Management Dashboard',
  keywords: ['discord bot', 'bot dashboard', 'neuroviabot'],
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={poppins.variable}>
      <body className="font-sans antialiased">
        <AuthProvider>
          <LanguageProvider>
            <SocketProvider>
              <NotificationProvider>
                <NeuroCoinProvider>
                  {children}
                </NeuroCoinProvider>
              </NotificationProvider>
            </SocketProvider>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
