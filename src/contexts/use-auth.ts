'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { decodeToken } from '@/utilities/client/jwt';

/**
 * Custom hook to detect auth token in localStorage and handle token validity and removal
 */
export const useAuthToken = () => {
  const router = useRouter();

  useEffect(() => {
    // Function to handle token validity and logout
    const handleTokenChange = () => {
      const token = localStorage.getItem('token');

      // If token is removed, log out and redirect
      if (!token) {
        logout();
        return;
      }

      // Check if token is in valid JWT format
      const decodedToken = decodeToken(token);
      if (!decodedToken) {
        logout();
        return;
      }

      // Optionally, you can check the expiration of the token here
      if (isTokenExpired(decodedToken)) {
        logout();
      }
    };

    // Add event listener for storage changes (token removal or change)
    window.addEventListener('storage', handleTokenChange);

    // Check on initial load
    handleTokenChange();

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('storage', handleTokenChange);
    };
  }, [router]);

  // Handle logout: clear localStorage and redirect to login
  const logout = () => {
    localStorage.removeItem('token');
    router.push('/');
  };

  // Check if token is expired based on the `exp` claim
  const isTokenExpired = (decodedToken: any) => {
    if (!decodedToken?.exp) return false; // If no expiration field is found, assume not expired
    const expirationDate = decodedToken.exp * 1000; // JWT exp is in seconds, convert to milliseconds
    const currentDate = Date.now();
    return expirationDate < currentDate;
  };
};
