// components/SignUp.tsx
import React from 'react';

export const SignUp = () => {
  // Auth0 Universal Login typically handles both sign-in and sign-up.
  // You can customize the login screen to show a sign-up tab or link.
  // Alternatively, you can pass a screen_hint=signup parameter.
  return (
    <a href="/api/auth/login?screen_hint=signup">
      Sign Up
    </a>
  );
};
