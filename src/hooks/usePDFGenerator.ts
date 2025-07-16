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
      
      // Set up fonts and styling - Using standard font for compatibility
      pdf.setFont('helvetica', 'normal');
      
      let yPos = margin;
      const userName = user.email?.split('@')[0] || 'User';
      const currentDate = new Date().toLocaleDateString('en-GB');
      
      // Header Section
      pdf.setFontSize(18);
      pdf.setTextColor(10, 34, 64); // Blueprint Blue
      pdf.setFont('helvetica', 'bold');
      pdf.text('begins.guide', margin, yPos);
      
      // Right side header info
      pdf.setFontSize(10);
      pdf.setTextColor(68, 68, 68);
      pdf.setFont('helvetica', 'normal');
      const headerRight = `Life Blueprint for: ${userName}`;
      pdf.text(headerRight, pageWidth - margin - pdf.getStringUnitWidth(headerRight) * 10 * 0.352778, yPos - 5);
      pdf.text(`Created: ${currentDate}`, pageWidth - margin - pdf.getStringUnitWidth(`Created: ${currentDate}`) * 10 * 0.352778, yPos + 5);
      
      yPos += 25;
      
      // Main Title
      pdf.setFontSize(24);
      pdf.setTextColor(10, 34, 64);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Your Life Blueprint', margin, yPos);
      
      yPos += 20;
      
      // Categories data
      const havingItems = dreamlines.filter(d => d.category === 'having');
      const beingItems = dreamlines.filter(d => d.category === 'being');
      const doingItems = dreamlines.filter(d => d.category === 'doing');
      
      // Helper function to draw table section
      const drawTableSection = (title: string, items: Dreamline[], startY: number, total: number): number => {
        let currentY = startY;
        
        // Section title
        pdf.setFontSize(16);
        pdf.setTextColor(10, 34, 64);
        pdf.setFont('helvetica', 'bold');
        pdf.text(title, margin, currentY);
        currentY += 15;
        
        // Table headers
        pdf.setFontSize(11);
        pdf.setTextColor(68, 68, 68);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Item', margin, currentY);
        pdf.text('Cost (Baht)', pageWidth - margin - 40, currentY);
        
        // Table header underline
        pdf.setDrawColor(10, 34, 64);
        pdf.setLineWidth(0.5);
        pdf.line(margin, currentY + 2, pageWidth - margin, currentY + 2);
        currentY += 10;
        
        // Table content
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(10);
        
        items.forEach((item, index) => {
          // Item name
          const itemText = pdf.splitTextToSize(item.title, contentWidth - 60);
          pdf.text(itemText, margin, currentY);
          
          // Cost (right aligned)
          const costText = `${item.cost.toLocaleString()}`;
          pdf.text(costText, pageWidth - margin - pdf.getStringUnitWidth(costText) * 10 * 0.352778, currentY);
          
          currentY += Math.max(itemText.length * 5, 8);
        });
        
        // Total row
        currentY += 5;
        pdf.setDrawColor(200, 200, 200);
        pdf.setLineWidth(0.3);
        pdf.line(margin, currentY, pageWidth - margin, currentY);
        currentY += 8;
        
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(11);
        pdf.setTextColor(10, 34, 64);
        pdf.text('Total:', margin, currentY);
        const totalText = `${total.toLocaleString()}`;
        pdf.text(totalText, pageWidth - margin - pdf.getStringUnitWidth(totalText) * 11 * 0.352778, currentY);
        
        return currentY + 20;
      };
      
      // Draw each section
      yPos = drawTableSection('Things to Have (การมี)', havingItems, yPos, summary.total_having);
      yPos = drawTableSection('Who to Be (การเป็น)', beingItems, yPos, summary.total_being);
      yPos = drawTableSection('What to Do (การทำ)', doingItems, yPos, summary.total_doing);
      
      // Check if we need a new page for the highlight section
      if (yPos > pageHeight - 120) {
        pdf.addPage();
        yPos = margin + 20;
      }
      
      // Highlight Section - Freedom Number
      yPos += 10;
      
      // Blue background rectangle
      pdf.setFillColor(10, 34, 64); // Blueprint Blue
      pdf.rect(margin, yPos - 10, contentWidth, 60, 'F');
      
      // Freedom Number title
      pdf.setFontSize(16);
      pdf.setTextColor(255, 255, 255); // White text
      pdf.setFont('helvetica', 'bold');
      pdf.text('Your Freedom Number', margin + 10, yPos + 5);
      
      // TMI Amount
      pdf.setFontSize(32);
      pdf.setTextColor(255, 215, 7); // Gold color
      pdf.setFont('helvetica', 'bold');
      const tmiText = `${summary.target_monthly_income.toLocaleString()}`;
      pdf.text(tmiText, margin + 10, yPos + 25);
      
      // Per month text
      pdf.setFontSize(12);
      pdf.setTextColor(255, 255, 255);
      pdf.setFont('helvetica', 'normal');
      pdf.text('per month', margin + 10, yPos + 35);
      
      // Note
      pdf.setFontSize(9);
      pdf.setTextColor(200, 200, 200);
      pdf.text('*This number may change based on future data', margin + 10, yPos + 45);
      
      yPos += 80;
      
      // Footer Section
      yPos = Math.max(yPos, pageHeight - 40);
      
      pdf.setDrawColor(10, 34, 64);
      pdf.setLineWidth(0.5);
      pdf.line(margin, yPos - 10, pageWidth - margin, yPos - 10);
      
      pdf.setFontSize(11);
      pdf.setTextColor(68, 68, 68);
      pdf.setFont('helvetica', 'normal');
      const footerText1 = 'This is your "target". The next step is to create a "roadmap" to get you there.';
      pdf.text(footerText1, margin, yPos);
      
      pdf.setFontSize(11);
      pdf.setTextColor(10, 34, 64);
      pdf.setFont('helvetica', 'bold');
      const footerText2 = 'Discover the complete blueprint in "The Freedom Engine" book at: www.begins.guide/book';
      pdf.text(footerText2, margin, yPos + 10);
      
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