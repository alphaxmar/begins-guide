import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useAuth } from '@/contexts/AuthContext';
import { useCourseAccess } from '@/hooks/useCourseAccess';
import { useVipStatus } from '@/hooks/useVipStatus';

interface Tool {
  id: number;
  name: string;
  description: string;
  link: string;
}

const tools: Tool[] = [
  {
    id: 1,
    name: "Begins.Guide AI ช่วยคิดไอเดีย",
    description: "เครื่องมือช่วยในการระดมความคิดและสร้างไอเดียธุรกิจใหม่ๆ",
    link: "https://chatgpt.com/g/g-685676541c10819186bff967858244a4-begins-guide-ai-chwy-khidai-ediiy"
  },
  {
    id: 2,
    name: "Begins.Guide Buyer Persona AI",
    description: "เครื่องมือวิเคราะห์และสร้าง Buyer Persona",
    link: "https://chatgpt.com/g/g-6877c7c8127481919f7b4e46dc13e774-begins-guide-buyer-persona-ai-tool"
  },
  {
    id: 3,
    name: "Begins.Guide The SaaS Blueprint Generator",
    description: "เครื่องมือสร้าง Blueprint สำหรับธุรกิจ SaaS",
    link: "https://chatgpt.com/g/g-6877cbc753588191befecfd691b7cca6-begins-guide-the-saas-blueprint-generator"
  },
  {
    id: 4,
    name: "Begins.Guide The 'Idea Validator'",
    description: "เครื่องมือตรวจสอบและประเมินไอเดียธุรกิจ",
    link: "https://chatgpt.com/g/g-6877d088cd0c8191b334b7701ec6b8d9-begins-guide-the-idea-validator"
  },
  {
    id: 5,
    name: "Begins Guide: The SaaS Metrics Oracle",
    description: "เครื่องมือวิเคราะห์และติดตามเมตริกสำหรับธุรกิจ SaaS",
    link: "https://chatgpt.com/g/g-6877d5d305f88191a5ddbbaa7c93b0ce-begins-guide-the-saas-metrics-oracle"
  }
];

interface ToolboxModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ToolboxModal({ isOpen, onClose }: ToolboxModalProps) {
  const { user } = useAuth();
  const { hasBookAccess, hasCourseAccess } = useCourseAccess();
  const { isVip } = useVipStatus();

  const canAccessTool = (toolId: number) => {
    if (isVip) return true;
    if (hasCourseAccess && toolId !== 3) return true;
    if (hasBookAccess && toolId === 1) return true;
    return false;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Toolbox - เครื่องมือช่วยสร้างธุรกิจ</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {tools.map((tool) => (
            <div key={tool.id} className="flex flex-col gap-2 p-4 border rounded-lg">
              <h3 className="text-lg font-semibold">{tool.name}</h3>
              <p className="text-sm text-gray-600">{tool.description}</p>
              <div className="mt-2">
                {canAccessTool(tool.id) ? (
                  <Button
                    onClick={() => window.open(tool.link, '_blank')}
                    className="w-full"
                  >
                    เปิดใช้งานเครื่องมือ
                  </Button>
                ) : (
                  <Button disabled className="w-full">
                    ต้องอัพเกรดเพื่อใช้งาน
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
