# PersistQ - AI-Powered Memory Layer

**Status**: ✅ Production Ready
**Last Updated**: 2025-11-02

---

## 🎯 What is PersistQ?

PersistQ is a semantic memory storage system that allows AI agents and applications to store, retrieve, and search contextual information using vector embeddings.

### Key Features

- 🔐 **Clerk Authentication** - Secure user management
- 🔍 **Semantic Search** - Vector-based memory retrieval
- ⚡ **High Performance** - Redis caching, O(1) API key validation
- 📊 **Dashboard** - Beautiful UI for managing memories
- 🔑 **API Keys** - Programmatic access for developers
- 🌐 **API-First** - RESTful API with TypeScript SDK
- 📦 **GDPR Compliant** - Full user data deletion support

---

## 📁 Repository Structure

```
memoryhub-cloud/
├── backend/           # Next.js API backend
│   ├── app/api/      # API routes
│   ├── lib/          # Utilities (auth, prisma, search)
│   └── prisma/       # Database schema & migrations
├── frontend/          # Next.js frontend dashboard
│   ├── app/          # App router pages
│   ├── components/   # UI components
│   ├── services/     # API service layer
│   └── hooks/        # React hooks
├── docs/              # Documentation
│   ├── FIXES_SUMMARY.md
│   └── DEPLOYMENT_CHECKLIST.md
└── README.md          # This file
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL (with pgvector extension)
- Upstash Redis account
- Clerk account

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Fill in environment variables
npx prisma db push
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
cp .env.local.example .env.local
# Fill in environment variables
npm run dev
```

Visit http://localhost:3001 for frontend, http://localhost:3000 for backend API.

---

## 🌐 Deployment

### Deploy Backend to Render

1. Connect this GitHub repository
2. Set **Root Directory** to `backend`
3. Configure environment variables (see `backend/.env.example`)
4. Deploy!

### Deploy Frontend to Vercel

1. Connect this GitHub repository
2. Set **Root Directory** to `frontend`
3. Configure environment variables (see `frontend/.env.local.example`)
4. Deploy!

**Full deployment guide**: See `docs/DEPLOYMENT_CHECKLIST.md`

---

## 📚 Documentation

- **[Deployment Checklist](docs/DEPLOYMENT_CHECKLIST.md)** - Complete deployment guide
- **[Fixes Summary](docs/FIXES_SUMMARY.md)** - Technical details of recent fixes
- **[Backend TODO](backend/TODO.md)** - Feature roadmap

---

## 🛠️ Tech Stack

### Backend
- Next.js 16 (App Router)
- Prisma ORM
- PostgreSQL + pgvector
- Upstash Redis
- Clerk Authentication
- Transformers.js (embeddings)

### Frontend
- Next.js 16 (App Router)
- React 19
- TailwindCSS
- Radix UI
- Clerk Components
- TypeScript

---

## 📊 API Endpoints

### Authentication
- `POST /api/auth/login` - Get API key with email/password
- `GET /api/auth/clerk-link` - Get API key for Clerk user
- `POST /api/auth/clerk-link` - Regenerate API key

### Memories
- `POST /api/memory` - Create memory
- `GET /api/memory/:id` - Get memory by ID
- `PUT /api/memory/:id` - Update memory
- `DELETE /api/memory/:id` - Delete memory
- `GET /api/memory/list` - List memories (paginated)
- `POST /api/memory/search` - Semantic search

### Stats
- `GET /api/memory/stats` - Get user statistics
- `GET /api/status` - Health check

---

## 🔐 Environment Variables

### Backend (`backend/.env`)
```bash
MEMORYHUB_DATABASE_URL=postgresql://...
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...
ALLOWED_ORIGINS=*
```

### Frontend (`frontend/.env.local`)
```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
```

---

## 🎉 Recent Updates (2025-11-02)

All critical issues resolved - Production ready! ✅

- ✅ Clerk session token forwarding
- ✅ CORS credentials support
- ✅ API base URL validation
- ✅ O(1) API key validation with Redis
- ✅ GDPR-compliant user deletion
- ✅ Session token refresh
- ✅ Race condition fixes
- ✅ Database migrations applied

See `docs/FIXES_SUMMARY.md` for complete details.

---

## 📝 License

MIT

---

## 🤝 Contributing

Contributions welcome! Please open an issue or PR.

---

## 📧 Support

For issues or questions, please open a GitHub issue.

---

**Built with ❤️ using Claude Code**
