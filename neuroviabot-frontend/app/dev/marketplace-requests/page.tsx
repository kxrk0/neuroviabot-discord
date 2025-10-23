'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FunnelIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserIcon,
  BuildingStorefrontIcon,
} from '@heroicons/react/24/outline';

interface ProductRequest {
  requestId: string;
  guildId: string;
  guildName: string;
  guildIcon?: string;
  createdBy: string;
  creatorUsername: string;
  creatorAvatar?: string;
  category: 'role' | 'custom';
  title: string;
  icon?: string;
  images: string[];
  description: string;
  price: number;
  seller: string;
  deliveryType: 'instant' | 'manual';
  deliveryData: any;
  status: 'pending' | 'approved' | 'denied';
  createdAt: string;
  reviewNote?: string;
}

interface Stats {
  requests: {
    total: number;
    pending: number;
    approved: number;
    denied: number;
    approvalRate: string;
  };
  products: {
    total: number;
    published: number;
    unpublished: number;
  };
  orders: {
    total: number;
  };
  performance: {
    avgResponseTime: string;
  };
}

export default function MarketplaceRequestsPage() {
  const router = useRouter();
  const [requests, setRequests] = useState<ProductRequest[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'pending' | 'approved' | 'denied'>('pending');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'role' | 'custom'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'price-high' | 'price-low'>('newest');
  const [selectedRequest, setSelectedRequest] = useState<ProductRequest | null>(null);
  const [reviewNote, setReviewNote] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    checkAccess();
    fetchRequests();
    fetchStats();
  }, [selectedStatus, selectedCategory, sortBy]);

  const checkAccess = async () => {
    try {
      await axios.get('/api/dev/check-access');
    } catch (error) {
      router.push('/');
    }
  };

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      
      const params = new URLSearchParams();
      if (selectedStatus !== 'all') params.append('status', selectedStatus);
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      params.append('sort', sortBy);

      const response = await axios.get(`${API_URL}/api/dev/marketplace/pending?${params.toString()}`);
      
      if (response.data.success) {
        setRequests(response.data.requests);
      }
    } catch (error) {
      console.error('Failed to fetch requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      const response = await axios.get(`${API_URL}/api/dev/marketplace/stats`);
      
      if (response.data.success) {
        setStats(response.data.stats);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const handleApprove = async (requestId: string) => {
    if (!confirm('Bu ürün talebini onaylamak istediğinizden emin misiniz?')) return;

    try {
      setActionLoading(true);
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      
      const response = await axios.post(`${API_URL}/api/dev/marketplace/approve/${requestId}`, {
        reviewNote: reviewNote || 'Approved'
      });

      if (response.data.success) {
        alert('Ürün talebi başarıyla onaylandı!');
        setSelectedRequest(null);
        setReviewNote('');
        fetchRequests();
        fetchStats();
      }
    } catch (error) {
      console.error('Failed to approve request:', error);
      alert('Onaylama işlemi başarısız oldu.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeny = async (requestId: string) => {
    if (!reviewNote.trim()) {
      alert('Red nedeni belirtmelisiniz.');
      return;
    }

    if (!confirm('Bu ürün talebini reddetmek istediğinizden emin misiniz?')) return;

    try {
      setActionLoading(true);
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      
      const response = await axios.post(`${API_URL}/api/dev/marketplace/deny/${requestId}`, {
        reviewNote
      });

      if (response.data.success) {
        alert('Ürün talebi reddedildi.');
        setSelectedRequest(null);
        setReviewNote('');
        fetchRequests();
        fetchStats();
      }
    } catch (error) {
      console.error('Failed to deny request:', error);
      alert('Reddetme işlemi başarısız oldu.');
    } finally {
      setActionLoading(false);
    }
  };

  const getPriceValidation = (price: number) => {
    if (price < 100) return { color: 'text-green-400', label: 'Uygun' };
    if (price > 5000) return { color: 'text-red-400', label: 'Yüksek' };
    return { color: 'text-yellow-400', label: 'Normal' };
  };

  if (loading && requests.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Marketplace Product Requests</h1>
          <p className="text-gray-200">Review and approve/deny product requests from server owners</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gray-800 rounded-lg p-6">
              <p className="text-gray-400 text-sm mb-2">Pending Requests</p>
              <p className="text-3xl font-bold text-yellow-400">{stats.requests.pending}</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-6">
              <p className="text-gray-400 text-sm mb-2">Approval Rate</p>
              <p className="text-3xl font-bold text-green-400">{stats.requests.approvalRate}</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-6">
              <p className="text-gray-400 text-sm mb-2">Total Products</p>
              <p className="text-3xl font-bold text-blue-400">{stats.products.total}</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-6">
              <p className="text-gray-400 text-sm mb-2">Avg Response Time</p>
              <p className="text-3xl font-bold text-purple-400">{stats.performance.avgResponseTime}</p>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <FunnelIcon className="w-5 h-5 text-gray-400" />
            <span className="font-semibold">Filters</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Status Filter */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as any)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-emerald-500 focus:outline-none"
              >
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="denied">Denied</option>
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as any)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-emerald-500 focus:outline-none"
              >
                <option value="all">All Categories</option>
                <option value="role">Role</option>
                <option value="custom">Custom</option>
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-emerald-500 focus:outline-none"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="price-high">Price: High to Low</option>
                <option value="price-low">Price: Low to High</option>
              </select>
            </div>
          </div>
        </div>

        {/* Requests Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {requests.length === 0 ? (
            <div className="col-span-full text-center py-16">
              <p className="text-gray-400 text-lg">No requests found</p>
            </div>
          ) : (
            requests.map((request) => {
              const priceValidation = getPriceValidation(request.price);
              
              return (
                <motion.div
                  key={request.requestId}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition cursor-pointer"
                  onClick={() => setSelectedRequest(request)}
                >
                  {/* Status Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                      request.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                      request.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {request.status.toUpperCase()}
                    </div>
                    <div className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs font-semibold rounded">
                      {request.category === 'role' ? 'Role' : 'Custom'}
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xl font-bold mb-2">{request.title}</h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">{request.description}</p>

                  {/* Price */}
                  <div className="flex items-center gap-2 mb-4">
                    <CurrencyDollarIcon className="w-5 h-5 text-emerald-400" />
                    <span className="text-2xl font-bold text-white">{request.price}</span>
                    <span className="text-gray-400">NRC</span>
                    <span className={`ml-auto text-xs font-semibold ${priceValidation.color}`}>
                      {priceValidation.label}
                    </span>
                  </div>

                  {/* Guild Info */}
                  <div className="flex items-center gap-2 mb-2 text-sm">
                    <BuildingStorefrontIcon className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-300">{request.guildName}</span>
                  </div>

                  {/* Creator Info */}
                  <div className="flex items-center gap-2 text-sm">
                    <UserIcon className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-300">{request.creatorUsername}</span>
                  </div>

                  {/* Date */}
                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <ClockIcon className="w-4 h-4" />
                      {new Date(request.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedRequest && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedRequest(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-gray-800 rounded-2xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-3xl font-black mb-6">{selectedRequest.title}</h2>

              {/* Product Details */}
              <div className="space-y-6 mb-6">
                <div>
                  <h4 className="text-sm font-semibold text-gray-400 mb-2">Description</h4>
                  <p className="text-white">{selectedRequest.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-400 mb-2">Price</h4>
                    <p className="text-2xl font-bold text-emerald-400">{selectedRequest.price} NRC</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-400 mb-2">Category</h4>
                    <p className="text-white">{selectedRequest.category === 'role' ? 'Role' : 'Custom'}</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-400 mb-2">Seller Name</h4>
                  <p className="text-white">{selectedRequest.seller}</p>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-400 mb-2">Delivery Type</h4>
                  <p className="text-white">{selectedRequest.deliveryType === 'instant' ? 'Instant' : 'Manual'}</p>
                </div>

                <div className="p-4 bg-gray-700 rounded-lg">
                  <h4 className="text-sm font-semibold text-gray-400 mb-2">Guild</h4>
                  <p className="text-white font-semibold">{selectedRequest.guildName}</p>
                  <p className="text-gray-400 text-sm">ID: {selectedRequest.guildId}</p>
                </div>

                <div className="p-4 bg-gray-700 rounded-lg">
                  <h4 className="text-sm font-semibold text-gray-400 mb-2">Requester</h4>
                  <p className="text-white font-semibold">{selectedRequest.creatorUsername}</p>
                  <p className="text-gray-400 text-sm">ID: {selectedRequest.createdBy}</p>
                </div>
              </div>

              {/* Review Note Input (for both approve and deny) */}
              {selectedRequest.status === 'pending' && (
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-400 mb-2">
                    Review Note (Optional for approve, Required for deny)
                  </label>
                  <textarea
                    value={reviewNote}
                    onChange={(e) => setReviewNote(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-emerald-500 focus:outline-none resize-none"
                    rows={3}
                    placeholder="Enter reason or note..."
                  />
                </div>
              )}

              {/* Existing Review Note (if already reviewed) */}
              {selectedRequest.reviewNote && (
                <div className="mb-6 p-4 bg-gray-700 rounded-lg">
                  <h4 className="text-sm font-semibold text-gray-400 mb-2">Review Note</h4>
                  <p className="text-white">{selectedRequest.reviewNote}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-4">
                {selectedRequest.status === 'pending' ? (
                  <>
                    <button
                      onClick={() => handleApprove(selectedRequest.requestId)}
                      disabled={actionLoading}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-bold transition disabled:opacity-50"
                    >
                      <CheckCircleIcon className="w-5 h-5" />
                      {actionLoading ? 'Processing...' : 'Approve'}
                    </button>
                    <button
                      onClick={() => handleDeny(selectedRequest.requestId)}
                      disabled={actionLoading}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-bold transition disabled:opacity-50"
                    >
                      <XCircleIcon className="w-5 h-5" />
                      {actionLoading ? 'Processing...' : 'Deny'}
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setSelectedRequest(null)}
                    className="flex-1 px-6 py-3 bg-gray-600 hover:bg-gray-700 rounded-lg font-bold transition"
                  >
                    Close
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

