'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowsRightLeftIcon,
  UserIcon,
  CheckCircleIcon,
  XMarkIcon,
  ClockIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';

interface TradeOffer {
  id: string;
  from: {
    userId: string;
    username: string;
    avatar: string;
  };
  to: {
    userId: string;
    username: string;
    avatar: string;
  };
  amount: number;
  message?: string;
  status: 'pending' | 'accepted' | 'rejected' | 'countered';
  counterOffer?: number;
  timestamp: number;
  expiresAt: number;
}

interface TradingPanelProps {
  userId: string;
  username: string;
}

export default function TradingPanel({ userId, username }: TradingPanelProps) {
  const [activeTab, setActiveTab] = useState<'send' | 'received' | 'history'>('send');
  const [receivedOffers, setReceivedOffers] = useState<TradeOffer[]>([]);
  const [sentOffers, setSentOffers] = useState<TradeOffer[]>([]);
  const [tradeHistory, setTradeHistory] = useState<TradeOffer[]>([]);
  const [loading, setLoading] = useState(true);
  
  // New trade form
  const [newTrade, setNewTrade] = useState({
    targetUser: '',
    amount: 0,
    message: ''
  });

  useEffect(() => {
    fetchTrades();
  }, [userId]);

  const fetchTrades = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://neuroviabot.xyz';
      const response = await axios.get(`${API_URL}/api/nrc/trades/${userId}`);
      
      if (response.data.success) {
        setReceivedOffers(response.data.received || []);
        setSentOffers(response.data.sent || []);
        setTradeHistory(response.data.history || []);
      }
    } catch (error) {
      console.error('Failed to fetch trades:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendTradeOffer = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://neuroviabot.xyz';
      const response = await axios.post(`${API_URL}/api/nrc/trade/offer`, {
        fromUserId: userId,
        toUserId: newTrade.targetUser,
        amount: newTrade.amount,
        message: newTrade.message
      });

      if (response.data.success) {
        setNewTrade({ targetUser: '', amount: 0, message: '' });
        fetchTrades();
      }
    } catch (error: any) {
      console.error('Failed to send trade offer:', error);
      alert(error.response?.data?.message || 'Trade offer failed');
    }
  };

  const handleTradeAction = async (tradeId: string, action: 'accept' | 'reject' | 'counter', counterAmount?: number) => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://neuroviabot.xyz';
      const response = await axios.post(`${API_URL}/api/nrc/trade/${action}`, {
        tradeId,
        userId,
        counterAmount
      });

      if (response.data.success) {
        fetchTrades();
      }
    } catch (error: any) {
      console.error(`Failed to ${action} trade:`, error);
      alert(error.response?.data?.message || `Trade ${action} failed`);
    }
  };

  const getTimeRemaining = (expiresAt: number) => {
    const now = Date.now();
    const remaining = expiresAt - now;
    
    if (remaining < 0) return 'Expired';
    
    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-yellow-500/20 to-amber-500/20 rounded-xl">
            <ArrowsRightLeftIcon className="w-6 h-6 text-yellow-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">NRC Trading</h2>
            <p className="text-sm text-gray-400">P2P güvenli ticaret sistemi</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-white/5 rounded-xl border border-white/10">
        {[
          { id: 'send', label: 'Teklif Gönder', icon: ArrowsRightLeftIcon },
          { id: 'received', label: `Gelen (${receivedOffers.length})`, icon: ClockIcon },
          { id: 'history', label: 'Geçmiş', icon: ShieldCheckIcon }
        ].map((tab) => {
          const TabIcon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <TabIcon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {/* Send Trade Offer */}
        {activeTab === 'send' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
              <h3 className="text-lg font-bold text-white mb-4">Yeni Teklif Gönder</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Kullanıcı ID
                  </label>
                  <input
                    type="text"
                    value={newTrade.targetUser}
                    onChange={(e) => setNewTrade({ ...newTrade, targetUser: e.target.value })}
                    placeholder="Discord User ID"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    NRC Miktarı
                  </label>
                  <input
                    type="number"
                    value={newTrade.amount}
                    onChange={(e) => setNewTrade({ ...newTrade, amount: parseFloat(e.target.value) })}
                    placeholder="0.00"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Mesaj (Opsiyonel)
                  </label>
                  <textarea
                    value={newTrade.message}
                    onChange={(e) => setNewTrade({ ...newTrade, message: e.target.value })}
                    placeholder="Teklif mesajınız..."
                    rows={3}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 resize-none"
                  />
                </div>

                <button
                  onClick={sendTradeOffer}
                  disabled={!newTrade.targetUser || newTrade.amount <= 0}
                  className="w-full px-6 py-3 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all"
                >
                  Teklif Gönder
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Received Offers */}
        {activeTab === 'received' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {receivedOffers.length === 0 ? (
              <div className="p-12 text-center">
                <ClockIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">Gelen teklif bulunmuyor</p>
              </div>
            ) : (
              receivedOffers.map((offer) => (
                <div key={offer.id} className="p-6 bg-white/5 border border-white/10 rounded-2xl hover:border-yellow-500/30 transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={offer.from.avatar || `https://cdn.discordapp.com/embed/avatars/0.png`}
                        alt={offer.from.username}
                        className="w-12 h-12 rounded-full"
                      />
                      <div>
                        <p className="font-bold text-white">{offer.from.username}</p>
                        <p className="text-sm text-gray-400">Teklif: <span className="text-yellow-400 font-bold">{offer.amount} NRC</span></p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">{getTimeRemaining(offer.expiresAt)}</p>
                    </div>
                  </div>

                  {offer.message && (
                    <p className="text-sm text-gray-300 mb-4 p-3 bg-white/5 rounded-lg">
                      "{offer.message}"
                    </p>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleTradeAction(offer.id, 'accept')}
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
                    >
                      <CheckCircleIcon className="w-5 h-5" />
                      Kabul Et
                    </button>
                    <button
                      onClick={() => {
                        const counter = prompt('Karşı teklif (NRC):');
                        if (counter) handleTradeAction(offer.id, 'counter', parseFloat(counter));
                      }}
                      className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all"
                    >
                      Karşı Teklif
                    </button>
                    <button
                      onClick={() => handleTradeAction(offer.id, 'reject')}
                      className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 font-semibold rounded-xl transition-all"
                    >
                      <XMarkIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </motion.div>
        )}

        {/* Trade History */}
        {activeTab === 'history' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {tradeHistory.length === 0 ? (
              <div className="p-12 text-center">
                <ShieldCheckIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">İşlem geçmişi bulunmuyor</p>
              </div>
            ) : (
              tradeHistory.map((trade) => (
                <div key={trade.id} className="p-4 bg-white/5 border border-white/10 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        trade.status === 'accepted' ? 'bg-green-500/20' :
                        trade.status === 'rejected' ? 'bg-red-500/20' :
                        'bg-gray-500/20'
                      }`}>
                        {trade.status === 'accepted' ? <CheckCircleIcon className="w-5 h-5 text-green-400" /> :
                         trade.status === 'rejected' ? <XMarkIcon className="w-5 h-5 text-red-400" /> :
                         <ClockIcon className="w-5 h-5 text-gray-400" />}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">
                          {trade.from.username} → {trade.to.username}
                        </p>
                        <p className="text-xs text-gray-400">
                          {new Date(trade.timestamp).toLocaleDateString('tr-TR')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-yellow-400">{trade.amount} NRC</p>
                      <p className="text-xs text-gray-500 capitalize">{trade.status}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

