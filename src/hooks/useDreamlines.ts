import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface DreamlineDB {
  id: string;
  title: string;
  category: string;
  cost: number;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export interface Dreamline {
  id?: string;
  title: string;
  category: 'having' | 'being' | 'doing';
  cost: number;
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

  useEffect(() => {
    if (user) {
      fetchDreamlines();
      fetchSummary();
    }
  }, [user]);

  const fetchDreamlines = async () => {
    if (!user) return;

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
      }));
      
      setDreamlines(dreamlinesData);
    } catch (error: any) {
      console.error('Error fetching dreamlines:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถโหลดข้อมูลความฝันได้",
        variant: "destructive",
      });
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
      };
      setDreamlines(prev => [...prev, newDreamline]);
      await calculateTMI();
      
      toast({
        title: "เพิ่มความฝันสำเร็จ",
        description: "ข้อมูลความฝันของคุณถูกเพิ่มแล้ว",
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
    if (!user) return;

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
      };
      
      setDreamlines(prev => prev.map(item => 
        item.id === id ? updatedDreamline : item
      ));
      await calculateTMI();
    } catch (error: any) {
      console.error('Error updating dreamline:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถอัปเดตข้อมูลได้",
        variant: "destructive",
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
      await calculateTMI();
      
      toast({
        title: "ลบสำเร็จ",
        description: "รายการความฝันถูกลบแล้ว",
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

      await calculateTMI();
      
      toast({
        title: "อัปเดตสำเร็จ",
        description: "ค่าใช้จ่ายรายเดือนถูกอัปเดตแล้ว",
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
    if (!user) return;

    try {
      await calculateTMI();
      toast({
        title: "บันทึกสำเร็จ",
        description: "ข้อมูลทั้งหมดถูกบันทึกแล้ว",
      });
    } catch (error: any) {
      console.error('Error saving data:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถบันทึกข้อมูลได้",
        variant: "destructive",
      });
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
  };
};