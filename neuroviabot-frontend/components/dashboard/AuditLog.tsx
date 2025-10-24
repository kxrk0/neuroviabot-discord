'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  DocumentTextIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
  MagnifyingGlassIcon,
  UserIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  TrashIcon,
  PencilSquareIcon,
  PlusCircleIcon,
  ArrowPathIcon,
  ChevronDownIcon,
  ArrowRightOnRectangleIcon,
  Cog6ToothIcon,
  CommandLineIcon,
  ClockIcon,
  TagIcon,
} from '@heroicons/react/24/outline';
import LoadingSkeleton from '../LoadingSkeleton';
import EmptyState from '../EmptyState';
import ErrorBoundary from '../ErrorBoundary';
import { useNotification } from '@/contexts/NotificationContext';
import { useSocket } from '@/contexts/SocketContext';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { tr } from 'date-fns/locale';

interface AuditLogProps {
  guildId: string;
  userId: string;
}

interface AuditEntry {
  id: string;
  type: string;
  userId: string;
  targetId: string;
  action: string;
  details: any;
  severity: 'info' | 'warning' | 'danger';
  timestamp: string;
}

const severityColors = {
  info: 'from-blue-500 to-cyan-500',
  warning: 'from-yellow-500 to-orange-500',
  danger: 'from-red-500 to-pink-600',
};

const severityIcons = {
  info: InformationCircleIcon,
  warning: ExclamationTriangleIcon,
  danger: ShieldCheckIcon,
};

export default function AuditLog({ guildId, userId }: AuditLogProps) {
  const [logs, setLogs] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ type: '', userId: '', search: '' });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { showNotification } = useNotification();

  // Socket.IO real-time updates
  const { socket, on, off } = useSocket();

  useEffect(() => {
    if (!socket || !guildId) return;

    const handleAuditLogEntry = (entry: AuditEntry) => {
      if (!entry || !entry.id) {
        console.warn('[AuditLog] Invalid entry received:', entry);
        return;
      }

      console.log('[AuditLog] New entry:', entry.action);
      
      // Add new entry to the top of the list (avoid duplicates)
      setLogs(prevLogs => {
        const exists = prevLogs.some(log => log.id === entry.id);
        if (exists) return prevLogs;
        return [entry, ...prevLogs];
      });
      
      // Show notification for important events
      if (entry.severity === 'danger' || entry.severity === 'warning') {
        const notificationType = entry.severity === 'danger' ? 'error' : 'warning';
        showNotification(`Yeni Denetim Kaydı: ${entry.action}`, notificationType);
      }
    };

    // Join guild room for real-time audit logs
    socket.emit('join_guild', guildId);

    // Listen for audit log entries
    on('audit_log_entry', handleAuditLogEntry);

    return () => {
      // Leave guild room
      socket.emit('leave_guild', guildId);
      
      // Clean up listener
      off('audit_log_entry', handleAuditLogEntry);
    };
  }, [socket, guildId, on, off, showNotification]);

  const fetchLogs = useCallback(async () => {
    if (!guildId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://neuroviabot.xyz';
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '50',
        ...(filter.type && { type: filter.type }),
        ...(filter.userId && { userId: filter.userId }),
      });

      const response = await fetch(`${API_URL}/api/audit/${guildId}?${params}`, {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setLogs(data.logs || []);
        setTotalPages(data.totalPages || 1);
      } else {
        console.error('[AuditLog] Failed to fetch logs:', response.status);
        // Show user-friendly error
        setLogs([]);
      }
    } catch (error) {
      console.error('[AuditLog] Error fetching audit logs:', error);
      setLogs([]);
    } finally {
      setLoading(false);
    }
  }, [guildId, page, filter.type, filter.userId]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const exportLogs = async (format: 'json' | 'csv') => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://neuroviabot.xyz';
      const response = await fetch(`${API_URL}/api/audit/${guildId}/export?format=${format}`, {
        credentials: 'include',
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `audit-log-${guildId}.${format}`;
        a.click();
      }
    } catch (error) {
      console.error('Error exporting logs:', error);
    }
  };

  const filteredLogs = logs.filter(log => {
    if (filter.search) {
      const searchLower = filter.search.toLowerCase();
      return log.action.toLowerCase().includes(searchLower) ||
             log.type.toLowerCase().includes(searchLower);
    }
    return true;
  });

  if (loading) {
    return <LoadingSkeleton type="list" />;
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Ara..."
            value={filter.search}
            onChange={(e) => setFilter({ ...filter, search: e.target.value })}
            className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
          />
        </div>

        <select
          value={filter.type}
          onChange={(e) => setFilter({ ...filter, type: e.target.value })}
          className="px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
        >
          <option value="">Tüm Türler</option>
          <option value="MEMBER_JOIN">Üye Katıldı</option>
          <option value="MEMBER_LEAVE">Üye Ayrıldı</option>
          <option value="MEMBER_BAN">Yasaklama</option>
          <option value="MEMBER_KICK">Atma</option>
          <option value="ROLE_CREATE">Rol Oluşturma</option>
          <option value="CHANNEL_CREATE">Kanal Oluşturma</option>
          <option value="SETTINGS_CHANGE">Ayar Değişikliği</option>
        </select>

        <button
          onClick={() => exportLogs('json')}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg flex items-center gap-2 transition"
        >
          <ArrowDownTrayIcon className="w-4 h-4" />
          Dışa Aktar
        </button>
      </div>

      {/* Logs List */}
      {filteredLogs.length === 0 ? (
        <EmptyState
          type="audit"
          title="Denetim Kaydı Yok"
          description="Henüz bu sunucuda kayıtlı bir işlem yok."
        />
      ) : (
        <div className="space-y-3">
          {filteredLogs.map((log, index) => {
            const SeverityIcon = severityIcons[log.severity];
            
            return (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 hover:border-gray-600 transition"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${severityColors[log.severity]} flex items-center justify-center flex-shrink-0`}>
                    <SeverityIcon className="w-5 h-5 text-white" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-white font-semibold">{log.action}</h4>
                      <span className="text-xs text-gray-500">
                        {new Date(log.timestamp).toLocaleString('tr-TR')}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span className="flex items-center gap-1">
                        <UserIcon className="w-4 h-4" />
                        ID: {log.userId}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-xs ${
                        log.severity === 'danger' ? 'bg-red-500/20 text-red-400' :
                        log.severity === 'warning' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-blue-500/20 text-blue-400'
                      }`}>
                        {log.type}
                      </span>
                    </div>

                    {log.details && Object.keys(log.details).length > 0 && (
                      <div className="mt-2 text-xs text-gray-500">
                        {JSON.stringify(log.details)}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition"
          >
            Önceki
          </button>
          <span className="text-gray-400">
            Sayfa {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition"
          >
            Sonraki
          </button>
        </div>
      )}
    </div>
  );
}
