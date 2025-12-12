# Security Review - MemoryHub Backend

## Critical Findings

### Plaintext API keys stored and returned
The API registration and key management flows persist full API keys in the database and return them over API responses. New users are saved with both the plaintext key and hash, and the login and Clerk-backed key endpoints expose the stored plaintext value. This is currently intentional to support fast MCP prompt setup, but it still means that if the database or logs are compromised, attackers immediately gain valid credentials and can replay them. Storage of recoverable secrets also violates the principle of least exposure and makes key rotation risky.

**Evidence**
- Registration stores `apiKey` alongside the hash and returns it in the response. 【F:backend/app/api/auth/register/route.ts†L28-L57】
- Login returns the stored plaintext `apiKey` for any user. 【F:backend/app/api/auth/login/route.ts†L20-L47】
- Clerk-backed key APIs store and return the full key value instead of a one-time reveal. 【F:backend/app/api/api-keys/route.ts†L27-L150】

**Recommendations**
- If the plaintext is required for MCP prompts, consider scoping the risk with compensating controls: encrypt the column at rest (e.g., using a KMS-managed key), restrict DB access to the minimum set of services, and log/audit all reads of the field.
- Serve the plaintext key only on an explicit "reveal" action and redact it from default responses, so operational logs and normal API calls do not continually expose it.
- Prefer one-time creation flows that return the key once and then rely on the hash/prefix for lookup; when a user needs the value again, regenerate a new key rather than persisting the old one.
- If you continue to persist the plaintext, enforce shorter lifetimes and automate rotation to narrow the exposure window if the DB is leaked.

### JWTs from Authorization headers verified by default (with explicit dev bypass)
`getClerkUserId` now verifies Authorization bearer tokens against the Clerk secret key before trusting them. Unsigned decoding is only allowed when `CLERK_ALLOW_UNVERIFIED_JWT=true`, giving local development an explicit opt-in while keeping verification on by default in production.

**Evidence**
- Authorization tokens are verified via Clerk's backend `verifyToken` with the configured secret key and optional audience check, and the issuer claim is validated after verification (missing or mismatched issuers are rejected when an issuer is configured). Unsigned decoding only occurs when the explicit bypass flag is enabled and `NODE_ENV` is not `production`. A production `CLERK_ALLOW_UNVERIFIED_JWT` flag is ignored with a warning. 【F:backend/lib/clerk-auth.ts†L3-L76】

**Residual Recommendations**
- Keep `CLERK_ALLOW_UNVERIFIED_JWT` disabled in all deployed environments; if a bypass is needed locally, scope it to non-production configs only.
- Ensure the issuer and audience environment variables stay aligned with the configured Clerk instance for deployments (the verification now enforces these claims when provided).

## Additional Notes
- Rate limiting and embedding operations appear parameterized; the most urgent risks are the recoverable API keys and unsigned JWT acceptance.
