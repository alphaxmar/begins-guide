import { useState } from 'react';
import jsPDF from 'jspdf';
import { useAuth } from '@/contexts/AuthContext';
import { DreamlineSummary, Dreamline } from '@/hooks/useDreamlines';
import { toast } from '@/hooks/use-toast';

// Thai font for PDF - using base64 encoded font data for Sarabun
const sarabunFontBase64 = "data:font/truetype;charset=utf-8;base64,"; // This would be the actual font data

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
      const margin = 20;
      const contentWidth = pageWidth - (margin * 2);
      
      // Set up fonts and styling
      pdf.setFont('helvetica', 'normal');
      
      let yPos = margin;
      
      // Header
      pdf.setFontSize(16);
      pdf.setTextColor(10, 34, 64); // Blueprint Blue
      pdf.text('begins.guide', margin, yPos);
      
      pdf.setFontSize(10);
      pdf.setTextColor(128, 128, 128);
      const currentDate = new Date().toLocaleDateString('en-GB');
      pdf.text(`Downloaded: ${currentDate}`, pageWidth - 60, yPos);
      
      yPos += 20;
      
      // Title
      pdf.setFontSize(20);
      pdf.setTextColor(10, 34, 64);
      pdf.text('Your Life Blueprint', margin, yPos);
      
      yPos += 10;
      
      // User name
      const userName = user.email?.split('@')[0] || 'User';
      pdf.setFontSize(12);
      pdf.setTextColor(68, 68, 68);
      pdf.text(`For: ${userName}`, margin, yPos);
      
      yPos += 15;
      
      // Line separator
      pdf.setDrawColor(10, 34, 64);
      pdf.setLineWidth(0.5);
      pdf.line(margin, yPos, pageWidth - margin, yPos);
      
      yPos += 20;
      
      // Categories data
      const havingItems = dreamlines.filter(d => d.category === 'having');
      const beingItems = dreamlines.filter(d => d.category === 'being');
      const doingItems = dreamlines.filter(d => d.category === 'doing');
      
      // Three columns layout
      const colWidth = contentWidth / 3;
      const col1X = margin;
      const col2X = margin + colWidth;
      const col3X = margin + (colWidth * 2);
      
      // Column headers
      pdf.setFontSize(14);
      pdf.setTextColor(10, 34, 64);
      pdf.text('Things to Have', col1X, yPos);
      pdf.text('Who to Be', col2X, yPos);
      pdf.text('What to Do', col3X, yPos);
      
      yPos += 10;
      
      // Draw separator lines under headers
      pdf.setDrawColor(200, 200, 200);
      pdf.setLineWidth(0.3);
      pdf.line(col1X, yPos, col1X + colWidth - 10, yPos);
      pdf.line(col2X, yPos, col2X + colWidth - 10, yPos);
      pdf.line(col3X, yPos, col3X + colWidth - 10, yPos);
      
      yPos += 10;
      
      // Content items
      pdf.setFontSize(9);
      pdf.setTextColor(68, 68, 68);
      
      const maxItems = Math.max(havingItems.length, beingItems.length, doingItems.length);
      
      for (let i = 0; i < maxItems; i++) {
        const itemYPos = yPos + (i * 12);
        
        // Check if we need a new page
        if (itemYPos > pageHeight - 80) {
          pdf.addPage();
          yPos = margin + 20;
          break;
        }
        
        if (havingItems[i]) {
          const item = havingItems[i];
          const text = `• ${item.title}`;
          const wrappedText = pdf.splitTextToSize(text, colWidth - 10);
          pdf.text(wrappedText, col1X, itemYPos);
          pdf.text(`฿${item.cost.toLocaleString()}`, col1X, itemYPos + 6);
        }
        
        if (beingItems[i]) {
          const item = beingItems[i];
          const text = `• ${item.title}`;
          const wrappedText = pdf.splitTextToSize(text, colWidth - 10);
          pdf.text(wrappedText, col2X, itemYPos);
          pdf.text(`฿${item.cost.toLocaleString()}`, col2X, itemYPos + 6);
        }
        
        if (doingItems[i]) {
          const item = doingItems[i];
          const text = `• ${item.title}`;
          const wrappedText = pdf.splitTextToSize(text, colWidth - 10);
          pdf.text(wrappedText, col3X, itemYPos);
          pdf.text(`฿${item.cost.toLocaleString()}`, col3X, itemYPos + 6);
        }
      }
      
      // Column totals
      yPos += (maxItems * 12) + 20;
      
      pdf.setDrawColor(10, 34, 64);
      pdf.setLineWidth(0.5);
      pdf.line(margin, yPos, pageWidth - margin, yPos);
      
      yPos += 15;
      
      pdf.setFontSize(12);
      pdf.setTextColor(10, 34, 64);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`Total: ฿${summary.total_having.toLocaleString()}`, col1X, yPos);
      pdf.text(`Total: ฿${summary.total_being.toLocaleString()}`, col2X, yPos);
      pdf.text(`Total: ฿${summary.total_doing.toLocaleString()}`, col3X, yPos);
      
      yPos += 30;
      
      // Summary section
      pdf.setFont('helvetica', 'normal');
      
      // TMI Display
      pdf.setFontSize(16);
      pdf.setTextColor(255, 215, 7); // Gold color
      pdf.text('Your Freedom Number', margin, yPos);
      
      yPos += 20;
      
      pdf.setFontSize(28);
      pdf.setTextColor(10, 34, 64);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`฿${summary.target_monthly_income.toLocaleString()}`, margin, yPos);
      
      yPos += 10;
      
      pdf.setFontSize(12);
      pdf.setTextColor(68, 68, 68);
      pdf.setFont('helvetica', 'normal');
      pdf.text('per month', margin, yPos);
      
      yPos += 20;
      
      // Calculation breakdown
      pdf.setFontSize(10);
      const totalDreamCost = summary.total_having + summary.total_being + summary.total_doing;
      const calculationText = `Calculation: (฿${totalDreamCost.toLocaleString()} ÷ 12) + ฿${summary.monthly_basic_expenses.toLocaleString()} = ฿${summary.target_monthly_income.toLocaleString()}`;
      const wrappedCalculation = pdf.splitTextToSize(calculationText, contentWidth);
      pdf.text(wrappedCalculation, margin, yPos);
      
      // Footer
      yPos = pageHeight - 60;
      
      pdf.setDrawColor(10, 34, 64);
      pdf.setLineWidth(0.5);
      pdf.line(margin, yPos, pageWidth - margin, yPos);
      
      yPos += 15;
      
      pdf.setFontSize(11);
      pdf.setTextColor(68, 68, 68);
      const footerText1 = 'This is your "target". The next step is to create a "roadmap" to get you there.';
      const wrappedFooter1 = pdf.splitTextToSize(footerText1, contentWidth);
      pdf.text(wrappedFooter1, margin, yPos);
      
      yPos += 10;
      
      pdf.setFontSize(10);
      pdf.setTextColor(10, 34, 64);
      const footerText2 = 'Discover the complete blueprint in "The Freedom Engine" book at: www.begins.guide/book';
      const wrappedFooter2 = pdf.splitTextToSize(footerText2, contentWidth);
      pdf.text(wrappedFooter2, margin, yPos);
      
      // Save the PDF
      const fileName = `Life-Blueprint-${userName}-${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);
      
      toast({
        title: "Download Successful",
        description: "Your Life Blueprint PDF has been downloaded",
      });
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Error",
        description: "Could not generate PDF file",
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