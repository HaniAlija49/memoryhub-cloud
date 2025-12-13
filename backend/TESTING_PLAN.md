# Backend Testing Plan

## Goals
- Establish reliable backend test harness with coverage guardrails.
- Add unit and integration coverage across utilities, auth, billing, and API routes.
- Keep mocks/fixtures reusable to avoid gaps and duplicated setup.

## Tooling & Conventions
- Runner: `vitest` + `@vitest/coverage-v8` (scripts: `test`, `test:coverage`).
- HTTP: `supertest` or `NextRequest` helpers for route handlers; `msw`/`nock` for outbound HTTP (Dodo, Svix).
- Mocks: `vitest-mock-extended` for Prisma/Clerk/Upstash; stub Sentry; env bootstrap to set `NODE_ENV=test` and fixture secrets.
- Factories: lightweight builders for Prisma entities (user, memory, usage record) and request bodies.
- Coverage gates: target >=80% lines/branches; fail builds below threshold.

## Environment
- Isolated test env file (no real secrets) and minimal Prisma test client mocks by default.
- Optional integration: toggle (e.g., `E2E_DB=1`) to spin up ephemeral Postgres/Docker for narrow flows; keep unit suite fast by default.

## Work Breakdown (with current status)
- **Setup** ✅ Vitest config, path aliases, global setup, coverage; scripts updated.
- **Utilities** ✅ Coverage for `utils`, `validation`, `env`, `embeddings`, `search`, `ratelimit`, `document-processor` happy/edge paths.
- **Auth Core** ✅ `lib/auth` cache/fallback paths; `clerk-auth-helper` basics. ⏳ Add deeper Clerk token parsing and `clerk-auth.ts` branches.
- **Billing Domain** ✅ `quotas`, `billing/ratelimit`, `billing/validation`, `billing/errors`, `billing/factory` unit checks. ⏳ Provider adapter `providers/dodo.ts` and `billing/events` audit formatting.
- **API Keys Routes** ✅ GET/POST/PUT paths with auth + conflicts.
- **Memory Routes** ✅ `memory`, `[id]`, `list`, `search`, `stats`, `process-document` validation/metadata; quotas mocked.
- **Auth Routes** ✅ `register`, `login`, `clerk-link` auth failures and success.
- **Billing Routes/Webhooks** ✅ `billing/checkout`, `portal`, `subscription`, `reactivate` route coverage. ⏳ `webhooks/billing/dodo` (currently skipped pending signature + idempotency handling) and `webhooks/clerk`.
- **Cron/Maintenance** ✅ `cleanup-webhooks`, `expire-subscriptions`, `warm`, `status`.
- **Middleware/Instrumentation** ✅ CORS/security headers and auth bypass paths; Sentry wrapper basic path. ⏳ Add instrumentation edge assertions.
- **Optional Integration Slice** ⏳ End-to-end "create memory -> search -> stats" flow guarded by env flag.

## Execution Order
1) Setup harness & helpers.
2) Utilities + auth core.
3) Billing domain.
4) API routes (api-keys, memory, auth, billing/webhooks).
5) Cron & middleware.
6) Optional integration + tighten coverage thresholds.

## Next Focus
- Unskip and harden `webhooks/billing/dodo` tests: request method/body handling, signature verification, idempotency, audit persistence.
- Add provider-level tests for `billing/providers/dodo.ts` (plan mapping, signature errors, retryable failures).
- Deepen `clerk-auth-helper`/`clerk-auth.ts` parsing + error branches.
- Integration slice (memory lifecycle) behind env flag.
- Raise coverage gate once webhook/provider pieces are solid.***

## Tracking
- Keep checklist in PR description; update this doc as tasks complete.
