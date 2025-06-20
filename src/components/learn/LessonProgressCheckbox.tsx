
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface LessonProgressCheckboxProps {
  lessonId: string;
  lessonTitle: string;
}

const LessonProgressCheckbox = ({ lessonId, lessonTitle }: LessonProgressCheckboxProps) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: progress, isLoading } = useQuery({
    queryKey: ['lesson-progress', lessonId, user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('user_lesson_progress')
        .select('completed, completed_at')
        .eq('user_id', user.id)
        .eq('lesson_id', lessonId)
        .maybeSingle();
      
      if (error && error.code !== 'PGRST116') {
        throw new Error(error.message);
      }
      
      return data;
    },
    enabled: !!user && !!lessonId,
  });

  const updateProgressMutation = useMutation({
    mutationFn: async (completed: boolean) => {
      if (!user) throw new Error('User not authenticated');
      
      const updateData = {
        user_id: user.id,
        lesson_id: lessonId,
        completed,
        completed_at: completed ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      };

      if (progress) {
        // Update existing record
        const { error } = await supabase
          .from('user_lesson_progress')
          .update(updateData)
          .eq('user_id', user.id)
          .eq('lesson_id', lessonId);
        
        if (error) throw error;
      } else {
        // Insert new record
        const { error } = await supabase
          .from('user_lesson_progress')
          .insert(updateData);
        
        if (error) throw error;
      }
    },
    onSuccess: (_, completed) => {
      queryClient.invalidateQueries({ queryKey: ['lesson-progress', lessonId, user?.id] });
      toast.success(completed ? 'ทำเครื่องหมายเรียนจบแล้ว' : 'ยกเลิกการทำเครื่องหมาย');
    },
    onError: (error) => {
      console.error('Error updating lesson progress:', error);
      toast.error('เกิดข้อผิดพลาดในการบันทึกความคืบหน้า');
    },
  });

  const handleProgressChange = (checked: boolean) => {
    updateProgressMutation.mutate(checked);
  };

  if (!user) return null;

  return (
    <div className="flex items-center space-x-2 p-4 bg-gray-50 rounded-lg">
      <Checkbox
        id={`lesson-${lessonId}-progress`}
        checked={progress?.completed || false}
        onCheckedChange={handleProgressChange}
        disabled={isLoading || updateProgressMutation.isPending}
      />
      <label
        htmlFor={`lesson-${lessonId}-progress`}
        className={`text-sm font-medium leading-none cursor-pointer ${
          progress?.completed ? 'text-green-700' : 'text-gray-700'
        }`}
      >
        {progress?.completed ? 'เรียนจบบทนี้แล้ว' : 'ทำเครื่องหมายว่าเรียนจบแล้ว'}
      </label>
      {progress?.completed && progress.completed_at && (
        <span className="text-xs text-green-600 ml-2">
          (เรียนจบเมื่อ {new Date(progress.completed_at).toLocaleDateString('th-TH')})
        </span>
      )}
    </div>
  );
};

export default LessonProgressCheckbox;
