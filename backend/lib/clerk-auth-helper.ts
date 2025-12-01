/**
 * Clerk Authentication Helper for Cross-Origin Requests
 *
 * Handles authentication for both:
 * 1. Same-origin requests (cookies)
 * 2. Cross-origin requests (Bearer token in Authorization header)
 */

import { auth } from '@clerk/nextjs/server';
import { verifyToken } from '@clerk/backend';

export interface AuthResult {
  userId: string | null;
  sessionId: string | null;
}

/**
 * Authenticate user from either cookies (same-origin) or Bearer token (cross-origin)
 */
export async function authenticateRequest(request: Request): Promise<AuthResult> {
  // Try cookie-based auth first (same-origin requests)
  const cookieAuth = await auth();

  if (cookieAuth.userId) {
    return {
      userId: cookieAuth.userId,
      sessionId: cookieAuth.sessionId || null,
    };
  }

  // Fall back to Bearer token auth (cross-origin requests)
  const authHeader = request.headers.get('authorization');

  if (!authHeader?.startsWith('Bearer ')) {
    return {
      userId: null,
      sessionId: null,
    };
  }

  const token = authHeader.substring(7); // Remove 'Bearer ' prefix

  try {
    // Verify the Clerk session token
    const secretKey = process.env.CLERK_SECRET_KEY;

    if (!secretKey) {
      console.error('[Auth] CLERK_SECRET_KEY not configured');
      return { userId: null, sessionId: null };
    }

    const verifiedToken = await verifyToken(token, {
      secretKey,
    });

    return {
      userId: verifiedToken.sub, // User ID is in the 'sub' claim
      sessionId: verifiedToken.sid || null, // Session ID is in the 'sid' claim
    };
  } catch (error) {
    console.error('[Auth] Token verification failed:', error instanceof Error ? error.message : String(error));
    return {
      userId: null,
      sessionId: null,
    };
  }
}
