'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useUser } from '@/hooks/useUser';
import { useRouter, useParams } from 'next/navigation';
import {
  ArrowLeftIcon,
  ShoppingCartIcon,
  UserIcon,
  ClockIcon,
  TagIcon,
  ChatBubbleLeftIcon
} from '@heroicons/react/24/outline';

export default function ListingDetailPage() {
  const { user } = useUser();
  const router = useRouter();
  const params = useParams();
  const listingId = params.listingId as string;

  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [offerAmount, setOfferAmount] = useState('');
  const [offerMessage, setOfferMessage] = useState('');

  useEffect(() => {
    fetchListing();
  }, [listingId]);

  const fetchListing = async () => {
    try {
      setLoading(true);
      // Mock data for now
      setListing({
        id: listingId,
        name: 'Premium Role',
        description: 'Exclusive premium role with special permissions and color',
        price: 5000,
        seller: '123456',
        sellerName: 'SellerUser',
        guildId: 'global',
        rarity: 'epic',
        icon: '👑',
        type: 'role',
        quantity: 1,
        listed: new Date().toISOString(),
        status: 'active'
      });
    } catch (error) {
      console.error('Error fetching listing:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    try {
      setPurchasing(true);
      const response = await fetch(`/api/marketplace/purchase/${listingId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ buyerId: user.id })
      });

      const data = await response.json();
      if (data.success) {
        alert('Satın alma başarılı!');
        router.push('/marketplace');
      } else {
        alert(data.error || 'Satın alma başarısız');
      }
    } catch (error) {
      console.error('Purchase error:', error);
      alert('Bir hata oluştu');
    } finally {
      setPurchasing(false);
    }
  };

  const handleMakeOffer = async () => {
    if (!user || !offerAmount) return;

    try {
      const response = await fetch('/api/marketplace/offer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listingId,
          buyerId: user.id,
          offerAmount: parseInt(offerAmount),
          message: offerMessage
        })
      });

      const data = await response.json();
      if (data.success) {
        alert('Teklif gönderildi!');
        setOfferAmount('');
        setOfferMessage('');
      } else {
        alert(data.error || 'Teklif gönderilemedi');
      }
    } catch (error) {
      console.error('Offer error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Yükleniyor...</div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">İlan bulunamadı</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          Geri Dön
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Item Preview */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gray-800/50 backdrop-blur-xl border border-white/10 rounded-lg p-8"
          >
            <div className="text-9xl text-center mb-6">{listing.icon}</div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Tür</span>
                <span className="text-white capitalize">{listing.type}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Nadirlik</span>
                <span className="text-white capitalize">{listing.rarity}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Miktar</span>
                <span className="text-white">{listing.quantity}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Satıcı</span>
                <span className="text-white">{listing.sellerName}</span>
              </div>
            </div>
          </motion.div>

          {/* Right: Details & Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Title & Description */}
            <div className="bg-gray-800/50 backdrop-blur-xl border border-white/10 rounded-lg p-6">
              <h1 className="text-3xl font-black text-white mb-4">{listing.name}</h1>
              <p className="text-gray-300 leading-relaxed">{listing.description}</p>
            </div>

            {/* Price & Purchase */}
            <div className="bg-gray-800/50 backdrop-blur-xl border border-white/10 rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <span className="text-gray-400">Fiyat</span>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
                    <span>🪙</span>
                  </div>
                  <span className="text-3xl font-bold text-white">{listing.price.toLocaleString()}</span>
                  <span className="text-gray-400">NRC</span>
                </div>
              </div>

              <button
                onClick={handlePurchase}
                disabled={purchasing || !user}
                className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-bold text-lg hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <ShoppingCartIcon className="w-6 h-6" />
                {purchasing ? 'Satın Alınıyor...' : 'Hemen Satın Al'}
              </button>
            </div>

            {/* Make Offer */}
            <div className="bg-gray-800/50 backdrop-blur-xl border border-white/10 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <ChatBubbleLeftIcon className="w-6 h-6" />
                Teklif Yap
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Teklif Miktarı (NRC)</label>
                  <input
                    type="number"
                    value={offerAmount}
                    onChange={(e) => setOfferAmount(e.target.value)}
                    placeholder="Örn: 4500"
                    className="w-full px-4 py-3 bg-gray-900/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Mesaj (Opsiyonel)</label>
                  <textarea
                    value={offerMessage}
                    onChange={(e) => setOfferMessage(e.target.value)}
                    placeholder="Satıcıya bir mesaj bırakın..."
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500 resize-none"
                  />
                </div>
                <button
                  onClick={handleMakeOffer}
                  disabled={!user || !offerAmount}
                  className="w-full px-6 py-3 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Teklif Gönder
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

