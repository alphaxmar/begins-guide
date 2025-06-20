
export const cleanupAuthState = () => {
  // ลบ localStorage ที่เกี่ยวข้องกับ auth
  const authKeys = Object.keys(localStorage).filter(key => 
    key.includes('supabase') || 
    key.includes('auth') ||
    key.includes('session')
  );
  
  authKeys.forEach(key => {
    localStorage.removeItem(key);
  });
  
  // Clear session storage
  const sessionKeys = Object.keys(sessionStorage).filter(key => 
    key.includes('supabase') || 
    key.includes('auth') ||
    key.includes('session')
  );
  
  sessionKeys.forEach(key => {
    sessionStorage.removeItem(key);
  });
};
