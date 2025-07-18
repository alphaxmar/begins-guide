import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useVipStatus } from '@/hooks/useVipStatus';
import { useCourseAccess } from '@/hooks/useCourseAccess';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isVip } = useVipStatus();
  const { hasCourseAccess } = useCourseAccess();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    // Determine the appropriate dashboard based on membership level
    if (isVip) {
      // Circle Member (VIP)
      navigate('/circle-member-dashboard');
    } else if (hasCourseAccess) {
      // Pro Member
      navigate('/pro-member-dashboard');
    } else {
      // Reader level or new user
      navigate('/reader-dashboard');
    }
  }, [user, isVip, hasCourseAccess, navigate]);

  // Show loading while redirecting
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-gray-600">กำลังโหลด Dashboard ของคุณ...</p>
      </div>
    </div>
  );
};

export default Dashboard;