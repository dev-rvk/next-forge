'use client';

import { UserProvider } from '@auth0/nextjs-auth0/client';
import type { ComponentProps } from 'react';

type AuthProviderProperties = ComponentProps<typeof UserProvider>;

export const AuthProvider = (properties: AuthProviderProperties) => {
  // Auth0's UserProvider doesn't have the same appearance/theme props as ClerkProvider.
  // UI customization is typically handled via Auth0's Universal Login page settings
  // or by building a custom login flow.
  // We'll pass through any relevant props if needed, but for now, it's simpler.
  return <UserProvider {...properties} />;
};
