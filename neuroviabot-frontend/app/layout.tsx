import './globals.scss';
import type { Metadata } from 'next';
import { NotificationProvider } from '../contexts/NotificationContext';
import { NeuroCoinProvider } from '../contexts/NeuroCoinContext';

export const metadata: Metadata = {
  title: 'NeuroViaBot Dashboard',
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
        <NotificationProvider>
          <NeuroCoinProvider>
            {children}
          </NeuroCoinProvider>
        </NotificationProvider>
      </body>
    </html>
  );
}
