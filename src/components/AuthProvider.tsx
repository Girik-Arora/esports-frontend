'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    // If there is no token, and they are NOT on the login page, kick them out!
    if (!token && pathname !== '/login') {
      router.push('/login');
    } else {
      setIsAuthenticated(true);
    }
  }, [pathname, router]);

  // Don't render the app until we verify their status to prevent UI flickering
  if (!isAuthenticated && pathname !== '/login') return null; 

  return <>{children}</>;
}