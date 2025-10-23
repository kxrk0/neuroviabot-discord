# 🎨 NeuroViaBot Dashboard - Frontend Development Plan

## 📋 Proje Yapısı

```
frontend/
├── app/
│   ├── layout.tsx                 ✅ Root layout
│   ├── page.tsx                   ✅ Landing page
│   ├── globals.css                ✅ Global styles
│   │
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx           📝 Discord OAuth login
│   │   ├── callback/
│   │   │   └── page.tsx           📝 OAuth callback handler
│   │   └── error/
│   │       └── page.tsx           📝 Auth error page
│   │
│   ├── dashboard/
│   │   ├── layout.tsx             📝 Dashboard layout (sidebar + navbar)
│   │   ├── page.tsx               📝 Dashboard overview (stats, charts)
│   │   │
│   │   ├── servers/
│   │   │   ├── page.tsx           📝 Server list
│   │   │   └── [id]/
│   │   │       ├── page.tsx       📝 Server details
│   │   │       ├── music/         📝 Music settings
│   │   │       ├── moderation/    📝 Moderation settings
│   │   │       ├── economy/       📝 Economy settings
│   │   │       ├── leveling/      📝 Leveling settings
│   │   │       └── welcome/       📝 Welcome system
│   │   │
│   │   ├── profile/
│   │   │   └── page.tsx           📝 User profile & settings
│   │   │
│   │   ├── premium/
│   │   │   └── page.tsx           📝 Premium features
│   │   │
│   │   └── realtime/
│   │       └── page.tsx           📝 Real-time monitor (WebSocket)
│   │
│   └── api/
│       └── auth/
│           └── [...nextauth]/
│               └── route.ts       📝 NextAuth.js API routes
│
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx             📝 Top navigation bar
│   │   ├── Sidebar.tsx            📝 Sidebar menu
│   │   ├── Footer.tsx             📝 Footer
│   │   └── DashboardLayout.tsx   📝 Dashboard wrapper
│   │
│   ├── ui/
│   │   ├── Button.tsx             📝 Button component
│   │   ├── Card.tsx               📝 Card component
│   │   ├── Input.tsx              📝 Input component
│   │   ├── Select.tsx             📝 Select dropdown
│   │   ├── Switch.tsx             📝 Toggle switch
│   │   ├── Modal.tsx              📝 Modal dialog
│   │   ├── Loading.tsx            📝 Loading spinner
│   │   ├── Badge.tsx              📝 Badge/tag
│   │   └── Toast.tsx              📝 Toast notifications
│   │
│   ├── dashboard/
│   │   ├── StatsCard.tsx          📝 Statistics card
│   │   ├── ServerCard.tsx         📝 Server card
│   │   ├── RealtimeActivity.tsx   📝 Real-time activity feed
│   │   ├── QuickActions.tsx       📝 Quick action buttons
│   │   └── Charts/
│   │       ├── LineChart.tsx      📝 Line chart (commands over time)
│   │       ├── BarChart.tsx       📝 Bar chart (server stats)
│   │       └── PieChart.tsx       📝 Pie chart (command usage)
│   │
│   └── auth/
│       ├── LoginButton.tsx        📝 Discord login button
│       └── UserAvatar.tsx         📝 User avatar dropdown
│
├── lib/
│   ├── auth.ts                    📝 NextAuth configuration
│   ├── discord.ts                 📝 Discord API helpers
│   ├── api.ts                     📝 Backend API client (axios)
│   ├── websocket.ts               📝 WebSocket client
│   └── utils.ts                   📝 Utility functions
│
├── hooks/
│   ├── useAuth.ts                 📝 Authentication hook
│   ├── useServers.ts              📝 Server data hook
│   ├── useWebSocket.ts            📝 WebSocket hook
│   └── useToast.ts                📝 Toast notification hook
│
├── types/
│   ├── discord.ts                 📝 Discord types
│   ├── api.ts                     📝 API response types
│   └── index.ts                   📝 General types
│
├── styles/
│   └── themes.css                 📝 Theme variables
│
└── public/
    ├── images/
    │   ├── logo.png
    │   ├── hero-bg.png
    │   └── features/
    └── icons/
```

---

## 🎨 Tasarım Sistemi

### **Renk Paleti:**

```css
/* Dark Theme (Primary) */
--bg-primary: #0B0E11        /* Main background */
--bg-secondary: #151922      /* Cards, sidebar */
--bg-tertiary: #1E2530       /* Hover states */
--bg-hover: #252D3A          /* Active/hover */

--discord-blue: #5865F2      /* Primary brand color */
--discord-blue-dark: #4752C4 /* Hover state */
--discord-blue-light: #7289DA /* Accents */

--text-primary: #FFFFFF      /* Main text */
--text-secondary: #B9BBBE    /* Secondary text */
--text-muted: #72767D        /* Muted text */

--success: #3BA55D           /* Success states */
--warning: #FAA81A           /* Warning states */
--error: #ED4245             /* Error states */
--info: #00AFF4              /* Info states */

/* Accent Colors */
--purple: #7289DA
--green: #43B581
--yellow: #FEE75C
--red: #F04747
```

### **Typography:**

```css
/* Fonts */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

/* Sizes */
--text-xs: 0.75rem;   /* 12px */
--text-sm: 0.875rem;  /* 14px */
--text-base: 1rem;    /* 16px */
--text-lg: 1.125rem;  /* 18px */
--text-xl: 1.25rem;   /* 20px */
--text-2xl: 1.5rem;   /* 24px */
--text-3xl: 1.875rem; /* 30px */
--text-4xl: 2.25rem;  /* 36px */
```

### **Spacing:**

```css
--spacing-xs: 0.25rem;  /* 4px */
--spacing-sm: 0.5rem;   /* 8px */
--spacing-md: 1rem;     /* 16px */
--spacing-lg: 1.5rem;   /* 24px */
--spacing-xl: 2rem;     /* 32px */
--spacing-2xl: 3rem;    /* 48px */
```

### **Border Radius:**

```css
--radius-sm: 0.375rem;  /* 6px */
--radius-md: 0.5rem;    /* 8px */
--radius-lg: 0.75rem;   /* 12px */
--radius-xl: 1rem;      /* 16px */
--radius-full: 9999px;  /* Full circle */
```

---

## 🔐 Discord OAuth Sistemi

### **1. Discord Developer Portal Setup:**

```
Application Settings:
├── OAuth2 → Redirects:
│   ├── http://localhost:3001/api/auth/callback/discord
│   └── https://neuroviabot.xyz/api/auth/callback/discord
│
└── OAuth2 → Scopes:
    ├── identify (user info)
    ├── email (email address)
    └── guilds (server list)
```

### **2. NextAuth.js Configuration:**

```typescript
// lib/auth.ts
import NextAuth from 'next-auth';
import DiscordProvider from 'next-auth/providers/discord';

export const authOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: 'identify email guilds'
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile) {
        token.discordId = profile.id;
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.discordId = token.discordId;
      session.user.accessToken = token.accessToken;
      return session;
    }
  },
  pages: {
    signIn: '/login',
    error: '/error'
  }
};
```

### **3. Login Flow:**

```
User clicks "Login with Discord"
    ↓
Redirect to Discord OAuth
    ↓
User authorizes
    ↓
Redirect to /api/auth/callback/discord
    ↓
NextAuth creates session
    ↓
Redirect to /dashboard
    ↓
Session stored (JWT)
```

---

## 🌐 WebSocket Real-Time System

### **Backend (Express.js + Socket.IO):**

```typescript
// backend/index.js - WebSocket events

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  // Join server room
  socket.on('join:server', (serverId) => {
    socket.join(`server:${serverId}`);
  });
  
  // Real-time events
  socket.on('command:executed', (data) => {
    io.to(`server:${data.serverId}`).emit('command:update', data);
  });
  
  socket.on('member:joined', (data) => {
    io.to(`server:${data.serverId}`).emit('member:update', data);
  });
  
  socket.on('music:playing', (data) => {
    io.to(`server:${data.serverId}`).emit('music:update', data);
  });
});
```

### **Frontend (React + Socket.IO Client):**

```typescript
// hooks/useWebSocket.ts

export const useWebSocket = (serverId?: string) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const newSocket = io(process.env.NEXT_PUBLIC_API_URL!);
    
    newSocket.on('connect', () => {
      setConnected(true);
      if (serverId) {
        newSocket.emit('join:server', serverId);
      }
    });
    
    newSocket.on('command:update', (data) => {
      setEvents(prev => [data, ...prev].slice(0, 50));
    });
    
    setSocket(newSocket);
    
    return () => {
      newSocket.close();
    };
  }, [serverId]);

  return { socket, connected, events };
};
```

### **Real-Time Features:**

1. **Command Execution Monitor:**
   - Live command usage feed
   - User who executed
   - Command name & parameters
   - Timestamp

2. **Member Activity:**
   - Member joins/leaves
   - Role changes
   - Voice channel activity

3. **Music Queue:**
   - Now playing
   - Queue updates
   - Play/pause/skip events

4. **Bot Stats:**
   - Server count
   - Active users
   - Command count (live)

---

## 📊 Dashboard Features

### **1. Overview Page:**

```
┌─────────────────────────────────────────────────┐
│ Welcome back, Username! 👋                      │
├─────────────────────────────────────────────────┤
│ Quick Stats (4 cards):                          │
│ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐   │
│ │ Servers│ │Commands│ │ Users  │ │Uptime │   │
│ │   66   │ │ 12,345 │ │ 59,032 │ │ 99.9% │   │
│ └────────┘ └────────┘ └────────┘ └────────┘   │
├─────────────────────────────────────────────────┤
│ Recent Activity (real-time):                    │
│ • User123 used /play in Server ABC             │
│ • Server XYZ enabled welcome messages          │
│ • 5 new members joined across 3 servers        │
├─────────────────────────────────────────────────┤
│ Charts:                                          │
│ ┌─────────────────┐ ┌──────────────────────┐   │
│ │ Commands/Day    │ │ Top Servers          │   │
│ │ (Line Chart)    │ │ (Bar Chart)          │   │
│ └─────────────────┘ └──────────────────────┘   │
└─────────────────────────────────────────────────┘
```

### **2. Server Management:**

```
Server List:
├── Search & Filter
├── Sort by (members, activity, date added)
│
└── Each Server Card:
    ├── Server icon & name
    ├── Member count
    ├── Online members
    ├── Bot status (online/offline)
    ├── Quick actions (settings, leave)
    └── Click → Server Details
```

### **3. Server Details:**

```
Server Details Page:
├── Tabs:
│   ├── Overview (stats, info)
│   ├── Music Settings
│   ├── Moderation
│   ├── Economy
│   ├── Leveling
│   ├── Welcome System
│   └── Real-Time Monitor
│
└── Each Tab:
    ├── Current settings
    ├── Toggle switches
    ├── Input fields
    ├── Save button
    └── Real-time preview
```

---

## 🚀 Geliştirme Öncelikleri

### **Phase 1: Foundation (Week 1)**
1. ✅ Project structure setup
2. 📝 UI component library (Button, Card, Input, etc.)
3. 📝 Theme system & global styles
4. 📝 Layout components (Navbar, Sidebar, Footer)

### **Phase 2: Authentication (Week 2)**
1. 📝 Discord OAuth integration
2. 📝 Login/callback pages
3. 📝 Session management
4. 📝 Protected routes

### **Phase 3: Dashboard (Week 3)**
1. 📝 Dashboard overview page
2. 📝 Stats cards & charts
3. 📝 Server list & cards
4. 📝 User profile page

### **Phase 4: Server Management (Week 4)**
1. 📝 Server details page
2. 📝 Music settings tab
3. 📝 Moderation tab
4. 📝 Economy tab

### **Phase 5: Real-Time Features (Week 5)**
1. 📝 WebSocket integration
2. 📝 Real-time activity feed
3. 📝 Live stats updates
4. 📝 Command execution monitor

### **Phase 6: Polish & Optimization (Week 6)**
1. 📝 Responsive design (mobile/tablet)
2. 📝 Animations & transitions
3. 📝 Error handling & loading states
4. 📝 Performance optimization

---

## 🛠️ Tech Stack

```
Frontend:
├── Next.js 14 (App Router)
├── TypeScript
├── Tailwind CSS
├── NextAuth.js (Discord OAuth)
├── Socket.IO Client (Real-time)
├── Recharts (Charts)
├── Framer Motion (Animations)
└── SWR (Data fetching)

Backend:
├── Express.js
├── Socket.IO Server
├── Passport.js (OAuth)
└── Discord.js API integration
```

---

## 📦 Dependencies to Add

```bash
# Frontend
npm install next-auth@beta socket.io-client recharts framer-motion swr

# Backend
npm install socket.io passport passport-discord express-session
```

---

## 🎯 Next Steps

1. ✅ Gitignore webhook files
2. 📝 Create folder structure
3. 📝 Build UI component library
4. 📝 Implement Discord OAuth
5. 📝 Build dashboard pages
6. 📝 Add WebSocket real-time features
7. 📝 Test & polish

---

**Ready to start building! 🚀**
