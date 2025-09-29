# 🌐 NeuroViaBot Dashboard (Frontend)

Modern, responsive web dashboard for NeuroViaBot management built with Next.js 14 and Tailwind CSS.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Authentication:** NextAuth.js (Discord OAuth)
- **Data Fetching:** SWR
- **Charts:** Recharts
- **Animations:** Framer Motion
- **Icons:** Heroicons

## 📁 Project Structure

```
frontend/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   ├── dashboard/          # Dashboard pages
│   └── globals.css         # Global styles
├── components/             # Reusable components
├── lib/                    # Utilities
├── public/                 # Static assets
└── next.config.js         # Next.js config
```

## ⚙️ Configuration

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_BOT_CLIENT_ID=your_bot_client_id
DISCORD_CLIENT_SECRET=your_client_secret
SESSION_SECRET=your_session_secret
```

## 📦 Available Scripts

- `npm run dev` - Start development server (port 3000)
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run clean` - Clean build files

## 🎨 Features

- ✅ Responsive design
- ✅ Dark mode optimized
- ✅ Discord OAuth authentication
- ✅ Real-time statistics
- ✅ Server management
- ✅ Command analytics
- ✅ User dashboard

## 📄 License

MIT
