'use client';

import React from 'react';
import { DocumentTextIcon } from '@heroicons/react/24/outline';

interface AuditLogProps {
  guildId: string;
  userId: string;
}

export default function AuditLog({ guildId, userId }: AuditLogProps) {
  return (
    <div className="text-center p-12">
      <DocumentTextIcon className="w-16 h-16 text-red-400 mx-auto mb-4" />
      <h3 className="text-xl font-bold text-white mb-2">Denetim Günlüğü</h3>
      <p className="text-gray-400">Denetim günlüğü özellikleri geliştiriliyor...</p>
    </div>
  );
}

