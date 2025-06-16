import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

// This component is no longer needed since we moved the layout directly to App.tsx
// But keeping it for backward compatibility
const Layout: React.FC<LayoutProps> = ({ children }) => {
  return <>{children}</>;
};

export default Layout;
