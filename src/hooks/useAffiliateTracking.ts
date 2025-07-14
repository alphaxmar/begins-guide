import { useEffect } from 'react';

/**
 * Hook for tracking affiliate referrals via URL parameters and cookies
 * Automatically detects ?ref= parameter and stores it in localStorage for 30 days
 */
export const useAffiliateTracking = () => {
  useEffect(() => {
    // Check URL for ref parameter
    const urlParams = new URLSearchParams(window.location.search);
    const refCode = urlParams.get('ref');

    if (refCode) {
      console.log(`🎯 Affiliate referral detected! Code: ${refCode}`);
      
      // Store affiliate code in localStorage with expiry
      const affiliateData = {
        code: refCode,
        timestamp: Date.now(),
        expiry: Date.now() + (30 * 24 * 60 * 60 * 1000) // 30 days
      };
      
      localStorage.setItem('affiliate_ref', JSON.stringify(affiliateData));
      
      // Clean URL to remove ref parameter
      const url = new URL(window.location.href);
      url.searchParams.delete('ref');
      window.history.replaceState({}, '', url.toString());
    }
  }, []);

  // Function to get current affiliate code if not expired
  const getAffiliateCode = (): string | null => {
    try {
      const stored = localStorage.getItem('affiliate_ref');
      if (!stored) return null;

      const affiliateData = JSON.parse(stored);
      
      // Check if expired
      if (Date.now() > affiliateData.expiry) {
        localStorage.removeItem('affiliate_ref');
        return null;
      }

      return affiliateData.code;
    } catch {
      // Remove corrupted data
      localStorage.removeItem('affiliate_ref');
      return null;
    }
  };

  return { getAffiliateCode };
};