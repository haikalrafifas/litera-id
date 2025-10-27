import { useState, useEffect } from 'react';

// Custom hook to detect mobile view
const useIsMobileView = () => {
  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      // 640px is the typical threshold for mobile views in Tailwind
      setIsMobileView(window.innerWidth <= 768);
    };

    // Listen to window resize events
    window.addEventListener('resize', handleResize);

    // Call handler initially to set the state based on the current window size
    handleResize();

    // Clean up the event listener when the component is unmounted
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return isMobileView;
};

export default useIsMobileView;
