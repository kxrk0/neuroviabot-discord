import React from 'react';
import Link from 'next/link';
import { FaDiscord, FaTwitter, FaGithub } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-gray-900/80 backdrop-blur-xl border-t border-white/10 text-gray-400 py-8 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start space-y-8 md:space-y-0">
          <div className="flex flex-col items-center md:items-start">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
              </div>
              <span className="text-xl font-black text-white">Neurovia</span>
            </Link>
            <p className="text-sm text-gray-500 mt-2">&copy; {new Date().getFullYear()} Neurovia. Tüm hakları saklıdır.</p>
          </div>

          <div className="flex flex-col md:flex-row gap-8 md:gap-12 text-center md:text-left">
            <div>
              <h4 className="text-white font-semibold mb-3">Hızlı Bağlantılar</h4>
              <ul className="space-y-2">
                <li><Link href="/" className="hover:text-white transition-colors text-sm">Ana Sayfa</Link></li>
                <li><Link href="/servers" className="hover:text-white transition-colors text-sm">Sunucularım</Link></li>
                <li><Link href="/komutlar" className="hover:text-white transition-colors text-sm">Komutlar</Link></li>
                <li><Link href="/ozellikler" className="hover:text-white transition-colors text-sm">Özellikler</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Kaynaklar</h4>
              <ul className="space-y-2">
                <li><Link href="/api-dokumantasyon" className="hover:text-white transition-colors text-sm">API Dokümantasyonu</Link></li>
                <li><Link href="/blog" className="hover:text-white transition-colors text-sm">Blog</Link></li>
                <li><Link href="/destek" className="hover:text-white transition-colors text-sm">Destek</Link></li>
                <li><Link href="/geri-bildirim" className="hover:text-white transition-colors text-sm">Geri Bildirim</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Şirket</h4>
              <ul className="space-y-2">
                <li><Link href="/hakkimizda" className="hover:text-white transition-colors text-sm">Hakkımızda</Link></li>
                <li><Link href="/kariyer" className="hover:text-white transition-colors text-sm">Kariyer</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors text-sm">Gizlilik Politikası</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors text-sm">Kullanım Şartları</Link></li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col items-center md:items-end">
            <h4 className="text-white font-semibold mb-3">Bizi Takip Edin</h4>
            <div className="flex gap-4">
              <a href="https://discord.gg/yourinvite" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <FaDiscord className="w-6 h-6" />
              </a>
              <a href="https://twitter.com/yourtwitter" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <FaTwitter className="w-6 h-6" />
              </a>
              <a href="https://github.com/yourgithub" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <FaGithub className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
