import { withMiddlewareAuthRequired } from '@repo/auth/middleware';
import {
  noseconeMiddleware,
  noseconeOptions,
  noseconeOptionsWithToolbar,
} from '@repo/security/middleware';
import type { NextMiddleware } from 'next/server';
import { env } from './env';

const securityHeaders = env.FLAGS_SECRET
  ? noseconeMiddleware(noseconeOptionsWithToolbar)
  : noseconeMiddleware(noseconeOptions);

// authMiddleware is now withMiddlewareAuthRequired, so we apply it directly
// and then chain the securityHeaders middleware.
// The order of execution will be:
// 1. withMiddlewareAuthRequired (handles authentication)
// 2. securityHeaders (handles security headers)
// Note: We might need to adjust this if securityHeaders needs to run on unauthenticated routes.
// For now, assuming security headers should apply after auth.
export default withMiddlewareAuthRequired(
  securityHeaders() as NextMiddleware
);

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
    // Ensure Auth0 routes are not processed by this middleware if they are not already excluded
    // However, the default Auth0 routes are usually /api/auth/[...auth0], which should be covered by /(api|trpc)(.*)
  ],
};
