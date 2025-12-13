# PersistQ API

A production-ready semantic memory storage API built with Next.js, PostgreSQL, and pgvector. Store, search, and retrieve memories using advanced vector similarity search with local embeddings.

## Features

- **Semantic Search**: Vector-based similarity search using Transformers.js (all-MiniLM-L6-v2)
- **Local Embeddings**: No external API calls - embeddings generated locally
- **Project Organization**: Group memories by project for better organization
- **Rate Limiting**: 100 requests/minute per user via Upstash Redis
- **API Key Authentication**: Secure bcrypt-hashed API keys
- **Input Validation**: Comprehensive Zod schemas for all endpoints
- **Health Monitoring**: Detailed status endpoint for system health checks
- **CORS Support**: Cross-origin requests enabled for browser access

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL with pgvector extension
- Upstash Redis account (for rate limiting)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd memoryhub-mvp

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database and Redis credentials

# Run database migrations
npx prisma migrate deploy

# Start development server
npm run dev
```

### Environment Variables

Create a `.env` file with the following:

```env
# PostgreSQL with pgvector
MEMORYHUB_DATABASE_URL="postgresql://user:password@host:port/database"

# Upstash Redis (for rate limiting)
UPSTASH_REDIS_REST_URL="https://your-redis.upstash.io"
UPSTASH_REDIS_REST_TOKEN="your-token-here"
```

## API Documentation

Base URL: `http://localhost:3000` (development) or your deployed URL

### Authentication

All endpoints except `/api/status` require API key authentication.

**Header Format:**
```
Authorization: Bearer mh_your_api_key_here
```

Or simply:
```
Authorization: mh_your_api_key_here
```

### Endpoints

#### 1. Health Check

Check system status and component health.

```bash
GET /api/status
```

**Response:**
```json
{
  "status": "healthy",
  "service": "PersistQ API",
  "version": "1.0.0",
  "timestamp": "2025-11-01T17:30:00.000Z",
  "checks": {
    "database": "connected",
    "pgvector": "enabled",
    "redis": "configured"
  }
}
```

#### 2. Register User

Create a new user account and receive an API key.

```bash
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "clxy123abc",
    "email": "user@example.com",
    "apiKey": "mh_a1b2c3d4e5f6..."
  }
}
```

**Important:** Save the API key - it's only shown once!

#### 3. Login

Retrieve your API key using your email.

```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": {
    "id": "clxy123abc",
    "email": "user@example.com",
    "apiKey": "mh_a1b2c3d4e5f6..."
  }
}
```

#### 4. Save Memory

Store a new memory with optional project and metadata.

```bash
POST /api/memory
Authorization: Bearer mh_your_api_key
Content-Type: application/json

{
  "content": "The startup is building a React Native app for fitness tracking with AI coaching",
  "project": "client-acme-fitness",
  "metadata": {
    "category": "client-requirements",
    "priority": "high"
  }
}
```

**Response:**
```json
{
  "message": "Memory saved successfully",
  "memory": {
    "id": "mem_xyz789",
    "userId": "clxy123abc",
    "project": "client-acme-fitness",
    "content": "The startup is building a React Native app...",
    "metadata": {
      "category": "client-requirements",
      "priority": "high"
    },
    "createdAt": "2025-11-01T17:30:00.000Z"
  }
}
```

**Validation:**
- Content: 1-10,000 characters (recommend <2,000 for optimal search)
- Project: 1-100 characters (optional)
- Metadata: Valid JSON object (optional)

#### 5. Search Memories

Semantic search across all memories using vector similarity.

```bash
POST /api/memory/search
Authorization: Bearer mh_your_api_key
Content-Type: application/json

{
  "query": "fitness app features",
  "limit": 5
}
```

**Response:**
```json
{
  "query": "fitness app features",
  "results": [
    {
      "id": "mem_xyz789",
      "content": "The startup is building a React Native app...",
      "project": "client-acme-fitness",
      "metadata": {
        "category": "client-requirements"
      },
      "similarity": 0.8234,
      "createdAt": "2025-11-01T17:30:00.000Z"
    }
  ],
  "count": 1
}
```

**Parameters:**
- `query`: 1-500 characters (required)
- `limit`: 1-100, default 50 (optional)

**Ranking:** Results ordered by cosine similarity (higher = more relevant)

#### 6. List Memories

Retrieve memories with pagination and optional project filtering.

```bash
GET /api/memory?project=client-acme-fitness&limit=20&offset=0
Authorization: Bearer mh_your_api_key
```

**Response:**
```json
{
  "memories": [
    {
      "id": "mem_xyz789",
      "content": "The startup is building...",
      "project": "client-acme-fitness",
      "metadata": {},
      "createdAt": "2025-11-01T17:30:00.000Z"
    }
  ],
  "pagination": {
    "limit": 20,
    "offset": 0,
    "total": 42
  }
}
```

**Query Parameters:**
- `project`: Filter by project name (optional)
- `limit`: 1-100, default 50 (optional)
- `offset`: 0-1000, default 0 (optional)

#### 7. Get Memory Stats

Retrieve statistics about your stored memories.

```bash
GET /api/memory/stats
Authorization: Bearer mh_your_api_key
```

**Response:**
```json
{
  "stats": {
    "totalMemories": 156,
    "projectCount": 8,
    "oldestMemory": "2025-10-15T10:30:00.000Z",
    "newestMemory": "2025-11-01T17:30:00.000Z",
    "averageContentLength": 247,
    "projects": [
      {
        "project": "client-acme-fitness",
        "count": 42
      },
      {
        "project": null,
        "count": 15
      }
    ]
  }
}
```

#### 8. Delete Memory

Delete a specific memory by ID.

```bash
DELETE /api/memory/:id
Authorization: Bearer mh_your_api_key
```

**Response:**
```json
{
  "message": "Memory deleted successfully",
  "id": "mem_xyz789"
}
```

## Rate Limiting

- **Limit:** 100 requests per minute per user
- **Window:** Sliding window with Upstash Redis
- **Response:** 429 status with retry-after time when exceeded

**Rate Limit Response:**
```json
{
  "error": "Rate limit exceeded. Try again in 45 seconds"
}
```

## Error Handling

All errors return JSON with consistent format:

```json
{
  "error": "Error message describing what went wrong"
}
```

**Common HTTP Status Codes:**
- `400` - Bad Request (validation failed)
- `401` - Unauthorized (missing/invalid API key)
- `404` - Not Found (memory doesn't exist)
- `409` - Conflict (email already registered)
- `429` - Too Many Requests (rate limit exceeded)
- `500` - Internal Server Error

## Security

### API Key Storage

- **New Keys:** Hashed with bcrypt (10 rounds) before storage
- **Validation:** Supports both plain and hashed keys (backward compatible)
- **Display:** API keys shown only once during registration/login
- **Recommendation:** Store API keys securely (environment variables, secrets manager)

### Best Practices

1. **Never commit API keys** to version control
2. **Use environment variables** for API key storage
3. **Rotate keys periodically** by creating new users
4. **Monitor rate limits** to detect unusual activity
5. **Use HTTPS** in production for encrypted communication

## Performance

### Benchmarks

Based on comprehensive testing:

- **Registration:** ~150-200ms
- **Login:** ~100-150ms
- **Save Memory:** ~250-350ms (includes embedding generation)
- **Search:** ~200-300ms (semantic vector search)
- **List Memories:** ~50-100ms
- **Stats:** ~80-120ms
- **Delete:** ~50-80ms

### Optimization Tips

1. **Content Length:** Keep <2,000 characters for best embedding quality
2. **Batch Operations:** Use project filtering to reduce result sets
3. **Pagination:** Use offset/limit to avoid large data transfers
4. **Caching:** Consider caching frequently accessed memories client-side

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

**Environment Variables:** Add in Vercel dashboard under Settings → Environment Variables

### Railway

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login and deploy
railway login
railway up
```

### Render

1. Connect your repository
2. Set build command: `npm install && npx prisma generate`
3. Set start command: `npm start`
4. Add environment variables in dashboard

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npx prisma generate
EXPOSE 3000
CMD ["npm", "start"]
```

```bash
docker build -t memoryhub-api .
docker run -p 3000:3000 --env-file .env memoryhub-api
```

## Database Setup

### PostgreSQL with pgvector

```sql
-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Run Prisma migrations
npx prisma migrate deploy

-- Verify setup
SELECT '[1,2,3]'::vector(3);
```

### Upstash Redis

1. Create account at https://upstash.com
2. Create new Redis database
3. Copy REST URL and token to `.env`
4. Rate limiting will activate automatically

## Development

### Project Structure

```
memoryhub-mvp/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── register/route.ts  # User registration
│   │   │   └── login/route.ts     # User login
│   │   ├── memory/
│   │   │   ├── route.ts           # Save/list memories
│   │   │   ├── search/route.ts    # Semantic search
│   │   │   ├── stats/route.ts     # Memory statistics
│   │   │   └── [id]/route.ts      # Delete memory
│   │   └── status/route.ts        # Health check
├── lib/
│   ├── auth.ts            # Authentication & API keys
│   ├── search.ts          # Vector embeddings & search
│   ├── validation.ts      # Zod schemas
│   ├── ratelimit.ts       # Rate limiting
│   └── prisma.ts          # Database client
├── prisma/
│   └── schema.prisma      # Database schema
└── middleware.ts          # CORS configuration
```

### Running Tests

```bash
# Test all endpoints (manual)
npm run dev

# Then use curl or tools like Postman/Insomnia
# See API_TEST_RESULTS.md for comprehensive test suite
```

### Database Migrations

```bash
# Create new migration
npx prisma migrate dev --name description

# Apply migrations
npx prisma migrate deploy

# Reset database (caution!)
npx prisma migrate reset
```

## Troubleshooting

### "pgvector extension not found"

```sql
-- Connect to PostgreSQL as superuser
psql -U postgres -d your_database

-- Enable extension
CREATE EXTENSION IF NOT EXISTS vector;
```

### "Rate limit check failed"

- Verify `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` in `.env`
- Check Upstash dashboard for database status
- Ensure Redis database is in same region for lowest latency

### "Prisma Client initialization failed"

```bash
# Regenerate Prisma client
npx prisma generate

# If still failing, clear cache
rm -rf node_modules/.prisma
npm install
```

### "Port 3000 already in use"

```bash
# Find process using port 3000
npx kill-port 3000

# Or use different port
PORT=3001 npm run dev
```

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## License

MIT

## Support

For issues, questions, or feature requests, please open an issue on GitHub.

## Changelog

### v1.0.0 (2025-11-01)

- Initial release
- Core API endpoints (8 total)
- Semantic search with Transformers.js
- API key authentication with bcrypt hashing
- Rate limiting via Upstash Redis
- Input validation with Zod
- Health monitoring endpoint
- CORS support
- Comprehensive API documentation
