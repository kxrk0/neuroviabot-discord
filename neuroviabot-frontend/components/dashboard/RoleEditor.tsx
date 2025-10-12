'use client';

import React from 'react';
import { ShieldCheckIcon } from '@heroicons/react/24/outline';

interface RoleEditorProps {
  guildId: string;
  userId: string;
}

export default function RoleEditor({ guildId, userId }: RoleEditorProps) {
  return (
    <div className="text-center p-12">
      <ShieldCheckIcon className="w-16 h-16 text-purple-400 mx-auto mb-4" />
      <h3 className="text-xl font-bold text-white mb-2">Rol Yönetimi</h3>
      <p className="text-gray-400">Rol yönetimi özellikleri geliştiriliyor...</p>
    </div>
  );
}

