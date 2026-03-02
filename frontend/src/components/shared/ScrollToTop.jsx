import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const ScrollToTop = () => {
  // Get the current location object
  const { pathname } = useLocation();

  // This effect runs every time the pathname changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]); // The effect depends on the pathname

  return null; // This component doesn't render any UI
};