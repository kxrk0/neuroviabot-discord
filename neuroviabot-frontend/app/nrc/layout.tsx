'use client';

import React from 'react';
import { NRCProvider } from '@/contexts/NRCContext';
import PriceWidget from '@/components/nrc/PriceWidget';

export default function NRCLayout({ children }: { children: React.ReactNode }) {
  return (
    <NRCProvider>
      {/* Floating Price Widget on all NRC pages */}
      <PriceWidget />
      
      {/* Page Content */}
      {children}
    </NRCProvider>
  );
}

