import { useState } from 'react';
import jsPDF from 'jspdf';
import { useAuth } from '@/contexts/AuthContext';
import { DreamlineSummary, Dreamline } from '@/hooks/useDreamlines';
import { toast } from '@/hooks/use-toast';

export const usePDFGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { user } = useAuth();

  const generatePDF = async (dreamlines: Dreamline[], summary: DreamlineSummary | null) => {
    if (!user || !summary) {
      toast({
        title: "ไม่สามารถสร้าง PDF ได้",
        description: "กรุณาล็อกอินและตรวจสอบข้อมูล",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      // Set up fonts and styling
      pdf.setFont('helvetica', 'normal');
      
      // Header
      pdf.setFontSize(16);
      pdf.setTextColor(10, 34, 64); // Blueprint Blue
      pdf.text('begins.guide', 20, 25);
      
      pdf.setFontSize(10);
      pdf.setTextColor(128, 128, 128);
      const currentDate = new Date().toLocaleDateString('th-TH');
      pdf.text(`วันที่ดาวน์โหลด: ${currentDate}`, pageWidth - 60, 25);
      
      // Title
      pdf.setFontSize(24);
      pdf.setTextColor(10, 34, 64);
      pdf.text('พิมพ์เขียวชีวิตของคุณ', 20, 45);
      
      pdf.setFontSize(16);
      pdf.text('(Your Life Blueprint)', 20, 55);
      
      // User name
      const userName = user.email?.split('@')[0] || 'ผู้ใช้';
      pdf.setFontSize(14);
      pdf.setTextColor(68, 68, 68);
      pdf.text(`สำหรับ: ${userName}`, 20, 70);
      
      // Line separator
      pdf.setDrawColor(10, 34, 64);
      pdf.setLineWidth(0.5);
      pdf.line(20, 80, pageWidth - 20, 80);
      
      // Three columns layout
      const colWidth = (pageWidth - 60) / 3;
      let yPos = 95;
      
      // Column headers
      pdf.setFontSize(14);
      pdf.setTextColor(10, 34, 64);
      pdf.text('สิ่งที่อยากมี (Having)', 20, yPos);
      pdf.text('สิ่งที่อยากเป็น (Being)', 20 + colWidth, yPos);
      pdf.text('สิ่งที่อยากทำ (Doing)', 20 + colWidth * 2, yPos);
      
      yPos += 10;
      
      // Categories data
      const havingItems = dreamlines.filter(d => d.category === 'having');
      const beingItems = dreamlines.filter(d => d.category === 'being');
      const doingItems = dreamlines.filter(d => d.category === 'doing');
      
      const maxItems = Math.max(havingItems.length, beingItems.length, doingItems.length);
      
      pdf.setFontSize(10);
      pdf.setTextColor(68, 68, 68);
      
      for (let i = 0; i < maxItems; i++) {
        const currentY = yPos + (i * 8);
        
        // Check if we need a new page
        if (currentY > pageHeight - 50) {
          pdf.addPage();
          yPos = 30;
          break;
        }
        
        if (havingItems[i]) {
          const item = havingItems[i];
          pdf.text(`• ${item.title}`, 20, currentY);
          pdf.text(`฿${item.cost.toLocaleString()}`, 20, currentY + 4);
        }
        
        if (beingItems[i]) {
          const item = beingItems[i];
          pdf.text(`• ${item.title}`, 20 + colWidth, currentY);
          pdf.text(`฿${item.cost.toLocaleString()}`, 20 + colWidth, currentY + 4);
        }
        
        if (doingItems[i]) {
          const item = doingItems[i];
          pdf.text(`• ${item.title}`, 20 + colWidth * 2, currentY);
          pdf.text(`฿${item.cost.toLocaleString()}`, 20 + colWidth * 2, currentY + 4);
        }
      }
      
      // Column totals
      yPos += (maxItems * 8) + 15;
      pdf.setDrawColor(200, 200, 200);
      pdf.line(20, yPos, pageWidth - 20, yPos);
      
      yPos += 10;
      pdf.setFontSize(12);
      pdf.setTextColor(10, 34, 64);
      pdf.text(`รวม: ฿${summary.total_having.toLocaleString()}`, 20, yPos);
      pdf.text(`รวม: ฿${summary.total_being.toLocaleString()}`, 20 + colWidth, yPos);
      pdf.text(`รวม: ฿${summary.total_doing.toLocaleString()}`, 20 + colWidth * 2, yPos);
      
      // Summary section
      yPos += 30;
      
      // TMI Display
      pdf.setFontSize(18);
      pdf.setTextColor(255, 215, 7); // Gold color
      pdf.text('ตัวเลขแห่งอิสรภาพของคุณ (Your Freedom Number)', 20, yPos);
      
      yPos += 15;
      pdf.setFontSize(32);
      pdf.setTextColor(10, 34, 64);
      pdf.text(`฿${summary.target_monthly_income.toLocaleString()}`, 20, yPos);
      
      yPos += 10;
      pdf.setFontSize(12);
      pdf.setTextColor(68, 68, 68);
      pdf.text('ต่อเดือน', 20, yPos);
      
      // Calculation breakdown
      yPos += 20;
      pdf.setFontSize(10);
      const totalDreamCost = summary.total_having + summary.total_being + summary.total_doing;
      pdf.text(`การคำนวณ: (฿${totalDreamCost.toLocaleString()} ÷ 12) + ฿${summary.monthly_basic_expenses.toLocaleString()} = ฿${summary.target_monthly_income.toLocaleString()}`, 20, yPos);
      
      // Footer
      yPos = pageHeight - 40;
      pdf.setDrawColor(10, 34, 64);
      pdf.line(20, yPos, pageWidth - 20, yPos);
      
      yPos += 10;
      pdf.setFontSize(12);
      pdf.setTextColor(68, 68, 68);
      pdf.text('นี่คือ "เป้าหมาย" ของคุณ ขั้นตอนต่อไปคือการสร้าง "แผนที่" ที่จะพาคุณไปให้ถึง', 20, yPos);
      
      yPos += 8;
      pdf.setFontSize(10);
      pdf.setTextColor(10, 34, 64);
      pdf.text('ค้นพบพิมพ์เขียวฉบับสมบูรณ์ในหนังสือ "The Freedom Engine" ได้ที่: www.begins.guide/book', 20, yPos);
      
      // Save the PDF
      const fileName = `พิมพ์เขียวชีวิต-${userName}-${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);
      
      toast({
        title: "ดาวน์โหลดสำเร็จ",
        description: "ไฟล์ PDF พิมพ์เขียวของคุณถูกดาวน์โหลดแล้ว",
      });
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถสร้างไฟล์ PDF ได้",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generatePDF,
    isGenerating,
  };
};