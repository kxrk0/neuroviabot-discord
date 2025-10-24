'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';

interface SocketContextType {
    socket: Socket | null;
    connected: boolean;
    on: (event: string, handler: (...args: any[]) => void) => void;
    off: (event: string, handler?: (...args: any[]) => void) => void;
    emit: (event: string, ...args: any[]) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://neuroviabot.xyz';
        
        // Initialize socket connection
        const newSocket = io(API_URL, {
            withCredentials: true,
            transports: ['websocket', 'polling'],
        });
        
        // Set socket immediately so components can access it
        setSocket(newSocket);

        newSocket.on('connect', () => {
            console.log('[Socket] Connected:', newSocket.id);
            setConnected(true);
        });

        newSocket.on('disconnect', () => {
            console.log('[Socket] Disconnected');
            setConnected(false);
        });

        newSocket.on('connect_error', (error) => {
            console.error('[Socket] Connection error:', error);
            setConnected(false);
        });

        return () => {
            newSocket.close();
        };
    }, []);

    const on = (event: string, handler: (...args: any[]) => void) => {
        if (socket) {
            socket.on(event, handler);
        }
    };

    const off = (event: string, handler?: (...args: any[]) => void) => {
        if (socket) {
            if (handler) {
                socket.off(event, handler);
            } else {
                socket.off(event);
            }
        }
    };

    const emit = (event: string, ...args: any[]) => {
        if (socket && connected) {
            socket.emit(event, ...args);
        }
    };

    return (
        <SocketContext.Provider value={{ socket, connected, on, off, emit }}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error('useSocket must be used within SocketProvider');
    }
    return context;
};

