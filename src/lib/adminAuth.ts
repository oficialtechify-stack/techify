import { useState, useEffect } from 'react';

export function checkIsAdmin(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('techify_admin') === 'true';
}

export function setAdminAuth(isAuth: boolean) {
  if (typeof window === 'undefined') return;
  if (isAuth) {
    localStorage.setItem('techify_admin', 'true');
  } else {
    localStorage.removeItem('techify_admin');
  }
  window.dispatchEvent(new Event('techify_admin_change'));
}

export function validateAdminPassword(password: string): boolean {
  const cleanPass = password.trim().toLowerCase();
  return cleanPass === 'techify' || cleanPass === '1234' || cleanPass === 'admin' || cleanPass === 'techify2026';
}

export function useAdminAuth() {
  const [isAdmin, setIsAdmin] = useState<boolean>(checkIsAdmin);

  useEffect(() => {
    const handleAdminChange = () => {
      setIsAdmin(checkIsAdmin());
    };
    window.addEventListener('techify_admin_change', handleAdminChange);
    window.addEventListener('storage', handleAdminChange);
    return () => {
      window.removeEventListener('techify_admin_change', handleAdminChange);
      window.removeEventListener('storage', handleAdminChange);
    };
  }, []);

  return {
    isAdmin,
    login: (pass: string) => {
      if (validateAdminPassword(pass)) {
        setAdminAuth(true);
        return true;
      }
      return false;
    },
    logout: () => setAdminAuth(false)
  };
}
