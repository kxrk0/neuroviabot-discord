import './globals.scss';
import type { Metadata } from 'next';
import { NotificationProvider } from '../contexts/NotificationContext';
import { NeuroCoinProvider } from '../contexts/NeuroCoinContext';
import { LanguageProvider } from '../contexts/LanguageContext';
import { SocketProvider } from '../contexts/SocketContext';

export const metadata: Metadata = {
  title: 'Neurovia Dashboard',
  description: 'Advanced Discord Bot Management Dashboard',
  keywords: ['discord bot', 'bot dashboard', 'neuroviabot'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <LanguageProvider>
          <SocketProvider>
            <NotificationProvider>
              <NeuroCoinProvider>
                {children}
              </NeuroCoinProvider>
            </NotificationProvider>
          </SocketProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
