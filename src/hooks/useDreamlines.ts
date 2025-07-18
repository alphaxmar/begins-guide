import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface DreamlineDB {
  id: string;
  title: string;
  category: string;
  cost: number;
  time_period?: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export interface Dreamline {
  id?: string;
  title: string;
  category: 'having' | 'being' | 'doing';
  cost: number;
  time_period?: '1_year' | '3_years' | '5_years' | '10_years' | 'lifetime';
}

export interface DreamlineSummary {
  total_having: number;
  total_being: number;
  total_doing: number;
  monthly_basic_expenses: number;
  target_monthly_income: number;
}

export const useDreamlines = () => {
  const { user } = useAuth();
  const [dreamlines, setDreamlines] = useState<Dreamline[]>([]);
  const [summary, setSummary] = useState<DreamlineSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastFetch, setLastFetch] = useState<number>(0);
  const [pendingUpdates, setPendingUpdates] = useState<Set<string>>(new Set());
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Rate limiting: ไม่ให้ fetch บ่อยกว่า 2 วินาที
  const RATE_LIMIT_MS = 2000;

  // ตรวจสอบสถานะการเชื่อมต่อ
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (user && isOnline) {
      const now = Date.now();
      if (now - lastFetch > RATE_LIMIT_MS) {
        fetchDreamlines();
        fetchSummary();
        setLastFetch(now);
      }
    }
  }, [user, isOnline]);

  const fetchDreamlines = async () => {
    if (!user || loading) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('dreamlines')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (error) throw error;
      
      const dreamlinesData = (data as DreamlineDB[] || []).map(item => ({
        id: item.id,
        title: item.title,
        category: item.category as 'having' | 'being' | 'doing',
        cost: item.cost,
        time_period: item.time_period as '1_year' | '3_years' | '5_years' | '10_years' | 'lifetime' | undefined,
      }));
      
      setDreamlines(dreamlinesData);
    } catch (error: any) {
      console.error('Error fetching dreamlines:', error);
      // ลด frequency ของ toast เมื่อเกิด error
      if (error.message !== 'Failed to fetch') {
        toast({
          title: "เกิดข้อผิดพลาด",
          description: "ไม่สามารถโหลดข้อมูลความฝันได้",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchSummary = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_dreamline_summaries')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      setSummary(data || {
        total_having: 0,
        total_being: 0,
        total_doing: 0,
        monthly_basic_expenses: 0,
        target_monthly_income: 0,
      });
    } catch (error: any) {
      console.error('Error fetching summary:', error);
    }
  };

  const addDreamline = async (dreamline: Omit<Dreamline, 'id'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('dreamlines')
        .insert([{ ...dreamline, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;

      const newDreamline = {
        id: (data as DreamlineDB).id,
        title: (data as DreamlineDB).title,
        category: (data as DreamlineDB).category as 'having' | 'being' | 'doing',
        cost: (data as DreamlineDB).cost,
        time_period: (data as DreamlineDB).time_period as '1_year' | '3_years' | '5_years' | '10_years' | 'lifetime' | undefined,
      };
      setDreamlines(prev => [...prev, newDreamline]);
      
      // ไม่เรียก calculateTMI ทันที ให้ user กดปุ่มบันทึกแทน
      
      toast({
        title: "เพิ่มความฝันสำเร็จ",
        description: "ข้อมูลความฝันของคุณถูกเพิ่มแล้ว กดปุ่มบันทึกเพื่อคำนวณ TMI",
      });
    } catch (error: any) {
      console.error('Error adding dreamline:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถเพิ่มความฝันได้",
        variant: "destructive",
      });
    }
  };

  const updateDreamline = async (id: string, updates: Partial<Dreamline>) => {
    if (!user || pendingUpdates.has(id)) return;

    // เพิ่ม id เข้าไปใน pending updates เพื่อป้องกันการเรียกซ้ำ
    setPendingUpdates(prev => new Set([...prev, id]));

    try {
      const { data, error } = await supabase
        .from('dreamlines')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      const updatedDreamline = {
        id: (data as DreamlineDB).id,
        title: (data as DreamlineDB).title,
        category: (data as DreamlineDB).category as 'having' | 'being' | 'doing',
        cost: (data as DreamlineDB).cost,
        time_period: (data as DreamlineDB).time_period as '1_year' | '3_years' | '5_years' | '10_years' | 'lifetime' | undefined,
      };
      
      setDreamlines(prev => prev.map(item => 
        item.id === id ? updatedDreamline : item
      ));
      
      // ไม่เรียก calculateTMI ทันที ให้ user กดปุ่มบันทึกแทน
    } catch (error: any) {
      console.error('Error updating dreamline:', error);
      // ลด frequency ของ toast เมื่อเกิด error
      if (error.message !== 'Failed to fetch') {
        toast({
          title: "เกิดข้อผิดพลาด",
          description: "ไม่สามารถอัปเดตข้อมูลได้",
          variant: "destructive",
        });
      }
    } finally {
      // ลบ id ออกจาก pending updates
      setPendingUpdates(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const deleteDreamline = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('dreamlines')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setDreamlines(prev => prev.filter(item => item.id !== id));
      
      // ไม่เรียก calculateTMI ทันที ให้ user กดปุ่มบันทึกแทน
      
      toast({
        title: "ลบสำเร็จ",
        description: "รายการความฝันถูกลบแล้ว กดปุ่มบันทึกเพื่อคำนวณ TMI ใหม่",
      });
    } catch (error: any) {
      console.error('Error deleting dreamline:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถลบรายการได้",
        variant: "destructive",
      });
    }
  };

  const updateMonthlyExpenses = async (monthlyExpenses: number) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_dreamline_summaries')
        .upsert({
          user_id: user.id,
          monthly_basic_expenses: monthlyExpenses || 0,
          total_having: summary?.total_having || 0,
          total_being: summary?.total_being || 0,
          total_doing: summary?.total_doing || 0,
          target_monthly_income: 0, // Will be recalculated
        }, {
          onConflict: 'user_id'
        });

      if (error) throw error;

      // ไม่เรียก calculateTMI ทันที ให้ user กดปุ่มบันทึกแทน
      
      toast({
        title: "อัปเดตสำเร็จ",
        description: "ค่าใช้จ่ายรายเดือนถูกอัปเดตแล้ว กดปุ่มบันทึกเพื่อคำนวณ TMI",
      });
    } catch (error: any) {
      console.error('Error updating monthly expenses:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถอัปเดตค่าใช้จ่ายได้",
        variant: "destructive",
      });
    }
  };

  const calculateTMI = async () => {
    if (!user) return;

    try {
      const { error } = await supabase.rpc('calculate_and_update_tmi', {
        p_user_id: user.id
      });

      if (error) throw error;

      await fetchSummary();
    } catch (error: any) {
      console.error('Error calculating TMI:', error);
    }
  };

  const saveAllData = async () => {
    if (!user || loading) return; // ป้องกันการเรียกซ้ำ

    setLoading(true);
    try {
      // เพิ่ม retry mechanism
      let retryCount = 0;
      const maxRetries = 3;
      
      while (retryCount < maxRetries) {
        try {
          await calculateTMI();
          break; // สำเร็จแล้วออกจาก loop
        } catch (error: any) {
          retryCount++;
          if (retryCount >= maxRetries) {
            throw error; // หมดจำนวน retry แล้ว
          }
          // รอสักครู่ก่อน retry
          await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
        }
      }
      
      toast({
        title: "บันทึกสำเร็จ",
        description: "ข้อมูลทั้งหมดถูกบันทึกและคำนวณ TMI แล้ว",
      });
    } catch (error: any) {
      console.error('Error saving data:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: error.message?.includes('Failed to fetch') 
          ? "การเชื่อมต่อไม่เสถียร กรุณาลองใหม่อีกครั้ง"
          : "ไม่สามารถบันทึกข้อมูลได้",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    dreamlines,
    summary,
    loading,
    addDreamline,
    updateDreamline,
    deleteDreamline,
    updateMonthlyExpenses,
    saveAllData,
    calculateTMI,
    isOnline,
    pendingUpdates: pendingUpdates.size > 0,
  };
};