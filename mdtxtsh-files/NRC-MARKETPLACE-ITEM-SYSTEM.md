# 🛒 NRC Marketplace Item Ekleme Sistemi - Detaylı Plan

## 📋 Genel Bakış

Sunucu sahipleri ve yetkili kullanıcıların marketplace'e item ekleyebilmesi, yönetebilmesi ve satabilmesi için kapsamlı bir sistem.

---

## 🎯 Sistem Mimarisi

### **1. İki Katmanlı Yaklaşım**

#### **A. Discord Bot Komutları** (Öncelikli - Kolay Erişim)
- Sunucu sahipleri Discord üzerinden direkt item ekleyebilir
- Modal/Form tabanlı interaktif sistem
- Anında onay/red mekanizması
- Otomatik fiyat önerisi

#### **B. Web Dashboard** (Gelişmiş - Detaylı Yönetim)
- Detaylı item düzenleme
- Toplu işlemler
- İstatistik ve analitik
- Görsel yükleme ve önizleme

---

## 🤖 Discord Bot Komutları

### **Komut: `/marketplace-create`**

**Parametreler:**
```typescript
{
  type: 'item' | 'role' | 'service' | 'custom',
  title: string,           // Başlık (max 50 karakter)
  description: string,     // Açıklama (max 200 karakter)
  price: number,          // NRC Coin fiyatı
  stock: number,          // Stok adedi (-1 = sınırsız)
  duration: number,       // Süre (gün, roller için)
  image_url?: string,     // Opsiyonel görsel URL
  icon_emoji?: string     // Opsiyonel emoji
}
```

**Akış:**
1. Komut çalıştırılır → Modal açılır
2. Form doldurulur → Önizleme gösterilir
3. Onay/İptal → Database'e kaydedilir
4. Otomatik ID oluşturulur → Embed mesajı gönderilir

---

### **Komut: `/marketplace-edit [item_id]`**

**Özellikler:**
- Mevcut item'ı güncelleme
- Fiyat değişikliği (fiyat geçmişi tutulur)
- Stok güncelleme
- Aktif/Pasif durumu

---

### **Komut: `/marketplace-delete [item_id]`**

**Özellikler:**
- Soft delete (veritabanında kalır ama gizlenir)
- Hard delete (tamamen silinir)
- Onay mekanizması (güvenlik)

---

### **Komut: `/marketplace-list`**

**Özellikler:**
- Sunucudaki tüm item'ları listeler
- Filtreleme (kategori, fiyat, durum)
- Sayfalama (10 item/sayfa)
- Hızlı düzenleme butonları

---

### **Komut: `/marketplace-stats [item_id]`**

**Özellikler:**
- Toplam satış
- Kazanç
- En çok satan item
- Trend analizi

---

## 🌐 Web Dashboard (Frontend)

### **Sayfa: `/nrc/marketplace/manage`**

**Bölümler:**

#### **1. Item Oluşturma Formu**
```tsx
interface CreateItemForm {
  // Temel Bilgiler
  title: string;
  description: string;
  category: 'item' | 'role' | 'service' | 'custom';
  
  // Fiyatlandırma
  price: number;
  discount?: {
    percentage: number;
    endDate: Date;
  };
  
  // Stok & Teslimat
  stock: number; // -1 = sınırsız
  autoDeliver: boolean;
  deliveryType: 'instant' | 'manual' | 'scheduled';
  
  // Görsel
  images: string[]; // Carousel için multiple
  icon?: string; // Emoji veya URL
  
  // Gereksinimler
  requirements?: {
    minLevel?: number;
    requiredRole?: string;
    requiredAchievement?: string;
  };
  
  // Süre (Roller için)
  duration?: number; // Gün cinsinden
  
  // Özel Alanlar
  customFields?: {
    key: string;
    value: string;
  }[];
}
```

#### **2. Item Yönetim Tablosu**
- **Kolonlar**: ID, Başlık, Kategori, Fiyat, Stok, Satış, Durum, İşlemler
- **Filtreler**: Kategori, Fiyat Aralığı, Durum, Tarih
- **Toplu İşlemler**: Çoklu seçim, toplu fiyat güncelleme, toplu silme
- **Sürükle-Bırak**: Öncelik sıralaması

#### **3. Satış İstatistikleri**
- **Grafikler**: 
  - Satış trendi (7d, 30d, 90d)
  - Kategori bazlı satışlar
  - En çok satanlar
  - Gelir grafiği
- **Metrikler**:
  - Toplam satış
  - Toplam gelir
  - Ortalama item fiyatı
  - Conversion rate

#### **4. Sipariş Yönetimi**
- Bekleyen siparişler
- Teslim edilen siparişler
- İptal edilen siparişler
- Manuel teslimat için onay sistemi

---

## 🗄️ Database Schema

### **MarketplaceItem Model**
```typescript
interface MarketplaceItem {
  _id: ObjectId;
  itemId: string; // Unique ID (örn: "ITEM_001")
  
  // Sunucu Bilgisi
  guildId: string; // Hangi sunucuya ait
  createdBy: string; // Oluşturan user ID
  
  // Temel Bilgiler
  title: string;
  description: string;
  category: 'item' | 'role' | 'service' | 'custom';
  
  // Fiyatlandırma
  price: number;
  originalPrice?: number; // İndirim varsa orijinal fiyat
  priceHistory: {
    price: number;
    changedAt: Date;
    changedBy: string;
  }[];
  
  // Stok
  stock: number; // -1 = unlimited
  sold: number;
  
  // Görsel
  images: string[];
  icon: string; // Emoji veya URL
  
  // Teslimat
  deliveryType: 'instant' | 'manual' | 'scheduled';
  deliveryData?: {
    roleId?: string; // Rol verme
    itemData?: any; // Custom data
    message?: string; // Teslimat mesajı
  };
  
  // Gereksinimler
  requirements?: {
    minLevel?: number;
    requiredRole?: string;
    requiredAchievement?: string;
  };
  
  // Süre
  duration?: number; // Gün cinsinden (roller için)
  
  // Durum
  isActive: boolean;
  isDeleted: boolean;
  isFeatured: boolean; // Öne çıkan
  
  // Metadata
  views: number;
  likes: number;
  tags: string[];
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}
```

### **MarketplaceOrder Model**
```typescript
interface MarketplaceOrder {
  _id: ObjectId;
  orderId: string; // Unique order ID
  
  // Item & User
  itemId: string;
  buyerId: string;
  sellerId: string;
  guildId: string;
  
  // Fiyat
  price: number; // Satın alma anındaki fiyat
  
  // Durum
  status: 'pending' | 'completed' | 'cancelled' | 'refunded';
  
  // Teslimat
  deliveredAt?: Date;
  deliveryProof?: string; // Screenshot veya log
  
  // Transaction
  transactionId: string; // NRC transaction ID'si ile bağlantı
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}
```

---

## 🔐 Yetkilendirme & Güvenlik

### **Yetkiler:**
```typescript
enum MarketplacePermissions {
  CREATE_ITEM = 'marketplace.create',
  EDIT_OWN_ITEM = 'marketplace.edit.own',
  EDIT_ANY_ITEM = 'marketplace.edit.any',
  DELETE_OWN_ITEM = 'marketplace.delete.own',
  DELETE_ANY_ITEM = 'marketplace.delete.any',
  VIEW_STATS = 'marketplace.stats.view',
  MANAGE_ORDERS = 'marketplace.orders.manage',
  FEATURE_ITEM = 'marketplace.feature', // Öne çıkarma
}
```

### **Rol Bazlı Erişim:**
- **Server Owner**: Tüm yetkiler
- **Admin**: Tüm yetkiler (silme hariç)
- **Moderator**: Kendi item'larını yönetebilir
- **Premium User**: Item oluşturabilir (limit: 10)
- **Regular User**: Sadece satın alabilir

### **Güvenlik Önlemleri:**
- ✅ Rate limiting (5 item/saat)
- ✅ Fiyat limiti (min: 10 NRC, max: 100,000 NRC)
- ✅ Spam filtreleme (başlık & açıklama)
- ✅ Image URL validation
- ✅ XSS prevention
- ✅ SQL injection prevention

---

## 🚀 Teslimat Sistemi

### **1. Otomatik Teslimat (Instant)**

**Rol Verme:**
```javascript
async function deliverRole(orderId) {
  const order = await Order.findOne({ orderId });
  const item = await MarketplaceItem.findOne({ itemId: order.itemId });
  
  // Discord'dan rolü ver
  const member = await guild.members.fetch(order.buyerId);
  await member.roles.add(item.deliveryData.roleId);
  
  // Süre varsa, belirli bir süre sonra rolü geri al
  if (item.duration) {
    scheduleRoleRemoval(order.buyerId, item.deliveryData.roleId, item.duration);
  }
  
  // Order durumunu güncelle
  order.status = 'completed';
  order.deliveredAt = new Date();
  await order.save();
  
  // Bildirim gönder
  await sendDeliveryNotification(order.buyerId, item.title);
}
```

**Item Verme (Inventory System):**
```javascript
async function deliverItem(orderId) {
  const order = await Order.findOne({ orderId });
  const item = await MarketplaceItem.findOne({ itemId: order.itemId });
  
  // User inventory'sine ekle
  await UserInventory.updateOne(
    { userId: order.buyerId },
    { 
      $push: { 
        items: {
          itemId: item.itemId,
          purchasedAt: new Date(),
          expiresAt: item.duration ? addDays(new Date(), item.duration) : null
        }
      } 
    }
  );
  
  order.status = 'completed';
  await order.save();
}
```

### **2. Manuel Teslimat**
- Seller'a bildirim gönderilir
- Seller teslimatı tamamlar ve kanıt yükler
- Admin onayı (opsiyonel)
- Buyer'a teslimat bildirimi

### **3. Zamanlanmış Teslimat**
- Belirli bir tarihte otomatik teslimat
- Event-based teslimat (örn: sunucu boost'u aldığında)

---

## 📊 API Endpoints

### **Backend Routes:**

```typescript
// Item Management
POST   /api/marketplace/items              // Create item
GET    /api/marketplace/items              // List items (with filters)
GET    /api/marketplace/items/:id          // Get item details
PUT    /api/marketplace/items/:id          // Update item
DELETE /api/marketplace/items/:id          // Delete item
PATCH  /api/marketplace/items/:id/feature  // Feature/Unfeature

// Orders
POST   /api/marketplace/orders             // Create order (buy)
GET    /api/marketplace/orders             // List orders
GET    /api/marketplace/orders/:id         // Get order details
PATCH  /api/marketplace/orders/:id/deliver // Mark as delivered
PATCH  /api/marketplace/orders/:id/cancel  // Cancel order
POST   /api/marketplace/orders/:id/refund  // Refund order

// Stats
GET    /api/marketplace/stats              // General stats
GET    /api/marketplace/stats/:itemId      // Item-specific stats

// Admin
GET    /api/marketplace/admin/pending      // Pending approvals
POST   /api/marketplace/admin/approve/:id  // Approve item
POST   /api/marketplace/admin/reject/:id   // Reject item
```

---

## 🎨 Frontend Components

### **Yeni Componentler:**

1. **`ItemCreateForm.tsx`**
   - Multi-step form (4 adım)
   - Image uploader
   - Preview panel
   - Validation feedback

2. **`ItemManagementTable.tsx`**
   - Sortable columns
   - Inline editing
   - Bulk actions
   - Export to CSV

3. **`OrderManagementPanel.tsx`**
   - Real-time updates (Socket.IO)
   - Order status tracker
   - Delivery confirmation
   - Refund handler

4. **`MarketplaceStatsChart.tsx`**
   - Interactive charts (Chart.js/Recharts)
   - Date range selector
   - Export to PDF

5. **`ItemPreviewCard.tsx`**
   - Mini preview card
   - Quick actions
   - Copy link

---

## 🔄 İş Akışı Örnekleri

### **Senaryo 1: Sunucu Sahibi Item Ekliyor**

1. Discord'da `/marketplace-create` çalıştırır
2. Modal açılır, form doldurur
3. Bot önizleme gösterir
4. Onaylarsa → Database'e kaydedilir
5. Frontend'de anında görünür (Socket.IO)
6. Item ID ve management link embed'de gönderilir

### **Senaryo 2: Kullanıcı Item Satın Alıyor**

1. Frontend'de item'a tıklar
2. "Buy Now" butonu → Confirmation modal
3. Bakiye kontrolü
4. NRC Transaction oluşturulur
5. Order oluşturulur
6. Otomatik teslimat başlar (instant ise)
7. Rol verilir / Item inventory'e eklenir
8. Seller'a bildirim gönderilir
9. Buyer'a teslimat mesajı

### **Senaryo 3: Manuel Teslimat**

1. Order oluşturulur
2. Seller'a Discord DM gönderilir
3. Seller teslimatı yapar
4. Web dashboard'dan "Mark as Delivered" tıklar
5. Kanıt yükler (opsiyonel)
6. Buyer onaylar veya dispute açar
7. Order tamamlanır

---

## 🛡️ Fraud Prevention (Dolandırıcılık Önleme)

### **Önlemler:**

1. **Escrow System** (Emanet)
   - NRC buyer'dan alınır ama seller'a direkt gitmez
   - Teslimat onaylandıktan sonra aktarılır
   - Dispute durumunda admin review

2. **Rating System** (Değerlendirme)
   - Her order sonrası rating
   - Seller reputation score
   - Düşük rating = warning

3. **Dispute System** (Anlaşmazlık)
   - Buyer "I didn't receive" raporu
   - Admin review
   - Refund veya force delivery

4. **Blacklist**
   - Kötü niyetli seller'lar blacklist'e
   - Artık item ekleyemez

---

## 📱 Bildirimler

### **Discord Bot:**
- ✅ Yeni order (seller'a)
- ✅ Teslimat tamamlandı (buyer'a)
- ✅ Order iptal edildi
- ✅ Refund işlendi
- ✅ Item stokta kalmadı (seller'a)
- ✅ Yeni yorum/rating (seller'a)

### **Web Dashboard:**
- ✅ Real-time order updates (Socket.IO)
- ✅ Toast notifications
- ✅ Badge count (navbar)

---

## 🎯 Öncelik Sıralaması

### **Phase 1: Temel Sistem** (1-2 hafta)
- [x] Database schema
- [ ] Discord bot komutları (`/marketplace-create`, `/marketplace-list`)
- [ ] Backend API (CRUD endpoints)
- [ ] Frontend management page (basic)
- [ ] Otomatik rol teslimı

### **Phase 2: Gelişmiş Özellikler** (1 hafta)
- [ ] Web dashboard (detaylı form)
- [ ] Image upload & carousel
- [ ] Order management
- [ ] Stats & analytics

### **Phase 3: Güvenlik & Optimizasyon** (1 hafta)
- [ ] Escrow system
- [ ] Rating & review
- [ ] Dispute handling
- [ ] Admin approval system

### **Phase 4: İleri Özellikler** (Opsiyonel)
- [ ] Auction system (müzayede)
- [ ] Bundle deals (paket satış)
- [ ] Flash sales (sınırlı süreli indirim)
- [ ] Affiliate system (referral kazancı)

---

## 💡 Ekstra Öneriler

### **1. Kategoriye Özel Şablonlar**

**Rol Satışı:**
- Otomatik rol verme/alma
- Süre tabanlı (7d, 30d, permanent)
- Preview: Rol rengi, yetkileri

**Hizmet Satışı:**
- Detaylı açıklama formu
- Delivery time estimate
- Milestone-based delivery

**Custom Item:**
- Tamamen özelleştirilebilir
- Custom fields
- Ödeme sonrası detaylar

### **2. Marketplace Kategorileri**

- 🎨 **Görseller** (Banner, Logo, Avatar)
- 🎭 **Roller** (VIP, Premium, Special)
- ⚙️ **Hizmetler** (Bot Setup, Moderation)
- 🎮 **Oyun İçi İtemler** (Custom game items)
- 📢 **Reklamlar** (Announcement, Shoutout)
- 🎁 **Custom** (Diğer her şey)

### **3. Gamification**

- **Seller Badges**: 
  - 🌟 Trusted Seller (100+ satış)
  - ⚡ Fast Delivery (1 saat içi)
  - 💎 Premium Seller (yüksek rating)
  
- **Achievements**:
  - First Sale
  - 10 Sales Milestone
  - 100K NRC Earned

### **4. Marketing Tools**

- **Featured Listings**: Ücretli öne çıkarma
- **Boost**: Geçici olarak top'a çıkma
- **Coupon System**: İndirim kodları
- **Bundle Deals**: Toplu alımda indirim

---

## 🚀 Başlangıç Önerileri

### **Sana Önerim:**

1. **Phase 1'den başla**: Discord bot komutları + temel CRUD
2. **MVP (Minimum Viable Product)**: Basit ama çalışan bir sistem
3. **User feedback**: İlk kullanıcı geri bildirimlerine göre geliştir
4. **Iterate**: Küçük adımlarla ilerle, her adımı test et

### **İlk Adımlar:**

```bash
# 1. Discord bot komutlarını ekle (src/commands/marketplace/)
- marketplace-create.js
- marketplace-list.js
- marketplace-edit.js
- marketplace-delete.js

# 2. Backend routes oluştur (neuroviabot-backend/routes/)
- marketplace.js

# 3. Frontend management page (neuroviabot-frontend/app/nrc/marketplace/)
- manage/page.tsx

# 4. Test et & deploy et
```

---

## 📞 Sonraki Adım

Hangi kısımdan başlamak istersin?

**A)** Discord bot komutları (backend)  
**B)** Frontend management page  
**C)** Database & API setup  
**D)** Hepsini aynı anda (full implementation)  

Ben hazırım! 🚀

