'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || 'https://neuroviabot.xyz';

interface UseSocketOptions {
  guildId?: string;
  onSettingsChanged?: (data: any) => void;
}

export function useSocket({ guildId, onSettingsChanged }: UseSocketOptions = {}) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Create socket connection
    const newSocket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    newSocket.on('connect', () => {
      console.log('[Socket.IO] Connected:', newSocket.id);
      setConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('[Socket.IO] Disconnected');
      setConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('[Socket.IO] Connection error:', error);
    });

    socketRef.current = newSocket;
    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  // Join guild room when guildId changes
  useEffect(() => {
    if (socket && connected && guildId) {
      console.log(`[Socket.IO] Joining guild room: ${guildId}`);
      socket.emit('join_guild', guildId);

      return () => {
        console.log(`[Socket.IO] Leaving guild room: ${guildId}`);
        socket.emit('leave_guild', guildId);
      };
    }
  }, [socket, connected, guildId]);

  // Listen for settings changes
  useEffect(() => {
    if (socket && onSettingsChanged) {
      socket.on('settings_changed', onSettingsChanged);

      return () => {
        socket.off('settings_changed', onSettingsChanged);
      };
    }
  }, [socket, onSettingsChanged]);

  // Emit settings update
  const emitSettingsUpdate = useCallback((guildId: string, settings: any) => {
    if (socket && connected) {
      console.log(`[Socket.IO] Emitting settings update for guild ${guildId}`);
      socket.emit('settings_update', { guildId, settings });
    }
  }, [socket, connected]);

  // Join specific room
  const joinRoom = useCallback((room: string) => {
    if (socket && connected) {
      socket.emit('join_room', room);
    }
  }, [socket, connected]);

  // Leave specific room
  const leaveRoom = useCallback((room: string) => {
    if (socket && connected) {
      socket.emit('leave_room', room);
    }
  }, [socket, connected]);

  // Emit custom event
  const emit = useCallback((event: string, data: any) => {
    if (socket && connected) {
      socket.emit(event, data);
    }
  }, [socket, connected]);

  // Listen for custom event
  const on = useCallback((event: string, handler: (data: any) => void) => {
    if (socket) {
      socket.on(event, handler);
    }
  }, [socket]);

  // Remove event listener
  const off = useCallback((event: string, handler?: (data: any) => void) => {
    if (socket) {
      if (handler) {
        socket.off(event, handler);
      } else {
        socket.off(event);
      }
    }
  }, [socket]);

  return {
    socket,
    connected,
    emitSettingsUpdate,
    joinRoom,
    leaveRoom,
    emit,
    on,
    off,
  };
}
