'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DocumentTextIcon,
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
  XCircleIcon,
  BellAlertIcon,
  ChevronUpIcon,
} from '@heroicons/react/24/outline';
import LoadingSkeleton from '../LoadingSkeleton';
import EmptyState from '../EmptyState';
import { useNotification } from '@/contexts/NotificationContext';
import { useSocket } from '@/contexts/SocketContext';
import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';

interface AuditLogProps {
  guildId: string;
  userId: string;
}

interface AuditEntry {
  id: string;
  type: string;
  userId: string;
  targetId?: string;
  action: string;
  details: any;
  severity: 'info' | 'warning' | 'danger' | 'success';
  timestamp: string;
  username?: string;
  avatar?: string;
}

const severityConfig = {
  info: {
    color: 'from-blue-500 to-cyan-500',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    text: 'text-blue-400',
    icon: InformationCircleIcon,
    dot: 'bg-blue-500',
  },
  success: {
    color: 'from-green-500 to-emerald-500',
    bg: 'bg-green-500/10',
    border: 'border-green-500/30',
    text: 'text-green-400',
    icon: CheckCircleIcon,
    dot: 'bg-green-500',
  },
  warning: {
    color: 'from-yellow-500 to-orange-500',
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/30',
    text: 'text-yellow-400',
    icon: ExclamationTriangleIcon,
    dot: 'bg-yellow-500',
  },
  danger: {
    color: 'from-red-500 to-pink-600',
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    text: 'text-red-400',
    icon: XCircleIcon,
    dot: 'bg-red-500',
  },
};

const actionIcons: Record<string, any> = {
  MEMBER_JOIN: ArrowRightOnRectangleIcon,
  MEMBER_LEAVE: ArrowRightOnRectangleIcon,
  MEMBER_BAN: ShieldCheckIcon,
  MEMBER_KICK: ShieldCheckIcon,
  ROLE_CREATE: PlusCircleIcon,
  ROLE_UPDATE: PencilSquareIcon,
  ROLE_DELETE: TrashIcon,
  CHANNEL_CREATE: PlusCircleIcon,
  CHANNEL_UPDATE: PencilSquareIcon,
  CHANNEL_DELETE: TrashIcon,
  SETTINGS_CHANGE: Cog6ToothIcon,
  MESSAGE_DELETE: TrashIcon,
  default: DocumentTextIcon,
};

function getAvatarUrl(userId: string, avatar?: string | null) {
  if (avatar) {
    return `https://cdn.discordapp.com/avatars/${userId}/${avatar}.png?size=128`;
  }
  const defaultIndex = Number(BigInt(userId) % 6n);
  return `https://cdn.discordapp.com/embed/avatars/${defaultIndex}.png`;
}

export default function AuditLog({ guildId, userId }: AuditLogProps) {
  const [logs, setLogs] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ type: '', severity: '', search: '' });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [newLogsCount, setNewLogsCount] = useState(0);
  const [expandedLogs, setExpandedLogs] = useState<Set<string>>(new Set());
  const { showNotification } = useNotification();

  // Fix hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Socket.IO real-time updates
  const { socket, on, off } = useSocket();

  useEffect(() => {
    if (!socket || !guildId) {
      console.log('[AuditLog] Waiting for socket and guildId...', { socket: !!socket, guildId });
      return;
    }

    console.log('[AuditLog] Socket ready, joining guild room:', guildId);

    const handleAuditLogEntry = (entry: AuditEntry) => {
      if (!entry || !entry.id) {
        console.warn('[AuditLog] Invalid entry received:', entry);
        return;
      }

      console.log('[AuditLog] New real-time entry:', entry.action);
      
      // Add new entry to the top of the list (avoid duplicates)
      setLogs(prevLogs => {
        const exists = prevLogs.some(log => log.id === entry.id);
        if (exists) return prevLogs;
        return [entry, ...prevLogs];
      });

      // Increment new logs counter
      setNewLogsCount(prev => prev + 1);
      
      // Show notification for important events
      if (entry.severity === 'danger' || entry.severity === 'warning') {
        const notificationType = entry.severity === 'danger' ? 'error' : 'warning';
        showNotification(`Yeni Denetim Kaydı: ${entry.action}`, notificationType);
      }
    };

    // Join guild room
    console.log('[AuditLog] Emitting join_guild:', guildId);
    socket.emit('join_guild', guildId);
    on('audit_log_entry', handleAuditLogEntry);

    return () => {
      console.log('[AuditLog] Leaving guild room:', guildId);
      socket.emit('leave_guild', guildId);
      off('audit_log_entry', handleAuditLogEntry);
    };
  }, [socket, guildId, on, off, showNotification]);

  const fetchLogs = useCallback(async (pageNum: number = 1) => {
    if (!guildId) {
      setLoading(false);
      return;
    }

    try {
      if (pageNum === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://neuroviabot.xyz';
      const params = new URLSearchParams({
        page: pageNum.toString(),
        limit: '50',
        ...(filter.type && { type: filter.type }),
        ...(filter.severity && { severity: filter.severity }),
      });

      const response = await fetch(`${API_URL}/api/audit/${guildId}?${params}`, {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        const newLogs = data.logs || [];

        if (pageNum === 1) {
          setLogs(newLogs);
        } else {
          setLogs(prev => [...prev, ...newLogs]);
        }

        setTotalPages(data.totalPages || 1);
        setHasMore(pageNum < (data.totalPages || 1));
      } else {
        console.error('[AuditLog] Failed to fetch logs:', response.status);
        setLogs([]);
      }
    } catch (error) {
      console.error('[AuditLog] Error fetching audit logs:', error);
      setLogs([]);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [guildId, filter.type, filter.severity]);

  useEffect(() => {
    setPage(1);
    fetchLogs(1);
  }, [fetchLogs]);

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchLogs(nextPage);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setNewLogsCount(0);
  };

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
        a.download = `audit-log-${guildId}-${Date.now()}.${format}`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error exporting logs:', error);
    }
  };

  const toggleExpanded = (logId: string) => {
    setExpandedLogs(prev => {
      const next = new Set(prev);
      if (next.has(logId)) {
        next.delete(logId);
      } else {
        next.add(logId);
      }
      return next;
    });
  };

  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      if (filter.search) {
        const searchLower = filter.search.toLowerCase();
        return (
          log.action.toLowerCase().includes(searchLower) ||
          log.type.toLowerCase().includes(searchLower) ||
          log.username?.toLowerCase().includes(searchLower) ||
          log.userId.includes(searchLower)
        );
      }
      return true;
    });
  }, [logs, filter.search]);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-pulse text-gray-400">Yükleniyor...</div>
      </div>
    );
  }

  if (loading) {
    return <LoadingSkeleton type="list" />;
  }

  return (
    <div className="relative space-y-6">
      {/* Floating new logs badge */}
      <AnimatePresence>
        {newLogsCount > 0 && (
          <motion.button
            initial={{ opacity: 0, y: -20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.8 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={scrollToTop}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full shadow-xl hover:shadow-2xl transition-all flex items-center gap-2 font-semibold"
          >
            <BellAlertIcon className="w-5 h-5" />
            {newLogsCount} yeni kayıt
            <ChevronUpIcon className="w-4 h-4" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Header & Filters */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-400 to-pink-400">
              Denetim Günlüğü
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              Sunucudaki tüm işlemleri gerçek zamanlı takip edin
            </p>
          </div>
          
          <motion.button
            onClick={() => exportLogs('json')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-gradient-to-r from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 hover:border-white/20 text-white rounded-xl flex items-center gap-2 transition-all"
          >
            <ArrowDownTrayIcon className="w-4 h-4" />
            Dışa Aktar
          </motion.button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="İşlem, kullanıcı veya ID ara..."
              value={filter.search}
              onChange={(e) => setFilter({ ...filter, search: e.target.value })}
              className="w-full pl-10 pr-4 py-2.5 bg-white/5 backdrop-blur-xl border border-white/10 focus:border-purple-500/50 rounded-xl text-white placeholder-gray-500 focus:outline-none transition-colors"
            />
          </div>

          <select
            value={filter.type}
            onChange={(e) => setFilter({ ...filter, type: e.target.value })}
            className="px-4 py-2.5 bg-white/5 backdrop-blur-xl border border-white/10 focus:border-purple-500/50 rounded-xl text-white focus:outline-none transition-colors"
          >
            <option value="" className="bg-gray-900">Tüm Türler</option>
            <option value="MEMBER_JOIN" className="bg-gray-900">Üye Katıldı</option>
            <option value="MEMBER_LEAVE" className="bg-gray-900">Üye Ayrıldı</option>
            <option value="MEMBER_BAN" className="bg-gray-900">Yasaklama</option>
            <option value="MEMBER_KICK" className="bg-gray-900">Atma</option>
            <option value="ROLE_CREATE" className="bg-gray-900">Rol Oluşturma</option>
            <option value="CHANNEL_CREATE" className="bg-gray-900">Kanal Oluşturma</option>
            <option value="SETTINGS_CHANGE" className="bg-gray-900">Ayar Değişikliği</option>
          </select>

          <select
            value={filter.severity}
            onChange={(e) => setFilter({ ...filter, severity: e.target.value })}
            className="px-4 py-2.5 bg-white/5 backdrop-blur-xl border border-white/10 focus:border-purple-500/50 rounded-xl text-white focus:outline-none transition-colors"
          >
            <option value="" className="bg-gray-900">Tüm Seviyeler</option>
            <option value="info" className="bg-gray-900">Bilgi</option>
            <option value="success" className="bg-gray-900">Başarılı</option>
            <option value="warning" className="bg-gray-900">Uyarı</option>
            <option value="danger" className="bg-gray-900">Tehlikeli</option>
          </select>
        </div>
      </div>

      {/* Timeline */}
      {filteredLogs.length === 0 ? (
        <EmptyState
          type="audit"
          title="Denetim Kaydı Yok"
          description="Henüz bu sunucuda kayıtlı bir işlem yok."
        />
      ) : (
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-[21px] top-8 bottom-8 w-0.5 bg-gradient-to-b from-purple-500/20 via-blue-500/20 to-transparent" />

          {/* Timeline Items */}
          <div className="space-y-6">
            {filteredLogs.map((log, index) => {
              // Safety checks
              if (!log || !log.id || !log.severity) {
                return null;
              }

              const config = severityConfig[log.severity] || severityConfig.info;
              const ActionIcon = actionIcons[log.type] || actionIcons.default;
              const isExpanded = expandedLogs.has(log.id);
              const hasDetails = log.details && Object.keys(log.details).length > 0;

              return (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: Math.min(index * 0.03, 0.3) }}
                  className="relative flex gap-4"
                >
                  {/* Avatar & Timeline Dot */}
                  <div className="relative flex-shrink-0">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-white/10 bg-gray-800"
                    >
                      <img
                        src={getAvatarUrl(log.userId, log.avatar)}
                        alt={log.username || 'User'}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </motion.div>

                    {/* Status Dot */}
                    <div className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 ${config.dot} rounded-full border-2 border-gray-900`} />
                  </div>

                  {/* Content Card */}
                  <motion.div
                    whileHover={{ scale: 1.01, y: -2 }}
                    className="flex-1 group"
                  >
                    <div className={`relative bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-2xl border ${config.border} rounded-xl p-4 hover:border-white/20 transition-all duration-300 shadow-lg hover:shadow-xl`}>
                      {/* Glow Effect */}
                      <div className={`absolute inset-0 ${config.bg} opacity-0 group-hover:opacity-100 rounded-xl blur-xl transition-opacity duration-500`} />

                      {/* Header */}
                      <div className="relative flex items-start justify-between gap-3 mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <ActionIcon className={`w-4 h-4 ${config.text}`} />
                            <h3 className="text-white font-bold text-sm">{log.action}</h3>
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400">
                            <span className="flex items-center gap-1">
                              <UserIcon className="w-3 h-3" />
                              {log.username || 'Unknown User'}
                            </span>
                            <span>•</span>
                            <span className="font-mono text-gray-500">{log.userId}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded-lg ${config.bg} ${config.text} text-xs font-medium`}>
                            {log.type}
                          </span>
                          
                          <div className="text-right">
                            <ClockIcon className="w-3 h-3 text-gray-500 inline mr-1" />
                            <span className="text-xs text-gray-500" title={new Date(log.timestamp).toLocaleString('tr-TR')}>
                              {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true, locale: tr })}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Details Toggle */}
                      {hasDetails && (
                        <div>
                          <button
                            onClick={() => toggleExpanded(log.id)}
                            className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-300 transition-colors mt-2"
                          >
                            <ChevronDownIcon className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                            {isExpanded ? 'Detayları Gizle' : 'Detayları Göster'}
                          </button>

                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-2 p-3 bg-black/20 rounded-lg overflow-hidden"
                              >
                                <pre className="text-xs text-gray-400 overflow-x-auto">
                                  {JSON.stringify(log.details, null, 2)}
                                </pre>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      )}
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>

          {/* Load More Button */}
          {hasMore && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-center mt-8"
            >
              <button
                onClick={loadMore}
                disabled={loadingMore}
                className="px-6 py-3 bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-xl border border-white/10 hover:border-white/20 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105"
              >
                {loadingMore ? (
                  <div className="flex items-center gap-2">
                    <ArrowPathIcon className="w-5 h-5 animate-spin" />
                    Yükleniyor...
                  </div>
                ) : (
                  `Daha Fazla Yükle (${page}/${totalPages})`
                )}
              </button>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}
