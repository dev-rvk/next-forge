import 'server-only';
import { getSession, handleAuth, handleCallback, handleLogin, handleLogout, handleProfile, Session } from '@auth0/nextjs-auth0';
import { NextApiRequest, NextApiResponse } from 'next';

// Re-export Auth0 handlers
export { handleAuth, handleCallback, handleLogin, handleLogout, handleProfile };

// currentUser function to mimic Clerk's currentUser()
// It fetches the session and returns the user object.
export const currentUser = async (): Promise<Session['user'] | null> => {
  const session = await getSession();
  if (session && session.user) {
    return session.user;
  }
  return null;
};

// auth function to provide authentication status and user details
// This is a simplified version. orgId handling will need to be revisited
// based on how Auth0 organizations are implemented in the project.
export const auth = async () => {
  const session = await getSession();

  if (!session || !session.user) {
    return {
      userId: null,
      orgId: null, // Placeholder for orgId
      user: null,
      // redirectToSignIn should redirect to the Auth0 login page
      // The actual redirection is usually handled by middleware or by returning a redirect response.
      // For server components, you might trigger navigation or use Next.js redirects.
      // This function's signature might need to adapt to how it's called.
      // For now, let's make it a function that could be called to trigger a redirect.
      redirectToSignIn: (res?: NextApiResponse) => {
        if (res) {
          // This is more for API routes. For pages/layouts, middleware handles it.
          res.writeHead(302, { Location: '/api/auth/login' });
          res.end();
        } else {
          // In server components, actual redirection is tricky.
          // Middleware should handle protecting routes.
          // This function might be more conceptual or used differently than Clerk's.
          // Consider if this is truly needed or if middleware covers it.
          // For now, logging that redirection is needed.
          console.log('Redirect to sign in initiated from auth()');
          // In a real scenario, you might throw an error that a boundary catches,
          // or use the redirect() function from next/navigation in Server Components.
          // However, that would require this function to be async and called in a context
          // where that's allowed.
        }
        return null; // Or throw new Error('Redirecting to login');
      },
    };
  }

  return {
    userId: session.user.sub, // 'sub' is typically the user ID in Auth0
    orgId: session.user.org_id || null, // Auth0 stores org IDs in user profile if using Organizations
    user: session.user,
    redirectToSignIn: () => null, // User is signed in, no need to redirect
  };
};

EOF
